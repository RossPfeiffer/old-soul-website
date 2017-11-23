(function(){
	var _as = byAttr("_");
	_as.forEach(function(as){
		var parent = as.parentNode;//();
		//create some type of "go to label" for this series, so stuff doesn't get out of order.
		as.die();
		yox( as.attr("_") );
		var varname = as.attr("_");
		var tagName = as.tagName;
		window[varname].forEach(function(img){
			parent.a( c(tagName,"some-img",{src:img}) );
		})
		yox(as);
		//yox(as);

	});
})();