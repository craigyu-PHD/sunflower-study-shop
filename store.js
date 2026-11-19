'use strict';
(function(){
const $ = id => document.getElementById(id);
const esc = s => String(s==null?'':s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

// ---------- 1. 前後台權限隔離與安全驗證狀態 ----------
let isAdminUnlocked = false;
let storeCart = [];

function computePickupSchedule(nowDate){
  const now = nowDate ? new Date(nowDate) : new Date();
  const fmt = d => `${d.getMonth()+1}/${d.getDate()}`;
  const day = now.getDay(); // 0=Sun, 3=Wed
  const minsOfDay = now.getHours() * 60 + now.getMinutes();
  const isWedAfterCutoff = (day === 3 && minsOfDay >= 21 * 60);
  // 計算當週（或剛進入下週的）星期四起點
  const diffToThu = isWedAfterCutoff ? -1 : (day <= 3 ? (day + 3) : (day - 4));
  const thu = new Date(now.getTime() - diffToThu * 86400000);
  const wed = new Date(thu.getTime() + 6 * 86400000);
  const fri = new Date(wed.getTime() + 2 * 86400000);
  const sun = new Date(fri.getTime() + 2 * 86400000);
  const nextFri = new Date(fri.getTime() + 7 * 86400000);
  const nextSun = new Date(sun.getTime() + 7 * 86400000);
  return {
    isWedAfterCutoff,
    batchLabel: `${fmt(thu)}～${fmt(wed)} 批次`,
    cutoffStr: `${fmt(wed)}（三）21:00`,
    deliveryStr: `${fmt(fri)}（五）中午 12:00 起 ～ ${fmt(sun)}（日）晚上 21:00 止`,
    nextDeliveryStr: `${fmt(nextFri)}（五）中午 12:00 起 ～ ${fmt(nextSun)}（日）晚上 21:00 止`,
    windowBadge: isWedAfterCutoff
      ? `⚠️ 已過今晚 21:00 截單，現在下單將於次週 ${fmt(fri)}（五）12:00 以後 ～ ${fmt(sun)}（日）21:00 以前取貨`
      : `📅 ${fmt(wed)}（三）21:00 前匯款 → 當週 ${fmt(fri)}（五）12:00 以後 ～ ${fmt(sun)}（日）21:00 以前取貨`
  };
}
window.computePickupSchedule = computePickupSchedule;

function computeBatchWeekFromTimeStr(timeStr, fallbackDate){
  const m = String(timeStr||'').match(/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2}))?/);
  if(m){
    const now = fallbackDate ? new Date(fallbackDate) : new Date();
    let yr = now.getFullYear();
    const mo = +m[1], dy = +m[2], hr = m[3]!=null ? +m[3] : 12, mn = m[4]!=null ? +m[4] : 0;
    // 跨年邊界防呆（例如 1 月檢視 12 月訂單）
    if(mo - (now.getMonth()+1) > 6) yr--;
    else if((now.getMonth()+1) - mo > 6) yr++;
    const d = new Date(yr, mo - 1, dy, hr, mn, 0, 0);
    if(!isNaN(d.getTime())) return computePickupSchedule(d).batchLabel;
  }
  return computePickupSchedule(fallbackDate).batchLabel;
}
window.computeBatchWeekFromTimeStr = computeBatchWeekFromTimeStr;

function computeDefaultBatchLabel(){
  return computePickupSchedule().batchLabel;
}

function applyAdminVisibility(){
  document.querySelectorAll('.admin-only').forEach(el => {
    if(el.id === 'wmBar'){
      const activeTab = document.querySelector('.nav-tab.active')?.dataset.tab || 'store';
      el.style.display = (isAdminUnlocked && activeTab !== 'store') ? '' : 'none';
    } else {
      el.style.display = isAdminUnlocked ? '' : 'none';
    }
  });
  const btn = $('btnAdminAuth');
  if(btn){
    btn.textContent = isAdminUnlocked ? '🔓 已登入後台（點此登出）' : '🔐 管理員後台';
    btn.classList.toggle('logged-in', isAdminUnlocked);
  }
}

function renderPreschoolWorkbench(){
  const sheet = $('preSheet');
  if(!sheet || !window.PRESCHOOL_BANK) return;
  const level = $('wbPreLevel')?.value || 'small';
  const topic = $('wbPreTopic')?.value || 'all';
  const sheets = Math.max(1, +($('wbPreSheets')?.value || 5));
  const illust = $('wbPreIllust') ? $('wbPreIllust').checked : true;
  const wm = typeof window.getWmText === 'function' ? window.getWmText() : '';
  const res = window.PRESCHOOL_BANK.buildPages({ level, topic, sheets, illust, wmText: wm });
  if($('wbPreInfo') && res.level){
    $('wbPreInfo').textContent = `📐 ${res.level.name}（每頁 ${res.level.cols} 欄 × ${res.level.rows} 列＝${res.level.cols*res.level.rows} 格置頂到底全滿）｜${res.level.desc}（共 ${res.pages.length} 面 A4）`;
  }
  sheet.innerHTML = '';
  res.pages.forEach((pg, idx) => {
    const cap = document.createElement('div');
    cap.className = 'pcap';
    cap.textContent = `A4 直式幼兒園寫字帖（${res.level.cols}欄×${res.level.rows}列）　第 ${idx+1} / ${res.pages.length} 頁`;
    sheet.appendChild(cap);
    sheet.appendChild(pg);
  });
}
window.renderPreschoolWorkbench = renderPreschoolWorkbench;

function switchTab(tabName){
  if(tabName !== 'store' && !isAdminUnlocked){
    openAdminModal();
    return;
  }
  document.querySelectorAll('.nav-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabName);
  });
  if($('viewStore')) $('viewStore').style.display = tabName === 'store' ? '' : 'none';
  if($('viewPreschool')) $('viewPreschool').style.display = tabName === 'preschool' ? '' : 'none';
  if($('viewStroke')) $('viewStroke').style.display = tabName === 'stroke' ? '' : 'none';
  if($('viewExam')) $('viewExam').style.display = tabName === 'exam' ? '' : 'none';
  if($('viewBatch')) $('viewBatch').style.display = tabName === 'batch' ? '' : 'none';
  if($('wmBar')) $('wmBar').style.display = (isAdminUnlocked && tabName !== 'store') ? '' : 'none';

  if(tabName === 'preschool'){
    const st = $('examPrintStyle'); if(st) st.textContent = '@media print{@page{size:A4 portrait;margin:0}}';
    renderPreschoolWorkbench();
  } else if(tabName === 'stroke'){
    const st = $('examPrintStyle'); if(st) st.textContent = '@media print{@page{size:A4 portrait;margin:0}}';
    if(typeof window.generate === 'function') window.generate();
  } else if(tabName === 'exam'){
    const genBtn = $('btnExGen'); if(genBtn) genBtn.click();
  } else if(tabName === 'batch'){
    const st = $('examPrintStyle'); if(st) st.textContent = '@media print{@page{size:A4 portrait;margin:0}}';
    if(typeof window.refreshBatchSysClock === 'function') window.refreshBatchSysClock();
  }
}

function openAdminModal(){
  const modal = $('adminModal');
  if(!modal) return;
  $('admAuthMsg').textContent = '';
  const isLocalEnv = location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if($('btnAdmLocalUnlock')){
    $('btnAdmLocalUnlock').style.display = isLocalEnv ? 'inline-block' : 'none';
  }
  modal.style.display = 'flex';
}

function closeAdminModal(){
  if($('adminModal')) $('adminModal').style.display = 'none';
}

function unlockAdminBackend(sessionToken){
  isAdminUnlocked = true;
  try{
    let tok = sessionToken || '';
    if(!tok || tok === 'local-hash-session' || tok === 'local-dev-session'){
      const cachedCloud = localStorage.getItem('kids_cloud_session_token') || '';
      if(cachedCloud) tok = cachedCloud;
    } else {
      localStorage.setItem('kids_cloud_session_token', tok);
    }
    if(tok) sessionStorage.setItem('kids_admin_session_token', tok);
  }catch(_){}
  closeAdminModal();
  applyAdminVisibility();
  switchTab('batch');
  if(typeof window.startCloudAutoSyncTimer === 'function') window.startCloudAutoSyncTimer();
}

// ---------- 2. 家長訂購前台：選單連動與即時防白嫖縮小版預覽 ----------
function getStorePubName(pub){
  return {k:'康軒版', n:'南一版', h:'翰林版', std:'108課綱通用'}[pub] || '康軒版';
}
function getStoreScopeName(sc){
  return {mid:'期中複習卷', final:'期末複習卷', all:'全冊總複習', unit:'自選單元'}[sc] || '期中複習卷';
}
function getStoreDiffName(d){
  return {easy:'基礎熟練', mid:'標準評量', hard:'素養挑戰', mix:'混合難度（由淺入深）'}[d] || '標準評量';
}

function fillStoreSubjects(){
  const g = $('stGrade').value;
  const subs = (window.CURR_META && CURR_META.subjectsByGrade[g]) || ['國語','數學'];
  ['stLazySubj','stExamSubj'].forEach(id => {
    const sel = $(id); if(!sel) return;
    const prev = sel.value;
    sel.innerHTML = subs.map(s => `<option value="${s}">${s}</option>`).join('');
    if(subs.includes(prev)) sel.value = prev;
  });
  // 低年級預設附注音、7欄大格；中高年級預設8欄較多字
  const isLow = +g <= 2;
  if($('stExamRuby')) $('stExamRuby').checked = isLow;
  if($('stSpZy')) $('stSpZy').checked = isLow;
  if($('stStrokeCols')) $('stStrokeCols').value = isLow ? '7' : '8';
  if($('stSpCols')) $('stSpCols').value = isLow ? '7' : '8';
  fillStoreLessons();
  fillStoreUnits();
}

