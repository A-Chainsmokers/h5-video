<template>
	<view class="swiper-view-class">
		<my-swiper :options="swiperOption" class="my-swiper">
			<my-swiper-slide v-for="(item, index) in swiperList" :key="index" class="my-swiper-slide-class">
				<view class="swiper-item" @click="toInfo(item)">
					<image :src="item.vodPic" class="image-class u-skeleton-rect"></image>
					<view class="pic-text-class text-class u-skeleton-rect">{{ item.vodRemarks }}</view>
					<view class="title-class text-class u-skeleton-rect">{{ item.vodName }}</view>
				</view>
			</my-swiper-slide>
			<view class="swiper-pagination"></view>
		</my-swiper>
	</view>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';
export default {
	data() {
		return {
			swiperOption: {
				slidesPerView: 3,
				centeredSlides: true,
				spaceBetween: 30,
				pagination: {
					el: '.swiper-pagination',
					clickable: true
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev'
				}
			},
			cardCur: 0,
			dotStyle: false,
			towerStart: 0,
			direction: ''
		};
	},
	props: {
		swiperList: {
			type: Array,
			default: () => {}
		}
	},
	components: {
		'my-swiper': Swiper,
		'my-swiper-slide': SwiperSlide
	},
	methods: {
		toInfo(row) {
			this.$u.route('pages/info/index', { id: row.id });
		}
	}
};
</script>

<style scoped>
.swiper-view-class {
	border-radius: 10rpx;
}
.my-swiper {
	height: 370rpx;
}
.my-swiper-slide-class {
	margin-top: 20rpx;
	margin-bottom: 20rpx;
}
.image-class {
	height: 300rpx;
	width: 220rpx;
	display: block;
	position: relative;
	border-radius: 10rpx;
}
.swiper-item {
	text-align: center;
	height: 300rpx;
	width: 220rpx;
	position: relative;
}
.pic-text-class {
	width: 220rpx;
	text-align: left;
	position: absolute;
	z-index: 99;
	bottom: 0rpx;
	left: 0rpx;
	padding: 5px 10px;
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
.title-class {
	margin: 10rpx;
	color: #ffffff;
}
</style>
