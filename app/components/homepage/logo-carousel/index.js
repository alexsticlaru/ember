
import Component from '@glimmer/component';

import homepageLogos from '../../../utils/homepage-logos-content';

const swiperOptions = {
	slidesPerView: 5,
	slidesPerColumn: 2,
	slidesPerGroup: 5,
	spaceBetween: 0,
	pagination: {
		el: '.swiper-pagination',
		dynamicBullets: true,
	},
	breakpoints: {
		// when window width is <= 600px
		600: {
			slidesPerView: 2,
			slidesPerGroup: 2
		},
		// when window width is <= 900px
		900: {
			slidesPerView: 3,
			slidesPerGroup: 3
		},
		// when window width is <= 1200px
		1200: {
			slidesPerView: 4,
			slidesPerGroup: 4
		},
	}
};


export default class LogoCarousel extends  Component {

	swiperOptions = swiperOptions;
	items = homepageLogos;
	numSlides = homepageLogos.length;
};
