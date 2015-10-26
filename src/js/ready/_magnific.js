//
// magnific popups
// 
// Classes:
// --------
// jsGallery - add to wrapper of image gallery
// jsPopup - add to button which opens popup
// jsPopupBox - add to box opened as popup
// 
// Data arguments:
// ---------------
// box - classname of element which should be opened as popup on click (add on jsPopup button)
//
(function() {
	//photogalleries
	$(".jsGallery").each(function() {
		$(this).magnificPopup({
			delegate: "a",
			type: "image",
			tLoading: "Nahrávám…",
			tClose: "Zavřít",
			showCloseBtn: true,
			gallery: {
				enabled: true,
				tPrev: "Předchozí",
				tNext: "Další",
				tCounter: "%curr% z %total%"
			},
			image: {
				tError: "<a href='%url%'>Obrázek</a> se nepodařilo nahrát."
			}/*,
			ajax: {
				tError: "<a href='%url%'>Obsah</a> se nepodařilo nahrát."
			}*/
		});
	});
	
	//popup boxes
	$(".jsPopup").each(function() {
		var $this = $(this),
			$popup = $("." + $this.data("box"));
		
		$this.magnificPopup({
			type: "inline",
			items: {
				src: $popup
			},
			fixedContentPos: true,
			showCloseBtn: false
		});
	});
	
	//close buttons in popup boxes
	$(".jsPopupBox").find(".close, .closeButton").click(function() {
		$.magnificPopup.close();
	});
}());