TicTacToeMinigame = function() {
    BaseMinigame.call(this);
    
    this.name = "TicTacToeMinigame";
    this.command = "Spread out!";
};
TicTacToeMinigame.prototype = new BaseMinigame();

TicTacToeMinigame.prototype.draw = function(cam)
{
    var circImage = loadImage("res/circ" + Math.floor(gameHandler.backgroundTimer) + ".png");
    var crossImage = loadImage("res/cross" + Math.floor(gameHandler.backgroundTimer) + ".png");

    ctx.drawImage(loadImage("res/tictactoelabel" + Math.floor(gameHandler.backgroundTimer) +".png"), 512 - 409 / 2, 69, 409, 135);
    ctx.drawImage(loadImage("res/tictac" + Math.floor(gameHandler.backgroundTimer) +".png"), 0, 0, 1024, 768);
   
    if (this.board != null)
    {
        var ox = 177;
        var oy = 162;
        
        var pw = 235;
        var ph = 163;
        
        for (var i=0;i<9;i++)
        {
            var piece = this.board[i];
            
            var tx = i % 3;
            var ty = Math.floor(i / 3);
            
            var dx = ox + tx * pw + 30;
            var dy = oy + ty * ph + 30;
            
            if (piece == 0 || piece == 3)
                continue;
            else if (piece == 1)
                ctx.drawImage(circImage, dx, dy, 141, 131);
            else if (piece == 2)
                ctx.drawImage(crossImage, dx, dy, 141, 131);
        }
    }
    
    this.drawMice(cam);
};

TicTacToeMinigame.prototype.drawMice = function(cam)
{
    var circImage = loadImage("res/circ" + Math.floor(gameHandler.backgroundTimer) + ".png");
    
    for (var i=0;i<gameHandler.clients.length;i++)
    {
        var c = gameHandler.clients[i];
        
        ctx.drawImage(circImage, c.ent.pos.x + cam.pos.x - 141 / 2, c.ent.pos.y + cam.pos.y - 131 / 2, 141, 131);
    }
};

TicTacToeMinigame.prototype.drawLocal = function(cam)
{   
    var circImage = loadImage("res/local_circ" + Math.floor(gameHandler.backgroundTimer) + ".png");
    
    ctx.drawImage(circImage, gameHandler.localClient.ent.pos.x + cam.pos.x - 141 / 2, gameHandler.localClient.ent.pos.y + cam.pos.y - 131 / 2, 141, 131);
};

TicTacToeMinigame.prototype.frame = function(delta)
{
    
};