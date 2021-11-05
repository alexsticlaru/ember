import $ from 'jquery';

$.fn.fixedScroll = function(bottom = 50, top = 80) {

	if (!this.length) return ; // No element found

	const sidetab = $(this);
	const sidetabWidth = sidetab.width();
	const sidetabHeight = sidetab.outerHeight(true);
	const initialSidetabTop = sidetab.offset().top;

	sidetab.css("position", "fixed");
	sidetab.width(sidetabWidth);
	sidetab.css("top", `${initialSidetabTop}px`);

	let lastWindowTop = 0;

	$(window).on("scroll", () => {

		//////////////////////////////////////////////////////////
		// Compute all required constants
		//////////////////////////////////////////////////////////

		// Window
		const windowHeight = $(window).outerHeight(true);
		const windowTop = $(window).scrollTop();
		const windowBottom = windowTop + windowHeight;

		// Scroll
		const scroll = windowTop - lastWindowTop;
		const scrollToBottom = scroll > 0;
		const scrollToTop = scroll < 0;

		// Sidetab
		const sidetabTop = sidetab.offset().top;
		const sidetabBottom = sidetabTop + sidetabHeight;
		const sidetabDeltaTop = sidetabTop - windowTop;
		const sidetabDeltaBottom = windowBottom - sidetabBottom;


		//////////////////////////////////////////////////////////
		// Following algorith
		//////////////////////////////////////////////////////////

		if (scrollToBottom) {

			if (sidetabDeltaBottom < bottom) {
				const _top = sidetabDeltaBottom + scroll < bottom ?
					sidetabDeltaTop - scroll :
					windowHeight - sidetabHeight - bottom;
				sidetab.css("top", `${_top}px`);
			} else if (sidetabDeltaTop > top) {
				const _top = (sidetabDeltaTop - scroll) > top ? sidetabDeltaTop - scroll : top;
				sidetab.css("top", `${_top}px`);
			}

		}

		if (scrollToTop) {

			if (sidetabTop < initialSidetabTop) {
				sidetab.css("top", `${initialSidetabTop - windowTop}px`);
			} else if (sidetabDeltaTop < top) {
				const _top = (sidetabDeltaTop - scroll) < top ? sidetabDeltaTop - scroll : top;
				sidetab.css("top", `${_top}px`);
			}

		}

		lastWindowTop = windowTop;

	});
};
