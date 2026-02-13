const EmployeeService = require('./employee.service');
const ApiResponse = require('../../utils/apiResponse');

class EmployeeController {
    static async create(req, res, next) {
        try {
            const employee = await EmployeeService.createEmployee(req.body);
            return ApiResponse.success(res, 'Employee created successfully', employee, 201);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const employees = await EmployeeService.getAllEmployees();
            return ApiResponse.success(res, 'Employees retrieved successfully', employees);
        } catch (error) {
            next(error);
        }
    }

    static async getOne(req, res, next) {
        try {
            const employee = await EmployeeService.getEmployeeById(req.params.id);
            if (!employee) {
                return ApiResponse.error(res, 'Employee not found', null, 404);
            }
            return ApiResponse.success(res, 'Employee retrieved successfully', employee);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const id = req.params.id;
            const existingEmployee = await EmployeeService.getEmployeeById(id);
            if (!existingEmployee) {
                return ApiResponse.error(res, 'Employee not found', null, 404);
            }

            const updatedEmployee = await EmployeeService.updateEmployee(id, req.body);
            return ApiResponse.success(res, 'Employee updated successfully', updatedEmployee);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const id = req.params.id;
            const existingEmployee = await EmployeeService.getEmployeeById(id);
            if (!existingEmployee) {
                return ApiResponse.error(res, 'Employee not found', null, 404);
            }

            await EmployeeService.deleteEmployee(id);
            return ApiResponse.success(res, 'Employee deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = EmployeeController;
