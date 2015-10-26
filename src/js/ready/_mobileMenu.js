//
// mobile menu
//
// Dependencies:
// -------------
// Some variables defined in aaa.intro.js
//
// Classes: 
// --------
// jsMobileMenuOpener - add to button which shows/hides mobile menu
// jsMobileMenu - add to menu wrapper
// 
// Notes:
// ------
// Mobile breakpoint in defined in aaa.intro.js
//

(function() {
	var $opener = $(".jsMobileMenuOpener"),
		$menu = $(".jsMobileMenu"),
		wasMobile = false;
	
	$window.resize(function() {
		if (mobile !== wasMobile) {
			if (mobile) {
				$menu.hide();
			} else {
				$menu.show();
			}
			
			wasMobile = mobile;
		}
	});
	
	$opener.click(function() {
		if ($menu.is(":visible")) {
			$menu.slideUp(200);
		} else {
			$menu.slideDown(200);
		}
	});
}());
