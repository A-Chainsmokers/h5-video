<template>
	<view>
		<u-navbar back-text="返回">
			<view class="slot-wrap">
				<view class="search-wrap">
					<!-- 如果使用u-search组件，必须要给v-model绑定一个变量 -->
					<u-search v-model="keyword" :show-action="showAction" height="56" :action-style="{ color: '#fff' }" @search="search"></u-search>
				</view>
				<view class="navbar-right"><view class="right-item" @click="search">搜索</view></view>
			</view>
		</u-navbar>

		<view class="history-list-class" v-show="keyList.length !== 0">
			<u-row :gutter="10" justify="between">
				<u-col :span="6"><text class="search-title-class">搜索记录</text></u-col>
				<u-col :span="4" text-align="right"><u-icon name="trash" size="28" @click="clearKey"></u-icon></u-col>
			</u-row>
			<u-tag
				class="key-item-class"
				v-for="(item, index) in keyList"
				:key="index"
				:text="item.value"
				closeable
				:show="item.show"
				shape="circle"
				type="info"
				@close="delKey(index)"
				@click="tagSearch(index)"
			/>
			<u-divider margin-top="30" @click="more" v-show="moreKey">
				<view slot="">
					<text>查看更多</text>
					<u-icon name="arrow-down"></u-icon>
				</view>
			</u-divider>
		</view>

		<view class="rank-list-class" :show="rank.length !== 0">
			<scroll-view scroll-x="true">
				<view v-for="(item, index) in rank" class="rank-item-class" :key="index">
					<u-card :title="item.name">
						<view slot="body">
							<view v-for="(item, index) in item.list" :key="index" class="link-class">
								<uni-link @click="toSearch(item.title)">{{ `${index + 1} : ${item.title}` }}</uni-link>
							</view>
						</view>
					</u-card>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import UniLink from '../../component/Link.vue';
export default {
	data() {
		return {
			keyword: undefined,
			showAction: false,
			keyList: [],
			rank: [],
			moreKey: false
		};
	},
	components: {
		'uni-link': UniLink
	},
	computed: {
		...mapGetters(['getKeyList', 'getNode'])
	},
	onLoad() {
		this.init();
		this.ranking();
	},
	methods: {
		...mapMutations(['clearKeyList', 'delKeyList', 'setKeyList']),
		clearKey() {
			this.clearKeyList(this.getNode);
			this.keyList = [];
		},
		init() {
			let list = this.hotKeyList();

			if (list.length > 6) {
				list = list.slice(0, 6);
				this.moreKey = true;
			}
			this.keyList = list;
		},
		search() {
			if (!this.keyword) {
				return;
			}

			this.setKeyList({
				value: this.keyword,
				node: this.getNode,
				time: new Date().getTime()
			});

			this.$u.route('/pages/search/index', {
				key: this.keyword
			});
		},
		delKey(index) {
			let param = this.keyList[index];

			this.delKeyList(param);

			this.keyList.splice(index, 1);
		},
		ranking() {
			this.$u
				.get('/hotKey')
				.then(req => {
					this.rank = req.data;
				})
				.catch(err => {});
		},
		tagSearch(index) {
			let item = this.keyList[index];
			this.toSearch(item.value);
		},
		toSearch(title) {
			this.keyword = title;
			this.search();
		},
		more() {
			this.moreKey = false;

			this.keyList = this.hotKeyList();
		},
		hotKeyList() {
			let hotKeyList = [];
			let keyList = this.getKeyList;

			if (keyList) {
				let list = keyList.filter(item => item.node === this.getNode);

				list.forEach(item => {
					hotKeyList.push({
						value: item.value,
						show: true,
						node: item.node
					});
				});
			}
			return hotKeyList;
		}
		//豆瓣ip请求次数
		// creation(type){
		// 	//豆瓣
		// 	return new Promise((resolve, reject) => {
		// 		this.$u
		// 			.get(`https://movie.douban.com/j/search_subjects?type=${type}&tag=热门&page_limit=10&page_start=0`)
		// 			.then(req => {
		// 				resolve({
		// 					name: '电影',
		// 					list: req.subjects
		// 				});
		// 			})
		// 			.catch(err => {
		// 				reject();
		// 			});
		// 	});
		// },
		// ranking() {
		// 	Promise.all([this.creation("tv"), this.creation("movie")]).then(result => {
		// 		this.rank = result.slice();
		// 	});
		// }
	}
};
</script>
<style scoped>
.history-list-class {
	margin-top: 20rpx;
	margin: 20rpx;
}
.search-title-class {
	font-size: 30rpx;
}
.key-item-class {
	margin: 15rpx;
	margin-top: 30rpx;
}
.rank-list-class {
	white-space: nowrap;
}
.rank-item-class {
	text-align: left;
	display: inline-block;
	margin: 25rpx;
	width: 520rpx;
}
.link-class {
	margin: 10rpx;
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	-o-text-overflow: ellipsis;
	white-space: nowrap;
}
</style>

<style lang="scss" scoped>
.slot-wrap {
	display: flex;
	align-items: center;
	flex: 1;
}
.search-wrap {
	margin: 0 20rpx;
	flex: 1;
}
.navbar-right {
	margin-right: 24rpx;
	display: flex;
}

.right-item {
	margin: 0 12rpx;
	position: relative;
	color: #000000;
	display: flex;
}
</style>
