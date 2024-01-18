gsap.registerPlugin(Draggable) 
gsap.registerPlugin(InertiaPlugin) 
// ─────────────────────────────────────────────────────────────────────────────
// ─── Global Variables ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// ─── Doubleclick Boilerplate ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
	if (Enabler.isInitialized()) {
		enablerInitHandler();
	} else {
		Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitHandler);
	}

	function enablerInitHandler() {
		if (Enabler.isPageLoaded()) {
			pageLoadedHandler();
		} else {
			Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, pageLoadedHandler);
		}
	}

	function pageLoadedHandler() {
		if (Enabler.isVisible()) {
			adVisibilityHandler();
		} else {
			Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, adVisibilityHandler);
		}
	}

	function adVisibilityHandler() {
		creative.init();
	}
});

// ─────────────────────────────────────────────────────────────────────────────
// ─── Creative Initialization ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
var creative = (function () {
	var _this = {};

	_this.init = function () {
		// ─── 1. Snippet Initialization ───────────────────────────────
		snippet.init();

		// ─── 2. Adtech Library Initialization ────────────────────────
		adTech.init();

		// ─── 3. Data Mapping Initialization ──────────────────────────
		mapData.init();

		dogSlider.init();

		// ─── 4. Asset Preloading ─────────────────────────────────────
		// var assets = [snippet.SF.a1_bgImage__img.Url, snippet.SF.a2_bgImage__img.Url, snippet.SF.a3_bgImage__img.Url];

		// ─── 5. Creative Animation ───────────────────────────────────
		// adTech.preloadImages(assets, animation.init);
		animation.init()
		// Uncomment this line to log all exit reporting labels to the console for review.
		// adTech.logReportingLabels();
	};

	return _this;
})();
// ─────────────────────────────────────────────────────────────────────────────
// ─── Start Slider ────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
var dogSlider = (function () {
	var _this = {};

	_this.init = function () {
		// --

		let currentSelectedItem = 1; // Initialize with the default selected item
		let isAnimating = false; // Flag to track whether an animation is in progress
		let introRemove = false;
		gsap.set('.item .dog-scaler', { scale: 0, opacity: 0 });
		gsap.set('.item-1 .dog-scaler', { scale: .8, opacity: 1, y: 19 });
		gsap.set('.item .headline-dog-size', { opacity: 0 });
		gsap.set('.item-1 .headline-dog-size', { opacity: 1 });

		// Frame 1 headline present - if dog changed via slider, it will hide and never show again
		adTech.addClass(adTech.elem('.item-1 .headline-dog-size'), 'headline-dog-size-intro');
		
		function showDog(point) {
			if (isAnimating || point === currentSelectedItem) {
				// If an animation is already in progress or the requested item is already selected, do nothing
				return;
			}
		
			// Set the flag to true to indicate that an animation is starting
			isAnimating = true;
		
			// Choose the corresponding item and dog container
			const currentItem = document.querySelector(`.item.item-${point}`);
			const currentDogContainer = currentItem.querySelector('.dog-scaler');
			const currentHeadline = currentItem.querySelector('.headline-dog-size');
		
			// Remove the 'animated' class from all dog containers and headlines
			document.querySelectorAll('.dog-scaler').forEach(dog => dog.classList.remove('animated'));
			document.querySelectorAll('.headline-dog-size').forEach(headline => headline.classList.remove('animated'));
			// Animate out the current dog and headline
			if (!introRemove) {
				gsap.to('.headline-question-1', { opacity: 0, duration: 0.3, ease: 'power2.out', onComplete: function () {
					adTech.removeClass(adTech.elem('.item-1 .headline-dog-size'), 'headline-dog-size-intro');
				} });
				introRemove = true;
			}

			gsap.to('.dog-scaler', { scale: 0, opacity: 0, y: 0, duration: 0.3, ease: 'power2.out' });
			gsap.to('.headline-dog-size', { opacity: 0, duration: 0.3, ease: 'power2.out' });
			// Animate in the selected item
			gsap.fromTo(
				currentDogContainer,
				{ scale: 0 },
				{ scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.2 }
			);
			gsap.fromTo(
				currentHeadline,
				{ opacity: 0 },
				{ opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.2,
					onComplete: () => {
						// Update the current selected item
						currentSelectedItem = point;
						// Set the flag back to false once the animation is complete
						isAnimating = false;
						// Recheck the current point after the animation is complete
						updateOnPercentage();
					}
				}
			);
		}


		//SLIDER BAR
		const containerWidth = document.querySelector(".slider-parent").clientWidth;
		let progressBarWidth = 0;
		let percentage;
		let targetPoint;
		
		function updateProgressBar() {

			const knob = document.querySelector(".slider-knob");
			const knobPosition = gsap.getProperty(knob, "x");

			// Update progress bar width during the drag
			percentage = (knobPosition / containerWidth) * 100;
			progressBarWidth = percentage;
			gsap.to(".slider-progress", { width: `${progressBarWidth}%`, duration: 0.1 });
			console.log("percent", percentage)
			updateOnPercentage();

		}
		
		function updateOnPercentage() {

			if (percentage >= 90) {
				// console.log("point 4");
				targetPoint = 4;
			} else if (percentage >= 70) {
				// console.log("point 3");
				targetPoint = 3;
			} else if (percentage >= 30) {
				// console.log("point 2");
				targetPoint = 2;
			} else if (percentage >= 0) {
				// console.log("point 1");
				targetPoint = 1;
			} else {
				// console.log("none");
				return;
			}

			// Animate based on the current target point
			showDog(targetPoint);
		}

		Draggable.create(".slider-knob", {
			type: "x",
			bounds: document.getElementsByClassName("slider-parent"),
			inertia: true,
			throwResistance: 1000,
			snap: function (value) {
				const percentage = (value / containerWidth) * 100;
				const snapPoints = [0, 30, 70, 100];
				const closestSnapPoint = snapPoints.reduce((prev, curr) =>
					Math.abs(curr - percentage) < Math.abs(prev - percentage) ? curr : prev
				);
				return (closestSnapPoint / 100) * containerWidth;
			},
			onDrag: updateProgressBar,
			onThrowUpdate: function () {
				updateProgressBar(); // Update progress bar during inertia
			},
			onThrowComplete: function () {
				// Additional callback after inertia is complete (if needed)
			},
			
		});
		// Initialize progress bar
		updateProgressBar();
		

		// ---
	};

	return _this;
})();


