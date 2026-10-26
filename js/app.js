/* Vistas con #token: #inicio · #sobre-mi · #proyectos · #proyectos.categoria.proyecto · #contacto */
(async function(){
  var DATA, I;
  try{                                           /* el contenido vive en data/projects.json y data/i18n.json */
    var res=await Promise.all([fetch('data/projects.json'),fetch('data/i18n.json')]);
    DATA=await res[0].json(); I=await res[1].json();
  }catch(err){
    console.error(err);
    document.body.insertAdjacentHTML('afterbegin','<p style="position:relative;z-index:200;padding:24px;color:#fff;font-size:16px;line-height:24px">No se pudo cargar el contenido. Abre el sitio desde un servidor (por ejemplo: python3 -m http.server) o publícalo en un hosting; no funciona abriendo el archivo directamente.</p>');
    return;
  }
  var FORM_ENDPOINT='https://script.google.com/macros/s/AKfycbxVRDJaPi-81g5jd9JTZCLnNWUxU8C3EBEGhl2pdYxPxc9TU4Kt7d29AY2ldHdmVTfn/exec';                       /* ← pega aquí la URL de tu servicio de formularios (Formspree, Web3Forms…) */
  var MAIL_TO='lucio.calocero@gmail.com';     /* si FORM_ENDPOINT está vacío, se abre el correo del visitante */
  var GS=/script\.google\.com/.test(FORM_ENDPOINT);   /* Google Apps Script: se envía como texto plano, sin leer la respuesta */
  var SEC={home:'v-home',about:'v-sobre-mi',works:'v-trabajos',contact:'v-contacto'};
  var THEME={home:'home',about:'sobre-mi',works:'trabajos',contact:'contacto'};
  var NAV={about:'sobre-mi',works:'proyectos',contact:'contacto'};
  var WIPE={about:1,works:1,contact:1};            /* entre estas tres páginas hay barrido circular */
  var V={'':'home',inicio:'home','sobre-mi':'about',proyectos:'works',trabajos:'works',contacto:'contact'};
  var TOOLS={adobe:{n:'Adobe',s:'<svg aria-hidden="true" viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M29.27 0H0V70L29.27 0Z" fill="white"/> <path d="M49.8639 0H79.0957V70L49.8639 0Z" fill="white"/> <path d="M39.567 25.7998L58.1968 70.0003H45.9739L40.406 55.9278H26.7721L39.567 25.7998Z" fill="white"/> </svg>'},blender:{n:'Blender',s:'<svg aria-hidden="true" viewBox="0 0 87 70" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M41.9609 1.02148C43.9033 -0.337275 46.8735 -0.341965 48.6396 1.01367C48.6655 1.03039 48.6856 1.05012 48.71 1.06836L75.6289 21.7383L75.623 21.7422C78.2905 23.8108 80.5341 26.2689 82.2744 29.0762C84.1773 32.1311 85.4133 35.483 85.9209 39.0547C86.1807 40.8875 86.24 42.7224 86.0986 44.5537C85.9542 46.4124 85.5934 48.2655 85.0234 50.0908C83.8895 53.7034 81.975 57.0522 79.3076 60.0098C76.5733 63.0389 73.2031 65.4813 69.3076 67.2246C65.2131 69.0514 60.7764 69.9939 56.1758 70C51.5674 70.0076 47.1308 69.0827 43.0361 67.2695C39.1406 65.5429 35.7672 63.1116 33.0283 60.084C30.3593 57.1384 28.4414 53.7954 27.3105 50.1826C26.7726 48.4759 26.4134 46.2907 26.3936 45.166C26.3738 44.0458 26.6201 42.1787 26.6201 42.1787L9.72754 56.0039C6.77736 58.3871 2.80885 58.3826 0.942383 55.9902C-0.89629 53.6374 0.0481608 49.9202 2.96777 47.6846C3.00421 47.6557 3.04648 47.6245 3.08594 47.5957L34.0381 23.8389L16.6924 23.8721L16.6973 23.8613C13.7563 23.8507 11.8346 21.8687 12.3877 19.4795C12.9258 17.1343 15.645 15.2784 18.4736 15.2754H18.5195L52.7402 15.2393L41.5127 6.1084L41.5205 6.10059C39.7728 4.66733 39.9973 2.39546 41.9609 1.02148ZM56.168 23.8213C51.6629 23.8274 47.355 25.32 43.9717 28.0771C42.2452 29.4875 40.8473 31.155 39.832 33C38.7985 34.877 38.1507 36.9521 37.9668 39.127C37.7722 41.3521 38.0659 43.558 38.8213 45.6357C39.5919 47.7498 40.8413 49.735 42.542 51.46C46.0226 54.9997 50.8956 56.9925 56.1758 56.9834C61.4482 56.9727 66.3212 54.9618 69.8018 51.416C71.5025 49.6834 72.7474 47.6983 73.5195 45.5781C74.2749 43.499 74.5684 41.2962 74.377 39.0742C74.1854 36.8931 73.542 34.8258 72.5039 32.9502C71.4886 31.1082 70.0917 29.4473 68.3682 28.043C64.9818 25.295 60.6776 23.8152 56.168 23.8213ZM56.5566 29.3027C59.6117 29.3027 62.4152 30.3805 64.499 32.1436C66.6207 33.9386 68.0278 36.4708 68.1904 39.3418C68.3515 42.2949 67.1643 45.0387 65.082 47.0723C62.9587 49.1407 59.9383 50.4385 56.5566 50.4385C53.1751 50.4384 50.1491 49.1406 48.0273 47.0723C45.9436 45.0387 44.7593 42.2948 44.9219 39.3447C45.083 36.4706 46.4909 33.9386 48.6143 32.1436C50.6965 30.3806 53.4987 29.3028 56.5566 29.3027Z" fill="white"/> </svg>'},figma:{n:'Figma',s:'<svg aria-hidden="true" viewBox="0 0 47 70" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M35 0C41.4398 0.000175952 46.666 5.2271 46.666 11.667C46.6658 18.1067 41.4397 23.3328 35 23.333H23.333V58.333C23.333 64.773 18.106 70 11.666 70C5.22616 69.9998 0 64.7729 0 58.333C0.00017699 51.8933 5.22627 46.6672 11.666 46.667C5.22616 46.6668 0 41.4399 0 35C5.16005e-07 28.5601 5.22616 23.3332 11.666 23.333C5.22627 23.3328 0.000175958 18.1067 0 11.667C0 5.2271 5.22616 0.000176295 11.666 0H35ZM35 23.333C41.4398 23.3332 46.666 28.5601 46.666 35C46.666 41.4399 41.4398 46.6668 35 46.667C28.56 46.667 23.333 41.44 23.333 35C23.333 28.56 28.56 23.333 35 23.333Z" fill="white"/> </svg>'},magnific:{n:'Magnific',s:'<svg aria-hidden="true" viewBox="0 0 101 70" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M60.6006 0L50.5 24.1369L40.4045 0H20.2033L0.00213878 70C-0.268581 70 25.2511 70 25.2511 70L50.5 38.6193L75.7489 70C75.7489 70 101.269 70 100.998 70L80.8018 0H60.6006Z" fill="white"/> </svg>'}};
  var $=function(i){return document.getElementById(i);};
  var vid=$('vid'), rm=matchMedia('(prefers-reduced-motion: reduce)').matches, L='es', cur=null, tm;
  var W=$('works'), ws={open:false,cat:null,k:0}, busy=false, mob={c:null,k:null}, mq=matchMedia('(max-width:768px)'), EASE='cubic-bezier(.65,0,.35,1)';
  function nm(x){return Array.isArray(x)?x[L==='es'?0:1]:x;}
  function slug(s){s=Array.isArray(s)?s[0]:s;return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
  function parse(){
    var t=location.hash.slice(1);
    if(V.hasOwnProperty(t))return {v:V[t]};
    var p=t.split('.');
    if(p[0]==='proyectos'||p[0]==='trabajos'){
      var c=DATA.filter(function(x){return x.id===p[1];})[0];
      if(c){var k=0; if(p[2]){c.items.forEach(function(it,i){if(slug(it.n)===p[2])k=i;});} return {v:'works',c:c,k:k,none:!p[2]};}
      return {v:'works'};
    }
    return {v:'home'};
  }
  function title(r){return r.c?(r.none?nm(r.c.n):nm(r.c.items[r.k].n)+' · '+nm(r.c.n)):I[L].t[r.v];}
  function infoIn(i){
    var t=i.d?'<p>'+nm(i.d).replace(/\n/g,'<br>').replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g,'<a class="ext" href="$2" target="_blank" rel="noopener noreferrer">$1</a>')+'</p>':'';
    var l=(i.l||[]).length?'<div class="links">'+i.l.map(function(x){return '<a class="ext" href="'+x.u+'" target="_blank" rel="noopener noreferrer">'+x.t+'</a>';}).join('')+'</div>':'';
    return t+l;
  }
  function info(i){var s=infoIn(i); return s?'<div class="info"><div>'+s+'</div></div>':'';}
  function renderWorks(){
    $('cats').innerHTML=DATA.map(function(c){
      return '<section class="cat" data-cat="'+c.id+'"><div class="chead"><h2>'+nm(c.n)+'</h2><a class="cx" href="#proyectos" aria-label="'+I[L].close+'">x</a></div><ul>'+
        c.items.map(function(i){return '<li><a href="#proyectos.'+c.id+'.'+slug(i.n)+'"><span class="t">'+nm(i.n)+'</span></a>'+info(i)+'</li>';}).join('')+'</ul></section>';
    }).join('');
  }
  function isVid(s){return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(s);}
  function elHTML(s,it){                               /* un archivo: imagen o video según su extensión */
    return isVid(s)?'<video src="'+s+'" autoplay muted loop playsinline preload="metadata"></video>':'<img src="'+s+'" alt="'+nm(it.n)+'" loading="lazy" decoding="async">';
  }
  var IC={
    play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    pause:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
    vol:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4z"/></svg>',
    mute:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M15 9l6 6M21 9l-6 6" stroke="#fff" stroke-width="2" fill="none"/></svg>',
    expand:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 0h2v6h-6v-2h4v-4z"/></svg>'
  };
  function vidHTML(m){                                 /* video con controles propios: play/pausa, volumen y ampliar, agrupados a la izquierda */
    var t=({es:{pp:'Reproducir o pausar',mu:'Silenciar o activar el sonido',vo:'Volumen',ex:'Ampliar',pr:'Progreso'},en:{pp:'Play or pause',mu:'Mute or unmute',vo:'Volume',ex:'Enlarge',pr:'Progress'}})[L];
    return '<div class="vp"><video src="'+m.src+'" poster="'+(m.poster||'')+'" autoplay muted loop playsinline></video>'+
      '<div class="vc"><button type="button" class="vpp" aria-label="'+t.pp+'"><span class="i-play">'+IC.play+'</span><span class="i-pause">'+IC.pause+'</span></button>'+
      '<button type="button" class="vmu" aria-label="'+t.mu+'"><span class="i-vol">'+IC.vol+'</span><span class="i-mute">'+IC.mute+'</span></button>'+
      '<input type="range" class="vv" min="0" max="1" step="0.05" value="0" aria-label="'+t.vo+'">'+
      '<button type="button" class="vex" aria-label="'+t.ex+'">'+IC.expand+'</button></div>'+
      '<input type="range" class="vs" min="0" max="1000" value="0" aria-label="'+t.pr+'"></div>';
  }
  function bindVC(root){
    root.querySelectorAll('.vp').forEach(function(vp){
      var v=vp.querySelector('video'), vv=vp.querySelector('.vv'), vs=vp.querySelector('.vs');
      function st(){vp.classList.toggle('paused',v.paused); vp.classList.toggle('muted',v.muted||v.volume===0); vv.value=v.muted?0:v.volume;}
      vp.querySelector('.vpp').addEventListener('click',function(){if(v.paused){var p=v.play(); if(p&&p.catch)p.catch(function(){});}else v.pause();});
      vp.querySelector('.vmu').addEventListener('click',function(){v.muted=!v.muted; if(!v.muted&&v.volume===0)v.volume=0.6; st();});
      vp.querySelector('.vex').addEventListener('click',function(){openLB(v);});
      vv.addEventListener('input',function(){v.volume=+vv.value; v.muted=(+vv.value===0); st();});
      vs.addEventListener('input',function(){if(v.duration)v.currentTime=vs.value/1000*v.duration; vs.style.setProperty('--p',(vs.value/10)+'%');});
      ['play','pause','volumechange'].forEach(function(ev){v.addEventListener(ev,st);});
      v.addEventListener('timeupdate',function(){if(v.duration){vs.value=v.currentTime/v.duration*1000; vs.style.setProperty('--p',(v.currentTime/v.duration*100)+'%');}});
      st();
    });
  }
  function imgHTML(m,it){                              /* una imagen o varias apiladas; "fit" opcional: "y" (scroll vertical), "x" (horizontal), "c" (llena el recuadro) */
    var a=[].concat(m.src);
    return '<div class="sc"'+(m.fit?' data-fit="'+m.fit+'"':'')+'>'+a.map(function(s){return elHTML(s,it);}).join('')+'</div>';
  }
  function fitMedia(root){                             /* el recuadro funciona como máscara: si la imagen es más grande, se desplaza adentro */
    root.querySelectorAll('.sc').forEach(function(sc){
      var img=sc.querySelector('img,video'); if(!img)return;
      function apply(){
        var w=img.naturalWidth||img.videoWidth, h=img.naturalHeight||img.videoHeight; if(!w||!h)return;
        var r=w/h, mode=sc.dataset.fit||(r<1.57?'y':(r>2.05?'x':'c'));
        sc.classList.remove('y','x','c'); sc.classList.add(mode);
      }
      if((img.complete&&img.naturalWidth)||img.readyState>=1)apply(); else img.addEventListener(img.tagName==='VIDEO'?'loadedmetadata':'load',apply,{once:true});
      sc.querySelectorAll('img').forEach(function(im){im.addEventListener('error',function(){console.warn('No se encontró la imagen: '+im.getAttribute('src'));},{once:true});});
      sc.addEventListener('wheel',function(e){         /* en imágenes anchas, la rueda vertical mueve el scroll horizontal */
        if(!sc.classList.contains('x')||Math.abs(e.deltaY)<=Math.abs(e.deltaX))return;
        var max=sc.scrollWidth-sc.clientWidth;
        if((e.deltaY>0&&sc.scrollLeft<max-1)||(e.deltaY<0&&sc.scrollLeft>1)){e.preventDefault();sc.scrollLeft+=e.deltaY;}
      },{passive:false});
    });
    root.querySelectorAll('video').forEach(function(v){v.addEventListener('error',function(){console.warn('No se pudo cargar el video: '+v.getAttribute('src'));},{once:true});});
  }
  function renderMedia(it){
    var m=it.m, h='';
    if(!m) h='<div class="mph">'+nm(it.n)+'</div>';
    else if(m.type==='video'&&Array.isArray(m.src)) h=imgHTML(m,it);
    else if(m.type==='video') h=vidHTML(m);
    else if(m.type==='image') h=imgHTML(m,it);
    else if(m.type==='slider') h='<div class="sl '+(m.dir==='v'?'v':'h')+'">'+m.slides.map(function(s){return elHTML(s,it);}).join('')+'</div>';
    $('pMedia').innerHTML=h; fitMedia($('pMedia')); bindVC($('pMedia'));
    var tl=it.tools||[]; $('pTools').hidden=!tl.length;
    $('pToolList').innerHTML=tl.map(function(k){var t=TOOLS[k];return t?'<li role="img" aria-label="'+t.n+'">'+t.s+'</li>':'<li>'+k+'</li>';}).join('');
  }
  function catEl(id){return W.querySelector('.cat[data-cat="'+id+'"]');}
  function clearCur(){W.querySelectorAll('li.cur,li.pre').forEach(function(l){l.classList.remove('cur','pre');});}
  function resetWorks(){
    W.classList.remove('out','closing','unproj'); W.removeAttribute('data-proj'); W.dataset.state='index'; ws.open=false; busy=false;
    W.querySelectorAll('.cat').forEach(function(s){s.classList.remove('sel','mv');s.style.transition='';s.style.transform='';});
    clearCur();
  }
  function fillOpen(c,k){
    clearCur(); ws.k=k; W.classList.remove('unproj');
    if(k===null){W.dataset.proj='none';$('pMedia').innerHTML='';$('pTools').hidden=true;return;}   /* sección desplegada, sin proyecto */
    W.dataset.proj='yes'; catEl(c.id).querySelectorAll('li')[k].classList.add('cur'); renderMedia(c.items[k]);
  }
  function openState(c,k){                         /* despliega la información del proyecto */
    if(ws.open&&ws.cat!==c)resetWorks();
    var sel=catEl(c.id); sel.style.transition='none'; sel.style.transform='';   /* sin salto: el layout ya está en su lugar final */
    W.classList.remove('out','closing'); sel.classList.remove('mv');
    W.dataset.state='open'; sel.classList.add('sel'); ws.open=true; ws.cat=c;
    fillOpen(c,k);
  }
  function moveDur(dx,dy){                      /* cuanto más lejos está la columna, más lenta y larga es su transición */
    var cs=W.querySelectorAll('.cat'); if(cs.length<2)return 0;
    var step=Math.abs(cs[1].getBoundingClientRect().left-cs[0].getBoundingClientRect().left);
    if(!step||(!dx&&!dy))return 0;
    var s=Math.max(1,Math.round(Math.hypot(dx,dy)/step));
    return Math.min(1.7,s<=2?.55+.25*(s-1):.8+.18*(s-2));
  }
  function closeState(){                            /* la columna vuelve a su lugar y las demás reaparecen */
    var sel=W.querySelector('.cat.sel'); ws.open=false; busy=false;
    if(!sel||rm){resetWorks();return;}
    var from=sel.getBoundingClientRect();
    W.classList.remove('closing'); W.classList.add('out'); clearCur();
    W.dataset.state='index'; sel.classList.remove('sel'); sel.classList.add('mv');
    var to=sel.getBoundingClientRect(), dx=from.left-to.left, dy=from.top-to.top, d=moveDur(dx,dy);
    sel.style.transition='none'; sel.style.transform='translate('+dx+'px,'+dy+'px)';
    void sel.offsetWidth;
    requestAnimationFrame(function(){
      sel.style.transition='transform '+d+'s '+EASE; sel.style.transform='none';
      setTimeout(function(){W.classList.remove('out');},Math.max(200,d*650));
      setTimeout(function(){sel.classList.remove('mv');sel.style.transition='';},d*1000+500);
    });
  }
  function animOpen(sec,href,li){                      /* 1) las demás se desvanecen · 2) la columna se desliza · 3) se despliega */
    var f=W.querySelector('.cat').getBoundingClientRect(), b=sec.getBoundingClientRect(), dx=f.left-b.left, dy=f.top-b.top, d=moveDur(dx,dy);
    if(li)li.classList.add('pre');                  /* queda activado desde el clic, aunque el cursor ya no esté encima */
    sec.classList.add('mv'); W.classList.add('out');
    if(d)setTimeout(function(){sec.style.transition='transform '+d+'s '+EASE;sec.style.transform='translate('+dx+'px,'+dy+'px)';},120);
    setTimeout(function(){go(href);},d?150+d*1000:280);
  }
    function mediaHTML(it){
    var m=it.m;
    if(!m)return '<div class="mph">'+nm(it.n)+'</div>';
    if(m.type==='video'&&Array.isArray(m.src))return imgHTML(m,it);
    if(m.type==='video')return vidHTML(m);
    if(m.type==='image')return imgHTML(m,it);
    if(m.type==='slider')return '<div class="sl '+(m.dir==='v'?'v':'h')+'">'+m.slides.map(function(s){return elHTML(s,it);}).join('')+'</div>';
    return '';
  }
  function toolsHTML(it){return (it.tools||[]).map(function(k){var t=TOOLS[k];return t?'<li role="img" aria-label="'+t.n+'">'+t.s+'</li>':'<li>'+k+'</li>';}).join('');}
  function fillMob(li,it){li.querySelector('.mmedia').innerHTML=mediaHTML(it);fitMedia(li.querySelector('.mmedia'));bindVC(li.querySelector('.mmedia'));li.querySelector('.mtools').innerHTML=toolsHTML(it);li.dataset.f='1';}
  /* Mobile: acordeón de secciones (v / x) con proyectos desplegables */
  function renderMacc(){
    $('macc').innerHTML=DATA.map(function(c){
      return '<section class="msec" data-cat="'+c.id+'"><button type="button" class="mh" aria-expanded="false"><span>'+nm(c.n)+'</span><span class="mx" aria-hidden="true">v</span></button><div class="mbody"><div><ul>'+
        c.items.map(function(i){return '<li class="mi"><a href="#proyectos.'+c.id+'.'+slug(i.n)+'"><span class="md" aria-hidden="true">·</span>'+nm(i.n)+'</a><div class="minfo"><div>'+infoIn(i)+'<div class="mmedia"></div><ul class="mtools"></ul></div></div></li>';}).join('')+
        '</ul></div></div></section>';
    }).join('');
  }
  function mobState(c,k){
    var opened=!!c&&mob.c!==c; mob.c=c; mob.k=k;
    document.querySelectorAll('#macc .msec').forEach(function(s){
      var on=!!c&&s.dataset.cat===c.id; s.classList.toggle('open',on);
      s.querySelector('.mh').setAttribute('aria-expanded',on?'true':'false'); s.querySelector('.mx').textContent=on?'x':'v';
      s.querySelectorAll('li.mi').forEach(function(li,i){
        var sel=on&&k===i; li.classList.toggle('cur',sel);
        if(sel){ if(!li.dataset.f)fillMob(li,c.items[i]); }
        else if(li.dataset.f){ setTimeout(function(){ if(!li.classList.contains('cur')){li.querySelector('.mmedia').innerHTML='';li.querySelector('.mtools').innerHTML='';delete li.dataset.f;} },520); }
      });
    });
    if(opened&&mq.matches){setTimeout(function(){var hd=document.querySelector('#macc .msec.open .mh'); if(hd)scrollTo({top:Math.max(0,hd.getBoundingClientRect().top+scrollY-96),behavior:rm?'auto':'smooth'});},520);}
  }
  function openMenu(){var m=$('mmenu'); m.classList.add('open'); m.setAttribute('aria-hidden','false'); $('burger').setAttribute('aria-expanded','true'); document.body.classList.add('menu'); $('mclose').focus();}
  function closeMenu(){var m=$('mmenu'); if(!m.classList.contains('open'))return; m.classList.remove('open'); m.setAttribute('aria-hidden','true'); $('burger').setAttribute('aria-expanded','false'); document.body.classList.remove('menu');}
  function applyWorks(r){
    try{mobState(r.c||null,(r.c&&!r.none)?r.k:null);}catch(err){console.error(err);}
    if(mq.matches){busy=false;return;}           /* en mobile no hay animación de columnas */
    busy=false;
    var kk=r.none?null:r.k;
    if(r.c){ if(ws.open&&ws.cat===r.c){fillOpen(r.c,kk);} else openState(r.c,kk); }
    else if(ws.open)closeState();
  }
  function setLang(l){
    L=l; var d=I[l]; document.documentElement.lang=l;
    document.querySelectorAll('[data-t]').forEach(function(e){e.innerHTML=d[e.dataset.t];});
    document.querySelectorAll('[data-a]').forEach(function(e){e.dataset.a.split(';').forEach(function(s){var p=s.split('|');e.setAttribute(p[0],d[p[1]]);});});
    document.querySelectorAll('[data-lang]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.lang===l?'true':'false');});
    window.MSGS=d.msgs; renderWorks(); renderMacc(); mobState(mob.c,mob.k);
    if(ws.open){var c=ws.cat,k=ws.k; ws.open=false; openState(c,k);}
    if(cur)document.title=title(parse());
    try{localStorage.setItem('lang',l);}catch(e){}
  }
  function setNav(v){
    document.querySelectorAll('[data-nav]').forEach(function(a){ if(NAV[v]===a.dataset.nav)a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  }
  function revealHome(){var m=$('media'); if(!m||rm)return; m.classList.remove('reveal'); void m.offsetWidth; m.classList.add('reveal');}
  function revealMe(){var m=document.querySelector('.me'); if(!m||rm)return; m.classList.remove('reveal'); void m.offsetWidth; m.classList.add('reveal');}
  function show(v){
    resetWorks();
    document.body.dataset.view=THEME[v];
    document.querySelectorAll('.view').forEach(function(s){s.hidden=(s.id!==SEC[v]);});
    scrollTo(0,0);
    if(v==='about')revealMe();
    if(v==='home'){revealHome(); if(vid&&!rm){var p=vid.play(); if(p&&p.catch)p.catch(function(){});}}
  }
  function route(first){
    closeMenu(); closeLB();
    var r=parse(); document.title=title(r);
    if(first||rm){cur=r.v;setNav(r.v);show(r.v);if(r.v==='works')applyWorks(r);return;}
    if(r.v===cur){if(r.v==='works')applyWorks(r);return;}   /* dentro de Proyectos: solo cambia el estado */
    var prev=cur; cur=r.v; setNav(r.v);
    if(document.startViewTransition&&WIPE[prev]&&WIPE[r.v]){      /* barrido circular suave desde el centro; el fondo se mezcla mientras se revela */
      clearTimeout(tm); document.body.classList.remove('leaving');
      document.startViewTransition(function(){var q=parse();show(q.v);if(q.v==='works')applyWorks(q);});
      return;
    }
    document.body.dataset.view=THEME[r.v];       /* el degradado empieza a mezclar sus colores */
    document.body.classList.add('leaving');      /* el contenido se desenfoca y desaparece */
    clearTimeout(tm);
    tm=setTimeout(function(){var q=parse();show(q.v);if(q.v==='works')applyWorks(q);document.body.classList.remove('leaving');},380);
  }
  function plain(e){return e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey;}
  function go(t){                                  /* si el hash ya es el mismo no hay hashchange: se fuerza la ruta */
    if(location.hash.slice(1)===t)route(false); else location.hash=t;
    setTimeout(function(){busy=false;},1200);
  }
  W.addEventListener('click',function(e){
    var a=e.target.closest('a'); if(!a||a.classList.contains('ext')||plain(e))return;
    var sec=a.closest('.cat'); if(!sec)return;
    var li=a.closest('li'), t=a.getAttribute('href').slice(1);
    if(a.classList.contains('cx')){                 /* "x": cierra la sección */
      e.preventDefault(); if(busy)return; busy=true;
      if(rm){go('proyectos');return;}
      W.classList.add('closing'); clearCur();
      setTimeout(function(){go('proyectos');},300); return;
    }
    if(W.dataset.state==='open'&&li&&li.classList.contains('cur')){   /* título del proyecto abierto: lo cierra y deja la sección desplegada */
      e.preventDefault(); if(busy)return; busy=true;
      var back='proyectos.'+ws.cat.id;
      if(rm){go(back);return;}
      W.classList.add('unproj'); clearCur();
      setTimeout(function(){go(back);},300); return;
    }
    if(W.dataset.state!=='open'){
      e.preventDefault(); if(busy)return; busy=true;
      if(rm){go(t);return;}
      animOpen(sec,t,li);
    }
  });
  /* Contacto */
  var cf=$('cform'), msg=$('message'), em=$('email'), snd=$('send'), stt=$('status');
  function upd(){
    var has=msg.value.trim().length>0;
    $('msgbox').classList.toggle('has',msg.value.length>0); $('ewrap').classList.toggle('open',has);
    snd.disabled=!(has&&em.value&&em.checkValidity());
  }
  msg.addEventListener('input',function(){msg.style.height='auto';msg.style.height=Math.min(msg.scrollHeight,innerHeight*0.4)+'px';upd();});
  em.addEventListener('input',upd);
  cf.addEventListener('submit',function(e){
    e.preventDefault();
    if(snd.disabled||cf.querySelector('.hp').value)return;
    var body={message:msg.value.trim(),email:em.value.trim()};
    if(FORM_ENDPOINT){
      snd.disabled=true;
      fetch(FORM_ENDPOINT,GS?{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)}:{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body)})
        .then(function(r){if(!GS&&!r.ok)throw new Error();stt.textContent=I[L].stOk;msg.value='';em.value='';msg.style.height='auto';upd();})
        .catch(function(){stt.textContent=I[L].stErr;upd();});
    }else{
      stt.textContent=I[L].stMail;
      location.href='mailto:'+MAIL_TO+'?subject='+encodeURIComponent('Contacto desde el portfolio')+'&body='+encodeURIComponent(body.message+'\n\n— '+body.email);
    }
  });
  $('mmenu').querySelector('.logo').innerHTML=document.querySelector('.nav .logo').innerHTML;
  $('burger').addEventListener('click',openMenu); $('mclose').addEventListener('click',closeMenu);
  $('mmenu').addEventListener('click',function(e){if(e.target.closest('.mlinks a,.logo'))closeMenu();});
  addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});
  $('macc').addEventListener('click',function(e){
    var pa=e.target.closest('li>a');
    if(pa&&pa.parentNode.classList.contains('cur')){e.preventDefault(); go('proyectos.'+pa.closest('.msec').dataset.cat); return;}   /* título del proyecto abierto: lo cierra */
    var hd=e.target.closest('.mh'); if(!hd)return;
    var sec=hd.parentNode; go(sec.classList.contains('open')?'proyectos':'proyectos.'+sec.dataset.cat);
  });
  function onMq(){closeMenu(); if(cur==='works'){resetWorks();applyWorks(parse());}}
  if(mq.addEventListener)mq.addEventListener('change',onMq); else if(mq.addListener)mq.addListener(onMq);
  /* Visor ampliado: clic en una imagen o video del proyecto -> se abre grande sobre un fondo desenfocado */
  var lb=document.createElement('div'); lb.className='lb'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true'); lb.setAttribute('aria-hidden','true');
  lb.innerHTML='<div class="lb-s" tabindex="-1"></div><button type="button" class="lb-x">x</button><button type="button" class="lb-p">&#8249;</button><button type="button" class="lb-n">&#8250;</button><div class="lb-c" aria-live="polite"></div>';
  document.body.appendChild(lb);
  var lbS=lb.querySelector('.lb-s'), lbC=lb.querySelector('.lb-c'), lbItems=[], lbI=0, lbBack=null, lbHeld=[], lbTm;
  function lbT(k){return ({es:{x:'Cerrar',p:'Anterior',n:'Siguiente'},en:{x:'Close',p:'Previous',n:'Next'}})[L][k];}
  function lbLabels(){lb.querySelector('.lb-x').setAttribute('aria-label',lbT('x'));lb.querySelector('.lb-p').setAttribute('aria-label',lbT('p'));lb.querySelector('.lb-n').setAttribute('aria-label',lbT('n'));}
  function lbShow(){
    var it=lbItems[lbI], m; clearTimeout(lbTm); lbS.className='lb-s'; lbS.innerHTML=''; lbS.scrollTop=0; lbS.scrollLeft=0;
    if(it.t==='v'){
      m=document.createElement('video'); m.src=it.src; m.controls=true; m.autoplay=true; m.muted=true; m.loop=true; m.playsInline=true;
      m.setAttribute('playsinline',''); m.setAttribute('controlslist','nofullscreen'); m.setAttribute('disablepictureinpicture','');
      lbS.className='lb-s c'; lbS.appendChild(m); m.addEventListener('loadedmetadata',lbFit); var p=m.play(); if(p&&p.catch)p.catch(function(){});
    }else{
      m=new Image(); m.alt=it.alt; m.decoding='async';
      var fit=function(){var r=m.naturalWidth/m.naturalHeight; if(!r)return; lbS.className='lb-s '+(r<0.6?'y':(r>2.4?'x':'c')); lbFit();};
      m.onload=fit; lbS.className='lb-s c'; lbS.appendChild(m); m.src=it.src; if(m.complete&&m.naturalWidth)fit();
    }
    lb.classList.toggle('multi',lbItems.length>1); lbC.textContent=(lbI+1)+' / '+lbItems.length;
  }
  function lbFit(){                                  /* ajusta la imagen o el video al espacio disponible, agrandándolo si es chico (hasta 3x) */
    var m=lbS.firstElementChild; if(!m||!lbS.classList.contains('c'))return;
    var w=m.naturalWidth||m.videoWidth, h=m.naturalHeight||m.videoHeight; if(!w||!h)return;
    var cs=getComputedStyle(lbS), aw=lbS.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight), ah=lbS.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
    var k=Math.min(aw/w,ah/h,3); m.style.width=Math.round(w*k)+'px'; m.style.height=Math.round(h*k)+'px';
  }
  addEventListener('resize',function(){lbFit();});
  function lbGo(d){if(lbItems.length<2)return; lbI=(lbI+d+lbItems.length)%lbItems.length; lbShow();}
  function openLB(el){
    var g=el.closest('.sc,.sl'), list=g?[].slice.call(g.querySelectorAll('img,video')):[el];
    lbItems=list.map(function(e){return {t:e.tagName==='VIDEO'?'v':'i',src:e.currentSrc||e.getAttribute('src'),alt:e.getAttribute('alt')||''};});
    lbI=Math.max(0,list.indexOf(el)); lbLabels();
    lbHeld=[].slice.call(document.querySelectorAll('.pmedia video,.mmedia video')).filter(function(v){return !v.paused;}); lbHeld.forEach(function(v){v.pause();});
    lbBack=document.activeElement; lbShow();
    lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); document.body.classList.add('lbo'); lb.querySelector('.lb-x').focus({preventScroll:true});
  }
  function closeLB(){
    if(!lb.classList.contains('open'))return;
    var v=lbS.querySelector('video'); if(v)v.pause();
    lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); document.body.classList.remove('lbo');
    lbHeld.forEach(function(x){var p=x.play(); if(p&&p.catch)p.catch(function(){});}); lbHeld=[];
    lbTm=setTimeout(function(){lbS.innerHTML='';},350);
    if(lbBack&&lbBack.focus)try{lbBack.focus({preventScroll:true});}catch(e){}
  }
  document.addEventListener('click',function(e){
    var el=e.target.closest('.pmedia img,.pmedia video,.mmedia img,.mmedia video'); if(!el||plain(e))return;
    e.preventDefault(); openLB(el);
  });
  lb.addEventListener('click',function(e){
    if(e.target===lb||e.target===lbS)closeLB();
    else if(e.target.closest('.lb-x'))closeLB();
    else if(e.target.closest('.lb-p'))lbGo(-1);
    else if(e.target.closest('.lb-n'))lbGo(1);
  });
  addEventListener('keydown',function(e){
    if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')closeLB(); else if(e.key==='ArrowLeft')lbGo(-1); else if(e.key==='ArrowRight')lbGo(1);
  });
  try{L=localStorage.getItem('lang')||'es';}catch(e){} if(!I[L])L='es';
  setLang(L);
  document.querySelectorAll('[data-lang]').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.lang);});});
  if(rm&&vid){vid.removeAttribute('autoplay');vid.pause();}
  addEventListener('hashchange',function(){route(false);}); route(true);
})();
