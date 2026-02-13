const Customer = require('../customer/customer.model');
const Employee = require('../employee/employee.model');
const Sale = require('../sale/sale.model');
const ApiResponse = require('../../utils/apiResponse');

class StatsController {
    static async getDashboardStats(req, res) {
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

    static async getReports(req, res) {
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
}

module.exports = StatsController;