function getStoreTwLessons(){
  if(!window.TW) return [];
  const g = +$('stGrade').value;
  const sem = $('stSem').value;
  const pub = $('stPub').value === 'std' ? 'k' : $('stPub').value;
  const semKey = sem === '下' ? '114下' : '115上';
  return ((TW[semKey] || TW['115上'] || {})[pub] || []).filter(x => x.g === g);
}

let _popHideTimer = null;
function hideLessonPopover(){
  const pop = $('storeLessonPopover');
  if(!pop) return;
  pop.classList.remove('show');
  pop.setAttribute('aria-hidden', 'true');
}

function showLessonPopoverFor(targetEl){
  const pop = $('storeLessonPopover');
  if(!pop || !targetEl) return;
  if(_popHideTimer){ clearTimeout(_popHideTimer); _popHideTimer = null; }
  const title = targetEl.dataset.popTitle || '';
  const chars = (targetEl.dataset.popChars || '').split('').filter(Boolean);
  const rchars = (targetEl.dataset.popRchars || '').split('').filter(Boolean);
  const topics = targetEl.dataset.popTopics || '';
  if(!title || (!chars.length && !topics)) return;

  let bodyHtml = '';
  if(chars.length){
    bodyHtml += `<div class="pop-sub">習寫生字（共 ${chars.length} 字，依課序排入）${rchars.length ? `｜另有認讀 ${rchars.length} 字` : ''}</div>`;
    bodyHtml += `<div class="pop-chars">${chars.map(c=>`<span class="pop-chip">${esc(c)}</span>`).join('')}${rchars.map(c=>`<span class="pop-chip is-r" title="認讀字">${esc(c)}</span>`).join('')}</div>`;
  } else if(topics){
    bodyHtml += `<div class="pop-sub">本單元涵蓋學習重點：</div><div class="pop-chars">${topics.split('、').filter(Boolean).map(t=>`<span class="pop-chip" style="font-size:.82rem">${esc(t)}</span>`).join('')}</div>`;
  }
  pop.innerHTML = `<div class="pop-hd"><span>📚 ${esc(title)}</span></div>${bodyHtml}`;

  const rect = targetEl.getBoundingClientRect();
  pop.classList.add('show');
  pop.setAttribute('aria-hidden', 'false');
  const popW = Math.min(340, pop.offsetWidth || 300);
  const popH = pop.offsetHeight || 130;
  let left = rect.right + 10;
  if(left + popW > window.innerWidth - 12){
    left = Math.max(12, rect.left + 14);
  }
  let top = rect.top - 8;
  if(top + popH > window.innerHeight - 12){
    top = Math.max(12, rect.top - popH - 6);
  }
  pop.style.left = Math.round(left) + 'px';
  pop.style.top = Math.round(top) + 'px';
}

function bindLessonHoverPopover(box){
  if(!box || !box.querySelectorAll) return;
  box.querySelectorAll('.uchk').forEach(lbl => {
    lbl.onmouseenter = () => showLessonPopoverFor(lbl);
    lbl.onmouseleave = () => {
      if(_popHideTimer) clearTimeout(_popHideTimer);
      _popHideTimer = setTimeout(hideLessonPopover, 90);
    };
  });
}
window.bindLessonHoverPopover = bindLessonHoverPopover;
if($('exUnits')) bindLessonHoverPopover($('exUnits'));

function renderStrokeChecklist(boxId, list, defaultCount){
  const box = $(boxId); if(!box) return;
  if(!list.length){
    box.innerHTML = '<span class="hint">此年級版本無內建課次，可切換教科書版本或至「客製自由配」輸入國字。</span>';
    return;
  }
  box.innerHTML = list.map((ls, i) => {
    const sChars = ls.c.filter(c=>c[1]==='s').map(c=>c[0]);
    const rChars = ls.c.filter(c=>c[1]==='r').map(c=>c[0]);
    const useS = sChars.length ? sChars : ls.c.map(c=>c[0]);
    return `<label class="uchk" data-pop-title="${esc(ls.t)}" data-pop-chars="${esc(useS.join(''))}" data-pop-rchars="${esc(rChars.join(''))}"><input type="checkbox" value="${esc(ls.t)}" ${i < defaultCount ? 'checked' : ''}><span class="uchk-main"><span class="uchk-name">${esc(ls.t)}</span><small>${useS.length} 字</small></span></label>`;
  }).join('');
  box.querySelectorAll('input').forEach(chk => { chk.onchange = () => scheduleStorePreview(); });
  bindLessonHoverPopover(box);
}

function fillStoreLessons(){
  const list = getStoreTwLessons();
  renderStrokeChecklist('stLessonList', list, Math.min(1, list.length));
  renderStrokeChecklist('stSpLessonList', list, Math.min(3, list.length));
}

function fillStoreUnits(){
  const box = $('stUnitList'); if(!box) return;
  const g = $('stGrade').value, sem = $('stSem').value, pub = $('stPub').value;
  const subj = $('stExamSubj') ? $('stExamSubj').value : '國語';
  let list = (((window.CURRICULUM || {})[g] || {})[subj] || {})[sem] || [];
  let twMap = null;
  if(subj === '國語' && window.TW){
    const twLs = getStoreTwLessons();
    if(twLs.length){
      twMap = new Map(twLs.map(x=>[x.t, x]));
      list = twLs.map(x => ({ name: x.t, topics: [`生字 ${x.c.filter(c=>c[1]==='s').length || x.c.length} 字`] }));
    }
  }
  const mid = Math.ceil(list.length / 2);
  box.innerHTML = list.map((u, i) => {
    const topicTxt = (u.topics||[]).slice(0,2).join('、');
    const tw = twMap ? twMap.get(u.name) : null;
    const sChars = tw ? (tw.c.filter(c=>c[1]==='s').map(c=>c[0]).join('') || tw.c.map(c=>c[0]).join('')) : '';
    const rChars = tw ? tw.c.filter(c=>c[1]==='r').map(c=>c[0]).join('') : '';
    return `<label class="uchk" data-pop-title="${esc(u.name)}" data-pop-chars="${esc(sChars)}" data-pop-rchars="${esc(rChars)}" data-pop-topics="${esc((u.topics||[]).join('、'))}"><input type="checkbox" value="${esc(u.name)}" ${i < mid ? 'checked' : ''}><span class="uchk-main"><span class="uchk-name">${esc(u.name)}</span><small>${esc(topicTxt)}</small></span></label>`;
  }).join('');
  box.querySelectorAll('input').forEach(chk => { chk.onchange = () => scheduleStorePreview(); });
  bindLessonHoverPopover(box);
}

function updateItemPriceHint(){
  const packMode = document.querySelector('input[name=stPackMode]:checked')?.value || 'lazy';
  const qty = Math.max(1, +$('stQty').value || 1);
  const g = $('stGrade')?.value || '3', sem = $('stSem')?.value || '上';
  const pubName = getStorePubName($('stPub')?.value || 'k');
  const cartSheets = storeCart.reduce((s, it) => s + (+it.sheets || 0), 0);
  let pickSummary = '', sheets = 0;

  if(packMode === 'lazy'){
    sheets = qty * 20;
    const subj = $('stLazySubj')?.value || '國語';
    const scName = getStoreScopeName($('stLazyScope')?.value || 'all');
    if($('stQtyUnit')) $('stQtyUnit').textContent = '組（20張）';
    if($('stItemPriceHint')){
      $('stItemPriceHint').textContent = `（${qty} 組・共 ${sheets} 張不重複評量卷 × $5 ＝ 小計 NT$ ${sheets*5} 元）`;
    }
    pickSummary = `<b>📝 評量懶人包</b>｜國小 ${g} 年級${sem}學期・${pubName}｜<b>${subj}</b>（${scName}）｜共 ${sheets} 張（$${sheets*5}）`;
  } else if(packMode === 'stroke_pack'){
    const spSheets = +($('stSpSheets')?.value || 10);
    sheets = qty * spSheets;
    const lsCnt = document.querySelectorAll('#stSpLessonList input:checked').length;
    const spMode = $('stSpMode')?.value === 'B' ? '教育部格' : '筆順引導';
    const spCols = $('stSpCols')?.value || '8';
    if($('stQtyUnit')) $('stQtyUnit').textContent = `本（${spSheets}張）`;
    if($('stItemPriceHint')){
      $('stItemPriceHint').textContent = sheets >= 20
        ? `（${sheets} 張 × $5 ＝ 小計 NT$ ${sheets*5} 元・已達 20 張可直接出貨！）`
        : `（${sheets} 張 × $5 ＝ 小計 NT$ ${sheets*5} 元；購物車累計滿 20 張出貨）`;
    }
    pickSummary = `<b>✍️ 生字練習本</b>｜國小 ${g} 年級${sem}學期・${pubName}｜已選 <b>${lsCnt} 課</b>（${spMode}・${spCols}欄）｜共 ${sheets} 張（$${sheets*5}）`;
  } else if(packMode === 'preschool_pack'){
    const preSheets = +($('stPreSheets')?.value || 10);
    sheets = qty * preSheets;
    const lvlMap = {small:'小班（3～4歲）', mid:'中班（4～5歲）', large:'大班（5～6歲）'};
    const topMap = {all:'ㄅㄆㄇ・123・ABC 綜合', zy:'注音ㄅㄆㄇ', num:'數字123', abc:'英文字母ABC'};
    const lvlTxt = lvlMap[$('stPreLevel')?.value || 'small'] || '小班';
    const topTxt = topMap[$('stPreTopic')?.value || 'all'] || '綜合';
    if($('stQtyUnit')) $('stQtyUnit').textContent = `本（${preSheets}張）`;
    if($('stItemPriceHint')){
      $('stItemPriceHint').textContent = sheets >= 20
        ? `（${sheets} 張 × $5 ＝ 小計 NT$ ${sheets*5} 元・已達 20 張可直接出貨！）`
        : `（${sheets} 張 × $5 ＝ 小計 NT$ ${sheets*5} 元；購物車累計滿 20 張出貨）`;
    }
    pickSummary = `<b>🐣 幼兒園寫字帖</b>｜${lvlTxt}｜${topTxt}｜共 ${sheets} 張（$${sheets*5}）`;
  } else {
    sheets = qty;
    const price = qty * 5;
    const cType = document.querySelector('input[name=stCustomType]:checked')?.value || 'stroke';
    if(cType === 'stroke'){
      const lsCnt = document.querySelectorAll('#stLessonList input:checked').length;
      const cw = ($('stCustomWords')?.value || '').trim();
      pickSummary = `<b>🎨 客製生字單</b>｜國小 ${g} 年級${sem}・${pubName}｜已選 ${lsCnt} 課${cw?`＋自訂字「${esc(cw.slice(0,8))}${cw.length>8?'…':''}」`:''}｜${sheets} 張（$${price}）`;
    } else {
      const subj = $('stExamSubj')?.value || '國語';
      const uCnt = document.querySelectorAll('#stUnitList input:checked').length;
      pickSummary = `<b>🎨 客製評量卷</b>｜國小 ${g} 年級${sem}・${pubName}｜<b>${subj}</b>・已選 ${uCnt} 單元｜${sheets} 張（$${price}）`;
    }
    if($('stQtyUnit')) $('stQtyUnit').textContent = '張（5元/張）';
    if($('stItemPriceHint')){
      $('stItemPriceHint').textContent = `（客製 ${qty} 張 × $5 ＝ 小計 NT$ ${price} 元；購物車累計滿 20 張出貨）`;
    }
  }

  const liveEl = $('stLiveSelectionSummary');
  if(liveEl){
    const afterCart = cartSheets + sheets;
    const nextHint = afterCart >= 20
      ? `<span style="color:#136529;font-weight:700">👉 確認右側預覽無誤後，按「➕ 加入購物車」即達 ${afterCart} 張出貨門檻！</span>`
      : `<span style="color:#9a3412;font-weight:700">👉 按「➕ 加入購物車」後累計 ${afterCart}/20 張（再湊 ${20-afterCart} 張即可出貨）</span>`;
    liveEl.innerHTML = `📌 目前已選：${pickSummary}<br>${nextHint}`;
  }
}

