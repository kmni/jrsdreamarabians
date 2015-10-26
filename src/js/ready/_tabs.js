//
// tabs
// 
// TODO: rewrite classes structure, polish
//
(function() {
	$(".jsTabs").each(function() {
		var $wrap = $(this),
			$groups = $wrap.find(".tab"),
			$switchersWrap = $("<div/>").addClass("switchers"),
			$switchers = $(),
			$headers = $(),
			$contents = $();

		$groups.each(function() {
			var $this = $(this),
				$header = $this.find(".tabHeader"),
				$switcher = $header.clone(),
				$content = $this.find(".tabContent");

			$switchers = $switchers.add($switcher);
			$headers = $headers.add($header);
			$contents = $contents.add($content);

			$switcher.appendTo($switchersWrap);

			//tabs
			$switcher.click(function() {
				$switchers.removeClass("active");
				$switcher.addClass("active");

				$contents.hide();
				$content.show();
			});
			
			//accordion
//			$header.click(function() {
//				if ($header.hasClass("active")) {
//					$header.removeClass("active");
//					$content.slideUp(200);
//				} else {
//					$headers.removeClass("active");
//					$header.addClass("active");
//
//					$contents.slideUp(200);
//					$content.slideDown(200);
//				}
//			});
		});

		$switchersWrap.find(".tabHeader").eq(0).click();

		$switchersWrap.prependTo($wrap);
	});
}());
