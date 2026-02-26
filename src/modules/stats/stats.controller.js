const Customer = require('../customer/customer.model');
const Employee = require('../employee/employee.model');
const Sale = require('../sale/sale.model');
const Salary = require('../salary/salary.model');
const ApiResponse = require('../../utils/apiResponse');

class StatsController {
    static async getDashboardStats(req, res, next) {
        try {
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

            const [
                customerCount,
                employeeCount,
                totalSalesAgg,
                totalSalesMonthAgg,
                totalTreesMonthAgg,
                lastSixMonthsAgg,
                performanceAgg
            ] = await Promise.all([
                Customer.countDocuments(),
                Employee.countDocuments(),
                // 1. Total Sales All-Time
                Sale.aggregate([
                    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
                ]),
                // 2. Gross Sales This Month
                Sale.aggregate([
                    { $match: { saleDate: { $gte: firstDayOfMonth } } },
                    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
                ]),
                // 3. Total Trees This Month
                Sale.aggregate([
                    { $match: { saleDate: { $gte: firstDayOfMonth } } },
                    {
                        $addFields: {
                            saleTrees: { $ifNull: ["$totalTrees", { $sum: { $ifNull: ["$treesHarvested", []] } }] }
                        }
                    },
                    { $group: { _id: null, total: { $sum: "$saleTrees" } } }
                ]),
                // 4. Last 6 Months Sales Chart
                Sale.aggregate([
                    { $match: { saleDate: { $gte: sixMonthsAgo } } },
                    {
                        $addFields: {
                            saleTrees: { $ifNull: ["$totalTrees", { $sum: { $ifNull: ["$treesHarvested", []] } }] }
                        }
                    },
                    {
                        $group: {
                            _id: { year: { $year: "$saleDate" }, month: { $month: "$saleDate" } },
                            sales: { $sum: "$totalAmount" },
                            trees: { $sum: "$saleTrees" }
                        }
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1 } }
                ]),
                // 5. Employee Performance
                Sale.aggregate([
                    { $unwind: { path: "$employees", includeArrayIndex: "empIdx" } },
                    {
                        $lookup: {
                            from: "employees",
                            localField: "employees",
                            foreignField: "_id",
                            as: "employeeInfo"
                        }
                    },
                    { $unwind: "$employeeInfo" },
                    {
                        $group: {
                            _id: "$employeeInfo.name",
                            trees: { $sum: { $arrayElemAt: ["$treesHarvested", "$empIdx"] } }
                        }
                    },
                    { $sort: { trees: -1 } },
                    { $limit: 10 }
                ])
            ]);

            const totalSalesAmount = totalSalesAgg[0] ? totalSalesAgg[0].total : 0;
            const grossSalesMonth = totalSalesMonthAgg[0] ? totalSalesMonthAgg[0].total : 0;
            const totalTreesMonth = totalTreesMonthAgg[0] ? totalTreesMonthAgg[0].total : 0;

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            // Initialize last 6 months with zero values
            const monthlySalesMap = {};
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthName = months[d.getMonth()];
                monthlySalesMap[monthName] = { month: monthName, sales: 0, trees: 0 };
            }

            lastSixMonthsAgg.forEach(item => {
                const monthName = months[item._id.month - 1];
                if (monthlySalesMap[monthName]) {
                    monthlySalesMap[monthName].sales = item.sales;
                    monthlySalesMap[monthName].trees = item.trees;
                }
            });
            const monthlySalesData = Object.values(monthlySalesMap);

            const employeePerformanceData = performanceAgg.map(item => ({
                name: item._id,
                trees: item.trees
            }));

