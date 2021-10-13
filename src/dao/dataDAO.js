let stocks;

export class StockDataDAO {
	static async injectDB(conn) {
		if (stocks) {
			return;
		}
		try {
			// stocks = await conn.db(process.env.STOCK_DATA).collection('historical_prices');
			stocks = await conn.db('stock_data').collection('historical_prices');
			// await stocks.remove();
		} catch (e) {
			console.error(`Unable to establish collection handles in dataDAO: ${e}`);
		}
	}

	static async getPrices({
		// here's where the default parameters are set for the getMovies method
		ticker = ['AAPL'],
		filters = null,
		page = 0,
		pricesPerPage = 20,
	} = {}) {
		let cursor;

		try {
			// cursor = await stocks.find();
			// cursor = await stocks.find({ticker});
			cursor = await stocks.find({ticker: {$in: ticker}});

			// console.log(cursor.toArray());
			// .project(project)
			// .sort(sort);
		} catch (e) {
			console.error(`Unable to issue find command, ${e}`);
			return {pricesList: [], totalNumPrices: 0};
		}

		// const pricesList = await cursor.toArray();
		// console.log({pricesList});
		// return {pricesList};

		const displayCursor = cursor.skip(pricesPerPage * page).limit(pricesPerPage);

		// const pricesList = await displayCursor.toArray();
		// return {pricesList};

		try {
			const pricesList = await displayCursor.toArray();
			// const totalNumPrices = page === 0 ? await stocks.countDocuments({ticker}) : 0;
			const totalNumPrices =
				page === 0 ? await stocks.countDocuments({ticker: {$in: ticker}}) : 0;

			return {pricesList, totalNumPrices};
		} catch (e) {
			console.error(
				`Unable to convert cursor to array or problem counting documents, ${e}`
			);
			return {pricesList: [], totalNumPrices: 0};
		}
	}

	static async insertStockHist(data) {
		// var myDate = new Date('10/16/1995Z');

		const {candles, symbol, empty} = data;

		if (empty) return;

		try {
			const candlesToInsert = candles.map(candle => ({
				updateOne: {
					filter: {ticker: symbol, datetime: new Date(candle.datetime)},
					update: {
						$set: {
							open: candle.open,
							high: candle.high,
							low: candle.low,
							close: candle.close,
							volume: candle.volume,
						},
					},
					upsert: true,
				},
			}));

			const {nUpserted, nModified} = await stocks.bulkWrite(candlesToInsert);
			console.log({nUpserted, nModified, length: candles.length});

			// const res = await stocks.bulkWrite(candlesToInsert);
			// console.log({res});

			// console.log({modifiedCount, length: candles.length});

			// for (let i = 0; i < candles.length; i++) {
			// 	try {
			// 		await stocks.updateOne(
			// 			// this is the "query" portion of the update
			// 			{ticker: symbol, datetime: new Date(candles[i].datetime)},
			// 			// this is the update
			// 			{
			// 				$set: {
			// 					open: candles[i].open,
			// 					high: candles[i].high,
			// 					low: candles[i].low,
			// 					close: candles[i].close,
			// 					volume: candles[i].volume,
			// 				},
			// 			},
			// 			// this is the options document. We've specified upsert: true, so if the
			// 			// query doesn't find a document to update, it will be written instead as
			// 			// a new document
			// 			{upsert: true}
			// 		);
			// 	} catch (e) {
			// 		console.error(`Error inserting ${symbol} for new Date(candle.datetime) ${e}`);
			// 	}
			// }

			return {success: true};
		} catch (e) {
			console.error(`Error occurred while updating stock, ${e}`, {data});
			return {error: e};
		}
	}
}
