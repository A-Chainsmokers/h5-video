<template>
	<view>
		<image src="https://api.dujin.org/bing/m.php" style="position: absolute; right: 0px; width: 100%; height: 100%; filter: blur(200px) brightness(60%);" mode=""></image>
		<view class="personal">
			<view class="personal-main">
				<u-avatar :src="avatar" mode="square" size="120" class="u-avatar" :show-level="true"></u-avatar>
				<view class="personal-info">
					<view class="user-name-class">{{ `游客_${name}` }}</view>
					<view class="user-info-class">{{ id }}</view>
				</view>
			</view>
			<!-- <u-icon name="arrow-right" size="30" class="p-right-icon"></u-icon> -->
		</view>

		<view class="history-list-class" v-show="historyList.length !== 0">
			<u-section title="历史记录" sub-title="查看更多" @click="toHistory"></u-section>
			<scroll-view scroll-x="true">
				<view v-for="(item, index) in historyList" class="history-item-class" :key="index">
					<view class="video-item" @click="info(item)">
						<image :src="item.img" class="image-class"></image>
						<view class="pic-text-class"><u-line-progress :percent="item.progress" :round="false" height="23"></u-line-progress></view>
					</view>
					<text class="title-class">{{ item.title }}</text>
				</view>
			</scroll-view>
		</view>

		<view class="n-p" v-for="(item, index) in list" :key="index" hover-class="hover-class" @click="onClick(item)">
			<view style="position: relative">
				<view class="p-left"><u-icon :name="item.icon" size="35" color="#757575"></u-icon></view>
			</view>
			<view class="p-right">
				<view class="p-right-main">
					<view class="p-right-main-name">{{ item.name }}</view>
				</view>

				<view class="lfet-a">
					<view style="position: relative"></view>
					<u-icon name="arrow-right" size="30" class="p-right-icon"></u-icon>
				</view>
			</view>
		</view>
		<u-tabbar :list="tabbar" :bg-color="color.background" :border-top="false" :inactive-color="color.inactiveColor" :active-color="color.activeColor"></u-tabbar>
	</view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
	data() {
		return {
			id: this.$u.guid(8, false, 10),
			name: this.$u.guid(6, false, 62),
			avatar: 'https://api.dujin.org/bing/m.php',
			list: [
				{
					name: '喜好设置',
					id: 'like',
					icon: 'star',
					iconBackground: '#398c0c'
				}
			],
			historyList: []
		};
	},
	computed: {
		...mapState(['tabbar', 'color']),
		...mapGetters(['getHistoryList', 'getNode'])
	},
	onLoad() {
		this.init();
	},
	methods: {
		onClick(item) {
			this.$u.route(`/pages/setting/${item.id}`);
		},
		info(item) {
			this.$u.route('/pages/video/index', {
				id: item.id,
				vodId: item.vodId
			});
		},
		init() {
			if (this.getHistoryList) {
				let list = this.getHistoryList.filter(item => item.node === this.getNode);
				list.forEach(item => {
					this.historyList.push({
						img: item.img,
						title: item.title,
						progress: Math.floor((item.currentTime / item.duration) * 100),
						id: item.id,
						vodId: item.vodId
					});
				});
			}
		},
		toHistory() {
			this.$u.route('/pages/setting/history');
		}
	}
};
</script>

<style scoped>
.history-item-class {
	text-align: center;
	display: inline-block;
	margin: 30rpx;
	width: 320rpx;
}
.history-list-class {
	white-space: nowrap;
}
page {
	background-color: #f7f7f7;
}
.personal {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx 0 40rpx 30rpx;
	margin-top: 100rpx;
}

.personal-main {
	display: flex;
	align-items: center;
}

.personal-info {
	display: flex;
	flex-direction: column;
}

.u-avatar {
	margin-right: 30rpx;
}

.navbar-right {
	padding: 0 40rpx;
}

.navbar-right-icon {
	margin-left: 50rpx;
}

.hover-class {
	background-color: #efefef;
}

.n-p {
	display: flex;
	align-items: center;
	background-color: #ffffff;
	margin-bottom: 20rpx;
}

.p-right-icon {
	padding: 0 40rpx;
}

.p-left {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 50rpx;
	height: 50rpx;
	margin: 20rpx;
	color: #ffffff;
	border-radius: 10rpx;
}

.p-right {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.p-right-main-name {
	font-size: 30rpx;
	font-weight: 500;
}
.user-name-class {
	margin-bottom: 20rpx;
}

.pic-text-class {
	width: 100%;
	position: absolute;
	z-index: 999;
	bottom: 0rpx;
	left: 0rpx;
	padding: 3px 2px;
	font-size: 13px;
	color: #fff;
	background-repeat: no-repeat;
	background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
}
.video-item {
	margin-top: 20rpx;
	margin-bottom: 20rpx;
	position: relative;
	text-align: center;
}
.image-class {
	height: 400rpx;
	width: 320rpx;
	display: block;
	position: relative;
	border-radius: 10rpx;
}
.title-class {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	-o-text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
