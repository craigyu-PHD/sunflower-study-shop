/**
 * 向日葵國小伴學誌｜題目自動審題引擎（QAudit）
 * 純規則、不連網、不用 AI。網站出題時每一道候選題都會先過這裡，不合格就直接換題；
 * qa_verify.js 在部署前也用同一套規則掃描全部題庫與大量隨機試卷。
 *
 * auditItem(item, ctx) → [{code, level:'error'|'warn', msg}]
 *   level='error'：一定不能印給小孩（出題時自動剔除、部署前檢查會擋下）
 *   level='warn' ：疑似有風險，只列入報告
 */
(function(root){
  'use strict';

  // ===== 量詞表：物品 → 允許的量詞（容器類量詞對任何物品都允許）=====
  var CLASSIFIER_OF = {
    鉛筆:'枝支', 彩色筆:'枝支', 水彩筆:'枝支', 蠟筆:'枝支', 螢光筆:'枝支', 自動筆:'枝支支', 原子筆:'枝支', 毛筆:'枝支',
    故事書:'本', 筆記本:'本', 課本:'本', 貼紙:'張', 便利貼:'張', 卡片:'張', 色紙:'張', 書籤:'張',
    尺:'把', 雨傘:'把', 剪刀:'把', 橡皮擦:'個塊', 糖果:'顆', 牛奶糖:'顆',
    小狗:'隻', 小貓:'隻', 小鳥:'隻', 麻雀:'隻', 鴨子:'隻', 兔子:'隻', 青蛙:'隻', 蝴蝶:'隻',
    小魚:'條尾', 衣服:'件', 褲子:'條', 桌子:'張', 椅子:'張', 手機:'支', 鞋子:'雙', 襪子:'雙',
    蛋糕:'塊個片', 披薩:'片個', 香蕉:'根條', 餅乾:'片塊個', 積木:'塊個', 拼圖:'片塊',
    蘋果:'顆個', 草莓:'顆個', 橘子:'顆個', 水蜜桃:'顆個', 彈珠:'顆個', 氣球:'顆個', 水餃:'顆個', 湯圓:'顆個'
  };
  var CONTAINER = '盒袋箱瓶包罐籃堆組串杯碗盤份';
  var CLS_CHARS = '個顆隻條支枝張本塊片粒件把袋盒瓶根輛台臺朵棵頭尾匹位名間座雙副套包串杯碗盤枚份組堆束棟扇封冊';
  var nounKeys = Object.keys(CLASSIFIER_OF).sort(function(a,b){return b.length-a.length;});
  var CLS_RE = new RegExp('(?:\\d+|[一二兩三四五六七八九十]+)\\s*([' + CLS_CHARS + '])\\s*(' + nounKeys.join('|') + ')', 'g');

  function allText(item){
    var parts=[String(item.q||'')];
    if(Array.isArray(item.opts)) item.opts.forEach(function(o){parts.push(String(o));});
    if(item.a!==undefined&&item.a!==null) parts.push(String(item.a));
    if(Array.isArray(item.pairs)) item.pairs.forEach(function(p){parts.push(String(p[0]),String(p[1]));});
    return parts.join(' | ');
  }
  function kindOf(item){
    if(Array.isArray(item.pairs)) return 'match';
    if(Array.isArray(item.opts)) return 'mc';
    if(item.a==='○'||item.a==='✕') return 'tf';
    return 'open';
  }
  function count(str, ch){ return str.split(ch).length-1; }

  // 安全算術：只允許數字與四則運算符號
  function evalArith(expr){
    var e=String(expr).replace(/[＋+]/g,'+').replace(/[－−–-]/g,'-').replace(/[×xX＊*]/g,'*').replace(/[÷／/]/g,'/').replace(/\s+/g,'');
    if(!/^[\d.+\-*/()]+$/.test(e)) return null;
    if(/[+\-*/]{2,}/.test(e.replace(/\(-/g,'('))) return null;
    try{ var v=Function('"use strict";return ('+e+')')(); return isFinite(v)?v:null; }catch(err){ return null; }
  }
  var ARITH_RE=/((?:\d+(?:\.\d+)?\s*[＋－×÷+\-*/]\s*)+\d+(?:\.\d+)?)\s*[＝=]\s*(\d+(?:\.\d+)?)(?!\s*[…/\d.])/g;

  function auditItem(item, ctx){
    ctx=ctx||{};
    var out=[]; function add(code,level,msg){ out.push({code:code,level:level,msg:msg}); }
    if(!item || typeof item.q!=='string'){ add('E_EMPTY','error','題幹不是文字'); return out; }
    var q=item.q, kind=kindOf(item), subj=ctx.subj||'', text=allText(item);

    // ---- 結構 ----
    if(q.replace(/\s/g,'').length<4) add('E_EMPTY','error','題幹過短');
    if(/undefined|NaN|\[object|\bnull\b|Infinity|\$\{|\{\{|\}\}/.test(text)) add('E_TOKEN','error','出現程式殘留字樣');
    if(kind==='mc'){
      var o=item.opts.map(function(x){return String(x).trim();});
      if(o.length!==4) add('E_MC_COUNT','error','選擇題選項不是 4 個');
      if(new Set(o).size!==o.length) add('E_MC_DUP','error','選項重複');
      if(o.some(function(x){return !x;})) add('E_MC_EMPTY','error','有空白選項');
      if(o.indexOf(String(item.a).trim())<0) add('E_MC_ANS','error','正解不在選項內');
      // 單位混雜：同一題選項「數字＋單位」的單位不一致（如 5 顆／6 隻）
      var units=o.map(function(x){var m=x.replace(/\s/g,'').match(/^\d+(?:\.\d+)?([㐀-鿿A-Za-z°%]{1,3})$/);return m?m[1]:null;});
      if(units.every(function(u){return u && u.length===1 && CLS_CHARS.indexOf(u)>=0;}) && new Set(units).size>1) add('E_UNIT_MIX','error','選項單位不一致：'+o.join('／'));
    } else if(kind==='tf'){
      // ok
    } else if(kind==='match'){
      if(item.pairs.length<3) add('E_MATCH','error','配對題少於 3 組');
      var rights=item.pairs.map(function(p){return String(p[1]);});
      if(new Set(rights).size!==rights.length) add('E_MATCH_DUP','error','配對題右欄重複');
    } else {
      if(item.a===undefined||item.a===null||String(item.a).trim()==='') add('E_NO_ANS','error','缺少解答');
    }
    // 括號／引號成對
    [['「','」'],['『','』'],['（','）'],['(',')']].forEach(function(pr){
      if(count(q,pr[0])!==count(q,pr[1])) add('E_BRACKET','error','括號或引號未成對 '+pr[0]+pr[1]);
    });
    // 填空題：空格數與答案數一致（以「；」分隔的多格答案）
    if(kind==='open' && /（[\s　]*）/.test(q) && typeof item.a==='string' && /[；、]/.test(item.a) && !/^例/.test(item.a)){
      var blanks=(q.match(/（[\s　]*）/g)||[]).length, parts=item.a.split(/[；、]/).length;
      if(blanks>1 && blanks!==parts && !/[（(]\d[）)]|\n/.test(q)) add('E_BLANKS','error','空格數 '+blanks+' 與答案數 '+parts+' 不同');
    }

    // ---- 量詞 ----
    var m, re=new RegExp(CLS_RE.source,'g');
    while((m=re.exec(text))!==null){
      if(CLASSIFIER_OF[m[2]].indexOf(m[1])<0 && CONTAINER.indexOf(m[1])<0) add('E_MEASURE','error','量詞不對：「'+m[0]+'」');
    }

    // ---- 洩題 ----
    var a=String(item.a==null?'':item.a).trim();
    var aNoSp=a.replace(/\s+/g,'');
    if(kind==='mc' && /^\d+[㐀-鿿]{1,3}$/.test(aNoSp) && q.replace(/\s+/g,'').indexOf(aNoSp)>=0 && /(幾|多少)/.test(q) && !/[^\d]0\s*[\u3400-\u9fff]|空/.test(q)) add('E_LEAK_NUM','error','題幹已寫出答案：'+a);
    if(subj==='英語' && (kind==='mc'||kind==='open')){
      var stem=q.replace(/\([　 ]*\)/g,'').replace(/（[^）]*）/g,'');
      var a0=a.split(/[；;]/)[0].trim();
      if(/^[A-Za-z']{3,}$/.test(a0) && !/^(can|does|do|did|are|is|has|have|was|were|am)$/i.test(a0) && new RegExp('\\b'+a0+'\\b','i').test(stem)) add('E_LEAK_ENG','error','題幹已出現答案單字「'+a0+'」');
      var mk=q.match(/→\s*([A-Za-z](?:\s*_)?)\s*[（(]/);
      if(mk && mk[1].replace(/[^A-Za-z]/g,'').toLowerCase()===a.toLowerCase()) add('E_LEAK_MASK','error','拼字提示已顯示完整單字');
    }
    // 改錯字：被指為錯字者必須真的在句子裡，且不可與改正字相同
    var tm=q.match(/先找錯字再改正：「(.+?)」/);
    if(tm && typeof item.a==='string'){
      var ap=item.a.split('；');
      if(ap.length===2){
        if(tm[1].indexOf(ap[0])<0) add('E_TYPO','error','指定的錯字不在句子裡');
        if(ap[0]===ap[1]) add('E_TYPO','error','錯字與改正字相同');
      }
    }
    var tm2=q.match(/檢查錯別字：「(.+?)」/);
    if(tm2 && kind==='mc' && tm2[1].indexOf(a)<0) add('E_TYPO','error','答案字不在句子裡');

    // ---- 算術 ----
    var am, are=new RegExp(ARITH_RE.source,'g'), ansText=String(item.a==null?'':item.a);
    while((am=are.exec(ansText))!==null){
      var lhs=evalArith(am[1]), rhs=parseFloat(am[2]);
      if(lhs!==null && Math.abs(lhs-rhs)>1e-6 && Math.abs(lhs-rhs)>0.0051) add('E_ARITH','error','解答算式不成立：'+am[0]);
    }
    if(kind==='tf'){
      var found=[], te=new RegExp(ARITH_RE.source,'g'), tt;
      while((tt=te.exec(q))!==null) found.push(tt);
      if(found.length===1 && q.length<46 && !/[＞＜>]/.test(q)){
        var l2=evalArith(found[0][1]), r2=parseFloat(found[0][2]);
        if(l2!==null){
          var truth=Math.abs(l2-r2)<1e-6;
          if(truth!==(item.a==='○')) add('E_TF_ARITH','error','是非題算式真假與答案不一致：'+found[0][0]);
        }
      }
    }
    var pure=q.match(/^(\d+(?:\.\d+)?)\s*([＋－×÷])\s*(\d+(?:\.\d+)?)\s*＝\s*（[\s　]*）$/);
    if(pure){
      var pv=evalArith(pure[1]+pure[2]+pure[3]);
      if(pv!==null && Math.abs(parseFloat(item.a)-pv)>1e-6) add('E_ARITH','error','計算題答案錯誤：'+q);
    }

    // ---- 風險提示（只警告）----
    if(kind==='tf' && item.a==='○' && /絕對|永遠|一定會|完全不會|所有的?|從來|每一個都|全部都/.test(q) && ['生活','自然科學','社會'].indexOf(subj)>=0) add('W_ABSOLUTE','warn','是非題為「○」卻含絕對性字眼，請確認');
    return out;
  }

  // 出題時使用：回傳是否應直接剔除（有任何 error）
  var stats={checked:0,blocked:0,byCode:{}};
  function resetStats(){ stats={checked:0,blocked:0,byCode:{}}; }
  function blocks(item, ctx){
    stats.checked++;
    var issues=auditItem(item,ctx).filter(function(i){return i.level==='error';});
    if(issues.length){
      stats.blocked++;
      issues.forEach(function(i){ stats.byCode[i.code]=(stats.byCode[i.code]||0)+1; });
      return true;
    }
    return false;
  }
  function getStats(){ return stats; }

  root.QAudit={auditItem:auditItem,blocks:blocks,resetStats:resetStats,getStats:getStats,CLASSIFIER_OF:CLASSIFIER_OF};
  if(typeof module!=='undefined') module.exports=root.QAudit;
})(typeof window!=='undefined'?window:this);
