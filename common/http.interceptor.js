import {baseUrl} from "./env.js"
const install = (Vue, vm) => {
	// 此为自定义配置参数，具体参数见上方说明

	Vue.prototype.$u.http.setConfig({
		baseUrl: `${baseUrl}/video`, // 请求的本域名
		showLoading: true, // 是否显示请求中的loading
		loadingText: 'loading...', // 请求loading中的文字提示
		loadingTime: 500, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
		loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
		// 配置请求头信息
		header: {
			'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
	});
	Vue.prototype.$u.http.interceptor.request = (config) => {
		
		return config
	}
}

export default {
	install
}
