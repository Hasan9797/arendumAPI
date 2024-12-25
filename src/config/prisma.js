import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
	query: {
		// General extension for all models
		$allModels: {
			// Add createdAt and updatedAt fields for CREATE operations
			async create({ args, query }) {
				const currentTimestamp = Math.floor(Date.now() / 1000);

				if (args.data) {
					// If createdAt is not provided, set it to the current timestamp
					if (!args.data.createdAt) {
						args.data.createdAt = currentTimestamp;
					}
					// Set updatedAt to the current timestamp
					args.data.updatedAt = currentTimestamp;
				}

				return query(args);
			},

			// Update updatedAt field for UPDATE operations
			async update({ args, query }) {
				const currentTimestamp = Math.floor(Date.now() / 1000);

				if (args.data) {
					// Update updatedAt to the current timestamp
					args.data.updatedAt = currentTimestamp;
				}

				return query(args);
			},
		},
	},
});

export default prisma;