function getPreviewSheetMeta(){
  const packMode = document.querySelector('input[name=stPackMode]:checked')?.value || 'lazy';
  const g = $('stGrade')?.value || '3', sem = $('stSem')?.value || '上';
  const profs = (window.LAZY_EXAM_PROFILES || [
    { name:'觀念選擇＋是非基礎卷' }, { name:'綜合五題型平衡評量卷' },
    { name:'填空寫作＋圖文配對卷' }, { name:'觀念是非＋實作應用卷' },
    { name:'精選選擇＋實戰加強卷' }, { name:'閱讀素養＋圖表挑戰卷' },
    { name:'高分易錯診斷特訓卷' }, { name:'全範圍綜合魔王總複習' }
  ]);

  if(packMode === 'preschool_pack'){
    const preSheets = +($('stPreSheets')?.value || 10);
    const lvl = $('stPreLevel')?.value || 'small';
    const lvlName = {small:'小班',mid:'中班',large:'大班'}[lvl] || '小班';
    const topic = $('stPreTopic')?.value || 'all';
    const topName = {all:'ㄅㄆㄇ・123・ABC',zy:'注音符號',num:'數字123',abc:'英文字母'}[topic] || '綜合';
    const list = [];
    for(let i = 0; i < preSheets; i++){
      list.push({
        idx: i, type: 'preschool', preIdx: i,
        label: `第 ${i+1}/${preSheets} 張｜🐣 幼兒園${lvlName}（${topName}）`
      });
    }
    return list;
  }

  if(packMode === 'stroke_pack'){
    const spSheets = +($('stSpSheets')?.value || 10);
    const spMode = $('stSpMode')?.value || 'A';
    const list = [];
    for(let i = 0; i < spSheets; i++){
      list.push({
        idx: i, type: 'stroke', strokeMode: spMode, strokeIdx: i,
        label: `第 ${i+1}/${spSheets} 張｜✍️ 生字（${spMode==='B'?'教育部格':'筆順引導'}・依課序循環）`
      });
    }
    return list;
  }

  if(packMode === 'custom'){
    const cType = document.querySelector('input[name=stCustomType]:checked')?.value || 'stroke';
    const customQty = Math.max(1, +($('stQty')?.value || 1));
    const list = [];
    for(let i = 0; i < customQty; i++){
      list.push({
        idx: i, type: cType, strokeIdx: i, examIdx: i,
        label: cType === 'stroke'
          ? `第 ${i+1}/${customQty} 張｜✍️ 客製生字單（正面＋背面）`
          : `第 ${i+1}/${customQty} 張｜📝 客製評量卷（正面＋背面）`
      });
    }
    return list;
  }

  // 純評量測驗懶人包（絕不綁定生字）
  const scope = $('stLazyScope')?.value || 'all';
  const subj = $('stLazySubj')?.value || '國語';
  const allU = (((window.CURRICULUM || {})[g] || {})[subj] || {})[sem] || [];
  let pickedU = allU.length ? allU.map(u => u.name) : ['全冊範圍'];
  if(scope === 'mid' && pickedU.length > 1) pickedU = pickedU.slice(0, Math.ceil(pickedU.length / 2));
  else if(scope === 'final' && pickedU.length > 1) pickedU = pickedU.slice(Math.ceil(pickedU.length / 2));

  const list = [];
  for(let i = 0; i < 20; i++){
    const pName = profs[i % profs.length].name;
    const uName = pickedU[i % pickedU.length];
    list.push({
      idx: i, type: 'exam', examIdx: i,
      label: `第 ${i+1}/20 張｜📝 ${pName}（${uName}）`
    });
  }
  return list;
}

function syncPreviewPagerOptions(){
  const sel = $('stPreviewSheetSel');
  const pager = $('stPreviewPager');
  if(!sel || !pager) return;
  const meta = getPreviewSheetMeta();
  const prevVal = +sel.value || 0;
  sel.innerHTML = meta.map(m => `<option value="${m.idx}">${esc(m.label)}</option>`).join('');
  if(prevVal >= 0 && prevVal < meta.length) sel.value = String(prevVal);
  else sel.value = '0';
  const showNav = meta.length > 1;
  if($('btnPrevSheet')){ $('btnPrevSheet').style.display = ''; $('btnPrevSheet').disabled = !showNav; }
  if($('btnNextSheet')){ $('btnNextSheet').style.display = ''; $('btnNextSheet').disabled = !showNav; }
  return meta;
}

let previewTimer = null;
function scheduleStorePreview(){
  updateItemPriceHint();
  syncPreviewPagerOptions();
  if(previewTimer) clearTimeout(previewTimer);
  previewTimer = setTimeout(updateStorePreview, 80);
}

let _lastCustomStrokeKey = '';
let _customStrokeMinSheets = 1;

let _storeExamCache = new Map();

function renderPreviewPagesDualOrSingle(scaleBox, pagesArr, isLand){
  if(!pagesArr || !pagesArr.length) return;
  const vp = $('stPreviewViewport');
  const vpW = Math.max(250, (vp ? vp.clientWidth : 580) - 28);
  const pageW = isLand ? 1122 : 794;
  const pageH = isLand ? 794 : 1122;
  const sc = Math.min(isLand ? 0.56 : 0.72, Math.max(0.24, +(vpW / pageW).toFixed(3)));
  const scaledW = Math.round(pageW * sc);
  const scaledH = Math.round(pageH * sc);

  const wrapPageFrame = (pgEl) => {
    const frame = document.createElement('div');
    frame.className = 'preview-a4-frame';
    frame.style.width = scaledW + 'px';
    frame.style.height = scaledH + 'px';
    pgEl.style.transform = `scale(${sc})`;
    pgEl.style.transformOrigin = 'top left';
    frame.appendChild(pgEl);
    return frame;
  };

  scaleBox.style.transform = 'none';
  scaleBox.style.width = '100%';
  scaleBox.style.height = 'auto';

  const p0 = pagesArr[0];
  const p1 = pagesArr[1] || null;
  const dual = document.createElement('div');
  dual.className = 'preview-dual-grid';
  const sides = p1 ? [['📄 正面（第 1 面）', p0], ['📄 背面（第 2 面）', p1]] : [['📄 正面（第 1 面）', p0]];
  sides.forEach(([lbl, pgEl]) => {
    const col = document.createElement('div');
    col.className = 'preview-side-col';
    const tag = document.createElement('div');
    tag.className = 'preview-side-tag';
    tag.textContent = lbl;
    col.appendChild(tag);
    col.appendChild(wrapPageFrame(pgEl));
    dual.appendChild(col);
  });
  scaleBox.appendChild(dual);
}

