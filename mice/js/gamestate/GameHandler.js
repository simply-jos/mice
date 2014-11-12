/*  
    @require gamestate/GameClient.js;
    @require packets/packets.js;
*/

var marker = loadImage("res/marker.png");

GameHandler = function()
{
    //Entities
    this.entities = [];

    //Other clients
    this.clients = [];
    
    this.swagParticles = [];
    
    //Camera
    this.camera = new EntCamera();
    
    this.backgroundTimer = 0;
    this.doorCloseFraction = 0;
    
    this.currentMinigame = null;
    this.timeLeft = 0;
    this.score = 0;
    this.health = 0;
    
    this.localClient = new GameClient();
    this.localClient.ent = new EntPlayer();
    
    this.closeDoors();
};

GameHandler.prototype.allClients = function()
{
    var ac = this.clients.slice(0);
    ac.unshift(this.localClient);
    
    return ac;
}

GameHandler.prototype.addEntity = function(ent)
{
    this.entities.push(ent);
}

GameHandler.prototype.removeEntity = function(ent)
{
    this.entities.remove(ent);
}

GameHandler.prototype.addClient = function(cl)
{
    this.clients.push(cl);
}

GameHandler.prototype.removeClient = function(cl)
{
    this.clients.remove(cl);
}

GameHandler.prototype.getClientById = function(id)
{
    var c = this.clients.find(
        function(o, i, a) {
            if (o.id == id)
                return true;
                
            return false;
        }
    );
    
    if (id == this.localClient.id)
        return this.localClient;
    
    return c;
}

GameHandler.prototype.setLocalClient = function(cl)
{
    this.localClient = cl;
}

GameHandler.prototype.send = function(obj)
{
    gameSocket.send(JSON.stringify(obj));
}

GameHandler.prototype.frame = function()
{
    var worldMouseX = this.camera.screenToWorldX(mouseX);
    var worldMouseY = this.camera.screenToWorldY(mouseY);
    
    if (this.localClient.ent.pos.x != worldMouseX ||
        this.localClient.ent.pos.y != worldMouseY)
    {
        this.send(
            {
                pid: STC.PLAYER_POS,
                x: worldMouseX,
                y: worldMouseY
            }
        );
    }
    
    this.localClient.ent.pos.x = worldMouseX;
    this.localClient.ent.pos.y = worldMouseY;

    for (var i=0;i<this.entities.length;i++)
        this.entities[i].frame();

    for (var i=0;i<this.clients.length;i++)
        this.clients[i].frame();
};

GameHandler.prototype.openDoors = function()
{
    var gh = this;
    this.doorCloseFraction = 1;
    
    var t = {
        frac: 1
    };
    
    $(t).animate(
        {
            frac: 0
        },
        {
            duration: 800,
            easing: "swing",
            step: function(now)
            {
                gh.doorCloseFraction = now;
            }
        }
    );
}

GameHandler.prototype.closeDoors = function()
{
    var gh = this;
    this.doorCloseFraction = 0;
    
    var t = {
        frac: 0
    };
    
    $(t).animate(
        {
            frac: 1
        },
        {
            duration: 800,
            easing: "swing",
            step: function(now)
            {
                gh.doorCloseFraction = now;
            }
        }
    );
}

GameHandler.prototype.endMinigame = function(win)
{
    if (win)
    {
        this.lastWin = true;
        this.lastLose = false;
        
        this.winBurst();
    }
    else
    {
        this.lastWin = false;
        this.lastLose = true;
    }

    $.wait(800).then(function()
    {
        if (gameHandler.currentMinigame != null)
            gameHandler.currentMinigame.end();
            
        gameHandler.currentMinigame = null;
    });
}

GameHandler.prototype.winBurst = function()
{
    for (var i=0;i<8;i++)
    {
        var s = {};
        
        s.x = 1024 / i + Math.random() * 20;
        s.y = 768 + 80 + Math.random() * 40;
        
        s.vy = -12 - Math.random() * 4;
        s.vx = (Math.random() - 0.5) * 4;
        
        s.scale = 1 + Math.random() * 0.3;
        
        s.dead = false;
        
        this.swagParticles.push(s);
    }
}

GameHandler.prototype.drawParticles = function()
{
    var dollaImage = loadImage("res/dolla" + Math.floor(this.backgroundTimer) + ".png");

    for (var i=0;i<this.swagParticles.length;i++)
    {
        var s = this.swagParticles[i];
        
        s.y += s.vy;
        s.x += s.vx;
        
        s.vy += 0.2;
        
        if (s.y > 768 + 120 && s.vy > 0)
            s.dead = true;
        
        ctx.drawImage(dollaImage, s.x, s.y, 80 * s.scale, 80 * s.scale);
    }
    
    for (var i=0;i<this.swagParticles.length;i++)
    {
        if (s.dead)
        {
            this.swagParticles = this.swagParticles.splice(i);
            i = 0;
        }
    }
}

GameHandler.prototype.drawHealth = function()
{
    var heartImage = loadImage("res/heart" + Math.floor(this.backgroundTimer) + ".png");

    var totalWidth = 4 * (80 + 64);
    var drawx = this.camera.pos.x - totalWidth / 2;
    
    for (var i=0;i<this.health;i++)
    {
        ctx.drawImage(heartImage, drawx, this.camera.pos.y - 768/2 + 40 + (this.doorCloseFraction - 1) * (80 + 40), 80, 80);
        drawx += 80 + 64;
    }
};

