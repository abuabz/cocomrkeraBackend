const Customer = require('../customer/customer.model');
const Employee = require('../employee/employee.model');
const Sale = require('../sale/sale.model');

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
                const d = new Date();
                d.setMonth(now.getMonth() - i);
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
                        const name = emp.name || 'Unknown';
                        employeeMap[name] = (employeeMap[name] || 0) + (sale.treesHarvested[index] || 0);
                    });
                }
            });
            const employeePerformanceData = Object.keys(employeeMap)
                .map(name => ({ name, trees: employeeMap[name] }))
                .sort((a, b) => b.trees - a.trees);

            res.status(200).json({
                success: true,
                data: {
                    customerCount,
                    employeeCount,
                    totalSalesAmount,
                    totalTreesMonth,
                    monthlySalesData,
                    employeePerformanceData,
                    salesHistory: salesData.slice(0, 10)
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getReports(req, res) {
        try {
            const { from, to } = req.query;
            const filter = {};
            if (from || to) {
                filter.saleDate = {};
                if (from) filter.saleDate.$gte = new Date(from);
                if (to) filter.saleDate.$lte = new Date(to);
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
                        const name = emp.name || 'Unknown';
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

            res.status(200).json({
                success: true,
                data: {
                    salesCount: sales.length,
                    customerSalesData,
                    employeeTreeData,
                    summary: {
                        totalRevenue,
                        totalTrees,
                        avgSaleValue
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = StatsController;