async function updateStorePreview(){
  const scaleBox = $('stPreviewScale');
  const badge = $('stPreviewBadge');
  if(!scaleBox) return;

  const packMode = document.querySelector('input[name=stPackMode]:checked')?.value || 'lazy';
  const g = $('stGrade').value, sem = $('stSem').value, pub = $('stPub').value;
  let metaList = syncPreviewPagerOptions() || getPreviewSheetMeta();
  let curIdx = Math.max(0, Math.min(metaList.length - 1, +($('stPreviewSheetSel')?.value || 0)));
  let activeMeta = metaList[curIdx] || metaList[0];

  let previewType = activeMeta ? activeMeta.type : 'exam';
  let orderCfg = null;

  if(packMode === 'preschool_pack'){
    const lvl = $('stPreLevel')?.value || 'small';
    const topic = $('stPreTopic')?.value || 'all';
    const sheets = +($('stPreSheets')?.value || 10);
    const illust = $('stPreIllust') ? $('stPreIllust').checked : true;
    orderCfg = {
      plan: 'preschool',
      preLevel: lvl,
      preTopic: topic,
      sheets,
      illust,
      sampleLimit: 1,
      previewPageIdx: activeMeta ? (activeMeta.preIdx || 0) : 0
    };
    previewType = 'preschool';
  } else if(packMode === 'lazy'){
    const scope = $('stLazyScope').value;
    const subj = $('stLazySubj').value || '國語';
    orderCfg = {
      grade: g, sem, pub, subj, scope, diff: 'mix', packType: '懶人包',
      ruby: +g <= 2, layout: '2col',
      custom_words: '', custom_units: '', sampleLimit: 1,
      previewSheetIdx: activeMeta.examIdx || 0
    };
  } else if(packMode === 'stroke_pack'){
    const checkedLessons = [...document.querySelectorAll('#stSpLessonList input:checked')].map(i => i.value);
    const spSheets = +($('stSpSheets')?.value || 10);
    const spCols = Math.max(7, Math.min(8, +($('stSpCols')?.value || (+g <= 2 ? 7 : 8))));
    orderCfg = {
      grade: g, sem, pub, subj: '國語', scope: checkedLessons.length ? 'unit' : 'all', diff: 'mid',
      packType: '生字練習本',
      ruby: $('stSpZy') ? $('stSpZy').checked : (+g <= 2),
      strokeMode: $('stSpMode')?.value || 'A',
      cols: spCols,
      sheets: spSheets,
      custom_words: '',
      custom_units: checkedLessons.join('、'),
      sampleLimit: 1,
      previewPageIdx: activeMeta.strokeIdx || 0
    };
  } else {
    const cType = document.querySelector('input[name=stCustomType]:checked')?.value || 'stroke';
    previewType = cType;
    if(cType === 'stroke'){
      const checkedLessons = [...document.querySelectorAll('#stLessonList input:checked')].map(i => i.value);
      const cw = ($('stCustomWords').value || '').trim();
      orderCfg = {
        grade: g, sem, pub, subj: '國語', scope: 'unit', diff: 'mid', packType: '客製包',
        ruby: $('stStrokeZy').checked,
        strokeMode: $('stStrokeMode').value,
        cols: Math.max(7, Math.min(8, +$('stStrokeCols').value || 7)),
        sheets: Math.max(1, +$('stQty').value || 1),
        custom_words: cw,
        custom_units: checkedLessons.join('、'),
        sampleLimit: 1, previewPageIdx: activeMeta ? (activeMeta.strokeIdx || 0) : 0
      };
    } else {
      const checkedUnits = [...document.querySelectorAll('#stUnitList input:checked')].map(i => i.value);
      orderCfg = {
        grade: g, sem, pub, packType: '客製包',
        subj: $('stExamSubj').value || '國語',
        scope: 'unit',
        diff: $('stExamDiff').value || 'mid',
        layout: $('stExamLayout').value || '2col',
        ruby: $('stExamRuby').checked,
        custom_units: checkedUnits.join('、'),
        sampleLimit: 1, previewSheetIdx: 0
      };
    }
  }

  scaleBox.innerHTML = '';
  if(previewType === 'preschool' && window.PRESCHOOL_BANK){
    const res = window.PRESCHOOL_BANK.buildPages({
      level: orderCfg.preLevel,
      topic: orderCfg.preTopic,
      sheets: orderCfg.sheets,
      illust: orderCfg.illust,
      sampleLimit: 1,
      previewPageIdx: orderCfg.previewPageIdx,
      wmText: '向日葵國小伴學誌・線上樣本預覽請勿截圖'
    });
    if($('stPreDesc') && res.level){
      $('stPreDesc').textContent = `🐣 ${res.level.name}｜${res.level.desc}（每頁 ${res.level.cols} 欄 × ${res.level.rows} 列置頂到底滿格、共收錄 ${res.itemCount} 個階段符號依序循環）`;
    }
    if(res.pages && res.pages.length){
      renderPreviewPagesDualOrSingle(scaleBox, res.pages, false);
      if(badge) badge.textContent = `🐣 第 ${curIdx+1}/${orderCfg.sheets} 張正反雙面（${res.level.name}・${res.level.cols}欄×${res.level.rows}列）`;
    }
  } else if(previewType === 'stroke' && window.buildStrokePagesForOrder){
    let res = await window.buildStrokePagesForOrder(orderCfg, '向日葵國小伴學誌・線上樣本預覽請勿截圖');
    const checkedLessons = [...document.querySelectorAll('#stLessonList input:checked')].map(i => i.value);

    // 按課次客製生字單防呆設計：計算完整 1 輪所需正反雙面張數與超頁警示機制
    window._customStrokeOverLimit = false;
    window._customStrokeOverPages = res.onePassPages || 0;
    if(packMode === 'custom'){
      const cw = ($('stCustomWords')?.value || '').trim();
      const curQty = Math.max(1, +($('stQty')?.value || 1));
      if(!cw && checkedLessons.length > 0 && res.onePassPages > 0){
        const minSheets = Math.max(1, Math.ceil(res.onePassPages / 2));
        _customStrokeMinSheets = minSheets;
        const specKey = `${g}|${sem}|${pub}|${checkedLessons.join(',')}|${orderCfg.cols}|${orderCfg.strokeMode}|${orderCfg.ruby}`;
        if($('stQty')){
          $('stQty').min = String(minSheets);
          if(specKey !== _lastCustomStrokeKey || +$('stQty').value < minSheets){
            _lastCustomStrokeKey = specKey;
            $('stQty').value = String(minSheets);
            orderCfg.sheets = minSheets;
            if(orderCfg.previewPageIdx >= minSheets) orderCfg.previewPageIdx = 0;
            updateItemPriceHint();
            metaList = syncPreviewPagerOptions() || metaList;
            curIdx = Math.max(0, Math.min(metaList.length - 1, +($('stPreviewSheetSel')?.value || 0)));
            res = await window.buildStrokePagesForOrder(orderCfg, '向日葵國小伴學誌・線上樣本預覽請勿截圖');
          }
        }
        window._customStrokeOverPages = res.onePassPages;
        window._customStrokeOverLimit = (res.onePassPages > 2 && +($('stQty')?.value || 1) === 1);
        if($('stCustomStrokeFoolproof')){
          if(res.onePassPages > 2){
            $('stCustomStrokeFoolproof').style.color = '#b91c1c';
            $('stCustomStrokeFoolproof').textContent = `⚠️ 超出基本正反面（2 頁／張）提示：所選 ${checkedLessons.length} 課共 ${res.charCount} 字，排版需 ${res.onePassPages} 頁，已自動對齊最低 ${minSheets} 張（${minSheets*2} 頁正反雙面）；若只想印 1 張（2 頁），請改選「8 欄」或取消部分高筆畫課次！`;
          } else {
            $('stCustomStrokeFoolproof').style.color = '#0d5220';
            $('stCustomStrokeFoolproof').textContent = `🛡️ 按課次全字防呆：所選 ${checkedLessons.length} 課共 ${res.charCount} 字（排版 ${res.onePassPages} 頁／正反雙面 1 張完整呈現，同字絕不跨頁）！`;
          }
        }
      } else {
        _customStrokeMinSheets = 1;
        _lastCustomStrokeKey = '';
        if($('stQty')) $('stQty').min = '1';
        window._customStrokeOverLimit = !!(cw && res.onePassPages > curQty * 2);
        if($('stCustomStrokeFoolproof')){
          if(window._customStrokeOverLimit){
            $('stCustomStrokeFoolproof').style.color = '#c0392b';
            $('stCustomStrokeFoolproof').textContent = `⚠️ 設定未成功（已超過正反面 ${curQty*2} 頁上限）：自訂生字共需 ${res.onePassPages} 頁（超過基本正反面規格），請減少生字、改選 8 欄，或增加張數為 ${Math.ceil(res.onePassPages/2)} 張！`;
          } else {
            $('stCustomStrokeFoolproof').style.color = '#475569';
            $('stCustomStrokeFoolproof').textContent = cw
              ? `✏️ 自填生字雙面模式：共 ${res.charCount} 字（排版 ${Math.max(2, res.onePassPages)} 頁正反雙面，同字不跨頁）。`
              : '⚠️ 請勾選上方課次或在下方輸入想練習的國字。';
          }
        }
      }
    }

    if(packMode === 'stroke_pack' && $('stSpCoverageInfo')){
      const spSheets = +($('stSpSheets')?.value || 10);
      const checkedCnt = document.querySelectorAll('#stSpLessonList input:checked').length;
      const oneP = res.onePassPages || 1;
      const totalFaces = spSheets * 2;
      const cycles = (totalFaces / oneP).toFixed(1).replace(/\.0$/,'');
      $('stSpCoverageInfo').textContent = checkedCnt === 0
        ? '⚠️ 請先勾選至少一課課次，系統會依課次與字序完整列出全部生字。'
        : (totalFaces >= oneP
          ? `✅ 已勾選 ${checkedCnt} 課（共 ${res.charCount} 個生字，1 輪佔 ${oneP} 面）：訂製 ${spSheets} 張（正反共 ${totalFaces} 面），全部生字 100% 依序出現且循環約 ${cycles} 輪（絕不漏字）。`
          : `💡 已勾選 ${checkedCnt} 課（共 ${res.charCount} 字，完整 1 輪需 ${oneP} 面／${Math.ceil(oneP/2)} 張）：目前 ${spSheets} 張（${totalFaces} 面）將依序排滿，建議改選 ${Math.ceil(oneP/2) > 10 ? 20 : 10} 張涵蓋全課並雙倍練習！`);
    }

    if(res.pages && res.pages.length){
      renderPreviewPagesDualOrSingle(scaleBox, res.pages, false);
      const totSheetsShow = orderCfg.sheets || 1;
      if(badge) badge.textContent = packMode==='stroke_pack'
        ? `✍️ 第 ${curIdx+1}/${totSheetsShow} 張正反雙面（${orderCfg.strokeMode==='B'?'教育部格':'筆順引導'}・${orderCfg.cols}~8欄）`
        : `✍️ 第 ${curIdx+1}/${totSheetsShow} 張正反雙面（${g}年級${sem}・${orderCfg.cols}~8欄）`;
    }
  } else if(window.buildExamPreviewPagesForStore){
    const cacheKey = JSON.stringify({
      g: orderCfg.grade, s: orderCfg.sem, p: orderCfg.pub, sub: orderCfg.subj,
      sc: orderCfg.scope, d: orderCfg.diff, pt: orderCfg.packType, rb: orderCfg.ruby,
      ly: orderCfg.layout, cu: orderCfg.custom_units, idx: orderCfg.previewSheetIdx || 0
    });
    let pagesArr = _storeExamCache.get(cacheKey);
    if(pagesArr){
      pagesArr = pagesArr.map(n => n.cloneNode(true));
    } else {
      pagesArr = window.buildExamPreviewPagesForStore(orderCfg);
      if(pagesArr && pagesArr.length){
        if(_storeExamCache.size > 24){
          const firstK = _storeExamCache.keys().next().value;
          if(firstK !== undefined) _storeExamCache.delete(firstK);
        }
        _storeExamCache.set(cacheKey, pagesArr.map(n => n.cloneNode(true)));
      }
    }
    if(pagesArr && pagesArr.length){
      const isLand = pagesArr[0].classList.contains('ex-land');
      renderPreviewPagesDualOrSingle(scaleBox, pagesArr, isLand);
      if(badge) badge.textContent = packMode==='lazy'
        ? `📝 第 ${curIdx+1}/20 張・正反雙面（${orderCfg.subj}）`
        : `📝 ${orderCfg.subj}・正反雙面（${g}年級${sem}）`;
    }
  }
}

