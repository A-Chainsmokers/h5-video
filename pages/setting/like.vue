<template>
	<view>
		<u-navbar back-text="返回" title="喜好设置" :custom-back="back"></u-navbar>
		<view><u-subsection :list="subsectionList" :current="current" active-color="#f29100" @change="change"></u-subsection></view>
		<view>
			<u-grid :col="3">
				<u-grid-item class="item-class" v-for="(item, index) in list" :key="index" @click="select(item)">
					<u-badge :count="item.count" :offset="[20, 20]" :overflow-count="overflowCount"></u-badge>
					<image
						src="../../static/selected.png"
						:style="{
							top: '14rpx',
							right: '40rpx'
						}"
						style="width: 34rpx;height: 34rpx;"
						class="badge-icon"
						v-show="isSelect(item.typeId)"
					></image>
					<view class="grid-text">{{ item.typeName }}</view>
				</u-grid-item>
			</u-grid>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
export default {
	data() {
		return {
			list: [],
			overflowCount: 9999,
			subsectionList: [
				{
					name: '首页'
				},
				{
					name: '发现'
				},
				{
					name: '搜索'
				}
			],
			current: 0
		};
	},
	mounted() {
		this.getType();
	},
	computed: {
		...mapState(['selectArray']),
		...mapGetters(['getCurrentSelected','getNode']),
		selected() {
			let { list } = this.getCurrentSelected.find(item => item.name === this.getNode);
			return list;
		},
		isSelect() {
			return function(typeId) {
				return this.selected[this.current].findIndex(item => item == typeId) !== -1;
			};
		}
	},

	methods: {
		...mapMutations(['setSelected', 'delSelected']),
		getType() {
			this.$u.get(`${this.getNode}/getTypeList`).then(res => {
				this.list = res.data;
			});
		},
		select(row) {
			let index = this.selected[this.current].findIndex(item => item == row.typeId);

			let params = {
				node: this.getNode,
				current: this.current
			};

			if (index === -1) {
				params.value = row.typeId;
				this.setSelected(params);
			} else {
				if (this.selected[this.current].length === 1) {
					this.$refs.uToast.show({
						title: '必须保留一项',
						type: 'error '
					});
					return;
				}
				params.index = index;
				this.delSelected(params);
			}
		},
		change(val) {
			this.current = val;
		},
		back(){
			uni.reLaunch({
				url: '/pages/personal/index'
			});
		}
	}
};
</script>

<style scoped>
.badge-icon {
	position: absolute;
	top: 20rpx;
	left: 20rpx;
}
.item-class {
	height: 160rpx;
}
</style>
