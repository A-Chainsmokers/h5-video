<template>
	<view class="text-class  u-skeleton-rect">
		<u-navbar
			:is-back="backShow"
			:back-text-style="{ display: 'flex' }"
			back-icon-name="home"
			back-icon-size="60"
			back-icon-color="#ffffff"
			height="55"
			:background="background"
			:custom-back="toHome"
		>
			<view class="slot-wrap  u-skeleton-rect">
				<view class="search-wrap"><u-search shape="round" v-model="keyword" :clearabled="true" :show-action="false" @focus="toSearch"></u-search></view>
			</view>
			<view slot="right" class="map-wrap" @click="show = true">
				<text class="map-wrap-text">{{ getNodeName }}</text>
				<u-icon name="arrow-down-fill" color="#ffffff" size="22"></u-icon>
			</view>
		</u-navbar>
		<u-action-sheet :list="nodeList" @click="switchover" v-model="show"></u-action-sheet>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	props: {
		backShow: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			keyword: undefined,
			show: false,
			background: {
				background: '#03022f'
			}
		};
	},
	computed: {
		...mapState(['node', 'nodeList']),
		getNodeName(){
			let {text} = this.nodeList.find(item => item.node === this.node)

			return text || this.node;
		}
	},
	methods: {
		...mapMutations(['setNode']),
		toSearch(val) {
			this.$u.route('/pages/search/search');
		},
		toHome() {
			uni.reLaunch({
				url: '/pages/index/index'
			});
		},
		switchover(index) {
			let { node } = this.nodeList[index];

			this.setNode(node);

			uni.reLaunch({
				url: '/pages/index/index'
			});
		}
	}
};
</script>

<style scoped>
.search-wrap {
	margin: 0 20rpx;
	flex: 1;
}
.slot-wrap {
	display: flex;
	align-items: center;
	flex: 1;
	margin: 20rpx;
}
.list-class {
	margin-right: 24rpx;
	display: flex;
}
.map-wrap {
	display: flex;
	align-items: center;
	padding: 4px 6px;
	background-color: rgba(240, 240, 240, 0.35);
	color: #fff;
	border-radius: 100rpx;
	margin-top: 6rpx;
	margin-right: 20rpx;
}

.map-wrap-text {
	padding: 0 6rpx;
}
</style>
