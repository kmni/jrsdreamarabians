//
// print
//
// Classes:
// --------
// jsPrint - add to button which invokes print
// 

(function() {
	$(".jsPrint").click(function(e) {
		e.preventDefault();
		window.print();
	});
}());