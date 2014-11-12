FollowMinigame = function() {
    BaseMinigame.call(this);
    
    this.name = "FollowMinigame";
    this.command = "Spread out!";
    
    this.radius = 0;
    
    this.bx = 0;
    this.by = 0;
    
    this.vx = 0;
    this.vy = 0;
};
FollowMinigame.prototype = new BaseMinigame();

FollowMinigame.prototype.draw = function(cam)
{
    ctx.drawImage(loadImage("res/followlabel" + Math.floor(gameHandler.backgroundTimer) +".png"), 512 - 409 / 2, 69, 409, 135);

    ctx.globalAlpha = 0.4;
    
    ctx.beginPath();
    ctx.arc(this.bx, this.by, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#00FF00";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    
    if (this.bx + this.vx - this.radius < 0 || this.bx + this.vx + this.radius > 1024)
        this.vx = -this.vx
    
    if (this.by + this.vy - this.radius < 0 || this.by + this.vy + this.radius > 768)
        this.vy = -this.vy;
    
    this.bx += this.vx;
    this.by += this.vy;
    
    ctx.globalAlpha = 1;
    
    this.drawMice(cam);
};

FollowMinigame.prototype.drawMice = function(cam)
{
    for (var i=0;i<gameHandler.clients.length;i++)
        gameHandler.clients[i].draw(cam);
};

FollowMinigame.prototype.drawLocal = function(cam)
{
    gameHandler.localClient.drawLocal(cam);
};

FollowMinigame.prototype.frame = function(delta)
{
    
};