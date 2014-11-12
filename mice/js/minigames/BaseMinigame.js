BaseMinigame = function()
{
	this.pos = new Victor(0, 0);
    this.velocity = new Victor(0, 0);
    this.name = "BaseMinigame";
    this.command = "do nothing lol";
};

BaseMinigame.prototype.start = function()
{
};

BaseMinigame.prototype.end = function()
{
};

BaseMinigame.prototype.draw = function(cam)
{
    this.drawMice(cam);
};

BaseMinigame.prototype.frame = function(delta)
{
    
};

BaseMinigame.prototype.drawMice = function(cam)
{
    for (var i=0;i<gameHandler.clients.length;i++)
        gameHandler.clients[i].draw(cam);
};

BaseMinigame.prototype.drawLocal = function(cam)
{
    gameHandler.localClient.drawLocal(cam);
};