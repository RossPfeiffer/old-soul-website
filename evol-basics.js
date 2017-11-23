var $ = {
	labLayout:{
		realms:1
	},
	W: 300,
	H: 300,
	cllFldSz: 50,
	tick:1,//milliseconds
	kick: 0,//hey aldsifsadjflsdk asjfweklfjweifowjlkfjlkasjdflk jljaksdjfkljds 
	pSz :function(){
		var size = getRandomInt(1,3);
		return size;
	},
	particles:15,
	drawGrid:01
}

function Realm(){
	var world = this;
	world.bods = []; world.ankrocks = [];world.rocks = [];world.foods = [];
	world.W = $.W;
	world.H = $.H;
	world.objects = [];
	world.canvasEl = document.createElement("canvas");
	world.canvasEl.width = world.W;
	world.canvasEl.height = world.H;
	world.friction = 0.2;
	var ctx = world.canvasEl.getContext("2d");
	world.optKeys = 0;
	world.sci = {};
	var CollisionGrid = {
		fieldSize : $.cllFldSz,
		grid:[],
		sig:getRandomInt(1,1000)
	}
	//world.CollisionGrid = CollisionGrid;
	var CollisionField = function(){
		this.objects = {};
		this.optKey = null;
	}
	CollisionField.prototype.add = function(obj){
		this.objects[obj.optKey] = obj;
	}
	CollisionField.prototype.remove = function(obj){
		delete this.objects[obj.optKey];
	}
	CollisionGrid.grid = (function(){
		var grid = [];
		var collField;
		var cllFldSz = CollisionGrid.fieldSize;
		for(var j,i = 0; i < world.W; i += cllFldSz){
			grid[i/cllFldSz] = [];
			for( j = 0; j < world.H; j+= cllFldSz){
				collField = new CollisionField();
				grid[i/cllFldSz][j/cllFldSz] = collField;
				collField.optKey = world.optKey();
			}
		}
		return grid;
	})();

	var render = function(){
		ctx.fillStyle = "#000000";
		ctx.fillRect(0,0,world.W,world.H);
		//var CollisionGrid = world.CollisionGrid;
		var cllFldSz = CollisionGrid.fieldSize;
		var collGridW = world.W/cllFldSz;
		var collGridH = world.H/cllFldSz;
		var hasObject = false;
		var drawGrid = $.drawGrid;
		if(drawGrid){
			for(var propLen,j,i = 0; i < collGridW; i += 1){
				for( j = 0; j < collGridH; j += 1){
					hasObject = false;
					propLen = Object.keys( CollisionGrid.grid[i][j].objects ).length;
					if ( propLen > 0 ){
						hasObject = true;
					}
					if( hasObject ){
						ctx.strokeStyle = "#88ff88";
						ctx.strokeRect(i*cllFldSz+1,j*cllFldSz+1,cllFldSz-2,cllFldSz-2);
					}else{
						ctx.strokeStyle = "#880000";
						ctx.strokeRect(i*cllFldSz+1,j*cllFldSz+1,cllFldSz-2,cllFldSz-2);
					}
				}
			}
		}

		ctx.strokeStyle = "#ffffff";
		ctx.beginPath();
		world.objects.forEach(function(obj){
			var theCircle = function(x,y){
				ctx.moveTo(obj.x + x + obj.size, obj.y + y);
				ctx.arc( obj.x + x, obj.y + y, obj.size, 0, Math.PI * 2 );
			}
			theCircle(0,0);
			if(obj.x+obj.size >= world.W){
				theCircle(-world.W,0);
			}
			if(obj.y+obj.size >= world.H){
				theCircle(0,-world.H);
			}
			if(obj.x-obj.size < 0){
				theCircle(world.W,0);
			}
			if(obj.y-obj.size < 0){
				theCircle(0,world.H);
			}
			if((obj.x+obj.size >= world.W)&&(obj.y+obj.size >= world.H)){
				theCircle(-world.W,-world.H);
			}
			if((obj.y+obj.size >= world.H) && (obj.x-obj.size < 0)){
				theCircle(world.W,-world.H);
			}
			if((obj.x+obj.size >= world.W)&&(obj.y-obj.size < 0)){
				theCircle(-world.W,world.H);
			}
			if((obj.y-obj.size < 0)&& (obj.y-obj.size < 0)){
				theCircle(world.W,world.H);
			}
		});
		ctx.stroke();
	}

	this.O = function(x,y){
		this.x = x;
		this.y = y;

		this.size = 2;//$.pSz();
		this.orientation = 360;
		this.collisionFieldAssociations = [];
		this.optKey = null;
		this.direction = 0;
		this.speed = 0;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.anchored = false;
	}
	this.O.prototype.setPos = function(x,y){
		this.x = x;
		this.y = y;
	}
	this.O.prototype.shiftPos = function(x,y){
		this.x += x;
		this.y += y;
	}
	this.O.prototype.setDirection = function(direction){
		this.direction = direction;
		/*###TODO: recalc other vars*/
	}
	this.O.prototype.setSpeed = function(speed){
		this.speed = speed;
		/*###TODO: recalc other vars*/
	}
	this.O.prototype.shiftSpeed = function(speed){
		this.speed += speed;
		/*###TODO: recalc other vars*/
	}
	this.O.prototype.setXSpeed = function(speed){
		this.xSpeed = speed;
		/*###TODO: recalc other vars*/
	}
	this.O.prototype.setYSpeed = function(speed){
		this.ySpeed = speed;
		/*###TODO: recalc other vars*/
	}
	this.O.prototype.shiftXSpeed = function(speed){
		this.xSpeed += speed;
		/*###TODO: recalc other vars*/
	}
	this.O.prototype.shiftYSpeed = function(speed){
		this.ySpeed += speed;
		/*###TODO: recalc other vars*/
	}
	this.O.prototype.move = function(){
		this.shiftPos( this.xSpeed, this.ySpeed);
		var W = world.W;
		var H = world.H;
		if (this.x >= W){
			this.x -= W;
		}
		if (this.x < 0){
			this.x += W;
		}
		if (this.y >= H){
			this.y -= H;
		}
		if (this.y < 0){
			this.y += H;
		}
		this.shiftSpeed( -world.friction );
		this.collisionFieldAssociate();
	}

	world.collisionFieldsToCheck = [];
	this.O.prototype.collisionFieldAssociate = function(){
		//var associatingObj = this;
		for(var myCollField in this.collisionFieldAssociations){
			this.collisionFieldAssociations[myCollField].remove(this);
			this.collisionFieldAssociations[myCollField] = null;
			delete this.collisionFieldAssociations[myCollField];
		};
		//var CollisionGrid = world.CollisionGrid;

		//if(getRandomInt(1,100)==1)
		//	console.log(this);
		var cllFldSz = CollisionGrid.fieldSize;
		var hLaps = (this.size*2)/cllFldSz;
		var vLaps = (this.size*2)/cllFldSz;
		var _this = this;
		var x = this.x;
		var y = this.y;
		var cW = Math.floor(world.W/cllFldSz);
		var cH = Math.floor(world.H/cllFldSz);
		var size = this.size;
		var xOff = Math.floor( (x - size)/cllFldSz );
		if (xOff != Math.floor( (x + size)/cllFldSz) ){
			hLaps += 1;
		}
		var yOff = Math.floor( ( y - size)/cllFldSz );
		if (yOff !=  Math.floor(( y + size)/cllFldSz) ){
			vLaps += 1;
		}
		var collField,ixOff,jyOff;
		//console.log(_this);
		for(var j,i = 0; i < hLaps; i += 1){
			for( j = 0; j < vLaps; j += 1){
				ixOff = i+xOff;
				while  (ixOff>=cW){
					ixOff -= cW;
				}
				while  (ixOff<0){
					ixOff += cW;
				}
				jyOff = j+yOff;
				while (jyOff>=cH){
					jyOff -= cH;
				}
				while  (jyOff<0){
					jyOff += cH;
				}
				if(!CollisionGrid.grid[ixOff] || !CollisionGrid.grid[jyOff]){
					//console.log("NaNNr");
					//console.log(_this);
				}else{
					collField = CollisionGrid.grid[ixOff][jyOff];
					collField.add( _this );
					_this.collisionFieldAssociations[collField.optKey]=collField;
					world.collisionFieldsToCheck.push(collField);	
				}
			}
		}
	}
	world.Decoder = function(){
		//
	}
	world.Anatomical = function(){
		world.O.call(this);
		this.DNA = [];
		this.marker = -1;
		this.trail = [];
		this.maxTrail = 4;
		this.decoder = new world.Decoder();
	}
	world.Anatomical.prototype = Object.create(this.O.prototype/*,{
		tick:function(){
			var bod = this;
			this.marker += 1;
			this.trail.push( this.DNA[this.marker] );
			if(this.trail.length > this.maxTrail){
				this.trail.shift();
			}
			this.decoder.codes.forEach(function(code){
				var passing = true;
				for(var i = code.length; i < bod.trail.length;i+=1){
					//
				}
			});
		}
	}*/);
	world.Anatomical.prototype.tick = function(){
		var bod = this;
		this.marker += 1;
		this.trail.push( this.DNA[this.marker] );
		if(this.trail.length > this.maxTrail){
			this.trail.shift();
		}
		/*
		this.decoder.codes.forEach(function(code){
			var passing = true;
			for(var i = code.length; i < bod.trail.length;i+=1){
				//
			}
		});*/
	}

	world.Anatomical.prototype.constructor = world.Anatomical;

	world.AnchoredRock = function(){
		world.O.call(this);
	}
	world.AnchoredRock.prototype = Object.create(world.O.prototype,{
		//
	});

	world.FreeRock = function(){
		world.O.call(this);
	}
	world.FreeRock.prototype = Object.create(world.O.prototype,{
		//
	});

	world.Food = function(){
		world.O.call(this);
	}
	world.Food.prototype = Object.create(world.O.prototype,{
		//
	});

	setInterval(function(){
		world.tick();
		render();
	},$.tick);
}

