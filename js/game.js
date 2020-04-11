//written by Slobodan Zivkovic slobacartoonac@gmail.com
function colide(a,b,dist)
{
//tests if a and b are colliding
if(Math.abs(a.x-b.x)<dist)
	{
	if(Math.abs(a.z-b.z)<dist)
		{
				return true;
		}
	}
return false;
}
gameTime=0;
function testPath(posn,dist,high)
{
var avelable=true;
bricks.forEach(function(e)
			{
				if(colide(posn,e.position,dist))
				{
                if(e.under){
                    if(!high)
				    avelable=false;
                }
                else avelable=false;
				}
			});

enemies.forEach(function(e)
	{
	if(colide(posn,e.position,dist))
	{
		avelable=false;	
	}
	}
	);
vehicles.forEach(function(e)
	{
	if(colide(posn,e.position,dist))
	{
		avelable=false;		
	}
	}
	);
fence.forEach(function(e)
	{
	if(colide(posn,e.position,dist))
	{
		avelable=false;		
	}
	}
	);
return avelable;
}
function getObject(posn,dist)
{
var ret=null;
bricks.forEach(function(e)
			{
				if(colide(posn,e.position,dist))
				{
				ret=e;
				}
			});

enemies.forEach(function(e)
	{
	if(colide(posn,e.position,dist))
	{
		ret=e;	
	}
	}
	);
vehicles.forEach(function(e)
	{
	if(colide(posn,e.position,dist))
	{
		ret=e;	
	}
	}
	);
fence.forEach(function(e)
	{
	if(colide(posn,e.position,dist))
	{
		ret=e;	
	}
	}
	);
return ret;
}
function gameOver()
{
    if(vehicles.length==0)
    {
        gameSay("<h1>Game over!<h1><p id='database'></p>");
        sendScore("bob",1,0,document.getElementById("database"));
        setTimeout(function(){window.location.reload();},3000);
    }
    else{ gameSay("<h1>You won!</h1><p>Time it take you "+parseFloat(gameTime/30.0).toFixed(2)+" seconds to complete!</p></br><p>You have "+vehicles.length+" tanks left!</p>");
    setTimeout(function(){window.location.hash='1';window.location.reload();},5000);}
    
}
function gameSay(text)
{
    document.getElementById("say").innerHTML=text;
}

function createEnemy(model){
    model.dest={x:model.position.x,y:model.position.z,angle: 0};
    model.reload=3;
    enemies.push(model);
    return model;
}

