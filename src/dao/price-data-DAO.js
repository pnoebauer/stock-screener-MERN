let stocks, continuousStockData;

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
			console.error(`Unable to establish collection handles in StockDataDAO: ${e}`);
		}
	}

	static async getSampledHistoricalPrices({
		// here's where the default parameters are set for the getMovies method
		ticker = 'AAPL',
		interval = '$month', //$dayOfMonth, $week, $month, $year
		// endDate = new Date('2021-11-01'),
		endDate = new Date(),
		lookBack = 200,
		projection,
	} = {}) {
		let projectionObject = {_id: 1};

		if (projection) {
			// ['openPrice', 'highPrice', 'lowPrice', 'closePrice']
			projection.forEach(
				parameter => (projectionObject[parameter.replace('Price', '')] = 1)
			);
		}

		try {
			const pipeline = [
				{
					$match: {ticker, datetime: {$lte: endDate}},
					// $match: {ticker},
				},
				{
					$group: {
						_id: {[interval]: '$datetime'},
						documentCount: {$sum: 1},
						volume: {$sum: '$volume'},
						high: {$max: '$high'},
						low: {$min: '$low'},
						open: {$first: '$open'},
						close: {$last: '$close'},
						datetime: {$max: '$datetime'},
					},
				},
				{$sort: {datetime: 1}},
				{$limit: lookBack},
			];

			if (projection) {
				pipeline.push({$project: projectionObject});
			}

			const aggregateResult = await stocks.aggregate(pipeline);

			const stocksHistoryArr = await aggregateResult.toArray();
			console.log({stocksHistoryArr});

			return stocksHistoryArr;
		} catch (e) {
			console.error(`Unable to retrieve sampled stock history for ${ticker}: ${e}`);
			return {error: e};
		}
	}

	static async retrieveSymbolWithIndicators(queryObject) {
		try {
			// console.log(queryObject);

			// determine the maximum lookback and all unique parameters (for data retrieval from the db)
			const queryParameters = new Set();
			let maxLookBack = 1;
			Object.keys(queryObject.indicators).forEach(indicator => {
				const {[indicator]: indObj} = queryObject.indicators; // destructure out the indicator
				// console.log(indObj, indicator);

				if (!indObj.parameter) {
					['openPrice', 'highPrice', 'lowPrice', 'closePrice'].forEach(parameter =>
						queryParameters.add(parameter)
					);
				} else {
					queryParameters.add(indObj.parameter); // add the parameter to the set (i.e. OHLC)
				}

				maxLookBack = Math.max(maxLookBack, indObj.lookBack); //find the max lookback to be retrieved from the db
			});

			// console.log(queryParameters, maxLookBack);

			// retrieve data
			const latestPriceData = await this.getSampledHistoricalPrices({
				ticker: queryObject.symbol,
				lookBack: UNSTABLEPERIOD + maxLookBack,
				projection: Array.from(queryParameters),
				interval: queryObject.interval,
			});

			// console.log(latestPriceData, 'latestPriceData');

			const lastCandle = getLatestIndicators(queryObject, latestPriceData, maxLookBack);

			return lastCandle;
		} catch (e) {
			console.log('error retrieving symbol with indicators', e);
			return {};
		}
	}

	static async getHistoricalPrices({
		// here's where the default parameters are set for the getMovies method
		ticker = ['AAPL'],
		filters = null,
		page = 0,
		pricesPerPage = 20,
	} = {}) {
		let cursor;

		try {
			// cursor = await stocks.find({ticker});
			// cursor = await stocks.find({ticker: {$in: ticker}});
			cursor = await stocks.find({ticker: {$in: ticker}}, {_id: 0});

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

	static async setHistoricalPrices(data) {
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

export class ContinuousPricesDAO {
	static async injectDB(conn) {
		if (continuousStockData) {
			return;
		}
		try {
			continuousStockData = await conn.db('stock_data').collection('continuous_prices');
			// await continuousStockData.remove();
		} catch (e) {
			console.error(
				`Unable to establish collection handles in ContinuousPricesDAO: ${e}`
			);
		}
	}
	static async getContinuousPrices() {
		let cursor;

		try {
			cursor = await continuousStockData.find();

			// console.log(cursor.toArray());
			// .project(project)
			// .sort(sort);
		} catch (e) {
			console.error(`Unable to issue find command, ${e}`);
			return {pricesList: [], totalNumPrices: 0};
		}

		try {
			const pricesList = await cursor.toArray();
			const totalNumPrices = await continuousStockData.countDocuments();
			return {pricesList, totalNumPrices};
		} catch (e) {
			console.error(
				`Unable to convert cursor to array or problem counting documents, ${e}`
			);
			return {pricesList: [], totalNumPrices: 0};
		}
	}

	static async setContinuousPrices(data) {
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
			console.log({nUpserted, nModified, stockNumber: stockSymbols.length});

			return {success: true};
		} catch (e) {
			console.error(`Error occurred while updating continuous stocks, ${e}`);
			return {error: e};
		}
	}
}