// ---------- 3. 購物車管理與自動結算（每張 $5｜累計滿 20 張＝$100 出貨）----------
function buildCurrentSelectionsAsCartItems(){
  const packMode = document.querySelector('input[name=stPackMode]:checked')?.value || 'lazy';
  const g = $('stGrade').value, sem = $('stSem').value, pub = $('stPub').value;
  const pubName = getStorePubName(pub);
  const qty = Math.max(1, +$('stQty').value || 1);
  const items = [];

  if(packMode === 'preschool_pack'){
    const preSheets = +($('stPreSheets')?.value || 10);
    const lvlId = $('stPreLevel')?.value || 'small';
    const lvlObj = (window.PRESCHOOL_BANK && window.PRESCHOOL_BANK.levels[lvlId]) || { name: '小班', cols: 5, rows: 6 };
    const topic = $('stPreTopic')?.value || 'all';
    const topicName = { all:'ㄅㄆㄇ・數字123・ABC 綜合', zy:'注音符號（ㄅㄆㄇ）', num:'阿拉伯數字（123）', abc:'英文字母（ABC）' }[topic] || '綜合進度';
    const illust = $('stPreIllust') ? $('stPreIllust').checked : true;
    const sheets = preSheets * qty;
    const amount = sheets * 5;
    items.push({
      id: 'C' + Date.now() + '_PRE',
      packType: '幼兒園寫字帖',
      plan: 'preschool',
      planName: `🐣 幼兒園寫字帖・${lvlObj.name}（${preSheets}張／本）`,
      grade: `幼兒園${lvlObj.name}`,
      sem: '適齡先修',
      pub: 'pre',
      pubName: '台灣幼教適齡課綱',
      subj: topicName,
      scope: topic,
      scopeName: lvlObj.name,
      diff: lvlId,
      diffName: lvlObj.stageTitle || '運筆與符號啟蒙',
      ruby: true,
      strokeMode: 'A',
      cols: lvlObj.cols,
      layout: '2col',
      preLevel: lvlId,
      preTopic: topic,
      preIllust: illust,
      custom_words: '',
      custom_units: `${lvlObj.name}｜${topicName}`,
      spec_note: `${lvlObj.cols}欄×${lvlObj.rows}列大格滿版｜${topicName}｜${illust?'含可愛小插圖':'簡潔大格'}`,
      unitSheets: preSheets,
      qty,
      sheets,
      amount
    });
  } else if(packMode === 'lazy'){
    const scope = $('stLazyScope').value;
    const scopeName = getStoreScopeName(scope);
    const subj = $('stLazySubj').value || '國語';
    const isLow = +g <= 2;
    const sheets = 20 * qty;
    const amount = sheets * 5;
    items.push({
      id: 'C' + Date.now() + '_E',
      packType: '懶人包',
      plan: 'exam',
      planName: '📝 評量練習本 20 張懶人包',
      grade: g, sem, pub, pubName,
      subj,
      scope, scopeName,
      diff: 'mix', diffName: '由淺入深8題型綜合',
      ruby: isLow,
      strokeMode: 'A',
      cols: 7,
      layout: '2col',
      custom_words: '',
      custom_units: '',
      spec_note: `20張雙面滿滿・單元與8大題型全輪替不重複（免費附解答）`,
      qty,
      sheets,
      amount
    });
  } else if(packMode === 'stroke_pack'){
    const checkedLessons = [...document.querySelectorAll('#stSpLessonList input:checked')].map(i => i.value);
    if(!checkedLessons.length){
      alert('請至少勾選一課要練習的生字課次！');
      return [];
    }
    const spSheets = +($('stSpSheets')?.value || 10);
    const mode = $('stSpMode')?.value || 'A';
    const cols = Math.max(7, Math.min(8, +($('stSpCols')?.value || (+g <= 2 ? 7 : 8))));
    const ruby = $('stSpZy') ? $('stSpZy').checked : (+g <= 2);
    const sheets = spSheets * qty;
    const amount = sheets * 5;
    items.push({
      id: 'C' + Date.now() + '_SP',
      packType: '生字練習本',
      plan: 'stroke',
      planName: `✍️ 獨立生字練習本（${spSheets}張／本）`,
      grade: g, sem, pub, pubName,
      subj: '國語',
      scope: 'unit', scopeName: `自選 ${checkedLessons.length} 課`,
      diff: 'mid', diffName: '標準評量',
      ruby,
      strokeMode: mode,
      cols,
      layout: '2col',
      custom_words: '',
      custom_units: checkedLessons.join('、'),
      spec_note: `模式${mode}｜${cols}～8欄彈性｜依課序全字不漏・循環呈現（${ruby?'附注音':'無注音'}）`,
      unitSheets: spSheets,
      qty,
      sheets,
      amount
    });
  } else {
    const cType = document.querySelector('input[name=stCustomType]:checked')?.value || 'stroke';
    const sheets = qty;
    const amount = sheets * 5;
    if(cType === 'stroke'){
      const checkedLessons = [...document.querySelectorAll('#stLessonList input:checked')].map(i => i.value);
      const custom_words = ($('stCustomWords').value || '').trim();
      if(!checkedLessons.length && !custom_words){
        alert('請至少勾選一課生字課次，或輸入自訂練習國字！');
        return [];
      }
      if(window._customStrokeOverLimit){
        const needP = window._customStrokeOverPages || 3;
        const msg = `⚠️ 超過正反面（2 頁／張）基本規格，設定未成功！目前生字共需 ${needP} 頁，請取消部分生字、換低筆畫生字、改選 8 欄，或增加張數至 ${Math.ceil(needP/2)} 張再加入購物車。`;
        if($('stAddMsg')){ $('stAddMsg').style.color = '#c0392b'; $('stAddMsg').textContent = msg; }
        alert(msg);
        return [];
      }
      const mode = $('stStrokeMode').value;
      const cols = +$('stStrokeCols').value || 7;
      const ruby = $('stStrokeZy').checked;
      items.push({
        id: 'C' + Date.now() + '_CS',
        packType: '客製包',
        plan: 'stroke',
        planName: '✍️ 客製生字練習單',
        grade: g, sem, pub, pubName,
        subj: '國語',
        scope: 'unit', scopeName: '自選課次',
        diff: 'mid', diffName: '標準評量',
        ruby,
        strokeMode: mode,
        cols,
        layout: '2col',
        custom_words,
        custom_units: checkedLessons.join('、'),
        spec_note: `單張客製｜模式${mode} / 每頁${cols}字 / ${ruby?'附注音':'無注音'}`,
        qty: sheets,
        sheets,
        amount
      });
    } else {
      const checkedUnits = [...document.querySelectorAll('#stUnitList input:checked')].map(i => i.value);
      if(!checkedUnits.length){
        alert('請至少勾選一個要評量的單元範圍！');
        return [];
      }
      const subj = $('stExamSubj').value || '國語';
      const diff = $('stExamDiff').value || 'mid';
      const diffName = getStoreDiffName(diff);
      const layout = $('stExamLayout').value || '2col';
      const ruby = $('stExamRuby').checked;
      items.push({
        id: 'C' + Date.now() + '_CE',
        packType: '客製包',
        plan: 'exam',
        planName: '📝 客製評量練習卷（附解答）',
        grade: g, sem, pub, pubName,
        subj,
        scope: 'unit', scopeName: '自選單元',
        diff, diffName,
        ruby,
        strokeMode: 'A',
        cols: 7,
        layout,
        custom_words: '',
        custom_units: checkedUnits.join('、'),
        spec_note: `單張客製｜${layout==='1col'?'單欄大字':'雙欄標準'} / ${diffName} / ${ruby?'附注音':'無注音'}`,
        qty: sheets,
        sheets,
        amount
      });
    }
  }
  return items;
}

