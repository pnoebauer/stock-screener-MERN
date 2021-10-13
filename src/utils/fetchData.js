import fetch from 'isomorphic-fetch';
import util from 'util';

import {API_TO_INDICATORS} from '../assets/constants';
import {sleep, waitTillSecond} from './timingFunctions';

import {StockDataDAO} from '../dao/dataDAO';

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
			const response = await fetch(queryString);
			const data = await response.json();
			// console.log(data);
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
let dailyUpdateHasRun = false;
let timerId;

const interValTime = 60000;
var symbols = [
	'MMM',
	'ABT',
	'ABBV',
	'ABMD',
	'ACN',
	'ATVI',
	'ADBE',
	'AMD',
	'AAP',
	'AES',
	'AFL',
	'A',
	'APD',
	'AKAM',
	'ALK',
	'ALB',
	'ARE',
	'ALGN',
	'ALLE',
	'LNT',
	'ALL',
	'GOOGL',
	'GOOG',
	'MO',
	'AMZN',
	'AMCR',
	'AEE',
	'AAL',
	'AEP',
	'AXP',
	'AIG',
	'AMT',
	'AWK',
	'AMP',
	'ABC',
	'AME',
	'AMGN',
	'APH',
	'ADI',
	'ANSS',
	'ANTM',
	'AON',
	'AOS',
	'APA',
	'AAPL',
	'AMAT',
	'APTV',
	'ADM',
	'ANET',
	'AJG',
	'AIZ',
	'T',
	'ATO',
	'ADSK',
	'ADP',
	'AZO',
	'AVB',
	'AVY',
	'BKR',
	'BLL',
	'BAC',
	'BBWI',
	'BAX',
	'BDX',
	'BRK.B',
	'BBY',
	'BIO',
	'TECH',
	'BIIB',
	'BLK',
	'BK',
	'BA',
	'BKNG',
	'BWA',
	'BXP',
	'BSX',
	'BMY',
	'AVGO',
	'BR',
	'BF.B',
	'CHRW',
	'COG',
	'CDNS',
	'CZR',
	'CPB',
	'COF',
	'CAH',
	'KMX',
	'CCL',
	'CARR',
	'CTLT',
	'CAT',
	'CBOE',
	'CBRE',
	'CDW',
	'CE',
	'CNC',
	'CNP',
	'CERN',
	'CF',
	'CRL',
	'SCHW',
	'CHTR',
	'CVX',
	'CMG',
	'CB',
	'CHD',
	'CI',
	'CINF',
	'CTAS',
	'CSCO',
	'C',
	'CFG',
	'CTXS',
	'CLX',
	'CME',
	'CMS',
	'KO',
	'CTSH',
	'CL',
	'CMCSA',
	'CMA',
	'CAG',
	'COP',
	'ED',
	'STZ',
	'COO',
	'CPRT',
	'GLW',
	'CTVA',
	'COST',
	'CCI',
	'CSX',
	'CMI',
	'CVS',
	'DHI',
	'DHR',
	'DRI',
	'DVA',
	'DE',
	'DAL',
	'XRAY',
	'DVN',
	'DXCM',
	'FANG',
	'DLR',
	'DFS',
	'DISCA',
	'DISCK',
	'DISH',
	'DG',
	'DLTR',
	'D',
	'DPZ',
	'DOV',
	'DOW',
	'DTE',
	'DUK',
	'DRE',
	'DD',
	'DXC',
	'EMN',
	'ETN',
	'EBAY',
	'ECL',
	'EIX',
	'EW',
	'EA',
	'EMR',
	'ENPH',
	'ETR',
	'EOG',
	'EFX',
	'EQIX',
	'EQR',
	'ESS',
	'EL',
	'ETSY',
	'EVRG',
	'ES',
	'RE',
	'EXC',
	'EXPE',
	'EXPD',
	'EXR',
	'XOM',
	'FFIV',
	'FB',
	'FAST',
	'FRT',
	'FDX',
	'FIS',
	'FITB',
	'FE',
	'FRC',
	'FISV',
	'FLT',
	'FMC',
	'F',
	'FTNT',
	'FTV',
	'FBHS',
	'FOXA',
	'FOX',
	'BEN',
	'FCX',
	'GPS',
	'GRMN',
	'IT',
	'GNRC',
	'GD',
	'GE',
	'GIS',
	'GM',
	'GPC',
	'GILD',
	'GL',
	'GPN',
	'GS',
	'GWW',
	'HAL',
	'HBI',
	'HIG',
	'HAS',
	'HCA',
	'PEAK',
	'HSIC',
	'HSY',
	'HES',
	'HPE',
	'HLT',
	'HOLX',
	'HD',
	'HON',
	'HRL',
	'HST',
	'HWM',
	'HPQ',
	'HUM',
	'HBAN',
	'HII',
	'IEX',
	'IDXX',
	'INFO',
	'ITW',
	'ILMN',
	'INCY',
	'IR',
	'INTC',
	'ICE',
	'IBM',
	'IP',
	'IPG',
	'IFF',
	'INTU',
	'ISRG',
	'IVZ',
	'IPGP',
	'IQV',
	'IRM',
	'JKHY',
	'J',
	'JBHT',
	'SJM',
	'JNJ',
	'JCI',
	'JPM',
	'JNPR',
	'KSU',
	'K',
	'KEY',
	'KEYS',
	'KMB',
	'KIM',
	'KMI',
	'KLAC',
	'KHC',
	'KR',
	'LHX',
	'LH',
	'LRCX',
	'LW',
	'LVS',
	'LEG',
	'LDOS',
	'LEN',
	'LLY',
	'LNC',
	'LIN',
	'LYV',
	'LKQ',
	'LMT',
	'L',
	'LOW',
	'LUMN',
	'LYB',
	'MTB',
	'MRO',
	'MPC',
	'MKTX',
	'MAR',
	'MMC',
	'MLM',
	'MAS',
	'MA',
	'MKC',
	'MCD',
	'MCK',
	'MDT',
	'MRK',
	'MET',
	'MTD',
	'MGM',
	'MCHP',
	'MU',
	'MSFT',
	'MAA',
	'MRNA',
	'MHK',
	'TAP',
	'MDLZ',
	'MPWR',
	'MNST',
	'MCO',
	'MS',
	'MOS',
	'MSI',
	'MSCI',
	'NDAQ',
	'NTAP',
	'NFLX',
	'NWL',
	'NEM',
	'NWSA',
	'NWS',
	'NEE',
	'NLSN',
	'NKE',
	'NI',
	'NSC',
	'NTRS',
	'NOC',
	'NLOK',
	'NCLH',
	'NOV',
	'NRG',
	'NUE',
	'NVDA',
	'NVR',
	'NXPI',
	'ORLY',
	'OXY',
	'ODFL',
	'OMC',
	'OKE',
	'ORCL',
	'OGN',
	'OTIS',
	'PCAR',
	'PKG',
	'PH',
	'PAYX',
	'PAYC',
	'PYPL',
	'PENN',
	'PNR',
	'PBCT',
	'PEP',
	'PKI',
	'PRGO',
	'PFE',
	'PM',
	'PSX',
	'PNW',
	'PXD',
	'PNC',
	'POOL',
	'PPG',
	'PPL',
	'PFG',
	'PG',
	'PGR',
	'PLD',
	'PRU',
	'PTC',
	'PEG',
	'PSA',
	'PHM',
	'PVH',
	'QRVO',
	'PWR',
	'QCOM',
	'DGX',
	'RL',
	'RJF',
	'RTX',
	'O',
	'REG',
	'REGN',
	'RF',
	'RSG',
	'RMD',
	'RHI',
	'ROK',
	'ROL',
	'ROP',
	'ROST',
	'RCL',
	'SPGI',
	'CRM',
	'SBAC',
	'SLB',
	'STX',
	'SEE',
	'SRE',
	'NOW',
	'SHW',
	'SPG',
	'SWKS',
	'SNA',
	'SO',
	'LUV',
	'SWK',
	'SBUX',
	'STT',
	'STE',
	'SYK',
	'SIVB',
	'SYF',
	'SNPS',
	'SYY',
	'TMUS',
	'TROW',
	'TTWO',
	'TPR',
	'TGT',
	'TEL',
	'TDY',
	'TFX',
	'TER',
	'TSLA',
	'TXN',
	'TXT',
	'TMO',
	'TJX',
	'TSCO',
	'TT',
	'TDG',
	'TRV',
	'TRMB',
	'TFC',
	'TWTR',
	'TYL',
	'TSN',
	'UDR',
	'ULTA',
	'USB',
	'UAA',
	'UA',
	'UNP',
	'UAL',
	'UNH',
	'UPS',
	'URI',
	'UHS',
	'UNM',
	'VLO',
	'VTR',
	'VRSN',
	'VRSK',
	'VZ',
	'VRTX',
	'VFC',
	'VIAC',
	'VTRS',
	'V',
	'VNO',
	'VMC',
	'WRB',
	'WAB',
	'WMT',
	'WBA',
	'DIS',
	'WM',
	'WAT',
	'WEC',
	'WFC',
	'WELL',
	'WST',
	'WDC',
	'WU',
	'WRK',
	'WY',
	'WHR',
	'WMB',
	'WLTW',
	'WYNN',
	'XEL',
	'XLNX',
	'XYL',
	'YUM',
	'ZBRA',
	'ZBH',
	'ZION',
	'ZTS',
];

