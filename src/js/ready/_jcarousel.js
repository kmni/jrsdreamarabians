//
// carousel
// 
// TODO: rewrite classes structure, polish
//
(function() {
	$('.jcarousel').each(function() {
		var $carousel = $(this),
			$wrap = $carousel.parent(),
			count = $carousel.data("count") || 1,
			control = $carousel.data("control") || count,
			autoscroll = $carousel.data("autoscroll") || count,
			respoCounts = [ ],
			respoBoundary = null,
			i, j, countParts;
		
		if ($carousel.hasClass("jcarousel-responsive")) {
			if (typeof $carousel.data("count") === "string" && $carousel.data("count").indexOf("|") !== -1) {
				countParts = $carousel.data("count").split("|");
				for (i = 0; i < countParts.length; i++) {
					j = countParts[i].indexOf("-");
					if (j !== -1) {
						respoCounts.push({ 
							boundary: Number(countParts[i].slice(0, j)),
							count: Number(countParts[i].slice(j + 1))
						});
					} else {
						respoCounts.push({ 
							boundary: 99999,
							count: Number(countParts[i])
						});
					}
				}
				
				$carousel.on('jcarousel:create jcarousel:reload', function(e) {
					var element = $(this),
						lastBoundary = 100000,
						i, width;
					
					element.css("width", "auto");
					width = element.innerWidth();
					
					for (i = 0; i < respoCounts.length; i++) {
						if (respoCounts[i].boundary > width && respoCounts[i].boundary < lastBoundary) {
							count = respoCounts[i].count;
							lastBoundary = respoCounts[i].boundary;
						}
					}
					
					if (lastBoundary === 99999) {
						if (respoBoundary !== null) {
							$carousel.removeClass("jcarousel-responsive-" + respoBoundary);
							respoBoundary = null;
						}
					} else {
						if (respoBoundary !== null) {
							$carousel.removeClass("jcarousel-responsive-" + respoBoundary);
						}
						
						respoBoundary = lastBoundary;
						$carousel.addClass("jcarousel-responsive-" + respoBoundary);
						
						if (e.type === "jcarousel:reload") {
							$wrap.find('.jcarousel-control-prev').jcarouselControl('reload', {
								target: '-=' + count
							});
							$wrap.find('.jcarousel-control-next').jcarouselControl('reload', {
								target: '+=' + count
							});
						}
					}
				});
			}
			
			$carousel.on('jcarousel:create jcarousel:reload', function() {
				var element = $(this),
					width, itemWidth;

				element.css("width", "auto");
				width = element.innerWidth();
				itemWidth = Math.floor(width / count);
				element.css("width", (itemWidth * count) + "px");
				try{
					element.jcarousel("items").css("width", itemWidth + "px");
				} catch(ex) {}
			});
		}
		
		var params = {
			//wrap: "both",
		};
		
		if ($carousel.hasClass("jcarousel-vertical")) {
			params.vertical = true;
		}
		
		$carousel
			.jcarousel(params);
			
		if ($carousel.hasClass("jcarousel-autoscroll")) {
			$carousel.jcarouselAutoscroll({
				interval: 6000,
				target: '+=' + autoscroll,
				autostart: true
			});
		}

		$wrap.find('.jcarousel-control-prev')
			.on('jcarouselcontrol:active', function() {
				$(this).removeClass('inactive');
			})
			.on('jcarouselcontrol:inactive', function() {
				$(this).addClass('inactive');
			})
			.jcarouselControl({
				target: '-=' + control,
				carousel: $carousel
			});

		$wrap.find('.jcarousel-control-next')
			.on('jcarouselcontrol:active', function() {
				$(this).removeClass('inactive');
			})
			.on('jcarouselcontrol:inactive', function() {
				$(this).addClass('inactive');
			})
			.jcarouselControl({
				target: '+=' + control,
				carousel: $carousel
			});

		$wrap.find('.jcarousel-pagination')
			.on('jcarouselpagination:active', 'span', function() {
				$(this).addClass('active');
			})
			.on('jcarouselpagination:inactive', 'span', function() {
				$(this).removeClass('active');
			})
			.jcarouselPagination({
				item: function() {
					return "<span></span>";
				},
				carousel: $carousel
			});
		
		if ($carousel.hasClass("jcarousel-swipe") && !(document.all && !document.addEventListener)) {
			$carousel.hammer()
				.bind("swipeleft", function() {
					$carousel.jcarousel("scroll", "+=1");
				})
				.bind("swiperight", function() {
					$carousel.jcarousel("scroll", "-=1");
				});
		}
	});
}());
