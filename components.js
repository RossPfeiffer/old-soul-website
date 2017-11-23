function Component(){};
Component.prototype = {
	a:function(e){
		this._.a(e);
	}
}
function component(nodeType,klass,init,abstractions){
	if (typeof nodeType === "undefined"){
		nodeType = DIV;
	}
	var classFunction = function(){
		this._ = c(nodeType,klass);
		init.apply(this,arguments);
	}
	classFunction.prototype = Component.prototype;
	for (var abstract in abstractions){
		classFunction.prototype[abstract] = abstractions[abstract];
	}
	classFunction.prototype.constructor = classFunction;
	return classFunction;
}

var grid = component(TABLE,"grid",function(colNames,data){
	this.colNames = colNames || [];
	this.data = data || [];
	this.decors = [];//{"column-data-name"}
	this.thead = c(THEAD,"grid-head");
	this._.a(this.thead);
	this.tbody = c(TBODY,"grid-body");
	this._.a(this.tbody);
},{
	render: function(){
		var _ = this;
		this.renderBody();
		withEach(this.colNames,function(colName){
			_.thead.a( c(TH,"grid-col-name",colName) );
		});
	},
	renderBody: function(){
		var _ = this;
		this.tbody.empty();
		withEach(this.data,function(rowData){
			var colData = [];
			//yox(rowData);
			var rowEl = c(TR,"grid-row", colData );
			withEach(rowData,function(property){
				rowEl.a( c(TD,"grid-cell", rowData[property] ) );
			});
			_.tbody.a( rowEl );
		});
	},
	decorate:function(){

	},
	sort: function(sort){
		this.data.sort(sort);
		this.renderBody();
	},
	sortBy: function(sortBy){
		//yox(sortBy);
		this.data.sort(function(a,b){
			if(a[sortBy]>b[sortBy]){
				return -1;
			}else if(a[sortBy]<b[sortBy]){
				return 1;
			}
			return 0;
		});
		this.renderBody();
	},
	addFilter: function(filterFunction){
		this.filters.push({key});
		addUniqueKey(this.filters)
		return keyValue;
	}
});

function SourceNode(){}
function Source(data){
	var sourceNodeFunction = function(){
		//
		yox(data);
	}
	sourceNodeFunction.prototype = SourceNode.prototype;
	sourceNodeFunction.prototype.constructor = sourceNodeFunction;
	sourceNodeFunction.data = data;
	return sourceNodeFunction;
}