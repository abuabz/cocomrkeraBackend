const FollowupService = require('./followup.service');
const ApiResponse = require('../../utils/apiResponse');

class FollowupController {
    static async create(req, res, next) {
        try {
            const followup = await FollowupService.createFollowup(req.body);
            return ApiResponse.success(res, 'Followup created successfully', followup, 201);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const followups = await FollowupService.getAllFollowups();
            return ApiResponse.success(res, 'Followups retrieved successfully', followups);
        } catch (error) {
            next(error);
        }
    }

    static async getOne(req, res, next) {
        try {
            const followup = await FollowupService.getFollowupById(req.params.id);
            if (!followup) {
                return ApiResponse.error(res, 'Followup not found', null, 404);
            }
            return ApiResponse.success(res, 'Followup retrieved successfully', followup);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const id = req.params.id;
            const existingFollowup = await FollowupService.getFollowupById(id);
            if (!existingFollowup) {
                return ApiResponse.error(res, 'Followup not found', null, 404);
            }

            const updatedFollowup = await FollowupService.updateFollowup(id, req.body);
            return ApiResponse.success(res, 'Followup updated successfully', updatedFollowup);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const id = req.params.id;
            const existingFollowup = await FollowupService.getFollowupById(id);
            if (!existingFollowup) {
                return ApiResponse.error(res, 'Followup not found', null, 404);
            }

            await FollowupService.deleteFollowup(id);
            return ApiResponse.success(res, 'Followup deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = FollowupController;
