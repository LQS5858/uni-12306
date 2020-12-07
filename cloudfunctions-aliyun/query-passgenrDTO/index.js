'use strict';
const { getPassengerInfo } = require('query-http')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const { REPEAT_SUBMIT_TOKEN } = event || {}
	return await getPassengerInfo(REPEAT_SUBMIT_TOKEN)
};
