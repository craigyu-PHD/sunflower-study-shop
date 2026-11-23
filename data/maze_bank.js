/* 向日葵國小伴學誌｜迷宮遊戲產生器（幼幼／動腦／創意／進階四級）
 * 完美迷宮（recursive backtracker）＋ BFS 解答驗證 ＋ A4 雙面滿版編排。
 * seed 只由「難度＋題序」決定，故線上預覽與正式列印完全一致、可重印。 */
(function(){
  'use strict';

  // 確定性偽隨機（mulberry32）：同樣 seed 永遠產生同一座迷宮
  function mulberry32(a){
    return function(){
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function hashSeed(str){
    let h = 2166136261;
    for(let i = 0; i < str.length; i++){
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  const LEVELS = {
    baby: {
      id: 'baby', name: '幼幼迷宮（3～5歲）', short: '幼幼迷宮',
      cols: 6, rows: 8, cell: 106, wall: 6.5, icon: '🐥', goal: '🏠',
      story: '小雞找回家', hint: '從「起點」出發，幫小雞走到「終點」！', age: '3～5 歲',
      color: '#fef3c7', accent: '#d97706', bg: '#ffffff'
    },
    brain: {
      id: 'brain', name: '動腦迷宮（5～7歲）', short: '動腦迷宮',
      cols: 9, rows: 12, cell: 72, wall: 5, icon: '🐟', goal: '🧒',
      story: '小魚找朋友', hint: '從「起點」出發，帶小魚游到「終點」！', age: '5～7 歲',
      color: '#dbeafe', accent: '#1d4ed8', bg: '#ffffff'
    },
    creative: {
      id: 'creative', name: '創意迷宮（7～9歲）', short: '創意迷宮',
      cols: 12, rows: 16, cell: 54, wall: 4, icon: '🐝', goal: '🌻',
      story: '蜜蜂採花蜜', hint: '從「起點」出發，幫蜜蜂飛到花朵！', age: '7～9 歲',
      color: '#dcfce7', accent: '#15803d', bg: '#ffffff'
    },
    challenge: {
      id: 'challenge', name: '進階迷宮（9～12歲）', short: '進階迷宮',
      cols: 15, rows: 20, cell: 43, wall: 3.2, icon: '🦁', goal: '💎',
      story: '勇士尋寶藏', hint: '從「起點」出發，跟著線索找到寶藏！', age: '9～12 歲',
      color: '#ede9fe', accent: '#6d28d9', bg: '#ffffff'
    }
  };

  // 方向：0=北 1=東 2=南 3=西
  const DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];

  function generateMaze(levelId, mazeIdx){
    const lv = LEVELS[levelId] || LEVELS.baby;
    const cols = lv.cols, rows = lv.rows, total = cols * rows;
    const seed = hashSeed(`sunflower-maze-${levelId}-${mazeIdx}`);
    const rnd = mulberry32(seed);
    const walls = Array.from({length: total}, () => [true, true, true, true]);
    const seen = new Uint8Array(total);
    const stack = [0];
    seen[0] = 1;
    while(stack.length){
      const cur = stack[stack.length - 1];
      const x = cur % cols, y = Math.floor(cur / cols);
      const nbs = [];
      if(y > 0 && !seen[cur - cols]) nbs.push([cur - cols, 0]);
      if(x < cols - 1 && !seen[cur + 1]) nbs.push([cur + 1, 1]);
      if(y < rows - 1 && !seen[cur + cols]) nbs.push([cur + cols, 2]);
      if(x > 0 && !seen[cur - 1]) nbs.push([cur - 1, 3]);
      if(!nbs.length){ stack.pop(); continue; }
      const [next, dir] = nbs[Math.floor(rnd() * nbs.length)];
      walls[cur][dir] = false;
      walls[next][(dir + 2) % 4] = false;
      seen[next] = 1;
      stack.push(next);
    }
    // BFS 求起點(0)到終點(total-1)唯一最短路徑，同時驗證連通
    const prev = new Int32Array(total).fill(-1);
    const dist = new Int32Array(total).fill(-1);
    const q = [0];
    dist[0] = 0;
    for(let head = 0; head < q.length; head++){
      const cur = q[head];
      if(cur === total - 1) break;
      const x = cur % cols, y = Math.floor(cur / cols);
      for(let d = 0; d < 4; d++){
        if(walls[cur][d]) continue;
        const nx = x + DX[d], ny = y + DY[d];
        if(nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const ni = ny * cols + nx;
        if(dist[ni] !== -1) continue;
        dist[ni] = dist[cur] + 1;
        prev[ni] = cur;
        q.push(ni);
      }
    }
    const path = [];
    if(dist[total - 1] >= 0){
      let cur = total - 1;
      while(cur !== -1){ path.push(cur); cur = prev[cur]; }
      path.reverse();
    }
    return { levelId, mazeIdx, cols, rows, walls, path, solved: dist[total - 1] >= 0, seed };
  }

  // 取得第 mazeIdx 題隨機配對的純黑白起點／終點向量圖（與 PRESCHOOL_ART 109 種黑白圖庫連動）
  function getMazePair(lv, mazeIdx){
    const A = window.PRESCHOOL_ART;
    if(A && A.SUB && A.SUB_KEYS && A.SUB_KEYS.length >= 20){
      const k1 = A.pickShuffled ? A.pickShuffled(A.SUB_KEYS, mazeIdx * 2, 911) : A.SUB_KEYS[(mazeIdx * 7) % A.SUB_KEYS.length];
      let k2 = A.pickShuffled ? A.pickShuffled(A.SUB_KEYS, mazeIdx * 2 + 1, 997) : A.SUB_KEYS[(mazeIdx * 13 + 5) % A.SUB_KEYS.length];
      if(k2 === k1) k2 = A.SUB_KEYS[(A.SUB_KEYS.indexOf(k1) + 1) % A.SUB_KEYS.length];
      const c = A.mkCtx ? A.mkCtx(false, 'small') : { sw: 8, detail: 1, p: 'stroke="#222" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"', f: () => '#fff' };
      return {
        startName: A.SUB[k1].name,
        goalName: A.SUB[k2].name,
        startSvg: A.SUB[k1].draw(c),
        goalSvg: A.SUB[k2].draw(c)
      };
    }
    return {
      startName: '起點',
      goalName: '終點',
      startSvg: '<circle cx="300" cy="300" r="200" fill="#fff" stroke="#111" stroke-width="24"/><circle cx="240" cy="260" r="24" fill="#111"/><circle cx="360" cy="260" r="24" fill="#111"/><path d="M220 340 Q300 410 380 340" fill="none" stroke="#111" stroke-width="22" stroke-linecap="round"/>',
      goalSvg: '<polygon points="300,70 365,215 525,230 405,335 440,490 300,410 160,490 195,335 75,230 235,215" fill="#fff" stroke="#111" stroke-width="24" stroke-linejoin="round"/>'
    };
  }

  // 畫單座迷宮的 SVG 字串（黑白省墨、市售評量級粗線大格）；showPath=true 時疊上黑白虛線解答路線
  function mazeSvg(maze, lv, showPath, opt){
    opt = opt || {};
    const cell = opt.cell || lv.cell;
    const wall = opt.wall || lv.wall;
    const padX = Math.max(14, Math.round(cell * 0.32));
    const padTop = Math.max(20, Math.round(cell * 0.42));
    const padBot = Math.max(20, Math.round(cell * 0.42));
    const W = maze.cols * cell + padX * 2;
    const H = maze.rows * cell + padTop + padBot;
    const ox = padX, oy = padTop;
    const parts = [
      `<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="14" fill="#ffffff" stroke="${lv.accent}" stroke-width="${Math.max(2.2, wall * 0.6)}"/>`
    ];

    // 起點／終點柔和底紋（白底省墨、起終點溫和標示讓幼兒一眼辨識）
    if(!showPath){
      parts.push(`<rect x="${ox + 2}" y="${oy + 2}" width="${cell - 4}" height="${cell - 4}" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="4 3"/>`);
      parts.push(`<rect x="${ox + (maze.cols - 1) * cell + 2}" y="${oy + (maze.rows - 1) * cell + 2}" width="${cell - 4}" height="${cell - 4}" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.8" stroke-dasharray="4 3"/>`);
    }

    // 解答路徑（清晰橘色折線）
    if(showPath && maze.path.length > 1){
      const pts = maze.path.map(i => `${ox + (i % maze.cols + 0.5) * cell},${oy + (Math.floor(i / maze.cols) + 0.5) * cell}`).join(' ');
      parts.push(`<polyline points="${pts}" fill="none" stroke="#f97316" stroke-opacity="0.28" stroke-width="${cell * 0.45}" stroke-linecap="round" stroke-linejoin="round"/>`);
      parts.push(`<polyline points="${pts}" fill="none" stroke="#ea580c" stroke-width="${Math.max(2.4, wall * 0.85)}" stroke-linecap="round" stroke-linejoin="round"/>`);
    }

    // 牆：起點頂牆／終點底牆留出入口缺口，其餘每格畫北、西牆與南、東外牆
    const seg = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#1f2937" stroke-width="${wall}" stroke-linecap="round"/>`;
    for(let i = 0; i < maze.cols * maze.rows; i++){
      const x = i % maze.cols, y = Math.floor(i / maze.cols);
      const px = ox + x * cell, py = oy + y * cell;
      if(maze.walls[i][0] && i !== 0) parts.push(seg(px, py, px + cell, py));
      if(maze.walls[i][3]) parts.push(seg(px, py, px, py + cell));
      if(y === maze.rows - 1 && maze.walls[i][2] && i !== maze.cols * maze.rows - 1) parts.push(seg(px, py + cell, px + cell, py + cell));
      if(x === maze.cols - 1 && maze.walls[i][1]) parts.push(seg(px + cell, py, px + cell, py + cell));
    }

    // 起點／終點標籤與純黑白向量插圖（零彩色 Emoji）
    const lblFs = Math.max(11, Math.min(18, Math.round(padTop * 0.38)));
    const pair = getMazePair(lv, maze.mazeIdx || 0);
    if(!showPath){
      parts.push(`<text x="${ox + cell * 0.5}" y="${oy - 8}" font-size="${lblFs}" font-weight="800" font-family="Noto Sans TC,sans-serif" text-anchor="middle" fill="#111111">▼ 起點：${pair.startName}</text>`);
      parts.push(`<text x="${ox + (maze.cols - 0.5) * cell}" y="${oy + maze.rows * cell + lblFs + 6}" font-size="${lblFs}" font-weight="800" font-family="Noto Sans TC,sans-serif" text-anchor="middle" fill="#111111">▲ 終點：${pair.goalName}</text>`);
    }
    const sc = (cell * 0.76) / 600;
    const off = (cell - 600 * sc) / 2;
    parts.push(`<g transform="translate(${(ox + off).toFixed(1)} ${(oy + off).toFixed(1)}) scale(${sc.toFixed(4)})">${pair.startSvg}</g>`);
    parts.push(`<g transform="translate(${(ox + (maze.cols - 1) * cell + off).toFixed(1)} ${(oy + (maze.rows - 1) * cell + off).toFixed(1)}) scale(${sc.toFixed(4)})">${pair.goalSvg}</g>`);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" style="width:100%;height:100%;display:block">${parts.join('')}</svg>`;
  }

  function buildPages(cfg){
    cfg = cfg || {};
    const levelId = LEVELS[cfg.level] ? cfg.level : 'baby';
    const lv = LEVELS[levelId];
    const sheets = Math.max(1, Math.min(30, +(cfg.sheets || 10)));
    const withAns = cfg.withAns !== false;
    const wmText = cfg.wmText || '';
    const cpr = window.COPYRIGHT_STATEMENT || '🌻 向日葵國小伴學誌・專屬訂製請勿轉售';

    // 每張正反兩面，每面 1 座滿版大迷宮 → 共 sheets*2 面、sheets*2 題（閱讀友善、無浪費留白）
    const faceCount = sheets * 2;
    const mazes = [];
    for(let i = 0; i < faceCount; i++) mazes.push(generateMaze(levelId, i));

    // 解答頁：每頁 4 座縮圖；解答頁數補成偶數維持雙面裝訂
    const ansFaces = withAns ? Math.ceil(mazes.length / 4) : 0;
    const ansEven = ansFaces % 2 === 0 ? ansFaces : ansFaces + 1;
    const totalFaces = faceCount + ansEven;

    const previewIdx = cfg.sampleLimit ? Math.max(0, +(cfg.previewPageIdx || 0)) : -1;
    let pageIndices = Array.from({length: totalFaces}, (_, i) => i);
    if(Array.isArray(cfg.onlyPages) && cfg.onlyPages.length){
      pageIndices = cfg.onlyPages.filter(i => i >= 0 && i < totalFaces);
      if(!pageIndices.length) pageIndices = [0];
    }else if(cfg.answerPreview){
      pageIndices = [faceCount, faceCount + 1].filter(i => i < totalFaces);
      if(!pageIndices.length) pageIndices = [faceCount];
    }else if(previewIdx >= 0){
      const pStart = previewIdx * 2;
      pageIndices = [pStart, pStart + 1].filter(i => i < totalFaces);
      if(!pageIndices.length) pageIndices = [0];
    }

    const A4W = 794, A4H = 1122;
    const pages = pageIndices.map(pIdx => {
      const pg = document.createElement('div');
      pg.className = 'a4 maze-a4';
      pg.appendChild(Object.assign(document.createElement('div'), {className: 'edge'}));
      const isAns = pIdx >= faceCount;
      const pair = !isAns ? getMazePair(lv, pIdx) : null;
      const hd = document.createElement('div');
      hd.className = 'maze-hd';
      hd.innerHTML = isAns
        ? `<div class="maze-hd-title"><b>${lv.short}｜解答頁</b><span>正確路線對照</span></div><div class="maze-hd-meta">向日葵國小伴學誌　｜　家長／老師批改對照用</div>`
        : `<div class="maze-hd-title"><b>第 ${pIdx + 1} 關｜${lv.name}</b><span>任務：從起點出發，幫「${pair.startName}」穿過迷宮找到「${pair.goalName}」！</span></div><div class="maze-hd-meta">姓名：____________　日期：____月____日　☆☆☆</div>`;
      pg.appendChild(hd);

      if(!isAns){
        const box = document.createElement('div');
        box.className = 'maze-body maze-body-1';
        const card = document.createElement('div');
        card.className = 'maze-card maze-card-full';
        card.innerHTML = mazeSvg(mazes[pIdx], lv, false)
          + `<div class="maze-foot-tip">小提醒：先用手指走走看，找到不會碰壁的路，再用鉛筆畫出路線喔！</div>`;
        box.appendChild(card);
        pg.appendChild(box);
      }else{
        const aIdx = pIdx - faceCount;
        const box = document.createElement('div');
        box.className = 'maze-body maze-body-ans';
        for(let k = 0; k < 4; k++){
          const mi = aIdx * 4 + k;
          if(mi >= mazes.length) break;
          const card = document.createElement('div');
          card.className = 'maze-ans-card';
          const scale = Math.min(1, 210 / (mazes[mi].rows * lv.cell + 40));
          const inner = mazeSvg(mazes[mi], lv, true, {cell: Math.max(10, Math.round(lv.cell * scale)), wall: Math.max(1.6, lv.wall * scale)});
          card.innerHTML = `<div class="maze-ans-t">第 ${mi + 1} 關</div>${inner}`;
          box.appendChild(card);
        }
        pg.appendChild(box);
      }

      if(window.createWatermarkLayer) pg.appendChild(window.createWatermarkLayer(A4W, A4H, wmText));
      const sNo = Math.floor(pIdx / 2) + 1;
      const side = pIdx % 2 === 0 ? '正面' : '背面';
      const cap = document.createElement('div');
      cap.className = 'cap';
      cap.textContent = `${cpr}　｜　${lv.short}第 ${sNo} 張${side}（第 ${pIdx + 1}/${totalFaces} 面）`;
      pg.appendChild(cap);
      return pg;
    });

    return {
      pages, level: lv, mazeCount: mazes.length, qFaces: faceCount,
      ansFaces: ansEven, totalPages: totalFaces, sheets,
      unsolved: mazes.filter(m => !m.solved).map(m => m.mazeIdx)
    };
  }

  // QA 用：驗證各級迷宮連通性與解答正確
  function selfTest(){
    const report = [];
    Object.keys(LEVELS).forEach(id => {
      let bad = 0, minLen = Infinity, maxLen = 0;
      for(let i = 0; i < 40; i++){
        const m = generateMaze(id, i);
        if(!m.solved || m.path[0] !== 0 || m.path[m.path.length - 1] !== m.cols * m.rows - 1) bad++;
        minLen = Math.min(minLen, m.path.length);
        maxLen = Math.max(maxLen, m.path.length);
      }
      report.push({ id, name: LEVELS[id].short, tested: 40, bad, minLen, maxLen });
    });
    return report;
  }

  window.MAZE_BANK = { levels: LEVELS, generateMaze, mazeSvg, buildPages, selfTest, hashSeed };
})();
