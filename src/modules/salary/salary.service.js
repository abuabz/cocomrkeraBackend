const Salary = require('./salary.model');
const Sale = require('../sale/sale.model');
const Employee = require('../employee/employee.model');

class SalaryService {
    async getAutomaticSalaries(query = {}) {
        const { branchId, from, to } = query;
        
        const saleFilter = {};
        if (branchId && branchId !== 'all') saleFilter.branchId = branchId;
        if (from || to) {
            saleFilter.saleDate = {};
            if (from) saleFilter.saleDate.$gte = new Date(from);
            if (to) saleFilter.saleDate.$lte = new Date(to);
        }

        const salaryFilter = {};
        if (branchId && branchId !== 'all') salaryFilter.branchId = branchId;
        if (from || to) {
            salaryFilter.paymentDate = {};
            if (from) salaryFilter.paymentDate.$gte = new Date(from);
            if (to) salaryFilter.paymentDate.$lte = new Date(to);
        }

        // 1. Get all employees
        const employees = await Employee.find(branchId && branchId !== 'all' ? { branchId } : {}).lean();

        // 2. Aggregate Sales by Employee
        const salesAgg = await Sale.aggregate([
            { $match: saleFilter },
            { $unwind: { path: "$employees", includeArrayIndex: "empIdx" } },
            {
                $group: {
                    _id: "$employees",
                    totalTrees: { $sum: { $arrayElemAt: ["$treesHarvested", "$empIdx"] } }
                }
            }
        ]);

        const salesMap = {};
        salesAgg.forEach(item => {
            salesMap[item._id.toString()] = item.totalTrees;
        });

        // 3. Get Paid Salaries and their statuses
        const paidSalaries = await Salary.find(salaryFilter).sort({ createdAt: -1 }).lean();
        const paidMap = {};
        const statusMap = {};
        paidSalaries.forEach(sal => {
            const empId = sal.employee.toString();
            paidMap[empId] = (paidMap[empId] || 0) + (sal.amount || 0);
            if (!statusMap[empId]) {
                statusMap[empId] = sal.status;
            }
        });

        // 4. Combine data
        const results = employees.map(emp => {
            const empId = emp._id.toString();
            const totalTrees = salesMap[empId] || 0;
            const expectedAmount = totalTrees * 30;
            const amountPaid = paidMap[empId] || 0;
            const balance = expectedAmount - amountPaid;
            
            // If balance is greater than 0, it means amount is due, so it should be 'Unpaid'
            // If balance is 0 or less, it means they are fully paid or overpaid, so it should be 'Paid'
            let status = 'Unpaid';
            if (balance <= 0 && expectedAmount > 0) {
                status = 'Paid';
            }

            return {
                id: empId,
                employee: emp,
                totalTrees,
                amount: expectedAmount,
                amountPaid,
                balance,
                status,
                branchId: emp.branchId
            };
        });

        return results.filter(r => r.totalTrees > 0);
    }

    async createSalary(salaryData) {
        const salary = new Salary(salaryData);
        return await salary.save();
    }

    async getSalaries(query = {}) {
        const { branchId, from, to } = query;
        const filter = {};
        
        if (branchId && branchId !== 'all') filter.branchId = branchId;
        if (from || to) {
            filter.paymentDate = {};
            if (from) filter.paymentDate.$gte = new Date(from);
            if (to) filter.paymentDate.$lte = new Date(to);
        }

        return await Salary.find(filter)
            .populate('employee', 'name code')
            .sort({ createdAt: -1 })
            .lean();
    }

    async getSalaryById(id) {
        return await Salary.findById(id).populate('employee', 'name code');
    }

    async updateSalary(id, salaryData) {
        return await Salary.findByIdAndUpdate(id, salaryData, { new: true, runValidators: true }).populate('employee', 'name code');
    }

    async deleteSalary(id) {
        return await Salary.findByIdAndDelete(id);
    }
}

module.exports = new SalaryService();
