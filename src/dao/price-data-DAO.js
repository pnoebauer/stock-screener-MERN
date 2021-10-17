import {UNSTABLEPERIOD} from '../assets/constants';
import * as calculateIndicators from '../utils/calculate-indicators';

let stocks, continuousStockData;

const serialIndicators = ['reg', 'mom'];

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
		interval = 'month', //$dayOfMonth, $week, $month, $year
		// endDate = new Date('2021-11-01'),
		endDate = new Date(),
		lookBack = 200,
		projection,
	} = {}) {
		let projectionObject = {_id: 0};

		if (projection) {
			// ['openPrice', 'highPrice', 'lowPrice', 'closePrice']
			projection.forEach(
				// parameter => (projectionObject[parameter.replace('Price', '')] = 1)
				parameter => (projectionObject[parameter] = 1)
			);
		}

		let samplingQuery;

		switch (interval) {
			case 'day':
				samplingQuery = {
					day: {$dayOfMonth: '$datetime'},
					month: {$month: '$datetime'},
					year: {$year: '$datetime'},
				};
				break;
			case 'week':
				samplingQuery = {
					week: {$week: '$datetime'},
					month: {$month: '$datetime'},
					year: {$year: '$datetime'},
				};
				break;
			case 'month':
				samplingQuery = {
					month: {$month: '$datetime'},
					year: {$year: '$datetime'},
				};
				break;
			case 'year':
				samplingQuery = {
					year: {$year: '$datetime'},
				};
				break;
		}

		try {
			const pipeline = [
				{
					$match: {ticker, datetime: {$lte: endDate}},
				},
				{
					$group: {
						_id: samplingQuery,
						volume: {$sum: '$volume'},
						high: {$max: '$high'},
						low: {$min: '$low'},
						open: {$first: '$open'},
						close: {$last: '$close'},
						date: {$max: '$datetime'},
					},
				},
				{$sort: {date: 1}},
				{$limit: lookBack},
				{$project: projectionObject},
			];

			const aggregateResult = await stocks.aggregate(pipeline);

			const stocksHistoryArr = await aggregateResult.toArray();
			// console.log({stocksHistoryArr}, stocksHistoryArr.length);

			return stocksHistoryArr;
		} catch (e) {
			console.error(`Unable to retrieve sampled stock history for ${ticker}: ${e}`);
			return {error: e};
		}
	}

	static async getLatestIndicators(queryObject, data, maxLookBack) {
		let currentDataSeries = [];

		// used to store the end result
		let latestIndicators = {};

		// indicators that do not require the whole series
		const reqDiscreteIndicators = Object.keys(queryObject.indicators).filter(
			indicator => !serialIndicators.includes(indicator)
		);
		const reqSerialIndicators = Object.keys(queryObject.indicators).filter(indicator =>
			serialIndicators.includes(indicator)
		);

		data.forEach((candle, index) => {
			// console.log(candle, 'candle', currentDataSeries, index);
			// push the candle into the currentDataSeries array (due to pushing (pass by ref), if the candle is mutated later on it will also updated in the series)
			currentDataSeries.push(candle);
			// console.log(currentDataSeries, 'currentDataSeries', index);

			// loop over all requested indicators
			// Object.keys(reqDiscreteIndicators).forEach(indicator => {
			for (const indicator of reqDiscreteIndicators) {
				// get the requested lookback and parameter from the queryObject
				let {parameter, lookBack} = queryObject.indicators[indicator];
				parameter = parameter.replace('Price', '');

				lookBack = Number(lookBack);

				// console.log(index, maxLookBack, lookBack, indicator);

				// start the calculation once the index is within the lookback (+UNSTABLEPERIOD) of the current bar
				if (index >= maxLookBack - lookBack) {
					// console.log(indicator, maxLookBack, maxLookBack + UNSTABLEPERIOD - 1, index);
					// at the calculated indicator to the candle object (will also update in the currentDataSeries array due to pass by ref)
					candle[indicator] = calculateIndicators[indicator](
						currentDataSeries,
						lookBack,
						parameter,
						maxLookBack
					);
					// round the final result
					if (index === data.length - 1) {
						// candle[indicator] = candle[indicator]
						// round to two decimals
						candle[indicator] = Math.round(candle[indicator] * 100) / 100;
						// console.log(candle, 'last candle');
						latestIndicators[indicator] = candle[indicator];
					}
				}
				// });
			}
			// console.log(candle, index);
		});

		for (const indicator of reqSerialIndicators) {
			let {parameter, lookBack} = queryObject.indicators[indicator];
			parameter = parameter.replace('Price', '');

			lookBack = Number(lookBack);

			// latestIndicators[indicator] = calculateIndicators[indicator](
			// 	data,
			// 	lookBack,
			// 	parameter
			// )
			// round to two decimals
			latestIndicators[indicator] =
				Math.round(calculateIndicators[indicator](data, lookBack, parameter) * 100) / 100;
		}

		return latestIndicators;
	}

	static async getSymbolWithIndicators(queryObject) {
		try {
			// console.log(queryObject);

			// determine the maximum lookback and all unique parameters (for data retrieval from the db)
			const queryParameters = new Set();
			let maxLookBack = 1;
			Object.keys(queryObject.indicators).forEach(indicator => {
				const {[indicator]: indObj} = queryObject.indicators; // destructure out the indicator
				// console.log(indObj, indicator);

				if (!indObj.parameter) {
					['open', 'high', 'low', 'close'].forEach(parameter =>
						queryParameters.add(parameter)
					);
				} else {
					const parameter = indObj.parameter.replace('Price', '');
					queryParameters.add(parameter); // add the parameter to the set (i.e. OHLC)
				}

				maxLookBack = Math.max(maxLookBack, indObj.lookBack); //find the max lookback to be retrieved from the db
			});

			// console.log({queryParameters, maxLookBack});

			// retrieve data
			const latestPriceData = await this.getSampledHistoricalPrices({
				ticker: queryObject.symbol,
				lookBack: UNSTABLEPERIOD + maxLookBack,
				projection: Array.from(queryParameters),
				interval: queryObject.interval,
			});

			console.log(latestPriceData.length, 'latestPriceData');

			const lastCandle = this.getLatestIndicators(
				queryObject,
				latestPriceData,
				maxLookBack
			);

			console.log(lastCandle, 'lastCandle');

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
			// console.log({nUpserted, nModified, length: candles.length});

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
			// console.log({nUpserted, nModified, stockNumber: stockSymbols.length});

			return {success: true};
		} catch (e) {
			console.error(`Error occurred while updating continuous stocks, ${e}`);
			return {error: e};
		}
	}
}
