'use strict';
const axios = require('axios')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	
const res=await	axios.post('https://kyfw.12306.cn/otn/login/checkUser',  {  _json_att: null } , {
		headers:{
			'Content-Type': "application/x-www-form-urlencoded",
			"Cookie":'JSESSIONID=120E07788C2F4D1195FCFE4CF7534223; tk=PjxBWx3DCJaxeL9UfXy7-YLV5Zp5Za0N8P5m0QkoL1L0; BIGipServerotn=1675165962.50210.0000; BIGipServerpassport=786956554.50215.0000; route=c5c62a339e7744272a54643b3be5bf64; current_captcha_type=Z; BIGipServerportal=3168010506.16671.0000; _jc_save_wfdc_flag=dc; _jc_save_fromStation=%u6DF1%u5733%2CSZQ; _jc_save_toStation=%u7941%u9633%u5317%2CQVQ; _jc_save_toDate=2020-12-02; RAIL_EXPIRATION=1607224614130; RAIL_DEVICEID=ejaFamwVlvOqT88DNSBzCf681V8DlUZosygCagbEhnwHMFyj6TP7LwHzssXuGARcUicToDKJ81vnKUzf_-F1176FIXp5CCUb6iMs6UkCV0uR_Te76GtLP7HzGpi43HoQQR-aH2hVF6lc_oabNDk06p69gV_stQB1; uKey=a7497e4d81c2e6dc723d6b52ffeb2dc44e4c3525d6002b54901b00f6a5667ff7; _jc_save_fromDate=2020-12-03',
			"User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
		},
		transformRequest: [
		                                           function (data) {
		                                               let ret = "";
		                                               for (let it in data) {
		                                                   ret +=
		                                                       encodeURIComponent(it) +
		                                                       "=" +
		                                                       encodeURIComponent(data[it]) +
		                                                       "&";
		                                               }
		                                               return ret;
		                                           }
		                                       ]
	})
	//返回数据给客户端
	return res.data
};
