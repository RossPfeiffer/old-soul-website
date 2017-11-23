function yox(y){console.log(y);}
function wox(y){body.a(txt(y));body.a(create(BR))}


function nulf(){}
function POST(data,url,callBack){
	if(arguments.length == 2){
		return AJAX({},'POST',arguments[0],arguments[1]);
	}else{
		return AJAX(arguments[0],'POST',arguments[1],arguments[2]);
	}
}
function GET(){/* data,url,callBack */
	if(arguments.length == 2){
		return AJAX({},'GET',arguments[0],arguments[1]);
	}else{
		return AJAX(arguments[0],'GET',arguments[1],arguments[2]);
	}
}
function AJAX(data,method,url,callBack){
	var xmlhttp;
	var ajaxer = {
		success: nulf,
		fail:nulf,
		always:nulf
	};
	if (typeof callBack != 'undefined'){
		ajaxer.success = callBack;
	}
	var URLizedData = '';
	/*data['Y'] = hackcess;*///comfy only
	for (var property in data){
		if ( data.hasOwnProperty(property) ){
			URLizedData += '&'+property+'='+encodeURIComponent( data[property] );
		}
	}
	URLizedData = URLizedData.substr(1);//takes out first '&'
	var xmlhttp;
	if (window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
	}else{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState==4){
			if (xmlhttp.status==200){
				ajaxer.success( xmlhttp.responseText );
			}else{
				ajaxer.fail();
			}
			ajaxer.always();
		}
	}
	if (method === "GET"){
		url += '?'+URLizedData;
	}
	xmlhttp.open(method,url,true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	if (method === "POST"){
		xmlhttp.send(URLizedData);
	}else{
		xmlhttp.send();
	}
	
	//var ajaxer = 
	return ajaxer;
}
function DOM(_){BODY.a(_);}
function byID(s){return document.getElementById(s);}
function byClass(s){return document.getElementsByClassName(s);}
function byClassType(s){return document.querySelectorAll("[class^='"+s+"']");}//document.getElementsByClassName(s);}
function byAttr(a){return document.querySelectorAll("["+a+"]");}//document.getElementsByClassName(s);}
function byAttribute(a){return byAttr(a);}
function txt(t){return document.createTextNode(t);}
function orElse(or,els){if(or){return or;}else{return els;}}

function ArraySpill(ARR,elm){
	withEach(ARR,function(x){
		var noneOfTheAbove=true;
		if(typeof x == "string"){ elm.a(txt(x)); noneOfTheAbove = false; }
		if(typeof x == "number"){ elm.a(txt(x)); noneOfTheAbove = false; }
		if(x instanceof Node){ elm.a(x); noneOfTheAbove = false; }
		if(noneOfTheAbove && typeof x == "object"){
			var xWO$ = Object.create(x);
			delete xWO$.$;
			delete xWO$.class;
			var tagtype = orElse(x.$,"div");
			var xClass = orElse(x.class,"");
			var elx = create(tagtype, xClass ,xWO$);
			elm.a(elx);
		}
	});
}
function c(){return create.apply(this,arguments)}
function create(e,c,init){
	var el = document.createElement(orElse(e,"div"));
	if(c){
		el.className=c;
	}else{
		el.className='';
	}
	if (typeof init != "undefined"){
		var noneOfTheAbove = true;
		if (typeof init == "string" || typeof init == "number"){
			el.innerHTML = init;
			noneOfTheAbove = false;
		}
		if (init instanceof Node){
			el.a(init);
			noneOfTheAbove = false;
		}
		if (noneOfTheAbove){
			if ( Array.isArray(init)){
				ArraySpill(init,el);
			}else{
				if(typeof init == "object"){
					for (var velk in init){
						if ( velk!='_' && velk!='$'){
							el.setAttribute(velk,init[velk]);
						}
					}
					if (typeof init._ !== "undefined"){
						if (typeof init._ == "string"){
							el.a( txt(init._) );
						}
						if (typeof init._ == "number"){
							el.a( txt(init._) );
						}
						if (init._ instanceof Node){
							el.a( init._ );
						}
						if ( Array.isArray(init._)){
							ArraySpill(init._,el);
						}
					}
				}
			}
		}
	}
	return el;
};
String.prototype.contains = function(test,allornone){
	if ( test  instanceof Array ){
		//if(allornone){}
		return ( this.indexOf(test) !== -1 );
	}else{
		return ( this.indexOf(test) !== -1 );	
	}
};

function withOnly(only,arr,func,iterator){
	var limit = arr.length;
	limit = Math.min(only,limit);
	for(var i=0;i<limit;i+=1){
		iterator = i;
		func(arr[i],iterator);
	}
}
function withEach(arr,func,iterator){
	if (Array.isArray(arr)){
		var limit = arr.length;
		for(var i=0;i<limit;i+=1){
			iterator = i;
			func(arr[i],iterator);
		}	
	}else{
		for(var property in arr){
			func(property);
		}
	}
}

function repeat(x,func,iterator){
	for(var i = 0;i<x;i+=1){
		iterator = i;
		func(iterator);
	}
}

/*function MinMax(min,val,max){
	return Math.min(max, Math.max(val,min) );
}*/

function minMax(min,val,max){
	return Math.max(min, Math.min(val,max) );
}
function physDiv(N,D){
	if(D == 0){
		return 0;
	}else{
		return N/D;
	}
}
function px(s){return s+"px";}
function int(i,b){
	if(b) { return parseInt(i,b); } else { return parseInt(i); }
}

var someHex = {//yes this is lazy, but it's also effecient. lazy naming
	0:0,	1:1,	2:2,	3:3,	4:4,	5:5,	6:6,	7:7,	8:8,	9:9,	a:10,	b:11,	c:12,	d:13,	e:14,f:15
}
function base16ToBase10(hex2){//yes, only for 2 digits... that's all I need.
	return ( someHex[ hex2.substring(0,1) ]*16 ) + someHex[ hex2.substring(1,2) ];
}
function hexToRgb(hex6){
	var R = base16ToBase10( hex6.substring(0,2) );
	var G = base16ToBase10( hex6.substring(2,4) );
	var B = base16ToBase10( hex6.substring(4,6) );
	return [R,G,B];

}
function rgbToHex(r, g, b){
	return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}
function propsToStringArr(obj){
	var arr = [];
	withEach(obj,function(prop){
		arr.push(prop);
	})
	return arr;
}
/*
function addUniqueKey(arr,val,keyVarName){
	var testKey = randomString(10);
	var passing = false;
	while( !passing){
		passing = true;
		withEach(arr,function(i){
			if (i[keyVarName] === testKey ){
				passing = false;
				testKey = randomString(10);
			}
		});
	}
	var data = {};
	data[keyVarName] = testKey;
	//data.
	arr.push();
}*/