//Draw Annotation variable
var videoAnnotation=[
    {id:"va1",type:1,width:"100px",height:"50px",comment:"Title",time_start:1,time_end:15,top:"50px",left:"350px"},
    {id:"va2",type:2,width:"100px",height:"50px",comment:"comment 2",time_start:5,time_end:20,top:"250px",left:"350px"},
    {id:"va3",type:2,width:"100px",height:"50px",comment:"comment 3",time_start:23,time_end:32,top:"350px",left:"450px"},
    {id:"va4",type:1,width:"100px",height:"50px",comment:"comment 4",time_start:120,time_end:145,top:"150px",left:"650px"}
];
// Annotation markets that appears in the video player timeline
var markers = [];
//delete the draws that appears in the video player
function deleteDraw(){
    for(var i=0;i<videoAnnotation.length;i++)
    {
      elem=document.getElementById(videoAnnotation[i].id);
      if(elem){elem.remove()}
    }
  }
//draws the circles or rectangules that appears in the video player
  function drawAnnotation(){
    deleteDraw();
    var myPlayer = videojs('ml');
    const timeAUX = myPlayer.currentTime();
    for(var i=0;i<videoAnnotation.length;i++)
    {
      if(timeAUX>videoAnnotation[i].time_start && timeAUX<videoAnnotation[i].time_end){
        if(!document.getElementById(videoAnnotation[i].id)){
          var divVideo= document.getElementById('ml');
          var divAnnnotation = document.createElement("div");
          divAnnnotation.style.position='absolute';
          divAnnnotation.style.height=videoAnnotation[i].height;
          divAnnnotation.style.width= videoAnnotation[i].width;
          if (videoAnnotation[i].type==1){divAnnnotation.style.borderRadius= '100%';}
          divAnnnotation.style.top= videoAnnotation[i].top;
          divAnnnotation.style.left= videoAnnotation[i].left;
          divAnnnotation.style.zIndex= '1';
          divAnnnotation.style.border= '3px solid green';
          divAnnnotation.setAttribute("id", videoAnnotation[i].id);
          divVideo.append(divAnnnotation)
        }
      }
    }   
  }
  //This function help to do a searh data in the videoAnnotation
    function searchAnnotation(){
      list = document.getElementById("listComments");
      var searchText = document.getElementById("searchText").value;
      b = list.getElementsByTagName("LI");
      if (searchText==""){
        for (i = 0; i < b.length; i++) {b[i].style.display = 'block';}
      }
      else{
        for (i = 0; i < b.length; i++) {
          spans=b[i].getElementsByTagName("span")
          if (spans[1].innerText.toLowerCase().includes(searchText.toLowerCase())) {
            b[i].style.display = 'block';
            }
          else{
            b[i].style.display = 'none';}
        }
      }}
    // this Function convert the seconds to time
    function secondsToTime(e){
        const h = Math.floor(e / 3600).toString().padStart(2,'0'),
            m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
            s = Math.floor(e % 60).toString().padStart(2,'0');        
        return h + ':' + m + ':' + s;}
    //This Function add the annotation in the screen
    function addAnnotation() {
        var myPlayer = videojs('ml');
        var annotation = document.getElementById("myText").value;
        if (myPlayer.readyState() < 1) {
            // wait for loadedmetdata event
            myPlayer.one("loadedmetadata", onLoadedMetadata);
        }else if(annotation!=""){
            const timeAUX = myPlayer.currentTime();
            time=secondsToTime(timeAUX);
            var ul = document.getElementById("listComments");
            var li = document.createElement("li");
            var p=document.createElement("span");
            p.innerText=time
            li.appendChild(p);
            li.appendChild(document.createElement("br"));
            
            var ptext=document.createElement("span");
            ptext.innerText=annotation
            li.appendChild(ptext);
            li.appendChild(document.createElement("br"));
            var pdelete=document.createElement("span");
            pdelete.setAttribute('onclick',"deleteComment(this.parentNode.id)");
            pdelete.innerText="Delete"
            pdelete.style.color = "red";
            li.appendChild(pdelete);
            li.setAttribute("id", myPlayer.currentTime()); 
            //li.setAttribute('onclick',"goAnnotation(this.id)");
            ul.appendChild(li);
            document.getElementById("myText").value=""
            orderComments();
            markers.push({time:timeAUX,label:'A'});
            removeMarket();
            loadedmetadata();
        }
     }
    function goAnnotation(id){
      var time = parseInt(id,10);
      var myPlayer = videojs('ml');
      myPlayer.currentTime(time);
    }//This function delete the comments
    function deleteComment(id){
      var idNum=parseInt(id,10);
      document.getElementById(id).remove();
      for(var i=0;i<markers.length;i++)
      {
        var time = parseInt(markers[i].time,10);      
        if(time==idNum){
          markers.splice(i,1);
          removeMarket();
          loadedmetadata();
        }
      } 
    }//This function remove the markets
    function removeMarket(){
      const collection=document.getElementsByClassName("vjs-marker");
      while (collection.length > 0) { 
        collection[0].remove();
      }
    }//This function go to the next annotation
    function nextAnnotation(){
      var myPlayer = videojs('ml');
      var currenteTime=myPlayer.currentTime()

      for(var i=0;i<markers.length;i++)
      {
        if (markers[i].time>=parseInt(currenteTime)+2){
          myPlayer.currentTime(markers[i].time);
          break;
        }
      }} 
      //This function go to the previos annotation
    function prevAnnotation(){
      var myPlayer = videojs('ml');
      var currenteTime=myPlayer.currentTime()
      
      for(var i=markers.length;i>0;i--)
      {
        if (parseInt(currenteTime)>markers[i-1].time){
          myPlayer.currentTime(markers[i-1].time);
          break;
        }
      }}
      //This function order the annotations by time
    function orderComments(){
      var list, i, switching, b, shouldSwitch;
      list = document.getElementById("listComments");
      switching = true;
      /* Make a loop that will continue until no switching has been done: */
      while (switching) {
        // start by saying: no switching is done:
        switching = false;
        b = list.getElementsByTagName("LI");
        // Loop through all list-items:
        for (i = 0; i < (b.length - 1); i++) {
          // start by saying there should be no switching:
          shouldSwitch = false;
          /* check if the next item should switch place with the current item: */
          if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
            /* if next item is alphabetically lower than current item, mark as a switch and break the loop: */
            shouldSwitch = true;
            break;
          }
        }
        if (shouldSwitch) {
          /* If a switch has been marked, make the switch and mark the switch as done: */
          b[i].parentNode.insertBefore(b[i + 1], b[i]);
          switching = true;
        }      
      }
    }//This function load the markers in the timeline of the videoplayer
    function loadedmetadata(){
        var video = videojs("ml"); 
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
    }
    setInterval(drawAnnotation, 1000);// This function call every second to drawAnnotation()