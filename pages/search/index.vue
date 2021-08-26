<template>
	<view class="u-skeleton">
		<navber :backShow="true"></navber>
		<view class="keyWord-title u-skeleton-fillet">
			<text style="font-size: 38rpx; color: red;">{{ keyWord }}</text>
			<text>{{ `:  查询到${totalCount}条记录` }}</text>
		</view>
		<view v-show="list.length !== 0">
			<view v-for="(item, index) in list" :key="index">
				<view class="video-info">
					<u-row :gutter="10">
						<u-col :span="6">
							<view class="cover-class u-skeleton-fillet"><image class="image-class" :src="item.img"></image></view>
						</u-col>
						<u-col :span="6">
							<view class="describe-class">
								<view class="describe-item-class describe-title-class">
									<text class="u-skeleton-fillet">{{ item.title }}</text>
									<!-- <text class="font-class u-skeleton-fillet">{{ item.text }}</text> -->
								</view>
								<view v-for="(item, index) in item.describe" :key="index" class="describe-item-class">
									<u-row :gutter="5">
										<u-col :span="4" class="u-skeleton-fillet">{{ item.muted }}</u-col>
										<u-col :span="6" class="u-skeleton-fillet">
											<text class="text-class">{{ item.join }}</text>
										</u-col>
									</u-row>
								</view>
								<view class="to-but-class u-skeleton-fillet"><u-button size="mini" :ripple="true" type="warning" @click="toInfo(item.id)">立即播放</u-button></view>
							</view>
						</u-col>
					</u-row>
				</view>
			</view>
			<!-- 分页 -->
			<page :currPage="pageResult.current" :totalPage="pageResult.totalPage" @change="pageChange" v-show="list.length !== 0"></page>
			<u-back-top :scroll-top="scrollTop"></u-back-top>
		</view>
		<view v-show="list.length === 0">
			<view class="empty-class"><u-empty icon-size="180" font-size="30" mode="list" margin-top="180"></u-empty></view>
		</view>
		<view><u-line color="#ffffff" /></view>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import Page from '../../component/Page.vue';
import Navber from '../../component/Navbar.vue';
import list from '../../store/default/SearchResult.json';
export default {
	data() {
		return {
			loading: false,
			scrollTop: 0,
			keyWord: undefined,
			color: {
				background: '#4c2335',
				inactiveColor: '#D9D5D5',
				activeColor: '#FFA44C'
			},
			pageResult: {
				current: 1,
				totalPage: 1,
				pageSize: 10
			},
			list: list,
			count: 5,
			totalCount: 0
		};
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	computed: {
		...mapGetters(['getNode'])
	},
	components: {
		navber: Navber,
		page: Page
	},
	onLoad(option) {
		this.keyWord = option.key;
		this.search();
	},
	methods: {
		search() {
			this.loading = true;
			this.$u
				.get(`${this.getNode}/search`, { key: this.keyWord, currPage: this.pageResult.current, pageSize: this.pageResult.pageSize })
				.then(req => {
					let { list, totalPage, currPage, totalCount } = req.data;
					this.list = list;
					this.pageResult.totalPage = totalPage;
					this.pageResult.current = currPage;
					this.totalCount = totalCount;
					this.loading = false;
				})
				.catch(res => {
					this.list = [];
					this.loading = false;
				});
		},
		pageChange(val) {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 100
			});
			this.pageResult.current = val;
			this.search();
		},
		toInfo(id) {
			this.$u.route('pages/info/index', { id: id });
		}
	}
};
</script>

<style scoped>
.video-list-class {
	margin: 20rpx;
	margin-top: 50rpx;
}
.video-info {
	margin: 20rpx;
}
.image-class {
	height: 400rpx;
	width: 300rpx;
	border-radius: 10rpx; 
}
.describe-item-class {
	margin: 10rpx;
}
.describe-title-class {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
}
.describe-class {
	font-size: 30rpx;
}
.text-class {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.font-class {
	margin-left: 20rpx;
	color: #f1225a;
	font-size: 15px;
	font-weight: 600;
}
.card-title-class {
	text-align: center;
}
.but-class {
	margin: 10rpx;
	text-align: center;
}
.to-but-class {
	margin: 15rpx;
	text-align: left;
}
.keyWord-title {
	margin: 20rpx;
}
</style>
