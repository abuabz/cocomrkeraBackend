const Followup = require('./followup.model');

class FollowupService {
    static async createFollowup(data) {
        const followup = new Followup(data);
        return await followup.save();
    }

    static async getAllFollowups() {
        return await Followup.find().sort({ date: -1 });
    }

    static async getFollowupById(id) {
        return await Followup.findById(id);
    }

    static async updateFollowup(id, data) {
        return await Followup.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    static async deleteFollowup(id) {
        return await Followup.findByIdAndDelete(id);
    }
}

module.exports = FollowupService;
