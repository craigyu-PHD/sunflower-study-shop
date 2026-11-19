'use strict';
const $=id=>document.getElementById(id);
window.HZ_LOADED={};
// ---------- 資料載入（依 Unicode 區段分片，離線 file:// 可用）----------
function loadShard(k){
  return new Promise(res=>{
    if(HZ_LOADED[k]) return res();
    const s=document.createElement('script');
    s.src='data/hz_'+k+'.js';s.onload=()=>res();s.onerror=()=>res();
    document.head.appendChild(s);
  });
}
async function loadChars(chars){
  const ks=[...new Set(chars.map(c=>(c.codePointAt(0)>>8).toString(16)))];
  await Promise.all(ks.map(loadShard));
  return chars.filter(c=>window.HZ_DATA&&HZ_DATA[c]);
}
// ---------- 繪製單格 ----------
const paths={};
const P=d=>paths[d]||(paths[d]=new Path2D(d));
/* opts: k=已寫筆數, hi=當前筆畫紅色, ghost=淺灰全字, numbers, zy(1=右側直式注音空格), label */
function drawCell(ch,opts,size){
  const zy=opts.zy?1:0;
  const cv=document.createElement('canvas');
  cv.width=Math.round(size*(zy?1.3:1));cv.height=size;
  const g=cv.getContext('2d');
  g.fillStyle='#fff';g.fillRect(0,0,cv.width,cv.height);
  const m=Math.max(2,size*.012);
  // 田字格
  g.strokeStyle='#d33';g.lineWidth=m*1.2;g.strokeRect(m,m,size-2*m,size-2*m);
  g.lineWidth=Math.max(1,size*.005);g.setLineDash([size*.025,size*.02]);g.strokeStyle='#e88';
  g.beginPath();g.moveTo(size/2,m);g.lineTo(size/2,size-m);g.moveTo(m,size/2);g.lineTo(size-m,size/2);
  g.stroke();g.setLineDash([]);
  if(zy){ // 注音空格（直式，格子右側）
    const bx=size, by=m, bw=cv.width-size-m, bh=size-2*m;
    g.strokeStyle='#222';g.lineWidth=m*1.2;
    g.strokeRect(bx,by,bw,bh);
    if(opts.zyText) drawZhuyin(g,opts.zyText,bx,by,bw,bh);
  }
  const d=HZ_DATA[ch]; if(!d)return cv;
  const [strokes,starts]=d, n=strokes.length;
  const pad=size*.07, sc=(size-2*pad)/1024, k=opts.k??0;
  g.setTransform(sc,0,0,-sc,pad,pad+900*sc);
  if(opts.ghost){g.fillStyle='#e2e2e2';strokes.forEach(s=>g.fill(P(s)));}
  for(let i=0;i<Math.min(k,n);i++){g.fillStyle=(opts.hi&&i===k-1)?'#e02020':'#222';g.fill(P(strokes[i]));}
  g.setTransform(1,0,0,1,0,0);
  if(opts.numbers){
    g.font=`bold ${size*.075}px sans-serif`;g.textAlign='center';g.textBaseline='middle';
    for(let i=0;i<Math.min(k,n);i++){
      const x=pad+starts[i][0]*sc, y=pad+(900-starts[i][1])*sc;
      g.fillStyle='#1976d2';g.beginPath();g.arc(x,y,size*.04,0,7);g.fill();
      g.fillStyle='#fff';g.fillText(i+1,x,y+size*.003);
    }
  }
  if(opts.label){
    g.font=`${size*.09}px "Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif`;
    g.textBaseline='top';g.textAlign='left';g.fillStyle='#666';
    g.fillText(opts.label,size*.06,size*.05);
  }
  return cv;
}
function drawZhuyin(g,zyStr,bx,by,bw,bh){
  const isNeu=zyStr.startsWith('˙');
  const tone=/[ˊˇˋ]$/.test(zyStr)?zyStr.slice(-1):'';
  const ph=zyStr.replace(/^˙/,'').replace(/[ˊˇˋ]$/,'').split('').filter(Boolean);
  if(!ph.length)return;
  const slots=ph.length+(isNeu?0.55:0);
  const fz=Math.min(bw*0.56, (bh*0.84)/Math.max(1,slots*1.08));
  const step=fz*1.08;
  const totalH=ph.length*step+(isNeu?fz*0.5:0);
  let y=by+(bh-totalH)/2;
  const cx=bx+bw*(tone?0.42:0.5);
  g.save();
  g.fillStyle='#222';
  g.textAlign='center';g.textBaseline='middle';
  g.font=`500 ${fz}px "Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif`;
  if(isNeu){
    g.fillText('˙',cx,y+fz*0.22);
    y+=fz*0.5;
  }
  let lastY=y;
  for(const ch of ph){
    lastY=y+fz*0.5;
    g.fillText(ch,cx,lastY);
    y+=step;
  }
  if(tone){
    g.font=`500 ${fz*0.82}px "Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif`;
    g.fillText(tone,cx+fz*0.52,lastY-fz*0.18);
  }
  g.restore();
}
let lessonZy={};
const getZy=ch=>lessonZy[ch]||(window.ZY_DATA&&ZY_DATA[ch])||'';
// 教育部風格「筆順欄」：逐筆累積的小字，排進一個高格
function drawStrip(ch,W,H,base){
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;
  const g=cv.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,W,H);
  g.strokeStyle='#222';g.lineWidth=Math.max(2,base*.012);g.strokeRect(1,1,W-2,H-2);
  const [strokes]=HZ_DATA[ch], n=strokes.length;
  let t=0,c=1;
  for(let cc=1;cc<=n;cc++){const tt=Math.min(W/cc,H/Math.ceil(n/cc));if(tt>t){t=tt;c=cc;}}
  t=Math.min(t,W/1.2);
  const sc=t*.9/1024, off=t*.05;
  for(let i=0;i<n;i++){
    const x=(i%c)*t, y=Math.floor(i/c)*t;
    g.setTransform(sc,0,0,-sc,x+off,y+off+900*sc);
    for(let j=0;j<=i;j++){g.fillStyle=j===i?'#e02020':'#444';g.fill(P(strokes[j]));}
    g.setTransform(1,0,0,1,0,0);
  }
  return cv;
}
// ---------- 版面計算（預覽與 Excel 共用：每字嚴格一欄由上到下，絕不折欄）----------
let curChars=[];
const A4W=794, A4H=1122;           // A4 在 96dpi 下的像素
const MARGIN=56;                   // 預覽上下留白（約 0.58 吋）
const CONTENT_W=640, CONTENT_H=980;  // 預覽與 Excel 安全內容區（四邊留白）
window.COPYRIGHT_STATEMENT='🌻 向日葵國小伴學誌｜108課綱原創練習・專屬訂製請勿轉售';

