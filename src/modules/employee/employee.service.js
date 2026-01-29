const EmployeeModel = require('./employee.model');

class EmployeeService {
    static async createEmployee(data) {
        return await EmployeeModel.create(data);
    }

    static async getAllEmployees() {
        return await EmployeeModel.findAll();
    }

    static async getEmployeeById(id) {
        return await EmployeeModel.findById(id);
    }

    static async updateEmployee(id, data) {
        return await EmployeeModel.update(id, data);
    }

    static async deleteEmployee(id) {
        return await EmployeeModel.delete(id);
    }
}

module.exports = EmployeeService;
