<template>
	<text
		class="u-link"
		@tap.stop="click"
		:style="{
			color: color,
			fontSize: fontSize + 'rpx',
			borderBottom: underLine ? `1px solid ${lineColor ? lineColor : color}` : 'none',
			paddingBottom: underLine ? '0rpx' : '0'
		}"
	>
		<slot></slot>
	</text>
</template>
<script>
export default {
	props: {
		// 文字颜色
		color: {
			type: String,
			default: '#000000'
		},
		// 字体大小，单位rpx
		fontSize: {
			type: [String, Number],
			default: 28
		},
		// 是否显示下划线
		underLine: {
			type: Boolean,
			default: false
		},
		// 要跳转的链接
		href: {
			type: String,
			default: ''
		},

		// 下划线颜色
		lineColor: {
			type: String,
			default: ''
		}
	},
	methods:{
		click(){
			this.$emit("click");
		}
	}
};
</script>

<style lang="scss" scoped>

.u-link {
	line-height: 1;
}
</style>