Realm.prototype.optKey = function(){
	this.optKeys+=1
	return this.optKeys;
}
Realm.prototype.tick = function(){
	this.bods.concat(this.rocks).concat(this.foods).forEach(function(bod){
		bod.shiftYSpeed(.03);
	})
	this.bods.forEach(function(bod){
		bod.tick();
	})
	this.objects.forEach(function(obj){
		
		obj.move();
	});
	var collisionsAccountedFor = [];
	var world = this;
	this.collisionFieldsToCheck.forEach(function(collField){
		var keys = Object.keys( collField.objects ); 
		if( keys.length > 1 ){
			var obj1, obj2,accountingSig,XX,YY,lapDone;
			for(var d,j,i=0; i < keys.length; i+=1){
				for(j = i+1; j < keys.length; j+=1){
					obj1 = collField.objects[ keys[i] ];
					obj2 = collField.objects[ keys[j] ];
						
					if(obj1.optKey<obj2.optKey){accountingSig = obj1.optKey+"_"+obj2.optKey; }else{accountingSig = obj2.optKey+"_"+obj1.optKey;}
					if(!collisionsAccountedFor[accountingSig]){
						for(XX=-1;XX<=1;XX+=1){
							lapDone = false;
							for(YY=-1;YY<=1;YY+=1){
								d = Math.sqrt( Math.pow(obj1.x - obj2.x + (XX*world.W),2) + Math.pow(obj1.y - obj2.y + (YY*world.H),2) );
								if( d <= (obj1.size+obj2.size) ){
									influence1 = obj2.size/obj1.size/1;
									influence2 = obj1.size/obj2.size/1;
									//obj1.size+obj2.size;
									if (!obj1.anchored){
										obj1.shiftXSpeed ( (   (obj1.x+ XX*world.W) -obj2.x    )/d*(influence1) );
										obj1.shiftYSpeed ( (   (obj1.y+ YY*world.H) -obj2.y    )/d*(influence1) );
									}
									if (!obj2.anchored){
										obj2.shiftXSpeed ( (   obj2.x- (obj1.x + XX*world.W)    )/d*(influence2) );
										obj2.shiftYSpeed ( (   obj2.y- (obj1.y + YY*world.H)    )/d*(influence2) );
									}
									collisionsAccountedFor[accountingSig] = true;
									lapDone = true;
									break;
								}
							}	
							if (lapDone) break;
						}
						
					}
				}	
			}
		}
	});
	//console.clear();
	this.collisionFieldsToCheck = [];
}
Realm.prototype.manifest = function(x,y){
	var o = new this.O();
	o.setPos(x,y);
	o.optKey = this.optKey();
	this.objects.push(o);
	o.collisionFieldAssociate();
	return o;
}
Realm.prototype.createBody = function(x,y){
	var o = new this.Anatomical();
	o.size = 10;
	o.setPos(x,y);
	o.optKey = this.optKey();
	this.objects.push(o);
	this.bods.push(o);
	o.collisionFieldAssociate();
	return o;
}

