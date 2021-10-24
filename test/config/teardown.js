export default async function () {
	console.log('Teardown Mongo Connection');
	delete global.stockClient;
	delete global.stockDB;
}