GameHandler.prototype.drawScore = function()
{
    var numImage = loadImage("res/num" + Math.floor(this.backgroundTimer) + ".png");
    
    ctx.drawImage(loadImage("res/score" + Math.floor(this.backgroundTimer) + ".png"), 512 - 478 / 2 - 80, 768 - (this.doorCloseFraction) * (250), 478, 196);
    
    //Score to string
    var tls = "" + this.score;
    
    var width = tls.length * 35 + 12;
    var drawx = 590;
    for (var i=0;i<tls.length;i++)
    {
        var ofs = parseInt(tls.charAt(i));
        ctx.drawImage(numImage, ofs * 56, 0, 56, 64, drawx, 560 + 225 - (this.doorCloseFraction) * (200), 56, 64);
        drawx += 35;
    }
};

GameHandler.prototype.drawTimer = function()
{
    var numImage = loadImage("res/num" + Math.floor(this.backgroundTimer) + ".png");
    var colonImage = loadImage("res/colon" + Math.floor(this.backgroundTimer) + ".png");
    
    this.timeLeft = this.timeLeft;
    this.timeLeft -= 0.016;
    if (this.timeLeft <= 0)
        this.timeLeft = 0;
    
    //Time left string
    var tls = "" + this.timeLeft.toFixed(2);
    if (tls.length < 5)
        tls = "0" + tls;
    
    var width = 4 * 35 + 12;
    var drawx = this.camera.pos.x - width / 2 - 20;
    for (var i=0;i<tls.length;i++)
    {
        if (tls.charAt(i) != ".")
        {
            var ofs = parseInt(tls.charAt(i));
            ctx.drawImage(numImage, ofs * 56, 0, 56, 64, drawx, this.camera.pos.y - 768 / 2 + 32, 56, 64);
            drawx += 35;
        }
        else
        {
            ctx.drawImage(colonImage, 10, 0, 56 - 12, 64, drawx, this.camera.pos.y - 768 / 2 + 32, 56 - 10, 64);
            drawx += 20;
        }
    }
};

GameHandler.prototype.drawBackground = function()
{
    this.backgroundTimer += 0.25;
    
    if (this.backgroundTimer >= 3)
        this.backgroundTimer = 0;
    
    this.drawTimer();
    
    ctx.drawImage(loadImage("res/leftdoor" + Math.floor(this.backgroundTimer) + ".png"), this.camera.pos.x + 500 * (this.doorCloseFraction - 2) + 25, this.camera.pos.y - 788/2, 500, 788);
    ctx.drawImage(loadImage("res/rightdoor" + Math.floor(this.backgroundTimer) + ".png"), this.camera.pos.x + 500 * (-this.doorCloseFraction + 1) - 25, this.camera.pos.y - 788/2, 500, 788);
    
    ctx.fillStyle="#000000";
    ctx.globalAlpha = this.doorCloseFraction * 0.25;
    ctx.fillRect(0, 0, 1024, 768);
    ctx.globalAlpha = 1;
    
    this.drawHealth();
    
    this.drawParticles();
    
    this.drawScore();
    
    if (this.lastLose)
        ctx.drawImage(loadImage("res/oops" + Math.floor(this.backgroundTimer) + ".png"), this.camera.pos.x - 913 / 2, this.camera.pos.y - 334 / 2 + ((1 - this.doorCloseFraction) * 800), 913, 334);
    else if (this.lastWin)
        ctx.drawImage(loadImage("res/win" + Math.floor(this.backgroundTimer) + ".png"), this.camera.pos.x - 913 / 2, this.camera.pos.y - 334 / 2 + ((1 - this.doorCloseFraction) * 600), 913, 334);
    
    ctx.drawImage(loadImage("res/background_occluder.png"), this.camera.pos.x - 1024/2, this.camera.pos.y - 768/2, 1024, 768);
    ctx.drawImage(loadImage("res/bg" + Math.floor(this.backgroundTimer) + ".png"), this.camera.pos.x - 1024/2, this.camera.pos.y - 768/2, 1024, 768);
};

GameHandler.prototype.setMinigame = function(minigame)
{
    this.currentMinigame = minigame;
    this.currentMinigame.start();
}

GameHandler.prototype.draw = function()
{
    ctx.clearRect(0, 0, 1024, 768);
    
    this.camera.pos.x += 1024 / 2;
    this.camera.pos.y += 768 / 2;
    
    for (var i=0;i<this.entities.length;i++)
        this.entities[i].draw(this.camera);
    
    if (this.currentMinigame != null)
        this.currentMinigame.draw(this.camera);
    
    this.drawBackground();
    
    if (this.currentMinigame == null)
    {
        for (var i=0;i<this.clients.length;i++)
            this.clients[i].draw(this.camera);
    }
        
    if (this.currentMinigame != null)
        this.currentMinigame.drawLocal(this.camera);
    else
        this.localClient.drawLocal(this.camera);
    
    this.camera.pos.x -= 1024 / 2;
    this.camera.pos.y -= 768 / 2;
};

GameHandler.prototype.socketMessage = function(msgevent)
{
    if (msgevent.data == "{}")
        return;
        
    var msg = JSON.parse(msgevent.data);
    handlePacket(msg);
};