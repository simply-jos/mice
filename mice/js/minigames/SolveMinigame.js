SolveMinigame = function() {
    BaseMinigame.call(this);
    
    this.name = "SpreadOutMinigame";
    this.command = "Spread out!";
    
    this.radius = 0;
};
SolveMinigame.prototype = new BaseMinigame();

SolveMinigame.prototype.drawNum = function(x, y, num)
{
    var numImage = loadImage("res/num" + Math.floor(gameHandler.backgroundTimer) + ".png");
    
    //Score to string
    var tls = "" + num;
    
    var width = tls.length * 35;
    var drawx = x - width / 2;
    for (var i=0;i<tls.length;i++)
    {
        var ofs = parseInt(tls.charAt(i));
        ctx.drawImage(numImage, ofs * 56, 0, 56, 64, drawx, y, 56, 64);
        drawx += 35;
    }
}

SolveMinigame.prototype.draw = function(cam)
{
    ctx.drawImage(loadImage("res/solvelabel" + Math.floor(gameHandler.backgroundTimer) +".png"), 512 - 409 / 2, 69, 409, 135);

    if (this.numA == null)
    {
        this.drawMice(cam);
        return;
    }
        
    this.drawNum(369, 209, this.numA);
    
    if (this.operation == "add")
        ctx.drawImage(loadImage("res/add" + Math.floor(gameHandler.backgroundTimer) +".png"), 1024 / 2 - 61 / 2, 209 - 66 / 2 + 22, 61, 66);
    else if (this.operation == "sub")
        ctx.drawImage(loadImage("res/subtract" + Math.floor(gameHandler.backgroundTimer) +".png"), 1024 / 2 - 69 / 2, 209 - 38 / 2 + 22, 69, 38);
    
    this.drawNum(610, 209, this.numB);
    
    this.drawNum(210, 404, this.solutionA);
    this.drawNum(1024 - 210, 404, this.solutionB);
    
    this.drawMice(cam);
};

SolveMinigame.prototype.frame = function(delta)
{
    
};