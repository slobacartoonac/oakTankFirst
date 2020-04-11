//written by Slobodan Zivkovic slobacartoonac@gmail.com
var OAK=OAK||{};
OAK.Rendable=function(gl,model,texture,position,rotation)
{
    this.gl=gl;
    this.model=model;
    this.texture=texture;
    this.position=position;
    this.rotation=rotation;
    this.size=1.0;
}
OAK.Rendable.prototype.constructor = OAK.Rendable;

OAK.lastModel=[];
OAK.Rendable.prototype.Draw=function(shaderProgram)
{
    var gl=this.gl;
    //this.model=model;
    //this.rotation=rotation;
    
    var mov_matrix = [this.size,0,0,0, 0,this.size,0,0, 0,0,this.size,0, this.position.x,this.position.y,this.position.z,1];
    mov_matrix=vecmath.rotate(mov_matrix,this.rotation,[0,1,0]);
    gl.uniformMatrix4fv(shaderProgram.Mmatrix, false, mov_matrix);
    gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
    this.model.Draw(shaderProgram);
}