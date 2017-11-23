var $ = {
	W: 100,
	H: 100,
	cllFldSz: 20,
	tick:30,
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

		this.size = $.pSz();
		this.orientation = 360;
		this.collisionFieldAssociations = [];
		this.optKey = null;
		this.direction = 0;
		this.speed = 0;
		this.xSpeed = 0;
		this.ySpeed = 0;
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
									obj1.shiftXSpeed ( (   (obj1.x+ XX*world.W) -obj2.x    )/d*(influence1) );
									obj1.shiftYSpeed ( (   (obj1.y+ YY*world.H) -obj2.y    )/d*(influence1) );
									obj2.shiftXSpeed ( (   obj2.x- (obj1.x + XX*world.W)    )/d*(influence2) );
									obj2.shiftYSpeed ( (   obj2.y- (obj1.y + YY*world.H)    )/d*(influence2) );
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
//function choose()

function MultiVerse(){
	this.realms =[];
	var many = 6;var speed = $.kick;var currObj;
	var i,j,k,sci, body = document.getElementsByTagName("body")[0],
		physicsSets  = many;
		decoderSets = many;
	for(i = 0; i<physicsSets ; i+=1){
		for(j = 0; j<decoderSets ; j+=1){
			world = new Realm();
			sci = world.sci;
			(function(){

				sci.particleTypes = [];
				sci.fieldTypes = [];
				sci.DNAcodes = getRandomInt(3,10);
				sci.keyLength = getRandomInt(3,6);
				var particleTypes = getRandomInt(25,300);
				var fieldTypes = getRandomInt(3,8);
				var natureClusters = getRandomInt(5,20);
				
				/*for(var i=0; i < particleTypes; i+=1){
					//
				}*/
				
				for(var fT,j, i = 0; i < fieldTypes; i += 1){
					sci.fieldTypes[i] = [];
					fT = sci.fieldTypes[i] = {
						reactions:[],
						baseDensity: getRandomInt(1,500),
						radiation: getRandomInt(1,10000)/10000,

					};
					for( j = 0; j < fieldTypes; j += 1){
						fT.reactions[j] = {
							force: getRandomInt(-100,100),
							flow: getRandomInt(-100,100)
						}
					}
				}
				var k,j,dotSpec, particleFieldAmp,belts,triggers,triggerCount,nodes,death;
				for( i=0; i < particleTypes; i+=1){
					belts = getRandomInt(1,10);
					if(getRandomInt(0,1)){
						death = {type:0, energy: Math.random()*100};
					}else{
						death = {type:1, belt: getRandomInt(1,belts)-1, particleType: getRandomInt(1,particleTypes)-1 };
					}
					
					dotSpec = {
						belts:[],
						death: death,
						tick:Math.random()*5,
						friction: Math.random()*10
					};
					for(j = 0; j<belts; j+=1){
						triggerCount = getRandomInt(0,12);
						triggers = [];
						nodes = getRandomInt(1,12);
						for(k = 0;k<triggerCount;k+=1){
							triggers[k]={
								handle:{
									in: getRandomInt(0,1),
									DNA: getRandomInt(1,sci.DNAcodes)-1
								},
								type: getRandomInt(1,particleTypes)-1
							}
						}
						dotSpec.belts[j] = {
							orientation:getRandomInt(0,1),//0 or 1
							amp:getRandomInt(-100,100),
							range:getRandomInt(0,200),
							nodes:nodes,
							type:getRandomInt(1,fieldTypes)-1,
							triggers:triggers
						};
					}
					sci.particleTypes.push(dotSpec);
				}
			})();
			
			this.realms.push(world);
			body.appendChild(world.canvasEl);
			for(var k = 0; k < $.particles; k += 1){
				currObj = world.manifest(Math.random()*$.W,Math.random()*$.H);
				currObj.setXSpeed( ( Math.random()-.5 ) * speed );
				currObj.setYSpeed( ( Math.random()-.5 ) * speed );
			}
		}		
	}
}
(function(){
	_ = new MultiVerse();
})();
