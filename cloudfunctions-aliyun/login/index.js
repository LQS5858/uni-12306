'use strict';
const {
	test
} = require('test')

const db = uniCloud.database() //连接数据库

exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	// const collection = db.collection('userData')

	// const res = await collection.add(event)
	//返回数据给客户端
	// if (res) {
	// 	return {
	// 		status: 'success'
	// 	}
	// } else {
	// 	return {
	// 		status: 'fail'
	// 	}
	// }
	const tt = test()
	console.log('---获取结果--', tt);
	return tt
};
