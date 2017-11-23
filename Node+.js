var body = document.getElementsByTagName('body')[0];
var measuringStick = byID('measuring-stick');
Element.prototype.die = function(){
	this.parentNode.removeChild(this);
};
Element.prototype.removeClass = function(rc){
	var classes = this.className.split(' ');
	for(var i =0;i<classes.length;i+=1){
		if (classes[i] === rc){
			break;
		}
	}
	if (i !== classes.length){
		classes.splice(i,1);
	}
	this.className = classes.join(' ');
};
Element.prototype.hasClass = function(has){
	var classes = this.className.split(' ');
	var hasIt = false;
	withEach(classes,function(xlass){
		if(xlass === has)
			hasIt = true;
	});
	return hasIt;
};
Element.prototype.rollUp = function(ssalc){
	var node = this;
	while( !node.hasClass(ssalc) && node!=document ){
		node = node.parentNode;
	}
	return node;
};
Element.prototype.attr = function(attr){
	return this.getAttribute(attr);
}
Element.prototype.addClass = function(ssalc){
	this.className += " "+ssalc;
};
Element.prototype.toggleClass = function(ssalc){
	if (this.hasClass(ssalc)){
		this.removeClass(ssalc);
	}else{
		this.addClass(ssalc);
	}
};
Element.prototype.swapClass = function(class1,class2){
	if (this.hasClass(class1)){
		this.removeClass(class1);
		this.addClass(class2);
	}else{
		this.addClass(class1);
		this.removeClass(class2);
	}
};

Node.prototype.p = function(c){
	if(this.childNodes.length>0){
		this.insertBefore(c,this.childNodes[0]);
	}else{
		this.a(c);
	}
};

Node.prototype.a = function(c){
	var _ = this;
	var anyOfThese = false;
	if (c instanceof Component){
		c = c._;
		anyOfThese = true;
	}
	if (typeof c === "string" ){
		c = txt(c);
		anyOfThese = true;
	}
	if( Array.isArray(c) ){
		anyOfThese = true;
		withEach(c,function(x){
			_.a(x);
		});
	}
	if(c instanceof Node){
		//yox()
		this.appendChild(c);
	}else{
		var xWO$ = Object.create(c);
		delete xWO$.$;
		delete xWO$.class;
		var tagtype = orElse(c.$,"div");
		var xClass = orElse(c.class,"");
		var elx = create(tagtype, xClass ,xWO$);
		yox(xWO$);
		this.a( elx );
	}
};
Node.prototype.n = function(c){this.innerHTML = c;};

Node.prototype.prependChild = function(c){
	if(this.childNodes.length>0){
		this.insertBefore(c,this.childNodes[0]);
	}else{
		this.a(c);
	}
};
Element.prototype.computedStyle = function(prop,state){
	if (!state){state = null;}
	return getComputedStyle(this,state).getPropertyValue(prop);
};
Element.prototype.key = function(f){
	this.addEventListener("keydown",f);
	//this.addEventListener("keyup",f);
};
/*function argue(FUNC){

}*/
Element.prototype.v = function(e,f){this.addEventListener(e,f); return f;};
Element.prototype.clk = function(f){ return this.v('click',f);};
Element.prototype.change = function(f){ return this.v('change',f);};
Element.prototype.fetch = function(){
	var _ = this;
	//var fetchArgs = arguments; //attempting to pass on pass on overloading -_-
	if(arguments.length == 2){
		var url = arguments[0];
		var handler = arguments[1];
		var func = function(){
			_.removeEventListener('click',func);
			POST(url,function(res){
				handler(res);
				_.clk(func);
			});
		}
		this.clk(func);
	}else{
		var data = arguments[0];
		var url = arguments[1];
		var handler = arguments[2];
		var func = function(){
			_.removeEventListener('click',func);
			POST(data,url,function(res){
				handler(res);
				_.clk(func);
			});
		}
		this.clk(func);
	}
	
};
Element.prototype.clkw8 = function(dataReturnFunc,url,successHandle){
	var _ = this;
	var func = function(ev){
		_.removeEventListener('click',func);
		var data = dataReturnFunc(ev);
		POST(data,url,function(res){
			successHandle(res);
			_.clk(func);
		});
	}
	this.clk(func);
};
Element.prototype.clkOnce = function(yuh){
	var _ = this;
	var func = function(ev){
		_.removeEventListener('click',func);
		yuh();
	}
	this.clk(func);
};
Element.prototype.my = function(s){return this.getElementsByClassName(s)[0];};
Element.prototype.empty = function(){this.n('');}
Element.prototype.contextmenu = function(items,location){
	var _ = this;
	if(!_.contexting){
		_.contexting = true;
		if (location === undefined){
			location = BOTTOM;
		}
		var container = create(DIV,'context-menu'+luSula);
		container.addEventListener('click',function(ev){
			ev.stopPropagation();
		})
		var mzrCon = create(DIV,'context-menu'+luSula);
		measuringStick.a(mzrCon);
		var maxWidth = 0;
		var killContext = function(){
			endContextMenu();
		}
		body.addEventListener('click',killContext);
		var endContextMenu = function(){
			_.contexting = false;
			body.removeEventListener('click',killContext);
			container.die();
		}
		withEach(items,function(x){
			var item = create(BUTTON,'item'+luSula,x.text);
			var measure = create(BUTTON,'item'+luSula,x.text);
			mzrCon.a(measure);
			var width = int(measure.offsetWidth);
			if(width > maxWidth){
				maxWidth = width;
			}
			item.addEventListener('click',function(){
				x.fn();
				endContextMenu();
			});
			container.a(item);
		});

		body.a(container);
		var rect = this.getBoundingClientRect();
		if (location == TOP){
			var left = int(rect.left) - (maxWidth/2 - int(this.offsetWidth)/2 )
			yox(body.offsetWidth);
			left = minMax(0,left,(body.clientWidth-maxWidth));
			container.style.left = px(left);
			container.style.top = px(int(rect.top) - int(container.offsetHeight) );	
		}
	}
};

Function.prototype.chain = function(arg){
	return this.bind(null,arg);
}

/*//----------------------------------TEST
Element.prototype.contextMenu = function(c){
	var _ = this;
	if( Array.isArray(c) ){
		withEach(c,function(x){
			_.appendChild(x);
		});
	}else{
		this.appendChild(c);
	}
};*/