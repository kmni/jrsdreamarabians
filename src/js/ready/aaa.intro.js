var $doc = $(document),
	$window = $(window),
	mobileBreakpoint = 768,
	//homepage = $("body").hasClass("homepage"),
	mobile = false;
	//ajaxSupported = false;

if ($doc.width() <= mobileBreakpoint) {
	mobile = true;
}

$window.resize(function() {
	if ($doc.width() <= mobileBreakpoint) {
		mobile = true;
	} else {
		mobile = false;
	}
});
