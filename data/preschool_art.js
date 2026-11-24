/**
 * 向日葵幼兒園｜著色本＋彩虹繪本（純向量 SVG，無外部素材、無版權疑慮）
 * 掛在幼兒園寫字帖引擎底下：topic = 'color'（著色本）／'story'（彩虹繪本）
 *   buildPages(cfg, lvl) → { pages, level, topicLabel, itemCount, totalPages, sheets }
 * 小班：粗線大圖形、一句話；中班：細節＋兩句話；大班：背景＋三句話。
 */
(function(){
  'use strict';
  var PAL={r:'#e53935',o:'#fb8c00',y:'#fdd835',g:'#43a047',b:'#1e88e5',i:'#3949ab',v:'#8e24aa',pk:'#f48fb1',br:'#8d6e63',lg:'#a5d6a7',sky:'#bbdefb',w:'#ffffff',gy:'#bdbdbd',lb:'#81d4fa',tn:'#ffcc80',dg:'#2e7d32',cr:'#fff3c4'};
  var RAINBOW=['r','o','y','g','b','i','v'];
  var COLOR_NAMES=['紅','橙','黃','綠','藍','靛','紫'];

  function mkCtx(colored, level){
    var sw = level==='small' ? 9 : (level==='mid' ? 6.5 : 4.8);
    var detail = level==='small' ? 0 : (level==='mid' ? 1 : 2);
    return {
      sw: sw, detail: detail,
      p: 'stroke="#222" stroke-width="'+sw+'" stroke-linejoin="round" stroke-linecap="round"',
      f: function(k){ return colored ? (PAL[k]||k) : '#fff'; }
    };
  }
  function cloud(x,y,s,c){
    return '<path transform="translate('+x+' '+y+') scale('+s+')" d="M-70 20 Q-112 20 -106 -16 Q-100 -52 -60 -46 Q-50 -92 0 -86 Q52 -86 56 -44 Q102 -50 106 -10 Q112 20 70 20 Z" fill="'+c.f('w')+'" '+c.p+'/>';
  }
  function starPath(cx,cy,R,r){
    var pts=[];for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rr=i%2?r:R;pts.push((cx+Math.cos(a)*rr).toFixed(1)+' '+(cy+Math.sin(a)*rr).toFixed(1));}
    return 'M'+pts.join(' L')+' Z';
  }

  // ===== 圖庫：每個圖形都畫在 600×600 的畫布裡 =====
  var SUB={
    sun:{name:'太陽',draw:function(c){
      var s='';
      for(var i=0;i<12;i++){var a=i*30*Math.PI/180;
        var x1=300+Math.cos(a-0.14)*172,y1=300+Math.sin(a-0.14)*172,x2=300+Math.cos(a+0.14)*172,y2=300+Math.sin(a+0.14)*172,x3=300+Math.cos(a)*270,y3=300+Math.sin(a)*270;
        s+='<path d="M'+x1.toFixed(1)+' '+y1.toFixed(1)+' L'+x3.toFixed(1)+' '+y3.toFixed(1)+' L'+x2.toFixed(1)+' '+y2.toFixed(1)+' Z" fill="'+c.f('o')+'" '+c.p+'/>';}
      s+='<circle cx="300" cy="300" r="168" fill="'+c.f('y')+'" '+c.p+'/>';
      s+='<circle cx="245" cy="272" r="17" fill="#222"/><circle cx="355" cy="272" r="17" fill="#222"/>';
      s+='<path d="M232 335 Q300 410 368 335" fill="none" '+c.p+'/>';
      if(c.detail>=1) s+='<circle cx="210" cy="320" r="22" fill="'+c.f('pk')+'" '+c.p+'/><circle cx="390" cy="320" r="22" fill="'+c.f('pk')+'" '+c.p+'/>';
      return s;}},
    rainbow:{name:'彩虹',draw:function(c){
      var s='',cx=300,cy=430;
      for(var k=0;k<7;k++){var ro=285-k*34,ri=ro-34;
        s+='<path d="M'+(cx-ro)+' '+cy+' A'+ro+' '+ro+' 0 0 1 '+(cx+ro)+' '+cy+' L'+(cx+ri)+' '+cy+' A'+ri+' '+ri+' 0 0 0 '+(cx-ri)+' '+cy+' Z" fill="'+c.f(RAINBOW[k])+'" '+c.p+'/>';}
      s+=cloud(95,455,0.85,c)+cloud(505,455,0.85,c);
      return s;}},
    flower:{name:'花朵',draw:function(c){
      var s='<path d="M296 360 Q285 470 300 560 L318 560 Q312 470 322 360 Z" fill="'+c.f('g')+'" '+c.p+'/>';
      s+='<path d="M300 500 Q220 440 170 470 Q220 540 300 520 Z" fill="'+c.f('g')+'" '+c.p+'/><path d="M312 470 Q390 400 440 430 Q392 500 312 490 Z" fill="'+c.f('g')+'" '+c.p+'/>';
      var n=c.detail>=2?8:6;
      for(var i=0;i<n;i++){var a=i*360/n;
        s+='<ellipse cx="300" cy="150" rx="52" ry="82" transform="rotate('+a+' 300 250)" fill="'+c.f(i%2?'pk':'r')+'" '+c.p+'/>';}
      s+='<circle cx="300" cy="250" r="62" fill="'+c.f('y')+'" '+c.p+'/>';
      if(c.detail>=1) s+='<circle cx="282" cy="240" r="7" fill="#222"/><circle cx="318" cy="240" r="7" fill="#222"/><path d="M280 268 Q300 288 320 268" fill="none" '+c.p+'/>';
      return s;}},
    butterfly:{name:'蝴蝶',draw:function(c){
      var s='<path d="M290 270 Q120 60 70 200 Q40 330 290 300 Z" fill="'+c.f('o')+'" '+c.p+'/>';
      s+='<path d="M310 270 Q480 60 530 200 Q560 330 310 300 Z" fill="'+c.f('o')+'" '+c.p+'/>';
      s+='<path d="M290 310 Q130 330 110 440 Q130 540 290 360 Z" fill="'+c.f('v')+'" '+c.p+'/>';
      s+='<path d="M310 310 Q470 330 490 440 Q470 540 310 360 Z" fill="'+c.f('v')+'" '+c.p+'/>';
      if(c.detail>=1){s+='<circle cx="170" cy="210" r="30" fill="'+c.f('y')+'" '+c.p+'/><circle cx="430" cy="210" r="30" fill="'+c.f('y')+'" '+c.p+'/><circle cx="175" cy="430" r="22" fill="'+c.f('pk')+'" '+c.p+'/><circle cx="425" cy="430" r="22" fill="'+c.f('pk')+'" '+c.p+'/>';}
      s+='<ellipse cx="300" cy="330" rx="26" ry="120" fill="'+c.f('br')+'" '+c.p+'/>';
      s+='<circle cx="300" cy="190" r="30" fill="'+c.f('br')+'" '+c.p+'/>';
      s+='<path d="M288 168 Q250 110 215 118 M312 168 Q350 110 385 118" fill="none" '+c.p+'/>';
      s+='<circle cx="290" cy="186" r="5" fill="#fff"/><circle cx="310" cy="186" r="5" fill="#fff"/>';
      return s;}},
    fish:{name:'小魚',draw:function(c){
      var s='<path d="M110 300 Q250 130 420 300 Q250 470 110 300 Z" fill="'+c.f('o')+'" '+c.p+'/>';
      s+='<path d="M408 300 L530 205 Q515 300 530 395 Z" fill="'+c.f('y')+'" '+c.p+'/>';
      s+='<path d="M240 190 Q280 120 330 200 Z" fill="'+c.f('y')+'" '+c.p+'/><path d="M240 410 Q280 480 330 400 Z" fill="'+c.f('y')+'" '+c.p+'/>';
      s+='<circle cx="190" cy="270" r="22" fill="#fff" '+c.p+'/><circle cx="184" cy="270" r="9" fill="#222"/>';
      s+='<path d="M120 310 Q150 330 170 318" fill="none" '+c.p+'/>';
      if(c.detail>=1){s+='<path d="M270 250 Q295 275 270 300 M320 245 Q345 275 320 305 M370 262 Q388 280 370 298" fill="none" '+c.p+'/>';}
      s+='<circle cx="95" cy="190" r="22" fill="'+c.f('lb')+'" '+c.p+'/><circle cx="62" cy="130" r="14" fill="'+c.f('lb')+'" '+c.p+'/>';
      return s;}},
    house:{name:'房子',draw:function(c){
      var s='<rect x="390" y="150" width="56" height="130" fill="'+c.f('r')+'" '+c.p+'/>';
      s+='<rect x="140" y="270" width="320" height="260" fill="'+c.f('cr')+'" '+c.p+'/>';
      s+='<path d="M105 280 L300 110 L495 280 Z" fill="'+c.f('r')+'" '+c.p+'/>';
      s+='<rect x="262" y="390" width="78" height="140" rx="6" fill="'+c.f('br')+'" '+c.p+'/><circle cx="326" cy="462" r="6" fill="#222"/>';
      s+='<rect x="170" y="330" width="80" height="80" fill="'+c.f('lb')+'" '+c.p+'/><path d="M210 330 V410 M170 370 H250" fill="none" '+c.p+'/>';
      s+='<rect x="350" y="330" width="80" height="80" fill="'+c.f('lb')+'" '+c.p+'/><path d="M390 330 V410 M350 370 H430" fill="none" '+c.p+'/>';
      if(c.detail>=2) s+='<circle cx="300" cy="215" r="28" fill="'+c.f('lb')+'" '+c.p+'/>';
      s+='<path d="M60 530 H540" fill="none" '+c.p+'/>';
      return s;}},
    tree:{name:'大樹',draw:function(c){
      var s='<path d="M265 300 Q275 450 250 560 L350 560 Q325 450 335 300 Z" fill="'+c.f('br')+'" '+c.p+'/>';
      s+='<path d="M150 330 Q70 335 78 255 Q88 190 160 195 Q165 105 255 98 Q340 92 372 160 Q460 150 482 230 Q508 330 430 336 Z" fill="'+c.f('g')+'" '+c.p+'/>';
      var ap=[[200,250],[320,200],[410,270],[270,300]];
      for(var i=0;i<(c.detail>=1?4:2);i++) s+='<circle cx="'+ap[i][0]+'" cy="'+ap[i][1]+'" r="'+(c.detail>=1?22:28)+'" fill="'+c.f('r')+'" '+c.p+'/>';
      s+='<path d="M170 560 H430" fill="none" '+c.p+'/>';
      return s;}},
    car:{name:'汽車',draw:function(c){
      var s='<path d="M60 380 Q60 330 110 325 L190 325 Q215 230 290 225 L400 225 Q460 230 490 325 L520 335 Q550 345 550 395 L550 430 L60 430 Z" fill="'+c.f('r')+'" '+c.p+'/>';
      s+='<path d="M215 320 Q232 258 285 255 L305 255 L305 320 Z" fill="'+c.f('lb')+'" '+c.p+'/><path d="M335 255 L395 255 Q438 262 458 320 L335 320 Z" fill="'+c.f('lb')+'" '+c.p+'/>';
      s+='<circle cx="170" cy="440" r="56" fill="'+c.f('gy')+'" '+c.p+'/><circle cx="170" cy="440" r="22" fill="'+c.f('w')+'" '+c.p+'/>';
      s+='<circle cx="440" cy="440" r="56" fill="'+c.f('gy')+'" '+c.p+'/><circle cx="440" cy="440" r="22" fill="'+c.f('w')+'" '+c.p+'/>';
      s+='<circle cx="528" cy="372" r="18" fill="'+c.f('y')+'" '+c.p+'/>';
      if(c.detail>=1) s+='<path d="M85 385 H520" fill="none" '+c.p+'/>';
      return s;}},
    star:{name:'星星',draw:function(c){
      var s='<path d="'+starPath(300,310,250,105)+'" fill="'+c.f('y')+'" '+c.p+'/>';
      s+='<circle cx="258" cy="305" r="14" fill="#222"/><circle cx="342" cy="305" r="14" fill="#222"/><path d="M262 352 Q300 392 338 352" fill="none" '+c.p+'/>';
      if(c.detail>=1) s+='<path d="'+starPath(95,95,55,24)+'" fill="'+c.f('o')+'" '+c.p+'/><path d="'+starPath(510,520,50,22)+'" fill="'+c.f('pk')+'" '+c.p+'/>';
      return s;}},
    cat:{name:'小貓',draw:function(c){
      var s='<path d="M140 250 L130 90 L255 170 Z" fill="'+c.f('o')+'" '+c.p+'/><path d="M460 250 L470 90 L345 170 Z" fill="'+c.f('o')+'" '+c.p+'/>';
      s+='<ellipse cx="300" cy="320" rx="190" ry="165" fill="'+c.f('o')+'" '+c.p+'/>';
      s+='<ellipse cx="225" cy="295" rx="24" ry="30" fill="#fff" '+c.p+'/><circle cx="228" cy="300" r="12" fill="#222"/><ellipse cx="375" cy="295" rx="24" ry="30" fill="#fff" '+c.p+'/><circle cx="372" cy="300" r="12" fill="#222"/>';
      s+='<path d="M280 350 L320 350 L300 378 Z" fill="'+c.f('pk')+'" '+c.p+'/><path d="M300 378 V400 M300 400 Q270 430 240 405 M300 400 Q330 430 360 405" fill="none" '+c.p+'/>';
      s+='<path d="M95 340 L190 355 M95 390 L190 378 M505 340 L410 355 M505 390 L410 378" fill="none" '+c.p+'/>';
      if(c.detail>=1) s+='<path d="M270 160 V210 M300 150 V205 M330 160 V210" fill="none" '+c.p+'/>';
      return s;}},
    bear:{name:'小熊',draw:function(c){
      var s='<circle cx="150" cy="150" r="75" fill="'+c.f('br')+'" '+c.p+'/><circle cx="450" cy="150" r="75" fill="'+c.f('br')+'" '+c.p+'/>';
      s+='<circle cx="150" cy="150" r="36" fill="'+c.f('tn')+'" '+c.p+'/><circle cx="450" cy="150" r="36" fill="'+c.f('tn')+'" '+c.p+'/>';
      s+='<circle cx="300" cy="320" r="215" fill="'+c.f('br')+'" '+c.p+'/>';
      s+='<ellipse cx="300" cy="385" rx="100" ry="78" fill="'+c.f('tn')+'" '+c.p+'/>';
      s+='<ellipse cx="300" cy="352" rx="34" ry="24" fill="#222"/>';
      s+='<path d="M300 376 V415 M300 415 Q265 445 235 418 M300 415 Q335 445 365 418" fill="none" '+c.p+'/>';
      s+='<circle cx="225" cy="278" r="20" fill="#222"/><circle cx="375" cy="278" r="20" fill="#222"/>';
      if(c.detail>=1) s+='<circle cx="170" cy="345" r="26" fill="'+c.f('pk')+'" '+c.p+'/><circle cx="430" cy="345" r="26" fill="'+c.f('pk')+'" '+c.p+'/>';
      return s;}},
    chick:{name:'小雞',draw:function(c){
      var s='<path d="M255 520 V560 M255 560 L225 565 M255 560 L285 565 M345 520 V560 M345 560 L315 565 M345 560 L375 565" fill="none" '+c.p+'/>';
      s+='<circle cx="300" cy="360" r="170" fill="'+c.f('y')+'" '+c.p+'/>';
      s+='<path d="M275 195 Q255 120 290 110 Q300 150 315 112 Q345 125 325 195" fill="'+c.f('y')+'" '+c.p+'/>';
      s+='<ellipse cx="150" cy="380" rx="45" ry="75" transform="rotate(20 150 380)" fill="'+c.f('o')+'" '+c.p+'/><ellipse cx="450" cy="380" rx="45" ry="75" transform="rotate(-20 450 380)" fill="'+c.f('o')+'" '+c.p+'/>';
      s+='<circle cx="240" cy="320" r="18" fill="#222"/><circle cx="360" cy="320" r="18" fill="#222"/>';
      s+='<path d="M270 365 L330 365 L300 410 Z" fill="'+c.f('o')+'" '+c.p+'/>';
      if(c.detail>=1) s+='<circle cx="195" cy="375" r="22" fill="'+c.f('pk')+'" '+c.p+'/><circle cx="405" cy="375" r="22" fill="'+c.f('pk')+'" '+c.p+'/>';
      return s;}},
    snail:{name:'蝸牛',draw:function(c){
      var s='<path d="M70 480 Q70 420 140 420 L430 420 Q520 420 520 480 Q520 530 440 530 L110 530 Q70 530 70 480 Z" fill="'+c.f('tn')+'" '+c.p+'/>';
      s+='<path d="M95 440 Q85 360 120 330" fill="none" '+c.p+'/><circle cx="125" cy="322" r="17" fill="'+c.f('w')+'" '+c.p+'/><circle cx="125" cy="322" r="6" fill="#222"/>';
      s+='<path d="M140 440 Q150 360 180 340" fill="none" '+c.p+'/><circle cx="185" cy="333" r="17" fill="'+c.f('w')+'" '+c.p+'/><circle cx="185" cy="333" r="6" fill="#222"/>';
      s+='<circle cx="330" cy="300" r="150" fill="'+c.f('v')+'" '+c.p+'/><circle cx="330" cy="300" r="105" fill="'+c.f('pk')+'" '+c.p+'/><circle cx="330" cy="300" r="62" fill="'+c.f('y')+'" '+c.p+'/><circle cx="330" cy="300" r="22" fill="'+c.f('o')+'" '+c.p+'/>';
      s+='<path d="M95 500 Q118 520 145 498" fill="none" '+c.p+'/>';
      return s;}},
    balloon:{name:'氣球',draw:function(c){
      var s='',cols=['r','y','b'],xs=[170,300,430],ys=[230,190,235];
      for(var i=0;i<3;i++){
        s+='<path d="M'+xs[i]+' '+(ys[i]+110)+' Q'+(xs[i]+(i-1)*25)+' '+(ys[i]+330)+' '+(300+(i-1)*35)+' 580" fill="none" '+c.p+'/>';
        s+='<ellipse cx="'+xs[i]+'" cy="'+ys[i]+'" rx="105" ry="125" fill="'+c.f(cols[i])+'" '+c.p+'/>';
        s+='<path d="M'+(xs[i]-18)+' '+(ys[i]+138)+' L'+(xs[i]+18)+' '+(ys[i]+138)+' L'+xs[i]+' '+(ys[i]+112)+' Z" fill="'+c.f(cols[i])+'" '+c.p+'/>';
        if(c.detail>=1) s+='<path d="M'+(xs[i]-60)+' '+(ys[i]-45)+' Q'+(xs[i]-75)+' '+(ys[i]-5)+' '+(xs[i]-60)+' '+(ys[i]+25)+'" fill="none" '+c.p+'/>';
      }
      return s;}},
    apple:{name:'蘋果',draw:function(c){
      var s='<path d="M300 200 Q150 110 90 260 Q60 420 190 520 Q250 565 300 530 Q350 565 410 520 Q540 420 510 260 Q450 110 300 200 Z" fill="'+c.f('r')+'" '+c.p+'/>';
      s+='<path d="M300 200 Q295 130 330 80" fill="none" '+c.p+'/>';
      s+='<path d="M335 135 Q420 70 480 120 Q420 185 335 150 Z" fill="'+c.f('g')+'" '+c.p+'/>';
      s+='<path d="M170 290 Q150 340 175 400" fill="none" '+c.p+'/>';
      if(c.detail>=1) s+='<circle cx="245" cy="340" r="14" fill="#222"/><circle cx="355" cy="340" r="14" fill="#222"/><path d="M255 410 Q300 450 345 410" fill="none" '+c.p+'/>';
      return s;}},
    umbrella:{name:'雨傘',draw:function(c){
      var s='<path d="M300 300 V500 Q300 560 250 555 Q215 550 222 515" fill="none" '+c.p+'/>';
      s+='<path d="M50 330 Q60 100 300 90 Q540 100 550 330 Q510 290 470 330 Q425 290 385 330 Q342 290 300 330 Q258 290 215 330 Q172 290 130 330 Q90 290 50 330 Z" fill="'+c.f('r')+'" '+c.p+'/>';
      s+='<path d="M300 90 Q230 200 215 330 M300 90 Q370 200 385 330" fill="none" '+c.p+'/>';
      if(c.detail>=1) s+='<circle cx="300" cy="70" r="16" fill="'+c.f('y')+'" '+c.p+'/>';
      return s;}},
    icecream:{name:'冰淇淋',draw:function(c){
      var s='<path d="M175 330 L300 575 L425 330 Z" fill="'+c.f('tn')+'" '+c.p+'/><path d="M205 392 L395 392 M235 452 L365 452 M262 345 L340 500 M338 345 L260 500" fill="none" '+c.p+'/>';
      s+='<circle cx="300" cy="260" r="125" fill="'+c.f('pk')+'" '+c.p+'/>';
      s+='<circle cx="300" cy="150" r="95" fill="'+c.f('cr')+'" '+c.p+'/>';
      s+='<circle cx="300" cy="62" r="24" fill="'+c.f('r')+'" '+c.p+'/><path d="M300 40 Q315 15 340 18" fill="none" '+c.p+'/>';
      if(c.detail>=1) s+='<circle cx="255" cy="225" r="9" fill="'+c.f('b')+'" '+c.p+'/><circle cx="345" cy="270" r="9" fill="'+c.f('y')+'" '+c.p+'/><circle cx="285" cy="300" r="9" fill="'+c.f('g')+'" '+c.p+'/>';
      return s;}},
    rocket:{name:'火箭',draw:function(c){
      var s='<path d="M260 470 Q300 600 340 470 Z" fill="'+c.f('o')+'" '+c.p+'/>';
      s+='<path d="M300 40 Q410 150 400 330 L400 470 L200 470 L200 330 Q190 150 300 40 Z" fill="'+c.f('gy')+'" '+c.p+'/>';
      s+='<path d="M200 380 L110 500 L200 470 Z" fill="'+c.f('r')+'" '+c.p+'/><path d="M400 380 L490 500 L400 470 Z" fill="'+c.f('r')+'" '+c.p+'/>';
      s+='<circle cx="300" cy="230" r="58" fill="'+c.f('lb')+'" '+c.p+'/>';
      if(c.detail>=1) s+='<path d="M300 40 Q350 90 385 160 L215 160 Q250 90 300 40 Z" fill="'+c.f('r')+'" '+c.p+'/>';
      return s;}},
    turtle:{name:'烏龜',draw:function(c){
      var s='<ellipse cx="320" cy="340" rx="215" ry="155" fill="'+c.f('g')+'" '+c.p+'/>';
      s+='<path d="M230 260 L320 215 L410 260 L410 350 L320 395 L230 350 Z" fill="'+c.f('lg')+'" '+c.p+'/>';
      s+='<ellipse cx="108" cy="305" rx="58" ry="50" fill="'+c.f('lg')+'" '+c.p+'/><circle cx="92" cy="292" r="9" fill="#222"/><path d="M70 322 Q92 338 112 322" fill="none" '+c.p+'/>';
      s+='<ellipse cx="190" cy="480" rx="42" ry="30" fill="'+c.f('lg')+'" '+c.p+'/><ellipse cx="440" cy="480" rx="42" ry="30" fill="'+c.f('lg')+'" '+c.p+'/>';
      s+='<path d="M530 350 L585 372 L532 392 Z" fill="'+c.f('lg')+'" '+c.p+'/>';
      if(c.detail>=1) s+='<path d="M230 260 L180 215 M410 260 L460 215 M410 350 L470 395 M230 350 L172 395" fill="none" '+c.p+'/>';
      return s;}}
  };

  // ===== 擴充 90+ 組純黑白兒童著色圖形（共 109+ 種，隨機搭配不重複）=====
  (function(){
    function cc(c,x,y,r){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c.f('w')+'" '+c.p+'/>';}
    function el(c,x,y,rx,ry,rot){return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'"'+(rot?' transform="rotate('+rot+' '+x+' '+y+')"':'')+' fill="'+c.f('w')+'" '+c.p+'/>';}
    function rc(c,x,y,w,h,rx){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx||0)+'" fill="'+c.f('w')+'" '+c.p+'/>';}
    function pt(c,d,fill){return '<path d="'+d+'" fill="'+(fill==='none'?'none':c.f('w'))+'" '+c.p+'/>';}
    function face(c,lx,rx,y,my){return '<circle cx="'+lx+'" cy="'+y+'" r="12" fill="#222"/><circle cx="'+rx+'" cy="'+y+'" r="12" fill="#222"/><path d="M'+(lx+12)+' '+my+' Q'+((lx+rx)/2)+' '+(my+36)+' '+(rx-12)+' '+my+'" fill="none" '+c.p+'/>';}
    function regPoly(cx,cy,R,n,rot){var pts=[];for(var i=0;i<n;i++){var a=(rot||-90)*Math.PI/180+i*2*Math.PI/n;pts.push((cx+Math.cos(a)*R).toFixed(1)+' '+(cy+Math.sin(a)*R).toFixed(1));}return 'M'+pts.join(' L')+' Z';}

    var EXTRA = {
      dog:{name:'小狗',draw:function(c){return el(c,150,260,55,110,18)+el(c,450,260,55,110,-18)+cc(c,300,300,165)+el(c,300,360,82,58)+el(c,300,335,28,18)+'<circle cx="240" cy="260" r="14" fill="#222"/><circle cx="360" cy="260" r="14" fill="#222"/>'+pt(c,'M300 353 V385 M270 385 Q300 412 330 385','none');}},
      rabbit:{name:'兔子',draw:function(c){return el(c,220,145,44,115,-8)+el(c,380,145,44,115,8)+el(c,220,150,20,75,-8)+el(c,380,150,20,75,8)+cc(c,300,365,165)+face(c,240,360,340,395)+pt(c,'M285 370 L315 370 L300 390 Z');}},
      panda:{name:'熊貓',draw:function(c){return '<circle cx="155" cy="160" r="62" fill="#222"/><circle cx="445" cy="160" r="62" fill="#222"/>'+cc(c,300,320,195)+'<ellipse cx="225" cy="290" rx="44" ry="54" transform="rotate(-18 225 290)" fill="#222"/><ellipse cx="375" cy="290" rx="44" ry="54" transform="rotate(18 375 290)" fill="#222"/><circle cx="228" cy="288" r="14" fill="#fff"/><circle cx="372" cy="288" r="14" fill="#fff"/>'+pt(c,'M278 365 L322 365 L300 390 Z')+pt(c,'M300 390 V420 M265 425 Q300 450 335 425','none');}},
      frog:{name:'青蛙',draw:function(c){return cc(c,195,180,62)+cc(c,405,180,62)+el(c,300,350,210,155)+'<circle cx="195" cy="180" r="24" fill="#222"/><circle cx="405" cy="180" r="24" fill="#222"/>'+pt(c,'M165 365 Q300 465 435 365','none')+cc(c,210,330,18)+cc(c,390,330,18);}},
      duck:{name:'小鴨',draw:function(c){return el(c,330,390,170,125)+cc(c,220,210,95)+pt(c,'M100 220 Q150 200 165 240 Q120 265 100 220 Z')+pt(c,'M270 370 Q360 320 430 385 Q340 445 270 370 Z')+'<circle cx="195" cy="195" r="13" fill="#222"/>'+pt(c,'M290 512 V560 M360 512 V560 M260 560 H315 M330 560 H385','none');}},
      owl:{name:'貓頭鷹',draw:function(c){return el(c,300,330,175,195)+pt(c,'M155 180 L195 105 L245 155 Z M445 180 L405 105 L355 155 Z')+cc(c,230,260,58)+cc(c,370,260,58)+'<circle cx="230" cy="260" r="20" fill="#222"/><circle cx="370" cy="260" r="20" fill="#222"/>'+pt(c,'M280 305 L320 305 L300 345 Z')+el(c,300,435,95,70);}},
      penguin:{name:'企鵝',draw:function(c){return el(c,300,320,175,215)+el(c,300,360,120,155)+pt(c,'M130 270 Q70 340 120 420 Q155 370 155 310 Z M470 270 Q530 340 480 420 Q445 370 445 310 Z')+cc(c,240,210,20)+cc(c,360,210,20)+'<circle cx="240" cy="210" r="9" fill="#222"/><circle cx="360" cy="210" r="9" fill="#222"/>'+pt(c,'M270 245 L330 245 L300 285 Z')+el(c,230,540,42,20)+el(c,370,540,42,20);}},
      elephant:{name:'大象',draw:function(c){return el(c,125,290,85,125)+el(c,475,290,85,125)+cc(c,300,280,145)+pt(c,'M275 340 Q275 495 360 495 Q405 495 405 445 Q405 415 375 425 Q350 435 345 450 Q320 450 320 340 Z')+'<circle cx="240" cy="250" r="14" fill="#222"/><circle cx="360" cy="250" r="14" fill="#222"/>';}},
      lion:{name:'獅子',draw:function(c){var s='';for(var i=0;i<12;i++){var a=i*30*Math.PI/180;s+=cc(c,(300+Math.cos(a)*185).toFixed(1),(300+Math.sin(a)*185).toFixed(1),54);}return s+cc(c,300,300,155)+face(c,245,355,270,335)+pt(c,'M280 310 L320 310 L300 335 Z');}},
      pig:{name:'小豬',draw:function(c){return pt(c,'M140 210 L125 95 L235 160 Z M460 210 L475 95 L365 160 Z')+cc(c,300,320,185)+el(c,300,360,72,52)+el(c,278,360,12,18)+el(c,322,360,12,18)+'<circle cx="225" cy="270" r="14" fill="#222"/><circle cx="375" cy="270" r="14" fill="#222"/>';}},
      cow:{name:'乳牛',draw:function(c){return pt(c,'M190 140 Q150 90 180 75 Q215 100 225 145 Z M410 140 Q450 90 420 75 Q385 100 375 145 Z')+el(c,125,215,58,30,-20)+el(c,475,215,58,30,20)+el(c,300,300,165,175)+el(c,300,395,120,75)+'<circle cx="235" cy="260" r="14" fill="#222"/><circle cx="365" cy="260" r="14" fill="#222"/>'+cc(c,260,390,14)+cc(c,340,390,14);}},
      sheep:{name:'綿羊',draw:function(c){var s='';for(var i=0;i<10;i++){var a=i*36*Math.PI/180;s+=cc(c,(300+Math.cos(a)*155).toFixed(1),(300+Math.sin(a)*155).toFixed(1),68);}return s+el(c,300,315,125,135)+cc(c,300,205,58)+face(c,255,345,305,365);}},
      monkey:{name:'猴子',draw:function(c){return cc(c,115,290,56)+cc(c,485,290,56)+cc(c,300,300,170)+el(c,300,350,125,90)+cc(c,250,255,44)+cc(c,350,255,44)+'<circle cx="250" cy="255" r="14" fill="#222"/><circle cx="350" cy="255" r="14" fill="#222"/>'+pt(c,'M240 365 Q300 415 360 365','none');}},
      fox:{name:'狐狸',draw:function(c){return pt(c,'M140 240 L120 70 L250 175 Z M460 240 L480 70 L350 175 Z')+pt(c,'M110 270 Q300 130 490 270 L300 490 Z')+'<circle cx="235" cy="295" r="14" fill="#222"/><circle cx="365" cy="295" r="14" fill="#222"/><circle cx="300" cy="465" r="22" fill="#222"/>';}},
      koala:{name:'無尾熊',draw:function(c){return cc(c,125,250,82)+cc(c,475,250,82)+cc(c,125,250,42)+cc(c,475,250,42)+cc(c,300,320,165)+el(c,300,335,34,54)+'<circle cx="230" cy="285" r="14" fill="#222"/><circle cx="370" cy="285" r="14" fill="#222"/>'+pt(c,'M265 405 Q300 432 335 405','none');}},
      mouse:{name:'小老鼠',draw:function(c){return cc(c,165,175,88)+cc(c,435,175,88)+cc(c,300,340,145)+'<circle cx="250" cy="310" r="13" fill="#222"/><circle cx="350" cy="310" r="13" fill="#222"/><circle cx="300" cy="375" r="20" fill="#222"/>'+pt(c,'M110 365 L210 380 M110 405 L210 395 M490 365 L390 380 M490 405 L390 395','none');}},
      chicken:{name:'公雞',draw:function(c){return pt(c,'M240 165 Q230 95 275 110 Q295 70 325 110 Q365 95 360 165 Z')+cc(c,300,310,155)+pt(c,'M145 305 L80 330 L145 355 Z')+cc(c,245,275,18)+'<circle cx="242" cy="275" r="8" fill="#222"/>'+el(c,215,385,22,38);}},
      swan:{name:'天鵝',draw:function(c){return el(c,340,420,185,95)+pt(c,'M200 420 Q160 250 215 155 Q245 110 275 145 Q290 175 265 200 Q235 230 255 370')+pt(c,'M275 155 L325 170 L275 185 Z')+'<circle cx="248" cy="155" r="9" fill="#222"/>'+pt(c,'M80 515 Q190 495 300 515 T520 515','none');}},
      hedgehog:{name:'刺蝟',draw:function(c){var s='';for(var i=0;i<9;i++){var a=(-160+i*22)*Math.PI/180;s+=pt(c,'M'+(320+Math.cos(a)*155).toFixed(1)+' '+(360+Math.sin(a)*155).toFixed(1)+' L'+(320+Math.cos(a)*235).toFixed(1)+' '+(360+Math.sin(a)*235).toFixed(1)+' L'+(320+Math.cos(a+0.25)*155).toFixed(1)+' '+(360+Math.sin(a+0.25)*155).toFixed(1)+' Z');}return s+el(c,280,385,195,135)+'<circle cx="165" cy="365" r="12" fill="#222"/><circle cx="88" cy="395" r="18" fill="#222"/>';}},
      deer:{name:'小鹿',draw:function(c){return pt(c,'M225 185 L185 75 M205 130 L155 115 M375 185 L415 75 M395 130 L445 115','none')+el(c,165,245,55,26,-25)+el(c,435,245,55,26,25)+el(c,300,320,130,155)+face(c,245,355,290,365)+'<circle cx="300" cy="355" r="18" fill="#222"/>';}},
      tiger:{name:'老虎',draw:function(c){return cc(c,165,165,55)+cc(c,435,165,55)+cc(c,300,320,185)+pt(c,'M300 135 V205 M260 150 V195 M340 150 V195 M120 310 H175 M125 350 H175 M480 310 H425 M475 350 H425','none')+face(c,235,365,295,365)+pt(c,'M280 340 L320 340 L300 365 Z');}},
      hippo:{name:'河馬',draw:function(c){return cc(c,190,170,38)+cc(c,410,170,38)+cc(c,300,290,165)+el(c,300,395,185,110)+cc(c,245,375,18)+cc(c,355,375,18)+'<circle cx="235" cy="245" r="14" fill="#222"/><circle cx="365" cy="245" r="14" fill="#222"/>';}},
      whale:{name:'鯨魚',draw:function(c){return pt(c,'M275 185 Q240 100 185 110 M295 185 Q330 100 385 110','none')+el(c,275,350,195,145)+pt(c,'M450 350 L555 265 Q535 350 555 435 Z')+'<circle cx="170" cy="330" r="14" fill="#222"/>'+pt(c,'M100 410 Q165 445 230 415','none');}},
      octopus:{name:'章魚',draw:function(c){var s='';for(var i=0;i<6;i++){var x=115+i*74;s+=pt(c,'M'+x+' 340 Q'+(x-25)+' 450 '+(x+10)+' 530 Q'+(x+35)+' 545 '+(x+42)+' 515 Q'+(x+20)+' 445 '+(x+38)+' 340 Z');}return s+cc(c,300,240,145)+face(c,245,355,225,275);}},
      crab:{name:'螃蟹',draw:function(c){return pt(c,'M185 190 L215 265 M415 190 L385 265','none')+pt(c,'M160 220 Q95 130 150 90 Q190 130 175 185 Q215 140 225 185 Z M440 220 Q505 130 450 90 Q410 130 425 185 Q385 140 375 185 Z')+el(c,300,350,175,120)+pt(c,'M135 340 L70 310 M130 385 L65 395 M145 430 L85 470 M465 340 L530 310 M470 385 L535 395 M455 430 L515 470','none')+face(c,245,355,320,375);}},
      jellyfish:{name:'水母',draw:function(c){var s='';for(var i=0;i<5;i++){var x=165+i*67;s+=pt(c,'M'+x+' 310 Q'+(x-28)+' 410 '+x+' 485 T'+x+' 555','none');}return s+pt(c,'M115 310 A185 185 0 0 1 485 310 Z')+cc(c,220,220,26)+cc(c,340,185,32)+cc(c,405,245,20);}},
      seahorse:{name:'海馬',draw:function(c){return pt(c,'M280 95 Q385 95 385 190 Q385 260 340 310 Q395 390 340 490 Q285 555 225 510 Q195 480 235 450 Q275 430 285 470 M280 95 Q225 95 210 155 L145 170 L205 205 Q220 265 260 295 Q215 370 250 450')+'<circle cx="255" cy="145" r="11" fill="#222"/>';}},
      starfish:{name:'海星',draw:function(c){return pt(c,starPath(300,305,235,98))+face(c,255,345,285,330)+cc(c,300,190,14)+cc(c,200,265,14)+cc(c,400,265,14);}},
      shell:{name:'貝殼',draw:function(c){return pt(c,'M90 360 Q90 120 300 120 Q510 120 510 360 L410 475 H190 Z')+rc(c,210,475,180,46,12)+pt(c,'M300 120 V475 M200 150 L255 475 M400 150 L345 475 M120 245 L220 475 M480 245 L380 475','none');}},
      dolphin:{name:'海豚',draw:function(c){return pt(c,'M95 365 Q175 185 355 205 Q465 215 515 315 L565 270 L545 355 L565 435 L495 390 Q395 450 240 405 Q155 380 95 365 Z')+pt(c,'M285 205 L335 125 L360 205 Z')+'<circle cx="195" cy="315" r="12" fill="#222"/>';}},
      ladybug:{name:'瓢蟲',draw:function(c){return cc(c,300,175,78)+cc(c,300,340,175)+pt(c,'M300 175 V515 M255 110 Q230 65 200 75 M345 110 Q370 65 400 75','none')+'<circle cx="220" cy="285" r="24" fill="#222"/><circle cx="380" cy="285" r="24" fill="#222"/><circle cx="205" cy="395" r="28" fill="#222"/><circle cx="395" cy="395" r="28" fill="#222"/><circle cx="255" cy="445" r="18" fill="#222"/><circle cx="345" cy="445" r="18" fill="#222"/>';}},
      bee:{name:'蜜蜂',draw:function(c){return el(c,220,175,75,105,-30)+el(c,380,175,75,105,30)+el(c,300,345,165,115)+pt(c,'M240 242 V448 M300 230 V460 M360 242 V448','none')+face(c,175,215,320,365);}},
      dragonfly:{name:'蜻蜓',draw:function(c){return el(c,180,210,120,45,-15)+el(c,420,210,120,45,15)+el(c,185,295,115,40,15)+el(c,415,295,115,40,-15)+el(c,300,350,24,185)+cc(c,300,150,48)+'<circle cx="278" cy="140" r="12" fill="#222"/><circle cx="322" cy="140" r="12" fill="#222"/>';}},
      caterpillar:{name:'毛毛蟲',draw:function(c){return cc(c,445,355,58)+cc(c,365,335,62)+cc(c,285,355,62)+cc(c,205,330,64)+cc(c,130,275,72)+pt(c,'M105 210 Q85 150 65 155 M145 205 Q160 145 185 150','none')+face(c,105,155,260,295);}},
      ant:{name:'小螞蟻',draw:function(c){return cc(c,165,245,62)+cc(c,295,305,56)+el(c,430,365,92,68)+pt(c,'M255 345 L210 445 M295 360 L295 460 M335 345 L380 445 M145 190 Q120 120 90 125 M180 185 Q195 115 225 120','none')+'<circle cx="145" cy="235" r="10" fill="#222"/><circle cx="185" cy="235" r="10" fill="#222"/>';}},
      spider:{name:'小蜘蛛',draw:function(c){return pt(c,'M210 280 Q110 210 75 270 M205 320 Q95 300 65 365 M215 360 Q115 385 95 450 M235 395 Q155 455 145 520 M390 280 Q490 210 525 270 M395 320 Q505 300 535 365 M385 360 Q485 385 505 450 M365 395 Q445 455 455 520','none')+cc(c,300,350,115)+cc(c,300,220,65)+'<circle cx="275" cy="210" r="12" fill="#222"/><circle cx="325" cy="210" r="12" fill="#222"/>';}},
      banana:{name:'香蕉',draw:function(c){return pt(c,'M145 145 Q130 390 455 470 Q515 480 510 435 Q390 390 245 145 Q205 100 145 145 Z')+rc(c,155,95,45,48,8);}},
      grape:{name:'葡萄',draw:function(c){var pts=[[220,210],[300,210],[380,210],[185,280],[260,280],[340,280],[415,280],[225,355],[300,355],[375,355],[262,430],[338,430],[300,500]];return pt(c,'M300 165 V85 M300 120 Q385 75 435 125 Q375 170 300 135 Z')+pts.map(function(p){return cc(c,p[0],p[1],46);}).join('');}},
      watermelon:{name:'西瓜',draw:function(c){return pt(c,'M70 230 A230 230 0 0 0 530 230 Z')+pt(c,'M110 230 A190 190 0 0 0 490 230','none')+'<circle cx="215" cy="300" r="10" fill="#222"/><circle cx="300" cy="335" r="10" fill="#222"/><circle cx="385" cy="300" r="10" fill="#222"/><circle cx="255" cy="380" r="10" fill="#222"/><circle cx="345" cy="380" r="10" fill="#222"/>';}},
      strawberry:{name:'草莓',draw:function(c){return pt(c,'M145 235 Q135 465 300 540 Q465 465 455 235 Q380 185 300 195 Q220 185 145 235 Z')+pt(c,'M180 205 L245 150 L300 195 L355 150 L420 205 L360 235 L300 205 L240 235 Z')+pt(c,'M300 155 V95','none')+'<circle cx="220" cy="300" r="8" fill="#222"/><circle cx="300" cy="290" r="8" fill="#222"/><circle cx="380" cy="300" r="8" fill="#222"/><circle cx="255" cy="380" r="8" fill="#222"/><circle cx="345" cy="380" r="8" fill="#222"/><circle cx="300" cy="450" r="8" fill="#222"/>';}},
      pineapple:{name:'鳳梨',draw:function(c){return pt(c,'M265 185 L205 85 L275 140 L300 55 L325 140 L395 85 L335 185 Z')+el(c,300,365,135,170)+pt(c,'M200 265 L400 445 M225 215 L425 385 M180 335 L365 505 M400 265 L200 445 M375 215 L175 385 M420 335 L235 505','none');}},
      cherry:{name:'櫻桃',draw:function(c){return pt(c,'M195 340 Q245 180 315 110 Q370 180 410 340','none')+pt(c,'M315 110 Q395 65 455 115 Q395 165 315 125 Z')+cc(c,195,425,92)+cc(c,410,425,92);}},
      orange:{name:'橘子',draw:function(c){return cc(c,300,335,185)+pt(c,'M300 150 V95 M300 120 Q385 75 435 120 Q385 165 300 135 Z')+face(c,245,355,320,375);}},
      pear:{name:'水梨',draw:function(c){return pt(c,'M300 135 Q365 135 375 235 Q385 285 435 355 Q465 490 300 520 Q135 490 165 355 Q215 285 225 235 Q235 135 300 135 Z')+pt(c,'M300 135 V80 M300 105 Q375 65 415 105 Q370 140 300 115 Z');}},
      lemon:{name:'檸檬',draw:function(c){return pt(c,'M100 310 Q140 165 300 165 Q460 165 500 310 Q460 455 300 455 Q140 455 100 310 Z')+pt(c,'M300 165 Q365 85 430 120 Q375 185 300 165 Z')+face(c,245,355,295,355);}},
      peach:{name:'水蜜桃',draw:function(c){return pt(c,'M300 185 Q180 120 125 265 Q95 435 300 525 Q505 435 475 265 Q420 120 300 185 Z')+pt(c,'M300 185 Q285 310 300 390','none')+pt(c,'M300 185 Q385 85 450 120 Q395 190 300 185 Z');}},
      carrot:{name:'胡蘿蔔',draw:function(c){return pt(c,'M275 165 Q230 70 270 60 Q295 115 300 160 Q315 65 350 75 Q340 125 325 165 Z')+pt(c,'M195 195 Q300 155 405 195 L325 535 Q300 565 275 535 Z')+pt(c,'M225 275 H310 M290 365 H365 M255 445 H315','none');}},
      corn:{name:'玉米',draw:function(c){return el(c,300,275,95,185)+pt(c,'M205 225 H395 M205 295 H395 M205 365 H395 M260 105 V445 M340 105 V445','none')+pt(c,'M165 335 Q165 520 300 545 Q245 455 215 345 Z M435 335 Q435 520 300 545 Q355 455 385 345 Z');}},
      mushroom:{name:'蘑菇',draw:function(c){return rc(c,230,305,140,225,24)+pt(c,'M85 315 Q85 110 300 110 Q515 110 515 315 Z')+cc(c,200,220,38)+cc(c,335,185,42)+cc(c,425,250,28);}},
      pumpkin:{name:'南瓜',draw:function(c){return rc(c,275,95,50,75,12)+el(c,180,350,115,165)+el(c,420,350,115,165)+el(c,300,350,120,175)+face(c,235,365,310,390);}},
      eggplant:{name:'茄子',draw:function(c){return pt(c,'M250 185 Q185 320 205 455 Q235 545 325 535 Q415 515 415 395 Q415 265 350 185 Z')+pt(c,'M235 190 L265 130 H335 L365 190 L325 220 L300 190 L275 220 Z')+rc(c,285,80,30,55,8);}},
      cake:{name:'蛋糕',draw:function(c){return rc(c,120,335,360,185,18)+rc(c,175,205,250,130,14)+rc(c,285,125,30,80,6)+pt(c,'M300 65 Q325 95 300 125 Q275 95 300 65 Z')+pt(c,'M120 405 Q165 445 210 405 T300 405 T390 405 T480 405','none');}},
      cupcake:{name:'杯子蛋糕',draw:function(c){return pt(c,'M165 335 L205 535 H395 L435 335 Z')+pt(c,'M145 335 Q125 245 205 235 Q215 155 300 155 Q385 155 395 235 Q475 245 455 335 Z')+cc(c,300,125,34)+pt(c,'M235 335 L250 535 M300 335 V535 M365 335 L350 535','none');}},
      donut:{name:'甜甜圈',draw:function(c){return cc(c,300,300,210)+cc(c,300,300,72)+pt(c,'M115 275 Q155 325 205 280 T300 285 T395 280 T485 275','none')+rc(c,185,165,32,12,6)+rc(c,345,155,32,12,6)+rc(c,265,125,32,12,6);}},
      lollipop:{name:'棒棒糖',draw:function(c){return rc(c,288,365,24,200,8)+cc(c,300,235,165)+pt(c,'M300 235 m-10 0 a10 10 0 1 0 20 0 a25 25 0 1 0 -50 0 a45 45 0 1 0 90 0 a70 70 0 1 0 -140 0 a100 100 0 1 0 200 0','none');}},
      candy:{name:'糖果',draw:function(c){return pt(c,'M145 295 L65 210 L85 295 L65 385 Z M455 295 L535 210 L515 295 L535 385 Z')+el(c,300,295,155,95)+pt(c,'M225 220 V370 M300 200 V390 M375 220 V370','none');}},
      hamburger:{name:'漢堡',draw:function(c){return pt(c,'M115 265 A185 145 0 0 1 485 265 Z')+rc(c,105,285,390,48,22)+pt(c,'M105 345 Q150 375 195 345 T285 345 T375 345 T495 345','none')+rc(c,125,380,350,85,28);}},
      pizza:{name:'披薩',draw:function(c){return pt(c,'M130 145 Q300 85 470 145 L300 535 Z')+pt(c,'M150 185 Q300 135 450 185','none')+cc(c,260,245,28)+cc(c,340,265,28)+cc(c,295,355,28)+cc(c,300,445,22);}},
      hotdog:{name:'熱狗',draw:function(c){return rc(c,75,225,450,150,75)+rc(c,55,255,490,90,45)+pt(c,'M105 300 Q145 270 185 300 T265 300 T345 300 T425 300 T495 300','none');}},
      riceball:{name:'飯糰',draw:function(c){return pt(c,'M300 95 Q495 320 495 445 Q495 510 300 510 Q105 510 105 445 Q105 320 300 95 Z')+rc(c,220,385,160,125,10)+face(c,245,355,275,320);}},
      boba:{name:'珍奶',draw:function(c){return rc(c,315,65,24,145,6)+pt(c,'M175 205 L210 535 H390 L425 205 Z')+rc(c,155,180,290,34,12)+cc(c,245,485,20)+cc(c,300,485,20)+cc(c,355,485,20)+cc(c,270,435,20)+cc(c,330,435,20);}},
      cookie:{name:'餅乾',draw:function(c){return cc(c,300,300,195)+cc(c,220,220,24)+cc(c,365,215,20)+cc(c,240,365,26)+cc(c,375,355,22)+cc(c,300,295,18);}},
      pudding:{name:'布丁',draw:function(c){return pt(c,'M175 185 L125 485 H475 L425 185 Z')+pt(c,'M175 185 Q300 155 425 185 Q425 245 365 235 Q330 285 285 240 Q220 275 175 225 Z')+face(c,245,345,345,390);}},
      bus:{name:'公車',draw:function(c){return rc(c,75,165,450,245,32)+rc(c,115,200,85,85,10)+rc(c,225,200,85,85,10)+rc(c,335,200,85,85,10)+rc(c,445,200,55,130,10)+cc(c,175,425,52)+cc(c,425,425,52)+cc(c,175,425,20)+cc(c,425,425,20);}},
      train:{name:'火車',draw:function(c){return rc(c,135,145,70,95,8)+rc(c,105,235,235,165,16)+rc(c,340,175,145,225,16)+rc(c,365,210,95,80,10)+cc(c,175,420,48)+cc(c,305,420,48)+cc(c,430,420,48);}},
      airplane:{name:'飛機',draw:function(c){return pt(c,'M80 305 Q165 245 365 245 L515 285 Q545 305 515 325 L365 365 Q165 365 80 305 Z')+pt(c,'M235 245 L325 105 H385 L335 245 Z M235 365 L325 505 H385 L335 365 Z M445 270 L495 190 H530 L495 280 Z')+cc(c,195,305,18)+cc(c,265,305,18)+cc(c,335,305,18);}},
      helicopter:{name:'直升機',draw:function(c){return pt(c,'M105 145 H495 M300 145 V195 M165 445 H415 M235 395 V445 M345 395 V445','none')+el(c,275,295,155,105)+pt(c,'M425 280 L545 255 V315 L425 305 Z')+cc(c,545,285,32)+rc(c,165,225,115,75,16);}},
      sailboat:{name:'帆船',draw:function(c){return pt(c,'M85 385 H515 L445 505 H155 Z')+pt(c,'M295 85 V385','none')+pt(c,'M295 95 L465 345 H295 Z M275 145 L135 345 H275 Z')+pt(c,'M65 525 Q180 495 300 525 T535 525','none');}},
      ship:{name:'大輪船',draw:function(c){return rc(c,245,125,55,95,6)+rc(c,325,125,55,95,6)+rc(c,165,215,270,110,12)+pt(c,'M75 325 H525 L465 475 H135 Z')+cc(c,220,270,22)+cc(c,300,270,22)+cc(c,380,270,22);}},
      submarine:{name:'潛水艇',draw:function(c){return pt(c,'M265 185 V105 H335','none')+rc(c,215,185,155,65,16)+el(c,295,335,205,95)+pt(c,'M495 335 L555 285 V385 Z')+cc(c,205,335,28)+cc(c,295,335,28)+cc(c,385,335,28);}},
      bicycle:{name:'腳踏車',draw:function(c){return cc(c,145,405,95)+cc(c,455,405,95)+pt(c,'M145 405 L265 255 H405 L295 405 Z M240 215 H295 M405 215 L455 405 M385 215 H435','none')+cc(c,295,405,28);}},
      truck:{name:'卡車',draw:function(c){return rc(c,75,185,285,205,12)+pt(c,'M360 225 H465 L525 295 V390 H360 Z')+rc(c,385,245,90,65,8)+cc(c,170,415,52)+cc(c,440,415,52)+cc(c,170,415,20)+cc(c,440,415,20);}},
      firetruck:{name:'消防車',draw:function(c){return rc(c,75,215,295,185,12)+pt(c,'M370 215 H475 L525 295 V400 H370 Z')+rc(c,115,155,220,42,6)+rc(c,415,175,38,38,8)+cc(c,170,425,50)+cc(c,440,425,50);}},
      ufo:{name:'飛碟',draw:function(c){return pt(c,'M195 255 A105 115 0 0 1 405 255 Z')+el(c,300,285,225,65)+cc(c,175,285,18)+cc(c,300,295,18)+cc(c,425,285,18)+pt(c,'M215 350 L165 515 M300 355 V525 M385 350 L435 515','none');}},
      moon:{name:'月亮',draw:function(c){return pt(c,'M365 95 A195 195 0 1 0 475 455 A155 155 0 1 1 365 95 Z')+pt(c,starPath(425,185,48,20))+pt(c,starPath(475,315,32,14));}},
      cloud:{name:'雲朵',draw:function(c){return cloud(300,275,2.1,c)+face(c,245,355,245,285)+pt(c,'M195 365 L175 425 M300 365 L280 425 M405 365 L385 425','none');}},
      cactus:{name:'仙人掌',draw:function(c){return pt(c,'M175 425 L205 545 H395 L425 425 Z')+rc(c,155,390,290,42,10)+rc(c,255,115,90,275,45)+pt(c,'M255 245 H185 Q145 245 145 195 V165 Q145 140 175 140 Q205 140 205 165 V205 H255 M345 275 H415 Q455 275 455 225 V195 Q455 170 425 170 Q395 170 395 195 V235 H345');}},
      tulip:{name:'鬱金香',draw:function(c){return pt(c,'M290 325 V555 H310 V325 Z')+pt(c,'M290 485 Q200 415 160 445 Q205 515 290 505 Z M310 465 Q400 395 440 425 Q395 495 310 485 Z')+pt(c,'M185 165 Q185 335 300 335 Q415 335 415 165 L355 225 L300 135 L245 225 Z');}},
      clover:{name:'幸運草',draw:function(c){return pt(c,'M300 305 Q295 455 340 545','none')+cc(c,225,225,82)+cc(c,375,225,82)+cc(c,225,355,82)+cc(c,375,355,82)+cc(c,300,290,36);}},
      leaf:{name:'葉子',draw:function(c){return pt(c,'M115 475 Q115 155 475 115 Q445 455 115 475 Z')+pt(c,'M85 505 L445 145 M215 375 L195 275 M295 295 L275 205 M265 325 L365 345 M345 245 L425 255','none');}},
      mountain:{name:'高山',draw:function(c){return pt(c,'M60 495 L225 175 L390 495 Z')+pt(c,'M235 495 L385 215 L540 495 Z')+pt(c,'M175 270 L205 295 L225 270 L250 295 L275 270','none')+cc(c,465,125,48);}},
      volcano:{name:'火山',draw:function(c){return pt(c,'M95 515 L225 245 H375 L505 515 Z')+cloud(300,145,1.2,c)+pt(c,'M225 245 Q265 285 300 250 T375 245','none');}},
      planet:{name:'土星',draw:function(c){return cc(c,300,300,135)+pt(c,'M75 345 Q300 445 525 255 Q465 235 435 255 M165 345 Q135 365 75 345','none')+pt(c,starPath(120,135,34,15))+pt(c,starPath(485,465,30,13));}},
      comet:{name:'彗星',draw:function(c){return pt(c,'M205 265 L495 105 L335 395 M255 315 L525 195','none')+pt(c,starPath(195,385,125,52));}},
      snowman:{name:'雪人',draw:function(c){return cc(c,300,415,135)+cc(c,300,235,95)+rc(c,225,135,150,24,6)+rc(c,250,75,100,65,6)+'<circle cx="265" cy="215" r="10" fill="#222"/><circle cx="335" cy="215" r="10" fill="#222"/>'+pt(c,'M300 235 L360 250 L300 260 Z')+'<circle cx="300" cy="375" r="12" fill="#222"/><circle cx="300" cy="435" r="12" fill="#222"/>';}},
      christmastree:{name:'聖誕樹',draw:function(c){return rc(c,265,465,70,80,6)+pt(c,'M115 465 L300 275 L485 465 Z')+pt(c,'M145 345 L300 185 L455 345 Z')+pt(c,'M185 235 L300 105 L415 235 Z')+pt(c,starPath(300,75,40,18))+cc(c,245,395,18)+cc(c,355,395,18)+cc(c,300,295,18);}},
      castle:{name:'城堡',draw:function(c){return rc(c,125,265,95,255,4)+rc(c,380,265,95,255,4)+rc(c,220,315,160,205,4)+pt(c,'M110 265 L172 145 L235 265 Z M365 265 L427 145 L490 265 Z M235 315 L300 185 L365 315 Z')+pt(c,'M265 520 V425 A35 35 0 0 1 335 425 V520 Z');}},
      tent:{name:'帳篷',draw:function(c){return pt(c,'M85 495 L300 135 L515 495 Z')+pt(c,'M235 495 L300 315 L365 495 Z')+pt(c,'M300 135 V85 L355 105 L300 125');}},
      lighthouse:{name:'燈塔',draw:function(c){return pt(c,'M205 535 L245 195 H355 L395 535 Z')+rc(c,230,135,140,60,8)+pt(c,'M225 135 L300 70 L375 135 Z')+pt(c,'M232 305 H368 M220 415 H380 M175 165 L95 145 M425 165 L505 145','none');}},
      windmill:{name:'風車',draw:function(c){return pt(c,'M215 535 L255 245 H345 L385 535 Z')+pt(c,'M245 245 L300 165 L355 245 Z')+rc(c,290,95,20,255,8)+rc(c,175,215,255,20,8)+cc(c,300,225,24);}},
      crown:{name:'皇冠',draw:function(c){return pt(c,'M95 455 L65 185 L195 305 L300 125 L405 305 L535 185 L505 455 Z')+rc(c,95,455,410,55,10)+cc(c,65,185,22)+cc(c,300,125,26)+cc(c,535,185,22)+cc(c,300,375,32);}},
      diamond:{name:'鑽石',draw:function(c){return pt(c,'M165 145 H435 L525 255 L300 515 L75 255 Z')+pt(c,'M75 255 H525 M165 145 L225 255 L300 515 M435 145 L375 255 L300 515 M225 255 L300 145 L375 255','none');}},
      gift:{name:'禮物盒',draw:function(c){return rc(c,125,235,350,285,14)+rc(c,100,185,400,65,12)+rc(c,270,185,60,335,0)+el(c,235,145,65,38,-20)+el(c,365,145,65,38,20);}},
      bell:{name:'鈴鐺',draw:function(c){return cc(c,300,505,46)+pt(c,'M145 435 Q165 165 300 145 Q435 165 455 435 L495 475 H105 Z')+cc(c,300,110,30);}},
      clock:{name:'鬧鐘',draw:function(c){return cc(c,145,145,58)+cc(c,455,145,58)+cc(c,300,320,185)+cc(c,300,320,145)+pt(c,'M300 320 V220 M300 320 L385 320 M175 490 L135 545 M425 490 L465 545','none');}},
      camera:{name:'相機',draw:function(c){return rc(c,195,125,210,65,14)+rc(c,85,185,430,295,28)+cc(c,300,332,98)+cc(c,300,332,54)+rc(c,415,215,62,36,8);}},
      glasses:{name:'眼鏡',draw:function(c){return cc(c,180,320,105)+cc(c,420,320,105)+cc(c,180,320,70)+cc(c,420,320,70)+pt(c,'M285 315 Q300 290 315 315 M75 305 L115 195 M525 305 L485 195','none');}},
      hat:{name:'帽子',draw:function(c){return pt(c,'M155 365 Q155 155 300 155 Q445 155 445 365 Z')+el(c,300,385,235,65)+pt(c,'M160 315 Q300 345 440 315','none');}},
      sock:{name:'襪子',draw:function(c){return pt(c,'M215 95 H375 V335 Q375 415 465 435 Q515 455 495 510 Q465 545 365 515 L215 445 Z')+rc(c,200,85,190,65,12);}},
      shoe:{name:'鞋子',draw:function(c){return pt(c,'M115 215 H275 V335 Q385 345 485 395 Q525 425 505 485 H105 Z')+rc(c,105,465,405,42,12)+pt(c,'M295 355 L325 325 M345 370 L375 340','none');}},
      backpack:{name:'書包',draw:function(c){return pt(c,'M235 135 A65 65 0 0 1 365 135','none')+rc(c,125,155,350,375,65)+rc(c,175,335,250,145,24)+pt(c,'M125 275 Q300 325 475 275','none');}},
      pencil:{name:'鉛筆',draw:function(c){return pt(c,'M235 165 H365 V445 L300 555 L235 445 Z')+rc(c,235,85,130,80,18)+pt(c,'M235 145 H365 M278 165 V445 M322 165 V445 M275 512 H325','none');}},
      book:{name:'書本',draw:function(c){return pt(c,'M85 155 Q195 125 300 175 Q405 125 515 155 V465 Q405 435 300 485 Q195 435 85 465 Z')+pt(c,'M300 175 V485 M135 235 H245 M135 305 H245 M135 375 H245 M355 235 H465 M355 305 H465 M355 375 H465','none');}},
      kite:{name:'風箏',draw:function(c){return pt(c,'M300 65 L475 235 L300 445 L125 235 Z')+pt(c,'M300 65 V445 M125 235 H475 M300 445 Q345 515 285 565','none')+pt(c,'M265 510 L335 535 L335 505 L265 535 Z');}},
      soccer:{name:'足球',draw:function(c){return cc(c,300,300,210)+pt(c,regPoly(300,300,72,5))+pt(c,'M300 228 V90 M231 278 L100 235 M258 358 L175 470 M342 358 L425 470 M369 278 L500 235','none');}},
      guitar:{name:'吉他',draw:function(c){return rc(c,278,65,44,205,8)+cc(c,300,335,82)+cc(c,300,445,115)+cc(c,300,355,34)+rc(c,255,475,90,26,6);}},
      drum:{name:'小鼓',draw:function(c){return rc(c,125,215,350,245,20)+el(c,300,215,175,55)+pt(c,'M125 235 L215 455 L300 265 L385 455 L475 235','none')+pt(c,'M135 105 L265 205 M465 105 L335 205','none');}},
      robot:{name:'機器人',draw:function(c){return pt(c,'M300 135 V75','none')+cc(c,300,65,20)+rc(c,175,135,250,155,26)+rc(c,155,305,290,225,24)+cc(c,245,205,24)+cc(c,355,205,24)+rc(c,235,245,130,22,8)+rc(c,215,355,170,115,14);}},
      trophy:{name:'獎盃',draw:function(c){return pt(c,'M165 125 H435 V265 Q435 375 300 375 Q165 375 165 265 Z')+pt(c,'M165 165 H95 Q95 275 165 275 M435 165 H505 Q505 275 435 275','none')+rc(c,275,375,50,85,4)+rc(c,195,460,210,55,10)+pt(c,starPath(300,235,54,24));}},
      pentagon:{name:'五邊形',draw:function(c){return pt(c,regPoly(300,305,215,5))+face(c,245,355,285,345);}},
      hexagon:{name:'六邊形',draw:function(c){return pt(c,regPoly(300,300,215,6))+face(c,245,355,280,340);}},
      octagon:{name:'八邊形',draw:function(c){return pt(c,regPoly(300,300,215,8))+face(c,245,355,280,340);}},
      heart:{name:'愛心',draw:function(c){return pt(c,'M300 505 Q85 365 85 215 A110 110 0 0 1 300 185 A110 110 0 0 1 515 215 Q515 365 300 505 Z')+face(c,245,355,265,325);}},
      bowtie:{name:'蝴蝶結',draw:function(c){return pt(c,'M75 165 L265 280 V320 L75 435 Z M525 165 L335 280 V320 L525 435 Z')+cc(c,300,300,56);}},
      umbrella2:{name:'遮陽傘',draw:function(c){return pt(c,'M300 145 V535 M195 535 H405','none')+pt(c,'M65 305 Q300 85 535 305 Z')+pt(c,'M185 245 L300 145 L415 245','none');}},
      lamp:{name:'檯燈',draw:function(c){return pt(c,'M175 115 H425 L475 295 H125 Z')+rc(c,280,295,40,185,6)+rc(c,185,480,230,46,14)+pt(c,'M375 295 V365','none');}},
      teapot:{name:'茶壺',draw:function(c){return cc(c,300,345,155)+pt(c,'M155 315 Q85 255 115 205 M445 275 Q525 275 515 365 Q505 425 435 415','none')+rc(c,215,175,170,38,14)+cc(c,300,150,26);}},
      trophy2:{name:'金牌',draw:function(c){return pt(c,'M205 75 L275 215 H325 L395 75 H335 L300 155 L265 75 Z')+cc(c,300,355,155)+pt(c,starPath(300,355,95,42));}},
      magnifying:{name:'放大鏡',draw:function(c){return pt(c,'M365 365 L515 515','none')+cc(c,255,255,165)+cc(c,255,255,125);}},
      key:{name:'鑰匙',draw:function(c){return cc(c,175,300,105)+cc(c,175,300,48)+rc(c,275,278,245,44,12)+rc(c,395,322,32,68,6)+rc(c,465,322,32,88,6);}},
      anchor:{name:'船錨',draw:function(c){return cc(c,300,125,42)+pt(c,'M300 167 V485 M195 235 H405 M115 355 Q135 505 300 505 Q465 505 485 355','none')+pt(c,'M95 375 L115 335 L145 375 M455 375 L485 335 L505 375','none');}},
      magnet:{name:'磁鐵',draw:function(c){return pt(c,'M145 115 V335 A155 155 0 0 0 455 335 V115 H375 V335 A75 75 0 0 1 225 335 V115 Z')+pt(c,'M145 195 H225 M375 195 H455','none');}},
      scissors:{name:'剪刀',draw:function(c){return cc(c,165,435,62)+cc(c,435,435,62)+pt(c,'M195 385 L375 105 L335 285 M405 385 L225 105 L265 285','none');}},
      envelope:{name:'信封',draw:function(c){return rc(c,75,165,450,295,18)+pt(c,'M75 175 L300 345 L525 175 M75 450 L225 310 M525 450 L375 310','none');}},
      calendar:{name:'日曆',draw:function(c){return rc(c,105,135,390,385,24)+pt(c,'M105 235 H495 M205 95 V175 M395 95 V175','none')+pt(c,'M280 315 L315 290 V455','none');}},
      tv:{name:'電視',draw:function(c){return pt(c,'M235 145 L175 75 M365 145 L425 75','none')+rc(c,85,145,430,335,28)+rc(c,125,185,275,255,18)+cc(c,450,245,28)+cc(c,450,335,28);}},
      phone:{name:'手機',draw:function(c){return rc(c,175,75,250,450,34)+rc(c,205,125,190,325,10)+cc(c,300,485,20);}},
      musicnote:{name:'音符',draw:function(c){return pt(c,'M225 415 V135 L435 95 V375','none')+el(c,185,435,62,46,-20)+el(c,395,395,62,46,-20);}},
      palette:{name:'調色盤',draw:function(c){return pt(c,'M300 105 Q495 105 495 285 Q495 455 345 455 Q275 455 275 405 Q275 365 215 395 Q115 445 105 295 Q95 105 300 105 Z')+cc(c,215,205,32)+cc(c,335,185,32)+cc(c,415,265,32)+cc(c,375,365,32)+cc(c,195,315,28);}}
    };
    // 第三批：以精簡指令描述（C 圓、E 橢圓、R 方、P 封閉路徑、L 線、K 實心黑點、F 笑臉），座標皆為 600×600 畫布
    var DSL = {
      giraffe:['長頸鹿','L250 110 V60 M350 110 V60|C250 50 18|C350 50 18|P215 130 Q150 100 140 140 Q165 180 220 175 Z|P385 130 Q450 100 460 140 Q435 180 380 175 Z|P220 130 Q300 80 380 130 L365 290 Q300 340 235 290 Z|P245 300 L225 555 H375 L355 300 Q300 340 245 300 Z|E300 265 62 48|K260 185 13|K340 185 13|K280 260 7|K320 260 7|E275 380 20 26|E325 440 22 28|E275 500 20 26'],
      horse:['小馬','P215 150 L205 50 L275 115 Z|P385 150 L395 50 L325 115 Z|P205 160 Q300 70 395 160 L375 390 Q300 480 225 390 Z|P265 110 Q300 220 335 110 Q300 60 265 110 Z|E300 420 95 85|K250 235 15|K350 235 15|K268 415 9|K332 415 9|L262 455 Q300 480 338 455'],
      goat:['山羊','L230 140 Q170 90 190 40 M370 140 Q430 90 410 40|P195 190 Q110 170 95 215 Q130 260 205 235 Z|P405 190 Q490 170 505 215 Q470 260 395 235 Z|P200 160 Q300 90 400 160 L370 370 Q300 440 230 370 Z|P270 410 Q300 560 330 410 Z|K255 235 14|K345 235 14|L275 345 L300 365 L325 345 M300 365 V390'],
      squirrel:['松鼠','P390 500 Q560 480 540 290 Q530 140 420 130 Q350 140 380 220 Q440 230 420 300 Q380 360 370 440 Z|E270 420 130 120|C230 230 110|P160 150 L150 80 L215 130 Z|P255 125 L290 70 L310 145 Z|K195 215 14|C130 250 14|L150 285 Q180 300 205 285|P150 400 Q100 400 110 450 Q160 470 190 440 Z|E230 535 60 24|E340 535 60 24'],
      bat:['蝙蝠','P230 280 Q140 160 40 200 Q70 260 50 340 Q110 310 140 370 Q180 330 235 370 Z|P370 280 Q460 160 560 200 Q530 260 550 340 Q490 310 460 370 Q420 330 365 370 Z|P235 190 L220 100 L285 165 Z|P365 190 L380 100 L315 165 Z|E300 310 90 135|K265 270 14|K335 270 14|L265 330 Q300 360 335 330 M285 343 V360 M315 343 V360'],
      snake:['小蛇','P90 470 Q60 380 170 370 Q300 360 290 290 Q280 240 340 220 Q330 130 420 120 Q520 130 500 220 Q480 270 420 270 Q370 280 385 330 Q400 430 260 440 Q160 440 170 480 Q240 520 480 480 Q520 490 500 530 Q220 580 130 540 Q100 520 90 470 Z|K400 180 13|K460 180 13|L415 225 Q435 240 455 225 M500 190 L545 180 M545 180 L565 165 M545 180 L565 195'],
      crocodile:['鱷魚','E390 360 170 95|P60 330 Q180 280 280 320 L285 400 Q160 430 60 400 Z|C270 285 40|K270 282 14|L60 368 H270 M90 368 l14 20 l14 -20 M150 368 l14 20 l14 -20 M210 368 l14 20 l14 -20|P330 275 L355 235 L385 268 L415 230 L440 270 L475 240 L495 290 Z|R310 430 60 70 22|R430 430 60 70 22|K90 345 8'],
      dino:['長頸恐龍','P110 180 Q70 110 150 90 Q220 90 220 160 Q225 280 300 290 Q440 270 480 370 Q520 460 570 470 Q500 520 440 470 L440 545 H375 L370 490 H270 L262 545 H198 L195 450 Q130 380 150 210 Z|K145 140 13|L112 180 Q140 195 160 182|E300 360 26 20|E370 350 22 18|E330 420 24 18'],
      trex:['暴龍','P150 110 Q260 60 340 120 L345 200 Q400 260 420 360 Q480 430 560 400 Q520 500 400 480 L395 545 H320 L315 480 H270 L265 545 H195 L205 430 Q200 330 240 260 L140 230 Z|K265 130 15|L140 190 H260 M160 190 l12 18 l12 -18 M205 190 l12 18 l12 -18|P240 320 Q190 310 180 350 Q200 370 245 355 Z|L380 250 L405 235 L402 275 M415 310 L445 300 L435 345'],
      parrot:['鸚鵡','P260 110 Q380 70 420 190 Q450 330 370 440 L350 560 L310 455 Q200 400 200 250 Q200 150 260 110 Z|P215 180 Q140 180 160 265 Q180 270 215 245 Z|P300 240 Q420 270 370 420 Q300 380 300 240 Z|C275 180 22|K272 180 9|P275 105 Q250 60 290 45 Q300 80 320 98 Z|L180 470 H470'],
      peacock:['孔雀','P300 420 Q60 420 60 250 Q120 80 300 80 Q480 80 540 250 Q540 420 300 420 Z|E130 260 34 44|E210 170 34 44|E390 170 34 44|E470 260 34 44|E300 140 34 44|E300 400 85 130|C300 270 62|P300 280 L285 305 L315 305 Z|K278 258 10|K322 258 10|L300 208 V180 M280 212 L265 188 M320 212 L335 188'],
      flamingo:['紅鶴','P240 130 Q240 70 310 75 Q370 90 350 160 Q310 230 330 280 Q460 260 500 350 Q420 440 290 400 Q220 370 250 280 Q300 200 290 150 Z|P245 115 Q180 120 180 180 Q215 170 245 160 Z|K290 115 10|L350 410 V560 M350 560 H310 M390 400 L400 480 L355 490|L330 340 Q400 330 440 370'],
      seal:['海豹','P160 150 Q300 60 400 170 Q480 280 520 430 Q560 480 530 520 Q470 500 440 500 H180 Q110 480 120 320 Q110 210 160 150 Z|K220 200 16|K310 200 16|E265 245 26 18|L265 263 V285 M265 285 Q235 305 215 285 M265 285 Q295 305 315 285 M195 250 L130 240 M195 268 L135 278|P330 380 Q440 420 420 510 Q340 500 310 430 Z'],
      shark:['鯊魚','P50 320 Q180 190 400 260 L540 180 Q500 310 545 420 L405 350 Q200 450 50 320 Z|P230 225 L300 110 L340 240 Z|P220 390 L190 480 L290 390 Z|K140 285 14|L70 335 Q120 370 180 350 M95 345 l10 18 l12 -16 M140 356 l10 18 l12 -20|L250 280 V350 M280 285 V345 M310 290 V340'],
      shrimp:['蝦子','P130 180 Q260 90 390 170 Q500 260 440 400 Q400 480 300 490 L230 540 L250 470 L190 450 L280 425 Q370 400 370 310 Q340 240 240 260 Q150 270 130 180 Z|K190 190 13|L130 170 Q60 130 50 60 M130 185 Q50 190 30 130 M330 150 Q300 200 310 250 M405 195 Q360 225 350 270 M445 290 Q400 290 372 310 M430 400 Q390 380 365 375'],
      squid:['烏賊','P300 50 Q440 130 420 340 H180 Q160 130 300 50 Z|P185 150 Q90 170 110 260 L178 250 Z|P415 150 Q510 170 490 260 L422 250 Z|K255 260 16|K345 260 16|L275 305 Q300 325 325 305|L200 340 Q170 440 200 540 M250 340 Q230 450 250 550 M300 340 V560 M350 340 Q370 450 350 550 M400 340 Q430 440 400 540'],
      puffer:['河豚','C290 310 185|P465 300 L560 230 L550 310 L565 390 L465 330 Z|L290 125 V85 M180 160 L155 128 M400 160 L425 128 M115 260 L75 245 M115 370 L75 385 M180 460 L155 492 M400 460 L425 492 M290 495 V535|K220 265 18|K350 265 18|E285 345 40 26|C180 330 22|C395 330 22'],
      beetle:['獨角仙','P290 120 L285 60 L250 30 M310 120 L315 60 L350 30|C300 170 60|E300 360 150 170|L300 195 V530|L155 300 L80 270 M150 380 L70 390 M175 460 L100 510 M445 300 L520 270 M450 380 L530 390 M425 460 L500 510|K275 165 10|K325 165 10'],
      kiwi:['奇異果','E300 300 230 200|E300 300 195 168|E300 300 60 46|K300 215 9|K375 235 9|K420 300 9|K375 365 9|K300 385 9|K225 365 9|K180 300 9|K225 235 9'],
      mango:['芒果','P240 120 Q430 80 500 260 Q540 440 360 510 Q160 540 100 380 Q80 200 240 120 Z|P260 115 Q300 40 400 60 Q380 120 280 125 Z|F250 370 310 370'],
      avocado:['酪梨','P300 70 Q380 80 410 210 Q500 320 460 440 Q410 550 300 545 Q190 550 140 440 Q100 320 190 210 Q220 80 300 70 Z|P300 115 Q350 130 372 225 Q450 330 418 425 Q380 500 300 500 Q220 500 182 425 Q150 330 228 225 Q250 130 300 115 Z|C300 390 78'],
      tomato:['番茄','P300 170 Q500 110 530 310 Q520 520 300 530 Q80 520 70 310 Q100 110 300 170 Z|P300 180 L230 130 L270 130 L250 70 L305 120 L350 65 L335 130 L385 120 L340 165 Z|F235 365 320 370'],
      onion:['洋蔥','P300 190 Q330 110 300 50 Q350 100 350 190 Q520 250 500 400 Q460 520 300 530 Q140 520 100 400 Q80 250 260 190 Q270 130 300 50|L300 200 Q230 350 300 528 M330 200 Q430 350 330 525 M270 200 Q150 350 250 523|L270 530 L260 565 M300 532 V570 M330 530 L345 565'],
      potato:['馬鈴薯','P180 170 Q330 90 450 190 Q550 300 480 430 Q370 540 210 480 Q80 420 90 300 Q110 210 180 170 Z|F230 350 290 345|K180 240 8|K420 260 8|K400 420 8|K210 430 8'],
      pepper:['青椒','P285 130 Q290 70 340 60 L355 90 Q325 100 325 135 Z|P300 150 Q370 100 440 150 Q510 220 470 380 Q440 520 380 520 Q340 500 300 520 Q250 540 210 515 Q130 480 120 330 Q110 180 190 145 Q250 120 300 150 Z|L230 170 Q200 330 230 480 M370 170 Q400 330 370 480'],
      broccoli:['花椰菜','P250 350 L230 540 H370 L350 350 Z|P130 360 Q60 350 80 270 Q60 200 140 190 Q150 100 250 110 Q310 60 370 110 Q460 100 470 190 Q540 210 520 280 Q540 360 460 360 Q400 400 340 365 Q300 400 260 365 Q190 400 130 360 Z|F250 350 240 275'],
      pea:['豌豆','P60 330 Q300 140 540 330 Q300 520 60 330 Z|C190 330 52|C300 330 62|C410 330 52|L60 330 Q40 290 55 260'],
      radish:['白蘿蔔','P220 200 Q300 160 380 200 Q430 330 320 550 Q300 575 280 550 Q170 330 220 200 Z|P280 185 Q210 110 230 50 Q290 90 300 180 Z|P310 180 Q310 80 370 45 Q390 110 325 185 Z|L225 270 H270 M375 330 H330 M245 380 H285'],
      toast:['吐司','P140 270 Q80 250 90 180 Q110 110 220 110 H380 Q490 110 510 180 Q520 250 460 270 V490 Q455 515 430 515 H170 Q145 515 140 490 Z|F240 360 310 370'],
      croissant:['可頌','P70 400 Q120 180 300 160 Q480 180 530 400 Q470 430 440 360 Q390 290 300 290 Q210 290 160 360 Q130 430 70 400 Z|L190 195 Q220 250 205 310 M260 165 Q280 230 265 293 M340 165 Q320 230 335 293 M410 195 Q380 250 395 310'],
      friedegg:['荷包蛋','P180 150 Q300 70 410 150 Q530 190 510 310 Q530 430 410 460 Q300 540 200 470 Q70 450 90 330 Q70 200 180 150 Z|C300 310 105|F265 335 300 325'],
      ramen:['拉麵','P70 290 H530 Q520 450 400 490 H200 Q80 450 70 290 Z|R220 490 160 40 10|E300 290 230 50|C230 280 34|L320 270 Q350 300 380 270 Q410 300 440 275|L360 250 L520 60 M400 250 L560 90'],
      sushi:['壽司','P90 330 Q90 260 170 260 H430 Q510 260 510 330 V420 Q510 470 450 470 H150 Q90 470 90 420 Z|P70 280 Q150 160 340 170 Q500 180 530 280 Q520 320 450 310 Q300 270 150 320 Q80 330 70 280 Z|L180 200 Q190 250 180 300 M280 175 Q295 225 285 280 M390 180 Q400 230 395 290|F240 360 375 390'],
      dumpling:['水餃','P60 400 Q90 180 300 170 Q510 180 540 400 Q480 470 300 470 Q120 470 60 400 Z|P60 400 Q100 340 140 395 Q180 335 220 395 Q260 335 300 395 Q340 335 380 395 Q420 335 460 395 Q500 340 540 400 Q480 470 300 470 Q120 470 60 400 Z|F250 350 270 300'],
      bun:['包子','P80 420 Q80 230 300 170 Q520 230 520 420 Q520 490 300 490 Q80 490 80 420 Z|L300 170 Q270 220 220 240 M300 170 Q330 220 380 240 M300 170 V235|F245 355 355 375'],
      popcorn:['爆米花','P170 270 L210 540 H390 L430 270 Z|L235 270 L260 540 M300 270 V540 M365 270 L340 540|C180 230 55|C260 180 60|C345 180 60|C420 230 55|C300 235 55'],
      fries:['薯條','R190 110 44 220 6|R245 70 44 250 6|R300 90 44 240 6|R355 60 44 260 6|R150 160 44 170 6|P130 280 Q300 360 460 280 L430 540 H160 Z|F250 350 400 420'],
      popsicle:['冰棒','P180 170 Q180 70 300 70 Q420 70 420 170 V400 H180 Z|R275 400 50 140 18|L240 150 V320 M360 150 V320|F265 335 240 285'],
      milk:['牛奶','P190 200 L230 110 H370 L410 200 V530 H190 Z|R230 60 140 50 6|L190 200 H410|F260 340 330 360|P190 430 Q260 400 300 430 Q350 460 410 430 V530 H190 Z'],
      juice:['果汁','P160 180 H440 L405 530 H195 Z|L185 270 H415|L330 180 L380 50 H450|C210 150 70|L210 80 V220 M140 150 H280|F260 340 360 400'],
      honey:['蜂蜜罐','P150 200 Q90 350 160 500 Q300 550 440 500 Q510 350 450 200 Z|R140 140 320 64 22|P170 204 Q190 290 220 240 Q250 330 290 245 Q330 300 360 240 Q400 280 430 204 Z|F250 350 380 420'],
      tractor:['拖拉機','R240 120 180 180 16|R265 150 130 100 8|P80 300 H440 V420 H80 Z|R120 210 36 90 4|C410 420 120|C410 420 50|C150 450 72|C150 450 28'],
      excavator:['挖土機','R270 200 170 170 14|R300 225 90 80 6|P240 370 H500 V420 H240 Z|R200 430 340 80 40|C250 470 24|C370 470 24|C490 470 24|P280 240 L170 120 L100 260 L130 275 L175 180 L265 290 Z|P70 260 H160 Q150 360 100 350 Q70 330 70 260 Z'],
      ambulance:['救護車','P50 180 H370 V440 H50 Z|P370 250 H470 L540 350 V440 H370 Z|P395 270 H455 L500 345 H395 Z|R250 140 70 40 8|C150 450 58|C150 450 22|C440 450 58|C440 450 22|P185 250 h40 v40 h40 v40 h-40 v40 h-40 v-40 h-40 v-40 h40 Z'],
      policecar:['警車','P60 400 Q60 330 130 320 L190 320 L240 225 H390 L450 320 Q540 330 540 400 V430 H60 Z|P215 315 L255 250 H300 V315 Z|P325 250 H375 L415 315 H325 Z|R270 180 70 44 10|C170 435 56|C170 435 22|C440 435 56|C440 435 22|P300 345 l12 25 h27 l-22 18 l8 27 l-25 -16 l-25 16 l8 -27 l-22 -18 h27 Z'],
      airballoon:['熱氣球','P300 40 Q490 50 490 220 Q480 330 370 420 H230 Q120 330 110 220 Q110 50 300 40 Z|L300 40 Q200 200 265 420 M300 40 Q400 200 335 420|L235 420 L255 480 M365 420 L345 480|R245 480 110 80 12'],
      trafficlight:['紅綠燈','R200 50 200 420 40|C300 130 55|C300 260 55|C300 390 55|R280 470 40 90 0|P200 100 L140 80 V150 L200 170 Z|P400 100 L460 80 V150 L400 170 Z'],
      skateboard:['滑板','P50 260 Q70 220 110 250 L150 290 H450 L490 250 Q530 220 550 260 Q520 350 450 350 H150 Q80 350 50 260 Z|C170 390 42|C170 390 14|C430 390 42|C430 390 14'],
      motorbike:['摩托車','C140 420 90|C140 420 34|C470 420 90|C470 420 34|P140 330 Q200 250 330 290 H470 Q490 340 440 400 H230 Z|P320 240 H460 Q480 285 440 290 H330 Z|L175 340 L150 190 H90|C175 250 28'],
      cup:['杯子','P110 180 H420 L395 480 Q390 520 350 520 H180 Q140 520 135 480 Z|L420 240 Q530 230 520 330 Q510 420 402 410|F215 315 330 370|L210 140 Q190 110 215 80 M265 140 Q245 110 270 80 M320 140 Q300 110 325 80'],
      pot:['鍋子','P110 250 H490 V450 Q490 510 430 510 H170 Q110 510 110 450 Z|P110 250 Q130 150 300 150 Q470 150 490 250 Z|C300 130 26|R40 290 70 46 18|R490 290 70 46 18|F240 360 360 410'],
      toothbrush:['牙刷','P60 480 L390 210 L420 245 L95 520 Q65 525 60 480 Z|P380 220 L500 110 Q540 110 540 150 L425 255 Z|L400 195 L375 160 M430 168 L405 132 M460 142 L435 106 M490 116 L465 80|L140 455 L240 372'],
      comb:['梳子','P70 180 Q300 110 530 180 V260 H70 Z|L100 260 V430 M150 260 V440 M200 260 V445 M250 260 V450 M300 260 V450 M350 260 V450 M400 260 V445 M450 260 V440 M500 260 V430|P70 260 H530 V290 H70 Z'],
      candle:['蠟燭','P300 50 Q360 130 300 180 Q240 130 300 50 Z|L300 180 V220|P220 220 H380 V480 H220 Z|P220 220 Q235 320 260 250 Q285 340 310 250 Q340 310 380 220 Z|E300 490 150 45'],
      lantern:['燈籠','R240 90 120 40 8|L300 90 V40|E300 280 200 150|L300 130 V430 M210 145 Q150 280 210 415 M390 145 Q450 280 390 415|R240 430 120 40 8|L260 470 V560 M300 470 V570 M340 470 V560'],
      fan:['電風扇','C300 230 190|C300 230 30|P300 205 Q240 70 330 70 Q390 110 318 210 Z|P325 235 Q470 240 440 320 Q370 350 310 255 Z|P277 240 Q200 360 160 300 Q150 230 275 220 Z|R280 420 40 90 0|P190 510 H410 Q430 550 400 555 H200 Q170 550 190 510 Z'],
      washer:['洗衣機','R110 70 380 470 26|L110 170 H490|C300 355 130|C300 355 95|C180 120 24|R250 100 190 40 10|L215 365 Q260 330 300 365 Q345 400 385 365'],
      fridge:['冰箱','R150 50 300 500 28|L150 220 H450|R395 110 22 70 8|R395 260 22 110 8|F230 320 360 410'],
      beachball:['海灘球','C300 300 220|C300 235 34|L300 201 Q320 130 290 82 M334 240 Q430 210 490 190 M318 264 Q400 380 390 500 M282 264 Q220 390 170 478 M268 225 Q180 170 110 190'],
      basketball:['籃球','C300 300 220|L300 80 V520 M80 300 H520 M150 140 Q280 300 150 460 M450 140 Q320 300 450 460'],
      baseball:['棒球','C300 300 220|L160 130 Q290 300 160 470 M440 130 Q310 300 440 470|L185 190 L215 180 M210 250 L240 245 M210 350 L240 355 M185 410 L215 420 M415 190 L385 180 M390 250 L360 245 M390 350 L360 355 M415 410 L385 420'],
      blocks:['積木','R90 330 190 190 12|R320 330 190 190 12|P205 310 L300 120 L395 310 Z|C185 425 46|R370 380 90 90 6'],
      yoyo:['溜溜球','C320 380 160|C320 380 105|C320 380 40|L320 220 Q340 100 200 80|C185 78 24'],
      spintop:['陀螺','P110 210 Q300 130 490 210 Q470 330 300 520 Q130 330 110 210 Z|R270 90 60 80 10|L110 210 Q300 290 490 210 M150 290 Q300 360 450 290|L300 520 V560'],
      bowling:['保齡球瓶','P300 50 Q370 60 360 150 Q350 210 400 300 Q450 440 380 550 H220 Q150 440 200 300 Q250 210 240 150 Q230 60 300 50 Z|L246 170 H354 M243 205 H357|F255 345 350 410'],
      piano:['鋼琴','P70 160 H530 V420 H70 Z|L70 290 H530 M136 290 V420 M202 290 V420 M268 290 V420 M334 290 V420 M400 290 V420 M466 290 V420|R118 290 34 70 0|R184 290 34 70 0|R316 290 34 70 0|R382 290 34 70 0|R448 290 34 70 0|R100 420 40 100 4|R460 420 40 100 4'],
      trumpet:['喇叭','P60 280 H110 V340 H60 Z|P110 290 H360 Q440 280 520 170 V450 Q440 340 360 330 H110 Z|R200 190 34 100 8|R260 190 34 100 8|R320 190 34 100 8|P190 330 Q180 420 260 420 H320 Q380 420 370 330 Z'],
      xylophone:['鐵琴','P70 180 L530 240 V370 L70 430 Z|R100 150 60 310 12|R190 165 60 280 12|R280 180 60 250 12|R370 195 60 220 12|R460 210 60 190 12|L380 520 L530 450|C370 525 26'],
      crayon:['蠟筆','P230 170 L270 60 Q300 40 330 60 L370 170 Z|R210 170 180 360 10|L210 230 H390 M210 470 H390|F260 340 330 390'],
      shirt:['上衣','P210 110 Q300 170 390 110 L540 190 L490 310 L430 280 V520 H170 V280 L110 310 L60 190 Z|P225 300 l75 -60 l75 60 l-30 85 h-90 Z'],
      pants:['褲子','P150 90 H450 L480 530 H350 L300 260 L250 530 H120 Z|L150 150 H450 M300 150 V260|L170 210 Q210 220 220 160 M430 210 Q390 220 380 160'],
      dress:['洋裝','P220 70 L250 70 Q300 120 350 70 L380 70 L400 240 L520 500 Q300 560 80 500 L200 240 Z|L205 240 H395 M110 440 Q300 500 490 440|C300 340 14|C230 400 14|C370 400 14'],
      mitten:['手套','P170 280 Q160 80 300 80 Q430 90 430 250 Q520 200 540 270 Q530 340 430 390 V450 H170 Z|R150 450 300 80 20|P300 170 Q340 120 375 165 Q390 210 300 275 Q210 210 225 165 Q260 120 300 170 Z'],
      cap:['鴨舌帽','P110 350 Q110 150 290 150 Q450 160 460 350 Z|P300 350 Q520 320 570 400 Q520 440 330 400 H110 V350 Z|C290 140 22|L290 162 Q230 250 235 350 M290 162 Q370 250 365 350'],
      rainboots:['雨鞋','P150 80 H290 V360 Q430 360 480 440 V500 H150 Z|L150 140 H290|R140 500 350 44 12|P215 250 l12 25 l28 4 l-20 20 l5 28 l-25 -14 l-25 14 l5 -28 l-20 -20 l28 -4 Z'],
      acorn:['橡實','P150 250 Q160 520 300 560 Q440 520 450 250 Z|P110 250 Q120 120 300 120 Q480 120 490 250 Q300 300 110 250 Z|R285 60 30 64 10|F245 355 350 410'],
      sunflower:['向日葵','L300 400 V570|P300 500 Q200 430 150 470 Q190 540 300 530 Z|P300 520 Q400 450 450 490 Q410 560 300 550 Z|E300 90 34 70|E300 410 34 70|E140 250 70 34|E460 250 70 34|E190 137 70 34 45|E410 363 70 34 45|E410 137 70 34 -45|E190 363 70 34 -45|C300 250 105|F262 338 235 285'],
      palm:['椰子樹','P280 250 Q320 400 270 550 H350 Q380 400 325 250 Z|P300 240 Q200 120 70 210 Q180 200 300 260 Z|P300 240 Q230 60 120 70 Q210 130 300 260 Z|P300 240 Q380 60 490 80 Q390 130 300 260 Z|P300 240 Q420 120 540 220 Q420 200 300 260 Z|C270 270 30|C335 275 30|L130 550 H470'],
      bridge:['小橋','P40 400 Q300 180 560 400 V460 H490 Q300 320 110 460 H40 Z|L40 400 V300 M170 310 V220 M300 290 V190 M430 310 V220 M560 400 V300|L40 300 Q300 80 560 300|L60 520 Q120 490 180 520 T300 520 T420 520 T540 520'],
      pinwheel:['紙風車','P300 230 L300 60 Q400 70 420 160 Z|P300 230 L470 230 Q460 330 370 350 Z|P300 230 L300 400 Q200 390 180 300 Z|P300 230 L130 230 Q140 130 230 110 Z|C300 230 26|R288 400 24 160 6'],
      snowflake:['雪花','L300 60 V540 M92 180 L508 420 M92 420 L508 180|L250 100 L300 150 L350 100 M250 500 L300 450 L350 500 M100 240 L168 224 L150 155 M500 360 L432 376 L450 445 M100 360 L168 376 L150 445 M500 240 L432 224 L450 155|C300 300 46'],
      lightning:['閃電','P340 40 L130 320 H280 L210 560 L470 250 H310 Z|F255 335 250 285'],
      raindrop:['雨滴','P300 50 Q480 280 470 380 Q450 530 300 540 Q150 530 130 380 Q120 280 300 50 Z|F245 355 370 415'],
      earth:['地球','C300 300 225|P150 160 Q250 130 270 200 Q250 260 180 270 Q120 260 100 230 Z|P340 150 Q430 140 480 230 Q500 310 430 330 Q360 300 350 240 Z|P230 350 Q320 340 340 420 Q310 500 260 505 Q210 440 230 350 Z|F255 345 285 315'],
      chest:['寶箱','P90 280 Q100 130 200 130 H400 Q500 130 510 280 Z|R90 280 420 230 10|R260 250 80 90 10|C300 295 14|L170 140 Q150 200 150 280 V510 M430 140 Q450 200 450 280 V510'],
      fishbowl:['魚缸','P200 110 H400 L390 150 Q540 220 520 380 Q490 530 300 530 Q110 530 80 380 Q60 220 210 150 Z|L95 290 Q160 260 220 290 T350 290 T505 290|P190 390 Q270 320 350 390 Q270 460 190 390 Z|P345 390 L410 345 V435 Z|K235 380 9|C430 340 14|C455 300 10'],
      birdhouse:['鳥屋','P60 270 L300 70 L540 270 L500 310 L300 145 L100 310 Z|P140 280 L300 150 L460 280 V480 H140 Z|C300 310 62|R270 395 60 22 8|R280 480 40 90 0'],
      mailbox:['郵筒','P170 180 Q170 60 300 60 Q430 60 430 180 V440 H170 Z|R210 190 180 36 10|R140 440 320 44 10|R230 484 140 70 4|R215 270 170 120 8|L215 280 L300 340 L385 280'],
      slide:['溜滑梯','L110 540 V130 M190 540 V130 M110 200 H190 M110 270 H190 M110 340 H190 M110 410 H190 M110 480 H190|P190 130 H270 Q320 330 540 480 V540 H470 Q260 430 190 220 Z|P90 130 L190 50 L290 130 Z'],
      bucket:['水桶','P120 210 H480 L430 530 H170 Z|E300 210 180 46|L120 210 Q130 40 300 40 Q470 40 480 210|L140 340 H460|F255 345 400 450'],
      wateringcan:['澆水壺','P180 230 H430 V500 H180 Z|P180 330 L80 180 L110 160 L180 260 Z|P50 190 L120 130 L135 150 L70 215 Z|L430 270 Q550 270 540 380 Q530 460 430 450|L220 230 Q230 120 305 120 Q380 120 390 230|F260 350 340 400'],
      chair:['椅子','R160 60 280 220 24|R130 290 340 70 18|R150 360 44 190 6|R406 360 44 190 6|L230 90 V250 M300 90 V250 M370 90 V250'],
      bed:['小床','R50 190 60 330 12|R490 260 60 260 12|P110 320 H490 V440 H110 Z|P110 320 Q120 260 190 260 Q250 265 250 320 Z|P250 320 Q370 290 490 320 V440 H250 Z|C330 375 18|C420 375 18'],
      spoon:['湯匙','E300 160 105 125|P275 280 H325 L335 530 Q300 570 265 530 Z|L245 120 Q230 160 245 200'],
      mirror:['手拿鏡','C300 220 170|C300 220 130|R268 390 64 170 26|L240 180 L290 130 M240 240 L330 150'],
      bone:['骨頭','P140 220 Q70 190 80 270 Q50 300 80 340 Q80 410 150 380 L200 350 H400 L450 380 Q520 410 520 340 Q550 300 520 270 Q530 190 460 220 L400 250 H200 Z'],
      paw:['腳印','P300 270 Q400 270 440 390 Q460 500 370 500 Q300 470 230 500 Q140 500 160 390 Q200 270 300 270 Z|E150 270 46 62 -20|E245 160 46 66|E355 160 46 66|E450 270 46 62 20'],
      nest:['鳥巢','E210 290 60 80|E300 270 60 85|E390 290 60 80|P70 320 Q300 400 530 320 Q510 500 300 510 Q90 500 70 320 Z|L110 380 Q300 450 490 380 M140 430 Q300 490 460 430'],
      mermaidtail:['美人魚尾巴','P240 60 Q210 260 280 400 Q200 430 130 530 Q230 560 300 480 Q370 560 470 530 Q400 430 320 400 Q390 260 360 60 Q300 90 240 60 Z|L235 150 Q270 190 300 150 Q330 190 365 150 M240 230 Q270 265 300 230 Q330 265 362 230 M258 310 Q280 335 300 310 Q322 335 345 310'],
      wand:['魔法棒','P300 50 L345 160 L460 165 L370 240 L400 355 L300 290 L200 355 L230 240 L140 165 L255 160 Z|P275 300 L300 290 L325 300 L330 560 H270 Z|F262 338 190 235'],
      unicorn:['獨角獸','P270 130 L300 20 L330 130 Z|P200 170 L180 80 L260 130 Z|P400 170 L420 80 L340 130 Z|P190 180 Q300 90 410 180 L390 400 Q300 490 210 400 Z|P215 170 Q250 260 190 330 Q130 260 160 180 Z|K255 270 15|K350 270 15|E300 420 78 62|K275 418 8|K325 418 8|C230 330 20|C375 330 20'],
      ghost:['小幽靈','P120 530 V260 Q130 80 300 80 Q470 80 480 260 V530 Q435 480 390 525 Q345 480 300 525 Q255 480 210 525 Q165 480 120 530 Z|E240 260 24 34|E360 260 24 34|E300 345 34 26'],
      alien:['外星人','L240 120 Q220 60 190 50 M360 120 Q380 60 410 50|C185 45 24|C415 45 24|P300 100 Q480 110 470 280 Q430 420 300 440 Q170 420 130 280 Q120 110 300 100 Z|E230 260 44 62 -15|E370 260 44 62 15|L260 365 Q300 390 340 365|P220 430 H380 L410 550 H190 Z'],
      scarecrow:['稻草人','L80 300 H520|R285 420 30 140 4|P190 290 H410 V450 H190 Z|C300 200 85|P170 140 Q300 110 430 140 L380 130 L300 30 L220 130 Z|F268 332 190 225|C300 330 10|C300 385 10'],
      wreath:['花圈','C300 300 220|C300 300 120|C300 130 34|C430 210 34|C450 350 34|C360 460 34|C230 460 34|C145 350 34|C170 210 34'],
      flag:['旗子','R120 60 30 500 10|P150 90 Q300 40 350 100 Q430 150 530 100 V320 Q430 370 350 320 Q290 260 150 310 Z|P335 150 l14 34 h36 l-28 24 l10 36 l-32 -20 l-32 20 l10 -36 l-28 -24 h36 Z'],
      hourglass:['沙漏','R140 60 320 50 14|R140 490 320 50 14|P180 110 H420 Q420 230 320 300 Q420 370 420 490 H180 Q180 370 280 300 Q180 230 180 110 Z|L215 200 H385 M300 300 V400 M220 470 Q300 380 380 470'],
      globe:['地球儀','C300 250 180|L120 250 H480 M300 70 V430 M190 110 Q300 250 190 390 M410 110 Q300 250 410 390|L440 70 Q560 250 420 440|R270 450 60 50 0|R190 500 220 50 16']
    };
    Object.keys(DSL).forEach(function(k){
      EXTRA[k]={name:DSL[k][0],draw:function(c){
        return DSL[k][1].split('|').map(function(t){
          var o=t[0], a=t.slice(1);
          if(o==='P') return pt(c,'M'+a);
          if(o==='L') return pt(c,'M'+a,'none');
          var n=a.split(' ').map(Number);
          if(o==='C') return cc(c,n[0],n[1],n[2]);
          if(o==='E') return el(c,n[0],n[1],n[2],n[3],n[4]);
          if(o==='R') return rc(c,n[0],n[1],n[2],n[3],n[4]);
          if(o==='K') return '<circle cx="'+n[0]+'" cy="'+n[1]+'" r="'+n[2]+'" fill="#222"/>';
          if(o==='F') return face(c,n[0],n[1],n[2],n[3]);
        }).join('');
      }};
    });
    Object.keys(EXTRA).forEach(function(k){ SUB[k]=EXTRA[k]; });
  })();
  var SUB_KEYS=Object.keys(SUB);

  // ===== 文字：強制顯示注音（幼兒園適讀）=====
  function zyHtml(str){
    if(typeof window.zhuyinForceHtml==='function') return window.zhuyinForceHtml(str);
    return String(str);
  }
  function esc(s){ return String(s).replace(/[&<>]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[m];}); }


  function buildHeader(titleHtml, subHtml){
    var hd=document.createElement('div');
    hd.className='pre-a4-hd';
    hd.innerHTML='<div class="pre-a4-title"><b>'+titleHtml+'</b><span>'+subHtml+'</span></div>'+
      '<div class="pre-a4-info"><span>寶貝姓名：<span class="pre-name-box"></span></span><span>日期：　 月　 日</span><span>☆☆☆</span></div>';
    return hd;
  }


  function seeded(n){ var s=((n*9301+49297)%233280+233280)%233280; return function(){ s=(s*9301+49297)%233280; return s/233280; }; }
  function pickShuffled(arr, pIdx, salt){
    var idx=Array.from({length:arr.length},function(_,i){return i;});
    var round=Math.floor(pIdx/arr.length), pos=pIdx%arr.length;
    var r=seeded(round*7919+salt);
    for(var i=idx.length-1;i>0;i--){ var j=Math.floor(r()*(i+1)); var t=idx[i]; idx[i]=idx[j]; idx[j]=t; }
    return arr[idx[pos]];
  }

  // ===== 版面：整頁滿版、固定線寬（小圖不會糊）、全黑白 =====
  var W=746, H=990, INK='#222', NUMF='font-family="Arial Rounded MT Bold,Nunito,Arial,sans-serif" font-weight="700"';
  var BB=window.PRESCHOOL_BB||{}, DOTS={};
  Object.keys(window.PRESCHOOL_DOTS||{}).forEach(function(k){
    DOTS[k]=window.PRESCHOOL_DOTS[k].map(function(t){if(!t) return [];var n=t.split(',').map(Number),o=[];for(var i=0;i<n.length;i+=2)o.push([n[i],n[i+1]]);return o;});
  });
  var DOT_KEYS=Object.keys(DOTS);
  // 小圖只用內部簡單的圖形，縮小後仍清楚可數
  var MINI=['sun','star','apple','heart','balloon1','fish','flower','pear','mushroom','leaf','tulip','clover','cookie','carrot','bell','diamond','crown','ladybug','orange','lemon','peach','strawberry','donut','candy','cupcake','icecream','moon1','cloud1','raindrop','acorn','egg1','mitten','sock','hat','cup','gift','kite','drum','ghost','chick','duck','cat','bear','rabbit','pig','frog','snail','butterfly','turtle','whale','starfish','car','house','tree','umbrella','rocket','eggplant','radish','tomato','bun','bone','paw','lollipop','riceball'];
  var EXTRA_MINI={
    balloon1:function(c){return '<path d="M300 420 Q330 480 290 560" fill="none" '+c.p+'/><ellipse cx="300" cy="220" rx="165" ry="195" fill="#fff" '+c.p+'/>';},
    moon1:function(c){return '<path d="M380 70 A240 240 0 1 0 520 420 A190 190 0 0 1 380 70 Z" fill="#fff" '+c.p+'/>';},
    cloud1:function(c){return '<path d="M150 430 Q50 430 60 340 Q70 250 160 260 Q190 140 310 150 Q420 160 430 260 Q540 250 545 345 Q545 430 450 430 Z" fill="#fff" '+c.p+'/>';},
    egg1:function(c){return '<path d="M300 60 Q460 200 450 360 Q430 530 300 530 Q170 530 150 360 Q140 200 300 60 Z" fill="#fff" '+c.p+'/><path d="M160 310 L210 270 L260 310 L310 270 L360 310 L410 270 L445 305" fill="none" '+c.p+'/>';}
  };
  MINI=MINI.filter(function(k){return SUB[k]||EXTRA_MINI[k];});
  function ctx(sw){return {sw:sw,detail:0,p:'stroke="'+INK+'" stroke-width="'+sw.toFixed(1)+'" stroke-linejoin="round" stroke-linecap="round"',f:function(){return '#fff';}};}
  // 在 (cx,cy) 畫一個 size 見方的圖，線寬固定 px
  function art(k,cx,cy,w,h,px){
    var b=EXTRA_MINI[k]?[40,40,520,520]:(BB[k]||[40,40,520,520]);
    var s=Math.min(w/b[2],h/b[3]);
    return '<g transform="translate('+(cx-(b[0]+b[2]/2)*s).toFixed(1)+' '+(cy-(b[1]+b[3]/2)*s).toFixed(1)+') scale('+s.toFixed(4)+')">'+(EXTRA_MINI[k]?EXTRA_MINI[k](ctx(px/s)):SUB[k].draw(ctx(px/s)))+'</g>';
  }
  function line(x1,y1,x2,y2,w,da){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+INK+'" stroke-width="'+w+'" stroke-linecap="round"'+(da?' stroke-dasharray="'+da+'"':'')+'/>';}
  function rect(x,y,w,h,rx,sw,da){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="#fff" stroke="'+INK+'" stroke-width="'+sw+'"'+(da?' stroke-dasharray="'+da+'"':'')+'/>';}
  function circ(x,y,r,sw,fill){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+(fill||'#fff')+'" stroke="'+INK+'" stroke-width="'+sw+'"/>';}
  function num(t,x,y,fs){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" dominant-baseline="central" font-size="'+fs+'" '+NUMF+' fill="'+INK+'">'+t+'</text>';}
  var CORNERS=['star','heart','clover','leaf','raindrop','flower'];
  function sheet(title,sub,tip,inner,pIdx,foot){
    var pg=document.createElement('div');
    pg.className='a4 preschool-a4';
    pg.appendChild(Object.assign(document.createElement('div'),{className:'edge'}));
    pg.appendChild(buildHeader(title,sub));
    var ck=CORNERS[pIdx%CORNERS.length], cs='';
    [[34,34],[W-34,34],[34,H-34],[W-34,H-34]].forEach(function(p){cs+=art(ck,p[0],p[1],34,34,2);});
    var b=document.createElement('div');
    b.style.cssText='position:absolute;left:24px;top:92px;width:'+W+'px;height:'+H+'px';
    b.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" style="display:block">'+
      '<rect x="2" y="2" width="'+(W-4)+'" height="'+(H-4)+'" rx="26" fill="none" stroke="'+INK+'" stroke-width="3"/>'+
      '<path d="M62 12 H'+(W-62)+' M62 '+(H-12)+' H'+(W-62)+' M12 62 V'+(H-62)+' M'+(W-12)+' 62 V'+(H-62)+'" fill="none" stroke="'+INK+'" stroke-width="1.4"/>'+
      cs+inner+'</svg>'+
      '<div style="position:absolute;left:60px;right:60px;top:20px;text-align:center;font-size:27px;line-height:44px;white-space:nowrap">'+zyHtml(tip)+'</div>'+
      (foot?'<div style="position:absolute;left:64px;right:64px;bottom:24px;height:74px;display:flex;align-items:center;justify-content:center;gap:14px;font-size:32px;white-space:nowrap">'+foot+'</div>':'');
    pg.appendChild(b);
    return pg;
  }
  var salt=function(l){return l==='small'?101:(l==='mid'?202:303);};

  // ---- 著色本 ----
  function colorPage(pIdx,levelId,lvl){
    var key=pickShuffled(SUB_KEYS,pIdx,salt(levelId)), r=seeded(pIdx*71+salt(levelId)), s='', cy=470;
    var big=levelId==='small'?[640,720]:(levelId==='mid'?[560,640]:[480,520]);
    if(levelId==='large'){
      s+='<path d="M14 760 Q200 690 380 745 T'+(W-14)+' 735" fill="none" stroke="'+INK+'" stroke-width="3"/>';
      s+=art('cloud1',130,170,150,120,3)+art(r()<.5?'sun':'cloud1',W-140,175,150,140,3);
      [[110,815],[250,850],[W-250,850],[W-110,815]].forEach(function(p){s+=art(['flower','tulip','mushroom','clover','butterfly','snail'][Math.floor(r()*6)],p[0],p[1],84,96,2.8);});
      cy=480;
    }else if(levelId==='mid'){
      [[110,150],[W-110,150],[110,830],[W-110,830]].forEach(function(p){s+=art(MINI[Math.floor(r()*MINI.length)],p[0],p[1],92,92,3);});
    }
    s+=art(key,W/2,cy,big[0],big[1],levelId==='small'?8:(levelId==='mid'?6:5));
    return sheet('🖍️ 著色本｜'+lvl.name,'把圖畫塗上喜歡的顏色','我會著色，不塗出線外',s,pIdx,'<span>我塗的是</span><b style="font-size:46px">'+zyHtml(SUB[key].name)+'</b>');
  }

  // ---- 數字連連看 ----
  function dotLayout(key,levelId){
    var li=levelId==='small'?0:(levelId==='mid'?1:2), raw=DOTS[key][li+1], o=DOTS[key][0];
    var xs=o.map(function(p){return p[0];}), ys=o.map(function(p){return p[1];});
    var x0=Math.min.apply(0,xs),x1=Math.max.apply(0,xs),y0=Math.min.apply(0,ys),y1=Math.max.apply(0,ys);
    var b=BB[key]||[x0,y0,x1-x0,y1-y0];
    x0=Math.min(x0,b[0]);y0=Math.min(y0,b[1]);x1=Math.max(x1,b[0]+b[2]);y1=Math.max(y1,b[1]+b[3]);
    var k=Math.min(570/(x1-x0),650/(y1-y0)), ox=W/2-(x0+x1)/2*k, oy=470-(y0+y1)/2*k;
    var T=function(p){return [ox+p[0]*k,oy+p[1]*k];};
    return {pts:raw.map(T),out:o.map(T),k:k,ox:ox,oy:oy};
  }
  function inPoly(p,poly){for(var c=false,i=0,j=poly.length-1;i<poly.length;j=i++){var a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;}
  // 數字標籤：八個方向挑最不擁擠、優先在圖形外側的位置
  function dotLabels(L,fs){
    var put=[];
    return L.pts.map(function(p,i){
      var tw=fs*(i+1>=10?.62:.36), best=null;
      for(var a=0;a<16;a++)for(var d=0;d<2;d++){
        var t=a*Math.PI/8, R=10+(d?fs*1.05:fs*.75)+tw*.35*Math.abs(Math.cos(t)), q=[p[0]+Math.cos(t)*R,p[1]+Math.sin(t)*R], c=d*6;
        if(inPoly(q,L.out)) c+=9;
        L.pts.forEach(function(z,j){if(j!==i){var dx=Math.abs(z[0]-q[0])-tw-9,dy=Math.abs(z[1]-q[1])-fs*.45-9;if(dx<0&&dy<0)c+=80;else if(dx<6&&dy<6)c+=10;}});
        put.forEach(function(z){var dx=Math.abs(z[0]-q[0])-tw-z[2],dy=Math.abs(z[1]-q[1])-fs*.95;if(dx<2&&dy<0)c+=90;});
        if(q[0]-tw<22||q[0]+tw>W-22||q[1]<92||q[1]>H-112) c+=120;
        if(!best||c<best[0]) best=[c,q];
      }
      put.push([best[1][0],best[1][1],tw]); return best[1];
    });
  }
  function dotsPage(pIdx,levelId,lvl){
    var key=pickShuffled(DOT_KEYS,pIdx,salt(levelId)+300), L=dotLayout(key,levelId), n=L.pts.length;
    var fs=levelId==='small'?34:(levelId==='mid'?28:24), r=levelId==='small'?8:(levelId==='mid'?6.5:5.5);
    var path=function(ps){return 'M'+ps.map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' L')+' Z';};
    // 先畫好臉部、花紋等內部細節，再把外輪廓抹白換成數字點
    var s='<g transform="translate('+L.ox.toFixed(1)+' '+L.oy.toFixed(1)+') scale('+L.k.toFixed(4)+')">'+SUB[key].draw(ctx(3.2/L.k))+'</g>';
    s+='<path d="'+path(L.out)+'" fill="none" stroke="#fff" stroke-width="30" stroke-linejoin="round"/>';
    for(var ci=0,cv=DOTS[key][4];ci+1<cv.length;ci+=2) s+='<rect x="'+(L.ox+cv[ci][0]*L.k).toFixed(1)+'" y="'+(L.oy+cv[ci][1]*L.k).toFixed(1)+'" width="'+(cv[ci+1][0]*L.k).toFixed(1)+'" height="'+(cv[ci+1][1]*L.k).toFixed(1)+'" fill="#fff"/>';
    var lab=dotLabels(L,fs);
    L.pts.forEach(function(p,i){
      if(i===0) s+='<path d="'+starPath(p[0],p[1],r*2.3,r*1.05)+'" fill="'+INK+'"/>';
      else s+=circ(p[0].toFixed(1),p[1].toFixed(1),r,0,INK);
      s+='<text x="'+lab[i][0].toFixed(1)+'" y="'+lab[i][1].toFixed(1)+'" text-anchor="middle" dominant-baseline="central" font-size="'+fs+'" '+NUMF+' fill="'+INK+'" stroke="#fff" stroke-width="5" paint-order="stroke">'+(i+1)+'</text>';
    });
    var foot=levelId==='small'
      ? '<span>連好是</span><b style="font-size:40px">'+zyHtml(SUB[key].name)+'</b><svg viewBox="0 0 90 90" width="78" height="78">'+art(key,45,45,78,78,2.2)+'</svg>'
      : '<span>我連出來的是</span><span style="display:inline-block;width:250px;height:52px;border-bottom:3px solid '+INK+'"></span>';
    return sheet('🔢 數字連連看｜'+lvl.name,'從星星開始，照數字順序連線','從星星 1 開始連到 '+n+' 再著色',s,pIdx,foot);
  }

  // ---- 圖案排成整齊格子 ----
  function grid(k,n,x,y,w,h,maxS){
    var cols=n<=3?n:(n===4?2:(n<=6?3:(n<=8?4:5))), rows=Math.ceil(n/cols), cell=Math.min(w/cols,h/rows,maxS||999), sz=cell*.82, s='';
    for(var i=0;i<n;i++){
      var r=Math.floor(i/cols), inRow=r===rows-1?n-cols*(rows-1):cols;
      s+=art(k,x+w/2+((i%cols)-(inRow-1)/2)*cell,y+h/2+(r-(rows-1)/2)*cell,sz,sz,sz>=44?2.6:(sz>=32?2.1:1.8));
    }
    return s;
  }

  // ---- 加法列車 ----
  function trainSpec(pIdx,levelId){
    var r=seeded(pIdx*137+salt(levelId)*31), max=levelId==='small'?5:(levelId==='mid'?9:10), rows=levelId==='large'?5:4, out=[], seen={};
    while(out.length<rows){
      var sum=2+Math.floor(r()*(max-1)), a=1+Math.floor(r()*(sum-1)), sig=a+'+'+(sum-a);
      if(seen[sig]) continue; seen[sig]=1;
      var k=MINI[Math.floor(r()*MINI.length)];
      var miss=levelId==='large'&&out.length>=3;            // 大班後兩題：補上缺少的車廂
      out.push({a:a,b:sum-a,s:sum,k:k,miss:miss,loco:Math.floor(r()*4)});
    }
    return out;
  }
  function loco(x,y,w,h,v){
    var s='';
    if(v===0) s+=rect(x+w*.12,y+h*.32-32,24,36,3,3.4)+circ(x+w*.23,y+h*.32-46,8,2.6)+circ(x+w*.36,y+h*.32-60,11,2.6)+rect(x,y+h*.32,w,h*.68,10,3.6)+rect(x+w*.5,y-6,w*.5,h*.5,10,3.6)+rect(x+w*.62,y+8,w*.26,h*.24,5,3);
    else if(v===1) s+='<path d="M'+(x+w)+' '+(y+h)+' V'+(y+4)+' H'+(x+w*.5)+' Q'+(x+w*.1)+' '+(y+6)+' '+x+' '+(y+h*.75)+' V'+(y+h)+' Z" fill="#fff" stroke="'+INK+'" stroke-width="3.6" stroke-linejoin="round"/>'+rect(x+w*.46,y+h*.18,w*.2,h*.28,6,3)+rect(x+w*.72,y+h*.18,w*.2,h*.28,6,3)+line(x+6,y+h*.72,x+w,y+h*.72,2.6);
    else if(v===2) s+=rect(x,y,w,h,22,3.6)+circ(x+w*.32,y+h*.4,6,0,INK)+circ(x+w*.68,y+h*.4,6,0,INK)+'<path d="M'+(x+w*.34)+' '+(y+h*.6)+' Q'+(x+w*.5)+' '+(y+h*.8)+' '+(x+w*.66)+' '+(y+h*.6)+'" fill="none" stroke="'+INK+'" stroke-width="3.2" stroke-linecap="round"/>'+rect(x+w*.36,y-24,w*.28,24,5,3.4);
    else s+=rect(x,y+h*.2,w,h*.8,12,3.6)+'<path d="M'+(x-6)+' '+(y+h*.2)+' L'+(x+w*.18)+' '+(y-16)+' H'+(x+w*.82)+' L'+(x+w+6)+' '+(y+h*.2)+' Z" fill="#fff" stroke="'+INK+'" stroke-width="3.6" stroke-linejoin="round"/>'+rect(x+w*.14,y+h*.36,w*.3,h*.3,6,3)+rect(x+w*.56,y+h*.36,w*.3,h*.3,6,3);
    return s;
  }
  function trainPage(pIdx,levelId,lvl){
    var spec=trainSpec(pIdx,levelId), top=84, rowH=(H-top-58)/spec.length, ch=Math.min(rowH-96,118), s='';
    var lw=112,cw=180,op=38,aw=112,gp=14,x0=(W-(lw+gp+cw+op+cw+op+aw))/2;
    spec.forEach(function(t,i){
      var y=top+i*rowH+(rowH-ch)/2+14, wy=y+ch+4, x=x0;
      var wheels=function(x,w){return circ(x+26,wy,13,3.4)+circ(x+26,wy,3.5,0,INK)+circ(x+w-26,wy,13,3.4)+circ(x+w-26,wy,3.5,0,INK);};
      s+=line(x0-14,wy+17,x0+lw+gp+cw+op+cw+op+aw+14,wy+17,3);
      s+=num(i+1,x0-12,y-18,24);
      s+=line(x+lw,y+ch-16,x+lw+gp,y+ch-16,4)+loco(x,y,lw,ch,t.loco)+wheels(x,lw); x+=lw+gp;
      var car=function(n,w,hide){
        s+=rect(x,y,w,ch,14,3.6,hide?'9 8':'')+wheels(x,w);
        if(!hide&&n) s+=grid(t.k,n,x+8,y+8,w-16,ch-24,64);
        x+=w;
      };
      var sign=function(g){s+=num(g,x+op/2,y+ch/2,46); x+=op;};
      car(t.a,cw,false); sign('+'); car(t.b,cw,t.miss); sign('=');
      if(t.miss){ s+=rect(x,y,aw,ch,14,3.6)+wheels(x,aw)+num(t.s,x+aw/2,y+ch/2-4,64); x+=aw; } else car(0,aw,true);
    });
    return sheet('🚂 加法列車｜'+lvl.name,'數一數，寫出答案','合起來有幾個？寫在虛線裡',s,pIdx);
  }

  // ---- 數一數連連看（三種玩法輪替）----
  function countSpec(pIdx,levelId){
    var r=seeded(pIdx*193+salt(levelId)*47), max=levelId==='small'?5:(levelId==='mid'?8:10), rows=levelId==='small'?4:5;
    var sh=function(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;};
    var all=[];for(var i=1;i<=max;i++)all.push(i);
    var nums=sh(all).slice(0,rows), ks=sh(MINI).slice(0,rows), right=sh(nums);
    if(right.every(function(n,i){return n===nums[i];})) right.push(right.shift());
    return {mode:pIdx%3,nums:nums,ks:ks,right:right,opts:nums.map(function(n){var o=all.filter(function(z){return z!==n;});o=sh(o).sort(function(a,b){return Math.abs(a-n)-Math.abs(b-n);}).slice(0,2);return sh(o.concat(n));})};
  }
  function countPage(pIdx,levelId,lvl){
    var c=countSpec(pIdx,levelId), top=82, rowH=(H-top-54)/c.nums.length, s='', bx=44, bw=c.mode===1?380:350, bh=rowH-26;
    c.nums.forEach(function(n,i){
      var y=top+i*rowH+13, cy=y+bh/2;
      s+=rect(bx,y,bw,bh,20,3)+grid(c.ks[i],n,bx+12,y+10,bw-24,bh-20,92);
      if(c.mode===1){
        c.opts[i].forEach(function(o,j){s+=circ(bx+bw+62+j*92,cy,38,3)+num(o,bx+bw+62+j*92,cy+1,42);});
      }else{
        s+=circ(bx+bw+30,cy,9,0,INK)+circ(W-232,cy,9,0,INK);
        var m=c.right[i], rx=W-206, rw=162;
        if(c.mode===0) s+=rect(rx+18,cy-54,rw-40,108,20,3)+num(m,rx+18+(rw-40)/2,cy+2,72);
        else{ // 十格框
          var cs=30, gy=cy-cs;
          for(var t=0;t<10;t++){var cx=rx+(t%5)*cs, yy=gy+Math.floor(t/5)*cs;s+=rect(cx,yy,cs,cs,0,2.4)+(t<m?circ(cx+cs/2,yy+cs/2,10,0,INK):'');}
        }
      }
    });
    var tip=['數一數，連到正確的數字','數一數，圈出正確的數字','數一數，連到一樣多的格子'][c.mode];
    return sheet('🔗 數一數連連看｜'+lvl.name,'數量與數字對應',tip,s,pIdx);
  }

  // ---- 運筆描線 ----
  var PAIRS=[['bee','flower'],['rabbit','carrot'],['monkey','banana'],['cat','fish'],['mouse','cookie'],['car','house'],['rocket','planet'],['bear','honey'],['dog','bone'],['chick','nest'],['squirrel','acorn'],['butterfly','sunflower'],['penguin','fish'],['airplane','cloud'],['turtle','shell'],['snail','leaf'],['panda','bun'],['pig','apple'],['elephant','watermelon'],['ladybug','clover'],['ambulance','house'],['firetruck','house'],['ufo','star'],['ghost','candle'],['dragonfly','tulip'],['frog','raindrop'],['duck','bread'],['cow','milk'],['sheep','clover'],['hedgehog','mushroom'],['owl','moon'],['whale','anchor'],['octopus','starfish'],['giraffe','palm'],['dino','volcano'],['unicorn','rainbow'],['train','bridge'],['bus','trafficlight'],['policecar','castle'],['seal','beachball']].filter(function(p){return SUB[p[0]]&&SUB[p[1]];});
  var LINE_KINDS={small:['line','arc','dip','wave','hill','stairs'],mid:['wave','zig','hill','scallop','dip','castle','stairs','bump'],large:['zig','loop','castle','scallop','wave2','saw','bump','stairs','mountain','loop2']};
  function lineD(kind,x0,x1,y,A){
    var w=x1-x0, n, i, d='M'+x0+' ', sy=y, ey=y, f=function(v){return v.toFixed(1);};
    var rep=function(n,fn){var o='';for(var i=0;i<n;i++)o+=fn(x0+w/n*i,w/n,i);return o;};
    switch(kind){
      case 'line': return [d+y+' H'+x1,y,y];
      case 'arc': sy=ey=y+A; return [d+sy+' Q'+f(x0+w/2)+' '+f(y-A*2.6)+' '+x1+' '+ey,sy,ey];
      case 'dip': sy=ey=y-A; return [d+sy+' Q'+f(x0+w/2)+' '+f(y+A*2.6)+' '+x1+' '+ey,sy,ey];
      case 'wave': return [d+y+rep(2,function(x,s){return ' Q'+f(x+s/4)+' '+f(y-A*2)+' '+f(x+s/2)+' '+y+' Q'+f(x+s*.75)+' '+f(y+A*2)+' '+f(x+s)+' '+y;}),y,y];
      case 'wave2': return [d+y+rep(4,function(x,s){return ' Q'+f(x+s/4)+' '+f(y-A*2)+' '+f(x+s/2)+' '+y+' Q'+f(x+s*.75)+' '+f(y+A*2)+' '+f(x+s)+' '+y;}),y,y];
      case 'hill': sy=ey=y+A; return [d+sy+rep(3,function(x,s){return ' Q'+f(x+s/2)+' '+f(y-A*3)+' '+f(x+s)+' '+sy;}),sy,ey];
      case 'scallop': sy=ey=y+A; return [d+sy+rep(5,function(x,s){return ' A'+f(s/2)+' '+f(Math.min(s/2,A*2))+' 0 0 1 '+f(x+s)+' '+sy;}),sy,ey];
      case 'bump': sy=ey=y-A; return [d+sy+rep(5,function(x,s){return ' A'+f(s/2)+' '+f(Math.min(s/2,A*2))+' 0 0 0 '+f(x+s)+' '+sy;}),sy,ey];
      case 'zig': sy=ey=y+A; return [d+sy+rep(5,function(x,s){return ' L'+f(x+s/2)+' '+f(y-A)+' L'+f(x+s)+' '+sy;}),sy,ey];
      case 'mountain': sy=ey=y+A; return [d+sy+rep(3,function(x,s){return ' L'+f(x+s/2)+' '+f(y-A)+' L'+f(x+s)+' '+sy;}),sy,ey];
      case 'saw': sy=ey=y+A; return [d+sy+rep(6,function(x,s){return ' L'+f(x+s*.85)+' '+f(y-A)+' L'+f(x+s)+' '+sy;}),sy,ey];
      case 'castle': sy=ey=y+A; return [d+sy+rep(4,function(x,s){return ' H'+f(x+s*.25)+' V'+f(y-A)+' H'+f(x+s*.75)+' V'+sy+' H'+f(x+s);}),sy,ey];
      case 'stairs': sy=y+A; ey=y-A; return [d+sy+rep(4,function(x,s,i){return ' H'+f(x+s)+(i<3?' V'+f(sy-(i+1)*2*A/3):'');}),sy,ey];
      case 'loop2': n=3; break;
      default: n=5;
    }
    return [d+y+rep(n,function(x,s){return ' C'+f(x+s*1.05)+' '+f(y+A*.2)+' '+f(x+s*.95)+' '+f(y-A*1.9)+' '+f(x+s*.5)+' '+f(y-A*1.5)+' C'+f(x+s*.05)+' '+f(y-A*1.1)+' '+f(x+s*.25)+' '+f(y+A*.4)+' '+f(x+s)+' '+y;}),y,y];
  }
  function lineSpec(pIdx,levelId){
    var r=seeded(pIdx*241+salt(levelId)*53), n=levelId==='small'?3:4, kinds=LINE_KINDS[levelId], rows=[];
    for(var i=0;i<n;i++){
      var pr=pickShuffled(PAIRS,pIdx*n+i,salt(levelId)+9), kd;
      do{kd=kinds[Math.floor(r()*kinds.length)];}while(rows.length&&rows.some(function(z){return z.kind===kd;}));
      rows.push({kind:kd,a:pr[0],b:pr[1]});
    }
    return {rows:rows,shapes:[pickShuffled(DOT_KEYS,pIdx*2,salt(levelId)+77),pickShuffled(DOT_KEYS,pIdx*2+1,salt(levelId)+77)]};
  }
  function linePage(pIdx,levelId,lvl){
    var sp=lineSpec(pIdx,levelId), top=82, zone=520, rowH=zone/sp.rows.length, s='', tw=levelId==='small'?26:(levelId==='mid'?20:15);
    sp.rows.forEach(function(t,i){
      var y=top+i*rowH+rowH/2, x0=128,x1=W-128, L=lineD(t.kind,x0,x1,y,Math.min(rowH*.24,36));
      s+='<path d="'+L[0]+'" fill="none" stroke="#e4e4e4" stroke-width="'+tw+'" stroke-linejoin="round" stroke-linecap="round"/><path d="'+L[0]+'" fill="none" stroke="'+INK+'" stroke-width="3" stroke-dasharray="1 10" stroke-linecap="round" stroke-linejoin="round"/>';
      s+=circ(x0,L[1],tw/2+1,2.6)+circ(x0,L[1],4.5,0,INK);
      s+='<path d="M'+(x1+16)+' '+L[2]+' l-18 -11 v22 z" fill="'+INK+'"/>';
      s+=art(t.a,68,y,84,Math.min(88,rowH-14),2.8)+art(t.b,W-66,y,84,Math.min(88,rowH-14),2.8);
    });
    var y0=top+zone+14, h=H-y0-58, w=(W-84)/2;
    sp.shapes.forEach(function(k,i){
      var x=36+i*(w+12), o=DOTS[k][0], b=BB[k], sc=Math.min((w-70)/b[2],(h-90)/b[3]), ox=x+w/2-(b[0]+b[2]/2)*sc, oy=y0+(h-30)/2-(b[1]+b[3]/2)*sc;
      var P='M'+o.map(function(p){return (ox+p[0]*sc).toFixed(1)+' '+(oy+p[1]*sc).toFixed(1);}).join(' L')+' Z';
      s+=rect(x,y0,w,h,20,2.4);
      s+='<g transform="translate('+ox.toFixed(1)+' '+oy.toFixed(1)+') scale('+sc.toFixed(4)+')">'+SUB[k].draw(ctx(2.6/sc))+'</g><path d="'+P+'" fill="none" stroke="#fff" stroke-width="13" stroke-linejoin="round"/><path d="'+P+'" fill="none" stroke="'+INK+'" stroke-width="3" stroke-dasharray="8 8" stroke-linejoin="round"/>';
      s+='<text x="'+(x+w/2)+'" y="'+(y0+h-20)+'" text-anchor="middle" font-size="24" fill="'+INK+'" font-family="BiauKai,DFKai-SB,標楷體,serif">'+SUB[k].name+'</text>';
    });
    return sheet('✏️ 運筆描線｜'+lvl.name,'手部小肌肉與控筆練習','從圓點出發，沿虛線慢慢描',s,pIdx);
  }

  var TOPICS={
    color:{fn:colorPage,label:'🖍️ 著色本（黑白大圖輪廓＋注音圖名）',cn:'著色本',items:SUB_KEYS.length},
    dots:{fn:dotsPage,label:'🔢 數字連連看（黑白・照數字順序連線畫圖）',cn:'數字連連看',items:DOT_KEYS.length},
    train:{fn:trainPage,label:'🚂 加法列車（黑白・圖示加法）',cn:'加法列車',items:200},
    count:{fn:countPage,label:'🔗 數一數連連看（黑白・數量配對）',cn:'數一數連連看',items:200},
    line:{fn:linePage,label:'✏️ 運筆描線（黑白・虛線描畫）',cn:'運筆描線',items:200}
  };

  function buildPages(cfg, lvl){
    var levelId=cfg.level||'small', topic=cfg.topic, T=TOPICS[topic]||TOPICS.color;
    var sheets=Math.max(1,Math.min(30,+(cfg.sheets||1))), wantPages=sheets*2;
    var cpr=window.COPYRIGHT_STATEMENT||'🌻 向日葵國小伴學誌｜幼兒園適齡運筆啟蒙・專屬訂製請勿轉售';
    var wmText=cfg.wmText||'';
    var previewIdx=cfg.sampleLimit?Math.max(0,+(cfg.previewPageIdx||0)):-1;
    var pageIndices=Array.from({length:wantPages},function(_,i){return i;});
    if(Array.isArray(cfg.onlyPages)&&cfg.onlyPages.length){
      pageIndices=cfg.onlyPages.filter(function(i){return i>=0&&i<wantPages;});
      if(!pageIndices.length) pageIndices=[0];
    }else if(previewIdx>=0){
      var ps=previewIdx*2;
      pageIndices=[ps,ps+1].filter(function(i){return i<wantPages;});
      if(!pageIndices.length) pageIndices=[0];
    }
    var pages=pageIndices.map(function(pIdx){
      var pg=T.fn(pIdx,levelId,lvl,cfg);
      if(window.createWatermarkLayer) pg.appendChild(window.createWatermarkLayer(794,1122,wmText));
      var sNo=Math.floor(pIdx/2)+1, side=(pIdx%2===0)?'正面':'背面';
      var cap=document.createElement('div');
      cap.className='cap';
      cap.textContent=cpr+'　｜　幼兒園'+lvl.name+T.cn+'　第 '+sNo+' 張'+side+'（第 '+(pIdx+1)+'/'+wantPages+' 面）';
      pg.appendChild(cap);
      return pg;
    });
    return {pages:pages, level:lvl, topicLabel:T.label, itemCount:T.items, totalPages:wantPages, sheets:sheets, artMode:topic, topicCn:T.cn};
  }

  window.PRESCHOOL_ART={buildPages:buildPages,SUB:SUB,SUB_KEYS:SUB_KEYS,DOTS:DOTS,DOT_KEYS:DOT_KEYS,MINI:MINI,TOPICS:TOPICS,art:art,dotLayout:dotLayout,dotLabels:dotLabels,trainSpec:trainSpec,countSpec:countSpec,lineSpec:lineSpec,lineD:lineD,pickShuffled:pickShuffled,seeded:seeded};
})();
