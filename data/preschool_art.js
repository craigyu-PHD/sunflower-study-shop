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
      '<div class="pre-a4-info"><span>寶貝姓名：<span class="pre-name-box"></span></span><span>日期：　 月　 日</span><span>⭐🌟</span></div>';
    return hd;
  }


  function colorPage(pIdx, levelId, lvl, cfgCommon){
    var key=SUB_KEYS[pIdx % SUB_KEYS.length];
    var round=Math.floor(pIdx/SUB_KEYS.length);
    var sub=SUB[key], c=mkCtx(false, levelId);
    var W=740, H=730;
    var pg=document.createElement('div');
    pg.className='a4 preschool-a4';
    pg.appendChild(Object.assign(document.createElement('div'),{className:'edge'}));
    pg.appendChild(buildHeader('🖍️ 向日葵幼兒園著色本｜'+lvl.name, lvl.stageTitle+'・把圖畫塗得五顏六色'));
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
    // 圖名（含注音）＋七彩色票
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

  // ===== 繪本一頁 =====
  // ===== 黑白（省印製成本）新題型 =====
  function frameSvg(inner,W,H){
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'"><rect x="3" y="3" width="'+(W-6)+'" height="'+(H-6)+'" rx="26" fill="#fff" stroke="#222" stroke-width="4" stroke-dasharray="14 10"/>'+inner+'</svg>';
  }
  function placeBox(pg,html,top,h,W){
    var b=document.createElement('div');
    b.style.cssText='position:absolute;left:27px;top:'+top+'px;width:'+(W||740)+'px;'+(h?'height:'+h+'px;':'');
    b.innerHTML=html; pg.appendChild(b); return b;
  }
  function seeded(n){ var s=(n*9301+49297)%233280; return function(){ s=(s*9301+49297)%233280; return s/233280; }; }

  // ---- 1. 數字連連看：點點依序連線畫出圖案 ----
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
    var shape=DOT_SHAPES[pIdx%DOT_SHAPES.length];
    var N={small:10,mid:16,large:24}[levelId];
    var pts=dotPoints(shape,Math.max(N,shape.v.length));
    var W=740,H=730,sc=1.1,ox=(W-600*sc)/2,oy=(H-600*sc)/2;
    var fs=levelId==='small'?34:(levelId==='mid'?28:24), r=levelId==='small'?13:(levelId==='mid'?10:8);
    var g='';
    pts.forEach(function(p,i){
      var x=ox+p[0]*sc,y=oy+p[1]*sc;
      // 數字放在點的外側（遠離圖形中心）
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

  // ---- 2. 加法列車（黑白）----
  function trainPage(pIdx,levelId,lvl){
    var rnd=seeded(pIdx+7), maxS=levelId==='small'?5:10, rows=levelId==='small'?4:(levelId==='mid'?6:7);
    var W=740, rowH=Math.floor(720/rows), s='';
    function dots(n,x,y,w,h){ var o='',cols=n<=3?n:Math.ceil(n/2),rws=n<=3?1:2,gx=w/(cols+1),gy=h/(rws+1);
      for(var i=0;i<n;i++){var c=i%cols,r2=Math.floor(i/cols);o+='<circle cx="'+(x+gx*(c+1)).toFixed(1)+'" cy="'+(y+gy*(r2+1)).toFixed(1)+'" r="'+(levelId==='small'?13:10)+'" fill="#fff" stroke="#222" stroke-width="3"/>';}
      return o; }
    for(var r=0;r<rows;r++){
      var a=1+Math.floor(rnd()*(maxS-1)), b=1+Math.floor(rnd()*(maxS-a)); if(a+b>maxS){b=maxS-a;} if(b<1){b=1;a=Math.max(1,maxS-1);}
      var y=10+r*rowH, h=rowH-14, cw=108, ch=Math.min(h-24,96);
      var x=14;
      // 火車頭
      s+='<rect x="'+x+'" y="'+(y+h-ch-10)+'" width="'+cw+'" height="'+ch+'" rx="12" fill="#fff" stroke="#222" stroke-width="4"/><rect x="'+(x+14)+'" y="'+(y+h-ch-34)+'" width="26" height="26" fill="#fff" stroke="#222" stroke-width="4"/><circle cx="'+(x+cw-34)+'" cy="'+(y+h-ch+22)+'" r="20" fill="#fff" stroke="#222" stroke-width="4"/>';
      s+='<circle cx="'+(x+28)+'" cy="'+(y+h-8)+'" r="14" fill="#fff" stroke="#222" stroke-width="4"/><circle cx="'+(x+cw-28)+'" cy="'+(y+h-8)+'" r="14" fill="#fff" stroke="#222" stroke-width="4"/>';
      var parts=[[a,'a'],['＋','op'],[b,'b'],['＝','eq'],['','ans']], cx=x+cw+20;
      parts.forEach(function(pt){
        if(pt[1]==='op'||pt[1]==='eq'){ s+='<text x="'+(cx+24)+'" y="'+(y+h-ch/2-2)+'" text-anchor="middle" font-size="54" font-weight="700" fill="#222">'+pt[0]+'</text>'; cx+=52; return; }
        s+='<line x1="'+(cx-14)+'" y1="'+(y+h-ch/2)+'" x2="'+cx+'" y2="'+(y+h-ch/2)+'" stroke="#222" stroke-width="4"/>';
        s+='<rect x="'+cx+'" y="'+(y+h-ch-10)+'" width="'+cw+'" height="'+ch+'" rx="10" fill="#fff" stroke="#222" stroke-width="4" '+(pt[1]==='ans'?'stroke-dasharray="10 8"':'')+'/>';
        if(pt[1]!=='ans') s+=dots(pt[0],cx,y+h-ch-10,cw,ch);
        s+='<circle cx="'+(cx+26)+'" cy="'+(y+h-8)+'" r="14" fill="#fff" stroke="#222" stroke-width="4"/><circle cx="'+(cx+cw-26)+'" cy="'+(y+h-8)+'" r="14" fill="#fff" stroke="#222" stroke-width="4"/>';
        cx+=cw+8;
      });
      s+='<path d="M10 '+(y+h+4)+' H730" stroke="#222" stroke-width="3"/>';
    }
    var pg=newPage();
    pg.appendChild(buildHeader('🚂 向日葵加法列車｜'+lvl.name,lvl.stageTitle+'・數一數圓圈，寫出一共有幾個'));
    placeBox(pg,frameSvg(s,W,740),96,740);
    placeBox(pg,'<div style="text-align:center;font-size:36px;line-height:1.6">火車開囉！在虛線車廂裡寫上答案 🚂</div>',860,0);
    return pg;
  }

  // ---- 3. 數一數連連看（黑白）----
  function countPage(pIdx,levelId,lvl){
    var rnd=seeded(pIdx+31), maxN=levelId==='small'?5:(levelId==='mid'?8:10), rows=levelId==='small'?4:5;
    var nums=[]; while(nums.length<rows){var n=1+Math.floor(rnd()*maxN); if(nums.indexOf(n)<0) nums.push(n);}
    var right=nums.slice().sort(function(){return rnd()-.5;});
    var W=740,H=720,rowH=H/rows,s='';
    function shapeAt(kind,cx,cy,r){
      if(kind===0) return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#fff" stroke="#222" stroke-width="3.5"/>';
      if(kind===1) return '<path d="'+starPath(cx,cy,r*1.15,r*.5)+'" fill="#fff" stroke="#222" stroke-width="3.5"/>';
      return '<path d="M'+cx+' '+(cy-r)+' L'+(cx+r)+' '+(cy+r*.85)+' L'+(cx-r)+' '+(cy+r*.85)+' Z" fill="#fff" stroke="#222" stroke-width="3.5"/>';
    }
    nums.forEach(function(n,i){
      var cy=rowH*i+rowH/2, kind=(i+pIdx)%3, r=levelId==='small'?26:20, per=5, gx=r*2+12;
      for(var k=0;k<n;k++){ s+=shapeAt(kind,60+(k%per)*gx+r,cy+(n>per?(k<per?-r-4:r+4):0),r); }
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

  // ---- 4. 運筆描線（黑白，虛線描畫）----
  function linePage(pIdx,levelId,lvl){
    var kinds=levelId==='small'?['line','wave','arc']:(levelId==='mid'?['wave','zig','arc','loop']:['zig','loop','spiral','wave','scallop']);
    var rows=levelId==='small'?6:8, W=740, rowH=720/rows, s='';
    for(var r=0;r<rows;r++){
      var kind=kinds[(r+pIdx)%kinds.length], y=rowH*r+rowH/2, x0=70, x1=670, d='', amp=rowH*0.28;
      if(kind==='line') d='M'+x0+' '+y+' H'+x1;
      else if(kind==='wave'){ d='M'+x0+' '+y; for(var i=0;i<6;i++){var xa=x0+i*100; d+=' Q'+(xa+25)+' '+(y-(i%2?-amp:amp)*1.6)+' '+(xa+50)+' '+y+' T'+(xa+100)+' '+y;} d=d.replace(/ T[\d.]+ [\d.]+/g,''); d='M'+x0+' '+y+' C'+(x0+60)+' '+(y-amp*2)+' '+(x0+140)+' '+(y-amp*2)+' '+(x0+200)+' '+y+' S'+(x0+340)+' '+(y+amp*2)+' '+(x0+400)+' '+y+' S'+(x0+540)+' '+(y-amp*2)+' '+x1+' '+y; }
      else if(kind==='zig'){ d='M'+x0+' '+(y+amp); for(var j=1;j<=6;j++) d+=' L'+(x0+j*100)+' '+(y+(j%2?-amp:amp)); }
      else if(kind==='arc') d='M'+x0+' '+(y+amp)+' Q'+((x0+x1)/2)+' '+(y-amp*2.2)+' '+x1+' '+(y+amp);
      else if(kind==='loop'){ d='M'+x0+' '+y; for(var k=0;k<4;k++){var xa2=x0+k*150; d+=' C'+(xa2+90)+' '+(y-amp*2.2)+' '+(xa2+90)+' '+(y+amp*2.2)+' '+(xa2+30)+' '+y+' S'+(xa2+120)+' '+(y-amp*.2)+' '+(xa2+150)+' '+y;} }
      else if(kind==='scallop'){ d='M'+x0+' '+y; for(var m=0;m<6;m++) d+=' Q'+(x0+m*100+50)+' '+(y-amp*2)+' '+(x0+(m+1)*100)+' '+y; }
      else { d='M'+(W/2)+' '+y; var rr=2; for(var t2=0;t2<40;t2++){var a=t2*0.45,rad=2+t2*0.9; d+=' L'+(W/2+Math.cos(a)*rad*1.2).toFixed(1)+' '+(y+Math.sin(a)*rad*0.9).toFixed(1);} }
      s+='<path d="'+d+'" fill="none" stroke="#222" stroke-width="5" stroke-dasharray="3 14" stroke-linecap="round"/>';
      s+='<circle cx="'+x0+'" cy="'+(kind==='zig'||kind==='arc'?y+amp:y)+'" r="14" fill="#222"/>';
      s+='<path d="M'+(x1+6)+' '+(kind==='zig'||kind==='arc'?y+(kind==='arc'?amp:(6%2?-amp:amp)):y)+' l-26 -16 v32 z" fill="#222" transform="translate(0 0)"/>';
    }
    var pg=newPage();
    pg.appendChild(buildHeader('✏️ 向日葵運筆描線｜'+lvl.name,lvl.stageTitle+'・從黑點出發，沿著虛線描到箭頭'));
    placeBox(pg,frameSvg(s,W,730),96,730);
    placeBox(pg,'<div style="text-align:center;font-size:36px;line-height:1.6">握好筆，慢慢描，不要超出虛線 ✏️</div>',860,0);
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
    train:{fn:trainPage,label:'🚂 加法列車（黑白・圖示加法）',cn:'加法列車',items:99},
    count:{fn:countPage,label:'🔗 數一數連連看（黑白・數量配對）',cn:'數一數連連看',items:99},
    line:{fn:linePage,label:'✏️ 運筆描線（黑白・虛線描畫）',cn:'運筆描線',items:99}
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

  window.PRESCHOOL_ART={buildPages:buildPages, SUB:SUB, SUB_KEYS:SUB_KEYS, COLOR_NAMES:COLOR_NAMES, DOT_SHAPES:DOT_SHAPES, dotPoints:dotPoints, TOPICS:TOPICS};
})();
