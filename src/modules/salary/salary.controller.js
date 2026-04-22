const salaryService = require('./salary.service');

class SalaryController {
    async createSalary(req, res, next) {
        try {
            const salary = await salaryService.createSalary(req.body);
            res.status(201).json({
                success: true,
                data: salary
            });
        } catch (error) {
            next(error);
        }
    }

    async getSalaries(req, res, next) {
        try {
            const { type } = req.query;
            let salaries;
            if (type === 'automatic') {
                salaries = await salaryService.getAutomaticSalaries(req.query);
            } else {
                salaries = await salaryService.getSalaries(req.query);
            }
            res.status(200).json({
                success: true,
                count: salaries.length,
                data: salaries
            });
        } catch (error) {
            next(error);
        }
    }

    async getSalary(req, res, next) {
        try {
            const salary = await salaryService.getSalaryById(req.params.id);
            if (!salary) {
                return res.status(404).json({
                    success: false,
                    message: 'Salary record not found'
                });
            }
            res.status(200).json({
                success: true,
                data: salary
            });
        } catch (error) {
            next(error);
        }
    }

    async updateSalary(req, res, next) {
        try {
            const salary = await salaryService.updateSalary(req.params.id, req.body);
            if (!salary) {
                return res.status(404).json({
                    success: false,
                    message: 'Salary record not found'
                });
            }
            res.status(200).json({
                success: true,
                data: salary
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteSalary(req, res, next) {
        try {
            const salary = await salaryService.deleteSalary(req.params.id);
            if (!salary) {
                return res.status(404).json({
                    success: false,
                    message: 'Salary record not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Salary record deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SalaryController();
