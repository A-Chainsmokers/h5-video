<template>
	<view class="u-skeleton">
		<navber :backShow="true"></navber>
		<view class="u-skeleton-fillet">
			<!-- <xg-video-player :videoConfig="play" v-if="getNode !== definedNode"></xg-video-player>

			<ali-player :url="play.url" :type="play.type" v-if="getNode === definedNode && play"></ali-player> -->

			<external-player :url="play.url" v-if="play.type === 'fq'"></external-player>

			<ali-player v-else :url="play.url" :type="play.type" @reading="monitor" ref="player" @completeSeek="saveHistory" @play="saveHistory" @pause="saveHistory"></ali-player>
		</view>

		<!-- 详情 -->
		<view class="info-class" v-show="videoInfo.title">
			<u-section :title="videoInfo.title + '  ' + videoInfo.describe" :right="false" :font-size="35" class="up-down-class u-skeleton-fillet"></u-section>

			<view class="rating-class u-skeleton-fillet">
				<u-rate :count="count" v-model="videoInfo.rating" :disabled="true"></u-rate>
				<text class="rating-text-class">{{ videoInfo.rating + '分' }}</text>
			</view>
		</view>
		<!-- 剧集 -->
		<u-card v-show="selections.length !== 0">
			<view slot="head">
				<u-row :gutter="2">
					<u-col :span="3">
						<view class="card-title-class u-skeleton-fillet"><text>播放地址</text></view>
					</u-col>
					<u-col :span="9"><u-tabs name="name" :list="selections" :is-scroll="true" :current="current" @change="change"></u-tabs></u-col>
				</u-row>
			</view>

			<scroll-view
				class="selections-class u-skeleton-fillet"
				slot="body"
				v-if="selections[current]"
				:style="[{ height: selections[current].list.length <= 28 ? 'aotu' : '500rpx' }]"
				:scroll-y="true"
				:show-scrollbar="true"
				refresher-default-style="white"
			>
				<view>
					<u-row :gutter="5">
						<u-col :span="3" v-for="(item, index) in selections[current].list" :key="index">
							<view>
								<u-button size="mini" class="but-class" plain ripple @click="toPlay(item.url)" :disabled="index === checked.but && current === checked.tab">
									{{ item.name }}
								</u-button>
							</view>
						</u-col>
					</u-row>
				</view>
			</scroll-view>
		</u-card>

		<!-- 相似 -->
		<view class="video-like-list" v-show="likeList.length !== 0">
			<u-section title="猜你喜欢" :right="false" :font-size="35" class="up-down-class"></u-section>
			<video-list :list="likeList"></video-list>
		</view>
		<u-toast ref="uToast" />

		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import Navber from '../../component/Navbar.vue';
import VideoList from '../../component/VideoList.vue';
import ExternalPlayer from '../../component/ExternalPlayer.vue';
import AliPlayer from '../../component/AliPlayer.vue';
import info from '../../store/default/Info.json';
import selections from '../../store/default/Selections.json';
import LikeList from '../../store/default/LikeList.json';
export default {
	data() {
		return {
			loading: false,
			videoInfo: info,
			selections: selections,
			likeList: LikeList,
			count: 5,
			current: 0,
			checked: {
				tab: 0,
				but: 0
			},
			play: {},
			setTime: null,
			seek: 0,
			vodId: undefined
		};
	},
	components: {
		navber: Navber,
		'video-list': VideoList,
		'ali-player': AliPlayer,
		'external-player': ExternalPlayer
	},
	onLoad(option) {
		// console.log(this.getHistoryList);
		// uni.removeStorageSync('historyList');
		this.init(option.id);
		this.vodId = option.vodId;
	},
	computed: {
		...mapGetters(['getNode', 'getHistoryList'])
	},
	methods: {
		...mapMutations(['setHistory', 'updateHistory']),
		init(id) {
			this.loading = true;
			this.$u
				.post(`${this.getNode}/play`, { id: id })
				.then(req => {
					let { info, likeList, play, describe, title, rating } = req.data;

					describe = this.$u.trim(describe, 'all');

					this.selections = info;

					this.likeList = likeList;

					this.videoInfo = { describe, title, rating };

					this.play = play;

					//获取历史记录
					let historyList = this.getHistoryList;

					let history = historyList.find(item => item.node === this.getNode && item.vodId === this.vodId && item.id === play.id);

					if (!history) {
						this.current = info.findIndex(item => item.list.find(val => val.url === play.id));

						this.checked = {
							tab: this.current,
							but: info[this.current].list.findIndex(item => item.url === play.id)
						};
					} else {
						let { checked, currentTime } = history;

						this.checked = checked;

						this.current = checked.tab;

						this.seek = currentTime;
					}
					this.loading = false;
				})
				.catch(res => {
					this.loading = false;
					this.clear();
				});
		},
		change(val) {
			this.current = val;
		},
		toPlay(id) {
			this.$u.route({
				type: 'reLaunch',
				url: '/pages/video/index',
				params: {
					id: id
				}
			});
		},
		clear() {
			this.likeList = [];
			this.videoInfo = {};
			this.selections = [];
		},
		monitor(val) {
			if (val) {
				this.$refs.player.seek(this.seek);
				this.setTime = setInterval(() => {
					this.saveHistory();
				}, 1000 * 60);
			}
		},
		saveHistory() {
			let currentTime = Math.floor(this.$refs.player.getCurrentTime());

			if (this.seek !== 0 && currentTime === 0) {
				return;
			}

			
			let duration = Math.floor(this.$refs.player.getDuration());

			let params = {
				node: this.getNode,
				id: this.play.id,
				currentTime: currentTime || 0,
				duration: duration,
				checked: this.checked,
				img: this.play.img,
				title: this.videoInfo.title,
				vodId: this.vodId,
				time: new Date().getTime()
			};
			console.log('保存历史记录', currentTime);
			//添加历史记录
			this.setHistory(params);
		}
	},
	beforeDestroy() {
		this.saveHistory();
		this.$once('hook:beforeDestroy', () => {
			clearInterval(this.setTime);
			this.setTime = null;
		});
	},
	destroy() {
		clearInterval(this.setTime);
		this.setTime = null;
	}
};
</script>

<style scoped>
.info-class {
	margin: 20rpx;
	margin-top: 20rpx;
}
.video-like-list {
	margin: 20rpx;
	margin-top: 50rpx;
}
.rating-class {
	margin-top: 10rpx;
}
.rating-text-class {
	margin-left: 30rpx;
}
.but-class {
	margin: 15rpx;
	display: block;
	text-align: center;
	width: 135rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	-o-text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
