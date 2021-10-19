// import fetch from 'isomorphic-fetch';

import originalFetch from 'isomorphic-fetch';
import retryFetch from 'fetch-retry';
const fetch = retryFetch(originalFetch);

// var originalFetch = require('isomorphic-fetch');
// var fetch = require('fetch-retry')(originalFetch);

import util from 'util';

import {API_TO_INDICATORS, SYMBOLS} from '../assets/constants';
import {sleep, waitTillSecond} from './timing';

import {StockDataDAO, ContinuousPricesDAO} from '../dao/price-data-DAO';

import DataStreamCtrl from '../api/events.controller';

if (process.env.NODE_ENV !== 'production') require('dotenv').config(); //load .env into process environment (adds variables from there)

const urlEndPoint = 'https://api.tdameritrade.com/v1/marketdata';

export class FetchData {
	static addDays(date, days) {
		const copy = new Date(Number(date));
		copy.setDate(date.getDate() + days);
		return copy;
	}

	static async fetchData(url, queryParams) {
		const apikey = process.env.TD_API_KEY;
		const params = {
			apikey,
			...queryParams,
		};
		const queryExt = new URLSearchParams(params).toString();
		const queryString = `${url}?${queryExt}`;
		// console.log({apikey}, {queryString});
		try {
			let data;

			const response = await fetch(queryString, {
				// retries: 3,
				retryDelay: 10000,
				retryOn: async function (attempt, error, response) {
					// console.log({attempt});

					if (attempt > 5) return false;

					if (error) {
						console.log({error, attempt});
						return true;
					}

					// if (error !== null) {
					data = await response.json();
					// console.log({empty: data.empty, attempt});

					// if (data.candles) {
					// 	console.log(data.candles[0]);
					// } else {
					// 	console.log(data);
					// }

					if (data.empty || data.error) {
						console.log({dataError: data.error, attempt}, queryString);
						return true;
					}
					// }
				},
			});
			// console.log({response});
			// const data = await response.json();
			// console.log({data});
			return data;
		} catch (e) {
			console.log('error fetch data', e);
		}
	}
	static async fetchLiveData(symbol) {
		const urlRealTime = `${urlEndPoint}/quotes`;
		const queryParams = {symbol};
		return this.fetchData(urlRealTime, queryParams);
	}
	static async fetchHistoricalData(symbol, period, periodType, frequency, frequencyType) {
		/*
			----------------------
				Prices can either be fetched based on period
				(do not enter a start date)
				or based on start and end date
			----------------------
		*/

		/*
			----------------------
				USE OF PERIODS
			----------------------

		const startDate = new Date(2000, 0, 1, 0, 0);
		// const startDateUnix = startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000; //UTC time
		const startDateUnix = startDate.getTime(); //getTime already returns in UTC
		// const endDate = addDays(startDate, 10);
		// const endDate = new Date(2021, 5, 11, 0, 0); //default: prior trading day
		const endDate = new Date(); //default: prior trading day
		// const endDateUnix = endDate.getTime() - endDate.getTimezoneOffset() * 60 * 1000;
		const endDateUnix = endDate.getTime(); //getTime already returns in UTC
		// console.log(startDateUnix, endDateUnix);
		*/

		/* 	// Valid periods by periodType:
			// day: 1, 2, 3, 4, 5, 10*
			// month: 1*, 2, 3, 6
			// year: 1*, 2, 3, 5, 10, 15, 20
			// ytd: 1*
			const period = 5; //not required if start date is used
			// Valid values are day, month, year, or ytd (year to date). Default is day.
			const periodType = 'year';
			// 	Valid frequencyTypes by periodType (defaults marked with an asterisk):
			// day: minute*
			// month: daily, weekly*
			// year: daily, weekly, monthly*
			// ytd: daily, weekly*
			const frequencyType = 'daily';
			// Valid frequencies by frequencyType:
			// minute: 1*, 5, 10, 15, 30
			// daily: 1*
			// weekly: 1*
			// monthly: 1*
			const frequency = 1; */
		// const needExtendedHoursData = true;
		const urlHistorical = `${urlEndPoint}/${symbol}/pricehistory`;
		const queryParams = {
			periodType,
			period,
			frequencyType,
			frequency,
			// endDate: endDateUnix,
			// startDate: startDateUnix,
			// needExtendedHoursData,
		};
		try {
			const data = await this.fetchData(urlHistorical, queryParams);
			return data;
		} catch (e) {
			console.log('error fetching historical data', e);
		}
	}
}

let lastHistoricalUpdate;
let dailyHistoryUpdate = false;
let timerId;

const interValTime = 60000;

let clients = [];
let cachedData = {};

export class DataUpdates {
	static async updateHistory(multiplier, interval) {
		// console.log('updating history');
		for (let i = 0; i < SYMBOLS.length; i++) {
			const symbol = SYMBOLS[i];

			console.log({symbol, i}, 'history');

			try {
				const data = await FetchData.fetchHistoricalData(
					symbol,
					multiplier,
					interval,
					1,
					'daily'
				);
				// console.log(data);

				const insertStatus = await StockDataDAO.setHistoricalPrices(data);
				// console.log(insertStatus);
			} catch (e) {
				console.error(`Error while fetching data and inserting into DB for ${e}`);
				return {error: e};
			}
		}
	}