let clients = [];
let cachedData = {};

export class DataUpdates {
	static async updateHistory(multiplier, interval) {
		// const symbols = ['AAPL', 'GOOGL'];

		for (let i = 0; i < symbols.length; i++) {
			const symbol = symbols[i];
			console.log({symbol, i});

			try {
				const data = await FetchData.fetchHistoricalData(
					symbol,
					multiplier,
					interval,
					1,
					'daily'
				);
				// console.log(data);

				const insertStatus = await StockDataDAO.insertStockHist(data);
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

			const data = await ProcessContinuousData.batchFetch(symbols);
			// console.log(data.AAPL.bidPrice, 'AAPL bid');

			if (data.error) {
				console.log('error during fetching', data.error);
				return;
			}
			// console.time('time');
			// check if data has changed since the last fetch
			const identical = ProcessContinuousData.compareCacheWithFetch(data);
			console.log(identical, 'identical');

			cachedData = data;

			// if the data has changed since the last fetch send it to all clients
			if (!identical) {
				// console.log(cachedData.AAPL, new Date().getSeconds());
				await waitTillSecond(0);
				console.log('sending', new Date().getSeconds());
				// sendEventsToAll(data);
			}
		} catch (e) {
			console.error(`Error updating continuous data for ${e}`);
			return {error: e};
		}
	}

	static getLiveData() {
		return cachedData;
	}

	static async triggerUpdates() {
		await this.updateContinuousData();
		// if (timerId) {
		// 	return;
		// } else {
		// 	lastHistoricalUpdate = new Date().getDate();
		// 	// dailyUpdateHasRun = await historicalDataIntoDB(UNIVERSES, SYMBOLS, numberYears);
		// 	dailyUpdateHasRun = await this.updateHistory(1, 'month');

		// 	timerId = setInterval(async () => {
		// 		// console.log('new interval at', new Date().getSeconds(), lastHistoricalUpdate);
		// 		// run only once a day
		// 		if (new Date().getDate() !== lastHistoricalUpdate) {
		// 			dailyUpdateHasRun = false;
		// 			console.log(new Date().getDate(), lastHistoricalUpdate, 'different');

		// 			lastHistoricalUpdate = new Date().getDate();

		// 			// on the weekend update the last 20 years, during the week only the last 1 year
		// 			const multiplier = new Date().getDay() < 6 ? 1 : 20;
		// 			// const interval = 'year';
		// 			const interval = 'month';

		// 			dailyUpdateHasRun = await this.updateHistory(multiplier, interval);
		// 			// console.log(dailyUpdateHasRun, 'dailyUpdateHasRun');
		// 		}
		// 		// make sure that the daily update has finished before continuing with the regular updates so that the API limit is not exceeded
		// 		else if (!util.inspect(dailyUpdateHasRun).includes('pending')) {
		// 			console.log(new Date().getDate(), lastHistoricalUpdate, 'equal');
		// 			await this.updateContinuousData();
		// 		}
		// 	}, interValTime);
		// }
	}
}

const splits = 5;
const symbolsPerSplit = Math.round(symbols.length / splits);

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
			console.log('batch', i);
			let partialData = await FetchData.fetchLiveData(
				symbolList.slice(startIndex, endIndex)
			);
			let filteredData = this.filterData(partialData);
			// console.log(filteredData);
			data = {...data, ...filteredData};
			// console.log(data);
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

		for (const i in symbols) {
			const symbol = symbols[i];
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
