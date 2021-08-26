<template>
	<view><view id="xgplayer"></view></view>
</template>

<script>
import Player from 'xgplayer';
import HlsJsPlayer from 'xgplayer-hls.js';
export default {
	data() {
		return {
			config: {
				id: 'xgplayer',
				url: undefined,
				lang: 'zh-cn',
				width: '100%',
				height: '100%',
				autoplay: false,
				videoInit: true,
				screenShot: true,
				keyShortcut: 'off',
				crossOrigin: true,
				cssFullscreen: true,
				defaultPlaybackRate: 1,
				playbackRate: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
				playPrev: true,
				playNextOne: true,
				videoStop: true,
				showList: true,
				showHistory: true,
				quitMiniMode: true,
				videoTitle: true,
				airplay: true,
				closeVideoTouch: true,
				ignores: ['replay', 'error'], // 为了切换播放器类型时避免显示错误刷新，暂时忽略错误
				preloadTime: 300,
				cors: true
			}
		};
	},
	props: {
		videoConfig: {
			type: Object,
			default: () => {}
		}
	},

	watch: {
		videoConfig: {
			handler(new_value, old_value) {
				this.init();
			},
			deep: true
		}
	},

	methods: {
		init() {
			console.log('初始化...');
			if (this.videoConfig.url && this.videoConfig.type) {
				this.config.url = this.videoConfig.url;
				switch (this.videoConfig.type.toUpperCase()) {
					case 'm3u8'.toUpperCase():
						this.xg = new Player(this.config);
						break;
					case 'mp4'.toUpperCase():
						this.xg = new Player(this.config);
						break;
					default:
						break;
				}
				if (this.xg) {
					this.xg.on('getFullscreen', () => {
						console.log('全屏');
					});
					this.xg.on('exitCssFullscreen', () => {
						console.log('退出');
					});
				}
			}
		}
	},
	beforeDestroy() {
		console.log('销毁!');
		if (this.xg !== null) {
			this.xg.destroy();
		}
	}
};
</script>

<style></style>
