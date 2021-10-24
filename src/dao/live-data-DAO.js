let continuousStockData;

export default class LiveDataDAO {
	static async injectDB(conn) {
		if (continuousStockData) {
			return;
		}
		try {
			continuousStockData = await conn.db('stock_data').collection('continuous_prices');
			// await continuousStockData.remove();
		} catch (e) {
			console.error(`Unable to establish collection handles in LiveDataDAO: ${e}`);
		}
	}

	static async getLiveData() {
		let cursor;
		let priceData = {};

		try {
			cursor = await continuousStockData.find({}, {projection: {_id: 0}});

			// console.log(cursor.toArray());
			// .project(project)
			// .sort(sort);
		} catch (e) {
			console.error(`Unable to issue find command, ${e}`);
			return {priceData, totalNumPrices: 0};
		}

		try {
			const pricesList = await cursor.toArray();

			// console.log(pricesList[0]);
			const totalNumPrices = await continuousStockData.countDocuments();

			for (let i = 0; i < pricesList.length; i++) {
				const stockObject = pricesList[i];
				const {ticker, ...rest} = stockObject;

				priceData[ticker] = {...rest};
			}

			return {priceData, totalNumPrices};
		} catch (e) {
			console.error(
				`Unable to convert cursor to array or problem counting documents, ${e}`
			);
			return {priceData, totalNumPrices: 0};
		}
	}

	static async setLiveData(data) {
		// var myDate = new Date('10/16/1995Z');

		const stockSymbols = Object.keys(data);

		if (!stockSymbols.length) return;

		try {
			const stocksToInsert = stockSymbols.map(stockName => ({
				updateOne: {
					filter: {ticker: stockName},
					update: {
						$set: data[stockName],
					},
					upsert: true,
				},
			}));

			const {nUpserted, nModified} = await continuousStockData.bulkWrite(stocksToInsert);
			// console.log({nUpserted, nModified, stockNumber: stockSymbols.length});

			return {success: true};
		} catch (e) {
			console.error(`Error occurred while updating continuous stocks, ${e}`);
			return {error: e};
		}
	}
}
