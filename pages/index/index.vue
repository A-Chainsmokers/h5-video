<template>
	<view class="content u-skeleton" :style="{ background: `-webkit-linear-gradient(top, ${color.background} 100px, #ffffff 15%)` }">
		<navber></navber>
		<video-swiper :swiperList="banner"></video-swiper>

		<view class="video-list-class" v-for="(item, index) in list" :key="index">
			<u-card :show-head="false" padding="0" margin="15rpx" border-radius="10" box-shadow="0 2px 12px 0 rgb(0 0 0 / 20%)" :border="false">
				<view slot="body" class="video-item">
					<u-section :title="item.typeName" :right="false" class="u-skeleton-rect"></u-section>
					<video-list :list="item.videoList"></video-list>
				</view>
			</u-card>
		</view>
		<u-back-top :scroll-top="scrollTop" zIndex="999"></u-back-top>

		<u-skeleton :loading="loading" el-color="#ddd" bg-color="#fff" :animation="true"></u-skeleton>
		<u-tabbar :list="tabbar" :bg-color="color.background" :border-top="false" :inactive-color="color.inactiveColor" :active-color="color.activeColor"></u-tabbar>
	</view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Navber from '../../component/Navbar.vue';
import VideoSwiper from '../../component/VideoSwiper.vue';
import VideoList from '../../component/VideoList.vue';
import banner from '../../store/default/Banner.json';
import list from '../../store/default/VideoList.json';

export default {
	data() {
		return {
			title: 'Hello',
			banner: banner,
			list: list,
			loading: false,
			scrollTop: 0
		};
	},
	components: {
		navber: Navber,
		'video-swiper': VideoSwiper,
		'video-list': VideoList
	},
	mounted() {
		this.init();
	},
	computed: {
		...mapState(['tabbar', 'color']),
		...mapGetters(['getNode', 'getCurrentSelected'])
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		init() {
			this.loading = true;

			let like = undefined;

			let _list = this.getCurrentSelected.find(item => item.name === this.getNode);
			if (_list) {
				let typeList = this.getCurrentSelected.find(item => item.name === this.getNode).list[0];

				like = typeList.join(',');
			}

			this.$u
				.get(`${this.getNode}/init`, { like: like })
				.then(req => {
					let { banner, list } = req.data;
					this.banner = banner;
					this.list = list;
					this.loading = false;
				})
				.catch(res => {
					this.loading = false;
					this.banner = [];
					this.list = [];
				});
		}
	}
};
</script>

<style scoped>
.video-list-class {
	margin-bottom: 30rpx;
}
.video-item {
	margin: 15rpx;
	margin-top: 20rpx;
}
</style>
