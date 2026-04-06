const Customer = require('../customer/customer.model');
const Employee = require('../employee/employee.model');
const Followup = require('../followup/followup.model');
const Order = require('../order/order.model');
const Salary = require('../salary/salary.model');
const Sale = require('../sale/sale.model');

const models = {
    customers: Customer,
    employees: Employee,
    followups: Followup,
    orders: Order,
    salaries: Salary,
    sales: Sale
};

const exportAll = async () => {
    const backup = {};
    for (const [key, Model] of Object.entries(models)) {
        backup[key] = await Model.find({}).lean();
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