function renderStoreCart(){
  const emptyEl = $('stCartEmpty');
  const contentEl = $('stCartContent');
  const wrap = $('stCartTableWrap');
  const sumEl = $('stCartSummary');
  const threshEl = $('stThresholdBanner');
  const submitBtn = $('btnStSubmit');
  if(!emptyEl || !contentEl || !wrap || !sumEl) return;

  if(!storeCart.length){
    emptyEl.style.display = '';
    contentEl.style.display = 'none';
    return;
  }
  emptyEl.style.display = 'none';
  contentEl.style.display = '';

  let totalSheets = 0, totalAmount = 0;
  const rowsHtml = storeCart.map((it, idx) => {
    totalSheets += it.sheets;
    totalAmount += it.amount;
    const isLazy = it.packType === '懶人包';
    const qtyLabel = isLazy ? `${Math.max(1, Math.round(it.sheets/20))} 組` : `${it.sheets} 張`;
    const detail = [
      it.scopeName,
      it.spec_note,
      it.custom_units ? `單元/課次：${it.custom_units.slice(0,22)}${it.custom_units.length>22?'…':''}` : '',
      it.custom_words ? `自訂字：${it.custom_words.slice(0,12)}` : ''
    ].filter(Boolean).join('｜');
    return `<tr>
      <td>
        <div><span class="badge-ok">${esc(it.packType)}</span> <b>${esc(it.planName)}</b></div>
        <div style="font-size:.82rem;color:#333;margin-top:2px"><b>${esc(it.grade)}年級${esc(it.sem)}・${esc(it.pubName)}・${esc(it.subj)}</b>｜${esc(it.scopeName)}</div>
        <div style="font-size:.78rem;color:#666;margin-top:1px">${esc(detail)}</div>
      </td>
      <td style="text-align:center">
        <div class="cart-qty-wrap">
          <button type="button" class="btn cart-qty-btn" data-idx="${idx}" data-delta="-1">－</button>
          <b>${qtyLabel}</b>
          <button type="button" class="btn cart-qty-btn" data-idx="${idx}" data-delta="1">＋</button>
        </div>
      </td>
      <td style="text-align:center"><b>${it.sheets}</b> 張</td>
      <td style="text-align:right"><b style="color:#c85000">$${it.amount}</b></td>
      <td style="text-align:center"><button type="button" class="btn cart-del-btn" data-idx="${idx}" style="color:#a71d2a">✕</button></td>
    </tr>`;
  }).join('');

  wrap.innerHTML = `<table class="batch-tbl cart-tbl">
    <colgroup><col><col style="width:112px"><col style="width:52px"><col style="width:58px"><col style="width:42px"></colgroup>
    <thead><tr><th>訂購項目／年級科目與規格明細</th><th style="text-align:center">數量</th><th style="text-align:center">張數</th><th style="text-align:right">小計</th><th style="text-align:center">刪</th></tr></thead>
    <tbody>${rowsHtml}</tbody>
  </table>`;

  const packStr = totalSheets >= 20
    ? `${Math.floor(totalSheets/20)} 份${totalSheets%20?`又 ${totalSheets%20} 張`:''}`
    : `未滿 1 份（${totalSheets}/20 張）`;
  sumEl.innerHTML = `
    <span>📦 選購合計：共 <b>${totalSheets}</b> 張 A4（${packStr}｜評量卷免費附贈解答）</span>
    <span style="font-size:1.25rem;color:#0d5220">💰 應匯款總金額：NT$ ${totalAmount} 元</span>
  `;
  if($('stRemitTotal')) $('stRemitTotal').textContent = `NT$ ${totalAmount} 元`;

  const meetMin = totalSheets >= 20;
  if(threshEl){
    threshEl.style.display = 'flex';
    threshEl.className = 'cap-banner ' + (meetMin ? 'ok' : 'warn');
    threshEl.textContent = meetMin
      ? `✅ 已達成最低出貨門檻（20 張／NT$ 100 元以上）！目前共 ${totalSheets} 張（NT$ ${totalAmount} 元），可繼續加購或直接填寫下方匯款資料送出訂單。`
      : `⚠️ 最低出貨門檻為 20 張（1 份＝NT$ 100 元）：目前購物車共 ${totalSheets} 張（NT$ ${totalAmount} 元），還差 ${20 - totalSheets} 張（NT$ ${(20 - totalSheets)*5} 元）才可送出出貨！請在上方繼續客製加購。`;
  }
  if(submitBtn){
    submitBtn.disabled = !meetMin;
    submitBtn.style.opacity = meetMin ? '1' : '.55';
    submitBtn.title = meetMin ? '' : '需累計滿 20 張（NT$ 100 元）才可送出訂單';
  }

  wrap.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = +btn.dataset.idx, delta = +btn.dataset.delta;
      const item = storeCart[idx];
      if(!item) return;
      const step = item.unitSheets || (item.packType === '懶人包' ? 20 : 1);
      item.sheets = Math.max(step, item.sheets + delta * step);
      item.qty = step > 1 ? Math.max(1, Math.round(item.sheets / step)) : item.sheets;
      item.amount = item.sheets * 5;
      renderStoreCart();
    };
  });
  wrap.querySelectorAll('.cart-del-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = +btn.dataset.idx;
      storeCart.splice(idx, 1);
      renderStoreCart();
    };
  });
}

