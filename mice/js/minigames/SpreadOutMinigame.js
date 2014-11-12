SpreadOutMinigame = function() {
    BaseMinigame.call(this);
    
    this.name = "SpreadOutMinigame";
    this.command = "Spread out!";
    
    this.radius = 0;
};
SpreadOutMinigame.prototype = new BaseMinigame();

SpreadOutMinigame.prototype.draw = function(cam)
{
    ctx.drawImage(loadImage("res/spreadoutlabel" + Math.floor(gameHandler.backgroundTimer) +".png"), 512 - 409 / 2, 69, 409, 135);

    this.drawMice(cam);
};

SpreadOutMinigame.prototype.drawMice = function(cam)
{
    var ac = gameHandler.allClients();
    for (var i=0;i<ac.length;i++)
    {
        if (ac[i] == null)
            return;
        if (ac[i].spreadOut == null || ac[i].spreadOut == undefined || ac[i].spreadOut == 'undefined')
            ac[i].spreadOut = {};
            
        ac[i].spreadOut.overlap = false;
    }

    for (var i=0;i<ac.length;i++)
    {
        var a = ac[i];
        for (var j=0;j<ac.length;j++)
        {
            var b = ac[j];
            
            if (a == b)
                continue;
            
            var dist = a.ent.pos.distance(b.ent.pos);
            
            if (dist < this.radius)
            {
                a.spreadOut.overlap = true;
                b.spreadOut.overlap = true;
            }
        }
    }

    for (var i=0;i<gameHandler.clients.length;i++)
    {
        var c = gameHandler.clients[i];
        
        if (this.radius != 0)
        {
            ctx.globalAlpha = 0.2;
            ctx.beginPath();
            ctx.arc(c.ent.pos.x + cam.pos.x, c.ent.pos.y + cam.pos.y, this.radius / 2, 0, 2 * Math.PI, false);
            
            if (c.spreadOut.overlap)
                ctx.fillStyle = "#FF0000";
            else
                ctx.fillStyle = "#00FF00";
                
            ctx.fill();
            ctx.globalAlpha = 1;
        }
  
        gameHandler.clients[i].draw(cam);
    }
};

SpreadOutMinigame.prototype.drawLocal = function(cam)
{
    if (this.radius != 0)
    {
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.arc(gameHandler.localClient.ent.pos.x + cam.pos.x, gameHandler.localClient.ent.pos.y + cam.pos.y, this.radius / 2, 0, 2 * Math.PI, false);
        
        if (gameHandler.localClient.spreadOut.overlap)
            ctx.fillStyle = "#FF0000";
        else
            ctx.fillStyle = "#00FF00";
                
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    
    gameHandler.localClient.drawLocal(cam);
};

SpreadOutMinigame.prototype.frame = function(delta)
{
    
};