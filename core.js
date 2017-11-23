var $ = function(){}

function Klass(inherits,initFunc){
	//
}

function guideData(data,doWith){
	var noneOfTheAbove = true;
	if( typeof DoWithData.data === "number" || typeof DoWithData.data === "string" ){
		doWith.prim(data);
		noneOfTheAbove = false;
	}elseif( Array.isArray(DoWithData.data)  && doWith.array){
		doWith.array(data);
		noneOfTheAbove = false;
	}elseif(DoWithData.data instanceof SourceLinker && doWith.source){
		doWith.source(data);
		noneOfTheAbove = false;
	}elseif(DoWithData.data instanceof Klass && doWith.klass){
		doWith.klass(data);
		noneOfTheAbove = false;
	}elseif(noneOfTheAbove && doWith.lit){
		doWith.lit(data);
	}elseif(doWith.else){
		doWith.else(data);
	}
}
/*
prims
arrays
lits
*/
function SourceLinker(source){
	var func,sourceObservable;
	var sourceLinker = this;

	guideData(source,{
		klass:function(){
			sourceObservable = data;			
		},
		else:function(){
			sourceObservable = new Klass(data);			
		}
	});
	this.source = sourceObservable;
}
SourceLinker.prototype.sourcedNode = function(){
	var el = c(DIV,"beacon-node");
	return el;
};

SourceLinker.prototype.createLinkedElement = function(){}
function Source(data){
	var func = function(){};
	var theSourceLinker = new SourceLinker(data,func);
	return theSourceLinker;
}