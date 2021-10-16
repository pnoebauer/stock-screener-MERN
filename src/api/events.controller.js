import {DataUpdates} from '../utils/data-updater';

let clients = [];

export default class DataStreamController {
	// handler function for sending the queried data to client and adds the client to clients array
	static async eventsHandler(req, res, queriedSymbols) {
		// console.log(queriedSymbols.split(','));

		const headers = {
			'Content-Type': 'text/event-stream',
			Connection: 'keep-alive',
			'Cache-Control': 'no-cache',
		};
		res.writeHead(200, headers); //HTTP status set to 200 and headers object written to head

		//data array is turned into a string
		// const data = `data: ${JSON.stringify(facts)}\n\n`; // \n\n is mandatory to indicate the end of an event
		// const data = `data: ${JSON.stringify(cachedData)}\n\n`;

		const clientData = {};
		// retrieve only the required symbols from the cachedData object for each respective client

		const cachedData = DataUpdates.getLiveData();

		// console.log({cachedData});

		queriedSymbols
			.split(',')
			.forEach(symbol => (clientData[symbol] = cachedData[symbol]));

		const data = `data: ${JSON.stringify(clientData)}\n\n`;

		// send the data object to the client
		res.write(data);

		const clientId = Date.now();

		// create new client based on clientID and response
		const newClient = {
			id: clientId,
			res,
			queriedSymbols,
		};

		// console.log(newClient, 'newClient');
		console.log(clientId, 'clientId');

		// add this client to clients array (clients is a global variable)
		clients.push(newClient);

		// when the client closes the connection that client will be filtered out from the clients array
		req.on('close', () => {
			console.log(`${clientId} Connection closed`);
			clients = clients.filter(client => client.id !== clientId);
			newClient.res.end();
			// if (!res.finished) {
			// 	res.end();
			// 	console.log("Stopped sending events.");
			//   }
		});
	}

	// sendEventsToAll iterates the clients array and uses the write method of each Express object to send the update
	static sendEventsToAll(data) {
		// loop through global clients array
		clients.forEach(client => {
			// console.log(client) ||
			// console.log(client.id);
			// const clientData = data[client.symbol];
			const clientData = {};
			// client.queriedSymbols.split(',').forEach(symbol => (clientData[symbol] = cachedData[symbol]));

			client.queriedSymbols
				.split(',')
				.forEach(symbol => (clientData[symbol] = data[symbol]));

			// const data = `data: ${JSON.stringify(clientData)}\n\n`;
			client.res.write(
				// `data: ${JSON.stringify(data)}\n\n`
				`data: ${JSON.stringify(clientData)}\n\n`
				// specify event type so that frontend can only listen to this type of event
				// `event: ${eventType}\ndata: ${JSON.stringify(clientData)}\n\n`
			);
		});
	}

	static apiHandleEvents = (req, res, next) => {
		const queriedSymbols = req.query.id;

		console.log({queriedSymbols});

		this.eventsHandler(req, res, queriedSymbols);

		// res.json(result);
	};
}
