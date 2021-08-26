<template>
	<view class="u-skeleton">
		<navber :backShow="true"></navber>
		<view class="video-info">
			<image :src="videoInfo.img" style="height: 622rpx; top: 80rpx; position: absolute; right: 0px; width: 100%; filter: blur(30px) brightness(60%);" mode=""></image>
			<view class="info-class">
				<u-row :gutter="10">
					<u-col :span="6">
						<view class="cover-class"><image class="image-class u-skeleton-rect" :src="videoInfo.img"></image></view>
					</u-col>
					<u-col :span="6">
						<view class="describe-class">
							<view class="describe-item-class but-text-class">
								<text class="u-skeleton-rect">{{ videoInfo.title }}</text>
							</view>
							<view class="describe-item-class but-text-class">
								<text class="font-class u-skeleton-rect">{{ videoInfo.text }}</text>
							</view>
							<view class="describe-item-class u-skeleton-rect"><u-rate :count="count" v-model="videoInfo.rating" :disabled="true"></u-rate></view>
							<view v-for="(item, index) in videoInfo.describe" :key="index" class="describe-item-class">
								<u-row :gutter="5">
									<u-col :span="4" class="u-skeleton-rect">{{ item.muted }}</u-col>
									<u-col :span="6" class="u-skeleton-rect">
										<text class="text-class">{{ item.join }}</text>
									</u-col>
								</u-row>
							</view>
							<!-- <view class="to-but-class u-skeleton-rect"><u-button size="mini" :ripple="true" type="warning" @click="update()">更新剧集</u-button></view> -->
						</view>
					</u-col>
				</u-row>
			</view>
		</view>

		<view>
			<u-card>
				<view slot="head">
					<u-row :gutter="2">
						<u-col :span="3">
							<view class="card-title-class u-skeleton-rect"><text>播放地址</text></view>
						</u-col>
						<u-col :span="9"><u-tabs name="name" :list="selections" :is-scroll="true" :current="current" @change="change"></u-tabs></u-col>
					</u-row>
				</view>

				<scroll-view
					class="selections-class u-skeleton-rect"
					:style="[{ height: selections[current].list.length <= 28 ? 'aotu' : '500rpx' }]"
					slot="body"
					v-if="selections[current]"
					:scroll-y="true"
					:show-scrollbar="true"
					refresher-default-style="white"
				>
					<view>
						<u-row :gutter="5">
							<u-col :span="3" v-for="(item, index) in selections[current].list" :key="index">
								<view class="">
									<u-button size="mini" class="but-class" plain ripple @click="toPlay(item.url)">{{ item.name }}</u-button>
								</view>
							</u-col>
						</u-row>
					</view>
				</scroll-view>
			</u-card>
		</view>
		<view class="read-class">
			<u-section title="简介" :show="!videoInfo.content" :right="false"></u-section>
			<u-read-more ref="uReadMore" show-height="170" :toggle="true"><rich-text :nodes="videoInfo.content"></rich-text></u-read-more>
		</view>

		<view class="video-list-class">
			<u-section title="猜你喜欢" :right="false" class="u-skeleton-rect"></u-section>
			<video-list :list="likeList"></video-list>
		</view>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import Navber from '../../component/Navbar.vue';
import VideoList from '../../component/VideoList.vue';
import info from '../../store/default/Info.json';
import selections from '../../store/default/Selections.json';
import LikeList from '../../store/default/LikeList.json';
export default {
	data() {
		return {
			id: undefined,
			count: 5,
			likeList: LikeList,
			videoInfo: info,
			selections: selections,
			current: 0,
			loading: true
		};
	},
	components: {
		navber: Navber,
		'video-list': VideoList
	},
	computed: {
		...mapGetters(['getNode'])
	},
	onLoad(option) {
		this.id = option.id;
		this.info();
	},
	methods: {
		update() {
			this.loading = true;
			this.$u
				.get(`${this.getNode}/update/${this.id}`)
				.then(req => {
					this.viewInfo(req);
					this.loading = false;
				})
				.catch(res => {
					this.loading = false;
					this.clear();
				});
		},
		info() {
			this.loading = true;
			this.$u
				.get(`${this.getNode}/info/${this.id}`)
				.then(req => {
					this.viewInfo(req);
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
			this.$u.route('/pages/video/index', {
				id: id,
				vodId: this.id
			});
		},
		viewInfo(req) {
			let { info, likeList, describe, img, rating, text, title, content } = req.data;

			this.videoInfo = { text, img, rating, title, describe, content };

			this.selections = info;

			this.likeList = likeList;

			this.$nextTick(() => {
				this.$refs.uReadMore.init();
			});
		},
		clear() {
			this.likeList = [];
			this.videoInfo = {};
			this.selections = [];
		}
	}
};
</script>

<style scoped>
.video-list-class {
	margin: 20rpx;
	margin-top: 50rpx;
}
.video-info {
	margin: 20rpx;
	margin-top: 20px;
}
.info-class {
	margin-left: 10rpx;
	position: relative;
}
.read-class {
	margin: 30rpx;
}
.image-class {
	height: 400rpx;
	width: 300rpx;
	border-radius: 10rpx;
}
.describe-item-class {
	margin: 5rpx;
}
.describe-class {
	margin-left: 20rpx;
	font-size: 30rpx;
	color: #ffffff;
}
.text-class {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.font-class {
	color: #f1225a;
	font-size: 15px;
	font-weight: 600;
}
.card-title-class {
	text-align: center;
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
.but-text-class {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
}
.to-but-class {
	margin: 15rpx;
	text-align: left;
}
</style>
