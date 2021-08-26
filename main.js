import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import httpInterceptor from '@/common/http.interceptor.js'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import store from "./store"

Vue.prototype.$store = store;

Vue.use(uView);
Vue.use(httpInterceptor, app)
Vue.config.productionTip = false

App.mpType = 'app'


const app = new Vue({
	...App,
	store
})
app.$mount()
