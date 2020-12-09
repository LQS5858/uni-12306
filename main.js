import Vue from 'vue'
import App from './App'
import Http from './assets/js/http'
import utils from './utils'


Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$http = Http
Vue.prototype.$utils = utils
const app = new Vue({
	...App
})
app.$mount()
