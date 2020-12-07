import Vue from 'vue'
import App from './App'
import Http from './assets/js/http'
import uView from "uview-ui";
import utils from './utils'


Vue.config.productionTip = false
Vue.use(uView)
App.mpType = 'app'

Vue.prototype.$http = Http
Vue.prototype.$utils = utils
const app = new Vue({
	...App
})
app.$mount()