var explosions=[];
setInterval(function()
{
    explosions=explosions.filter(function(e)
    {
        if(e.size==e.maxsize){
            engine.remObject(e);
            return false;
        }
        e.rotation+=e.position.x+e.position.y+e.position.z;
        e.size*=2;
        if(e.size>e.maxsize) e.size=e.maxsize;
        return true;
    });

},50);
function createExplosion(px,py,pz,msize){
                var ppe=engine.getObject({x:px,y:py,z:pz},'explosion','explosion',true);
                ppe.size=0.2;
                ppe.maxsize=msize;
            
                explosions.push(ppe);
};
function shoot(model,friend)
{
    {
        var proj=engine.getObject({x:model.position.x+Math.sin(model.rotation)*12 ,y:8,z:model.position.z+Math.cos(model.rotation)*12},'proj','to2',true);
        proj.rotation=model.rotation;
        proj.friend=friend;
        projectiles.push(proj);
    }
}
function updateEnemy(model,raz){
    if(Math.abs(-model.dest.angle*Math.PI/2+Math.PI/2-model.rotation)>Math.PI*1.25)
    {
        if(model.rotation<-Math.PI*0.75)
            model.rotation+=Math.PI*2;
        else model.rotation-=Math.PI*2;
    }
    if(model.rotation!=-model.dest.angle*Math.PI/2+Math.PI/2)
    {
        if(Math.abs(-model.dest.angle*Math.PI/2+Math.PI/2-model.rotation)>0.2){
            if((-model.dest.angle*Math.PI/2+Math.PI/2-model.rotation)>0)
                model.rotation+=0.15;
            else
                model.rotation-=0.15;
        }
        else model.rotation=-model.dest.angle*Math.PI/2+Math.PI/2;
    }
    else
    {
        var podN={x:model.position.x,y:model.position.y,z:model.position.z};
		if(raz.x!=0)
		{
			if(raz.x<0) podN.x-=1;
			else podN.x+=1;
		}
		if(raz.y!=0)
		{
			if(raz.y<0) podN.z-=1;
			else podN.z+=1;
		}
       // if(getSelection(podN,19)!=model){
            model.position=podN;
        //}
       /* else
        {
            var av=null;
            e=model.position;
            if(model.dest.angle==2)if(testPath({x:e.x+20,z:e.z},19)){av={x:Math.floor((model.position.x+10)/20)*20,z:model.position.z,angle:0}};
			if(model.dest.angle==0)if(testPath({x:e.x-20,z:e.z},19)){av={x:Math.floor((model.position.x-10)/20)*20,z:model.position.z,angle:2}};
			if(model.dest.angle==3)if(testPath({x:e.x,z:e.z+20},19)){av={x:model.position.x,z:Math.floor((model.position.z+10)/20)*20,angle:1}};
			if(model.dest.angle==1)if(testPath({x:e.x,z:e.z-20},19)){av={x:model.position.x,z:Math.floor((model.position.z-10)/20)*20,angle:3}};
            if(av)
            {
                model.dest.x=av.x;
                model.dest.y=av.z;
            
            }
        }*/
        
    }
    return ;
}
function deside()
{
    enemies.forEach(
	function(e1)
	{
        e=e1.position;
		var raz={x: e1.dest.x-e.x, y: e1.dest.y-e.z};
        e1.reload-=0.03;
        if(Math.random()<0.04){
                    if(e1.reload<0){
                    shoot(e1,false);
                    e1.reload=1;
                }
            }


		if(raz.x!=0||raz.y!=0)
            updateEnemy(e1,raz);
		if(raz.x==0&&raz.y==0)
		{
				var av=[];
				var way=false;
				if(testPath({x:e.x+20,z:e.z},19)){av.push({x:e.x+20,z:e.z,angle:0}); if(e1.dest.angle!=2)way=true;};
				if(testPath({x:e.x-20,z:e.z},19)){av.push({x:e.x-20,z:e.z,angle:2}); if(e1.dest.angle!=0)way=true;};
				if(testPath({x:e.x,z:e.z+20},19)){av.push({x:e.x,z:e.z+20,angle:1}); if(e1.dest.angle!=3)way=true;};
				if(testPath({x:e.x,z:e.z-20},19)){av.push({x:e.x,z:e.z-20,angle:3}); if(e1.dest.angle!=1)way=true;};
				if(av.length>0){
					if(way)
					{
						av=av.filter(function(en){return en.angle!=((e1.dest.angle+2)%4);});
                        var aa=av.filter(function(en){return en.angle==e1.dest.angle;});
                        if(aa.length>0)
                        {
                            av.push(aa[0]);
                        }
						ndir=Math.floor(Math.random()*av.length);
						e1.dest.x=av[ndir].x;
						e1.dest.y=av[ndir].z;
						e1.dest.angle=av[ndir].angle;
					}
					else{

						e1.dest.x=av[0].x;
						e1.dest.y=av[0].z;
						e1.dest.angle=av[0].angle;
					}
				
				
			}
		
		
		}
	}
);
}

var vertCode = ['attribute vec3 position;',
            'uniform mat4 Pmatrix;',
            'uniform mat4 Vmatrix;',
            'uniform mat4 Mmatrix;',
            'attribute vec3 normals;',//the color of the point
            'attribute vec2 texCoord;',
            'varying float vColor;',
            'varying float specCol;',
            'varying vec2 vTexCoord;',
			
            'void main(void) { ',//pre-built function
               'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);',
               "vec4 transformedNormal4 = Mmatrix *vec4(normals, 0.);",
               "vec4 transformedNormal5 = Vmatrix*Mmatrix *vec4(normals, 0.);",
               "vec4 lv = Vmatrix*vec4(1.,0.8,0.5, 0.); lv=normalize(lv);",

               "specCol=max(0.,1.-1.3*length((vec4(0.,0.,1.,0.) - 2.*dot(vec4(0.,0.,1.,0.) , transformedNormal5)*transformedNormal5)+lv));",
               //"specCol=1-(dot(vec4(0.,0.,1.,0) , transformedNormal5)+dot(vec4(1.,1.,1.,0) , transformedNormal4));",
               "vec3 transformedNormal = vec3(transformedNormal4.x,transformedNormal4.y,transformedNormal4.z);",
               "vColor = (atan(dot(transformedNormal, normalize (vec3(1.,0.8,0.5))))+1.571)/1.8;",
               'vTexCoord=texCoord;',
            '}'].join('\n');

         var fragCode = ['precision mediump float;',
            'varying float vColor;',
            'varying vec2 vTexCoord;',
            'uniform sampler2D sTexture;',
            'varying float specCol;',
            'void main(void) {',
               'gl_FragColor = texture2D(sTexture, vTexCoord)*vColor+vec4(0.,0.,0.,1.)*(1.-vColor)+vec4(0.5,0.5,0.5,0.)*specCol;',
            '}'].join('\n');



