/*
    @require minigames/BaseMinigame.js;
    @require minigames/SegregateMinigame.js;
    @require minigames/SpreadOutMinigame.js;
    @require minigames/SolveMinigame.js;
    @require minigames/PolygonMinigame.js;
    @require minigames/TicTacToeMinigame.js;
    @require minigames/FollowMinigame.js;
*/

function handlePacket(msg)
{
    var packetHandler = STC[msg.pid];
    
    packetHandler.handler(msg);
}

STC = {};

//ADD_PLAYER
STC.ADD_PLAYER = 0;
STC[0] = {
    handler: function(msg)
    {
        var client = new GameClient();
        
        client.id = msg.id;
        
        gameHandler.addClient(client);
        
        client.ent = new EntPlayer();
        
        console.log("client connected");
    }
};

//REMOVE_PLAYER
STC.REMOVE_PLAYER = 1;
STC[1] = {
    handler: function(msg)
    {
        var c = gameHandler.getClientById(msg.id);
        
        if (c != undefined)
            gameHandler.removeClient(c);
            
        console.log("client disconnected");
    }
};

//PLAYER_POS
STC.PLAYER_POS = 2;
STC[2] = {
    handler: function(msg)
    {
        var c = gameHandler.getClientById(msg.id);
        
        if (c != null && c.ent != null)
        {
            c.ent.pos.x = msg.x;
            c.ent.pos.y = msg.y;
        }
    }
};

//GAME_START
STC.GAME_START = 3;
STC[3] = {
    handler: function(msg)
    {
        var gameName = msg.name;
        
        gameHandler.timeLeft = msg.timelimit;
        if (gameName == "SegregateMinigame")
        {
            gameHandler.setMinigame(new SegregateMinigame());
        }
        else if (gameName == "SpreadOutMinigame")
        {
            gameHandler.setMinigame(new SpreadOutMinigame());
        }
        else if (gameName == "SolveMinigame")
        {
            gameHandler.setMinigame(new SolveMinigame());
        }
        else if (gameName == "PolygonMinigame")
        {
            gameHandler.setMinigame(new PolygonMinigame());
        }
        else if (gameName == "TicTacToeMinigame")
        {
            gameHandler.setMinigame(new TicTacToeMinigame());
        }
        else if (gameName == "FollowMinigame")
        {
            gameHandler.setMinigame(new FollowMinigame());
        }
        
        gameHandler.openDoors();
    }
};

//GAME_END
STC.GAME_END = 4;
STC[4] = {
    handler: function(msg)
    {
        gameHandler.closeDoors();
        gameHandler.endMinigame(msg.win);
    }
};

//SEGREGATE_START
STC.SEGREGATE_START = 5;
STC[5] = {
    handler: function(msg)
    {
        for (var i=0;i<msg.redPlayers.length;i++)
        {
            var c = gameHandler.getClientById(msg.redPlayers[i]);
            
            if (c != null)
            {
                c.segregate = {};
                c.segregate.team = "red";
            }
        }
        
        for (var i=0;i<msg.bluePlayers.length;i++)
        {
            var c = gameHandler.getClientById(msg.bluePlayers[i]);
            
            if (c != null)
            {
                c.segregate = {};
                c.segregate.team = "blue";
            }
        }
        
        console.log("Assigned to team " + gameHandler.localClient.segregate.team);
    }
};

//CONNECTED
STC.CONNECTED = 6;
STC[6] = {
    handler: function(msg)
    {
        console.log("My ID was " + gameHandler.localClient.id);
        gameHandler.localClient.id = msg.yourID;
        console.log("My ID is " + gameHandler.localClient.id);
        
        gameHandler.health = msg.health;
        gameHandler.score = msg.score;
    }
};

//SETSCORE
STC.SETSCORE = 7;
STC[7] = {
    handler: function(msg)
    {
        gameHandler.health = msg.newHealth;
        gameHandler.score = msg.newScore;
    }
};

//SEGREGATE_START
STC.SEGREGATE_START = 8;
STC[8] = {
    handler: function(msg)
    {
        gameHandler.currentMinigame.radius = msg.radius;
        
        for (var i=0;i<gameHandler.clients.length;i++)
            gameHandler.clients[i].spreadOut = {};
            
        gameHandler.localClient.spreadOut = {};
    }
};

//SOLVE_START
STC.SOLVE_START = 9;
STC[9] = {
    handler: function(msg)
    {
        gameHandler.currentMinigame.numA = msg.numA;
        gameHandler.currentMinigame.numB = msg.numB;
        
        gameHandler.currentMinigame.operation = msg.operation;
    
        gameHandler.currentMinigame.solutionA = msg.solutionA;
        gameHandler.currentMinigame.solutionB = msg.solutionB;
    }
};

//TICTACTOE_START
STC.TICTACTOE_START = 10;
STC[10] = {
    handler: function(msg)
    {
        gameHandler.currentMinigame.board = msg.board;
    }
};

//FOLLOW_START
STC.FOLLOW_START = 11;
STC[11] = {
    handler: function(msg)
    {
        gameHandler.currentMinigame.radius = msg.radius;
        
        gameHandler.currentMinigame.bx = msg.sx;
        gameHandler.currentMinigame.by = msg.sy;
        
        gameHandler.currentMinigame.vx = msg.vx;
        gameHandler.currentMinigame.vy = msg.vy;
    }
};


CTS = {};
CTS.PLAYER_POS = 0;