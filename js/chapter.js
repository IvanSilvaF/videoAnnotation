var video = videojs("ml"); 

var videoAnnotation=[
    {id:"va1",type:1,width:"100px",height:"50px",comment:"Title",time_start:1,time_end:50,top:"50px",left:"350px"},
    {id:"va1",type:2,width:"100px",height:"50px",comment:"comment 2",time_start:5,time_end:20,top:"250px",left:"350px"},
    {id:"va1",type:2,width:"100px",height:"50px",comment:"comment 3",time_start:23,time_end:32,top:"350px",left:"450px"},
    {id:"va1",type:1,width:"100px",height:"50px",comment:"comment 4",time_start:120,time_end:145,top:"150px",left:"650px"}
];

var markers = [
  {time:50,label:'Introduction'},
  {time:100,label:'C2'},
  {time:150,label:'C3'},
  {time:200,label:'Conclusion'}
];

video.on("loadedmetadata",function(){
  
    var total = video.duration();
    var p = jQuery(video.controlBar.progressControl.children_[0].el_);
    for(var i=0;i<markers.length;i++)
    {
        var left =( markers[i].time/ total * 100)+'%';
        var time = markers[i].time;
        var el = jQuery('<div class="vjs-marker" style="left:'+left+'" data-time="'+time+'"><span>'+markers[i].label+'</span></div>');
        el.click(function(){
            video.currentTime($(this).data('time')); 
        });
    
        p.append(el); 
    }
});