Realm.prototype.createAnchoredRock = function(x,y){
	var o = new this.AnchoredRock();
	o.setPos(x,y);
	o.anchored = true;
	o.optKey = this.optKey();
	this.objects.push(o);
	this.ankrocks.push(o);
	o.collisionFieldAssociate();
	return o;
}

Realm.prototype.createFreeRock = function(x,y){
	var o = new this.FreeRock();
	o.setPos(x,y);
	o.optKey = this.optKey();
	this.objects.push(o);
	this.rocks.push(o);
	o.collisionFieldAssociate();
	return o;
}

Realm.prototype.createFood = function(x,y){
	var o = new this.Food();
	o.setPos(x,y);
	o.optKey = this.optKey();
	this.objects.push(o);
	this.foods.push(o);
	o.collisionFieldAssociate();
	return o;
}

function chance(oneIn,func){
	if(getRandomInt(1,oneIn)==1){
		func();
	}
}
function getRandomInt(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}function grt(){return getRandomInt(-$.W/2,$.W/2)+$.W/2; }

function Ruleset(dimensions){
	dimensions = 2;
	this.dimensions = dimensions;
	this.tickCostBez = this.generateNature();
}
Ruleset.prototype = {
	generateNature: function(){
		//
	}
}

function MultiVerse(data){
	this.universes = [];
	
	var many = 6;
	var speed = $.kick;
	var currObj;
	var MV = this;
	repeat(data.realms,function(){
		MV.universes.push( new Realm() );
	});
}
function evalCreatureDistance(){/*BS*/}

