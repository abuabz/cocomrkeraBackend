const Employee = require('./employee.model');

class EmployeeService {
    static async createEmployee(data) {
        // Check if name already exists
        const existing = await Employee.findOne({ name: { $regex: new RegExp(`^${data.name}$`, 'i') } });
        if (existing) {
            throw new Error('An employee with this name already exists');
        }

        // Auto-generate code if not provided
        if (!data.code) {
            // Find the employee with the highest number in their code
            const employees = await Employee.find({}, { code: 1 }).lean();
            let nextNumber = 1;
            if (employees && employees.length > 0) {
                const numbers = employees
                    .map(e => {
                        const match = e.code.match(/\d+/);
                        return match ? parseInt(match[0]) : 0;
                    })
                    .filter(n => !isNaN(n));
                if (numbers.length > 0) {
                    nextNumber = Math.max(...numbers) + 1;
                }
            }
            data.code = `EMP-${String(nextNumber).padStart(3, '0')}`;
        }
        
        const employee = new Employee(data);
        return await employee.save();
    }

    static async getAllEmployees() {
        return await Employee.find().sort({ createdAt: -1 });
    }

    static async getEmployeeById(id) {
        return await Employee.findById(id);
    }

    static async updateEmployee(id, data) {
        if (data.name) {
            const existing = await Employee.findOne({ 
                name: { $regex: new RegExp(`^${data.name}$`, 'i') },
                _id: { $ne: id }
            });
            if (existing) {
                throw new Error('An employee with this name already exists');
            }
        }
        return await Employee.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    static async deleteEmployee(id) {
        return await Employee.findByIdAndDelete(id);
    }
}

module.exports = EmployeeService;
