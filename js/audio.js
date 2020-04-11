
var myAudio =function (){};
myAudio.init=function(){
if (typeof AudioContext !== "undefined") {
    myAudio.context = new AudioContext();
} else if (typeof webkitAudioContext !== "undefined") {
    myAudio.context = new webkitAudioContext();
} else {
    throw new Error('AudioContext not supported. :(');
}
  myAudio.svolume=myAudio.context.createGain();
	myAudio.svolume.connect(myAudio.context.destination);
  myAudio.svolume.gain.value=0.5;
  myAudio.loaded=[];
  myAudio.slist=[];
}

myAudio.requestSound=function (sname)
{
 var request = new XMLHttpRequest();
request.open("GET", sname , true);
request.responseType = "arraybuffer";

request.onload = function() {
    var audioData = request.response;
    myAudio.createSoundSource(audioData,sname);
};
request.send();
return {play:function(){myAudio.playSound(sname);}};
}
myAudio.finishedLoading=function(bufferList)
{
myAudio.loaded=bufferList;
}

myAudio.playSound=function(name)
{
for(var i =0;i<myAudio.loaded.length;i++)
	if(name==myAudio.slist[i])
	{
	var soundSource = myAudio.context.createBufferSource();
	soundSource.buffer = myAudio.loaded[i];
	soundSource.connect(myAudio.svolume);
	soundSource.start(myAudio.context.currentTime);
	}
}

myAudio.createSoundSource = function (audioData, nameData){

myAudio.context.decodeAudioData(audioData, function(soundBuffer){
	myAudio.loaded.push(soundBuffer);
	myAudio.slist.push(nameData);
});
}