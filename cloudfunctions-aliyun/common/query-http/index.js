const axios = require('axios')
module.exports = {
    async getData (url, headers) {
	const res=await	axios.get(url,{
		headers:{
		...headers
	}})
        // const { data } = res.data || {}
        return res.data
    },
	async postData(url,headers,params){
	const res=await	axios.post(url,params,{
			headers:{
				...headers,
				"Content-Type": "application/x-www-form-urlencoded"
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
		return res.data
		
	}
}