// ---------- 全域可調式防轉售浮水印產生器（支援大小/角度/濃淡/密度客製・無虛線框）----------
window.createWatermarkLayer=function(w=794, h=1122, customText=''){
  const d=document.createElement('div');
  d.className='wm-layer';
  d.dataset.wmW=String(w);
  d.dataset.wmH=String(h);
  if(customText) d.dataset.wmCustom=customText;
  const enabled=!$('wmEnable')||$('wmEnable').checked;
  if(!enabled)return d;
  const rawTxt=(customText||($('wmText')?$('wmText').value:'')||'向日葵國小伴學誌・專屬訂製請勿轉售').trim();
  if(!rawTxt)return d;
  const alpha=parseFloat($('wmAlpha')?$('wmAlpha').value:'0.04')||0.04;
  const scale=parseFloat($('wmScale')?$('wmScale').value:'3.0')||3.0;
  const angle=parseFloat($('wmAngle')?$('wmAngle').value:'-24');
  const effAngle=Number.isFinite(angle)?angle:-24;
  const density=parseInt($('wmDensity')?$('wmDensity').value:'3',10)||3;
  const escXml=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const cx=Math.round(w/2), cy=Math.round(h/2);

  // 計算安全對角寬度並於大字體（如 300%）自動兩行排版，確保極大字體依然完整落於紙面不裁切
  const diagAvail = Math.min(w, h) * 1.15;
  let line1 = rawTxt, line2 = '';
  if(scale >= 1.8 && rawTxt.length >= 12){
    const splitPos = rawTxt.indexOf('・') >= 4 ? rawTxt.indexOf('・') + 1
      : (rawTxt.indexOf('（') >= 5 ? rawTxt.indexOf('（') : Math.ceil(rawTxt.length / 2));
    line1 = rawTxt.slice(0, splitPos).replace(/・$/,'');
    line2 = rawTxt.slice(splitPos).replace(/^・/,'');
  }
  const longestChars = Math.max(line1.length, line2.length, 6);
  const rawCenterFz = 22 * scale;
  const maxSafeFz = Math.max(24, (diagAvail * 0.92) / longestChars);
  const centerFz = Math.min(rawCenterFz, maxSafeFz);
  const sideFz = Math.min(24, 15.5 * Math.min(1.65, scale));

  let pts=[];
  if(density===3){
    pts = w>h ? [[250,155],[870,639]] : [[235,190],[559,932]];
  }else if(density>=5){
    pts = w>h
      ? [[245,145],[875,145],[245,649],[875,649]]
      : [[210,185],[584,185],[210,937],[584,937]];
  }
  const safeFull=escXml(rawTxt);
  const tiles=pts.map(([x,y])=>
    `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" transform="rotate(${effAngle} ${x} ${y})" font-size="${sideFz.toFixed(1)}" font-weight="700" font-family="Noto Sans TC,PingFang TC,Microsoft JhengHei,sans-serif" fill="#7a4200" fill-opacity="${alpha.toFixed(3)}" letter-spacing="1.4">${safeFull}</text>`
  ).join('');

  const cAlpha = Math.min(0.92, alpha * 1.25).toFixed(3);
  let centerText = '';
  if(line2){
    const gapY = Math.round(centerFz * 0.66);
    const subFz = Math.min(centerFz * 0.78, Math.max(20, (diagAvail * 0.90) / Math.max(1, line2.length)));
    centerText = `<g transform="rotate(${effAngle} ${cx} ${cy})">
      <text x="${cx}" y="${cy - gapY}" text-anchor="middle" dominant-baseline="central" font-size="${centerFz.toFixed(1)}" font-weight="800" font-family="Noto Sans TC,PingFang TC,Microsoft JhengHei,sans-serif" fill="#7a4200" fill-opacity="${cAlpha}" letter-spacing="2">${escXml(line1)}</text>
      <text x="${cx}" y="${cy + gapY}" text-anchor="middle" dominant-baseline="central" font-size="${subFz.toFixed(1)}" font-weight="800" font-family="Noto Sans TC,PingFang TC,Microsoft JhengHei,sans-serif" fill="#7a4200" fill-opacity="${cAlpha}" letter-spacing="1.6">${escXml(line2)}</text>
    </g>`;
  } else {
    centerText = `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" transform="rotate(${effAngle} ${cx} ${cy})" font-size="${centerFz.toFixed(1)}" font-weight="800" font-family="Noto Sans TC,PingFang TC,Microsoft JhengHei,sans-serif" fill="#7a4200" fill-opacity="${cAlpha}" letter-spacing="2">${escXml(line1)}</text>`;
  }
  d.innerHTML=`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${tiles}${centerText}</svg>`;
  return d;
};

