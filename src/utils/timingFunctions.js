// helper function to wait in async function till ms have passed
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// helper function to wait till time has reached a certain second (e.g. 10 --> async function will await till 01:30:10, 01:31:10, etc.)
export const waitTillSecond = async timeSecond => {
	const second = new Date().getSeconds();
	const delay = (60 - second + timeSecond) * 1000;

	await sleep(delay);
};
