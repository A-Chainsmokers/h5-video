<template>
	<view id="videomonitoring">
		<view>
			<view style="height:250px"><view class="prism-player" :id="playerId" :style="playStyle"></view></view>
		</view>
	</view>
</template>
<script>
export default {
	// 在vue中怎么使用Aliplayer
	name: 'Aliplayer',
	props: {
		url: {
			type: String,
			default: undefined
		},
		type: {
			type: String,
			default: 'm3u8'
		}
	},
	data() {
		return {
			reading: false,
			playerId:
				'aliplayer_' +
				Math.random()
					.toString(36)
					.substr(2),
			playStyle: '',
			scriptTagStatus: 0,
			isReload: false,
			instance: null,
			config: {
				id: undefined,
				aliplayerSdkPath: 'https://g.alicdn.com/de/prismplayer/2.9.8/aliplayer-h5-min.js',
				autoplay: false,
				isLive: false,
				playsinline: true,
				width: '100%',
				height: '250px',
				controlBarVisibility: 'click',
				useH5Prism: true,
				useFlashPrism: false,
				vid: '',
				playauth: '',
				source: undefined,
				cover: undefined,
				format: undefined,
				x5_video_position: 'top',
				x5_type: 'h5',
				x5_fullscreen: false,
				x5_orientation: 'landscape',
				x5LandscapeAsFullScreen: true,
				autoPlayDelay: 0,
				autoPlayDelayDisplayText: '请稍后...',
				diagnosisButtonVisible: false,
				keyFastForwardStep: 5,
				skinLayout: [
					{ name: 'bigPlayButton', align: 'blabs', x: 30, y: 80 },
					{
						name: 'H5Loading',
						align: 'cc'
					},
					{ name: 'errorDisplay', align: 'tlabs', x: 0, y: 0 },
					{ name: 'infoDisplay' },
					{ name: 'tooltip', align: 'blabs', x: 0, y: 56 },
					{ name: 'thumbnail' },
					{
						name: 'controlBar',
						align: 'blabs',
						x: 0,
						y: 0,
						children: [
							{ name: 'progress', align: 'blabs', x: 0, y: 44 },
							{ name: 'playButton', align: 'tl', x: 15, y: 12 },
							{ name: 'timeDisplay', align: 'tl', x: 10, y: 7 },
							{ name: 'fullScreenButton', align: 'tr', x: 10, y: 12 },
							{ name: 'setting', align: 'tr', x: 15, y: 12 },
							{ name: 'volume', align: 'tr', x: 5, y: 10 }
						]
					}
				],
				playSkin: [
					{
						name: 'bigPlayButton',
						align: 'blabs',
						x: 30,
						y: 80
					},
					{
						name: 'controlBar',
						align: 'blabs',
						x: 0,
						y: 0,
						children: [
							{
								name: 'progress',
								align: 'tlabs',
								x: 0,
								y: 0
							},
							{
								name: 'playButton',
								align: 'tl',
								x: 15,
								y: 26
							},
							{
								name: 'nextButton',
								align: 'tl',
								x: 10,
								y: 26
							},
							{
								name: 'timeDisplay',
								align: 'tl',
								x: 10,
								y: 24
							},
							{
								name: 'fullScreenButton',
								align: 'tr',
								x: 10,
								y: 25
							},
							{
								name: 'streamButton',
								align: 'tr',
								x: 10,
								y: 23
							},
							{
								name: 'volume',
								align: 'tr',
								x: 10,
								y: 25
							}
						]
					},
					{
						name: 'fullControlBar',
						align: 'tlabs',
						x: 0,
						y: 0,
						children: [
							{
								name: 'fullTitle',
								align: 'tl',
								x: 25,
								y: 6
							},
							{
								name: 'fullNormalScreenButton',
								align: 'tr',
								x: 24,
								y: 13
							},
							{
								name: 'fullTimeDisplay',
								align: 'tr',
								x: 10,
								y: 12
							},
							{
								name: 'fullZoom',
								align: 'cc'
							}
						]
					}
				]
			}
		};
	},
	watch: {
		url(newVal) {
			if (!window.Aliplayer) {
				// 如果全局对象存在，说明编辑器代码已经初始化完成，直接加载编辑器
				this.scriptTagStatus = 2;
				this.initAliplayer();
			} else {
				// 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码
				this.insertScriptTag();
			}
		}
	},
	created() {
		if (window.Aliplayer !== undefined) {
			// 如果全局对象存在，说明编辑器代码已经初始化完成，直接加载编辑器
			this.scriptTagStatus = 2;
			this.initAliplayer();
		} else {
			// 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码
			this.insertScriptTag();
		}
	},
	mounted() {
		if (window.Aliplayer !== undefined) {
			// 如果全局对象存在，说明编辑器代码已经初始化完成，直接加载编辑器
			this.scriptTagStatus = 2;
			this.initAliplayer();
		} else {
			// 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码
			this.insertScriptTag();
		}
	},
	methods: {
		insertScriptTag() {
			const _this = this;
			let playerScriptTag = document.getElementById('playerScriptTag');
			// 如果这个tag不存在，则生成相关代码tag以加载代码
			if (playerScriptTag === null) {
				playerScriptTag = document.createElement('script');
				playerScriptTag.type = 'text/javascript';
				playerScriptTag.src = this.config.aliplayerSdkPath;
				playerScriptTag.id = 'playerScriptTag';
				let s = document.getElementsByTagName('head')[0];
				s.appendChild(playerScriptTag);
			}
			if (playerScriptTag.loaded) {
				_this.scriptTagStatus++;
			} else {
				playerScriptTag.addEventListener('load', () => {
					_this.scriptTagStatus++;
					playerScriptTag.loaded = true;
					_this.initAliplayer();
				});
			}
			_this.initAliplayer();
		},
		initAliplayer() {
			const _this = this;

			this.config.id = this.playerId;

			// scriptTagStatus 为 2 的时候，说明两个必需引入的 js 文件都已经被引入，且加载完成
			if ((_this.scriptTagStatus === 2 && (_this.instance === null || _this.reloadPlayer())) || (_this.url && _this.type)) {
				_this.instance && _this.instance.dispose();
				// console.log(document.querySelector("#" + _this.playerId));

				_this.config.source = _this.url;
				_this.config.format = _this.type;

				// document.querySelector("#" + _this.playerId).innerHTML = "";
				// Vue 异步执行 DOM 更新，这样一来代码执行到这里的时候可能 template 里面的 script 标签还没真正创建
				// 所以，我们只能在 nextTick 里面初始化 Aliplayer
				_this.$nextTick(() => {
					try {
						_this.instance = window.Aliplayer(_this.config);
						// 绑定事件，当 AliPlayer 初始化完成后，将编辑器实例通过自定义的 ready 事件交出去
						_this.instance.on('ready', () => {
							if (!this.reading) {
								this.reading = this.getStatus() === 'ready';

								this.$emit('reading', this.reading);
							}

							this.$emit('ready', _this.instance);
						});
						_this.instance.on('play', () => {
							this.$emit('play', _this.instance);
						});
						_this.instance.on('pause', () => {
							this.$emit('pause', _this.instance);
						});
						_this.instance.on('ended', () => {
							this.$emit('ended', _this.instance);
						});
						_this.instance.on('liveStreamStop', () => {
							this.$emit('liveStreamStop', _this.instance);
						});
						_this.instance.on('m3u8Retry', () => {
							this.$emit('m3u8Retry', _this.instance);
						});
						_this.instance.on('hideBar', () => {
							this.$emit('hideBar', _this.instance);
						});
						_this.instance.on('waiting', () => {
							this.$emit('waiting', _this.instance);
						});
						_this.instance.on('snapshoted', () => {
							this.$emit('snapshoted', _this.instance);
						});

						_this.instance.on('timeupdate', () => {
							_this.$emit('timeupdate', _this.instance);
						});
						_this.instance.on('requestFullScreen', () => {
							console.log('全屏');
							// #ifdef APP-PLUS
							plus.screen.lockOrientation('landscape-primary');
							// #endif
							_this.$emit('requestFullScreen', _this.instance);
						});
						_this.instance.on('cancelFullScreen', () => {
							console.log('取消全屏');
							// #ifdef APP-PLUS
							plus.screen.lockOrientation('portrait-primary');
							// #endif
							_this.$emit('cancelFullScreen', _this.instance);
						});
						_this.instance.on('error', () => {
							_this.$emit('error', _this.instance);
						});
						_this.instance.on('startSeek', () => {
							_this.$emit('startSeek', _this.instance);
						});
						_this.instance.on('completeSeek', () => {
							_this.$emit('completeSeek', _this.instance);
						});
					} catch (e) {
						//捕捉并抛出异常
						console.log('异步执行异常', e.name + '：' + e.message);
					}
				});
			}
		},
		/**
		 * 播放视频
		 */
		play: function() {
			this.instance.play();
		},
		/**
		 * 暂停视频
		 */
		pause: function() {
			this.instance.pause();
		},
		/**
		 * 重播视频
		 */
		replay: function() {
			this.instance.replay();
		},
		/**
		 * 跳转到某个时刻进行播放
		 * @argument time 的单位为秒
		 */
		seek: function(time) {
			this.instance.seek(time);
		},
		getStatus() {
			return this.instance.getStatus();
		},
		/**
		 * 获取当前时间 单位秒
		 */
		getCurrentTime: function() {
			return this.instance.getCurrentTime();
		},
		/**
		 *获取视频总时长，返回的单位为秒
		 * @returns 返回的单位为秒
		 */
		getDuration: function() {
			return this.instance.getDuration();
		},
		/**
             获取当前的音量，返回值为0-1的实数ios和部分android会失效
            */
		getVolume: function() {
			return this.instance.getVolume();
		},
		/**
             设置音量，vol为0-1的实数，ios和部分android会失效
            */
		setVolume: function(vol) {
			this.instance.setVolume(vol);
		},
		/**
		 *直接播放视频url，time为可选值（单位秒）目前只支持同种格式（mp4/flv/m3u8）之间切换暂不支持直播rtmp流切换
		 *@argument url 视频地址
		 *@argument time 跳转到多少秒
		 */
		loadByUrl: function(url, time) {
			this.instance.loadByUrl(url, time);
		},
		/**
		 * 设置播放速度
		 *@argument speed 速度
		 */
		setSpeed: function(speed) {
			this.instance.setSpeed(speed);
		},
		/**
		 * 设置播放器大小w,h可分别为400px像素或60%百分比chrome浏览器下flash播放器分别不能小于397x297
		 *@argument w 播放器宽度
		 *@argument h 播放器高度
		 */
		setPlayerSize: function(w, h) {
			this.instance.setPlayerSize(w, h);
		},
		/**
		 * 目前只支持HTML5界面上的重载功能,暂不支持直播rtmp流切换m3u8）之间切换,暂不支持直播rtmp流切换
		 *@argument vid 视频id
		 *@argument playauth 播放凭证
		 */
		reloaduserPlayInfoAndVidRequestMts: function(vid, playauth) {
			this.instance.reloaduserPlayInfoAndVidRequestMts(vid, playauth);
		},
		reloadPlayer() {
			this.isReload = true;
			this.initAliplayer();
			this.isReload = false;
		}
	},
	beforeDestroy() {
		console.log('销毁播放器!');
		if (this.instance) {
			this.instance.dispose();
		}
	}
};
</script>
<!-- @import 'https://g.alicdn.com/de/prismplayer/2.9.7/aliplayer-min.js'; -->
<style lang="postcss" scoped>
@import 'https://g.alicdn.com/de/prismplayer/2.9.8/skins/default/aliplayer-min.css';

#videomonitoring {
	width: 100%;
}
#videomonitoring > view {
	height: 100%;
}
</style>