	static async updateContinuousData() {
		console.log('updateContinuousData', new Date().getMinutes(), new Date().getSeconds());
		try {
			await waitTillSecond(10);
			// console.log('waitToFullMinute + 10 sec', new Date().getSeconds());

			const data = await ProcessContinuousData.batchFetch(SYMBOLS);
			// console.log(data.AAPL.bidPrice, 'AAPL bid');
			// console.log({data});

			if (data.error) {
				console.log('error during fetching', data.error);
				return;
			}
			// check if data has changed since the last fetch
			const identical = ProcessContinuousData.compareCacheWithFetch(data);

			console.log('setting data', new Date().getMinutes(), new Date().getSeconds());
			cachedData = data;

			// if the data has changed since the last fetch send it to all clients
			// if (!identical) {
			// console.log(cachedData.AAPL, new Date().getSeconds());
			await waitTillSecond(0);
			console.log('sending --------', new Date().getSeconds());

			DataStreamCtrl.sendEventsToAll(data);
			// }
		} catch (e) {
			console.error(`Error updating continuous data for ${e}`);
			return {error: e};
		}
	}

	static getLiveData() {
		return cachedData;
	}

	static async triggerUpdates() {
		// await this.updateContinuousData();
		if (timerId) {
			return;
		} else {
			const continuousData = await ContinuousPricesDAO.getContinuousPrices();
			// console.log(continuousData.priceData);
			cachedData = continuousData.priceData;

			await this.updateContinuousData();

			lastHistoricalUpdate = new Date().getDate();
			dailyHistoryUpdate = await this.updateHistory(1, 'month');
			// dailyHistoryUpdate = await this.updateHistory(10, 'year');

			timerId = setInterval(async () => {
				// console.log('new interval at', new Date().getSeconds(), lastHistoricalUpdate);
				// run only once a day
				if (new Date().getDate() !== lastHistoricalUpdate) {
					dailyHistoryUpdate = false; //comment out
					console.log('updateHistory', {
						today: new Date().getDate(),
						lastHistoricalUpdate,
					});

					lastHistoricalUpdate = new Date().getDate();

					// on the weekend update the last 20 years, during the week only the last 1 year
					const multiplier = new Date().getDay() < 6 ? 1 : 20;
					// const interval = 'year';
					const interval = 'month';

					dailyHistoryUpdate = await this.updateHistory(multiplier, interval);
				}
				// make sure that the daily update has finished before continuing with the regular updates so that the API limit is not exceeded
				else if (!util.inspect(dailyHistoryUpdate).includes('pending')) {
					console.log('updateContinuousData', {
						today: new Date().getDate(),
						lastHistoricalUpdate,
					});
					await this.updateContinuousData();
				}
			}, interValTime);
		}
	}
}

const splits = 5;
const symbolsPerSplit = Math.round(SYMBOLS.length / splits);

export class ProcessContinuousData {
	static filterData(dataSet) {
		let filteredData = {};

		for (const symbol in dataSet) {
			filteredData[symbol] = {};
			for (const key in dataSet[symbol]) {
				if (Object.keys(API_TO_INDICATORS).includes(key)) {
					//removes trailing time (always 0:00)
					const keyValue =
						key === 'divDate' ? dataSet[symbol][key].split(' ')[0] : dataSet[symbol][key];

					filteredData[symbol][key] = keyValue;
				}
			}
		}

		return filteredData;
	}

	static async batchFetch(symbolList) {
		let startIndex = 0;
		let endIndex = symbolsPerSplit;
		let data = {};
		// split fetch call into 5 equal parts
		for (let i = 0; i < splits; i++) {
			console.log('continuous batch', i);
			let partialData = await FetchData.fetchLiveData(
				symbolList.slice(startIndex, endIndex)
			);
			let filteredData = this.filterData(partialData);

			// insert into DB
			const res = await ContinuousPricesDAO.setContinuousPrices(filteredData);
			// console.log({res});

			// console.log(filteredData);
			data = {...data, ...filteredData};
			// console.log({data});
			startIndex = endIndex;
			endIndex += symbolsPerSplit;
			endIndex = Math.min(endIndex, symbolList.length);

			// sleep after a batch except the final one
			if (i !== splits - 1) {
				// console.log('waiting', Math.round(interValTime / (splits + 2)), 'ms');
				await sleep(interValTime / (splits + 2)); //make sure that all fetches are done before the next round
			}
		}
		// console.log(data.AAPL.bidPrice, 'AAPL bid');
		return data;
	}

	//check if data has changed since the last fetch (use to only send data to front end users if the data has changed)
	static compareCacheWithFetch(data) {
		let identical = true;

		for (const i in SYMBOLS) {
			const symbol = SYMBOLS[i];
			// console.log(symbol, 'symbol', data[symbol]);
			if (!data[symbol]) {
				console.log('fetching error for', symbol);
				data[symbol] = cachedData[symbol]; //if the new fetch request has no data for this symbol, then set it to the old one
				continue;
			}
			for (const key in data[symbol]) {
				// console.log(key, 'key');
				if (cachedData[symbol]) {
					//if the new fetch request has no data for this symbol and key, then set it to the old one
					if (!data[symbol][key]) {
						data[symbol][key] = cachedData[symbol][key];
						// continue;
					}
					if (data[symbol][key] !== cachedData[symbol][key]) {
						identical = false;
						// break;
					}
				} else {
					identical = false;
					break;
				}
			}
			// if (!identical) break;
		}

		return identical;
	}
}
