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
      cols: 5, rows: 5, cell: 42, wall: 4, icon: '🐥', goal: '🏠',
      story: '小雞找回家', hint: '幫小雞找到回家的路！', age: '3～5 歲',
      color: '#fef3c7', accent: '#d97706', bg: '#fffbeb'
    },
    brain: {
      id: 'brain', name: '動腦迷宮（5～7歲）', short: '動腦迷宮',
      cols: 8, rows: 8, cell: 30, wall: 3.5, icon: '🐟', goal: '🧒',
      story: '小魚找朋友', hint: '帶小魚游到朋友身邊！', age: '5～7 歲',
      color: '#dbeafe', accent: '#1d4ed8', bg: '#eff6ff'
    },
    creative: {
      id: 'creative', name: '創意迷宮（7～9歲）', short: '創意迷宮',
      cols: 11, rows: 11, cell: 23, wall: 3, icon: '🐝', goal: '🌻',
      story: '蜜蜂採花蜜', hint: '幫蜜蜂找到最美的花！', age: '7～9 歲',
      color: '#dcfce7', accent: '#15803d', bg: '#f0fdf4'
    },
    challenge: {
      id: 'challenge', name: '進階迷宮（9～12歲）', short: '進階迷宮',
      cols: 14, rows: 14, cell: 19, wall: 2.6, icon: '🦁', goal: '💎',
      story: '勇士尋寶藏', hint: '跟著勇士找到寶藏！', age: '9～12 歲',
      color: '#ede9fe', accent: '#6d28d9', bg: '#f5f3ff'
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

  // 畫單座迷宮的 SVG 字串；showPath=true 時疊上解答路線
  function mazeSvg(maze, lv, showPath, opt){
    opt = opt || {};
    const cell = opt.cell || lv.cell;
    const wall = opt.wall || lv.wall;
    const pad = Math.max(10, Math.round(cell * 0.45));
    const W = maze.cols * cell + pad * 2;
    const H = maze.rows * cell + pad * 2;
    const ox = pad, oy = pad;
    const parts = [`<rect x="0" y="0" width="${W}" height="${H}" rx="12" fill="${lv.bg}" stroke="${lv.accent}" stroke-width="2.5"/>`];

    // 通道底色（起點淡綠、終點淡紅）
    if(!showPath){
      parts.push(`<rect x="${ox}" y="${oy}" width="${cell}" height="${cell}" fill="#bbf7d0"/>`);
      parts.push(`<rect x="${ox + (maze.cols - 1) * cell}" y="${oy + (maze.rows - 1) * cell}" width="${cell}" height="${cell}" fill="#fecaca"/>`);
    }

    // 解答路徑（橙色半透明折線 + 圓點）
    if(showPath && maze.path.length > 1){
      const pts = maze.path.map(i => `${ox + (i % maze.cols + 0.5) * cell},${oy + (Math.floor(i / maze.cols) + 0.5) * cell}`).join(' ');
      parts.push(`<polyline points="${pts}" fill="none" stroke="#f97316" stroke-opacity="0.30" stroke-width="${cell * 0.55}" stroke-linecap="round" stroke-linejoin="round"/>`);
      parts.push(`<polyline points="${pts}" fill="none" stroke="#ea580c" stroke-width="${Math.max(2, wall)}" stroke-linecap="round" stroke-linejoin="round"/>`);
    }

    // 牆：每格畫北、西墙，最後補南、東外牆
    const seg = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${lv.accent}" stroke-width="${wall}" stroke-linecap="round"/>`;
    for(let i = 0; i < maze.cols * maze.rows; i++){
      const x = i % maze.cols, y = Math.floor(i / maze.cols);
      const px = ox + x * cell, py = oy + y * cell;
      if(maze.walls[i][0]) parts.push(seg(px, py, px + cell, py));
      if(maze.walls[i][3]) parts.push(seg(px, py, px, py + cell));
      if(y === maze.rows - 1 && maze.walls[i][2]) parts.push(seg(px, py + cell, px + cell, py + cell));
      if(x === maze.cols - 1 && maze.walls[i][1]) parts.push(seg(px + cell, py, px + cell, py + cell));
    }

    // 起點／終點圖示
    const fsz = Math.max(13, Math.round(cell * 0.62));
    parts.push(`<text x="${ox + cell / 2}" y="${oy + cell / 2 + fsz * 0.35}" font-size="${fsz}" text-anchor="middle">${lv.icon}</text>`);
    parts.push(`<text x="${ox + (maze.cols - 0.5) * cell}" y="${oy + (maze.rows - 0.5) * cell + fsz * 0.35}" font-size="${fsz}" text-anchor="middle">${lv.goal}</text>`);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block">${parts.join('')}</svg>`;
  }

  function buildPages(cfg){
    cfg = cfg || {};
    const levelId = LEVELS[cfg.level] ? cfg.level : 'baby';
    const lv = LEVELS[levelId];
    const sheets = Math.max(1, Math.min(30, +(cfg.sheets || 10)));
    const withAns = cfg.withAns !== false;
    const wmText = cfg.wmText || '';
    const cpr = window.COPYRIGHT_STATEMENT || '🌻 向日葵國小伴學誌・專屬訂製請勿轉售';

    // 每張正反兩面，每面 2 座迷宮 → 共 sheets*2 面、sheets*4 題
    const faceCount = sheets * 2;
    const mazes = [];
    for(let i = 0; i < faceCount * 2; i++) mazes.push(generateMaze(levelId, i));

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
      const hd = document.createElement('div');
      hd.className = 'maze-hd';
      hd.innerHTML = isAns
        ? `<div class="maze-hd-title"><b>🗝️ ${lv.short}｜解答頁</b><span>${lv.story}・正確路線</span></div><div class="maze-hd-meta">向日葵國小伴學誌　｜　家長／老師批改對照用</div>`
        : `<div class="maze-hd-title"><b>🌀 ${lv.name}</b><span>${lv.story}・${lv.age}</span></div><div class="maze-hd-meta">姓名：____________　日期：____ 月 ____ 日　｜　${lv.hint}</div>`;
      pg.appendChild(hd);

      if(!isAns){
        const box = document.createElement('div');
        box.className = 'maze-body maze-body-2';
        for(let k = 0; k < 2; k++){
          const mi = pIdx * 2 + k;
          if(mi >= mazes.length) break;
          const card = document.createElement('div');
          card.className = 'maze-card';
          card.innerHTML = `<div class="maze-card-t">第 ${mi + 1} 題</div>` + mazeSvg(mazes[mi], lv, false);
          box.appendChild(card);
        }
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
          const scale = Math.min(1, 170 / (mazes[mi].cols * lv.cell + 2 * Math.max(10, Math.round(lv.cell * 0.45))));
          const inner = mazeSvg(mazes[mi], lv, true, {cell: Math.max(10, Math.round(lv.cell * scale)), wall: Math.max(1.6, lv.wall * scale)});
          card.innerHTML = `<div class="maze-ans-t">第 ${mi + 1} 題</div>${inner}`;
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
