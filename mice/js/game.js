/*  
    @minify yes;
    @require libs/victor.min.js;
    @require libs/jquery-1.11.1.min.js;
    
    @require libs/util.js;
    
    @require gamestate/GameHandler.js;
    @require packets/packets.js;
    @require ents/EntCamera.js;
    @require ents/EntPlayer.js;
*/

var mouseX = 0;
var mouseY = 0;

var camera;
var ctx;

var canvas;

var gameHandler;

function frame()
{
    gameHandler.frame();
    gameHandler.draw();
    
    window.requestAnimationFrame(frame);
}

function startGame()
{
    gameHandler = new GameHandler();
    
    localClient = new GameClient();
    localClient.ent = new EntPlayer();
    
    gameHandler.setLocalClient(localClient);
    
    canvas = document.getElementById("c");

    $("#c").mousemove(
        function (event)
        {
            if (event.offsetX)
            {
                mouseX = event.offsetX;
                mouseY = event.offsetY;
            }
        }
    );
    
    ctx = canvas.getContext("2d");
    resiz();
    
    window.requestAnimationFrame(frame);
}
    
$(document).ready(function()
{
    gameSocket = new WebSocket("ws://78afb660.ngrok.com");
    gameSocket.onopen = function(event)
    {
        console.log("Connected");
        startGame();
    };
    
    gameSocket.onerror = function()
    {
        console.log('ws error');
    };
    
    gameSocket.onclose = function()
    {
        console.log('ws closed');
    };
    
    gameSocket.onmessage = function(msgevent)
    {
        gameHandler.socketMessage(msgevent);
    };
});
    
window.onresize = function(event)
{
    resiz();
}

function resiz()
{
    canvas = document.getElementById("c");
    
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
    return;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
}