// ─────────────────────────────────────────────────────────────────────────────
// ─── Map Dynamic Data ────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
var mapData = (function () {
	var _this = {};

	_this.init = function () {
	
        // ─── Intro Frame - Preloader ─────────────────────────────────
		// adTech.elem('.preloader').src = snippet.SF.a0_preloader__img.Url;

		// ─── Frame 1 ─────────────────────────────────────────────────
		var frameLabel = '.frame1';

		//Mapping image
		// if (adTech.isValidImageUrl(snippet.SF.a1_bgImage__img.Url)) {
		// 	adTech.updClass(`${frameLabel} .bg-image {background-image:url(${snippet.SF.a1_bgImage__img.Url})}`);
		// }
		// adTech.elem(frame).backgroundImage = `url(${ Dynamic.SF().a0_Logo.Url })`;

		//Mapping headline
		// var obj = JSON.parse(snippet.SF.a1_headline__json);
		// adTech.elem(`${frameLabel} .headline p`).innerHTML = snippet.SF.a1_headline__text;
		// adTech.updClass(`${frameLabel} .headline p {color: ${obj.config.fontColour__hex}; font-size: ${obj.config.fontSize__select}px;}`);

		// //Mapping subline
		// var obj = JSON.parse(snippet.SF.a1_subline__json);
		// if (obj.config.show__select.toLowerCase() == 'no') {
		// 	vlib.ele(`${frameLabel} .subline`).style.display = 'none';
		// }
		// adTech.elem(`${frameLabel} .subline p`).innerHTML = obj.config.value;
		// adTech.updClass(`${frameLabel} .subline p {color: ${obj.config.fontColour__hex}; font-size: ${obj.config.fontSize__select}px;}`);

		// // CTA setup
		// //var obj = JSON.parse(snippet.SF.a1_cta__json);
		// adTech.elem(`${frameLabel} .cta-container p`).innerHTML = snippet.SF.a1_cta__text;
		// adTech.updClass(`${frameLabel} .cta-container {${adTech.jsonToCss(snippet.SF.a1_cta__json)}}`);

		// adTech.setCtaData(adTech.elem(`${frameLabel} > .overlay`), 'Frame1_Main_Background_Exit', snippet.SF.a0_exit__url.Url, true);
		// adTech.setCtaData(adTech.elem(`${frameLabel} .cta-container > .overlay`), 'Frame1_Cta_Exit', snippet.SF.a0_exit__url.Url, true);


		// ─── Frame 2 ─────────────────────────────────────────────────
		var frameLabel = '.frame2';

		//Mapping image
		// if (adTech.isValidImageUrl(snippet.SF.a2_bgImage__img.Url)) {
		// 	adTech.updClass(`${frameLabel} .bg-image {background-image:url(${snippet.SF.a2_bgImage__img.Url})}`);
		// }

		// //Mapping headline
		// var obj = JSON.parse(snippet.SF.a2_headline__json);
		// adTech.elem(`${frameLabel} .headline p`).innerHTML = snippet.SF.a2_headline__text;
		// adTech.updClass(`${frameLabel} .headline p {color: ${obj.config.fontColour__hex}; font-size: ${obj.config.fontSize__select}px;}`);

		// //Mapping subline
		// var obj = JSON.parse(snippet.SF.a2_subline__json);
		// if (obj.config.show__select.toLowerCase() == 'no') {
		// 	vlib.ele(`${frameLabel} .subline`).style.display = 'none';
		// }
		// adTech.elem(`${frameLabel} .subline p`).innerHTML = obj.config.value;
		// adTech.updClass(`${frameLabel} .subline p {color: ${obj.config.fontColour__hex}; font-size: ${obj.config.fontSize__select}px;}`);

		// // CTA data setup
		// var obj = JSON.parse(snippet.SF.a2_cta__json);
		// adTech.elem(`${frameLabel} .cta-container p`).innerHTML = obj.config.textValue__text;
		// adTech.elem(`${frameLabel} .cta-container`).style.backgroundColor = obj.config.bgColour__hex;
		// adTech.elem(`${frameLabel} .cta-container`).style.color = obj.fontColour__hex;
		// // Set CTA data. Accepts 3 parameters: element, reporting label, exit URL, and UTM variables (if true).
		// adTech.setCtaData(adTech.elem(`${frameLabel} > .overlay`), 'Frame2_Main_Background_Exit', snippet.SF.a0_exit__url.Url, true);
		// adTech.setCtaData(adTech.elem(`${frameLabel} .cta-container > .overlay`), 'Frame2_Cta_Exit', snippet.SF.a0_exit__url.Url, true);
		// // Add hover effect to CTA. Accepts 3 parameters: element, background color, and font color.
		// adTech.addHover(adTech.elem(`${frameLabel} .cta-container`), obj.config.bgColour__hex, obj.config.fontColour__hex);

		// ─── Frame 3 ─────────────────────────────────────────────────
		var frameLabel = '.frame3';

		// //Mapping image
		// if (adTech.isValidImageUrl(snippet.SF.a3_bgImage__img.Url)) {
		// 	adTech.updClass(`${frameLabel} .bg-image {background-image:url(${snippet.SF.a3_bgImage__img.Url})}`);
		// }

		// //Mapping headline
		// var obj = JSON.parse(snippet.SF.a3_headline__json);
		// adTech.elem(`${frameLabel} .headline p`).innerHTML = snippet.SF.a3_headline__text;
		// adTech.updClass(`${frameLabel} .headline p {color: ${obj.config.fontColour__hex}; font-size: ${obj.config.fontSize__select}px;}`);

		// //Mapping subline
		// var obj = JSON.parse(snippet.SF.a3_subline__json);
		// if (obj.config.show__select.toLowerCase() == 'no') {
		// 	vlib.ele(`${frameLabel} .subline`).style.display = 'none';
		// }
		// adTech.elem(`${frameLabel} .subline p`).innerHTML = obj.config.value;
		// adTech.updClass(`${frameLabel} .subline p {color: ${obj.config.fontColour__hex}; font-size: ${obj.config.fontSize__select}px;}`);

		// // CTA data setup
		// var obj = JSON.parse(snippet.SF.a3_cta__json);
		// adTech.elem(`${frameLabel} .cta-container p`).innerHTML = obj.config.textValue__text;
		// adTech.elem(`${frameLabel} .cta-container`).style.backgroundColor = obj.config.bgColour__hex;
		// adTech.elem(`${frameLabel} .cta-container`).style.color = obj.fontColour__hex;
		// // Set CTA data. Accepts 3 parameters: element, reporting label, exit URL, and UTM variables (if true).
		// adTech.setCtaData(adTech.elem(`${frameLabel} > .overlay`), 'Frame3_Main_Background_Exit', snippet.SF.a0_exit__url.Url, true);
		// adTech.setCtaData(adTech.elem(`${frameLabel} .cta-container > .overlay`), 'Frame3_Cta_Exit', snippet.SF.a0_exit__url.Url, true);
		// // Add hover effect to CTA. Accepts 3 parameters: element, background color, and font color.
		// adTech.addHover(adTech.elem(`${frameLabel} .cta-container`), obj.config.bgColour__hex, obj.config.fontColour__hex);

		// // KEEP AT THE BOTTOM OF FUNCTION
		// // add event listener for all CTA clickable elements with class .overlay
		// adTech.elem('body .overlay').forEach((element) => {
		// 	element.addEventListener('click', adTech.exits, false);
		// });
	};

	return _this;
})();

