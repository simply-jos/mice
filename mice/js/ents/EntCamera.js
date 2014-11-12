/*
    @require ents/EntBase.js;
*/

EntCamera = function() {
    EntBase.call(this);
};

EntCamera.prototype = new EntBase();

EntCamera.prototype.screenToWorldX = function(x)
{
    return this.pos.x + x - canvas.width / 2;
};

EntCamera.prototype.screenToWorldY = function(y)
{
    return this.pos.y + y - canvas.height / 2;
};

EntCamera.prototype.worldToScreenX = function(x)
{
    return this.pos.x - x;
};

EntCamera.prototype.worldToScreenY = function(y)
{
    return this.pos.y - y;
};