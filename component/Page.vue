<template>
	<view class="page-class">
		<u-row :gutter="10" justify="between">
			<u-col :span="2">
				<view class="but-class u-skeleton-fillet"><u-button class="left" size="mini" :ripple="true" :disabled="this.currPage === 1" @click="toStart">首页</u-button></view>
			</u-col>
			<u-col :span="2">
				<view class="but-class u-skeleton-fillet">
					<u-button class="left" size="mini" @click="lastPage" :ripple="true" :disabled="this.currPage === 1">
						<u-icon name="arrow-left"></u-icon>
					</u-button>
				</view>
			</u-col>
			<u-col :span="4">
				<view class="page-title-class u-skeleton-fillet">
					<text>第{{ currPage }}页 , 共{{ totalPage }}页</text>
				</view>
			</u-col>
			<u-col :span="2">
				<view class="but-class u-skeleton-fillet">
					<u-button class="right" size="mini" @click="nextPage" :ripple="true" :disabled="this.currPage === this.totalPage">
						<u-icon name="arrow-right"></u-icon>
					</u-button>
				</view>
			</u-col>
			<u-col :span="2">
				<view class="but-class u-skeleton-fillet"><u-button class="right" size="mini" @click="toEnd" :ripple="true" :disabled="this.currPage === this.totalPage">尾页</u-button></view>
			</u-col>
		</u-row>
	</view>
</template>

<script>
export default {
	props: {
		currPage: Number,
		pageSize: Number,
		totalPage: Number
	},
	methods: {
		select(val) {
			this.$emit('change', val);
		},

		nextPage() {
			this.select(this.currPage + 1);
		},
		lastPage() {
			let page = 1;
			if (this.currPage !== 1) {
				page = this.currPage - 1;
			}
			this.select(page);
		},
		toStart() {
			this.select(1);
		},
		toEnd() {
			this.select(this.totalPage);
		}
	}
};
</script>

<style scoped>
.page-class {
	margin-bottom: 30rpx;
}
.page-title-class {
	text-align: center;
}
.but-class {
	text-align: center;
}
</style>
