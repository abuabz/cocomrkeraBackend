const { AsyncLocalStorage } = require('async_hooks');

const tenantStorage = new AsyncLocalStorage();

const tenantMiddleware = (req, res, next) => {
    let targetBranchId = null;

    if (req.user) {
        if (req.user.role === 'admin') {
            if (req.query.branchId && req.query.branchId !== 'all') {
                targetBranchId = req.query.branchId;
            }
        } else {
            targetBranchId = req.user.branchId || '01';
        }

        // Auto-inject branchId into body for POST/PUT if not admin or if admin specifies it
        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            if (req.user.role !== 'admin') {
                req.body.branchId = req.user.branchId || '01';
            } else if (!req.body.branchId && targetBranchId) {
                req.body.branchId = targetBranchId;
            }
        }
    }

    // Run the request in the context of the targetBranchId
    tenantStorage.run({ branchId: targetBranchId }, () => {
        next();
    });
};

const getTenantContext = () => {
    return tenantStorage.getStore();
};

const tenantPlugin = function(schema) {
    // Skip if schema explicitly opts out of multi-tenancy
    if (schema.options.skipTenant) return;

    const applyBranch = function() {
        const store = getTenantContext();
        // Skip filtering if no store, or if branchId is missing or set to 'all'
        if (store && store.branchId && store.branchId !== 'all') {
            // Apply $match / where only if branchId is not already part of the query
            const currentQuery = this.getQuery();
            if (!currentQuery.branchId) {
                this.where({ branchId: store.branchId });
            }
        }
    };

    schema.pre('find', applyBranch);
    schema.pre('findOne', applyBranch);
    schema.pre('countDocuments', applyBranch);
    schema.pre('findOneAndUpdate', applyBranch);
    schema.pre('findOneAndDelete', applyBranch);

    schema.pre('aggregate', function() {
        const store = getTenantContext();
        // Skip filtering if no store, or if branchId is missing or set to 'all'
        if (store && store.branchId && store.branchId !== 'all') {
            const pipeline = this.pipeline();
            // Don't inject if the first step already matches branchId
            if (pipeline.length === 0 || !pipeline[0].$match || !pipeline[0].$match.branchId) {
                pipeline.unshift({ $match: { branchId: store.branchId } });
            }
        }
    });
};

module.exports = {
    tenantMiddleware,
    tenantPlugin,
    getTenantContext
};
