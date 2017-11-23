var $ = {
	W: 3400,
	H: 3400,
	cllFldSz: 25,
	kick: 0,
	pSz :function(){
		var size = getRandomInt(11,25);
		chance(150,function(){
			size = getRandomInt(30,60);
		})
		chance(450,function(){
			size = getRandomInt(90,200);
		})
		chance(1000,function(){
			size = getRandomInt(400,550);
		})
		return size;
	},
	particles:400,
	drawGrid:0
}
function Realm(){
	var world = this;
	world.W = $.W;
	world.H = $.H;
	world.objects = [];
	world.canvasEl = document.createElement("canvas");
	world.canvasEl.width = world.W;
	world.canvasEl.height = world.H;
	var ctx = world.canvasEl.getContext("2d");
	//world.collFieldSize = 25;
	world.optKeys = 0;
	
	var CollisionGrid = {
		fieldSize : $.cllFldSz,
		grid : []
	}
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

	function render(){
		ctx.fillStyle = "#000000";
		ctx.fillRect(0,0,world.W,world.H);
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


	
	O.prototype.move = function(){
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
		this.collisionFieldAssociate();
	}

	world.collionFieldsToCheck = [];
	O.prototype.collisionFieldAssociate = function(){
		var associatingObj = this;
		for(var myCollField in this.collisionFieldAssociations){
			this.collisionFieldAssociations[myCollField].remove(this);
			this.collisionFieldAssociations[myCollField] = null;
			delete this.collisionFieldAssociations[myCollField];
		};
		var cllFldSz = CollisionGrid.fieldSize;
		var hLaps = (this.size*2)/cllFldSz;
		var vLaps = (this.size*2)/cllFldSz;
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
				collField = CollisionGrid.grid[ixOff][jyOff];
				collField.add(this);
				this.collisionFieldAssociations[collField.optKey]=collField;
				world.collionFieldsToCheck.push(collField);
			}
		}
	}

	setInterval(function(){
		world.tick();
		render();
	},50);
}
Realm.prototype.runSelf=function(){
	console.log('Did it work?');
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
	this.collionFieldsToCheck.forEach(function(collField){
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
									influence1 = obj2.size/obj1.size/10;
									influence2 = obj1.size/obj2.size/10;
									obj1.shiftXSpeed ( ( (obj1.x+ XX*world.W) -obj2.x )/d*(influence1) );
									obj1.shiftYSpeed ( ( (obj1.y+ YY*world.H) -obj2.y )/d*(influence1) );
									obj2.shiftXSpeed ( (obj2.x- (obj1.x + XX*world.W) )/d*(influence2) );
									obj2.shiftYSpeed ( (obj2.y- (obj1.y + YY*world.H) )/d*(influence2) );
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
	this.collionFieldsToCheck = [];
}
Realm.prototype.manifest = function(obj,x,y){
	var o = new obj();
	o.setPos(x,y);
	o.optKey = this.optKey();
	this.objects.push(o);
	o.collisionFieldAssociate();
	return o;
}


var O = function(x,y){
	this.x = x;
	this.y = y;

	this.size = $.pSz();

	this.collisionFieldAssociations = [];
	this.optKey = null;
	this.direction = 0;
	this.speed = 0;
	this.xSpeed = 0;
	this.ySpeed = 0;
}
O.prototype.setPos = function(x,y){
	this.x = x;
	this.y = y;
}
O.prototype.shiftPos = function(x,y){
	this.x += x;
	this.y += y;
}
O.prototype.setDirection = function(direction){
	this.direction = direction;
	/*###TODO: recalc other vars*/
}
O.prototype.setSpeed = function(speed){
	this.speed = speed;
	/*###TODO: recalc other vars*/
}
O.prototype.setXSpeed = function(speed){
	this.xSpeed = speed;
	/*###TODO: recalc other vars*/
}
O.prototype.setYSpeed = function(speed){
	this.ySpeed = speed;
	/*###TODO: recalc other vars*/
}
O.prototype.shiftXSpeed = function(speed){
	this.xSpeed += speed;
	/*###TODO: recalc other vars*/
}
O.prototype.shiftYSpeed = function(speed){
	this.ySpeed += speed;
	/*###TODO: recalc other vars*/
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

(function(){
	var world = new Realm();
	var body = document.getElementsByTagName("body")[0];
	body.appendChild(world.canvasEl);

	var currObj;
	var speed = $.kick;
	for(var i = 0; i < $.particles; i += 1){
		currObj = world.manifest(O,grt(),grt());
		currObj.setXSpeed( ( Math.random()-.5 ) * speed );
		currObj.setYSpeed( ( Math.random()-.5 ) * speed );
	}
	
})();
