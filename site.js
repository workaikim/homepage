(function(){
  var btn=document.querySelector('.menu-btn'),menu=document.querySelector('.menu');
  if(btn&&menu){btn.addEventListener('click',function(){var o=menu.classList.toggle('open');btn.setAttribute('aria-expanded',o?'true':'false')})}

  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var el=document.getElementById(b.getAttribute('data-copy')),t=el.textContent;
      var ok=function(){b.textContent='복사됨';setTimeout(function(){b.textContent='복사'},1600)};
      var sel=function(){var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r)};
      try{navigator.clipboard.writeText(t).then(ok,sel)}catch(e){sel()}
    });
  });

  var cv=document.getElementById('graph');
  if(!cv)return;
  var ctx=cv.getContext('2d'),W,H,dpr,nodes=[],t0=performance.now();
  var still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var labels=['설비','품번','주문','공급사','로트','불량','폐기','공정','작업일지','고객사'];
  function size(){
    dpr=Math.min(window.devicePixelRatio||1,2);
    W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    var n=Math.round(Math.min(90,Math.max(40,W*H/16000)));nodes=[];
    for(var i=0;i<n;i++){nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.6+0.8,lab:i<labels.length?labels[i]:null,ph:Math.random()*6.28})}
  }
  function frame(now){
    var t=(now-t0)/1000;ctx.clearRect(0,0,W,H);
    var maxD=Math.min(170,W/5);
    for(var i=0;i<nodes.length;i++){var a=nodes[i];
      if(!still){a.x+=a.vx;a.y+=a.vy;if(a.x<-20)a.x=W+20;if(a.x>W+20)a.x=-20;if(a.y<-20)a.y=H+20;if(a.y>H+20)a.y=-20}
      for(var j=i+1;j<nodes.length;j++){var b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<maxD){var al=(1-d/maxD)*.35;ctx.strokeStyle='rgba(95,212,230,'+al+')';ctx.lineWidth=(a.lab&&b.lab)?1.4:.7;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
    }
    for(var k=0;k<nodes.length;k++){var p=nodes[k],g=.55+.45*Math.sin(t*1.3+p.ph);
      if(p.lab){ctx.fillStyle='rgba(242,193,78,'+(.55+.45*g)+')';ctx.beginPath();ctx.arc(p.x,p.y,3.4,0,6.28);ctx.fill();
        ctx.fillStyle='rgba(233,238,242,'+(.45+.35*g)+')';ctx.font='500 12px "IBM Plex Sans KR",sans-serif';ctx.fillText(p.lab,p.x+8,p.y+4)}
      else{ctx.fillStyle='rgba(95,212,230,'+(.35+.5*g)+')';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fill()}
    }
    if(!still)requestAnimationFrame(frame);
  }
  size();window.addEventListener('resize',function(){size();if(still)frame(performance.now())});
  requestAnimationFrame(frame);
})();