function charItemsA(ch,zy){
  if(!window.HZ_DATA || !HZ_DATA[ch] || !HZ_DATA[ch][0]) return [];
  const n=HZ_DATA[ch][0].length, list=[];
  const hasRef=$('xRef').checked, zt=zy?getZy(ch):'';
  if(hasRef)list.push({span:1,o:{k:n,numbers:$('xNum').checked,zy,zyText:zt,label:'範字'}});
  for(let s=1;s<=n;s++)list.push({span:1,o:{k:s,hi:true,ghost:$('xGhost').checked,zy,zyText:(!hasRef&&s===1)?zt:'',label:String(s)}});
  return list;
}

function buildLayout(opts={}){
  const mode=document.querySelector('input[name=xMode]:checked').value;
  const zy=$('xZy').checked?1:0;
  // 每頁最少 7 欄、最多 8 欄彈性調整（低年級預設 7 欄較大格、中高年級可 8 欄較多字）
  const rawCols=opts.cols || +$('xCols').value || 7;
  const cols=Math.max(7, Math.min(8, rawCols));
  const cwMax=Math.floor(CONTENT_W/cols);
  const pSqMax=Math.floor(zy?cwMax/1.3:cwMax);
  // 統一全版固定列數 R（兼顧寬度與高度滿版：例如 8 欄採 16 列保持 cw=79px 貼近右界不留寬邊）
  const R=Math.max(8, Math.round(CONTENT_H/pSqMax) + (opts.extraR||0));
  const sq=Math.min(Math.floor(CONTENT_H/R), pSqMax);
  const cw=Math.round(sq*(zy?1.3:1));
  const chh=Math.round(sq);
  const splitLimit=opts.splitLimit || ($('xSplitLimit') && +$('xSplitLimit').value) || 12;
  const nbReq=Math.max(5,+$('xBlank').value||5);
  const wantTrace=$('xTrace').checked;
  const traceQuota=wantTrace?Math.max(1,+$('xATraceN')?.value||1):0;
  const pages=[];

  const padColumnToR=(colArr, traceStart=true)=>{
    let traced=0;
    while(colArr.length<R){
      colArr.push({span:1,o:{k:0,zy,ghost:traceStart && traced<traceQuota}});
      traced++;
    }
    return colArr;
  };

  let exceeded2 = false, rawPageCount = 0;

  if(mode==='A'){
    const charGroups=[];
    curChars.forEach(ch=>{
      if(!window.HZ_DATA || !HZ_DATA[ch] || !HZ_DATA[ch][0]) return;
      const strokeN=HZ_DATA[ch][0].length;
      const steps=charItemsA(ch,zy);
      if(!steps.length) return;
      // 每個字最少保留 5 格以上完整練習格（只能多於 5 格，不可少於 5 格）；不足時自動延展至下一欄並補滿至底 R 格
      const shouldSplit=(strokeN>splitLimit) || (steps.length + nbReq > R);
      if(!shouldSplit){
        const col1=padColumnToR(steps.slice(0, R), true);
        charGroups.push({ch, colLists:[col1]});
      }else{
        const chunks=[];
        for(let k=0;k<steps.length;k+=R){
          chunks.push(steps.slice(k,k+R));
        }
        // 若最後一欄剩餘格數不足 nbReq（預設最少 5 格），延伸多起一全欄練習格，確保練習次數 >= 5 格且無留白
        const lastRemain = R - chunks[chunks.length - 1].length;
        if(lastRemain < nbReq){
          chunks.push([]);
        }
        chunks.forEach((ck, idx)=>{
          padColumnToR(ck, idx===chunks.length-1);
        });
        charGroups.push({ch, colLists:chunks});
      }
    });

    let curPageCols=[];
    const flushPage=()=>{
      if(!curPageCols.length)return;
      const items=[];
      curPageCols.forEach((colObj,cIdx)=>{
        colObj.list.forEach((it,rIdx)=>items.push({ch:colObj.ch,col:cIdx,row:rIdx,...it}));
      });
      pages.push({R,cw,chh,sq,cols,cwMax,img:Math.min(300,Math.round(sq*3)),items});
      curPageCols=[];
    };

    // 前瞻補位打包：同一生字的多欄（如「鳳」佔 2 欄）絕不拆開跳頁；若頁尾剩 1 欄，往後替換 1 欄字先補滿該頁右側
    const remaining = charGroups.slice();
    while(remaining.length){
      const space = cols - curPageCols.length;
      if(space <= 0){ flushPage(); continue; }
      const head = remaining[0];
      if(head.colLists.length <= space){
        remaining.shift();
        head.colLists.forEach(list => curPageCols.push({ch:head.ch, list}));
      }else{
        const fitIdx = remaining.findIndex((g, idx) => idx > 0 && g.colLists.length <= space);
        if(fitIdx !== -1){
          const [filler] = remaining.splice(fitIdx, 1);
          filler.colLists.forEach(list => curPageCols.push({ch:filler.ch, list}));
        }else{
          flushPage();
        }
      }
    }
    flushPage();

    rawPageCount = pages.length;

    // 彈性雙數頁調整：若只多出一點點進入第 3 頁，優先自動嘗試彈性放寬（折兩欄上限或 8 欄）壓回正反 2 頁
    if(!opts.noElastic && rawPageCount === 3){
      const tryList = [
        { cols, splitLimit: splitLimit + 4, extraR: 1, noElastic: true },
        ...(cols < 8 ? [{ cols: 8, splitLimit: splitLimit + 2, noElastic: true }] : [])
      ];
      for(const candOpts of tryList){
        const alt = buildLayout(candOpts);
        if(alt.pages.length === 2){
          alt.elasticFit = true;
          alt.rawPageCount = alt.pages.length;
          alt.exceedsTwoPages = false;
          return alt;
        }
      }
    }

    // 僅 1 頁時自動補齊背面熟練複習頁，確保產製永遠為雙數頁（正反面 2 頁）
    if(!opts.noReviewPad && pages.length === 1 && pages[0].items.length){
      const backItems = pages[0].items.map(it => {
        if(it.row === 0 && it.o && it.o.k > 0) return it;
        return { ...it, o: { k: 0, zy: it.o?.zy||0, ghost: it.row <= Math.max(2, traceQuota) } };
      });
      pages.push({ ...pages[0], items: backItems });
    }
    if(rawPageCount > 2) exceeded2 = true;
  }else{
    for(let i=0;i<curChars.length;i+=cols){
      const slice=curChars.slice(i,i+cols);
      const cwB=cwMax;
      const sqB=zy?cwB/1.3:cwB;
      const chhB=Math.round(sqB);
      const RB=Math.max(4,Math.floor(CONTENT_H/chhB));
      const tn=+$('xTraceN').value||0;
      const items=[];
      slice.forEach((ch,c)=>{
        const n=HZ_DATA[ch][0].length;
        items.push({ch,col:c,row:0,span:1,o:{k:n,zy,zyText:zy?getZy(ch):''}});
        const sp=Math.max(2,Math.min(4,Math.ceil(n/6)+1,RB-1));
        items.push({ch,col:c,row:1,span:sp,strip:true});
        const rest=Math.max(0,RB-1-sp);
        for(let b=0;b<rest;b++)items.push({ch,col:c,row:1+sp+b,span:1,o:{k:0,zy,ghost:b<tn}});
      });
      pages.push({R:RB,cw:cwB,chh:chhB,sq:sqB,cols,cwMax,img:Math.min(300,Math.round(sqB*3)),items});
    }
  }
  return {mode,zy,cols,cwMax,pages,exceedsTwoPages:exceeded2,rawPageCount:rawPageCount||pages.length};
}

