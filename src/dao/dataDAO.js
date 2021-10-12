let zips, stocks;

export class DataDAO {
	static async injectDB(conn) {
		if (zips) {
			return;
		}
		try {
			// movies = await conn.db(process.env.MFLIX_NS).collection('movies');
			zips = await conn.db(process.env.MFLIX_TR).collection('zips');
			// zips = await conn.db(process.env.MFLIX_TR).collection('movies');
			// console.log('zip', zips);
			console.log('zip inj');
		} catch (e) {
			console.error(`Unable to establish collection handles in dataDAO: ${e}`);
		}
	}

	static async getZips({
		// here's where the default parameters are set for the getMovies method
		filters = null,
		page = 0,
		zipsPerPage = 20,
	} = {}) {
		let queryParams = {};
		// if (filters) {
		// 	if ('text' in filters) {
		// 		queryParams = this.textSearchQuery(filters['text']);
		// 	} else if ('cast' in filters) {
		// 		queryParams = this.castSearchQuery(filters['cast']);
		// 	} else if ('genre' in filters) {
		// 		queryParams = this.genreSearchQuery(filters['genre']);
		// 	}
		// }

		// let { query = {}, project = {}, sort = DEFAULT_SORT } = queryParams;
		let cursor;

		// const resa = await zips.find({state: 'AL'});

		// const res = await resa.toArray();
		// console.log('running getzips', res, '-----');
		try {
			cursor = await zips.find({state: 'AL'});

			// console.log(cursor.toArray());
			// .project(project)
			// .sort(sort);
		} catch (e) {
			console.error(`Unable to issue find command, ${e}`);
			return {zipsList: [], totalNumZips: 0};
		}

		// const zipsList = await cursor.toArray();
		// return {zipsList};

		const displayCursor = cursor.skip(zipsPerPage * page).limit(zipsPerPage);

		// const zipsList = await displayCursor.toArray();
		// return {zipsList};

		try {
			const zipsList = await displayCursor.toArray();
			// const totalNumZips = page === 0 ? await zips.countDocuments(query) : 0;
			const totalNumZips = page === 0 ? await zips.countDocuments({state: 'AL'}) : 0;

			return {zipsList, totalNumZips};
		} catch (e) {
			console.error(
				`Unable to convert cursor to array or problem counting documents, ${e}`
			);
			return {zipsList: [], totalNumZips: 0};
		}
	}
}

export class StockDataDAO {
	static async injectDB(conn) {
		if (stocks) {
			return;
		}
		try {
			// stocks = await conn.db(process.env.STOCK_DATA).collection('historical_prices');
			stocks = await conn.db('stock_data').collection('historical_prices');
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
		// var myDate = new Date(2014, 11, 12, 0, 0);
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

			// TODO: Complete the BulkWrite statement below
			const {modifiedCount} = await stocks.bulkWrite(candlesToInsert);

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

			// let upsertResult = await stocks.updateOne(
			// 	// this is the "query" portion of the update
			// 	{ticker: 'GOOGL', timestamp: myDate},
			// 	// this is the update
			// 	{
			// 		$set: {
			// 			// timestamp: new Date(),
			// 			timestamp: myDate,
			// 			open: 154.1,
			// 			high: 164.1,
			// 			low: 124.1,
			// 			close: 134.1,
			// 		},
			// 	},
			// 	// this is the options document. We've specified upsert: true, so if the
			// 	// query doesn't find a document to update, it will be written instead as
			// 	// a new document
			// 	{upsert: true}
			// );

			// console.log({upsertResult});

			return {success: true};
		} catch (e) {
			console.error(`Error occurred while updating stock, ${e}`);
			return {error: e};
		}
	}
}
