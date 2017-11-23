var NAMAGE =["SOUL","STRANDCP","NODE"];

var Klasses = [];
for(var i = 0;i< NAMAGE.length;i+=1){
	window[NAMAGE[i]]=i;
	Klasses[i] = {
		sup:[]
	};
}
var $ = {
	labLayout:{
		realms:1
	},
	W: 500,
	H: 500,
	cllFldSz: 50,
	tick:50,
	kick: 0,
	pSz :function(){
		var size = getRandomInt(1,3);
		return size;
	},
	particles:15,
	drawGrid:01
}

function Realm(){
	var world = this;
	world.souls = []; world.strandControlPoints = []; world.nodes = [];
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
		world.souls.forEach(function(obj){
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

		/*
		ctx.beginPath();
		ctx.strokeStyle = "#ee8822";
		ctx.lineWidth = 3;
		ctx.moveTo(50, 50);
		ctx.lineTo(250 ,150);
		ctx.lineTo(100 ,500);
		ctx.stroke();
		*/

		world.souls.forEach(function(obj){
			if( 1  ){
				
				var strand = function(linkControlPoints){
					
					
					var controlPoints = [{x:obj.x,y:obj.y}];
					controlPoints = controlPoints.concat(linkControlPoints);
					controlPoints.push({ x:obj.soulBound.x , y:obj.soulBound.y });
					//yox(controlPoints);
					var pyramid = [];
					var pointCount = controlPoints.length;
					pyramid[0] = controlPoints;

					var j,i;
					for(i = 1; i < pointCount; i+=1){
						pyramid[i] = [];
						for(j =0; j< pointCount-i;j+=1){
							pyramid[i].push({});
						}
					}

					var resolution = 100;
					var k,X,Y;
					
					

					for( i = 0; i<=resolution; i+=1){
						for( j = 1; j < pyramid.length ; j+=1){
							for(k=0; k<pyramid[j].length; k+=1){
								var x0 = pyramid[j-1][k].x;
								var x1 = pyramid[j-1][k+1].x;
								var y0 = pyramid[j-1][k].y;
								var y1 = pyramid[j-1][k+1].y;
								//
								pyramid[j][k].x = x0 + (x1 - x0)*(i/resolution);
								pyramid[j][k].y = y0 + (y1 - y0)*(i/resolution);
							}
						}
						
						X = pyramid[j-1][0].x;
						Y = pyramid[j-1][0].y;
						ctx.lineTo(X ,Y );
					};
					//return lineList;
				}
				//yox('soull')
				//ctx.beginPath();
				//ctx.strokeStyle = "#ee8822";
				//yox("test...")
				//ctx.lineWidth = 3;
				
				for(var i = 0; i< obj.strands.length; i+=1){
					ctx.beginPath();
					ctx.strokeStyle = "#ee8822";
					ctx.lineWidth = 1;
					//ctx.moveTo(obj.x, obj.y);
					strand( obj.strands[i].controlPoints );
					//yox(ll);
					ctx.stroke();
				}
				/*ctx.beginPath();
				ctx.strokeStyle = "#ee8822";
				ctx.lineWidth = 3;
				ctx.moveTo(50, 50);
				ctx.lineTo(250 ,150);
				ctx.lineTo(100 ,500);
				ctx.stroke();*/
				
				//ctx.stroke();
				
			}
		});
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
	this.O.prototype.newSoulBound = function(){
		this.soulBound = world.souls[getRandomInt(0,world.souls.length-1)];
		/*###TODO: recalc other vars*/
	}
	this.O.prototype.alignish = function(){
		var targetX,targetY;
		var yank = 0.01;
		var maxSpeed = 3;//yeah. i should use sin and cos shit. but whatever for now
		targetX = ( this.owner.soulBound.x - this.owner.x ) * this.hoverAround + this.owner.x;
		targetX += this.txOffset;
		this.shiftXSpeed( (targetX - this.x)*yank );
		if (this.xSpeed>maxSpeed){
			this.setXSpeed(maxSpeed);
		}else if (this.xSpeed<-maxSpeed){
			this.setXSpeed(-maxSpeed);
		}
		targetY = ( this.owner.soulBound.y - this.owner.y ) * this.hoverAround + this.owner.y;
		targetY += this.tyOffset;
		this.shiftYSpeed( (targetY - this.y)*yank );
		if (this.ySpeed>maxSpeed){
			this.setYSpeed(maxSpeed);
		}else if (this.ySpeed<-maxSpeed){
			this.setYSpeed(-maxSpeed);
		}
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
	world.Particle = function(){
		world.O.call(this);
		this.DNA = [];
		this.marker = -1;
		this.trail = [];
		this.maxTrail = 4;
		this.decoder = new world.Decoder();
	}
	world.Particle.prototype = Object.create(this.O.prototype);
	world.Particle.prototype.constructor = world.Particle;

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
	this.strandControlPoints.forEach(function(scp){	
		scp.alignish();
	});
	this.objects.forEach(function(obj){	
		obj.move();
	});
	var collisionsAccountedFor = [];
	var world = this;
	if (false)
	this.collisionFieldsToCheck.forEach(function(collField){
		var keys = Object.keys( collField.objects ); 
		if( keys.length > 1 ){
			var obj1, obj2,accountingSig,XX,YY,lapDone;
			for(var d,j,i=0; i < keys.length; i+=1){
				for(j = i+1; j < keys.length; j+=1){
					obj1 = collField.objects[ keys[i] ];
					obj2 = collField.objects[ keys[j] ];
					if(obj1.type!==STRANDCP && obj2.type!==STRANDCP){	
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
Realm.prototype.createSoul = function(x,y){
	var o = new this.Particle();
	o.size = 5;
	o.setPos(x,y);
	o.optKey = this.optKey();
	this.objects.push(o);
	this.souls.push(o);
	o.collisionFieldAssociate();
	o.type = SOUL;
	o.setYSpeed( jitter(5) );
	o.setXSpeed( jitter(5) );
	var strandControlPoint,strandPoints,strandCount = getRandomInt(1,4);
	o.strands = [];
	for(var strand,j,i=0; i<strandCount; i+=1){
		strandPoints = getRandomInt(1,4);
		o.strands[i]={surgeSpeed:getRandomInt(0,15)/100,controlPoints:[]};
		strand = o.strands[i];
		for(j=0; j<strandPoints; j+=1){
			strandControlPoint = this.createStrandControlPoint(x+jitter(50),y+jitter(50));
			strandControlPoint.hoverAround = getRandomInt(0,100)/100;
			strandControlPoint.owner = o;
			strandControlPoint.txOffset = jitter(100);
			strandControlPoint.tyOffset = jitter(100);
			strand.controlPoints.push(strandControlPoint);
		}
	}
	return o;
}
function jitter(x){
	return Math.random()*x-(x/2);
}
Realm.prototype.createStrandControlPoint = function(x,y){
	var o = new this.Particle();
	o.size = 1;
	o.setPos(x,y);
	o.optKey = this.optKey();
	this.objects.push(o);
	this.strandControlPoints.push(o);
	o.collisionFieldAssociate();
	o.type=STRANDCP;
	return o;
}
Realm.prototype.createNode = function(x,y){
	var o = new this.Particle();
	o.size = 2;
	o.setPos(x,y);
	o.optKey = this.optKey();
	this.objects.push(o);
	this.strands.push(o);
	o.collisionFieldAssociate();
	o.type=NODE;
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

function configureInitialState(lab){
	lab.universes.forEach(function(realm){
		var decoder = new realm.Decoder();
		//var originParticle = realm.createSoul(50-1,150,decoder);
		//originParticle.tracking = 1;
		repeat(22,function(i){
			realm.createSoul(Math.random()*$.W,Math.random()*$.H);
		});
		realm.souls.forEach(function(soul){soul.newSoulBound();})
	});
}


(function(){
	simulation = new SimEval(evalCreatureDistance);
	BODY.a(simulation);
})();