// ─────────────────────────────────────────────────────────────────────────────
// ─── Creative Animation ──────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
var animation = (function () {
	var _this = {};

	_this.init = function () {
		// Configure animation timeline
		var tl = gsap.timeline(); // GSAP master timeline
		var displayTime = 0.1; // The the display time of each frame in seconds
		var zIndex = 10; // Ensures the animating frame is the top most frame

		/**
		 * The animation per frame is dynamic.
		 * Arrange them in the order you want them to play.
		 */
		// _this.frame0(tl, displayTime, zIndex++);
		_this.frame1(tl, displayTime, zIndex++);
		// _this.frame2(tl, displayTime, zIndex++);
		// _this.frame3(tl, displayTime, zIndex++);
	};

	// ─── Frame 0 Animation ───────────────────────────────────────────────
	_this.frame0 = function (tl, displayTime, zIndex) {
		var frameLabel = '.frame0';
		tl.set(frameLabel, { zIndex: zIndex });

		// Your frame animation goes here.
		tl.fromTo(frameLabel, { autoAlpha: 0 }, { autoAlpha: 1 });

		tl.to({}, {}, `+=${displayTime}`); // Delay of this frame before going to the next frame.
	};

	// ─── Frame 1 Animation ───────────────────────────────────────────────
	_this.frame1 = function (tl, displayTime, zIndex) {
		var frameLabel = '.frame1';
		tl.set(frameLabel, { zIndex: zIndex });
		// Your frame animation goes here.
		tl.fromTo(frameLabel, { autoAlpha: 0 }, { autoAlpha: 1 });
		// tl.fromTo(frameLabel + ' .headline', { y: -21, autoAlpha: 0 }, { y: 0, autoAlpha: 1 });
		// tl.fromTo(frameLabel + ' .subline', { y: -21, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, '-=0.3');
		// tl.fromTo(frameLabel + ' .cta-container', { y: 21, autoAlpha: 0 }, { y: 0, autoAlpha: 1 });

		tl.to({}, {}, `+=${displayTime}`); // Delay of this frame before going to the next frame.
	};

	// ─── Frame 2 Animation ───────────────────────────────────────────────
	_this.frame2 = function (tl, displayTime, zIndex) {
		var frameLabel = '.frame2';
		tl.set(frameLabel, { zIndex: zIndex });

		// Your frame animation goes here.
	

		tl.to({}, {}, `+=${displayTime}`); // Delay of this frame before going to the next frame.
	};

	// ─── Frame 3 Animation ───────────────────────────────────────────────
	_this.frame3 = function (tl, displayTime, zIndex) {
		var frameLabel = '.frame3';
		tl.set(frameLabel, { zIndex: zIndex });

		// Your frame animation goes here.
	

		tl.to({}, {}, `+=${displayTime}`); // Delay of this frame before going to the next frame.
	};

	return _this;
})();

// ─────────────────────────────────────────────────────────────────────────────
// ─── For Studio Setup Onplay. Do Not Run! ────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function studioExitsTmp() {
	Enabler.exit("Frame1_Main_Background_Exit");
	Enabler.exit("Frame1_Cta_Exit");
	Enabler.exit("Frame2_Main_Background_Exit");
	Enabler.exit("Frame2_Cta_Exit");
	Enabler.exit("Frame3_Main_Background_Exit");
	Enabler.exit("Frame3_Cta_Exit");
}
