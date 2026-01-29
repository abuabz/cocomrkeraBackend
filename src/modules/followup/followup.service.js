const FollowupModel = require('./followup.model');

class FollowupService {
    static async createFollowup(data) {
        return await FollowupModel.create(data);
    }

    static async getAllFollowups() {
        return await FollowupModel.findAll();
    }

    static async getFollowupById(id) {
        return await FollowupModel.findById(id);
    }

    static async updateFollowup(id, data) {
        return await FollowupModel.update(id, data);
    }

    static async deleteFollowup(id) {
        return await FollowupModel.delete(id);
    }
}

module.exports = FollowupService;