// ---------- 4. 送出訂單：同時寫入後台對帳系統與 Google 試算表 ----------
async function submitStoreOrder(){
  const msgEl = $('stSubmitMsg');
  msgEl.textContent = '';
  if(!storeCart.length){
    msgEl.textContent = '⚠️ 購物車目前是空的，請先將教材加入購物車！';
    return;
  }
  const totalSheets = storeCart.reduce((acc, it) => acc + (+it.sheets || 0), 0);
  const totalAmt = storeCart.reduce((acc, it) => acc + (+it.amount || 0), 0);
  if(totalSheets < 20){
    msgEl.textContent = `⚠️ 本系統每張 5 元、累計滿 20 張（NT$ 100 元）才出貨；目前僅 ${totalSheets} 張（NT$ ${totalAmt} 元），請還差 ${20 - totalSheets} 張！`;
    return;
  }
  const parent_label = ($('stParentLabel').value || '').trim();
  const contact = ($('stContact').value || '').trim();
  const remit_last5 = ($('stRemitLast5').value || '').trim();
  const agreed = $('stAgreeTerms').checked;

  if(!parent_label || parent_label.length < 2){
    msgEl.textContent = '⚠️ 請填寫「家長稱呼＋手機末四碼」（例如：王媽媽#8821），作為警衛室取貨核對依據！';
    $('stParentLabel').focus();
    return;
  }
  if(!contact){
    msgEl.textContent = '⚠️ 請填寫聯絡手機或 Email，以便帳務核對或取貨通知！';
    $('stContact').focus();
    return;
  }
  if(!/^\d{5}$/.test(remit_last5)){
    msgEl.textContent = '⚠️ 請填寫正確的 5 位數字「匯款帳號後五碼」（例如：12345）！';
    $('stRemitLast5').focus();
    return;
  }
  if(!agreed){
    msgEl.textContent = '⚠️ 請先勾選同意《消費者保護法》客製化商品規定與「每週五中午 12:00 以後至每週日晚上 21:00 以前」警衛室取貨規範！';
    return;
  }

  // 懶人包若購買多組（例如 2 組＝40 張）拆成 2 筆 20 張訂單；客製包依單項客製設定保留精準張數（如 5 張＝$25）
  const now = new Date();
  const timeStr = `${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const pickupBase = 'W' + String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0') + '-' + String(Math.floor(100 + Math.random()*900));
  const expandedItems = [];
  storeCart.forEach((it) => {
    if(it.packType === '懶人包' && it.sheets > 20 && it.sheets % 20 === 0){
      const sets = Math.round(it.sheets / 20);
      for(let q = 0; q < sets; q++){
        expandedItems.push({ ...it, sheets: 20, amount: 100 });
      }
    } else {
      expandedItems.push({ ...it });
    }
  });

  const sched = computePickupSchedule(now);
  const orderRows = expandedItems.map((it, idx) => ({
    order_id: expandedItems.length > 1 ? `${pickupBase}-${idx+1}` : pickupBase,
    created_at: timeStr,
    created_ts: now.getTime(),
    batch_week: sched.batchLabel,
    parent_label,
    contact,
    remit_last5,
    packType: it.packType,
    plan: it.plan,
    grade: it.grade,
    sem: it.sem,
    pub: it.pub,
    subj: it.subj,
    scope: it.scope,
    diff: it.diff,
    ruby: it.ruby ? '是' : '否',
    strokeMode: it.strokeMode,
    cols: it.cols,
    layout: it.layout,
    preLevel: it.preLevel,
    preTopic: it.preTopic,
    preIllust: it.preIllust,
    custom_words: it.custom_words,
    custom_units: it.custom_units,
    spec_note: it.spec_note,
    sheets: it.sheets,
    paid_status: '待核帳',
    reconcile_status: '待核帳',
    reconcile_note: '',
    print_status: '未列印',
    isPrinted: false,
    print_count: 0,
    printed_at: '',
    amount: String(it.amount),
    selectedForPrint: false
  }));

  // 1. 立即寫入本機後台訂單與對帳資料庫（確保前後台 100% 即時串接！）
  if(typeof window.receiveFrontendOrders === 'function'){
    window.receiveFrontendOrders(orderRows);
  }
  // 2. 訂單完成即同步寫入 Google 試算表並觸發雲端備份（背景執行不阻塞家長送單畫面）
  if(typeof fetch === 'function'){
    try{
      let cloudUrl = window.DEFAULT_GAS_WEBAPP_URL || '';
      try{ cloudUrl = (localStorage.getItem('kids_gas_webapp_url') || cloudUrl || '').trim(); }catch(_){}
      if(cloudUrl){
        fetch(cloudUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'submitOrder',
            parent_label,
            contact,
            remit_last5,
            items: orderRows
          })
        }).catch(()=>{});
      }
    }catch(_){}
  }
  if(typeof window.triggerInstantCloudBackup === 'function'){
    window.triggerInstantCloudBackup();
  }
  const succ = $('stSuccessCard');
  if(succ){
    succ.style.display = 'block';
    succ.innerHTML = `
      <h3 style="margin:0 0 8px;font-size:1.25rem;color:#0d5220">🎉 訂購單已成功送出！（請截圖保存此取貨與取件時間憑證）</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;background:#fff;padding:12px 16px;border-radius:10px;border:1.5px solid #9fd8b2;font-size:.94rem;color:#222">
        <div><b>📦 取貨核對編號：</b><span style="font-size:1.2rem;font-weight:900;color:#c85000">${esc(pickupBase)}</span>（共 ${totalSheets} 張／${orderRows.length} 項）</div>
        <div><b>👨‍👩‍👧 取貨人稱呼：</b><b>${esc(parent_label)}</b></div>
        <div><b>📅 所屬梯次與截單：</b>${esc(sched.batchLabel)}（截單：${esc(sched.cutoffStr)}）</div>
        <div><b>💳 匯款後五碼／總額：</b>末五碼 <b>${esc(remit_last5)}</b> ／ 共 <b>NT$ ${totalAmt} 元</b></div>
        <div style="grid-column:1/-1;background:#fff8eb;border:1.5px solid #ff9d42;border-radius:8px;padding:10px 12px;color:#7a3b00;line-height:1.6">
          <b>⏰ 統一律定取件時段與遊戲規則（請務必準時配合）：</b><br>
          • <b>若於 ${esc(sched.cutoffStr)} 前完成匯款：</b>統一於 <b style="color:#0d5220">${esc(sched.deliveryStr)}</b> 至「桃園市桃園區豪情世家警衛室（同德七街46號）」取貨！<br>
          • <b>若於當週三晚上 21:00（9點）之後才完成匯款／下單：</b>順延至下一梯次 <b style="color:#b33a00">${esc(sched.nextDeliveryStr)}</b> 開放取件。<br>
          • <b>取件時間明確規定：</b>固定為<b>每週五中午 12:00 以後 ～ 每週日晚上 21:00（9點）以前</b>。週五中午 12:00 前尚未配送到位恕不接受提前領取；逾週日晚上 21:00 本梯次結束，請務必於規定時段內憑<b>「取貨編號 ${esc(pickupBase)}」＋「${esc(parent_label)}」</b>向警衛室領取。
        </div>
      </div>
      <p style="margin:8px 0 0;font-size:.86rem;color:#136529">✅ 系統已將您的訂單即時傳送至管理員後台對帳清單，核對匯款後五碼無誤即排入印製裝袋！</p>
    `;
  }

  storeCart = [];
  renderStoreCart();
}

// 預設雲端 Apps Script 端點（僅公開 Web App API 端點，密碼絕不寫入前端源碼）
const DEFAULT_GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbygUe5Y8ZbjERVcM6OVIZG_u91Bmp634I7EzekqXxR9B1PrJ-hv67hpsQD9dlQEuIc/exec';
window.DEFAULT_GAS_WEBAPP_URL = DEFAULT_GAS_WEBAPP_URL;

// ---------- 5. 初始化綁定 ----------
function initStore(){
  if(!$('viewStore')) return;
  const sched = computePickupSchedule();
  if($('stBatchLabel')) $('stBatchLabel').textContent = sched.batchLabel;
  if($('stPickupWindow')) $('stPickupWindow').textContent = sched.windowBadge;
  if($('stRemitScheduleNote')){
    $('stRemitScheduleNote').innerHTML = sched.isWedAfterCutoff
      ? `⏰ <b>截單順延提醒：</b>目前已過本週三 21:00，現在完成匯款將於 <b>${esc(sched.deliveryStr)}</b>（週五 12:00 以後～週日 21:00 以前）開放取件！`
      : `⏰ <b>交貨與取件時段律定：</b>請於 <b>${esc(sched.cutoffStr)}（晚上9點）前</b>完成匯款 → 統一於 <b style="color:#0d5220">${esc(sched.deliveryStr)}</b> 取件；<b>週三 21:00 之後</b>匯款／下單則順延至 <b>${esc(sched.nextDeliveryStr)}</b>（週五 12:00～週日 21:00）！`;
  }

  // 導覽列切換（受管理員權限鎖保護）
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.onclick = () => switchTab(btn.dataset.tab);
  });

  // 管理員登入／登出按鈕
  if($('btnAdminAuth')){
    $('btnAdminAuth').onclick = () => {
      if(isAdminUnlocked){
        isAdminUnlocked = false;
        sessionStorage.removeItem('kids_admin_session_token');
        applyAdminVisibility();
        switchTab('store');
      } else {
        openAdminModal();
      }
    };
  }
  if($('btnCloseModal')) $('btnCloseModal').onclick = closeAdminModal;
  if($('btnAdmLocalUnlock')){
    $('btnAdmLocalUnlock').onclick = () => unlockAdminBackend('local-dev-session');
  }
  if($('btnAdmLoginSubmit')){
    const fnv1a = str => {
      let h1 = 0x811c9dc5, h2 = 0x01000193;
      for(let i = 0; i < str.length; i++){
        const c = str.charCodeAt(i);
        h1 ^= c; h1 = Math.imul(h1, 0x01000193) >>> 0;
        h2 ^= (c + i); h2 = Math.imul(h2, 0x85ebca6b) >>> 0;
      }
      return h1.toString(16).padStart(8,'0') + h2.toString(16).padStart(8,'0');
    };
    window.fnv1aAdminHash = fnv1a;
    const getExpectedHash = () => {
      try{ return localStorage.getItem('kids_admin_custom_hash') || '0f84d63ae0e8f002'; }
      catch(_){ return '0f84d63ae0e8f002'; }
    };

    $('btnAdmLoginSubmit').onclick = async () => {
      const username = ($('admUser').value || '').trim();
      const password = ($('admPass').value || '').trim();
      if(!password){
        $('admAuthMsg').textContent = '請輸入管理員密碼！';
        return;
      }
      // 1. 先比對本機單向雜湊；若符合則解鎖後台，並同時以該組帳密自動登入雲端 Apps Script（無須二次輸入）
      if(fnv1a(username + ':' + password) === getExpectedHash()){
        unlockAdminBackend('local-hash-session');
        if(typeof window.autoConnectCloudOnLogin === 'function'){
          window.autoConnectCloudOnLogin(username, password);
        }
        return;
      }
      // 2. 若曾在其他裝置透過 Google Apps Script 修改密碼，嘗試向雲端驗證
      let cloudUrl = DEFAULT_GAS_WEBAPP_URL;
      try{ cloudUrl = (localStorage.getItem('kids_gas_webapp_url') || DEFAULT_GAS_WEBAPP_URL).trim(); }catch(_){}
      if(cloudUrl && typeof fetch === 'function'){
        $('admAuthMsg').style.color = '#b45309';
        $('admAuthMsg').textContent = '⏳ 正在向 Google 雲端核對密碼...';
        try{
          const resp = await fetch(cloudUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'adminLogin', username, password })
          });
          const data = await resp.json();
          if(data && data.ok && data.sessionToken){
            try{
              localStorage.setItem('kids_admin_custom_hash', fnv1a(username + ':' + password));
              localStorage.setItem('kids_cloud_session_token', data.sessionToken);
            }catch(_){}
            unlockAdminBackend(data.sessionToken);
            if(typeof window.refreshBackupStatusUI === 'function') window.refreshBackupStatusUI();
            return;
          }
        }catch(_){}
      }
      $('admAuthMsg').style.color = '#c0392b';
      $('admAuthMsg').textContent = '❌ 管理員帳號或密碼錯誤！';
    };
  }

  // 修改管理員與雲端後台密碼彈窗（同步本機雜湊與 Google Apps Script 指令碼屬性）
  const closeChgPassModal = () => {
    if($('changePassModal')) $('changePassModal').style.display = 'none';
  };
  document.querySelectorAll('.btn-open-chgpass').forEach(btn => {
    btn.onclick = () => {
      if($('changePassModal')){
        if($('chgAdmUser')) $('chgAdmUser').value = ($('admUser')?.value || 'admin').trim() || 'admin';
        ['chgOldPass','chgNewPass','chgNewPass2'].forEach(id => { if($(id)) $(id).value = ''; });
        if($('chgPassMsg')) $('chgPassMsg').textContent = '';
        $('changePassModal').style.display = 'flex';
      }
    };
  });
  if($('btnCloseChgPassModal')) $('btnCloseChgPassModal').onclick = closeChgPassModal;
  if($('btnChgPassReset')){
    $('btnChgPassReset').onclick = () => {
      try{ localStorage.removeItem('kids_admin_custom_hash'); }catch(_){}
      if($('chgPassMsg')){
        $('chgPassMsg').style.color = '#136529';
        $('chgPassMsg').textContent = '🔄 已還原本機預設登入驗證（若曾修改 Google 雲端密碼，請點左側連結確認指令碼屬性）。';
      }
    };
  }
  if($('btnChgPassSubmit')){
    $('btnChgPassSubmit').onclick = async () => {
      const u = ($('chgAdmUser')?.value || 'admin').trim() || 'admin';
      const oldP = ($('chgOldPass')?.value || '').trim();
      const newP = ($('chgNewPass')?.value || '').trim();
      const newP2 = ($('chgNewPass2')?.value || '').trim();
      const msgEl = $('chgPassMsg');
      const setMsg = (txt, col) => { if(msgEl){ msgEl.style.color = col; msgEl.textContent = txt; } };
      if(!oldP){ setMsg('⚠️ 請輸入目前密碼！', '#c0392b'); return; }
      if(newP.length < 4){ setMsg('⚠️ 新密碼長度至少需 4 碼！', '#c0392b'); return; }
      if(newP !== newP2){ setMsg('⚠️ 兩次輸入的新密碼不一致！', '#c0392b'); return; }

      const fnv1a = window.fnv1aAdminHash;
      let curExpected = '0f84d63ae0e8f002';
      try{ curExpected = localStorage.getItem('kids_admin_custom_hash') || '0f84d63ae0e8f002'; }catch(_){}
      const localMatch = fnv1a && (fnv1a(u + ':' + oldP) === curExpected);

      let cloudUrl = DEFAULT_GAS_WEBAPP_URL;
      try{ cloudUrl = (localStorage.getItem('kids_gas_webapp_url') || DEFAULT_GAS_WEBAPP_URL).trim(); }catch(_){}
      let cloudUpdated = false, cloudErr = '';
      if(cloudUrl && typeof fetch === 'function'){
        setMsg('⏳ 正在同步更新本機與 Google 雲端密碼...', '#b45309');
        try{
          const tok = (()=>{ try{ return sessionStorage.getItem('kids_admin_session_token')||''; }catch(_){ return ''; } })();
          const resp = await fetch(cloudUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              action: 'changeAdminPassword',
              token: (tok && tok !== 'local-hash-session' && tok !== 'local-dev-session') ? tok : '',
              oldUsername: u, oldPassword: oldP,
              newUsername: u, newPassword: newP
            })
          });
          const data = await resp.json();
          if(data && data.ok){
            cloudUpdated = true;
            if(data.sessionToken){
              try{
                sessionStorage.setItem('kids_admin_session_token', data.sessionToken);
                localStorage.setItem('kids_cloud_session_token', data.sessionToken);
              }catch(_){}
            }
          } else if(!localMatch) {
            setMsg(`❌ 原密碼驗證失敗：${(data&&data.error)||'請確認目前密碼是否正確'}`, '#c0392b');
            return;
          } else {
            cloudErr = (data && data.error) || '雲端認證需先連線';
          }
        }catch(err){
          if(!localMatch){ setMsg(`❌ 驗證失敗：${err.message}`, '#c0392b'); return; }
          cloudErr = err.message;
        }
      } else if(!localMatch){
        setMsg('❌ 目前密碼不正確！', '#c0392b');
        return;
      }

      if(fnv1a){
        try{ localStorage.setItem('kids_admin_custom_hash', fnv1a(u + ':' + newP)); }catch(_){}
      }
      if($('admPass')) $('admPass').value = '';
      setMsg(
        cloudUpdated
          ? '✅ 已成功修改並同步更新網站後台與 Google 雲端密碼！'
          : `✅ 網站後台密碼已修改完成（雲端同步提示：${cloudErr || '將於下次雲端登入同步'}）`,
        '#136529'
      );
      if(typeof window.refreshBackupStatusUI === 'function') window.refreshBackupStatusUI();
    };
  }

  // 購買模式 4 選 1：評量懶人包 vs 生字練習本 vs 幼兒園運筆寫字帖 vs 客製自由配
  document.querySelectorAll('input[name=stPackMode]').forEach(r => {
    r.onchange = () => {
      const val = r.checked ? r.value : (document.querySelector('input[name=stPackMode]:checked')?.value || 'lazy');
      $('stLazyPanel').style.display = val === 'lazy' ? '' : 'none';
      if($('stStrokePackPanel')) $('stStrokePackPanel').style.display = val === 'stroke_pack' ? '' : 'none';
      if($('stPreschoolPanel')) $('stPreschoolPanel').style.display = val === 'preschool_pack' ? '' : 'none';
      $('stCustomPanel').style.display = val === 'custom' ? '' : 'none';
      if($('stBasicSchoolWrap')) $('stBasicSchoolWrap').style.display = val === 'preschool_pack' ? 'none' : '';
      $('lblPackLazy').classList.toggle('active', val === 'lazy');
      if($('lblPackStroke')) $('lblPackStroke').classList.toggle('active', val === 'stroke_pack');
      if($('lblPackPreschool')) $('lblPackPreschool').classList.toggle('active', val === 'preschool_pack');
      $('lblPackCustom').classList.toggle('active', val === 'custom');
      if($('stQty')) $('stQty').value = '1';
      if($('stPreviewSheetSel')) $('stPreviewSheetSel').value = '0';
      scheduleStorePreview();
    };
  });

  if($('btnWbPreGen')) $('btnWbPreGen').onclick = renderPreschoolWorkbench;
  if($('btnWbPrePrint')) $('btnWbPrePrint').onclick = () => {
    renderPreschoolWorkbench();
    const st = $('examPrintStyle'); if(st) st.textContent = '@media print{@page{size:A4 portrait;margin:0}}';
    window.print();
  };
  ['wbPreLevel','wbPreTopic','wbPreSheets','wbPreIllust'].forEach(id => {
    if($(id)) $(id).onchange = renderPreschoolWorkbench;
  });

  // 客製包內：生字本 vs 評量本切換
  document.querySelectorAll('input[name=stCustomType]').forEach(r => {
    r.onchange = () => {
      const isStroke = r.value === 'stroke' && r.checked;
      $('stCustomStrokeBox').style.display = isStroke ? '' : 'none';
      $('stCustomExamBox').style.display = isStroke ? 'none' : '';
      scheduleStorePreview();
    };
  });

  ['stGrade','stSem','stPub'].forEach(id => {
    const el = $(id); if(!el) return;
    el.onchange = () => {
      fillStoreSubjects();
      scheduleStorePreview();
    };
  });
  if($('stExamSubj')){
    $('stExamSubj').onchange = () => {
      fillStoreUnits();
      scheduleStorePreview();
    };
  }
  ['stLazySubj','stLazyScope','stSpSheets','stSpMode','stSpCols','stSpZy','stPreLevel','stPreTopic','stPreSheets','stPreIllust','stStrokeMode','stStrokeCols','stStrokeZy','stCustomWords','stExamDiff','stExamLayout','stExamRuby','stQty'].forEach(id => {
    const el = $(id); if(!el) return;
    el.onchange = () => {
      if((id==='stSpSheets'||id==='stPreSheets') && $('stPreviewSheetSel')) $('stPreviewSheetSel').value = '0';
      scheduleStorePreview();
    };
    if(el.tagName === 'INPUT') el.oninput = scheduleStorePreview;
  });

  // 右側預覽翻頁器綁定（直接正反雙面同時檢視）
  if($('stPreviewSheetSel')){
    $('stPreviewSheetSel').onchange = updateStorePreview;
  }
  if($('btnPrevSheet')){
    $('btnPrevSheet').onclick = () => {
      const sel = $('stPreviewSheetSel'); if(!sel || sel.options.length <= 1) return;
      const cur = Math.max(0, sel.selectedIndex);
      sel.selectedIndex = (cur - 1 + sel.options.length) % sel.options.length;
      updateStorePreview();
    };
  }
  if($('btnNextSheet')){
    $('btnNextSheet').onclick = () => {
      const sel = $('stPreviewSheetSel'); if(!sel || sel.options.length <= 1) return;
      const cur = Math.max(0, sel.selectedIndex);
      sel.selectedIndex = (cur + 1) % sel.options.length;
      updateStorePreview();
    };
  }

  // 課次與單元快捷按鈕
  const setChkRange = (sel, mode) => {
    const chks = [...document.querySelectorAll(sel)];
    const mid = Math.ceil(chks.length / 2);
    chks.forEach((c, i) => {
      c.checked = mode === 'all' || (mode === 'mid' && i < mid) || (mode === 'final' && i >= mid);
    });
    scheduleStorePreview();
  };
  if($('btnSpLsMid')) $('btnSpLsMid').onclick = () => setChkRange('#stSpLessonList input', 'mid');
  if($('btnSpLsFinal')) $('btnSpLsFinal').onclick = () => setChkRange('#stSpLessonList input', 'final');
  if($('btnSpLsAll')) $('btnSpLsAll').onclick = () => setChkRange('#stSpLessonList input', 'all');
  if($('btnSpLsNone')) $('btnSpLsNone').onclick = () => setChkRange('#stSpLessonList input', 'none');
  if($('btnStLsMid')) $('btnStLsMid').onclick = () => setChkRange('#stLessonList input', 'mid');
  if($('btnStLsFinal')) $('btnStLsFinal').onclick = () => setChkRange('#stLessonList input', 'final');
  if($('btnStLsAll')) $('btnStLsAll').onclick = () => setChkRange('#stLessonList input', 'all');
  if($('btnStLsNone')) $('btnStLsNone').onclick = () => setChkRange('#stLessonList input', 'none');
  if($('btnStUnMid')) $('btnStUnMid').onclick = () => setChkRange('#stUnitList input', 'mid');
  if($('btnStUnFinal')) $('btnStUnFinal').onclick = () => setChkRange('#stUnitList input', 'final');
  if($('btnStUnAll')) $('btnStUnAll').onclick = () => setChkRange('#stUnitList input', 'all');
  if($('btnStUnNone')) $('btnStUnNone').onclick = () => setChkRange('#stUnitList input', 'none');

  if($('btnAddToCart')){
    $('btnAddToCart').onclick = () => {
      const newItems = buildCurrentSelectionsAsCartItems();
      if(!newItems.length) return;
      storeCart.push(...newItems);
      renderStoreCart();
      if($('stSuccessCard')) $('stSuccessCard').style.display = 'none';
      if($('stAddMsg')){
        $('stAddMsg').textContent = `✅ 已將 ${newItems.map(x=>x.planName).join(' ＋ ')} 加入下方購物車！`;
        setTimeout(() => { if($('stAddMsg')) $('stAddMsg').textContent = ''; }, 3500);
      }
    };
  }
  if($('btnCopyAcc')){
    $('btnCopyAcc').onclick = () => {
      const acc = ($('stBankAcc')?.textContent || '').trim();
      if(navigator.clipboard) navigator.clipboard.writeText(acc).catch(()=>{});
      $('btnCopyAcc').textContent = '✅ 已複製';
      setTimeout(() => { $('btnCopyAcc').textContent = '📋 複製'; }, 2000);
    };
  }
  if($('btnStSubmit')) $('btnStSubmit').onclick = submitStoreOrder;

  applyAdminVisibility();
  fillStoreSubjects();
  updateItemPriceHint();
  switchTab('store');
  window.addEventListener('resize', () => {
    if($('viewStore') && $('viewStore').style.display !== 'none') scheduleStorePreview();
  });
  setTimeout(updateStorePreview, 150);
}

initStore();
})();
