function Render (canvas, children){
	this.canvas = canvas;
	this.children = children;
	this.ctx = this.canvas.getContext('2d');
	this.bias = new Vector(this.canvas.width / 2, this.canvas.height / 2);
}

Render.prototype.render = function() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	var l = this.children.length;

	while(l--){
		this.ctx.beginPath();
		this[this.children[l].type] 
		&& (this[this.children[l].type]( this.children[l]));
		this.ctx.closePath();
	}
};

Render.prototype.Point = function(obj) {
	this.ctx.fillStyle = "#f00000";
    this.ctx.arc(this.bias.x + obj.position.x ,this.bias.y + obj.position.y,1,0,Math.PI*2,true);
    this.ctx.fill();
};

Render.prototype.Line = function(obj) {
	obj.calc();
	this.ctx.strokeStyle = obj.color || "#000000";
    this.ctx.moveTo(this.bias.x + obj.calcPoitn[0].x ,this.bias.y - obj.calcPoitn[0].y);
    for (var i = 1; i < obj.calcPoitn.length; i++) {
    	var p = obj.calcPoitn[i]

    	this.ctx.lineTo(this.bias.x + p.x , this.bias.y - p.y);
    };
    this.ctx.stroke();
};

Render.prototype.Polygon = function(obj) {
	obj.calc();
	this.ctx.strokeStyle = obj.color || "#000000";
    this.ctx.moveTo(this.bias.x + obj.calcPoitn[0].x ,this.bias.y - obj.calcPoitn[0].y);
    for (var i = 1; i < obj.calcPoitn.length; i++) {
    	var p = obj.calcPoitn[i]

    	this.ctx.lineTo(this.bias.x + p.x , this.bias.y - p.y);
    };

    this.ctx.lineTo(this.bias.x + obj.calcPoitn[0].x ,this.bias.y - obj.calcPoitn[0].y);
    this.ctx.stroke();
};