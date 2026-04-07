const Savings = require('./savings.model');

class SavingsService {
    static async createSavings(data) {
        const savings = new Savings(data);
        return await savings.save();
    }

    static async getAllSavings(filter = {}) {
        return await Savings.find(filter).sort({ date: -1 });
    }

    static async getSavingsById(id) {
        return await Savings.findById(id);
    }

    static async updateSavings(id, data) {
        return await Savings.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    static async deleteSavings(id) {
        return await Savings.findByIdAndDelete(id);
    }

    static async getSavingsStats() {
        const stats = await Savings.aggregate([
            {
                $group: {
                    _id: null,
                    totalDeposits: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "deposit"] }, "$amount", 0]
                        }
                    },
                    totalWithdrawals: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "withdrawal"] }, "$amount", 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalDeposits: 1,
                    totalWithdrawals: 1,
                    balance: { $subtract: ["$totalDeposits", "$totalWithdrawals"] }
                }
            }
        ]);
        return stats[0] || { totalDeposits: 0, totalWithdrawals: 0, balance: 0 };
    }
}

module.exports = SavingsService;
