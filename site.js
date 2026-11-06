(function(){
  var doc=document.documentElement;doc.classList.remove('no-js');
  var still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // menu
  var btn=document.querySelector('.menu-btn'),menu=document.querySelector('.menu');
  if(btn&&menu){btn.addEventListener('click',function(){var o=menu.classList.toggle('open');btn.setAttribute('aria-expanded',o?'true':'false')})}

  // copy
  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var el=document.getElementById(b.getAttribute('data-copy')),t=el.textContent;
      var ok=function(){b.textContent='복사됨';setTimeout(function(){b.textContent='복사'},1600)};
      var sel=function(){var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r)};
      try{navigator.clipboard.writeText(t).then(ok,sel)}catch(e){sel()}
    });
  });

  // reveal + counters
  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');count(e.target);io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px'}):null;
  document.querySelectorAll('[data-reveal],.tl').forEach(function(el){if(io&&!still)io.observe(el);else{el.classList.add('in');count(el)}});
  function count(root){(root.matches&&root.matches('[data-count]')?[root]:[]).concat([].slice.call(root.querySelectorAll?root.querySelectorAll('[data-count]'):[])).forEach(function(n){
    if(n._done)return;n._done=1;var to=+n.getAttribute('data-count'),suf=n.getAttribute('data-suf')||'',t0=null;
    if(still){n.innerHTML=to+suf;return}
    function f(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/1200),v=Math.round(to*(1-Math.pow(1-k,3)));n.innerHTML=v+suf;if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)})}

  // scroll-linked
  var head=document.querySelector('.site-head'),bar=document.querySelector('.progress');
  var hero=document.querySelector('.hero');
  var pins=[].slice.call(document.querySelectorAll('.pin'));
  var hpins=[].slice.call(document.querySelectorAll('.hpin'));
  var lines=[].slice.call(document.querySelectorAll('.timeline'));
  function clamp(v){return v<0?0:v>1?1:v}
  function onScroll(){
    var y=window.scrollY,vh=window.innerHeight,H=doc.scrollHeight-vh;
    if(bar)bar.style.setProperty('--sp',H>0?(y/H).toFixed(4):0);
    if(head)head.classList.toggle('scrolled',y>8);
    if(still)return;
    if(hero){var h=hero.offsetHeight;hero.style.setProperty('--p',clamp(y/(h*.8)).toFixed(3))}
    pins.forEach(function(p){
      var r=p.getBoundingClientRect(),len=p.offsetHeight-vh,k=clamp(-r.top/(len||1)),n=+(p.getAttribute('data-steps')||3),i=Math.min(n-1,Math.floor(k*n*0.999));
      if(p._i!==i){p._i=i;p.querySelectorAll('.story-step').forEach(function(s,j){s.classList.toggle('on',j===i)});p.querySelectorAll('.story-dots i').forEach(function(d,j){d.classList.toggle('on',j<=i)})}
    });
    hpins.forEach(function(p){
      if(window.innerWidth<=760)return;
      var r=p.getBoundingClientRect(),len=p.offsetHeight-vh,k=clamp(-r.top/(len||1)),tr=p.querySelector('.htrack');
      var max=tr.scrollWidth-window.innerWidth;tr.style.transform='translate3d('+(-max*k).toFixed(1)+'px,0,0)';
    });
    lines.forEach(function(l){var r=l.getBoundingClientRect();l.style.setProperty('--p',clamp((vh*.7-r.top)/r.height).toFixed(3))});
  }
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);onScroll();
  pins.forEach(function(p){if(p._i===undefined||still){var s=p.querySelector('.story-step');if(s)s.classList.add('on')}});

  // strip arrows
  var st=document.getElementById('strip');
  if(st)document.querySelectorAll('[data-strip]').forEach(function(b){b.addEventListener('click',function(){var f=st.querySelector('figure');var w=f?f.getBoundingClientRect().width+16:300;st.scrollBy({left:w*Number(b.getAttribute('data-strip')),behavior:'smooth'})})});

  // hero graph (light)
  var cv=document.getElementById('graph');
  if(!cv)return;
  var ctx=cv.getContext('2d'),W,Hh,dpr,nodes=[],t0=performance.now();
  var labels=['설비','품번','주문','공급사','로트','불량','폐기','공정','작업일지','고객사'];
  function size(){dpr=Math.min(window.devicePixelRatio||1,2);W=cv.clientWidth;Hh=cv.clientHeight;cv.width=W*dpr;cv.height=Hh*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    var n=Math.round(Math.min(90,Math.max(40,W*Hh/16000)));nodes=[];
    for(var i=0;i<n;i++)nodes.push({x:Math.random()*W,y:Math.random()*Hh,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.4+1,lab:(i<labels.length&&W>700)?labels[i]:null,ph:Math.random()*6.28})}
  function frame(now){var t=(now-t0)/1000;ctx.clearRect(0,0,W,Hh);var maxD=Math.min(160,W/6);
    for(var i=0;i<nodes.length;i++){var a=nodes[i];if(!still){a.x+=a.vx;a.y+=a.vy;if(a.x<-20)a.x=W+20;if(a.x>W+20)a.x=-20;if(a.y<-20)a.y=Hh+20;if(a.y>Hh+20)a.y=-20}
      for(var j=i+1;j<nodes.length;j++){var b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);if(d<maxD){ctx.strokeStyle='rgba(95,212,230,'+((1-d/maxD)*.35)+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}
    for(var k=0;k<nodes.length;k++){var p=nodes[k],g=.5+.5*Math.sin(t*1.2+p.ph);
      if(p.lab){ctx.fillStyle='rgba(242,193,78,'+(.55+.45*g)+')';ctx.beginPath();ctx.arc(p.x,p.y,3.2,0,6.28);ctx.fill();ctx.fillStyle='rgba(233,238,242,'+(.45+.35*g)+')';ctx.font='600 12px "Noto Sans KR",sans-serif';ctx.fillText(p.lab,p.x+8,p.y+4)}
      else{ctx.fillStyle='rgba(95,212,230,'+(.35+.5*g)+')';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fill()}}
    if(!still)requestAnimationFrame(frame)}
  size();window.addEventListener('resize',function(){size();if(still)frame(performance.now())});requestAnimationFrame(frame);
})();
