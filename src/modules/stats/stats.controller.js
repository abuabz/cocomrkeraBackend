const Customer = require('../customer/customer.model');
const Employee = require('../employee/employee.model');
const Sale = require('../sale/sale.model');
const Salary = require('../salary/salary.model');
const ApiResponse = require('../../utils/apiResponse');

class StatsController {
    static async getDashboardStats(req, res, next) {
        try {
            const [customerCount, employeeCount, salesData] = await Promise.all([
                Customer.countDocuments(),
                Employee.countDocuments(),
                Sale.find().populate('employees').sort({ saleDate: -1 })
            ]);

            const totalSalesAmount = salesData.reduce((acc, sale) => acc + (sale.totalAmount || 0), 0);
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            const totalTreesMonth = salesData
                .filter(sale => {
                    const sd = new Date(sale.saleDate);
                    return sd.getMonth() === currentMonth && sd.getFullYear() === currentYear;
                })
                .reduce((acc, sale) => {
                    const sum = (sale.treesHarvested || []).reduce((a, b) => a + (b || 0), 0);
                    return acc + (sale.totalTrees || sum || 0);
                }, 0);

            // Aggregate Monthly Sales (Last 6 months)
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthlySalesMap = {};
            
            // Initialize last 6 months
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthName = months[d.getMonth()];
                monthlySalesMap[monthName] = { month: monthName, sales: 0, trees: 0 };
            }

            salesData.forEach(sale => {
                const sd = new Date(sale.saleDate);
                const monthName = months[sd.getMonth()];
                if (monthlySalesMap[monthName]) {
                    monthlySalesMap[monthName].sales += (sale.totalAmount || 0);
                    const sum = (sale.treesHarvested || []).reduce((a, b) => a + (b || 0), 0);
                    monthlySalesMap[monthName].trees += (sale.totalTrees || sum || 0);
                }
            });
            const monthlySalesData = Object.values(monthlySalesMap);

            // Aggregate Employee Performance
            const employeeMap = {};
            salesData.forEach(sale => {
                if (sale.employees && sale.treesHarvested) {
                    sale.employees.forEach((emp, index) => {
                        // Handle cases where employee might be deleted or not populated correctly
                        const name = (emp && typeof emp === 'object') ? (emp.name || 'Unknown') : 'Deleted Employee';
                        employeeMap[name] = (employeeMap[name] || 0) + (sale.treesHarvested[index] || 0);
                    });
                }
            });
            const employeePerformanceData = Object.keys(employeeMap)
                .map(name => ({ name, trees: employeeMap[name] }))
                .sort((a, b) => b.trees - a.trees);

            return ApiResponse.success(res, 'Dashboard stats retrieved successfully', {
                customerCount,
                employeeCount,
                totalSalesAmount,
                totalTreesMonth,
                monthlySalesData,
                employeePerformanceData,
                salesHistory: salesData.slice(0, 10)
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

            const sales = await Sale.find(filter).populate('customerId employees');

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
                Sale.find(filter).populate('employees'),
                Salary.find(salaryFilter),
                Employee.find()
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
