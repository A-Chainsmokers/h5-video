<template>
	<view class="u-skeleton">
		<navber></navber>
		<view><u-tabs :list="typeList" :current="type" @change="typeChange" name="typeName"></u-tabs></view>
		<view class="video-list-class"><video-list :list="list"></video-list></view>
		<page :currPage="pageResult.current" :totalPage="pageResult.totalPage" @change="pageChange" v-show="list.length !== 0"></page>
		<u-back-top :scroll-top="scrollTop" zIndex="999"></u-back-top>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
		<u-tabbar :list="tabbar" :bg-color="color.background" :border-top="false" :inactive-color="color.inactiveColor" :active-color="color.activeColor"></u-tabbar>
	</view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import VideoList from '../../component/VideoList.vue';
import Navber from '../../component/Navbar.vue';
import Page from '../../component/Page.vue';
import list from '../../store/default/LikeList.json';
export default {
	data() {
		return {
			loading: false,
			type: 0,
			typeList: [],
			list: list,
			scrollTop: 0,
			pageResult: {
				current: 1,
				totalPage: 1,
				pageSize: 21,
				totalCount: 0
			}
		};
	},
	components: {
		navber: Navber,
		'video-list': VideoList,
		page: Page
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	computed: {
		...mapState(['tabbar', 'color']),
		...mapGetters(['getNode', 'getCurrentSelected'])
	},
	onLoad() {
		this.init();
	},
	methods: {
		getTypeList() {
			this.loading = true;
			this.$u
				.get(`${this.getNode}/getTypeList`)
				.then(res => {
					let typeIdList = this.getCurrentSelected.find(item => item.name === this.getNode).list[1];

					let list = res.data;

					list = list.filter(item => typeIdList.findIndex(type => type == item.typeId) !== -1);

					list.unshift({
						name: '全部',
						typeId: '0'
					});

					this.typeList = list;

					this.aggregate();
				})
				.catch(err => {
					this.list = [];
					this.loading = false;
				});
		},
		aggregate() {
			this.loading = true;
			let typeIdList = this.getCurrentSelected.find(item => item.name === this.getNode).list[1];
			let param = {
				typeId: this.typeList[this.type].typeId,
				currPage: this.pageResult.current,
				pageSize: this.pageResult.pageSize,
				defaultSelected:typeIdList.join(",")
			};

			this.$u
				.post(`${this.getNode}/aggregate`, param)
				.then(req => {
					let { currPage, list, pageSize, totalCount, totalPage } = req.data;
					this.list = list;
					this.pageResult.current = currPage;
					this.pageResult.totalCount = totalCount;
					this.pageResult.totalPage = totalPage;
					this.loading = false;
				})
				.catch(err => {
					this.list = [];
					this.loading = false;
				});
		},

		typeChange(value) {
			this.type = value;
			this.pageResult.current = 1;
			this.aggregate();
		},
		init() {
			this.getTypeList();
		},
		pageChange(val) {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 100
			});
			this.pageResult.current = val;
			this.aggregate();
		}
	}
};
</script>

<style scoped>
.tab-class {
	margin: 30rpx;
}
.video-list-class {
	margin: 20rpx;
}
</style>
