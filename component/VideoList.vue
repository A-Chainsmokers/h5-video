<template>
	<view>
		<view v-show="list.length !== 0">
			<u-row gutter="10">
				<u-col span="4" text-align="center" v-for="(item, index) in list" :key="index">
					<view class="video-item" @click="toInfo(item)">
						<image :src="item.vodPic ? item.vodPic : 'https://z3.ax1x.com/2021/08/26/hmHOde.png' "  class="image-class u-skeleton-rect"></image>
						<view class="pic-text-class text-class u-skeleton-rect">{{ item.vodRemarks }}</view>
						<view class="title-class text-class u-skeleton-rect">{{ item.vodName }}</view>
					</view>
				</u-col>
			</u-row>
		</view>
		<view v-show="list.length === 0">
			<view class="empty-class"><u-empty icon-size="180" font-size="30" mode="list" margin-top="180"></u-empty></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		list: {
			type: Array,
			default: () => []
		}
	},
	methods: {
		toInfo(row) {
			this.$u.route('pages/info/index', { id: row.id });
		},
	}
};
</script>

<style scoped>
.video-item {
	margin-top: 20rpx;
	margin-bottom: 15rpx;
	position: relative;
	text-align: center;
}

.pic-text-class {
	border-radius: 10rpx;
	width: 220rpx;
	text-align: left;
	position: absolute;
	z-index: 99;
	bottom: 46rpx;
	left: 0rpx;
	padding: 3px 2px;
	font-size: 13px;
	color: #fff;
	background-repeat: no-repeat;
	background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
}
.text-class {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	-o-text-overflow: ellipsis;
	white-space: nowrap;
}
.image-class {
	height: 300rpx;
	width: 220rpx;
	display: block;
	position: relative;
	border-radius: 6rpx;
}
.title-class {
	margin-top: 10rpx;
	margin-right: 12rpx;
}
.empty-class {
	margin: 30rpx;
}
</style>
