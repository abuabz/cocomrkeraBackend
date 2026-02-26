const Salary = require('./salary.model');

class SalaryService {
    async createSalary(salaryData) {
        const salary = new Salary(salaryData);
        return await salary.save();
    }

    async getSalaries(query = {}) {
        return await Salary.find(query)
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
