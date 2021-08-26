import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)
export default new Vuex.Store({
	// 全局属性变量
	state: { // state的作用是定义属性变量。定义一个参数
		node: undefined,
		nodeList: [],
		tabbar: [{
				iconPath: "/static/home.png",
				selectedIconPath: "/static/home-fill.png",
				text: '主页',
				pagePath: "/pages/index/index"
			},
			{
				iconPath: "/static/eye.png",
				selectedIconPath: "/static/eye-fill.png",
				text: '发现',
				pagePath: "/pages/discover/index"
			},
			{
				iconPath: "/static/account.png",
				selectedIconPath: "/static/account-fill.png",
				text: '我的',
				pagePath: "/pages/personal/index"
			},
		],
		color: {
			background: '#03022f',
			inactiveColor: '#D9D5D5',
			activeColor: '#FFA44C'
		},
		selectArray: [],
		historyList: [],
		keyList: []
	},
	mutations: {
		setNode(state, node) {
			state.node = node;
			uni.setStorageSync('node', state.node)
		},
		setSelectArray(state, selectArray) {
			state.selectArray = selectArray
			uni.setStorageSync('selectArray', state.selectArray)
		},
		setNodeList(state, nodeList) {
			state.nodeList = nodeList
			uni.setStorageSync('nodeList', state.nodeList)
		},
		setKeyList(state, key) {
			let list = uni.getStorageSync('keyList')
			if (!list) {
				state.keyList = []
				state.keyList.push(key)
			} else {
				let index = list.findIndex(item => item.node === key.node && item.value === key.value)

				if (index !== -1) {
					list.splice(index, 1);
				}

				list.push(key);

				state.keyList = list.sort((a, b) => {
					return b.time - a.time;
				});
			}
			uni.setStorageSync('keyList', state.keyList)
		},

		delKeyList(state, param) {
			let list = uni.getStorageSync('keyList')

			let index = list.findIndex(item => item.node === param.node && item.value === param.value);

			if (index !== -1) {
				list.splice(index, 1);

				state.keyList = list

				uni.setStorageSync('keyList', state.keyList)
			}
		},

		clearKeyList(state, node) {
			let list = uni.getStorageSync('keyList');

			let array = list.filter(item => item.node === node);

			array.forEach(del => {

				let index = list.findIndex(item => item.node === del.node && item.value === del.value);

				if (index !== -1) {
					list.splice(index, 1);
				}
			})

			state.keyList = list

			uni.setStorageSync('keyList', state.keyList)
		},


		setHistory(state, history) {
			let list = uni.getStorageSync('historyList')
			if (!list) {
				state.historyList = []
				state.historyList.push(history)
			} else {
				let index = list.findIndex(item => item.node === history.node && item.vodId === history.vodId)

				if (index === -1) {
					list.push(history);
				} else {
					list[index] = history
				}
				state.historyList = list.sort((a, b) => {
					return b.time - a.time;
				});
			}
			uni.setStorageSync('historyList', state.historyList)
		},

		delHistory(state, param) {
			let list = uni.getStorageSync('historyList')

			let index = list.findIndex(item => item.node === param.node && item.vodId === param.vodId);

			if (index !== -1) {
				list.splice(index, 1);

				state.historyList = list

				uni.setStorageSync('historyList', state.historyList)
			}
		},
		clearHistory(state, node) {
			let list = uni.getStorageSync('historyList');

			let array = list.filter(item => item.node === node);

			array.forEach(del => {

				let index = list.findIndex(item => item.node === del.node && item.vodId === del.vodId);

				if (index !== -1) {
					list.splice(index, 1);
				}
			})

			state.historyList = list

			uni.setStorageSync('historyList', state.historyList)
		},
		setSelected(state, params) {

			let selected = uni.getStorageSync('selectArray')

			let _index = selected.findIndex(item => item.name === params.node)

			let item = {
				...selected[_index]
			}

			item.list[params.current].push(params.value);

			selected[_index] = item

			state.selectArray = selected

			uni.setStorageSync('selectArray', selected)
		},
		delSelected(state, params) {
			let selected = uni.getStorageSync('selectArray')

			let _index = selected.findIndex(item => item.name === params.node)

			let item = {
				...selected[_index]
			}

			item.list[params.current].splice(params.index, 1)

			selected[_index] = item

			state.selectArray = selected

			uni.setStorageSync('selectArray', selected)
		}
	},
	getters: {
		getNode: state => {
			state.node = uni.getStorageSync('node')
			return state.node
		},
		getNodeList: (state) => {
			state.nodeList = uni.getStorageSync('nodeList')
			return state.nodeList
		},
		getTabbar: state => {
			return state.tabbar
		},
		getSelected: (state) => {
			return state.selectArray
		},
		getCurrentSelected: (state) => {
			state.selectArray = uni.getStorageSync('selectArray')
			return state.selectArray
		},
		getHistoryList: (state) => {
			state.historyList = uni.getStorageSync('historyList')
			return state.historyList
		},
		getKeyList: (state) => {
			state.keyList = uni.getStorageSync('keyList')
			return state.keyList
		}
	}
})
