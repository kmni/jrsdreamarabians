//
// scroll to top
//
// Dependencies:
// -------------
// Some variables defined in aaa.intro.js
//
// Classes:
// --------
// jsScrollToTop - add to button which on click invokes scroll to the top of the page
// 
// Data arguments:
// ---------------
// duration - duration of scroll animation; if not set, duration is calculated based on scroll distance
// 

(function() {
	$(".jsScrollToTop").click(function(e) {
		e.preventDefault();
		
		var $this = $(this),
			duration = $this.data("duration") || -1;
		
		if (duration < 0) {
			duration = Math.floor($doc.scrollTop() / 2);
		}
		
		$("html, body").animate({
			scrollTop: 0
		}, duration);
	});
}());