function eventTurnLeft()
{
    player.direction.wa=-1;
}

function eventTurnRight()
{
    player.direction.wa=1;
}

function eventForward()
{
    player.direction.t=1;
}

function eventBackward()
{
    player.direction.t=-1;
}
function eventShoot()
{
if(!player.veh)
{
    if(vehicles.length<1){
        gameOver();
        return;
    }
    vNum++;
    vNum%=vehicles.length;
    player.veh=vehicles[vNum];
    gameSay("");
    return;
}
if(player.load>0) return;
player.load=1;
shootAudio.play();
shoot(player.veh,true);
}
function eventStop()
{
    player.direction.t=0;
    player.direction.wa=0;
}
function distance2d(a,b)
{
    return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}


var startMove=null;
var thisMove=null;
var mouseDown=false;
function moveTankT(e)
{
	e.preventDefault();
	moveTank({x:e.touches[0].pageX,y:e.touches[0].pageY});
}
function moveTankM(e)
{
	e.preventDefault();
	if(mouseDown)
		moveTank({x:e.pageX,y:e.pageY});
}
function moveTank(e)
{
	
	if(startMove==null)
	{
		startMove={x:e.x,y:e.y};
		thisMove={x:e.x,y:e.y};
	}
	else
	{
		thisMove={x:e.x,y:e.y};
		var direction={x:thisMove.x-startMove.x,y:thisMove.y-startMove.y};
		if(distance2d(startMove,thisMove)>30)
		{
			if(Math.abs(direction.x)>Math.abs(direction.y))
			{
				if(direction.x>0)
				{
					eventTurnLeft();
				}
				else
				{
					eventTurnRight();
				}
			}
			else
			{
				if(direction.y>0)
				{
					eventBackward();
				}
				else
				{
                    eventForward();
				}
			
			}
			
		}
		
	}
}

function stopTank(e){
	e.preventDefault();
	//var thisMove={x:e.touches[0].pageX,y:e.touches[0].pageY};
	if(startMove==null||startMove==null||distance2d(startMove,thisMove)<30)
		eventShoot();
    eventStop();
	startMove=null;
	thisMove=null;
	mouseDown=false;
}

