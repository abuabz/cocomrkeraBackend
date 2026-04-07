const Expense = require('./expense.model');

class ExpenseService {
    static async createExpense(data) {
        const expense = new Expense(data);
        return await expense.save();
    }

    static async getAllExpenses(filter = {}) {
        return await Expense.find(filter).sort({ date: -1 });
    }

    static async getExpenseById(id) {
        return await Expense.findById(id);
    }

    static async updateExpense(id, data) {
        return await Expense.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    static async deleteExpense(id) {
        return await Expense.findByIdAndDelete(id);
    }

    static async getExpenseStats() {
        const stats = await Expense.aggregate([
            {
                $group: {
                    _id: null,
                    totalExpense: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);
        return stats[0] || { totalExpense: 0, count: 0 };
    }
}

module.exports = ExpenseService;
