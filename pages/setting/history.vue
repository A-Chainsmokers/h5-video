<template>
	<view class="content">
		<u-navbar back-text="返回" title="观看历史" :custom-back="back"><view slot="right" class="right-class" @click="clear">清空</view></u-navbar>
		<view>
			<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in list" :key="item.id" @click="click" @open="open" :options="options">
				<view class="item u-border-bottom">
					<image mode="aspectFill" :src="item.img" />
					<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
					<view class="title-wrap">
						<view class="item-class">
							<text class="title u-line-2">{{ item.title }}</text>
							<u-circle-progress class="progress-class" active-color="#2979ff" :percent="item.progress">
								<view class="u-progress-content">
									<view class="u-progress-dot"></view>
									<text class="u-progress-info">{{ `${item.progress}%` }}</text>
								</view>
							</u-circle-progress>
						</view>
					</view>
				</view>
			</u-swipe-action>
		</view>
	</view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
	data() {
		return {
			list: [],
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			]
		};
	},
	computed: {
		...mapGetters(['getHistoryList', 'getNode'])
	},
	onLoad() {
		this.init();
	},
	methods: {
		...mapMutations(['delHistory', 'clearHistory']),
		init() {
			let historyList = this.getHistoryList.filter(item => item.node === this.getNode);

			historyList.forEach(item => {
				this.list.push({
					img: item.img,
					title: item.title,
					progress: Math.floor((item.currentTime / item.duration) * 100),
					id: item.id,
					vodId: item.vodId,
					show: false,
					node: item.node
				});
			});
		},
		click(index) {
			let param = this.list[index];

			this.delHistory(param);
			
			this.list.splice(index, 1);

			// this.init();
		},
		open(index) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			this.list[index].show = true;
			this.list.map((val, idx) => {
				if (index != idx) this.list[idx].show = false;
			});
		},
		back() {
			uni.reLaunch({
				url: '/pages/personal/index'
			});
		},
		clear() {
			this.clearHistory(this.getNode);
			this.list = [];
		}
	}
};
</script>

<style scoped>
.content {
}
.right-class {
	margin-right: 30rpx;
}
.item {
	display: flex;
	padding: 20rpx;
	margin: 0 20rpx;
}

image {
	width: 200rpx;
	flex: 0 0 200rpx;
	height: 320rpx;
	margin-right: 20rpx;
	border-radius: 12rpx;
}

.title {
	text-align: center;
	font-size: 30rpx;
	color: $u-content-color;
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	-o-text-overflow: ellipsis;
	white-space: nowrap;
}
.item-class {
	margin: 20rpx;
	margin-left: 50rpx;
}
.progress-class {
	margin-top: 30rpx;
}
</style>
<style lang="scss" scoped>
.u-progress-content {
	display: flex;
	align-items: center;
	justify-content: center;
}

.u-progress-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	background-color: #fb9126;
}

.u-progress-info {
	font-size: 28rpx;
	padding-left: 16rpx;
	letter-spacing: 2rpx;
}
</style>