var shootAudio = null;
var explosionAudio =null;
function start(){
engine = new OAK.Engine();
var canvas=document.getElementById("canvas");
canvas.addEventListener("touchstart", function(e){e.preventDefault();}, false);
canvas.addEventListener("touchmove", moveTankT, false);
canvas.addEventListener("touchend",stopTank,false);
canvas.addEventListener("mousemove", moveTankM);
canvas.addEventListener("mouseup", stopTank);
canvas.addEventListener("mousedown", function(){mouseDown=true;});
//var loadScrean=document.getElementById("loadScrean");
engine.selectCanvas(canvas);
engine.selectShader("defolt");
engine.vertexShader(vertCode);
engine.fragmentShader(fragCode);
engine.initShaders();
var loader=new OAK.Loader();
loader.add("tank2","./data/tank2.json")
loader.add("plane","./data/plane.json")
loader.add("proj","./data/projectile.json")
loader.add("brick","./data/brick.json")
loader.add("explosion","./data/explosion12.json");
loader.add("hole","./data/hole.json")
loader.add("mine","./data/mine.json")
myAudio.init();
shootAudio = myAudio.requestSound('data/shoot.mp3');
explosionAudio = myAudio.requestSound('data/explosion.mp3');





if(window.location.hash=='#1')
    loader.add("level","./data/level1.json")
else loader.add("level","./data/level.json")
loader.onLoad(function (data) {
       
        
     engine.loadModel("tank2",data.tank2.data);
    engine.loadModel("plane",data.plane.data);
    engine.loadModel("proj",data.proj.data);
     engine.loadModel("brick",data.brick.data);
     engine.loadModel("hole",data.hole.data);
     engine.loadModel("explosion",data.explosion.data);
     engine.loadModel("mine",data.mine.data);
     map=JSON.parse(data.level.data);

     engine.loadTexture("explosion","./img/explosion.png");
    engine.loadTexture("water","./img/water.png");
    engine.loadTexture("to2","./img/rest3.png");
    engine.loadTexture("tankg","./img/tankg.png");
    engine.loadTexture("tankb","./img/tankb.png");
    engine.loadTexture("brick","./img/mbrick1.png");
    engine.loadTexture("mine","./img/mine.png");
    engine.loadTexture("grass","./img/grass.png");
    engine.loadTexture("base","./img/base.png");
    engine.loadTexture("fence","./img/fence.png");
    engine.loadTexture("fence1","./img/fence1.png");
    engine.loadTexture("fence2","./img/fence2.png");
    engine.loadTexture("concrete","./img/concrete.png");

    run();
});
engine.onLoaded(
	function()
	{
        var loading=document.getElementById("loading");
		loading.innerHTML="";
	}
)
loader.load();



//cam.fov=10;
//cam.position={x,y,z};
//cam.tartget={x,y,z};
//cam.setProjection(5, canvas.width/canvas.height, 1, 100,false);
//cam.lookAt(Math.sin(i)*5,2,Math.cos(i)*5,1,0,1,.0,1,.0);
var cam=engine.getCamera("camId",false);
function run(params) {
    setInterval(
    function (params) {
        j=0;
        //model.rotation=Math.PI/2;
        player.load-=0.03

        if(!player.veh)return;
        gameTime++;
        var raz={x: player.veh.dest.x-player.veh.position.x, y: player.veh.dest.y-player.veh.position.z};
		if(raz.x!=0||raz.y!=0||player.veh.rotation!=-player.veh.dest.angle*Math.PI/2+Math.PI/2)
            updateEnemy(player.veh,raz);
        else
        {
            av={x:player.veh.dest.x,z:player.veh.dest.y,angle:player.veh.dest.angle}
            if(player.direction.wa<0) {
                av.angle++;
                av.angle%=4;
            }
            else if(player.direction.wa>0) {
                av.angle--;
                if(av.angle<0)av.angle+=4;
            }
            if(player.direction.t>0) {
                av.z-=20*(av.angle%2)*(av.angle%4-2);
                av.x-=20*((av.angle+1)%2)*(av.angle%4-1);
            }
            else if(player.direction.t<0)
            {
                av.z+=20*(av.angle%2)*(av.angle%4-2);
                av.x+=20*((av.angle+1)%2)*(av.angle%4-1);
            }
            

            if(testPath(av,19)||(player.veh.dest.x==av.x&&
			    player.veh.dest.y==av.z)){
                player.veh.dest.x=av.x;
			    player.veh.dest.y=av.z;
			    player.veh.dest.angle=av.angle;
            }
        }
        
        cam.target.x=player.veh.position.x;
        cam.target.z=player.veh.position.z;

       // var nPos=plus3(puta1(V3Normalise(minus3(cam.position,cam.target)),Math.max(200,cam.position.y+10)),cam.target);
        nPos=plus3(cam.target,{x:0,y:0,z:-150});
        nPos.y=cam.position.y;
        cam.position=nPos;


        cam.matCalctulate();
        var rem=[];
         for(var i=0;i<projectiles.length;i++)
         {
            var proj=projectiles[i];
            proj.position.x+=Math.sin(proj.rotation)*3;
            proj.position.z+=Math.cos(proj.rotation)*3;
            if(!testPath(proj.position,10,true)) rem.push(proj);
         }
         projectiles=projectiles.filter(function(e)
         {
             return rem.indexOf(e)==-1;
         });
         for(var i=0;i<rem.length;i++)
         {
             createExplosion(rem[i].position.x,rem[i].position.y,rem[i].position.z,0.81);
             engine.remObject(rem[i]);
             var d=getObject(rem[i].position,10);
             if(d)
             {
                 if(rem[i].friend&&enemies.indexOf(d)!=-1){
                    engine.remObject(d);
                    explosionAudio.play();
                    createExplosion(d.position.x,d.position.y+5,d.position.z,1.8);
                    enemies=enemies.filter(function(e){return e!=d;});
                    if(enemies.length==0)gameOver();
                }
                 else if(!rem[i].friend&&vehicles.indexOf(d)!=-1){
                    engine.remObject(d);
                    explosionAudio.play();
                    createExplosion(d.position.x,d.position.y+5,d.position.z,1.8);
                    vehicles=vehicles.filter(function(e){return e!=d;});
                    if(player.veh==d)
                        player.veh=null;
                }
                else if(fence.indexOf(d)!=-1){
                    engine.remObject(d);
                    if(d.life>1){
                        var dd=d.life-1;
                        var fenc=engine.getObject({x:d.position.x,y:d.position.y-2,z:d.position.z},'brick','fence'+(3-dd),true);
                        fenc.life=dd;
                        fence.push(fenc);
                    }

                        fence=fence.filter(function(e){return e!=d;});
                }
                 
                 
             }
         }
         deside();
/*if(false)
         */



        //model.position.y=6+Math.sin(i*5);
    },30)
    cam.lookAt(150,150,150,0,0,0,.0,1,.0);
    cam.setProjection(0.7, canvas.width,canvas.height, 1., 1000.,true);
    var i=0;
    vehicles=[];
    projectiles=[];
    vNum=0;
    //vehicles.push(engine.getObject({x:0,y:10,z:0},"sphere","patern",true));
    player={};
    player.direction={wa:0,w:0,t:0,s:0,load:0};
    player.veh=null;
    bricks=[];
    enemies=[];
    fence=[];
    ftemp=[];
    boxswarm=[];
    groundswarm=[];
    baseswarm=[];
    waterswarm=[];
    holeswarm=[];
			var ix=20;
			var iy=20;
            //engine.getObject({x:20,y:0,z:480},'plane','grass',true);
			var maxx=0;
			map.forEach(function(e)
			{
				e.forEach(function(ee)
				{
					if(ee==1)
					{
					bricks.push({position:{x:ix,y:-4,z:iy}});
                    boxswarm.push({x:ix,y:-4,z:iy});
					}
					if(ee==2)
					{
                        groundswarm.push({x:ix,y:0,z:iy});
                        var p=engine.getObject({x:ix,y:0,z:iy},'tank2','tankg',true);
                        p.dest={x:p.position.x,y:p.position.z,angle:1};
                    vehicles.push(p);
                    //engine.getObject({x:ix,y:0,z:iy},'plane','base',true);
					//player={x:ix,y:iy,sx:0,sy:0,kr:0,kb:0,kg:0,div: createDiv(ix,iy,'char.png')};
					//spawn={x:ix,y:iy};
					}
					if(ee==3)
					{
                        baseswarm.push({x:ix,y:0,z:iy});
                        //engine.getObject({x:ix,y:0,z:iy},'plane','base',true);
                        createEnemy(engine.getObject({x:ix,y:0,z:iy},'tank2','tankb',true));
					//keys.push({x:ix,y:iy,t:1,div: createDiv(ix,iy,'keyr.png')});
					}
					if(ee==4)
					{
                        groundswarm.push({x:ix,y:0,z:iy});
                        //engine.getObject({x:ix,y:0,z:iy},'plane','grass',true);
                        
					//gates.push({x:ix,y:iy,t:1,div:createBrick(ix,iy,'./wall/completeg_r1.png')});
					}
					if(ee==5)
					{
                        baseswarm.push({x:ix,y:0,z:iy});
                        //engine.getObject({x:ix,y:0,z:iy},'plane','base',true);
                         createEnemy(engine.getObject({x:ix,y:0,z:iy},'tank2','tankb',true));
					//keys.push({x:ix,y:iy,t:2,div: createDiv(ix,iy,'keyb.png')});
					}
					if(ee==6)
					{
                        //groundswarm.push({x:ix,y:0,z:iy});
                        waterswarm.push({x:ix,y:-3,z:iy});
                        holeswarm.push({x:ix,y:0,z:iy});
                        bricks.push({position:{x:ix,y:-4,z:iy},under:true});
                        //engine.getObject({x:ix,y:0,z:iy},'plane','grass',true);
					//gates.push({x:ix,y:iy,t:2,div:createBrick(ix,iy,'./wall/completeg_b1.png')});
					}
					if(ee==7)
					{
                        baseswarm.push({x:ix,y:0,z:iy});
                        //engine.getObject({x:ix,y:0,z:iy},'plane','base',true);
                         createEnemy(engine.getObject({x:ix,y:0,z:iy},'tank2','tankb',true));
					//keys.push({x:ix,y:iy,t:3,div: createDiv(ix,iy,'keyg.png')});
					}
					if(ee==8)
					{
                        groundswarm.push({x:ix,y:0,z:iy});
                        //ngine.getObject({x:ix,y:0,z:iy},'plane','grass',true);
					//gates.push({x:ix,y:iy,t:3,div:createBrick(ix,iy,'./wall/completeg_g1.png')});
					}
					if(ee==9)
					{
                        groundswarm.push({x:ix,y:0,z:iy});
                        //engine.getObject({x:ix,y:0,z:iy},'plane','grass',true);
					//goal={x:ix,y:iy,div:createDiv(ix,iy,'charf.png')};
					}
					if(ee==10)
					{
                        ftemp.push({x:ix,y:-4,z:iy});
                        groundswarm.push({x:ix,y:0,z:iy});
                        //engine.getObject({x:ix,y:0,z:iy},'plane','grass',true);
					//enemies.push({x:ix,y:iy,angle:0,dest:{x:ix,y:iy},div:createDiv(ix,iy,'ork.png')});
					}
                    if(ee==0)
					{
                        groundswarm.push({x:ix,y:0,z:iy});
					//enemies.push({x:ix,y:iy,angle:0,dest:{x:ix,y:iy},div:createDiv(ix,iy,'ork.png')});
					}
                    if(ee==11)
					{
                        groundswarm.push({x:ix,y:0,z:iy});
					//enemies.push({x:ix,y:iy,angle:0,dest:{x:ix,y:iy},div:createDiv(ix,iy,'ork.png')});
					}
					ix+=20;
				}
				)
				if(maxx<ix)maxx=ix;
				iy+=20;
				ix=20;
			}
			)
            
            //boxswarm
            //groundswarm
            engine.getObjectsStatic({x:0,y:0,z:0},boxswarm,'brick','brick',true);
            engine.getObjectsStatic({x:0,y:0,z:0},groundswarm,'plane','grass',true);
            engine.getObjectsStatic({x:0,y:0,z:0},baseswarm,'plane','base',true);
            engine.getObjectsStatic({x:0,y:0,z:0},holeswarm,'hole','concrete',true);
            engine.getObjectsStatic({x:0,y:0,z:0},waterswarm,'plane','water',true);
            
            for(var i=0;i<ftemp.length;i++)
            {
                 var fenc=engine.getObject(ftemp[i],'brick','fence',true);
                        fenc.life=3;
                        fence.push(fenc);
            }
            
    engine.render();
    }

engine.onKey('W'.charCodeAt(0),function(){
    sendScore("bobb",500,0,document.getElementById("say"));
cam.position.x+=5;
cam.matCalctulate();
});
engine.onKey('S'.charCodeAt(0),function(){
cam.position.x-=5;
cam.matCalctulate();
});
engine.onKey('A'.charCodeAt(0),function(){
cam.position.z-=5;
cam.matCalctulate();
});
engine.onKey("D".charCodeAt(0),function(){
cam.position.z+=5;
cam.matCalctulate();
});
engine.onKey('Q'.charCodeAt(0),function(){
cam.position.y-=5;
cam.matCalctulate();
});
engine.onKey("E".charCodeAt(0),function(){
cam.position.y+=5;
cam.matCalctulate();
});
engine.onKey("R".charCodeAt(0),function(){
//if(player.direction.s!=0) return;
vNum++;
vNum%=vehicles.length;
player.veh=vehicles[vNum];
gameSay("");
});
engine.onKey(32,eventShoot);

engine.onKey(38,function(){
    player.direction.t=1;
        
},function(){
    player.direction.t=0;
        
});
engine.onKey(40,function(){
    player.direction.t=-1
},function(){
    player.direction.t=0;
        
});
engine.onKey(37,function(){
player.direction.wa=1;
},function(){
    player.direction.wa=0;
        
});
engine.onKey(39,function(){
player.direction.wa=-1;
},function(){
    player.direction.wa=0;
        
});


/*
engine.onUpdate(
	function(t)
	{
		model.rotation.x+=0.1;
	}
)*/

};
window.onload=start;
