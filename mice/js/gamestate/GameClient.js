function GameClient()
{
    this.id = -1;
    
    this.name = "";
    this.score = 0;
    
    this.ent = null;
}

GameClient.prototype.draw = function(cam)
{
    if (this.ent != null)
        this.ent.draw(cam);
}

GameClient.prototype.drawLocal = function(cam)
{
    if (this.ent != null)
        this.ent.drawLocal(cam);
};

GameClient.prototype.frame = function()
{
    if (this.ent != null)
        this.ent.frame();
}