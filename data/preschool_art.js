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

  // ===== 彩虹繪本故事 =====
  // t：依班別取字數——小班 1 句、中班 2 句、大班 3 句
  var STORIES=[
    {title:'小雞找彩虹',pages:[
      {subs:[['tree',150,150,.62],['chick',390,260,.55]],bg:'rain',t:['下雨了，小雞躲在大樹下。','小雞說：「雨什麼時候才會停？」','小雞抬頭看，天空灰灰的。']},
      {subs:[['sun',400,70,.5],['chick',200,260,.6]],bg:'day',t:['太陽出來了，雨停了。','天空亮起來，小雞好開心。','小雞開心地跳來跳去。']},
      {subs:[['rainbow',150,30,.95],['chick',40,330,.45]],bg:'day',t:['看，天上有彩虹！','彩虹有紅、橙、黃、綠、藍、靛、紫。','小雞數一數，有七種顏色。']},
      {subs:[['rainbow',160,40,.8],['chick',70,330,.4],['flower',480,330,.35]],bg:'day',t:['小雞和花朵一起看彩虹。','小雞說：「彩虹真漂亮！」','大家都笑了，今天真快樂。']}]},
    {title:'七彩小魚',pages:[
      {subs:[['fish',120,230,.6]],bg:'sea',t:['小魚住在大海裡。','小魚有一身橘橘的亮鱗片。','牠每天游來游去，很快樂。']},
      {subs:[['fish',50,230,.5],['balloon',500,60,.32]],bg:'sea',t:['小魚看到好多泡泡。','泡泡圓圓的，飄呀飄。','小魚想：「泡泡裡有什麼呢？」']},
      {subs:[['rainbow',200,40,.8],['fish',300,330,.45]],bg:'sea',t:['小魚游到水面上。','牠看見天空有彩虹。','小魚說：「我也想要七種顏色！」']},
      {subs:[['fish',60,290,.42],['fish',360,230,.42],['star',230,60,.3]],bg:'sea',t:['小魚的朋友們游過來。','大家身上有紅色、黃色和藍色。','有朋友在，每一天都是彩色的。']}]},
    {title:'蝴蝶找花',pages:[
      {subs:[['butterfly',160,130,.65]],bg:'day',t:['蝴蝶飛呀飛。','蝴蝶說：「我肚子餓了。」','蝴蝶想找一朵香香的花。']},
      {subs:[['butterfly',60,170,.45],['tree',380,150,.5]],bg:'day',t:['大樹上沒有花。','蝴蝶問：「花在哪裡呢？」','蝴蝶飛過大樹，繼續找。']},
      {subs:[['flower',150,170,.6],['butterfly',390,110,.4]],bg:'day',t:['啊，有一朵紅花！','紅花開得又大又漂亮。','蝴蝶輕輕停在花上面。']},
      {subs:[['flower',60,230,.42],['flower',390,230,.42],['butterfly',230,50,.4],['sun',480,20,.28]],bg:'day',t:['蝴蝶吃飽了。','花朵說：「謝謝你來玩。」','蝴蝶說：「明天我還要再來！」']}]},
    {title:'小蝸牛慢慢爬',pages:[
      {subs:[['snail',100,200,.75]],bg:'day',t:['小蝸牛爬呀爬。','牠爬得很慢很慢。','小蝸牛背著彩色的殼。']},
      {subs:[['snail',60,280,.5],['apple',400,60,.4]],bg:'day',t:['前面有一顆紅蘋果。','蘋果在大樹下面。','小蝸牛說：「我要爬過去看看。」']},
      {subs:[['snail',200,300,.5],['umbrella',50,60,.45],['cloud',420,60,.5]],bg:'rain',t:['下雨了，小蝸牛不怕。','牠躲進自己的殼裡。','雨停以後，牠又繼續爬。']},
      {subs:[['snail',80,280,.5],['apple',380,230,.42],['sun',400,20,.3]],bg:'day',t:['小蝸牛終於到了。','牠用了很多時間，但沒有放棄。','慢慢走，也能走到喜歡的地方。']}]},
    {title:'小熊的生日',pages:[
      {subs:[['bear',180,160,.6]],bg:'day',t:['今天是小熊的生日。','小熊笑得好開心。','牠早早起床，等朋友來。']},
      {subs:[['balloon',130,80,.6]],bg:'day',t:['小熊買了三顆氣球。','有紅色、黃色和藍色。','氣球飄呀飄，真好看。']},
      {subs:[['icecream',60,120,.55],['cat',360,200,.45]],bg:'day',t:['小貓送來冰淇淋。','冰淇淋涼涼的、甜甜的。','小熊說：「謝謝你！」']},
      {subs:[['bear',70,230,.42],['cat',370,250,.38],['star',230,40,.32],['balloon',440,50,.22]],bg:'day',t:['大家一起唱生日歌。','小熊許了一個願望。','今天是最棒的一天。']}]},
    {title:'小貓坐火箭',pages:[
      {subs:[['cat',170,180,.6]],bg:'night',t:['夜晚，小貓看著天空。','天空有好多亮亮的星星。','小貓想：「我想去星星那裡玩。」']},
      {subs:[['rocket',190,40,.8]],bg:'night',t:['看，有一枝大火箭！','火箭紅紅的，又大又高。','小貓說：「我可以上去嗎？」']},
      {subs:[['rocket',80,180,.55],['star',380,60,.4],['star',440,300,.28]],bg:'night',t:['咻，火箭飛起來了。','小貓看見好多大星星。','小貓高興地說：「哇，好漂亮！」']},
      {subs:[['cat',90,250,.42],['star',360,60,.45],['sun',470,300,.28]],bg:'night',t:['小貓玩了一整晚。','牠回到家，慢慢睡著了。','夢裡也有星星陪牠玩。']}]}
  ];

  // 雲：story 用的簡單背景物件
  SUB.cloud={name:'雲朵',draw:function(c){ return cloud(300,330,2,c); }};

  function bgSvg(kind, w, h){
    var defs={day:['#d9f0ff','#e8f7d4'],rain:['#c8d3de','#d9e6d0'],sea:['#c8ecff','#7fc8ee'],night:['#2b2f6b','#4a3f86']}[kind]||['#d9f0ff','#e8f7d4'];
    var s='<defs><linearGradient id="bgg'+kind+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+defs[0]+'"/><stop offset="1" stop-color="'+defs[1]+'"/></linearGradient></defs>';
    s+='<rect x="0" y="0" width="'+w+'" height="'+h+'" rx="22" fill="url(#bgg'+kind+')" stroke="#222" stroke-width="4"/>';
    if(kind==='night'){ for(var i=0;i<14;i++){var x=(i*173)%w,y=(i*97)%(h*0.55);s+='<circle cx="'+(30+x%(w-60))+'" cy="'+(20+y)+'" r="'+(2+(i%3))+'" fill="#fff9c4"/>';}}
    if(kind==='rain'){ for(var j=0;j<18;j++){var rx=20+(j*53)%(w-40),ry=15+(j*71)%(h*0.5);s+='<path d="M'+rx+' '+ry+' l-9 26" stroke="#5c7fa3" stroke-width="3" stroke-linecap="round"/>';}}
    if(kind==='sea'){ s+='<path d="M0 '+(h-60)+' Q'+(w*0.25)+' '+(h-90)+' '+(w*0.5)+' '+(h-60)+' T'+w+' '+(h-60)+' V'+h+' H0 Z" fill="#4fb3e0" opacity=".55"/>'; }
    if(kind==='day'||kind==='rain'){ s+='<path d="M0 '+(h-55)+' Q'+(w*0.3)+' '+(h-95)+' '+(w*0.6)+' '+(h-60)+' T'+w+' '+(h-70)+' V'+h+' H0 Z" fill="#a5d6a7" stroke="#222" stroke-width="3"/>'; }
    return s;
  }

  function levelIdx(levelId){ return levelId==='small'?0:(levelId==='mid'?1:2); }

  function buildHeader(titleHtml, subHtml){
    var hd=document.createElement('div');
    hd.className='pre-a4-hd';
    hd.innerHTML='<div class="pre-a4-title"><b>'+titleHtml+'</b><span>'+subHtml+'</span></div>'+
      '<div class="pre-a4-info"><span>寶貝姓名：<span class="pre-name-box"></span></span><span>日期：　 月　 日</span><span>⭐🌟</span></div>';
    return hd;
  }

  function rainbowBar(w){
    var s='<svg viewBox="0 0 '+w+' 14" width="'+w+'" height="14" style="display:block">';
    RAINBOW.forEach(function(k,i){ s+='<rect x="'+(i*w/7)+'" y="0" width="'+(w/7+1)+'" height="14" fill="'+PAL[k]+'"/>'; });
    return s+'</svg>';
  }

  // ===== 著色本一頁 =====
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
  function storyPage(pIdx, levelId, lvl){
    var perStory=4;
    var sIdx=Math.floor(pIdx/perStory)%STORIES.length, pInS=pIdx%perStory;
    var st=STORIES[sIdx], pgDef=st.pages[pInS];
    var li=levelIdx(levelId), nSent=li+1;
    var W=740, H=(levelId==='small'?690:(levelId==='mid'?620:530)), c=mkCtx(true, levelId==='small'?'mid':levelId);
    c.sw = levelId==='small' ? 6 : 5; // 繪本插圖線條較細，顏色為主
    var pg=document.createElement('div');
    pg.className='a4 preschool-a4';
    pg.appendChild(Object.assign(document.createElement('div'),{className:'edge'}));
    pg.appendChild(buildHeader('🌈 向日葵彩虹繪本｜'+lvl.name, '《'+st.title+'》第 '+(pInS+1)+' / '+perStory+' 頁'));
    var inner='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'">'+bgSvg(pgDef.bg,W,H);
    pgDef.subs.forEach(function(s){
      var d=SUB[s[0]]; if(!d) return;
      inner+='<g transform="translate('+s[1]+' '+(s[2]+(H-560)*0.7)+') scale('+s[3]+')">'+d.draw(c)+'</g>';
    });
    inner+='</svg>';
    var box=document.createElement('div');
    box.style.cssText='position:absolute;left:27px;top:96px;width:'+W+'px;height:'+H+'px';
    box.innerHTML=inner;
    pg.appendChild(box);
    var fs = levelId==='small' ? 56 : (levelId==='mid' ? 42 : 34);
    var txt=document.createElement('div');
    txt.style.cssText='position:absolute;left:40px;top:'+(96+H+22)+'px;width:714px;font-size:'+fs+'px;line-height:1.7;color:#111;letter-spacing:2px';
    txt.innerHTML=pgDef.t.slice(0,nSent).map(function(sen){return '<div style="margin-bottom:6px">'+zyHtml(sen)+'</div>';}).join('');
    pg.appendChild(txt);
    var bar=document.createElement('div');
    bar.style.cssText='position:absolute;left:27px;top:1052px;width:740px';
    bar.innerHTML=rainbowBar(740);
    pg.appendChild(bar);
    return pg;
  }

  function buildPages(cfg, lvl){
    var levelId=cfg.level||'small';
    var topic=cfg.topic;
    var sheets=Math.max(1,Math.min(30,+(cfg.sheets||1)));
    var wantPages=sheets*2;
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
    var topicLabel=topic==='story'?'🌈 彩虹繪本（短篇故事＋彩色插圖＋注音）':'🖍️ 著色本（大圖輪廓＋注音圖名）';
    var pages=pageIndices.map(function(pIdx){
      var pg=topic==='story'?storyPage(pIdx,levelId,lvl):colorPage(pIdx,levelId,lvl);
      if(window.createWatermarkLayer) pg.appendChild(window.createWatermarkLayer(794,1122,wmText));
      var sNo=Math.floor(pIdx/2)+1, side=(pIdx%2===0)?'正面':'背面';
      var cap=document.createElement('div');
      cap.className='cap';
      cap.textContent=cpr+'　｜　幼兒園'+lvl.name+(topic==='story'?'彩虹繪本':'著色本')+'　第 '+sNo+' 張'+side+'（第 '+(pIdx+1)+'/'+wantPages+' 面）';
      pg.appendChild(cap);
      return pg;
    });
    return {pages:pages, level:lvl, topicLabel:topicLabel, itemCount: topic==='story'?STORIES.length*4:SUB_KEYS.length, totalPages:wantPages, sheets:sheets, artMode:topic};
  }

  window.PRESCHOOL_ART={buildPages:buildPages, SUB:SUB, STORIES:STORIES, SUB_KEYS:SUB_KEYS, COLOR_NAMES:COLOR_NAMES};
})();
