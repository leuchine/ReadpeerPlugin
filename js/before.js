var cssApplier;
var hightlighter;
window.onload = function() {
	window.rangy.init();
	highlighter = window.rangy.createHighlighter(window.document,"TextRange");
	highlighter.addClassApplier(rangy.createCssClassApplier(
			"italicYellowBg", {
				tagNames : [ "span", "a", "b" ]
			}));

	cssApplier = window.rangy.createCssClassApplier("highlight", {
		normalize : true
	});
};