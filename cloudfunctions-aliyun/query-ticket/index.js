'use strict';
const { getData, postData } = require('query-http')
exports.main = async (event, context) => {
	const { url, headers, params } = event || {}
	console.log('---入参数--', event)
	if (params) {
		return await postData(url, headers, params)
	}
	return await getData(url, headers)
};
