const Customer = require('../customer/customer.model');
const Employee = require('../employee/employee.model');
const Followup = require('../followup/followup.model');
const Order = require('../order/order.model');
const Salary = require('../salary/salary.model');
const Sale = require('../sale/sale.model');
const Branch = require('../branch/branch.model');
const Expense = require('../expense/expense.model');
const Savings = require('../savings/savings.model');
const User = require('../user/user.model');

const models = {
    customers: Customer,
    employees: Employee,
    followups: Followup,
    orders: Order,
    salaries: Salary,
    sales: Sale,
    branches: Branch,
    expenses: Expense,
    savings: Savings,
    users: User
};

const exportAll = async () => {
    const backup = {};
    for (const [key, Model] of Object.entries(models)) {
        let query = Model.find({});
        // Explicitly include password for users because it's mark as select:false in schema
        if (key === 'users') {
            query = query.select('+password');
        }
        backup[key] = await query.lean();
    }
    return backup;
};

const importAll = async (data) => {
    // Clear existing data and import new data
    // We do this in a way that handles missing keys gracefully
    for (const [key, Model] of Object.entries(models)) {
        if (data[key] && Array.isArray(data[key])) {
            await Model.deleteMany({});
            if (data[key].length > 0) {
                await Model.insertMany(data[key]);
            }
        }
    }
};

module.exports = {
    exportAll,
    importAll
};
