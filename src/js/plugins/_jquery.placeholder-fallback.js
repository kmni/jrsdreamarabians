//emulates placeholder attribute in older browsers
$(function() {
	var testInput = document.createElement("input");
	if (!("placeholder" in testInput)) {
		$("[placeholder]").focus(function() {
			var $field = $(this);
			if ($field.val() === $field.attr("placeholder")) {
				$field.val("");
			}
		})
		.blur(function() {
			var $field = $(this);
			if ($field.val() === "") {
				$field.val($field.attr("placeholder"));
			}
		})
		.blur()
		.parents("form").submit(function() {
			$(this).find("[placeholder]").each(function() {
				var $field = $(this);
				if ($field.val() === $field.attr("placeholder")) {
					$field.val("");
				}
			});
		});		
	}
});