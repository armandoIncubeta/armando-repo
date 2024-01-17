//progress bar

	const containerWidth = document.querySelector(".slider_parent").clientWidth;
		let progressBarWidth = 0;
		
		const snaps = [0, 75, 150, 225];
		const snapThreshold = 5; // Adjust this threshold as needed
		
		// Variables to track the positions of snap points
		let snap1 = false;
		let snap2 = false;
		let snap3 = false;
		let snap4 = false;
		
		function updateProgressBar() {
		  const knob = document.querySelector(".slider_knob");
		  const knobPosition = gsap.getProperty(knob, "x");
		
		  // Update progress bar width during the drag
		  const percentage = (knobPosition / containerWidth) * 100;
		  progressBarWidth = percentage;
		  gsap.to(".slider_progress", { width: `${progressBarWidth}%`, duration: 0.1 });
		}
		
		function snapToNearestPoint() {
		  const knob = document.querySelector(".slider_knob");
		  const knobPosition = gsap.getProperty(knob, "x");
		
		  // Find the nearest snap point
		  let closestSnap = snaps.reduce((prevSnap, currentSnap) => {
			return Math.abs(knobPosition - currentSnap) < Math.abs(knobPosition - prevSnap) ? currentSnap : prevSnap;
		  });
		
		  // Snap only if the knob is close to a snap point
		  if (Math.abs(knobPosition - closestSnap) <= snapThreshold) {
			const percentage = (closestSnap / containerWidth) * 100;
		
			// Snap the knob
			gsap.to(".slider_knob", { x: closestSnap, duration: 0.3, ease: "power2.out" });
			gsap.to(".slider_progress", { width: `${percentage}%`, duration: 0.3, ease: "power2.out" });
		
			// Handle the snap point
			handleSnap(closestSnap);
		  }
		}
		
		function handleSnap(snapPoint) {
		  // Update the snap variables based on the current snap point
		  snap1 = snapPoint === snaps[0];
		  snap2 = snapPoint === snaps[1];
		  snap3 = snapPoint === snaps[2];
		  snap4 = snapPoint === snaps[3];
		
		  // Output the current state of snap variables
		  console.log("Snap 1:", snap1);
		  console.log("Snap 2:", snap2);
		  console.log("Snap 3:", snap3);
		  console.log("Snap 4:", snap4);
		}
		
		Draggable.create(".slider_knob", {
		  type: "x",
		  bounds: document.getElementsByClassName("slider_parent"),
		  inertia: true,
		  onDrag: updateProgressBar,
		//   onDragEnd: snapToNearestPoint, // Snaps to the nearest point only on drag end
		});
		
		// Initialize progress bar
		updateProgressBar();



        // v2 simple

        const containerWidth = document.querySelector(".slider_parent").clientWidth;
		let progressBarWidth = 0;
		let percentage;

		function updateProgressBar() {

		const knob = document.querySelector(".slider_knob");
		const knobPosition = gsap.getProperty(knob, "x");

		// Update progress bar width during the drag
		percentage = (knobPosition / containerWidth) * 100;
		progressBarWidth = percentage;
		gsap.to(".slider_progress", { width: `${progressBarWidth}%`, duration: 0.1 });

		updateOnPercentage();

		}

		function updateOnPercentage() {
			console.log("percentage", percentage)
			if (percentage >= 75) {
				console.log("point 4");
			} else if (percentage >= 50) {
				console.log("point 3");
			} else if (percentage >= 25) {
				console.log("point 2");
			} else if (percentage >= 0) {
				console.log("point 1");
			} else {
				console.log("none");
			}
		}


		Draggable.create(".slider_knob", {
		type: "x",
		bounds: document.getElementsByClassName("slider_parent"),
		inertia: true,
		onDrag: updateProgressBar,
		// onDragEnd: updateOnPercentage, // Snaps to the nearest point only on drag end
		});

		// Initialize progress bar
		updateProgressBar();