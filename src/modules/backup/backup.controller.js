const backupService = require('./backup.service');

const exportData = async (req, res, next) => {
    try {
        const data = await backupService.exportAll();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=backup-${new Date().toISOString().split('T')[0]}.json`);
        res.status(200).send(JSON.stringify(data, null, 2));
    } catch (error) {
        next(error);
    }
};

const importData = async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || typeof data !== 'object') {
            return res.status(400).json({ message: 'Invalid data format' });
        }
        
        await backupService.importAll(data);
        res.status(200).json({ message: 'Data imported successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    exportData,
    importData
};
