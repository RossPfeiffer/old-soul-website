var NAMAGE =["SOUL","STRANDCP","LINKER","GAPBRUSH"];

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
	W: 1200,
	H: 200,
	cllFldSz:50,
	tick:50,
	kick: 0,
	pSz :function(){
		var size = getRandomInt(1,3);
		return size;
	},
	soulSize:1,
	linkerSize:50,
	particles:80,
	gapBrushes:0,
	soulSpark:.9999,
	drawGrid:0,
	colors:{
		soulgush:"233,223,255",
		soulmesh:"243,243,255",
		background: "46,11,46"
	}
}

function Realm(){
	var world = this;
	world.souls = []; world.strandControlPoints = []; world.linkers = []; world.gapBrushes=[];
	world.W = $.W;
	world.H = $.H;
	world.objects = [];
	world.canvasEl = document.createElement("canvas");
	world.canvasEl.width = world.W;
	world.canvasEl.height = world.H;
	var ctx = world.canvasEl.getContext("2d");
	world.canvasEl2 = document.createElement("canvas");
	world.canvasEl2.width = world.W;
	world.canvasEl2.height = world.H;
	var ctx2 = world.canvasEl2.getContext("2d");
	world.friction = 0.2;
	ctx.fillStyle = "rgba("+$.colors.background+",1)";
	ctx.fillRect(0,0,world.W,world.H);

	
	/*ctx.fillStyle = "rgba(182,38,96,1)";
	ctx.beginPath();
	ctx.moveTo(22, 13);
	var sS = 50;
	repeat(3,function(){
		ctx.lineTo(200+jitter(sS),200+jitter(sS));	
	});
	ctx.closePath();
	ctx.fill();*/


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
		ctx.fillStyle = "rgba("+$.colors.background+",1)";
		ctx.fillRect(0,0,world.W,world.H);
		ctx2.clearRect(0,0,world.W,world.H);
		//var CollisionGrid = world.CollisionGrid;
		var cllFldSz = CollisionGrid.fieldSize;
		var collGridW = world.W/cllFldSz;
		var collGridH = world.H/cllFldSz;
		var hasObject = false;
		var drawGrid = $.drawGrid;
		if(drawGrid){
			for(var propLen,j,i = 0; i < collGridW; i += 1){
				for( j = 0; j < collGridH; j += 1){
					if(Math.random()>.99){
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
		}

		//ctx.strokeStyle = "#ffffff";
		//ctx.beginPath();
		/*world.souls.forEach(function(obj){
			var theCircle = function(x,y){
				var sS = obj.size+3;// + obj.sheen;
				if (obj.sheen > 1){
					obj.sheen *= .99
				}
				var soulGrad = ctx.createRadialGradient(obj.x, obj.y, sS*2, obj.x, obj.y, 0);
				soulGrad.addColorStop(0,"rgba("+$.colors.background+",0)");
				soulGrad.addColorStop(0.5,"rgba("+$.colors.background+",1)");
				soulGrad.addColorStop(-Math.random()*.1+.5,"rgba("+$.colors.background+",0.6)");
				soulGrad.addColorStop(1,"rgba("+$.colors.background+",0)");
				ctx.fillStyle = soulGrad;
				ctx.fillRect(0,0, $.W, $.H);
				//ctx.moveTo(obj.x + x + obj.size, obj.y + y);
				//ctx.arc( obj.x + x, obj.y + y, obj.size, 0, Math.PI * 2 );
			}

			//theCircle(0,0);


			
		});*/
		//ctx.stroke();
		world.souls.forEach(function(obj){
			var theCircle = function(x,y){
				var sS = obj.size;// + obj.sheen;
				/*var soulGrad = ctx2.createRadialGradient(obj.x, obj.y, sS*2, obj.x, obj.y, 0);
				soulGrad.addColorStop(0,"rgba("+$.colors.background+",0)");
				soulGrad.addColorStop(Math.random()*.1+.5,"rgba("+$.colors.background+",0.4)");
				soulGrad.addColorStop(1,"rgba("+$.colors.background+",1)");
				*/
				//if (sS>3)
				repeat(0,function(){
					ctx.fillStyle = "rgba("+$.colors.soulgush+","+(Math.random()/2)+")";//"rgba(182,25,96,1)";
					//ctx.fillStyle = '#f00';
					ctx.beginPath();
					ctx.moveTo(obj.x, obj.y);
					var m = sS*3.5;
					repeat(3,function(){
						ctx.lineTo(obj.x+jitter(m),obj.y+jitter(m));	
					});
					ctx.closePath();
					ctx.fill();
				});
				//ctx.fillRect(0,0, $.W, $.H);
				//ctx.fillRect(obj.x, obj.y, obj.x+sS, obj.y+sS);

			}
			//if (!obj.spaceFilled){
			theCircle(0,0);	
			//}
		});

		world.gapBrushes.forEach(function(obj){
			var theCircle = function(x,y){
				var sS = obj.size;// + obj.sheen;
				/*var soulGrad = ctx2.createRadialGradient(obj.x, obj.y, sS*2, obj.x, obj.y, 0);
				soulGrad.addColorStop(0,"rgba("+$.colors.background+",0)");
				soulGrad.addColorStop(Math.random()*.1+.5,"rgba("+$.colors.background+",0.4)");
				soulGrad.addColorStop(1,"rgba("+$.colors.background+",1)");
				*/
				repeat(5,function(){
					ctx.fillStyle = "rgba("+$.colors.background+","+Math.random()+")";//"rgba(182,25,96,1)";
					//ctx.fillStyle = '#f00';
					ctx.beginPath();
					ctx.moveTo(obj.x, obj.y);
					var m = sS*2;
					repeat(4,function(){
						ctx.lineTo(obj.x+jitter(m),obj.y+jitter(m));	
					});
					ctx.closePath();
					ctx.fill();
				});
				//ctx.fillRect(0,0, $.W, $.H);
				//ctx.fillRect(obj.x, obj.y, obj.x+sS, obj.y+sS);

			}
			if (!obj.spaceFilled){
				theCircle(0,0);	
			}
		});



		world.souls.forEach(function(obj){
			var theCircle = function(x,y){
				var sS = obj.size;// + obj.sheen;
				if (obj.sheen > 1){
					obj.sheen *= .99
				}
				/*var *///sheenly = 1/(Math.sqrt( obj.connections.length+1) ) ;//
				sheenly =( 1/( obj.connections.length+1 ) ) *obj.sheen;//1;
				var soulGrad = ctx2.createRadialGradient(obj.x, obj.y, sS*2, obj.x, obj.y, 0);
				soulGrad.addColorStop(0,"rgba(255,255,255,0)");
				soulGrad.addColorStop(Math.random()*.1+.5,"rgba(255,255,255,"+( sheenly*0.4)+")");
				soulGrad.addColorStop(1,"rgba(255,255,255,"+( sheenly )+")");
				ctx2.fillStyle = soulGrad;
				ctx2.fillRect(0,0, $.W, $.H);
				/*ctx.beginPath();
				ctx.moveTo(obj.x, obj.y);
					
				ctx.moveTo(obj.x + x + obj.size, obj.y + y);
				ctx.arc( obj.x + x, obj.y + y, obj.size, 0, Math.PI * 2 );
				ctx.stroke()*/
			}

			theCircle(0,0);


			ctx.lineWidth = 3;
				
			for(var alpha,i = 0; i < obj.connections.length; i+=1){
				var sS = Math.sqrt( Math.abs( obj.sheen - obj.connections[i].linker.owner.sheen ) ) + 1;
				var jit = (obj.size + obj.connections[i].linker.owner.size)/2;
				var maxSheen = Math.max(obj.sheen , obj.connections[i].linker.owner.sheen)
				
					alpha = obj.connections[i].alpha/maxSheen;///sS;
				
				

				ctx.beginPath();
				ctx.lineWidth = 1;
				if(obj.connections.length === obj.connections[i].linker.owner.connections.length ){
					ctx.strokeStyle = "rgba(80,220,255,"+alpha+")";
				}else{
					ctx.strokeStyle = "rgba("+$.colors.soulmesh+","+alpha+")";
				}
				if (obj.surging) ctx.strokeStyle = "rgba(235,235,124,"+alpha+")";
				
				
				ctx.moveTo(obj.x,obj.y);
				//ctx.lineTo(obj.connections[i].linker.x+jitter(jit*2),obj.connections[i].linker.y+jitter(jit*2));
				ctx.lineTo(obj.connections[i].linker.x,obj.connections[i].linker.y);
				ctx.stroke();	
			}
			
		});
		//ctx.stroke();
		
		ctx.strokeStyle = "#ffffff22";
		ctx.beginPath();
		ctx.lineWidth = 1;
		world.linkers.forEach(function(obj){
			var theCircle = function(x,y){
			/*	var sS = obj.size + obj.owner.sheen;
				ctx.moveTo(obj.x + x + sS, obj.y + y);
				ctx.arc( obj.x + x, obj.y + y, sS, 0, Math.PI * 2 );
			*/}

			theCircle(0,0);
		});
		ctx.stroke();

		world.souls.forEach(function(obj){
			if(obj.surging){//obj.surging){
				
				var strand = function(strand){

					var linkControlPoints = strand.controlPoints;
					
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
					var k,X,Y,prevX,prevY;
					
					

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

						if(i>(strand.surgeDistance-strand.surgeTail) && i<=strand.surgeDistance){
							ctx2.beginPath();
							ctx2.lineWidth = 3;
							ctx2.moveTo(prevX,prevY);
							
							ctx2.strokeStyle = "rgba(255,255,255,"+( ( 1 -  ( ( strand.surgeDistance - i ) /strand.surgeTail) ) *.6 ) +")";
							ctx2.lineTo(X ,Y );	
							ctx2.stroke();
						}

						prevX = X;
						prevY = Y;
					};
					if(strand.surgeDistance>=100 && !strand.delivered){
						obj.soulBound.sheen+=15/strand.surgeTail;

					}
					if (strand.surgeDistance>=100+strand.surgeTail){
						obj.surgeCountdown+=1;
						if(!strand.delivered){
							if(obj.sheen > 1)
							obj.sheen *=.95;
							strand.delivered = true;
						}
						
					}
					strand.surgeDistance += strand.surgeSpeed;
					//return lineList;
				}
				obj.surgeCountdown = 0;
				for(var i = 0; i< obj.strands.length; i+=1){
					strand( obj.strands[i] );
					
				}
				if (obj.surgeCountdown == obj.strands.length){
					obj.surging=false;
					obj.soulBound.loopLocked = true;
					obj.loopLocked = true;
				}
			}else{
				if( Math.random()>$.soulSpark ){

					obj.loopLocked = false;
					obj.newSoulBound();
					obj.surging = true;
					var maxDistance = getRandomInt(0,1500)
					obj.strands.forEach(function(strand){
						strand.surgeDistance = -getRandomInt(0,maxDistance);
						strand.surgeTail = getRandomInt(5,60);
						strand.surgeSpeed = getRandomInt(2,6);
						strand.delivered =false;
					});
				}
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
		var loopable = true;
		if(this.type===STRANDCP ){
			loopable = false;
		}
		if(this.type===SOUL){
			loopable = false;
		}
		if(loopable){
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
		}else{
			if (this.x >= W){
				this.x = W-1;
				this.setXSpeed(-this.xSpeed);
			}
			if (this.x < 0){
				this.x = 0;
				this.setXSpeed(-this.xSpeed);
			}
			if (this.y >= H){
				this.y = H-1;
				this.setYSpeed(-this.ySpeed);
			}
			if (this.y < 0){
				this.y = 0;
				this.setYSpeed(-this.ySpeed);
			}
		}
		this.shiftSpeed( -world.friction );
		if(this.type===SOUL || this.type===LINKER || this.type===GAPBRUSH){
			this.collisionFieldAssociate();	
		}
	}
	this.O.prototype.newSoulBound = function(){
		this.soulBound = world.souls[getRandomInt(0,world.souls.length-1)];
		/*###TODO: recalc other vars*/
	}

	this.O.prototype.center = function(){
		this.x  = this.owner.x;
		this.y  = this.owner.y;
	}

	this.O.prototype.addConnection = function(linker,alpha){
		this.connections.push({linker:linker,alpha:alpha});
	}
	this.O.prototype.alignish = function(){
		var targetX,targetY;
		var yank = 1;
		var maxSpeed = 15;//yeah. i should use sin and cos shit. but whatever for now
		/*if(Math.random()>.995){
			this.txOffset = jitter(300);
			this.tyOffset = jitter(300);
		}*/

		targetX = ( this.owner.soulBound.x - this.owner.x ) * this.hoverAround + this.owner.x;
		targetX += this.txOffset;
		/*this.shiftXSpeed( (targetX - this.x)*yank );
		if (this.xSpeed>maxSpeed){
			this.setXSpeed(maxSpeed);
		}else if (this.xSpeed<-maxSpeed){
			this.setXSpeed(-maxSpeed);
		}*/
		targetY = ( this.owner.soulBound.y - this.owner.y ) * this.hoverAround + this.owner.y;
		targetY += this.tyOffset;
		/*this.shiftYSpeed( (targetY - this.y)*yank );
		if (this.ySpeed>maxSpeed){
			this.setYSpeed(maxSpeed);
		}else if (this.ySpeed<-maxSpeed){
			this.setYSpeed(-maxSpeed);
		}*/
		//this should help the control points "snap" in...
		this.x = targetX;
		this.y = targetY; 
		var d = Math.sqrt( Math.pow(this.x - targetX,2) + Math.pow(this.y - targetY,2) );
		if (d<50){
			this.setXSpeed(this.xSpeed*.990);
			this.setYSpeed(this.ySpeed*.990);
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
	this.gapBrushes.forEach(function(obj){	
		obj.setPos(Math.random()*$.W,Math.random()*$.H);
		obj.spaceFilled = false;
		obj.stillNeedsToJump = false;
		
	});
	this.souls.forEach(function(soul){	
		soul.connections=[];
		soul.size = soul.sheen + $.soulSize;
	});
	this.linkers.forEach(function(scp){	
		scp.center();
		scp.size = (scp.owner.sheen-1)*5 +$.linkerSize;
	});
	var collisionsAccountedFor = [];
	var world = this;
	//if (false)
	this.collisionFieldsToCheck.forEach(function(collField){
		var keys = Object.keys( collField.objects ); 
		if( keys.length > 1 ){
			var obj1, obj2,linker,soul,accountingSig,XX,YY,sS,lapDone,push;
			for(var d,j,i=0; i < keys.length; i+=1){
				for(j = i+1; j < keys.length; j+=1){
					obj1 = collField.objects[ keys[i] ];
					obj2 = collField.objects[ keys[j] ];
					if(  (obj1.type===SOUL && obj2.type===LINKER) || (obj2.type===SOUL && obj1.type===LINKER)  ){
						if(obj1.type===SOUL){
							soul = obj1;
							linker = obj2;
						}else{
							soul = obj2;
							linker = obj1;
						}
						if(linker.owner!==soul){
							if(obj1.optKey<obj2.optKey){accountingSig = obj1.optKey+"_"+obj2.optKey; }else{accountingSig = obj2.optKey+"_"+obj1.optKey;}
							if(!collisionsAccountedFor[accountingSig]){
								//for(XX=-1;XX<=1;XX+=1){
									//lapDone = false;
									//for(YY=-1;YY<=1;YY+=1){
								XX = 0; YY = 0;
								sS = obj1.size+obj2.size;
								if(obj1.x === obj2.x && obj1.y === obj2.y){
									soul.newSoulBound();
									soul.x = soul.soulBound.x+jitter(1);
									soul.y = soul.soulBound.y+jitter(1);
									
									linker.soulBound = soul.soulBound;
									linker.x = linker.soulBound.x+jitter(1);
									linker.y = linker.soulBound.y+jitter(1);
									//I don't really care about the rare possible glitchy effect
								}else { 
									d = Math.sqrt( Math.pow(obj1.x - obj2.x /*+ (XX*world.W)*/,2) + Math.pow(obj1.y - obj2.y /*+ (YY*world.H)*/,2) );
									
									if( d <= (sS) ){
										soul.addConnection(linker, (1-(d/sS)) /2 );
										
										push = linker.owner.sheen;//obj2.size/obj1.size/1;
										//influence2 = obj1.size/obj2.size/1;
										//obj1.size+obj2.size;
										//if (!obj1.anchored){
										if(d<=sS*.9){
											if(d<sS*.37){

												if(d<sS*.1){
													soul.shiftXSpeed ( (   (soul.x+ XX*world.W) -linker.x    )/d*(4/push) );
													soul.shiftYSpeed ( (   (soul.y+ YY*world.H) -linker.y    )/d*(4/push) );	
												}else{
													soul.shiftXSpeed ( (   (soul.x+ XX*world.W) -linker.x    )/d*(1.5/push) );
													soul.shiftYSpeed ( (   (soul.y+ YY*world.H) -linker.y    )/d*(1.5/push) );		
												}
													
											}else{

												soul.shiftXSpeed ( (   soul.x -linker.x    )/d*(-push/10*(soul.sheen/5)  ) );///linker.owner.sheen ) );
												soul.shiftYSpeed ( (   soul.y -linker.y    )/d*(-push/10*(soul.sheen/5)  ) );///linker.owner.sheen ) );	
											}
										}
										//if(d>sS*(1- (0.2/linker.owner.sheen) ) ){
										if(d>sS*.90){
											if (Math.abs(soul.xSpeed) > 0){
												soul.setXSpeed ( soul.xSpeed * .95 );	
											}
											if (Math.abs(soul.ySpeed) > 0){
												soul.setYSpeed ( soul.ySpeed * .95 );	
											}
											//soul.setYSpeed ( (   (soul.y+ YY*world.H) -linker.y    )/d*(influence1) );		
										}/**/
										//}
										/*if (!obj2.anchored){
											obj2.shiftXSpeed ( (   obj2.x- (obj1.x + XX*world.W)    )/d*(influence2) );
											obj2.shiftYSpeed ( (   obj2.y- (obj1.y + YY*world.H)    )/d*(influence2) );
										}*/
										collisionsAccountedFor[accountingSig] = true;
										//lapDone = true;
										//break;
									}
								}
									//}	
									//if (lapDone) break;
								//}	
							}
						}
					}else if(  
						( (obj1.type===SOUL && obj2.type===GAPBRUSH) || (obj2.type===SOUL && obj1.type===GAPBRUSH) ) ||
						 (obj2.type===GAPBRUSH && obj1.type===GAPBRUSH)
						  ){
						if(obj1.type===SOUL){
							soul = obj1;
							gapBrush = obj2;
						}else{
							soul = obj2;
							gapBrush = obj1;
						}
						if(obj1.optKey<obj2.optKey){accountingSig = obj1.optKey+"_"+obj2.optKey; }else{accountingSig = obj2.optKey+"_"+obj1.optKey;}
						if(!collisionsAccountedFor[accountingSig]){
							sS = obj1.size+obj2.size;
							d = Math.sqrt( Math.pow(obj1.x - obj2.x ,2) + Math.pow(obj1.y - obj2.y,2) );
							if( d <= (sS) ){
								if (obj2.type===GAPBRUSH && obj1.type===GAPBRUSH){
									gapBrush.stillNeedsToJump = true;
								}else{
									if(soul.sheen<1.1){
										gapBrush.spaceFilled = true;
									}
								}
								
								collisionsAccountedFor[accountingSig] = true;
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
	o.size = 2;
	o.setPos(x,y);
	o.vibeOffset = getRandomInt(0,100);
	o.optKey = this.optKey();
	this.objects.push(o);
	this.souls.push(o);
	o.collisionFieldAssociate();
	o.type = SOUL;
	var jit = 5;
	o.setYSpeed( jitter(jit) );
	o.setXSpeed( jitter(jit) );
	o.surging = false;
	o.discharged = 0;
	var strandControlPoint,strandPoints,strandCount = getRandomInt(1,5);
	o.strands = [];
	o.loopLocked = false;
	o.sheen = 1;
	for(var strand,j,i=0; i<strandCount; i+=1){
		strandPoints = getRandomInt(3,7);
		o.strands[i]={
			surgeSpeed:getRandomInt(5,25),
			surgeDistance:-getRandomInt(0,500),//delays
			surgeTail:getRandomInt(10,50),
			controlPoints:[]
		};
		strand = o.strands[i];
		for(j=0; j<strandPoints; j+=1){
			strandControlPoint = this.createStrandControlPoint(x+jitter(50),y+jitter(50));
			strandControlPoint.hoverAround = getRandomInt(0,100)/100;
			strandControlPoint.owner = o;
			strandControlPoint.tyOffset = jitter(100);
			strandControlPoint.txOffset = jitter(100);
			strand.controlPoints.push(strandControlPoint);
		}
	}
	o.linker = this.createLinker(x,y);
	o.linker.owner = o;
	o.connections = [];
;	return o;
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
	o.type=STRANDCP;
	return o;
}

Realm.prototype.createGapBrush = function(x,y){
	var o = new this.Particle();
	o.size = 20;
	o.setPos(x,y);
	o.optKey = this.optKey();
	this.objects.push(o);
	this.gapBrushes.push(o);
	this.spaceFilled = false;
	this.stillNeedsToJump = false;
	o.type=GAPBRUSH;
	return o;
}
Realm.prototype.createLinker = function(x,y){
	var o = new this.Particle();
	o.size = 100;
	o.setPos(x,y);
	o.optKey = this.optKey();
	this.objects.push(o);
	this.linkers.push(o);
	o.collisionFieldAssociate();
	o.type=LINKER;
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
			el.a(c(DIV,"simulation-layers",[{class:'blur-canvas',_:realm.canvasEl},realm.canvasEl2,c(DIV,'clear')]));
		});
		setInterval(this.processEvolRun,1000*60*2);
	}
});

function configureInitialState(lab){
	lab.universes.forEach(function(realm){
		var decoder = new realm.Decoder();
		//var originParticle = realm.createSoul(50-1,150,decoder);
		//originParticle.tracking = 1;
		repeat($.particles,function(i){
			realm.createSoul(Math.random()*$.W,Math.random()*$.H);
		});
		
		repeat($.gapBrushes,function(i){
			realm.createGapBrush(Math.random()*$.W,Math.random()*$.H);
		});
		
		realm.souls.forEach(function(soul){soul.newSoulBound();})
	});
}


(function(){
	simulation = new SimEval(evalCreatureDistance);
	BODY.a(simulation);
})();