            return ApiResponse.success(res, 'Dashboard stats retrieved successfully', {
                customerCount,
                employeeCount,
                totalSalesAmount,
                grossSalesMonth,
                totalTreesMonth,
                monthlySalesData,
                employeePerformanceData
            });
        } catch (error) {
            next(error);
        }
    }

    static async getDashboardCounts(req, res, next) {
        try {
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const [
                customerCount,
                employeeCount,
                totalSalesAgg,
                totalSalesMonthAgg,
                totalTreesMonthAgg
            ] = await Promise.all([
                Customer.countDocuments(),
                Employee.countDocuments(),
                Sale.aggregate([
                    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
                ]),
                Sale.aggregate([
                    { $match: { saleDate: { $gte: firstDayOfMonth } } },
                    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
                ]),
                Sale.aggregate([
                    { $match: { saleDate: { $gte: firstDayOfMonth } } },
                    {
                        $addFields: {
                            saleTrees: { $ifNull: ["$totalTrees", { $sum: { $ifNull: ["$treesHarvested", []] } }] }
                        }
                    },
                    { $group: { _id: null, total: { $sum: "$saleTrees" } } }
                ])
            ]);

            const totalSalesAmount = totalSalesAgg[0] ? totalSalesAgg[0].total : 0;
            const grossSalesMonth = totalSalesMonthAgg[0] ? totalSalesMonthAgg[0].total : 0;
            const totalTreesMonth = totalTreesMonthAgg[0] ? totalTreesMonthAgg[0].total : 0;

            return ApiResponse.success(res, 'Dashboard counts retrieved successfully', {
                customerCount,
                employeeCount,
                totalSalesAmount,
                grossSalesMonth,
                totalTreesMonth
            });
        } catch (error) {
            next(error);
        }
    }


    static async getReports(req, res, next) {
        try {
            const { from, to } = req.query;
            const filter = {};
            if (from || to) {
                filter.saleDate = {};
                if (from) {
                    const fromDate = new Date(from);
                    if (!isNaN(fromDate.getTime())) filter.saleDate.$gte = fromDate;
                }
                if (to) {
                    const toDate = new Date(to);
                    if (!isNaN(toDate.getTime())) filter.saleDate.$lte = toDate;
                }
                if (Object.keys(filter.saleDate).length === 0) delete filter.saleDate;
            }

            const sales = await Sale.find(filter).populate('customerId').populate('employees', '-photo').lean();

            // Aggregate by Customer
            const customerMap = {};
            sales.forEach(sale => {
                const name = sale.customerId?.name || 'Unknown';
                customerMap[name] = (customerMap[name] || 0) + (sale.totalAmount || 0);
            });
            const customerSalesData = Object.keys(customerMap).map(name => ({
                name,
                sales: customerMap[name]
            })).sort((a, b) => b.sales - a.sales);

            // Aggregate by Employee (Tree Count)
            const employeeMap = {};
            sales.forEach(sale => {
                if (sale.employees && sale.treesHarvested) {
                    sale.employees.forEach((emp, index) => {
                        const name = (emp && typeof emp === 'object') ? (emp.name || 'Unknown') : 'Deleted Employee';
                        const count = sale.treesHarvested[index] || 0;
                        employeeMap[name] = (employeeMap[name] || 0) + count;
                    });
                }
            });
            const employeeTreeData = Object.keys(employeeMap).map(name => ({
                name,
                value: employeeMap[name]
            })).sort((a, b) => b.value - a.value);

            const totalRevenue = sales.reduce((acc, sale) => acc + (sale.totalAmount || 0), 0);
            const totalTrees = sales.reduce((acc, sale) => {
                const sum = (sale.treesHarvested || []).reduce((a, b) => a + (b || 0), 0);
                return acc + (sale.totalTrees || sum || 0);
            }, 0);
            const avgSaleValue = sales.length > 0 ? totalRevenue / sales.length : 0;

            return ApiResponse.success(res, 'Reports retrieved successfully', {
                salesCount: sales.length,
                customerSalesData,
                employeeTreeData,
                summary: {
                    totalRevenue,
                    totalTrees,
                    avgSaleValue
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async getEmployeeReports(req, res, next) {
        try {
            const { from, to } = req.query;
            const filter = {};
            if (from || to) {
                filter.saleDate = {};
                if (from) {
                    const fromDate = new Date(from);
                    if (!isNaN(fromDate.getTime())) filter.saleDate.$gte = fromDate;
                }
                if (to) {
                    const toDate = new Date(to);
                    if (!isNaN(toDate.getTime())) {
                        toDate.setHours(23, 59, 59, 999);
                        filter.saleDate.$lte = toDate;
                    }
                }
                if (Object.keys(filter.saleDate).length === 0) delete filter.saleDate;
            }

            const salaryFilter = {};
            if (from || to) {
                salaryFilter.paymentDate = {};
                if (from) {
                    const fromDate = new Date(from);
                    if (!isNaN(fromDate.getTime())) salaryFilter.paymentDate.$gte = fromDate;
                }
                if (to) {
                    const toDate = new Date(to);
                    if (!isNaN(toDate.getTime())) {
                        toDate.setHours(23, 59, 59, 999);
                        salaryFilter.paymentDate.$lte = toDate;
                    }
                }
                if (Object.keys(salaryFilter.paymentDate).length === 0) delete salaryFilter.paymentDate;
            }

            const [sales, salaries, employees] = await Promise.all([
                Sale.find(filter).populate('employees', '-photo').lean(),
                Salary.find(salaryFilter).lean(),
                Employee.find().select('-photo').lean()
            ]);

            const reportMap = {};

            // Initialize with all employees
            employees.forEach(emp => {
                const empId = emp._id.toString();
                reportMap[empId] = {
                    id: empId,
                    name: emp.name,
                    code: emp.code,
                    totalSalesAmount: 0,
                    totalSalaryPaid: 0,
                    totalTreesHarvested: 0
                };
            });

            // Aggregate Sales
            sales.forEach(sale => {
                if (sale.employees && sale.employees.length > 0) {
                    const treesArr = Array.isArray(sale.treesHarvested) ? sale.treesHarvested : [];
                    const sumHarvested = treesArr.reduce((a, b) => a + (b || 0), 0);
                    const totalTreesInSale = sumHarvested || sale.totalTrees || 0;

                    sale.employees.forEach((emp, index) => {
                        if (!emp) return;
                        const empId = emp._id.toString();

                        // If employee was deleted but exists in sale, we might not have them in reportMap
                        if (!reportMap[empId]) {
                            reportMap[empId] = {
                                id: empId,
                                name: (emp && typeof emp === 'object') ? (emp.name || 'Deleted Employee') : 'Deleted Employee',
                                code: (emp && typeof emp === 'object') ? (emp.code || 'N/A') : 'N/A',
                                totalSalesAmount: 0,
                                totalSalaryPaid: 0,
                                totalTreesHarvested: 0
                            };
                        }

                        const empTrees = treesArr[index] || 0;
                        reportMap[empId].totalTreesHarvested += empTrees;

                        let empShareOfSale = 0;
                        if (totalTreesInSale > 0) {
                            empShareOfSale = (sale.totalAmount || 0) * (empTrees / totalTreesInSale);
                        } else {
                            empShareOfSale = (sale.totalAmount || 0) / sale.employees.length;
                        }
                        reportMap[empId].totalSalesAmount += empShareOfSale;
                    });
                }
            });

            // Aggregate Salaries
            salaries.forEach(sal => {
                const empId = sal.employee.toString();
                if (reportMap[empId]) {
                    reportMap[empId].totalSalaryPaid += (sal.amount || 0);
                }
            });

            const reportData = Object.values(reportMap).map(item => ({
                ...item,
                profit: item.totalSalesAmount - item.totalSalaryPaid
            })).sort((a, b) => b.totalSalesAmount - a.totalSalesAmount);

            return ApiResponse.success(res, 'Employee reports retrieved successfully', reportData);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = StatsController;
