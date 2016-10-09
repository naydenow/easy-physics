/**
 * [Vector description]
 * @param {Number} x [description]
 * @param {Number} y [description]
 */
function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.type = 'Vector';
}

Vector.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;
  return this;
}

Vector.prototype.rotate = function(a) {
  var x = this.x;
  var y = this.y;

  this.x = x * Math.cos(a) - y * Math.sin(a);
  this.y = x * Math.sin(a) + y * Math.cos(a);

  return this;
};

 Vector.prototype.copy  = function(v) {
  this.x = v.x;
  this.y = v.y;
  return this;
}

 Vector.prototype.add  = function(v) {
  this.x += v.x;
  this.y += v.y;
  return this;
}

Vector.prototype.multiply  = function(v) {
  if (v instanceof Vector) {
    this.x *= v.x;
    this.y *= v.y;
  } else if (typeof v === "number") {
    this.x *= v;
    this.y *= v;
    return this;
  }
  return this;
}

Vector.prototype.sub  = function(v) {
  this.x -= v.x;
  this.y -= v.y;
  return this;
}

Vector.prototype.toArray  = function() {
  return [this.x, this.y];
}

Vector.prototype.divide  = function(v) {
  if (v instanceof Vector) {
    this.x /= v.x;
    this.y /= v.y;
    return this;
  } else if (typeof v === "number") {
    this.x /= v;
    this.y /= v;
    return this;
  }
}

Vector.prototype.clone  = function() {
  return new this.constructor(this.x, this.y);
}

Vector.prototype.distanceTo  = function(v) {
  return Math.sqrt(this.distanceToSquared(v));
}

 Vector.prototype.distanceToSquared  = function(v) {
  var dx = this.x - v.x, dy = this.y - v.y;
  return dx * dx + dy * dy;
}


/**
 * [Point description]
 * @param {[type]} x [description]
 * @param {[type]} y [description]
 */

function Point(x,y){
  this.position = new Vector(x,y);
  this.type = 'Point';
}


/**
 * [Polygon description]
 * @param {[type]} points [description]
 */
function Polygon(v,a,points){
  this.position = v || new Vector();
  this.angle = a || 0;
  this.points = [];
  this.type = 'Polygon';
  this.calcPoitn = [];

  if (points !== undefined)
    this.setPoints(points);
}

Polygon.prototype.setPoints = function(v){
  for (var i = v.length - 1; i >= 0; i--) {
    this.setPoint( v[i] );
  };
}

Polygon.prototype.setPoint = function(v){
  if (v.type === 'Vector')
    this.points.push(v);
}

Polygon.prototype.calc = function(){
  this.calcPoitn = [];

  for (var i = 0; i < this.points.length; i++) {
    var p = this.points[i].clone();
    if (this.angle !== 0)
      p.rotate(this.angle);
    this.calcPoitn.push(p.add(this.position));
  };
}

Polygon.prototype.testLine = function(line) {
  var polyPoints = this.calcPoitn;
  var pointCoutn = polyPoints.length;

  while(pointCoutn--){
    var b1 = polyPoints[pointCoutn];
    var b2 = pointCoutn === 0 ? polyPoints[polyPoints.length-1] : polyPoints[pointCoutn-1]; 

    if (line.IsLineCross(b1,b2)){
      return true;
    }
  }

  return false;
};


/**
 * [Box description]
 */
function Box(h,w){
  this.type = 'Box';
}



/**
 * [Line description]
 * @param {[type]} v1 [description]
 * @param {[type]} v2 [description]
 */

function Line (v,a,points){
  this.position = v || new Vector();
  this.angle = a || 0;
  this.points = [];
  this.type = 'Line';
  
  this.calcPoitn = [];

  if (points !== undefined)
    this.setPoints(points);
}

Line.prototype.calc = function(){
  this.calcPoitn = [];

  for (var i = 0; i < this.points.length; i++) {
    var p = this.points[i].clone();
    if (this.angle !== 0)
      p.rotate(this.angle);
    this.calcPoitn.push(p.add(this.position));
  };
}

Line.prototype.setPoints = function(v){
  for (var i = v.length - 1; i >= 0; i--) {
    this.setPoint( v[i] );
  };
}

Line.prototype.setPoint = function(v){
  if (v.type === 'Vector')
    this.points.push(v);
}

/**
 * Определение столкновения
 * @param {[type]} p1 [description]
 * @param {[type]} p2 [description]
 */
Line.prototype.IsLineCross = function (p1,p2){
  var x11 = this.calcPoitn[0].x;
  var y11 = this.calcPoitn[0].y;
  var x12 = this.calcPoitn[1].x;
  var y12 = this.calcPoitn[1].y;

  if (p2 === undefined){
    var x21 = p1.calcPoitn[0].x;
    var y21 = p1.calcPoitn[0].y;
    var x22 = p1.calcPoitn[1].x;
    var y22 = p1.calcPoitn[1].y;
  } else {
    var x21 = p1.x;
    var y21 = p1.y;
    var x22 = p2.x;
    var y22 = p2.y;
  }

  var maxx1 = Math.max(x11, x12), maxy1 = Math.max(y11, y12);
  var minx1 = Math.min(x11, x12), miny1 = Math.min(y11, y12);
  var maxx2 = Math.max(x21, x22), maxy2 = Math.max(y21, y22);
  var minx2 = Math.min(x21, x22), miny2 = Math.min(y21, y22);

  if (minx1 > maxx2 || maxx1 < minx2 || miny1 > maxy2 || maxy1 < miny2)
    return false;  

  var dx1 = x12-x11, dy1 = y12-y11; 
  var dx2 = x22-x21, dy2 = y22-y21; 
  var dxx = x11-x21, dyy = y11-y21;
  var div, mul;

  if ((div = (dy2*dx1-dx2*dy1)) == 0) 
    return false; 

  if (div > 0) {
    if ((mul = (dx1*dyy-dy1*dxx)) < 0 || mul > div)
      return false; 
    if ((mul = (dx2*dyy-dy2*dxx)) < 0 || mul > div)
       return false; 
  } else {
    if ((mul = -(dx1*dyy-dy1*dxx)) < 0 || mul > -div)
      return false; 
    if ((mul = -(dx2*dyy-dy2*dxx)) < 0 || mul > -div)
      return false; 
  }

  return true;            
}