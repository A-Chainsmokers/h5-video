<template>
	<view class="content-class"><web-view ref="player" class="player-class" :src="url"></web-view></view>
</template>

<script>
export default {
	props: {
		url: undefined
	},
	data() {
		return {};
	},
	mounted() {
		// console.log(this.$refs.player.iframe);
	},
	methods: {}
};
</script>

<style scoped>
.content-class {
	height: 250px;
}
.player-class {
	margin-top: 54px;
	height: 250px;
}
</style>
