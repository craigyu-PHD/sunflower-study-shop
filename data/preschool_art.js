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
      crab:{name:'螃蟹',draw:function(c){return pt(c,'M160 220 Q95 130 150 90 Q190 130 175 185 Q215 140 225 185 Z M440 220 Q505 130 450 90 Q410 130 425 185 Q385 140 375 185 Z')+el(c,300,350,175,120)+pt(c,'M135 340 L70 310 M130 385 L65 395 M145 430 L85 470 M465 340 L530 310 M470 385 L535 395 M455 430 L515 470','none')+face(c,245,355,320,375);}},
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

  function colorPage(pIdx, levelId, lvl, cfgCommon){
    var lvSalt = levelId==='small'?101:(levelId==='mid'?202:303);
    var key=pickShuffled(SUB_KEYS, pIdx, lvSalt);
    var round=Math.floor(pIdx/SUB_KEYS.length);
    var sub=SUB[key], c=mkCtx(false, levelId);
    var W=740, H=730;
    var pg=document.createElement('div');
    pg.className='a4 preschool-a4';
    pg.appendChild(Object.assign(document.createElement('div'),{className:'edge'}));
    pg.appendChild(buildHeader('🖍️ 向日葵幼兒園著色本｜'+lvl.name, lvl.stageTitle+'・把圖畫塗上喜歡的顏色'));
    var scale = levelId==='small' ? 1.12 : (levelId==='mid' ? 1.06 : 0.96);
    var ox=(W-600*scale)/2, oy=(H-600*scale)/2+(levelId==='large'?18:0);
    var deco='';
    if(levelId!=='small'){
      var cl=[[110,95,.55],[610,120,.5]]; if(round%2) cl=[[130,110,.5],[600,90,.6]];
      deco+=cl.map(function(a){return cloud(a[0],a[1],a[2],c);}).join('');
    }
    if(levelId==='large') deco+='<path d="'+starPath(80,640,34,15)+'" fill="#fff" stroke="#222" stroke-width="4"/><path d="'+starPath(670,650,28,12)+'" fill="#fff" stroke="#222" stroke-width="4"/>';
    var art='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'">'+
      '<rect x="3" y="3" width="'+(W-6)+'" height="'+(H-6)+'" rx="26" fill="#fff" stroke="#222" stroke-width="4" stroke-dasharray="14 10"/>'+
      deco+'<g transform="translate('+ox.toFixed(1)+' '+oy.toFixed(1)+') scale('+scale+')">'+sub.draw(c)+'</g></svg>';
    var artBox=document.createElement('div');
    artBox.style.cssText='position:absolute;left:27px;top:96px;width:'+W+'px;height:'+H+'px';
    artBox.innerHTML=art;
    pg.appendChild(artBox);
    // 圖名（含注音）＋黑白七色練習格
    var nameBox=document.createElement('div');
    nameBox.style.cssText='position:absolute;left:27px;top:846px;width:'+W+'px;text-align:center;font-size:44px;line-height:1.5;color:#222';
    nameBox.innerHTML='我塗的是：<b style="font-size:48px">'+zyHtml(sub.name)+'</b>';
    pg.appendChild(nameBox);
    var pal=document.createElement('div');
    pal.style.cssText='position:absolute;left:27px;top:942px;width:'+W+'px;display:flex;justify-content:space-around;align-items:center';
    pal.innerHTML=COLOR_NAMES.map(function(n){
      return '<div style="text-align:center"><div style="width:62px;height:62px;border:4px solid #222;border-radius:50%;background:#fff;margin:0 auto"></div><div style="font-size:26px;margin-top:2px">'+zyHtml(n)+'</div></div>';
    }).join('');
    pg.appendChild(pal);
    return pg;
  }

  // ===== 黑白（省印製成本）新題型 =====
  function frameSvg(inner,W,H){
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'"><rect x="3" y="3" width="'+(W-6)+'" height="'+(H-6)+'" rx="26" fill="#fff" stroke="#222" stroke-width="4" stroke-dasharray="14 10"/>'+inner+'</svg>';
  }
  function placeBox(pg,html,top,h,W){
    var b=document.createElement('div');
    b.style.cssText='position:absolute;left:27px;top:'+top+'px;width:'+(W||740)+'px;'+(h?'height:'+h+'px;':'');
    b.innerHTML=html; pg.appendChild(b); return b;
  }

  // ---- 1. 數字連連看：105+ 種圖案，點點依序連線畫出圖案 ----
  function heartPts(){ var p=[]; for(var i=0;i<12;i++){var t=i/12*2*Math.PI; p.push([300+16*Math.pow(Math.sin(t),3)*14, 300-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*14]);} return p; }
  var DOT_SHAPES=[
    {name:'星星',v:[[300,40],[360,210],[540,215],[395,320],[450,500],[300,395],[150,500],[205,320],[60,215],[240,210]]},
    {name:'房子',v:[[300,50],[540,260],[480,260],[480,520],[120,520],[120,260],[60,260]]},
    {name:'愛心',v:heartPts()},
    {name:'小魚',v:[[90,300],[200,190],[340,150],[460,220],[560,150],[560,450],[460,380],[340,450],[200,410]]},
    {name:'帆船',v:[[300,40],[480,380],[300,380],[300,40],[250,70],[110,380],[250,380],[300,380],[540,380],[470,520],[130,520],[60,380]]},
    {name:'火箭',v:[[300,30],[400,150],[400,420],[500,520],[400,500],[340,560],[260,560],[200,500],[100,520],[200,420],[200,150]]},
    {name:'大樹',v:[[300,40],[430,120],[500,240],[420,320],[360,330],[360,520],[240,520],[240,330],[180,320],[100,240],[170,120]]},
    {name:'皇冠',v:[[90,470],[60,170],[190,300],[300,120],[410,300],[540,170],[510,470]]}
  ];
  (function(){
    function polyPts(n,R,rot,sx,sy){
      var a0=(rot||-90)*Math.PI/180, v=[];
      for(var i=0;i<n;i++){var a=a0+i*2*Math.PI/n; v.push([Math.round(300+Math.cos(a)*R*(sx||1)), Math.round(300+Math.sin(a)*R*(sy||1))]);}
      return v;
    }
    function starPts(n,R,r,rot){
      var a0=(rot||-90)*Math.PI/180, v=[];
      for(var i=0;i<n*2;i++){var a=a0+i*Math.PI/n, rr=i%2?r:R; v.push([Math.round(300+Math.cos(a)*rr), Math.round(300+Math.sin(a)*rr)]);}
      return v;
    }
    var cur=[
      {name:'鑽石',v:[[170,120],[430,120],[540,240],[300,520],[60,240]]},
      {name:'蝴蝶結',v:[[80,140],[260,260],[340,260],[520,140],[520,460],[340,340],[260,340],[80,460]]},
      {name:'城堡',v:[[100,520],[100,200],[180,100],[260,200],[260,270],[340,270],[340,200],[420,100],[500,200],[500,520]]},
      {name:'聖誕樹',v:[[300,50],[420,200],[350,200],[470,340],[380,340],[510,470],[340,470],[340,540],[260,540],[260,470],[90,470],[220,340],[130,340],[250,200],[180,200]]},
      {name:'傘',v:[[70,290],[180,140],[300,90],[420,140],[530,290],[360,290],[320,290],[320,490],[250,530],[220,460],[275,460],[275,290]]},
      {name:'禮物盒',v:[[120,200],[240,200],[180,100],[300,150],[420,100],[360,200],[480,200],[480,500],[120,500]]},
      {name:'風箏',v:[[300,60],[490,230],[300,450],[360,540],[240,540],[300,450],[110,230]]},
      {name:'獎盃',v:[[140,100],[460,100],[430,290],[340,360],[340,460],[440,460],[440,520],[160,520],[160,460],[260,460],[260,360],[170,290]]},
      {name:'鈴鐺',v:[[300,70],[390,140],[450,360],[510,440],[360,440],[300,520],[240,440],[90,440],[150,360],[210,140]]},
      {name:'箭頭',v:[[300,60],[510,260],[380,260],[380,520],[220,520],[220,260],[90,260]]},
      {name:'盾牌',v:[[110,100],[490,100],[490,320],[300,530],[110,320]]},
      {name:'閃電',v:[[340,50],[150,300],[290,300],[220,540],[450,250],[310,250]]},
      {name:'冰棒',v:[[200,80],[400,80],[430,360],[330,360],[330,530],[270,530],[270,360],[170,360]]},
      {name:'蘋果',v:[[300,140],[420,110],[510,230],[470,450],[360,520],[300,480],[240,520],[130,450],[90,230],[180,110]]},
      {name:'花瓶',v:[[200,90],[400,90],[350,200],[460,350],[410,520],[190,520],[140,350],[250,200]]},
      {name:'帳篷',v:[[300,90],[520,480],[360,480],[300,310],[240,480],[80,480]]},
      {name:'燈塔',v:[[240,120],[300,60],[360,120],[410,510],[190,510]]},
      {name:'機器人',v:[[180,100],[420,100],[420,230],[500,270],[480,490],[120,490],[100,270],[180,230]]},
      {name:'鯨魚',v:[[80,320],[160,170],[360,170],[450,260],[540,170],[510,320],[540,450],[430,380],[320,440],[140,420]]},
      {name:'企鵝',v:[[300,70],[420,150],[490,330],[420,490],[180,490],[110,330],[180,150]]},
      {name:'貓頭',v:[[130,220],[130,90],[240,160],[360,160],[470,90],[470,220],[500,360],[300,490],[100,360]]},
      {name:'兔頭',v:[[180,230],[160,70],[240,70],[270,200],[330,200],[360,70],[440,70],[420,230],[470,380],[300,490],[130,380]]},
      {name:'小熊',v:[[140,180],[120,90],[210,120],[390,120],[480,90],[460,180],[500,350],[300,490],[100,350]]},
      {name:'太陽',v:starPts(10,240,165,0)},
      {name:'花朵',v:starPts(8,235,145,22)},
      {name:'雪花',v:starPts(6,245,115,0)},
      {name:'十字',v:[[230,70],[370,70],[370,230],[530,230],[530,370],[370,370],[370,530],[230,530],[230,370],[70,370],[70,230],[230,230]]},
      {name:'沙漏',v:[[120,90],[480,90],[330,300],[480,510],[120,510],[270,300]]},
      {name:'酒杯',v:[[140,90],[460,90],[420,270],[330,330],[330,470],[420,520],[180,520],[270,470],[270,330],[180,270]]},
      {name:'帽子',v:[[200,130],[400,130],[430,330],[540,390],[60,390],[170,330]]},
      {name:'靴子',v:[[170,90],[330,90],[330,340],[490,370],[490,490],[150,490]]},
      {name:'茶壺',v:[[170,150],[410,150],[490,230],[490,360],[410,470],[160,470],[90,300]]},
      {name:'信封',v:[[80,150],[520,150],[520,450],[80,450]]},
      {name:'小車',v:[[90,320],[170,200],[400,200],[470,310],[540,350],[540,440],[60,440],[60,350]]},
      {name:'飛機',v:[[300,60],[360,210],[540,310],[350,340],[340,470],[430,520],[170,520],[260,470],[250,340],[60,310],[240,210]]}
    ];
    cur.forEach(function(o){ DOT_SHAPES.push(o); });
    // 幾何多邊形與星芒家族（湊足 105+ 種且點距安全）
    var sideNames=['三角形','正方形','五邊形','六邊形','七邊形','八邊形','九邊形','十邊形','十一邊形','十二邊形'];
    for(var s=3;s<=12;s++){
      DOT_SHAPES.push({name:sideNames[s-3],v:polyPts(s,225,-90)});
      DOT_SHAPES.push({name:'寬'+sideNames[s-3],v:polyPts(s,210,-90+180/s,1.12,0.88)});
      DOT_SHAPES.push({name:'高'+sideNames[s-3],v:polyPts(s,210,-45,0.88,1.12)});
    }
    var starCounts=[4,5,6,7,8,9,10];
    starCounts.forEach(function(n){
      DOT_SHAPES.push({name:n+'角星',v:starPts(n,240,105,-90)});
      DOT_SHAPES.push({name:'胖'+n+'角星',v:starPts(n,235,145,-90+180/n)});
      DOT_SHAPES.push({name:'尖'+n+'角星',v:starPts(n,245,82,-75)});
      DOT_SHAPES.push({name:'閃亮'+n+'角星',v:starPts(n,230,125,-60)});
    });
    // 變形寶石與徽章
    for(var g=0;g<12;g++){
      var rIn=95+(g%4)*22, rot=-90+g*15;
      DOT_SHAPES.push({name:'徽章'+(g+1),v:starPts(5+(g%4),235,rIn,rot)});
    }
  })();

  function dotPoints(shape,N){
    var v=shape.v,k=v.length,cnt=[],segs=[];
    for(var i=0;i<k;i++){var a=v[i],b=v[(i+1)%k];segs.push(Math.hypot(a[0]-b[0],a[1]-b[1]));cnt.push(0);}
    var extra=Math.max(0,N-k);
    for(var e=0;e<extra;e++){var bi=0,bv=-1;for(var j=0;j<k;j++){var val=segs[j]/(cnt[j]+1);if(val>bv){bv=val;bi=j;}}cnt[bi]++;}
    var pts=[];
    for(var i2=0;i2<k;i2++){var a2=v[i2],b2=v[(i2+1)%k];for(var m=0;m<=cnt[i2];m++){var t=m/(cnt[i2]+1);pts.push([a2[0]+(b2[0]-a2[0])*t,a2[1]+(b2[1]-a2[1])*t]);}}
    return pts;
  }
  function dotsPage(pIdx,levelId,lvl){
    var lvSalt = levelId==='small'?401:(levelId==='mid'?502:603);
    var shape=pickShuffled(DOT_SHAPES, pIdx, lvSalt);
    var N={small:10,mid:16,large:24}[levelId];
    var pts=dotPoints(shape,Math.max(N,shape.v.length));
    var W=740,H=730,sc=1.1,ox=(W-600*sc)/2,oy=(H-600*sc)/2;
    var fs=levelId==='small'?34:(levelId==='mid'?28:24), r=levelId==='small'?13:(levelId==='mid'?10:8);
    var g='';
    pts.forEach(function(p,i){
      var x=ox+p[0]*sc,y=oy+p[1]*sc;
      var dx=x-W/2,dy=y-H/2,d=Math.hypot(dx,dy)||1,tx=x+dx/d*(r+fs*0.7),ty=y+dy/d*(r+fs*0.7)+fs*0.35;
      g+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r+'" fill="'+(i===0?'#222':'#fff')+'" stroke="#222" stroke-width="3.5"/>';
      g+='<text x="'+tx.toFixed(1)+'" y="'+ty.toFixed(1)+'" text-anchor="middle" font-size="'+fs+'" font-weight="700" font-family="Arial Rounded MT Bold,Arial,sans-serif" fill="#111">'+(i+1)+'</text>';
    });
    var pg=newPage();
    pg.appendChild(buildHeader('🔢 向日葵數字連連看｜'+lvl.name,lvl.stageTitle+'・照著數字順序連一連'));
    placeBox(pg,frameSvg(g,W,H),96,H);
    placeBox(pg,'<div style="text-align:center;font-size:42px;line-height:1.5">從 <b>1</b> 連到 <b>'+pts.length+'</b>，猜猜看是什麼？</div>',846,0);
    placeBox(pg,'<div style="text-align:center;font-size:34px;color:#444">答案：<span style="display:inline-block;width:260px;border-bottom:4px solid #222">&nbsp;</span></div>',944,0);
    return pg;
  }

  // ---- 共用黑白幾何／可愛小圖示繪製（數一數與加法列車共用，20+ 種）----
  function miniShapeSvg(kind,cx,cy,r){
    var st='fill="#fff" stroke="#222" stroke-width="3.2" stroke-linejoin="round"';
    if(kind===0) return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" '+st+'/>';
    if(kind===1) return '<path d="'+starPath(cx,cy,r*1.12,r*.48)+'" '+st+'/>';
    if(kind===2) return '<path d="M'+cx+' '+(cy-r)+' L'+(cx+r)+' '+(cy+r*.85)+' L'+(cx-r)+' '+(cy+r*.85)+' Z" '+st+'/>';
    if(kind===3) return '<rect x="'+(cx-r*.85)+'" y="'+(cy-r*.85)+'" width="'+(r*1.7)+'" height="'+(r*1.7)+'" rx="4" '+st+'/>';
    if(kind===4) return '<path d="M'+cx+' '+(cy-r)+' L'+(cx+r*.9)+' '+cy+' L'+cx+' '+(cy+r)+' L'+(cx-r*.9)+' '+cy+' Z" '+st+'/>';
    if(kind===5) return '<path d="M'+cx+' '+(cy+r*.85)+' Q'+(cx-r*1.1)+' '+(cy+r*.1)+' '+(cx-r*.95)+' '+(cy-r*.35)+' A'+(r*.5)+' '+(r*.5)+' 0 0 1 '+cx+' '+(cy-r*.35)+' A'+(r*.5)+' '+(r*.5)+' 0 0 1 '+(cx+r*.95)+' '+(cy-r*.35)+' Q'+(cx+r*1.1)+' '+(cy+r*.1)+' '+cx+' '+(cy+r*.85)+' Z" '+st+'/>';
    if(kind===6){var pts=[];for(var i=0;i<6;i++){var a=i*Math.PI/3;pts.push((cx+Math.cos(a)*r).toFixed(1)+' '+(cy+Math.sin(a)*r).toFixed(1));}return '<path d="M'+pts.join(' L')+' Z" '+st+'/>';}
    if(kind===7){var pts2=[];for(var j=0;j<5;j++){var a2=-Math.PI/2+j*2*Math.PI/5;pts2.push((cx+Math.cos(a2)*r).toFixed(1)+' '+(cy+Math.sin(a2)*r).toFixed(1));}return '<path d="M'+pts2.join(' L')+' Z" '+st+'/>';}
    if(kind===8) return '<path d="M'+(cx+r*.3)+' '+(cy-r*.9)+' A'+(r*.9)+' '+(r*.9)+' 0 1 0 '+(cx+r*.7)+' '+(cy+r*.7)+' A'+(r*.65)+' '+(r*.65)+' 0 1 1 '+(cx+r*.3)+' '+(cy-r*.9)+' Z" '+st+'/>';
    if(kind===9) return '<path d="M'+(cx-r*.35)+' '+(cy-r*.9)+' H'+(cx+r*.35)+' V'+(cy-r*.35)+' H'+(cx+r*.9)+' V'+(cy+r*.35)+' H'+(cx+r*.35)+' V'+(cy+r*.9)+' H'+(cx-r*.35)+' V'+(cy+r*.35)+' H'+(cx-r*.9)+' V'+(cy-r*.35)+' H'+(cx-r*.35)+' Z" '+st+'/>';
    if(kind===10) return '<path d="M'+(cx-r*.65)+' '+(cy+r*.35)+' Q'+(cx-r*1.05)+' '+(cy+r*.35)+' '+(cx-r*.9)+' 0 Q'+(cx-r*.8)+' '+(cy-r*.45)+' '+(cx-r*.4)+' '+(cy-r*.35)+' Q'+cx+' '+(cy-r*.95)+' '+(cx+r*.45)+' '+(cy-r*.35)+' Q'+(cx+r*.95)+' '+(cy-r*.4)+' '+(cx+r*.9)+' '+cy+' Q'+(cx+r*1.05)+' '+(cy+r*.35)+' '+(cx+r*.65)+' '+(cy+r*.35)+' Z" '+st+'/>'.replace(' '+(cx-r*.9)+' 0 ',' '+(cx-r*.9)+' '+cy+' ');
    if(kind===11) return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+(r*.95)+'" ry="'+(r*.65)+'" '+st+'/><circle cx="'+cx+'" cy="'+cy+'" r="'+(r*.28)+'" '+st+'/>';
    if(kind===12) return '<path d="M'+(cx-r*.8)+' '+(cy+r*.7)+' Q'+(cx-r*.8)+' '+(cy-r*.7)+' '+cx+' '+(cy-r*.8)+' Q'+(cx+r*.8)+' '+(cy-r*.7)+' '+(cx+r*.8)+' '+(cy+r*.7)+' Z M'+cx+' '+(cy-r*.8)+' V'+(cy+r*.95)+'" '+st+'/>';
    if(kind===13) return '<path d="M'+(cx-r*.85)+' '+cy+' Q'+(cx-r*.2)+' '+(cy-r*.75)+' '+(cx+r*.4)+' '+cy+' L'+(cx+r*.9)+' '+(cy-r*.55)+' V'+(cy+r*.55)+' L'+(cx+r*.4)+' '+cy+' Q'+(cx-r*.2)+' '+(cy+r*.75)+' '+(cx-r*.85)+' '+cy+' Z" '+st+'/>';
    if(kind===14) return '<path d="M'+(cx-r*.8)+' '+(cy+r*.7)+' L'+(cx-r*.9)+' '+(cy-r*.6)+' L'+(cx-r*.35)+' '+cy+' L'+cx+' '+(cy-r*.75)+' L'+(cx+r*.35)+' '+cy+' L'+(cx+r*.9)+' '+(cy-r*.6)+' L'+(cx+r*.8)+' '+(cy+r*.7)+' Z" '+st+'/>';
    if(kind===15) return '<path d="M'+(cx-r*.85)+' '+(cy-r*.2)+' L'+cx+' '+(cy-r*.9)+' L'+(cx+r*.85)+' '+(cy-r*.2)+' V'+(cy+r*.85)+' H'+(cx-r*.85)+' Z" '+st+'/>';
    if(kind===16) return '<path d="M'+cx+' '+(cy-r*.9)+' Q'+(cx+r*.9)+' '+(cy-r*.9)+' '+(cx+r*.8)+' '+(cy+r*.1)+' Q'+cx+' '+(cy+r*.9)+' '+(cx-r*.8)+' '+(cy+r*.1)+' Q'+(cx-r*.9)+' '+(cy-r*.9)+' '+cx+' '+(cy-r*.9)+' Z" '+st+'/>';
    if(kind===17) return '<path d="M'+(cx-r*.6)+' '+(cy+r*.5)+' Q'+(cx-r*.45)+' '+(cy-r*.65)+' '+cx+' '+(cy-r*.75)+' Q'+(cx+r*.45)+' '+(cy-r*.65)+' '+(cx+r*.6)+' '+(cy+r*.5)+' H'+(cx-r*.6)+' Z" '+st+'/><circle cx="'+cx+'" cy="'+(cy+r*.72)+'" r="'+(r*.2)+'" '+st+'/>';
    if(kind===18){var o='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*.52)+'" '+st+'/>';for(var k=0;k<8;k++){var a3=k*Math.PI/4;o+='<line x1="'+(cx+Math.cos(a3)*r*.65).toFixed(1)+'" y1="'+(cy+Math.sin(a3)*r*.65).toFixed(1)+'" x2="'+(cx+Math.cos(a3)*r*.95).toFixed(1)+'" y2="'+(cy+Math.sin(a3)*r*.95).toFixed(1)+'" stroke="#222" stroke-width="2.5" stroke-linecap="round"/>';}return o;}
    return '<path d="M'+(cx-r*.75)+' '+(cy+r*.65)+' Q'+(cx-r*.75)+' '+(cy-r*.75)+' '+cx+' '+(cy-r*.85)+' Q'+(cx+r*.75)+' '+(cy-r*.75)+' '+(cx+r*.75)+' '+(cy+r*.65)+' L'+cx+' '+(cy+r*.9)+' Z" '+st+'/>';
  }

  // ---- 2. 加法列車（黑白、整體水平＋垂直精準置中、車廂內奇數圖形對稱置中、100+ 種隨機搭配）----
  function trainPage(pIdx,levelId,lvl){
    var rnd=seeded(pIdx*137+levelId.charCodeAt(0)*31+7), maxS=levelId==='small'?5:10, rows=levelId==='small'?4:(levelId==='mid'?6:7);
    var W=740, H=740, padY=10, rowH=Math.floor((H-padY*2)/rows), s='';
    var cw=114, locoGap=18, opW=50, gap=8;
    var totalW = cw + locoGap + cw + gap + opW + cw + gap + opW + cw;
    var startX = Math.round((W - totalW) / 2); // 精準水平置中（左右各 75px）
    var dotKindBase = Math.floor(rnd() * 20);
    var locoStyle = pIdx % 3; // 三種黑白車頭造型輪替
    function dots(n,x,y,w,h,knd){
      var o='',cols=n<=3?n:Math.ceil(n/2),rws=n<=3?1:2,gy=h/(rws+1);
      var dr = cols>=5 ? 8.5 : (cols===4 ? 9.5 : (cols===3 ? 10.5 : (levelId==='small'?12:10)));
      var gx = cols<=1 ? 0 : Math.min(34, (w - dr*2 - 16) / (cols - 1));
      for(var i=0;i<n;i++){
        var c=i%cols,r2=Math.floor(i/cols);
        var rowCnt = (r2===1) ? (n - cols) : Math.min(cols, n);
        var rowStartX = x + (w - (rowCnt - 1) * gx) / 2;
        o+=miniShapeSvg(knd, rowStartX + c*gx, y+gy*(r2+1), dr);
      }
      return o;
    }
    for(var r=0;r<rows;r++){
      var a=1+Math.floor(rnd()*(maxS-1)), b=1+Math.floor(rnd()*(maxS-a)); if(a+b>maxS){b=maxS-a;} if(b<1){b=1;a=Math.max(1,maxS-1);}
      var rowTop = padY + r*rowH;
      var topRoom = 22, botRoom = 15;
      var ch = Math.min(rowH - topRoom - botRoom - 14, 92);
      var totalTrainH = topRoom + ch + botRoom;
      var boxTop = rowTop + Math.round((rowH - totalTrainH) / 2) + topRoom; // 精準垂直置中於每一列
      var midY = boxTop + ch / 2;
      var wheelY = boxTop + ch + 2;
      var x = startX;
      var rowKind = (dotKindBase + r * 3) % 20;
      // 火車頭（置中起點）
      s+='<rect x="'+x+'" y="'+boxTop+'" width="'+cw+'" height="'+ch+'" rx="12" fill="#fff" stroke="#222" stroke-width="4"/>';
      if(locoStyle===0){
        s+='<rect x="'+(x+14)+'" y="'+(boxTop-22)+'" width="24" height="22" fill="#fff" stroke="#222" stroke-width="4"/><circle cx="'+(x+cw-32)+'" cy="'+(boxTop+24)+'" r="18" fill="#fff" stroke="#222" stroke-width="4"/>';
      }else if(locoStyle===1){
        s+='<path d="M'+(x+12)+' '+boxTop+' L'+(x+38)+' '+(boxTop-20)+' H'+(x+cw-16)+' L'+(x+cw-8)+' '+boxTop+' Z" fill="#fff" stroke="#222" stroke-width="4"/><rect x="'+(x+24)+'" y="'+(boxTop+14)+'" width="36" height="24" rx="5" fill="#fff" stroke="#222" stroke-width="3"/>';
      }else{
        s+='<circle cx="'+(x+28)+'" cy="'+(boxTop-10)+'" r="12" fill="#fff" stroke="#222" stroke-width="3.5"/><rect x="'+(x+cw-46)+'" y="'+(boxTop+14)+'" width="30" height="26" rx="5" fill="#fff" stroke="#222" stroke-width="3"/>';
      }
      s+='<circle cx="'+(x+26)+'" cy="'+wheelY+'" r="13" fill="#fff" stroke="#222" stroke-width="4"/><circle cx="'+(x+cw-26)+'" cy="'+wheelY+'" r="13" fill="#fff" stroke="#222" stroke-width="4"/>';
      var parts=[[a,'a'],['＋','op'],[b,'b'],['＝','eq'],['','ans']], cx=x+cw+locoGap;
      parts.forEach(function(pt){
        if(pt[1]==='op'||pt[1]==='eq'){
          s+='<text x="'+(cx+opW/2)+'" y="'+midY+'" text-anchor="middle" dominant-baseline="central" font-size="44" font-weight="700" fill="#222">'+pt[0]+'</text>';
          cx+=opW;
          return;
        }
        s+='<line x1="'+(cx-(pt[1]==='a'?locoGap:gap))+'" y1="'+midY+'" x2="'+cx+'" y2="'+midY+'" stroke="#222" stroke-width="4"/>';
        s+='<rect x="'+cx+'" y="'+boxTop+'" width="'+cw+'" height="'+ch+'" rx="10" fill="#fff" stroke="#222" stroke-width="4" '+(pt[1]==='ans'?'stroke-dasharray="10 8"':'')+'/>';
        if(pt[1]!=='ans') s+=dots(pt[0],cx,boxTop,cw,ch,rowKind);
        s+='<circle cx="'+(cx+26)+'" cy="'+wheelY+'" r="13" fill="#fff" stroke="#222" stroke-width="4"/><circle cx="'+(cx+cw-26)+'" cy="'+wheelY+'" r="13" fill="#fff" stroke="#222" stroke-width="4"/>';
        cx+=cw+gap;
      });
      if(r<rows-1) s+='<path d="M24 '+(rowTop+rowH)+' H'+(W-24)+'" stroke="#ccc" stroke-width="2" stroke-dasharray="6 6"/>';
    }
    var pg=newPage();
    pg.appendChild(buildHeader('向日葵加法列車｜'+lvl.name,lvl.stageTitle+'・數一數圖形，寫出一共有幾個'));
    placeBox(pg,frameSvg(s,W,H),96,H);
    placeBox(pg,'<div style="text-align:center;font-size:36px;line-height:1.6">火車開囉！在虛線車廂裡寫上答案</div>',860,0);
    return pg;
  }

  // ---- 3. 數一數連連看（黑白、20 種圖形隨機搭配）----
  function countPage(pIdx,levelId,lvl){
    var rnd=seeded(pIdx*193+levelId.charCodeAt(0)*47+31), maxN=levelId==='small'?5:(levelId==='mid'?8:10), rows=levelId==='small'?4:5;
    var nums=[]; while(nums.length<rows){var n=1+Math.floor(rnd()*maxN); if(nums.indexOf(n)<0) nums.push(n);}
    var right=nums.slice().sort(function(){return rnd()-.5;});
    var shapePool=Array.from({length:20},function(_,i){return i;});
    for(var si=shapePool.length-1;si>0;si--){var sj=Math.floor(rnd()*(si+1));var tmp=shapePool[si];shapePool[si]=shapePool[sj];shapePool[sj]=tmp;}
    var W=740,H=720,rowH=H/rows,s='';
    nums.forEach(function(n,i){
      var cy=rowH*i+rowH/2, kind=shapePool[i%shapePool.length], r=levelId==='small'?25:19, per=5, gx=r*2+12;
      for(var k=0;k<n;k++){ s+=miniShapeSvg(kind,60+(k%per)*gx+r,cy+(n>per?(k<per?-r-4:r+4):0),r); }
      s+='<circle cx="400" cy="'+cy+'" r="11" fill="#222"/>';
    });
    right.forEach(function(n,i){
      var cy=rowH*i+rowH/2;
      s+='<circle cx="560" cy="'+cy+'" r="11" fill="#222"/><text x="650" y="'+(cy+22)+'" text-anchor="middle" font-size="72" font-weight="700" font-family="Arial Rounded MT Bold,Arial,sans-serif" fill="#111">'+n+'</text>';
    });
    var pg=newPage();
    pg.appendChild(buildHeader('🔗 向日葵數一數連連看｜'+lvl.name,lvl.stageTitle+'・數一數，連到正確的數字'));
    placeBox(pg,frameSvg(s,W,H),96,H);
    placeBox(pg,'<div style="text-align:center;font-size:38px;line-height:1.6">左邊有幾個？用線連到右邊的數字。</div>',840,0);
    return pg;
  }

  // ---- 4. 運筆描線（黑白、16 種線型 × 109 種黑白起終點小圖隨機配對）----
  function linePage(pIdx,levelId,lvl){
    var kinds=levelId==='small'
      ?['line','wave','arc','stairs','mountain','cloudBounce']
      :(levelId==='mid'?['wave','zig','arc','loop','scallop','castle','stairs','mountain','doubleWave','bunnyHop']
      :['zig','loop','spiral','wave','scallop','castle','stairs','mountain','doubleWave','bunnyHop','heartBeat','fig8','dashArc','cloudBounce','stepWave','saw']);
    var rnd=seeded(pIdx*241+levelId.charCodeAt(0)*53+19);
    var rows=levelId==='small'?6:8, W=740, rowH=720/rows, s='';
    var cMini=mkCtx(false,'small');
    for(var r=0;r<rows;r++){
      var kind=kinds[Math.floor(rnd()*kinds.length)], y=rowH*r+rowH/2, x0=92, x1=648, d='', amp=rowH*0.26;
      var sy=y, ey=y;
      if(kind==='line'){ d='M'+x0+' '+y+' H'+x1; }
      else if(kind==='wave'){ d='M'+x0+' '+y+' C'+(x0+55)+' '+(y-amp*2)+' '+(x0+130)+' '+(y-amp*2)+' '+(x0+185)+' '+y+' S'+(x0+315)+' '+(y+amp*2)+' '+(x0+370)+' '+y+' S'+(x0+500)+' '+(y-amp*2)+' '+x1+' '+y; }
      else if(kind==='doubleWave'){ d='M'+x0+' '+y; var dwStep=(x1-x0)/6; for(var dw=0;dw<6;dw++){var xw=x0+dw*dwStep; d+=' Q'+(xw+dwStep*0.25)+' '+(y-amp*1.8)+' '+(xw+dwStep*0.5)+' '+y+' Q'+(xw+dwStep*0.75)+' '+(y+amp*1.8)+' '+(xw+dwStep)+' '+y;} }
      else if(kind==='zig'){ sy=y+amp; d='M'+x0+' '+sy; var zStep=(x1-x0)/6; for(var j=1;j<=6;j++){ey=y+(j%2?-amp:amp); d+=' L'+(x0+j*zStep).toFixed(1)+' '+ey;} }
      else if(kind==='saw'){ sy=y+amp; d='M'+x0+' '+sy; var sStep=(x1-x0)/6; for(var sw=0;sw<6;sw++){var xs=x0+sw*sStep; d+=' L'+(xs+sStep*0.8).toFixed(1)+' '+(y-amp)+' L'+(xs+sStep).toFixed(1)+' '+(y+amp);} ey=y+amp; }
      else if(kind==='arc'){ sy=y+amp; ey=y+amp; d='M'+x0+' '+sy+' Q'+((x0+x1)/2)+' '+(y-amp*2.2)+' '+x1+' '+ey; }
      else if(kind==='dashArc'){ sy=y-amp; ey=y-amp; d='M'+x0+' '+sy+' Q'+((x0+x1)/2)+' '+(y+amp*2.2)+' '+x1+' '+ey; }
      else if(kind==='loop'){ d='M'+x0+' '+y; var lStep=(x1-x0)/4; for(var k=0;k<4;k++){var xa2=x0+k*lStep; d+=' C'+(xa2+lStep*0.6)+' '+(y-amp*2.2)+' '+(xa2+lStep*0.6)+' '+(y+amp*2.2)+' '+(xa2+lStep*0.2)+' '+y+' S'+(xa2+lStep*0.8)+' '+(y-amp*.2)+' '+(xa2+lStep)+' '+y;} }
      else if(kind==='scallop'||kind==='bunnyHop'){ sy=y+amp*0.6; ey=sy; d='M'+x0+' '+sy; var scStep=(x1-x0)/6; for(var m=0;m<6;m++) d+=' Q'+(x0+m*scStep+scStep/2).toFixed(1)+' '+(y-amp*1.9)+' '+(x0+(m+1)*scStep).toFixed(1)+' '+sy; }
      else if(kind==='cloudBounce'){ sy=y-amp*0.5; ey=sy; d='M'+x0+' '+sy; var cbStep=(x1-x0)/6; for(var cb=0;cb<6;cb++) d+=' Q'+(x0+cb*cbStep+cbStep/2).toFixed(1)+' '+(y+amp*1.8)+' '+(x0+(cb+1)*cbStep).toFixed(1)+' '+sy; }
      else if(kind==='castle'){ sy=y+amp; ey=y+amp; d='M'+x0+' '+sy; var csStep=(x1-x0)/6; for(var cs=0;cs<6;cs++){var xc=x0+cs*csStep; d+=' H'+(xc+csStep*0.25).toFixed(1)+' V'+(y-amp)+' H'+(xc+csStep*0.75).toFixed(1)+' V'+(y+amp)+' H'+(xc+csStep).toFixed(1);} }
      else if(kind==='stairs'){ sy=y+amp; ey=y-amp; d='M'+x0+' '+sy; var stStep=(x1-x0)/5; for(var st=0;st<5;st++){var xst=x0+st*stStep, yst=sy-(st+1)*(2*amp/5); d+=' H'+(xst+stStep*0.5).toFixed(1)+' V'+yst.toFixed(1);} d+=' H'+x1; }
      else if(kind==='mountain'){ sy=y+amp; ey=y+amp; d='M'+x0+' '+sy; var mStep=(x1-x0)/3; for(var mt=0;mt<3;mt++){var xm=x0+mt*mStep; d+=' L'+(xm+mStep/2).toFixed(1)+' '+(y-amp*1.2)+' L'+(xm+mStep).toFixed(1)+' '+(y+amp);} }
      else if(kind==='heartBeat'){ d='M'+x0+' '+y; var hbStep=(x1-x0)/3; for(var hb=0;hb<3;hb++){var xh=x0+hb*hbStep; d+=' H'+(xh+hbStep*0.25).toFixed(1)+' L'+(xh+hbStep*0.38).toFixed(1)+' '+(y-amp*1.3)+' L'+(xh+hbStep*0.58).toFixed(1)+' '+(y+amp*1.3)+' L'+(xh+hbStep*0.7).toFixed(1)+' '+y+' H'+(xh+hbStep).toFixed(1);} }
      else if(kind==='fig8'){ var midX=(x0+x1)/2; d='M'+x0+' '+y+' C'+(x0+135)+' '+(y-amp*2.1)+' '+(x0+135)+' '+(y+amp*2.1)+' '+midX+' '+y+' C'+(midX+135)+' '+(y-amp*2.1)+' '+(midX+135)+' '+(y+amp*2.1)+' '+x1+' '+y; }
      else if(kind==='stepWave'){ sy=y+amp; ey=y+amp; d='M'+x0+' '+sy; var swStep=(x1-x0)/4; for(var sw2=0;sw2<4;sw2++){var xs2=x0+sw2*swStep; d+=' L'+(xs2+swStep*0.33).toFixed(1)+' '+(y-amp)+' H'+(xs2+swStep*0.66).toFixed(1)+' L'+(xs2+swStep).toFixed(1)+' '+(y+amp);} }
      else { sy=y; ey=y; d='M'+(W/2)+' '+y; for(var t2=0;t2<40;t2++){var a=t2*0.45,rad=2+t2*0.9; d+=' L'+(W/2+Math.cos(a)*rad*1.2).toFixed(1)+' '+(y+Math.sin(a)*rad*0.9).toFixed(1);} }
      var kL = pickShuffled(SUB_KEYS, pIdx*17+r*2, 701), kR = pickShuffled(SUB_KEYS, pIdx*17+r*2+1, 809);
      s+='<g transform="translate('+(x0-66)+' '+(y-24)+') scale(0.08)">'+SUB[kL].draw(cMini)+'</g>';
      s+='<g transform="translate('+(x1+18)+' '+(y-24)+') scale(0.08)">'+SUB[kR].draw(cMini)+'</g>';
      s+='<path d="'+d+'" fill="none" stroke="#222" stroke-width="5" stroke-dasharray="3 14" stroke-linecap="round"/>';
      s+='<circle cx="'+x0+'" cy="'+sy+'" r="11" fill="#222"/>';
      s+='<path d="M'+(x1+6)+' '+ey+' l-22 -13 v26 z" fill="#222"/>';
    }
    var pg=newPage();
    pg.appendChild(buildHeader('向日葵運筆描線｜'+lvl.name,lvl.stageTitle+'・從黑點出發，沿著虛線描到箭頭'));
    placeBox(pg,frameSvg(s,W,730),96,730);
    placeBox(pg,'<div style="text-align:center;font-size:36px;line-height:1.6">握好筆，慢慢描，不要超出虛線</div>',860,0);
    return pg;
  }

  function newPage(){
    var pg=document.createElement('div');
    pg.className='a4 preschool-a4';
    pg.appendChild(Object.assign(document.createElement('div'),{className:'edge'}));
    return pg;
  }

  var TOPICS={
    color:{fn:colorPage,label:'🖍️ 著色本（黑白大圖輪廓＋注音圖名）',cn:'著色本',items:SUB_KEYS.length},
    dots:{fn:dotsPage,label:'🔢 數字連連看（黑白・照數字順序連線畫圖）',cn:'數字連連看',items:DOT_SHAPES.length},
    train:{fn:trainPage,label:'🚂 加法列車（黑白・圖示加法）',cn:'加法列車',items:120},
    count:{fn:countPage,label:'🔗 數一數連連看（黑白・數量配對）',cn:'數一數連連看',items:120},
    line:{fn:linePage,label:'✏️ 運筆描線（黑白・虛線描畫）',cn:'運筆描線',items:120}
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

  window.PRESCHOOL_ART={buildPages:buildPages, SUB:SUB, SUB_KEYS:SUB_KEYS, COLOR_NAMES:COLOR_NAMES, DOT_SHAPES:DOT_SHAPES, dotPoints:dotPoints, TOPICS:TOPICS, miniShapeSvg:miniShapeSvg, mkCtx:mkCtx, pickShuffled:pickShuffled};
})();
