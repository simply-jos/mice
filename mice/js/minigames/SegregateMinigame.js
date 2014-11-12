SegregateMinigame = function() {
    BaseMinigame.call(this);
    
    this.name = "SegregateMinigame";
    this.command = "Segregate!";
};
SegregateMinigame.prototype = new BaseMinigame();

SegregateMinigame.prototype.draw = function(cam)
{
    ctx.drawImage(loadImage("res/bg_segregate" + Math.floor(gameHandler.backgroundTimer) +".png"), cam.pos.x - 1024/2, cam.pos.y - 768/2, 1024, 768);
    
    ctx.drawImage(loadImage("res/segregatelabel" + Math.floor(gameHandler.backgroundTimer) +".png"), 512 - 409 / 2, 69, 409, 135);
    
    this.drawMice(cam);
};

SegregateMinigame.prototype.frame = function(delta)
{
    
};

SegregateMinigame.prototype.drawMice = function(cam)
{
    for (var i=0;i<gameHandler.clients.length;i++)
    {
        if (gameHandler.clients[i].segregate == null || gameHandler.clients[i].segregate == undefined)
            continue;
            
        if (gameHandler.clients[i].segregate.team == "red")
            ctx.drawImage(loadImage("res/mouse_red.png"), cam.pos.x + gameHandler.clients[i].ent.pos.x, cam.pos.y + gameHandler.clients[i].ent.pos.y, 12, 20);
        else if (gameHandler.clients[i].segregate.team == "blue")
            ctx.drawImage(loadImage("res/mouse_blue.png"), cam.pos.x + gameHandler.clients[i].ent.pos.x, cam.pos.y + gameHandler.clients[i].ent.pos.y, 12, 20);
    }
};

SegregateMinigame.prototype.drawLocal = function(cam)
{
    if (gameHandler.localClient.segregate == null || gameHandler.localClient.segregate == undefined)
        return;
        
    if (gameHandler.localClient.segregate.team == "red")
        ctx.drawImage(loadImage("res/localmouse_red.png"), cam.pos.x + gameHandler.localClient.ent.pos.x, cam.pos.y + gameHandler.localClient.ent.pos.y, 12, 20);
    else
        ctx.drawImage(loadImage("res/localmouse_blue.png"), cam.pos.x + gameHandler.localClient.ent.pos.x, cam.pos.y + gameHandler.localClient.ent.pos.y, 12, 20);
};