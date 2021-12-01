module.exports = {
	globalSetup: './test/config/setup.js',
	globalTeardown: './test/config/teardown.js',
	testEnvironment: './test/config/mongoEnvironment',
	testMatch: ['**/db-connection.test.js'],
	// testMatch: ['**/circle-ci.test.js'],
};
