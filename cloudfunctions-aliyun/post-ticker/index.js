'use strict';
const https = require('https')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const data = await https.get('https://kyfw.12306.cn/otn/confirmPassenger/initDc')
	//返回数据给客户端
	console.log('--返回结果--', data);
	return data
};

