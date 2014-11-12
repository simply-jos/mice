var mouseImage = loadImage("res/mouse.png");
var localMouseImage = loadImage("res/localmouse.png");

EntPlayer = function() {
    EntBase.call(this);
};
EntPlayer.prototype = new EntBase();

EntPlayer.prototype.draw = function(cam)
{
    ctx.drawImage(mouseImage, this.pos.x + cam.pos.x, this.pos.y + cam.pos.y);
};

EntPlayer.prototype.drawLocal = function(cam)
{
    ctx.drawImage(localMouseImage, this.pos.x + cam.pos.x - 2, this.pos.y + cam.pos.y - 2);
};

EntPlayer.prototype.frame = function(delta)
{
    
};