var SimEval = component(DIV,"simulation",function(evaluationFunction){
	this.evalFun = evaluationFunction;
	var _ = this._;
	var launchButton = c(BUTTON,"","Launch");
	var menu = c(DIV,"menu-bar",[launchButton]);
	_.a(menu);
	var _this = this;
	launchButton.clkOnce(function(){
		_this.launch();
	});
},{
	processEvolRun : function(){
		//
	},
	initState:function(){
		this.dedicatedLab = new MultiVerse($.labLayout);
		configureInitialState( this.dedicatedLab );
	},
	launch:function(){
		this.initState();
		var el = this._;
		this.dedicatedLab.universes.forEach(function(realm){
			el.a(realm.canvasEl);
		});
		setInterval(this.processEvolRun,1000*60*2);
	}
});
/*
function SimEval(evaluationFunction){
	this.evalFun = evaluationFunction;
	this.launch();
}
SimEval.prototype = {
	processEvolRun : function(){
		
	},
	initState:function(){
		this.dedicatedLab = new MultiVerse($.labLayout);
		configureInitialState( this.dedicatedLab );
	},
	launch:function(){
		this.initState();
		this.dedicatedLab.universes.forEach(function(realm){
			BODY.a(realm.canvasEl);
		});
		setInterval(this.processEvolRun,1000*60*2);
	}
}*/

function configureInitialState(lab){
	lab.universes.forEach(function(realm){
		var decoder = new realm.Decoder();
		var originParticle = realm.createBody(50-1,150,decoder);
		originParticle.tracking = 1;
		repeat(60,function(i){
			realm.createAnchoredRock(i*5+25,175);
			//realm.createAnchoredRock( Math.random()*$.W , Math.random()*$.H );
		})
	});
	/*originParticle.dna = inheritOldDNA(); */
	/*BS forloop creating ground*/
}


(function(){
	var simulation = new SimEval(evalCreatureDistance);
	BODY.a(simulation);
})();
