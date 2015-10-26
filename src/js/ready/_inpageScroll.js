//
// inpage scroll
//
// Dependencies:
// -------------
// Some variables defined in aaa.intro.js
//
// Classes:
// --------
// There is no class trigger. This script is automatically applied on all anchor links.
// If you want to prevent the bahaviour, add class jsNotInpageLink.
// 
// Data arguments:
// ---------------
// duration - duration of scroll animation; if not set, duration is calculated based on scroll distance
//

(function() {
	var offset = 0;
	
	$("a[href^='#']").not("a[href='#']").not(".jsNotInpageLink").each(function() {
		var $this = $(this),
			$target = $($this.attr("href")),
			duration;
		
		if ($target.length) {
			$this.click(function(e) {
				e.preventDefault();
				
				duration = $this.data("duration") || -1;
				
				if (duration < 0) {
					duration = Math.abs(Math.floor(($doc.scrollTop() - ($target.offset().top - offset)) / 2));
				}
				
				$("html, body").animate({
					scrollTop: $target.offset().top - offset
				}, duration);
			});
		}
	});
}());
