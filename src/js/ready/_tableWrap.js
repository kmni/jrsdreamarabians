//
// wrap for tables on mobile to not overlfow the content
// 
// Classes:
// --------
// jsTableWrap - all tables inside element with this class will be wrapped
// Tables inside element with class formattedContent will be wrapped as well.
// 
// Note:
// -----
// This script presumes some CSS definitions apllied to class tableWrap.
//

(function() {
	$(".formattedContent table, .jsTableWrap table").wrap("<div class='tableWrap' />");
}());
