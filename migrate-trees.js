const mongoose = require('mongoose');
const Sale = require('./src/modules/sale/sale.model');
require('dotenv').config();

async function migrate() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cocomrkera');
    const sales = await Sale.find({ trees: { $exists: true } });
    console.log(`Found ${sales.length} sales to migrate`);
    
    for (const sale of sales) {
        if (sale._doc.trees && !sale.treesHarvested?.length) {
            sale.treesHarvested = sale._doc.trees;
            await sale.save();
        }
    }
    console.log('Migration complete');
    process.exit(0);
}

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});
