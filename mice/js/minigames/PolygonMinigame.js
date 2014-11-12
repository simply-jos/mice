PolygonMinigame = function() {
    BaseMinigame.call(this);
    
    this.name = "PolygonMinigame";
    this.command = "Spread out!";
    
    this.radius = 0;
};
PolygonMinigame.prototype = new BaseMinigame();

PolygonMinigame.prototype.draw = function(cam)
{
    var confirmImage = loadImage("res/xconfirm" + Math.floor(gameHandler.backgroundTimer) + ".png");
    var checkImage = loadImage("res/add" + Math.floor(gameHandler.backgroundTimer) + ".png");

    ctx.drawImage(loadImage("res/polygonlabel" + Math.floor(gameHandler.backgroundTimer) +".png"), 512 - 409 / 2, 69, 409, 135);

    var ngonPoints = [];

    var ac = gameHandler.allClients();
    var r = 768 / 4 - 30;
    var n = ac.length;
    for (var i=0;i<n;i++)
        ngonPoints[i] = {
            x: r * Math.cos(2 * Math.PI * i / n),
            y: r * Math.sin(2 * Math.PI * i / n),
            checked: false
        };
   
    for (var i=0;i<ngonPoints.length;i++)
    {
        var p = ngonPoints[i];
        for (var j=0;j<ac.length;j++)
        {
            var c = ac[j];
            
            var dx = c.ent.pos.x - p.x;
            dx = dx * dx;
            
            var dy = c.ent.pos.y - p.y;
            dy = dy * dy;
            
            var dist = Math.sqrt(dx + dy);
            
            if (dist < 40)
            {
                p.checked = true;
                break;
            }
        }
    }
     
    ctx.globalAlpha = 0.65;
    
    for (var i=0;i<ngonPoints.length;i++)
    {
        var p = ngonPoints[i];
        if (i + 1 < ngonPoints.length)
            var np = ngonPoints[i + 1];
        else
            var np = ngonPoints[0];
         
        if (i == 0)
            var pp = ngonPoints[ngonPoints.length - 1];
        else
            var pp = ngonPoints[i - 1];
        
        if (p.checked)
        {
            ctx.globalAlpha = 0.45;
            ctx.drawImage(confirmImage, cam.pos.x + p.x - 90 / 2, cam.pos.y + p.y - 90 / 2, 90, 90);
            
            ctx.globalAlpha = 0.25;
            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(cam.pos.x + p.x, cam.pos.y + p.y);
            ctx.lineTo(cam.pos.x + np.x, cam.pos.y + np.y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(cam.pos.x + p.x, cam.pos.y + p.y);
            ctx.lineTo(cam.pos.x + pp.x, cam.pos.y + pp.y);
            ctx.stroke();
        }
            
        ctx.globalAlpha = 0.65;
        ctx.drawImage(checkImage, cam.pos.x + ngonPoints[i].x - 30 / 2, cam.pos.y + ngonPoints[i].y - 30 / 2, 30, 33);
    }
        
    ctx.globalAlpha = 1;
    
    this.drawMice(cam);
};

PolygonMinigame.prototype.drawMice = function(cam)
{
    for (var i=0;i<gameHandler.clients.length;i++)
    {
        var c = gameHandler.clients[i];
  
        c.draw(cam);
    }
};

PolygonMinigame.prototype.drawLocal = function(cam)
{   
    gameHandler.localClient.drawLocal(cam);
};

PolygonMinigame.prototype.frame = function(delta)
{
    
};