function imgCanvas(it,pg){
  if(it.strip){
    const w=Math.round(pg.img*pg.cw/pg.sq), h=Math.round(pg.img*pg.chh*it.span/pg.sq);
    return drawStrip(it.ch,w,h,pg.img);
  }
  return drawCell(it.ch,it.o,pg.img);
}
const cvCache=new Map();
function cachedCanvas(it,pg){
  const key=it.ch+'|'+JSON.stringify(it.o||'S')+'|'+it.span+'|'+pg.img+'|'+pg.cw+'|'+pg.chh;
  if(!cvCache.has(key)){
    if(cvCache.size>1600){
      const firstKey=cvCache.keys().next().value;
      if(firstKey!==undefined) cvCache.delete(firstKey);
    }
    cvCache.set(key,imgCanvas(it,pg));
  }
  return cvCache.get(key);
}
function cachedDataUrl(it,pg){
  const cv=cachedCanvas(it,pg);
  return cv._dataUrl || (cv._dataUrl=cv.toDataURL());
}
// ---------- 預覽（A4 直式）----------
async function generate(){
  const text=[...$('input').value].filter(c=>/[\u3400-\u9fff\uf900-\ufaff]|[\u{20000}-\u{2fa1f}]/u.test(c));
  $('msg').textContent='';$('msg').style.color='';
  const ok=await loadChars([...new Set(text)]);
  const miss=[...new Set(text)].filter(c=>!ok.includes(c));
  if(miss.length)$('msg').textContent='查無筆順資料，已略過：'+miss.join(' ');
  curChars=text.filter(c=>ok.includes(c));
  render();
  return curChars.length>0;
}
function render(){
  const sheet=$('sheet');sheet.innerHTML='';
  if(!curChars.length)return;
  const L=buildLayout();
  if($('msg')){
    if(L.exceedsTwoPages){
      $('msg').style.color='#c0392b';
      $('msg').textContent=`⚠️ 超過正反面（2 頁）基本規格：目前生字共需 ${L.rawPageCount} 頁（基本規格以雙數正反面為主，多出頁數恐造成計價與印製困擾），建議減少 1～2 個高筆畫生字、改為 8 欄或提高「折兩欄上限」！`;
    }else if(L.elasticFit){
      $('msg').style.color='#1f9d55';
      $('msg').textContent=`✅ 已自動彈性排版調整為 ${L.pages.length} 頁（正反雙面），確保同字不跨頁且無多出零星單頁！`;
    }
  }
  L.pages.forEach((pgData,p)=>{
    const pCols=pgData.cols||L.cols;
    const pCwMax=pgData.cwMax||L.cwMax;
    const left=Math.round((A4W-pCols*pCwMax)/2);
    const cap=document.createElement('div');cap.className='pcap';
    cap.textContent=`A4 直式（210×297 mm・本頁 ${pCols} 欄）　第 ${p+1} / ${L.pages.length} 頁`;sheet.appendChild(cap);
    const pg=document.createElement('div');pg.className='a4';
    const edge=document.createElement('div');edge.className='edge';pg.appendChild(edge);
    const colPad=Math.round((pCwMax-pgData.cw)/2);
    pgData.items.forEach(it=>{
      const im=new Image();im.src=cachedDataUrl(it,pgData);
      im.style.left=(left+it.col*pCwMax+colPad)+'px';
      im.style.top=(MARGIN+it.row*pgData.chh)+'px';
      im.style.width=pgData.cw+'px';im.style.height=(pgData.chh*it.span)+'px';
      pg.appendChild(im);
    });
    pg.appendChild(window.createWatermarkLayer(A4W,A4H));
    const c2=document.createElement('div');c2.className='cap';
    c2.textContent=`${window.COPYRIGHT_STATEMENT}　｜　第 ${p+1} / ${L.pages.length} 頁`;
    pg.appendChild(c2);
    sheet.appendChild(pg);
  });
}
// ---------- 供批次訂單匯入與前台即時預覽呼叫：產生指定訂單之寫字帖 A4 頁面陣列（嚴格依課次順序全字列出＋循環補齊、不隨機）----------
window.buildStrokePagesForOrder=async function(order, wmTextOverride=''){
  const prevChars=curChars.slice();
  const prevZy=Object.assign({},lessonZy);
  const prevZyChk=$('xZy').checked;
  const prevSize=$('xSize').value;
  const prevCols=$('xCols').value;
  const prevModeEl=document.querySelector('input[name=xMode]:checked');
  const prevMode=prevModeEl?prevModeEl.value:'A';
  const isLow=+order.grade<=2;
  const chosenCols = Math.max(7, Math.min(8, order.cols ? +order.cols : (isLow?7:8)));
  const rawSheets = +order.sheets || (order.packType==='客製包' ? 1 : 20);
  const targetSheets = Math.max(1, Math.min(30, rawSheets));
  // 1 張實體紙 = 正反兩面（2 頁 A4）
  const totalPages = targetSheets * 2;
  const previewSheetIdx = Math.max(0, +(order.previewPageIdx || order.previewSheetIdx || 0));
  const wantTotalPages = order.sampleLimit ? Math.max(totalPages, (previewSheetIdx + 1) * 2) : totalPages;

  let rawText=(order.custom_words||'').trim();
  const localZy={};
  if(window.TW){
    const semKey=(order.sem==='下'?'114下':'115上');
    const pKey=(order.pub==='std'||!order.pub)?'k':order.pub;
    const semData=TW[semKey]||TW['115上']||{};
    const lsAll=(semData[pKey]||[]).filter(x=>x.g==+order.grade);
    let picked=lsAll;
    if(order.scope==='mid') picked=lsAll.slice(0,Math.ceil(lsAll.length/2));
    else if(order.scope==='final') picked=lsAll.slice(Math.ceil(lsAll.length/2));
    else if(order.custom_units){
      const uNames=order.custom_units.split(/[、,，;；/]/).map(s=>s.trim()).filter(Boolean);
      const m=lsAll.filter(x=>uNames.some(u=>x.t.includes(u)||u.includes(x.t)));
      if(m.length) picked=m;
    }
    lsAll.forEach(x=>x.c.forEach(c=>{if(c[2]&&!localZy[c[0]])localZy[c[0]]=c[2];}));
    if(!rawText){
      // 嚴格依課次與字序排列該單元所有生字（絕不隨機跳選、不缺漏任何該課生字）
      const orderedChars=[];
      picked.forEach(ls=>{
        const sList=ls.c.filter(c=>c[1]==='s').map(c=>c[0]);
        const list = sList.length ? sList : ls.c.map(c=>c[0]);
        list.forEach(ch=>{ if(ch) orderedChars.push(ch); });
      });
      rawText=orderedChars.join('');
    }
  }
  const baseText=[...rawText].filter(c=>/[\u3400-\u9fff\uf900-\ufaff]|[\u{20000}-\u{2fa1f}]/u.test(c));
  const ok=await loadChars([...new Set(baseText)]);
  const validBase=baseText.filter(c=>ok.includes(c));
  lessonZy=localZy;
  $('xZy').checked = order.ruby!==false;
  $('xSize').value = isLow?'low':'high';
  $('xCols').value = String(chosenCols);

  const targetMode = order.strokeMode === 'B' ? 'B' : 'A';
  const modeRadio = document.querySelector(`input[name=xMode][value=${targetMode}]`);
  if(modeRadio) modeRadio.checked = true;

  let onePassPages = 0;
  let L = { mode: targetMode, zy: $('xZy').checked?1:0, cols: chosenCols, cwMax: Math.floor(CONTENT_W/chosenCols), pages: [] };
  if(validBase.length){
    curChars = validBase.slice();
    L = buildLayout();
    onePassPages = L.pages.length;
    // 一次估算倍數後補齊頁數（大幅減少重複 buildLayout() 運算開銷）
    if(onePassPages > 0 && L.pages.length < wantTotalPages){
      const mult = Math.max(1, Math.floor(wantTotalPages / onePassPages));
      if(mult > 1){
        for(let m=1; m<mult; m++) curChars = curChars.concat(validBase);
        L = buildLayout();
      }
      let guard = 0;
      while(L.pages.length < wantTotalPages && guard < 12){
        curChars = curChars.concat(validBase);
        L = buildLayout();
        guard++;
      }
    }
    // 計算末頁剩餘欄位並一次補足字元後重算（無須逐字重算版面）
    if(L.pages.length){
      const targetPg = L.pages[Math.min(L.pages.length, wantTotalPages) - 1];
      const usedCols = targetPg ? new Set(targetPg.items.map(it=>it.col)).size : chosenCols;
      const freeCols = Math.max(0, chosenCols - usedCols);
      if(freeCols > 0 && L.pages.length <= wantTotalPages){
        const hasRef=$('xRef').checked, splitLim=($('xSplitLimit') && +$('xSplitLimit').value)||12, nbReq=Math.max(5,+$('xBlank').value||5);
        const colsFor = ch => {
          if(targetMode !== 'A') return 1;
          const stN = (window.HZ_DATA && HZ_DATA[ch] && HZ_DATA[ch][0]) ? HZ_DATA[ch][0].length : 8;
          const stepsLen = stN + (hasRef ? 1 : 0);
          const R_est = targetPg.R || 14;
          if(!(stN > splitLim || stepsLen + nbReq > R_est)) return 1;
          const c = Math.ceil(stepsLen / R_est);
          const lastRem = c * R_est - stepsLen;
          return lastRem < nbReq ? c + 1 : c;
        };
        let remCols = freeCols, added = 0;
        while(remCols > 0 && added < 16){
          const nextCh = validBase[curChars.length % validBase.length];
          const need = colsFor(nextCh);
          if(need > remCols) break;
          curChars.push(nextCh);
          remCols -= need;
          added++;
        }
        if(added > 0){
          const nextL = buildLayout();
          if(nextL.pages.length <= wantTotalPages) L = nextL;
          else curChars.length -= added;
        }
      }
    }
  }

  let pageIndices;
  if(order.sampleLimit){
    const pStart = previewSheetIdx * 2;
    pageIndices = [pStart, pStart + 1].filter(idx => !!L.pages[idx]);
    if(!pageIndices.length && L.pages.length) pageIndices = [0];
  } else {
    pageIndices = L.pages.slice(0, wantTotalPages).map((_, idx)=>idx);
  }

  const domPages = pageIndices.map(pIdx=>{
    const pgData = L.pages[pIdx];
    const pCols = pgData.cols || L.cols;
    const pCwMax = pgData.cwMax || L.cwMax;
    const leftOffset = Math.round((A4W - pCols * pCwMax)/2);
    const pg=document.createElement('div');pg.className='a4';
    const edge=document.createElement('div');edge.className='edge';pg.appendChild(edge);
    const colPad=Math.round((pCwMax-pgData.cw)/2);
    pgData.items.forEach(it=>{
      const im=new Image();im.src=cachedDataUrl(it,pgData);
      im.style.left=(leftOffset+it.col*pCwMax+colPad)+'px';
      im.style.top=(MARGIN+it.row*pgData.chh)+'px';
      im.style.width=pgData.cw+'px';im.style.height=(pgData.chh*it.span)+'px';
      pg.appendChild(im);
    });
    pg.appendChild(window.createWatermarkLayer(A4W,A4H,wmTextOverride));
    const modeLabel = targetMode==='A' ? '筆順引導' : '部編練習';
    const sNo = Math.floor(pIdx / 2) + 1;
    const sideStr = (pIdx % 2 === 0) ? '正面' : '背面';
    const c2=document.createElement('div');c2.className='cap';
    c2.textContent = `${window.COPYRIGHT_STATEMENT}　｜　寫字帖（${modeLabel}・${pCols}欄）第 ${sNo} 張${sideStr}（第 ${pIdx+1}/${totalPages} 面）`;
    pg.appendChild(c2);
    return pg;
  });

  curChars=prevChars; lessonZy=prevZy;
  $('xZy').checked=prevZyChk; $('xSize').value=prevSize; $('xCols').value=prevCols;
  const origRadio = document.querySelector(`input[name=xMode][value=${prevMode}]`);
  if(origRadio) origRadio.checked = true;
  return {pages:domPages, charCount:validBase.length, onePassPages, exceedsTwoPages: (onePassPages > 2 && targetSheets === 1)};
};
// ---------- Excel 匯出（A4 直式）----------
async function exportXlsx(){
  if(!await generate()){$('msg').textContent=$('msg').textContent||'請先輸入國字';return;}
  const L=buildLayout();
  const wb=new ExcelJS.Workbook();
  const ws=wb.addWorksheet('筆畫練習',{
    pageSetup:{paperSize:9,orientation:'portrait',scale:100,horizontalDpi:300,verticalDpi:300,
      margins:{left:.5,right:.5,top:.5,bottom:.55,header:.2,footer:.25},horizontalCentered:true,verticalCentered:true},
    headerFooter:{oddFooter:`&C${window.COPYRIGHT_STATEMENT}　｜　第 &P 頁／共 &N 頁（A4 直式）`},
    views:[{state:'normal',zoomScale:100,showGridLines:false}]});
  for(let c=1;c<=L.cols;c++)ws.getColumn(c).width=(L.cwMax-5)/7;
  const ids=new Map();
  let rowBase=0;
  L.pages.forEach((pgData,p)=>{
    for(let r=1;r<=pgData.R;r++)ws.getRow(rowBase+r).height=pgData.chh*.75;
    pgData.items.forEach(it=>{
      const cv=cachedCanvas(it,pgData);
      let id=ids.get(cv);
      if(id===undefined){id=wb.addImage({base64:cv.toDataURL('image/png').replace(/^data:image\/\w+;base64,/,''),extension:'png'});ids.set(cv,id);}
      ws.addImage(id,{tl:{col:it.col,row:rowBase+it.row},ext:{width:Math.round(pgData.cw-3),height:Math.round(pgData.chh*it.span-2)},editAs:'oneCell'});
    });
    rowBase+=pgData.R;
    if(p<L.pages.length-1)ws.getRow(rowBase).addPageBreak();
  });
  const buf=await wb.xlsx.writeBuffer();
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
  a.download=(L.mode==='A'?'筆順引導':'練習簿')+'_'+[...new Set(curChars)].slice(0,8).join('')+'.xlsx';
  a.click();
  $('msg').style.color='#1f9d55';$('msg').textContent=`已匯出：${curChars.length} 字、${L.pages.length} 頁（A4 直式，每頁 ${L.cols} 字）`;
}
const colName=n=>String.fromCharCode(64+n);
// ---------- 事件 ----------
const KEYS=['xZy','xRef','xNum','xGhost','xTrace'], VALS=['xSize','xCols','xBlank','xSplitLimit','xATraceN','xTraceN'];
$('btnGen').onclick=generate;
$('btnPrint').onclick=async()=>{if(!curChars.length&&!await generate())return;window.print();};
$('btnXlsx').onclick=()=>exportXlsx().catch(e=>{$('msg').textContent='匯出失敗：'+e.message;});
$('xSize').onchange=()=>{$('xCols').value=$('xSize').value==='low'?'7':'8';curChars.length&&render();};
['xCols','xZy','xRef','xNum','xGhost','xTrace','xBlank','xSplitLimit','xATraceN','xTraceN'].forEach(i=>{if($(i))$(i).onchange=()=>curChars.length&&render();});
window.buildStrokeLayoutForChars=function(charsArr){
  const prev=curChars.slice();
  curChars=Array.isArray(charsArr)?charsArr:[...String(charsArr||'')];
  const res=buildLayout();
  curChars=prev;
  return res;
};
document.querySelectorAll('input[name=xMode]').forEach(r=>r.onchange=()=>{
  const a=r.value==='A'&&r.checked;
  if(!r.checked)return;
  $('xAopts').style.display=r.value==='A'?'':'none';$('xBopts').style.display=r.value==='B'?'':'none';
  curChars.length&&render();
});
$('btnSave').onclick=()=>{
  const s={text:$('input').value,mode:document.querySelector('input[name=xMode]:checked').value};
  KEYS.forEach(k=>s[k]=$(k).checked);VALS.forEach(k=>s[k]=$(k).value);
  localStorage.setItem('strokeSheet2',JSON.stringify(s));$('msg').style.color='#1f9d55';$('msg').textContent='已儲存於本機瀏覽器';
};
$('btnLoad').onclick=()=>{
  const s=JSON.parse(localStorage.getItem('strokeSheet2')||'null');if(!s){$('msg').textContent='尚無儲存紀錄';return;}
  $('input').value=s.text;KEYS.forEach(k=>$(k).checked=!!s[k]);VALS.forEach(k=>$(k).value=s[k]);
  const r=document.querySelector(`input[name=xMode][value=${s.mode}]`);r.checked=true;r.onchange();generate();
};
// ---------- 課本生字帶入 ----------
function twList(){const t=$('twTerm').value;return ((TW[t]||{})[$('twPub').value]||[]).filter(x=>x.g==+$('twGrade').value);}
function twWordsOf(ls){
  const useS=$('twS').checked,useR=$('twR').checked;
  return ls.flatMap(x=>x.c.filter(c=>(c[1]==='s'&&useS)||(c[1]==='r'&&useR)).map(c=>c[0]));
}
function twFillLessons(){
  $('twLesson').innerHTML=twList().map((x,i)=>`<option value="${i}">${x.t}</option>`).join('');
  twShow();
}
function twShow(){
  const x=twList()[+$('twLesson').value];
  $('twWords').textContent=x?`本課：${twWordsOf([x]).join(' ')}（共 ${twWordsOf([x]).length} 字）`:'';
}
Object.keys(TW).forEach(t=>$('twTerm').add(new Option(t.replace('上','學年度 上學期').replace('下','學年度 下學期'),t)));
['twTerm','twGrade','twPub'].forEach(i=>$(i).onchange=twFillLessons);
['twLesson','twS','twR'].forEach(i=>$(i).onchange=twShow);
$('twLoad').onclick=()=>{const x=twList()[+$('twLesson').value];if(!x)return;lessonZy={};x.c.forEach(c=>{if(c[2])lessonZy[c[0]]=c[2];});$('input').value=twWordsOf([x]).join('');generate();};
$('twAll').onclick=()=>{lessonZy={};twList().forEach(x=>x.c.forEach(c=>{if(c[2]&&!lessonZy[c[0]])lessonZy[c[0]]=c[2];}));$('input').value=[...new Set(twWordsOf(twList()))].join('');generate();};
twFillLessons();
$('xSize').onchange();
