/* 台灣幼兒園運筆與符號啟蒙寫字帖資料庫 ＆ A4 滿版繪製引擎（小班／中班／大班：ㄅㄆㄇ、阿拉伯數字、ABC 整合編排） */
(function(){
  const ZY_ALL = [
    {sym:'ㄅ', hint:'杯子', icon:'🥤'}, {sym:'ㄆ', hint:'葡萄', icon:'🍇'}, {sym:'ㄇ', hint:'貓咪', icon:'🐱'},
    {sym:'ㄈ', hint:'飛機', icon:'✈️'}, {sym:'ㄉ', hint:'大象', icon:'🐘'}, {sym:'ㄊ', hint:'兔子', icon:'🐰'},
    {sym:'ㄋ', hint:'牛奶', icon:'🥛'}, {sym:'ㄌ', hint:'獅子', icon:'🦁'}, {sym:'ㄍ', hint:'鴿子', icon:'🕊️'},
    {sym:'ㄎ', hint:'恐龍', icon:'🦕'}, {sym:'ㄏ', hint:'河馬', icon:'🦛'}, {sym:'ㄐ', hint:'雞蛋', icon:'🥚'},
    {sym:'ㄑ', hint:'氣球', icon:'🎈'}, {sym:'ㄒ', hint:'西瓜', icon:'🍉'}, {sym:'ㄓ', hint:'蜘蛛', icon:'🕷️'},
    {sym:'ㄔ', hint:'尺子', icon:'📏'}, {sym:'ㄕ', hint:'書包', icon:'🎒'}, {sym:'ㄖ', hint:'太陽', icon:'🌞'},
    {sym:'ㄗ', hint:'積木', icon:'🧱'}, {sym:'ㄘ', hint:'草莓', icon:'🍓'}, {sym:'ㄙ', hint:'雨傘', icon:'☂️'},
    {sym:'ㄚ', hint:'鴨子', icon:'🦆'}, {sym:'ㄛ', hint:'公雞', icon:'🐓'}, {sym:'ㄜ', hint:'白鵝', icon:'🦢'},
    {sym:'ㄝ', hint:'葉子', icon:'🍃'}, {sym:'ㄞ', hint:'愛心', icon:'❤️'}, {sym:'ㄟ', hint:'向日葵', icon:'🌻'},
    {sym:'ㄠ', hint:'小貓', icon:'🐾'}, {sym:'ㄡ', hint:'海鷗', icon:'🐦'}, {sym:'ㄢ', hint:'平安', icon:'🍎'},
    {sym:'ㄣ', hint:'森林', icon:'🌲'}, {sym:'ㄤ', hint:'糖果', icon:'🍬'}, {sym:'ㄥ', hint:'蜜蜂', icon:'🐝'},
    {sym:'ㄦ', hint:'耳朵', icon:'👂'}, {sym:'ㄧ', hint:'衣服', icon:'👕'}, {sym:'ㄨ', hint:'烏龜', icon:'🐢'},
    {sym:'ㄩ', hint:'小魚', icon:'🐟'}
  ];

  const ABC_ALL = [
    {up:'A', lo:'a', hint:'Apple', icon:'🍎'}, {up:'B', lo:'b', hint:'Bear', icon:'🐻'},
    {up:'C', lo:'c', hint:'Cat', icon:'🐱'}, {up:'D', lo:'d', hint:'Dog', icon:'🐶'},
    {up:'E', lo:'e', hint:'Egg', icon:'🥚'}, {up:'F', lo:'f', hint:'Fish', icon:'🐟'},
    {up:'G', lo:'g', hint:'Grape', icon:'🍇'}, {up:'H', lo:'h', hint:'House', icon:'🏠'},
    {up:'I', lo:'i', hint:'Ice', icon:'🍦'}, {up:'J', lo:'j', hint:'Juice', icon:'🧃'},
    {up:'K', lo:'k', hint:'Kite', icon:'🪁'}, {up:'L', lo:'l', hint:'Lion', icon:'🦁'},
    {up:'M', lo:'m', hint:'Moon', icon:'🌙'}, {up:'N', lo:'n', hint:'Nest', icon:'🪺'},
    {up:'O', lo:'o', hint:'Orange', icon:'🍊'}, {up:'P', lo:'p', hint:'Panda', icon:'🐼'},
    {up:'Q', lo:'q', hint:'Queen', icon:'👑'}, {up:'R', lo:'r', hint:'Rabbit', icon:'🐰'},
    {up:'S', lo:'s', hint:'Star', icon:'⭐'}, {up:'T', lo:'t', hint:'Tree', icon:'🌳'},
    {up:'U', lo:'u', hint:'Umbrella', icon:'☂️'}, {up:'V', lo:'v', hint:'Van', icon:'🚐'},
    {up:'W', lo:'w', hint:'Whale', icon:'🐳'}, {up:'X', lo:'x', hint:'X-ray', icon:'🩻'},
    {up:'Y', lo:'y', hint:'Yo-yo', icon:'🪀'}, {up:'Z', lo:'z', hint:'Zebra', icon:'🦓'}
  ];

  const NUM_ICONS = ['🍎','🐻','🌸','⭐','🐟','🍓','🎈','🐝','🦋','🌻','🚗','🍪','🐥','🍉','🚀','🎁','🐢','🌈','🦄','👑'];

  function makeNumItem(n){
    const icon = NUM_ICONS[(n - 1) % NUM_ICONS.length];
    return {
      kind: 'num',
      sym: String(n),
      hint: n <= 10 ? `${n} 個` : `${n}`,
      dots: n <= 10 ? n : 0,
      icon
    };
  }

  // 台灣幼兒園教保活動課程大綱與幼小銜接分齡進度定義
  const PRESCHOOL_LEVELS = {
    small: {
      id: 'small',
      name: '小班（3～4歲）',
      stageTitle: '運筆協調・感官啟蒙篇',
      cols: 5,
      rows: 6,
      desc: '特大格防手痠：數字 1～5 具象點數描畫、注音 ㄅㄆㄇㄈ／ㄚㄛㄜ 聲韻初識、ABC 大寫 A～J 趣味描寫',
      getItems(topic){
        const nums = [1,2,3,4,5].map(makeNumItem);
        const zys = ZY_ALL.slice(0, 6).concat(ZY_ALL.slice(21, 24)).map(x=>({kind:'zy', ...x}));
        const abcs = ABC_ALL.slice(0, 10).map(x=>({kind:'abc', sym:x.up, hint:x.hint, icon:x.icon}));
        if(topic === 'num') return nums;
        if(topic === 'zy') return zys;
        if(topic === 'abc') return abcs;
        return [...nums, ...zys, ...abcs];
      }
    },
    mid: {
      id: 'mid',
      name: '中班（4～5歲）',
      stageTitle: '符號認讀・筆順建立篇',
      cols: 6,
      rows: 7,
      desc: '中大格穩固握筆：數字 1～10 序列數數、21 個注音聲母（ㄅ～ㄙ）認讀描紅、26 個英文字母大寫 A～Z',
      getItems(topic){
        const nums = Array.from({length:10}, (_,i)=>makeNumItem(i+1));
        const zys = ZY_ALL.slice(0, 21).map(x=>({kind:'zy', ...x}));
        const abcs = ABC_ALL.map(x=>({kind:'abc', sym:x.up, hint:x.hint, icon:x.icon}));
        if(topic === 'num') return nums;
        if(topic === 'zy') return zys;
        if(topic === 'abc') return abcs;
        return [...nums, ...zys, ...abcs];
      }
    },
    large: {
      id: 'large',
      name: '大班（5～6歲）',
      stageTitle: '幼小銜接・完整先修篇',
      cols: 7,
      rows: 9,
      desc: '銜接小一標準大格：完整 37 個注音符號（聲母＋韻母）、數字 1～20 與整十進階、26 組英文字母大小寫 Aa～Zz 四線格',
      getItems(topic){
        const nums = Array.from({length:20}, (_,i)=>makeNumItem(i+1))
          .concat([30,40,50,60,70,80,90,100].map(n=>({kind:'num', sym:String(n), hint:`${n}`, dots:0, icon:'🌟'})));
        const zys = ZY_ALL.map(x=>({kind:'zy', ...x}));
        const abcs = ABC_ALL.map(x=>({kind:'abc', sym:`${x.up}${x.lo}`, hint:x.hint, icon:x.icon}));
        if(topic === 'num') return nums;
        if(topic === 'zy') return zys;
        if(topic === 'abc') return abcs;
        return [...nums, ...zys, ...abcs];
      }
    }
  };

  function getPreschoolStartHint(sym, kind){
    // 常見首筆起點相對座標（0~1 比例），幫助幼兒園孩子抓準「由上往下／由左往右」起筆點
    if(kind === 'num'){
      const first = String(sym)[0];
      const m = {'1':[0.50,0.22],'2':[0.32,0.28],'3':[0.33,0.25],'4':[0.58,0.22],'5':[0.35,0.22],'6':[0.58,0.22],'7':[0.28,0.24],'8':[0.50,0.22],'9':[0.52,0.24],'0':[0.50,0.22]};
      return m[first] || [0.40, 0.25];
    }
    if(kind === 'abc'){
      return [0.36, 0.26];
    }
    return [0.34, 0.26];
  }

  function drawPreschoolCell(item, rowIdx, totalRows, cw, chh, showIllust, levelId){
    const SCALE = 2;
    const cv = document.createElement('canvas');
    cv.width = cw * SCALE;
    cv.height = chh * SCALE;
    const g = cv.getContext('2d');
    g.scale(SCALE, SCALE);

    g.fillStyle = '#fff';
    g.fillRect(0, 0, cw, chh);

    const pad = 4;
    const bx = pad, by = pad, bw = cw - pad*2, bh = chh - pad*2;

    if(rowIdx === 0){
      // 頂格：可愛小插圖徽章區 ＋ 示範大字（置頂不留白）
      g.fillStyle = item.kind === 'zy' ? '#fff7ed' : (item.kind === 'num' ? '#f0fdf4' : '#eff6ff');
      g.fillRect(bx, by, bw, bh);
      g.strokeStyle = item.kind === 'zy' ? '#fb923c' : (item.kind === 'num' ? '#4ade80' : '#60a5fa');
      g.lineWidth = 1.8;
      g.strokeRect(bx, by, bw, bh);

      // 右上角可愛小插圖 + 詞語小提示（可切換顯示）
      if(showIllust){
        const topH = Math.round(bh * 0.34);
        g.fillStyle = 'rgba(255,255,255,0.88)';
        g.fillRect(bx+2, by+2, bw-4, topH);

        const iconFs = Math.max(15, Math.min(26, Math.round(bh * 0.22)));
        g.font = `${iconFs}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
        g.textBaseline = 'middle';
        g.textAlign = 'left';
        g.fillText(item.icon || '🌟', bx + 7, by + topH * 0.54);

        g.fillStyle = '#5a2d00';
        const hintFs = Math.max(10, Math.min(13.5, Math.round(bw * 0.115)));
        g.font = `700 ${hintFs}px "Noto Sans TC","PingFang TC",sans-serif`;
        g.textAlign = 'right';
        if(item.kind === 'num' && item.dots > 0 && item.dots <= 5){
          g.fillText('●'.repeat(item.dots), bx + bw - 7, by + topH * 0.54);
        } else {
          g.fillText(item.hint || '', bx + bw - 7, by + topH * 0.54);
        }
      }

      // 下方範字大字體
      const sym = String(item.sym);
      const modelTop = showIllust ? by + Math.round(bh * 0.36) : by + 4;
      const modelH = by + bh - modelTop - 4;
      const len = sym.length;
      const baseFs = len >= 3 ? modelH * 0.48 : (len === 2 ? modelH * 0.62 : modelH * 0.78);
      const fontFam = item.kind === 'abc'
        ? '"Arial Rounded MT Bold","Comic Sans MS","PingFang TC",sans-serif'
        : '"BiauKai","DFKai-SB","標楷體","Noto Sans TC",sans-serif';
      g.font = `700 ${Math.round(baseFs)}px ${fontFam}`;
      g.fillStyle = '#1e293b';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(sym, bx + bw / 2, modelTop + modelH * 0.53);

      // 小起筆紅點提示
      const [rx, ry] = getPreschoolStartHint(sym, item.kind);
      g.fillStyle = '#ef4444';
      g.beginPath();
      g.arc(bx + bw * rx * 0.85, modelTop + modelH * ry * 0.85, 3.2, 0, Math.PI * 2);
      g.fill();
      return cv;
    }

    // 練習格框線：英文採用「四線三格」、數字與注音採用「十字虛線引導大格」
    g.strokeStyle = item.kind === 'zy' ? '#f59e0b' : (item.kind === 'num' ? '#22c55e' : '#3b82f6');
    g.lineWidth = 1.4;
    g.strokeRect(bx, by, bw, bh);

    if(item.kind === 'abc'){
      // 英文四線格（頂線、中虛線、紅基線、底線）
      const y1 = by + bh * 0.18, y2 = by + bh * 0.44, y3 = by + bh * 0.72, y4 = by + bh * 0.90;
      g.lineWidth = 0.8;
      g.strokeStyle = '#93c5fd';
      g.beginPath(); g.moveTo(bx, y1); g.lineTo(bx+bw, y1); g.moveTo(bx, y4); g.lineTo(bx+bw, y4); g.stroke();
      g.setLineDash([4,3]);
      g.beginPath(); g.moveTo(bx, y2); g.lineTo(bx+bw, y2); g.stroke();
      g.setLineDash([]);
      g.strokeStyle = '#f87171';
      g.beginPath(); g.moveTo(bx, y3); g.lineTo(bx+bw, y3); g.stroke();
    } else {
      // 十字輔助虛線
      g.lineWidth = 0.8;
      g.strokeStyle = '#e5e7eb';
      g.setLineDash([4,3]);
      g.beginPath();
      g.moveTo(bx + bw/2, by); g.lineTo(bx + bw/2, by + bh);
      g.moveTo(bx, by + bh/2); g.lineTo(bx + bw, by + bh/2);
      g.stroke();
      g.setLineDash([]);
    }

    // 漸層描紅引導：前段較深描紅 → 中段淺灰描紅 → 最末格極淺提示（置頂到底不留空白）
    const sym = String(item.sym);
    const len = sym.length;
    const isLastBlank = (rowIdx === totalRows - 1 && totalRows >= 7);
    const baseFs = len >= 3 ? bh * 0.44 : (len === 2 ? bh * 0.56 : bh * 0.72);
    const fontFam = item.kind === 'abc'
      ? '"Arial Rounded MT Bold","Comic Sans MS","PingFang TC",sans-serif'
      : '"BiauKai","DFKai-SB","標楷體","Noto Sans TC",sans-serif';
    g.font = `600 ${Math.round(baseFs)}px ${fontFam}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';

    if(!isLastBlank){
      const isGuide = rowIdx === 1;
      const strokeColor = isGuide ? '#94a3b8' : (rowIdx <= Math.ceil(totalRows * 0.55) ? '#cbd5e1' : '#e2e8f0');
      if(isGuide || levelId === 'small'){
        // 虛線描紅框（小班與首練習格加強輪廓描繪感）
        g.save();
        g.strokeStyle = strokeColor;
        g.lineWidth = levelId === 'small' ? 1.8 : 1.3;
        g.setLineDash([3, 2.5]);
        g.strokeText(sym, bx + bw/2, by + bh * 0.53);
        g.fillStyle = isGuide ? 'rgba(148,163,184,0.22)' : 'rgba(203,213,225,0.16)';
        g.fillText(sym, bx + bw/2, by + bh * 0.53);
        g.restore();
      } else {
        g.fillStyle = strokeColor;
        g.fillText(sym, bx + bw/2, by + bh * 0.53);
      }

      if(rowIdx === 1){
        const [rx, ry] = getPreschoolStartHint(sym, item.kind);
        g.fillStyle = '#f97316';
        g.beginPath();
        g.arc(bx + bw * rx, by + bh * ry, 2.8, 0, Math.PI * 2);
        g.fill();
      }
    } else {
      // 最底獨立練習格留有極淡小角提示字，讓孩子仍不迷路
      g.font = `600 10px "Noto Sans TC",sans-serif`;
      g.fillStyle = '#cbd5e1';
      g.textAlign = 'left';
      g.textBaseline = 'top';
      g.fillText(sym, bx + 4, by + 3);
    }

    return cv;
  }

  const _preschoolUrlCache = new Map();
  function drawPreschoolCellCached(item, rowIdx, totalRows, w, h, showIllust, levelId){
    const key = `${levelId}|${item.kind}|${item.sym}|${item.ex}|${rowIdx}|${totalRows}|${w}x${h}|${showIllust?1:0}`;
    if(_preschoolUrlCache.has(key)) return _preschoolUrlCache.get(key);
    const cv = drawPreschoolCell(item, rowIdx, totalRows, w, h, showIllust, levelId);
    const url = cv.toDataURL();
    if(_preschoolUrlCache.size > 600){
      const first = _preschoolUrlCache.keys().next().value;
      if(first !== undefined) _preschoolUrlCache.delete(first);
    }
    _preschoolUrlCache.set(key, url);
    return url;
  }

  function buildPreschoolPagesForConfig(cfg){
    const levelId = PRESCHOOL_LEVELS[cfg.level] ? cfg.level : 'small';
    const lvl = PRESCHOOL_LEVELS[levelId];
    const topic = cfg.topic || 'all';
    const baseItems = lvl.getItems(topic);
    const cols = lvl.cols;
    const rows = lvl.rows;
    const sheets = Math.max(1, Math.min(30, +(cfg.sheets || 1)));
    const wantPages = cfg.singlePass ? Math.max(1, Math.ceil(baseItems.length / cols)) : (sheets * 2);
    const showIllust = cfg.illust !== false;
    const wmText = cfg.wmText || '';
    const cpr = window.COPYRIGHT_STATEMENT || '🌻 向日葵國小伴學誌｜幼兒園適齡運筆啟蒙・專屬訂製請勿轉售';
    const topicLabel = { all:'ㄅㄆㄇ・數字・ABC 綜合進度', zy:'注音符號（ㄅㄆㄇ）', num:'阿拉伯數字（123）', abc:'英文字母（ABC）' }[topic] || '綜合練習';

    // 依所選班別與順序展開項目，並確保每頁每一欄皆 100% 填滿不留白
    const totalSlots = wantPages * cols;
    const expanded = [];
    for(let i = 0; i < totalSlots; i++){
      expanded.push(baseItems[i % baseItems.length]);
    }

    const previewIdx = cfg.sampleLimit ? Math.max(0, +(cfg.previewPageIdx || 0)) : -1;
    let pageIndices = Array.from({length: wantPages}, (_,i)=>i);
    if(previewIdx >= 0){
      const pStart = previewIdx * 2;
      pageIndices = [pStart, pStart + 1].filter(idx => idx < wantPages);
      if(!pageIndices.length) pageIndices = [0];
    }

    const A4W = 794, MARGIN = 26, HEADER_H = 74;
    const CONTENT_W = A4W - MARGIN * 2;
    const CONTENT_H = 1122 - MARGIN - HEADER_H - 34; // 保留底部版權列 34px
    const cwMax = Math.floor(CONTENT_W / cols);
    const chh = Math.floor(CONTENT_H / rows);

    const pages = pageIndices.map(pIdx => {
      const pg = document.createElement('div');
      pg.className = 'a4 preschool-a4';
      pg.appendChild(Object.assign(document.createElement('div'), {className:'edge'}));

      const hd = document.createElement('div');
      hd.className = 'pre-a4-hd';
      hd.innerHTML = `
        <div class="pre-a4-title">
          <b>🐣 向日葵幼兒園運筆寫字帖｜${lvl.name}</b>
          <span>${lvl.stageTitle} ・ ${topicLabel}</span>
        </div>
        <div class="pre-a4-info">
          <span>寶貝姓名：________</span>
          <span>日期：___月___日</span>
          <span>表現貼紙：⭐🌟</span>
        </div>`;
      pg.appendChild(hd);

      const leftOff = Math.round((A4W - cols * cwMax) / 2);
      const topOff = HEADER_H + 6;
      const slice = expanded.slice(pIdx * cols, (pIdx + 1) * cols);

      slice.forEach((item, c) => {
        for(let r = 0; r < rows; r++){
          const im = document.createElement('img');
          im.src = drawPreschoolCellCached(item, r, rows, cwMax, chh, showIllust, levelId);
          im.style.cssText = `position:absolute;left:${leftOff + c * cwMax}px;top:${topOff + r * chh}px;width:${cwMax}px;height:${chh}px;display:block`;
          pg.appendChild(im);
        }
      });

      if(window.createWatermarkLayer) pg.appendChild(window.createWatermarkLayer(794, 1122, wmText));
      const sNo = Math.floor(pIdx / 2) + 1;
      const side = (pIdx % 2 === 0) ? '正面' : '背面';
      const cap = document.createElement('div');
      cap.className = 'cap';
      cap.textContent = `${cpr}　｜　幼兒園${lvl.name}（${cols}欄×${rows}列）第 ${sNo} 張${side}（第 ${pIdx+1}/${wantPages} 面）`;
      pg.appendChild(cap);
      return pg;
    });

    return {
      pages,
      level: lvl,
      topicLabel,
      itemCount: baseItems.length,
      totalPages: wantPages,
      sheets
    };
  }

  window.PRESCHOOL_BANK = {
    levels: PRESCHOOL_LEVELS,
    ZY_ALL,
    ABC_ALL,
    buildPages: buildPreschoolPagesForConfig
  };
})();
