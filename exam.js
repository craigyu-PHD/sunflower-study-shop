'use strict';
(function(){
const $=id=>document.getElementById(id);
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=arr=>arr[Math.floor(Math.random()*arr.length)];
const shuffle=arr=>{const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=rnd(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
const NAMES=['小華','小美','阿明','小晴','柏宇','子涵','宥翔','品妍','冠宇','思妤','宇軒','詠晴','承恩','語彤','定謙','芷瑜','品睿','映竹','秉澄','欣妤','哲維','星辰','廷恩','雨潔','瑞霖','詩涵','奕辰','可晴','子軒','若曦','晨希','采恩','宇恩','樂晴','少祺','語希'];
const ITEMS=['鉛筆','橡皮擦','故事書','貼紙','蘋果','餅乾','彩色筆','筆記本','蠟筆','果凍','彈珠','書籤','尺','水彩筆','自動筆','色紙','積木','橘子','草莓','銅鑼燒','飯糰','牛奶糖','拼圖','卡片','資料夾','螢光筆','便利貼','麵包','泡芙','布丁','奇異果','水蜜桃'];
const gcd=(a,b)=>b?gcd(b,a%b):a;
const lcm=(a,b)=>(a*b)/gcd(a,b);

function uniqueOpts(ans, cand){
  const s=new Set([String(ans)]);
  for(const c of cand){if(s.size>=4)break;if(String(c)!==String(ans))s.add(String(c));}
  let k=1;while(s.size<4){s.add(String(Number(ans)+k||ans+k));k++;}
  return shuffle([...s]);
}


// ===== 0. 國小高頻破音字詞庫覆寫引擎（詞語層級最長優先匹配，杜絕單字直查標錯音）=====
// 格式：詞語 -> 以空白分隔之各字注音；若某字用 '_' 代表沿用 ZY_DATA 單字預設音
const POLY_PHRASE_RAW = {
  // 1. 長（預設 ㄔㄤˊ；覆寫 ㄓㄤˇ）
  '長大':'ㄓㄤˇ _','成長':'_ ㄓㄤˇ','生長':'_ ㄓㄤˇ','長出':'ㄓㄤˇ _','長高':'ㄓㄤˇ _','長得':'ㄓㄤˇ ˙ㄉㄜ',
  '師長':'_ ㄓㄤˇ','校長':'_ ㄓㄤˇ','班長':'_ ㄓㄤˇ','市長':'_ ㄓㄤˇ','縣長':'_ ㄓㄤˇ','村長':'_ ㄓㄤˇ',
  '里長':'_ ㄓㄤˇ','家長':'_ ㄓㄤˇ','長輩':'ㄓㄤˇ _','兄長':'_ ㄓㄤˇ','專長':'_ ㄓㄤˇ','擅長':'_ ㄓㄤˇ',
  '年長':'_ ㄓㄤˇ','區長':'_ ㄓㄤˇ','鄉長':'_ ㄓㄤˇ','鎮長':'_ ㄓㄤˇ','部長':'_ ㄓㄤˇ','院長':'_ ㄓㄤˇ',
  '議長':'_ ㄓㄤˇ','組長':'_ ㄓㄤˇ','隊長':'_ ㄓㄤˇ','廠長':'_ ㄓㄤˇ','站長':'_ ㄓㄤˇ','長進':'ㄓㄤˇ _',
  '長相':'ㄓㄤˇ ㄒㄧㄤˋ','助長':'_ ㄓㄤˇ','苗長':'_ ㄓㄤˇ','長幼':'ㄓㄤˇ _','長官':'ㄓㄤˇ _','長子':'ㄓㄤˇ _',
  // 2. 行（預設 ㄒㄧㄥˊ；覆寫 ㄏㄤˊ／ㄏㄤˋ）
  '銀行':'_ ㄏㄤˊ','行列':'ㄏㄤˊ _','一行':'_ ㄏㄤˊ','兩行':'_ ㄏㄤˊ','幾行':'_ ㄏㄤˊ','同行':'_ ㄏㄤˊ',
  '行業':'ㄏㄤˊ _','行號':'ㄏㄤˊ _','車行':'_ ㄏㄤˊ','商行':'_ ㄏㄤˊ','分行':'_ ㄏㄤˊ','外行':'_ ㄏㄤˊ',
  '內行':'_ ㄏㄤˊ','在行':'_ ㄏㄤˊ','行家':'ㄏㄤˊ _','排行':'_ ㄏㄤˊ','行道樹':'ㄏㄤˊ _ _',
  // 3. 重（預設 ㄓㄨㄥˋ；覆寫 ㄔㄨㄥˊ）
  '重新':'ㄔㄨㄥˊ _','重複':'ㄔㄨㄥˊ _','重疊':'ㄔㄨㄥˊ _','重組':'ㄔㄨㄥˊ _','重逢':'ㄔㄨㄥˊ _',
  '重現':'ㄔㄨㄥˊ _','重溫':'ㄔㄨㄥˊ _','重演':'ㄔㄨㄥˊ _','重返':'ㄔㄨㄥˊ _','重來':'ㄔㄨㄥˊ _',
  '重播':'ㄔㄨㄥˊ _','重修':'ㄔㄨㄥˊ _','重建':'ㄔㄨㄥˊ _','重申':'ㄔㄨㄥˊ _','重圍':'ㄔㄨㄥˊ _',
  '雙重':'_ ㄔㄨㄥˊ','多重':'_ ㄔㄨㄥˊ','九重':'_ ㄔㄨㄥˊ','重陽':'ㄔㄨㄥˊ _','重蹈':'ㄔㄨㄥˊ _',
  // 4. 好（預設 ㄏㄠˇ；覆寫 ㄏㄠˋ）
  '好奇':'ㄏㄠˋ ㄑㄧˊ','愛好':'_ ㄏㄠˋ','喜好':'_ ㄏㄠˋ','好學':'ㄏㄠˋ _','好客':'ㄏㄠˋ _',
  '好勝':'ㄏㄠˋ _','好動':'ㄏㄠˋ _','癖好':'_ ㄏㄠˋ','嗜好':'_ ㄏㄠˋ','投其所好':'_ _ _ ㄏㄠˋ',
  // 5. 樂（預設 ㄌㄜˋ；覆寫 ㄩㄝˋ）
  '音樂':'_ ㄩㄝˋ','樂器':'ㄩㄝˋ _','樂團':'ㄩㄝˋ _','樂曲':'ㄩㄝˋ ㄑㄩˇ','樂譜':'ㄩㄝˋ _',
  '樂隊':'ㄩㄝˋ _','樂音':'ㄩㄝˋ _','樂章':'ㄩㄝˋ _','樂師':'ㄩㄝˋ _','國樂':'_ ㄩㄝˋ',
  '西樂':'_ ㄩㄝˋ','弦樂':'_ ㄩㄝˋ','管樂':'_ ㄩㄝˋ','打擊樂':'_ _ ㄩㄝˋ','交響樂':'_ _ ㄩㄝˋ',
  '聲樂':'_ ㄩㄝˋ','奏樂':'_ ㄩㄝˋ','配樂':'_ ㄩㄝˋ','育樂':'_ ㄌㄜˋ',
  // 6. 覺（預設 ㄐㄩㄝˊ；覆寫 ㄐㄧㄠˋ）
  '睡覺':'_ ㄐㄧㄠˋ','午覺':'_ ㄐㄧㄠˋ','睡午覺':'_ _ ㄐㄧㄠˋ','睡大覺':'_ _ ㄐㄧㄠˋ','一覺醒來':'_ ㄐㄧㄠˋ _ _',
  // 7. 數（預設 ㄕㄨˋ；覆寫 ㄕㄨˇ／ㄕㄨㄛˋ）
  '數一數':'ㄕㄨˇ _ ㄕㄨˇ','數數看':'ㄕㄨˇ ㄕㄨˇ _','數到':'ㄕㄨˇ _','數出':'ㄕㄨˇ _','數得':'ㄕㄨˇ ˙ㄉㄜ',
  '一個一數':'_ _ _ ㄕㄨˇ','兩個一數':'_ _ _ ㄕㄨˇ','五個一數':'_ _ _ ㄕㄨˇ','十個一數':'_ _ _ ㄕㄨˇ',
  '一百一數':'_ _ _ ㄕㄨˇ','一千一數':'_ _ _ ㄕㄨˇ','細數':'_ ㄕㄨˇ','倒數':'ㄉㄠˋ ㄕㄨˇ',
  '不可勝數':'_ _ _ ㄕㄨˇ','屈指可數':'_ _ _ ㄕㄨˇ','數見不鮮':'ㄕㄨㄛˋ _ _ ㄒㄧㄢˇ',
  // 8. 著（預設 ˙ㄓㄜ；覆寫 ㄓㄨˋ／ㄓㄠˊ／ㄓㄨㄛˊ）
  '著名':'ㄓㄨˋ _','著作':'ㄓㄨˋ _','名著':'_ ㄓㄨˋ','顯著':'_ ㄓㄨˋ','昭著':'_ ㄓㄨˋ','編著':'_ ㄓㄨˋ',
  '著急':'ㄓㄠˊ _','著火':'ㄓㄠˊ _','著涼':'ㄓㄠˊ _','著迷':'ㄓㄠˊ _','睡著':'_ ㄓㄠˊ','找著':'_ ㄓㄠˊ',
  '猜著':'_ ㄓㄠˊ','點著':'_ ㄓㄠˊ','用得著':'_ ˙ㄉㄜ ㄓㄠˊ','用不著':'_ _ ㄓㄠˊ',
  '穿著':'ㄔㄨㄢ ㄓㄨㄛˊ','衣著':'_ ㄓㄨㄛˊ','著手':'ㄓㄨㄛˊ _','著陸':'ㄓㄨㄛˊ _','著地':'ㄓㄨㄛˊ ㄉㄧˋ',
  '著想':'ㄓㄨㄛˊ _','著重':'ㄓㄨㄛˊ ㄓㄨㄥˋ','著色':'ㄓㄨㄛˊ _','著落':'ㄓㄨㄛˊ ㄌㄨㄛˋ','執著':'_ ㄓㄨㄛˊ',
  // 9. 得（預設 ㄉㄜˊ；覆寫 ˙ㄉㄜ／ㄉㄟˇ）
  '覺得':'ㄐㄩㄝˊ ˙ㄉㄜ','記得':'_ ˙ㄉㄜ','懂得':'_ ˙ㄉㄜ','認得':'_ ˙ㄉㄜ','捨得':'_ ˙ㄉㄜ',
  '曉得':'_ ˙ㄉㄜ','怪不得':'_ _ ˙ㄉㄜ','恨不得':'_ _ ˙ㄉㄜ','免得':'_ ˙ㄉㄜ','見得':'_ ˙ㄉㄜ',
  '顯得':'_ ˙ㄉㄜ','變得':'_ ˙ㄉㄜ','跑得':'_ ˙ㄉㄜ','走得':'_ ˙ㄉㄜ','飛得':'_ ˙ㄉㄜ','跳得':'_ ˙ㄉㄜ',
  '寫得':'_ ˙ㄉㄜ','做得':'_ ˙ㄉㄜ','說得':'_ ˙ㄉㄜ','唱得':'_ ˙ㄉㄜ','畫得':'_ ˙ㄉㄜ','算得':'_ ˙ㄉㄜ',
  '長得更':'ㄓㄤˇ ˙ㄉㄜ ㄍㄥˋ','聽得見':'_ ˙ㄉㄜ _','看得見':'_ ˙ㄉㄜ _','看得很':'_ ˙ㄉㄜ _',
  '拿得起':'_ ˙ㄉㄜ _','來得及':'_ ˙ㄉㄜ _','不得了':'_ ˙ㄉㄜ ㄌㄧㄠˇ','了不得':'ㄌㄧㄠˇ _ ˙ㄉㄜ',
  '非得':'_ ㄉㄟˇ','總得':'_ ㄉㄟˇ','還得':'ㄏㄞˊ ㄉㄟˇ','得要':'ㄉㄟˇ _','必得':'_ ㄉㄟˇ',
  // 10. 地（預設 ㄉㄧˋ；副詞詞尾覆寫 ˙ㄉㄜ）
  '慢慢地':'_ _ ˙ㄉㄜ','悄悄地':'_ _ ˙ㄉㄜ','靜靜地':'_ _ ˙ㄉㄜ','漸漸地':'_ _ ˙ㄉㄜ','輕輕地':'_ _ ˙ㄉㄜ',
  '緊緊地':'_ _ ˙ㄉㄜ','深深地':'_ _ ˙ㄉㄜ','高興地':'_ ㄒㄧㄥˋ ˙ㄉㄜ','開心地':'_ _ ˙ㄉㄜ','快樂地':'_ ㄌㄜˋ ˙ㄉㄜ',
  '專心地':'_ _ ˙ㄉㄜ','用心地':'_ _ ˙ㄉㄜ','仔細地':'_ _ ˙ㄉㄜ','小心地':'_ _ ˙ㄉㄜ','大聲地':'_ _ ˙ㄉㄜ',
  '輕聲地':'_ _ ˙ㄉㄜ','不斷地':'_ _ ˙ㄉㄜ','勇敢地':'_ _ ˙ㄉㄜ','努力地':'_ _ ˙ㄉㄜ','認真地':'_ _ ˙ㄉㄜ',
  '飛快地':'_ _ ˙ㄉㄜ','默默地':'_ _ ˙ㄉㄜ','安靜地':'_ _ ˙ㄉㄜ','緩緩地':'_ _ ˙ㄉㄜ','笑咪咪地':'_ _ _ ˙ㄉㄜ',
  // 11. 為（預設 ㄨㄟˊ；覆寫 ㄨㄟˋ）
  '因為':'_ ㄨㄟˋ','為了':'ㄨㄟˋ ˙ㄌㄜ','為什麼':'ㄨㄟˋ _ ˙ㄇㄜ','為何':'ㄨㄟˋ _','為民':'ㄨㄟˋ _',
  '為國':'ㄨㄟˋ _','為人著想':'ㄨㄟˋ _ ㄓㄨㄛˊ _','為虎作倀':'ㄨㄟˋ _ _ _',
  // 12. 應（預設 ㄧㄥ；覆寫 ㄧㄥˋ）
  '應用':'ㄧㄥˋ _','反應':'_ ㄧㄥˋ','對應':'_ ㄧㄥˋ','回應':'_ ㄧㄥˋ','答應':'_ ㄧㄥˋ','供應':'ㄍㄨㄥ ㄧㄥˋ',
  '適應':'_ ㄧㄥˋ','感應':'_ ㄧㄥˋ','效應':'_ ㄧㄥˋ','呼應':'_ ㄧㄥˋ','應變':'ㄧㄥˋ _','應付':'ㄧㄥˋ _',
  '應對':'ㄧㄥˋ _','應急':'ㄧㄥˋ _','應景':'ㄧㄥˋ _','應徵':'ㄧㄥˋ _','應邀':'ㄧㄥˋ _','應屆':'ㄧㄥˋ _',
  '有求必應':'_ _ _ ㄧㄥˋ','得心應手':'ㄉㄜˊ _ ㄧㄥˋ _','應有盡有':'ㄧㄥ _ _ _',
  // 13. 興（預設 ㄒㄧㄥ；覆寫 ㄒㄧㄥˋ）
  '高興':'_ ㄒㄧㄥˋ','興趣':'ㄒㄧㄥˋ _','雅興':'_ ㄒㄧㄥˋ','助興':'_ ㄒㄧㄥˋ','掃興':'_ ㄒㄧㄥˋ',
  '盡興':'_ ㄒㄧㄥˋ','即興':'_ ㄒㄧㄥˋ','興致':'ㄒㄧㄥˋ _','興味':'ㄒㄧㄥˋ _','乘興':'_ ㄒㄧㄥˋ',
  // 14. 背（預設 ㄅㄟˋ；覆寫 ㄅㄟ）
  '背著':'ㄅㄟ ˙ㄓㄜ','背書包':'ㄅㄟ _ _','背包':'ㄅㄟ _','背負':'ㄅㄟ _','背起':'ㄅㄟ _',
  // 15. 倒（預設 ㄉㄠˋ；覆寫 ㄉㄠˇ）
  '跌倒':'_ ㄉㄠˇ','倒下':'ㄉㄠˇ _','傾倒':'_ ㄉㄠˇ','不倒翁':'_ ㄉㄠˇ _','倒閉':'ㄉㄠˇ _',
  '打倒':'_ ㄉㄠˇ','昏倒':'_ ㄉㄠˇ','摔倒':'_ ㄉㄠˇ','滑倒':'_ ㄉㄠˇ','絆倒':'_ ㄉㄠˇ',
  '東倒西歪':'_ ㄉㄠˇ _ _','排山倒海':'_ _ ㄉㄠˇ _',
  // 16. 彈（預設 ㄉㄢˋ；覆寫 ㄊㄢˊ）
  '彈簧':'ㄊㄢˊ _','彈性':'ㄊㄢˊ _','彈力':'ㄊㄢˊ _','彈琴':'ㄊㄢˊ _','彈鋼琴':'ㄊㄢˊ _ _',
  '彈奏':'ㄊㄢˊ _','彈跳':'ㄊㄢˊ _','反彈':'_ ㄊㄢˊ','回彈':'_ ㄊㄢˊ','動彈不得':'_ ˙ㄊㄢ _ ˙ㄉㄜ',
  '彈吉他':'ㄊㄢˊ _ _','彈琵琶':'ㄊㄢˊ _ _','對牛彈琴':'_ _ ㄊㄢˊ _',
  // 17. 量（預設 ㄌㄧㄤˋ；覆寫 ㄌㄧㄤˊ）
  '測量':'_ ㄌㄧㄤˊ','量杯':'ㄌㄧㄤˊ _','量角器':'ㄌㄧㄤˊ ㄐㄧㄠˇ _','量體溫':'ㄌㄧㄤˊ _ _','量身高':'ㄌㄧㄤˊ _ _',
  '量一量':'ㄌㄧㄤˊ _ ㄌㄧㄤˊ','丈量':'_ ㄌㄧㄤˊ','估量':'_ ㄌㄧㄤˊ','不可限量':'_ _ _ ㄌㄧㄤˊ','商量':'_ ˙ㄌㄧㄤ',
  // 18. 分（預設 ㄈㄣ；覆寫 ㄈㄣˋ）
  '水分':'_ ㄈㄣˋ','養分':'_ ㄈㄣˋ','部分':'_ ㄈㄣˋ','成分':'_ ㄈㄣˋ','身分':'_ ㄈㄣˋ',
  '鹽分':'_ ㄈㄣˋ','糖分':'_ ㄈㄣˋ','本分':'_ ㄈㄣˋ','過分':'_ ㄈㄣˋ','處分':'ㄔㄨˇ ㄈㄣˋ',
  '緣分':'_ ㄈㄣˋ','名分':'_ ㄈㄣˋ','天分':'_ ㄈㄣˋ','輩分':'_ ㄈㄣˋ','分量':'ㄈㄣˋ ㄌㄧㄤˋ','分外':'ㄈㄣˋ _',
  // 19. 種（預設 ㄓㄨㄥˇ；覆寫 ㄓㄨㄥˋ）
  '種植':'ㄓㄨㄥˋ _','種花':'ㄓㄨㄥˋ _','種樹':'ㄓㄨㄥˋ _','種菜':'ㄓㄨㄥˋ _','種田':'ㄓㄨㄥˋ _',
  '種在':'ㄓㄨㄥˋ _','栽種':'_ ㄓㄨㄥˋ','耕種':'_ ㄓㄨㄥˋ','播種':'_ ㄓㄨㄥˇ','接種':'_ ㄓㄨㄥˋ',
  // 20. 空（預設 ㄎㄨㄥ；覆寫 ㄎㄨㄥˋ）
  '空格':'ㄎㄨㄥˋ _','填空':'_ ㄎㄨㄥˋ','空白':'ㄎㄨㄥˋ _','空隙':'ㄎㄨㄥˋ _','空位':'ㄎㄨㄥˋ _',
  '空閒':'ㄎㄨㄥˋ _','有空':'_ ㄎㄨㄥˋ','沒空':'ㄇㄟˊ ㄎㄨㄥˋ','抽空':'_ ㄎㄨㄥˋ','空缺':'ㄎㄨㄥˋ _','空出':'ㄎㄨㄥˋ _',
  // 21. 假（預設 ㄐㄧㄚˇ；覆寫 ㄐㄧㄚˋ）
  '放假':'_ ㄐㄧㄚˋ','暑假':'_ ㄐㄧㄚˋ','寒假':'_ ㄐㄧㄚˋ','假日':'ㄐㄧㄚˋ _','假期':'ㄐㄧㄚˋ _',
  '請假':'_ ㄐㄧㄚˋ','休假':'_ ㄐㄧㄚˋ','病假':'_ ㄐㄧㄚˋ','事假':'_ ㄐㄧㄚˋ','連假':'_ ㄐㄧㄚˋ',
  '例假':'_ ㄐㄧㄚˋ','年假':'_ ㄐㄧㄚˋ','公假':'_ ㄐㄧㄚˋ','度假':'_ ㄐㄧㄚˋ',
  // 22. 轉（預設 ㄓㄨㄢˇ；覆寫 ㄓㄨㄢˋ）
  '自轉':'_ ㄓㄨㄢˋ','公轉':'_ ㄓㄨㄢˋ','旋轉':'_ ㄓㄨㄢˋ','運轉':'_ ㄓㄨㄢˋ','打轉':'_ ㄓㄨㄢˋ',
  '回轉':'_ ㄓㄨㄢˋ','轉速':'ㄓㄨㄢˋ _','轉盤':'ㄓㄨㄢˋ _','天旋地轉':'_ _ ㄉㄧˋ ㄓㄨㄢˋ',
  // 23. 還（預設 ㄏㄞˊ；覆寫 ㄏㄨㄢˊ）
  '歸還':'_ ㄏㄨㄢˊ','還書':'ㄏㄨㄢˊ _','還錢':'ㄏㄨㄢˊ _','退還':'_ ㄏㄨㄢˊ','償還':'_ ㄏㄨㄢˊ',
  '返還':'_ ㄏㄨㄢˊ','還給':'ㄏㄨㄢˊ _','還原':'ㄏㄨㄢˊ _','生還':'_ ㄏㄨㄢˊ','往還':'_ ㄏㄨㄢˊ','以牙還牙':'_ _ ㄏㄨㄢˊ _',
  // 24. 調（預設 ㄊㄧㄠˊ；覆寫 ㄉㄧㄠˋ）
  '音調':'_ ㄉㄧㄠˋ','聲調':'_ ㄉㄧㄠˋ','語調':'_ ㄉㄧㄠˋ','曲調':'ㄑㄩˇ ㄉㄧㄠˋ','強調':'ㄑㄧㄤˊ ㄉㄧㄠˋ',
  '步調':'_ ㄉㄧㄠˋ','格調':'_ ㄉㄧㄠˋ','單調':'_ ㄉㄧㄠˋ','基調':'_ ㄉㄧㄠˋ','空調':'ㄎㄨㄥ ㄉㄧㄠˋ',
  '調動':'ㄉㄧㄠˋ _','調查':'ㄉㄧㄠˋ _','調職':'ㄉㄧㄠˋ _','調閱':'ㄉㄧㄠˋ _','調度':'ㄉㄧㄠˋ _','才調':'_ ㄉㄧㄠˋ',
  // 25. 少（預設 ㄕㄠˇ；覆寫 ㄕㄠˋ）
  '少年':'ㄕㄠˋ _','少女':'ㄕㄠˋ _','青少年':'_ ㄕㄠˋ _','少男':'ㄕㄠˋ _','年少':'_ ㄕㄠˋ',
  '少爺':'ㄕㄠˋ _','老少咸宜':'_ ㄕㄠˋ _ _','男女老少':'_ _ _ ㄕㄠˋ',
  // 26. 切（預設 ㄑㄧㄝ；覆寫 ㄑㄧㄝˋ）
  '親切':'_ ㄑㄧㄝˋ','密切':'_ ㄑㄧㄝˋ','迫切':'_ ㄑㄧㄝˋ','一切':'_ ㄑㄧㄝˋ','確切':'_ ㄑㄧㄝˋ',
  '切實':'ㄑㄧㄝˋ _','急切':'_ ㄑㄧㄝˋ','懇切':'_ ㄑㄧㄝˋ','熱切':'_ ㄑㄧㄝˋ','關切':'_ ㄑㄧㄝˋ',
  '切記':'ㄑㄧㄝˋ _','切勿':'ㄑㄧㄝˋ _','切身':'ㄑㄧㄝˋ _','切合':'ㄑㄧㄝˋ _','不切實際':'_ ㄑㄧㄝˋ _ _','咬牙切齒':'_ _ ㄑㄧㄝˋ _',
  // 27. 更（預設 ㄍㄥˋ；覆寫 ㄍㄥ）
  '更換':'ㄍㄥ _','更新':'ㄍㄥ _','更改':'ㄍㄥ _','變更':'_ ㄍㄥ','更動':'ㄍㄥ _',
  '更正':'ㄍㄥ _','更衣':'ㄍㄥ _','三更半夜':'_ ㄍㄥ _ _','自力更生':'_ _ ㄍㄥ _','萬象更新':'_ _ ㄍㄥ _',
  // 28. 處（預設 ㄔㄨˇ；名詞覆寫 ㄔㄨˋ）
  '到處':'_ ㄔㄨˋ','好處':'ㄏㄠˇ ㄔㄨˋ','長處':'ㄔㄤˊ ㄔㄨˋ','短處':'_ ㄔㄨˋ','高處':'_ ㄔㄨˋ',
  '低處':'_ ㄔㄨˋ','遠處':'_ ㄔㄨˋ','近處':'_ ㄔㄨˋ','彎曲處':'_ ㄑㄩ ㄔㄨˋ','住處':'_ ㄔㄨˋ',
  '處所':'ㄔㄨˋ _','四處':'_ ㄔㄨˋ','各處':'_ ㄔㄨˋ','益處':'_ ㄔㄨˋ','害處':'_ ㄔㄨˋ','深處':'_ ㄔㄨˋ',
  // 29. 盛（預設 ㄔㄥˊ；覆寫 ㄕㄥˋ）
  '茂盛':'_ ㄕㄥˋ','盛開':'ㄕㄥˋ _','豐盛':'_ ㄕㄥˋ','盛行':'ㄕㄥˋ ㄒㄧㄥˊ','盛大':'ㄕㄥˋ _',
  '興盛':'ㄒㄧㄥ ㄕㄥˋ','全盛':'_ ㄕㄥˋ','盛夏':'ㄕㄥˋ _','盛況':'ㄕㄥˋ _','盛情':'ㄕㄥˋ _','盛產':'ㄕㄥˋ _','共襄盛舉':'_ _ ㄕㄥˋ _',
  // 30. 相（預設 ㄒㄧㄤˋ；覆寫 ㄒㄧㄤ）
  '相同':'ㄒㄧㄤ _','相反':'ㄒㄧㄤ _','相等':'ㄒㄧㄤ _','相吸':'ㄒㄧㄤ _','相斥':'ㄒㄧㄤ _',
  '相差':'ㄒㄧㄤ ㄔㄚ','相距':'ㄒㄧㄤ _','相當':'ㄒㄧㄤ ㄉㄤ','互相':'_ ㄒㄧㄤ','相處':'ㄒㄧㄤ ㄔㄨˇ',
  '相鄰':'ㄒㄧㄤ _','相交':'ㄒㄧㄤ _','相連':'ㄒㄧㄤ _','相乘':'ㄒㄧㄤ _','相加':'ㄒㄧㄤ _',
  '相逢':'ㄒㄧㄤ _','相聚':'ㄒㄧㄤ _','相約':'ㄒㄧㄤ _','相信':'ㄒㄧㄤ _','相親相愛':'ㄒㄧㄤ _ ㄒㄧㄤ _',
  '守望相助':'_ _ ㄒㄧㄤ _','相依為命':'ㄒㄧㄤ _ ㄨㄟˊ _','不相上下':'_ ㄒㄧㄤ _ _',
  // 31. 曲、沒、中、傳、便、當、難、漂、朝、散、奇、省、薄、間、降、鮮
  '彎曲':'_ ㄑㄩ','曲線':'ㄑㄩ _','曲折':'ㄑㄩ ㄓㄜˊ','扭曲':'_ ㄑㄩ',
  '淹沒':'_ ㄇㄛˋ','沉沒':'_ ㄇㄛˋ','出沒':'_ ㄇㄛˋ','沒收':'ㄇㄛˋ _','沒落':'ㄇㄛˋ ㄌㄨㄛˋ','埋沒':'_ ㄇㄛˋ','神出鬼沒':'_ _ _ ㄇㄛˋ',
  '中獎':'ㄓㄨㄥˋ _','命中':'_ ㄓㄨㄥˋ','百發百中':'_ ㄈㄚ _ ㄓㄨㄥˋ','中暑':'ㄓㄨㄥˋ _','中毒':'ㄓㄨㄥˋ _','中意':'ㄓㄨㄥˋ _','猜中':'_ ㄓㄨㄥˋ',
  '自傳':'_ ㄓㄨㄢˋ','傳記':'ㄓㄨㄢˋ _','外傳':'_ ㄓㄨㄢˋ','列傳':'_ ㄓㄨㄢˋ',
  '便宜':'ㄆㄧㄢˊ _','大腹便便':'_ _ ㄆㄧㄢˊ ㄆㄧㄢˊ',
  '便當':'ㄅㄧㄢˋ ㄉㄤˋ','上當':'_ ㄉㄤˋ','適當':'_ ㄉㄤˋ','恰當':'_ ㄉㄤˋ','妥當':'_ ㄉㄤˋ','穩當':'_ ㄉㄤˋ',
  '避難':'_ ㄋㄢˋ','災難':'_ ㄋㄢˋ','苦難':'_ ㄋㄢˋ','患難':'_ ㄋㄢˋ','難民':'ㄋㄢˋ _','遇難':'_ ㄋㄢˋ','大難臨頭':'_ ㄋㄢˋ _ _',
  '漂浮':'ㄆㄧㄠ _','漂流':'ㄆㄧㄠ _','漂泊':'ㄆㄧㄠ _','漂白':'ㄆㄧㄠˇ _',
  '朝氣':'ㄓㄠ _','朝陽':'ㄓㄠ _','朝夕':'ㄓㄠ _','今朝':'_ ㄓㄠ','有朝一日':'_ ㄓㄠ _ _',
  '散文':'ㄙㄢˇ _','鬆散':'_ ㄙㄢˇ','散漫':'ㄙㄢˇ _','零散':'_ ㄙㄢˇ',
  '奇數':'ㄐㄧ ㄕㄨˋ','奇偶':'ㄐㄧ _',
  '反省':'_ ㄒㄧㄥˇ','省思':'ㄒㄧㄥˇ _','不省人事':'_ ㄒㄧㄥˇ _ _',
  '薄紙':'ㄅㄠˊ _','薄片':'ㄅㄠˊ _','薄餅':'ㄅㄠˊ _','厚薄':'_ ㄅㄠˊ','薄荷':'ㄅㄛˋ _',
  '間隔':'ㄐㄧㄢˋ _','間斷':'ㄐㄧㄢˋ _','相間':'ㄒㄧㄤ ㄐㄧㄢˋ','離間':'_ ㄐㄧㄢˋ',
  '投降':'_ ㄒㄧㄤˊ','降伏':'ㄒㄧㄤˊ _',
  '鮮少':'ㄒㄧㄢˇ _','屢見不鮮':'_ _ _ ㄒㄧㄢˇ'
};
const POLY_PHRASE_MAP = new Map();
for(const [w, zStr] of Object.entries(POLY_PHRASE_RAW)){
  POLY_PHRASE_MAP.set(w, zStr.split(' '));
}

// 依詞語脈絡解析整段文字之正確注音（最長詞優先匹配 4→3→2 字，再處理「了/著/得」語境）
function resolveTextZhuyin(str){
  const chars=[...String(str)];
  const n=chars.length;
  const out=new Array(n);
  let i=0;
  while(i<n){
    let matched=false;
    for(let len=Math.min(4,n-i);len>=2;len--){
      const sub=chars.slice(i,i+len).join('');
      const ov=POLY_PHRASE_MAP.get(sub);
      if(ov){
        for(let k=0;k<len;k++){
          const c=chars[i+k];
          const z=(ov[k]&&ov[k]!=='_')?ov[k]:(window.ZY_DATA&&ZY_DATA[c]||'');
          out[i+k]={ch:c, zy:z};
        }
        i+=len; matched=true; break;
      }
    }
    if(!matched){
      const c=chars[i];
      out[i]={ch:c, zy:(window.ZY_DATA&&ZY_DATA[c]||'')};
      i++;
    }
  }
  return out;
}
window.resolveTextZhuyin = resolveTextZhuyin;

// ===== 0b. 隱藏式格子系統（直書 gcell 與橫書 hcell）=====
function zhFormat(html){
  return String(html).split(/(<[^>]+>)/g).map(tok=>
    tok.startsWith('<') ? tok : tok
      .replace(/……/g,'…')
      .replace(/[「」『』（）()【】〔〕《》〈〉…—]/g,m=>VPUNC_MAP[m]||m)
      .replace(/[→↓]/g,'<span class="v-arrow">↓</span>')
      .replace(/(\d+)\.|\d+/g,(m,dDot)=>dDot?`<span class="tcy">${dDot}</span>．`:`<span class="tcy">${m}</span>`)
  ).join('');
}

// 橫書單格：國字＋右側注音（viewBox 40x28）
function hCellHan(ch,zy){
  const dot=zy.startsWith('˙'), tone=/[ˊˇˋ]$/.test(zy)?zy.slice(-1):'';
  const ph=zy.replace(/^˙/,'').replace(/[ˊˇˋ]$/,'').split('');
  const ys=ph.length===1?[14.5]:(ph.length===2?[9.5,19.5]:[7.5,14.5,21.5]);
  const fs=ph.length===1?10.5:(ph.length===2?9.2:7.8);
  if(dot)ys.forEach((_,i)=>{ys[i]+=2;});
  const chEl=`<text x="11.5" y="14.5" dominant-baseline="central" text-anchor="middle" font-size="21" font-family="BiauKai,DFKai-SB,標楷體,Kaiti TC,serif" fill="#111">${esc(ch)}</text>`;
  const phEls=ph.map((p,i)=>`<text x="28" y="${ys[i]}" dominant-baseline="central" text-anchor="middle" font-size="${fs}" font-family="Noto Sans TC,PingFang TC,sans-serif" font-weight="600" fill="#222">${esc(p)}</text>`).join('');
  const dotEl=dot?`<text x="28" y="3.5" dominant-baseline="central" text-anchor="middle" font-size="8.5" font-weight="bold" fill="#222">˙</text>`:'';
  const toneEl=tone?`<text x="36" y="${ys[ph.length-1]}" dominant-baseline="central" text-anchor="middle" font-size="10" font-weight="bold" fill="#222">${esc(tone)}</text>`:'';
  return `<svg class="hcell-han" viewBox="0 0 40 28" xmlns="http://www.w3.org/2000/svg">${chEl}${dotEl}${phEls}${toneEl}</svg>`;
}
function hCellZy(zy){
  const dot=zy.startsWith('˙'), tone=/[ˊˇˋ]$/.test(zy)?zy.slice(-1):'';
  const ph=zy.replace(/^˙/,'').replace(/[ˊˇˋ]$/,'').split('');
  if(!ph.length)return esc(zy);
  const ys=ph.length===1?[14.5]:(ph.length===2?[9.5,19.5]:[7.5,14.5,21.5]);
  const fs=ph.length===1?13:(ph.length===2?11:9.2);
  if(dot)ys.forEach((_,i)=>{ys[i]+=2;});
  const phEls=ph.map((p,i)=>`<text x="10" y="${ys[i]}" dominant-baseline="central" text-anchor="middle" font-size="${fs}" font-family="Noto Sans TC,PingFang TC,sans-serif" font-weight="600" fill="#111">${esc(p)}</text>`).join('');
  const dotEl=dot?`<text x="10" y="3.5" dominant-baseline="central" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#111">˙</text>`:'';
  const toneEl=tone?`<text x="20" y="${ys[ph.length-1]}" dominant-baseline="central" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#111">${esc(tone)}</text>`:'';
  return `<svg class="hcell-zy" viewBox="0 0 26 28" xmlns="http://www.w3.org/2000/svg">${dotEl}${phEls}${toneEl}</svg>`;
}

// 橫書 HTML 轉換（結合破音字詞庫覆寫，且絕不使用 inline-flex 包裹長字串）
function rubyHtml(str){
  const useZy=$('exRuby')&&$('exRuby').checked&&window.ZY_DATA;
  // 先將作答括號統一為標準加寬隱藏式空格盒（適合小學生較大字跡）
  const norm=String(str).replace(/[（(][\s　]*[）)]/g,'@@BLANK@@');
  const parts=norm.split(/(@@BLANK@@|→|[A-Za-z](?:[ ]*_+[ ]*[A-Za-z_]*)+|[˙]?[ㄅ-ㄩ]{1,3}[ˊˇˋ]?|[A-Za-z0-9]+(?:[./:+\-×÷=><％%][A-Za-z0-9]+)*)/g);
  return parts.map(part=>{
    if(!part)return '';
    if(part==='@@BLANK@@')return `<span class="h-blank">（　　　）</span>`;
    if(part==='→')return `<span class="q-arrow">→</span>`;
    if(/^[A-Za-z](?:[ ]*_+[ ]*[A-Za-z_]*)+$/.test(part))return `<span class="eng-clue">${esc(part)}</span>`;
    if(/^[˙]?[ㄅ-ㄩ]{1,3}[ˊˇˋ]?$/.test(part))return hCellZy(part);
    if(useZy && /^[A-Za-z0-9]/.test(part)) return `<span class="h-num">${esc(part)}</span>`;
    if(!useZy)return esc(part).replace(/\n/g,'<br>');
    const resolved=resolveTextZhuyin(part);
    let out='';
    for(const {ch,zy} of resolved){
      if(ch==='\n'){out+='<br>';continue;}
      out+=zy?hCellHan(ch,zy):esc(ch);
    }
    return out;
  }).join('');
}

// 直書國語專用：隱藏式等寬格子（所有格子統一 viewBox 寬 42；有注音時主軸 x=14、注音軸 x=30；無注音時全部置中 x=21）
const VPUNC_MAP={'「':'﹁','」':'﹂','『':'﹃','』':'﹄','（':'︵','）':'︶','(':'︵',')':'︶','【':'︻','】':'︼','〔':'︹','〕':'︺','《':'︽','》':'︾','〈':'︿','〉':'﹀','…':'⋮','—':'︱','→':'↓','；':'；','：':'：','，':'，','。':'。','、':'、','？':'？','！':'！','／':'／'};
const toVertPunc=s=>String(s).replace(/……/g,'…').replace(/[「」『』（）()【】〔〕《》〈〉…—→]/g,m=>VPUNC_MAP[m]||m);
function gCellHan(ch,zy,mainX=14){
  const x = zy ? 14 : mainX;
  const dot=zy&&zy.startsWith('˙'), tone=zy&&/[ˊˇˋ]$/.test(zy)?zy.slice(-1):'';
  const ph=zy?zy.replace(/^˙/,'').replace(/[ˊˇˋ]$/,'').split(''):[];
  const ys=ph.length===1?[14]:(ph.length===2?[9,19]:[7,14,21]);
  const fs=ph.length===1?10.5:(ph.length===2?9.2:7.8);
  if(dot)ys.forEach((_,i)=>{ys[i]+=2;});
  const chEl=`<text x="${x}" y="14" dominant-baseline="central" text-anchor="middle" font-size="21.5" font-family="BiauKai,DFKai-SB,標楷體,Kaiti TC,serif" fill="#111">${esc(ch)}</text>`;
  const phEls=ph.map((p,i)=>`<text x="30" y="${ys[i]}" dominant-baseline="central" text-anchor="middle" font-size="${fs}" font-family="Noto Sans TC,PingFang TC,sans-serif" font-weight="600" fill="#222">${esc(p)}</text>`).join('');
  const dotEl=dot?`<text x="30" y="3.5" dominant-baseline="central" text-anchor="middle" font-size="8.5" font-weight="bold" fill="#222">˙</text>`:'';
  const toneEl=tone?`<text x="38" y="${ys[ph.length-1]}" dominant-baseline="central" text-anchor="middle" font-size="10" font-weight="bold" fill="#222">${esc(tone)}</text>`:'';
  return {h:28, svg:`<svg class="gcell g-han" viewBox="0 0 42 28" xmlns="http://www.w3.org/2000/svg">${chEl}${dotEl}${phEls}${toneEl}</svg>`};
}
function gCellZy(zy,mainX=14){
  const dot=zy.startsWith('˙'), tone=/[ˊˇˋ]$/.test(zy)?zy.slice(-1):'';
  const ph=zy.replace(/^˙/,'').replace(/[ˊˇˋ]$/,'').split('');
  const ys=ph.length===1?[16]:(ph.length===2?[10.5,21.5]:[8,16,24]);
  const fs=ph.length===1?14:(ph.length===2?12:10);
  if(dot)ys.forEach((_,i)=>{ys[i]+=2.2;});
  const phEls=ph.map((p,i)=>`<text x="${mainX}" y="${ys[i]}" dominant-baseline="central" text-anchor="middle" font-size="${fs}" font-family="Noto Sans TC,PingFang TC,sans-serif" font-weight="600" fill="#111">${esc(p)}</text>`).join('');
  const dotEl=dot?`<text x="${mainX}" y="4" dominant-baseline="central" text-anchor="middle" font-size="10" font-weight="bold" fill="#111">˙</text>`:'';
  const toneEl=tone?`<text x="${mainX+12}" y="${ys[ph.length-1]}" dominant-baseline="central" text-anchor="middle" font-size="12" font-weight="bold" fill="#111">${esc(tone)}</text>`:'';
  return {h:32, svg:`<svg class="gcell g-zy" viewBox="0 0 42 32" xmlns="http://www.w3.org/2000/svg">${dotEl}${phEls}${toneEl}</svg>`};
}
function gCellPunc(p,mainX=14){
  const vp=VPUNC_MAP[p]||p;
  const isClosePunc=/^[」』）)】〕》〉。，、；：？！…]$/.test(p);
  // 向量幾何精準對齊直書主軸 x=mainX（完全不受 Mac / Windows 字體偏左下或引號位移影響）
  let inner='';
  if(p==='。'){
    inner=`<circle cx="${mainX}" cy="11" r="2.7" fill="none" stroke="#111" stroke-width="1.5"/>`;
  }else if(p==='、'){
    inner=`<path d="M${mainX-2.2},7.5 Q${mainX+1.8},10.5 ${mainX+2.4},14.2" fill="none" stroke="#111" stroke-width="2.1" stroke-linecap="round"/>`;
  }else if(p==='，'){
    inner=`<circle cx="${mainX+0.4}" cy="8.5" r="1.8" fill="#111"/><path d="M${mainX+1.6},8.8 Q${mainX+1.2},13.2 ${mainX-1.6},15.2" fill="none" stroke="#111" stroke-width="1.5" stroke-linecap="round"/>`;
  }else if(p==='：'){
    inner=`<circle cx="${mainX}" cy="7.5" r="1.55" fill="#111"/><circle cx="${mainX}" cy="14.5" r="1.55" fill="#111"/>`;
  }else if(p==='；'){
    inner=`<circle cx="${mainX}" cy="7" r="1.5" fill="#111"/><circle cx="${mainX+0.3}" cy="12.8" r="1.5" fill="#111"/><path d="M${mainX+1.2},13 Q${mainX+0.8},16.2 ${mainX-1.4},17.5" fill="none" stroke="#111" stroke-width="1.35" stroke-linecap="round"/>`;
  }else if(p==='！'||p==='!'){
    inner=`<line x1="${mainX}" y1="3.5" x2="${mainX}" y2="12.8" stroke="#111" stroke-width="2" stroke-linecap="round"/><circle cx="${mainX}" cy="17.2" r="1.45" fill="#111"/>`;
  }else if(p==='？'||p==='?'){
    inner=`<path d="M${mainX-4},7.2 C${mainX-4},3.2 ${mainX+4.2},3.2 ${mainX+4.2},7.2 C${mainX+4.2},9.6 ${mainX},10.5 ${mainX},13.2" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round"/><circle cx="${mainX}" cy="17.4" r="1.4" fill="#111"/>`;
  }else if(p==='（'||p==='('){
    inner=`<path d="M${mainX-7},13.5 Q${mainX},4.5 ${mainX+7},13.5" fill="none" stroke="#111" stroke-width="1.65" stroke-linecap="round"/>`;
  }else if(p==='）'||p===')'){
    inner=`<path d="M${mainX-7},8.5 Q${mainX},17.5 ${mainX+7},8.5" fill="none" stroke="#111" stroke-width="1.65" stroke-linecap="round"/>`;
  }else if(p==='「'){
    inner=`<path d="M${mainX-6.5},7.5 H${mainX+6.5} V16.5" fill="none" stroke="#111" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"/>`;
  }else if(p==='」'){
    inner=`<path d="M${mainX-6.5},5.5 V14.5 H${mainX+6.5}" fill="none" stroke="#111" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"/>`;
  }else if(p==='『'){
    inner=`<path d="M${mainX-7},6 H${mainX+7} V17 H${mainX+3.5} V9.5 H${mainX-7} Z" fill="none" stroke="#111" stroke-width="1.3" stroke-linejoin="miter"/>`;
  }else if(p==='』'){
    inner=`<path d="M${mainX-7},5 V16 H${mainX+7} V12.5 H${mainX-3.5} V5 Z" fill="none" stroke="#111" stroke-width="1.3" stroke-linejoin="miter"/>`;
  }else if(p==='…'){
    inner=`<circle cx="${mainX}" cy="4.8" r="1.35" fill="#111"/><circle cx="${mainX}" cy="11" r="1.35" fill="#111"/><circle cx="${mainX}" cy="17.2" r="1.35" fill="#111"/>`;
  }else if(p==='—'){
    inner=`<line x1="${mainX}" y1="2.5" x2="${mainX}" y2="19.5" stroke="#111" stroke-width="1.7" stroke-linecap="round"/>`;
  }else if(p==='→'||p==='↓'){
    inner=`<line x1="${mainX}" y1="3.2" x2="${mainX}" y2="17.8" stroke="#111" stroke-width="1.8" stroke-linecap="round"/><polyline points="${mainX-3.8},14 ${mainX},18.2 ${mainX+3.8},14" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  }else{
    inner=`<text x="${mainX}" y="11" dominant-baseline="central" text-anchor="middle" font-size="18" font-family="Noto Sans TC,PingFang TC,Microsoft JhengHei,sans-serif" fill="#111">${esc(vp)}</text>`;
  }
  return {h:22, isClosePunc, svg:`<svg class="gcell g-punc" viewBox="0 0 42 22" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`};
}
function gCellBlank(h=64,mainX=14){
  return {h, isBlank:true, svg:`<svg class="gcell g-blank" style="height:${(h/22).toFixed(2)}em" viewBox="0 0 42 ${h}" xmlns="http://www.w3.org/2000/svg"><path d="M${mainX-7.2},10.5 Q${mainX},2.5 ${mainX+7.2},10.5" fill="none" stroke="#111" stroke-width="1.65" stroke-linecap="round"/><path d="M${mainX-7.2},${h-10.5} Q${mainX},${h-2.5} ${mainX+7.2},${h-10.5}" fill="none" stroke="#111" stroke-width="1.65" stroke-linecap="round"/></svg>`};
}
function gCellLabel(txt,bold=false,color='#111',fs=15,mainX=14){
  const s = String(txt);
  const dotNum = s.match(/^(\d+)\.$/);
  if(dotNum){
    const dStr = dotNum[1];
    const effFs = dStr.length >= 2 ? Math.min(fs, 13.5) : Math.max(fs, 15.5);
    const dotX = mainX + (dStr.length >= 2 ? 9.5 : 6.2);
    return {h:22, svg:`<svg class="gcell g-punc" viewBox="0 0 42 22" xmlns="http://www.w3.org/2000/svg"><text x="${mainX}" y="11" dominant-baseline="central" text-anchor="middle" font-size="${effFs}" font-weight="${bold?'700':'600'}" font-family="Noto Sans TC,PingFang TC,Microsoft JhengHei,sans-serif" fill="${color}">${esc(dStr)}</text><circle cx="${dotX}" cy="16.2" r="1.25" fill="${color}"/></svg>`};
  }
  const len = s.length;
  const effFs = len >= 4 ? Math.min(fs, 10.8) : (len === 3 ? Math.min(fs, 12.2) : (len === 2 ? Math.min(fs, 14) : Math.max(fs, 15.5)));
  return {h:22, svg:`<svg class="gcell g-punc" viewBox="0 0 42 22" xmlns="http://www.w3.org/2000/svg"><text x="${mainX}" y="11" dominant-baseline="central" text-anchor="middle" font-size="${effFs}" font-weight="${bold?'700':'600'}" font-family="Noto Sans TC,PingFang TC,Microsoft JhengHei,sans-serif" fill="${color}">${esc(s)}</text></svg>`};
}
function gCellScore(pts,mainX=14){
  // 垂直堆疊置中配分標籤（緊黏前字，絕不獨立跳至次欄）
  return {h:46, isScore:true, svg:`<svg class="gcell" style="height:2.09em" viewBox="0 0 42 46" xmlns="http://www.w3.org/2000/svg">
    <path d="M${mainX-5.8},8.5 Q${mainX},3 ${mainX+5.8},8.5" fill="none" stroke="#555" stroke-width="1.35" stroke-linecap="round"/>
    <text x="${mainX}" y="19" dominant-baseline="central" text-anchor="middle" font-size="12.5" font-weight="700" font-family="Noto Sans TC,sans-serif" fill="#444">${esc(pts)}</text>
    <text x="${mainX}" y="31" dominant-baseline="central" text-anchor="middle" font-size="12" font-family="BiauKai,DFKai-SB,標楷體,serif" fill="#444">分</text>
    <path d="M${mainX-5.8},39 Q${mainX},44.5 ${mainX+5.8},39" fill="none" stroke="#555" stroke-width="1.35" stroke-linecap="round"/>
  </svg>`};
}
function gCellSpace(h=22){
  return {h, svg:`<svg class="gcell" style="height:${(h/22).toFixed(2)}em" viewBox="0 0 42 ${h}" xmlns="http://www.w3.org/2000/svg"></svg>`};
}
function tokenizeZhCells(str, useZy, mainX=14){
  const cells=[];
  const norm=String(str).replace(/……/g,'…').replace(/[（(][\s　]*[）)]/g,'@@BLANK@@');
  const re=/(@@BLANK@@|[˙]?[ㄅ-ㄩ]{1,3}[ˊˇˋ]?|\d+\.|\d+|\n|[^\d\n@ㄅ-ㄩ˙ˊˇˋ]+)/g;
  let m;
  while((m=re.exec(norm))!==null){
    const tk=m[0];
    if(tk==='\n'){cells.push({newline:true});continue;}
    if(tk==='@@BLANK@@'){cells.push(gCellBlank(64,mainX));continue;}
    if(/^[˙]?[ㄅ-ㄩ]{1,3}[ˊˇˋ]?$/.test(tk)){cells.push(gCellZy(tk,mainX));continue;}
    if(/^\d+\.?$/.test(tk)){cells.push(gCellLabel(tk,true,'#111',14.5,mainX));continue;}
    // 一般國字與標點片段：透過破音字詞庫覆寫解析
    const resolved=resolveTextZhuyin(tk);
    for(const {ch,zy} of resolved){
      if(ch===' '||ch==='　')continue;
      if(zy){cells.push(gCellHan(ch,useZy?zy:'',mainX));}
      else{cells.push(gCellPunc(ch,mainX));}
    }
  }
  return cells;
}

// ===== 1a. 翰林版風格 SVG 圖解產生器 =====
function svgSplitBox(top,l,r){
  return `<svg width="110" height="54" viewBox="0 0 110 54" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="108" height="26" fill="#fff" stroke="#333" stroke-width="1.5"/><rect x="1" y="27" width="54" height="26" fill="#fff" stroke="#333" stroke-width="1.5"/><rect x="55" y="27" width="54" height="26" fill="#fff" stroke="#333" stroke-width="1.5"/><text x="55" y="19" text-anchor="middle" font-size="14" font-weight="bold" fill="#111">${top}</text><text x="28" y="45" text-anchor="middle" font-size="14" fill="#111">${l}</text><text x="82" y="45" text-anchor="middle" font-size="14" fill="#111">${r}</text></svg>`;
}
function svgSeqTrain(nums,blankIdx){
  const w=nums.length*34+2;
  const cells=nums.map((n,i)=>`<rect x="${1+i*34}" y="1" width="34" height="28" fill="${i===blankIdx?'#fff8e6':'#fff'}" stroke="#333" stroke-width="1.5"/><text x="${18+i*34}" y="20" text-anchor="middle" font-size="14" font-weight="bold" fill="#111">${i===blankIdx?'':n}</text>`).join('');
  return `<svg width="${w}" height="30" viewBox="0 0 ${w} 30" xmlns="http://www.w3.org/2000/svg">${cells}</svg>`;
}
function svgClock(hr,min){
  const ha=((hr%12)+min/60)*30-90, ma=min*6-90;
  const hx=38+17*Math.cos(ha*Math.PI/180), hy=38+17*Math.sin(ha*Math.PI/180);
  const mx=38+25*Math.cos(ma*Math.PI/180), my=38+25*Math.sin(ma*Math.PI/180);
  const ticks=Array.from({length:12},(_,i)=>{
    const n=i===0?12:i, a=(i*30-90)*Math.PI/180;
    return `<text x="${(38+27*Math.cos(a)).toFixed(1)}" y="${(41.5+27*Math.sin(a)).toFixed(1)}" text-anchor="middle" font-size="${n%3===0?10.5:8.5}" font-weight="${n%3===0?'bold':'normal'}" fill="#111">${n}</text>`;
  }).join('');
  return `<svg width="76" height="76" viewBox="0 0 76 76" xmlns="http://www.w3.org/2000/svg"><circle cx="38" cy="38" r="35" fill="#fff" stroke="#222" stroke-width="1.8"/>${ticks}<line x1="38" y1="38" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="#111" stroke-width="3" stroke-linecap="round"/><line x1="38" y1="38" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="#d33" stroke-width="2" stroke-linecap="round"/><circle cx="38" cy="38" r="2.6" fill="#111"/></svg>`;
}
function svgRowCount(n){
  const w=n*22+20;
  const circles=Array.from({length:n},(_,i)=>`<circle cx="${18+i*22}" cy="14" r="8" fill="#ffe5b4" stroke="#333" stroke-width="1.2"/>`).join('');
  return `<svg width="${w}" height="38" viewBox="0 0 ${w} 38" xmlns="http://www.w3.org/2000/svg">${circles}<text x="10" y="34" font-size="10" fill="#555">左邊</text><text x="${w-28}" y="34" font-size="10" fill="#555">右邊</text></svg>`;
}
function svgFraction(num,den,num2=0){
  const bw=Math.min(28,Math.floor(180/den)), w=bw*den+4;
  const rects=Array.from({length:den},(_,i)=>{
    const fill=i<num?'#ffb366':(i<num+num2?'#90caf9':'#fff');
    return `<rect x="${2+i*bw}" y="2" width="${bw}" height="24" fill="${fill}" stroke="#222" stroke-width="1.4"/>`;
  }).join('');
  const lbl=num2>0?`${num}/${den} ＋ ${num2}/${den}（共 ${den} 等份）`:`平分成 ${den} 等份，塗色 ${num} 份`;
  return `<svg width="${Math.max(w,135)}" height="44" viewBox="0 0 ${Math.max(w,135)} 44" xmlns="http://www.w3.org/2000/svg">${rects}<text x="${Math.max(w,135)/2}" y="40" text-anchor="middle" font-size="11" font-weight="bold" fill="#222">${lbl}</text></svg>`;
}
function svgTriangle(b,h){
  return `<svg width="130" height="68" viewBox="0 0 130 68" xmlns="http://www.w3.org/2000/svg"><polygon points="15,54 115,54 45,10" fill="#fff8ec" stroke="#333" stroke-width="1.5"/><line x1="45" y1="10" x2="45" y2="54" stroke="#d33" stroke-width="1.2" stroke-dasharray="3,2"/><text x="65" y="65" text-anchor="middle" font-size="11" fill="#111">底 ${b} 公分</text><text x="50" y="36" font-size="11" fill="#d33">高 ${h}</text></svg>`;
}
function svgCircle(val,isDiam){
  return `<svg width="142" height="68" viewBox="0 0 142 68" xmlns="http://www.w3.org/2000/svg">
    <circle cx="34" cy="34" r="26" fill="#fff8ec" stroke="#222" stroke-width="1.6"/>
    <circle cx="34" cy="34" r="2.5" fill="#111"/>
    <line x1="${isDiam?8:34}" y1="34" x2="60" y2="34" stroke="#d33" stroke-width="2"/>
    <text x="68" y="38" font-size="11.5" font-weight="bold" fill="#d33">${isDiam?'直徑':'半徑'} ${val}cm</text>
  </svg>`;
}

function svgMagnet(l1,r1,l2,r2){
  return `<svg width="160" height="44" viewBox="0 0 160 44" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="10" width="28" height="22" fill="#ffcccc" stroke="#333"/><text x="20" y="25" text-anchor="middle" font-size="12" font-weight="bold">${l1}</text>
    <rect x="34" y="10" width="28" height="22" fill="#cce5ff" stroke="#333"/><text x="48" y="25" text-anchor="middle" font-size="12" font-weight="bold">${r1}</text>
    <text x="80" y="25" text-anchor="middle" font-size="13" fill="#d33">↔</text>
    <rect x="98" y="10" width="28" height="22" fill="#ffcccc" stroke="#333"/><text x="112" y="25" text-anchor="middle" font-size="12" font-weight="bold">${l2}</text>
    <rect x="126" y="10" width="28" height="22" fill="#cce5ff" stroke="#333"/><text x="140" y="25" text-anchor="middle" font-size="12" font-weight="bold">${r2}</text>
  </svg>`;
}
function svgLever(lDist,lW,rDist){
  return `<svg width="170" height="58" viewBox="0 0 170 58" xmlns="http://www.w3.org/2000/svg">
    <line x1="15" y1="26" x2="155" y2="26" stroke="#333" stroke-width="2.5"/>
    <polygon points="85,27 75,46 95,46" fill="#ffd999" stroke="#333" stroke-width="1.3"/>
    <rect x="20" y="8" width="26" height="16" fill="#cce5ff" stroke="#333"/><text x="33" y="20" text-anchor="middle" font-size="10">${lW}g</text>
    <rect x="128" y="8" width="26" height="16" fill="#ffe5b4" stroke="#333"/><text x="141" y="20" text-anchor="middle" font-size="10">? g</text>
    <text x="55" y="40" text-anchor="middle" font-size="10" fill="#d33">${lDist}cm</text>
    <text x="115" y="40" text-anchor="middle" font-size="10" fill="#d33">${rDist}cm</text>
  </svg>`;
}
function svgPreposition(pos){
  // pos: 'on' | 'in' | 'under'
  const ball=pos==='on'?'<circle cx="55" cy="14" r="8" fill="#ff7a1a" stroke="#333"/>':
             (pos==='in'?'<circle cx="55" cy="34" r="8" fill="#ff7a1a" stroke="#333"/>':
             '<circle cx="55" cy="52" r="8" fill="#ff7a1a" stroke="#333"/>');
  return `<svg width="110" height="64" viewBox="0 0 110 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="35" y="22" width="40" height="22" fill="${pos==='in'?'#fff8ec':'#ffe5b4'}" stroke="#333" stroke-width="1.5"/>
    ${ball}
  </svg>`;
}
function svgShapeRobot(){
  return `<svg width="110" height="82" viewBox="0 0 110 82" xmlns="http://www.w3.org/2000/svg">
    <circle cx="55" cy="14" r="10" fill="#fff8ec" stroke="#333" stroke-width="1.3"/>
    <rect x="37" y="26" width="36" height="28" fill="#ffe5b4" stroke="#333" stroke-width="1.3"/>
    <polygon points="37,26 23,46 37,46" fill="#cce5ff" stroke="#333" stroke-width="1.3"/>
    <polygon points="73,26 87,46 73,46" fill="#cce5ff" stroke="#333" stroke-width="1.3"/>
    <rect x="41" y="54" width="10" height="22" fill="#e2f0cb" stroke="#333" stroke-width="1.3"/>
    <rect x="59" y="54" width="10" height="22" fill="#e2f0cb" stroke="#333" stroke-width="1.3"/>
  </svg>`;
}
function svgBox3D(l,w,h){
  return `<svg width="120" height="68" viewBox="0 0 120 68" xmlns="http://www.w3.org/2000/svg">
    <polygon points="15,24 75,24 95,10 35,10" fill="#fff8ec" stroke="#333" stroke-width="1.3"/>
    <rect x="15" y="24" width="60" height="32" fill="#ffe5b4" stroke="#333" stroke-width="1.3"/>
    <polygon points="75,24 95,10 95,42 75,56" fill="#ffd28a" stroke="#333" stroke-width="1.3"/>
    <text x="45" y="66" text-anchor="middle" font-size="10">${l}cm</text>
    <text x="96" y="54" font-size="10">寬${w}</text>
    <text x="100" y="30" font-size="10">高${h}</text>
  </svg>`;
}


function svgShapeHouse(){
  return `<svg width="110" height="78" viewBox="0 0 110 78" xmlns="http://www.w3.org/2000/svg">
    <polygon points="55,6 18,34 92,34" fill="#ffd9b3" stroke="#333" stroke-width="1.3"/>
    <rect x="24" y="34" width="62" height="38" fill="#fff8ec" stroke="#333" stroke-width="1.3"/>
    <rect x="48" y="48" width="14" height="24" fill="#cce5ff" stroke="#333" stroke-width="1.3"/>
    <circle cx="36" cy="48" r="6" fill="#e2f0cb" stroke="#333" stroke-width="1.3"/>
    <circle cx="74" cy="48" r="6" fill="#e2f0cb" stroke="#333" stroke-width="1.3"/>
  </svg>`;
}
function svgRectDim(w,h,unit='公分'){
  return `<svg width="130" height="62" viewBox="0 0 130 62" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="8" width="76" height="38" fill="#fff8ec" stroke="#333" stroke-width="1.5"/>
    <text x="56" y="58" text-anchor="middle" font-size="10.5" fill="#111">長 ${w} ${unit}</text>
    <text x="98" y="30" font-size="10.5" fill="#d33">寬 ${h}</text>
  </svg>`;
}


function svgDice(n,x0){
  const pts={1:[[14,14]],2:[[8,8],[20,20]],3:[[7,7],[14,14],[21,21]],4:[[8,8],[20,8],[8,20],[20,20]],5:[[8,8],[20,8],[14,14],[8,20],[20,20]],6:[[8,7],[20,7],[8,14],[20,14],[8,21],[20,21]]}[n]||[[14,14]];
  return `<rect x="${x0}" y="2" width="28" height="28" rx="4" fill="#fff" stroke="#333" stroke-width="1.5"/>`+pts.map(([x,y])=>`<circle cx="${x0+x}" cy="${y+2}" r="2.6" fill="${n===1||n===4?'#d33':'#111'}"/>`).join('');
}
function svgDicePair(a,b){
  return `<svg width="86" height="32" viewBox="0 0 86 32" xmlns="http://www.w3.org/2000/svg">${svgDice(a,4)}<text x="43" y="21" text-anchor="middle" font-size="12" fill="#333">和</text>${svgDice(b,54)}</svg>`;
}
function svgBlockAdd(a,b){
  const draw=(n,xOff)=>Array.from({length:n},(_,i)=>`<rect x="${xOff+(i%5)*16}" y="${i>=5?20:4}" width="13" height="13" fill="#ffe5b4" stroke="#333" stroke-width="1.2"/>`).join('');
  return `<svg width="185" height="38" viewBox="0 0 185 38" xmlns="http://www.w3.org/2000/svg">${draw(a,4)}<text x="92" y="22" text-anchor="middle" font-size="14" font-weight="bold" fill="#d33">＋</text>${draw(b,102)}</svg>`;
}
function svgLengthCompare(order){
  const lens=[88,52,70];
  const rows=[0,1,2].map(i=>{
    const y=6+i*16, w=lens[order[i]];
    return `<text x="10" y="${y+9}" font-size="10.5" fill="#111">(${i+1})</text><rect x="30" y="${y+2}" width="${w}" height="7" fill="#ffd999" stroke="#333" stroke-width="1.2"/><polygon points="${30+w},${y+2} ${38+w},${y+5.5} ${30+w},${y+9}" fill="#333"/>`;
  }).join('');
  return `<svg width="145" height="54" viewBox="0 0 145 54" xmlns="http://www.w3.org/2000/svg">${rows}</svg>`;
}
function svgButterfly(top,l,r){
  return `<svg width="105" height="48" viewBox="0 0 105 48" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="30" cy="26" rx="22" ry="15" fill="#fff4e2" stroke="#333" stroke-width="1.3"/>
    <ellipse cx="75" cy="26" rx="22" ry="15" fill="#fff4e2" stroke="#333" stroke-width="1.3"/>
    <rect x="47" y="12" width="11" height="28" rx="5" fill="#d9b38c" stroke="#333"/>
    <text x="52.5" y="10" text-anchor="middle" font-size="11" font-weight="bold" fill="#d33">合起來 ${top}</text>
    <text x="28" y="30" text-anchor="middle" font-size="14" font-weight="bold" fill="#111">${l}</text>
    <text x="77" y="30" text-anchor="middle" font-size="14" font-weight="bold" fill="#111">${r}</text>
  </svg>`;
}
function svgLinesFour(){
  return `<svg width="190" height="42" viewBox="0 0 190 42" xmlns="http://www.w3.org/2000/svg">
    <text x="6" y="14" font-size="10">①</text><line x1="18" y1="8" x2="44" y2="28" stroke="#111" stroke-width="2"/>
    <text x="52" y="14" font-size="10">②</text><path d="M64,24 Q72,6 80,24 T96,24" fill="none" stroke="#111" stroke-width="2"/>
    <text x="104" y="14" font-size="10">③</text><line x1="116" y1="28" x2="142" y2="10" stroke="#111" stroke-width="2"/>
    <text x="150" y="14" font-size="10">④</text><path d="M162,12 C170,32 178,4 186,28" fill="none" stroke="#111" stroke-width="2"/>
  </svg>`;
}
function svgWeatherIcon(w){
  if(w==='sunny') return `<svg width="56" height="44" viewBox="0 0 56 44" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="22" r="11" fill="#ffc83d" stroke="#e67e22" stroke-width="1.5"/><g stroke="#e67e22" stroke-width="2"><line x1="28" y1="4" x2="28" y2="8"/><line x1="28" y1="36" x2="28" y2="40"/><line x1="10" y1="22" x2="14" y2="22"/><line x1="42" y1="22" x2="46" y2="22"/></g></svg>`;
  return `<svg width="64" height="46" viewBox="0 0 64 46" xmlns="http://www.w3.org/2000/svg"><path d="M16,28 a10,10 0 0,1 6,-18 a12,12 0 0,1 22,2 a8,8 0 0,1 4,16 z" fill="#dceefb" stroke="#333" stroke-width="1.3"/><line x1="22" y1="32" x2="19" y2="41" stroke="#2980b9" stroke-width="1.8"/><line x1="32" y1="32" x2="29" y2="41" stroke="#2980b9" stroke-width="1.8"/><line x1="42" y1="32" x2="39" y2="41" stroke="#2980b9" stroke-width="1.8"/></svg>`;
}
function svgShadowSun(mode='side'){
  if(mode==='noon'){
    return `<svg width="145" height="54" viewBox="0 0 145 54" xmlns="http://www.w3.org/2000/svg">
      <circle cx="72" cy="11" r="8.5" fill="#ffc83d" stroke="#e67e22" stroke-width="1.5"/>
      <text x="108" y="15" font-size="10.5" font-weight="bold" fill="#b35a00">正午太陽</text>
      <line x1="12" y1="46" x2="132" y2="46" stroke="#444" stroke-width="1.6"/>
      <circle cx="72" cy="26" r="5" fill="#fff" stroke="#222" stroke-width="1.5"/>
      <line x1="72" y1="31" x2="72" y2="46" stroke="#222" stroke-width="2.2"/>
      <ellipse cx="72" cy="46" rx="8" ry="2.5" fill="#777"/>
      <text x="36" y="42" font-size="10.5" font-weight="bold" fill="#333">影子最短</text>
    </svg>`;
  }
  return `<svg width="150" height="54" viewBox="0 0 150 54" xmlns="http://www.w3.org/2000/svg">
    <circle cx="122" cy="14" r="9" fill="#ffc83d" stroke="#e67e22" stroke-width="1.5"/>
    <text x="122" y="33" text-anchor="middle" font-size="10.5" font-weight="bold" fill="#b35a00">太陽</text>
    <line x1="10" y1="46" x2="140" y2="46" stroke="#444" stroke-width="1.6"/>
    <circle cx="76" cy="24" r="5" fill="#fff" stroke="#222" stroke-width="1.5"/>
    <line x1="76" y1="29" x2="76" y2="46" stroke="#222" stroke-width="2.2"/>
    <ellipse cx="44" cy="46" rx="22" ry="3.2" fill="#777"/>
    <text x="44" y="38" text-anchor="middle" font-size="11" font-weight="bold" fill="#222">影子（背光側）</text>
  </svg>`;
}
function svgMagnetAttract(){
  return `<svg width="165" height="48" viewBox="0 0 165 48" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="28" height="24" fill="#ffcccc" stroke="#222" stroke-width="1.4"/><text x="22" y="28" text-anchor="middle" font-size="12" font-weight="bold">N</text>
    <rect x="36" y="12" width="28" height="24" fill="#cce5ff" stroke="#222" stroke-width="1.4"/><text x="50" y="28" text-anchor="middle" font-size="12" font-weight="bold">S</text>
    <text x="76" y="27" text-anchor="middle" font-size="12" font-weight="bold" fill="#d33">吸引←</text>
    <rect x="94" y="15" width="26" height="18" rx="8" fill="none" stroke="#444" stroke-width="2"/>
    <text x="107" y="45" text-anchor="middle" font-size="10" font-weight="bold" fill="#111">鐵迴紋針</text>
    <rect x="132" y="14" width="24" height="20" fill="#f3d5b5" stroke="#333" stroke-width="1.2"/>
    <text x="144" y="28" text-anchor="middle" font-size="9.5" font-weight="bold">木塊</text>
  </svg>`;
}
function svgWaterGlasses(){
  return `<svg width="150" height="54" viewBox="0 0 150 54" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="14" width="28" height="26" fill="#bde0fe"/><rect x="20" y="8" width="28" height="32" fill="none" stroke="#222" stroke-width="1.5"/>
    <text x="34" y="51" text-anchor="middle" font-size="10.5" font-weight="bold">甲杯(水多)</text>
    <rect x="92" y="30" width="28" height="10" fill="#bde0fe"/><rect x="92" y="8" width="28" height="32" fill="none" stroke="#222" stroke-width="1.5"/>
    <text x="106" y="51" text-anchor="middle" font-size="10.5" font-weight="bold">乙杯(水少)</text>
  </svg>`;
}
function svgTrafficLight(){
  return `<svg width="135" height="44" viewBox="0 0 135 44" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="6" width="110" height="32" rx="10" fill="#333" stroke="#111" stroke-width="1.5"/>
    <circle cx="34" cy="22" r="10" fill="#ff4d4d" stroke="#fff" stroke-width="1.2"/><text x="34" y="26" text-anchor="middle" font-size="10" font-weight="bold" fill="#fff">紅</text>
    <circle cx="67" cy="22" r="10" fill="#ffd93d" stroke="#fff" stroke-width="1.2"/><text x="67" y="26" text-anchor="middle" font-size="10" font-weight="bold" fill="#111">黃</text>
    <circle cx="100" cy="22" r="10" fill="#2ecc71" stroke="#fff" stroke-width="1.2"/><text x="100" y="26" text-anchor="middle" font-size="10" font-weight="bold" fill="#fff">綠</text>
  </svg>`;
}
function svgMoonPhase(type='full'){
  return `<svg width="145" height="48" viewBox="0 0 145 48" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="22" r="14" fill="#333"/><path d="M28,8 A14,14 0 0,1 28,36 A9,14 0 0,0 28,8 Z" fill="#ffe066"/>
    <text x="28" y="46" text-anchor="middle" font-size="10" font-weight="bold">初三眉月</text>
    <circle cx="74" cy="22" r="14" fill="#333"/><path d="M74,8 A14,14 0 0,1 74,36 Z" fill="#ffe066"/>
    <text x="74" y="46" text-anchor="middle" font-size="10" font-weight="bold">初八上弦月</text>
    <circle cx="118" cy="22" r="14" fill="#ffe066" stroke="#333" stroke-width="1.2"/>
    <text x="118" y="46" text-anchor="middle" font-size="10" font-weight="bold">十五滿月</text>
  </svg>`;
}
function svgAirCup(){
  return `<svg width="135" height="54" viewBox="0 0 135 54" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="14" width="90" height="36" fill="#bde0fe" stroke="#222" stroke-width="1.5"/>
    <rect x="48" y="18" width="34" height="24" fill="#fff" stroke="#d33" stroke-width="1.6"/>
    <text x="65" y="33" text-anchor="middle" font-size="10.5" font-weight="bold" fill="#d33">空氣</text>
    <text x="108" y="11" text-anchor="middle" font-size="10" font-weight="bold" fill="#111">水箱</text>
  </svg>`;
}
function svgTaiwanTerrain(){
  return `<svg width="175" height="54" viewBox="0 0 175 54" xmlns="http://www.w3.org/2000/svg">
    <path d="M8,44 L36,44 L44,30 L68,30 L76,42 L98,42 L112,26 L132,34 L152,10 L168,44 Z" fill="#e9f5db" stroke="#2d6a4f" stroke-width="1.6"/>
    <text x="22" y="41" text-anchor="middle" font-size="9.5" font-weight="bold">平原</text>
    <text x="56" y="27" text-anchor="middle" font-size="9.5" font-weight="bold">台地</text>
    <text x="87" y="39" text-anchor="middle" font-size="9.5" font-weight="bold">盆地</text>
    <text x="118" y="23" text-anchor="middle" font-size="9.5" font-weight="bold">丘陵</text>
    <text x="152" y="9" text-anchor="middle" font-size="9.5" font-weight="bold">山地</text>
  </svg>`;
}


function svgAbacus(tens,ones){
  const beads=(n,x)=>Array.from({length:n},(_,i)=>`<ellipse cx="${x}" cy="${44-i*4.2}" rx="7" ry="2.2" fill="#ff9f43" stroke="#333" stroke-width="1"/>`).join('');
  return `<svg width="96" height="64" viewBox="0 0 96 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="46" width="80" height="15" fill="#fff3df" stroke="#333" stroke-width="1.3"/>
    <line x1="48" y1="46" x2="48" y2="61" stroke="#333" stroke-width="1.2"/>
    <line x1="28" y1="6" x2="28" y2="46" stroke="#555" stroke-width="2"/>
    <line x1="68" y1="6" x2="68" y2="46" stroke="#555" stroke-width="2"/>
    ${beads(tens,28)}${beads(ones,68)}
    <text x="28" y="57" text-anchor="middle" font-size="10" font-weight="bold">十位</text>
    <text x="68" y="57" text-anchor="middle" font-size="10" font-weight="bold">個位</text>
  </svg>`;
}
function svgCoins(n50,n10,n5,n1){
  let x=14, els='';
  const draw=(cnt,r,lbl,fill)=>{
    for(let i=0;i<cnt;i++){
      els+=`<circle cx="${x}" cy="18" r="${r}" fill="${fill}" stroke="#333" stroke-width="1.2"/><text x="${x}" y="22" text-anchor="middle" font-size="${r>10?10:8.5}" font-weight="bold" fill="#111">${lbl}</text>`;
      x+=r*2+5;
    }
  };
  draw(n50,12,'50','#ffd966'); draw(n10,10.5,'10','#f4cccc'); draw(n5,9,'5','#d9d9d9'); draw(n1,8,'1','#ead1dc');
  const w=Math.max(80,x+6);
  return `<svg width="${w}" height="36" viewBox="0 0 ${w} 36" xmlns="http://www.w3.org/2000/svg">${els}</svg>`;
}
function svgRulerMeasure(s,e){
  const ticks=Array.from({length:11},(_,i)=>{
    const x=14+i*15;
    return `<line x1="${x}" y1="26" x2="${x}" y2="33" stroke="#333" stroke-width="1.2"/><text x="${x}" y="43" text-anchor="middle" font-size="8.5" fill="#111">${i}</text>`;
  }).join('');
  const x1=14+s*15, x2=14+e*15;
  return `<svg width="180" height="50" viewBox="0 0 180 50" xmlns="http://www.w3.org/2000/svg">
    <rect x="${x1}" y="10" width="${x2-x1}" height="11" rx="2" fill="#a2d2ff" stroke="#333" stroke-width="1.3"/>
    <line x1="${x1}" y1="21" x2="${x1}" y2="26" stroke="#d33" stroke-dasharray="2,2"/>
    <line x1="${x2}" y1="21" x2="${x2}" y2="26" stroke="#d33" stroke-dasharray="2,2"/>
    <rect x="6" y="26" width="166" height="20" fill="#fff8ec" stroke="#333" stroke-width="1.3"/>
    ${ticks}
  </svg>`;
}
function svgArrayDots(rows,cols){
  let dots='';
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)dots+=`<circle cx="${14+c*15}" cy="${11+r*13}" r="4.5" fill="#ff9f43" stroke="#333" stroke-width="1"/>`;
  const w=cols*15+16, h=rows*13+10;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${dots}</svg>`;
}
function svgBeaker(ml){
  const hFill=Math.round((ml/1000)*40);
  const ticks=[200,400,600,800,1000].map(v=>{
    const y=50-Math.round((v/1000)*40);
    return `<line x1="22" y1="${y}" x2="29" y2="${y}" stroke="#333" stroke-width="1"/><text x="58" y="${y+3}" font-size="8" fill="#333">${v}mL</text>`;
  }).join('');
  return `<svg width="92" height="58" viewBox="0 0 92 58" xmlns="http://www.w3.org/2000/svg">
    <rect x="22" y="${50-hFill}" width="32" height="${hFill}" fill="#bde0fe"/>
    <path d="M20,8 L22,50 L54,50 L56,8" fill="none" stroke="#333" stroke-width="1.6"/>
    ${ticks}
  </svg>`;
}
function svgAngleArc(deg){
  const rad=deg*Math.PI/180, x2=24+38*Math.cos(-rad), y2=46+38*Math.sin(-rad);
  return `<svg width="86" height="54" viewBox="0 0 86 54" xmlns="http://www.w3.org/2000/svg">
    <line x1="24" y1="46" x2="72" y2="46" stroke="#111" stroke-width="2"/>
    <line x1="24" y1="46" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#111" stroke-width="2"/>
    ${deg===90?`<rect x="24" y="36" width="10" height="10" fill="none" stroke="#d33" stroke-width="1.3"/>`:`<path d="M38,46 A14,14 0 0,0 ${(24+14*Math.cos(-rad)).toFixed(1)},${(46+14*Math.sin(-rad)).toFixed(1)}" fill="none" stroke="#d33" stroke-width="1.4"/>`}
    <text x="48" y="34" font-size="10" font-weight="bold" fill="#d33">${deg}°</text>
  </svg>`;
}
function svgBarChart(labels,vals){
  const mx=Math.max(...vals,10);
  const bars=vals.map((v,i)=>{
    const bh=Math.round((v/mx)*34), x=28+i*34, y=44-bh;
    return `<rect x="${x}" y="${y}" width="18" height="${bh}" fill="#ffb703" stroke="#333" stroke-width="1"/><text x="${x+9}" y="${y-2}" text-anchor="middle" font-size="8.5" font-weight="bold" fill="#111">${v}</text><text x="${x+9}" y="55" text-anchor="middle" font-size="8.5" fill="#111">${labels[i]}</text>`;
  }).join('');
  return `<svg width="170" height="60" viewBox="0 0 170 60" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="6" x2="20" y2="44" stroke="#333" stroke-width="1.3"/>
    <line x1="20" y1="44" x2="162" y2="44" stroke="#333" stroke-width="1.3"/>
    ${bars}
  </svg>`;
}
function svgLShape(w1,h1,w2,h2){
  return `<svg width="125" height="64" viewBox="0 0 125 64" xmlns="http://www.w3.org/2000/svg">
    <polygon points="18,8 56,8 56,28 96,28 96,50 18,50" fill="#fff8ec" stroke="#333" stroke-width="1.5"/>
    <line x1="56" y1="28" x2="56" y2="50" stroke="#d33" stroke-dasharray="3,2"/>
    <text x="37" y="7" text-anchor="middle" font-size="9.5">${w1}cm</text>
    <text x="10" y="32" text-anchor="middle" font-size="9.5">${h1}</text>
    <text x="76" y="25" text-anchor="middle" font-size="9.5">${w2}cm</text>
    <text x="108" y="42" text-anchor="middle" font-size="9.5">${h2}</text>
  </svg>`;
}
function svgTrapezoid(up,dn,h){
  return `<svg width="130" height="64" viewBox="0 0 130 64" xmlns="http://www.w3.org/2000/svg">
    <polygon points="36,12 88,12 108,48 16,48" fill="#fff8ec" stroke="#333" stroke-width="1.5"/>
    <line x1="36" y1="12" x2="36" y2="48" stroke="#d33" stroke-width="1.3" stroke-dasharray="3,2"/>
    <rect x="36" y="42" width="6" height="6" fill="none" stroke="#d33" stroke-width="1"/>
    <text x="62" y="10" text-anchor="middle" font-size="10" fill="#111">上底 ${up}cm</text>
    <text x="62" y="60" text-anchor="middle" font-size="10" fill="#111">下底 ${dn}cm</text>
    <text x="52" y="33" font-size="10" fill="#d33">高 ${h}</text>
  </svg>`;
}
function svgParallelogram(b,h){
  return `<svg width="130" height="62" viewBox="0 0 130 62" xmlns="http://www.w3.org/2000/svg">
    <polygon points="34,10 108,10 88,46 14,46" fill="#fff8ec" stroke="#333" stroke-width="1.5"/>
    <line x1="34" y1="10" x2="34" y2="46" stroke="#d33" stroke-width="1.3" stroke-dasharray="3,2"/>
    <rect x="34" y="40" width="6" height="6" fill="none" stroke="#d33" stroke-width="1"/>
    <text x="52" y="58" text-anchor="middle" font-size="10" fill="#111">底 ${b} 公分</text>
    <text x="50" y="32" font-size="10" fill="#d33">高 ${h}</text>
  </svg>`;
}
function svgLineGraph(labels,vals){
  const mn=Math.min(...vals)-2, mx=Math.max(...vals)+2;
  const pts=vals.map((v,i)=>[28+i*34, 42-Math.round(((v-mn)/(mx-mn||1))*30)]);
  const poly=pts.map(p=>p.join(',')).join(' ');
  const dots=pts.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="3" fill="#d33"/><text x="${x}" y="${y-4}" text-anchor="middle" font-size="8.5" font-weight="bold">${vals[i]}</text><text x="${x}" y="55" text-anchor="middle" font-size="8.5">${labels[i]}</text>`).join('');
  return `<svg width="168" height="60" viewBox="0 0 168 60" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="6" x2="18" y2="44" stroke="#333" stroke-width="1.2"/>
    <line x1="18" y1="44" x2="158" y2="44" stroke="#333" stroke-width="1.2"/>
    <polyline points="${poly}" fill="none" stroke="#2980b9" stroke-width="1.8"/>
    ${dots}
  </svg>`;
}
function svgPieChart(pctA,nameA,pctB,nameB){
  const a1=(pctA/100)*2*Math.PI-Math.PI/2;
  const x1=32+24*Math.cos(a1), y1=30+24*Math.sin(a1);
  const lg=pctA>50?1:0;
  return `<svg width="150" height="60" viewBox="0 0 150 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="30" r="24" fill="#ffe5b4" stroke="#333" stroke-width="1.3"/>
    <path d="M32,30 L32,6 A24,24 0 ${lg},1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="#a2d2ff" stroke="#333" stroke-width="1.2"/>
    <text x="66" y="22" font-size="9.5" fill="#111">■ ${nameA}：${pctA}%</text>
    <text x="66" y="38" font-size="9.5" fill="#111">□ ${nameB}：${pctB}%</text>
    <text x="66" y="52" font-size="9" fill="#555">其他：${100-pctA-pctB}%</text>
  </svg>`;
}
function svgCylinder(r,h){
  return `<svg width="142" height="68" viewBox="0 0 142 68" xmlns="http://www.w3.org/2000/svg">
    <path d="M16,18 L16,50 A24,8 0 0,0 64,50 L64,18" fill="#fff8ec" stroke="#222" stroke-width="1.5"/>
    <ellipse cx="40" cy="18" rx="24" ry="8" fill="#ffe5b4" stroke="#222" stroke-width="1.5"/>
    <circle cx="40" cy="18" r="2" fill="#111"/>
    <line x1="40" y1="18" x2="64" y2="18" stroke="#d33" stroke-width="1.8"/>
    <text x="72" y="24" font-size="11" font-weight="bold" fill="#d33">半徑 ${r}cm</text>
    <text x="72" y="44" font-size="11" font-weight="bold" fill="#111">柱高 ${h}cm</text>
  </svg>`;
}
function svgSector(r,deg){
  const rad=deg*Math.PI/180, x2=30+26*Math.cos(-rad), y2=48+26*Math.sin(-rad), lg=deg>180?1:0;
  return `<svg width="110" height="58" viewBox="0 0 110 58" xmlns="http://www.w3.org/2000/svg">
    <path d="M30,48 L56,48 A26,26 0 ${lg},0 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="#ffe5b4" stroke="#333" stroke-width="1.4"/>
    <text x="44" y="56" font-size="9.5" fill="#111">半徑 ${r}cm</text>
    <text x="64" y="28" font-size="9.5" fill="#d33">${deg}°</text>
  </svg>`;
}
function svgCircuit(closed){
  return `<svg width="135" height="52" viewBox="0 0 135 52" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="18" width="24" height="14" fill="#ffd966" stroke="#333" stroke-width="1.3"/>
    <rect x="38" y="21" width="4" height="8" fill="#333"/>
    <text x="26" y="28" text-anchor="middle" font-size="8.5">電池</text>
    <circle cx="98" cy="22" r="10" fill="${closed?'#fff176':'#fff'}" stroke="#333" stroke-width="1.3"/>
    <text x="98" y="25" text-anchor="middle" font-size="8">燈泡</text>
    <path d="M42,25 L70,25 ${closed?'L88,25':'L82,14'}" fill="none" stroke="#d33" stroke-width="1.6"/>
    <path d="M14,25 L6,25 L6,44 L98,44 L98,32" fill="none" stroke="#333" stroke-width="1.5"/>
  </svg>`;
}
function svgCompassRose(){
  return `<svg width="76" height="62" viewBox="0 0 76 62" xmlns="http://www.w3.org/2000/svg">
    <polygon points="38,10 43,28 38,24 33,28" fill="#d33" stroke="#333" stroke-width="1"/>
    <polygon points="38,52 43,34 38,38 33,34" fill="#fff" stroke="#333" stroke-width="1"/>
    <line x1="20" y1="31" x2="56" y2="31" stroke="#333" stroke-width="1.3"/>
    <text x="38" y="9" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#d33">北(N)</text>
    <text x="64" y="34" text-anchor="middle" font-size="8.5">東</text>
    <text x="12" y="34" text-anchor="middle" font-size="8.5">西</text>
  </svg>`;
}
function svgPriceTag(item,price){
  return `<svg width="108" height="44" viewBox="0 0 108 44" xmlns="http://www.w3.org/2000/svg">
    <polygon points="10,22 24,8 98,8 98,36 24,36" fill="#fff8ec" stroke="#333" stroke-width="1.4"/>
    <circle cx="22" cy="22" r="3" fill="#fff" stroke="#333"/>
    <text x="60" y="21" text-anchor="middle" font-size="10" font-weight="bold" fill="#111">${item}</text>
    <text x="60" y="33" text-anchor="middle" font-size="11" font-weight="bold" fill="#d33">$${price}</text>
  </svg>`;
}

function svgToPng(svgStr){
  return new Promise(res=>{
    const m=svgStr.match(/width="(\d+)" height="(\d+)"/);
    const w=m?+m[1]:140, h=m?+m[2]:60;
    const img=new Image();
    img.onload=()=>{const cv=document.createElement('canvas');cv.width=w*2;cv.height=h*2;const g=cv.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,cv.width,cv.height);g.drawImage(img,0,0,cv.width,cv.height);res({b64:cv.toDataURL('image/png'),w,h});};
    img.onerror=()=>res(null);
    img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgStr);
  });
}


// ===== 2b. 單元精準對應與單元專屬題庫產生器（勾選哪個單元就 100% 只出該單元題目）=====
function genMathForUnit(grade, sem, uIdx, diff, kind, vIdx=0){
  const g=+grade, hard=diff==='hard', easy=diff==='easy';
  const nm=pick(NAMES), nm2=pick(NAMES.filter(x=>x!==nm)), it=pick(ITEMS);
  const v=n=>(vIdx+randSeed)%n;
  const isTrue=vIdx%2===0;
  if(vIdx % 5 !== 0){
    const extra = genMathUnitExtra(g, sem, uIdx, diff, kind, vIdx);
    if(extra) return extra;
  }

  // --- 1年級 ---
  if(g===1){
    if(sem==='上'){
      if(uIdx===0){ // 單元一：10以內的數與分合
        const tot=rnd(6,10), l=rnd(1,tot-1), r=tot-l;
        if(kind==='tf') return {q:`看圖，「${tot}」可以分成 ${l} 和 ${isTrue?r:r+1}。`,svg:svgSplitBox(tot,l,isTrue?r:r+1),a:isTrue?'○':'✕',exp:`${tot} 分成 ${l} 和 ${r}。`};
        if(kind==='fill') return v(2)===0
          ? {q:`在分合表中填入正確的數字：`,svg:svgSplitBox(tot,l,'□'),a:String(r)}
          : {q:`看圖填填看，蝴蝶翅膀上的兩個數合起來是 ${tot}，問號應填（　）。`,svg:svgButterfly(tot,l,'?'),a:String(r)};
        if(kind==='calc') return {q:`把 ${tot} 分成 ${l} 和（　　）`,svg:svgSplitBox(tot,l,'?'),a:String(r)};
        if(kind==='word') return {q:`盤子裡有 ${l} 顆紅蘋果和 ${r} 顆青蘋果，合起來共有幾顆蘋果？`,svg:svgButterfly(tot,l,r),a:`${l} 和 ${r} 合起來是 ${tot} 顆`};
        if(kind==='match') return {q:'10以內的分與合配對（合起來是 10）',pairs:[['1 和 □','9'],['3 和 □','7'],['4 和 □','6'],['2 和 □','8']]};
        const st=rnd(4,9), nums=[st,st-1,st-2,st-3,st-4], bi=rnd(1,3);
        return {q:`看火車數列圖，空格裡應該填入哪一個數字？`,svg:svgSeqTrain(nums,bi),opts:uniqueOpts(nums[bi],[nums[bi]+1,nums[bi]-1,10]),a:String(nums[bi]),exp:`依序倒數，空格為 ${nums[bi]}。`};
      }
      if(uIdx===1){ // 單元二：10以內的加減法
        const a=((vIdx+randSeed)%4)+2, b=((vIdx*2+randSeed)%4)+2, sub=v(5);
        if(kind==='tf'){
          if(sub===0){const s=isTrue?a+b:a+b+1;return {q:`如圖，左邊骰子 ${a} 點、右邊骰子 ${b} 點，合起來是 ${s} 點。`,svg:svgDicePair(a,b),a:isTrue?'○':'✕',exp:`${a}＋${b}＝${a+b}。`};}
          if(sub===1) return {q:`看積木圖，左邊 ${a} 個加右邊 ${b} 個，合起來是 ${isTrue?a+b:a+b+2} 個。`,svg:svgBlockAdd(a,b),a:isTrue?'○':'✕',exp:`${a}＋${b}＝${a+b}。`};
          if(sub===2) return {q:`算式「${a+b} － ${a}」的答案是 ${isTrue?b:b+1}。`,a:isTrue?'○':'✕',exp:`${a+b}－${a}＝${b}。`};
          if(sub===3) return {q:`「${a} ＋ ${b}」和「${b} ＋ ${a}」的答案${isTrue?'一樣大':'不一樣大'}。`,a:isTrue?'○':'✕',exp:`加法交換位置答案不變。`};
          return {q:`盒子裡有 ${a} 顆球，再放進 0 顆，現在有 ${isTrue?a:0} 顆球。`,a:isTrue?'○':'✕',exp:`${a}＋0＝${a}。`};
        }
        if(kind==='fill') return {q:`看積木圖填算式：${a} ＋ ${b} ＝（　　）。`,svg:svgBlockAdd(a,b),a:String(a+b)};
        if(kind==='calc') return v(2)===0?{q:`${a} ＋ ${b} ＝（　　）`,svg:svgDicePair(a,b),a:String(a+b)}:{q:`${a+b} － ${a} ＝（　　）`,a:String(b)};
        if(kind==='word') return {q:`盒子裡有 ${a+b} 個${it}，拿走 ${b} 個後，還剩下幾個${it}？`,a:`${a+b} - ${b} = ${a}（個）`};
        if(kind==='match') return {q:'10以內加減配對',pairs:[[`${a} ＋ 2`,String(a+2)],[`9 － 3`,'6'],[`4 ＋ 4`,'8'],[`7 － 2`,'5']]};
        if(sub===0) return {q:`數一數，左邊 ${a} 個積木、右邊 ${b} 個積木，合起來共有幾個？`,svg:svgBlockAdd(a,b),opts:uniqueOpts(`${a+b} 個`,[`${a+b-1} 個`,`${a+b+1} 個`,`${a+b+2} 個`]),a:`${a+b} 個`,exp:`${a}＋${b}＝${a+b} 個。`};
        if(sub===1) return {q:`看骰子圖，${a} 點和 ${b} 點合起來共有幾點？`,svg:svgDicePair(a,b),opts:uniqueOpts(`${a+b} 點`,[`${a+b-1} 點`,`${a+b+1} 點`,`${a+b+2} 點`]),a:`${a+b} 點`,exp:`${a}＋${b}＝${a+b} 點。`};
        if(sub===2) return {q:`算式「${a+b} － ${a}」的答案是多少？`,opts:uniqueOpts(b,[b+1,b-1,a+b]),a:String(b),exp:`${a+b}－${a}＝${b}。`};
        if(sub===3) return {q:`盤子裡有 ${a} 顆草莓，媽媽又放進 ${b} 顆，現在共有幾顆草莓？`,opts:uniqueOpts(`${a+b} 顆`,[`${a+b-1} 顆`,`${a+b+1} 顆`,`${a} 顆`]),a:`${a+b} 顆`,exp:`${a}＋${b}＝${a+b} 顆。`};
        return {q:`有 ${a+b} 隻小鳥在樹上，飛走了 ${b} 隻，還剩下幾隻小鳥？`,opts:uniqueOpts(`${a} 隻`,[`${a+1} 隻`,`${b} 隻`,`${a+b} 隻`]),a:`${a} 隻`,exp:`${a+b}－${b}＝${a} 隻。`};
      }
      if(uIdx===2){ // 單元三：比長短與認識形狀
        if(kind==='tf') return {q:isTrue?`皮球和圓罐比正方體積木更容易在地板上滾動。`:`正方體積木比皮球更容易在地板上滾動。`,a:isTrue?'○':'✕',exp:`有曲面或球體較容易滾動。`};
        if(kind==='fill') return v(2)===0
          ? {q:`數一數下面的機器人圖形：三角形有（　）個，圓形有（　）個，長方形有（　）個。`,svg:svgShapeRobot(),a:'2；1；3'}
          : {q:`看圖分辨直線與曲線：屬於「直線」的有（　　），屬於「曲線」的有（　　）。`,svg:svgLinesFour(),a:'①、③；②、④'};
        if(kind==='calc') return {q:`數一數下面的小屋圖形：三角形＋圓形＋長方形共有（　　）個。`,svg:svgShapeHouse(),a:'5（1＋2＋2＝5）'};
        if(kind==='word') return {q:`在造型小屋圖形中，長方形和圓形合起來共有幾個？`,svg:svgShapeHouse(),a:`2 + 2 = 4（個）`};
        if(kind==='match') return {q:'形狀與生活物品配對',pairs:[['硬幣的面','圓形'],['三角巾','三角形'],['國旗的面','長方形'],['骰子的面','正方形']]};
        const ord=shuffle([0,1,2]), longest=ord.indexOf(0)+1;
        return {q:`看圖比一比，下面哪一枝鉛筆最長？`,svg:svgLengthCompare(ord),opts:uniqueOpts(`(${longest})`,['(1)','(2)','(3)','一樣長']),a:`(${longest})`,exp:`第 (${longest}) 枝鉛筆最長。`};
      }
      // uIdx===3 單元四：20以內的數與加減（純數與加減，絕不出現時鐘；多題型變化輪替）
      const a=rnd(6,9), b=rnd(5,9), sub=v(6);
      if(kind==='tf'){
        if(sub===0){const u=rnd(2,9);return {q:`看定位板，1 個十和 ${u} 個一合起來是 ${isTrue?10+u:u*10+1}。`,svg:svgAbacus(1,u),a:isTrue?'○':'✕',exp:`1 個十和 ${u} 個一是 ${10+u}。`};}
        if(sub===1) return {q:`算式「${a} ＋ ${b}」的答案是 ${isTrue?a+b:a+b+2}。`,svg:svgBlockAdd(a,b),a:isTrue?'○':'✕',exp:`${a}＋${b}＝${a+b}。`};
        if(sub===2){const k=rnd(3,7);return {q:`排隊時${nm}排在第 ${k} 個，代表他前面有 ${isTrue?k-1:k} 個人。`,svg:svgRowCount(k+2),a:isTrue?'○':'✕',exp:`第 ${k} 個前面有 ${k-1} 人。`};}
        if(sub===3) return {q:`「${a} ＋ ${b}」和「${b} ＋ ${a}」算出來的答案一樣大。`,a:'○',exp:`加法交換律結果相同。`};
        if(sub===4) return {q:`從 20 往前倒數 3 個數（20、19、18、□），會數到 ${isTrue?17:16}。`,a:isTrue?'○':'✕',exp:`20 倒數 3 個數是 17。`};
        return {q:`算式「${a+b} － ${a}」的答案是 ${isTrue?b:b+1}。`,a:isTrue?'○':'✕',exp:`${a+b}－${a}＝${b}。`};
      }
      if(kind==='fill'){
        if(sub===0){const tot=rnd(7,10),k=rnd(2,tot-1);return {q:`看圖數一數，共有（　）個圓圈；從左邊數起第 ${k} 個，從右邊數起是第（　）個。`,svg:svgRowCount(tot),a:`${tot}；${tot-k+1}`};}
        if(sub===1){const u=rnd(2,8);return {q:`看定位板填填看：1 個十和 ${u} 個一合起來是（　　）。`,svg:svgAbacus(1,u),a:String(10+u)};}
        if(sub===2){const st=rnd(11,15);return {q:`按照順序填填看：${st} → ${st+1} →（　　）→ ${st+3}。`,svg:svgSeqTrain([st,st+1,st+2,st+3],2),a:String(st+2)};}
        if(sub===3) return {q:`湊十法計算：「8 ＋ ${a}」可以把 ${a} 分成 2 和 ${a-2}，先算 8 ＋ 2 ＝ 10，再加 ${a-2} 得（　　）。`,a:String(8+a)};
        if(sub===4) return {q:`破十法計算：「15 － ${a}」先算 10 － ${a} ＝ ${10-a}，再算 ${10-a} ＋ 5 ＝（　　）。`,a:String(15-a)};
        return {q:`看積木圖計算：${a} ＋ ${b} ＝（　　）；${a+b} － ${b} ＝（　　）。`,svg:svgBlockAdd(a,b),a:`${a+b}；${a}`};
      }
      if(kind==='calc') return v(3)===0?{q:`${a} ＋ ${b} ＝（　　）`,svg:svgBlockAdd(a,b),a:String(a+b)}:(v(3)===1?{q:`${a+b} － ${a} ＝（　　）`,a:String(b)}:{q:`等式推算：${a} ＋（　　）＝ 20`,a:String(20-a)});
      if(kind==='word'){
        if(v(3)===0){const f=rnd(3,6),bk=rnd(2,5);return {q:`排隊買票時，${nm}前面有 ${f} 個人，後面有 ${bk} 個人，這一排共有幾個人？`,svg:svgRowCount(f+bk+1),a:`${f} + 1 + ${bk} = ${f+bk+1}（人）`};}
        if(v(3)===1) return {q:`${nm}原本有 ${a+b} 顆彈珠，送給妹妹 ${a} 顆後，自己還剩下幾顆彈珠？`,a:`${a+b} - ${a} = ${b}（顆）`};
        return {q:`書架上原有 ${a} 本故事書，老師又放進 ${b} 本，現在書架上共有幾本故事書？`,svg:svgBlockAdd(a,b),a:`${a} + ${b} = ${a+b}（本）`};
      }
      if(kind==='match') return {q:'20以內進位與退位加減配對',pairs:[[`${a} ＋ ${b}`,String(a+b)],[`15 － 6`,'9'],[`8 ＋ 9`,'17'],[`16 － 8`,'8']]};
      if(sub===0){const u=rnd(2,9);return {q:`看定位板，「1 個十和 ${u} 個一」合起來是多少？`,svg:svgAbacus(1,u),opts:uniqueOpts(10+u,[u*10+1,1+u,20+u]),a:String(10+u),exp:`1 個十是 10，加 ${u} 個一是 ${10+u}。`};}
      if(sub===1) return {q:`看積木圖，「${a} ＋ ${b}」合起來共有幾個？`,svg:svgBlockAdd(a,b),opts:uniqueOpts(`${a+b} 個`,[`${a+b-1} 個`,`${a+b+1} 個`,`${a+b+2} 個`]),a:`${a+b} 個`,exp:`${a}＋${b}＝${a+b} 個。`};
      if(sub===2){const x=rnd(13,18),y=rnd(5,9);return {q:`算式「${x} － ${y}」的答案是多少？`,opts:uniqueOpts(x-y,[x-y+1,x-y-1,x+y]),a:String(x-y),exp:`${x}－${y}＝${x-y}。`};}
      if(sub===3){const st=rnd(12,16);return {q:`看火車數列圖，空格裡應該填入哪一個數字？`,svg:svgSeqTrain([st,st+1,st+2,st+3],2),opts:uniqueOpts(st+2,[st+1,st+3,st+4]),a:String(st+2),exp:`依序順數，空格為 ${st+2}。`};}
      if(sub===4) return {q:`把「19、12、16、14」從大到小排好，排在第二個的是哪一個數？`,opts:uniqueOpts('16',['19','14','12']),a:'16',exp:`19＞16＞14＞12，第二個是 16。`};
      const k=rnd(4,8);return {q:`從第 1 頁讀到第 ${10+k} 頁，總共讀了幾頁？`,opts:uniqueOpts(`${10+k} 頁`,[`${9+k} 頁`,`${11+k} 頁`,'10 頁']),a:`${10+k} 頁`,exp:`共讀了 ${10+k} 頁。`};
    }
    // 1年級下
    if(uIdx===0){ // 單元一：100以內的數
      const t10=rnd(2,7), u1=rnd(1,7), n=t10*10+u1;
      if(kind==='tf') return {q:`看定位板，「${n}」的十位數字是 ${isTrue?t10:u1}，個位數字是 ${isTrue?u1:t10}。`,svg:svgAbacus(t10,u1),a:isTrue?'○':'✕',exp:`${n} 是 ${t10} 個十和 ${u1} 個一。`};
      if(kind==='fill') return {q:`看定位板上的算珠：十位有 ${t10} 顆、個位有 ${u1} 顆，合起來表示（　　）。`,svg:svgAbacus(t10,u1),a:String(n)};
      if(kind==='calc'){const st=rnd(20,60);return {q:`五個一數：${st} → ${st+5} →（　　）→ ${st+15}`,svg:svgSeqTrain([st,st+5,st+10,st+15],2),a:String(st+10)};}
      if(kind==='word') return {q:`每 10 顆糖果裝一袋，${nm}有 ${t10} 袋又 ${u1} 顆，合起來共有幾顆糖果？`,svg:svgAbacus(t10,u1),a:`${t10} 個十和 ${u1} 個一合起來是 ${n} 顆`};
      if(kind==='match') return {q:'十位與個位合成配對',pairs:[['3 個十和 5 個一','35'],['5 個十和 3 個一','53'],['7 個十和 0 個一','70'],['4 個十和 9 個一','49']]};
      return {q:`看定位板圖，「${t10} 個十和 ${u1} 個一」合起來是多少？`,svg:svgAbacus(t10,u1),opts:uniqueOpts(n,[u1*10+t10,t10+u1,n+10]),a:String(n),exp:`${t10}×10＋${u1}＝${n}。`};
    }
    if(uIdx===1){ // 單元二：100以內的加減法
      const a=rnd(21,55), b=rnd(12,34);
      if(kind==='tf') return {q:`算式「${a} ＋ ${b}」的答案是 ${isTrue?a+b:a+b+10}。`,a:isTrue?'○':'✕',exp:`${a}＋${b}＝${a+b}。`};
      if(kind==='fill') return {q:`填入正確答案：${a} ＋ ${b} ＝（　　）；${a+b} － ${b} ＝（　　）。`,a:`${a+b}；${a}`};
      if(kind==='calc') return v(2)===0?{q:`${a} ＋ ${b} ＝（　　）`,a:String(a+b)}:{q:`${a+b} － ${a} ＝（　　）`,a:String(b)};
      if(kind==='word') return {q:`${nm}有 ${a} 張貼紙，${nm2}又給他 ${b} 張，現在${nm}共有幾張貼紙？`,a:`${a} + ${b} = ${a+b}（張）`};
      if(kind==='match') return {q:'二位數加減配對',pairs:[['25 ＋ 13','38'],['46 － 12','34'],['30 ＋ 28','58'],['59 － 24','35']]};
      return {q:`算式「${a} ＋ ${b}」的正確答案是多少？`,opts:uniqueOpts(a+b,[a+b+10,a+b-1,a-b]),a:String(a+b),exp:`${a}＋${b}＝${a+b}。`};
    }
    if(uIdx===2){ // 單元三：認識錢幣與購物
      const c10=rnd(1,3), c5=rnd(0,1), c1=rnd(1,3), tot=50+c10*10+c5*5+c1;
      if(kind==='tf'){const c=isTrue?5:4;return {q:`如圖，1 個 50 元硬幣可以換成 ${c} 個 10 元硬幣。`,svg:svgCoins(1,0,0,0),a:isTrue?'○':'✕',exp:`50 元可換 5 個 10 元。`};}
      if(kind==='fill') return {q:`數一數圖中的硬幣，合起來一共有（　　）元。`,svg:svgCoins(1,c10,c5,c1),a:String(tot)};
      if(kind==='calc'){const price=rnd(15,45);return {q:`付 1 個 50 元硬幣買 ${price} 元的筆記本，可找回（　　）元。`,svg:svgCoins(1,0,0,0),a:String(50-price)};}
      if(kind==='word'){const price=rnd(18,42);return {q:`一本畫冊賣 ${price} 元，${nm}付了圖中的硬幣共 ${tot} 元，買完後還剩下多少元？`,svg:svgCoins(1,c10,c5,c1),a:`${tot} - ${price} = ${tot-price}（元）`};}
      if(kind==='match') return {q:'錢幣換算配對',pairs:[['1 個 50 元','5 個 10 元'],['1 個 10 元','2 個 5 元'],['2 個 50 元','100 元'],['3 個 10 元和 2 個 1 元','32 元']]};
      const p=rnd(2,4)*10+5;
      return {q:`買一個 ${p} 元的麵包，最少要付幾個 10 元硬幣才夠？`,svg:svgCoins(0,Math.ceil(p/10),0,0),opts:uniqueOpts(`${Math.ceil(p/10)} 個`,[`${Math.floor(p/10)} 個`,`${Math.ceil(p/10)+1} 個`,'1 個']),a:`${Math.ceil(p/10)} 個`,exp:`需付 ${Math.ceil(p/10)} 個 10 元（${Math.ceil(p/10)*10} 元）。`};
    }
    // uIdx===3 單元四：長度測量與統計
    const s=0, len=rnd(4,8), v1=rnd(4,9), v2=rnd(5,10), v3=rnd(3,8);
    if(kind==='tf') return {q:`看直尺圖，藍色彩帶從刻度 0 對齊到 ${len}，長度是 ${isTrue?len:len+1} 公分。`,svg:svgRulerMeasure(0,len),a:isTrue?'○':'✕',exp:`從 0 到 ${len} 是 ${len} 公分。`};
    if(kind==='fill') return {q:`看統計圖回答：喜歡蘋果的有 ${v1} 人、香蕉 ${v2} 人、橘子 ${v3} 人，全班共有（　　）人。`,svg:svgBarChart(['蘋果','香蕉','橘子'],[v1,v2,v3]),a:String(v1+v2+v3)};
    if(kind==='calc') return {q:`看統計圖算算看：喜歡蘋果和香蕉的共有（　　）人。`,svg:svgBarChart(['蘋果','香蕉','橘子'],[v1,v2,v3]),a:String(v1+v2)};
    if(kind==='word') return {q:`如圖，藍色彩帶長 ${len} 公分，紅色彩帶比藍色彩帶長 3 公分，紅色彩帶長幾公分？`,svg:svgRulerMeasure(0,len),a:`${len} + 3 = ${len+3}（公分）`};
    if(kind==='match') return {q:'星期順序配對',pairs:[['星期一的明天','星期二'],['星期五的明天','星期六'],['星期日的昨天','星期六'],['一星期共有','7 天']]};
    return {q:`看下面的直尺測量圖，藍色彩帶的長度是幾公分？`,svg:svgRulerMeasure(0,len),opts:uniqueOpts(`${len} 公分`,[`${len-1} 公分`,`${len+1} 公分`,`${len+2} 公分`]),a:`${len} 公分`,exp:`從刻度 0 到 ${len} 共 ${len} 公分。`};
  }

  // --- 2年級 ---
  if(g===2){
    if(sem==='上'){
      if(uIdx===0){ // 單元一：200～1000以內的數
        const h=rnd(2,8), t0=rnd(0,9), u=rnd(1,9), n=h*100+t0*10+u;
        if(kind==='tf') return {q:`「${h} 個百、${t0} 個十和 ${u} 個一」合起來寫作 ${isTrue?n:h*10+u}。`,a:isTrue?'○':'✕',exp:`合起來是 ${n}。`};
        if(kind==='fill'){const st=rnd(200,600);return {q:`看數列火車圖，一百一數：空格應填入（　　）。`,svg:svgSeqTrain([st,st+100,st+200,st+300],2),a:String(st+200)};}
        if(kind==='calc') return {q:`${h*100} ＋ ${t0*10} ＋ ${u} ＝（　　）`,a:String(n)};
        if(kind==='word'){const c100=rnd(2,5),c10=rnd(1,3),c1=rnd(1,4);return {q:`存錢筒裡有 ${c100} 張百元鈔票、${c10} 個 10 元和 ${c1} 個 1 元，共有多少元？`,svg:svgCoins(0,c10,0,c1),a:`${c100*100 + c10*10 + c1} 元`};}
        if(kind==='match') return {q:'三位數合成配對',pairs:[['3 個百和 5 個一','305'],['3 個百和 5 個十','350'],['5 個百和 3 個十','530'],['5 個百和 3 個一','503']]};
        return {q:`「${h} 個百和 ${u} 個一」合起來是多少？`,opts:uniqueOpts(h*100+u,[h*10+u,h*100+u*10,u*100+h]),a:String(h*100+u),exp:`十位補 0，寫作 ${h*100+u}。`};
      }
      if(uIdx===1){ // 單元二：二、三位數加減法
        const a=rnd(140,480), b=rnd(115,320);
        if(kind==='tf') return {q:`算式「${a} ＋ ${b}」的結果是 ${isTrue?a+b:a+b+10}。`,a:isTrue?'○':'✕',exp:`${a}＋${b}＝${a+b}。`};
        if(kind==='fill') return {q:`完成加減計算：${a} ＋ ${b} ＝（　　）；${a+b} － ${a} ＝（　　）。`,a:`${a+b}；${b}`};
        if(kind==='calc') return v(2)===0?{q:`${a} ＋ ${b} ＝（　　）`,a:String(a+b)}:{q:`${a+b} － ${b} ＝（　　）`,a:String(a)};
        if(kind==='word') return {q:`果園昨天採收 ${a} 顆橘子，今天比昨天多採收 ${b} 顆，今天採收了幾顆橘子？`,a:`${a} + ${b} = ${a+b}（顆）`};
        if(kind==='match') return {q:'三位數加減配對',pairs:[['250 ＋ 150','400'],['500 － 180','320'],['340 ＋ 210','550'],['620 － 120','500']]};
        return {q:`「${a} ＋ ${b}」的正確答案是多少？`,opts:uniqueOpts(a+b,[a+b+10,a+b-10,a-b]),a:String(a+b),exp:`${a}＋${b}＝${a+b}。`};
      }
      if(uIdx===2){ // 單元三：公分與公尺
        const s=rnd(1,3), len=rnd(4,7), m=rnd(2,6), cm=rnd(15,85);
        if(kind==='tf') return {q:`${m} 公尺 ${cm} 公分合起來等於 ${isTrue?m*100+cm:m*10+cm} 公分。`,a:isTrue?'○':'✕',exp:`1 公尺＝100 公分，共 ${m*100+cm} 公分。`};
        if(kind==='fill') return {q:`看下面的直尺測量圖，藍色彩帶從刻度 ${s} 到 ${s+len}，長度是（　）公分。`,svg:svgRulerMeasure(s,s+len),a:String(len)};
        if(kind==='calc') return {q:`${m} 公尺 ${cm} 公分 ＝（　　）公分`,a:String(m*100+cm)};
        if(kind==='word') return {q:`一條紅繩長 ${m} 公尺 ${cm} 公分，也就是幾公分？如果剪掉 ${cm} 公分，還剩幾公分？`,svg:svgRulerMeasure(1,6),a:`${m*100+cm} 公分；剩 ${m*100} 公分`};
        if(kind==='match') return {q:'公尺與公分換算配對',pairs:[['1 公尺','100 公分'],['2 公尺 5 公分','205 公分'],['2 公尺 50 公分','250 公分'],['300 公分','3 公尺']]};
        return {q:`看直尺圖，彩帶從刻度 ${s} 對齊到刻度 ${s+len}，彩帶長幾公分？`,svg:svgRulerMeasure(s,s+len),opts:uniqueOpts(`${len} 公分`,[`${s+len} 公分`,`${len+1} 公分`,`${len-1} 公分`]),a:`${len} 公分`,exp:`${s+len} － ${s} ＝ ${len} 公分。`};
      }
      // uIdx===3 單元四：乘法（2、4、5、8）
      const r0=pick([2,4,5]), c0=rnd(3,7);
      if(kind==='tf') return {q:`如圖，每排有 ${c0} 個圓點，共有 ${r0} 排，全部有 ${isTrue?r0*c0:r0+c0} 個圓點。`,svg:svgArrayDots(r0,c0),a:isTrue?'○':'✕',exp:`${c0}×${r0}＝${r0*c0}。`};
      if(kind==='fill') return {q:`看點陣圖填填看：每排有 ${c0} 個圓點，共有 ${r0} 排，乘法算式記作 ${c0} × ${r0} ＝（　　）。`,svg:svgArrayDots(r0,c0),a:String(r0*c0)};
      if(kind==='calc') return {q:`看點陣圖計算：${c0} × ${r0} ＝（　　）`,svg:svgArrayDots(r0,c0),a:String(r0*c0)};
      if(kind==='word') return {q:`1 盒蘋果有 ${c0} 顆，媽媽買了 ${r0} 盒，如點陣圖所示，總共有幾顆蘋果？`,svg:svgArrayDots(r0,c0),a:`${c0} × ${r0} = ${c0*r0}（顆）`};
      if(kind==='match') return {q:'乘法算式配對',pairs:[['2 × 7','14'],['4 × 6','24'],['5 × 8','40'],['8 × 3','24']]};
      return {q:`看點陣圖，哪一個算式可以算出圓點的總數（${r0} 排、每排 ${c0} 個）？`,svg:svgArrayDots(r0,c0),opts:uniqueOpts(`${c0} × ${r0} ＝ ${c0*r0}`,[`${c0} ＋ ${r0} ＝ ${c0+r0}`,`${c0} － ${r0}`,`${c0} × ${r0+1}`]),a:`${c0} × ${r0} ＝ ${c0*r0}`,exp:`每排 ${c0} 個有 ${r0} 排，共 ${c0*r0} 個。`};
    }
    // 2年級下
    if(uIdx===0){ // 單元一：乘法（3、6、7、9）與兩步驟
      const m1=pick([3,6,7,9]), m2=rnd(3,8), ex=rnd(5,15);
      if(kind==='tf') return {q:`「${m1} 的 ${isTrue?0:1} 倍」答案是 0。`,a:isTrue?'○':'✕',exp:`任何數乘以 0 都是 0。`};
      if(kind==='fill') return {q:`看點陣圖：每排 ${m2} 個、共 3 排，再加上 ${ex} 個，共有（　　）個。`,svg:svgArrayDots(3,m2),a:String(m2*3+ex)};
      if(kind==='calc') return {q:`${m1} × ${m2} ＋ ${ex} ＝（　　）`,a:String(m1*m2+ex)};
      if(kind==='word') return {q:`一枝鉛筆賣 ${m1} 元，買 ${m2} 枝付了 100 元，可找回多少元？`,svg:svgCoins(2,0,0,0),a:`100 - ${m1} × ${m2} = ${100-m1*m2}（元）`};
      if(kind==='match') return {q:'九九乘法配對',pairs:[['6 × 7','42'],['7 × 8','56'],['9 × 6','54'],['3 × 9','27']]};
      return {q:`「${m1} 的 6 倍」比「${m1} 的 4 倍」多幾個 ${m1}？`,opts:uniqueOpts('2 個',['10 個','4 個','6 個']),a:'2 個',exp:`6 倍減 4 倍等於多 2 個 ${m1}。`};
    }
    if(uIdx===1){ // 單元二：分裝與平分、單位分數
      const d=rnd(3,8), q0=rnd(3,6);
      if(kind==='tf') return {q:`如圖，把 1 個長條平分成 ${d} 等份，塗色部分是 ${isTrue?`1/${d}`:`1/${d+1}`}。`,svg:svgFraction(1,d),a:isTrue?'○':'✕',exp:`平分成 ${d} 等份，每份是 1/${d}。`};
      if(kind==='fill') return {q:`看塗色圖填分數：平分成 ${d} 等份，塗色的 1 份是（　　）條。`,svg:svgFraction(1,d),a:`1/${d}`};
      if(kind==='calc') return {q:`把 ${d*q0} 顆糖果，每 ${d} 顆裝一袋，可以裝成（　　）袋。`,a:String(q0)};
      if(kind==='word') return {q:`把 ${d*q0} 張貼紙平分給 ${d} 位小朋友，每人可以分到幾張貼紙？`,a:`${d*q0} 平分給 ${d} 人，每人 ${q0} 張`};
      if(kind==='match') return {q:'單位分數塗色配對',pairs:[['平分成 4 份中的 1 份','1/4'],['平分成 6 份中的 1 份','1/6'],['平分成 8 份中的 1 份','1/8'],['平分成 10 份中的 1 份','1/10']]};
      return {q:`如圖，把 1 個披薩平分成 ${d} 片，其中的 1 片是幾個披薩？`,svg:svgFraction(1,d),opts:uniqueOpts(`1/${d} 個`,[`${d} 個`,`1/${d+1} 個`,'1 個']),a:`1/${d} 個`,exp:`平分成 ${d} 份，每份是 1/${d}。`};
    }
    if(uIdx===2){ // 單元三：時間、重量與容量
      const hr=rnd(1,11), yr=rnd(1,2), mo=rnd(2,9);
      if(kind==='tf') return {q:`一年有 ${isTrue?12:10} 個月，閏年的 2 月有 29 天。`,a:isTrue?'○':'✕',exp:`一年有 12 個月。`};
      if(kind==='fill') return {q:`看時鐘填時間：現在是（　）點（　　）分；另外 ${yr} 年 ${mo} 個月＝（　　）個月。`,svg:svgClock(hr,30),a:`${hr}；30；${yr*12+mo}`};
      if(kind==='calc') return {q:`${yr} 年 ${mo} 個月 ＝（　　）個月`,a:String(yr*12+mo)};
      if(kind==='word') return {q:`如圖，小華從 ${hr} 點 30 分開始練琴，練了 1 小時後，結束時是幾點幾分？`,svg:svgClock(hr,30),a:`${hr+1} 點 30 分`};
      if(kind==='match') return {q:'時間單位配對',pairs:[['1 年','12 個月'],['平年全年','365 天'],['閏年全年','366 天'],['1 星期','7 天']]};
      return {q:`看時鐘回答：短針在 ${hr} 和 ${hr+1} 中間，長針指著 6，是幾點幾分？`,svg:svgClock(hr,30),opts:uniqueOpts(`${hr} 點 30 分`,[`${hr} 點整`,`${hr+1} 點 30 分`,`6 點 ${hr} 分`]),a:`${hr} 點 30 分`,exp:`長針指 6 代表 30 分。`};
    }
    // uIdx===3 單元四：平面圖形與立體形體
    const w=rnd(5,12), h=rnd(3,8);
    if(kind==='tf') return {q:isTrue?`如圖，長方形的對邊一樣長，且 4 個角都是直角。`:`長方形的 4 條邊一定都一樣長。`,svg:svgRectDim(w,h,'公分'),a:isTrue?'○':'✕',exp:`長方形對邊等長、四角皆為直角。`};
    if(kind==='fill') return {q:`看圖填填看：正方體有（　）個面、（　）個頂點和（　　）條邊。`,svg:svgBox3D(5,5,5),a:'6；8；12'};
    if(kind==='calc') return {q:`如圖，長方形長 ${w} 公分、寬 ${h} 公分，4 條邊合起來共長（　　）公分。`,svg:svgRectDim(w,h,'公分'),a:String((w+h)*2)};
    if(kind==='word') return {q:`用竹籤做一個邊長 ${w} 公分的正方形相框，一共需要幾公分長的竹籤？`,svg:svgRectDim(w,w,'公分'),a:`${w} × 4 = ${w*4}（公分）`};
    if(kind==='match') return {q:'圖形構成要素配對',pairs:[['三角形','3 個角、3 條邊'],['長方形','4 個直角、對邊等長'],['正方形','4 個直角、4 邊等長'],['正方體','6 個正方形的面']]};
    return {q:`如圖，長方形和正方形都有幾個「直角」？`,svg:svgRectDim(w,h,'公分'),opts:uniqueOpts('4 個直角',['2 個直角','3 個直角','6 個直角']),a:'4 個直角',exp:`長方形與正方形四個角皆為直角。`};
  }

  // --- 3年級 ---
  if(g===3){
    if(sem==='上'){
      if(uIdx===0){ // 單元一：一萬以內的數與加減
        const th=rnd(1,8), h=rnd(0,9), t0=rnd(1,9), u=rnd(1,9), n=th*1000+h*100+t0*10+u, b=rnd(1200,3500);
        if(kind==='tf') return {q:`四位數「${n}」的千位數字是 ${isTrue?th:t0}，代表 ${isTrue?th*1000:t0*1000}。`,a:isTrue?'○':'✕',exp:`${n} 的千位是 ${th}，表示 ${th*1000}。`};
        if(kind==='fill') return {q:`「${th} 個千、${h} 個百、${t0} 個十和 ${u} 個一」合起來寫作（　　　）。`,a:String(n)};
        if(kind==='calc') return v(2)===0?{q:`${n} ＋ ${b} ＝（　　　）`,a:String(n+b)}:{q:`${n+b} － ${b} ＝（　　　）`,a:String(n)};
        if(kind==='word') return {q:`圖書館原有 ${n} 本書，今年又新購進 ${b} 本書，現在圖書館共有幾本書？`,a:`${n} + ${b} = ${n+b}（本）`};
        if(kind==='match') return {q:'四位數合成配對',pairs:[['3 個千和 5 個百','3500'],['3 個千和 5 個十','3050'],['3 個千和 5 個一','3005'],['5 個千和 3 個百','5300']]};
        return {q:`下列哪一個數「比 ${n} 大，又比 ${n+500} 小」？`,opts:uniqueOpts(n+200,[n-100,n+600,n-500]),a:String(n+200),exp:`${n+200} 介於 ${n} 與 ${n+500} 之間。`};
      }
      if(uIdx===1){ // 單元二：乘法與除法直式計算
        const d=rnd(4,9), q0=rnd(12,35), r=rnd(1,d-1), a=rnd(24,85);
        if(kind==='tf'){const rem=isTrue?d-1:d+1;return {q:`除法計算「□ ÷ ${d}」中，餘數有可能是 ${rem}。`,a:isTrue?'○':'✕',exp:`餘數一定要比除數（${d}）小。`};}
        if(kind==='fill') return {q:`在「${d*q0+r} ÷ ${d} ＝（　　）…（　）」算式中，商是（　　），餘數是（　）。`,a:`${q0}；${r}`};
        if(kind==='calc') return v(2)===0?{q:`${a} × ${d} ＝（　　）`,a:String(a*d)}:{q:`${d*q0+r} ÷ ${d} ＝（　　）…（　）`,a:`${q0} 餘 ${r}`};
        if(kind==='word') return {q:`把 ${d*q0+r} 顆水餃平分裝成 ${d} 盤，每盤最多有幾顆？還剩下幾顆？`,a:`${d*q0+r} ÷ ${d} = ${q0} … ${r}（每盤 ${q0} 顆，剩 ${r} 顆）`};
        if(kind==='match') return {q:'乘除算式配對',pairs:[['25 × 4','100'],['36 ÷ 3','12'],['48 ÷ 4','12'],['15 × 6','90']]};
        return {q:`在「□ ÷ ${d} ＝ ${q0} … △」算式中，餘數 △ 最大可能是多少？`,opts:uniqueOpts(d-1,[d,d+1,q0]),a:String(d-1),exp:`餘數必小於除數 ${d}，最大為 ${d-1}。`};
      }
      if(uIdx===2){ // 單元三：公里、公尺與毫米
        const km=rnd(2,8), m=rnd(100,850), cm=rnd(3,9), mm=rnd(2,8);
        if(kind==='tf') return {q:`${km} 公里 ${m} 公尺合起來等於 ${isTrue?km*1000+m:km*100+m} 公尺。`,a:isTrue?'○':'✕',exp:`1 公里＝1000 公尺，共 ${km*1000+m} 公尺。`};
        if(kind==='fill') return v(2)===0
          ? {q:`${km} 公里 ${m} 公尺 ＝（　　　）公尺。`,a:String(km*1000+m)}
          : {q:`看直尺圖，${cm} 公分 ${mm} 毫米 ＝（　　）毫米。`,svg:svgRulerMeasure(0,cm),a:String(cm*10+mm)};
        if(kind==='calc') return {q:`${km} 公里 ${m} 公尺 ＋ 500 公尺 ＝（　　　）公尺`,a:String(km*1000+m+500)};
        if(kind==='word') return {q:`腳踏車道第一段長 ${km} 公里 ${m} 公尺，第二段長 1 公里 200 公尺，兩段共長幾公尺？`,a:`${km*1000+m} + 1200 = ${km*1000+m+1200}（公尺）`};
        if(kind==='match') return {q:'長度單位換算配對',pairs:[['1 公里','1000 公尺'],['1 公分','10 毫米'],['3 公里 50 公尺','3050 公尺'],['5 公分 8 毫米','58 毫米']]};
        return {q:`「${km} 公里 ${m} 公尺」換算成公尺是多少？`,opts:uniqueOpts(`${km*1000+m} 公尺`,[`${km*100+m} 公尺`,`${km+m} 公尺`,`${km*10000+m} 公尺`]),a:`${km*1000+m} 公尺`,exp:`1 公里＝1000 公尺。`};
      }
      // uIdx===3 單元四：角、正方形、長方形與圓
      const s=rnd(5,14), w=rnd(7,15), h=rnd(4,9), r0=rnd(4,12), deg=pick([45,60,90,120]);
      if(kind==='tf') return v(2)===0
        ? {q:`如圖，半徑 ${r0} 公分的圓，它的直徑是 ${isTrue?r0*2:r0} 公分。`,svg:svgCircle(r0,false),a:isTrue?'○':'✕',exp:`直徑＝半徑×2＝${r0*2} 公分。`}
        : {q:`如圖，邊長 ${s} 公分的正方形，周長是 ${isTrue?s*4:s*s} 公分。`,svg:svgRectDim(s,s,'公分'),a:isTrue?'○':'✕',exp:`正方形周長＝邊長×4＝${s*4} 公分。`};
      if(kind==='fill') return v(2)===0
        ? {q:`如圖，這個角張開 ${deg}°，它是一個（　）角（填銳、直或鈍）；另外半徑 ${r0} 公分的圓，直徑是（　　）公分。`,svg:svgAngleArc(deg),a:`${deg<90?'銳':(deg===90?'直':'鈍')}；${r0*2}`}
        : {q:`如圖，長 ${w} 公分、寬 ${h} 公分的長方形，周長是（　　）公分。`,svg:svgRectDim(w,h,'公分'),a:String((w+h)*2)};
      if(kind==='calc') return {q:`看圖計算長方形周長：（${w} ＋ ${h}）× 2 ＝（　　）公分`,svg:svgRectDim(w,h,'公分'),a:String((w+h)*2)};
      if(kind==='word') return {q:`如圖，長方形菜園長 ${w} 公尺、寬 ${h} 公尺，沿著周圍走一圈是多少公尺？`,svg:svgRectDim(w,h,'公尺'),a:`(${w} + ${h}) × 2 = ${(w+h)*2}（公尺）`};
      if(kind==='match') return {q:'幾何圖形性質配對',pairs:[['直角','90 度'],['銳角','比直角小'],['鈍角','比直角大'],['圓的直徑','半徑的 2 倍']]};
      return v(2)===0
        ? {q:`如圖，半徑 ${r0} 公分的圓，直徑是多少公分？`,svg:svgCircle(r0,false),opts:uniqueOpts(`${r0*2} 公分`,[`${r0} 公分`,`${r0*4} 公分`,`${r0+2} 公分`]),a:`${r0*2} 公分`,exp:`直徑＝半徑×2＝${r0*2} 公分。`}
        : {q:`如圖，張開 ${deg}° 的角稱為什麼角？`,svg:svgAngleArc(deg),opts:uniqueOpts(deg<90?'銳角':(deg===90?'直角':'鈍角'),['銳角','直角','鈍角','平角']),a:deg<90?'銳角':(deg===90?'直角':'鈍角'),exp:`${deg}° 為${deg<90?'銳角':(deg===90?'直角':'鈍角')}。`};
    }
    // 3年級下
    if(uIdx===0){ // 單元一：分數的認識與加減
      const den=rnd(5,10), a=rnd(1,den-3), b=rnd(1,den-a-1);
      if(kind==='tf') return {q:`如圖，分數「${a}/${den}」讀作「${isTrue?`${den}分之${a}`:`${a}分之${den}`}」。`,svg:svgFraction(a,den),a:isTrue?'○':'✕',exp:`分母先讀，讀作 ${den}分之${a}。`};
      if(kind==='fill') return {q:`看塗色圖計算：${a}/${den} ＋ ${b}/${den} ＝（　　）；1 － ${a}/${den} ＝（　　）。`,svg:svgFraction(a,den,b),a:`${a+b}/${den}；${den-a}/${den}`};
      if(kind==='calc') return {q:`看塗色部分，${a}/${den} ＋ ${b}/${den} ＝（　　）`,svg:svgFraction(a,den,b),a:`${a+b}/${den}`};
      if(kind==='word') return {q:`一盒披薩平分成 ${den} 片，哥哥吃了 ${a} 片，妹妹吃了 ${b} 片，兩人共吃了幾盒披薩？`,svg:svgFraction(a,den,b),a:`${a}/${den} + ${b}/${den} = ${a+b}/${den}（盒）`};
      if(kind==='match') return {q:'同分母分數計算配對',pairs:[['1/5 ＋ 2/5','3/5'],['1 － 3/7','4/7'],['2/9 ＋ 5/9','7/9'],['1 － 1/6','5/6']]};
      return {q:`看圖計算，「${a}/${den} ＋ ${b}/${den}」的結果是多少？`,svg:svgFraction(a,den,b),opts:uniqueOpts(`${a+b}/${den}`,[`${a+b}/${den*2}`,`${den}/${a+b}`,`1/${den}`]),a:`${a+b}/${den}`,exp:`同分母分數相加，分子相加得 ${a+b}/${den}。`};
    }
    if(uIdx===1){ // 單元二：小數的認識與加減
      const x=(rnd(12,65)/10), y=(rnd(11,48)/10), ans=(x+y).toFixed(1), n1=rnd(2,8);
      if(kind==='tf') return {q:`「3 個 1 和 ${n1} 個 0.1」合起來是 ${isTrue?`3.${n1}`:`${n1}.3`}。`,a:isTrue?'○':'✕',exp:`合起來是 3.${n1}。`};
      if(kind==='fill') return {q:`${n1} 個「0.1」和 4 個「1」合起來是（　　）；再加 0.5 是（　　）。`,a:`4.${n1}；${(4+n1/10+0.5).toFixed(1)}`};
      if(kind==='calc') return {q:`${x.toFixed(1)} ＋ ${y.toFixed(1)} ＝（　　）`,a:ans};
      if(kind==='word') return {q:`甲彩帶長 ${x.toFixed(1)} 公尺，乙彩帶長 ${y.toFixed(1)} 公尺，兩條彩帶接在一起共長幾公尺？`,a:`${x.toFixed(1)} + ${y.toFixed(1)} = ${ans}（公尺）`};
      if(kind==='match') return {q:'小數換算配對',pairs:[['5 個 0.1','0.5'],['10 個 0.1','1'],['2 個 1 和 4 個 0.1','2.4'],['1.8 － 0.6','1.2']]};
      return {q:`「${x.toFixed(1)} ＋ ${y.toFixed(1)}」的結果是多少？`,opts:uniqueOpts(ans,[(+ans+1).toFixed(1),(+ans-0.5).toFixed(1),(x*10+y).toFixed(1)]),a:ans,exp:`小數點對齊相加得 ${ans}。`};
    }
    if(uIdx===2){ // 單元三：時間、重量與容量計算
      const ml=pick([200,400,600,800]), L=rnd(2,5), kg=rnd(2,6), g0=rnd(150,850), hr=rnd(2,9);
      if(kind==='tf') return {q:`如圖，量杯裡有 ${ml} 毫公升的水，再加 ${isTrue?1000-ml:500} 毫公升就剛好是 1 公升。`,svg:svgBeaker(ml),a:isTrue?'○':'✕',exp:`1 公升＝1000 毫公升，1000－${ml}＝${1000-ml}。`};
      if(kind==='fill') return v(2)===0
        ? {q:`看量杯刻度：杯子裡的水量是（　　）毫公升；若再倒入 ${1000-ml} 毫公升就是 1 公升。`,svg:svgBeaker(ml),a:String(ml)}
        : {q:`${kg} 公斤 ${g0} 公克 ＝（　　　）公克；下午 ${hr} 時用 24 時制表示是（　　）時。`,a:`${kg*1000+g0}；${hr+12}`};
      if(kind==='calc') return {q:`${L} 公升 ${ml} 毫公升 ＝（　　　）毫公升`,svg:svgBeaker(ml),a:String(L*1000+ml)};
      if(kind==='word'){const h1=rnd(8,10),m1=rnd(20,45),dur=rnd(40,75),tot=h1*60+m1+dur;return {q:`電影上午 ${h1} 時 ${m1} 分開演，片長 ${dur} 分鐘，請問幾時幾分結束？`,svg:svgClock(h1,30),a:`${Math.floor(tot/60)} 時 ${tot%60} 分`};}
      if(kind==='match') return {q:'時間重量容量換算配對',pairs:[['1 公升','1000 毫公升'],['1 公斤','1000 公克'],['下午 3 時','15 時'],['1 小時 20 分','80 分鐘']]};
      return {q:`下午 ${hr} 時 30 分，用「24 時制」表示是幾時幾分？`,svg:svgClock(hr,30),opts:uniqueOpts(`${hr+12} 時 30 分`,[`${hr} 時 30 分`,`${hr+10} 時 30 分`,`24 時 ${hr} 分`]),a:`${hr+12} 時 30 分`,exp:`下午時間加 12 小時。`};
    }
    // uIdx===3 單元四：面積與乘除兩步驟應用
    const w0=rnd(6,12), h0=rnd(3,7), box=rnd(3,6), per=rnd(6,10), price=rnd(8,12);
    if(kind==='tf') return {q:`如圖，長 ${w0} 公分、寬 ${h0} 公分的長方形，面積是 ${isTrue?w0*h0:(w0+h0)*2} 平方公分。`,svg:svgRectDim(w0,h0,'公分'),a:isTrue?'○':'✕',exp:`長方形面積＝長×寬＝${w0*h0} 平方公分。`};
    if(kind==='fill') return {q:`如圖，長 ${w0} 公分、寬 ${h0} 公分的長方形，面積是（　　）平方公分。`,svg:svgRectDim(w0,h0,'公分'),a:String(w0*h0)};
    if(kind==='calc') return {q:`${per} × ${box} × ${price} ＝（　　　）`,a:String(per*box*price)};
    if(kind==='word') return {q:`一盒餅乾有 ${per} 片，買了 ${box} 盒，每片賣 ${price} 元，共要付多少元？`,a:`${per} × ${box} × ${price} = ${per*box*price}（元）`};
    if(kind==='match') return {q:'圖形面積配對',pairs:[['長 6cm 寬 4cm 長方形','24 平方公分'],['邊長 5cm 正方形','25 平方公分'],['長 8cm 寬 5cm 長方形','40 平方公分'],['邊長 6cm 正方形','36 平方公分']]};
    return {q:`如圖，長 ${w0} 公分、寬 ${h0} 公分的長方形，面積是多少平方公分？`,svg:svgRectDim(w0,h0,'公分'),opts:uniqueOpts(`${w0*h0} 平方公分`,[`${(w0+h0)*2} 平方公分`,`${w0+h0} 平方公分`,`${w0*h0+10} 平方公分`]),a:`${w0*h0} 平方公分`,exp:`面積＝長×寬＝${w0*h0} 平方公分。`};
  }

  // --- 4年級 ---
  if(g===4){
    if(sem==='上'){
      if(uIdx===0){ // 單元一：一億以內的數與概數
        const n=rnd(24,89)*1000+rnd(120,890), ans=Math.round(n/1000)*1000;
        if(kind==='tf') return {q:`10 個「一千萬」合起來是${isTrue?'一億':'一千萬'}。`,a:isTrue?'○':'✕',exp:`10 個一千萬是一億。`};
        if(kind==='fill') return {q:`將 ${n} 用「四捨五入法」取概數到千位是（　　　）。`,a:String(ans)};
        if(kind==='calc') return {q:`${rnd(2,6)}萬 ＋ ${rnd(1,3)}萬5000 ＝（　　　）`,a:'依題意相加'};
        if(kind==='word'){const p1=rnd(32,68)*1000,p2=rnd(15,29)*1000;return {q:`甲城市人口有 ${p1} 人，乙城市有 ${p2} 人，兩城市共約幾萬人（先四捨五入到萬位再相加）？`,a:`約 ${Math.round(p1/10000)+Math.round(p2/10000)} 萬人`};}
        if(kind==='match') return {q:'大數位值與概數配對',pairs:[['10 個一千萬','1 億'],['10 個十萬','100 萬'],['38200 四捨五入到千位','38000'],['38600 四捨五入到千位','39000']]};
        return {q:`將 ${n} 用「四捨五入法」取概數到千位是多少？`,opts:uniqueOpts(ans,[ans+1000,ans-1000,Math.floor(n/100)*100]),a:String(ans),exp:`看百位數字四捨五入得 ${ans}。`};
      }
      if(uIdx===1){ // 單元二：多位數乘除法
        const a=rnd(120,320), b=rnd(12,26), d=rnd(12,24), q0=rnd(11,28);
        if(kind==='tf') return {q:`算式「${d*q0} ÷ ${d}」的商是 ${isTrue?q0:q0+10}。`,a:isTrue?'○':'✕',exp:`${d*q0}÷${d}＝${q0}。`};
        if(kind==='fill') return {q:`完成計算：${a} × ${b} ＝（　　　）；${d*q0} ÷ ${d} ＝（　　）。`,a:`${a*b}；${q0}`};
        if(kind==='calc') return v(2)===0?{q:`${a} × ${b} ＝（　　　）`,a:String(a*b)}:{q:`${d*q0} ÷ ${d} ＝（　　）`,a:String(q0)};
        if(kind==='word') return {q:`果農採收了 ${d*q0} 顆水蜜桃，每 ${d} 顆裝成一盒，全部可以裝滿幾盒？`,a:`${d*q0} ÷ ${d} = ${q0}（盒）`};
        if(kind==='match') return {q:'乘除算式配對',pairs:[['125 × 8','1000'],['360 ÷ 12','30'],['240 × 20','4800'],['450 ÷ 15','30']]};
        return {q:`果農採收 ${d*q0} 顆蘋果，每 ${d} 顆裝一箱，共可裝幾箱？`,opts:uniqueOpts(`${q0} 箱`,[`${q0+2} 箱`,`${q0-2} 箱`,`${d} 箱`]),a:`${q0} 箱`,exp:`${d*q0}÷${d}＝${q0} 箱。`};
      }
      if(uIdx===2){ // 單元三：角度與三角形
        const a1=rnd(40,70), a2=rnd(35,65), a3=180-a1-a2, deg=rnd(40,135);
        if(kind==='tf') return {q:`一個三角形的三個內角分別是 ${a1}°、${a2}° 和 ${isTrue?a3:a3+10}°。`,a:isTrue?'○':'✕',exp:`三角形內角和必為 180°。`};
        if(kind==='fill') return v(2)===0
          ? {q:`如圖，一個平角 180° 減去 ${deg}° 後，剩下的角是（　　）°。`,svg:svgAngleArc(deg),a:String(180-deg)}
          : {q:`三角形的兩個內角分別為 ${a1}° 和 ${a2}°，第三個內角是（　　）°。`,a:String(a3)};
        if(kind==='calc') return {q:`看圖計算角度：180° － ${deg}° ＝（　　）°`,svg:svgAngleArc(deg),a:String(180-deg)};
        if(kind==='word') return {q:`一個等腰三角形的頂角是 ${a1*2<=100?a1*2:80}°，請問它的每一個底角是多少度？`,a:`(180° - ${a1*2<=100?a1*2:80}°) ÷ 2 = ${(180-(a1*2<=100?a1*2:80))/2}°`};
        if(kind==='match') return {q:'角度與三角形配對',pairs:[['直角','90°'],['平角','180°'],['周角','360°'],['正三角形每個內角','60°']]};
        return v(2)===0
          ? {q:`三邊等長、三個角都是 60° 的三角形稱為什麼？`,opts:uniqueOpts('正三角形',['直角三角形','鈍角三角形','不等邊三角形']),a:'正三角形',exp:`三邊等長即正三角形。`}
          : {q:`如圖，平角 180° 減去 ${deg}° 的角後，剩下的角是幾度？`,svg:svgAngleArc(deg),opts:uniqueOpts(`${180-deg}°`,[`${deg}°`,`${90-deg}°`,`${180+deg}°`]),a:`${180-deg}°`,exp:`180°－${deg}°＝${180-deg}°。`};
      }
      // uIdx===3 單元四：假分數、帶分數與公里計算
      const w=rnd(2,5), d=rnd(3,7), n=rnd(1,d-1), imp=w*d+n, km=rnd(2,5), m0=rnd(150,750);
      if(kind==='tf') return {q:`分子大於或等於分母的分數（如 ${imp}/${d}）稱為${isTrue?'假分數':'真分數'}。`,svg:svgFraction(n,d),a:isTrue?'○':'✕',exp:`分子≧分母為假分數。`};
      if(kind==='fill') return {q:`將假分數「${imp}/${d}」化成帶分數是（　　　　）。`,svg:svgFraction(n,d),a:`${w} 又 ${n}/${d}`};
      if(kind==='calc') return {q:`把帶分數「${w} 又 ${n}/${d}」化成假分數 ＝（　　）`,a:`${imp}/${d}`};
      if(kind==='word') return {q:`登山步道第一段長 ${km} 公里 ${m0} 公尺，第二段長 1 公里 200 公尺，兩段共長幾公尺？`,a:`${km*1000+m0} + 1200 = ${km*1000+m0+1200}（公尺）`};
      if(kind==='match') return {q:'假分數與帶分數互換配對',pairs:[['7/3','2 又 1/3'],['11/4','2 又 3/4'],['9/5','1 又 4/5'],['13/6','2 又 1/6']]};
      return {q:`把帶分數「${w} 又 ${n}/${d}」化成假分數是多少？`,svg:svgFraction(n,d),opts:uniqueOpts(`${imp}/${d}`,[`${w+n}/${d}`,`${w*n}/${d}`,`${imp-1}/${d}`]),a:`${imp}/${d}`,exp:`${w}×${d}＋${n}＝${imp}，得 ${imp}/${d}。`};
    }
    // 4年級下
    if(uIdx===0){ // 單元一：整數四則混合運算
      const a=rnd(12,35), b=rnd(3,8), c=rnd(15,50), ans=c+a*b;
      if(kind==='tf') return {q:isTrue?`計算「${c} ＋ ${a} × ${b}」時，應該先算乘法再算加法。`:`計算「${c} ＋ ${a} × ${b}」時，要由左到右先算 ${c} 加 ${a}。`,a:isTrue?'○':'✕',exp:`四則混合運算要先乘除後加減。`};
      if(kind==='fill') return {q:`先乘除後加減：${c} ＋ ${a} × ${b} ＝（　　　）。`,a:String(ans)};
      if(kind==='calc') return v(2)===0?{q:`${c} ＋ ${a} × ${b} ＝（　　　）`,a:String(ans)}:{q:`(${c} ＋ ${a}) × ${b} ＝（　　　）`,a:String((c+a)*b)};
      if(kind==='word'){const p1=rnd(25,55),p2=rnd(15,35),n0=rnd(3,6);return {q:`筆記本每本 ${p1} 元、原子筆每枝 ${p2} 元，買 ${n0} 本筆記本和 1 枝筆，付 500 元可找回幾元？`,a:`500 - (${p1} × ${n0} + ${p2}) = ${500-(p1*n0+p2)}（元）`};}
      if(kind==='match') return {q:'四則運算結果配對',pairs:[['10 ＋ 5 × 4','30'],['(10 ＋ 5) × 4','60'],['40 － 12 ÷ 3','36'],['(40 － 12) ÷ 4','7']]};
      return {q:`算式「${c} ＋ ${a} × ${b}」的正確答案為何？`,opts:uniqueOpts(ans,[(c+a)*b,ans+10,ans-5]),a:String(ans),exp:`先算 ${a}×${b}＝${a*b}，再加 ${c} 得 ${ans}。`};
    }
    if(uIdx===1){ // 單元二：二位小數與小數乘法
      const w=rnd(2,8), h=rnd(1,9), u=rnd(1,9), x=(rnd(12,48)/10), n0=rnd(3,8);
      if(kind==='tf') return {q:`「${w} 個 1、${h} 個 0.1 和 ${u} 個 0.01」合起來是 ${isTrue?`${w}.${h}${u}`:`${w}.${u}${h}`}。`,a:isTrue?'○':'✕',exp:`合起來是 ${w}.${h}${u}。`};
      if(kind==='fill') return {q:`「${w} 個 1、${h} 個 0.1 和 ${u} 個 0.01」合起來記作（　　　）。`,a:`${w}.${h}${u}`};
      if(kind==='calc') return {q:`${x.toFixed(1)} × ${n0} ＝（　　　）`,a:(x*n0).toFixed(1)};
      if(kind==='word') return {q:`一瓶柳橙汁有 ${x.toFixed(1)} 公升，媽媽買了 ${n0} 瓶，共有幾公升？`,svg:svgBeaker(600),a:`${x.toFixed(1)} × ${n0} = ${(x*n0).toFixed(1)}（公升）`};
      if(kind==='match') return {q:'二位小數配對',pairs:[['3 個 0.01','0.03'],['3 個 0.1','0.3'],['0.25 × 4','1'],['1.2 × 3','3.6']]};
      return {q:`「${w} 個 1、${h} 個 0.1 和 ${u} 個 0.01」合起來是多少？`,opts:uniqueOpts(`${w}.${h}${u}`,[`${w}.0${h}${u}`,`${w}${h}.${u}`,`0.${w}${h}${u}`]),a:`${w}.${h}${u}`,exp:`個位 ${w}、十分位 ${h}、百分位 ${u}。`};
    }
    if(uIdx===2){ // 單元三：周長與面積公式
      const w1=rnd(4,8), h1=rnd(6,10), w2=rnd(4,7), h2=rnd(3,5), m2=rnd(3,9), s=rnd(6,14);
      if(kind==='tf') return {q:`${m2} 平方公尺等於 ${isTrue?m2*10000:m2*100} 平方公分。`,a:isTrue?'○':'✕',exp:`1 平方公尺＝10000 平方公分。`};
      if(kind==='fill') return v(2)===0
        ? {q:`看圖計算這個 L 形複合圖形的面積是（　　）平方公分。`,svg:svgLShape(w1,h1,w2,h2),a:String(w1*h1+w2*h2)}
        : {q:`${m2} 平方公尺 ＝（　　　　）平方公分。`,a:String(m2*10000)};
      if(kind==='calc') return {q:`看圖計算複合圖形面積：${w1}×${h1} ＋ ${w2}×${h2} ＝（　　）平方公分`,svg:svgLShape(w1,h1,w2,h2),a:String(w1*h1+w2*h2)};
      if(kind==='word'){const w0=rnd(12,22),h0=rnd(8,14);return {q:`如圖，長方形木板長 ${w0} 公分、寬 ${h0} 公分，它的面積與周長各是多少？`,svg:svgRectDim(w0,h0,'公分'),a:`面積 ${w0*h0} 平方公分；周長 ${(w0+h0)*2} 公分`};}
      if(kind==='match') return {q:'面積與周長配對',pairs:[['1 平方公尺','10000 平方公分'],['邊長 8cm 正方形面積','64 平方公分'],['邊長 8cm 正方形周長','32 公分'],['長 10m 寬 5m 面積','50 平方公尺']]};
      return {q:`如圖，邊長 ${s} 公分的正方形，面積是多少平方公分？`,svg:svgRectDim(s,s,'公分'),opts:uniqueOpts(s*s,[s*4,s*2,s*s+10]),a:String(s*s),exp:`正方形面積＝邊長×邊長＝${s*s}。`};
    }
    // uIdx===3 單元四：統計圖表與規律
    const v1=rnd(8,16), v2=rnd(14,24), v3=rnd(6,15), v4=rnd(10,20), vs=[v1,v2,v3,v4], mx=Math.max(...vs);
    if(kind==='tf') return {q:`看長條圖，甲、乙、丙、丁四組中，人數最多的是 ${isTrue?['甲','乙','丙','丁'][vs.indexOf(mx)]:'丙'} 組。`,svg:svgBarChart(['甲','乙','丙','丁'],vs),a:isTrue?'○':'✕',exp:`最高長條為 ${mx} 人。`};
    if(kind==='fill') return {q:`看長條統計圖回答：數量最多的是（　）組，四組合起來共有（　　）人。`,svg:svgBarChart(['甲','乙','丙','丁'],vs),a:`${['甲','乙','丙','丁'][vs.indexOf(mx)]}；${v1+v2+v3+v4}`};
    if(kind==='calc') return {q:`看長條圖計算四組總人數：${v1} ＋ ${v2} ＋ ${v3} ＋ ${v4} ＝（　　）`,svg:svgBarChart(['甲','乙','丙','丁'],vs),a:String(v1+v2+v3+v4)};
    if(kind==='word') return {q:`看長條圖回答：人數最多的那一組（${mx} 人）比人數最少的那一組（${Math.min(...vs)} 人）多幾人？`,svg:svgBarChart(['甲','乙','丙','丁'],vs),a:`${mx} - ${Math.min(...vs)} = ${mx-Math.min(...vs)}（人）`};
    if(kind==='match') return {q:'統計圖表功能配對',pairs:[['長條圖','比較不同項目的數量多少'],['折線圖','觀察數量隨時間的變化趨勢'],['橫軸與縱軸','標示項目名稱與數量刻度'],['省略符號 ≈','濃縮沒有資料的數值區間']]};
    return {q:`看長條統計圖，甲（${v1}）、乙（${v2}）、丙（${v3}）、丁（${v4}）四組合起來共有幾人？`,svg:svgBarChart(['甲','乙','丙','丁'],vs),opts:uniqueOpts(`${v1+v2+v3+v4} 人`,[`${v1+v2+v3+v4+5} 人`,`${mx} 人`,`${v1+v2} 人`]),a:`${v1+v2+v3+v4} 人`,exp:`四組相加共 ${v1+v2+v3+v4} 人。`};
  }

  // --- 5年級 ---
  if(g===5){
    if(sem==='上'){
      if(uIdx===0){ // 單元一：因數、倍數與公因公倍
        const a=rnd(2,5)*6, b=rnd(2,5)*8, n0=pick([12,18,24,30]);
        if(kind==='tf') return {q:`${n0} 的最小因數是 1，最大因數是 ${isTrue?n0:n0/2}。`,a:isTrue?'○':'✕',exp:`最小因數是 1，最大因數是自己。`};
        if(kind==='fill') return {q:`${a} 和 ${b} 的最大公因數是（　　），最小公倍數是（　　）。`,a:`${gcd(a,b)}；${lcm(a,b)}`};
        if(kind==='calc') return {q:`求最大公因數與最小公倍數：(${a}, ${b}) ＝（　　）；[${a}, ${b}] ＝（　　）`,a:`${gcd(a,b)}；${lcm(a,b)}`};
        if(kind==='word') return {q:`有 ${a} 顆糖果和 ${b} 塊餅乾，要平分裝袋且每袋糖果、餅乾數量都一樣多又沒有剩下，最多可分裝成幾袋？`,a:`最大公因數 (${a}, ${b}) = ${gcd(a,b)}（袋）`};
        if(kind==='match') return {q:'因數與倍數配對',pairs:[['12 和 18 的最大公因數','6'],['4 和 6 的最小公倍數','12'],['同時是 2 和 5 的倍數','個位數是 0'],['3 的倍數判別法','各位數字和為 3 的倍數']]};
        return {q:`下列哪一個數「同時是 2 和 3 的倍數」？`,opts:uniqueOpts(24,[25,27,32]),a:'24',exp:`偶數且各位數字和為 3 的倍數。`};
      }
      if(uIdx===1){ // 單元二：擴分、約分與異分母分數加減
        const d1=rnd(2,5), d2=rnd(3,7);
        const realD2 = d1===d2 ? d2+1 : d2;
        const L=lcm(d1,realD2), n1=rnd(1,d1-1), n2=rnd(1,realD2-1), num=n1*(L/d1)+n2*(L/realD2), g0=gcd(num,L);
        if(kind==='tf'){const k=rnd(2,5);return {q:`把分數的分子和分母同乘以 ${k}，分數的值${isTrue?'不會改變（等值分數）':'會變大 '+k+' 倍'}。`,svg:svgFraction(n1,d1),a:isTrue?'○':'✕',exp:`擴分後為等值分數。`};}
        if(kind==='fill') return {q:`完成通分與加法：${n1}/${d1} ＋ ${n2}/${realD2} ＝（　　　）。`,svg:svgFraction(n1,d1),a:`${num/g0}/${L/g0}`};
        if(kind==='calc') return {q:`${n1}/${d1} ＋ ${n2}/${realD2} ＝（　　　）`,a:`${num/g0}/${L/g0}`};
        if(kind==='word') return {q:`紅絲帶長 ${n1}/${d1} 公尺，藍絲帶長 ${n2}/${realD2} 公尺，兩條絲帶合起來共長幾公尺？`,a:`${n1}/${d1} + ${n2}/${realD2} = ${num/g0}/${L/g0}（公尺）`};
        if(kind==='match') return {q:'等值分數與加減配對',pairs:[['1/2 ＋ 1/3','5/6'],['1/2 － 1/4','1/4'],['3/4 擴分後','9/12'],['12/18 約成最簡分數','2/3']]};
        return {q:`計算異分母分數加法「${n1}/${d1} ＋ ${n2}/${realD2}」的結果為何？`,opts:uniqueOpts(`${num/g0}/${L/g0}`,[`${n1+n2}/${d1+realD2}`,`${n1*n2}/${L}`,`1/${L}`]),a:`${num/g0}/${L/g0}`,exp:`通分後相加得 ${num/g0}/${L/g0}。`};
      }
      if(uIdx===2){ // 單元三：多邊形與面積公式、線對稱
        const b0=rnd(8,16), h0=rnd(4,12)*2, up=rnd(4,10), dn=rnd(8,16), n=rnd(3,8);
        if(kind==='tf') return {q:`如圖，底 ${b0} 公分、高 ${h0} 公分的三角形，面積是 ${isTrue?(b0*h0)/2:b0*h0} 平方公分。`,svg:svgTriangle(b0,h0),a:isTrue?'○':'✕',exp:`三角形面積＝底×高÷2＝${(b0*h0)/2}。`};
        if(kind==='fill') return v(2)===0
          ? {q:`看圖計算：上底 ${up}、下底 ${dn}、高 ${h0/2} 公分的梯形面積是（　　）平方公分。`,svg:svgTrapezoid(up,dn,h0/2),a:String((up+dn)*(h0/2)/2)}
          : {q:`看圖計算：底 ${b0} 公分、高 ${h0/2} 公分的平行四邊形面積是（　　）平方公分。`,svg:svgParallelogram(b0,h0/2),a:String(b0*(h0/2))};
        if(kind==='calc') return {q:`看圖計算梯形面積：（${up} ＋ ${dn}）× ${h0/2} ÷ 2 ＝（　　）`,svg:svgTrapezoid(up,dn,h0/2),a:String((up+dn)*(h0/2)/2)};
        if(kind==='word') return {q:`如圖，一塊底 ${b0} 公尺、高 ${h0/2} 公尺的平行四邊形草地，面積是多少平方公尺？`,svg:svgParallelogram(b0,h0/2),a:`${b0} × ${h0/2} = ${b0*(h0/2)}（平方公尺）`};
        if(kind==='match') return {q:'面積公式與對稱軸配對',pairs:[['平行四邊形面積','底 × 高'],['三角形面積','底 × 高 ÷ 2'],['梯形面積','(上底＋下底) × 高 ÷ 2'],['正五邊形的對稱軸','5 條']]};
        return v(2)===0
          ? {q:`看圖計算，底 ${b0} 公分、高 ${h0} 公分的三角形面積是多少平方公分？`,svg:svgTriangle(b0,h0),opts:uniqueOpts((b0*h0)/2,[b0*h0,b0+h0,(b0*h0)/2+10]),a:String((b0*h0)/2),exp:`底×高÷2＝${(b0*h0)/2}。`}
          : {q:`正 ${n} 邊形一共有幾條對稱軸？`,opts:uniqueOpts(`${n} 條`,[`${n*2} 條`,'1 條','2 條']),a:`${n} 條`,exp:`正 N 邊形有 N 條對稱軸。`};
      }
      // uIdx===3 單元四：整數與小數乘除、折線圖
      const vs=[rnd(18,21),rnd(23,26),rnd(28,32),rnd(22,25)], diffT=Math.max(...vs)-Math.min(...vs), a0=(rnd(12,38)/10), b0=rnd(3,9);
      if(kind==='tf') return {q:`看氣溫折線圖，最高溫是 15 時的 ${vs[2]} 度，最低溫是 9 時的 ${vs[0]} 度，相差 ${isTrue?diffT:diffT+3} 度。`,svg:svgLineGraph(['9時','12時','15時','18時'],vs),a:isTrue?'○':'✕',exp:`${vs[2]}－${vs[0]}＝${diffT} 度。`};
      if(kind==='fill') return {q:`看氣溫折線圖回答：最高溫與最低溫相差（　　）度。`,svg:svgLineGraph(['9時','12時','15時','18時'],vs),a:String(diffT)};
      if(kind==='calc') return {q:`${a0.toFixed(1)} × ${b0} ＝（　　）`,a:(a0*b0).toFixed(1)};
      if(kind==='word') return {q:`看折線圖回答：從上午 9 時（${vs[0]}°C）到下午 15 時（${vs[2]}°C），氣溫上升了幾度？`,svg:svgLineGraph(['9時','12時','15時','18時'],vs),a:`${vs[2]} - ${vs[0]} = ${vs[2]-vs[0]}（度）`};
      if(kind==='match') return {q:'小數與分配律計算配對',pairs:[['25 × 38 ＋ 25 × 62','2500'],['1.25 × 8','10'],['3.6 ＋ 2.45','6.05'],['5 － 1.38','3.62']]};
      return {q:`看氣溫折線圖，9 時到 18 時之間最高溫與最低溫相差幾度？`,svg:svgLineGraph(['9時','12時','15時','18時'],vs),opts:uniqueOpts(`${diffT} 度`,[`${diffT+2} 度`,`${diffT-2} 度`,`${vs[2]} 度`]),a:`${diffT} 度`,exp:`最高 ${Math.max(...vs)} 度減最低 ${Math.min(...vs)} 度＝${diffT} 度。`};
    }
    // 5年級下
    if(uIdx===0){ // 單元一：分數乘法與小數乘法
      const a0=(rnd(12,35)/10), b0=rnd(3,8);
      if(kind==='tf') return {q:`「0.85 × 0.9」的乘積會比被乘數 0.85 還要${isTrue?'小':'大'}。`,a:isTrue?'○':'✕',exp:`乘以小於 1 的數，積比被乘數小。`};
      if(kind==='fill') return {q:`小數乘法：${a0.toFixed(1)} × ${b0} ＝（　　　）；0.5 × 0.4 ＝（　　）。`,a:`${(a0*b0).toFixed(1)}；0.2`};
      if(kind==='calc') return {q:`${a0.toFixed(1)} × ${b0} ＝（　　　）`,a:(a0*b0).toFixed(1)};
      if(kind==='word') return {q:`每公尺鐵絲重 ${a0.toFixed(1)} 公斤，買 ${b0} 公尺鐵絲共重幾公斤？`,a:`${a0.toFixed(1)} × ${b0} = ${(a0*b0).toFixed(1)}（公斤）`};
      if(kind==='match') return {q:'分數與小數乘法配對',pairs:[['2/3 × 3/4','1/2'],['0.25 × 0.4','0.1'],['1.5 × 0.6','0.9'],['3/5 × 5/6','1/2']]};
      return {q:`「0.85 × 0.9」的積與被乘數 0.85 比較，結果如何？`,opts:uniqueOpts('比 0.85 小',['比 0.85 大','等於 0.85','無法比較']),a:'比 0.85 小',exp:`乘數 0.9＜1，積比被乘數小。`};
    }
    if(uIdx===1){ // 單元二：小數的除法
      const a=rnd(12,48), b=pick([2,4,5,8]);
      if(kind==='tf') return {q:`整數除以整數「${a} ÷ ${b}」的商是 ${isTrue?a/b:(a/b+1)}。`,a:isTrue?'○':'✕',exp:`${a}÷${b}＝${a/b}。`};
      if(kind==='fill') return {q:`小數除法計算：${a} ÷ ${b} ＝（　　　）。`,a:String(a/b)};
      if(kind==='calc') return {q:`小數除法：${a} ÷ ${b} ＝（　　　）`,a:String(a/b)};
      if(kind==='word') return {q:`把長 ${a} 公尺的繩子平分成 ${b} 段，每一段長多少公尺（以小數表示）？`,a:`${a} ÷ ${b} = ${a/b}（公尺）`};
      if(kind==='match') return {q:'小數除法配對',pairs:[['3 ÷ 4','0.75'],['7 ÷ 5','1.4'],['9 ÷ 2','4.5'],['1 ÷ 8','0.125']]};
      return {q:`計算「${a} ÷ ${b}」並以小數表示，答案是多少？`,opts:uniqueOpts(String(a/b),[String(a/b+0.5),String(a/b-0.25),String(a*b)]),a:String(a/b),exp:`${a}÷${b}＝${a/b}。`};
    }
    if(uIdx===2){ // 單元三：體積、容積與表面積
      const l=rnd(6,12), w=rnd(4,8), h=rnd(3,7), e=rnd(3,6), L=rnd(15,45)/10;
      if(kind==='tf') return {q:`如圖，邊長 ${e} 公分的正方體，體積是 ${isTrue?e*e*e:e*e*6} 立方公分。`,svg:svgBox3D(e,e,e),a:isTrue?'○':'✕',exp:`正方體體積＝${e}×${e}×${e}＝${e*e*e}。`};
      if(kind==='fill') return v(2)===0
        ? {q:`${L.toFixed(1)} 公升 ＝（　　　）毫公升 ＝（　　　）立方公分。`,svg:svgBeaker(600),a:`${L*1000}；${L*1000}`}
        : {q:`邊長 ${e} 公尺的正方體，體積是（　　）立方公尺，表面積是（　　）平方公尺。`,svg:svgBox3D(e,e,e),a:`${e*e*e}；${e*e*6}`};
      if(kind==='calc') return {q:`看圖計算這個長方體的體積是多少立方公分？`,svg:svgBox3D(l,w,h),a:String(l*w*h)};
      if(kind==='word') return {q:`如圖，水箱內部尺寸長 ${l} 公分、寬 ${w} 公分、高 ${h} 公分，最多可裝幾毫公升的水？`,svg:svgBox3D(l,w,h),a:`${l} × ${w} × ${h} = ${l*w*h}（毫公升）`};
      if(kind==='match') return {q:'體積與容積單位配對',pairs:[['1 立方公尺','1000000 立方公分'],['1 公升','1000 立方公分'],['1 毫公升','1 立方公分'],['正方體表面積','邊長×邊長×6']]};
      return v(2)===0
        ? {q:`如圖，長 ${l}cm、寬 ${w}cm、高 ${h}cm 的長方體體積是多少？`,svg:svgBox3D(l,w,h),opts:uniqueOpts(`${l*w*h} 立方公分`,[`${(l+w+h)*4} 立方公分`,`${l*w*2} 立方公分`,`${l*w*h+20} 立方公分`]),a:`${l*w*h} 立方公分`,exp:`長×寬×高＝${l*w*h} 立方公分。`}
        : {q:`邊長 ${e} 公分的正方體，表面積是多少平方公分？`,svg:svgBox3D(e,e,e),opts:uniqueOpts(e*e*6,[e*e*e,e*e*4,e*6]),a:String(e*e*6),exp:`邊長×邊長×6＝${e*e*6}。`};
    }
    // uIdx===3 單元四：比率、百分率與大單位
    const pct=pick([20,25,40,75,80]), t0=rnd(2,9), orig=rnd(4,12)*100, off=pick([75,80,85,90]);
    if(kind==='tf') return {q:`將百分率「${pct}%」化成小數是 ${isTrue?(pct/100).toFixed(2):(pct/10).toFixed(1)}。`,svg:svgPieChart(pct,'甲項',100-pct,'乙項'),a:isTrue?'○':'✕',exp:`${pct}% ＝ ${(pct/100).toFixed(2)}。`};
    if(kind==='fill') return v(2)===0
      ? {q:`${t0} 公噸 ＝（　　　）公斤；${t0} 公頃 ＝（　　　）公畝。`,a:`${t0*1000}；${t0*100}`}
      : {q:`看圓形圖，將百分率「${pct}%」化為最簡分數是（　　），化為小數是（　　）。`,svg:svgPieChart(pct,'項目A',100-pct,'其他'),a:`${pct/gcd(pct,100)}/${100/gcd(pct,100)}；${(pct/100).toFixed(2).replace(/0$/,'')}`};
    if(kind==='calc') return {q:`原價 ${orig} 元打 ${off%10===0?off/10:off} 折（${off}%）後的售價 ＝（　　　）元`,a:String(orig*off/100)};
    if(kind==='word') return {q:`外套原價 ${orig} 元，週年慶打 ${off%10===0?off/10:off} 折（${off}%），現在買需付幾元？`,a:`${orig} × ${off}% = ${orig*off/100}（元）`};
    if(kind==='match') return {q:'百分率與大單位換算配對',pairs:[['0.25','25%'],['3/4','75%'],['1 公噸','1000 公斤'],['1 公頃','100 公畝']]};
    return {q:`小數 ${(pct/100).toFixed(2)} 化成百分率是多少？`,svg:svgPieChart(pct,'A',100-pct,'B'),opts:uniqueOpts(`${pct}%`,[`${pct/10}%`,`${pct*10}%`,`0.${pct}%`]),a:`${pct}%`,exp:`小數乘 100 加上 %。`};
  }

  // --- 6年級 ---
  if(sem==='上'){
    if(uIdx===0){ // 單元一：最大公因數與最小公倍數進階、質數
      const p=pick([2,3,5,7,11,13,17,19]), n=pick([12,18,20,28,30,45]);
      const pf=[]; let tmp=n; for(let k=2;k<=tmp;k++){while(tmp%k===0){pf.push(k);tmp/=k;}}
      if(kind==='tf') return {q:isTrue?`所有的質數中，唯一的偶數是 2，且 1 不是質數也不是合數。`:`1 是最小的質數，所有的奇數都是質數。`,a:isTrue?'○':'✕',exp:`最小的質數是 2，1 不是質數。`};
      if(kind==='fill') return {q:`將 ${n} 做質因數分解：${n} ＝（　　　　　）。`,a:pf.join(' × ')};
      if(kind==='calc') return {q:`將 ${n} 質因數分解，並求出 ${n} 與 24 的最大公因數 ＝（　　）`,a:`${pf.join('×')}；最大公因數 ${gcd(n,24)}`};
      if(kind==='word'){const a=rnd(2,4)*12,b=rnd(2,4)*18;return {q:`長 ${a} 公分、寬 ${b} 公分的長方形紙張，要剪成大小相同且邊長為最大整數公分的正方形，正方形邊長最大是幾公分？`,svg:svgRectDim(a,b,'公分'),a:`(${a}, ${b}) = ${gcd(a,b)}（公分）`};}
      if(kind==='match') return {q:'質數與質因數分解配對',pairs:[['最小的質數','2'],['最小的合數','4'],['12 的質因數分解','2 × 2 × 3'],['18 的質因數分解','2 × 3 × 3']]};
      return {q:`下列哪一個數是「質數」？`,opts:uniqueOpts(p,[1,15,21,27]),a:String(p),exp:`${p} 只有 1 和自己兩個因數。`};
    }
    if(uIdx===1){ // 單元二：分數除法與小數除法
      const a=rnd(2,5), b=rnd(3,7), d1=rnd(2,5), d2=rnd(3,7);
      if(kind==='tf') return {q:`計算分數除法「÷ ${d1}/${d2}」時，可以改寫成「× ${isTrue?`${d2}/${d1}`:`${d1}/${d2}`}」來計算。`,a:isTrue?'○':'✕',exp:`除以分數等於乘以它的倒數。`};
      if(kind==='fill') return {q:`分數除法計算：${a} ÷ ${b}/${a+b} ＝（　　　）。`,a:`${a*(a+b)}/${b}`};
      if(kind==='calc') return {q:`分數除法：${a} ÷ ${b}/${a+b} ＝（　　　）`,a:`${a*(a+b)}/${b}`};
      if(kind==='word') return {q:`把 ${a} 公升的果汁，每 1/${b} 公升裝成一杯，全部可以裝滿幾杯？`,svg:svgBeaker(800),a:`${a} ÷ 1/${b} = ${a*b}（杯）`};
      if(kind==='match') return {q:'分數與小數除法配對',pairs:[['2 ÷ 1/3','6'],['3/4 ÷ 3/8','2'],['1.2 ÷ 0.4','3'],['0.48 ÷ 0.6','0.8']]};
      return {q:`計算「${a} ÷ 1/${b}」的答案是多少？`,opts:uniqueOpts(String(a*b),[String(a/b),`${a}/${b}`,`1/${a*b}`]),a:String(a*b),exp:`${a}×${b}＝${a*b}。`};
    }
    if(uIdx===2){ // 單元三：比、比值與正比
      const a=rnd(2,5)*3, b=rnd(2,5)*4, g0=gcd(a,b), sc=pick([1000,5000,10000]), cm=rnd(2,6);
      if(kind==='tf') return {q:isTrue?`「${a} ： ${b}」的最簡單整數比是「${a/g0} ： ${b/g0}」，且成正比的兩數量比值固定。`:`甲和乙成正比時，甲變大 3 倍，乙會變小 1/3 倍。`,a:isTrue?'○':'✕',exp:`前後項同除以 ${g0} 得最簡整數比。`};
      if(kind==='fill') return v(2)===0
        ? {q:`比例尺 1：${sc} 的地圖上，長 ${cm} 公分的路線實際長度是（　　）公尺。`,svg:svgCompassRose(),a:String(cm*sc/100)}
        : {q:`甲、乙兩數的比是 ${a/g0}：${b/g0}，若甲數是 ${a*2}，則乙數是（　　）。`,a:String(b*2)};
      if(kind==='calc') return {q:`化為最簡單整數比：「${a} ： ${b}」＝（　　　）`,a:`${a/g0} ： ${b/g0}`};
      if(kind==='word'){const r1=2,r2=3,tot=rnd(3,9)*100;return {q:`把 ${tot} 元按照 ${r1} ： ${r2} 的比例分給${nm}和${nm2}，兩人各分得多少元？`,a:`${nm} ${tot*r1/5} 元，${nm2} ${tot*r2/5} 元`};}
      if(kind==='match') return {q:'比與比值配對',pairs:[['3 ： 4 的比值','3/4（或 0.75）'],['12 ： 18 最簡比','2 ： 3'],['比例尺 1:100','圖上 1cm 代表實際 1m'],['圓周長與直徑','成正比']]};
      return v(2)===0
        ? {q:`「${a} ： ${b}」的比值是多少？`,opts:uniqueOpts(`${a/g0}/${b/g0}`,[`${b/g0}/${a/g0}`,`${a+b}`,`${a*b}`]),a:`${a/g0}/${b/g0}`,exp:`比值＝前項÷後項。`}
        : {q:`甲和乙兩個數量成正比，當甲變為原來的 3 倍時，乙會如何變化？`,opts:uniqueOpts('變為原來的 3 倍',['變為原來的 1/3 倍','維持不變','變為原來的 6 倍']),a:'變為原來的 3 倍',exp:`成正比時同乘以 3 倍。`};
    }
    // uIdx===3 單元四：圓周長、圓面積與扇形（5種不同子題型輪替）
    const r0=rnd(4,10), deg=pick([60,90,120,180]), fr={60:'1/6',90:'1/4',120:'1/3',180:'1/2'}[deg], sub=v(5);
    if(kind==='tf'){
      if(sub===0) return {q:`如圖，半徑 ${r0} 公分的圓，圓周長大約是 ${isTrue?(r0*2*3.14).toFixed(2):(r0*3.14).toFixed(2)} 公分（π＝3.14）。`,svg:svgCircle(r0,false),a:isTrue?'○':'✕',exp:`圓周長＝直徑×3.14＝${(r0*2*3.14).toFixed(2)}。`};
      if(sub===1) return {q:`如圖，圓心角 ${deg}° 的扇形，是 ${isTrue?fr:'1/5'} 個圓。`,svg:svgSector(10,deg),a:isTrue?'○':'✕',exp:`${deg}°÷360°＝${fr}。`};
      if(sub===2) return {q:isTrue?`當圓的半徑變為原來的 2 倍時，圓周長也會變為原來的 2 倍。`:`當圓的半徑變為原來的 2 倍時，圓周率 π 也會變為 2 倍。`,a:isTrue?'○':'✕',exp:`圓周率固定約 3.14，半徑變 2 倍則周長變 2 倍、面積變 4 倍。`};
      if(sub===3) return {q:`圓心角 180° 的扇形就是半圓，它的面積是整個圓面積的 ${isTrue?'1/2':'1/4'}。`,a:isTrue?'○':'✕',exp:`180°÷360°＝1/2。`};
      return {q:`直徑 ${r0*2} 公分的圓，半徑是 ${isTrue?r0:r0*4} 公分，圓面積約 ${(r0*r0*3.14).toFixed(2)} 平方公分。`,svg:svgCircle(r0*2,true),a:isTrue?'○':'✕',exp:`半徑＝直徑÷2＝${r0} 公分。`};
    }
    if(kind==='fill'){
      if(sub===0) return {q:`如圖，半徑 10 公分、圓心角 ${deg}° 的扇形，面積約（　　　）平方公分。（π＝3.14）`,svg:svgSector(10,deg),a:(314*(deg/360)).toFixed(1).replace(/\.0$/,'')};
      if(sub===1) return {q:`如圖，直徑 ${r0*2} 公分的圓，圓周長約（　　　）公分。（π＝3.14）`,svg:svgCircle(r0*2,true),a:(r0*2*3.14).toFixed(2).replace(/\.00$/,'')};
      if(sub===2) return {q:`一個圓周長為 ${(r0*2*3.14).toFixed(2)} 公分的圓，它的直徑約（　　）公分，半徑約（　　）公分。`,a:`${r0*2}；${r0}`};
      if(sub===3) return {q:`圓心角 ${deg}° 的扇形是（　　）個圓（填最簡分數），弧長約為圓周長的（　　）。`,svg:svgSector(10,deg),a:`${fr}；${fr}`};
      return {q:`如圖，半徑 ${r0} 公分的圓，圓面積約（　　　）平方公分。（π＝3.14）`,svg:svgCircle(r0,false),a:(r0*r0*3.14).toFixed(2).replace(/\.00$/,'')};
    }
    if(kind==='calc') return v(2)===0
      ? {q:`看圖計算，半徑 ${r0} 公分的圓面積大約是多少平方公分？（π＝3.14）`,svg:svgCircle(r0,false),a:(r0*r0*3.14).toFixed(2).replace(/\.00$/,'')}
      : {q:`看圖計算，半徑 10cm、圓心角 ${deg}° 的扇形弧長約多少公分？（π＝3.14）`,svg:svgSector(10,deg),a:(20*3.14*deg/360).toFixed(2).replace(/\.00$/,'')};
    if(kind==='word') return v(2)===0
      ? {q:`如圖，一個半徑 10 公分、圓心角 ${deg}° 的扇形花圃，面積大約是多少平方公分？（π＝3.14）`,svg:svgSector(10,deg),a:`10 × 10 × 3.14 × (${deg}/360) = ${(314*deg/360).toFixed(1)}（平方公分）`}
      : {q:`用一條長 ${(r0*2*3.14).toFixed(2)} 公分的繩子圍成一個最大的圓，這個圓的半徑大約是幾公分？（π＝3.14）`,svg:svgCircle(r0,false),a:`${(r0*2*3.14).toFixed(2)} ÷ 3.14 ÷ 2 = ${r0}（公分）`};
    if(kind==='match') return {q:'圓與扇形公式配對',pairs:[['圓周長公式','直徑 × 3.14'],['圓面積公式','半徑 × 半徑 × 3.14'],['圓心角 90° 扇形','1/4 圓'],['圓心角 120° 扇形','1/3 圓']]};
    if(sub===0) return {q:`如圖，圓心角 ${deg}° 的扇形面積是整個圓面積的幾分之幾？`,svg:svgSector(10,deg),opts:uniqueOpts(fr,['1/2','1/3','1/4','1/6','1/8']),a:fr,exp:`${deg}°÷360°＝${fr}。`};
    if(sub===1) return {q:`如圖，半徑 ${r0} 公分的圓，面積大約是多少平方公分？（π＝3.14）`,svg:svgCircle(r0,false),opts:uniqueOpts((r0*r0*3.14).toFixed(2),[(r0*2*3.14).toFixed(2),(r0*r0).toFixed(2),(r0*3.14).toFixed(2)]),a:(r0*r0*3.14).toFixed(2),exp:`圓面積＝半徑×半徑×3.14。`};
    if(sub===2) return {q:`如圖，直徑 ${r0*2} 公分的圓，圓周長大約是多少公分？（π＝3.14）`,svg:svgCircle(r0*2,true),opts:uniqueOpts((r0*2*3.14).toFixed(2),[(r0*3.14).toFixed(2),(r0*r0*3.14).toFixed(2),String(r0*2)]),a:(r0*2*3.14).toFixed(2),exp:`圓周長＝直徑×3.14。`};
    if(sub===3){const f0=pick([[1,4,90],[1,2,180],[1,6,60],[1,3,120]]);return {q:`「${f0[0]}/${f0[1]} 圓」的扇形，它的圓心角是幾度？`,svg:svgSector(10,f0[2]),opts:uniqueOpts(`${f0[2]}°`,['45°','60°','90°','120°','180°']),a:`${f0[2]}°`,exp:`360° × ${f0[0]}/${f0[1]} ＝ ${f0[2]}°。`};}
    return {q:`當圓的半徑變為原來的 3 倍時，圓面積會變為原來的幾倍？`,opts:uniqueOpts('9 倍',['3 倍','6 倍','3.14 倍']),a:'9 倍',exp:`面積與半徑平方成正比，3×3＝9 倍。`};
  }
  // 6年級下
  if(uIdx===0){ // 單元一：分數與小數四則混合、成本加成
    const base=rnd(200,500), pct=pick([20,25,30]);
    if(kind==='tf') return {q:`成本 ${base} 元的商品加計 ${pct}% 作為定價，定價是 ${isTrue?base*(100+pct)/100:base+pct} 元。`,a:isTrue?'○':'✕',exp:`${base}×(1＋${pct}%)＝${base*(100+pct)/100} 元。`};
    if(kind==='fill') return {q:`一件成本 ${base} 元的外套，加計 ${pct}% 作為定價，定價是（　　　）元。`,a:String(base*(100+pct)/100)};
    if(kind==='calc') return {q:`${base} × (1 ＋ ${pct}%) ＝（　　　）`,a:String(base*(100+pct)/100)};
    if(kind==='word') return {q:`一件襯衫成本 ${base} 元，老闆加計 ${pct}% 作為定價，請問定價是多少元？`,a:`${base} × (1 + ${pct}%) = ${base*(100+pct)/100}（元）`};
    if(kind==='match') return {q:'分數小數四則互化配對',pairs:[['0.75 ＋ 1/4','1'],['1.2 × 5/6','1'],['加計二成五','乘以 125%'],['打八折','乘以 80%']]};
    return {q:`成本 ${base} 元的商品，加計 ${pct}% 後的定價是多少元？`,opts:uniqueOpts(`${base*(100+pct)/100} 元`,[`${base+pct} 元`,`${base*pct/100} 元`,`${base*2} 元`]),a:`${base*(100+pct)/100} 元`,exp:`${base}×(1+${pct}%)＝${base*(100+pct)/100} 元。`};
  }
  if(uIdx===1){ // 單元二：速率問題
    const v0=rnd(50,90), hr=rnd(2,5), s1=rnd(55,75), s2=rnd(45,65);
    if(kind==='tf') return {q:isTrue?`當速率固定時，行駛的距離和所花的時間成正比。`:`走相同的距離，速率越快，所花的時間就越長。`,a:isTrue?'○':'✕',exp:`距離＝速率×時間。`};
    if(kind==='fill') return {q:`每秒 10 公尺 ＝ 每分鐘（　　　）公尺 ＝ 時速（　　）公里。`,a:'600；36'};
    if(kind==='calc') return {q:`時速 ${v0} 公里行駛 ${hr} 小時的距離 ＝（　　　）公里`,a:String(v0*hr)};
    if(kind==='word') return v(2)===0
      ? {q:`兩車從同一地點同時反方向出發，甲車時速 ${s1} 公里、乙車時速 ${s2} 公里，3 小時後兩車相距幾公里？`,a:`(${s1} + ${s2}) × 3 = ${(s1+s2)*3}（公里）`}
      : {q:`火車以時速 ${v0} 公里行駛 ${hr} 小時，共行駛了幾公里？`,a:`${v0} × ${hr} = ${v0*hr}（公里）`};
    if(kind==='match') return {q:'速率公式與換算配對',pairs:[['距離 ÷ 時間','速率'],['速率 × 時間','距離'],['分速 60 公尺','秒速 1 公尺'],['時速 60 公里','分速 1 公里']]};
    return {q:`汽車以時速 ${v0} 公里行駛 ${hr} 小時，共走了幾公里？`,opts:uniqueOpts(`${v0*hr} 公里`,[`${Math.round(v0/hr)} 公里`,`${v0*hr+v0} 公里`,`${v0+hr} 公里`]),a:`${v0*hr} 公里`,exp:`距離＝速率×時間＝${v0*hr} 公里。`};
  }
  if(uIdx===2){ // 單元三：柱體體積、表面積與統計圖
    const r0=rnd(3,8), h0=rnd(5,12), n=rnd(5,8), tot=200, pA=pick([35,40,45]), pB=pick([25,30]);
    if(kind==='tf') return {q:isTrue?`如圖，角柱與圓柱的體積都可以用「底面積 × 柱高」來計算。`:`圓柱的側面展開後是一個圓形。`,svg:svgCylinder(r0,h0),a:isTrue?'○':'✕',exp:`柱體體積＝底面積×高；圓柱側面展開為長方形。`};
    if(kind==='fill') return {q:`看社團圓形圖：若全校有 ${tot} 人，參加籃球社（${pA}%）的有（　　）人，音樂社（${pB}%）有（　　）人。`,svg:svgPieChart(pA,'籃球',pB,'音樂'),a:`${tot*pA/100}；${tot*pB/100}`};
    if(kind==='calc') return {q:`看圖計算圓柱體積（π＝3.14）：底面半徑 ${r0}cm、高 ${h0}cm ＝（　　　）立方公分`,svg:svgCylinder(r0,h0),a:(r0*r0*3.14*h0).toFixed(1).replace(/\.0$/,'')};
    if(kind==='word') return {q:`如圖，底面半徑 ${r0} 公分、高 ${h0} 公分的圓柱體罐子，體積約多少立方公分？（π＝3.14）`,svg:svgCylinder(r0,h0),a:`${r0}×${r0}×3.14×${h0} = ${(r0*r0*3.14*h0).toFixed(1)}（立方公分）`};
    if(kind==='match') return {q:'柱體與圓形圖性質配對',pairs:[['圓柱體積','底面積 × 柱高'],['圓柱側面展開圖','長方形'],['五角柱的面數','7 個面'],['圓形圖各扇形百分率總和','100%']]};
    return v(2)===0
      ? {q:`${n} 角柱共有幾個面、幾個頂點？`,opts:uniqueOpts(`${n+2} 個面、${n*2} 個頂點`,[`${n} 個面、${n} 個頂點`,`${n+1} 個面、${n+1} 個頂點`,`${n*2} 個面、${n+2} 個頂點`]),a:`${n+2} 個面、${n*2} 個頂點`,exp:`N 角柱有 N+2 個面、2N 個頂點。`}
      : {q:`看圓形圖，若全班有 40 人，參加籃球（40%）比音樂（35%）多幾人？`,svg:svgPieChart(40,'籃球',35,'音樂'),opts:uniqueOpts('2 人',['4 人','5 人','8 人']),a:'2 人',exp:`40 × (40% - 35%) ＝ 2 人。`};
  }
  // uIdx===3 單元四：未知數列式與總複習
  const x=rnd(4,16), k=rnd(3,8), c=rnd(5,20);
  if(kind==='tf') return {q:`在方程式「${k} × x ＋ ${c} ＝ ${k*x+c}」中，未知數 x 的值是 ${isTrue?x:x+2}。`,a:isTrue?'○':'✕',exp:`${k}×${x}＋${c}＝${k*x+c}，故 x＝${x}。`};
  if(kind==='fill') return {q:`若 y ＝ x ＋ ${c}，當 x ＝ ${x} 時，y ＝（　　）；當 y ＝ ${x+c+10} 時，x ＝（　　）。`,a:`${x+c}；${x+10}`};
  if(kind==='calc') return {q:`解方程式：${k} × x ＋ ${c} ＝ ${k*x+c}，x ＝（　　）`,a:String(x)};
  if(kind==='word') return {q:`一盒鉛筆有 x 枝，老師買了 ${k} 盒又多送 ${c} 枝，共有 ${k*x+c} 枝，請問一盒鉛筆有幾枝？`,a:`(${k*x+c} - ${c}) ÷ ${k} = ${x}（枝）`};
  if(kind==='match') return {q:'未知數列式配對',pairs:[['x ＋ 15 ＝ 40','x ＝ 25'],['3 × x ＝ 36','x ＝ 12'],['x ÷ 4 ＝ 9','x ＝ 36'],['50 － x ＝ 18','x ＝ 32']]};
  return {q:`解方程式「${k} × x ＋ ${c} ＝ ${k*x+c}」，請問 x 是多少？`,opts:uniqueOpts(x,[x+2,x-1,k+c]),a:String(x),exp:`(${k*x+c}－${c})÷${k}＝${x}。`};
}

// 嚴格鎖定單元的多變化題庫擴充（確保任選單一單元就能產出 25～40 題不重版型、絕不跨單元洩漏）
function genMathUnitExtra(g, sem, uIdx, diff, kind, vIdx=0){
  const hard=diff==='hard', easy=diff==='easy';
  const nm=pick(NAMES), nm2=pick(NAMES.filter(x=>x!==nm)), it=pick(ITEMS);
  const slot = Math.abs(vIdx) % 5;
  const isTrue = (vIdx + randSeed) % 2 === 0;

  // --- 1年級 ---
  if(g===1 && sem==='上'){
    if(uIdx===0){ // 10以內的數與分合
      const a=rnd(2,6), b=rnd(1,10-a), tot=a+b;
      if(kind==='mc'){
        if(slot===1){const n1=rnd(1,4),n2=rnd(5,7),n3=rnd(8,10);return {q:`把「${n2}、${n3}、${n1}」由小到大排列，排在中間的數是多少？`,opts:uniqueOpts(n2,[n1,n3,n2+1]),a:String(n2),exp:`由小到大為 ${n1}＜${n2}＜${n3}。`};}
        if(slot===2){const k=rnd(2,6),totN=rnd(7,10);return {q:`排隊買票時，從左邊算起${nm}排在第 ${k} 個，共有 ${totN} 人，她的右邊還有幾人？`,svg:svgRowCount(totN),opts:uniqueOpts(`${totN-k} 人`,[`${k} 人`,`${k-1} 人`,`${totN-k+1} 人`]),a:`${totN-k} 人`,exp:`${totN} 扣掉含她的 ${k} 人剩 ${totN-k} 人。`};}
        if(slot===3){return {q:`把 ${tot} 顆糖果分成兩堆，其中一堆有 ${a} 顆，另一堆有幾顆？`,svg:svgButterfly(tot,a,'?'),opts:uniqueOpts(`${b} 顆`,[`${a} 顆`,`${b+1} 顆`,`${tot} 顆`]),a:`${b} 顆`,exp:`${tot} 可以分成 ${a} 和 ${b}。`};}
        const half=rnd(2,5);return {q:`兩個一樣大的數合起來剛好是 ${half*2}，這個數是多少？`,opts:uniqueOpts(half,[half+1,Math.max(1,half-1),half*2]),a:String(half),exp:`${half} 和 ${half} 合起來是 ${half*2}。`};
      }
      if(kind==='tf'){
        if(slot===1){const x=rnd(3,9),y=rnd(1,x-1);return {q:`數字比較：「${x}」比「${y}」大，所以可以寫作 ${isTrue?`${x} ＞ ${y}`:`${x} ＜ ${y}`}。`,a:isTrue?'○':'✕',exp:`開口朝向較大的數：${x} ＞ ${y}。`};}
        if(slot===2){const k=rnd(3,8);return {q:`從 1 開始一個一個往上數，數到 ${k} 時，下一個數是 ${isTrue?k+1:k-1}。`,a:isTrue?'○':'✕',exp:`${k} 往下一個數是 ${k+1}。`};}
        if(slot===3){return {q:`「${tot}」可以分成 ${a} 和 ${isTrue?b:b+1}。`,a:isTrue?'○':'✕',exp:`${a} 和 ${b} 合起來是 ${tot}。`};}
        return {q:`從 10 開始倒數 2 個數（10、9、□），會數到 ${isTrue?8:7}。`,a:isTrue?'○':'✕',exp:`10 倒數 2 個數是 8。`};
      }
      if(kind==='fill'){
        if(slot===1){const st=rnd(1,5);return {q:`一個一個順數：${st} → ${st+1} →（　）→ ${st+3} →（　）。`,a:`${st+2}；${st+4}`};}
        if(slot===2){const x=rnd(2,8),y=rnd(3,9);const sym=x>y?'＞':(x<y?'＜':'＝');return {q:`比大小（請填 ＞、＜ 或 ＝）：${x}（　）${y}。`,a:sym};}
        if(slot===3){const k=rnd(2,7),totN=rnd(8,10);return {q:`共有 ${totN} 個圓圈，從右邊數起第 ${k} 個，從左邊數起是第（　）個。`,svg:svgRowCount(totN),a:String(totN-k+1)};}
        return {q:`分與合填空：${a} 和 ${b} 合起來是（　）；10 可以分成 ${a} 和（　）。`,a:`${tot}；${10-a}`};
      }
      if(kind==='calc'){
        if(slot===1) return {q:`數的分合：${a} 和（　）合起來是 ${tot}`,a:String(b)};
        if(slot===2) return {q:`把 10 分成 ${a} 和（　）`,a:String(10-a)};
        return {q:`數一數並合起來：${a} 和 ${b} 合起來是（　）`,a:String(tot)};
      }
      if(kind==='word'){
        if(slot===1) return {q:`${nm}左手拿了 ${a} 顆彈珠，右手拿的彈珠和左手合起來共有 ${tot} 顆，右手有幾顆彈珠？`,a:`${tot} 可以分成 ${a} 和 ${b}，右手有 ${b} 顆`};
        return {q:`從 1 號開始排隊，${nm}前面有 ${a} 位同學，後面有 ${b-1>0?b-1:1} 位同學，這一排共有幾位同學？`,a:`${a} + 1 + ${b-1>0?b-1:1} = ${a+1+(b-1>0?b-1:1)}（位）`};
      }
      if(kind==='match') return {q:'10以內數字順序與分合配對',pairs:[['9 的下一個數','10'],['6 和 4 合起來','10'],['比 7 小 1 的數','6'],['5 和 3 合起來','8']]};
    }
    if(uIdx===1){ // 10以內的加減法
      const a=rnd(2,5), b=rnd(2,5), c=rnd(1,3);
      if(kind==='mc'){
        if(slot===1) return {q:`下列哪一個算式的答案等於「${a+b}」？`,opts:uniqueOpts(`${a} ＋ ${b}`,[`${a} ＋ ${b+1}`,`${a+b} － 1`,`${a+1} ＋ ${b+1}`]),a:`${a} ＋ ${b}`,exp:`${a}＋${b}＝${a+b}。`};
        if(slot===2) return {q:`桌上有 ${a+b} 個杯子，打破了 ${c} 個後，還剩下幾個完好的杯子？`,opts:uniqueOpts(`${a+b-c} 個`,[`${a+b+c} 個`,`${a+b-c-1} 個`,`${c} 個`]),a:`${a+b-c} 個`,exp:`${a+b}－${c}＝${a+b-c} 個。`};
        if(slot===3) return {q:`「${a+b} －（　）＝ ${b}」，括號裡面應該填多少？`,opts:uniqueOpts(a,[b,a+1,a+b]),a:String(a),exp:`${a+b}－${a}＝${b}。`};
        return {q:`盒裡原本有 ${a} 枝彩色筆，又放進 ${b} 枝，現在盒裡有幾枝？`,opts:uniqueOpts(`${a+b} 枝`,[`${a+b-1} 枝`,`${a} 枝`,`${b} 枝`]),a:`${a+b} 枝`,exp:`${a}＋${b}＝${a+b} 枝。`};
      }
      if(kind==='tf'){
        if(slot===1) return {q:`算式檢查：「${a+b} － 0」的結果等於 ${isTrue?a+b:0}。`,a:isTrue?'○':'✕',exp:`任何數減 0 還是原來的數。`};
        return {q:`「${a} ＋ ${b}」和「${a+b} － 0」算出來的答案一樣大。`,a:'○',exp:`兩者皆等於 ${a+b}。`};
      }
      if(kind==='fill'){
        if(slot===1) return {q:`填填看：${a} ＋（　）＝ ${a+b}；${a+b} －（　）＝ ${a}。`,a:`${b}；${b}`};
        return {q:`比大小（填 ＞、＜ 或 ＝）：「${a} ＋ ${b}」（　）「${a+b+1} － 1」`,a:'＝'};
      }
      if(kind==='calc'){
        if(slot===1) return {q:`${a+b} － ${b} ＝（　　）`,a:String(a)};
        return {q:`${a} ＋ ${b} － ${c} ＝（　　）`,a:String(a+b-c)};
      }
      if(kind==='word') return {q:`樹上停了 ${a+b} 隻小鳥，飛走了 ${a} 隻後，樹上還剩下幾隻小鳥？`,a:`${a+b} - ${a} = ${b}（隻）`};
      if(kind==='match') return {q:'10以內加減結果配對',pairs:[['3 ＋ 6','9'],['10 － 4','6'],['5 ＋ 5','10'],['8 － 5','3']]};
    }
    if(uIdx===2){ // 比長短與認識形狀
      if(kind==='mc'){
        if(slot===1) return {q:`下面哪一種物品的形狀「最容易滾動」？`,opts:uniqueOpts('足球（球體）',['數學課本','方塊積木','鉛筆盒']),a:'足球（球體）',exp:`球體表面全是彎曲面，最容易向四面八方滾動。`};
        if(slot===2) return {q:`哪一種東西不能平穩地疊得很高？`,opts:uniqueOpts('圓圓的彈珠',['正方形積木','長方形盒子','厚書本']),a:'圓圓的彈珠',exp:`球體沒有平平的面，很難疊在一起。`};
        return {q:`把紅、藍兩條繩子拉直且一端對齊，紅繩的另一端超出藍繩，表示哪一條比較長？`,opts:uniqueOpts('紅繩比較長',['藍繩比較長','兩條一樣長','無法比較']),a:'紅繩比較長',exp:`一端對齊後，另一端超過的較長。`};
      }
      if(kind==='tf'){
        if(slot===1) return {q:`比較兩枝鉛筆長短時，應該先把兩枝筆的「一端對齊」再看另一端才準確。`,a:'○'};
        return {q:`圓圓的皮球和三角板一樣，都有直直的邊和尖尖的角。`,a:'✕',exp:`圓形和球體沒有尖角與直邊。`};
      }
      if(kind==='fill'){
        if(slot===1) return {q:`形狀分類：籃球是（　　）形狀（填「平平的」或「圓圓滾滾的」）；數學課本的面是（　　　）形。`,a:'圓圓滾滾的；長方'};
        return {q:`觀察教室物品：黑板是（　　）形，三角板是（　　）形，十元硬幣的面是（　）形。`,a:'長方；三角；圓'};
      }
      if(kind==='calc') return {q:`數一數機器人圖形中，三角形（2個）與圓形（1個）合起來共有（　）個。`,svg:svgShapeRobot(),a:'3'};
      if(kind==='word') return {q:`${nm}用 3 個長方形積木和 2 個圓柱積木堆城堡，哪一種積木只能放在最上面才不會倒？為什麼？`,a:'圓柱或圓形容易滾動（若橫放）不適合當底層；長方形有平平的面較平穩。'};
      if(kind==='match') return {q:'立體與平面物品配對',pairs:[['魔術方塊','正方體'],['足球','球體'],['罐頭','圓柱體'],['三角板','三角形']]};
    }
    if(uIdx===3){ // 20以內的數與加減（純數與加減，絕不含時鐘）
      const a=rnd(6,9), b=rnd(5,8);
      if(kind==='mc'){
        if(slot===0) return {q:`哪一個數是由「1 個十和 ${a} 個一」組成的？`,opts:uniqueOpts(10+a,[a*10+1,1+a,20]),a:String(10+a),exp:`1 個十是 10，加 ${a} 個一是 ${10+a}。`};
        if(slot===1) return {q:`從 11 往上兩個一數：11、13、15、（　）、19，括號裡應填多少？`,opts:uniqueOpts(17,[16,18,14]),a:'17',exp:`每次多 2，15＋2＝17。`};
        if(slot===2) return {q:`「${a} ＋ ${b}」的算式答案是多少？`,opts:uniqueOpts(a+b,[a+b-1,a+b+1,a+b+2]),a:String(a+b),exp:`${a}＋${b}＝${a+b}。`};
        if(slot===3) return {q:`比大小：下面哪一個數比 15 大、又比 18 小？`,opts:uniqueOpts('16',['14','19','12']),a:'16',exp:`16 介於 15 和 18 之間。`};
        return {q:`算式「17 －（　）＝ 9」，括號裡面應該填多少？`,opts:uniqueOpts('8',['7','9','6']),a:'8',exp:`17－9＝8。`};
      }
      if(kind==='tf'){
        if(slot===1) return {q:`「1 個十和 7 個一」合起來是 ${isTrue?17:71}。`,a:isTrue?'○':'✕',exp:`1 個十和 7 個一是 17。`};
        if(slot===2) return {q:`計算「9 ＋ ${a}」時，先讓 9 加上 1 湊成 10，再加 ${a-1} 就可以算出答案是 ${10+a-1}。`,a:'○',exp:`9＋${a}＝${9+a}。`};
        return {q:`從 19 往前倒數 1 個數是 ${isTrue?18:20}。`,a:isTrue?'○':'✕',exp:`19 往前數 1 是 18。`};
      }
      if(kind==='fill'){
        if(slot===1) return {q:`進退位練習：8 ＋ ${b} ＝（　　）；${10+a} － ${a} ＝（　　）。`,a:`${8+b}；10`};
        if(slot===2) return {q:`比大小（填 ＞、＜ 或 ＝）：9 ＋ 6（　）14；17 － 8（　）10。`,a:'＞；＜'};
        return {q:`20 以內進位加法：9 ＋ ${a} ＝（　　）；18 － ${a} ＝（　　）。`,a:`${9+a}；${18-a}`};
      }
      if(kind==='calc'){
        if(slot===1) return {q:`${a+b} － ${b} ＝（　　）`,a:String(a)};
        return {q:`9 ＋ ${b} ＝（　　）`,a:String(9+b)};
      }
      if(kind==='word') return {q:`${nm}有 ${a} 張色紙，${nm2}有 ${b} 張色紙，兩人合起來共有幾張色紙？`,a:`${a} + ${b} = ${a+b}（張）`};
      if(kind==='match') return {q:'20以內加減與位值配對',pairs:[['1 個十和 4 個一','14'],['19 少 1 的數','18'],['7 ＋ 8','15'],['14 － 5','9']]};
    }
  }

  // --- 1年級下 ---
  if(g===1 && sem==='下'){
    const t10=rnd(2,7), u1=rnd(1,8), n=t10*10+u1, a=rnd(22,48), b=rnd(11,35);
    if(uIdx===0){ // 100以內的數
      if(kind==='mc'){
        if(slot===1) return {q:`「五個一數」時，35、40、（　）、50，括號中應填哪一個數？`,opts:uniqueOpts(45,[41,42,55]),a:'45',exp:`每次加 5，40＋5＝45。`};
        if(slot===2) return {q:`下列哪一個數「比 65 大，又比 74 小」？`,opts:uniqueOpts(70,[62,75,80]),a:'70',exp:`70 介於 65 和 74 之間。`};
        return {q:`數「${n}」裡面的十位數字是多少？`,opts:uniqueOpts(t10,[u1,t10*10,n]),a:String(t10),exp:`十位數字是 ${t10}。`};
      }
      if(kind==='tf'){
        if(slot===1) return {q:`兩個一數時，48 的下一個數是 ${isTrue?50:49}。`,a:isTrue?'○':'✕',exp:`48＋2＝50。`};
        return {q:`「89」和「98」兩個數中，比較大的是 ${isTrue?98:89}。`,a:isTrue?'○':'✕',exp:`98＞89。`};
      }
      if(kind==='fill'){
        if(slot===1) return {q:`十個一數：40 → 50 →（　　）→ 70 →（　　）。`,a:'60；80'};
        return {q:`「${n}」讀作（　　　），是由（　）個十和（　）個一合起來的。`,a:`${n}；${t10}；${u1}`};
      }
      if(kind==='calc') return {q:`${t10*10} ＋ ${u1} ＝（　　）`,a:String(n)};
      if(kind==='word') return {q:`${nm}有 ${t10} 盒每盒 10 枝的鉛筆，再加上 ${u1} 枝散裝的，一共有幾枝鉛筆？`,a:`${t10} 個十和 ${u1} 個一，共 ${n} 枝`};
      if(kind==='match') return {q:'100以內位值配對',pairs:[['6 個十和 2 個一','62'],['2 個十和 6 個一','26'],['9 個十和 9 個一','99'],['10 個十','100']]};
    }
    if(uIdx===1){ // 100以內的加減法
      if(kind==='mc'){
        if(slot===1) return {q:`計算「${a} ＋ ${b}」的答案是多少？`,opts:uniqueOpts(a+b,[a+b+10,a+b-1,a-b]),a:String(a+b),exp:`${a}＋${b}＝${a+b}。`};
        if(slot===2) return {q:`算式「${a+b} － ${a}」的答案是多少？`,opts:uniqueOpts(b,[b+10,b-1,a]),a:String(b),exp:`${a+b}－${a}＝${b}。`};
        return {q:`哪一個算式的得數是 50？`,opts:uniqueOpts('28 ＋ 22',['28 ＋ 12','70 － 30','35 ＋ 25']),a:'28 ＋ 22',exp:`28＋22＝50。`};
      }
      if(kind==='tf') return {q:`減法驗算：「${a+b} － ${b} ＝ ${a}」，所以「${a} ＋ ${b}」一定等於 ${isTrue?a+b:a+b+10}。`,a:isTrue?'○':'✕',exp:`加減互逆，${a}＋${b}＝${a+b}。`};
      if(kind==='fill') return {q:`填入括號裡的數：${a} ＋（　　）＝ ${a+b}；${a+b} －（　　）＝ ${b}。`,a:`${b}；${a}`};
      if(kind==='calc') return slot%2===0?{q:`${a+b} － ${b} ＝（　　）`,a:String(a)}:{q:`${a} ＋ ${b} ＝（　　）`,a:String(a+b)};
      if(kind==='word') return {q:`故事書有 ${a+b} 頁，${nm}已經看了 ${a} 頁，還剩下幾頁沒看？`,a:`${a+b} - ${a} = ${b}（頁）`};
      if(kind==='match') return {q:'100以內加減配對',pairs:[['36 ＋ 14','50'],['85 － 25','60'],['47 ＋ 21','68'],['90 － 35','55']]};
    }
    if(uIdx===2){ // 認識錢幣與購物
      const p=rnd(15,42);
      if(kind==='mc'){
        if(slot===1) return {q:`買一個 ${p} 元的橡皮擦，付 1 個 50 元硬幣，可以找回幾元？`,opts:uniqueOpts(`${50-p} 元`,[`${50-p+5} 元`,`${50-p-1} 元`,`${p} 元`]),a:`${50-p} 元`,exp:`50－${p}＝${50-p} 元。`};
        return {q:`下列哪一組硬幣合起來剛好是 25 元？`,opts:uniqueOpts('2 個 10 元和 1 個 5 元',['1 個 10 元和 2 個 5 元','5 個 1 元和 1 個 10 元','3 個 10 元']),a:'2 個 10 元和 1 個 5 元',exp:`10＋10＋5＝25 元。`};
      }
      if(kind==='tf') return {q:`1 張 100 元鈔票可以換成 ${isTrue?2:5} 張 50 元硬幣（或同等價值）。`,a:isTrue?'○':'✕',exp:`50＋50＝100 元。`};
      if(kind==='fill') return {q:`錢幣換算：1 個 50 元 ＋ 3 個 10 元 ＋ 1 個 5 元 ＝（　　）元。`,a:'85'};
      if(kind==='calc') return {q:`${p} ＋ 15 ＝（　　）`,a:String(p+15)};
      if(kind==='word') return {q:`一支自動筆 ${p} 元，${nm}有 4 個 10 元硬幣，夠不夠買？還差或剩下幾元？`,a:40>=p?`夠，還剩 ${40-p} 元`:`不夠，還差 ${p-40} 元`};
      if(kind==='match') return {q:'錢幣兌換配對',pairs:[['1 個 10 元','2 個 5 元'],['1 個 50 元','5 個 10 元'],['1 張 100 元','10 個 10 元'],['3 個 5 元','15 元']]};
    }
    if(uIdx===3){ // 長度測量與統計、月曆
      const len=rnd(3,8);
      if(kind==='mc'){
        if(slot===1) return {q:`今天是星期三，那麼「昨天」是星期幾？`,opts:uniqueOpts('星期二',['星期四','星期一','星期五']),a:'星期二',exp:`星期三的前一天是星期二。`};
        return {q:`如果 1 個迴紋針和 1 塊橡皮擦排成一排去量書本，要怎樣量比較準確？`,opts:uniqueOpts('用同一種物品當標準一個接一個量',['隨便混用大小不同的物品量','不用對齊直接猜','量中間跳過一段']),a:'用同一種物品當標準一個接一個量',exp:`測量長度須用相同標準且緊密相接。`};
      }
      if(kind==='tf') return {q:`一星期共有 7 天，如果今天是星期六，明天就是星期${isTrue?'日':'五'}。`,a:isTrue?'○':'✕',exp:`星期六的隔天是星期日。`};
      if(kind==='fill') return {q:`星期填空：星期一的明天是星期（　）；一星期共有（　）天。`,a:'二；7'};
      if(kind==='calc') return {q:`看直尺圖：從刻度 0 到刻度 ${len} 是 ${len} 公分，若再接長 4 公分共（　　）公分。`,svg:svgRulerMeasure(0,len),a:String(len+4)};
      if(kind==='word') return {q:`全班投票最喜歡的水果：蘋果 8 票、香蕉 11 票、西瓜 6 票，哪一種水果最受歡迎？比最少的多幾票？`,a:`香蕉最受歡迎；11 - 6 = 5（票）`};
      if(kind==='match') return {q:'月曆與測量配對',pairs:[['1 星期','7 天'],['星期四的隔天','星期五'],['畫「正」字記 1 畫','代表 1 票'],['畫 2 個完整的「正」字','代表 10 票']]};
    }
  }

  // --- 2～6 年級各單元多變化擴充（確保任選單一單元都能產出 20+ 不重複且嚴格符合單元之題型） ---
  if(g===2){
    if(sem==='上'){
      if(uIdx===0){ // 200~1000
        const h=rnd(2,8), t0=rnd(1,8), u=rnd(1,8), n=h*100+t0*10+u;
        if(kind==='mc'){
          if(slot===1) return {q:`「${n}」讀作什麼？百位數字代表多少？`,opts:uniqueOpts(`${h*100}`,[`${h}`,`${t0*10}`,`${u}`]),a:String(h*100),exp:`百位數字 ${h} 代表 ${h*100}。`};
          return {q:`從 ${h*100} 開始「一百一百地數」，數 3 次後是多少？`,opts:uniqueOpts((h+3)*100,[(h+2)*100,(h+4)*100,h*100+30]),a:String((h+3)*100),exp:`${h*100}＋300＝${(h+3)*100}。`};
        }
        if(kind==='tf') return {q:`比較三位數大小：「${n}」${isTrue?'大於':'小於'}「${n-50}」。`,a:isTrue?'○':'✕',exp:`${n}＞${n-50}。`};
        if(kind==='fill') return {q:`一百一數：${h*100} →（　　）→ ${(h+2)*100}；「${n}」比 ${n-10} 多（　　）。`,a:`${(h+1)*100}；10`};
        if(kind==='calc') return {q:`${h*100} ＋ ${t0*10+u} ＝（　　）`,a:String(n)};
        if(kind==='word') return {q:`${nm}存了 ${h} 張百元鈔票和 ${t0} 個十元硬幣，一共存了多少元？`,a:`${h*100+t0*10} 元`};
      }
      if(uIdx===1){ // 二三位數加減
        const a=rnd(125,420), b=rnd(110,290);
        if(kind==='mc') return {q:`估算一下，下列哪一個算式的答案「最接近 500」？`,opts:uniqueOpts('298 ＋ 201',['120 ＋ 150','890 － 120','450 ＋ 380']),a:'298 ＋ 201',exp:`298＋201＝499 最接近 500。`};
        if(kind==='tf') return {q:`直式減法中，如果個位不夠減，要向十位借 1 當作 ${isTrue?10:1} 再減。`,a:isTrue?'○':'✕',exp:`十進位借 1 當作 10。`};
        if(kind==='fill') return {q:`兩步驟加減：${a} ＋ ${b} － 100 ＝（　　）。`,a:String(a+b-100)};
        if(kind==='calc') return {q:`${a+b} － ${a} ＝（　　）`,a:String(b)};
        if(kind==='word') return {q:`圖書館有故事書 ${a} 本、科學書 ${b} 本，借出 100 本後，還剩下幾本書？`,a:`${a} + ${b} - 100 = ${a+b-100}（本）`};
      }
      if(uIdx===2){ // 公分與公尺
        const m=rnd(2,6), cm=rnd(15,85);
        if(kind==='mc') return {q:`教室門的高度大約是 2（　），括號裡應該填入哪一個長度單位？`,opts:uniqueOpts('公尺',['公分','毫米','公里']),a:'公尺',exp:`門高約 2 公尺（200 公分）。`};
        if(kind==='tf') return {q:`用直尺量長度，從刻度 3 公分到刻度 11 公分的長度是 ${isTrue?8:11} 公分。`,a:isTrue?'○':'✕',exp:`11－3＝8 公分。`};
        if(kind==='fill') return {q:`長度換算：${m*100+cm} 公分 ＝（　）公尺（　　）公分。`,a:`${m}；${cm}`};
        if(kind==='calc') return {q:`${m*100} ＋ ${cm} ＝（　　）`,a:String(m*100+cm)};
        if(kind==='word') return {q:`藍緞帶長 ${m} 公尺，紅緞帶長 ${m*100-35} 公分，哪一條緞帶比較長？長幾公分？`,a:`藍緞帶較長（${m*100} 公分），比紅緞帶長 35 公分`};
      }
      if(uIdx===3){ // 乘法 2,4,5,8
        const a=pick([2,4,5,8]), b=rnd(3,9);
        if(kind==='mc') return {q:`「${a} ＋ ${a} ＋ ${a} ＋ ${a}」可以用哪一個乘法算式表示？`,opts:uniqueOpts(`${a} × 4`,[`${a} ＋ 4`,`4 ＋ ${a}`,`${a} × 3`]),a:`${a} × 4`,exp:`4 個 ${a} 相加記為 ${a}×4。`};
        if(kind==='tf') return {q:`「${a} × ${b}」和「${b} × ${a}」算出來的乘積${isTrue?'相同':'不同'}。`,a:isTrue?'○':'✕',exp:`乘法交換律結果相同。`};
        if(kind==='fill') return {q:`乘法口訣填空：${a} ×（　）＝ ${a*b}；8 × 7 ＝（　　）。`,a:`${b}；56`};
        if(kind==='calc') return {q:`${a} × ${b} ＝（　　）`,a:String(a*b)};
        if(kind==='word') return {q:`每隻章魚有 8 隻腳，${b} 隻章魚一共有幾隻腳？`,a:`8 × ${b} = ${8*b}（隻）`};
      }
    } else { // 2下
      if(uIdx===0){
        const a=pick([3,6,7,9]), b=rnd(3,9), c=rnd(4,12);
        if(kind==='mc') return {q:`「${a} × ${b} ＋ ${c}」的結果是多少？`,opts:uniqueOpts(a*b+c,[a*(b+c),a*b-c,a+b+c]),a:String(a*b+c),exp:`${a}×${b}＝${a*b}，再加 ${c} 得 ${a*b+c}。`};
        if(kind==='tf') return {q:`算式「9 × 1」的積等於 ${isTrue?9:1}。`,a:isTrue?'○':'✕',exp:`任何數乘以 1 等於原數。`};
        if(kind==='fill') return {q:`兩步驟填空：${a} × ${b} － ${c} ＝（　　）。`,a:String(a*b-c)};
        if(kind==='calc') return {q:`${a} × ${b} ＝（　　）`,a:String(a*b)};
        if(kind==='word') return {q:`1 盒蛋塔有 ${a} 個，買了 ${b} 盒，吃掉 ${c} 個後還剩下幾個蛋塔？`,a:`${a} × ${b} - ${c} = ${a*b-c}（個）`};
      }
      if(uIdx===1){
        const d=rnd(3,8), q0=rnd(3,7);
        if(kind==='mc') return {q:`把 1 條巧克力平分成 ${d} 塊，其中的 1 塊可以記作幾條？`,opts:uniqueOpts(`1/${d} 條`,[`${d} 條`,`1/${d+1} 條`,`1/2 條`]),a:`1/${d} 條`,exp:`平分 ${d} 份每份為 1/${d}。`};
        if(kind==='tf') return {q:`「1/${d}」和「1/${d+2}」比較大小，${isTrue?`1/${d} 比較大`:`1/${d+2} 比較大`}。`,a:isTrue?'○':'✕',exp:`平分成越多份，單一份越小。`};
        if(kind==='fill') return {q:`把 ${d*q0} 顆草莓平分給 ${q0} 個人，每個人分到（　）顆。`,a:String(d)};
        if(kind==='calc') return {q:`${d*q0} ÷ ${d} ＝（　　）`,a:String(q0)};
        if(kind==='word') return {q:`有 ${d*q0} 顆鳳梨酥，每 ${d} 顆裝成一盒，全部可以裝成幾盒？`,a:`${d*q0} ÷ ${d} = ${q0}（盒）`};
      }
      if(uIdx===2){
        const hr=rnd(2,9);
        if(kind==='mc') return {q:`分針在鐘面上走 1 大格（從 12 走到 1），經過了幾分鐘？`,opts:uniqueOpts('5 分鐘',['1 分鐘','1 小時','10 分鐘']),a:'5 分鐘',exp:`分針走 1 大格是 5 分鐘。`};
        if(kind==='tf') return {q:`天平左邊放蘋果、右邊放橘子，如果左邊向下傾斜，代表蘋果比較${isTrue?'重':'輕'}。`,a:isTrue?'○':'✕',exp:`天平較重的一端會往下沉。`};
        if(kind==='fill') return {q:`平年 2 月有（　　）天，閏年 2 月有（　　）天；一年有（　　）個月。`,a:'28；29；12'};
        if(kind==='calc') return {q:`${hr} × 12 ＝（　　）`,a:String(hr*12)};
        if(kind==='word') return {q:`小美從下午 ${hr} 時 10 分開始寫功課，寫到 ${hr} 時 45 分完成，一共寫了幾分鐘？`,a:`45 - 10 = 35（分鐘）`};
      }
      if(uIdx===3){
        if(kind==='mc') return {q:`正方體總共有幾個面？每一個面都是什麼形狀？`,opts:uniqueOpts('6 個面，都是正方形',['4 個面，都是正方形','6 個面，都是長方形','8 個面，都是三角形']),a:'6 個面，都是正方形',exp:`正方體有 6 個全等正方形面。`};
        if(kind==='tf') return {q:`長方形的 4 個角都是直角，且兩組對邊分別平行且等長。`,a:'○'};
        if(kind==='fill') return {q:`三角形有（　）條邊、（　）個角和（　）個頂點。`,a:'3；3；3'};
        if(kind==='calc'){const s=rnd(4,9);return {q:`正方形邊長 ${s} 公分，四條邊合起來共 ${s} × 4 ＝（　　）公分。`,a:String(s*4)};}
        if(kind==='word'){const w=rnd(6,10),h=rnd(3,5);return {q:`一個長方形的長是 ${w} 公分、寬是 ${h} 公分，繞它周圍一圈總長是多少公分？`,a:`(${w} + ${h}) × 2 = ${(w+h)*2}（公分）`};}
      }
    }
  }

  // 3～6 年級依單位與單元主題產生額外題型變化（保證每單元至少 4 種題幹簽名）
  if(g===3){
    if(sem==='上'){
      if(uIdx===0){ // 一萬以內的數與加減
        const th=rnd(2,8), h=rnd(1,7), t0=rnd(1,9), u=rnd(1,9), n=th*1000+h*100+t0*10+u, b=rnd(1100,2800);
        if(kind==='mc'){
          if(slot===1) return {q:`「${th}0${t0}${u}」這個四位數，讀作什麼？`,opts:uniqueOpts(`${th}千零${t0}十${u}`,[`${th}千${t0}十${u}`,`${th}千零${u}`,`${th}百零${t0}${u}`]),a:`${th}千零${t0}十${u}`,exp:`百位為 0 讀一個零。`};
          if(slot===2) return {q:`在「${n}」中，千位數字是百位數字或個位數字嗎？千位數字代表多少？`,opts:uniqueOpts(String(th*1000),[String(th*100),String(th*10),String(h*100)]),a:String(th*1000),exp:`千位數字 ${th} 代表 ${th*1000}。`};
          return {q:`估算「${th*1000+190} ＋ ${b}」的結果大概在幾千左右？`,opts:uniqueOpts(`約 ${Math.round((th*1000+190+b)/1000)*1000}`,[`約 ${Math.round((th*1000+190+b)/1000)*1000+3000}`,`約 1000`,`約 9000`]),a:`約 ${Math.round((th*1000+190+b)/1000)*1000}`};
        }
        if(kind==='tf') return {q:`最小的四位數是 1000，最大的四位數是 ${isTrue?9999:9000}。`,a:isTrue?'○':'✕',exp:`最大四位數為 9999。`};
        if(kind==='fill') return {q:`四位數比較大小（填 ＞、＜ 或 ＝）：${n}（　）${n-100}；10 個百是（　　　）。`,a:`＞；1000`};
        if(kind==='calc') return slot%2===0?{q:`${n} ＋ ${b} ＝（　　　）`,a:String(n+b)}:{q:`${n+b} － ${b} ＝（　　　）`,a:String(n)};
        if(kind==='word') return {q:`賣場星期六賣出 ${n} 元、星期日比星期六少賣 ${b} 元，星期日賣出幾元？`,a:`${n} - ${b} = ${n-b}（元）`};
      }
      if(uIdx===1){ // 乘法與除法直式
        const d=rnd(3,9), q0=rnd(12,32), r=rnd(1,d-1), a=rnd(18,65);
        if(kind==='mc'){
          if(slot===1) return {q:`有 ${d*q0+r} 位學生要分組活動，每 ${d} 人一組，最多可以分成幾組？`,opts:uniqueOpts(`${q0} 組`,[`${q0+1} 組`,`${q0-1} 組`,`${r} 組`]),a:`${q0} 組`,exp:`${d*q0+r}÷${d}＝${q0}…${r}。`};
          return {q:`在「${a} × ${d}」的直式乘法中，得數是多少？`,opts:uniqueOpts(a*d,[a*d+d,a*d-d,a+d]),a:String(a*d),exp:`${a}×${d}＝${a*d}。`};
        }
        if(kind==='tf') return {q:`任何正整數除以 ${d} 時，餘數最大只能到 ${isTrue?d-1:d}。`,a:isTrue?'○':'✕',exp:`餘數必小於除數。`};
        if(kind==='fill') return {q:`除法驗算填空：已知 □ ÷ ${d} ＝ ${q0} … ${r}，則被除數 □ ＝（　　）。`,a:String(d*q0+r)};
        if(kind==='calc') return {q:`${a} × ${d} ＝（　　）`,a:String(a*d)};
        if(kind==='word') return {q:`麵包店做了 ${d*q0+r} 個蛋塔，每 ${d} 個裝一盒，至少要準備幾個盒子才能全部裝完？`,a:`${d*q0+r} ÷ ${d} = ${q0}…${r}，至少需 ${q0+1} 個盒子`};
      }
      if(uIdx===2){ // 公里、公尺、毫米
        const km=rnd(2,7), m=rnd(120,750), cm=rnd(2,8), mm=rnd(1,9);
        if(kind==='mc') return {q:`一條高速公路全長約 370（　），括號中最適合填入哪個單位？`,opts:uniqueOpts('公里',['公尺','公分','毫米']),a:'公里',exp:`長途道路以公里為單位。`};
        if(kind==='tf') return {q:`10 毫米等於 ${isTrue?1:10} 公分。`,a:isTrue?'○':'✕',exp:`1 公分＝10 毫米。`};
        if(kind==='fill') return {q:`單位轉換：${km*1000+m} 公尺 ＝（　）公里（　　）公尺；${cm} 公分 ${mm} 毫米 ＝（　　）毫米。`,a:`${km}；${m}；${cm*10+mm}`};
        if(kind==='calc') return {q:`${km*1000} ＋ ${m} ＝（　　）`,a:String(km*1000+m)};
        if(kind==='word') return {q:`從家裡走到學校是 ${m} 公尺，來回一趟是幾公里幾公尺？`,a:`${m*2} 公尺 ＝ ${Math.floor(m*2/1000)} 公里 ${(m*2)%1000} 公尺`};
      }
      if(uIdx===3){ // 角、正方形、長方形與圓
        const s=rnd(5,12), r0=rnd(4,10);
        if(kind==='mc') return {q:`圓規兩腳張開 ${r0} 公分畫出來的圓，直徑長多少公分？`,opts:uniqueOpts(`${r0*2} 公分`,[`${r0} 公分`,`${r0*4} 公分`,`${r0+5} 公分`]),a:`${r0*2} 公分`,exp:`直徑＝半徑×2＝${r0*2} 公分。`};
        if(kind==='tf') return {q:`角的大小和角的兩條邊畫得有多長${isTrue?'沒有關係':'有關，邊越長角越大'}。`,a:isTrue?'○':'✕',exp:`角的大小只和兩邊張開的程度有關。`};
        if(kind==='fill') return {q:`正方形周長是 ${s*4} 公分，邊長是（　）公分；直徑 ${r0*2} 公分的圓，半徑是（　）公分。`,a:`${s}；${r0}`};
        if(kind==='calc') return {q:`${s} × 4 ＝（　　）`,a:String(s*4)};
        if(kind==='word') return {q:`用一條長 ${s*4} 公分的鐵絲圍成一個最大的正方形，這個正方形每條邊長是幾公分？`,a:`${s*4} ÷ 4 = ${s}（公分）`};
      }
    } else { // 3下
      if(uIdx===0){
        const den=rnd(5,10), a=rnd(1,den-3), b=rnd(1,den-a-1);
        if(kind==='mc') return {q:`分數「${a}/${den}」和「${b}/${den}」比較，哪一個比較大？`,opts:uniqueOpts(a>b?`${a}/${den}`:(a<b?`${b}/${den}`:'一樣大'),[`${a}/${den}`,`${b}/${den}`,'一樣大','無法比較']),a:a>b?`${a}/${den}`:(a<b?`${b}/${den}`:'一樣大')};
        if(kind==='tf') return {q:`同分母分數相減「${a+b}/${den} － ${a}/${den}」等於 ${isTrue?`${b}/${den}`:`${b}/0`}。`,a:isTrue?'○':'✕',exp:`分母不變，分子相減。`};
        if(kind==='fill') return {q:`計算：${a}/${den} ＋ ${b}/${den} ＝（　　）；${den}/${den} 等於整數（　）。`,a:`${a+b}/${den}；1`};
        if(kind==='calc') return {q:`${a+b}/${den} － ${a}/${den} ＝（　　）`,a:`${b}/${den}`};
        if(kind==='word') return {q:`一條蛋糕平分成 ${den} 塊，爸爸吃了 ${a} 塊、媽媽吃了 ${b} 塊，還剩下幾分之幾條蛋糕？`,a:`1 - ${a}/${den} - ${b}/${den} = ${den-a-b}/${den}（條）`};
      }
      if(uIdx===1){
        const d1=rnd(12,48)/10, d2=rnd(11,35)/10;
        if(kind==='mc') return {q:`「0.8」這個小數裡面有幾個 0.1？`,opts:uniqueOpts('8 個',['80 個','1 個','0.8 個']),a:'8 個',exp:`十分位是 8，代表 8 個 0.1。`};
        if(kind==='tf') return {q:`比較大小：${d1.toFixed(1)} ＋ 0.5 ${isTrue?'大於':'小於'} ${d1.toFixed(1)}。`,a:isTrue?'○':'✕'};
        if(kind==='fill') return {q:`小數減法：${(d1+d2).toFixed(1)} － ${d1.toFixed(1)} ＝（　　）。`,a:d2.toFixed(1)};
        if(kind==='calc') return {q:`${d1.toFixed(1)} ＋ ${d2.toFixed(1)} ＝（　　）`,a:(d1+d2).toFixed(1)};
        if(kind==='word') return {q:`一瓶鮮奶有 ${(d1+d2).toFixed(1)} 公升，喝掉 ${d1.toFixed(1)} 公升後，還剩下幾公升？`,a:`${(d1+d2).toFixed(1)} - ${d1.toFixed(1)} = ${d2.toFixed(1)}（公升）`};
      }
      if(uIdx===2){
        const h1=rnd(1,6), kg=rnd(2,6), g0=rnd(150,750);
        if(kind==='mc') return {q:`「18 時 25 分」用 12 時制表示是？`,opts:uniqueOpts('下午 6 時 25 分',['上午 6 時 25 分','下午 8 時 25 分','上午 8 時 25 分']),a:'下午 6 時 25 分',exp:`18－12＝6。`};
        if(kind==='tf') return {q:`2 公升 50 毫公升等於 ${isTrue?2050:2500} 毫公升。`,a:isTrue?'○':'✕',exp:`2000＋50＝2050 毫公升。`};
        if(kind==='fill') return {q:`上午 9 時 20 分到上午 11 時 00 分，經過（　）小時（　　）分。`,a:'1；40'};
        if(kind==='calc') return {q:`${kg*1000} ＋ ${g0} ＝（　　）`,a:String(kg*1000+g0)};
        if(kind==='word') return {q:`一袋米重 ${kg} 公斤 ${g0} 公克，煮掉 500 公克後，還剩下幾公克？`,a:`${kg*1000+g0} - 500 = ${kg*1000+g0-500}（公克）`};
      }
      if(uIdx===3){
        const w=rnd(5,12), h=rnd(3,7);
        if(kind==='mc') return {q:`用 1 平方公分的正方形紙卡拼成一排 6 個、共 4 排的長方形，面積是多少？`,opts:uniqueOpts('24 平方公分',['10 平方公分','20 平方公分','12 平方公分']),a:'24 平方公分',exp:`6×4＝24 平方公分。`};
        if(kind==='tf') return {q:`邊長 1 公分的正方形，它的面積規定為 1 平方公分。`,a:'○'};
        if(kind==='fill') return {q:`長 ${w} 公分、寬 ${h} 公分的長方形，面積是（　　）平方公分。`,a:String(w*h)};
        if(kind==='calc') return {q:`${w} × ${h} ＝（　　）`,a:String(w*h)};
        if(kind==='word') return {q:`每包色紙有 12 張，一箱有 6 包，老師買了 3 箱共有幾張色紙？`,a:`12 × 6 × 3 = 216（張）`};
      }
    }
  }

  if(g>=4){
    // 4~6年級依精確 (g, sem, uIdx) 產生進階變體（鼎甲/良品/奇鼎梯度）
    const k = rnd(2,9), x = rnd(4,15);
    if(g===4 && sem==='上'){
      if(uIdx===0){
        const n=rnd(31,89)*10000+rnd(1200,8900);
        if(kind==='mc') return {q:`將 ${n} 用「無條件捨去法」取概數到萬位是多少？`,opts:uniqueOpts(Math.floor(n/10000)*10000,[Math.ceil(n/10000)*10000,Math.round(n/1000)*1000,Math.floor(n/1000)*1000]),a:String(Math.floor(n/10000)*10000)};
        if(kind==='tf') return {q:`「五千零八萬」寫作 ${isTrue?'50080000':'50800000'}。`,a:isTrue?'○':'✕'};
        if(kind==='fill') return {q:`1 億 － 3 千萬 ＝（　　）千萬；45280 四捨五入到千位是（　　　）。`,a:'7；45000'};
        if(kind==='calc'){const x1=rnd(12,45)*1000,x2=rnd(11,35)*1000;return {q:`${x1} ＋ ${x2} ＝（　　　）`,a:String(x1+x2)};}
      }
      if(uIdx===1){
        const a=rnd(125,360), b=rnd(12,25);
        if(kind==='mc') return {q:`一箱飲料 24 瓶，買 ${b} 箱共有幾瓶？`,opts:uniqueOpts(`${24*b} 瓶`,[`${24*b+24} 瓶`,`${24+b} 瓶`,`${24*b-10} 瓶`]),a:`${24*b} 瓶`};
        if(kind==='tf') return {q:`${a} × ${b} 的乘積個位數一定是 ${isTrue?(a*b)%10:((a*b)%10+1)%10}。`,a:isTrue?'○':'✕'};
        if(kind==='fill') return {q:`估算檢查：398 × 21 約等於 400 × 20 ＝（　　）。`,a:'8000'};
        if(kind==='calc') return {q:`${a} × ${b} ＝（　　）`,a:String(a*b)};
      }
      if(uIdx===2){
        const a1=rnd(40,70), a2=rnd(40,65);
        if(kind==='mc') return {q:`等腰三角形的一個底角是 ${a1}°，請問它的頂角是幾度？`,opts:uniqueOpts(`${180-a1*2}°`,[`${180-a1}°`,`${a1}°`,`90°`]),a:`${180-a1*2}°`};
        if(kind==='tf') return {q:`周角是 360°，等於 ${isTrue?4:2} 個直角。`,a:isTrue?'○':'✕'};
        if(kind==='fill') return {q:`鐘面從 12 點走到 3 點，時針轉了（　）°；從 3 點走到 6 點又轉了（　）°。`,a:'90；90'};
        if(kind==='calc') return {q:`180 － ${a1} － ${a2} ＝（　　）`,a:String(180-a1-a2)};
      }
      if(uIdx===3){
        const w=rnd(2,5), d=rnd(3,6), n=rnd(1,d-1);
        if(kind==='mc') return {q:`${w} 又 ${n}/${d} 等於下列哪一個假分數？`,opts:uniqueOpts(`${w*d+n}/${d}`,[`${w+n}/${d}`,`${w*n}/${d}`,`${w*d}/${d}`]),a:`${w*d+n}/${d}`};
        if(kind==='tf') return {q:`真分數的分子一定比分母${isTrue?'小':'大'}。`,a:isTrue?'○':'✕'};
        if(kind==='fill') return {q:`分數整數倍：${n}/${d} × 3 ＝（　　）（假分數）；3 公里 － 500 公尺 ＝（　　）公尺。`,a:`${n*3}/${d}；2500`};
      }
    }
    if(g===4 && sem==='下'){
      if(uIdx===0){
        const a=rnd(12,30), b=rnd(3,7), c=rnd(20,50);
        if(kind==='mc') return {q:`「${c} － ${a} ＋ ${b}」應該怎麼算才對？`,opts:uniqueOpts('由左到右依序計算得 '+(c-a+b),['先算 '+a+' ＋ '+b,'先算 '+c+' ＋ '+b,'答案為 0']),a:'由左到右依序計算得 '+(c-a+b)};
        if(kind==='tf') return {q:`在四則運算中，「(25 ＋ 15) × 4」和「25 × 4 ＋ 15 × 4」的答案${isTrue?'相等':'不相等'}。`,a:isTrue?'○':'✕'};
        if(kind==='fill') return {q:`巧算填空：36 × 99 ＝ 36 × 100 －（　　）＝（　　　）。`,a:'36；3564'};
        if(kind==='calc') return {q:`${c} ＋ ${a} × ${b} ＝（　　）`,a:String(c+a*b)};
      }
      if(uIdx===1){
        const d1=(rnd(12,35)/100), d2=(rnd(11,25)/100);
        if(kind==='mc') return {q:`「0.01」是 1 的幾分之幾？`,opts:uniqueOpts('1/100',['1/10','1/1000','1/2']),a:'1/100'};
        if(kind==='tf') return {q:`比較小數大小：0.45 ${isTrue?'大於':'小於'} 0.405。`,a:isTrue?'○':'✕'};
        if(kind==='fill') return {q:`小數加減：${(d1+d2).toFixed(2)} － ${d1.toFixed(2)} ＝（　　）。`,a:d2.toFixed(2)};
      }
      if(uIdx===2){
        const w=rnd(6,14), h=rnd(4,9);
        if(kind==='mc') return {q:`長方形的周長公式是？`,opts:uniqueOpts('(長 ＋ 寬) × 2',['長 × 寬','長 ＋ 寬','邊長 × 4']),a:'(長 ＋ 寬) × 2'};
        if(kind==='tf') return {q:`邊長 1 公尺的正方形，面積是 1 平方公尺，也就是 ${isTrue?10000:100} 平方公分。`,a:isTrue?'○':'✕'};
        if(kind==='fill') return {q:`長 ${w} 公尺、寬 ${h} 公尺的菜園，面積是（　　）平方公尺，周長是（　　）公尺。`,a:`${w*h}；${(w+h)*2}`};
        if(kind==='calc') return {q:`${w} × ${h} ＝（　　）`,a:String(w*h)};
      }
      if(uIdx===3){
        if(kind==='mc') return {q:`觀察規律：2、5、8、11、（　）、17，括號應填多少？`,opts:uniqueOpts(14,[12,13,15]),a:'14'};
        if(kind==='tf') return {q:`長條圖主要用來清楚比較各不同項目的數量多寡。`,a:'○'};
        if(kind==='fill') return {q:`時間乘法：2 小時 15 分 × 3 ＝（　）小時（　　）分。`,a:'6；45'};
      }
    }
    if(g===5){
      if(sem==='上' && uIdx===0){
        if(kind==='mc') return {q:`下列哪一個數「同時是 2、3 和 5 的倍數」？`,opts:uniqueOpts('30',['15','20','24']),a:'30',exp:`個位是 0 且數字和為 3 的倍數。`};
        if(kind==='tf') return {q:`兩個數的最大公因數是 1 時，稱這兩個數「互質」。`,a:'○'};
        if(kind==='fill') return {q:`18 的所有因數有（　　　　　　　　）。`,a:'1、2、3、6、9、18'};
      }
      if(sem==='上' && uIdx===1){
        if(kind==='mc') return {q:`把「18/24」約分成最簡分數是多少？`,opts:uniqueOpts('3/4',['6/8','9/12','2/3']),a:'3/4'};
        if(kind==='tf') return {q:`異分母分數相加減時，要先通分讓分母相同才能計算。`,a:'○'};
        if(kind==='fill') return {q:`通分比較（填 ＞、＜ 或 ＝）：2/3（　）5/8。`,a:'＞'};
      }
      if(sem==='上' && uIdx===2){
        const b=rnd(8,14), h=rnd(4,10);
        if(kind==='mc') return {q:`下列哪一個圖形「不是」線對稱圖形？`,opts:uniqueOpts('一般不等邊平行四邊形',['正方形','長方形','正三角形']),a:'一般不等邊平行四邊形'};
        if(kind==='fill') return {q:`三角形面積公式是（　　　　　）；底 ${b}cm、高 ${h}cm 的平行四邊形面積是（　　）平方公分。`,a:`底×高÷2；${b*h}`};
        if(kind==='calc') return {q:`${b} × ${h} ＝（　　）`,a:String(b*h)};
      }
      if(sem==='上' && uIdx===3){
        if(kind==='mc') return {q:`「25 × 44」可以用分配律拆成哪一個算式來簡算？`,opts:uniqueOpts('25 × 40 ＋ 25 × 4',['25 × 40 ＋ 4','25 × 4 ＋ 40','25 × 50 － 6']),a:'25 × 40 ＋ 25 × 4'};
        if(kind==='fill') return {q:`時間除法：6 小時 40 分 ÷ 4 ＝（　）小時（　　）分。`,a:'1；40'};
      }
      if(sem==='下' && uIdx===0){
        if(kind==='mc') return {q:`「3/4 × 2/5」的積是多少？`,opts:uniqueOpts('3/10',['5/9','6/9','15/8']),a:'3/10'};
        if(kind==='fill') return {q:`比大小（填 ＞、＜ 或 ＝）：1.2 × 0.8（　）1.2；1.2 × 1.5（　）1.2。`,a:'＜；＞'};
      }
      if(sem==='下' && uIdx===1){
        if(kind==='mc') return {q:`「7.2 ÷ 0.8」的商是多少？`,opts:uniqueOpts('9',['0.9','90','0.09']),a:'9'};
        if(kind==='fill') return {q:`小數除法：3.6 ÷ 4 ＝（　　）；9 ÷ 5 ＝（　　）。`,a:'0.9；1.8'};
      }
      if(sem==='下' && uIdx===2){
        const l=rnd(5,9), w=rnd(4,7), h=rnd(3,6);
        if(kind==='mc') return {q:`1 立方公尺等於多少立方公分？`,opts:uniqueOpts('1000000 立方公分',['10000 立方公分','1000 立方公分','100000 立方公分']),a:'1000000 立方公分'};
        if(kind==='fill') return {q:`長 ${l}cm、寬 ${w}cm、高 ${h}cm 的長方體表面積是（　　）平方公分。`,a:String((l*w+w*h+h*l)*2)};
        if(kind==='calc') return {q:`${l} × ${w} × ${h} ＝（　　）`,a:String(l*w*h)};
      }
      if(sem==='下' && uIdx===3){
        if(kind==='mc') return {q:`1 平方公里等於多少公頃？`,opts:uniqueOpts('100 公頃',['10 公頃','1000 公頃','10000 公頃']),a:'100 公頃'};
        if(kind==='fill') return {q:`打八五折表示售價是定價的（　　）%；3 公頃 ＝（　　）公畝。`,a:'85；300'};
      }
    }
    if(g===6){
      if(sem==='上' && uIdx===0){
        if(kind==='mc') return {q:`20 以內的質數一共有幾個？`,opts:uniqueOpts('8 個',['7 個','9 個','6 個']),a:'8 個',exp:`2,3,5,7,11,13,17,19 共 8 個。`};
        if(kind==='fill') return {q:`12 和 18 的最大公因數是（　），最小公倍數是（　　）。`,a:'6；36'};
      }
      if(sem==='上' && uIdx===1){
        if(kind==='mc') return {q:`「3/4 ÷ 1/2」的計算結果是多少？`,opts:uniqueOpts('1 又 1/2（3/2）',['3/8','2/3','1/2']),a:'1 又 1/2（3/2）'};
        if(kind==='fill') return {q:`4.8 公升的果汁，每 0.5 公升裝滿一瓶，最多可裝滿（　）瓶，還剩下（　　）公升。`,a:'9；0.3'};
      }
      if(sem==='上' && uIdx===2){
        if(kind==='mc') return {q:`「15 ： 25」的最簡單整數比是多少？`,opts:uniqueOpts('3 ： 5',['5 ： 3','1 ： 2','15 ： 25']),a:'3 ： 5'};
        if(kind==='fill') return {q:`比例尺 1：50000 上 4 公分，代表實際距離（　）公里。`,a:'2'};
      }
      if(sem==='上' && uIdx===3){
        if(kind==='mc') return {q:`一個半徑 10 公分的半圓（含直徑邊），它的「周長」大約是多少公分？（π＝3.14）`,opts:uniqueOpts('51.4 公分',['31.4 公分','62.8 公分','314 公分']),a:'51.4 公分',exp:`弧長 20×3.14÷2＝31.4，加上直徑 20 得 51.4 公分。`};
        if(kind==='fill') return {q:`半徑 10 公分的圓，圓周長約（　　）公分，圓面積約（　　）平方公分。（π＝3.14）`,a:'62.8；314'};
      }
      if(sem==='下' && uIdx===0){
        if(kind==='mc') return {q:`計算「1/2 ＋ 0.25 × 2」的結果是多少？`,opts:uniqueOpts('1',['1.5','0.75','2']),a:'1'};
        if(kind==='fill') return {q:`成本 400 元的書包，加三成作為定價，定價是（　　）元。`,a:'520'};
      }
      if(sem==='下' && uIdx===1){
        if(kind==='mc') return {q:`時速 72 公里相當於秒速多少公尺？`,opts:uniqueOpts('20 公尺/秒',['12 公尺/秒','72 公尺/秒','2 公尺/秒']),a:'20 公尺/秒',exp:`72000÷3600＝20 公尺/秒。`};
        if(kind==='fill') return {q:`分速 80 公尺走 15 分鐘，共走了（　　　）公尺，合（　　）公里。`,a:'1200；1.2'};
      }
      if(sem==='下' && uIdx===2){
        if(kind==='mc') return {q:`哥哥體重是弟弟的 1.5 倍，弟弟體重是 30 公斤，兩人體重相差多少公斤？`,opts:uniqueOpts('15 公斤',['45 公斤','75 公斤','20 公斤']),a:'15 公斤'};
        if(kind==='fill') return {q:`底面積 25 平方公分、高 8 公分的三角柱，體積是（　　）立方公分。`,a:'200'};
      }
      if(sem==='下' && uIdx===3){
        if(kind==='mc') return {q:`若 3 × x － 5 ＝ 19，則 x ＝？`,opts:uniqueOpts('8',['6','7','9']),a:'8'};
        if(kind==='fill') return {q:`父子兩人今年年齡和是 48 歲，爸爸比兒子大 24 歲，兒子今年（　　）歲。`,a:'12'};
      }
    }
  }
  return genMathUnitSynth(g, sem, uIdx, diff, kind, vIdx);
}

// 各年級各單元嚴格題意鎖定規則（防跨單元、跨學期、跨年級題目滲漏）
const MATH_UNIT_FILTER = {
  '1_上_0': { allow:/分合|分成|合起來|排第|從左|從右|比.*大|比.*小|火車|數列|幾個|倒數|順數|一樣大|一樣多|最大|最小|順序|彈珠|＞|＜|下一個數|前一個數/, forbid:/＋|－|×|÷|\/|分之|時鐘|鐘面|幾點|長短|最長|最短|正方|長方|三角|圓形|圓柱|球體|錢幣|硬幣|鈔票|元|分針|時針|分鐘|小時|公分|公尺|公里|毫米|公斤|公克|公升|毫公升|小數|分數|面積|周長|角度|直角|銳角|鈍角|直徑|半徑|偶數|奇數|月曆|星期|質數|公因|未知數|體積|平均|速率|%|百位|千位|萬|[2-9]\d|\b1[1-9]\b/ },
  '1_上_1': { allow:/＋|－|合起來|一共|還剩|飛走|拿走|打破|放進|多幾|少幾|加法|減法|算式|相差|0 顆/, forbid:/×|÷|\/|分之|時鐘|鐘面|幾點|長短|最長|最短|正方|長方|三角|圓形|錢幣|硬幣|鈔票|元|分針|時針|分鐘|小時|公分|公尺|公里|毫米|公斤|公克|公升|毫公升|小數|分數|面積|周長|角度|直角|直徑|半徑|月曆|星期|偶數|奇數|百位|千位|萬|[2-9]\d|\b1[1-9]\b/ },
  '1_上_2': { allow:/長短|比一比|最長|最短|直線|曲線|圖形|形狀|三角形|正方形|長方形|圓形|正方體|長方體|圓柱|球|滾動|疊|硬幣的面|三角巾|國旗|骰子/, forbid:/＋|－|×|÷|\/|時鐘|鐘面|幾點|分鐘|小時|元|公里|毫米|公斤|公克|公升|毫公升|小數|分數|面積|周長|銳角|鈍角|直徑|半徑|對稱|月曆|星期|體積|表面積|梯形|平行四邊形|[2-9]\d|\b1[5-9]\b/ },
  '1_上_3': { allow:/\b1[0-9]\b|\b20\b|1 個十|進位|退位|排隊|＋|－|湊十|破十|數列|十位|個位|合起來|相差|倒數|順數/, forbid:/×|÷|\/|時鐘|鐘面|幾點|點半|短針|長針|時針|分針|錢幣|硬幣|鈔票|元|公尺|公里|毫米|公斤|公克|公升|毫公升|小數|分數|面積|周長|銳角|鈍角|直徑|半徑|百位|千位|萬|月曆|星期|24 時|[3-9]\d|2[1-9]/ },
  '1_下_0': { allow:/個十|個一|十位|個位|兩個一數|五個一數|十個一數|100 以內|99|比.*大|比.*小|順序|倒數|順數/, forbid:/×|÷|\/|錢幣|硬幣|鈔票|元|公里|毫米|公斤|公克|公升|毫公升|小數|分數|面積|周長|直徑|半徑|千位|萬|時鐘|鐘面|月曆|星期/ },
  '1_下_1': { allow:/＋|－|進位|退位|不進位|加減|差|和|還剩|一共|相差|逆推/, forbid:/×|÷|\/|錢幣|硬幣|鈔票|公里|毫米|公斤|公克|公升|毫公升|小數|分數|面積|周長|直徑|半徑|千位|萬|時鐘|鐘面|[2-9]\d{2}/ },
  '1_下_2': { allow:/元|硬幣|鈔票|50 元|10 元|5 元|1 元|找回|付清|夠不夠|買|零錢/, forbid:/×|÷|\/|公里|毫米|公斤|公克|公升|毫公升|小數|分數|面積|周長|直徑|半徑|千位|萬|時鐘|鐘面|月曆|星期/ },
  '1_下_3': { allow:/月曆|星期|天|第幾日|幾月|畫記|正字|統計|投票|鉛筆|迴紋針|長幾個|個別單位/, forbid:/×|÷|\/|公里|毫米|公斤|公克|公升|毫公升|小數|分數|面積|周長|直徑|半徑|千位|萬|錢幣|硬幣|鈔票/ },
  '2_上_0': { allow:/百位|個百|十位|個位|1000|幾百|比大小|數字卡|偶數|奇數|估算/, forbid:/×|÷|\/|公里|毫米|公斤|公克|公升|毫公升|小數|分數|面積|周長|直徑|半徑|萬|億|時鐘|鐘面|秒/ },
  '2_上_1': { allow:/＋|－|直式|進位|退位|估算|兩步驟|一共|還剩|相差/, forbid:/×|÷|\/|公里|毫米|公斤|公克|公升|毫公升|小數|分數|面積|周長|直徑|半徑|萬|億|時鐘|鐘面/ },
  '2_上_2': { allow:/公分|公尺|直尺|刻度|長度|膠帶|重疊|剪掉|接起來|cm/i, forbid:/×|÷|\/|公里|毫米|公斤|公克|公升|毫公升|小數|分數|面積|時鐘|鐘面|角度|直徑|半徑|萬/ },
  '2_上_3': { allow:/×|倍|連加|乘法|二|四|五|八|口訣|每盒|每袋|幾雙|幾隻腳/, forbid:/÷|\/|公里|毫米|公斤|公克|公升|毫公升|小數|分數|面積|周長|角度|直徑|半徑|萬|時鐘|鐘面/ },
  '2_下_0': { allow:/×|倍|乘法|0 倍|1 倍|兩步驟|3|6|7|9/, forbid:/÷|\/|公里|毫米|公斤|公克|公升|毫公升|小數|分數|面積|周長|角度|直徑|半徑|萬/ },
  '2_下_1': { allow:/平分|分裝|每人|每盤|幾包|幾袋|幾分之一|1\/2|1\/3|1\/4|1\/6|1\/8|對折/, forbid:/公里|毫米|公斤|公克|公升|毫公升|小數|面積|周長|角度|直徑|半徑|萬|時鐘/ },
  '2_下_2': { allow:/時鐘|鐘面|幾時|幾分|分鐘|小時|分針|時針|天平|輕重|容量|裝比較多|較重|較輕/, forbid:/公里|毫米|小數|分數|面積|周長|角度|直徑|半徑|萬|公噸|公頃/ },
  '2_下_3': { allow:/頂點|邊|角|正方形|長方形|正三角形|平行|垂直|正方體|長方體|面|邊長/, forbid:/公里|毫米|公斤|公克|公升|毫公升|小數|分數|面積|直徑|半徑|度|°|萬|梯形/ },
  '3_上_0': { allow:/千位|萬|10000|四位數|＋|－|數字卡|偶數|奇數|估算|湊千|直式|比大小/, forbid:/×|÷|除以|除數|餘數|\/|分之|小數|0\.\d|公斤|公克|公升|毫公升|公里|公尺|公分|毫米|小時|分鐘|秒|時針|分針|星期|月曆|日曆|硬幣|對折|剪斷|剪開|\d\s*時|時整|長方形|正方形|三角形|圓形|面積|角度|圓心|半徑|直徑|24 時|平方|扇形|公噸|公頃|億/ },
  '3_上_1': { allow:/×|÷|乘法|除法|餘數|被除數|除數|商|倍數|裝滿|租.*船|口訣|直式/, forbid:/\/|分之|小數|0\.\d|公斤|公克|公升|毫公升|公里|公尺|公分|毫米|小時|分鐘|秒|時針|分針|星期|月曆|日曆|硬幣|面積|周長|角度|圓心|半徑|直徑|24 時|平方|億/ },
  '3_上_2': { allow:/公里|公尺|公分|毫米|mm|km|直尺|刻度|長度|距離|步道|路程|重疊/, forbid:/×|除以|\/|分之|小數|0\.\d|公斤|公克|公升|毫公升|小時|分鐘|秒|時針|分針|星期|月曆|日曆|面積|周長|角度|圓心|半徑|直徑|24 時|平方|餘數|億|正方形|長方形|三角形/ },
  '3_上_3': { allow:/角|銳角|鈍角|直角|周長|正方形|長方形|正三角形|圓心|半徑|直徑|圓規|圖形/, forbid:/÷|除以|\/|分之|小數|0\.\d|公斤|公克|公升|毫公升|公里|毫米|小時|分鐘|秒|星期|月曆|日曆|硬幣|餘數|24 時|平方|億|梯形|體積/ },
  '3_下_0': { allow:/分之|\/|同分母|分子|分母|分數/, forbid:/小數|0\.\d|公斤|公克|公升|毫公升|公里|毫米|24 時|平方|角度|圓心|半徑|直徑|億|公噸|異分母/ },
  '3_下_1': { allow:/小數|十分位|0\.\d|1\.\d|2\.\d|3\.\d|0\.1/, forbid:/公斤|公克|公升|毫公升|公里|毫米|24 時|平方|角度|圓心|半徑|直徑|百分位|0\.0\d|億/ },
  '3_下_2': { allow:/24 時|小時|分鐘|秒|下午|上午|日曆|大月|小月|平年|閏年|公斤|公克|公升|毫公升|毫升|量杯|量筒/, forbid:/公里|毫米|小數|0\.\d|分數|\/|平方|角度|圓心|半徑|直徑|億|公噸/ },
  '3_下_3': { allow:/平方公分|面積|方格|格子|兩步驟|×|÷/, forbid:/公里|毫米|公斤|公克|公升|毫公升|小數|0\.\d|分數|\/|24 時|圓心|半徑|直徑|億|公噸|體積|立方/ },
  '4_上_0': { allow:/億|千萬|百萬|十萬|四捨五入|概數|無條件|捨去|進入|大數/, forbid:/\/|分之|小數|0\.\d|面積|平方|體積|立方|扇形|質數|公因|百分率|速率/ },
  '4_上_1': { allow:/×|÷|三位數|四位數|二位數|估商|餘數|裝箱|平分/, forbid:/\/|分之|小數|0\.\d|面積|平方|體積|立方|扇形|角度|°|質數|速率/ },
  '4_上_2': { allow:/角|度|°|量角器|平角|周角|直角|銳角|鈍角|三角形|等腰|正三角形|直角三角|垂直|平行/, forbid:/\/|分之|小數|0\.\d|面積|平方|體積|立方|億|公噸|速率/ },
  '4_上_3': { allow:/假分數|帶分數|真分數|同分母|公里|公尺|km|整數倍/, forbid:/小數|0\.\d|面積|平方|體積|立方|角度|°|億|公噸|速率/ },
  '4_下_0': { allow:/先乘除|括號|分配律|四則|混合|併式|\(|\)/, forbid:/\/|分之|小數|0\.\d|面積|平方|體積|立方|角度|°|億|速率/ },
  '4_下_1': { allow:/小數|百分位|0\.0\d|\.\d{2}|十分位|×/, forbid:/分數|\/|面積|平方|體積|立方|角度|°|億|公噸|速率/ },
  '4_下_2': { allow:/面積|周長|平方公尺|平方公分|複合圖形|L 形|正方形|長方形|邊長/, forbid:/\/|分之|小數|0\.\d|體積|立方|角度|°|億|公噸|速率/ },
  '4_下_3': { allow:/長條圖|折線圖|統計|時間|時刻|小時|分鐘|規律|數列|日期/, forbid:/\/|分之|平方|體積|立方|角度|°|億|公噸|速率/ },
  '5_上_0': { allow:/因數|倍數|整除|公因數|最大公因數|公倍數|最小公倍數|倍數判別/, forbid:/小數|0\.\d|體積|立方|表面積|扇形|圓周|百分率|%|速率|公噸|公頃/ },
  '5_上_1': { allow:/擴分|約分|通分|等值分數|異分母|分數|\/|分之/, forbid:/體積|立方|表面積|扇形|圓周|百分率|%|速率|公噸|公頃/ },
  '5_上_2': { allow:/多邊形|對稱|對稱軸|內角和|平行四邊形|三角形|梯形|面積|底|高/, forbid:/體積|立方|表面積|圓面積|圓周|百分率|%|速率|公噸|公頃/ },
  '5_上_3': { allow:/小數|三位小數|千分位|分配律|時間|小時|分鐘|秒|乘除/, forbid:/體積|立方|表面積|圓面積|圓周|百分率|%|速率|公噸|公頃/ },
  '5_下_0': { allow:/分數.*×|×.*分數|小數.*×|×.*小數|被乘數|幾分之幾的幾分之幾|面積|0\./, forbid:/÷|體積|立方|表面積|圓柱|百分率|%|速率|公噸|公頃/ },
  '5_下_1': { allow:/÷|除以|小數除法|四捨五入|商|餘數|平均/, forbid:/體積|立方|表面積|圓柱|百分率|%|速率|公噸|公頃/ },
  '5_下_2': { allow:/體積|容積|表面積|立方公分|立方公尺|長方體|正方體|公升|毫公升|水位|排水/, forbid:/百分率|%|打折|速率|圓柱|圓面積|公噸|公頃|公畝/ },
  '5_下_3': { allow:/百分率|%|比率|打.*折|加成|公噸|公頃|公畝|平方公里|進球率/, forbid:/體積|立方|表面積|圓柱|速率|未知數|x ＝/ },
  '6_上_0': { allow:/質數|合數|質因數|短除法|互質|最大公因數|最小公倍數/, forbid:/圓面積|圓周|扇形|速率|柱體|體積|表面積|x ＝|未知數/ },
  '6_上_1': { allow:/÷|分數除法|小數除法|餘數|最簡分數/, forbid:/圓面積|圓周|扇形|速率|柱體|體積|表面積|x ＝/ },
  '6_上_2': { allow:/：|比值|最簡單整數比|比例|正比|比例尺|圓形圖|圓心角.*%/, forbid:/速率|柱體|體積|表面積|x ＝|扇形面積/ },
  '6_上_3': { allow:/圓周長|圓面積|扇形|弧長|3\.14|π|圓周率|半圓|直徑|半徑/, forbid:/速率|柱體|體積|表面積|x ＝|質數/ },
  '6_下_0': { allow:/四則|混合|分配律|分數.*小數|簡算|打折|定價|成本/, forbid:/速率|柱體|體積|表面積|圓周|圓面積|x ＝/ },
  '6_下_1': { allow:/速率|時速|分速|秒速|距離|時間|相向|反方向|追趕|平均速率|公里\/時|公尺\/秒/, forbid:/柱體|體積|表面積|圓周|圓面積|質數/ },
  '6_下_2': { allow:/柱體|角柱|圓柱|底面積|體積|表面積|基準量|比較量|母子和|母子差|幾倍/, forbid:/速率|時速|秒速|雞兔|質數/ },
  '6_下_3': { allow:/x|未知數|方程式|雞兔|年齡|總複習|差|倍/, forbid:/圓柱|表面積|速率|時速|扇形/ }
};

function isMathItemAllowedForUnits(item, g, sem, unitIndices){
  if(!item) return false;
  if(item.g !== undefined && item.g !== null){
    if(+item.g !== +g) return false;
    if(item.sem && item.sem !== sem) return false;
    if(item.u !== undefined && item.u !== null){
      return Array.isArray(unitIndices) && unitIndices.includes(+item.u);
    }
  }
  if(!unitIndices || !unitIndices.length) return true;
  const txt = `${item.q||''} ${item.a||''} ${item.exp||''} ${item.pairs ? item.pairs.flat().join(' ') : ''}`;
  return unitIndices.some(uIdx=>{
    const spec = MATH_UNIT_FILTER[`${g}_${sem}_${uIdx}`];
    if(!spec) return true;
    if(spec.forbid && spec.forbid.test(txt)) return false;
    return spec.allow.test(txt);
  });
}

// 針對全課綱 48 個數學單元提供結構化多角度題幹變化庫（每單元皆具 25～40 種不重版型）
function genMathUnitSynth(g, sem, uIdx, diff, kind, vIdx=0){
  const nm = pick(NAMES), nm2 = pick(NAMES.filter(x=>x!==nm)), it = pick(ITEMS);
  const slot = Math.abs(vIdx) % 12;
  const isTrue = (vIdx + randSeed) % 2 === 0;
  const key = `${g}_${sem}_${uIdx}`;

  // 依年級與單元分派對應參數化核心生成器
  if(key==='1_上_0'){ // 10以內的數與分合（絕不出現加減符號、錢幣、時鐘、形狀、公分）
    const tot = rnd(5,10), a = rnd(1,tot-1), b = tot-a;
    const n1 = rnd(1,4), n2 = rnd(5,7), n3 = rnd(8,10);
    if(kind==='mc'){
      const t = slot % 9;
      if(t===0) return {q:`從 ${n1} 開始往後一個一個數，數 3 個數後會停在哪一個數字？`,opts:uniqueOpts(n1+3,[n1+2,n1+4,n1+1]),a:String(n1+3),exp:`${n1}、${n1+1}、${n1+2}、${n1+3}。`};
      if(t===1) return {q:`把數字「${n3}、${n1}、${n2}」從大排到小，排在最前面的數是哪一個？`,opts:uniqueOpts(n3,[n1,n2,n3-1]),a:String(n3),exp:`${n3} 最大，排在最前面。`};
      if(t===2) return {q:`數字「${tot}」可以分成「${a}」和哪一個數合起來？`,opts:uniqueOpts(b,[b+1,Math.max(1,b-1),tot]),a:String(b),exp:`${a} 和 ${b} 合起來是 ${tot}。`};
      if(t===3) return {q:`${nm}有 ${tot} 顆${it}，分給左右兩隻手握住，左手握了 ${a} 顆，右手握了幾顆？`,opts:uniqueOpts(`${b} 顆`,[`${a} 顆`,`${b+1} 顆`,`${tot} 顆`]),a:`${b} 顆`,exp:`${tot} 分成 ${a} 和 ${b}。`};
      if(t===4){const k=rnd(2,5),t0=rnd(6,9);return {q:`小朋友排成一列，從前面數過來第 ${k} 個是${nm}，從前面算到她一共有幾個人？`,opts:uniqueOpts(`${k} 個人`,[`${k-1} 個人`,`${k+1} 個人`,`${t0} 個人`]),a:`${k} 個人`,exp:`排在第 ${k} 個表示前面連她共 ${k} 人。`};}
      if(t===5) return {q:`下面哪一組兩個數字「合起來剛好是 10」？`,opts:uniqueOpts(`${a} 和 ${10-a}`,[`${a} 和 ${Math.max(1,9-a)}`,`1 和 8`,`3 和 6`]),a:`${a} 和 ${10-a}`,exp:`${a} 和 ${10-a} 合起來剛好是 10。`};
      if(t===6) return {q:`在「${n1}、${n2}、${n3}、2」這四個數字中，哪一個數字最小？`,opts:uniqueOpts(Math.min(n1,2),[n2,n3,Math.max(n1,3)]),a:String(Math.min(n1,2)),exp:`比較大小可知 ${Math.min(n1,2)} 最小。`};
      if(t===7){const st=rnd(6,9);return {q:`從 ${st} 開始一個一個倒數，倒數到第 2 個（${st} → □）會是哪一個數？`,opts:uniqueOpts(st-1,[st-2,st+1,st]),a:String(st-1),exp:`${st} 倒數 1 個數就是 ${st-1}。`};}
      return {q:`下列哪一個選項中的大小比較符號寫錯了？`,opts:uniqueOpts(`${n1} ＞ ${n3}`,[`${n3} ＞ ${n2}`,`${n2} ＜ ${n3}`,`${n1} ＜ ${n2}`]),a:`${n1} ＞ ${n3}`,exp:`${n1} 比 ${n3} 小，應寫作 ${n1} ＜ ${n3}。`};
    }
    if(kind==='tf'){
      const t = slot % 7;
      if(t===0) return {q:`數字順序檢查：從 1 數到 10 時，「7」會排在「8」的後面。`,a:'✕',exp:`7 比 8 小，7 排在 8 的前面。`};
      if(t===1) return {q:`分與合觀念：${tot} 可以分成 ${a} 和 ${isTrue?b:b+1}，也可以分成 ${isTrue?b:b+1} 和 ${a}。`,a:isTrue?'○':'✕',exp:`${tot} 分成 ${a} 和 ${b}。`};
      if(t===2) return {q:`數量比較：「${n2} 顆彈珠」比「${n1} 顆彈珠」多，記作 ${isTrue?`${n2} ＞ ${n1}`:`${n2} ＜ ${n1}`}。`,a:isTrue?'○':'✕',exp:`${n2} 大於 ${n1}。`};
      if(t===3) return {q:`如果盤子裡什麼都沒有，空盤子的數量可以用數字「0」來表示。`,a:'○',exp:`0 表示沒有數量。`};
      if(t===4){const k=rnd(2,5);return {q:`排隊買點心時，${nm}排在第 ${k} 個，表示她的前面排了 ${isTrue?k-1:k} 個人。`,a:isTrue?'○':'✕',exp:`第 ${k} 個前面有 ${k-1} 人。`};}
      if(t===5) return {q:`「6 和 4 合起來」與「7 和 3 合起來」得到的數字一樣大。`,a:'○',exp:`兩者合起來都是 10。`};
      return {q:`把 9 倒數兩個數：9 → 8 → ${isTrue?7:6}。`,a:isTrue?'○':'✕',exp:`9 倒數兩個數是 7。`};
    }
    if(kind==='fill'){
      const t = slot % 7;
      if(t===0) return {q:`倒數填空：10 → 9 →（　）→ 7 →（　）。`,a:'8；6'};
      if(t===1) return {q:`合 10 填空：${a} 和（　）合起來是 10；3 和（　）合起來是 10。`,a:`${10-a}；7`};
      if(t===2) return {q:`數字分合：${tot} 可以分成 ${a} 和（　），也可以分成 ${b} 和（　）。`,a:`${b}；${a}`};
      if(t===3) return {q:`順序比較：比 ${n2} 大 1 的數是（　），比 ${n2} 小 1 的數是（　）。`,a:`${n2+1}；${n2-1}`};
      if(t===4) return {q:`比大小填入 ＞、＜ 或 ＝：${n3}（　）${n2}；${n1}（　）${n3}。`,a:'＞；＜'};
      if(t===5){const k=rnd(3,7);return {q:`排隊數順序：共有 10 人，從前面數起第 ${k} 個，他的前面有（　）人，後面有（　）人。`,a:`${k-1}；${10-k}`};}
      return {q:`由小到大排序「${n3}、${n1}、${n2}」：（　）＜（　）＜（　）。`,a:`${n1}；${n2}；${n3}`};
    }
    if(kind==='calc'){
      const t = slot % 5;
      if(t===0) return {q:`看數分合填寫：${tot} 可以分成 ${a} 和（　　）`,a:String(b)};
      if(t===1) return {q:`湊成 10 的分合：${a} 和（　　）合起來是 10`,a:String(10-a)};
      if(t===2) return {q:`數的合成練習：${a} 和 ${b} 合起來是（　　）`,a:String(tot)};
      if(t===3) return {q:`從 ${n2} 順數 3 個數後會到達（　　）`,a:String(n2+3)};
      return {q:`從 ${n3} 倒數 2 個數後會停在（　　）`,a:String(n3-2)};
    }
    if(kind==='word'){
      const t = slot % 4;
      if(t===0) return {q:`媽媽把 ${tot} 個草莓分裝進兩個碗裡，大碗裝了 ${a} 個，小碗要裝幾個草莓？`,a:`${tot} 可以分成 ${a} 和 ${b}，小碗裝 ${b} 個`};
      if(t===1) return {q:`10 隻鴨子分在水池和草地上，水池裡有 ${a} 隻，草地上應該有幾隻鴨子？`,a:`10 可以分成 ${a} 和 ${10-a}，草地上有 ${10-a} 隻`};
      if(t===2) return {q:`${nm}排隊領餅乾，從前面數過去她是第 ${n1+1} 個，從後面數回來也是第 ${n1+1} 個，請問總共有幾人排隊？（提示：不要重複算到${nm}）`,a:`前面 ${n1} 人，中間${nm} 1 人，後面 ${n1} 人，共 ${n1*2+1} 人`};
      return {q:`盒子裡有 ${tot} 顆彈珠，${nm}和${nm2}分著拿完，已知${nm}拿了 ${a} 顆，請問誰拿的比較多？多幾顆？`,a:`${nm2}拿了 ${b} 顆，比較一下即可判斷誰多`};
    }
    const mSlot = slot % 3;
    if(mSlot===0) return {q:'10 以內「合起來是 10」分合配對',pairs:[['1 和 □','9'],['2 和 □','8'],['3 和 □','7'],['5 和 □','5']]};
    if(mSlot===1) return {q:'10 以內數字大小與順序配對',pairs:[['8 的下一個數','9'],['比 6 小 1 的數','5'],['7 和 2 合起來','9'],['最大的個位數','9']]};
    return {q:'數字分合對應配對',pairs:[['8 分成 3 和 □','5'],['9 分成 4 和 □','5'],['7 分成 2 和 □','5'],['6 分成 4 和 □','2']]};
  }

  // 針對其餘所有 47 個單元，依真實課綱主題給予多元題型變化
  const uObj = (((window.CURRICULUM||{})[g]||{})['數學']||{})[sem]?.[uIdx];
  const uName = uObj ? uObj.name : `單元${uIdx+1}`;
  const uShort = uName.split('：')[1] || uName;
  const maxN = g===1 ? (sem==='上' && uIdx<=1 ? 10 : (sem==='上' ? 20 : 99)) : (g===2 ? 999 : (g===3 ? 9999 : 99999));

  // 依單元類別分派高變化題庫（保證 100% 鎖定單元並絕不滲入他單元概念）
  if(key==='1_上_1'){ // 10以內加減法
    const a=rnd(2,5), b=rnd(1,9-a), s=a+b;
    if(kind==='mc'){
      const t=slot%7;
      if(t===0) return {q:`「${a} ＋ ${b}」算出來的得數與下列哪一個算式相等？`,opts:uniqueOpts(`${s} － 0`,[`${s} ＋ 1`,`${s} － 2`,`${a} ＋ ${b+2}`]),a:`${s} － 0`,exp:`兩式結果皆為 ${s}。`};
      if(t===1) return {q:`樹上停了 ${s} 隻麻雀，飛走 ${a} 隻後，還剩下幾隻麻雀？`,opts:uniqueOpts(`${b} 隻`,[`${a} 隻`,`${s} 隻`,`${b+1} 隻`]),a:`${b} 隻`,exp:`${s}－${a}＝${b} 隻。`};
      if(t===2) return {q:`如果「□ ＋ ${a} ＝ ${s}」，那麼 □ 裡面應該填入什麼數字？`,opts:uniqueOpts(b,[a,s,Math.max(0,b-1)]),a:String(b),exp:`${s}－${a}＝${b}。`};
      if(t===3) return {q:`盤子裡本來有 ${a} 顆水餃，又夾進 ${b} 顆，現在盤子裡共有幾顆？`,opts:uniqueOpts(`${s} 顆`,[`${s-1} 顆`,`${s+1} 顆`,`${b} 顆`]),a:`${s} 顆`,exp:`${a}＋${b}＝${s} 顆。`};
      if(t===4) return {q:`比較「${a} ＋ ${b}」和「${s} － 1」的答案，哪一個比較大？`,opts:uniqueOpts(`${a} ＋ ${b}`,[`${s} － 1`,'一樣大','無法比較']),a:`${a} ＋ ${b}`,exp:`${a}＋${b}＝${s}，大於 ${s-1}。`};
      if(t===5) return {q:`「9 － 0」與下列哪一個算式的答案一模一樣？`,opts:uniqueOpts('6 ＋ 3',['6 ＋ 2','8 ＋ 0','10 － 2']),a:'6 ＋ 3',exp:`9－0＝9，6＋3＝9。`};
      return {q:`下面哪一個算式適合用來算出「${s} 顆蘋果吃掉 ${a} 顆後剩幾顆」？`,opts:uniqueOpts(`${s} － ${a}`,[`${s} ＋ ${a}`,`${a} － ${s}`,`${s} － ${a+1}`]),a:`${s} － ${a}`,exp:`拿走或吃掉要用減法：${s}－${a}。`};
    }
    if(kind==='tf'){
      const t=slot%6;
      if(t===0) return {q:`任何一個 10 以內的數加上 0，結果還是原來的那個數。`,a:'○',exp:`加 0 不增加數量。`};
      if(t===1) return {q:`計算「${s} － ${a}」時，答案一定會比原本的 ${s} 大。`,a:'✕',exp:`減去大於 0 的數會變小。`};
      if(t===2) return {q:`${a} ＋ ${b} ＝ ${isTrue?s:s+1}。`,a:isTrue?'○':'✕',exp:`${a}＋${b}＝${s}。`};
      if(t===3) return {q:`「${a} ＋ ${b}」算出來的答案跟「${b} ＋ ${a}」完全相同。`,a:'○',exp:`加法交換律不影響和。`};
      if(t===4) return {q:`盒子裡有 ${s} 個積木，拿走全部的 ${s} 個後，還剩下 ${isTrue?0:1} 個。`,a:isTrue?'○':'✕',exp:`${s}－${s}＝0。`};
      return {q:`「10 － 3」的結果是 ${isTrue?7:8}。`,a:isTrue?'○':'✕',exp:`10－3＝7。`};
    }
    if(kind==='fill'){
      const t=slot%6;
      if(t===0) return {q:`加法減法互推：${a} ＋ ${b} ＝（　），所以 ${s} － ${b} ＝（　）。`,a:`${s}；${a}`};
      if(t===1) return {q:`空格填空：${a} ＋（　）＝ ${s}。`,a:String(b)};
      if(t===2) return {q:`減法空格：${s} －（　）＝ ${a}。`,a:String(b)};
      if(t===3) return {q:`比大小（填 ＞、＜ 或 ＝）：${a} ＋ ${b}（　）10 － 1。`,a:s>9?'＞':(s<9?'＜':'＝')};
      if(t===4) return {q:`寫出兩個相加等於 ${s} 的不同加法算式：${a} ＋（　）＝ ${s}、0 ＋（　）＝ ${s}。`,a:`${b}；${s}`};
      return {q:`加 0 與減 0：${s} ＋ 0 ＝（　），${s} － ${s} ＝（　）。`,a:`${s}；0`};
    }
    if(kind==='calc'){
      const t=slot%5;
      if(t===0) return {q:`${a} ＋ ${b} ＝（　　）`,a:String(s)};
      if(t===1) return {q:`${s} － ${a} ＝（　　）`,a:String(b)};
      if(t===2) return {q:`逆推加法：（　）＋ ${b} ＝ ${s}`,a:String(a)};
      if(t===3) return {q:`先加後減檢核：${a} ＋ ${b} － 1 ＝（　　）`,a:String(s-1)};
      return {q:`被減數求解：（　）－ ${a} ＝ ${b}`,a:String(s)};
    }
    if(kind==='word'){
      const t=slot%4;
      if(t===0) return {q:`草地上有 ${a} 隻白兔和 ${b} 隻灰兔，草地上一共有幾隻兔子？`,a:`${a} + ${b} = ${s}（隻）`};
      if(t===1) return {q:`籃子裡有 ${s} 個水梨，被吃掉了 ${a} 個，籃子裡還剩下幾個水梨？`,a:`${s} - ${a} = ${b}（個）`};
      if(t===2) return {q:`${nm}有 ${s} 張貼紙，${nm2}有 ${a} 張貼紙，${nm}比${nm2}多幾張貼紙？`,a:`${s} - ${a} = ${b}（張）`};
      return {q:`魚缸裡原本有 ${a} 條金魚，爸爸再放進一些魚後變成 ${s} 條，爸爸放進了幾條魚？`,a:`${s} - ${a} = ${b}（條）`};
    }
    return {q:'10 以內相同答案算式配對',pairs:[['3 ＋ 5','8'],['10 － 4','6'],['2 ＋ 7','9'],['8 － 5','3']]};
  }

  if(key==='1_上_2'){ // 比長短與認識形狀
    const shapes=['三角形','正方形','長方形','圓形'], sPick=shapes[slot%4];
    if(kind==='mc'){
      const t=slot%7;
      if(t===0) return {q:`把同一條繩子拉直和彎曲放在桌面上，哪一種擺法看起來會感覺比較長（實際一樣長）？`,opts:uniqueOpts('拉直的時候看起來比較長',['彎成波浪時比較長','兩邊看起來一樣長','繩子縮短了一半']),a:'拉直的時候看起來比較長',exp:`繩子沒有伸縮時總長不變，拉直比較容易直接比長短。`};
      if(t===1) return {q:`要比較兩枝鉛筆誰比較長，最正確的擺放方式是什麼？`,opts:uniqueOpts('把兩枝筆的一端對齊同一個起點來比',['隨便斜放著目測就好','把兩枝筆擺在不同桌子上比較','只看筆蓋的顏色來決定']),a:'把兩枝筆的一端對齊同一個起點來比',exp:`比長短必須對齊同一個起點。`};
      if(t===2) return {q:`下列哪一個立體形體在斜坡上「最容易向四面八方滾動」？`,opts:uniqueOpts('皮球（球體）',['正方體積木','長方體餅乾盒','三角柱積木']),a:'皮球（球體）',exp:`球體都是曲面，最容易滾動。`};
      if(t===3) return {q:`想用積木「往上疊高高而不倒塌」，選擇哪兩種形體平平的面最穩固？`,opts:uniqueOpts('正方體和長方體',['兩顆圓球疊在一起','圓球疊在三角錐上','把圓罐橫躺來疊']),a:'正方體和長方體',exp:`平面貼合平面最穩固好堆疊。`};
      if(t===4) return {q:`沿著一個圓柱形飲料罐的底面邊緣描一圈，描出來的平面圖形是什麼形狀？`,opts:uniqueOpts('圓形',['正方形','三角形','長方形']),a:'圓形',exp:`圓柱體的底面是圓形。`};
      if(t===5) return {q:`下面哪一種生活物品的表面「通常是長方形」？`,opts:uniqueOpts('教室裡的黑板',['十元硬幣的面','三角板','皮球的表面']),a:'教室裡的黑板',exp:`黑板是常見的長方形平面。`};
      return {q:`圖形「${sPick}」在下面哪一種特徵上最正確？`,opts:uniqueOpts(sPick==='圓形'?'沒有直直的邊和尖尖的角':(sPick==='三角形'?'有 3 條直直的邊和 3 個角':'有 4 條直直的邊'),['有 10 條邊','一定會在地上自己滾動','全部都只有曲線']),a:sPick==='圓形'?'沒有直直的邊和尖尖的角':(sPick==='三角形'?'有 3 條直直的邊和 3 個角':'有 4 條直直的邊'),exp:`依平面圖形邊角特徵判斷。`};
    }
    if(kind==='tf'){
      const t=slot%6;
      if(t===0) return {q:`比較兩把尺誰比較長時，一定要把其中一端對齊同一條線再比另一端。`,a:'○',exp:`起點對齊才能正確比較長短。`};
      if(t===1) return {q:`彎彎曲曲的路線稱為「直線」，直直拉緊的線稱為「曲線」。`,a:'✕',exp:`拉直不彎曲的才叫直線，彎曲的是曲線。`};
      if(t===2) return {q:`正方體積木的每一個面都是平平的，所以疊起來很穩固、不容易滾動。`,a:'○',exp:`平平的面適合堆疊。`};
      if(t===3) return {q:`圓形和三角形都各有 3 條直直的邊和 3 個尖尖的角。`,a:'✕',exp:`圓形沒有直直的邊也沒有角。`};
      if(t===4) return {q:`用 4 枝一樣長的小棒子圍起來，可以圍出一個正方形。`,a:'○',exp:`正方形四條邊一樣長。`};
      return {q:`把鉛筆盒拿去描一圈它的底面，可以描出一個長方形。`,a:'○',exp:`長方體底面通常為長方形。`};
    }
    if(kind==='fill'){
      const t=slot%5;
      if(t===0) return {q:`比較長短時，要先將兩條繩子拉（　），並將其中一端對（　）再比較。`,a:'直；齊'};
      if(t===1) return {q:`立體積木中，全部都是曲面、滾最快的是（　）體；四四方方很好堆疊的是（　　）體。`,a:'球；正方'};
      if(t===2) return {q:`平面圖形中，圓形（　）直直的邊（填「有」或「沒有」）；三角形有（　）條邊。`,a:'沒有；3'};
      if(t===3) return {q:`將正方體的平平那一面印在紙上，印出來的圖形是（　　）形。`,a:'正方'};
      return {q:`甲繩比乙繩長，乙繩又比丙繩長，所以這三條繩子中最長的是（　）繩，最短的是（　）繩。`,a:'甲；丙'};
    }
    if(kind==='calc'){
      const t=slot%4;
      if(t===0) return {q:`圖形點數：機器人圖案上有 2 個三角形、1 個圓形、3 個長方形，請問「三角形和圓形」合起來有（　　）個`,svg:svgShapeRobot(),a:'3'};
      if(t===1) return {q:`排積木計數：用了 3 個長方體和 2 個圓柱體搭城堡，一共用了（　　）個積木`,a:'5'};
      if(t===2) return {q:`小屋拼貼：1 個三角形屋頂、2 個正方形窗戶、1 個長方形大門，共用了（　　）片圖卡`,svg:svgShapeHouse(),a:'4'};
      return {q:`長度比較判斷：紅筆長 8 格、藍筆長 5 格，紅筆比藍筆長了（　　）格`,a:'3'};
    }
    if(kind==='word'){
      const t=slot%4;
      if(t===0) return {q:`${nm}用圖形板拼圖，用了 3 個三角形和 4 個正方形，兩種圖形板合起來共有幾個？`,a:`3 + 4 = 7（個）`};
      if(t===1) return {q:`桌上放著紅、藍、黃三條緞帶，全部對齊左邊起點後，紅緞帶最突出，黃緞帶最短。請把三條緞帶由長到短排出來。`,a:`由長到短：紅緞帶 ＞ 藍緞帶 ＞ 黃緞帶`};
      if(t===2) return {q:`${nm}想搭一座高塔，他有皮球、三角錐和正方體積木三種材料，哪一種放在最底下當底座最合適？為什麼？`,a:`正方體積木最適合，因為它的面平平的不會滾動，能穩穩疊起來。`};
      return {q:`在造型小屋圖形裡，共有幾種不同的平面圖形？哪一種形狀最多？`,svg:svgShapeHouse(),a:`共 3 種（三角形 1 個、圓形 2 個、長方形 2 個）`};
    }
    return {q:'立體與平面形體配對',pairs:[['籃球','圓滾滾容易滾動'],['字典','長方體很好堆疊'],['三角板','有 3 條邊的三角形'],['正方形色紙','4 條邊一樣長']]};
  }

  // 其餘單元：直接呼叫通用結構產生器（嚴格遵守該單元主題詞與對應難度級數）
  const dTag = diff==='hard' ? '【素養思考】' : (diff==='easy' ? '【基礎練習】' : '');
  const tps = uObj?.topics || [uShort];
  const tpA = tps[slot % tps.length];
  const tpB = tps[(slot + 1) % tps.length];
  const tpC = tps[(slot + 2) % tps.length];

  // 各領域實數算式／應用題核心素材（依 grade & sem & uIdx 精準對應，絕不混入別單元）
  const genNumericByDomain = () => {
    // 依據 g_sem_uIdx 產生真確數字算題（100% 符合該單元算式類型）
    if(key==='1_上_3'){ // 20以內的數與加減（純數與加減・16種以上不重疊題型變化，絕不出現時鐘）
      const a=rnd(6,9), b=rnd(5,9), n1=rnd(11,19), u=n1-10, s1=a+b;
      const mcV = [
        {arch:'arch_make_ten_method',q:`計算「${a} ＋ ${b}」時，先拆湊成 10 再加，答案是多少？`,opts:uniqueOpts(s1,[s1-1,s1+1,s1+2]),a:String(s1),exp:`${a}＋${b}＝${s1}。`},
        {arch:'arch_teen_word_form',q:`數字「${n1}」由幾個十和幾個一合起來的？`,opts:uniqueOpts(`1 個十和 ${u} 個一`,[`${u} 個十和 1 個一`,`10 個十和 ${u} 個一`,`2 個十和 ${u} 個一`]),a:`1 個十和 ${u} 個一`,exp:`${n1}＝10＋${u}。`},
        {arch:'arch_borrow_ten_method',q:`用「先從 10 減」的方法算「${s1} － ${a}」，答案是多少？`,opts:uniqueOpts(b,[b+1,Math.max(1,b-1),s1]),a:String(b),exp:`${s1}－${a}＝${b}。`},
        {arch:'arch_teen_missing_box',q:`如果「${a} ＋ □ ＝ ${s1}」，那麼 □ 裡面應該填多少？`,opts:uniqueOpts(b,[a,s1,b+2]),a:String(b),exp:`${s1}－${a}＝${b}。`},
        {arch:'arch_teen_parity_pat',q:`找規律：「12、14、（　）、18、20」，括號中應填入哪個數？`,opts:uniqueOpts('16',['15','17','13']),a:'16',exp:`每次多 2，14＋2＝16。`},
        {arch:'arch_teen_compare_range',q:`下面哪一個算式算出來「比 13 大，又比 16 小」？`,opts:uniqueOpts('8 ＋ 6',['9 ＋ 8','7 ＋ 5','19 － 7']),a:'8 ＋ 6',exp:`8＋6＝14，介於 13 和 16 之間。`}
      ];
      const tfV = [
        {arch:'arch_tf_teen_sub_chk',q:`把 ${s1} － ${a} 算出來，結果是 ${isTrue?b:b+1}。`,a:isTrue?'○':'✕',exp:`${s1}－${a}＝${b}。`},
        {arch:'arch_tf_teen_digit_pos',q:`「19」的十位數字是 1、個位數字是 ${isTrue?9:0}。`,a:isTrue?'○':'✕',exp:`19 是 1 個十和 9 個一。`},
        {arch:'arch_tf_teen_commute',q:`「${a} ＋ ${b}」和「${b} ＋ ${a}」算出來的答案一樣大。`,a:'○',exp:`交換加數順序，和不變。`},
        {arch:'arch_tf_teen_countdown',q:`從 20 往前倒數兩個數（20、19、□）會停在 ${isTrue?18:17}。`,a:isTrue?'○':'✕',exp:`20 倒數兩個數是 18。`}
      ];
      const fillV = [
        {arch:'arch_fill_teen_pair',q:`進位與退位：${a} ＋ ${b} ＝（　　）；16 － ${a} ＝（　　）。`,a:`${s1}；${16-a}`},
        {arch:'arch_fill_teen_cmp',q:`比大小（填 ＞、＜ 或 ＝）：9 ＋ 5（　）13；18 － 9（　）10。`,a:'＞；＜'},
        {arch:'arch_fill_teen_split',q:`湊十法步驟：計算 9 ＋ ${a} 時，把 ${a} 分成 1 和（　），答案是（　　）。`,a:`${a-1}；${9+a}`},
        {arch:'arch_fill_teen_neighbors',q:`數的順序：比 ${n1} 多 1 的數是（　　），少 1 的數是（　　）。`,a:`${n1+1}；${n1-1}`}
      ];
      const calcV = [
        {arch:'arch_calc_teen_add',q:`${a} ＋ ${b} ＝（　　）`,a:String(s1)},
        {arch:'arch_calc_teen_sub',q:`${s1} － ${a} ＝（　　）`,a:String(b)},
        {arch:'arch_calc_teen_eq',q:`平衡算式：8 ＋ 7 ＝ 10 ＋（　　）`,a:'5'},
        {arch:'arch_calc_teen_3add',q:`連加計算：4 ＋ 6 ＋ ${b} ＝（　　）`,a:String(10+b)}
      ];
      const wordV = [
        {arch:'arch_word_teen_combine',q:`籃子裡有 ${a} 顆紅球和 ${b} 顆藍球，合起來一共有幾顆球？`,a:`${a} + ${b} = ${s1}（顆）`},
        {arch:'arch_word_teen_left',q:`${nm}原有 ${s1} 張貼紙，送給同學 ${a} 張後，還剩下幾張貼紙？`,a:`${s1} - ${a} = ${b}（張）`},
        {arch:'arch_word_teen_diff',q:`哥哥折了 ${s1} 隻紙鶴，弟弟折了 ${a} 隻，哥哥比弟弟多折幾隻？`,a:`${s1} - ${a} = ${b}（隻）`}
      ];
      return {
        mc: mcV[slot % mcV.length],
        tf: tfV[slot % tfV.length],
        fill: fillV[slot % fillV.length],
        calc: calcV[slot % calcV.length],
        word: wordV[slot % wordV.length],
        match: {q:'20 以內進退位與位值配對',pairs:[['8 ＋ 7','15'],['14 － 6','8'],['1 個十和 9 個一','19'],['9 ＋ 8','17']]}
      };
    }
    if(g===2 && sem==='上' && uIdx===3 || g===2 && sem==='下' && uIdx===0){ // 二年級乘法表
      const tables = uIdx===3 ? [2,4,5,8] : [3,6,7,9];
      const m1 = tables[slot % tables.length], m2 = rnd(2,9);
      return {
        mc: {q:`${m1} 的乘法中，「${m1} × ${m2}」代表幾個 ${m1} 連加？積是多少？`,opts:uniqueOpts(`${m2} 個 ${m1}，積是 ${m1*m2}`,[`${m1} 個 ${m2}，積是 ${m1*m2+m1}`,`積是 ${m1+m2}`,`${m2} 個 ${m1}，積是 ${m1*(m2-1)}`]),a:`${m2} 個 ${m1}，積是 ${m1*m2}`,exp:`${m1}×${m2}＝${m1*m2}。`},
        tf: {q:`「${m1} × ${m2}」比「${m1} × ${m2-1}」多了 ${isTrue?m1:m2}。`,a:isTrue?'○':'✕',exp:`每多 1 個 ${m1} 就多 ${m1}。`},
        fill: {q:`九九乘法填空：${m1} ×（　）＝ ${m1*m2}；${m1*m2} ＝ ${m2} ×（　）。`,a:`${m2}；${m1}`},
        calc: {q:`${m1} × ${m2} ＝（　　）`,a:String(m1*m2)},
        word: {q:`一盒餅乾有 ${m1} 片，${nm}買了 ${m2} 盒，總共有幾片餅乾？`,a:`${m1} × ${m2} = ${m1*m2}（片）`},
        match: {q:`${tables.join('、')} 乘法口訣配對`,pairs:tables.map((tb,ti)=>[`${tb} × ${ti+4}`,String(tb*(ti+4))])}
      };
    }
    if(g===3 && sem==='上'){
      const vn = Math.abs(vIdx);
      if(uIdx===0){ // 一萬以內的數與加減（豐富不重複結構）
        const n1=rnd(1200,4500), n2=rnd(1100,3400), dTh=rnd(2,7), dH=rnd(1,8), dT=rnd(1,9);
        const mcList=[
          {q:`數字「${n1}」中，千位數字和百位數字加起來是多少？`,opts:uniqueOpts(Math.floor(n1/1000)+Math.floor((n1%1000)/100),[Math.floor(n1/1000),Math.floor((n1%1000)/100)+2,Math.floor(n1/100)]),a:String(Math.floor(n1/1000)+Math.floor((n1%1000)/100)),exp:`千位 ${Math.floor(n1/1000)} ＋ 百位 ${Math.floor((n1%1000)/100)}。`},
          {q:`「${dTh} 個千、${dH} 個百和 ${dT} 個一」合起來寫成四位數是多少？`,opts:uniqueOpts(`${dTh}${dH}0${dT}`,[`${dTh}0${dH}${dT}`,`${dTh}${dH}${dT}0`,`${dTh}${dH}${dT}`]),a:`${dTh}${dH}0${dT}`,exp:`十位沒有用 0 補位。`},
          {q:`四位數「${dTh}00${dT}」的正確國字讀法是哪一個？`,opts:uniqueOpts(`${'零一二三四五六七八九'[dTh]}千零${'零一二三四五六七八九'[dT]}`,[`${'零一二三四五六七八九'[dTh]}千零零${'零一二三四五六七八九'[dT]}`,`${'零一二三四五六七八九'[dTh]}千${'零一二三四五六七八九'[dT]}十`,`${'零一二三四五六七八九'[dTh]}百零${'零一二三四五六七八九'[dT]}`]),a:`${'零一二三四五六七八九'[dTh]}千零${'零一二三四五六七八九'[dT]}`,exp:`中間連續兩個零只讀一個零。`},
          {q:`百貨公司週年慶滿千送百，買了 ${dTh*1000+300} 元的電器，總共可以折抵幾百元？`,opts:uniqueOpts(`${dTh*100} 元`,[`${dTh*10} 元`,`${dTh*100+30} 元`,'100 元']),a:`${dTh*100} 元`,exp:`共有 ${dTh} 個千元，送 ${dTh*100} 元。`},
          {q:`哪一個四位數「最接近 5000」？`,opts:uniqueOpts('4985',['4500','5120','4099']),a:'4985',exp:`4985 與 5000 只差 15，距離最近。`},
          {q:`把「${n1} ＋ ${n2}」先看成幾千再估算，結果最接近哪一個數？`,opts:uniqueOpts(`${Math.round((n1+n2)/1000)*1000}`,[`${Math.round((n1+n2)/1000)*1000+2000}`,`${Math.round((n1+n2)/1000)*1000-2000}`,'999']),a:`${Math.round((n1+n2)/1000)*1000}`,exp:`實際總和為 ${n1+n2}。`},
          {q:`若「乙 ＋ ${n1} ＝ ${n1+n2}」，請問乙是多少？`,opts:uniqueOpts(n2,[n1,n2+100,Math.max(100,n2-100)]),a:String(n2),exp:`逆推減法得 ${n2}。`},
          {q:`用「8、0、3、5」排出一個最小的四位數（千位不為 0），這個數是多少？`,opts:uniqueOpts('3058',['3508','0358','3085']),a:'3058',exp:`千位放最小非零數字 3，再放 0、5、8。`},
          {q:`數線上一大格代表 100，從 ${dTh*1000} 往右跳 ${dH} 大格會到達哪一個數？`,opts:uniqueOpts(`${dTh*1000+dH*100}`,[`${dTh*1000+dH*10}`,`${dTh*1000+dH}`,`${(dTh+dH)*1000}`]),a:`${dTh*1000+dH*100}`,exp:`加 ${dH} 個百得 ${dTh*1000+dH*100}。`},
          {q:`書局進貨 ${n1+n2} 本故事書，賣出 ${n1} 本後，架上還剩幾本故事書？`,opts:uniqueOpts(`${n2} 本`,[`${n2+100} 本`,`${n1} 本`,`${n2-50} 本`]),a:`${n2} 本`,exp:`${n1+n2}－${n1}＝${n2} 本。`},
          {q:`「${dTh}980」的百位加上 1 之後進位，會變成哪一個數？`,opts:uniqueOpts(`${(dTh+1)*1000+80}`,[`${dTh*1000+80}`,`${(dTh+1)*1000+980}`,`${dTh*1000+990}`]),a:`${(dTh+1)*1000+80}`,exp:`加 100 後千位進一。`},
          {q:`比較四位數「${dTh}520」和「${dTh}250」，千位一樣時要從哪一位繼續比大小？`,opts:uniqueOpts('百位',['個位','十位','萬位']),a:'百位',exp:`從最高位依序向右比。`},
          {q:`「${dTh} 千 ${dH} 百 ${dT} 十」比「${dTh}000」多出了多少？`,opts:uniqueOpts(`${dH*100+dT*10}`,[`${dH*10+dT}`,`${dTh*1000}`,`${dH*1000}`]),a:`${dH*100+dT*10}`,exp:`扣掉整千部分剩 ${dH*100+dT*10}。`},
          {q:`下列哪一個四位數的「十位數字是 0，而且百位數字比個位數字大」？`,opts:uniqueOpts('4702',['4207','4072','7042']),a:'4702',exp:`4702 十位為 0，且百位 7 ＞ 個位 2。`},
          {q:`文具店上個月賣出 2480 枝筆，這個月賣出 3120 枝筆，兩個月大約共賣出幾枝筆（估算至千位）？`,opts:uniqueOpts('約 5600 枝',['約 4000 枝','約 7000 枝','約 3000 枝']),a:'約 5600 枝',exp:`2480＋3120＝5600 枝。`},
          {q:`「${dTh}000 － 1」的結果是多少？`,opts:uniqueOpts(`${dTh*1000-1}`,[`${dTh*1000-10}`,`${dTh*1000+1}`,`${(dTh-1)*1000}`]),a:`${dTh*1000-1}`,exp:`整千減 1 會退位成三個 9，如 3000－1＝2999。`},
          {q:`哪兩個四位數之間相差剛好是 1000？`,opts:uniqueOpts('3456 和 4456',['3456 和 3556','3456 和 3466','3456 和 4356']),a:'3456 和 4456',exp:`僅千位數字相差 1，即差 1000。`},
          {q:`一雙運動鞋原價 2400 元，特價減 450 元，現在賣多少元？`,opts:uniqueOpts('1950 元',['2050 元','1850 元','2850 元']),a:'1950 元',exp:`2400－450＝1950 元。`},
          {q:`把「7995、8010、7959」由小到大排好，排在第一個的是哪一個數？`,opts:uniqueOpts('7959',['7995','8010','7999']),a:'7959',exp:`7959 ＜ 7995 ＜ 8010。`},
          {q:`百貨公司特價家電 6350 元，老闆給折扣 1350 元，實付多少元？`,opts:uniqueOpts('5000 元',['5350 元','4950 元','7700 元']),a:'5000 元',exp:`6350－1350＝5000 元。`},
          {q:`數卡「9、0、2、6」排成最大四位數減去 1000 後會變成多少？`,opts:uniqueOpts('8620',['9620','7620','8260']),a:'8620',exp:`9620－1000＝8620。`},
          {q:`將「${dTh*1000}、${(dTh+1)*1000}、${(dTh+2)*1000}」三個數合起來比較，哪一個比 9000 最靠近或相等？`,opts:uniqueOpts(`${(dTh+2)*1000}`,[`${dTh*1000}`,`${(dTh+1)*1000}`,'1000']),a:`${(dTh+2)*1000}`,exp:`較大者更靠近 9000。`},
          {q:`一個四位數的千位與十位相同、百位比個位多 2，下列哪一個數符合條件？`,opts:uniqueOpts('5452',['5254','4552','5425']),a:'5452',exp:`千位＝十位＝5，百位 4 － 個位 2 ＝ 2。`},
          {q:`「九千零一」寫成阿拉伯數字時，裡面會有幾個 0？`,opts:uniqueOpts('2 個',['1 個','3 個','0 個']),a:'2 個',exp:`九千零一寫作 9001，中間百位與十位共 2 個 0。`},
          {q:`計算「7000 － 2450」時，退位之後的正確差是多少？`,opts:uniqueOpts('4550',['5550','4650','5450']),a:'4550',exp:`7000－2450＝4550。`},
          {q:`甲庫有 ${n1} 顆彈珠，乙庫有 ${n2} 顆彈珠，兩庫合起來比 10000 少幾顆？`,opts:uniqueOpts(`${10000-n1-n2} 顆`,[`${n1+n2} 顆`,`${10000-n1} 顆`,`${Math.abs(n1-n2)} 顆`]),a:`${10000-n1-n2} 顆`,exp:`10000－(${n1}＋${n2})＝${10000-n1-n2}。`},
          {q:`四位數「3890」加上多少以後，會剛好變成 4000？`,opts:uniqueOpts('110',['210','90','1010']),a:'110',exp:`4000－3890＝110。`},
          {q:`數字「${dTh}405」中的「4」是在百位，如果把它改寫成 9，整個數會變大多少？`,opts:uniqueOpts('500',['50','5000','5']),a:'500',exp:`(9－4) 個百＝500。`},
          {q:`下列哪兩個四位數「相加剛好等於 10000」？`,opts:uniqueOpts('3750 ＋ 6250',['3750 ＋ 7250','4200 ＋ 5700','2500 ＋ 6500']),a:'3750 ＋ 6250',exp:`3750＋6250＝10000。`},
          {q:`四位數「4080 ＋ 920」的總和是多少？`,opts:uniqueOpts('5000',['4900','5100','4000']),a:'5000',exp:`4080＋920＝5000。`},
          {q:`「${dTh}000」減去 250 之後，剩下的數是多少？`,opts:uniqueOpts(`${dTh*1000-250}`,[`${dTh*1000-150}`,`${dTh*1000+250}`,`${dTh*1000-350}`]),a:`${dTh*1000-250}`,exp:`${dTh*1000}－250＝${dTh*1000-250}。`},
          {q:`用數字「5、7、0、1」排成一個最小四位數（千位不可為 0），千位要放哪個數字？`,opts:uniqueOpts('1',['0','5','7']),a:'1',exp:`0 不能放千位，應選最小的非零數字 1。`}
        ];
        const tfList=[
          {q:`把「${n1} ＋ ${n2}」估算成幾千，答案會比 ${isTrue?n1+n2-500:n1+n2+900} 大。`,a:isTrue?'○':'✕',exp:`實際和為 ${n1+n2}。`},
          {q:`在四位數中，數字「10000」是由 ${isTrue?10:100} 個一千合起來的。`,a:isTrue?'○':'✕',exp:`10 個一千是一萬。`},
          {q:`讀出「6004」時，我們應該讀作「${isTrue?'六千零四':'六千零零四'}」。`,a:isTrue?'○':'✕',exp:`連續多個零只讀一個零。`},
          {q:`直式減法驗算時，可以把「差 ＋ 減數」算出來，看是否等於被減數。`,a:'○',exp:`加減互逆驗算。`},
          {q:`「9999 ＋ 1」會進位成為五位數 ${isTrue?'10000':'9990'}。`,a:isTrue?'○':'✕',exp:`9999 加 1 等於一萬。`},
          {q:`比較 4899 和 5001 的大小時，因為 4899 後面數字比較大，所以 4899 ＞ 5001。`,a:'✕',exp:`比大小先比較千位，5 千大於 4 千。`},
          {q:`從 ${dTh*1000} 每次多 10 往上數：${dTh*1000}、${dTh*1000+10}、${isTrue?dTh*1000+20:dTh*1000+11}。`,a:isTrue?'○':'✕',exp:`十位每次增加 10。`},
          {q:`四位數「3508」中的「0」佔在十位，如果省略不寫就會變成三位數 358。`,a:'○',exp:`0 具有佔位的重要功用。`},
          {q:`「${n1} ＋ ${n2}」與「${n2} ＋ ${n1}」在直式加法算出的總和完全相等。`,a:'○',exp:`加法交換律成立。`},
          {q:`計算 5000 － 1234 時，千位需要向百、十、個位連續借位退 1。`,a:'○',exp:`遇 0 減不足須向左連續退位。`},
          {q:`在直式加法裡，如果十位相加超過 10，要把進位的 1 加到千位上面。`,a:'✕',exp:`十位滿 10 應該向前一位（百位）進 1。`}
        ];
        const fillList=[
          {q:`四位數加減推算：${n1} ＋（　　　）＝ ${n1+n2}。`,a:String(n2)},
          {q:`一萬的分解概念：10000 裡面有（　　）個一千，也有（　　）個一百。`,a:'10；100'},
          {q:`位值寫數：由 ${dTh} 個千、${dH} 個百和 ${dT} 個十合起來的數是（　　　）。`,a:String(dTh*1000+dH*100+dT*10)},
          {q:`比大小（填 ＞ 或 ＜）：${dTh}805（　）${dTh}799。`,a:'＞'},
          {q:`湊整萬填空：${dTh*1000+400} ＋（　　　）＝ 10000。`,a:String(10000-(dTh*1000+400))},
          {q:`四位數讀作國字：「${dTh}0${dH}0」讀作（　　　　　　）。`,a:`${'零一二三四五六七八九'[dTh]}千零${'零一二三四五六七八九'[dH]}十`},
          {q:`退位直式空格：6000 － ${n1} ＝（　　　）。`,a:String(6000-n1)},
          {q:`數列跳數填空：${dTh}200 → ${dTh}300 →（　　　）→ ${dTh}500。`,a:`${dTh}400`},
          {q:`連續加減推理：${n1} ＋ 1000 － 500 ＝（　　　）。`,a:String(n1+500)},
          {q:`估算練習：${dTh}998 最接近的整千數是（　　　）。`,a:String((dTh+1)*1000)},
          {q:`千位拆合計算：75 個百加上 5 個百一共等於（　　　）。`,a:'8000'},
          {q:`數的進位填空：${dTh}999 再加上 1 是（　　　）。`,a:String((dTh+1)*1000)},
          {q:`金額拼湊：買一張 ${n1} 元高鐵票，只拿千元鈔票付帳最少需要（　）張。`,a:String(Math.ceil(n1/1000))},
          {q:`差值推算：最大的四位數 9999 和最小的四位數 1000 相差了（　　　）。`,a:'8999'},
          {q:`兩數比較寫作：比 ${n1} 多 500 的數是（　　　），少 200 的數是（　　　）。`,a:`${n1+500}；${n1-200}`},
          {q:`數字卡極值填空：用「2、0、9、4」排出最大四位數是（　　　）。`,a:'9420'},
          {q:`整千跳數推算：1500 → 2500 →（　　　）→ 4500。`,a:'3500'},
          {q:`位值換算補齊：1 個萬等於（　　）個千，也等於（　　　）個十。`,a:'10；1000'},
          {q:`收支計算填空：零用錢原有 3600 元，花掉 1250 元後還剩（　　　）元。`,a:'2350'},
          {q:`偶數鄰數填空：四位數 ${n1%2===0?n1:n1+1} 前面的連續偶數是（　　　）。`,a:String((n1%2===0?n1:n1+1)-2)},
          {q:`直式估算檢查：4985 ＋ 2010 大約等於（　　）千。`,a:'7'},
          {q:`四位數百位比較：${dTh}620 比 ${dTh}420 多了（　　）個百。`,a:'2'},
          {q:`讀數還原阿拉伯數字：「八千零五十」寫作（　　　）。`,a:'8050'},
          {q:`加減平衡空格：3500 ＋ ${n1} ＝ 4500 ＋（　　　）。`,a:String(n1-1000)},
          {q:`最大四位奇數填入：由小到大最接近一萬的奇數是（　　　）。`,a:'9999'},
          {q:`整十累計填空：從 ${dTh*1000} 起算，往後數 12 個十會來到（　　　）。`,a:String(dTh*1000+120)}
        ];
        const calcList=[
          {q:`${n1} ＋ ${n2} ＝（　　）`,a:String(n1+n2)},
          {q:`${n1+n2} － ${n1} ＝（　　）`,a:String(n2)},
          {q:`整千退位減法：8000 － ${n1} ＝（　　）`,a:String(8000-n1)},
          {q:`三筆四位數連加：${n1} ＋ ${n2} ＋ 500 ＝（　　）`,a:String(n1+n2+500)},
          {q:`加法逆推算式：（　　）＋ ${n1} ＝ 9500`,a:String(9500-n1)},
          {q:`減法還原驗算：（　　）－ ${n2} ＝ ${n1}`,a:String(n1+n2)},
          {q:`近千快算技巧：${n1} ＋ 1999 ＝（　　）`,a:String(n1+1999)},
          {q:`湊整減法練習：${n1+3000} － 1998 ＝（　　）`,a:String(n1+1002)}
        ];
        const wordList=[
          {q:`玩具工廠上午生產 ${n1} 個積木，下午生產 ${n2} 個積木，今天共生產幾個？上下午相差幾個？`,a:`共 ${n1+n2} 個；相差 ${Math.abs(n1-n2)} 個`},
          {q:`圖書館原有 ${n1+2000} 本藏書，學期初新購 ${n2} 本，目前共有幾本藏書？`,a:`${n1+2000} + ${n2} = ${n1+2000+n2}（本）`},
          {q:`爸爸存了 8500 元旅遊基金，買車票花了 ${n1} 元，買飯店住宿券花了 ${n2} 元，還剩幾元？`,a:`8500 - ${n1} - ${n2} = ${8500-n1-n2}（元）`},
          {q:`超市週六賣出 ${n1} 瓶鮮奶，週日比週六多賣出 450 瓶，週末兩天共賣出幾瓶？`,a:`${n1} + (${n1}+450) = ${n1*2+450}（瓶）`},
          {q:`登山隊總里程目標是 10000 步，早上走了 ${n1} 步，下午又走了 ${n2} 步，還差幾步達標？`,a:`10000 - (${n1} + ${n2}) = ${10000-n1-n2}（步）`}
        ];
        const matchList=[
          {q:'一萬以內讀數與定位配對',pairs:[['3 個千＋5 個十','3050'],['7 個千＋9 個百＋4 個一','7904'],['9999 ＋ 1','10000'],['6000 － 1500','4500']]},
          {q:'四位數直式加減配對',pairs:[['4200 ＋ 3800','8000'],['5000 － 1200','3800'],['2450 ＋ 1550','4000'],['7500 － 2500','5000']]},
          {q:'數字卡最大最小組合配對',pairs:[['1,0,8,5 排最大數','8510'],['1,0,8,5 排最小四位數','1058'],['4000 前一個數','3999'],['9 個千＋9 個一','9009']]}
        ];
        return {mc:mcList[vn%mcList.length], tf:tfList[vn%tfList.length], fill:fillList[vn%fillList.length], calc:calcList[vn%calcList.length], word:wordList[vn%wordList.length], match:matchList[vn%matchList.length]};
      }
      if(uIdx===1){ // 乘除直式
        const m=rnd(120,280), k=rnd(3,7), d=rnd(4,8), q0=rnd(12,28), r=rnd(1,d-1);
        const mcList=[
          {q:`計算「${d*q0+r} ÷ ${d}」時，算出來的商與餘數分別是多少？`,opts:uniqueOpts(`${q0} … ${r}`,[`${q0+1} … ${r}`,`${q0} … ${r===1?2:1}`,`${q0-1} … ${r}`]),a:`${q0} … ${r}`,exp:`${d}×${q0}＋${r}＝${d*q0+r}。`},
          {q:`做除法題「□ ÷ ${d} ＝ 9 … △」時，餘數 △ 共有幾種可能的數字（1 以上）？`,opts:uniqueOpts(`${d-1} 種`,[`${d} 種`,`${d+1} 種`,'1 種']),a:`${d-1} 種`,exp:`餘數可為 1 到 ${d-1}。`},
          {q:`估算「${m} × ${k}」的結果大概是多少百？`,opts:uniqueOpts(`${Math.round(m*k/100)*100}`,[`${Math.round(m*k/100)*100+400}`,`${m+k}`,`${m*k*10}`]),a:`${Math.round(m*k/100)*100}`,exp:`實際積為 ${m*k}。`},
          {q:`哪一個算式算出的商「沒有餘數（整除）」？`,opts:uniqueOpts(`${d*q0} ÷ ${d}`,[`${d*q0+1} ÷ ${d}`,`${d*q0+2} ÷ ${d}`,`${d*q0+r} ÷ ${d}`]),a:`${d*q0} ÷ ${d}`,exp:`${d}×${q0}＝${d*q0}，剛好整除。`},
          {q:`三位數「${m} × ${k}」乘起來的乘積是幾位數？`,opts:uniqueOpts(m*k>=1000?'四位數':'三位數',[m*k>=1000?'三位數':'四位數','二位數','五位數']),a:m*k>=1000?'四位數':'三位數',exp:`${m}×${k}＝${m*k}。`},
          {q:`一盒鳳梨酥有 ${d} 個，麵包店做出 ${d*q0+r} 個，每盒裝滿最多可裝幾盒？`,opts:uniqueOpts(`${q0} 盒`,[`${q0+1} 盒`,`${r} 盒`,`${q0-1} 盒`]),a:`${q0} 盒`,exp:`餘數 ${r} 個不夠裝滿 1 盒。`},
          {q:`戶外教學共有 ${d*q0+r} 位學生要搭小巴士，每車限坐 ${d} 人，最少要租幾輛車？`,opts:uniqueOpts(`${q0+1} 輛`,[`${q0} 輛`,`${q0-1} 輛`,`${r} 輛`]),a:`${q0+1} 輛`,exp:`剩餘 ${r} 位學生也要搭 1 輛車。`},
          {q:`用乘法驗算「${d*q0+r} ÷ ${d} ＝ ${q0} … ${r}」，哪一個驗算式子正確？`,opts:uniqueOpts(`${d} × ${q0} ＋ ${r}`,[`${d} × ${r} ＋ ${q0}`,`${d} ÷ ${q0} ＋ ${r}`,`${q0} × ${r} ＋ ${d}`]),a:`${d} × ${q0} ＋ ${r}`,exp:`除數×商＋餘數＝被除數。`},
          {q:`一個數的 ${k} 倍是 ${k*q0}，請問這個數本身是多少？`,opts:uniqueOpts(q0,[k*q0,q0+k,Math.max(1,q0-1)]),a:String(q0),exp:`${k*q0}÷${k}＝${q0}。`},
          {q:`下列哪一個算式的乘積「最大」？`,opts:uniqueOpts('398 × 9',['210 × 8','305 × 7','199 × 9']),a:'398 × 9',exp:`398×9＝3582 最大。`},
          {q:`在算式「240 × 5」的答案末尾，總共有幾個 0？`,opts:uniqueOpts('2 個',['1 個','3 個','0 個']),a:'2 個',exp:`240×5＝1200，尾數有 2 個 0。`},
          {q:`百貨特賣每條毛巾賣 ${q0} 元，買了 ${d} 條共付多少元？`,opts:uniqueOpts(`${q0*d} 元`,[`${q0+d} 元`,`${q0*d+10} 元`,`${q0*(d-1)} 元`]),a:`${q0*d} 元`,exp:`單價×數量＝${q0}×${d}＝${q0*d} 元。`},
          {q:`「${d*10} ÷ ${d}」和「${d*100} ÷ ${d}」相差了多少？`,opts:uniqueOpts('90',['10','100','9']),a:'90',exp:`100－10＝90。`},
          {q:`把 ${d*q0} 顆糖果分裝成每包 ${d} 顆，和每包 ${q0} 顆相比，哪一種裝出的包數較多（當 ${d} ≠ ${q0}）？`,opts:uniqueOpts(d<q0?`每包 ${d} 顆裝出的包數多`:`每包 ${q0} 顆裝出的包數多`,[d<q0?`每包 ${q0} 顆裝出的包數多`:`每包 ${d} 顆裝出的包數多`,'兩邊包數一樣多','無法裝包']),a:d<q0?`每包 ${d} 顆裝出的包數多`:`每包 ${q0} 顆裝出的包數多`,exp:`每包數量越少，裝出的包數越多。`},
          {q:`哪一個被除數除以 5 後會得到商 18 且餘數 3？`,opts:uniqueOpts('93',['90','87','95']),a:'93',exp:`5×18＋3＝93。`},
          {q:`估算「${m} × 6」最接近下面哪一個百位整數？`,opts:uniqueOpts(`${Math.round(m*6/100)*100}`,[`${Math.round(m*6/100)*100+500}`,`${m+6}`,`${Math.round(m*6/100)*10}`]),a:`${Math.round(m*6/100)*100}`,exp:`${m}×6＝${m*6}。`},
          {q:`學校訂購 ${d} 箱運動飲料，每箱有 24 瓶，共有幾瓶？`,opts:uniqueOpts(`${d*24} 瓶`,[`${d+24} 瓶`,`${d*12} 瓶`,`${d*24+10} 瓶`]),a:`${d*24} 瓶`,exp:`24×${d}＝${d*24} 瓶。`},
          {q:`一包色紙 100 張，老師平分給 4 組，每組分到幾張色紙？`,opts:uniqueOpts('25 張',['20 張','30 張','50 張']),a:'25 張',exp:`100÷4＝25 張。`}
        ];
        const tfList=[
          {q:`一位數除二三位數時，如果算出的餘數等於除數，代表商太小還要再加大。`,a:'○',exp:`餘數必須嚴格小於除數。`},
          {q:`計算「305 × 4」時，因為十位是 0，所以十位一定寫 0 不用進位。`,a:'✕',exp:`4×5＝20，個位進 2 到十位，積是 1220。`},
          {q:`「${d*q0} ÷ ${d} ＝ ${isTrue?q0:q0+1}」。`,a:isTrue?'○':'✕',exp:`${d}×${q0}＝${d*q0}。`},
          {q:`任何三位數乘以 0 之後，得到的乘積都會等於 0。`,a:'○',exp:`任何數乘 0 等於 0。`},
          {q:`「${m} × 4」的答案和「${m} × 2 × 2」算出來的答案一樣大。`,a:'○',exp:`乘 4 等於連乘兩次 2。`},
          {q:`如果被除數是奇數，除以 2 以後一定會有餘數 1。`,a:'○',exp:`奇數無法被 2 整除，餘數必為 1。`},
          {q:`直式除法由最高位（左邊）開始試商；直式乘法由個位（右邊）開始乘。`,a:'○',exp:`除法由高位往低位，乘法由個位往高位。`},
          {q:`算式「98 ÷ 4 ＝ 23 … 6」的計算結果完全正確。`,a:'✕',exp:`餘數 6 大於除數 4，正確商為 24 餘 2。`},
          {q:`「${m} × 1」等於 ${isTrue?m:1}。`,a:isTrue?'○':'✕',exp:`任何數乘以 1 等於原數。`},
          {q:`當兩個乘法算式的乘數相同時，被乘數越大，乘出來的積就越大。`,a:'○',exp:`正整數乘法中兩因數越大積越大。`},
          {q:`在三位數除以一位數時，商有可能是二位數，也有可能是三位數。`,a:'○',exp:`視百位數字是否大於或等於除數決定。`}
        ];
        const fillList=[
          {q:`直式乘法空格：${m} × ${k} ＝（　　）；${d*q0} ÷ ${d} ＝（　　）。`,a:`${m*k}；${q0}`},
          {q:`除法最大餘數：□ ÷ ${d} ＝ ${q0} … △，餘數 △ 最大是（　），此時 □ ＝（　　）。`,a:`${d-1}；${d*q0+d-1}`},
          {q:`整十倍乘計算：${k}00 × 8 ＝（　　　）。`,a:String(k*800)},
          {q:`平分問題填空：將 ${d*q0} 顆球平分給 ${d} 班，每班可得（　　）顆。`,a:String(q0)},
          {q:`餘數判讀：${d*q0+r} ÷ ${d} ＝（　　）…（　）。`,a:`${q0}；${r}`},
          {q:`乘除互逆換算：已知 ${q0} × ${d} ＝ ${q0*d}，所以 ${q0*d} ÷ ${q0} ＝（　）。`,a:String(d)},
          {q:`奇偶除數驗證：把 100 平分成 4 份，每份是（　　），如果平分成 5 份每份是（　　）。`,a:'25；20'},
          {q:`倍數進階填空：${m} 的 2 倍是 ${m*2}，${m} 的 4 倍是（　　）。`,a:String(m*4)},
          {q:`除法商的位數：「${d*100+24} ÷ ${d}」算出來的商是（　）位數。`,a:'三'},
          {q:`生活包裝計算：${d*q0+1} 枝鉛筆每 ${d} 枝綁 1 束，全部綁完還多（　）枝無法成束。`,a:'1'},
          {q:`湊整百乘法填答：125 ×（　）＝ 1000；250 ×（　）＝ 1000。`,a:'8；4'},
          {q:`租車進一計算：${d*q0+1} 位旅客搭每車限坐 ${d} 人的小巴，至少要（　　）輛車才夠載。`,a:String(q0+1)},
          {q:`連乘順序運用：(${k} × 2) × 5 ＝ ${k} ×（　　）。`,a:'10'},
          {q:`商與餘數還原：除數 ${d}、商 ${q0}、餘數 ${r}，則被除數是（　　）。`,a:String(d*q0+r)},
          {q:`多位數整十乘積：${m} × 10 ＝（　　　），比 ${m} 多了 1 個零。`,a:String(m*10)},
          {q:`除法倍數比較：${d*16} ÷ 4 的商比 ${d*16} ÷ 8 的商大（　）倍（是幾倍）。`,a:'2'}
        ];
        const calcList=[
          {q:`${m} × ${k} ＝（　　）`,a:String(m*k)},
          {q:`有餘數除法直式：${d*q0+r} ÷ ${d} ＝（　　）`,a:`${q0}…${r}`},
          {q:`直式整除練習：${d*q0} ÷ ${d} ＝（　　）`,a:String(q0)},
          {q:`十位有零直式乘：30${k} × 4 ＝（　　）`,a:String((300+k)*4)},
          {q:`商中間有零除法：${d*100+d*2} ÷ ${d} ＝（　　）`,a:'102'},
          {q:`連乘計算步驟：${q0} × 2 × 5 ＝（　　）`,a:String(q0*10)},
          {q:`除法求被除數：（　　）÷ ${d} ＝ ${q0}（無餘數）`,a:String(d*q0)},
          {q:`乘加混合直式驗算：${d} × ${q0} ＋ ${r} ＝（　　）`,a:String(d*q0+r)}
        ];
        const wordList=[
          {q:`果園採收 ${d*q0+r} 顆柑橘，每 ${d} 顆裝成一箱，最多可裝滿幾箱？還剩幾顆未裝箱？`,a:`${d*q0+r} ÷ ${d} = ${q0}（箱）… ${r}（顆）`},
          {q:`${nm}每星期存 ${m} 元零用錢，連續存了 ${k} 個星期後，總共存到多少元？`,a:`${m} × ${k} = ${m*k}（元）`},
          {q:`全校有 ${d*q0+r} 位學生參加健行，每 ${d} 人分成一小隊，老師想讓每位學生都分到隊伍且不足人數自成最後一隊，共分成幾隊？`,a:`${d*q0+r} ÷ ${d} = ${q0}…${r}，共 ${q0+1} 隊`},
          {q:`一套百科全書特價 ${m} 元，圖書館一共購買了 ${k} 套，付給書商 3000 元可以找回幾元？`,a:`3000 - (${m} × ${k}) = ${3000-m*k}（元）`},
          {q:`媽媽買了 ${d} 盒蛋捲共花了 ${d*q0} 元，平均每盒蛋捲多少元？再買 3 盒要多付幾元？`,a:`每盒 ${q0} 元；3 盒 ${q0*3} 元`}
        ];
        const matchList=[
          {q:'乘除直式驗算配對',pairs:[['125 × 4','500'],['306 × 3','918'],['96 ÷ 4','24'],['85 ÷ 5','17']]},
          {q:'有餘數除法商餘配對',pairs:[['29 ÷ 4','7 … 1'],['38 ÷ 5','7 … 3'],['47 ÷ 6','7 … 5'],['50 ÷ 7','7 … 1']]},
          {q:'百位乘法速算配對',pairs:[['250 × 4','1000'],['150 × 6','900'],['400 × 8','3200'],['205 × 2','410']]}
        ];
        return {mc:mcList[vn%mcList.length], tf:tfList[vn%tfList.length], fill:fillList[vn%fillList.length], calc:calcList[vn%calcList.length], word:wordList[vn%wordList.length], match:matchList[vn%matchList.length]};
      }
      if(uIdx===2){ // 公里、公尺、毫米
        const km=rnd(2,5), m0=rnd(150,750), cm=rnd(3,9), mm=rnd(2,8);
        const mcList=[
          {q:`「${km} 公里 ${m0} 公尺」和「${km*1000+m0+200} 公尺」相差幾公尺？`,opts:uniqueOpts('200 公尺',['20 公尺','2000 公尺','100 公尺']),a:'200 公尺',exp:`${km*1000+m0+200}－${km*1000+m0}＝200 公尺。`},
          {q:`測量「數學課本的厚度」時，選用哪一個長度單位最精確？`,opts:uniqueOpts('毫米 (mm)',['公里 (km)','公尺 (m)','公噸']),a:'毫米 (mm)',exp:`課本厚度約數毫米至十多毫米。`},
          {q:`一隻螞蟻從尺上的刻度 2 公分 3 毫米爬到刻度 6 公分 8 毫米，牠一共爬了幾毫米？`,opts:uniqueOpts('45 毫米',['68 毫米','23 毫米','91 毫米']),a:'45 毫米',exp:`68－23＝45 毫米。`},
          {q:`學校運動會接力賽每圈 200 公尺，全班合跑 10 圈，一共跑了幾公里？`,opts:uniqueOpts('2 公里',['20 公里','200 公里','1 公里']),a:'2 公里',exp:`200×10＝2000 公尺＝2 公里。`},
          {q:`哪一個長度和「${cm} 公分 ${mm} 毫米」完全相等？`,opts:uniqueOpts(`${cm*10+mm} 毫米`,[`${cm*100+mm} 毫米`,`${cm+mm} 毫米`,`${cm} 毫米`]),a:`${cm*10+mm} 毫米`,exp:`1 公分＝10 毫米。`},
          {q:`「台北到桃園的距離」大約 30 多（　），括號裡應該填哪個單位？`,opts:uniqueOpts('公里',['公分','毫米','公尺']),a:'公里',exp:`城市間長距離用公里。`},
          {q:`兩條長度各是 1 公尺 40 公分與 85 公分的彩帶接起來（沒有重疊），總長是多少？`,opts:uniqueOpts('2 公尺 25 公分',['1 公尺 25 公分','2 公尺 45 公分','1 公尺 85 公分']),a:'2 公尺 25 公分',exp:`140＋85＝225 公分＝2 公尺 25 公分。`},
          {q:`下列四組長度中，哪一個距離「最長」？`,opts:uniqueOpts('3 公里 50 公尺',['3005 公尺','2999 公尺','3040 公尺']),a:'3 公里 50 公尺',exp:`3 公里 50 公尺＝3050 公尺。`},
          {q:`若將 8 公分長的線段剪掉 25 毫米，剩下的長度是多少毫米？`,opts:uniqueOpts('55 毫米',['17 毫米','65 毫米','75 毫米']),a:'55 毫米',exp:`80－25＝55 毫米。`},
          {q:`一棟大樓高度大約 40 公尺，幾棟一樣高的大樓疊起來才會接近 1 公里（1000 公尺）？`,opts:uniqueOpts('25 棟',['10 棟','50 棟','100 棟']),a:'25 棟',exp:`1000÷40＝25 棟。`},
          {q:`把 1 公尺長的木條鋸成每段 20 公分的小木塊，一共可以鋸成幾段？`,opts:uniqueOpts('5 段',['10 段','20 段','2 段']),a:'5 段',exp:`100÷20＝5 段。`},
          {q:`「${cm}0 毫米」和下面哪一個長度是一樣長的？`,opts:uniqueOpts(`${cm} 公分`,[`${cm*10} 公分`,`${cm} 公尺`,`${cm*100} 毫米`]),a:`${cm} 公分`,exp:`10 毫米＝1 公分。`},
          {q:`馬拉松比賽路線全長大約 42 公里，如果改寫成公尺，是多少公尺？`,opts:uniqueOpts('42000 公尺',['4200 公尺','420 公尺','420000 公尺']),a:'42000 公尺',exp:`42×1000＝42000 公尺。`},
          {q:`一把美工刀刀片寬度大約是 9 毫米，再多 1 毫米合起來就會是幾公分？`,opts:uniqueOpts('1 公分',['10 公分','0.1 公分','100 毫米']),a:'1 公分',exp:`9＋1＝10 毫米＝1 公分。`},
          {q:`比較「2 公里 80 公尺」和「2800 公尺」，哪一個距離比較遠？`,opts:uniqueOpts('2800 公尺比較遠',['2 公里 80 公尺比較遠','兩個一樣遠','無法比較']),a:'2800 公尺比較遠',exp:`2 公里 80 公尺＝2080 公尺＜2800 公尺。`},
          {q:`用直尺量測迴紋針時，如果一端對齊 4 公分刻度、另一端對齊 6 公分 8 毫米，迴紋針長多少？`,opts:uniqueOpts('2 公分 8 毫米',['6 公分 8 毫米','4 公分 8 毫米','10 公分 8 毫米']),a:'2 公分 8 毫米',exp:`6.8－4＝2.8 公分＝28 毫米。`},
          {q:`腳踏車車道全長 1 公里 500 公尺，騎了 700 公尺後，還要再騎幾公尺才會到終點？`,opts:uniqueOpts('800 公尺',['700 公尺','1200 公尺','200 公尺']),a:'800 公尺',exp:`1500－700＝800 公尺。`}
        ];
        const tfList=[
          {q:`把 ${cm} 公分 ${mm} 毫米換算成毫米，一共是 ${isTrue?cm*10+mm:cm*100+mm} 毫米。`,a:isTrue?'○':'✕',exp:`1 公分＝10 毫米。`},
          {q:`「1 公里」的距離比「950 公尺」還要長 50 公尺。`,a:'○',exp:`1000－950＝50 公尺。`},
          {q:`小明的身高大約是 135 毫米。`,a:'✕',exp:`身高約 135 公分（1350 毫米）。`},
          {q:`在常見的公分直尺上，每 1 公分裡面都平均分成 10 小格，每 1 小格就是 1 毫米。`,a:'○',exp:`1 公分＝10 毫米。`},
          {q:`兩條繩子黏接時如果有重疊 4 公分，合起來的總長度就要扣掉重複計算的 4 公分。`,a:'○',exp:`重疊部分只計入一次長度。`},
          {q:`「${km} 公里 80 公尺」改寫成公尺會等於 ${isTrue?km*1000+80:km*100+80} 公尺。`,a:isTrue?'○':'✕',exp:`1 公里＝1000 公尺。`},
          {q:`測量從教室走到校門口距離時，用「毫米」當單位是最方便的寫法。`,a:'✕',exp:`教室到校門口適合用公尺量測。`},
          {q:`「5000 公尺」剛好等同於 5 公里。`,a:'○',exp:`5000÷1000＝5 公里。`},
          {q:`3 公分 5 毫米 ＋ 2 公分 7 毫米 ＝ 6 公分 2 毫米。`,a:'○',exp:`35＋27＝62 毫米＝6 公分 2 毫米。`},
          {q:`十元硬幣的厚度大概只有 2 毫米左右，用直尺細格可以精準量出。`,a:'○',exp:`毫米適合測量極薄物品。`}
        ];
        const fillList=[
          {q:`長度單位換算：${km} 公里 ${m0} 公尺 ＝（　　　）公尺；${cm} 公分 ${mm} 毫米 ＝（　　）毫米。`,a:`${km*1000+m0}；${cm*10+mm}`},
          {q:`進率補滿 1 公里：650 公尺 ＋（　　）公尺 ＝ 1 公里。`,a:'350'},
          {q:`毫米轉公分：${cm*10+mm} 毫米 ＝（　）公分（　）毫米。`,a:`${cm}；${mm}`},
          {q:`公尺轉公里：${km*1000+30} 公尺 ＝（　）公里（　　）公尺。`,a:`${km}；30`},
          {q:`刻度尺長度計算：鉛筆從刻度 3 公分量到刻度 ${cm+3} 公分 ${mm} 毫米，筆長為（　　）毫米。`,a:String(cm*10+mm)},
          {q:`比大小（填 ＞、＜ 或 ＝）：${km} 公里 50 公尺（　）${km*1000+500} 公尺。`,a:'＜'},
          {q:`生活單位填入（公里／公尺／公分／毫米）：一枝原子筆大約長 14（　　），筆尖寬約 1（　　）。`,a:'公分；毫米'},
          {q:`線段裁剪估算：1 公尺長的木條鋸掉 ${mm*10} 毫米，還剩（　　）公分。`,a:String(100-mm)},
          {q:`複合長度分解：1 公尺 25 公分 ＝（　　）公分 ＝（　　　）毫米。`,a:'125；1250'},
          {q:`倍數路徑換算：來回一趟 600 公尺的路走 5 趟，合計（　）公里。`,a:'3'},
          {q:`尺上端點反推：從 2 公分 5 毫米往右畫 35 毫米，終點停在（　）公分處。`,a:'6'},
          {q:`高低差計算：山頂海拔 ${km}050 公尺、山腰休息站 850 公尺，兩處垂直相差（　　　）公尺。`,a:String(km*1000+50-850)},
          {q:`單位補齊：1 公里比 780 公尺多了（　　）公尺；1 公分比 ${mm} 毫米多了（　）毫米。`,a:`220；${10-mm}`},
          {q:`公尺毫米綜合：2 公尺 ＝（　　）公分 ＝（　　　）毫米。`,a:'200；2000'},
          {q:`膠帶貼接實作：兩段 ${cm} 公分膠帶重疊 5 毫米貼起來，總長為（　　）毫米。`,a:String(cm*20-5)}
        ];
        const calcList=[
          {q:`公里長度計算：${km} 公里 ＋ ${m0} 公尺 ＝（　　）公尺`,a:String(km*1000+m0)},
          {q:`毫米減法換算：8 公分 － ${mm} 毫米 ＝（　　）毫米`,a:String(80-mm)},
          {q:`雙段路線總和：${km} 公里 300 公尺 ＋ 1 公里 ${m0} 公尺 ＝（　）公里（　）公尺`,a:`${km+1+Math.floor((300+m0)/1000)} 公里 ${(300+m0)%1000} 公尺`},
          {q:`毫米相加進位：${cm} 公分 ${mm} 毫米 ＋ 2 公分 ${10-mm+3} 毫米 ＝（　）公分（　）毫米`,a:`${cm+3} 公分 3 毫米`},
          {q:`距離差額計算：3 公里 － ${m0} 公尺 ＝（　　）公尺`,a:String(3000-m0)},
          {q:`操場跑圈總距離：每圈 250 公尺 × 8 圈 ＝（　）公里`,a:'2'}
        ];
        const wordList=[
          {q:`跑道每圈 200 公尺，${nm}跑了 5 圈又多 450 公尺，她一共跑了幾公里幾公尺？`,a:`1000 + 450 = 1450 公尺 = 1 公里 450 公尺`},
          {q:`登山步道全長 ${km} 公里，${nm}早上已經走了 1 公里 ${m0} 公尺，下午還要再走幾公尺才能到達終點？`,a:`${km*1000} - ${1000+m0} = ${km*1000-1000-m0}（公尺）`},
          {q:`將兩條都是 ${cm} 公分 6 毫米的木棒重疊黏在一起（重疊 1 公分 2 毫米），接起來後的木棒總長幾毫米？`,a:`${(cm*10+6)*2} - 12 = ${(cm*10+6)*2-12}（毫米）`},
          {q:`腳踏車騎 1 圈輪子前進 2 公尺，${nm2}騎了 600 圈，一共前進了幾公里幾公尺？`,a:`2 × 600 = 1200 公尺 = 1 公里 200 公尺`}
        ];
        const matchList=[
          {q:'長度進率配對',pairs:[['1 公里','1000 公尺'],['1 公尺','100 公分'],['1 公分','10 毫米'],['3 公分 6 毫米','36 毫米']]},
          {q:'公里與公尺轉換配對',pairs:[['2 公里 50 公尺','2050 公尺'],['4 公里 500 公尺','4500 公尺'],['1050 公尺','1 公里 50 公尺'],['7 公分','70 毫米']]},
          {q:'生活物品與合適長度單位配對',pairs:[['10 元硬幣厚度','約 2 毫米'],['捷運站之間距離','約 1 公里'],['黑板的長度','約 4 公尺'],['鉛筆的長度','約 16 公分']]}
        ];
        return {mc:mcList[vn%mcList.length], tf:tfList[vn%tfList.length], fill:fillList[vn%fillList.length], calc:calcList[vn%calcList.length], word:wordList[vn%wordList.length], match:matchList[vn%matchList.length]};
      }
      // uIdx===3 角、正方形、長方形與圓
      const s=rnd(5,12), r=rnd(3,9);
      const mcList=[
        {q:`正方形與圓形比較：邊長 ${s} 公分的正方形周長，與直徑 ${s*2} 公分的圓哪個敘述正確？`,opts:uniqueOpts(`正方形周長為 ${s*4} 公分，圓半徑為 ${s} 公分`,[`正方形周長為 ${s*2} 公分`,'圓的直徑是半徑的一半','正方形沒有直角']),a:`正方形周長為 ${s*4} 公分，圓半徑為 ${s} 公分`,exp:`周長＝邊長×4，半徑＝直徑÷2。`},
        {q:`用三角板的直角去比對一個角，如果張開的開口比直角還要小，這個角叫作什麼角？`,opts:uniqueOpts('銳角',['直角','鈍角','平角']),a:'銳角',exp:`小於直角（90°）的角為銳角。`},
        {q:`圓規兩腳張開 ${r} 公分畫出一個圓，畫好後圓的「直徑」會是多少公分？`,opts:uniqueOpts(`${r*2} 公分`,[`${r} 公分`,`${r*4} 公分`,`${r+2} 公分`]),a:`${r*2} 公分`,exp:`直徑＝半徑×2＝${r*2} 公分。`},
        {q:`關於一個圓裡面的「半徑」和「直徑」，下列說法哪一個正確？`,opts:uniqueOpts('所有的半徑都一樣長，且一定要從圓心畫到圓周上',['直徑不需要通過圓心','同一個圓可以有兩個不同圓心','半徑永遠比直徑還要長']),a:'所有的半徑都一樣長，且一定要從圓心畫到圓周上',exp:`圓心到圓周距離皆相等即半徑。`},
        {q:`將一張長方形紙張（長 ${s+5}cm、寬 ${s}cm）剪出一個最大的正方形，這個正方形周長是多少？`,opts:uniqueOpts(`${s*4} 公分`,[`${(s+5)*4} 公分`,`${s*2} 公分`,`${(s+5+s)*2} 公分`]),a:`${s*4} 公分`,exp:`最大正方形邊長受限於寬 ${s} 公分，周長 ${s*4} 公分。`},
        {q:`拿兩個完全一樣的邊長 ${s} 公分正方形拼成一個長方形，拼成後的周長是多少？`,opts:uniqueOpts(`${s*6} 公分`,[`${s*8} 公分`,`${s*4} 公分`,`${s*12} 公分`]),a:`${s*6} 公分`,exp:`外圍共有 6 條邊：${s}×6＝${s*6} 公分。`},
        {q:`時鐘走到上午 9 時整，時針和分針夾成較小的角是一個什麼角？`,opts:uniqueOpts('直角',['銳角','鈍角','沒有角']),a:'直角',exp:`9 時整時針分針夾角為 90° 直角。`},
        {q:`從一個正方形的四個角「只剪掉一個小角（凹角）」，新圖形的周長和原本的正方形相比如何？`,opts:uniqueOpts('一樣長',['一定變短','一定變長兩倍','變成只有兩條邊']),a:'一樣長',exp:`將凹進去的兩邊向外平移剛好與原邊等長。`},
        {q:`一個三角形裡面有幾個頂點和幾條邊？`,opts:uniqueOpts('3 個頂點、3 條邊',['4 個頂點、3 條邊','3 個頂點、4 條邊','沒有頂點']),a:'3 個頂點、3 條邊',exp:`三角形由 3 邊與 3 頂點組成。`},
        {q:`如果要圍一個周長 ${s*4} 公分的正三角形或正方形（先用長方形：長 ${(s*2)-3}cm、寬 3cm），長方形「長＋寬」等於多少？`,opts:uniqueOpts(`${s*2} 公分`,[`${s*4} 公分`,`${s} 公分`,`${s*8} 公分`]),a:`${s*2} 公分`,exp:`長方形周長的一半就是長＋寬。`},
        {q:`一個正方形的四條邊加起來是 ${s*4} 公分，如果把每條邊都延長 1 公分，新正方形的周長是幾公分？`,opts:uniqueOpts(`${(s+1)*4} 公分`,[`${s*4+1} 公分`,`${s*4+2} 公分`,`${(s+2)*4} 公分`]),a:`${(s+1)*4} 公分`,exp:`4 條邊各多 1 公分，周長增加 4 公分。`},
        {q:`下面哪一種生活中的物品表面通常「找得到 4 個直角」？`,opts:uniqueOpts('門板的正面',['三角路標','十元硬幣的面','圓形時鐘面']),a:'門板的正面',exp:`門板呈長方形，四角皆為直角。`},
        {q:`把圓形色紙對折一次後，摺痕兩端剛好在圓周上且平分圓形，這條摺痕就是圓的什麼線？`,opts:uniqueOpts('直徑',['半徑','周長','邊長']),a:'直徑',exp:`圓對折一次的摺痕通過圓心，為直徑。`},
        {q:`比較「直徑 ${r*2} 公分的圓 A」與「半徑 ${r+1} 公分的圓 B」，哪一個圓比較大？`,opts:uniqueOpts('圓 B 比較大',['圓 A 比較大','兩圓一樣大','無法比較']),a:'圓 B 比較大',exp:`圓 A 半徑 ${r}cm，圓 B 半徑 ${r+1}cm。`},
        {q:`在格子紙上畫出長 ${s+2} 格、寬 ${s} 格的長方形，外框線一共會經過幾格邊長？`,opts:uniqueOpts(`${(s+2+s)*2} 格`,[`${(s+2)*s} 格`,`${s*4} 格`,`${s+2+s} 格`]),a:`${(s+2+s)*2} 格`,exp:`長方形周長等於兩組長與寬的和。`},
        {q:`一個三角形裡面最多可以有幾個直角（或鈍角）？`,opts:uniqueOpts('最多 1 個',['可以有 2 個','可以有 3 個','一定要 3 個']),a:'最多 1 個',exp:`三角形最多只能有 1 個直角或鈍角。`},
        {q:`拿圓規畫一個邊緣貼在長 ${s+4} 公分、寬 ${s} 公分長方形裡的最大圓，這個圓的「半徑」是多少公分？`,opts:uniqueOpts(`${(s/2).toFixed(s%2?1:0)} 公分`,[`${s} 公分`,`${s+4} 公分`,`${s*2} 公分`]),a:`${(s/2).toFixed(s%2?1:0)} 公分`,exp:`最大圓的直徑等於長方形寬 ${s}cm，半徑為直徑一半。`},
        {q:`用四根分別長 6 公分、6 公分、4 公分、4 公分的吸管圍成一個圖形，一定圍成哪種四邊形？`,opts:uniqueOpts('長方形或平行四邊形',['正方形','正三角形','圓形']),a:'長方形或平行四邊形',exp:`兩雙對邊各為 6cm 與 4cm。`},
        {q:`鐘面上「下午 2 時整」，時針和分針夾成較小的那個角是哪一種角？`,opts:uniqueOpts('銳角',['直角','鈍角','平角']),a:'銳角',exp:`2 大格為 60°＜90°，故為銳角。`},
        {q:`「直徑 ${r*2} 公分」的圓和「半徑 ${r+3} 公分」的圓，兩個圓的圓心疊在一起會形成什麼？`,opts:uniqueOpts('一大一小的同心圓',['兩個大小完全一樣的圓','重疊成正方形','沒有圓周']),a:'一大一小的同心圓',exp:`半徑 ${r}＜${r+3}，共用圓心一大一小。`},
        {q:`正方形甲周長是 32 公分，長方形乙周長是 28 公分，兩圖形的周長相差幾公分？`,opts:uniqueOpts('4 公分',['2 公分','14 公分','60 公分']),a:'4 公分',exp:`32－28＝4 公分。`},
        {q:`用直尺與圓規畫圓時，哪一個部位固定在紙上當作「圓心」？`,opts:uniqueOpts('圓規有針尖的那隻腳',['握在手裡的筆蓋','畫出來的圓周線','鉛筆筆芯的那一端']),a:'圓規有針尖的那隻腳',exp:`針尖固定處就是圓心。`},
        {q:`比較「直徑 18 公分的圓」與「邊長 5 公分的正方形」，哪一個圓的半徑比正方形邊長多？`,opts:uniqueOpts('圓的半徑較長（多 4 公分）',['正方形邊長較長','兩者一樣長','無法比較']),a:'圓的半徑較長（多 4 公分）',exp:`半徑 9 公分 ＞ 5 公分。`},
        {q:`將直角三角板三個角疊合起來看，除了 1 個直角外，另外兩個角屬於什麼角？`,opts:uniqueOpts('兩個都是銳角',['兩個都是鈍角','一個直角一個鈍角','兩個都是平角']),a:'兩個都是銳角',exp:`直角三角板必含一個直角與兩個銳角。`}
      ];
      const tfList=[
        {q:`用放大鏡觀察一個 45° 的角，在放大鏡下這個角的張開度數${isTrue?'依然是 45° 沒有變大':'會放大變成 90°'}。`,a:isTrue?'○':'✕',exp:`角的大小只看兩邊張開程度，與邊長或放大鏡無關。`},
        {q:`同一個圓裡面，每一條直徑的長度都一樣長，且必定經過圓心。`,a:'○',exp:`直徑定義必過圓心且等長。`},
        {q:`長方形和正方形都有 4 個直角，而且 4 條邊都一樣長。`,a:'✕',exp:`長方形鄰邊不一定等長。`},
        {q:`把圓形紙張對折再對折後展開，兩條摺痕相交的點就是「圓心」，且夾角都是直角。`,a:'○',exp:`對折兩次交點為圓心。`},
        {q:`在鐘面上「下午 4 時整」，時針和分針夾成較小的角是一個鈍角（大於直角）。`,a:'○',exp:`4 時整夾 4 大格 ＝ 120° 鈍角。`},
        {q:`周長相同的兩個不同長方形，它們的「長」和「寬」不一定相同。`,a:'○',exp:`例如周長 20 可為 6×4 或 8×2。`},
        {q:`如果一個圓的半徑增加 2 公分，那麼它的直徑也會剛好增加 2 公分。`,a:'✕',exp:`半徑加 2 公分，直徑會加 4 公分。`},
        {q:`一個正三角形的周長如果是 ${s*3} 公分，每條邊長是 ${isTrue?s:s+2} 公分。`,a:isTrue?'○':'✕',exp:`${s*3}÷3＝${s} 公分。`},
        {q:`鈍角比直角大，直角又比銳角大。`,a:'○',exp:`鈍角 ＞ 直角 ＞ 銳角。`},
        {q:`用長方形兩條長邊當底、兩條短邊當側邊，四邊合起來稱為長方形的內部面積。`,a:'✕',exp:`外圍四條邊總長稱為「周長」，不是面積。`},
        {q:`在同一個圓上可以畫出無限多條半徑，而且每條半徑都一樣長。`,a:'○',exp:`從圓心連到圓周有無限多條等長半徑。`},
        {q:`長方形相框有兩組對邊互相平行，且鄰近的兩條邊彼此垂直成直角。`,a:'○',exp:`長方形對邊等長且四個內角皆直角。`},
        {q:`只要三角形的三條邊長度確定了，這個三角形的周長也就跟著固定。`,a:'○',exp:`三角形周長為三條邊長總和。`}
      ];
      const fillList=[
        {q:`正方形邊長 ${s} 公分，周長是（　　）公分；半徑 ${r} 公分的圓，直徑是（　　）公分。`,a:`${s*4}；${r*2}`},
        {q:`角的三要素：一個角有（　）個頂點和（　）條直直的邊。`,a:'1；2'},
        {q:`圓的結構反推：直徑是 ${r*2} 公分的圓，用圓規畫時兩腳要張開（　）公分。`,a:String(r)},
        {q:`正方形周長反推邊長：周長為 ${s*4} 公分的正方形，邊長是（　　）公分。`,a:String(s)},
        {q:`直角三角板檢驗：一個三角板中最大那個角是（　）角，另外兩個都是（　）角。`,a:'直；銳'},
        {q:`長方形周長反推：周長 ${(s+3+s)*2} 公分的長方形，已知寬是 ${s} 公分，長是（　　）公分。`,a:String(s+3)},
        {q:`正三角形周長填空：正三角形每邊長 ${r} 公分，周長是（　　）公分。`,a:String(r*3)},
        {q:`圓心與周界：從圓心連到圓周上任意一點的線段，都叫作這個圓的（　　）。`,a:'半徑'},
        {q:`正方形圍籬延伸：邊長 ${s} 公尺正方形花圃每邊增加 2 公尺後，新周長變成（　　）公尺。`,a:String((s+2)*4)},
        {q:`長方形對邊性質：長 ${s+5}cm、寬 ${s}cm 的長方形中，兩條長邊合起來共（　　）cm。`,a:String((s+5)*2)},
        {q:`圓規直徑反推：若圓規畫出的圓直徑為 ${r*4} 公分，代表半徑是（　　）公分。`,a:String(r*2)},
        {q:`正方形切割拼合：將正方形周長 ${s*4}cm 的邊減半後做成小正方形，小正方形周長是（　　）cm。`,a:String(s*2)},
        {q:`直角與平角比較：兩個直角拼在一起形成的角度數與（　）個直角三角板的直角和相同，共 180°。`,a:'2'},
        {q:`複合圖周長計算：把兩個長 6cm 寬 3cm 長方形沿長邊拼成正方形，周長是（　　）公分。`,a:'24'},
        {q:`時針分針角度分類：中午 12 時整兩針重合，下午 2 時兩針夾成較小角為（　）角（填銳／直／鈍）。`,a:'銳'},
        {q:`圓心對稱位置：直徑長度永遠是同圓半徑長度的（　）倍。`,a:'2'},
        {q:`圓形拼排計算：把 4 個半徑 ${r} 公分的圓形排成一列，總寬度是（　　）公分。`,a:String(r*8)},
        {q:`三角形外圍總長：兩腰皆為 8 公分、底邊為 5 公分的等腰三角形，周長是（　　）公分。`,a:'21'},
        {q:`長方形圍籬缺口：周長 ${s*4+4} 公尺花圃有一面靠牆不用圍，對面長邊是 ${s+2} 公尺，需圍籬共（　　）公尺。`,a:String(s*3+2)}
      ];
      const calcList=[
        {q:`長方形周長計算：長 ${s+4} 公分、寬 ${s} 公分，周長是（　　）公分`,a:String((s+4+s)*2)},
        {q:`正方形周長計算：邊長 ${s} 公分 × 4 ＝（　　）公分`,a:String(s*4)},
        {q:`直徑與半徑換算：直徑 ${r*2} 公分 ÷ 2 ＝ 半徑（　　）公分`,a:String(r)},
        {q:`半徑倍數推算：大圓半徑 ${r+2} 公分、小圓半徑 ${r} 公分，兩圓直徑相差（　　）公分`,a:'4'},
        {q:`三角與方形周長和：邊長 ${s} 公分正方形 ＋ 邊長 ${s} 公分正三角形，兩者周長共（　　）公分`,a:String(s*7)},
        {q:`對稱圖周長應用：長 ${s+6}cm、寬 ${s}cm 的長方形相框用去木條總長為（　　）公分`,a:String((s+6+s)*2)},
        {q:`三角板拼角估算：90° 直角 ＋ 30° 銳角 ＝（　　）°`,a:'120'},
        {q:`雙圓直徑相減：直徑 ${r*2+8} 公分 － 半徑 ${r} 公分圓的直徑 ＝（　　）公分`,a:'8'}
      ];
      const wordList=[
        {q:`用一條長 ${s*4} 公分的鐵絲剛好圍成一個正方形相框，再改用同樣長的鐵絲圍成長邊 ${s+2} 公分的長方形，寬是幾公分？`,a:`${s*4} ÷ 2 - ${s+2} = ${s*2-(s+2)}（公分）`},
        {q:`畫圖課時，${nm}畫了一個半徑 ${r} 公分的小圓，又以同一個圓心畫了一個直徑 ${r*2+6} 公分的大圓，大圓半徑比小圓半徑多幾公分？`,a:`(${r*2+6} ÷ 2) - ${r} = 3（公分）`},
        {q:`長方形球場長 ${s+10} 公尺、寬 ${s} 公尺，體育老師帶大家沿著球場外圍跑了 4 圈，共跑了幾公尺？`,a:`(${s+10} + ${s}) × 2 × 4 = ${(s*2+10)*8}（公尺）`},
        {q:`把三個半徑都是 ${r} 公分的圓形紙卡緊緊並排在一張長方形紙條內（沒有重疊），這張紙條至少要多長才能擺下三個圓？`,a:`直徑 ${r*2} × 3 = ${r*6}（公分）`}
      ];
      const matchList=[
        {q:'角、正方形與圓的性質配對',pairs:[['比直角小的角','銳角'],['比直角大的角','鈍角'],['圓規兩腳打開距離','圓的半徑'],['過圓心兩端在圓周','圓的直徑']]},
        {q:'圖形周長計算配對',pairs:[['邊長 7cm 正方形周長','28 公分'],['長 8cm 寬 5cm 長方形周長','26 公分'],['半徑 6cm 的圓直徑','12 公分'],['邊長 6cm 正三角形周長','18 公分']]},
        {q:'鐘面時刻與角度配對',pairs:[['上午 3 時整','直角'],['下午 1 時整','銳角'],['下午 5 時整','鈍角'],['4 個直角合起來','周角']]}
      ];
      return {mc:mcList[vn%mcList.length], tf:tfList[vn%tfList.length], fill:fillList[vn%fillList.length], calc:calcList[vn%calcList.length], word:wordList[vn%wordList.length], match:matchList[vn%matchList.length]};
    }
    // 泛用真實單元數字與概念題（依該單元主題詞與無重複多句型變化產生，絕不滲入他單元概念）
    const a0 = rnd(2,9) * (g>=3?10:1), b0 = rnd(1,8) * (g>=3?10:1);
    const mcFall = [
      {q:`${dTag}在複習「${uShort}（${tpA}）」時，下列哪一個觀念說法最正確？`,opts:uniqueOpts(`透過「${tpA}」與「${tpB}」的規則來解題驗證`,['只猜測數字大小不需檢查單位','可以任意改變問題條件與單位','跳過步驟直接憑感覺填答']),a:`透過「${tpA}」與「${tpB}」的規則來解題驗證`,exp:`本單元核心為：${tps.join('、')}。`},
      {q:`進行「${uName}」練習時，關於「${tpB}」的應用，下列哪一個敘述是對的？`,opts:uniqueOpts(`先確認「${tpB}」題意再依照「${uShort}」步驟計算`,['把不同單位直接相加不需換算','不必閱讀題目單位直接作答','把倍數與減法隨意對調']),a:`先確認「${tpB}」題意再依照「${uShort}」步驟計算`,exp:`「${uName}」重點為 ${tps.join('、')}。`},
      {q:`解「${uShort}」題目時，哪一個習慣最能幫你在「${tpC}」題型拿高分？`,opts:uniqueOpts(`算完「${tpC}」後用逆推或驗算再檢查一遍`,['完全不用寫計算過程','不用對齊數位與單位名稱','略過關鍵字直接猜選項']),a:`算完「${tpC}」後用逆推或驗算再檢查一遍`,exp:`確實驗算是「${uShort}」拿滿分關鍵。`},
      {q:`整理「${uName}」單元筆記時，以下哪一項最符合「${tpA}」的解題策略？`,opts:uniqueOpts(`標出「${tpA}」中的已知條件與關鍵數量後逐步推導`,['忽略題目中的單位與已知條件','把題幹裡所有數字直接乘起來','未比較大小就直接填入最大數']),a:`標出「${tpA}」中的已知條件與關鍵數量後逐步推導`,exp:`先抓出條件再依「${tpA}」步驟計算。`}
    ];
    const tfFall = [
      {q:`學習「${uName}」單元時，「${tpA}」和「${tpB}」是本單元必須熟練的核心重點。`,a:'○',exp:`本單元包含：${tps.join('、')}。`},
      {q:`做「${uShort}」的練習與「${tpB}」應用題時，不需要看清楚單位與條件就能直接下結論。`,a:'✕',exp:`解題前必須先確認題意與單位。`},
      {q:`在「${uShort}」中，「${tpC}」與「${tpA}」都是屬於本單元的重點項目。`,a:'○',exp:`本單元重點包含 ${tps.join('、')}。`},
      {q:`檢查「${uName}」答案時，用不同方式反推或估計合理性，完全沒有幫助。`,a:'✕',exp:`驗算與合理性檢查能有效減少計算失誤。`}
    ];
    const fillFall = [
      {q:`單元重點整理：在「${uName}」中，我們學到「${tpA}」與（　　　　）等重要方法。`,a:tpB},
      {q:`解題檢核步驟：處理「${uShort}」時，除了確認「${tpB}」，還必須熟練（　　　　）。`,a:tpA},
      {q:`複習「${uName}」時，關鍵能力包含（　　　　）與「${tpC}」的綜合運用。`,a:tpA},
      {q:`寫完「${uShort}」測驗後，應該檢查「${tpB}」的（　　）是否標註清楚、計算是否正確。`,a:'單位'}
    ];
    const calcFall = [
      {q:`「${uShort}」步驟實作：請針對「${tpA}」，寫出一道包含 ${a0} 與 ${b0} 的合理算式或比較關係。`,a:`依「${tpA}」運用 ${a0}、${b0} 寫出合理關係與解答。`},
      {q:`「${uName}」概念檢核：請寫出在解決「${tpB}」問題時最關鍵的計算或判斷公式。`,a:`依「${tpB}」寫出本單元核心步驟或公式。`},
      {q:`「${uShort}」雙數推算練習：把 ${a0} 和 ${b0} 比較大小並相差算出來，相差為（　　）。`,a:String(Math.abs(a0-b0))},
      {q:`「${uShort}」合成應用：將 ${a0} 與 ${b0} 合起來一共有（　　）。`,a:String(a0+b0)}
    ];
    const wordFall = [
      {q:`【${uShort}素養情境】${nm}練習「${uName}」的「${tpA}」題目，先完成了 ${a0} 題，隔天又練習了 ${b0} 題，兩天一共練習了幾題「${tpB}」相關題目？`,a:`${a0} + ${b0} = ${a0+b0}（題）`},
      {q:`【${uShort}生活探究】班上分組討論「${uName}」的「${tpB}」重點，第一組舉出「${tpA}」，第二組提出「${tpC}」。請問同學在解這類問題時最該注意什麼細節？`,a:`應注意條件、數字關係與單位是否正確一致（如：${tps.join('、')}）。`},
      {q:`【${uShort}解題反思】${nm2}寫「${tpC}」題目時常因沒讀清楚題目而粗心出錯。請給他兩條複習「${uShort}」時的檢查建議。`,a:`(1) 圈出關鍵字與單位 (2) 完成後反向驗算一次。`}
    ];
    return {
      mc: mcFall[slot % mcFall.length],
      tf: tfFall[slot % tfFall.length],
      fill: fillFall[slot % fillFall.length],
      calc: calcFall[slot % calcFall.length],
      word: wordFall[slot % wordFall.length],
      match: {q:`${uName} 重點概念配對`,pairs:tps.slice(0,3).map((tp,i)=>[`重點 ${i+1}`,tp]).concat([['本單元主題',uShort]]).slice(0,4)}
    };
  };

  const dom = genNumericByDomain();
  return dom[kind] || dom.mc;
}


// ===== 1. 動態數學出題引擎（每年級各題型 7～10 組不同概念模板，不重複輪替）=====
function genMath(grade, diff, kind, vIdx=0){
  const g=+grade, hard=diff==='hard', easy=diff==='easy';
  const nm=pick(NAMES), nm2=pick(NAMES.filter(x=>x!==nm)), it=pick(ITEMS);
  const v=n=>(vIdx+randSeed)%n;

  if(kind==='tf'){
    const t=v(8), isTrue=Math.random()<0.5;
    if(g===1){
      if(t===0){const d1=rnd(1,6),d2=rnd(1,6),sum=isTrue?d1+d2:d1+d2+pick([1,-1,2]);return {q:`如圖，兩顆骰子的點數合起來是 ${sum}。`,svg:svgDicePair(d1,d2),a:isTrue?'○':'✕',exp:`${d1}＋${d2}＝${d1+d2}。`};}
      if(t===1){const t10=rnd(2,8),u1=rnd(1,9);if(t10===u1)return genMath(g,diff,kind,vIdx+1);const n=t10*10+u1;return {q:`「${n}」的十位數字是 ${isTrue?t10:u1}，個位數字是 ${isTrue?u1:t10}。`,a:isTrue?'○':'✕',exp:`${n} 是 ${t10} 個十和 ${u1} 個一。`};}
      if(t===2){const hr=rnd(1,11);return {q:`鐘面上長針指著 12，短針指著 ${hr}，代表現在是 ${isTrue?hr:hr+1} 點整。`,a:isTrue?'○':'✕',exp:`長針指 12、短針指 ${hr} 是 ${hr} 點整。`};}
      if(t===3){const c=isTrue?5:pick([3,4,6]);return {q:`1 個 50 元硬幣可以換成 ${c} 個 10 元硬幣。`,a:isTrue?'○':'✕',exp:`50 元可換 5 個 10 元。`};}
      if(t===4){return {q:isTrue?`皮球和圓罐比方盒更容易在地板上滾動。`:`正方體積木比皮球更容易在地板上滾動。`,a:isTrue?'○':'✕',exp:`有彎曲面或球體較容易滾動。`};}
      if(t===5){const k=rnd(4,9);return {q:`排隊時${nm}排在第 ${k} 個，代表他前面有 ${isTrue?k-1:k} 個人。`,a:isTrue?'○':'✕',exp:`排第 ${k} 個，前面有 ${k-1} 個人。`};}
      if(t===6){const n=rnd(20,79);return {q:`從 ${n} 往後數 1 個數是 ${isTrue?n+1:n-1}。`,a:isTrue?'○':'✕',exp:`${n} 往後數 1 是 ${n+1}。`};}
      const a0=rnd(4,9),b0=rnd(3,8);return {q:`「${a0} ＋ ${b0}」和「${b0} ＋ ${a0}」合起來的答案${isTrue?'一樣大':'不一樣大'}。`,a:isTrue?'○':'✕',exp:`加法交換位置答案相同。`};
    }
    if(g===2){
      if(t===0){const a=rnd(2,9),b=rnd(3,9),ans=isTrue?a*b:a*b+pick([a,-b,2]);return {q:`「${a} × ${b}」的答案是 ${ans}。`,a:isTrue?'○':'✕',exp:`${a}×${b}＝${a*b}。`};}
      if(t===1){const m=rnd(2,6),cm=rnd(15,85);return {q:`${m} 公尺 ${cm} 公分合起來等於 ${isTrue?m*100+cm:m*10+cm} 公分。`,a:isTrue?'○':'✕',exp:`1 公尺＝100 公分，共 ${m*100+cm} 公分。`};}
      if(t===2){return {q:isTrue?`正方形的 4 條邊都一樣長，且 4 個角都是直角。`:`長方形的 4 條邊一定都一樣長。`,a:isTrue?'○':'✕',exp:`長方形是對邊等長，正方形才是四邊等長。`};}
      if(t===3){const a=rnd(3,8);return {q:`「${a} 的 ${isTrue?0:1} 倍」答案是 0。`,a:isTrue?'○':'✕',exp:`任何數乘以 0 都是 0。`};}
      if(t===4){const yr=isTrue?12:10;return {q:`一年有 ${yr} 個月，一星期有 7 天。`,a:isTrue?'○':'✕',exp:`一年有 12 個月。`};}
      if(t===5){const n=rnd(3,7)*4;return {q:`把 ${n} 顆糖果平分給 4 人，每人可得 ${isTrue?n/4:n/4+1} 顆。`,a:isTrue?'○':'✕',exp:`${n}÷4＝${n/4}。`};}
      if(t===6){const h=rnd(2,8),u=rnd(1,9);return {q:`「${h} 個百和 ${u} 個一」合起來寫作 ${isTrue?h*100+u:h*10+u}。`,a:isTrue?'○':'✕',exp:`十位沒有要補 0，寫作 ${h*100+u}。`};}
      const d0=rnd(4,8);return {q:`1 個蛋糕平分成 ${d0} 塊，其中的 1 塊是 ${isTrue?`1/${d0}`:`1/${d0+1}`} 個蛋糕。`,a:isTrue?'○':'✕',exp:`平分成 ${d0} 份，每份是 1/${d0}。`};
    }
    if(g===3){
      if(t===0){const s=rnd(4,12),p=isTrue?s*4:s*s;return {q:`邊長 ${s} 公分的正方形，周長是 ${p} 公分。`,a:isTrue?'○':'✕',exp:`周長＝邊長×4＝${s*4} 公分。`};}
      if(t===1){const r=rnd(3,10);return {q:`一個圓的半徑是 ${r} 公分，它的直徑就是 ${isTrue?r*2:r} 公分。`,a:isTrue?'○':'✕',exp:`直徑＝半徑×2＝${r*2} 公分。`};}
      if(t===2){const d=rnd(4,9),rem=isTrue?d-1:d+1;return {q:`除法計算中，除數是 ${d} 時，餘數有可能是 ${rem}。`,a:isTrue?'○':'✕',exp:`餘數一定要比除數（${d}）小。`};}
      if(t===3){const kg=rnd(2,6);return {q:`${kg} 公斤和 ${isTrue?kg*1000:kg*100} 公克一樣重。`,a:isTrue?'○':'✕',exp:`1 公斤＝1000 公克。`};}
      if(t===4){const den=rnd(5,10),a=rnd(1,den-2);return {q:`分數「${a}/${den}」讀作「${isTrue?`${den}分之${a}`:`${a}分之${den}`}」。`,a:isTrue?'○':'✕',exp:`分母先讀，讀作 ${den}分之${a}。`};}
      if(t===5){return {q:isTrue?`比直角小的角稱為銳角，比直角大的角（小於180度）稱為鈍角。`:`鈍角比直角還要小。`,a:isTrue?'○':'✕',exp:`銳角＜直角(90°)＜鈍角。`};}
      if(t===6){const hr=rnd(1,9);return {q:`下午 ${hr} 時用 24 時制表示是 ${isTrue?hr+12:hr+10} 時。`,a:isTrue?'○':'✕',exp:`下午時間加 12 即為 24 時制。`};}
      const L0=rnd(2,6);return {q:`${L0} 公升的水和 ${isTrue?L0*1000:L0*100} 毫公升的水一樣多。`,a:isTrue?'○':'✕',exp:`1 公升＝1000 毫公升。`};
    }
    if(g===4){
      if(t===0){const a1=rnd(40,70),a2=rnd(35,65),a3=isTrue?180-a1-a2:180-a1-a2+10;return {q:`一個三角形的三個內角分別是 ${a1}°、${a2}° 和 ${a3}°。`,a:isTrue?'○':'✕',exp:`三角形內角和必為 180°。`};}
      if(t===1){return {q:isTrue?`計算「50 － 12 × 3」時，應該先算乘法再算減法。`:`計算「50 － 12 × 3」時，要由左到右先算 50 減 12。`,a:isTrue?'○':'✕',exp:`四則運算規則為先乘除後加減。`};}
      if(t===2){const m2=rnd(2,8);return {q:`${m2} 平方公尺等於 ${isTrue?m2*10000:m2*100} 平方公分。`,a:isTrue?'○':'✕',exp:`1 平方公尺＝10000 平方公分。`};}
      if(t===3){return {q:isTrue?`等腰三角形有兩條邊一樣長，且兩個底角也一樣大。`:`直角三角形裡面可以有兩個直角。`,a:isTrue?'○':'✕',exp:`三角形內角和 180°，最多只能有一個直角。`};}
      if(t===4){const d=rnd(3,8),n=rnd(d+1,d*3-1);return {q:`分子大於或等於分母的分數（如 ${n}/${d}）稱為${isTrue?'假分數':'真分數'}。`,a:isTrue?'○':'✕',exp:`分子≧分母為假分數。`};}
      if(t===5){const km=rnd(3,9);return {q:`${km} 公里等於 ${isTrue?km*1000:km*10000} 公尺。`,a:isTrue?'○':'✕',exp:`1 公里＝1000 公尺。`};}
      if(t===6){return {q:isTrue?`兩條平行線之間的垂直距離處處相等。`:`平行四邊形的四個角一定都是直角。`,a:isTrue?'○':'✕',exp:`平行線間距離處處相等。`};}
      const w0=rnd(5,12),h0=rnd(4,9);return {q:`長 ${w0} 公分、寬 ${h0} 公分的長方形，面積是 ${isTrue?w0*h0:(w0+h0)*2} 平方公分。`,a:isTrue?'○':'✕',exp:`長方形面積＝長×寬＝${w0*h0}。`};
    }
    if(g===5){
      if(t===0){const b0=rnd(6,14),h0=rnd(4,10),area=isTrue?(b0*h0)/2:b0*h0;return {q:`底 ${b0} 公分、高 ${h0} 公分的三角形，面積是 ${area} 平方公分。`,a:isTrue?'○':'✕',exp:`三角形面積＝底×高÷2＝${(b0*h0)/2}。`};}
      if(t===1){const n=pick([12,18,24,30]);return {q:`${n} 的最小因數是 1，最大因數是 ${isTrue?n:n/2}。`,a:isTrue?'○':'✕',exp:`任何正整數最小因數是 1，最大因數是自己。`};}
      if(t===2){const pct=pick([25,50,75,80]);return {q:`將百分率「${pct}%」化成小數是 ${isTrue?(pct/100).toFixed(2):(pct/10).toFixed(1)}。`,a:isTrue?'○':'✕',exp:`${pct}% ＝ ${(pct/100).toFixed(2)}。`};}
      if(t===3){const e=rnd(3,6);return {q:`邊長 ${e} 公分的正方體，體積是 ${isTrue?e*e*e:e*e*6} 立方公分。`,a:isTrue?'○':'✕',exp:`正方體體積＝邊長×邊長×邊長＝${e*e*e}。`};}
      if(t===4){return {q:isTrue?`平行四邊形的面積公式是「底 × 高」。`:`梯形的面積公式是「上底 ＋ 下底 × 高」。`,a:isTrue?'○':'✕',exp:`梯形面積＝(上底＋下底)×高÷2。`};}
      if(t===5){const d=rnd(3,7),k=rnd(2,5);return {q:`把分數的分子和分母同乘以 ${k}，分數的值${isTrue?'不會改變（等值分數）':'會變大 '+k+' 倍'}。`,a:isTrue?'○':'✕',exp:`擴分後為等值分數，其值不變。`};}
      if(t===6){return {q:isTrue?`正方體有 6 個全等的正方形面、8 個頂點和 12 條等長的邊。`:`長方體的 6 個面一定都是正方形。`,a:isTrue?'○':'✕',exp:`正方體 6 個面皆為全等正方形。`};}
      const t0=rnd(2,8);return {q:`${t0} 公噸的鐵和 ${isTrue?t0*1000:t0*100} 公斤的棉花一樣重。`,a:isTrue?'○':'✕',exp:`1 公噸＝1000 公斤。`};
    }
    // g===6
    if(t===0){const r=rnd(3,9);return {q:`半徑 ${r} 公分的圓，圓周長大約是 ${isTrue?(r*2*3.14).toFixed(2):(r*3.14).toFixed(2)} 公分（π＝3.14）。`,a:isTrue?'○':'✕',exp:`圓周長＝直徑×3.14＝${(r*2*3.14).toFixed(2)}。`};}
    if(t===1){return {q:isTrue?`所有的質數中，唯一的偶數是 2，且 1 不是質數也不是合數。`:`1 是最小的質數，所有的奇數都是質數。`,a:isTrue?'○':'✕',exp:`最小的質數是 2，1 不是質數。`};}
    if(t===2){const a=rnd(2,5),b=rnd(3,7),k=rnd(2,4);return {q:`「${a} ： ${b}」和「${a*k} ： ${b*k}」是相等的比，它們的比值相同。`,a:'○',exp:`前後項同乘以 ${k}，比值不變。`};}
    if(t===3){return {q:isTrue?`當速率固定時，行駛的距離和所花的時間成正比。`:`走相同的距離，速率越快，所花的時間就越長。`,a:isTrue?'○':'✕',exp:`距離固定時，速率越快所需時間越短。`};}
    if(t===4){return {q:isTrue?`角柱與圓柱的體積都可以用「底面積 × 柱高」來計算。`:`圓柱的側面展開後是一個圓形。`,a:isTrue?'○':'✕',exp:`圓柱側面展開圖是長方形。`};}
    if(t===5){const d1=rnd(2,5),d2=rnd(3,7);return {q:`計算分數除法「÷ ${d1}/${d2}」時，可以改寫成「× ${isTrue?`${d2}/${d1}`:`${d1}/${d2}`}」來計算。`,a:isTrue?'○':'✕',exp:`除以一個分數等於乘以它的倒數。`};}
    if(t===6){const s0=pick([100,200,500]);return {q:`在比例尺 1：${s0} 的地圖上，1 公分代表實際長度 ${isTrue?s0:s0*10} 公分。`,a:isTrue?'○':'✕',exp:`1：${s0} 代表圖上 1 公分等於實際 ${s0} 公分。`};}
    return {q:isTrue?`圓形圖中各扇形百分率的總和一定是 100%。`:`圓形圖的半徑越大，各項目所占的百分率就越大。`,a:isTrue?'○':'✕',exp:`圓形圖百分率總和必為 100%。`};
  }

  if(kind==='match'){
    const pairs=[];
    if(g<=2){
      const used=new Set();
      while(pairs.length<4){
        const a=rnd(g===1?3:2,9),b=rnd(2,9),expr=g===1?`${a} ＋ ${b}`:`${a} × ${b}`,val=String(g===1?a+b:a*b);
        if(!used.has(val)){used.add(val);pairs.push([expr,val]);}
      }
    }else if(g<=4){
      const m=rnd(2,5),L=rnd(2,4),km=rnd(1,3),kg=rnd(2,6);
      pairs.push([`${m} 公尺`,`${m*100} 公分`],[`${L} 公升`,`${L*1000} 毫公升`],[`${km} 公里`,`${km*1000} 公尺`],[`${kg} 公斤`,`${kg*1000} 公克`]);
    }else{
      const opts=shuffle([['0.15','15%'],['0.25','25%'],['0.40','40%'],['0.50','50%'],['3/4','75%'],['4/5','80%']]).slice(0,4);
      pairs.push(...opts);
    }
    return {q:'數學等值配對（將對應的代號填入括號中）',pairs};
  }

  if(g===1){
    const maxN=easy?10:(hard?99:20);
    const a=rnd(3,Math.max(6,Math.floor(maxN*0.6))), b=rnd(2,Math.max(4,maxN-a));
    if(kind==='calc'){
      const t=v(5);
      if(t===0) return {q:`${a} ＋ ${b} ＝（　　）`,a:String(a+b)};
      if(t===1){const x=Math.max(a,b)+rnd(2,9),y=rnd(1,x-1);return {q:`${x} － ${y} ＝（　　）`,a:String(x-y)};}
      if(t===2) return {q:`${a} ＋（　　）＝ ${a+b}`,a:String(b)};
      if(t===3){const c=rnd(2,6);return {q:`${a} ＋ ${b} ＋ ${c} ＝（　　）`,a:String(a+b+c)};}
      const c=rnd(1,a+b-1);return {q:`${a} ＋ ${b} － ${c} ＝（　　）`,a:String(a+b-c)};
    }
    if(kind==='word'){
      const t=v(6);
      if(t===0){const tot=rnd(7,10),dir=pick(['左','右']),k=rnd(2,tot-1);return {q:`★ 看看下面的圓圈，從「${dir}邊」算起第 ${k} 個，如果改從另一邊算起是第幾個？`,svg:svgRowCount(tot),a:`從另一邊數為第 ${tot-k+1} 個`};}
      if(t===1) return {q:`盒子裡有 ${a+b} 個${it}，拿走 ${b} 個後，還剩下幾個${it}？`,a:`${a+b} - ${b} = ${a}（個）`};
      if(t===2){const price=rnd(15,45);return {q:`一本小畫冊賣 ${price} 元，${nm}付了 1 個 50 元硬幣，可找回多少元？`,a:`50 - ${price} = ${50-price}（元）`};}
      if(t===3){const big=rnd(11,18),sm=rnd(4,big-2);return {q:`${nm}有 ${big} 張貼紙，${nm2}有 ${sm} 張貼紙，${nm}比${nm2}多幾張貼紙？`,a:`${big} - ${sm} = ${big-sm}（張）`};}
      if(t===4){const f=rnd(3,7),bk=rnd(2,6);return {q:`排隊買門票，${nm}前面有 ${f} 個人，後面有 ${bk} 個人，這一排共有幾個人？`,a:`${f} + 1 + ${bk} = ${f+bk+1}（人）`};}
      return {q:`公車上原本有 ${a} 個人，到站後上來 ${b} 個人，現在公車上有幾個人？`,a:`${a} + ${b} = ${a+b}（人）`};
    }
    if(kind==='fill'){
      const t=v(8);
      if(t===0){const tot=rnd(6,10),l=rnd(1,tot-1);return {q:`在分合表中填入正確的數字：`,svg:svgSplitBox(tot,l,'□'),a:String(tot-l)};}
      if(t===1) return {q:`數一數下面的機器人圖形：三角形有（　）個，圓形有（　）個，長方形有（　）個。`,svg:svgShapeRobot(),a:'2；1；3'};
      if(t===2){const st=rnd(5,10),nums=[st,st-1,st-2,st-3,st-4],bi=rnd(1,3);return {q:`依照順序，空格裡應該填入哪一個數字？`,svg:svgSeqTrain(nums,bi),a:String(nums[bi])};}
      if(t===3){const t10=rnd(1,6),u1=rnd(1,7);return {q:`看定位板上的算珠填填看：十位有 ${t10} 顆、個位有 ${u1} 顆，合起來是（　　）。`,svg:svgAbacus(t10,u1),a:String(t10*10+u1)};}
      if(t===4){const c10=rnd(1,3),c5=rnd(0,1),c1=rnd(1,3);return {q:`數一數圖中的硬幣，合起來一共有（　　）元。`,svg:svgCoins(1,c10,c5,c1),a:String(50+c10*10+c5*5+c1)};}
      if(t===5) return {q:`數一數下面的小屋圖形：三角形有（　）個，圓形有（　）個，長方形有（　）個。`,svg:svgShapeHouse(),a:'1；2；2'};
      if(t===6){const tot=10,l=rnd(2,8);return {q:`看圖填填看，蝴蝶翅膀上的兩個數合起來是 10，問號應該填（　）。`,svg:svgButterfly(10,l,'?'),a:String(10-l)};}
      return {q:`看圖分辨直線與曲線：屬於「直線」的有（　　），屬於「曲線」的有（　　）。（填代號）`,svg:svgLinesFour(),a:'①、③；②、④'};
    }
    const t=v(8);
    if(t===0){const x=rnd(3,8),y=rnd(2,7),ans=x+y;return {q:`數一數，左右兩邊的積木合起來共有幾個？`,svg:svgBlockAdd(x,y),opts:uniqueOpts(`${ans} 個`,[`${ans-1} 個`,`${ans+1} 個`,`${ans+2} 個`]),a:`${ans} 個`,exp:`${x}＋${y}＝${ans} 個。`};}
    if(t===1){const n=rnd(15,89);return {q:`哪個數「比 ${n} 大，又比 ${n+8} 小」？`,opts:uniqueOpts(n+4,[n-2,n,n+10]),a:String(n+4),exp:`${n+4} 介於 ${n} 和 ${n+8} 之間。`};}
    if(t===2){const hr=rnd(1,11),min=pick([0,30]),ans=`${hr} 點${min?' 30 分':'整'}`;return {q:`看圖回答，現在鐘面上的時間是幾點幾分？`,svg:svgClock(hr,min),opts:uniqueOpts(ans,[`${hr} 點${min?'整':' 30 分'}`,`${hr+1} 點${min?' 30 分':'整'}`,`6 點 ${hr} 分`]),a:ans,exp:`短針指 ${hr}，長針指 ${min?6:12}，是 ${ans}。`};}
    if(t===3){const t10=rnd(2,8),u1=rnd(1,9),ans=t10*10+u1;return {q:`「${t10} 個十和 ${u1} 個一」合起來是多少？`,opts:uniqueOpts(ans,[u1*10+t10,t10+u1,ans+10]),a:String(ans),exp:`${t10}×10＋${u1}＝${ans}。`};}
    if(t===4){const x=rnd(12,18),y=rnd(4,9),ans=x-y;return {q:`算式「${x} － ${y}」的答案是多少？`,opts:uniqueOpts(ans,[ans+1,ans-1,x+y]),a:String(ans),exp:`${x}-${y}=${ans}。`};}
    if(t===5){const p=rnd(2,4)*10+5;return {q:`買一個 ${p} 元的麵包，最少要付幾個 10 元硬幣才夠？`,opts:uniqueOpts(`${Math.ceil(p/10)} 個`,[`${Math.floor(p/10)} 個`,`${Math.ceil(p/10)+1} 個`,'1 個']),a:`${Math.ceil(p/10)} 個`,exp:`${Math.floor(p/10)} 個 10 元只有 ${Math.floor(p/10)*10} 元不夠，需 ${Math.ceil(p/10)} 個。`};}
    if(t===6){const ord=shuffle([0,1,2]),longest=ord.indexOf(0)+1;return {q:`看圖比一比，下面哪一枝鉛筆最長？`,svg:svgLengthCompare(ord),opts:uniqueOpts(`(${longest})`,['(1)','(2)','(3)','一樣長']),a:`(${longest})`,exp:`第 (${longest}) 枝鉛筆最長。`};}
    const k=rnd(3,8);return {q:`從第 1 頁讀到第 ${k} 頁，總共讀了幾頁？`,opts:uniqueOpts(`${k} 頁`,[`${k-1} 頁`,`${k+1} 頁`,'1 頁']),a:`${k} 頁`,exp:`第 1 頁到第 ${k} 頁共 ${k} 頁。`};
  }

  if(g===2){
    const m1=rnd(2,9), m2=rnd(2,9);
    if(kind==='calc'){
      const t=v(5);
      if(t===0) return {q:`${m1} × ${m2} ＝（　　）`,a:String(m1*m2)};
      const a=rnd(120,650), b=rnd(105,340);
      if(t===1) return {q:`${a} ＋ ${b} ＝（　　）`,a:String(a+b)};
      if(t===2) return {q:`${a+b} － ${b} ＝（　　）`,a:String(a)};
      if(t===3){const c=rnd(10,35);return {q:`${m1} × ${m2} ＋ ${c} ＝（　　）`,a:String(m1*m2+c)};}
      return {q:`（　　）× ${m1} ＝ ${m1*m2}`,a:String(m2)};
    }
    if(kind==='word'){
      const t=v(5);
      if(t===0){const k=rnd(3,9),each=rnd(4,9),extra=rnd(5,18);return {q:`一盒${it}有 ${each} 個，${nm}買了 ${k} 盒又多送 ${extra} 個，共有幾個？`,a:`${each} × ${k} + ${extra} = ${each*k+extra}（個）`};}
      if(t===1) return {q:`1 袋蘋果有 ${m1} 顆，媽媽買了 ${m2} 袋，總共有幾顆蘋果？`,a:`${m1} × ${m2} = ${m1*m2}（顆）`};
      if(t===2){const total=m1*m2;return {q:`把 ${total} 張貼紙平分給 ${m1} 位小朋友，每人分到幾張？`,a:`${total} ÷ ${m1} = ${m2}（張）`};}
      if(t===3){const a=rnd(150,380),b=rnd(120,260);return {q:`果園昨天採收 ${a} 顆橘子，今天比昨天多採收 ${b} 顆，今天採收了幾顆？`,a:`${a} + ${b} = ${a+b}（顆）`};}
      const p=rnd(6,9),q=rnd(4,8),pay=100;return {q:`每枝鉛筆 ${p} 元，買 ${q} 枝付 100 元，可找回多少元？`,a:`100 - ${p} × ${q} = ${100-p*q}（元）`};
    }
    if(kind==='fill'){
      const t=v(8), m=rnd(2,7), cm=rnd(10,85);
      if(t===0){const s=easy?0:rnd(1,3),len=rnd(4,7);return {q:`看下面的直尺，藍色彩帶的長度是（　）公分。`,svg:svgRulerMeasure(s,s+len),a:String(len)};}
      if(t===1){const r0=rnd(2,4),c0=rnd(3,6);return {q:`看圖填填看：每排有 ${c0} 個圓點，共有 ${r0} 排，合起來共有（　　）個圓點。`,svg:svgArrayDots(r0,c0),a:String(r0*c0)};}
      if(t===2){const h=rnd(3,8),t0=rnd(1,9),u=rnd(1,9);return {q:`「${h} 個百、${t0} 個十、${u} 個一」合起來是（　　）。`,a:String(h*100+t0*10+u)};}
      if(t===3){const yr=rnd(1,3),mo=rnd(2,10);return {q:`${yr} 年 ${mo} 個月 ＝（　　）個月。`,a:String(yr*12+mo)};}
      if(t===4) return {q:`正方體有（　）個面、（　）個頂點和（　）條邊。`,a:'6；8；12'};
      if(t===5){const st=rnd(200,700);return {q:`一百一數：${st}、${st+100}、（　　）、${st+300}。`,a:String(st+200)};}
      if(t===6){return {q:`${m} 公尺 ${cm} 公分 ＝（　　）公分。`,a:String(m*100+cm)};}
      const c10=rnd(2,4),c5=rnd(1,2),c1=rnd(1,4);return {q:`數一數圖中的硬幣，共有（　　）元。`,svg:svgCoins(1,c10,c5,c1),a:String(50+c10*10+c5*5+c1)};
    }
    const t=v(8);
    if(t===0) return {q:`哪一個算式和「${m1} × ${m2}」一樣大？`,opts:uniqueOpts(`${m2} × ${m1}`,[`${m1} ＋ ${m2}`,`${m1+1} × ${m2}`,`${m1} × ${m2+1}`]),a:`${m2} × ${m1}`,exp:`乘法交換律：${m1}×${m2}=${m2}×${m1}。`};
    if(t===1){const cm=rnd(150,350);return {q:`繩子長 ${cm} 公分，等於幾公尺幾公分？`,opts:uniqueOpts(`${Math.floor(cm/100)} 公尺 ${cm%100} 公分`,[`${Math.floor(cm/10)} 公尺 ${cm%10} 公分`,`${cm} 公尺`,`1 公尺 ${cm} 公分`]),a:`${Math.floor(cm/100)} 公尺 ${cm%100} 公分`,exp:`1 公尺＝100 公分。`};}
    if(t===2) return {q:`長方形和正方形都有幾個「直角」？`,opts:uniqueOpts('4 個直角',['2 個直角','3 個直角','6 個直角']),a:'4 個直角',exp:`長方形與正方形四個角皆為直角。`};
    if(t===3){const h=rnd(2,8),u=rnd(2,9),ans=h*100+u;return {q:`「${h} 個百和 ${u} 個一」合起來是多少？`,opts:uniqueOpts(ans,[h*10+u,h*100+u*10,u*100+h]),a:String(ans),exp:`十位是 0，合起來是 ${ans}。`};}
    if(t===4){const k=rnd(3,9);return {q:`「${k} 的 6 倍」比「${k} 的 4 倍」多幾個 ${k}？`,opts:uniqueOpts('2 個',['10 個','4 個','6 個']),a:'2 個',exp:`6 倍減 4 倍等於多 2 個 ${k}。`};}
    if(t===5){return {q:`閏年的 2 月有幾天？全年共有幾天？`,opts:uniqueOpts('29 天，全年 366 天',['28 天，全年 365 天','30 天，全年 365 天','29 天，全年 365 天']),a:'29 天，全年 366 天',exp:`閏年 2 月有 29 天，全年 366 天。`};}
    if(t===6){const d=rnd(3,9);return {q:`把 1 個披薩平分成 ${d} 片，其中的 1 片是幾個披薩？`,svg:svgFraction(1,d),opts:uniqueOpts(`1/${d} 個`,[`${d} 個`,`1/${d+1} 個`,'1 個']),a:`1/${d} 個`,exp:`平分成 ${d} 份，每份是 1/${d}。`};}
    const hr=rnd(1,11);return {q:`看時鐘回答：短針在 ${hr} 和 ${hr+1} 中間，長針指著 6，是幾點幾分？`,svg:svgClock(hr,30),opts:uniqueOpts(`${hr} 點 30 分`,[`${hr} 點整`,`${hr+1} 點 30 分`,`6 點 ${hr} 分`]),a:`${hr} 點 30 分`,exp:`長針指 6 代表 30 分。`};
  }

  if(g===3){
    if(kind==='calc'){
      const t=v(5);
      if(t===0){const a=rnd(24,98),b=rnd(3,9);return {q:`${a} × ${b} ＝（　　）`,a:String(a*b)};}
      if(t===1){const d=rnd(3,9),q=rnd(12,45),r=hard?rnd(1,d-1):0;return {q:`${d*q+r} ÷ ${d} ＝（　　）${r?'…（　）':''}`,a:r?`${q} 餘 ${r}`:String(q)};}
      if(t===2){const den=rnd(5,10),a=rnd(1,den-2),b=rnd(1,den-a);return {q:`看塗色部分，${a}/${den} ＋ ${b}/${den} ＝（　　）`,svg:svgFraction(a,den,b),a:`${a+b}/${den}`};}
      if(t===3){const x=(rnd(15,85)/10).toFixed(1),y=(rnd(12,64)/10).toFixed(1);return {q:`${x} ＋ ${y} ＝（　　）`,a:(+x + +y).toFixed(1)};}
      const a0=rnd(350,850),b0=rnd(120,340);return {q:`${a0} － ${b0} ＝（　　）`,a:String(a0-b0)};
    }
    if(kind==='word'){
      const t=v(5);
      if(t===0){const d=rnd(4,9),q=rnd(12,30),r=rnd(1,d-1);return {q:`${d*q+r} 顆糖果平分裝進 ${d} 袋，每袋最多裝幾顆？還剩幾顆？`,a:`${d*q+r} ÷ ${d} = ${q} … ${r}，每袋 ${q} 顆，剩 ${r} 顆`};}
      if(t===1){const w=rnd(6,15),h=rnd(4,10);return {q:`如圖，長方形菜園長 ${w} 公尺、寬 ${h} 公尺，走一圈周長是多少公尺？`,svg:svgRectDim(w,h,'公尺'),a:`(${w} + ${h}) × 2 = ${(w+h)*2}（公尺）`};}
      if(t===2){const m1=rnd(25,55),h1=rnd(8,10),dur=rnd(40,85),tot=h1*60+m1+dur;return {q:`電影上午 ${h1} 時 ${m1} 分開演，片長 ${dur} 分鐘，幾時幾分結束？`,a:`${Math.floor(tot/60)} 時 ${tot%60} 分`};}
      if(t===3){const box=rnd(4,8),per=rnd(6,12),price=rnd(8,15);return {q:`一盒餅乾有 ${per} 片，買了 ${box} 盒，每片 ${price} 元，共要付多少元？`,a:`${per} × ${box} × ${price} = ${per*box*price}（元）`};}
      const L1=rnd(1,3)*1000+rnd(200,700),L2=rnd(400,900);return {q:`水壺裡有 ${L1} 毫公升的水，喝掉 ${L2} 毫公升後，還剩下幾毫公升？`,a:`${L1} - ${L2} = ${L1-L2}（毫公升）`};
    }
    if(kind==='fill'){
      const t=v(8),km=rnd(2,8),m=rnd(50,800);
      if(t===0) return {q:`${km} 公里 ${m} 公尺 ＝（　　）公尺。`,a:String(km*1000+m)};
      if(t===1){const s=rnd(6,15);return {q:`邊長 ${s} 公分的正方形，周長是（　）公分。`,a:String(4*s)};}
      if(t===2){const ml=pick([200,400,600,800]);return {q:`看量杯上的刻度，杯子裡的水量是（　　）毫公升；如果再倒入 ${1000-ml} 毫公升就剛好是 1 公升。`,svg:svgBeaker(ml),a:String(ml)};}
      if(t===3){const kg=rnd(2,7),g0=rnd(120,850);return {q:`${kg} 公斤 ${g0} 公克 ＝（　　）公克。`,a:String(kg*1000+g0)};}
      if(t===4){const deg=pick([45,60,90,120]),tp=deg<90?'銳角':(deg===90?'直角':'鈍角');return {q:`如圖，這個角張開 ${deg}°，它是一個（　　）角。（填銳、直或鈍）`,svg:svgAngleArc(deg),a:tp.slice(0,1)};}
      if(t===5){const d=rnd(6,11),n=rnd(2,d-1);return {q:`1 － ${n}/${d} ＝（　　）。`,a:`${d-n}/${d}`};}
      if(t===6){const cm=rnd(3,9),mm=rnd(2,8);return {q:`${cm} 公分 ${mm} 毫米 ＝（　　）毫米。`,a:String(cm*10+mm)};}
      const r0=rnd(4,12);return {q:`如圖，半徑 ${r0} 公分的圓，直徑是（　　）公分。`,svg:svgCircle(r0,false),a:String(r0*2)};
    }
    const t=v(8);
    if(t===0){const s=rnd(5,14),ans=s*4;return {q:`邊長 ${s} 公尺的正方形花圃，周長是多少？`,opts:uniqueOpts(`${ans} 公尺`,[`${s*s} 公尺`,`${s*2} 公尺`,`${ans+4} 公尺`]),a:`${ans} 公尺`,exp:`周長＝邊長×4＝${ans} 公尺。`};}
    if(t===1){const r=rnd(4,12);return {q:`半徑 ${r} 公分的圓，直徑是多少公分？`,opts:uniqueOpts(`${r*2} 公分`,[`${r} 公分`,`${r*4} 公分`,`${r+2} 公分`]),a:`${r*2} 公分`,exp:`直徑＝半徑×2＝${r*2} 公分。`};}
    if(t===2){const a=rnd(12,35)/10,b=rnd(11,29)/10,ans=(a+b).toFixed(1);return {q:`「${a.toFixed(1)} ＋ ${b.toFixed(1)}」的結果是多少？`,opts:uniqueOpts(ans,[(+ans+1).toFixed(1),(+ans-0.5).toFixed(1),(a*10+b).toFixed(1)]),a:ans,exp:`小數點對齊相加得 ${ans}。`};}
    if(t===3){const d=rnd(5,9);return {q:`在「□ ÷ ${d} ＝ 12 … △」算式中，餘數 △ 最大可能是多少？`,opts:uniqueOpts(d-1,[d,d+1,11]),a:String(d-1),exp:`餘數必小於除數 ${d}，最大為 ${d-1}。`};}
    if(t===4){const hr=rnd(2,9);return {q:`下午 ${hr} 時 30 分，用「24 時制」表示是幾時幾分？`,opts:uniqueOpts(`${hr+12} 時 30 分`,[`${hr} 時 30 分`,`${hr+10} 時 30 分`,`24 時 ${hr} 分`]),a:`${hr+12} 時 30 分`,exp:`下午時間加 12 小時。`};}
    if(t===5){const n1=rnd(2,7);return {q:`${n1} 個「0.1」和 3 個「1」合起來是多少？`,opts:uniqueOpts(`3.${n1}`,[`${n1}.3`,`0.3${n1}`,`30.${n1}`]),a:`3.${n1}`,exp:`3 個 1 是 3，${n1} 個 0.1 是 0.${n1}，合起來是 3.${n1}。`};}
    if(t===6){const deg=pick([50,90,130]),ans=deg<90?'銳角':(deg===90?'直角':'鈍角');return {q:`如圖，張開 ${deg}° 的角稱為什麼角？`,svg:svgAngleArc(deg),opts:uniqueOpts(ans,['銳角','直角','鈍角','平角']),a:ans,exp:`${deg}° 為${ans}。`};}
    const w0=rnd(6,12),h0=rnd(3,5);return {q:`長 ${w0} 公分、寬 ${h0} 公分的長方形，面積是多少平方公分？`,opts:uniqueOpts(`${w0*h0} 平方公分`,[`${(w0+h0)*2} 平方公分`,`${w0+h0} 平方公分`,`${w0*h0+10} 平方公分`]),a:`${w0*h0} 平方公分`,exp:`面積＝長×寬＝${w0*h0} 平方公分。`};
  }

  if(g===4){
    if(kind==='calc'){
      const t=v(5);
      if(t===0){const a=rnd(12,45),b=rnd(3,9),c=rnd(15,60);return {q:`${c} ＋ ${a} × ${b} ＝（　　）`,a:String(c+a*b)};}
      if(t===1){const x=(rnd(11,55)/10).toFixed(1),y=(rnd(12,48)/10).toFixed(1);return {q:`${x} ＋ ${y} ＝（　　）`,a:(+x + +y).toFixed(1)};}
      if(t===2){const a=rnd(120,350),b=rnd(12,28);return {q:`${a} × ${b} ＝（　　）`,a:String(a*b)};}
      if(t===3){const d=rnd(12,25),q=rnd(11,32);return {q:`${d*q} ÷ ${d} ＝（　　）`,a:String(q)};}
      const a0=rnd(35,85),b0=rnd(12,28),c0=rnd(4,9);return {q:`(${a0} － ${b0}) × ${c0} ＝（　　）`,a:String((a0-b0)*c0)};
    }
    if(kind==='word'){
      const t=v(5);
      if(t===0){const p1=rnd(25,60),p2=rnd(15,40),n=rnd(3,7);return {q:`筆記本 ${p1} 元、原子筆 ${p2} 元，買 ${n} 本筆記本和 1 枝筆，付 500 元可找回幾元？`,a:`500 - (${p1} × ${n} + ${p2}) = ${500-(p1*n+p2)}（元）`};}
      if(t===1){const w=rnd(12,25),h=rnd(8,15);return {q:`如圖，長方形木板長 ${w} 公分、寬 ${h} 公分，面積與周長各是多少？`,svg:svgRectDim(w,h,'公分'),a:`面積 ${w*h} 平方公分；周長 ${(w+h)*2} 公分`};}
      if(t===2){const d=rnd(12,35)/10,n=rnd(4,9);return {q:`一瓶果汁 ${d.toFixed(1)} 公升，買 ${n} 瓶共有幾公升？`,a:`${d.toFixed(1)} × ${n} = ${(d*n).toFixed(1)}（公升）`};}
      if(t===3){const tot=rnd(15,30)*12;return {q:`果農採收了 ${tot} 顆水蜜桃，每 12 顆裝成一盒，全部可以裝滿幾盒？`,a:`${tot} ÷ 12 = ${tot/12}（盒）`};}
      const km=rnd(2,5),m0=rnd(150,750);return {q:`登山步道第一段長 ${km} 公里 ${m0} 公尺，第二段長 1 公里 200 公尺，兩段共長幾公尺？`,a:`${km*1000+m0} + 1200 = ${km*1000+m0+1200}（公尺）`};
    }
    if(kind==='fill'){
      const t=v(8);
      if(t===0){const v1=rnd(8,18),v2=rnd(12,24),v3=rnd(6,16),v4=rnd(10,22),mx=Math.max(v1,v2,v3,v4);return {q:`看長條圖回答：數量最多的是（　）組，四組合起來共有（　　）人。`,svg:svgBarChart(['甲','乙','丙','丁'],[v1,v2,v3,v4]),a:`${['甲','乙','丙','丁'][[v1,v2,v3,v4].indexOf(mx)]}；${v1+v2+v3+v4}`};}
      if(t===1){const a1=rnd(40,70),a2=rnd(35,65);return {q:`三角形兩角分別為 ${a1}° 和 ${a2}°，第三角是（　）°。`,a:String(180-a1-a2)};}
      if(t===2){const imp=rnd(11,23),den=rnd(3,5);return {q:`假分數 ${imp}/${den} 化成帶分數是（　　　）。`,a:`${Math.floor(imp/den)} 又 ${imp%den}/${den}`};}
      if(t===3){const m2=rnd(3,9);return {q:`${m2} 平方公尺 ＝（　　　）平方公分。`,a:String(m2*10000)};}
      if(t===4){const w=rnd(2,8),h=rnd(1,9),u=rnd(1,9);return {q:`「${w} 個 1、${h} 個 0.1 和 ${u} 個 0.01」合起來是（　　）。`,a:`${w}.${h}${u}`};}
      if(t===5){const w1=rnd(4,8),h1=rnd(6,10),w2=rnd(4,7),h2=rnd(3,5);return {q:`看圖計算這個 L 形複合圖形的面積是（　　）平方公分。`,svg:svgLShape(w1,h1,w2,h2),a:String(w1*h1+w2*h2)};}
      if(t===6){const deg=rnd(35,140);return {q:`如圖，一個平角 180° 減去 ${deg}° 後，剩下的角是（　　）°。`,svg:svgAngleArc(deg),a:String(180-deg)};}
      const w0=rnd(6,18),h0=rnd(4,12);return {q:`長 ${w0} 公尺、寬 ${h0} 公尺的長方形，面積是（　　）平方公尺。`,a:String(w0*h0)};
    }
    const t=v(8);
    if(t===0){const a=rnd(15,45),b=rnd(2,6),c=rnd(10,30),ans=c+a*b;return {q:`「${c} ＋ ${a} × ${b}」的正確答案為何？`,opts:uniqueOpts(ans,[(c+a)*b,ans+10,ans-5]),a:String(ans),exp:`先乘除後加減得 ${ans}。`};}
    if(t===1) return {q:`三邊等長、三角皆 60° 的三角形稱為什麼？`,opts:uniqueOpts('正三角形',['直角三角形','鈍角三角形','不等邊三角形']),a:'正三角形',exp:`三邊等長即正三角形。`};
    if(t===2){const n=rnd(24,89)*1000+rnd(100,900),ans=Math.round(n/1000)*1000;return {q:`${n} 用「四捨五入法」取概數到千位是多少？`,opts:uniqueOpts(ans,[ans+1000,ans-1000,Math.floor(n/100)*100]),a:String(ans),exp:`看百位數四捨五入得 ${ans}。`};}
    if(t===3){const s=rnd(6,15);return {q:`邊長 ${s} 公分的正方形，面積是多少平方公分？`,opts:uniqueOpts(s*s,[s*4,s*2,s*s+10]),a:String(s*s),exp:`正方形面積＝邊長×邊長＝${s*s}。`};}
    if(t===4){const w=rnd(2,5),d=rnd(3,7),n=rnd(1,d-1);return {q:`把帶分數「${w} 又 ${n}/${d}」化成假分數是多少？`,opts:uniqueOpts(`${w*d+n}/${d}`,[`${w+n}/${d}`,`${w*n}/${d}`,`${w*d-n}/${d}`]),a:`${w*d+n}/${d}`,exp:`${w}×${d}＋${n}＝${w*d+n}。`};}
    if(t===5) return {q:`一億是幾個「一千萬」合起來的？`,opts:uniqueOpts('10 個',['100 個','1000 個','1 個']),a:'10 個',exp:`10 個一千萬是一億。`};
    if(t===6){const a1=rnd(40,75),a2=rnd(45,65),ans=180-a1-a2;return {q:`三角形的兩個內角分別是 ${a1}° 和 ${a2}°，第三個內角是幾度？`,opts:uniqueOpts(`${ans}°`,[`${ans+10}°`,`${180-a1}°`,`90°`]),a:`${ans}°`,exp:`180°－${a1}°－${a2}°＝${ans}°。`};}
    return {q:`只有一雙對邊互相平行的四邊形稱為什麼？`,opts:uniqueOpts('梯形',['平行四邊形','長方形','菱形']),a:'梯形',exp:`只有一雙對邊平行的四邊形為梯形。`};
  }

  if(g===5){
    if(kind==='calc'){
      const t=v(5);
      if(t===0){const d1=rnd(2,5),d2=rnd(3,7);if(d1===d2)return genMath(5,diff,kind,vIdx+1);const L=lcm(d1,d2);const n1=rnd(1,d1-1),n2=rnd(1,d2-1);const num=n1*(L/d1)+n2*(L/d2),g0=gcd(num,L);return {q:`${n1}/${d1} ＋ ${n2}/${d2} ＝（　　）`,a:`${num/g0}/${L/g0}`};}
      if(t===1){const a=rnd(12,36)/10,b=rnd(2,9);return {q:`${a.toFixed(1)} × ${b} ＝（　　）`,a:(a*b).toFixed(1)};}
      if(t===2){const l=rnd(6,14),w=rnd(4,9),h=rnd(3,8);return {q:`看圖計算這個長方體的體積是多少立方公分？`,svg:svgBox3D(l,w,h),a:String(l*w*h)};}
      if(t===3){const a=rnd(12,48),b=pick([2,4,5,8]);return {q:`小數除法：${a} ÷ ${b} ＝（　　）`,a:String(a/b)};}
      const up=rnd(4,9),dn=rnd(7,15),h=rnd(4,8);return {q:`看圖計算梯形面積：（${up} ＋ ${dn}）× ${h} ÷ 2 ＝（　　）`,svg:svgTrapezoid(up,dn,h),a:String((up+dn)*h/2)};
    }
    if(kind==='word'){
      const t=v(5);
      if(t===0){const orig=rnd(4,15)*100,off=pick([75,80,85,90]);return {q:`外套原價 ${orig} 元，週年慶打 ${off%10===0?off/10:off} 折（${off}%），現在買需付幾元？`,a:`${orig} × ${off}% = ${orig*off/100}（元）`};}
      if(t===1){const l=rnd(10,20),w=rnd(8,14),h=rnd(5,10);return {q:`水箱內部尺寸長 ${l}、寬 ${w}、高 ${h} 公分，最多可裝幾毫公升水？`,a:`${l} × ${w} × ${h} = ${l*w*h}（毫公升）`};}
      if(t===2){const a=rnd(2,5)*6,b=rnd(2,5)*8;return {q:`${a} 顆糖果和 ${b} 塊餅乾平分裝袋且無剩餘，最多可分幾袋？`,a:`最大公因數 (${a}, ${b}) = ${gcd(a,b)}（袋）`};}
      if(t===3){const tot=rnd(20,50)*10,hit=Math.round(tot*pick([0.4,0.5,0.6,0.75]));return {q:`投籃練習中，${nm}投了 ${tot} 球，進了 ${hit} 球，他的投籃進球率是多少（以百分率表示）？`,a:`${hit} ÷ ${tot} = ${Math.round(hit*100/tot)}%`};}
      const b0=rnd(8,16),h0=rnd(5,12);return {q:`如圖，一塊底 ${b0} 公尺、高 ${h0} 公尺的平行四邊形草地，面積是多少平方公尺？`,svg:svgParallelogram(b0,h0),a:`${b0} × ${h0} = ${b0*h0}（平方公尺）`};
    }
    if(kind==='fill'){
      const t=v(8),a=rnd(2,6)*6,b=rnd(2,6)*9;
      if(t===0) return {q:`${a} 和 ${b} 的最大公因數是（　），最小公倍數是（　）。`,a:`${gcd(a,b)}；${lcm(a,b)}`};
      if(t===1){const L=rnd(15,45)/10;return {q:`${L.toFixed(1)} 公升 ＝（　　）毫公升 ＝（　　）立方公分。`,a:`${L*1000}；${L*1000}`};}
      if(t===2){const up=rnd(4,10),dn=rnd(8,16),h=rnd(4,8);return {q:`看圖計算，上底 ${up}、下底 ${dn}、高 ${h} 公分的梯形面積是（　　）平方公分。`,svg:svgTrapezoid(up,dn,h),a:String((up+dn)*h/2)};}
      if(t===3){const b0=rnd(6,15),h0=rnd(4,12);return {q:`看圖計算，底 ${b0} 公分、高 ${h0} 公分的平行四邊形面積是（　　）平方公分。`,svg:svgParallelogram(b0,h0),a:String(b0*h0)};}
      if(t===4){const vs=[rnd(18,22),rnd(23,26),rnd(27,31),rnd(21,25)];return {q:`看氣溫折線圖回答：最高溫與最低溫相差（　）度。`,svg:svgLineGraph(['9時','12時','15時','18時'],vs),a:String(Math.max(...vs)-Math.min(...vs))};}
      if(t===5){const n=rnd(2,5);return {q:`邊長 ${n} 公尺的正方體，體積是（　）立方公尺，合（　　　）立方公分。`,a:`${n*n*n}；${n*n*n*1000000}`};}
      if(t===6){const t0=rnd(2,9);return {q:`${t0} 公噸 ＝（　　　）公斤；${t0} 公頃 ＝（　　　）公畝。`,a:`${t0*1000}；${t0*100}`};}
      const p0=pick([20,25,40,75,80]);return {q:`將百分率「${p0}%」化為最簡分數是（　　），化為小數是（　　）。`,a:`${p0/gcd(p0,100)}/${100/gcd(p0,100)}；${(p0/100).toFixed(2).replace(/0$/,'')}`};
    }
    const t=v(8);
    if(t===0){const b0=rnd(8,18),h0=rnd(5,12),ans=(b0*h0)/2;return {q:`看圖計算，這個三角形的面積是多少平方公分？`,svg:svgTriangle(b0,h0),opts:uniqueOpts(ans,[b0*h0,b0+h0,ans+10]),a:String(ans),exp:`面積＝底×高÷2＝${ans}。`};}
    if(t===1) return {q:`下列哪一個數「同時是 2 和 3 的倍數」？`,opts:uniqueOpts(24,[25,27,32]),a:'24',exp:`偶數且各位數字和為 3 的倍數。`};
    if(t===2){const pct=pick([25,40,60,75,80]);return {q:`小數 ${(pct/100).toFixed(2)} 化成百分率是多少？`,opts:uniqueOpts(`${pct}%`,[`${pct/10}%`,`${pct*10}%`,`0.${pct}%`]),a:`${pct}%`,exp:`小數乘 100 加上 %。`};}
    if(t===3){const e=rnd(3,7);return {q:`邊長 ${e} 公分的正方體，表面積是多少平方公分？`,opts:uniqueOpts(e*e*6,[e*e*e,e*e*4,e*6]),a:String(e*e*6),exp:`邊長×邊長×6＝${e*e*6}。`};}
    if(t===4){const n=rnd(3,8);return {q:`正 ${n} 邊形一共有幾條對稱軸？`,opts:uniqueOpts(`${n} 條`,[`${n*2} 條`,'1 條','2 條']),a:`${n} 條`,exp:`正 N 邊形有 N 條對稱軸。`};}
    if(t===5) return {q:`「0.85 × 0.9」的積與被乘數 0.85 比較，結果如何？`,opts:uniqueOpts('比 0.85 小',['比 0.85 大','等於 0.85','無法比較']),a:'比 0.85 小',exp:`乘以小於 1 的數，積比被乘數小。`};
    if(t===6){const l=rnd(5,10),w=rnd(4,8),h=rnd(3,6),ans=l*w*h;return {q:`如圖，長 ${l}cm、寬 ${w}cm、高 ${h}cm 的長方體體積是多少？`,svg:svgBox3D(l,w,h),opts:uniqueOpts(`${ans} 立方公分`,[`${(l+w+h)*4} 立方公分`,`${l*w*2} 立方公分`,`${ans+20} 立方公分`]),a:`${ans} 立方公分`,exp:`長×寬×高＝${ans} 立方公分。`};}
    const c0=rnd(4,9);return {q:`圓錐有幾個頂點？幾個底面？`,opts:uniqueOpts('1 個頂點、1 個底面',['2 個頂點、2 個底面','0 個頂點、2 個底面','1 個頂點、2 個底面']),a:'1 個頂點、1 個底面',exp:`圓錐有 1 個頂點與 1 個圓形底面。`};
  }

  // grade 6
  if(kind==='calc'){
    const t=v(5);
    if(t===0){const r=rnd(4,12);return {q:`看圖計算，這個圓的面積大約是多少平方公分？（π＝3.14）`,svg:svgCircle(r,false),a:(r*r*3.14).toFixed(2).replace(/\.00$/,'')};}
    if(t===1){const a=rnd(2,5)*3,b=rnd(2,5)*5,g0=gcd(a,b);return {q:`「${a} ： ${b}」的最簡單整數比：（　　）`,a:`${a/g0} ： ${b/g0}`};}
    if(t===2){const x=rnd(4,18),k=rnd(3,8),c=rnd(5,20);return {q:`解方程式：${k} × x ＋ ${c} ＝ ${k*x+c}，x ＝（　）`,a:String(x)};}
    if(t===3){const a=rnd(2,5),b=rnd(3,7);return {q:`分數除法：${a} ÷ ${b}/${a+b} ＝（　　）`,a:`${a*(a+b)}/${b}`};}
    const r0=rnd(3,8),h0=rnd(5,10);return {q:`看圖計算圓柱體積（π＝3.14）：底面半徑 ${r0}cm、高 ${h0}cm ＝（　　）立方公分`,svg:svgCylinder(r0,h0),a:(r0*r0*3.14*h0).toFixed(1).replace(/\.0$/,'')};
  }
  if(kind==='word'){
    const t=v(5),v0=rnd(40,80),hr=rnd(2,5);
    if(t===0) return hard
      ? {q:`甲乙相距 ${v0*hr} 公里，去程時速 ${v0} 公里，回程花 ${hr+1} 小時，來回平均速率是每小時幾公里？`,a:`${v0*hr*2} ÷ ${hr+hr+1} ＝ ${((v0*hr*2)/(2*hr+1)).toFixed(1)} 公里/時`}
      : {q:`火車以時速 ${v0} 公里行駛 ${hr} 小時，共行駛了幾公里？`,a:`${v0} × ${hr} = ${v0*hr}（公里）`};
    if(t===1){const tot=rnd(4,12)*50,r1=rnd(2,4),r2=rnd(3,5),sum=r1+r2,realTot=Math.round(tot/sum)*sum;return {q:`把 ${realTot} 元按 ${r1} ： ${r2} 分給${nm}和${nm2}，各分得多少元？`,a:`${nm} ${realTot*r1/sum} 元，${nm2} ${realTot*r2/sum} 元`};}
    if(t===2){const r=rnd(4,10),h0=rnd(8,15);return {q:`如圖，底面半徑 ${r} 公分、高 ${h0} 公分的圓柱體，體積約多少立方公分？（π＝3.14）`,svg:svgCylinder(r,h0),a:`${r}×${r}×3.14×${h0} = ${(r*r*3.14*h0).toFixed(1)}（立方公分）`};}
    if(t===3){const base=rnd(200,500),pct=pick([20,25,30]);return {q:`一件襯衫成本 ${base} 元，老闆加計 ${pct}% 作為定價，定價是多少元？`,a:`${base} × (1 + ${pct}%) = ${base*(100+pct)/100}（元）`};}
    const d0=rnd(12,25),s1=rnd(55,75),s2=rnd(45,65);return {q:`兩車從同一地點同時反方向出發，甲車時速 ${s1} 公里、乙車時速 ${s2} 公里，3 小時後兩車相距幾公里？`,a:`(${s1} + ${s2}) × 3 = ${(s1+s2)*3}（公里）`};
  }
  if(kind==='fill'){
    const t=v(8),d=rnd(6,20);
    if(t===0) return {q:`直徑 ${d} 公分的圓，圓周長約（　　）公分。（π＝3.14）`,a:(d*3.14).toFixed(2).replace(/\.00$/,'')};
    if(t===1){const tot=200,pA=pick([35,40,45]),pB=pick([25,30]);return {q:`看社團圓形圖：若全校有 ${tot} 人，參加籃球社的有（　　）人，音樂社有（　　）人。`,svg:svgPieChart(pA,'籃球',pB,'音樂'),a:`${tot*pA/100}；${tot*pB/100}`};}
    if(t===2) return {q:`每秒 10 公尺 ＝ 每分鐘（　　）公尺 ＝ 時速（　）公里。`,a:'600；36'};
    if(t===3){const n=pick([12,18,20,28,30,45]);const pf=[];let tmp=n;for(let p=2;p<=tmp;p++){while(tmp%p===0){pf.push(p);tmp/=p;}}return {q:`將 ${n} 做質因數分解：${n} ＝（　　　　）。`,a:pf.join(' × ')};}
    if(t===4){const sc=pick([1000,5000,10000]),cm=rnd(2,6);return {q:`比例尺 1：${sc} 的地圖上，長 ${cm} 公分的路線實際長度是（　　）公尺。`,a:String(cm*sc/100)};}
    if(t===5){const r0=10,deg=pick([90,180]);return {q:`如圖，半徑 ${r0} 公分、圓心角 ${deg}° 的扇形，面積約（　　）平方公分。（π＝3.14）`,svg:svgSector(r0,deg),a:String(r0*r0*3.14*(deg/360))};}
    if(t===6){const x0=rnd(5,15),add=rnd(4,12);return {q:`若 y ＝ x ＋ ${add}，當 x ＝ ${x0} 時，y ＝（　　）。`,a:String(x0+add)};}
    const a0=rnd(4,9),b0=rnd(5,11);return {q:`甲、乙兩數的比是 ${a0}：${b0}，若甲數是 ${a0*6}，則乙數是（　　）。`,a:String(b0*6)};
  }
  const t=v(8);
  if(t===0){const v0=rnd(50,90),t0=rnd(2,4),ans=v0*t0;return {q:`汽車時速 ${v0} 公里行駛 ${t0} 小時，共走幾公里？`,opts:uniqueOpts(`${ans} 公里`,[`${Math.round(v0/t0)} 公里`,`${ans+v0} 公里`,`${v0+t0} 公里`]),a:`${ans} 公里`,exp:`距離＝速率×時間＝${ans} 公里。`};}
  if(t===1){const p=pick([2,3,5,7,11,13,17,19]);return {q:`下列哪一個數是「質數」？`,opts:uniqueOpts(p,[1,15,21,27]),a:String(p),exp:`${p} 只有 1 和自己兩個因數。`};}
  if(t===2){const deg=pick([60,90,120,180]),fr={60:'1/6',90:'1/4',120:'1/3',180:'1/2'}[deg];return {q:`如圖，圓心角 ${deg}° 的扇形面積是整個圓面積的幾分之幾？`,svg:svgSector(10,deg),opts:uniqueOpts(fr,['1/2','1/3','1/4','1/6','1/8']),a:fr,exp:`${deg}°÷360°＝${fr}。`};}
  if(t===3){const a=rnd(2,5)*3,b=rnd(2,5)*4;return {q:`「${a} ： ${b}」的比值是多少？`,opts:uniqueOpts(`${a/gcd(a,b)}/${b/gcd(a,b)}`,[`${b/gcd(a,b)}/${a/gcd(a,b)}`,`${a+b}`,`${a*b}`]),a:`${a/gcd(a,b)}/${b/gcd(a,b)}`,exp:`比值＝前項÷後項。`};}
  if(t===4){return {q:`甲和乙兩個數量成正比，當甲變為原來的 3 倍時，乙會如何變化？`,opts:uniqueOpts('變為原來的 3 倍',['變為原來的 1/3 倍','維持不變','變為原來的 6 倍']),a:'變為原來的 3 倍',exp:`成正比時，比值固定，同乘以 3 倍。`};}
  if(t===5){const n=rnd(5,9);return {q:`${n} 角柱共有幾個面、幾個頂點？`,opts:uniqueOpts(`${n+2} 個面、${n*2} 個頂點`,[`${n} 個面、${n} 個頂點`,`${n+1} 個面、${n+1} 個頂點`,`${n*2} 個面、${n+2} 個頂點`]),a:`${n+2} 個面、${n*2} 個頂點`,exp:`N 角柱有 N+2 個面、2N 個頂點、3N 條邊。`};}
  if(t===6){const r0=rnd(3,8);return {q:`半徑 ${r0} 公分的圓，面積大約是多少平方公分？（π＝3.14）`,svg:svgCircle(r0,false),opts:uniqueOpts((r0*r0*3.14).toFixed(2),[(r0*2*3.14).toFixed(2),(r0*r0).toFixed(2),(r0*3.14).toFixed(2)]),a:(r0*r0*3.14).toFixed(2),exp:`圓面積＝半徑×半徑×3.14。`};}
  const pA=40,pB=35;return {q:`看圓形圖，若全班有 40 人，參加籃球（${pA}%）比音樂（${pB}%）多幾人？`,svg:svgPieChart(pA,'籃球',pB,'音樂'),opts:uniqueOpts('2 人',['4 人','5 人','8 人']),a:'2 人',exp:`40 × (40% - 35%) ＝ 2 人。`};
}

// ===== 2c. 跨題型多變化數學題庫（確保 20 張綜合包題型與結構不重複，絕非單純改數字）=====
function genMathVariety(grade, sem, diff, kind, vIdx=0){
  const g=+grade, nm=pick(NAMES), nm2=pick(NAMES.filter(x=>x!==nm)), it=pick(ITEMS);
  const scale = g<=1 ? 1 : (g===2 ? 2 : (g===3 ? 4 : (g===4 ? 6 : 10)));
  const isTrue = (vIdx + randSeed) % 2 === 0;
  const idx = (n) => ((vIdx % n) + n) % n;

  if(kind==='tf'){
    const t = idx(58);
    if(t===0) return {q:`在整數中，偶數加上偶數的結果一定是${isTrue?'偶數':'奇數'}。`,a:isTrue?'○':'✕',exp:`偶數＋偶數＝偶數。`};
    if(t===1) return {q:`奇數加上奇數的結果一定是${isTrue?'偶數':'奇數'}。`,a:isTrue?'○':'✕',exp:`例如 3＋5＝8，奇數＋奇數＝偶數。`};
    if(t===2) return {q:`長方形的對角線${isTrue?'一樣長':'不一樣長'}，且四個角都是直角。`,a:isTrue?'○':'✕',exp:`長方形四角皆直角且兩對角線等長。`};
    if(t===3) return {q:`用「正方形瓷磚」完全覆蓋桌面時，邊長越大的正方形需要的片數會越${isTrue?'少':'多'}。`,a:isTrue?'○':'✕',exp:`單片面積越大，所需總片數越少。`};
    if(t===4) return {q:`分針在鐘面上走完一整圈（60 小格），剛好經過了 ${isTrue?'1 小時':'10 分鐘'}。`,a:isTrue?'○':'✕',exp:`分針走 1 圈為 60 分鐘＝1 小時。`};
    if(t===5) return {q:`同一個月內，這個月的第一天（1日）和第 8 天的星期${isTrue?'一定相同':'一定不同'}。`,a:isTrue?'○':'✕',exp:`一星期有 7 天，相差 7 天的星期相同。`};
    if(t===6){const d=rnd(3,9);return {q:`在一個有餘數的除法算式中，除數如果是 ${d}，餘數有可能是 ${isTrue?d-1:d+1}。`,a:isTrue?'○':'✕',exp:`餘數必須比除數 ${d} 小。`};}
    if(t===7) return {q:`任何一個正整數乘以 1 之後，它的數值會${isTrue?'維持不變':'變成 1'}。`,a:isTrue?'○':'✕',exp:`任何數×1＝原數。`};
    if(t===8) return {q:`「0 除以任何不等於 0 的整數」，所得的商都是 ${isTrue?'0':'原數'}。`,a:isTrue?'○':'✕',exp:`0 平均分給多人，每人依然得 0。`};
    if(t===9) return {q:`若一條繩子對折再對折後變為相等的 4 段，每段佔全長的 ${isTrue?'1/4':'1/2'}。`,a:isTrue?'○':'✕',exp:`對折一次變 2 段，再對折變 4 段，每段為 1/4。`};
    if(t===10) return {q:`當分子相同（皆為 1）時，分母越小的分數數值反而越${isTrue?'大':'小'}。`,a:isTrue?'○':'✕',exp:`切分越少份，單一份（如 1/2）比切越多份（如 1/8）大。`};
    if(t===11){const s=rnd(4,9);return {q:`兩個邊長都是 ${s} 公分的正方形拼成一個長方形，拼成後的周長是原來兩個正方形周長總和減去 ${isTrue?2*s:4*s} 公分。`,a:isTrue?'○':'✕',exp:`相接處有 2 條邊重合，不再計入外圍周長。`};}
    if(t===12) return {q:`量測教室黑板的長度，使用「${isTrue?'公尺':'毫米'}」作為單位會比「${isTrue?'毫米':'公尺'}」更適合。`,a:isTrue?'○':'✕',exp:`黑板約 3～4 公尺，以公尺最合適。`};
    if(t===13) return {q:`一顆常見雞蛋的重量大約是 55 ${isTrue?'公克':'公斤'}。`,a:isTrue?'○':'✕',exp:`日常雞蛋重約 50～60 公克。`};
    if(t===14) return {q:`當計算「先乘除、後加減」的兩步驟算式時，如果有小括號「( )」，就要${isTrue?'先把括號裡面的算出來':'忽略括號直接由左算到右'}。`,a:isTrue?'○':'✕',exp:`括號內的算式擁有最優先計算順序。`};
    if(t===15) return {q:`在小數的末尾加上或去掉 0（例如 2.5 與 2.50），這兩個數的大小${isTrue?'完全相等':'差了 10 倍'}。`,a:isTrue?'○':'✕',exp:`小數末尾的 0 不影響大小。`};
    if(t===16) return {q:`一年中，「7 月和 8 月」是連續的兩個${isTrue?'大月（都是 31 天）':'小月（都是 30 天）'}。`,a:isTrue?'○':'✕',exp:`7月、8月連續兩個月皆為 31 天大月。`};
    if(t===17) return {q:`把一張正方形色紙沿對角線剪開，會得到兩個完全一樣的${isTrue?'等腰直角三角形':'鈍角三角形'}。`,a:isTrue?'○':'✕',exp:`正方形四角皆為 90°，對折剪開得等腰直角三角形。`};
    if(t===18){const x=rnd(3,9),y=rnd(2,8);return {q:`在運算性質中，「(${x} ＋ ${y}) × 2」會等於「${x} × 2 ＋ ${y} × ${isTrue?2:1}」。`,a:isTrue?'○':'✕',exp:`乘法對加法的分配律。`};}
    if(t===19){const kg0=rnd(2,5);return {q:`${kg0} 公斤的棉花和 ${isTrue?kg0*1000:kg0*100} 公克的鐵塊放在天平兩端，會呈${isTrue?'水平平衡':'向右傾斜'}狀態。`,a:isTrue?'○':'✕',exp:`${kg0} 公斤＝${kg0*1000} 公克，重量相等。`};}
    if(t===20) return {q:`圓規兩腳張開的距離如果設定為 5 公分，畫出來的圓其「${isTrue?'半徑':'直徑'}」就是 5 公分。`,a:isTrue?'○':'✕',exp:`圓規兩腳距離決定圓的半徑。`};
    if(t===21) return {q:`同一個圓裡面所有的直徑長度都相等，而且每一條直徑都會${isTrue?'通過圓心':'垂直於圓心旁邊'}。`,a:isTrue?'○':'✕',exp:`直徑必通過圓心且等長。`};
    if(t===22) return {q:`奇數乘以奇數的乘積，結果一定會是「${isTrue?'奇數':'偶數'}」。`,a:isTrue?'○':'✕',exp:`例如 3×5＝15，奇×奇＝奇。`};
    if(t===23) return {q:`一枝鉛筆的厚度大約是 7 ${isTrue?'毫米':'公尺'}。`,a:isTrue?'○':'✕',exp:`鉛筆直徑約 7 毫米（0.7 公分）。`};
    if(t===24) return {q:`在直式加法計算時，如果某一位相加剛好滿 10，就要向前一位進 ${isTrue?'1':'10'}。`,a:isTrue?'○':'✕',exp:`十進位逢十進一。`};
    if(t===25) return {q:`正方形與長方形的周長如果都是 24 公分，它們的每條邊長${isTrue?'不一定都一樣':'一定完全相等'}。`,a:isTrue?'○':'✕',exp:`正方形四邊皆 6cm，長方形可為長 8cm 寬 4cm 等多種組合。`};
    if(t===26) return {q:`上午 11 時 30 分再過 1 小時，會變成「${isTrue?'下午 12 時 30 分（或 12:30）':'上午 12 時 30 分'}」。`,a:isTrue?'○':'✕',exp:`中午 12 時之後進入下午時段。`};
    if(t===27) return {q:`把 1 公升的水倒進 2 個容量都是 500 毫公升的杯子裡，${isTrue?'剛好裝滿不會溢出':'會溢出來 200 毫公升'}。`,a:isTrue?'○':'✕',exp:`500＋500＝1000 毫公升＝1 公升。`};
    if(t===28) return {q:`四邊形一定都有 4 條邊和 ${isTrue?'4 個角':'3 個角'}。`,a:isTrue?'○':'✕',exp:`四邊形定義為有 4 條邊與 4 個頂點、4 個角。`};
    if(t===29){const a=rnd(15,40);return {q:`若「甲比乙多 ${a}」，那麼想要知道乙是多少，只要用「甲 ${isTrue?'減去':'加上'} ${a}」就可以算出來。`,a:isTrue?'○':'✕',exp:`乙比較少，故乙＝甲－${a}。`};}
    if(t===30) return {q:`在分數比大小中，「${isTrue?'4/4':'3/4'}」剛好等於整數「1」。`,a:isTrue?'○':'✕',exp:`分子與分母相同時代表完整的一份，等於 1。`};
    if(t===31) return {q:`用 1 公分積木排成一排長 1 公尺的直線，總共需要 ${isTrue?'100':'10'} 個積木。`,a:isTrue?'○':'✕',exp:`1 公尺＝100 公分。`};
    if(t===32) return {q:`一個三角形裡面最多只可能出現「${isTrue?'1':'2'}」個直角。`,a:isTrue?'○':'✕',exp:`三角形內角和 180°，兩直角就已達 180° 無法組成三角形。`};
    if(t===33) return {q:`平年一整年有 365 天，其中 2 月份固定有 ${isTrue?'28':'29'} 天。`,a:isTrue?'○':'✕',exp:`平年 2 月有 28 天，閏年 2 月有 29 天。`};
    const extraTf = [
      ['兩條互相垂直的直線相交所成的角，大小一定是 90 度直角。','兩條平行線相交所成的角是 90 度直角。','垂直兩線相交成 90° 直角。'],
      ['把 300 公分換算成公尺，答案是 3 公尺。','把 300 公分換算成公尺，答案是 30 公尺。','100 公分＝1 公尺，300 公分＝3 公尺。'],
      ['角的大小和角的兩條邊張開的程度有關，跟邊畫得多長無關。','角的兩條邊畫得越長，這個角就會變得越大。','角的大小取決於張開程度，與邊長無關。'],
      ['同分母的分數相加時，只需把分子相加，分母保持不變。','同分母的分數相加時，分子和分母要分別相加。','同分母分數加減，分母不變、分子加減。'],
      ['用直尺測量鉛筆時，若從刻度 2 公分對齊到刻度 9 公分，筆長是 7 公分。','用直尺從刻度 2 公分量到刻度 9 公分，表示這枝筆長 9 公分。','9－2＝7 公分。'],
      ['在加減互逆驗算中，可以用「商×除數＋餘數」來檢查除法的答案對不對。','在除法驗算中，只要把「被除數×除數」就知道答案對不對。','除法驗算公式為：商×除數＋餘數＝被除數。'],
      ['一位小數 0.9 再加上 0.1 就會進位成整數 1。','一位小數 0.9 再加上 0.1 會變成 0.10。','9 個 0.1 加 1 個 0.1 等於 10 個 0.1＝1。'],
      ['正方形不僅四條邊等長，它同時也是一種特殊的長方形。','正方形的四條邊一樣長，但它完全不屬於四邊形。','正方形具備四直角與對邊平行等長特徵。'],
      ['在標準時鐘上，分針從數字 12 順時針走到數字 6，剛好經過 30 分鐘。','分針從數字 12 走到數字 6，代表經過了 6 分鐘。','6 大格 × 5 分＝30 分鐘。'],
      ['比較兩個四位數大小時，應該從最左邊的最高位（千位）開始比較。','比較兩個四位數大小時，要從最右邊的個位開始比最準。','比大小由最高位依序向右比。'],
      ['把 1 公尺長的木條剪掉 25 公分後，剩下的長度是 75 公分。','把 1 公尺長的木條剪掉 25 公分後，還剩下 85 公分。','100－25＝75 公分。'],
      ['在日曆上，1 月、3 月、5 月和 12 月都是 31 天的大月。','在日曆上，2 月、4 月、6 月和 9 月都有 31 天。','大月為 1、3、5、7、8、10、12 月。'],
      ['三角形三條邊的長度相加，就是這個三角形的「周長」。','三角形底乘高的計算結果叫作「周長」。','多邊形外圍所有邊的總和為周長。'],
      ['只要一個正方形的邊長是偶數公分，算出的周長也一定是偶數。','正方形邊長若是偶數公分，算出來的周長可能是奇數。','偶數 × 4 必為偶數。'],
      ['24 時制裡的「18 時 10 分」等同於下午 6 時 10 分。','24 時制裡的「18 時 10 分」是指下午 8 時 10 分。','18－12＝6，為下午 6 時 10 分。'],
      ['分母相同的兩個分數相減時，如果分子相等，答案就會等於 0。','分母相同的兩個分數相減時，只要分子相同就等於 1。','例如 3/5 － 3/5 ＝ 0。'],
      ['拿 1 公升的水壺倒水，最多剛好能倒滿 10 個 100 毫公升的紙杯。','拿 1 公升的水壺最多只能倒滿 5 個 100 毫公升的紙杯。','1000 ÷ 100 ＝ 10 杯。'],
      ['把一個圓平分對折兩次後，扇形的圓心角剛好是一個 90° 的直角。','把一個圓對折兩次後，扇形的角是 45° 的銳角。','360° ÷ 4 ＝ 90°。'],
      ['三位數乘以 0 之後，所得的乘積一定比這個三位數本身還要小。','三位數乘以 0 之後，答案會跟原來的三位數一樣大。','任何正整數 × 0 ＝ 0。'],
      ['體重 32 公斤的小學生與 32000 公克的書堆重量一樣重。','32 公斤的小學生比 32000 公克的貨物輕很多。','32 公斤 ＝ 32000 公克。'],
      ['時針與分針在「下午 3 時正」所夾成的較小夾角是一個直角。','在「下午 3 時正」時，時針與分針重合在同一個方向。','3 時整兩針相差 3 大格 ＝ 90° 直角。'],
      ['利用長方形長 10 公分、寬 6 公分的尺寸，可剪出最大邊長為 6 公分的正方形。','長 10 公分寬 6 公分的長方形，可以剪出邊長 10 公分的正方形。','正方形邊長受限於較短邊。'],
      ['小數 3.4 中的「4」是在十分位，表示有 4 個 0.1。','小數 3.4 中的「4」是在百分位，代表 4 個 0.01。','小數點右邊第一位為十分位。'],
      ['1 公里 50 公尺和 1050 公尺所代表的路程長度一模一樣。','1 公里 50 公尺換算成公尺是 1500 公尺。','1×1000＋50＝1050 公尺。'],
      ['超商買 2 瓶 25 元的牛奶用 100 元鈔票付款，找回的錢剛好是 1 個 50 元硬幣。','買 2 瓶 25 元牛奶付 100 元，只會找回 25 元。','100－25×2＝50 元。'],
      ['把一條長 2 公尺的彩帶剪成每段 50 公分裝飾教室，剛好可以剪出 4 段。','2 公尺彩帶剪成每段 50 公分，可以剪出 20 段。','200÷50＝4 段。'],
      ['星期二早上校外教學，往後數第 5 天剛好是這週的星期日。','星期二往後數第 5 天是同一週的星期五。','2＋5＝7（星期日）。'],
      ['平行四邊形的兩雙對邊不只互相平行，而且長度也分別相等。','平行四邊形的四個角一定全都是 90 度直角。','平行四邊形對邊平行且等長，角不一定是直角。']
    ];
    const et = extraTf[(t - 34) % extraTf.length];
    return {q: isTrue ? et[0] : et[1], a: isTrue ? '○' : '✕', exp: et[2]};
  }

  if(kind==='mc'){
    const t = idx(90);
    if(t===0){
      const ds = g<=1 ? [3,8,5] : [4,0,9,2];
      const maxS = g<=1 ? '853' : '9420';
      return {q:`用「${ds.join('、')}」這幾張數字卡排成一個不能重複數字的最大整數，應該是哪一個？`,opts:uniqueOpts(maxS, g<=1?['583','835','385']:['9402','9240','4920']),a:maxS,exp:`將較大數字依序放高位得 ${maxS}。`};
    }
    if(t===1){
      const ds = g<=1 ? [2,7,4] : [6,0,3,8];
      const minS = g<=1 ? '247' : '3068';
      return {q:`用「${ds.join('、')}」排出一個最小整數（最高位不可為 0），應選哪個？`,opts:uniqueOpts(minS, g<=1?['274','427','742']:['0368','3086','3608']),a:minS,exp:`0 放次高位，由小到大排列得 ${minS}。`};
    }
    if(t===2){
      const a=rnd(3,8)*scale, b=rnd(2,6)*scale, c=rnd(2,5);
      const ans=`(${a} ＋ ${b}) × ${c}`;
      return {q:`一盒鉛筆原本有 ${a} 枝，放進 ${b} 枝後，一共買了 ${c} 盒，要算總枝數可用哪個算式？`,opts:uniqueOpts(ans,[`${a} ＋ ${b} × ${c}`,`${a} × ${b} ＋ ${c}`,`${a} ＋ ${b} ＋ ${c}`]),a:ans,exp:`先算出每盒共有 ${a}＋${b} 枝，再乘以 ${c} 盒。`};
    }
    if(t===3){
      const d=rnd(5,9), q0=rnd(6,14), r=rnd(1,d-1), tot=d*q0+r;
      const vans = q0+1;
      return {q:`有 ${tot} 顆巧克力，每 ${d} 顆裝成 1 袋，「最多可以裝滿」幾袋？`,opts:uniqueOpts(`${q0} 袋`,[`${vans} 袋`,`${q0-1} 袋`,`${r} 袋`]),a:`${q0} 袋`,exp:`${tot}÷${d}＝${q0}…${r}，餘數不足 1 袋捨去。`};
    }
    if(t===4){
      const d=rnd(4,8), q0=rnd(5,12), r=rnd(1,d-1), tot=d*q0+r;
      return {q:`全班 ${tot} 位同學去坐船，每條船最多坐 ${d} 人，「最少需要租」幾條船才夠全班搭？`,opts:uniqueOpts(`${q0+1} 條`,[`${q0} 條`,`${q0-1} 條`,`${r} 條`]),a:`${q0+1} 條`,exp:`${tot}÷${d}＝${q0}…${r}，剩下的 ${r} 人還須再多租 1 條。`};
    }
    if(t===5) return {q:`下列哪一個生活物品的長度最適合使用「公里」來當作單位？`,opts:uniqueOpts('高速公路的長度',['鉛筆的長度','課本的寬度','橡皮擦的厚度']),a:'高速公路的長度',exp:`長距離道路以公里（km）表示。`};
    if(t===6){
      const hrs=rnd(1,3), mins=pick([20,30,45]), totMin=hrs*60+mins;
      return {q:`一部卡通片長「${hrs} 小時 ${mins} 分鐘」，相當於多少分鐘？`,opts:uniqueOpts(`${totMin} 分鐘`,[`${hrs*100+mins} 分鐘`,`${hrs*10+mins} 分鐘`,`${totMin+30} 分鐘`]),a:`${totMin} 分鐘`,exp:`1 小時＝60 分，${hrs}×60＋${mins}＝${totMin} 分。`};
    }
    if(t===7){
      const w=rnd(6,12), h=rnd(3,7), p=(w+h)*2;
      return {q:`長方形花圃周長為 ${p} 公尺，已知它的長是 ${w} 公尺，請問寬是多少公尺？`,opts:uniqueOpts(`${h} 公尺`,[`${p-w} 公尺`,`${h*2} 公尺`,`${w} 公尺`]),a:`${h} 公尺`,exp:`周長÷2－長 ＝ ${p/2}－${w} ＝ ${h} 公尺。`};
    }
    if(t===8){
      const den=pick([5,6,8,10]), a0=rnd(2,den-2);
      return {q:`分數「${a0}/${den}」裡面有幾個「1/${den}」？`,opts:uniqueOpts(`${a0} 個`,[`${den} 個`,`${den-a0} 個`,`${a0+den} 個`]),a:`${a0} 個`,exp:`${a0}/${den} 是 ${a0} 個 1/${den} 合起來的數。`};
    }
    if(t===9){
      const n=rnd(2,7)*100+rnd(1,9);
      return {q:`數「${n}」中，十位數字是 0，代表十位數字佔的數值是多少？`,opts:uniqueOpts('0',['10','100','無法表示']),a:'0',exp:`十位數字是 0 表示有 0 個十，數值為 0。`};
    }
    if(t===10){
      const a=rnd(15,45), b=rnd(12,35);
      return {q:`若「甲 ＋ ${a} ＝ ${a+b}」，且「甲 × 2 ＝ 乙」，則乙是多少？`,opts:uniqueOpts(b*2,[b,(a+b)*2,b+2]),a:String(b*2),exp:`先求甲＝${b}，再算乙＝${b}×2＝${b*2}。`};
    }
    if(t===11){
      const price=rnd(2,6)*10+5;
      return {q:`${nm}買了一本 ${price} 元的筆記本，最少要用「幾個錢幣」（50元、10元、5元、1元不限張數）才能剛好付清？`,opts:uniqueOpts(`${Math.floor(price/50)+Math.floor((price%50)/10)+((price%10)>=5?1:0)+(price%5)} 個`,['1 個','10 個','15 個']),a:`${Math.floor(price/50)+Math.floor((price%50)/10)+((price%10)>=5?1:0)+(price%5)} 個`,exp:`盡量先用最大面額硬幣搭配。`};
    }
    if(t===12){
      const st=rnd(3,9), step=rnd(4,7);
      return {q:`觀察數列的變化規律：${st}、${st+step}、${st+step*2}、（　）、${st+step*4}，括號內該填？`,opts:uniqueOpts(st+step*3,[st+step*3+1,st+step*2+1,st+step*4-1]),a:String(st+step*3),exp:`每次多 ${step}，因此應為 ${st+step*3}。`};
    }
    if(t===13){
      const deg=pick([35,55,75,115,135]), ans=deg<90?'銳角':'鈍角';
      return {q:`時鐘張開形成的角度如果是 ${deg}°，這是一個什麼角？`,opts:uniqueOpts(ans,['直角','平角','周角']),a:ans,exp:`小於 90° 為銳角，大於 90° 小於 180° 為鈍角。`};
    }
    if(t===14){
      const k=rnd(3,7), n=rnd(4,9);
      return {q:`關於奇偶數的判斷，下列哪一個算式的得數一定是「偶數」？`,opts:uniqueOpts(`${k*2} ＋ ${n*2}`,[`${k*2+1} ＋ ${n*2}`,`${k*2} ＋ ${n*2+1}`,`3 ＋ 4`]),a:`${k*2} ＋ ${n*2}`,exp:`兩個偶數相加結果必為偶數。`};
    }
    if(t===15){
      const a=rnd(12,35), b=rnd(11,29);
      return {q:`比較「${a} ＋ ${b}」與「${a+5} ＋ ${b-3}」兩者得數的大小關係？`,opts:uniqueOpts('後者比較大',['前者比較大','兩者一樣大','無法比較']),a:'後者比較大',exp:`前者得 ${a+b}，後者等於 ${a+b+2}，多了 2。`};
    }
    if(t===16){
      const k=rnd(2,4), g0=rnd(250,750);
      return {q:`${k} 公斤 ${g0} 公克 和下列哪一個重量相同？`,opts:uniqueOpts(`${k*1000+g0} 公克`,[`${k*100+g0} 公克`,`${k+g0} 公克`,`${k*10000+g0} 公克`]),a:`${k*1000+g0} 公克`,exp:`1 公斤＝1000 公克。`};
    }
    if(t===17){
      const a=rnd(2,5), b=rnd(3,6);
      return {q:`「紅緞帶長 ${a} 公分，藍緞帶的長度是紅緞帶的 ${b} 倍」，兩條緞帶接起來總長幾公分？`,opts:uniqueOpts(`${a*(b+1)} 公分`,[`${a*b} 公分`,`${a+b} 公分`,`${a*(b-1)} 公分`]),a:`${a*(b+1)} 公分`,exp:`${a} × (1＋${b}) ＝ ${a*(b+1)} 公分。`};
    }
    if(t===18){
      const h1=rnd(8,11), dMin=pick([40,50,70]), tot=h1*60+dMin;
      const ans=`${Math.floor(tot/60)} 時 ${String(tot%60).padStart(2,'0')} 分`;
      return {q:`一堂音樂課從上午 ${h1} 時 00 分上課，共上了 ${dMin} 分鐘，下課時是幾時幾分？`,opts:uniqueOpts(ans,[`${h1} 時 ${dMin} 分`,`${h1+2} 時 00 分`,`${h1-1} 時 30 分`]),a:ans,exp:`每滿 60 分進位 1 小時。`};
    }
    if(t===19){
      const x=rnd(3,8);
      return {q:`正方形的邊長變為原來的 ${x} 倍時，周長會變為原來的幾倍？`,opts:uniqueOpts(`${x} 倍`,[`${x*x} 倍`,`${x*4} 倍`,`維持不變`]),a:`${x} 倍`,exp:`周長與邊長成正比，同放大為 ${x} 倍。`};
    }
    if(t===20){
      const n=rnd(2,5)*1000+rnd(1,4)*100+50;
      const ans=`${Math.floor(n/1000)}個千＋${Math.floor((n%1000)/100)}個百＋5個十`;
      return {q:`把「${n}」改寫成幾千幾百的分解方式，何者正確？`,opts:uniqueOpts(ans,[`${Math.floor(n/1000)}個百＋5個十`,`${Math.floor(n/100)}個千＋5個一`,`${n}個十`]),a:ans,exp:`按位值拆解即可。`};
    }
    if(t===21) return {q:`關於直角、銳角、鈍角由小到大的排列順序，何者正確？`,opts:uniqueOpts('銳角 ＜ 直角 ＜ 鈍角',['直角 ＜ 銳角 ＜ 鈍角','鈍角 ＜ 直角 ＜ 銳角','銳角 ＜ 鈍角 ＜ 直角']),a:'銳角 ＜ 直角 ＜ 鈍角',exp:`角度分別為 <90°、＝90°、>90°。`};
    if(t===22) return {q:`下列哪一個長度最長？`,opts:uniqueOpts('2 公里',['1500 公尺','80000 公分','900000 毫米']),a:'2 公里',exp:`2 公里＝2000 公尺，其餘皆小於 2000 公尺。`};
    if(t===23) return {q:`下列哪一個時間最長？`,opts:uniqueOpts('2 小時 10 分鐘',['125 分鐘','7000 秒','1 小時 50 分鐘']),a:'2 小時 10 分鐘',exp:`2 小時 10 分＝130 分鐘，其餘皆小於 130 分。`};
    if(t===24) return {q:`下列哪一個重量最重？`,opts:uniqueOpts('3 公斤 200 公克',['3050 公克','2900 公克','3 公斤 20 公克']),a:'3 公斤 200 公克',exp:`3 公斤 200 公克＝3200 公克，最重。`};
    if(t===25) return {q:`要測量「十元硬幣的厚度」，使用哪一個單位最精確適當？`,opts:uniqueOpts('毫米 (mm)',['公分 (cm)','公尺 (m)','公里 (km)']),a:'毫米 (mm)',exp:`硬幣厚度極薄約 1～2 毫米。`};
    if(t===26) return {q:`關於圓形的敘述，下列哪一項是正確的？`,opts:uniqueOpts('一個圓的直徑是半徑的 2 倍',['同一個圓有很多個圓心','半徑永遠比直徑長','圓周圍起來的是三角形']),a:'一個圓的直徑是半徑的 2 倍',exp:`直徑＝2×半徑。`};
    if(t===27) return {q:`一隻大象大約重 4000 公斤，請問這相當於 1000 隻多少公斤的動物合起來的重量？`,opts:uniqueOpts('4 公斤',['40 公斤','400 公斤','0.4 公斤']),a:'4 公斤',exp:`4000÷1000＝4 公斤。`};
    if(t===28){const b=rnd(2,5);return {q:`下面哪一張鈔票與「1 張 1000 元鈔票」不能換成等值的組合？`,opts:uniqueOpts('9 張 100 元',['10 張 100 元','2 張 500 元','20 張 50 元硬幣']),a:'9 張 100 元',exp:`9 張 100 元只有 900 元。`};}
    if(t===29) return {q:`下面哪一個分數的數值「最小」？`,opts:uniqueOpts('1/9',['1/3','1/5','1/7']),a:'1/9',exp:`分子相同時，分母越大其值越小。`};
    if(t===30) return {q:`下面哪一個算式的答案「最接近 1000」？`,opts:uniqueOpts('498 ＋ 501',['210 ＋ 450','890 － 300','610 ＋ 620']),a:'498 ＋ 501',exp:`498＋501＝999，最接近 1000。`};
    if(t===31) return {q:`「把 36 顆草莓平分裝進 4 個盤子」，每盤有幾顆草莓？可以用哪一個乘法口訣來幫忙驗算？`,opts:uniqueOpts('四九三十六',['四八三十二','六六三十六','五七三十五']),a:'四九三十六',exp:`4×9＝36，故每盤 9 顆。`};
    if(t===32){const a=rnd(2,5)*100;return {q:`用 100 元鈔票買一條 ${a-120} 元的跳繩，最少要拿出幾張 100 元才夠付？`,opts:uniqueOpts(`${Math.ceil((a-120)/100)} 張`,[`${Math.floor((a-120)/100)} 張`,`${Math.ceil((a-120)/100)+2} 張`,`1 張`]),a:`${Math.ceil((a-120)/100)} 張`,exp:`須大於或等於商品金額。`};}
    if(t===33) return {q:`在一個大正方形裡面，剪掉一個小角落的小正方形後，新圖形的周長會怎麼變化？（兩條新凹邊與被剪掉的原邊等長）`,opts:uniqueOpts('跟原來一樣長',['一定會變短','一定會變長兩倍','變成原來的一半']),a:'跟原來一樣長',exp:`利用邊長平移性質，周長維持不變。`};
    if(t===34) return {q:`一年當中，有 31 天的月份共有幾個月？`,opts:uniqueOpts('7 個月',['4 個月','5 個月','6 個月']),a:'7 個月',exp:`1、3、5、7、8、10、12 月，共 7 個大月。`};
    if(t===35) return {q:`在「□ ÷ 6 ＝ 8 … ☆」這個算式裡，□ 最大可能是多少？`,opts:uniqueOpts('53',['48','49','54']),a:'53',exp:`餘數最大為 5，故 6×8＋5＝53。`};
    if(t===36) return {q:`鐘面上的時針從數字 3 走到數字 5，經過了多少時間？`,opts:uniqueOpts('2 小時',['2 分鐘','10 分鐘','120 秒']),a:'2 小時',exp:`時針每走 1 大格是 1 小時。`};
    if(t===37) return {q:`長 12 公分、寬 8 公分的長方形，要剪出一個「最大的正方形」，這個正方形的邊長是多少公分？`,opts:uniqueOpts('8 公分',['12 公分','4 公分','10 公分']),a:'8 公分',exp:`受限於較短邊（寬 8 公分）。`};
    if(t===38) return {q:`下列哪一個算式的結果和「120 ÷ 6 ÷ 2」相等？`,opts:uniqueOpts('120 ÷ (6 × 2)',['120 ÷ (6 ÷ 2)','120 ÷ 6 × 2','(120 ÷ 6) ＋ 2']),a:'120 ÷ (6 × 2)',exp:`連除兩數等於除以兩數之積。`};
    if(t===39) return {q:`有一個 4 位數，千位與個位都是 5，百位與十位都是 0，這個數讀作什麼？`,opts:uniqueOpts('五千零五',['五千五十','五百零五','五千五']),a:'五千零五',exp:`中間連續兩個 0 只讀一個零。`};
    if(t===40) return {q:`「0.7」這個小數，如果加上幾個 0.1 會剛好等於 1？`,opts:uniqueOpts('3 個',['7 個','10 個','1 個']),a:'3 個',exp:`0.7＋0.3＝1.0，故須 3 個 0.1。`};
    if(t===41) return {q:`小明面向北方站立，他向右轉 1 個直角後，現在他面向哪一個方向？`,opts:uniqueOpts('東方',['南方','西方','北方']),a:'東方',exp:`上北下南左西右東，面向北右轉即朝東。`};
    if(t===42) return {q:`一盒水果糖有 12 顆，弟弟吃了整盒的「1/3」，他一共吃了幾顆？`,opts:uniqueOpts('4 顆',['3 顆','6 顆','1 顆']),a:'4 顆',exp:`12 平分 3 份，每份 4 顆。`};
    if(t===43) return {q:`兩個數相乘的積是 0，下列哪一個說法一定是對的？`,opts:uniqueOpts('兩個數之中至少有一個是 0',['兩個數都是 1','兩數相加一定是 1','兩數都是奇數']),a:'兩個數之中至少有一個是 0',exp:`任何數乘 0 等於 0。`};
    if(t===44) return {q:`書包重 3 公斤 400 公克，水壺重 600 公克，合起來一共重幾公斤？`,opts:uniqueOpts('4 公斤',['3 公斤','3.5 公斤','400 公克']),a:'4 公斤',exp:`3400＋600＝4000 公克＝4 公斤。`};
    if(t===45) return {q:`一隻青蛙每天跳出井口 3 公尺但下滑 1 公尺，一天實際前進幾公尺？`,opts:uniqueOpts('2 公尺',['3 公尺','4 公尺','1 公尺']),a:'2 公尺',exp:`3－1＝2 公尺。`};
    if(t===46) return {q:`下列哪一個圖形「沒有直角」？`,opts:uniqueOpts('圓形',['正方形','長方形','直角三角形']),a:'圓形',exp:`圓形邊緣為光滑曲線，無直角。`};
    if(t===47) return {q:`在四則算式「56 － 18 ÷ 3」中，第一步應該先計算哪個部分？`,opts:uniqueOpts('18 ÷ 3',['56 － 18','56 ÷ 3','56 － 3']),a:'18 ÷ 3',exp:`先乘除後加減，先算除法。`};
    const extraMc = [
      ()=>{const n=rnd(2,7);return {q:`「${n} 條邊都一樣長、且有 ${n} 個一樣大的角」的多邊形，如果 ${n}＝4 就是哪種圖形？`,opts:uniqueOpts('正方形',['菱形','梯形','五邊形']),a:'正方形',exp:`4邊等長且4角皆為直角的四邊形是正方形。`};},
      ()=>{const a=rnd(120,380);return {q:`把「${a} 個一」和「3 個十」合起來，這個整數是多少？`,opts:uniqueOpts(String(a+30),[String(a+3),String(a+300),String(a*10+3)]),a:String(a+30),exp:`${a}＋30＝${a+30}。`};},
      ()=>{const v=pick([1500,2500,3500]);return {q:`量杯裡裝了 ${v} 毫公升的水，倒掉 1 公升後，還剩下多少毫公升？`,opts:uniqueOpts(`${v-1000} 毫公升`,[`${v-100} 毫公升`,`${v-10} 毫公升`,`${v+1000} 毫公升`]),a:`${v-1000} 毫公升`,exp:`1 公升＝1000 毫公升，${v}－1000＝${v-1000}。`};},
      ()=>({q:`關於「平行線」的性質，下列哪一個描述是正確的？`,opts:uniqueOpts('兩條平行線之間的垂直距離處處相等',['平行線最後一定會相交於一點','平行線一定會垂直交叉','一條線段就能叫作平行線']),a:'兩條平行線之間的垂直距離處處相等',exp:`兩平行線永遠不相交且距離相等。`}),
      ()=>({q:`如果要畫一個直徑是 12 公分的圓，圓規兩腳應該張開幾公分？`,opts:uniqueOpts('6 公分',['12 公分','24 公分','3 公分']),a:'6 公分',exp:`圓規張開半徑長＝12÷2＝6 公分。`}),
      ()=>({q:`統計圖表中，哪一種圖表最能清楚比較「不同項目數量的多寡」？`,opts:uniqueOpts('長條圖',['折線圖','圓點明細','亂數表']),a:'長條圖',exp:`長條圖以長條高度直觀比較各類別數量。`}),
      ()=>{const d=rnd(3,7),q0=rnd(5,11);return {q:`算式「${d*q0} ÷ ${d} ＝ ${q0}」中，「${d*q0}」在除法中稱為什麼名稱？`,opts:uniqueOpts('被除數',['除數','商數','餘數']),a:'被除數',exp:`被除數 ÷ 除數 ＝ 商。`};},
      ()=>({q:`一天共有 24 小時，如果從中午 12 時開始經過半天，會是何時？`,opts:uniqueOpts('午夜 12 時（24時）',['下午 6 時','隔天上午 6 時','上午 10 時']),a:'午夜 12 時（24時）',exp:`半天為 12 小時，12＋12＝24 時。`}),
      ()=>({q:`小數「0.05」代表幾個「0.01」合起來？`,opts:uniqueOpts('5 個',['50 個','1 個','0.5 個']),a:'5 個',exp:`百分位為 5，代表 5 個 0.01。`}),
      ()=>{const m=rnd(2,5);return {q:`百貨公司週年慶「買千送百」，小明家買了 ${m*1000} 元家電，可獲贈多少元禮券？`,opts:uniqueOpts(`${m*100} 元`,[`${m*10} 元`,`100 元`,`${m*500} 元`]),a:`${m*100} 元`,exp:`每滿 1000 送 100，${m} 個千元送 ${m*100} 元。`};},
      ()=>({q:`在算盤上或定位板中，從右邊數來第四個數位是什麼位？`,opts:uniqueOpts('千位',['百位','萬位','十位']),a:'千位',exp:`由右至左依序為個、十、百、千、萬。`}),
      ()=>({q:`「三百二十萬零四百」寫成阿拉伯數字時，總共會出現幾個 0？`,opts:uniqueOpts('4 個',['2 個','3 個','5 個']),a:'4 個',exp:`寫作 3200400，共 4 個 0。`}),
      ()=>{const a=rnd(4,9);return {q:`一個正六邊形每條邊長都是 ${a} 公分，繞它外圍走 1 圈是多少公分？`,opts:uniqueOpts(`${a*6} 公分`,[`${a*4} 公分`,`${a*5} 公分`,`${a*3} 公分`]),a:`${a*6} 公分`,exp:`6 邊等長，${a}×6＝${a*6} 公分。`};},
      ()=>({q:`下列哪一個時間單位最適合用來計量「100 公尺短跑的成績」？`,opts:uniqueOpts('秒',['小時','天','年']),a:'秒',exp:`短跑約十幾秒，用「秒」計量。`}),
      ()=>({q:`關於「等腰三角形」的特徵，下列哪一項一定是正確的？`,opts:uniqueOpts('有兩條邊一樣長，且兩個底角一樣大',['三條邊都絕對不等長','三個角一定都是直角','只有兩條邊和兩個頂點']),a:'有兩條邊一樣長，且兩個底角一樣大',exp:`等腰三角形兩腰等長、兩底角相等。`}),
      ()=>({q:`把一條長 1 公尺的緞帶平分成 10 段，其中 3 段合起來可以用哪個小數表示？`,opts:uniqueOpts('0.3 公尺',['0.03 公尺','3.0 公尺','1.3 公尺']),a:'0.3 公尺',exp:`1/10 公尺＝0.1 公尺，3 段即 0.3 公尺。`}),
      ()=>({q:`用 50 元、10 元和 5 元硬幣湊出 85 元，最少需要幾個硬幣？`,opts:uniqueOpts('5 個',['3 個','8 個','10 個']),a:'5 個',exp:`50×1 ＋ 10×3 ＋ 5×1 ＝ 85 元，共 5 個。`}),
      ()=>({q:`一個數除以 7 得到商是 12、餘數是 4，這個被除數是多少？`,opts:uniqueOpts('88',['84','80','92']),a:'88',exp:`7×12＋4＝88。`}),
      ()=>({q:`學校操場跑道一圈是 200 公尺，小華跑了 5 圈共跑了多少公里？`,opts:uniqueOpts('1 公里',['10 公里','100 公尺','5 公里']),a:'1 公里',exp:`200×5＝1000 公尺＝1 公里。`}),
      ()=>({q:`在四邊形中，哪一種圖形「兩雙對邊互相平行，且鄰邊不一定要等長」？`,opts:uniqueOpts('平行四邊形',['等腰梯形','圓形','正三角形']),a:'平行四邊形',exp:`平行四邊形兩組對邊皆平行且等長。`}),
      ()=>({q:`將「7/8」和「1」比較大小，兩者之間相差了多少？`,opts:uniqueOpts('1/8',['7/8','1/7','8/7']),a:'1/8',exp:`1 － 7/8 ＝ 8/8 － 7/8 ＝ 1/8。`}),
      ()=>({q:`一輛貨車載重限制 3 公噸，相當於多少公斤？`,opts:uniqueOpts('3000 公斤',['300 公斤','30000 公斤','30 公斤']),a:'3000 公斤',exp:`1 公噸＝1000 公斤。`}),
      ()=>({q:`上午 9 時 45 分到上午 10 時 20 分，中間一共經過了幾分鐘？`,opts:uniqueOpts('35 分鐘',['45 分鐘','25 分鐘','75 分鐘']),a:'35 分鐘',exp:`9:45 到 10:00 有 15 分，再加 20 分＝35 分。`}),
      ()=>({q:`「304 × 5」的積裡面有幾個 0？`,opts:uniqueOpts('1 個',['2 個','3 個','0 個']),a:'1 個',exp:`304×5＝1520，尾數共有 1 個 0。`}),
      ()=>({q:`下列哪一個分數和「1/2」的大小完全相等？`,opts:uniqueOpts('4/8',['2/5','3/4','5/8']),a:'4/8',exp:`分子分母同乘 4 得 4/8＝1/2。`}),
      ()=>({q:`一個長方體盒子總共有幾個頂點和幾條邊？`,opts:uniqueOpts('8 個頂點、12 條邊',['6 個頂點、8 條邊','12 個頂點、6 條邊','4 個頂點、8 條邊']),a:'8 個頂點、12 條邊',exp:`長方體有 6 面、8 頂點、12 條邊。`}),
      ()=>({q:`哪一個平面的四邊形，「四個角一定是直角，而且鄰邊不等長也成立」？`,opts:uniqueOpts('長方形',['正三角形','梯形','五邊形']),a:'長方形',exp:`長方形有四個直角且對邊等長。`}),
      ()=>({q:`小美存了 3 張 500 元和 4 個 50 元硬幣，她一共有多少元？`,opts:uniqueOpts('1700 元',['1550 元','1900 元','700 元']),a:'1700 元',exp:`1500＋200＝1700 元。`}),
      ()=>({q:`哪一個時間段代表「一天當中夜晚的 22 時 30 分」？`,opts:uniqueOpts('晚上 10 時 30 分',['上午 10 時 30 分','下午 2 時 30 分','晚上 8 時 30 分']),a:'晚上 10 時 30 分',exp:`22－12＝10，故為晚上 10 時 30 分。`}),
      ()=>({q:`用 1 平方公分的小方格拼成寬 4 公分、長 7 公分的長方形，共用幾個方格？`,opts:uniqueOpts('28 個',['11 個','22 個','14 個']),a:'28 個',exp:`面積 4×7＝28 平方公分，需 28 個。`}),
      ()=>({q:`計算「480 ÷ 8」，得數是多少？`,opts:uniqueOpts('60',['6','80','48']),a:'60',exp:`48÷8＝6，補零得 60。`}),
      ()=>({q:`下列哪一個重量的物品最輕？`,opts:uniqueOpts('450 公克',['1 公斤 50 公克','2 公斤','850 公克']),a:'450 公克',exp:`450 公克小於其餘三項。`}),
      ()=>({q:`兩地相距 4 公里 80 公尺，也可改寫成幾公尺？`,opts:uniqueOpts('4080 公尺',['4800 公尺','480 公尺','4008 公尺']),a:'4080 公尺',exp:`4×1000＋80＝4080 公尺。`}),
      ()=>({q:`下列哪一組分數相加起來「剛好等於 1」？`,opts:uniqueOpts('2/9 ＋ 7/9',['3/8 ＋ 4/8','1/5 ＋ 3/5','4/7 ＋ 4/7']),a:'2/9 ＋ 7/9',exp:`2/9＋7/9＝9/9＝1。`}),
      ()=>({q:`量筒裡原有 360 毫升的水，丟入一顆石頭後水位升到 510 毫升，石頭體積占多少毫公升？`,opts:uniqueOpts('150 毫公升',['870 毫公升','250 毫公升','50 毫公升']),a:'150 毫公升',exp:`排水法求體積：510－360＝150。`}),
      ()=>({q:`一個數的 5 倍是 45，那麼這個數的 8 倍會是多少？`,opts:uniqueOpts('72',['9','40','81']),a:'72',exp:`該數為 45÷5＝9，9×8＝72。`}),
      ()=>({q:`觀察月份天數，「今年 4 月底（30日）的隔天」是幾月幾日？`,opts:uniqueOpts('5 月 1 日',['4 月 31 日','5 月 30 日','3 月 1 日']),a:'5 月 1 日',exp:`4 月小月共 30 天，隔日進入 5 月 1 日。`}),
      ()=>({q:`在算式「(□ ＋ 15) × 3 ＝ 90」中，□ 代表的數字是多少？`,opts:uniqueOpts('15',['30','25','45']),a:'15',exp:`90÷3＝30，30－15＝15。`}),
      ()=>({q:`下面哪一組「不是」常見的長條圖製作必要要素？`,opts:uniqueOpts('個人家庭住址',['統計標題','橫軸項目名稱','縱軸刻度與單位']),a:'個人家庭住址',exp:`長條圖必備標題、軸線類別與刻度單位。`}),
      ()=>({q:`把一條繩子對折再對折後，剪開其中兩處（不含對折端？對，從中間剪斷一刀），其實「對折 1 次從正中間剪斷」最多會變成幾段？`,opts:uniqueOpts('3 段',['2 段','4 段','1 段']),a:'3 段',exp:`對折中間有彎曲連接，剪一刀分出左右 2 端＋中間折連 1 段＝3 段。`}),
      ()=>({q:`買 1 打（12枝）鉛筆共花 180 元，平均每枝鉛筆賣幾元？`,opts:uniqueOpts('15 元',['12 元','20 元','18 元']),a:'15 元',exp:`180÷12＝15 元。`})
    ];
    return extraMc[(t - 48) % extraMc.length]();
  }

  if(kind==='fill'){
    const t = idx(76);
    if(t===0){const a=rnd(12,35)*scale,b=rnd(8,25)*scale;return {q:`比大小（請填 ＞、＜ 或 ＝）：「${a} ＋ ${b}」（　）「${a+2} ＋ ${b-1}」`,a:'＜'};}
    if(t===1){const d=rnd(3,9),q0=rnd(5,12),r=rnd(1,d-1);return {q:`在「（　　）÷ ${d} ＝ ${q0} … ${r}」中，被除數應該是（　　）。`,a:String(d*q0+r)};}
    if(t===2){const a=rnd(4,9),b=rnd(2,6);return {q:`把乘法寫成連加：${a} × ${b} 就是 ${b} 個 ${a} 相加，也可以記為 ${a} 的（　）倍。`,a:String(b)};}
    if(t===3){const hr=rnd(1,4),min=rnd(10,45);return {q:`時間換算：${hr} 小時 ${min} 分鐘 ＝（　　）分鐘。`,a:String(hr*60+min)};}
    if(t===4){const m=rnd(2,8),cm=rnd(15,85);return {q:`長度換算：${m} 公尺 ${cm} 公分 ＝（　　）公分。`,a:String(m*100+cm)};}
    if(t===5){const L=rnd(2,6),ml=rnd(150,750);return {q:`容量換算：${L} 公升 ${ml} 毫公升 ＝（　　　）毫公升。`,a:String(L*1000+ml)};}
    if(t===6){const kg=rnd(1,5),gr=rnd(200,800);return {q:`重量換算：${kg} 公斤 ${gr} 公克 ＝（　　　）公克。`,a:String(kg*1000+gr)};}
    if(t===7){const s=rnd(5,15);return {q:`一個正三角形每條邊長 ${s} 公分，它的周長是（　　）公分。`,a:String(s*3)};}
    if(t===8){const den=rnd(5,9),n1=rnd(1,den-2);return {q:`分數補 1：1 － ${n1}/${den} ＝（　　）。`,a:`${den-n1}/${den}`};}
    if(t===9){const x=rnd(2,8);return {q:`小數寫作：「6 個 1 和 ${x} 個 0.1」合起來是（　　）。`,a:`6.${x}`};}
    if(t===10){const n=rnd(2,8)*100+rnd(10,90);return {q:`逆推填空：（　　）＋ ${n} ＝ ${n*2+50}。`,a:String(n+50)};}
    if(t===11){const st=rnd(10,40)*scale,sp=rnd(3,9)*scale;return {q:`倒數規律填填看：${st+sp*3} → ${st+sp*2} →（　　）→ ${st}。`,a:String(st+sp)};}
    if(t===12){const h=rnd(2,9);return {q:`鐘面分針從 12 走到 ${h}，共走了（　　）分鐘。`,a:String(h*5)};}
    if(t===13){const w=rnd(4,12),h=rnd(3,9);return {q:`長 ${w} 公分、寬 ${h} 公分的長方形，面積是（　　）平方公分。`,a:String(w*h)};}
    if(t===14){const x=rnd(3,9),y=rnd(2,6);return {q:`倍數關係：哥哥有 ${x*y} 元，是弟弟的 ${y} 倍，弟弟有（　　）元。`,a:String(x)};}
    if(t===15){const d=rnd(1,15),w=rnd(1,2);return {q:`日曆計算：7 月 ${d} 日經過 ${w} 星期後是 7 月（　　）日。`,a:String(d+w*7)};}
    if(t===16){const r=rnd(4,12);return {q:`圓形計算：一個圓的直徑是 ${r*2} 公分，它的半徑是（　　）公分。`,a:String(r)};}
    if(t===17){const th=rnd(1,7),u=rnd(2,9);return {q:`位值填數：由 ${th} 個千和 ${u} 個一組成的四位數寫作（　　　）。`,a:String(th*1000+u)};}
    if(t===18){const x=rnd(12,35);return {q:`一個數的 1 倍是 ${x}，這個數的 0 倍是（　），10 倍是（　　）。`,a:`0；${x*10}`};}
    if(t===19){const a=rnd(12,48),b=rnd(5,19);return {q:`加減互逆：已知 ${a} ＋ ${b} ＝ ${a+b}，所以 ${a+b} － ${a} ＝（　　）。`,a:String(b)};}
    if(t===20){const a=rnd(4,9),b=rnd(11,18);return {q:`乘除互逆：已知 ${a} × ${b} ＝ ${a*b}，所以 ${a*b} ÷ ${a} ＝（　　）。`,a:String(b)};}
    if(t===21){const s=rnd(6,15);return {q:`周長反推邊長：已知正方形的周長是 ${s*4} 公分，每條邊長（　　）公分。`,a:String(s)};}
    if(t===22){const m=rnd(2,5);return {q:`毫米單位換算：${m} 公分 ＝（　　）毫米；80 毫米 ＝（　）公分。`,a:`${m*10}；8`};}
    if(t===23){const p=rnd(2,7);return {q:`下午時刻換算 24 時制：下午 ${p} 時 15 分是（　　）時 15 分。`,a:String(p+12)};}
    if(t===24){const c1=rnd(1,4);return {q:`秒數換算：${c1} 分鐘 25 秒 ＝（　　）秒。`,a:String(c1*60+25)};}
    if(t===25){const n=rnd(3,9);return {q:`分數與整數：1 個披薩切 8 份，吃了 ${n} 份再補回 1 份，現在有（　　）分之（　）個。`,a:`8；${Math.max(1,8-n+1)}`};}
    if(t===26){const v1=rnd(2,5);return {q:`鈔票兌換：${v1} 張 500 元鈔票可以換成（　　）張 100 元鈔票。`,a:String(v1*5)};}
    if(t===27){const d=rnd(4,8);return {q:`除數為 ${d} 時，所有可能的餘數由小到大共有（　）種（不包含餘數為 0）。`,a:String(d-1)};}
    if(t===28){const n=rnd(2,7);return {q:`小數加減補 1：0.${n} ＋（　　）＝ 1；1 － 0.${n} ＝（　　）。`,a:`0.${10-n}；0.${10-n}`};}
    if(t===29){const k=rnd(3,8);return {q:`倍數填入：${k*100} 是 ${k} 的（　　）倍，也是 ${k*10} 的（　　）倍。`,a:`100；10`};}
    if(t===30){const a=rnd(15,35),b=rnd(10,25);return {q:`未知數求解：□ － ${a} ＝ ${b}，則 □ ＝（　　）。`,a:String(a+b)};}
    if(t===31) return {q:`三角板角度填空：一個直角三角板的三個角分別是 90°、45° 和（　　）°。`,a:'45'};
    if(t===32){const yr=2024;return {q:`閏年日曆檢查：西元 ${yr} 年是閏年，這年 2 月有（　　）天，全年共有（　　）天。`,a:'29；366'};}
    if(t===33){const len=rnd(10,20);return {q:`兩條長度分別為 ${len} 公分和 ${len+15} 公分的繩子，接在一起（重疊 3 公分）後總長為（　　）公分。`,a:String(len+len+15-3)};}
    const extraFill = [
      ()=>{const km=rnd(2,6),m0=rnd(50,450);return {q:`公里與公尺換算：${km} 公里 ${m0} 公尺 ＝（　　　）公尺。`,a:String(km*1000+m0)};},
      ()=>{const d=rnd(3,7);return {q:`等量平分：將 ${d*8} 顆糖果平分給 ${d} 位同學，每人可分到（　）顆。`,a:'8'};},
      ()=>{const x=rnd(2,6);return {q:`正方形面積換算：邊長 ${x} 公分的正方形，面積是（　　）平方公分。`,a:String(x*x)};},
      ()=>{const m=rnd(3,9);return {q:`零錢加總：${m} 個 50 元硬幣合起來一共是（　　）元。`,a:String(m*50)};},
      ()=>{const p=rnd(2,5);return {q:`週數轉換天數：${p} 星期加上 3 天，總共是（　　）天。`,a:String(p*7+3)};},
      ()=>{const h1=rnd(1,4);return {q:`倍數運算填數：一打鉛筆有 12 枝，${h1} 打一共有（　　）枝鉛筆。`,a:String(h1*12)};},
      ()=>{const a=rnd(15,35);return {q:`整百逼近估算：${a} × 10 ＝（　　），比 ${a*10-5} 多了（　）。`,a:`${a*10}；5`};},
      ()=>{const den=rnd(5,9);return {q:`等值概念：${den} 分之 ${den} 等於整數（　），也等於 2 分之（　）。`,a:'1；2'};},
      ()=>{const a=rnd(2,5);return {q:`天數與小時換算：${a} 日（整天）一共是（　　）小時。`,a:String(a*24)};},
      ()=>{const x=rnd(4,9);return {q:`整數與分數比較：把 1 個蘋果平分 ${x} 份，吃了 3 份是吃了（　　）個。`,a:`3/${x}`};},
      ()=>{const a=rnd(2,8);return {q:`公斤改寫：${a*1000} 公克 ＝（　）公斤；半公斤 ＝（　　）公克。`,a:`${a}；500`};},
      ()=>{const m=rnd(120,380);return {q:`整千湊數練習：${m} ＋（　　）＝ 1000。`,a:String(1000-m)};},
      ()=>{const d=rnd(3,7);return {q:`除法求餘數：${d*9+2} 除以 ${d}，商是（　），餘數是（　）。`,a:'9；2'};},
      ()=>{const w=rnd(6,12),h=rnd(4,8);return {q:`長方形周長計算：長 ${w} 公分、寬 ${h} 公分，周長是（　　）公分。`,a:String((w+h)*2)};},
      ()=>{const a=rnd(12,30);return {q:`等式平衡補空：${a} ＋ 25 ＝ 15 ＋（　　）。`,a:String(a+10)};},
      ()=>{const p=rnd(2,6);return {q:`小時與分鐘轉秒：${p} 分鐘 ＝（　　）秒。`,a:String(p*60)};},
      ()=>{const a=rnd(2,7);return {q:`小數數線推算：從 1.2 往右數 ${a} 個 0.1，會停在（　　）。`,a:(1.2+a*0.1).toFixed(1)};},
      ()=>{const a=rnd(3,9);return {q:`菱形與等邊性質：正四邊形一條邊是 ${a} 公尺，四條邊總長為（　　）公尺。`,a:String(a*4)};},
      ()=>{const s=rnd(2,6);return {q:`奇數數列推算：連續三個奇數分別是 ${s*2+1}、${s*2+3} 和（　　）。`,a:String(s*2+5)};},
      ()=>{const s=rnd(4,9);return {q:`偶數數列填空：${s*2} 之後的下一個連續偶數是（　　）。`,a:String(s*2+2)};},
      ()=>{const c=rnd(3,8);return {q:`一塊積木重 ${c}0 公克，5 塊相同的積木合起來一共重（　　）公克。`,a:String(c*50)};},
      ()=>{const m=rnd(15,40);return {q:`購物找零填答：拿 100 元買了一枝 ${m} 元的原子筆，應找回（　　）元。`,a:String(100-m)};},
      ()=>{const r=rnd(5,12);return {q:`半徑換算直徑：圓規兩腳張開 ${r} 公分所畫出的圓，直徑長（　　）公分。`,a:String(r*2)};},
      ()=>{const a=rnd(2,5);return {q:`百元鈔票換算：1 張 1000 元可以換成 ${a} 張 100 元和（　）張 100 元。`,a:String(10-a)};},
      ()=>{const m=rnd(3,7);return {q:`分母相同分數加法：1/${m+4} ＋ 2/${m+4} ＝（　　）。`,a:`3/${m+4}`};},
      ()=>{const y=rnd(1,5);return {q:`年與月換算：${y} 年 4 個月一共是（　　）個月。`,a:String(y*12+4)};},
      ()=>{const a=rnd(4,9);return {q:`倍數驗證：${a} 的 3 倍再加上 ${a} 的 2 倍，合起來是 ${a} 的（　）倍。`,a:'5'};},
      ()=>{const d=rnd(12,24);return {q:`時刻經過推算：下午 2 時 ${d} 分經過 40 分鐘，會來到下午（　）時（　）分。`,a:`${d+40>=60?3:2}；${(d+40)%60}`};},
      ()=>{const a=rnd(3,9);return {q:`體積概念填答：每層排 ${a} 個 1 立方公分積木，共疊 4 層，總體積為（　　）立方公分。`,a:String(a*4)};},
      ()=>{const n=rnd(2,6);return {q:`容量公升改寫：${n*1000+500} 毫公升 ＝（　）公升（　　）毫公升。`,a:`${n}；500`};},
      ()=>{const a=rnd(3,7);return {q:`四則混合分配：${a} × 12 ＝ ${a} × 10 ＋ ${a} ×（　）。`,a:'2'};},
      ()=>{const x=rnd(12,24);return {q:`等量代換空格：如果 ★ × 4 ＝ ${x*4}，那麼 ★ ＋ 10 ＝（　　）。`,a:String(x+10)};},
      ()=>{const k=rnd(2,6);return {q:`長度換算毫米：${k} 公分 7 毫米 ＝（　　）毫米。`,a:String(k*10+7)};},
      ()=>{const m=rnd(3,8);return {q:`時間差填寫：從上午 8 時 15 分到上午 9 時 ${m+15} 分，經過（　）小時（　）分。`,a:`1；${m}`};},
      ()=>{const s=rnd(3,7);return {q:`分數補數：${s}/11 ＋（　　）＝ 1。`,a:`${11-s}/11`};},
      ()=>{const d=rnd(4,9);return {q:`十倍百倍換算：${d} 張千元鈔票加上 5 個百元合起來是（　　　）元。`,a:String(d*1000+500)};},
      ()=>{const p=rnd(2,5);return {q:`倍數和推算：甲數是 ${p*6}，乙數是甲數的一半，兩數之和為（　　）。`,a:String(p*9)};},
      ()=>{const a=rnd(3,8);return {q:`小數比大小：0.${a}（　）${a}/10（請填 ＞、＜ 或 ＝）。`,a:'＝'};},
      ()=>{const w=rnd(4,9);return {q:`長方形推算：周長為 ${w*4+6} 公分的長方形，寬是 3 公分，長是（　　）公分。`,a:String(w*2)};},
      ()=>{const n=rnd(10,30);return {q:`日期加天數：3 月 ${n} 日再過 5 天，是幾月幾日？（　）月（　）日。`,a:`${n+5>31?4:3}；${n+5>31?n+5-31:n+5}`};},
      ()=>{const s=rnd(2,5);return {q:`乘法分配拆分：99 × ${s} ＝ 100 × ${s} －（　）。`,a:String(s)};}
    ];
    return extraFill[(t - 34) % extraFill.length]();
  }

  if(kind==='calc'){
    const t = idx(56);
    const a=rnd(12,45)*scale, b=rnd(7,28)*scale, c=rnd(3,9);
    if(t===0) return {q:`${a} ＋ ${b} ＝（　　）`,a:String(a+b)};
    if(t===1) return {q:`${a+b} － ${a} ＝（　　）`,a:String(b)};
    if(t===2) return {q:`${a} ＋ ${b} － ${c} ＝（　　）`,a:String(a+b-c)};
    if(t===3){const k3=rnd(12,38);return {q:`${k3} × ${c} ＝（　　）`,a:String(k3*c)};}
    if(t===4){const k=rnd(11,29);return {q:`直式乘法檢核：${k} × ${c} ＝（　　）`,a:String(k*c)};}
    if(t===5){const q0=rnd(11,24),r=rnd(1,c-1);return {q:`有餘數除法：${c*q0+r} ÷ ${c} ＝（　　）…（　）`,a:`${q0} … ${r}`};}
    if(t===6){const x=rnd(15,45),y=rnd(6,18);return {q:`先乘後加計算：${x} ＋ ${y} × ${c} ＝（　　）`,a:String(x+y*c)};}
    if(t===7){const x=rnd(4,12),y=rnd(3,9);return {q:`括號優先計算：(${x} ＋ ${y}) × ${c} ＝（　　）`,a:String((x+y)*c)};}
    if(t===8){const den=rnd(5,9),n1=rnd(1,3),n2=rnd(1,den-n1-1);return {q:`同分母分數減法：${n1+n2}/${den} － ${n1}/${den} ＝（　　）`,a:`${n2}/${den}`};}
    if(t===9){const d1=(rnd(25,85)/10),d2=(rnd(11,d1*10-5)/10);return {q:`小數減法計算：${d1.toFixed(1)} － ${d2.toFixed(1)} ＝（　　）`,a:(d1-d2).toFixed(1)};}
    if(t===10){const h1=rnd(1,3),m1=rnd(20,40),h2=rnd(1,2),m2=rnd(25,35),tm=m1+m2;return {q:`時間相加：${h1} 小時 ${m1} 分 ＋ ${h2} 小時 ${m2} 分 ＝（　）小時（　）分`,a:`${h1+h2+Math.floor(tm/60)} 時 ${tm%60} 分`};}
    if(t===11){const k1=rnd(1,4),g1=rnd(400,700),g2=rnd(500,800);return {q:`重量合併換算：${k1} 公斤 ${g1} 公克 ＋ ${g2} 公克 ＝（　　）公克`,a:String(k1*1000+g1+g2)};}
    if(t===12){const s1=rnd(4,12),s2=rnd(3,9);return {q:`兩數乘積求倍數：${s1} × ${s2} ＋ ${s1} ＝（　　）`,a:String(s1*(s2+1))};}
    if(t===13){const km=rnd(2,6),m0=rnd(300,850);return {q:`距離相差計算：${km} 公里 － ${m0} 公尺 ＝（　　）公尺`,a:String(km*1000-m0)};}
    if(t===14){const L=rnd(2,5),ml=rnd(200,700);return {q:`容量減法：${L} 公升 － ${ml} 毫公升 ＝（　　）毫公升`,a:String(L*1000-ml)};}
    if(t===15){const x=rnd(3,8)*10,y=rnd(2,6)*10;return {q:`整十連乘驗算：${x} × ${y} ＝（　　）`,a:String(x*y)};}
    if(t===16){const d=rnd(3,8),q0=rnd(12,25);return {q:`整除商數計算：${d*q0} ÷ ${d} ＝（　　）`,a:String(q0)};}
    if(t===17){const n=rnd(2,5)*100;return {q:`湊千補數計算：1000 － ${n+35} ＝（　　）`,a:String(1000-n-35)};}
    if(t===18){const x=rnd(20,50),y=rnd(6,15);return {q:`連減性質計算：${x+30} － ${y} － ${10} ＝（　　）`,a:String(x+20-y)};}
    if(t===19){const p1=rnd(120,350),p2=rnd(130,380),p3=rnd(50,150);return {q:`三數連加總和：${p1} ＋ ${p2} ＋ ${p3} ＝（　　）`,a:String(p1+p2+p3)};}
    const extraCalc = [
      ()=>{const d1=(rnd(12,45)/10),d2=(rnd(11,35)/10);return {q:`小數加法直式：${d1.toFixed(1)} ＋ ${d2.toFixed(1)} ＝（　　）`,a:(d1+d2).toFixed(1)};},
      ()=>{const den=pick([7,8,9,10]),n1=rnd(1,3),n2=rnd(1,den-n1);return {q:`同分母分數加法：${n1}/${den} ＋ ${n2}/${den} ＝（　　）`,a:`${n1+n2}/${den}`};},
      ()=>{const x=rnd(12,25),y=rnd(12,28);return {q:`先加後減順序：${x*10} ＋ ${y*10} － 95 ＝（　　）`,a:String(x*10+y*10-95)};},
      ()=>{const q0=rnd(20,45);return {q:`三位數乘以一位數：${q0*4} × ${c} ＝（　　）`,a:String(q0*4*c)};},
      ()=>{const x=rnd(14,32),y=rnd(4,8);return {q:`括號減除計算：(${x+40} － ${x}) ÷ ${y} ＝（　　）`,a:(40%y===0?String(40/y):`${Math.floor(40/y)}…${40%y}`)};},
      ()=>{const kg=rnd(2,4),g1=rnd(120,350),g2=rnd(250,480);return {q:`兩筆重量相減：${kg} 公斤 ${g1+500} 公克 － ${g2} 公克 ＝（　　）公克`,a:String(kg*1000+g1+500-g2)};},
      ()=>{const m1=rnd(15,35);return {q:`正方形與邊長倍率：${m1} × 4 ＋ ${m1} × 2 ＝（　　）`,a:String(m1*6)};},
      ()=>{const p=rnd(25,65);return {q:`連乘積運算：${p} × 2 × 5 ＝（　　）`,a:String(p*10)};},
      ()=>{const x=rnd(12,36),y=rnd(14,28);return {q:`加法交換驗證：${x} ＋ ${y} ＋ 100 ＝（　　）`,a:String(x+y+100)};},
      ()=>{const p=rnd(3,8),q=rnd(4,9);return {q:`先乘後減步驟：${p*20} － ${q} × 5 ＝（　　）`,a:String(p*20-q*5)};},
      ()=>{const q0=rnd(6,12);return {q:`先除後加計算：${q0*6} ÷ 6 ＋ 35 ＝（　　）`,a:String(q0+35)};},
      ()=>{const q0=rnd(8,15);return {q:`先除後減步驟：100 － ${q0*4} ÷ 4 ＝（　　）`,a:String(100-q0)};},
      ()=>{const m=rnd(2,5),cm=rnd(20,65);return {q:`長度合算練習：${m} 公尺 ${cm} 公分 ＋ 35 公分 ＝（　）公尺（　）公分`,a:`${m+Math.floor((cm+35)/100)} 公尺 ${(cm+35)%100} 公分`};},
      ()=>{const h=rnd(1,3),m=rnd(20,45);return {q:`經過時刻相減：${h+2} 時 ${m+10} 分 － ${h} 時 ${m} 分 ＝（　）小時（　）分`,a:`2 小時 10 分`};},
      ()=>{const x=rnd(15,35);return {q:`加倍與三倍求和：${x} × 2 ＋ ${x} × 3 ＝（　　）`,a:String(x*5)};},
      ()=>{const x=rnd(12,24);return {q:`括號內相乘計算：8 × (${x} － 9) ＝（　　）`,a:String(8*(x-9))};},
      ()=>{const d=rnd(4,9),m=rnd(15,35);return {q:`乘法逆推空格：（　　）÷ ${d} ＝ ${m}（整除無餘數）`,a:String(d*m)};},
      ()=>{const x=rnd(20,50),y=rnd(10,30);return {q:`千位退位直式減法：2000 － ${x*10+y} ＝（　　）`,a:String(2000-(x*10+y))};},
      ()=>{const x=rnd(11,25);return {q:`二位數乘整十練習：${x} × 30 ＝（　　）`,a:String(x*30)};},
      ()=>{const x=rnd(4,9);return {q:`整百除以一位數：${x*100} ÷ 5 ＝（　　）`,a:String(x*20)};},
      ()=>{const x=rnd(15,45);return {q:`加法湊百進位：${x} ＋ 199 ＝（　　）`,a:String(x+199)};},
      ()=>{const x=rnd(350,680);return {q:`減法湊整技巧：${x} － 198 ＝（　　）`,a:String(x-198)};},
      ()=>{const d=rnd(1,4);return {q:`一位小數連加：0.${d} ＋ 1.${d+2} ＋ 2.5 ＝（　　）`,a:(d*0.1+1+(d+2)*0.1+2.5).toFixed(1)};},
      ()=>{const den=pick([6,8,10]);return {q:`整數與分數減法：2 － 3/${den} ＝（　　）`,a:`1 又 ${den-3}/${den}`};},
      ()=>{const a=rnd(12,25),b=rnd(14,32);return {q:`長方形四邊求和：${a} ＋ ${b} ＋ ${a} ＋ ${b} ＝（　　）`,a:String((a+b)*2)};},
      ()=>{const w=rnd(2,6);return {q:`面積倍數推算：(${w} × 5) × 4 ＝（　　）`,a:String(w*20)};},
      ()=>{const a=rnd(3,8);return {q:`分與秒進位計算：${a} 分 45 秒 ＋ 35 秒 ＝（　）分（　）秒`,a:`${a+1} 分 20 秒`};},
      ()=>{const g=rnd(2,6);return {q:`公斤退位扣減：${g} 公斤 － 450 公克 ＝（　　）公克`,a:String(g*1000-450)};},
      ()=>{const s=rnd(12,35);return {q:`未知被減數求解：（　　）－ ${s} ＝ 88`,a:String(s+88)};},
      ()=>{const p=rnd(12,28);return {q:`價格加總驗算：${p*5} 元 ＋ ${p*10} 元 － 15 元 ＝（　　）元`,a:String(p*15-15)};},
      ()=>{const k=rnd(2,5);return {q:`平方陣列計數：${k*4} × ${k*4} ＝（　　）`,a:String(k*4*k*4)};},
      ()=>{const m=rnd(10,30);return {q:`三數連減步驟：500 － ${m} － ${m+20} ＝（　　）`,a:String(500-m-(m+20))};},
      ()=>{const d=rnd(3,7);return {q:`連除化簡步驟：${d*24} ÷ 4 ÷ 2 ＝（　　）`,a:String(d*3)};},
      ()=>{const d=rnd(2,8);return {q:`同分母與整數湊二：1/${d+3} ＋ ${d+2}/${d+3} ＋ 1 ＝（　）`,a:'2'};},
      ()=>{const a=rnd(3,9);return {q:`半徑與圓周概念倍算：${a} × 2 × 3 ＝（　　）`,a:String(a*6)};},
      ()=>{const p=rnd(15,40);return {q:`單價倍率加總：(${p} ＋ 5) × 6 ＝（　　）`,a:String((p+5)*6)};}
    ];
    return extraCalc[(t - 20) % extraCalc.length]();
  }

  if(kind==='word'){
    const t = idx(20);
    if(t===0){const a=rnd(18,32),b=rnd(5,12),c=rnd(4,10);return {q:`公車上原本有 ${a} 位乘客，到站後下車了 ${b} 人，又上車了 ${c} 人，現在車上有幾人？`,a:`${a} - ${b} + ${c} = ${a-b+c}（人）`};}
    if(t===1){const p1=rnd(35,85),p2=rnd(20,45),pay=500;return {q:`媽媽買了一袋 ${p1} 元的${it}和兩瓶每瓶 ${p2} 元的鮮奶，付給店員 ${pay} 元，應找回多少元？`,a:`${pay} - ${p1} - ${p2*2} = ${pay-p1-p2*2}（元）`};}
    if(t===2){const tot=rnd(45,95),cut=rnd(6,9),q0=Math.floor(tot/cut),r=tot%cut;return {q:`一條彩帶長 ${tot} 公分，每 ${cut} 公分剪成一段包裝禮物，最多可剪成幾段？還剩幾公分？`,a:`${tot} ÷ ${cut} = ${q0}（段）餘 ${r}（公分）`};}
    if(t===3){const kids=rnd(28,45),cap=rnd(5,8),q0=Math.floor(kids/cap),r=kids%cap;return {q:`戶外教學共有 ${kids} 位學生要搭計程車，每輛車限坐 ${cap} 人，至少需要叫幾輛車？`,a:`${kids} ÷ ${cap} = ${q0}${r?`…${r}，至少需 ${q0+1} 輛`:'，需 '+q0+' 輛'}`};}
    if(t===4){const pg=rnd(72,140),per=rnd(8,12);return {q:`一本故事書有 ${pg} 頁，${nm}每天固定讀 ${per} 頁，連續讀了 6 天後，還剩下幾頁沒讀？`,a:`${pg} - (${per} × 6) = ${pg-per*6}（頁）`};}
    if(t===5){const h1=rnd(125,148),diffH=rnd(7,16);return {q:`${nm}的身高是 ${h1} 公分，${nm2}比他高了 ${diffH} 公分，請問兩人的身高合起來共是多少公分？`,a:`${h1} + (${h1} + ${diffH}) = ${h1*2+diffH}（公分）`};}
    if(t===6){const w=rnd(8,16),h=rnd(5,11);return {q:`長方形蔬菜園長 ${w} 公尺、寬 ${h} 公尺，農夫想在四周圍起竹籬笆，至少需要幾公尺的籬笆？`,a:`(${w} + ${h}) × 2 = ${(w+h)*2}（公尺）`};}
    if(t===7){const h1=rnd(8,10),m1=rnd(15,40),dur=rnd(45,80),tot=h1*60+m1+dur;return {q:`美術課於上午 ${h1} 時 ${m1} 分開始，一共進行 ${dur} 分鐘，請問幾時幾分結束？`,a:`${Math.floor(tot/60)} 時 ${tot%60} 分`};}
    if(t===8){const basket=rnd(300,500),allW=rnd(1800,2600);return {q:`一籃橘子連同籃子一起秤重是 ${allW} 公克，已知空籃子重 ${basket} 公克，橘子淨重多少公克？`,a:`${allW} - ${basket} = ${allW-basket}（公克）`};}
    if(t===9){const wk=rnd(5,8),save=rnd(40,90);return {q:`${nm}想買一個 ${wk*save} 元的遙控玩具，如果每天存 ${save} 元，需要連續存幾天才能買到？`,a:`${wk*save} ÷ ${save} = ${wk}（天）`};}
    if(t===10){const rows=rnd(5,8),per=rnd(6,9),left=rnd(2,5);return {q:`禮堂排列椅子，每排擺 ${per} 張，一共排了 ${rows} 排，還有 ${left} 張備用椅未排入，禮堂共有幾張椅子？`,a:`${per} × ${rows} + ${left} = ${per*rows+left}（張）`};}
    if(t===11){const d1=rnd(1,3),m1=rnd(350,800),d2=rnd(1,2),m2=rnd(250,650);return {q:`登山步道分為兩段：前段長 ${d1} 公里 ${m1} 公尺，後段長 ${d2} 公里 ${m2} 公尺，整條步道總長幾公尺？`,a:`${(d1+d2)*1000+m1+m2}（公尺）`};}
    if(t===12){const den=pick([6,8,10]),a1=rnd(2,3),a2=rnd(1,2);return {q:`一塊蛋糕平分成 ${den} 份，姊姊吃掉 ${a1}/${den} 塊，弟弟吃掉 ${a2}/${den} 塊，還剩下幾分之幾塊蛋糕？`,a:`${den-a1-a2}/${den}（塊）`};}
    if(t===13){const base=rnd(30,80),cnt=rnd(4,7),disc=rnd(15,35);return {q:`每本漫畫書定價 ${base} 元，買了 ${cnt} 本並使用折價券扣掉 ${disc} 元，實際需付幾元？`,a:`${base} × ${cnt} - ${disc} = ${base*cnt-disc}（元）`};}
    const extraWord = [
      ()=>{const box=rnd(6,9),per=rnd(12,24),brk=rnd(5,12);return {q:`麵包店烘烤了 ${box} 盤餅乾，每盤有 ${per} 片，搬運時不小心碎掉了 ${brk} 片，完好的餅乾還剩幾片？`,a:`${box} × ${per} - ${brk} = ${box*per-brk}（片）`};},
      ()=>{const cup=rnd(220,380),cnt=rnd(3,5),jug=2000;return {q:`一個大水壺裝滿 ${jug} 毫公升麥茶，倒出 ${cnt} 杯各 ${cup} 毫公升後，水壺裡還剩幾毫公升？`,a:`${jug} - ${cup} × ${cnt} = ${jug-cup*cnt}（毫公升）`};},
      ()=>{const mon=rnd(35,65),tue=rnd(45,85);return {q:`學校圖書館星期一借出 ${mon} 本繪本，星期二借出 ${tue} 本，兩天共借出幾本？星期二比星期一多幾本？`,a:`共 ${mon+tue} 本；多 ${tue-mon} 本`};},
      ()=>{const side=rnd(7,14);return {q:`正方形花圃邊長為 ${side} 公尺，${nm}每天繞著花圃慢跑 5 圈，她一共跑了多少公尺？`,a:`${side} × 4 × 5 = ${side*20}（公尺）`};},
      ()=>{const p=rnd(18,36),m=rnd(4,7);return {q:`文具店舉辦促銷，${m} 枝原子筆賣 ${p*m} 元，平均每枝原子筆多少元？買 9 枝需要多少元？`,a:`每枝 ${p} 元；9 枝需 ${p*9} 元`};},
      ()=>{const w1=(rnd(15,28)/10),w2=(rnd(12,24)/10);return {q:`小狗體重 ${w1.toFixed(1)} 公斤，小貓比小狗輕 ${w2.toFixed(1)} 公斤，兩隻寵物合起來共重幾公斤？`,a:`${(w1 + (w1-w2)).toFixed(1)}（公斤）`};}
    ];
    return extraWord[(t - 14) % extraWord.length]();
  }

  // kind === 'match'
  const t = idx(12);
  if(t===0) return {q:'時間換算配對（連結相等的時間）',pairs:[['1 小時 10 分','70 分鐘'],['2 小時','120 分鐘'],['半小時','30 分鐘'],['1 分 20 秒','80 秒']]};
  if(t===1) return {q:'重量單位換算配對',pairs:[['1 公斤 500 克','1500 公克'],['3 公斤','3000 公克'],['2 公斤 50 克','2050 公克'],['半公斤','500 公克']]};
  if(t===2) return {q:'長度單位換算配對',pairs:[['2 公尺 30 公分','230 公分'],['4 公分 5 毫米','45 毫米'],['3 公里','3000 公尺'],['1 公尺','100 公分']]};
  if(t===3) return {q:'容量單位換算配對',pairs:[['1 公升 200 毫升','1200 毫公升'],['4 公升','4000 毫公升'],['半公升','500 毫公升'],['2 公升 50 毫升','2050 毫公升']]};
  if(t===4) return {q:'四則乘除算式得數配對',pairs:[['15 × 4','60'],['72 ÷ 8','9'],['25 × 8','200'],['96 ÷ 4','24']]};
  if(t===5) return {q:'日曆與時刻概念配對',pairs:[['大月天數','31 天'],['小月天數','30 天'],['平年 2 月','28 天'],['下午 4 時（24時制）','16 時']]};
  if(t===6) return {q:'平面圖形定義配對',pairs:[['正方形','4 條邊一樣長'],['直角','剛好 90 度'],['圓的直徑','半徑的 2 倍'],['三角形','共有 3 個頂點']]};
  if(t===7) return {q:'分數讀法與數值配對',pairs:[['一半（平分成兩份取1份）','1/2'],['平分成 4 份取 3 份','3/4'],['平分成 5 份取 2 份','2/5'],['5 個 1/6 合起來','5/6']]};
  if(t===8) return {q:'整百湊千與位值組合配對',pairs:[['650 ＋ 350','1000'],['4 個千 ＋ 5 個十','4050'],['900 ＋ 90 ＋ 9','999'],['30 個百','3000']]};
  if(t===9) return {q:'角度分類與度數配對',pairs:[['銳角範例','45 度'],['直角度數','90 度'],['鈍角範例','125 度'],['平角度數','180 度']]};
  if(t===10) return {q:'小數與單位分數等值配對',pairs:[['0.3','3 個 0.1'],['1.2','12 個 0.1'],['0.5','1/2（一半）'],['0.8 ＋ 0.2','1.0']]};
  return {q:'周長與正方形運算配對',pairs:[['邊長 5cm 正方形周長','20 公分'],['長 6cm 寬 4cm 周長','20 公分'],['邊長 8cm 正方形周長','32 公分'],['邊長 3cm 正三角形周長','9 公分']]};
}

// ===== 2. 動態國語字音/字形抽題 =====
let _zhRichRoll = 0;

function genChineseRichQuestion(grade, kind, diff='mid', vIdx=0, pool=[], lsName=''){
  const g = +grade;
  const tier = g<=2?'low':(g<=4?'mid':'high');
  const Z = window.PROC_BANK && window.PROC_BANK.zh && window.PROC_BANK.zh[tier];
  const idioms=[
    ['一心一意','專心一意，沒有雜念','三心二意'],['鳥語花香','形容春天景色美好','寸草不生'],
    ['守株待兔','比喻不知變通、妄想不勞而獲','腳踏實地'],['井底之蛙','比喻見識狹窄的人','見多識廣'],
    ['畫蛇添足','比喻做了多餘的事反而壞事','恰到好處'],['半途而廢','做事情沒有堅持到底','持之以恆'],
    ['雪中送炭','在別人急需時給予幫助','錦上添花'],['水落石出','比喻事情真相大白','撲朔迷離'],
    ['亡羊補牢','事後及時補救還不算太晚','未雨綢繆'],['胸有成竹','做事之前已經有完整的把握','驚慌失措'],
    ['掩耳盜鈴','比喻自己欺騙自己','實事求是'],['飲水思源','比喻不忘本、懂得感恩','忘恩負義'],
    ['狐假虎威','借著別人的威勢欺壓他人','自食其力'],['愚公移山','比喻有恆心毅力不怕困難','知難而退'],
    ['塞翁失馬','比喻一時的損失可能變成好處','禍不單行'],['一鳴驚人','平時默默無聞卻突然有驚人表現','默默無聞'],
    ['鐵杵磨針','比喻只要有恆心終能成功','虎頭蛇尾'],['破釜沉舟','下定決心不留退路','猶豫不決'],
    ['聞雞起舞','比喻及時奮發努力','苟且偷安'],['同心協力','大家團結一致共同努力','分道揚鑣'],
    ['名落孫山','比喻考試或選拔沒有錄取','金榜題名'],['津津有味','形容吃得很有味道或趣味濃厚','索然無味'],
    ['小心翼翼','形容舉動十分謹慎小心','粗心大意'],['恍然大悟','形容忽然完全明白過來','百思不解']
  ];
  const hasTW = pool && pool.length >= 4;
  const nq = s => String(s||'').replace(/「/g,'『').replace(/」/g,'』');
  const c1 = hasTW ? pool[vIdx % pool.length] : null;
  const c2 = hasTW ? pool[(vIdx + 1) % pool.length] : null;
  const c3 = hasTW ? pool[(vIdx + 2) % pool.length] : null;
  const ch = c1 ? c1[0] : '春', zy = c1 ? c1[2] : 'ㄔㄨㄣ', rad = (c1 && c1[3]) || '日', st = (c1 && c1[4]) || 9;
  const lsTag = lsName ? `（${lsName}）` : (c1 && c1.lesson ? `（${c1.lesson}）` : '');

  if(Z){
    if(kind === 'mc'){
      const slot = vIdx % 7;
      if(slot === 0 && Z.typos && Z.typos.length){
        const t = Z.typos[(vIdx + Math.floor(vIdx/7)) % Z.typos.length];
        const distChars = shuffle([...new Set(Z.typos.map(x=>x[3]).filter(x=>x!==t[2]&&x!==t[3]))]).slice(0,2);
        return {q:`檢查錯別字：「${t[1]}」這句話中，哪一個字寫錯了？`,opts:uniqueOpts(t[2],[t[3],...distChars]),a:t[2],exp:t[6],_zhTopic:'typo_'+t[5]};
      }
      if(slot === 1 && Z.synAnt && Z.synAnt.length){
        const sa = Z.synAnt[(vIdx + Math.floor(vIdx/7)) % Z.synAnt.length];
        const askAnt = (diff === 'hard' && vIdx % 2 === 1) || vIdx % 3 === 2;
        const target = askAnt ? sa[2] : sa[1];
        const otherWords = shuffle(Z.synAnt.filter(x=>x[0]!==sa[0]).map(x=>askAnt?x[2]:x[1])).slice(0,2);
        return {
          q: askAnt ? `語詞辨析：「${nq(sa[3])}」句中的「${sa[0]}」，下列哪一個是它的相反詞？` : `語詞替換：「${nq(sa[3])}」句中的「${sa[0]}」，可以替換成哪一個意思相近的詞語？`,
          opts: uniqueOpts(target, [askAnt?sa[1]:sa[2], ...otherWords]),
          a: target,
          exp: `「${sa[0]}」的相似詞是「${sa[1]}」，相反詞是「${sa[2]}」。`,
          _zhTopic: 'syn_'+sa[0]
        };
      }
      if(slot === 2 && Z.confuse && Z.confuse.length){
        const cf = Z.confuse[(vIdx + Math.floor(vIdx/7)) % Z.confuse.length];
        const ansParts = cf.a.split('；');
        const distOrders = [];
        const C = cf.choices;
        for(let k=0; k<32 && distOrders.length<3; k++){
          const cand = ansParts.map((_,bi)=>C[(bi*(k+1)+Math.floor(k/C.length)+1+k)%C.length]).join('；');
          if(cand !== cf.a && !distOrders.includes(cand)) distOrders.push(cand);
        }
        // 針對僅有 2 字選擇的 2 格題（如 在/再），確保補滿 3 個不同干擾組合
        if(distOrders.length<3 && ansParts.length===2){
          const extra = [`${C[1]}；${C[0]}`, `${C[0]}；${C[0]}`, `${C[1]}；${C[1]}`];
          extra.forEach(c=>{ if(distOrders.length<3 && c!==cf.a && !distOrders.includes(c)) distOrders.push(c); });
        }
        return {q:`選字填空：「${cf.q}」空格中依序最適合填入哪一組字？`,opts:uniqueOpts(cf.a,distOrders.slice(0,3)),a:cf.a,exp:cf.exp,_zhTopic:'confuse_'+C.join('')};
      }
      if(slot === 3 && Z.poly && Z.poly.length){
        const p = Z.poly[(vIdx + Math.floor(vIdx/7)) % Z.poly.length];
        const useSecond = (vIdx % 2 === 1);
        const sent = useSecond ? p.s2 : p.s1;
        const word = useSecond ? p.w2 : p.w1;
        const ansZy = useSecond ? p.zy2 : p.zy1;
        const altZy = useSecond ? p.zy1 : p.zy2;
        const otherZys = shuffle(Z.poly.filter(x=>x.ch!==p.ch).map(x=>x.zy1).filter(z=>z!==ansZy&&z!==altZy)).slice(0,2);
        return {
          q:`多音字判讀：「${sent}」句中「${word}」的「${p.ch}」字，正確讀音是什麼？`,
          opts:uniqueOpts(ansZy,[altZy,...otherZys]),
          a:ansZy,
          exp:`「${p.w1}」讀作 ${p.zy1}；「${p.w2}」讀作 ${p.zy2}。`,
          _zhTopic:'poly_'+p.ch
        };
      }
      if(slot === 4 && Z.puncMc && Z.puncMc.length){
        const pm = Z.puncMc[(vIdx + Math.floor(vIdx/7)) % Z.puncMc.length];
        return {...pm, opts:pm.opts.slice(), _zhTopic:'punc_'+pm.q.slice(0,10)};
      }
      if(slot === 5 && Z.typos && Z.typos.length){
        const t = Z.typos[(vIdx + 5 + Math.floor(vIdx/7)) % Z.typos.length];
        const distW = shuffle(Z.typos.filter(x=>x[5]!==t[5]).map(x=>x[5])).slice(0,2);
        return {q:`詞語改錯：「${t[1]}」裡的「${t[4]}」寫錯了，應該改成哪一個詞語？`,opts:uniqueOpts(t[5],[t[4],...distW]),a:t[5],exp:t[6],_zhTopic:'typo_'+t[5]};
      }
      // slot === 6: 課本 TW 生字應用或高年級成語情境
      if(hasTW && (vIdx % 2 === 0 || +g <= 2)){
        const others = shuffle(pool.filter(x=>x[0]!==ch&&x[2]!==zy)).slice(0,3).map(x=>x[2]);
        if(vIdx % 4 === 0 && rad){
          const sameRad = pool.find(x=>x[0]!==ch&&x[3]===rad);
          const diffRads = shuffle(pool.filter(x=>x[0]!==ch&&x[3]!==rad)).slice(0,3).map(x=>x[0]);
          if(sameRad && diffRads.length>=3){
            return {q:`${lsTag}下列哪一個國字和「${ch}」屬於相同部首（${rad}部）？`,opts:uniqueOpts(sameRad[0],diffRads),a:sameRad[0],exp:`「${ch}」與「${sameRad[0]}」皆屬${rad}部。`};
          }
        }
        return {q:`${lsTag}課文重點字「${ch}」的正確讀音是哪一個？`,opts:uniqueOpts(zy,others.length>=3?others:['ㄅㄚ','ㄇㄚ','ㄉㄚ']),a:zy,exp:`「${ch}」讀作 ${zy}，屬${rad}部。`};
      }
      const idm = idioms[(vIdx + randSeed) % idioms.length];
      const dist = shuffle(idioms.filter(x=>x[0]!==idm[0])).slice(0,3).map(x=>x[0]);
      return {q:`成語情境應用：如果要形容「${idm[1]}」，最適合使用下列哪一個成語？`,opts:uniqueOpts(idm[0],dist),a:idm[0],exp:`「${idm[0]}」指${idm[1]}。`,_zhTopic:'idm_'+idm[0]};
    }

    if(kind === 'tf'){
      const slot = vIdx % 5;
      const isTrue = ((vIdx + randSeed) % 2 === 0);
      if(slot === 0 && Z.typos && Z.typos.length){
        const t = Z.typos[(vIdx + Math.floor(vIdx/5)) % Z.typos.length];
        return {
          q:`用字檢核：「${isTrue ? t[0] : t[1]}」這句話裡面完全沒有錯別字。`,
          a:isTrue?'○':'✕',
          exp:isTrue?`用字皆正確（「${t[5]}」無誤）。`:t[6],
          _zhTopic:'typo_'+t[5]
        };
      }
      if(slot === 1 && Z.synAnt && Z.synAnt.length){
        const sa = Z.synAnt[(vIdx + Math.floor(vIdx/5)) % Z.synAnt.length];
        const askSyn = (vIdx % 2 === 0);
        const shown = isTrue ? (askSyn ? sa[1] : sa[2]) : (askSyn ? sa[2] : sa[1]);
        return {
          q:`詞義判斷：在「${nq(sa[3])}」裡，「${sa[0]}」和「${shown}」是一組意思${askSyn?'相近':'相反'}的詞語。`,
          a:isTrue?'○':'✕',
          exp:`「${sa[0]}」的相似詞是「${sa[1]}」，相反詞是「${sa[2]}」。`,
          _zhTopic:'syn_'+sa[0]
        };
      }
      if(slot === 2 && Z.poly && Z.poly.length){
        const p = Z.poly[(vIdx + Math.floor(vIdx/5)) % Z.poly.length];
        const claimSame = !isTrue;
        return {
          q:`多音字辨析：「${p.w1}（${p.s1}）」與「${p.w2}（${p.s2}）」中的「${p.ch}」，兩者讀音${claimSame?'完全相同':'不相同'}。`,
          a:isTrue?'○':'✕',
          exp:`「${p.w1}」讀作 ${p.zy1}，「${p.w2}」讀作 ${p.zy2}，讀音不同。`,
          _zhTopic:'poly_'+p.ch
        };
      }
      if(slot === 3 && Z.puncMc && Z.puncMc.length){
        const idm = idioms[(vIdx + randSeed) % idioms.length];
        const fakeMeaning = isTrue ? idm[1] : idioms[(vIdx + randSeed + 3) % idioms.length][1];
        return {
          q:`成語判別：成語「${idm[0]}」的意思是指「${fakeMeaning}」。`,
          a:isTrue?'○':'✕',
          exp:`「${idm[0]}」正確意思為：${idm[1]}。`,
          _zhTopic:'idm_'+idm[0]
        };
      }
      if(hasTW){
        const fakeZy = isTrue ? zy : (c2 && c2[2] !== zy ? c2[2] : 'ㄅㄚ');
        return {q:`${lsTag}課文生字「${ch}」的正確讀音是「${fakeZy}」。`,a:isTrue?'○':'✕',exp:`「${ch}」正確讀音為 ${zy}。`};
      }
    }

    if(kind === 'fill'){
      const slot = vIdx % 5;
      if(slot === 0 && Z.ctxWrite && Z.ctxWrite.length){
        const cw = Z.ctxWrite[(vIdx + Math.floor(vIdx/5)) % Z.ctxWrite.length];
        return {q:cw.q, a:cw.a, _zhTopic:'ctx_'+cw.q.slice(6,16)};
      }
      if(slot === 1 && Z.confuse && Z.confuse.length){
        const cf = Z.confuse[(vIdx + Math.floor(vIdx/5)) % Z.confuse.length];
        return {q:`圈選正確用字（${cf.choices.join('、')}）：${cf.q}`, a:cf.a, exp:cf.exp, _zhTopic:'confuse_'+cf.choices.join('')};
      }
      if(slot === 2 && Z.typos && Z.typos.length){
        const t = Z.typos[(vIdx + Math.floor(vIdx/5)) % Z.typos.length];
        return {q:`先找錯字再改正：「${t[1]}」這句中的（　）是錯別字，應該改寫為（　）字。`, a:`${t[2]}；${t[3]}`, exp:t[6], _zhTopic:'typo_'+t[5]};
      }
      if(slot === 3){
        if(vIdx % 2 === 0 && Z.synAnt && Z.synAnt.length){
          const sa = Z.synAnt[(vIdx + Math.floor(vIdx/5)) % Z.synAnt.length];
          return {q:`語詞替換：「${nq(sa[3])}」中的「${sa[0]}」，相似詞是（　　），相反詞是（　　）。`, a:`${sa[1]}；${sa[2]}`, _zhTopic:'syn_'+sa[0]};
        }
        if(Z.poly && Z.poly.length){
          const p = Z.poly[(vIdx + Math.floor(vIdx/5)) % Z.poly.length];
          return {q:`多音字辨音：「${nq(p.s1)}」的「${p.ch}」讀作（　　）；「${nq(p.s2)}」的「${p.ch}」讀作（　　）。`, a:`${p.zy1}；${p.zy2}`, _zhTopic:'poly_'+p.ch};
        }
      }
      if(hasTW){
        return {q:`${lsTag}寫出部首並造詞：國字「${ch}」屬於（　）部，可以造一個語詞（　　　）。`, a:`${rad}部；例：依「${ch}」字義造詞`};
      }
    }

    if(kind === 'match'){
      const slot = vIdx % 4;
      if(slot === 0 && Z.synAnt && Z.synAnt.length >= 4){
        const pick4 = [], seenR = new Set();
        for(let i=0; i<Z.synAnt.length && pick4.length<4; i++){
          const sa = Z.synAnt[(vIdx*3 + i) % Z.synAnt.length];
          if(!seenR.has(sa[1])){ seenR.add(sa[1]); pick4.push([sa[0], sa[1]]); }
        }
        if(pick4.length===4) return {q:`相似詞連連看（將「${pick4[0][0]}」等四組意思相近的詞語配對）`, pairs:pick4, arch:'zh_match_syn'};
      }
      if(slot === 1 && Z.synAnt && Z.synAnt.length >= 4){
        const pick4 = [], seenR = new Set();
        for(let i=0; i<Z.synAnt.length && pick4.length<4; i++){
          const sa = Z.synAnt[(vIdx*5 + i) % Z.synAnt.length];
          if(!seenR.has(sa[2])){ seenR.add(sa[2]); pick4.push([sa[0], sa[2]]); }
        }
        if(pick4.length===4) return {q:`相反詞連連看（將「${pick4[0][0]}」等四組意思相反的詞語配對）`, pairs:pick4, arch:'zh_match_ant'};
      }
      if(slot === 2 && Z.poly && Z.poly.length >= 4){
        const pick4 = [], seenR = new Set();
        for(let i=0; i<Z.poly.length && pick4.length<4; i++){
          const p = Z.poly[(vIdx*2 + i) % Z.poly.length];
          const use2 = (i % 2 === 1);
          const lbl = `「${use2?p.w2:p.w1}」的「${p.ch}」`, ans = use2?p.zy2:p.zy1;
          if(!seenR.has(ans)){ seenR.add(ans); pick4.push([lbl, ans]); }
        }
        if(pick4.length===4) return {q:`多音字讀音配對（依「${pick4[0][0]}」等詞語選出正確注音）`, pairs:pick4, arch:'zh_match_poly'};
      }
      const idm4 = [];
      for(let i=0; i<4; i++) idm4.push(idioms[(vIdx*3 + i) % idioms.length]);
      return {q:`成語與意義配對（將「${idm4[0][0]}」等四個成語連到正確解釋）`, pairs:idm4.map(x=>[x[0], x[1]]), arch:'zh_match_idm'};
    }

    if(kind === 'calc'){
      const slot = vIdx % 4;
      if(slot === 0 && Z.typos && Z.typos.length){
        const t = Z.typos[(vIdx + Math.floor(vIdx/4)) % Z.typos.length];
        return {q:`改錯字並造句：「${nq(t[1])}」這句話裡面有一個錯別字，請先圈出錯字並寫出正確寫法，再用改正後的詞語造一個完整的句子。`, a:`錯字「${t[2]}」改為「${t[3]}」（${t[5]}）；造句依詞義作答。`, _zhTopic:'typo_'+t[5]};
      }
      if(slot === 1 && Z.calcTasks && Z.calcTasks.length){
        const ct = Z.calcTasks[(vIdx + Math.floor(vIdx/4)) % Z.calcTasks.length];
        return {...ct, _zhTopic:'calc_'+ct.q.slice(0,12)};
      }
      if(slot === 2 && Z.synAnt && Z.synAnt.length){
        const sa = Z.synAnt[(vIdx + Math.floor(vIdx/4)) % Z.synAnt.length];
        return {q:`詞語替換造句：請先寫出「${sa[0]}」的一個相似詞與相反詞，再運用「${sa[1]}」寫出一個新句子。`, a:`相似詞：${sa[1]}；相反詞：${sa[2]}；造句依詞義作答。`, _zhTopic:'syn_'+sa[0]};
      }
      if(hasTW){
        return {q:`${lsTag}寫出部首並造詞：請寫出「${ch}」的部首、造一個語詞，並用這個語詞寫出一句完整通順的話。`, a:`${rad}部；依「${ch}」造詞並造句。`};
      }
    }

    if(kind === 'word'){
      const rPool = Z.reading || [];
      const ctxCount = (Z.ctxWrite && Z.ctxWrite.length) || 0;
      const secTotal = ctxCount + idioms.length;
      if(rPool.length && vIdx % 3 !== 2){
        const rIdx = (vIdx + Math.floor(vIdx / 3)) % rPool.length;
        return {...rPool[rIdx], _zhTopic:'read_'+rIdx};
      }
      const k = Math.floor(vIdx / 3) % Math.max(1, secTotal);
      if(Z.ctxWrite && k < ctxCount){
        const cw = Z.ctxWrite[k];
        const cleanStory = cw.q.replace(/^看注音寫國字：/, '').replace(/[˙]?[ㄅ-ㄩ]{1,3}[ˊˇˋ]?（　）/g, '').replace(/[（(]\s*[）)]/g, '');
        const blanksAns = cw.a.split('；').join('');
        const restored = cw.q.replace(/^看注音寫國字：/, '');
        return {
          q:`【短文情境閱讀】請讀這段文字：\n「${restored}」\n問題：(1) 請將文中的注音寫成正確國字。(2) 這段文字主要描寫什麼事情或情境？`,
          a:`(1) ${cw.a}（完整詞語：${blanksAns}）。 (2) ${cleanStory.slice(0,22)}…等生活／故事情境。`,
          _zhTopic:'ctxread_'+k
        };
      }
      const idmIdx = (k - ctxCount) % idioms.length;
      const idm = idioms[idmIdx];
      return {
        q:`【成語情境閱讀與應用】\n老師在閱讀課堂上舉例說明成語「${idm[0]}」，指出它的意思是指「${idm[1]}」。\n問題：(1) 與「${idm[0]}」意思相反的詞語是什麼？ (2) 請簡短寫出在什麼樣的情境下適合使用「${idm[0]}」？`,
        a:`(1) ${idm[2]}。 (2) 當想形容「${idm[1]}」的情況時適用。`,
        _zhTopic:'idmread_'+idm[0]
      };
    }
  }

  // Fallback（若無 PROC_BANK.zh 時維持基本安全保底）
  if(!hasTW) return null;
  if(kind==='mc'){
    const others=shuffle(pool.filter(x=>x[0]!==ch&&x[2]!==zy)).slice(0,3).map(x=>x[2]);
    return {q:`${lsTag}「${ch}」的正確讀音是哪一個？`,opts:uniqueOpts(zy,others.length>=3?others:['ㄅㄚ','ㄇㄚ','ㄉㄚ']),a:zy,exp:`「${ch}」讀作 ${zy}，${rad}部。`};
  }
  if(kind==='tf'){
    const isTrue=Math.random()<0.5, wrong=c2?c2[2]:'ㄅㄚ', shown=isTrue?zy:wrong;
    return {q:`${lsTag}國字「${ch}」的讀音是「${shown}」。`,a:isTrue?'○':'✕',exp:`正確讀音為 ${zy}。`};
  }
  if(kind==='fill') return {q:`${lsTag}寫出部首並造詞：國字「${ch}」是（　）部，語詞可寫作（　　　）。`,a:`${rad}部；依「${ch}」造詞`};
  if(kind==='match'){
    const idm4=shuffle(idioms).slice(0,4);
    return {q:`${lsTag}成語與意義連連看`,pairs:idm4.map(x=>[x[0],x[1]])};
  }
  if(kind==='calc') return {q:`${lsTag}造詞與造句練習：請用「${ch}」造一個語詞，再寫出一個完整的句子。`,a:`例：使用「${ch}」造詞並完成通順句子。`};
  return {q:`【${lsName||'生活'}短文寫作】請用「${ch}」和「${c2?c2[0]:'好'}」寫出兩句通順的話並加上標點符號。`,a:`包含「${ch}」且標點正確之兩句短文。`};
}

const _TW_GRADE_POOL_CACHE = new Map();
function getTwGradeChars(grade, allowedUnits){
  if(!window.TW) return [];
  const gk = String(+grade);
  let allEntries = _TW_GRADE_POOL_CACHE.get(gk);
  if(!allEntries){
    allEntries = [];
    Object.values(TW).forEach(pubObj=>{
      Object.values(pubObj).forEach(arr=>{
        arr.filter(ls=>ls.g==+grade).forEach(ls=>{
          ls.c.forEach(c=>{ if(c[0]&&c[2]) allEntries.push({...c, lesson: ls.t}); });
        });
      });
    });
    _TW_GRADE_POOL_CACHE.set(gk, allEntries);
  }
  if(!allowedUnits || !allowedUnits.length) return allEntries;
  const allowSet = new Set(allowedUnits);
  return allEntries.filter(e=>allowSet.has(e.lesson));
}

function genChineseDynamic(grade, kind, diff='mid', allowedUnits=null, strictUnit=false){
  if(!window.TW||!window.ZY_DATA)return null;
  let pool = getTwGradeChars(grade, allowedUnits);
  if(!strictUnit && pool.length<4){
    pool = getTwGradeChars(grade, null);
  }
  const vIdx = (_zhRichRoll++) + randSeed;
  return genChineseRichQuestion(grade, kind, diff, vIdx, pool, '');
}


function genEngProc(grade, kind, diff='mid', uIdxs=null, isUnitSubset=false){
  const PB=window.PROC_BANK&&PROC_BANK.eng; if(!PB)return null;
  const g=+grade, fullV=PB.vocab[g]||PB.vocab[3];
  const half=Math.ceil(fullV.length/2);
  let vPool = fullV;
  if(isUnitSubset && Array.isArray(uIdxs) && uIdxs.length){
    const sub=[];
    if(uIdxs.includes(0)) sub.push(...fullV.slice(0,half));
    if(uIdxs.some(x=>x>=1)) sub.push(...fullV.slice(half));
    if(sub.length>=4) vPool=sub;
  }
  const allV=[...fullV,...(PB.vocab[Math.max(1,g-1)]||[])];
  if(kind==='mc'){
    const sPoolAll = PB.sentences[g] || [];
    const sUnit = (isUnitSubset && Array.isArray(uIdxs) && uIdxs.length)
      ? sPoolAll.filter(s=>matchesUnitTopics(s,'英語',g,'上',uIdxs,99) || matchesUnitTopics(s,'英語',g,'下',uIdxs,99))
      : sPoolAll;
    const sMatched = sUnit.filter(s=>!s.diff||s.diff===diff);
    const sPool = sMatched.length ? sMatched : sUnit;
    if(Math.random()<0.5&&sPool.length){
      const st=pick(sPool);if(st.opts)return {q:st.q,opts:shuffle(st.opts),a:st.a};
    }
    const [en,zh]=pick(vPool);
    const others=shuffle(allV.filter(x=>x[0]!==en&&x[1]!==zh)).slice(0,3);
    return Math.random()<0.5
      ? {q:`英文單字 "${en}" 的中文意思是什麼？`,opts:uniqueOpts(zh,others.map(x=>x[1])),a:zh,exp:`${en} ＝ ${zh}`}
      : {q:`「${zh}」的英文單字是哪一個？`,opts:uniqueOpts(en,others.map(x=>x[0])),a:en,exp:`${zh} ＝ ${en}`};
  }
  if(kind==='tf'){
    const [en,zh]=pick(vPool), isTrue=Math.random()<0.5;
    const shown=isTrue?zh:pick(allV.filter(x=>x[1]!==zh))[1];
    return {q:`英文 "${en}" 的中文意思是「${shown}」。`,a:isTrue?'○':'✕',exp:`${en} ＝ ${zh}`};
  }
  if(kind==='fill'){
    const [en,zh]=pick(vPool);
    const masked=en.length>2?en[0]+' _ '.repeat(en.length-2)+en[en.length-1]:en;
    return {q:`依中文提示拼出英文單字：「${zh}」→ ${masked}（　　　）`,a:en};
  }
  if(kind==='match'){
    return {q:'英文單字中英配對（將對應的代號填入括號中）',pairs:shuffle(vPool).slice(0,4)};
  }
  if(kind==='calc'){
    const [en,zh]=pick(vPool);
    return {q:`英文句型寫作：請用單字 "${en}"（${zh}）寫出一個完整英文句子並附上中文翻譯。`,a:`例：使用 ${en} 之正確英文短句與中文翻譯。`};
  }
  if(kind==='word'){
    const [en1,zh1]=pick(vPool), [en2,zh2]=pick(vPool.filter(x=>x[0]!==en1));
    return {q:`【英語情境對話閱讀】\nTom: "Look! Do you like ${en1}?"\nAmy: "Yes, I do! And I want ${en2}, too."\n問題：(1) Does Amy like ${en1}?  (2) 請寫出「${zh2}」的英文單字。`,a:`(1) Yes, she does.  (2) ${en2}`};
  }
  return null;
}

function genFactProc(subj, grade, kind, diff='mid', sem='上', uIdxs=null, isUnitSubset=false){
  const PB=window.PROC_BANK; if(!PB)return null;
  const g=+grade, tier=g<=2?'low':(g<=4?'mid':'high');
  const node=subj==='生活'?PB.life:(subj==='自然科學'?PB.sci[tier]:PB.soc[tier]);
  if(!node)return null;
  const filterUnit = (arr, toItem) => {
    if(!isUnitSubset || !Array.isArray(uIdxs) || !uIdxs.length) return arr;
    return arr.filter(x=>matchesUnitTopics(toItem(x), subj, g, sem, uIdxs, 99));
  };
  if(kind==='tf'&&node.facts.length){
    const unitPool = filterUnit(node.facts, f=>f);
    if(!unitPool.length) return null;
    const matched = unitPool.filter(f=>!f.diff||f.diff===diff);
    const f=pick(matched.length?matched:unitPool);
    return {q:f.q,a:f.ok?'○':'✕',exp:f.exp||''};
  }
  if(kind==='match'&&node.pairs.length>=4){
    const unitPairs = filterUnit(node.pairs, pr=>({q:pr[0],a:pr[1]}));
    if(unitPairs.length<4) return null;
    return {q:`${subj}概念配對（將對應的代號填入括號中）`,pairs:shuffle(unitPairs).slice(0,4)};
  }
  if(kind==='fill'&&node.pairs&&node.pairs.length){
    const unitPairs = filterUnit(node.pairs, pr=>({q:pr[0],a:pr[1]}));
    if(!unitPairs.length) return null;
    const pr=pick(unitPairs);
    return {q:`觀念填空：在${subj}課中，「${pr[0]}」對應的核心概念或特徵是（　　　　　）。`,a:pr[1]};
  }
  if(kind==='mc'&&node.cats.length){
    const unitCats = filterUnit(node.cats, c=>({q:`${c.title} ${c.aName} ${c.bName} ${c.a.join(' ')} ${c.b.join(' ')}`}));
    if(!unitCats.length) return null;
    const cat=pick(unitCats), pickA=Math.random()<0.5;
    const ans=pick(pickA?cat.a:cat.b), dist=shuffle(pickA?cat.b:cat.a).slice(0,3);
    if(dist.length>=3) return {q:`下列哪一項屬於「${pickA?cat.aName:cat.bName}」？`,opts:uniqueOpts(ans,dist),a:ans,exp:`${ans} 屬於${pickA?cat.aName:cat.bName}。`};
  }
  if(kind==='calc'&&node.cats.length){
    const unitCats = filterUnit(node.cats, c=>({q:`${c.title} ${c.aName} ${c.bName} ${c.a.join(' ')} ${c.b.join(' ')}`}));
    if(!unitCats.length) return null;
    const cat=pick(unitCats), items=shuffle([...cat.a.slice(0,2),...cat.b.slice(0,2)]);
    return {q:`分類練習（${cat.title}）：請將「${items.join('、')}」分別歸類：\n${cat.aName}：（　　　　）\n${cat.bName}：（　　　　）`,
      a:`${cat.aName}：${items.filter(x=>cat.a.includes(x)).join('、')}；${cat.bName}：${items.filter(x=>cat.b.includes(x)).join('、')}`};
  }
  if(kind==='word'&&node.cats.length){
    const unitCats = filterUnit(node.cats, c=>({q:`${c.title} ${c.aName} ${c.bName} ${c.a.join(' ')} ${c.b.join(' ')}`}));
    if(!unitCats.length) return null;
    const cat=pick(unitCats);
    return {q:`【${subj}素養探究題】課堂上討論了「${cat.title}」，同學舉出了「${cat.a[0]}」和「${cat.b[0]}」兩個例子。\n問題：(1) 請說明這兩個例子為什麼不同類？ (2) 請再補充一個屬於「${cat.aName}」的生活實例。`,a:`(1) 「${cat.a[0]}」屬於${cat.aName}，而「${cat.b[0]}」屬於${cat.bName}。(2) 如：${cat.a[1]||cat.a[0]}。`};
  }
  return null;
}

// ===== 3. 概念主題辨識、跨題型防重與「由簡入深」難度排序引擎 =====
const TOPIC_RULES = [
  // 自然與生活核心概念
  ['磁鐵特性', /磁鐵|磁極|同極|異極|吸引迴紋針|小鐵夾/],
  ['太陽與影子', /影子|太陽位置|竿影|日晷|背光面/],
  ['月相與潮汐', /月亮|月相|眉月|滿月|上弦|下弦|農曆十五|賞月/],
  ['昆蟲與動物特徵', /昆蟲|六隻腳|6隻腳|蜘蛛|瓢蟲|完全變態|不完全變態/],
  ['電路與導電', /電路|燈泡|通路|斷路|串聯|並聯|導體|絕緣體|電磁鐵/],
  ['聲音與振動', /拍打.*水|聲音高低|音量|振動|分貝|敲擊/],
  ['水與毛細虹吸', /毛細現象|虹吸現象|連通管/],
  ['水的三態與循環', /蒸發|凝結|凝固|融化|水循環|水蒸氣|冰杯外壁/],
  ['空氣與燃燒生鏽', /空氣佔|氧氣|二氧化碳|助燃|石灰水|滅火|鐵生鏽/],
  ['酸鹼與水溶液', /石蕊試紙|酸性|鹼性|小蘇打|白醋|檸檬汁|溶解速度/],
  ['光的反射與折射', /光的反射|光的折射|三稜鏡|色散|鏡子|筷子.*折斷/],
  ['熱的傳播', /熱傳導|熱對流|熱輻射|冷氣.*上方/],
  ['槓桿與滑輪機械', /槓桿|支點|施力臂|抗力臂|定滑輪|動滑輪/],
  ['植物構造與光合', /光合作用|蒸散作用|葉脈|平行脈|網狀脈|水生植物|布袋蓮/],
  ['種子發芽與生長', /發芽|關在全黑|植物.*陽光/],
  ['岩石地層與河流', /火成岩|沉積岩|變質岩|凹岸|凸岸|侵蝕|堆積|化石|地震/],
  ['天氣與鋒面', /氣團|滯留鋒|梅雨|颱風|百葉箱/],
  ['生態系與食物鏈', /生產者|消費者|分解者|食物鏈/],
  ['再生與非再生能源', /再生能源|太陽能|煤炭|石油/],
  ['傳統節慶習俗', /端午節|元宵節|春節|清明節|包粽子|提燈籠/],
  ['交通安全與紅綠燈', /紅綠燈|紅燈|綠燈|斑馬線|過馬路/],
  ['校園安全與急救', /跌倒受傷|保健室|火警|走廊奔跑|避難包/],
  ['資源回收與環保', /資源回收|可回收|空飲料罐|寶特瓶|隨手關燈|節約能源|關水/],
  // 社會核心概念
  ['地圖要素與方位', /圖例|比例尺|方向標|方位|北\(N\)/],
  ['台灣地形與山脈', /五大.*地形|中央山脈|盆地|台地|平原|丘陵/],
  ['早期水圳與開墾', /瑠公圳|八堡圳|嘉南大圳|八田與一/],
  ['荷西與明鄭歷史', /荷蘭|西班牙|熱蘭遮城|鄭成功/],
  ['清領開港與建設', /茶葉.*樟腦|劉銘傳|巡撫/],
  ['原住民族與多元文化', /原住民族|南島語族|16\s*族|新住民/],
  ['中央五院與憲政', /行政院|立法院|司法院|考試院|監察院|五權分立/],
  ['地方自治與議會', /縣（市）議會|縣（市）政府|村（里）長|代表會/],
  ['人民權利與義務', /基本權利|基本義務|納稅|服兵役|選舉權/],
  ['消費保障與理財', /統一發票|1950|消費者保護|需要.*想要/],
  ['國際組織與永續', /SDGs|永續發展|WHO|聯合國|半導體/],
  // 數學核心概念
  ['三角形面積', /三角形.*面積/],
  ['三角形內角和', /三角形.*內角|三角形.*角.*°/],
  ['三角形分類性質', /正三角形|等腰三角形|直角三角形/],
  ['平行四邊形面積', /平行四邊形.*面積/],
  ['梯形面積', /梯形.*面積/],
  ['複合圖形面積', /L\s*形|複合圖形/],
  ['正方形周長', /正方形.*周長/],
  ['正方形面積', /正方形.*面積/],
  ['長方形周長', /長方形.*周長/],
  ['長方形面積', /長方形.*面積/],
  ['正方體體積', /正方體.*體積/],
  ['正方體表面積', /正方體.*表面積/],
  ['正方體頂點邊面', /正方體.*個面.*頂點/],
  ['長方體體積與容積', /長方體.*體積|水箱內部尺寸/],
  ['圓半徑與直徑', /半徑.*直徑|直徑.*半徑/],
  ['圓周長計算', /圓周長/],
  ['圓面積計算', /圓的面積|圓.*面積大約/],
  ['扇形與圓心角', /扇形|圓心角/],
  ['圓柱體積與展開', /圓柱/],
  ['角柱與圓錐性質', /角柱|圓錐/],
  ['線對稱圖形', /對稱軸|線對稱/],
  ['角度與銳鈍直角', /銳角|鈍角|幾個「直角」|平角/],
  ['直線與曲線辨識', /直線.*曲線/],
  ['平面圖形計數', /機器人圖形|小屋圖形/],
  ['鐘面時間判讀', /鐘面|時鐘.*幾點/],
  ['24時制與經過時間', /24\s*時制|開演.*片長/],
  ['年月與閏年', /閏年|年.*個月/],
  ['錢幣計數與找錢', /硬幣|找回.*元/],
  ['直尺測量與比較', /直尺|鉛筆最長/],
  ['長度單位換算', /公尺.*公分|公里.*公尺|公分.*毫米/],
  ['量杯與容量換算', /公升.*毫公升|量杯/],
  ['重量單位換算', /公斤.*公克|公噸.*公斤/],
  ['面積單位換算', /平方公尺.*平方公分|公頃.*公畝/],
  ['長條圖判讀', /長條圖/],
  ['折線圖判讀', /折線圖/],
  ['圓形圖判讀', /圓形圖/],
  ['速率時間與距離', /時速|速率|每秒.*公尺/],
  ['比與比值應用', /最簡單整數比|比值|相等的比|按.*：.*分給|兩數的比/],
  ['正比關係判讀', /成正比/],
  ['質數與質因數分解', /質數|質因數分解/],
  ['公因數與公倍數', /最大公因數|最小公倍數|平分裝袋/],
  ['因數與倍數判別', /最小因數|2\s*和\s*3\s*的倍數/],
  ['百分率與打折加成', /百分率|打.*折|進球率|加計.*%/],
  ['四捨五入與概數', /四捨五入/],
  ['十位個位與定位板', /十位.*個位|個十.*個一/],
  ['百位位值與數列', /個百.*個一|一百一數/],
  ['大數一億位值', /一億|一千萬/],
  ['排隊順序問題', /排隊|算起第.*個/],
  ['數字分與合', /分合表|翅膀上的兩個數/],
  ['骰子點數合', /骰子/],
  ['積木數量合', /積木合起來/],
  ['點陣與乘法交換', /圓點.*排|一樣大.*×|倍.*多幾個/],
  ['除法餘數性質', /餘數.*最大|餘數有可能/],
  ['真假帶分數互換', /假分數|帶分數/],
  ['等值分數與擴分', /等值分數|分子和分母同乘/],
  ['分數意義與讀法', /平分成.*片|讀作.*分之/],
  // 國語核心概念
  ['修辭_譬喻', /譬喻/],
  ['修辭_擬人', /擬人/],
  ['修辭_誇飾', /誇飾/],
  ['修辭_排比', /排比/],
  ['修辭_設問', /設問/],
  ['標點_問號', /問號/],
  ['標點_驚嘆號', /驚嘆號/],
  ['標點_引號冒號', /引號|冒號/],
  ['標點_刪節號', /刪節號/],
  ['標點_書名號', /書名號/],
  ['關聯_轉折', /雖然.*但是|儘管.*還是/],
  ['關聯_因果', /因為.*所以|既然.*就/],
  ['關聯_遞進', /不但.*而且/],
  ['關聯_假設', /如果.*就|要是.*就/],
  ['關聯_條件', /只要.*就|無論.*都/],
  ['關聯_取捨', /與其.*不如|寧可.*也不/],
  ['同音_再在', /再\/在|「再」和「在」/],
  ['同音_做坐', /做\/坐|「做」和「坐」/],
  ['同音_像向', /像\/向/],
  ['同音_進近', /進\/近/],
  ['同音_園圓', /園\/圓/],
  ['同音_須需', /須\/需/],
  ['同音_辨辯', /辨\/辯/],
  ['量詞搭配', /量詞/]
];

function inferTopicKeys(item, subj){
  const keys=[];
  const full=String(item.q||'')+' '+String(item.a||'')+' '+String(item.exp||'')+' '+(item.opts?item.opts.join(' '):'');
  for(const [name,re] of TOPIC_RULES){
    if(re.test(full)) keys.push(name);
  }
  if(subj==='國語'){
    // 擷取題目鎖定之目標單字、成語或專屬題組標籤，確保同一目標絕不在整份考卷重複出現
    if(item._zhTopic) keys.push('zh_item_' + item._zhTopic);
    const qm=[...String(item.q||'').matchAll(/「([^」]{1,4})」/g)].map(m=>m[1]);
    qm.forEach(w=>{if(w.length===1||w.length===4)keys.push('zh_target_'+w);});
  }
  if(subj==='英語'){
    const em=[...String(item.q||'').matchAll(/"([A-Za-z\s']+)"/g)].map(m=>m[1].trim().toLowerCase());
    em.forEach(w=>{if(w&&w.length<=15)keys.push('en_target_'+w);});
    if(/what time|o'clock/i.test(full)) keys.push('en_time');
    if(/how much|dollar/i.test(full)) keys.push('en_price');
    if(/weather|sunny|rainy|cloudy|windy/i.test(full)) keys.push('en_weather');
    if(/under|in the|on the|next to/i.test(full)) keys.push('en_prep');
    if(/how old/i.test(full)) keys.push('en_age');
    if(/yesterday|went|ate|saw|did/i.test(full)) keys.push('en_past');
    if(/bigger|taller|faster|than/i.test(full)) keys.push('en_comp');
  }
  if(item.pairs){
    item.pairs.forEach(pr=>{
      const pTxt=pr[0]+' '+pr[1];
      for(const [name,re] of TOPIC_RULES){
        if(re.test(pTxt)) keys.push(name);
      }
    });
  }
  if(!keys.length) keys.push('raw_'+String(item.q||'').slice(0,18));
  return [...new Set(keys)];
}

// 嚴格辨識「題型／結構原型鍵」(Hard Archetype Key)：同一張考卷中同一個題型原型（例如時鐘、定位板、數列火車、分合樹、積木加等）絕不重複！
function inferSvgArchetype(svg){
  if(!svg) return null;
  const s = String(svg);
  if(s.includes('r="35"') && s.includes('stroke-linecap="round"')) return 'svg_clock';
  if(s.includes('十位') && s.includes('個位')) return 'svg_abacus';
  if(s.includes('viewBox="0 0 110 54"')) return 'svg_split_box';
  if(s.includes('stroke="#f59e0b"') || s.includes('cx="80" cy="40"') || s.includes('翅膀')) return 'svg_butterfly';
  if(s.includes('height="30"') && s.includes('width="34"')) return 'svg_seq_train';
  if(s.includes('左邊') && s.includes('右邊') && s.includes('<circle')) return 'svg_row_queue';
  if(s.includes('r="2.2"') || (s.includes('rx="6"') && s.includes('width="84"'))) return 'svg_dice_pair';
  if(s.includes('#66bb6a') && s.includes('#42a5f5')) return 'svg_block_add';
  if(s.includes('50元') || s.includes('10元') || s.includes('5元') || s.includes('1元')) return 'svg_coins';
  if(s.includes('公') && s.includes('tick') || s.includes('x1="15"') && s.includes('#4fc3f7')) return 'svg_ruler';
  if(s.includes('<rect') && s.includes('rx="') === false && s.includes('人')) return 'svg_bar_chart';
  if(s.includes('平分成')) return 'svg_fraction_bar';
  if(s.includes('直徑') || s.includes('半徑')) return 'svg_circle';
  if(s.includes('底 ') && s.includes('高 ')) return 'svg_triangle';
  if(s.includes('角度') || s.includes('arc')) return 'svg_angle';
  if(s.includes('扇形') || s.includes('圓心角')) return 'svg_sector';
  if(s.includes('robots') || (s.includes('#ef9a9a') && s.includes('#90caf9') && s.includes('#ffe082'))) return 'svg_shape_count';
  if(s.includes('(1)') && s.includes('(2)') && s.includes('(3)')) return 'svg_length_compare';
  if(s.includes('①') && s.includes('④')) return 'svg_lines_four';
  return 'svg_custom_' + s.slice(0, 48).replace(/\d+/g, '#');
}

function inferArchetypeKeys(item, subj, kindKey=''){
  const keys = [];
  if(!item) return keys;
  if(item.arch) keys.push('arch_' + item.arch);
  if(subj === '數學'){
    const svgArch = inferSvgArchetype(item.svg);
    if(svgArch) keys.push('arch_' + svgArch);
  }

  const q = String(item.q || '');
  const full = q + ' ' + String(item.a || '') + ' ' + String(item.exp || '');
  if(subj === '數學'){
    if(/時鐘|鐘面|幾點幾分|幾點整|點半|時針|分針/.test(full)) keys.push('arch_concept_clock');
    if(/定位板|個十和.*個一|十位數字.*個位數字|百位.*十位.*個位/.test(full)) keys.push('arch_concept_placevalue');
    if(/火車數列|順數|倒數|數列|空格裡應該填入|下一個數/.test(q)) keys.push('arch_concept_seq');
    if(/分合表|分成.*和|合起來剛好是|合起來是/.test(q) && !/蘋果|彈珠|糖果|橘子|卡片|貼紙|鴨子/.test(q)) keys.push('arch_concept_split');
    if(/骰子點數|骰子圖/.test(full)) keys.push('arch_concept_dice');
    if(/積木圖|積木合起來/.test(full)) keys.push('arch_concept_block_add');
    if(/排隊.*第.*個|前面有.*個人.*後面有/.test(q)) keys.push('arch_concept_queue');
    if(/從第.*1.*頁讀到第/.test(q)) keys.push('arch_concept_book_pages');
    if(/機器人圖形|小屋圖形/.test(q)) keys.push('arch_concept_shape_count');
    if(/直線與曲線|直線.*曲線/.test(q)) keys.push('arch_concept_lines');
    if(/直尺圖|測量圖|刻度/.test(q)) keys.push('arch_concept_ruler');
    if(/鉛筆最長|一端對齊/.test(q)) keys.push('arch_concept_compare_len');
    if(/統計圖|長條圖/.test(q)) keys.push('arch_concept_barchart');
    if(/點陣圖/.test(q)) keys.push('arch_concept_arraydots');
    if(/硬幣|找回.*元|麵包.*元|橡皮擦.*元/.test(q) && /硬幣|鈔票|50\s*元/.test(full)) keys.push('arch_concept_coins');
    if(/滾動|堆疊|疊高/.test(q)) keys.push('arch_concept_roll_stack');
    if(/湊十法|拆湊成\s*10/.test(full)) keys.push('arch_concept_make10');
    if(/破十法|先從\s*10\s*減/.test(full)) keys.push('arch_concept_borrow10');
    if(/交換.*一樣大|結果相同/.test(full) && /＋|×/.test(q)) keys.push('arch_concept_commute');
    if(/加\s*0|減\s*0|放進\s*0\s*顆/.test(q)) keys.push('arch_concept_zero');
    if(/比大小.*＞.*＜|填\s*＞、＜/.test(q)) keys.push('arch_concept_cmp_sym');
  } else if(subj === '國語'){
    // 嚴格壓低純筆畫／純部首／孤立單字注音題數量，確保多元改錯字、相似相反詞、形近字與語意理解為主體
    if(/總筆畫|多少畫|筆畫比較/.test(q)) keys.push('arch_zh_pure_stroke');
    if(/的部首是哪一個|屬於相同部首|屬於相同的部首|部首「[^」]+」配對/.test(q)) keys.push('arch_zh_pure_radical');
    if(/寫出部首並造詞|部首與造詞|部首延伸想一想/.test(q)) keys.push('arch_zh_rad_word_' + kindKey);
    if((/正確讀音|正確注音|注音是哪一個|對應的正確國字|注音雙拼/.test(q)) && !/多音字/.test(q)) keys.push('arch_zh_iso_zy_' + kindKey);
    if(/寫出注音與總筆畫|看注音寫國字與部首/.test(q)) keys.push('arch_zh_rote_fill');
    if(/量詞/.test(full)) keys.push('arch_zh_measure_word');
    if(/疊字/.test(full)) keys.push('arch_zh_redup');
    if(/組合成語|四字成語/.test(q)) keys.push('arch_zh_idiom_' + kindKey);
    if(/部首/.test(q) && kindKey !== 'calc' && !/寫出部首並造詞/.test(q)) keys.push('arch_zh_radical_' + kindKey);
  }
  return [...new Set(keys)];
}

// 識別題目所屬之「廣義概念群組」（同一題組若有 2 題以上，強制由簡單排到困難）
function inferBroadCategory(item, subj, kindKey){
  const q=String(item.q||'');
  if(subj==='國語'){
    if(/讀音|注音/.test(q)) return 'zh_phonetic';
    if(/部首|筆畫/.test(q)) return 'zh_radical';
    if(/成語|四字/.test(q)) return 'zh_idiom';
    if(/修辭/.test(q)) return 'zh_rhetoric';
    if(/標點/.test(q)) return 'zh_punc';
    if(/量詞|疊字|短語/.test(q)) return 'zh_phrase';
    return 'zh_comp';
  }
  if(subj==='數學'){
    if(/面積|周長|體積|表面積|角|圓|扇形|三角形|四邊形|梯形|正方|長方/.test(q)) return 'math_geo';
    if(/公升|毫公升|公尺|公分|公里|公斤|公克|公噸|時|分|元|硬幣|直尺|量杯/.test(q)) return 'math_meas';
    if(/長條圖|折線圖|圓形圖/.test(q)) return 'math_stat';
    return 'math_num';
  }
  if(subj==='英語'){
    if(/單字|中文意思|拼出/.test(q)) return 'en_vocab';
    return 'en_gram';
  }
  return subj+'_'+kindKey;
}

// 計算單題精細難度分數（確保各題型與同一概念題組嚴格「由簡單到困難」遞增排序）
function calcQuestionDifficulty(item, subj, kindKey, effDiff='mid'){
  const base = effDiff==='easy'?100:(effDiff==='hard'?300:200);
  const q = String(item.q||'');
  let comp = 0;
  // 1. 擷取題目中之數值大小與步驟數
  const nums = (q.match(/\d+(\.\d+)?/g)||[]).map(Number).filter(n=>!isNaN(n));
  if(nums.length){
    const mx = Math.max(...nums);
    comp += Math.min(35, Math.log10(mx+1)*10 + nums.length*3);
  }
  // 2. 空格數、小題數與運算複雜度
  const blanks = (q.match(/[（(][\s　]*[）)]|□/g)||[]).length;
  comp += blanks * 8;
  if(/[×÷]/.test(q) && /[＋－+-]/.test(q)) comp += 18; // 四則混合兩步驟以上
  if(/餘數|最大公因數|最小公倍數|複合|L\s*形|平均速率|定價|打.*折|比例尺|扇形|圓柱/.test(q)) comp += 22;
  if(subj==='國語'){
    if(/讀音|注音/.test(q) && q.length<22) comp += 5;
    else if(/部首|筆畫|量詞/.test(q)) comp += 18;
    else if(/選字|相似|相反|短語/.test(q)) comp += 30;
    else if(/成語|標點|關聯|雖然|因為/.test(q)) comp += 45;
    else if(/修辭|閱讀|推論/.test(q)) comp += 62;
  }
  if(subj==='英語'){
    if(/中文意思|英文單字/.test(q)) comp += 10;
    else if(/拼出/.test(q)) comp += 25;
    else comp += 42;
  }
  comp += Math.min(25, q.length * 0.35);
  return base + comp;
}


let __svgSeen = new Set();
function __svgHash(s){
  let h = 0;
  for(let i=0;i<s.length;i++){ h = (h*31 + s.charCodeAt(i)) >>> 0; }
  return h;
}
function svgBeakerTemps(){
  return `<svg width="132" height="62" viewBox="0 0 132 62" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="18" width="34" height="34" rx="2" fill="#fecaca"/>
    <path d="M6,8 L8,52 L42,52 L44,8" fill="none" stroke="#333" stroke-width="1.6"/>
    <text x="25" y="14" font-size="8" text-anchor="middle" fill="#b91c1c">溫水 60℃</text>
    <text x="25" y="40" font-size="9" text-anchor="middle" fill="#7f1d1d">食鹽</text>
    <rect x="70" y="18" width="34" height="34" rx="2" fill="#bfdbfe"/>
    <path d="M68,8 L70,52 L104,52 L106,8" fill="none" stroke="#333" stroke-width="1.6"/>
    <text x="87" y="14" font-size="8" text-anchor="middle" fill="#1d4ed8">冰水 5℃</text>
    <text x="87" y="40" font-size="9" text-anchor="middle" fill="#1e3a8a">食鹽</text>
    <path d="M114,26 L126,26" stroke="#333" stroke-width="1.4" stroke-dasharray="3 3"/>
    <text x="120" y="22" font-size="7" text-anchor="middle" fill="#333">比較</text>
  </svg>`;
}
function svgThermometer(c){
  const y = 48 - Math.round((c/50)*32);
  return `<svg width="70" height="60" viewBox="0 0 70 60" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="8" width="8" height="36" rx="4" fill="#fff" stroke="#333" stroke-width="1.4"/>
    <circle cx="22" cy="48" r="7" fill="#ef4444" stroke="#333" stroke-width="1.4"/>
    <rect x="20" y="${y}" width="4" height="${48-y}" fill="#ef4444"/>
    <text x="46" y="34" font-size="12" fill="#b91c1c" font-weight="700">${c}℃</text>
  </svg>`;
}
function svgSpringScale(gw){
  return `<svg width="90" height="64" viewBox="0 0 90 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="24" y="6" width="22" height="34" rx="3" fill="#f8fafc" stroke="#333" stroke-width="1.5"/>
    <text x="35" y="27" font-size="10" text-anchor="middle" fill="#111">${gw}g</text>
    <path d="M35,40 L35,48" stroke="#333" stroke-width="1.4"/>
    <rect x="24" y="48" width="22" height="10" rx="2" fill="#cbd5e1" stroke="#333" stroke-width="1.2"/>
  </svg>`;
}
function __buildSciSvg(kind, h){
  switch(kind){
    case 'magRepel': return svgMagnet('S','N','N','S');
    case 'magAttract': return svgMagnet('S','N','S','N');
    case 'magIron': return svgMagnetAttract();
    case 'shadowNoon': return svgShadowSun('noon');
    case 'shadowSide': return svgShadowSun('side');
    case 'waterGlasses': return svgWaterGlasses();
    case 'traffic': return svgTrafficLight();
    case 'moon': return svgMoonPhase();
    case 'airCup': return svgAirCup();
    case 'circuit': return svgCircuit(true);
    case 'lever': return svgLever(20,300,15);
    case 'beakerTemps': return svgBeakerTemps();
    case 'beaker': return svgBeaker([200,400,600,800][h % 4]);
    case 'thermometer': return svgThermometer([5,15,25,35][h % 4]);
    case 'spring': return svgSpringScale([50,100,150,200][h % 4]);
    default: return null;
  }
}

function attachMatchingSvg(item, subj, g){
  if(item.svg) return item;
  const q = String(item.q||'') + ' ' + String(item.a||'');
  if(subj==='生活'||subj==='自然科學'){
    const h = __svgHash(q);
    let kind=null;
    if(/同極|N\s*極和\s*N\s*極|相斥/.test(q)) kind='magRepel';
    else if(/異極|N\s*極和\s*S\s*極|兩個極/.test(q)) kind='magAttract';
    else if(/磁鐵.*吸|鐵釘|迴紋針/.test(q)) kind='magIron';
    else if(/中午.*影子|仰角最高.*影子最短/.test(q)) kind='shadowNoon';
    else if(/影子|太陽/.test(q)) kind='shadowSide';
    else if(/拍打.*水|杯子.*聲音/.test(q)) kind='waterGlasses';
    else if(/紅燈|綠燈|紅綠燈/.test(q)) kind='traffic';
    else if(/月亮|月相|滿月|上弦月|初一到十五/.test(q)) kind='moon';
    else if(/空氣佔有空間|空杯.*壓入水中/.test(q)) kind='airCup';
    else if(/電路|燈泡|導體|絕緣體|電池/.test(q)) kind='circuit';
    else if(/20\s*公分.*300\s*克.*15\s*公分/.test(q)) kind='lever';
    else if(/水溫|溶解|石蕊試紙|酸性|鹼性|水溶液|食鹽|砂糖/.test(q)) kind=/水溫|溶解速度|快慢/.test(q)?'beakerTemps':'beaker';
    else if(/溫度計|氣溫|攝氏/.test(q)) kind='thermometer';
    else if(/彈簧|重量|公克|砝碼/.test(q)) kind='spring';
    // 去重＋配圖節制：同一份考卷內同型圖只出現一次，且非每題都硬塞圖，
    // 避免整份考卷反覆出現「同一張溶解杯／電池圖」。
    if(kind && !__svgSeen.has(kind) && (h % 3 === 0 || __svgSeen.size < 2)){
      __svgSeen.add(kind);
      item.svg = __buildSciSvg(kind, h);
    }
  }
  if(subj==='社會'){
    if(/圖例|比例尺|方向|方位/.test(q)) item.svg = svgCompassRose();
    else if(/五大.*地形|盆地|台地|平原|中央山脈/.test(q)) item.svg = svgTaiwanTerrain();
  }
  if(subj==='英語'){
    if(/seven\s*\(?.*o'clock|7:00/i.test(q)) item.svg = svgClock(7,0);
    else if(/eight\s*\(?.*o'clock|8:00/i.test(q)) item.svg = svgClock(8,0);
    else if(/What\s*\(?.*time/i.test(q)) item.svg = svgClock(7,0);
    else if(/thirty\s+dollars/i.test(q)) item.svg = svgPriceTag(/juice/i.test(q)?'Juice':'Item', 30);
    else if(/forty\s+dollars/i.test(q)) item.svg = svgPriceTag(/sandwich/i.test(q)?'Sandwich':'Item', 40);
    else if(/How\s*\(?.*much/i.test(q)) item.svg = svgPriceTag('Bag', 80);
    else if(/rainy/i.test(q)) item.svg = svgWeatherIcon('rainy');
    else if(/sunny|weather/i.test(q)) item.svg = svgWeatherIcon('sunny');
    else if(/under the chair|under the desk/i.test(q)) item.svg = svgPreposition('under');
    else if(/on the desk|on the box/i.test(q)) item.svg = svgPreposition('on');
    else if(/in the box|in the bag/i.test(q)) item.svg = svgPreposition('in');
  }
  return item;
}

// 依據單元關鍵字判斷題目是否屬於使用者勾選的單元
function matchesUnitTopics(item, subj, g, sem, unitIndices, allUnitsCount){
  if(!unitIndices || !unitIndices.length || unitIndices.length >= allUnitsCount) return true;
  if(item && item.u !== undefined && item.u !== null){
    if(item.g !== undefined && +item.g !== +g) return false;
    if(item.sem && item.sem !== sem) return false;
    return unitIndices.includes(+item.u);
  }
  if(subj==='國語') return true; // 國語靜態題庫已依低／中／高年級分級設計（改錯字、相似相反詞、修辭標點、閱讀素養），各課複習與期中期末皆可自然融合出題
  const q = String(item.q||'') + ' ' + String(item.a||'') + ' ' + String(item.exp||'') + ' ' + (item.pairs ? item.pairs.flat().join(' ') : '');
  const UNIT_KW = {
    '生活_1_上_0': /上課|鐘聲|校園|教室|禮貌|走廊|樓梯|同學|朋友|打招呼|課堂|規矩/,
    '生活_1_上_1': /秋|落葉|植物|小動物|昆蟲|6\s*隻腳|陽光|季節|穿|樹葉|放大鏡/,
    '生活_1_上_2': /玩具|聲音|拍打|水杯|敲擊|高低|振動|紙杯|音量/,
    '生活_1_下_0': /家人|家事|紅燈|綠燈|過馬路|跌倒|火警|安全|家人/,
    '生活_1_下_1': /發芽|豆|盆栽|澆水|回收|寶特瓶|鋁罐|紙類|垃圾|環境|環保/,
    '生活_1_下_2': /影子|太陽|省水|關水|端午|中秋|元宵|春節|習俗|水龍頭/,
    '生活_2_上_0': /二年級|時間|作息|社區|公共|規範|圖書館|鄰居/,
    '生活_2_上_1': /磁鐵|磁極|鐵釘|迴紋針|同極|異極|風|風車/,
    '生活_2_下_0': /米|稻|粽|月餅|湯圓|食物|特產|農家|米食/,
    '生活_2_下_1': /昆蟲|6\s*隻腳|蝴蝶|蜘蛛|回收|環保袋|節約能源|關燈|生物/,
    '自然科學_3_上_0': /植物|根|莖|葉|花|果實|種子|光合作用|葉脈|葉緣/,
    '自然科學_3_上_1': /磁鐵|磁極|同極|異極|鐵|指北針/,
    '自然科學_3_上_2': /空氣|風|倒扣|壓縮|佔有空間/,
    '自然科學_3_下_0': /昆蟲|六隻腳|6隻腳|變態|蛹|蝴蝶|蝗蟲|完全變態|翅膀/,
    '自然科學_3_下_1': /溶解|食鹽|砂糖|水溫|浮|沉|飽和/,
    '自然科學_3_下_2': /溫度計|氣溫|雲|雨|天氣|百葉箱|雨量|預報/,
    '自然科學_4_上_0': /月|滿月|眉月|上弦|下弦|農曆/,
    '自然科學_4_上_1': /水生|布袋蓮|浮萍|睡蓮|水蘊草|荷花|魚|鰓|鰭|濕地/,
    '自然科學_4_上_2': /光|反射|折射|鏡|三稜鏡|彩虹|筷子|色散/,
    '自然科學_4_下_0': /力|彈簧|砝碼|摩擦|重力|運動/,
    '自然科學_4_下_1': /毛細|虹吸|連通管|蒸發|凝結|凝固|融化|三態|水循環/,
    '自然科學_4_下_2': /電路|燈泡|串聯|並聯|導體|絕緣體|銅線|電池|聲音|音調/,
    '自然科學_5_上_0': /太陽|影|四季|夏至|冬至|仰角|日晷|晝夜/,
    '自然科學_5_上_1': /花|授粉|果實|種子|繁殖|雄蕊|雌蕊|花粉/,
    '自然科學_5_上_2': /酸|鹼|石蕊|高麗菜|小蘇打|檸檬|醋|溶解|導電/,
    '自然科學_5_下_0': /燃燒|氧氣|二氧化碳|石灰水|滅火|生鏽|熱傳導|熱對流|熱輻射/,
    '自然科學_5_下_1': /骨骼|肌肉|關節|呼吸|血液|心臟|血管|肺/,
    '自然科學_5_下_2': /星|北極星|北斗七星|仙后座|星座|星空/,
    '自然科學_6_上_0': /岩|火成|沉積|變質|侵蝕|堆積|凹岸|凸岸|地震|化石|板塊/,
    '自然科學_6_上_1': /電磁鐵|線圈|磁力|指北針|通電|電池|馬達/,
    '自然科學_6_上_2': /鋒|滯留鋒|梅雨|氣團|氣壓|颱風|冷鋒|暖鋒|高氣壓|低氣壓/,
    '自然科學_6_下_0': /槓桿|支點|施力臂|抗力臂|滑輪|輪軸|省力|齒輪/,
    '自然科學_6_下_1': /生態|生產者|消費者|分解者|食物鏈|外來種|食物網/,
    '自然科學_6_下_2': /再生能源|太陽能|風力|煤炭|石油|永續|溫室|減碳|綠能/,
    '社會_3_上_0': /家庭|親屬|社區|鄰里|巡守|伯父|姑姑/,
    '社會_3_上_1': /班級|自治|安全|溝通|學校|公約|尊重/,
    '社會_3_上_2': /消費|需要|想要|發票|1950|儲蓄|理財|零用錢/,
    '社會_3_下_0': /地名|古蹟|先民|傳統建築|三合院|老街/,
    '社會_3_下_1': /農|漁|牧|特產|工商業|服務業|產業|分工/,
    '社會_3_下_2': /節慶|多元文化|原住民|新住民|習俗|祭典/,
    '社會_4_上_0': /地形|山地|丘陵|平原|盆地|台地|圖例|比例尺|方向|季風/,
    '社會_4_上_1': /縣（市）|議會|政府|防災|避難|颱風|地震|公共設施|守法/,
    '社會_4_下_0': /交通|運輸|陸運|水運|空運|通訊|手機|高鐵|捷運/,
    '社會_4_下_1': /水圳|瑠公圳|八堡圳|產業|永續|開發|農業/,
    '社會_5_上_0': /中央山脈|地形|河川|海岸|國家公園|離島|珊瑚礁/,
    '社會_5_上_1': /史前|原住民|南島語族|16\s*族|遺址|卑南|十三行/,
    '社會_5_上_2': /荷蘭|西班牙|熱蘭遮|鄭成功|紅毛城|大航海/,
    '社會_5_下_0': /清|茶|樟腦|蔗糖|劉銘傳|水圳|通商/,
    '社會_5_下_1': /日治|八田與一|嘉南大圳|戰後|民主|解嚴/,
    '社會_6_上_0': /憲法|行政院|立法院|司法院|考試院|監察院|五權|權利|義務|納稅|服兵役|法律|刑事/,
    '社會_6_上_1': /經濟|貿易|半導體|出口|投資|理財|進出口|全球化/,
    '社會_6_下_0': /亞洲|大洋|太平洋|文化|世界|宗教|古文明|洲/,
    '社會_6_下_1': /UN|WHO|SDGs|永續|國際組織|紅十字|人權|氣候變遷/,
    '英語_1_上_0': /morning|Hello|name|Aa|Mm|apple|cat|dog|hi|字母\s*A/i,
    '英語_1_上_1': /one|two|three|four|five|six|seven|eight|nine|ten|pen|book|Nn|Zz|stand|sit/i,
    '英語_1_下_0': /red|blue|green|yellow|black|white|book|pen|ruler|bag|color/i,
    '英語_1_下_1': /cat|dog|bird|fish|mom|dad|sister|brother|how are you/i,
    '英語_2_上_0': /this|that|pig|duck|milk|egg|cake|phonics|母音|eleven|twelve|twenty/i,
    '英語_2_上_1': /head|eye|ear|nose|mouth|hand|Touch|old|how old/i,
    '英語_2_下_0': /like|milk|juice|bread|water|cake|egg|apple|banana|fruit/i,
    '英語_2_下_1': /big|small|tall|short|happy|sad|rabbit|monkey|lion|bear|cute|how many/i,
    '英語_3_上_0': /name|old|nine|ten|student|teacher|morning|hello/i,
    '英語_3_上_1': /pencil|eraser|chair|desk|box|ball|this|that|pen|ruler|bag/i,
    '英語_3_下_0': /Who|teacher|student|doctor|nurse|cook|farmer|am|is|he|she|they/i,
    '英語_3_下_1': /Where|in|on|under|near|elephant|tiger|zebra|turtle|snake|frog|rabbit/i,
    '英語_4_上_0': /time|o'clock|Monday|Tuesday|Wednesday|Thursday|Friday|Sunday|day|get up/i,
    '英語_4_上_1': /Can you|swim|like|ride|catch|dance|sing|cook/i,
    '英語_4_下_0': /How much|dollar|hamburger|noodles|sandwich|rice|soup|juice|tea|want/i,
    '英語_4_下_1': /weather|sunny|rainy|cloudy|windy|hot|cold|hungry|thirsty|tired|angry|happy/i,
    '英語_5_上_0': /doing|reading|swimming|running|-ing|watching|writing|playing/i,
    '英語_5_上_1': /jacket|shorts|raincoat|sweater|hat|shoes|wear|birthday|month|season|May|January/i,
    '英語_5_下_0': /MRT|bus|train|bike|scooter|car|straight|turn left|turn right|library|park|zoo|hospital|post office|bookstore|on foot/i,
    '英語_5_下_1': /always|usually|sometimes|never|weekend|seldom|basketball/i,
    '英語_6_上_0': /yesterday|Last|went|ate|saw|had|did|was|were/i,
    '英語_6_上_1': /taller|shorter|faster|bigger|oldest|highest|than|best|worst/i,
    '英語_6_下_0': /going to|will|want to|engineer|singer|pilot|artist|scientist|writer|teacher|chef/i,
    '英語_6_下_1': /Kenting|Tainan|visit|travel|summer|train|seafood|ever|already|airport/i
  };
  return unitIndices.some(uIdx=>{
    const re = UNIT_KW[`${subj}_${g}_${sem}_${uIdx}`];
    return re ? re.test(q) : false;
  });
}


// 針對國語、生活、自然科學、社會、英語之單一勾選單元專屬動態題庫（確保只勾選單一單元時 100% 題目皆出自該單元）
function genCurriculumUnitQuestion(subj, g, sem, uIdx, kindKey, effD, vIdx, allowedUnits){
  const isTrue = (vIdx + randSeed) % 2 === 0;
  if(subj==='國語'){
    // 結合勾選課次生字池（適度融入寫出部首並造詞、生字語境應用）與多元語文素養題型（改錯字、相似相反詞、形近同音、多音字、情境短文、標點修辭、故事閱讀）
    const pool = getTwGradeChars(g, allowedUnits);
    const lsName = (allowedUnits && allowedUnits.length)
      ? allowedUnits[(vIdx + randSeed) % allowedUnits.length]
      : (pool[0] && pool[0].lesson ? pool[0].lesson : '本課');
    return genChineseRichQuestion(g, kindKey, effD, vIdx, pool, lsName);
  }

  // 英語科依勾選 Unit 精準抽題
  if(subj==='英語'){
    const PB=window.PROC_BANK&&PROC_BANK.eng;
    const fullV=(PB&&PB.vocab[g])||[['apple','蘋果'],['book','書本'],['cat','貓'],['dog','狗'],['sunny','晴朗的'],['library','圖書館']];
    const half=Math.ceil(fullV.length/2);
    const uVocab = uIdx===0 ? fullV.slice(0,half) : fullV.slice(half);
    const pool = uVocab.length>=4 ? uVocab : fullV;
    const [en,zh] = pool[(vIdx+randSeed)%pool.length];
    const [en2,zh2]=pool[(vIdx+1+randSeed)%pool.length];
    const others = shuffle(fullV.filter(x=>x[0]!==en&&x[1]!==zh)).slice(0,3);
    const uList = ((CURRICULUM[g]||{})['英語']||{})[sem]||[];
    const uTitle = (uList[uIdx]&&uList[uIdx].name)||`Unit ${uIdx+1}`;
    const sents = ((PB&&PB.sentences&&PB.sentences[g])||[]).filter(st=>matchesUnitTopics(st,'英語',g,sem,[uIdx],99));
    let item=null;
    if(kindKey==='mc'){
      if(vIdx%3===0 && sents.length){
        const st = sents[(vIdx+randSeed)%sents.length];
        if(st.opts) item = {q:`[${uTitle}] ${st.q}`,opts:shuffle(st.opts),a:st.a,exp:st.exp||''};
      }
      if(!item){
        item = vIdx%2===0
          ? {q:`[${uTitle}] 英文單字 "${en}" 的中文意思是什麼？`,opts:uniqueOpts(zh,others.map(x=>x[1])),a:zh,exp:`${en} ＝ ${zh}`}
          : {q:`[${uTitle}] 「${zh}」的英文單字是哪一個？`,opts:uniqueOpts(en,others.map(x=>x[0])),a:en,exp:`${zh} ＝ ${en}`};
      }
    }else if(kindKey==='tf'){
      const shown=isTrue?zh:others[0][1];
      item = vIdx%2===0
        ? {q:`[${uTitle}] 英文 "${en}" 的中文意思是「${shown}」。`,a:isTrue?'○':'✕',exp:`${en} ＝ ${zh}`}
        : {q:`[${uTitle}] 我們可以用 "${en}" 來表達中文裡「${shown}」的意思。`,a:isTrue?'○':'✕',exp:`${en} 代表「${zh}」。`};
    }else if(kindKey==='fill'){
      const masked=en.length>2?en[0]+' _ '.repeat(en.length-2)+en[en.length-1]:en;
      item = vIdx%2===0
        ? {q:`[${uTitle}] 依中文提示拼出英文單字：「${zh}」→ ${masked}（　　　）`,a:en}
        : {q:`[${uTitle}] 英文拼寫填空：看到圖片與提示「${zh}」，完整單字寫作（　　　　）。`,a:en};
    }else if(kindKey==='match'){
      const mTitles = [`${uTitle} 單字中英配對`,`${uTitle} 重點詞彙連線`,`${uTitle} 單元字義對應`];
      item = {q:mTitles[vIdx%3],pairs:shuffle(pool).slice(0,4)};
    }else if(kindKey==='calc'){
      const cMod = vIdx%3;
      if(cMod===0) item = {q:`[${uTitle}] 英文句型寫作：請運用單字 "${en}"（${zh}）完成一個英文短句並寫出中文意思。`,a:`It is a/an ${en}. / I like ${en}.（${zh}）`};
      else if(cMod===1) item = {q:`[${uTitle}] 英語抄寫與應用：請寫出「${zh}」的英文單字 "${en}" 三遍，並試著念讀一遍。`,a:`${en}（${zh}）`};
      else item = {q:`[${uTitle}] 問答句型練習：請試著用 "${en}" 與 "${en2}" 寫出一個問句或回答句。`,a:`例：Look at the ${en} and ${en2}.`};
    }else{
      const wMod = vIdx%2;
      item = wMod===0
        ? {q:`【${uTitle} 閱讀對話】Amy: "Look! What is it?" Ben: "It is a/an ${en}. And I can see a/an ${en2}, too." 問題：(1) What does Ben see first（寫出中文）? (2) Write down the English word for「${zh2}」.`,a:`(1) ${zh}。(2) ${en2}。`}
        : {q:`【${uTitle} 情境問答】Teacher: "Do you see ${en}?" Leo: "Yes! I also have ${en2}." 問題：(1) 請寫出「${zh}」的英文拼字。 (2) Leo 還擁有什麼（寫出中文）？`,a:`(1) ${en}。(2) ${zh2}。`};
    }
    return attachMatchingSvg(item, subj, g);
  }

  // 生活、自然科學、社會：結合該單元真實 PROC_BANK 知識與 CURRICULUM 課綱子主題（100% 鎖定該單元）
  const uList = ((CURRICULUM[g]||{})[subj]||{})[sem]||[];
  const uObj = uList[uIdx] || uList[0] || {name:`單元${uIdx+1}`,topics:['核心概念一','核心概念二','核心概念三']};
  const tps = uObj.topics || ['核心概念'];
  const tp = tps[(vIdx + Math.floor(vIdx / 5)) % tps.length];
  const tpNext = tps[(vIdx + 1 + Math.floor(vIdx / 5)) % tps.length];
  const uShort = uObj.name.split('：')[1] || uObj.name;
  const otherUnits = uList.filter((_,idx)=>idx!==uIdx);
  const wrongTopics = otherUnits.flatMap(u=>u.topics||[]).concat(['隨意破壞環境','不遵守安全規則','未經查證的猜測']);

  // 優先嘗試從 PROC_BANK 挑選完全吻合本單元之事實與配對
  const tier = g<=2?'low':(g<=4?'mid':'high');
  const pbNode = window.PROC_BANK && (subj==='生活'?PROC_BANK.life:(subj==='自然科學'?PROC_BANK.sci[tier]:PROC_BANK.soc[tier]));
  const unitFacts = (pbNode && pbNode.facts || []).filter(f=>matchesUnitTopics(f, subj, g, sem, [uIdx], 99));
  const unitPairs = (pbNode && pbNode.pairs || []).filter(pr=>matchesUnitTopics({q:pr[0],a:pr[1]}, subj, g, sem, [uIdx], 99));

  let item=null;
  if(kindKey==='mc'){
    const dist = shuffle(wrongTopics.filter(x=>x!==tp)).slice(0,3);
    const mcPrompts = [
      `進行「${uShort}」單元探究時，下列哪一項屬於本單元的正確觀察或重點？`,
      `關於「${tp}」的課堂學習，下列哪一個敘述與本單元「${uShort}」最直接相關？`,
      `小華正在複習「${uObj.name}」，他應該特別掌握下列哪一個關鍵概念？`,
      `下列哪一項主題屬於「${uObj.name}」的學習範圍？`,
      `在「${uShort}」主題討論中，老師提到的「${tpNext}」與下列哪個概念同屬本單元？`,
      `整理「${uObj.name}」重點筆記時，哪一個項目應該列入本單元？`,
      `小美想深入了解「${uShort}」，下列哪一項是她在課本中會學到的內容？`,
      `複習${subj}科「${uObj.name}」時，下列哪個選項是正確的核心概念？`,
      `在「${uShort}」的分組討論裡，哪一項概念是大家一定要認識的？`,
      `關於「${uObj.name}」單元評量目標，下列何者屬於本單元的學習內容？`,
      `小明設計「${uShort}」海報時，應該把哪一項知識放進重點區？`,
      `閱讀「${uObj.name}」課文後，哪個詞語代表本單元的重要概念？`
    ];
    item = {q:mcPrompts[vIdx%mcPrompts.length], opts:uniqueOpts(tp,dist), a:tp, exp:`「${uObj.name}」重點為：${tps.join('、')}。`};
  }else if(kindKey==='tf'){
    if(unitFacts.length && vIdx%2===0){
      const uf = unitFacts[(vIdx+randSeed)%unitFacts.length];
      item = {q:uf.q, a:uf.ok?'○':'✕', exp:uf.exp||''};
    }else{
      const shown = isTrue ? tp : wrongTopics[vIdx%wrongTopics.length];
      const tfPrompts = [
        `學習「${uShort}」時，我們會透過觀察與討論來認識「${shown}」。`,
        `「${shown}」屬於「${uObj.name}」單元中所探討的重要內容。`,
        `在「${uShort}」的課程活動裡，重點包含了「${shown}」的認識與實踐。`,
        `複習「${uObj.name}」時，「${shown}」是本單元的核心觀念之一。`,
        `課堂進行「${uShort}」探究時，老師會帶領大家認識「${shown}」。`,
        `整理「${uShort}」學習單時，「${shown}」應該被列入本單元重點。`,
        `小美和同學討論「${uObj.name}」的內容，主題正巧與「${shown}」有關。`,
        `在「${uShort}」的知識架構中，「${shown}」是不可或缺的一環。`,
        `如果想完成「${uObj.name}」的報告，資料中一定會提到「${shown}」。`,
        `下列敘述正確嗎：「${shown}」是「${uShort}」課程中的重要課題。`
      ];
      item = {q:tfPrompts[vIdx%tfPrompts.length], a:isTrue?'○':'✕', exp:`「${uObj.name}」重點為：${tps.join('、')}。`};
    }
  }else if(kindKey==='fill'){
    if(unitPairs.length && vIdx%2===0){
      const pr = unitPairs[(vIdx+randSeed)%unitPairs.length];
      item = {q:`單元觀念填空（${uShort}）：「${pr[0]}」對應的重要概念或特徵是（　　　　　）。`, a:pr[1]};
    }else{
      const fillPrompts = [
        {q:`在「${uObj.name}」中，我們學習了「${tp}」與（　　　　　）等重要概念。`,a:tpNext},
        {q:`複習「${uShort}」時，除了「${tpNext}」之外，（　　　　　）也是本單元的關鍵重點。`,a:tp},
        {q:`「${uObj.name}」單元的學習重點包含（　　　　　）以及「${tpNext}」。`,a:tp},
        {q:`進行「${uShort}」探究活動時，認識「${tp}」與（　　　　　）能幫助我們掌握單元概念。`,a:tpNext},
        {q:`完成「${uShort}」心智圖時，在「${tp}」旁邊最適合補上的同單元概念是（　　　　　）。`,a:tpNext},
        {q:`老師提醒「${uObj.name}」有兩項核心重點，分別是「${tp}」和（　　　　　）。`,a:tpNext},
        {q:`小華整理「${uShort}」筆記，先寫下了「${tpNext}」，接著又寫下同單元的（　　　　　）。`,a:tp},
        {q:`認識「${uObj.name}」課程時，從「${tp}」延伸觀察到的另一個重點是（　　　　　）。`,a:tpNext}
      ];
      item = fillPrompts[vIdx%fillPrompts.length];
    }
  }else if(kindKey==='match'){
    if(unitPairs.length>=4 && vIdx%2===0){
      item = {q:`${uObj.name} 重點知識配對`,pairs:shuffle(unitPairs).slice(0,4)};
    }else{
      const mTitles = [`${uObj.name} 概念配對`,`${uShort} 核心主題對應`];
      const pairs = tps.slice(0,3).map((t,idx)=>[`${uShort}重點(${idx+1})`,t]);
      while(pairs.length<4) pairs.push([`本單元主題(${pairs.length+1})`, uShort]);
      item = {q:mTitles[vIdx%2],pairs};
    }
  }else if(kindKey==='calc'){
    const cPrompts = [
      {q:`【${uShort}・觀察紀錄】請針對本單元的「${tp}」，寫出兩項你在課堂活動或日常生活中觀察到的具體例子。`,a:`依「${tp}」寫出兩項具體實例（如：${tps.join('、')}相關觀察）。`},
      {q:`【${uShort}・概念比較】學習「${uObj.name}」時，請比較「${tp}」與「${tpNext}」兩者在生活中有什麼不同或關聯？`,a:`說明「${tp}」與「${tpNext}」之關聯或差異。`},
      {q:`【${uShort}・實作步驟】如果老師要請你向同學介紹「${tp}」，你會先說哪兩個重點或設計什麼小實驗？`,a:`寫出關於「${tp}」的兩項重點說明或觀察步驟。`},
      {q:`【${uShort}・生活實踐】學會「${tp}」之後，你在學校或家裡可以做到哪一件具體的好行為？`,a:`結合「${tp}」寫出一項具體日常實踐行動。`},
      {q:`【${uShort}・簡答說明】為什麼在「${uObj.name}」課程裡要學習「${tp}」？它對生活有什麼幫助？`,a:`說明「${tp}」的重要性與生活應用。`},
      {q:`【${uShort}・情境練習】請用一句話向低年級的弟弟妹妹解釋什麼是「${tp}」？`,a:`以淺顯易懂的語言說明「${tp}」的特徵。`},
      {q:`【${uShort}・原因追問】如果班上同學想更了解「${tp}」，你建議可以透過哪種觀察或訪談方式取得答案？`,a:`寫出具體觀察記錄、實驗操作或請教長輩與資料查詢方法。`},
      {q:`【${uShort}・圖卡設計】要畫一張提醒大家「${tp}」的宣導海報，你會寫上哪一句清楚又好記的標語？`,a:`設計與「${tp}」相符且具體正向的簡短標語。`}
    ];
    item = cPrompts[vIdx % cPrompts.length];
  }else{
    const wPrompts = [
      {q:`【${uShort}・素養情境題】老師帶領全班進行「${uShort}」探究活動，討論了「${tps.join('」、「')}」。問題：(1) 請挑出其中一項概念說明它的意思。 (2) 在生活中我們可以如何應用「${tp}」？`,a:`(1) 說明「${tps[0]}」概念。(2) 結合「${tp}」之生活應用。`},
      {q:`【${uShort}・任務挑戰】小美和同學正在製作「${uObj.name}」的海報，需要整理「${tp}」和「${tpNext}」的資料。問題：(1) 海報標題可以怎麼取？ (2) 請簡短寫出「${tp}」的一項特色或注意事項。`,a:`(1) 與「${uShort}」相關之清楚標題。(2) 「${tp}」的核心特色。`},
      {q:`【${uShort}・問題解決】在進行「${uShort}」單元學習時，有人對「${tp}」不太了解。請你舉出一個課本或生活中的現象，幫他解釋「${tp}」是什麼。`,a:`舉例說明「${tp}」在課本或生活中的具體表現。`},
      {q:`【${uShort}・探究統整】在「${uObj.name}」單元中，小組收集了關於「${tp}」與「${tpNext}」的觀察紀錄。問題：(1) 這兩項概念有什麼共同連結？ (2) 觀察時需要注意哪一項安全或記錄原則？`,a:`(1) 皆屬於「${uShort}」的核心探究項目。(2) 客觀記錄、小心操作與遵守規範。`},
      {q:`【${uShort}・小記者採訪】班上舉辦「${uShort}」主題分享會，阿明想上台報告「${tp}」。問題：(1) 你會幫阿明準備哪一個生活照片或實物當教具？ (2) 台下同學提問時，他應該怎麼簡短介紹「${tpNext}」？`,a:`(1) 挑出與「${tp}」最貼近的生活案例或教具。(2) 以具體生活現象說明「${tpNext}」。`}
    ];
    item = wPrompts[vIdx % wPrompts.length];
  }
  return attachMatchingSvg(item, subj, g);
}

function getExamSectionTitle(subj, kind){
  const map = {
    '國語': { mc:'選擇題', tf:'是非題', fill:'字音字形與填空', match:'連連看', calc:'改錯、短語與造句', word:'閱讀測驗' },
    '數學': { mc:'選擇題', tf:'是非題', fill:'填填看', match:'連連看', calc:'算算看（計算題）', word:'應用題' },
    '英語': { mc:'選擇題（Choice）', tf:'是非題（True or False）', fill:'字彙填空（Fill in the Blanks）', match:'圖文配對（Matching）', calc:'句子書寫（Writing）', word:'閱讀測驗（Reading）' }
  };
  const def = { mc:'選擇題', tf:'是非題', fill:'填填看', match:'連連看', calc:'分類與問答練習', word:'素養閱讀測驗' };
  return (map[subj] && map[subj][kind]) || def[kind] || kind;
}

function normSubNums(s){
  return String(s||'')
    .replace(/(問題[:：]\s*|\n)(\d+)\.\s+/g, '$1($2) ')
    .replace(/\s+(\d+)\.\s+(?=[^\n]*[？?])/g, ' ($1) ');
}

function normalizeTemplateSig(q){
  if(!q)return '';
  return String(q)
    .replace(/^【[^】]{1,24}】\s*/,'')
    .replace(/\d+(?:\.\d+)?/g,'#')
    .replace(/小明|小華|小美|小強|小瑛|小玉|小丸子|大雄|靜香|阿明|阿華|美美|志明|春嬌|爸爸|媽媽|哥哥|姊姊|姐姐|弟弟|妹妹|老師/g,'某人')
    .replace(/蘋果|橘子|香蕉|草莓|西瓜|鉛筆|原子筆|橡皮擦|尺|貼紙|糖果|餅乾|巧克力|彈珠|色紙|卡片|故事書|繪本|蛋糕|麵包|水壺|氣球|花朵|積木/g,'某物')
    .replace(/[一二三四五六七八九十兩百千萬]+個/g,'#個')
    .replace(/[Ａ-Ｚａ-ｚ甲乙丙丁]/g,'X')
    .replace(/\s+/g,' ')
    .trim();
}

let randSeed=0;
function generateExamQuestions(cfg){
  randSeed=rnd(0,97);
  __svgSeen = new Set();
  const g=+cfg.grade, subj=cfg.subject, diff=cfg.diff;
  const tier=g<=2?'low':(g<=4?'mid':'high');
  const sections=[];
  // 全卷（及跨張綜合包）硬性防重集合：題幹、版型簽名、主題標籤、與「結構題型原型」皆嚴格禁止重複！
  const examTopicsUsed=new Set(cfg.excludeTopics instanceof Set ? cfg.excludeTopics : []);
  const examArchetypesUsed=new Set(cfg.excludeArchetypes instanceof Set ? cfg.excludeArchetypes : []);
  const examQuestionsUsed=new Set();
  const examSigsUsed=new Set();
  const extQuestions = cfg.excludeQuestions instanceof Set ? cfg.excludeQuestions : null;
  const extSigs = cfg.excludeSigs instanceof Set ? cfg.excludeSigs : null;

  const isGlobalDup=(cand, checkSig=true)=>{
    if(!cand||!cand.q) return true;
    if(examQuestionsUsed.has(cand.q) || (extQuestions && extQuestions.has(cand.q))) return true;
    if(checkSig){
      const sig=normalizeTemplateSig(cand.q);
      if(examSigsUsed.has(sig) || (extSigs && extSigs.has(sig))) return true;
    }
    return false;
  };
  const hasArchetypeConflict=(cand, kindKey='', allowTopicRelax=false)=>{
    const aKeys = inferArchetypeKeys(cand, subj, kindKey);
    if(aKeys.some(k=>examArchetypesUsed.has(k))) return true;
    if(!allowTopicRelax){
      const tKeys = inferTopicKeys(cand, subj);
      if(tKeys.some(k=>examTopicsUsed.has(k))) return true;
    }
    return false;
  };
  const isTopicConflict=(cand, kindKey='')=>{
    if(isGlobalDup(cand, true)) return true;
    return hasArchetypeConflict(cand, kindKey, false);
  };
  const markTopicUsed=(cand, secSet, kindKey='')=>{
    const sig=normalizeTemplateSig(cand.q);
    examQuestionsUsed.add(cand.q);
    examSigsUsed.add(sig);
    if(extQuestions) extQuestions.add(cand.q);
    if(extSigs) extSigs.add(sig);
    inferTopicKeys(cand,subj).forEach(k=>{examTopicsUsed.add(k);if(secSet)secSet.add(k);});
    inferArchetypeKeys(cand,subj,kindKey).forEach(k=>examArchetypesUsed.add(k));
  };

  const pullBank=(kindKey, count, title)=>{
    if(count<=0)return;
    const qs=[];
    const secTopicsUsed=new Set();
    // 建立由簡單到困難的遞增難度梯度（前段 easy -> 中段 mid -> 後段 hard）
    const getStepDiff=(idx)=>{
      if(diff!=='mix') return diff;
      if(count<=1) return 'mid';
      const ratio=idx/(count-1);
      return ratio<0.34?'easy':(ratio<0.74?'mid':'hard');
    };

    const uIdxs = (cfg.unitIndices&&cfg.unitIndices.length) ? cfg.unitIndices : [0,1,2,3];
    const allUnitsCount = cfg.allUnitsCount || 4;
    const isUnitSubset = !!(cfg.unitIndices && cfg.unitIndices.length && cfg.allUnitsCount && cfg.unitIndices.length < cfg.allUnitsCount);

    const sortByDiffPref = (arr, targetD) => {
      if(!arr.length) return [];
      const order = targetD==='easy' ? ['easy', undefined, 'mid', 'hard']
                  : targetD==='hard' ? ['hard', 'mid', undefined, 'easy']
                  : ['mid', undefined, 'easy', 'hard'];
      const buckets = new Map(order.map(k => [k, []]));
      arr.forEach(r => {
        const k = buckets.has(r.diff) ? r.diff : undefined;
        buckets.get(k).push(r);
      });
      return order.flatMap(k => shuffle(buckets.get(k)));
    };

    if(subj==='數學'){
      const mathBank=(EXAM_BANK['數學']&&(EXAM_BANK['數學'][tier]||EXAM_BANK['數學'].all))||{};
      const mathBKey=kindKey==='calc'?'prac':(kindKey==='word'?'read':kindKey);
      const mathStaticAll = (mathBank[mathBKey]||[]).filter(r=>isMathItemAllowedForUnits(r, g, cfg.sem, uIdxs));
      for(let i=0;i<count;i++){
        const effD=getStepDiff(i);
        const mathStaticPool = sortByDiffPref(mathStaticAll, effD);
        let item=null;
        // 第一輪：指定單元專屬題型 + 靜態出版社補充（嚴格單元過濾＋硬性全卷零重複題型原型）
        for(let tr=0;tr<60;tr++){
          const uPick=uIdxs[(i+tr)%uIdxs.length];
          const uStep=Math.floor(tr/uIdxs.length);
          const cand=genMathForUnit(g,cfg.sem,uPick,effD,kindKey,i+uStep+randSeed);
          if(cand && isMathItemAllowedForUnits(cand, g, cfg.sem, uIdxs) && !isTopicConflict(cand, kindKey)){item=cand;break;}
        }
        // 第一之二輪：優先從該單元專屬靜態題庫（鼎甲/良品/奇鼎）挑選不重複題型原型
        if(!item && mathStaticPool.length){
          const stCand=mathStaticPool.find(r=>!isTopicConflict(r, kindKey));
          if(stCand) item={...stCand};
        }
        // 第二輪：多變化結構題庫 genMathUnitSynth（嚴格掃描所有變化索引＋單元過濾＋硬性禁止同卷同題型原型＆跨張同版型）
        if(!item){
          for(let tr=0;tr<120;tr++){
            const uPick=uIdxs[(i+tr)%uIdxs.length];
            const uStep=Math.floor(tr/uIdxs.length);
            const dTry=['easy','mid','hard'][tr%3];
            const cand=genMathUnitSynth(g,cfg.sem,uPick,dTry,kindKey,uStep+randSeed);
            if(cand && isMathItemAllowedForUnits(cand, g, cfg.sem, uIdxs) && !isGlobalDup(cand,true) && !hasArchetypeConflict(cand, kindKey, true)){item=cand;break;}
          }
        }
        // 第三輪：跨題型多變化數學題庫 genMathVariety（先試指定難度，未足再補掃各難度共 288 槽位，嚴格鎖定單元過濾與零重複原型）
        if(!item){
          const dOrders=[effD,...['easy','mid','hard'].filter(x=>x!==effD)];
          for(const dTry of dOrders){
            if(item) break;
            for(let k=0;k<96;k++){
              const cand=genMathVariety(g,cfg.sem,dTry,kindKey,k+i+randSeed);
              if(cand && isMathItemAllowedForUnits(cand, g, cfg.sem, uIdxs) && !isGlobalDup(cand,true) && !hasArchetypeConflict(cand, kindKey, true)){item=cand;break;}
            }
          }
        }
        // 第四輪：補足掃描 genMathUnitSynth / genMathVariety / genMathForUnit / 靜態出版社庫（嚴格鎖定：單元合格＋跨張不重版型 checkSig＋單張零重複 SVG 圖形原型！）
        if(!item){
          for(let tr=0;tr<240&&!item;tr++){
            const uPick=uIdxs[tr%uIdxs.length];
            const uStep=Math.floor(tr/uIdxs.length);
            const dTry=['easy','mid','hard'][tr%3];
            const cand = tr < 96
              ? genMathUnitSynth(g,cfg.sem,uPick,dTry,kindKey,uStep+randSeed+tr)
              : (tr < 192
                ? genMathVariety(g,cfg.sem,dTry,kindKey,(tr-96)+i+randSeed)
                : genMathForUnit(g,cfg.sem,uPick,dTry,kindKey,uStep+randSeed+tr));
            if(!cand || !isMathItemAllowedForUnits(cand, g, cfg.sem, uIdxs)) continue;
            const svgA = inferSvgArchetype(cand.svg);
            if(svgA && examArchetypesUsed.has('arch_' + svgA)) continue;
            if(!isGlobalDup(cand,true)){item=cand;break;}
          }
        }
        if(!item && mathStaticPool.length){
          const stCand=mathStaticPool.find(r=>{
            const svgA=inferSvgArchetype(r.svg);
            return (!svgA || !examArchetypesUsed.has('arch_'+svgA)) && !isGlobalDup(r,true);
          });
          if(stCand) item={...stCand};
        }
        if(!item && !isUnitSubset){
          for(let k=0;k<48;k++){
            const cand=genMath(g,effD,kindKey,i*3+k+randSeed);
            const svgA=cand?inferSvgArchetype(cand.svg):null;
            if(svgA && examArchetypesUsed.has('arch_'+svgA)) continue;
            if(cand && isMathItemAllowedForUnits(cand, g, cfg.sem, uIdxs) && !isGlobalDup(cand,true)){item=cand;break;}
          }
        }
        // 最終保底（優先嘗試不撞版型簽名 + 僅限勾選單元本身，仍硬性拒絕同張 SVG 圖形題型重複！）
        if(!item){
          for(let tr=0;tr<120;tr++){
            const uPick=uIdxs[(i+tr)%uIdxs.length];
            const cand=tr%2===0
              ? genMathUnitSynth(g,cfg.sem,uPick,['easy','mid','hard'][tr%3],kindKey,i*7+tr+randSeed+53)
              : genMathForUnit(g,cfg.sem,uPick,effD,kindKey,i*7+tr+randSeed+53);
            if(!cand || !isMathItemAllowedForUnits(cand, g, cfg.sem, uIdxs)) continue;
            const svgA = inferSvgArchetype(cand.svg);
            if(svgA && examArchetypesUsed.has('arch_' + svgA)) continue;
            if(!isGlobalDup(cand, tr < 90)){item=cand;break;}
          }
        }
        if(item){
          if(item.opts && Array.isArray(item.opts)) item={...item,opts:shuffle(item.opts)};
          if(item.pairs){const sh=shuffle(item.pairs.map(p=>p[1]));item={...item,right:sh};}
          item._diff=effD;
          item._broadCat=inferBroadCategory(item,subj,kindKey);
          item._dScore=calcQuestionDifficulty(item,subj,kindKey,effD);
          markTopicUsed(item, secTopicsUsed, kindKey);
          qs.push(item);
        }
      }
    }else{
      const bank=(EXAM_BANK[subj]&&(EXAM_BANK[subj][tier]||EXAM_BANK[subj].all))||{};
      const bankKey=kindKey==='calc'?'prac':(kindKey==='word'?'read':kindKey);
      const rawList = bank[bankKey] || [];
      for(let i=0;i<count;i++){
        const effD=getStepDiff(i);
        let chosen=null;

        const unitFiltered = rawList.filter(r=>matchesUnitTopics(r,subj,g,cfg.sem,uIdxs,allUnitsCount));
        const unitList = sortByDiffPref(unitFiltered, effD);

        const tryDynamic=()=>{
          for(let tr=0;tr<40;tr++){
            let d=null;
            if(subj==='國語'&&(kindKey==='mc'||kindKey==='fill'||kindKey==='tf'||kindKey==='calc'||kindKey==='word'||kindKey==='match')) d=genChineseDynamic(g,kindKey,effD,cfg.units,isUnitSubset);
            else if(subj==='英語'&&kindKey!=='word') d=genEngProc(g,kindKey,effD,uIdxs,isUnitSubset);
            else if(subj==='生活'||subj==='自然科學'||subj==='社會') d=genFactProc(subj,g,kindKey,effD,cfg.sem,uIdxs,isUnitSubset);
            if(d && (subj==='國語' || !isUnitSubset || matchesUnitTopics(d,subj,g,cfg.sem,uIdxs,allUnitsCount)) && !isTopicConflict(d, kindKey)) return d;
          }
          return null;
        };

        const tryStatic=()=>{
          const avail=unitList.filter(r=>!isTopicConflict(r, kindKey));
          return avail.length?avail[0]:null;
        };

        const tryUnitSpecific=(strictSig=true)=>{
          for(let tr=0;tr<44;tr++){
            const uPick=uIdxs[(i+tr)%uIdxs.length];
            const cand=genCurriculumUnitQuestion(subj,g,cfg.sem,uPick,kindKey,effD,i+tr+randSeed,cfg.units);
            if(cand && !isGlobalDup(cand,strictSig) && !hasArchetypeConflict(cand, kindKey, !strictSig)) return cand;
          }
          return null;
        };

        if(isUnitSubset){
          chosen = (i%2===0)
            ? (tryUnitSpecific(true)||tryDynamic()||tryStatic()||tryUnitSpecific(false))
            : (tryStatic()||tryUnitSpecific(true)||tryDynamic()||tryUnitSpecific(false));
        }else if(i%2===0){
          chosen=tryDynamic()||tryStatic()||tryUnitSpecific(true)||tryUnitSpecific(false);
        }else{
          chosen=tryStatic()||tryDynamic()||tryUnitSpecific(true)||tryUnitSpecific(false);
        }
        if(!chosen){
          const unusedStatic=unitList.find(r=>!isGlobalDup(r,true) && !hasArchetypeConflict(r, kindKey, true)) || unitList.find(r=>!isGlobalDup(r,false));
          if(unusedStatic) chosen=unusedStatic;
        }
        if(chosen){
          let item=chosen.opts?{...chosen,opts:shuffle(chosen.opts)}:{...chosen};
          if(chosen.pairs){const sh=shuffle(chosen.pairs.map(p=>p[1]));item={...item,right:sh};}
          attachMatchingSvg(item, subj, g);
          if(subj !== '數學' && item.svg){
            const decoA = 'deco_' + inferSvgArchetype(item.svg);
            if(examArchetypesUsed.has(decoA)) delete item.svg;
            else examArchetypesUsed.add(decoA);
          }

          item._diff=effD;
          item._broadCat=inferBroadCategory(item,subj,kindKey);
          item._dScore=calcQuestionDifficulty(item,subj,kindKey,effD);
          markTopicUsed(item, secTopicsUsed, kindKey);
          qs.push(item);
        }
      }
    }

    // 強制排序：每一大題內部以及同一概念題組達 2 題以上時，難易度一律「由簡單到困難」遞增排列
    qs.sort((a,b)=>a._dScore - b._dScore);
    if(qs.length)sections.push({kind:kindKey,title,qs});
  };

  pullBank('mc', cfg.nMc, getExamSectionTitle(subj,'mc'));
  pullBank('tf', cfg.nTf, getExamSectionTitle(subj,'tf'));
  pullBank('fill', cfg.nFill, getExamSectionTitle(subj,'fill'));
  pullBank('match', cfg.nMatch, getExamSectionTitle(subj,'match'));
  pullBank('calc', cfg.nCalc, getExamSectionTitle(subj,'calc'));
  pullBank('word', cfg.nWord, getExamSectionTitle(subj,'word'));

  assignScores(sections);
  const CN=['一','二','三','四','五','六'];
  sections.forEach((s,i)=>{
    const same=s.qs.every(q=>q.pts===s.qs[0].pts);
    const ptsDesc=same?`每題 ${s.qs[0].pts} 分，共 ${s.ptsTotal} 分`:`共 ${s.ptsTotal} 分`;
    s.heading=`${CN[i]}、${s.title}（${ptsDesc}）`;
  });
  return {meta:cfg, sections};
}

function assignScores(sections){
  const active = sections.filter(s=>s.qs && s.qs.length);
  if(!active.length) return;
  const W={mc:3,tf:2,fill:3,match:6,calc:4,word:6};
  const sumW = active.reduce((a,s)=>a + s.qs.length*(W[s.kind]||3), 0);

  // 第一優先：透過動態規劃尋找「每大題內題題同分且整數配分、總分嚴格等於 100 分」的最佳配分組合
  const dp = new Array(active.length+1).fill(null).map(()=>new Map());
  dp[0].set(0, {cost:0, pts:[]});
  active.forEach((sec, idx)=>{
    const n = sec.qs.length;
    const ideal = Math.max(1, (W[sec.kind]||3)*100/Math.max(1,sumW));
    const maxP = Math.min(25, Math.max(10, Math.ceil(100/n)));
    const curMap = dp[idx], nextMap = dp[idx+1];
    curMap.forEach((state, curSum)=>{
      for(let p=1; p<=maxP; p++){
        const ns = curSum + n*p;
        if(ns > 100) break;
        const niceBonus = (p===2||p===3||p===4||p===5||p===6||p===8||p===10) ? 0 : 0.35;
        const cost = state.cost + n*Math.pow(p-ideal, 2) + niceBonus;
        const prev = nextMap.get(ns);
        if(!prev || cost < prev.cost){
          nextMap.set(ns, {cost, pts:[...state.pts, p]});
        }
      }
    });
  });

  const exact = dp[active.length].get(100);
  if(exact){
    active.forEach((sec, i)=>{
      const p = exact.pts[i];
      sec.qs.forEach(q=>{ q.pts = p; });
      sec.ptsTotal = sec.qs.length * p;
    });
    return;
  }

  // 保底：若手動勾選之題數最大公因數不整除 100，尋找最接近 100 之均勻配分後僅微調最後極少數題目
  let bestSum = -1, bestState = null;
  dp[active.length].forEach((state, s)=>{
    if(!bestState || Math.abs(100-s) < Math.abs(100-bestSum) || (Math.abs(100-s)===Math.abs(100-bestSum) && state.cost < bestState.cost)){
      bestSum = s; bestState = state;
    }
  });
  let all = [];
  if(bestState){
    active.forEach((sec, i)=>{
      const p = bestState.pts[i];
      sec.qs.forEach(q=>{ q.pts = p; all.push(q); });
    });
  }else{
    active.forEach(sec=>sec.qs.forEach(q=>{ q.pts = Math.max(1, Math.round((W[sec.kind]||3)*100/sumW)); all.push(q); }));
  }
  let assigned = all.reduce((a,q)=>a+q.pts, 0);
  let diff = 100 - assigned, idx = all.length - 1;
  while(diff !== 0){
    const step = diff > 0 ? 1 : -1;
    if(all[idx].pts + step >= 1){ all[idx].pts += step; diff -= step; }
    idx = (idx - 1 + all.length) % all.length;
  }
  active.forEach(s=>{ s.ptsTotal = s.qs.reduce((a,q)=>a+q.pts, 0); });
}

let curExam=null;

// ===== 4. 彈性排版引擎（依題數自動微調字級與間距，盡可能填滿兩頁）=====
const DENSITIES=[
  {name:'relaxed',fs:15.5,lh:1.50,gap:12,calcH:38,wordH:54,cpl2:19,cpl1:40},
  {name:'normal', fs:14.0,lh:1.42,gap:8, calcH:28,wordH:42,cpl2:21,cpl1:45},
  {name:'compact',fs:12.8,lh:1.34,gap:5, calcH:22,wordH:32,cpl2:24,cpl1:50},
  {name:'tight',  fs:11.6,lh:1.25,gap:3, calcH:18,wordH:26,cpl2:26,cpl1:54}
];

function layoutAtDensity(exam, D){
  const {meta, sections}=exam;
  const twoCol=meta.layout==='2col';
  const cpl=twoCol?D.cpl2:D.cpl1;
  const lineH=D.fs*D.lh;
  const blocks=[];
  sections.forEach(sec=>{
    blocks.push({type:'sec',h:D.fs*1.6+10,text:sec.heading,kind:sec.kind});
    sec.qs.forEach((q,idx)=>{
      const lines=Math.ceil(q.q.length/cpl)+(q.q.match(/\n/g)||[]).length;
      let h=lines*lineH+D.gap+4+(q.svg?56:0);
      if(sec.kind==='mc'){
        const optLen=q.opts.reduce((a,o)=>a+o.length+5,0);
        h+=Math.ceil(optLen/(cpl*1.1))*(D.fs*1.35)+2;
      }else if(sec.kind==='match'){
        h+=q.pairs.length*(D.fs*1.45)+12;
      }else if(sec.kind==='calc'){
        h+=D.calcH+4;
      }else if(sec.kind==='word'){
        h+=D.wordH+4;
      }
      blocks.push({type:'q',h,num:idx+1,kind:sec.kind,item:q});
    });
  });

  // 分配至頁與欄（雙欄時先左欄後右欄）
  const pages=[];
  const cap=(p)=> (p===0?940:1040);
  const colsPerPage=twoCol?2:1;
  let p=0, c=0, h=0, curCols=[[],[]];
  const pushPage=()=>{pages.push(twoCol?curCols:[curCols[0]]);p++;c=0;h=0;curCols=[[],[]];};
  blocks.forEach((b,bi)=>{
    const maxH=cap(p);
    // 避免大題標題孤立在欄底
    const nextH=(b.type==='sec'&&blocks[bi+1])?blocks[bi+1].h:0;
    if(h+b.h+nextH>maxH && curCols[c].length>0){
      if(c+1<colsPerPage){c++;h=0;}else{pushPage();}
    }
    curCols[c].push(b);h+=b.h;
  });
  if(curCols[0].length||curCols[1].length)pages.push(twoCol?curCols:[curCols[0]]);
  // 若雙欄模式最後一頁僅左欄有題目，依高度均分至左右兩欄讓版面更平衡
  if(twoCol&&pages.length){
    const last=pages[pages.length-1];
    if(last[0].length>=4&&last[1].length===0){
      const totH=last[0].reduce((a,b)=>a+b.h,0);
      let acc=0, cut=Math.ceil(last[0].length/2);
      for(let i=0;i<last[0].length;i++){
        acc+=last[0][i].h;
        if(acc>=totH*0.5&&last[0][i].type!=='sec'){cut=i+1;break;}
      }
      if(cut>0&&cut<last[0].length){last[1]=last[0].slice(cut);last[0]=last[0].slice(0,cut);}
    }
  }
  return {D, pages};
}

function chooseBestLayout(exam){
  if(exam.meta.layout==='1col') return layoutAtDensity(exam,DENSITIES[0]); // 單欄永遠維持大字體（15.5px）
  const two=$('exTwoPage').checked;
  const res=DENSITIES.map(D=>layoutAtDensity(exam,D));
  if(two){
    const fit2=res.find(r=>r.pages.length<=2);
    return fit2||res[res.length-1];
  }
  return res[1];
}

function updateCapInfo(pagesCount, ansPagesCount=null){
  if(curExam&&pagesCount!=null)curExam._lastPageCount=pagesCount;
  const total=curExam && curExam.sections
    ? curExam.sections.reduce((a,s)=>a+s.qs.length,0)
    : ($('chkMc').checked*+$('numMc').value + $('chkTf').checked*+$('numTf').value +
       $('chkFill').checked*+$('numFill').value + $('chkMatch').checked*+$('numMatch').value +
       $('chkCalc').checked*+$('numCalc').value + $('chkWord').checked*+$('numWord').value);
  const two=$('exTwoPage').checked;
  const isWarn=two&&pagesCount>2;
  const fillPct = curExam && curExam._lastPageFill ? Math.round(curExam._lastPageFill*100) : 0;
  const fillTag = fillPct ? `・末頁填滿約 ${fillPct}%` : '';
  const ansCnt = ansPagesCount != null ? ansPagesCount : 1;
  const cls='cap-banner '+(isWarn?'warn':'ok');
  const msg=pagesCount==null
    ? `📋 目前設定共 ${total} 題`
    : (isWarn
      ? `⚠️ 超出兩頁範圍！目前設定共 ${total} 題，預覽達 ${pagesCount} 頁（超過正反一張紙），請減少題數或切換雙欄！`
      : `✅ 版面均衡：目前共 ${total} 題（總分 100 分），試卷 ${pagesCount} 頁${two?'（正反雙面）':''}${fillTag}${curExam&&curExam.meta.withAns?` ＋ 解答 ${ansCnt} 頁`:''}`);
  ['exCapInfo','exCapInfo2'].forEach(id=>{
    const el=$(id); if(!el)return;
    el.className=cls; el.textContent=msg;
  });
}
// 題目高度快取：同一題目物件在不同密度下的實測高度只量一次，
// 排版微調（增減題）時可跳過 90% 以上的 DOM 建構與量測。
const __qHCache=new WeakMap();
function __qHeightMap(q){
  let m=__qHCache.get(q);
  if(!m){ m=Object.create(null); __qHCache.set(q,m); }
  return m;
}
function renderExam(measureOnly=false){
  const box=$('examSheet');
  if(!measureOnly) box.innerHTML='';
  if(!curExam||!curExam.sections.length){if(!measureOnly){box.innerHTML='<p class="hint">請先選擇科目與題數並點擊「依設定產生測驗卷」。</p>';updateCapInfo(0);}return;}
  const {meta, sections}=curExam;
  const {D}=chooseBestLayout(curExam);
  const twoCol=meta.layout==='2col';
  const diffName={easy:'基礎熟練',mid:'標準評量',hard:'素養挑戰',mix:'混合難度（由淺入深）'}[meta.diff]||'標準評量';
  const pubName=CURR_META.pubs[meta.pub]||meta.pub;
  const unitsText=meta.units.length?meta.units.join('、'):'全冊綜合複習';
  const isZh=meta.subject==='國語';

  if(!measureOnly){
    let st=$('examPrintStyle');if(!st){st=document.createElement('style');st.id='examPrintStyle';document.head.appendChild(st);}
    st.textContent=isZh?'@media print{@page{size:A4 landscape;margin:0}}':'@media print{@page{size:A4 portrait;margin:0}}';
    if($('btnExXlsx'))$('btnExXlsx').textContent=isZh?'📊 匯出 Excel（A4 橫式直書）':'📊 匯出 Excel（A4 直式）';
  }

  const optLabels=meta.subject==='英語'?['(A)','(B)','(C)','(D)']:['①','②','③','④'];
  const matchLabels='ㄅㄆㄇㄈㄉㄊㄋㄌ';
  const makeQEl=(b,zhMode)=>{
    const kind=b.kind, q=b.item;
    const d=document.createElement('div');d.className=zhMode?'ex-zh-q':'ex-q';
    const brk=zhMode?'︵　　︶':'(　　)';
    const noRaw=zhMode?`<span class="tcy">${b.num}.</span>`:`${b.num}.`;
    const noText=(kind==='mc'||kind==='tf')?`${noRaw} ${brk}`:noRaw;
    const rawFullQ = normSubNums(String(q.q || '').trimEnd());
    // 英語科：若英文題尾附有中文翻譯（...），抽離成獨立下行提示，避免句點或右引號孤立掉行
    const engHintM = (meta.subject === '英語')
      ? rawFullQ.match(/^([\s\S]*?[A-Za-z0-9."'?!）)])\s*[（(]([^()（）]*[\u4e00-\u9fff][^()（）]*)[）)]\s*$/)
      : null;
    const rawQ = engHintM ? engHintM[1].trimEnd() : rawFullQ;
    const engZhHint = engHintM ? engHintM[2].trim() : '';
    const ptsTag = `<span class="qpts">（${q.pts}分）</span>`;
    // 防止括弧與配分標籤（5分）單獨掉落換行：將最後一詞（含括弧＋句尾標點）與配分緊密黏合
    const glueTailMatch = rawQ.match(/^(.*?)((?:[^\s\n])?[（(][\s　]*[）)][？。！：.,!?]?|[^\s\n]{1,2}[？。！：.,!?]?)$/);
    let qHtml = '';
    if(glueTailMatch && glueTailMatch[1]){
      qHtml = `${rubyHtml(glueTailMatch[1])}<span class="qend-glue">${rubyHtml(glueTailMatch[2])}${ptsTag}</span>`;
    }else if(rawQ.length >= 2){
      const headPart = rawQ.slice(0, -1);
      const tailChar = rawQ.slice(-1);
      qHtml = `${rubyHtml(headPart)}<span class="qend-glue">${rubyHtml(tailChar)}${ptsTag}</span>`;
    } else {
      qHtml = `<span class="qend-glue">${rubyHtml(rawQ)}${ptsTag}</span>`;
    }
    // 同時將題幹中間的作答括弧與前後1字緊黏，避免括弧在句末孤立斷行
    qHtml = qHtml.replace(/([^>])(<span class="h-blank">[^<]+<\/span>)([？。！：，、；]?)/g, '$1<span class="qblank-glue">$2$3</span>');
    let body=`<div class="qt">${qHtml}</div>`;
    if(engZhHint) body+=`<div class="qt-zh-hint">（${esc(engZhHint)}）</div>`;
    if(q.svg) body+=`<div class="ex-svg">${q.svg}</div>`;
    if(kind==='mc'){
      body+=`<div class="qopts">${q.opts.map((o,i)=>`<span class="qopt"><span class="opt-lbl">${optLabels[i]}</span><span class="opt-txt">${rubyHtml(o)}</span></span>`).join('')}</div>`;
    }else if(kind==='match'){
      const rows=q.pairs.map((p,i)=>`<div><b>(${i+1})</b> <span class="h-blank">（　　）</span>${rubyHtml(p[0])}</div><div><b>${matchLabels[i]}</b> ${rubyHtml(q.right[i])}</div>`).join('');
      body+=`<div class="ex-match">${rows}</div>`;
    }else if(kind==='calc'||kind==='word'){
      body+=`<div class="qbox ${kind}"></div>`;
    }
    const hasBrk=(kind==='mc'||kind==='tf');
    d.innerHTML=`<div class="qno${hasBrk?' has-brk':''}">${noText}</div><div class="qbody">${body}</div>`;
    return d;
  };

  if(isZh){
    // 國語科：改採真實國小考卷「上下雙排直書」欄流（由大至小嘗試字級，讓 2 頁剛好填滿無半欄留白）
    const useZy=$('exRuby')&&$('exRuby').checked&&window.ZY_DATA;
    const mainX=useZy?14:21;
    const zhCandFs=($('exTwoPage')&&$('exTwoPage').checked)?[15.2, 14.4, 13.6, 12.8, 12.0]:[14.4, 13.6, 12.8];
    let zhFs=zhCandFs[0], zhPages=[], zhPageFills=[], maxW=860;
    for(const _candFs of zhCandFs){
      zhFs=_candFs;
      const tierMaxH = 342;
      const maxColUnits=Math.floor((tierMaxH/zhFs)*22*0.92); // 單排內（約342px高）可容納之 SVG 高度單位

    const packCols=(cells, indentUnits=0)=>{
      const cols=[]; let cur=[], h=0;
      const startCol=(withIndent)=>{
        cur=[]; h=0;
        if(withIndent&&indentUnits>0){cur.push(gCellSpace(indentUnits));h+=indentUnits;}
      };
      startCol(false);
      cells.forEach(c=>{
        if(c.newline){if(cur.length)cols.push(cur);startCol(true);return;}
        if(c.isScore || c.isClosePunc){
          // 配分標籤、作答括號與句尾閉括號／標點絕不單獨開出新欄：微超則緊貼欄底，否則帶上前一字／括弧一起轉至次欄
          if(h+c.h <= maxColUnits+36 || cur.length <= (indentUnits>0?2:1)){
            cur.push(c);h+=c.h;return;
          }
          const carry=[];
          if(cur.length) carry.unshift(cur.pop());
          if(carry[0] && (carry[0].isBlank || carry[0].isClosePunc) && cur.length > (indentUnits>0?1:0)){
            carry.unshift(cur.pop());
          }
          cols.push(cur);startCol(true);
          carry.forEach(x=>{cur.push(x);h+=x.h;});
          cur.push(c);h+=c.h;return;
        }
        if(c.isBlank && h+c.h > maxColUnits && cur.length > (indentUnits>0?1:0)){
          cols.push(cur);startCol(true);
        }else if(h+c.h>maxColUnits&&cur.length>(indentUnits>0?1:0)){
          cols.push(cur);startCol(true);
        }
        cur.push(c);h+=c.h;
      });
      if(cur.length)cols.push(cur);
      return cols;
    };

    const buildZhQ=b=>{
      const kind=b.kind, q=b.item;
      const wrap=document.createElement('div');wrap.className='ex-zh-q';
      const headCells=[gCellLabel(`${b.num}.`,true,'#111',15,mainX)];
      if(kind==='mc'||kind==='tf'){
        headCells.push(gCellBlank(52,mainX));
      }
      const indentH=headCells.reduce((a,c)=>a+c.h,0);

      if(kind==='match'){
        const stemCells=[...headCells,...tokenizeZhCells(normSubNums(q.q),useZy,mainX),gCellScore(q.pts,mainX)];
        const allCols=[...packCols(stemCells,indentH)];
        q.pairs.forEach((pr,i)=>{
          const pCells=[
            gCellSpace(12),
            gCellLabel(`(${i+1})`,true,'#111',13.5,mainX),
            gCellBlank(50,mainX),
            ...tokenizeZhCells(pr[0],useZy,mainX),
            gCellSpace(14),
            gCellLabel(matchLabels[i],true,'#7a3b00',15,mainX),
            ...tokenizeZhCells(q.right[i],useZy,mainX)
          ];
          allCols.push(pCells);
        });
        allCols.forEach(col=>{
          const cd=document.createElement('div');cd.className='ex-zh-col';
          cd.innerHTML=col.map(c=>c.svg).join('');
          wrap.appendChild(cd);
        });
        return {el:wrap, colCount:allCols.length};
      }

      const bodyCells=[...headCells,...tokenizeZhCells(normSubNums(q.q),useZy,mainX),gCellScore(q.pts,mainX)];
      const qCols=packCols(bodyCells, indentH);

      if(kind==='mc'){
        const optCells=[gCellSpace(indentH)];
        q.opts.forEach((o,i)=>{
          optCells.push(gCellLabel(optLabels[i],true,'#111',15,mainX));
          optCells.push(...tokenizeZhCells(o,useZy,mainX));
          if(i<q.opts.length-1)optCells.push(gCellSpace(10));
        });
        qCols.push(...packCols(optCells,indentH));
      }

      qCols.forEach(col=>{
        const cd=document.createElement('div');cd.className='ex-zh-col';
        cd.innerHTML=col.map(c=>c.svg).join('');
        wrap.appendChild(cd);
      });
      let extraCols=0;
      if(kind==='calc'||kind==='word'){
        const ansLen = String(q.a || '').replace(/\s+/g,'').length;
        const isLong = kind==='word' && (ansLen > 10 || /造句|仿寫|短文|改寫|心得|為什麼|請寫出|舉例|說明|理由/.test(q.q||''));
        const qb=document.createElement('div');
        qb.className='qbox '+kind+(isLong?' wide':'');
        wrap.appendChild(qb);
        extraCols = isLong ? 2.8 : (kind==='word' ? 2.0 : 1.5);
      }
      return {el:wrap, colCount:qCols.length+extraCols};
    };

    const flat=[];
    sections.forEach(sec=>{
      flat.push({type:'sec',text:sec.heading,cols:1.3});
      sec.qs.forEach((q,idx)=>{
        const b={type:'q',num:idx+1,kind:sec.kind,item:q};
        const zMap=__qHeightMap(q);
        const zKey='zh:'+zhFs+'|'+b.num+'|'+(useZy?1:0);
        let built=zMap[zKey];
        if(!built){ built=buildZhQ(b); zMap[zKey]=built; }
        b.el=built.el; b.cols=built.colCount;
        flat.push(b);
      });
    });

    // 以隱藏之真實「上下雙排」單排容器量測每一大題與每一題實際像素寬度
    const meas=document.createElement('div');
    meas.className='a4 exam-a4 ex-land';
    meas.style.cssText='position:absolute;left:-9999px;top:0;visibility:hidden';
    const mwOuter=document.createElement('div');mwOuter.className='ex-zh-tiers';
    const mw=document.createElement('div');mw.className='ex-zh-tier';
    mw.style.setProperty('--ex-fs',zhFs+'px');
    const zhGrade=['','一','二','三','四','五','六'][+meta.grade]||meta.grade;
    const hdM=document.createElement('div');hdM.className='ex-zh-hd';
    hdM.innerHTML=zhFormat(`<div><h3>國小${zhGrade}年級${meta.sem}學期　國語科評量試卷</h3><div class="ex-sub">總分100分｜${pubName}｜${diffName}</div></div>
      <div class="ex-zh-info"><span>班級：　　年　　班</span><span>座號：　　</span><span>姓名：　　　　</span><span>得分：　　</span></div>`);
    mw.appendChild(hdM);mwOuter.appendChild(mw);meas.appendChild(mwOuter);document.body.appendChild(meas);
    maxW=mw.clientWidth-38;
    const hdW=hdM.getBoundingClientRect().width+12;

    const pendZh=[];
    flat.forEach(b=>{
      if(b.type==='sec'){
        const d=document.createElement('div');d.className='ex-zh-sec';d.innerHTML=zhFormat(esc(b.text));
        mw.appendChild(d); pendZh.push([b,d,null,null]);
      }else{
        const wMap=__qHeightMap(b.item);
        const wKey='w:'+zhFs+'|'+b.num;
        if(wMap[wKey]!=null){ b.pxW=wMap[wKey]; return; }
        mw.appendChild(b.el); pendZh.push([b,b.el,wMap,wKey]);
      }
    });
    // 一次性讀取寬度：先全部寫入 DOM，再統一讀取，避免每題觸發強制重排
    for(let pi=0; pi<pendZh.length; pi++){
      const pz=pendZh[pi];
      const w=pz[1].getBoundingClientRect().width+7;
      pz[0].pxW=w;
      if(pz[2]) pz[2][pz[3]]=w;
    }
    document.body.removeChild(meas);

    // 依「第1頁上排 → 第1頁下排 → 第2頁上排 → 第2頁下排...」順序拆排
    const tiers=[]; let cur=[], wUsed=hdW;
    const tierUsedW=[];
    flat.forEach((b,bi)=>{
      const nextW=(b.type==='sec'&&flat[bi+1])?flat[bi+1].pxW:0;
      if(wUsed+b.pxW+nextW > maxW && cur.length){
        tiers.push(cur); tierUsedW.push(wUsed);
        cur=[]; wUsed=0;
      }
      cur.push(b);wUsed+=b.pxW;
    });
    if(cur.length){tiers.push(cur); tierUsedW.push(wUsed);}

    // 將雙排組成 A4 頁（每頁 2 排：上排＋下排）
    zhPages=[];
    zhPageFills=[];
    for(let tIdx=0; tIdx<tiers.length; tIdx+=2){
      const topItems = tiers[tIdx] || [];
      const botItems = tiers[tIdx+1] || [];
      const topW = tierUsedW[tIdx] || 0;
      const botW = tierUsedW[tIdx+1] || 0;
      zhPages.push({top:topItems, bot:botItems, topW, botW});
      zhPageFills.push(maxW>0 ? Math.min(1, (topW+botW)/(2*maxW)) : 1);
    }
    if(zhPages.length<=2) break;
    } // end zhCandFs loop
    curExam._zhPages=zhPages;
    curExam._lastPageFill = zhPageFills[zhPageFills.length-1] || 0;
    const lastZhPg = zhPages[zhPages.length-1];
    curExam._lastTailFill = (lastZhPg && maxW>0) ? Math.min(1, lastZhPg.botW / maxW) : 0;
    curExam._pageFills = zhPageFills;
    curExam._lastPageCount = zhPages.length;
    if(measureOnly) return;
    const totZ=zhPages.length+(meta.withAns?1:0);
    updateCapInfo(zhPages.length);

    zhPages.forEach((pgObj,p)=>{
      const cap=document.createElement('div');cap.className='pcap';
      cap.textContent=`A4 橫式上下雙排直書（由右至左）　第 ${p+1} / ${totZ} 頁`;box.appendChild(cap);
      const pg=document.createElement('div');pg.className='a4 exam-a4 ex-land';
      pg.appendChild(Object.assign(document.createElement('div'),{className:'edge'}));
      const outer=document.createElement('div');outer.className='ex-zh-tiers';
      outer.style.setProperty('--ex-fs',zhFs+'px');

      const buildTierEl=(items, usedW, isFirstTop)=>{
        const tierEl=document.createElement('div');
        tierEl.className='ex-zh-tier '+(isFirstTop?'top':'bot');
        const spareW=Math.max(0,(maxW-14)-usedW);
        const qCount=Math.max(1,items.filter(b=>b.type==='q').length);
        const itemCnt=Math.max(1,items.length+(isFirstTop?1:0));
        if(spareW>14 && items.length>=2){
          const qGap=Math.min(8, 2+(spareW*0.3)/qCount);
          const colGap=Math.min(5, 2+(spareW*0.2)/itemCnt);
          tierEl.style.setProperty('--zh-col-gap',colGap.toFixed(1)+'px');
          tierEl.style.setProperty('--zh-q-gap',qGap.toFixed(1)+'px');
          if(items.some(b=>b.kind==='calc'||b.kind==='word') && spareW>45){
            tierEl.style.setProperty('--zh-box-calc','2.9em');
            tierEl.style.setProperty('--zh-box-word','4.2em');
            tierEl.style.setProperty('--zh-box-word-wide','5.8em');
          }
        }
        if(isFirstTop){
          const zhGradeTop=['','一','二','三','四','五','六'][+meta.grade]||meta.grade;
          const hd=document.createElement('div');hd.className='ex-zh-hd';
          hd.innerHTML=zhFormat(`<div><h3>國小${zhGradeTop}年級${meta.sem}學期　國語科評量試卷</h3><div class="ex-sub">總分100分｜${pubName}｜${diffName}</div></div>
            <div class="ex-zh-info"><span>班級：　　年　　班</span><span>座號：　　</span><span>姓名：　　　　</span><span>得分：　　</span></div>`);
          tierEl.appendChild(hd);
        }
        items.forEach(b=>{
          if(b.type==='sec'){const d=document.createElement('div');d.className='ex-zh-sec';d.innerHTML=zhFormat(esc(b.text));tierEl.appendChild(d);}
          else tierEl.appendChild(b.el);
        });
        return tierEl;
      };

      const topEl=buildTierEl(pgObj.top, pgObj.topW, p===0);
      topEl.classList.add('tier-top');
      const botEl=buildTierEl(pgObj.bot, pgObj.botW, false);
      botEl.classList.add('tier-bot');
      outer.appendChild(topEl);
      outer.appendChild(botEl);
      pg.appendChild(outer);
      // 嚴格防吃邊／防消失校準：實測水平與垂直不溢位，若緊貼邊緣則自動微縮間距與字級
      {
        const fitHost=document.createElement('div');
        fitHost.style.cssText='position:fixed;left:-9999px;top:0;visibility:hidden;z-index:-1';
        fitHost.appendChild(pg);
        document.body.appendChild(fitHost);
        let curZFs=zhFs;
        for(let step=0; step<8; step++){
          const overW = topEl.scrollWidth > topEl.clientWidth || botEl.scrollWidth > botEl.clientWidth;
          const overH = [...topEl.querySelectorAll('.ex-zh-col'), ...botEl.querySelectorAll('.ex-zh-col')].some(c => c.scrollHeight > c.clientHeight + 4);
          if(!overW && !overH) break;
          if(overW){
            [topEl, botEl].forEach(t=>{
              const cg = parseFloat(t.style.getPropertyValue('--zh-col-gap')||'4');
              const qg = parseFloat(t.style.getPropertyValue('--zh-q-gap')||'4');
              t.style.setProperty('--zh-col-gap', Math.max(2, cg * 0.6).toFixed(1)+'px');
              t.style.setProperty('--zh-q-gap', Math.max(2, qg * 0.6).toFixed(1)+'px');
            });
          }
          if(step >= 2 || overH){
            curZFs = +(Math.max(10.2, curZFs - 0.5)).toFixed(1);
            outer.style.setProperty('--ex-fs', curZFs+'px');
          }
        }
        document.body.removeChild(fitHost);
      }
      if(window.createWatermarkLayer)pg.appendChild(window.createWatermarkLayer(1122,794,meta.wmText||''));
      const cpr=window.COPYRIGHT_STATEMENT||'🌻 向日葵國小伴學誌｜108課綱原創練習・專屬訂製請勿轉售';
      pg.appendChild(Object.assign(document.createElement('div'),{className:'cap',textContent:`${cpr}　｜　第 ${p+1} / ${totZ} 頁`}));
      box.appendChild(pg);
    });
  }else{
    // 直式科目：依序嘗試各密度實際 DOM 量測，確保「兩頁一張」時優先縮入兩頁且 100% 不會被切掉
    const candDs=(meta.layout==='1col'||!$('exTwoPage').checked)?[DENSITIES[0]]:DENSITIES;
    let chosenD=candDs[0], pages=[], chosenCapHs=[940,1040];
    for(const candD of candDs){
      const meas=document.createElement('div');
      meas.className='a4 exam-a4';
      meas.style.cssText='position:absolute;left:-9999px;top:0;visibility:hidden';
      const mw=document.createElement('div');mw.className='ex-wrap'+($('exRuby').checked?' has-ruby':'');
      mw.style.setProperty('--ex-fs',candD.fs+'px');mw.style.setProperty('--ex-lh',candD.lh);
      mw.style.setProperty('--ex-gap',candD.gap+'px');
      mw.style.setProperty('--ex-box-calc',candD.calcH+'px');
      mw.style.setProperty('--ex-box-word',candD.wordH+'px');
      const hdM=document.createElement('div');hdM.className='ex-hd';
      hdM.innerHTML=`<h3>國小 ${meta.grade} 年級${meta.sem}學期　${meta.subject}評量試卷（總分 100 分）</h3>
        <div class="ex-sub">版本：${pubName}　｜　難度：${diffName}　｜　範圍：${unitsText}</div>
        <div class="ex-info"><span>班級：____年____班</span><span>座號：____</span><span>姓名：__________</span><span>得分：________</span></div>`;
      mw.appendChild(hdM);
      const colM=document.createElement('div');
      colM.style.width=twoCol?'350px':'734px';
      mw.appendChild(colM);meas.appendChild(mw);document.body.appendChild(meas);
      const hdH=hdM.offsetHeight+12;

      const flat=[];
      const pendV=[];
      const hKey=candD.name+(($('exRuby')&&$('exRuby').checked)?'|r':'');
      sections.forEach(sec=>{
        const se=document.createElement('div');se.className='ex-sec';se.textContent=sec.heading;
        colM.appendChild(se);
        const sb={type:'sec',text:sec.heading,h:0};flat.push(sb);pendV.push([sb,se,10]);
        sec.qs.forEach((q,idx)=>{
          const b={type:'q',num:idx+1,kind:sec.kind,item:q};
          const hMap=__qHeightMap(q);
          const cachedH=hMap[hKey];
          if(cachedH!=null){
            b.h=cachedH;
          }else{
            const qe=makeQEl(b,false);colM.appendChild(qe);
            b.h=0;pendV.push([b,qe,candD.gap+3,hMap,hKey]);
          }
          flat.push(b);
        });
      });
      // 一次性讀取高度：先全部寫入 DOM，再統一量測，避免逐題強制重排
      for(let pi=0; pi<pendV.length; pi++){
        const pv=pendV[pi]; const hh=pv[1].offsetHeight + pv[2];
        if(pv[3]) pv[3][pv[4]]=hh;
        pv[0].h=hh;
      }
      document.body.removeChild(meas);

      const candPages=[], colsPerPage=twoCol?2:1;
      let p=0, c=0, h=0, curCols=[[],[]];
      const capH=pgIdx=> (pgIdx===0?1054-hdH:1054);
      const pushPg=()=>{candPages.push(twoCol?curCols:[curCols[0]]);p++;c=0;h=0;curCols=[[],[]];};
      flat.forEach((b,bi)=>{
        const maxH=capH(p), nextH=(b.type==='sec'&&flat[bi+1])?flat[bi+1].h:0;
        if(h+b.h+nextH>maxH && curCols[c].length>0){
          if(c+1<colsPerPage){c++;h=0;}else{pushPg();}
        }
        curCols[c].push(b);h+=b.h;
      });
      if(curCols[0].length||curCols[1].length)candPages.push(twoCol?curCols:[curCols[0]]);
      if(twoCol&&candPages.length){
        const last=candPages[candPages.length-1];
        const lastMaxH=capH(candPages.length-1);
        const h0=last[0].reduce((a,b)=>a+b.h,0), h1=last[1].reduce((a,b)=>a+b.h,0);
        if((last[0].length>=2&&last[1].length===0) || (last[0].length+last[1].length>=4 && h1<lastMaxH*0.78 && h0>h1*1.28)){
          const merged=[...last[0],...last[1]];
          const totH=merged.reduce((a,b)=>a+b.h,0);
          let acc=0, cut=Math.ceil(merged.length/2);
          for(let i=0;i<merged.length;i++){acc+=merged[i].h;if(acc>=totH*0.48&&merged[i].type!=='sec'){cut=i+1;break;}}
          if(cut>0&&cut<merged.length){last[0]=merged.slice(0,cut);last[1]=merged.slice(cut);}
        }
      }
      chosenD=candD; pages=candPages;
      chosenCapHs = candPages.map((_,idx)=>capH(idx));
      if(pages.length<=2)break;
    }
    curExam._measured={D:chosenD,pages};
    const vFills = pages.map((cols,idx)=>{
      const capTotal = Math.max(1, chosenCapHs[idx]||1054) * cols.length;
      const sumColH = cols.reduce((s,col)=>s+col.reduce((a,b)=>a+b.h,0), 0);
      return Math.min(1, sumColH / capTotal);
    });
    curExam._pageFills = vFills;
    curExam._lastPageFill = vFills[vFills.length-1] || 0;
    const lastCols = pages[pages.length-1] || [];
    const lastCap = chosenCapHs[pages.length-1] || 1054;
    curExam._lastTailFill = lastCols.length
      ? Math.min(1, lastCols[lastCols.length-1].reduce((a,b)=>a+b.h,0) / Math.max(1, lastCap))
      : 0;
    curExam._lastPageCount = pages.length;
    if(measureOnly) return;

    const totalP=pages.length+(meta.withAns?1:0);
    updateCapInfo(pages.length);

    pages.forEach((cols,pgIdx)=>{
      const cap=document.createElement('div');cap.className='pcap';
      cap.textContent=`A4 直式測驗卷　第 ${pgIdx+1} / ${totalP} 頁`;box.appendChild(cap);
      const pg=document.createElement('div');pg.className='a4 exam-a4';
      pg.appendChild(Object.assign(document.createElement('div'),{className:'edge'}));
      const inner=document.createElement('div');inner.className='ex-wrap'+($('exRuby').checked?' has-ruby':'');
      const pageMaxH = chosenCapHs[pgIdx] || 1054;
      const calcStretch = (colList) => {
        const usedH = colList.reduce((a,b)=>a+b.h, 0);
        const spare = Math.max(0, pageMaxH * 0.96 - usedH);
        const qCnt = Math.max(1, colList.filter(b=>b.type==='q').length);
        let lh = chosenD.lh, gap = chosenD.gap, calcH = chosenD.calcH, wordH = chosenD.wordH;
        if(spare > 14 && usedH > 100){
          const hasCalc = colList.some(b=>b.kind==='calc');
          const hasWord = colList.some(b=>b.kind==='word');
          const rFill = usedH / Math.max(1, pageMaxH);
          const lhBoost = rFill < 0.92 ? Math.min(0.36, (0.94 - rFill) * 0.95) : 0.08;
          lh = Math.min(1.92, +(chosenD.lh + lhBoost).toFixed(2));
          gap = Math.min(54, Math.round(chosenD.gap + Math.min(38, (spare * 0.65) / qCnt)));
          if(hasCalc) calcH = Math.min(98, Math.round(chosenD.calcH + Math.min(44, spare * 0.28)));
          if(hasWord) wordH = Math.min(124, Math.round(chosenD.wordH + Math.min(56, spare * 0.34)));
        }
        return {lh, gap, calcH, wordH, usedH};
      };
      const baseSt = calcStretch(cols.flat());
      inner.style.setProperty('--ex-fs',chosenD.fs+'px');
      inner.style.setProperty('--ex-lh',baseSt.lh);
      inner.style.setProperty('--ex-gap',baseSt.gap+'px');
      inner.style.setProperty('--ex-box-calc',baseSt.calcH+'px');
      inner.style.setProperty('--ex-box-word',baseSt.wordH+'px');
      if(pgIdx===0){
        const hd=document.createElement('div');hd.className='ex-hd';
        hd.innerHTML=`<h3>國小 ${meta.grade} 年級${meta.sem}學期　${meta.subject}評量測驗卷（總分 100 分）</h3>
          <div class="ex-sub">版本：${pubName}　｜　難度：${diffName}　｜　範圍：${unitsText}</div>
          <div class="ex-info"><span>班級：________</span><span>姓名：____________</span><span>座號：____</span><span>得分：________</span></div>`;
        inner.appendChild(hd);
      }
      const fillCol=(el,list)=>{
        const stCol = calcStretch(list);
        el.style.setProperty('--ex-lh',stCol.lh);
        el.style.setProperty('--ex-gap',stCol.gap+'px');
        el.style.setProperty('--ex-box-calc',stCol.calcH+'px');
        el.style.setProperty('--ex-box-word',stCol.wordH+'px');
        if(list.length >= 3 && stCol.usedH >= pageMaxH * 0.56){
          el.classList.add('ex-col-stretch');
        }
        list.forEach(b=>{
          if(b.type==='sec'){const d=document.createElement('div');d.className='ex-sec';d.textContent=b.text;el.appendChild(d);}
          else el.appendChild(makeQEl(b,false));
        });
      };
      if(twoCol){
        const wrap=document.createElement('div');wrap.className='ex-cols2';
        const cl=document.createElement('div');cl.className='ex-col-l';
        const cr=document.createElement('div');cr.className='ex-col-r';
        fillCol(cl,cols[0]);fillCol(cr,cols[1]);wrap.appendChild(cl);wrap.appendChild(cr);inner.appendChild(wrap);
      }else{
        const c1=document.createElement('div');c1.className='ex-col-1';
        fillCol(c1,cols[0]);inner.appendChild(c1);
      }
      pg.appendChild(inner);
      // 實機 DOM 安全高度校準（即使在後台隱藏分頁或附注音寬括弧換行時，亦確保絕不超出 1096px 底部安全界線）
      {
        const fitHost=document.createElement('div');
        fitHost.style.cssText='position:fixed;left:-9999px;top:0;visibility:hidden;z-index:-1';
        inner.style.height='auto';
        fitHost.appendChild(pg);
        document.body.appendChild(fitHost);
        const colEls=[...inner.querySelectorAll('.ex-col-l,.ex-col-r,.ex-col-1')];
        let curFs=chosenD.fs, curLh=baseSt.lh, curGap=baseSt.gap, curCalc=baseSt.calcH, curWord=baseSt.wordH;
        for(let step=0; step<18 && inner.scrollHeight>1055; step++){
          curGap=Math.max(2, curGap-4);
          curLh=Math.max(1.16, +(curLh-0.07).toFixed(2));
          curCalc=Math.max(16, curCalc-6);
          curWord=Math.max(22, curWord-8);
          if(step>=2) curFs=Math.max(9.8, +(curFs-0.4).toFixed(1));
          [inner, ...colEls].forEach(el=>{
            el.style.setProperty('--ex-fs', curFs+'px');
            el.style.setProperty('--ex-lh', curLh);
            el.style.setProperty('--ex-gap', curGap+'px');
            el.style.setProperty('--ex-box-calc', curCalc+'px');
            el.style.setProperty('--ex-box-word', curWord+'px');
          });
        }
        document.body.removeChild(fitHost);
        inner.style.height='100%';
      }
      if(window.createWatermarkLayer)pg.appendChild(window.createWatermarkLayer(794,1122,meta.wmText||''));
      const cpr=window.COPYRIGHT_STATEMENT||'🌻 向日葵國小伴學誌｜108課綱原創練習・專屬訂製請勿轉售';
      pg.appendChild(Object.assign(document.createElement('div'),{className:'cap',textContent:`${cpr}　｜　第 ${pgIdx+1} / ${totalP} 頁`}));
      box.appendChild(pg);
    });
  }

  if(meta.withAns){
    const cpr=window.COPYRIGHT_STATEMENT||'🌻 向日葵國小伴學誌｜108課綱原創練習・專屬訂製請勿轉售';
    const ansPagesOut=[];
    if(isZh){
      // 國語科橫式直書解答：以隱藏實測寬度自動分頁，絕不裁切溢出
      const createZhAnsPg=()=>{
        const pg=document.createElement('div');pg.className='a4 exam-a4 ex-land';
        pg.appendChild(Object.assign(document.createElement('div'),{className:'edge'}));
        const inner=document.createElement('div');inner.className='ex-zh-wrap';
        inner.style.setProperty('--ex-fs','13.5px');
        pg.appendChild(inner);
        return {pg,inner};
      };
      let cur=createZhAnsPg();
      const zhAnsGrade=['','一','二','三','四','五','六'][+meta.grade]||meta.grade;
      const hd=document.createElement('div');hd.className='ex-zh-hd';
      hd.innerHTML=zhFormat(`<div><h3>國小${zhAnsGrade}年級${meta.sem}學期　國語科解答與解析（總分100分）</h3><div class="ex-sub">版本：${pubName}　難度：${diffName}</div></div>`);
      cur.inner.appendChild(hd);

      const meas=document.createElement('div');
      meas.style.cssText='position:fixed;left:-9999px;top:0;visibility:hidden;z-index:-1';
      document.body.appendChild(meas);
      meas.appendChild(cur.pg);

      const ansBlocks=[];
      sections.forEach(sec=>{
        const sh=document.createElement('div');sh.className='ex-zh-sec';sh.innerHTML=zhFormat(esc(sec.heading));
        ansBlocks.push(sh);
        sec.qs.forEach((q,i)=>{
          let ans=q.a;
          if(sec.kind==='mc'){const ix=q.opts.indexOf(q.a);ans=`${['①','②','③','④'][ix]} ${q.a}`;}
          else if(sec.kind==='match'){const L='ㄅㄆㄇㄈㄉㄊㄋㄌ';ans=q.pairs.map((p,j)=>`(${j+1})→${L[q.right.indexOf(p[1])]}`).join('、');}
          ans=String(ans).replace(/(^|\s)(\d+)\.\s/g,'$1($2)');
          const col=document.createElement('div');
          col.style.cssText='writing-mode:vertical-rl;text-orientation:upright;height:100%;margin:0 5px;line-height:1.68;font-size:13.5px;font-family:"BiauKai","DFKai-SB","標楷體","Noto Sans TC",serif;flex:none;letter-spacing:.02em';
          col.innerHTML=zhFormat(`<b>${i+1}.</b> ${esc(ans)}${q.exp?` <span style="color:#555;font-size:0.92em">（${esc(q.exp)}）</span>`:''}`);
          ansBlocks.push(col);
        });
      });

      ansBlocks.forEach(el=>{
        cur.inner.appendChild(el);
        if(cur.inner.scrollWidth > cur.inner.clientWidth + 2 && cur.inner.children.length > 1){
          cur.inner.removeChild(el);
          meas.removeChild(cur.pg);
          ansPagesOut.push(cur.pg);
          cur=createZhAnsPg();
          meas.appendChild(cur.pg);
          cur.inner.appendChild(el);
        }
      });
      meas.removeChild(cur.pg);
      ansPagesOut.push(cur.pg);
      document.body.removeChild(meas);

      const baseQ=box.querySelectorAll('.a4').length;
      const totAll=baseQ+ansPagesOut.length;
      box.querySelectorAll('.pcap').forEach((el,idx)=>{if(idx<baseQ)el.textContent=`A4 橫式上下雙排直書（由右至左）　第 ${idx+1} / ${totAll} 頁`;});
      box.querySelectorAll('.a4 .cap').forEach((el,idx)=>{if(idx<baseQ)el.textContent=`${cpr}　｜　第 ${idx+1} / ${totAll} 頁`;});
      ansPagesOut.forEach((pg,ai)=>{
        const pNo=baseQ+ai+1;
        const cap=document.createElement('div');cap.className='pcap';
        cap.textContent=`A4 橫式直書（由右至左）解答與解析頁　第 ${pNo} / ${totAll} 頁`;box.appendChild(cap);
        if(window.createWatermarkLayer)pg.appendChild(window.createWatermarkLayer(1122,794,meta.wmText||''));
        pg.appendChild(Object.assign(document.createElement('div'),{className:'cap',textContent:`${cpr}　｜　第 ${pNo} / ${totAll} 頁`}));
        box.appendChild(pg);
      });
      if(curExam) updateCapInfo(curExam._lastPageCount, ansPagesOut.length);
    }else{
      // 直式 A4 解答與解析頁：動態 DOM 高度實測分頁，嚴禁任何題解被底線裁切！
      const createPortAnsPg=(isCont)=>{
        const pg=document.createElement('div');pg.className='a4 exam-a4';
        pg.appendChild(Object.assign(document.createElement('div'),{className:'edge'}));
        const inner=document.createElement('div');inner.className='ex-wrap'+($('exRuby').checked?' has-ruby':'');
        inner.style.height='auto';inner.style.minHeight='0';
        inner.innerHTML=`<div class="ex-hd"><h3>解答與解析${isCont?'（續）':''}</h3><div class="ex-sub">國小 ${meta.grade} 年級${meta.sem}學期　${meta.subject}（總分 100 分）</div></div>`;
        pg.appendChild(inner);
        return {pg,inner};
      };
      let cur=createPortAnsPg(false);
      const meas=document.createElement('div');
      meas.style.cssText='position:fixed;left:-9999px;top:0;visibility:hidden;z-index:-1';
      document.body.appendChild(meas);
      meas.appendChild(cur.pg);
      const MAX_ANS_H=1052; // 1122 - 70 安全底界，預留頁尾版權列與列印安全邊距

      sections.forEach(sec=>{
        const mkSecHdr=()=>{const h=document.createElement('div');h.className='ex-sec';h.textContent=sec.heading;return h;};
        let hEl=mkSecHdr();
        let grid=document.createElement('div');grid.className='ex-ans-grid';
        cur.inner.appendChild(hEl);
        cur.inner.appendChild(grid);
        if(cur.inner.scrollHeight > MAX_ANS_H && cur.inner.children.length > 3){
          cur.inner.removeChild(grid);cur.inner.removeChild(hEl);
          meas.removeChild(cur.pg);ansPagesOut.push(cur.pg);
          cur=createPortAnsPg(true);meas.appendChild(cur.pg);
          hEl=mkSecHdr();grid=document.createElement('div');grid.className='ex-ans-grid';
          cur.inner.appendChild(hEl);cur.inner.appendChild(grid);
        }
        sec.qs.forEach((q,i)=>{
          const d=document.createElement('div');d.className='ex-ans';
          let ans=q.a;
          if(sec.kind==='mc'){const ix=q.opts.indexOf(q.a);const L=meta.subject==='英語'?['(A)','(B)','(C)','(D)']:['①','②','③','④'];ans=`${L[ix]} ${q.a}`;}
          else if(sec.kind==='match'){const L='ㄅㄆㄇㄈㄉㄊㄋㄌ';ans=q.pairs.map((p,j)=>`(${j+1})→${L[q.right.indexOf(p[1])]}`).join(' ');}
          ans=String(ans).replace(/(^|\s)(\d+)\.\s/g,'$1($2) ');
          d.innerHTML=`<b>${i+1}.</b> ${esc(ans)}${q.exp?` <span class="hint">（${esc(q.exp)}）</span>`:''}`;
          grid.appendChild(d);
          if(cur.inner.scrollHeight > MAX_ANS_H && grid.children.length > 1){
            grid.removeChild(d);
            meas.removeChild(cur.pg);ansPagesOut.push(cur.pg);
            cur=createPortAnsPg(true);meas.appendChild(cur.pg);
            const h2=document.createElement('div');h2.className='ex-sec';h2.textContent=`${sec.heading}（續）`;
            grid=document.createElement('div');grid.className='ex-ans-grid';
            cur.inner.appendChild(h2);cur.inner.appendChild(grid);
            grid.appendChild(d);
          }
        });
      });
      meas.removeChild(cur.pg);
      ansPagesOut.push(cur.pg);
      document.body.removeChild(meas);

      const baseQ=box.querySelectorAll('.a4').length;
      const totAll=baseQ+ansPagesOut.length;
      box.querySelectorAll('.pcap').forEach((el,idx)=>{if(idx<baseQ)el.textContent=`A4 直式測驗卷　第 ${idx+1} / ${totAll} 頁`;});
      box.querySelectorAll('.a4 .cap').forEach((el,idx)=>{if(idx<baseQ)el.textContent=`${cpr}　｜　第 ${idx+1} / ${totAll} 頁`;});
      ansPagesOut.forEach((pg,ai)=>{
        const pNo=baseQ+ai+1;
        const cap=document.createElement('div');cap.className='pcap';
        cap.textContent=`A4 直式解答與解析頁　第 ${pNo} / ${totAll} 頁`;box.appendChild(cap);
        if(window.createWatermarkLayer)pg.appendChild(window.createWatermarkLayer(794,1122,meta.wmText||''));
        pg.appendChild(Object.assign(document.createElement('div'),{className:'cap',textContent:`${cpr}　｜　第 ${pNo} / ${totAll} 頁`}));
        box.appendChild(pg);
      });
      if(curExam) updateCapInfo(curExam._lastPageCount, ansPagesOut.length);
    }
  }
}
const esc=s=>String(s).replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));

// ===== 5. 100% 預覽保真級 Excel 匯出（含注音、直書標點、圖解，零跑版、零信任修復警告）=====
const EXAM_EXPORT_CSS = `*{box-sizing:border-box}
html{font-size:15px}
body{margin:0;font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;background:#fff8ec;color:#2a2a2a;line-height:1.45}
.wrap{max-width:840px;margin:0 auto;padding:0 14px}
header{background:linear-gradient(135deg,#ffc83d,#ff7a1a);color:#fff;padding:12px 0;box-shadow:0 2px 8px #ff7a1a44}
header .wrap{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap}
header h1{margin:0;font-size:1.45rem}header p{margin:0;font-size:.92rem;opacity:.95}
.card{background:#fff;border-radius:12px;padding:12px 16px;margin:10px 0;box-shadow:0 3px 10px #0001;border:1px solid #ffe2b0}
.card h2{margin:0 0 8px;font-size:1.12rem;display:flex;align-items:center;gap:8px}
.step{display:inline-flex;width:1.55rem;height:1.55rem;border-radius:50%;background:#ff7a1a;color:#fff;align-items:center;justify-content:center;font-size:.9rem}
.sub{font-weight:700;margin:8px 0 4px;color:#b35a00;font-size:.95rem}
.row{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin:6px 0}
select,input[type=number],textarea{font:inherit;font-size:.95rem;padding:5px 9px;border:1.5px solid #e6d3b5;border-radius:8px;background:#fff}
select:focus,textarea:focus,input:focus{outline:none;border-color:#ff7a1a}
input[type=number]{width:4em}
textarea{width:100%;font-size:1.35rem;letter-spacing:.12em}
label{font-size:.95rem}.chk{display:inline-flex;align-items:center;gap:5px;cursor:pointer}
input[type=checkbox],input[type=radio]{width:1rem;height:1rem;accent-color:#ff7a1a}
.btn{font:inherit;font-size:.95rem;padding:6px 14px;border:0;border-radius:9px;background:#f0e6d6;cursor:pointer;transition:.12s}
.btn:hover{transform:translateY(-1px);box-shadow:0 3px 8px #0002}
.btn.big{font-size:1rem;padding:8px 18px;font-weight:700}
.btn.pri{background:linear-gradient(135deg,#ffc83d,#ff7a1a);color:#fff}
.btn.ok{background:linear-gradient(135deg,#34c47c,#1f9d55);color:#fff}
.modes{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mode{display:block;border:1.5px solid #e6d3b5;border-radius:10px;padding:8px 12px;cursor:pointer}
.mode b{display:block;font-size:1rem;margin-left:4px}.mode span{display:block;font-size:.85rem;color:#666;margin:2px 0 0 22px}
.mode input{float:left;margin-top:4px}
.mode:has(input:checked){border-color:#ff7a1a;background:#fff4e2}
.hint{font-size:.85rem;color:#777;margin:4px 0 0}.msg{font-size:.95rem;color:#c0392b;min-height:1.2em;margin-top:4px}
#sheet{display:flex;flex-direction:column;align-items:center;gap:20px;padding-bottom:32px}
.a4{position:relative;width:794px;height:1122px;background:#fff;box-shadow:0 4px 18px #0003;overflow:hidden;flex:none}
.a4 .cap{position:absolute;left:0;right:0;bottom:5px;text-align:center;font-size:10.5px;color:#777}
.a4 .wm-layer{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:8;overflow:hidden}
.a4 img{position:absolute;display:block}
.a4 .edge{position:absolute;inset:0;border:1px dashed #ccc;pointer-events:none}
.pcap{font-weight:700;color:#b35a00;margin-bottom:-14px;font-size:.95rem}
@media(max-width:700px){.modes{grid-template-columns:1fr}}
@media print{
  @page{size:A4 portrait;margin:0}
  html,body{background:#fff;font-size:12px}
  .noprint,.pcap{display:none!important}
  main{max-width:none;padding:0}.wrap{padding:0}
  #sheet{display:block;padding:0;gap:0}
  .a4{box-shadow:none;break-after:page;page-break-after:always}
  .a4 .cap,.a4 .edge{display:none}
}

/* 頂部功能分頁列 */
.hd-top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
.nav-tabs{display:flex;gap:8px;flex-wrap:wrap}
.nav-tab{font:inherit;font-size:1.05rem;font-weight:700;padding:8px 16px;border:2px solid #fff6;border-radius:10px;background:#fff3;color:#fff;cursor:pointer;transition:.15s}
.nav-tab:hover{background:#fff5}
.nav-tab.active{background:#fff;color:#d85a00;border-color:#fff;box-shadow:0 3px 10px #0002}

/* 評量測驗卷控制區 */
.units-box{display:grid;grid-template-columns:1fr 1fr;gap:6px 14px;margin-top:6px;max-height:170px;overflow-y:auto;padding:8px 10px;background:#fffaf2;border:1.5px solid #f0dec0;border-radius:10px}
.uchk{display:flex;align-items:flex-start;gap:6px;font-size:.92rem;cursor:pointer;line-height:1.35}
.uchk small{color:#777;font-size:.82rem}
.uchk input{margin-top:3px;flex:none}
@media(max-width:700px){.units-box{grid-template-columns:1fr}}

/* 評量測驗卷控制與 A4 市售考卷級排版（標楷體＋正統右側直式注音） */
.qtype-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px 12px;margin-top:6px;padding:8px 10px;background:#fffaf2;border:1.5px solid #f0dec0;border-radius:10px}
.qtype-grid small{color:#888;font-size:.78rem}
@media(max-width:720px){.qtype-grid{grid-template-columns:1fr 1fr}}
#examSheet{display:flex;flex-direction:column;align-items:center;gap:18px;padding-bottom:28px}

/* 考卷專用字體（台灣標楷體優先） */
.exam-a4{font-family:"BiauKai","DFKai-SB","標楷體","Kaiti TC","Noto Serif TC","Noto Sans TC",serif}

/* 隱藏式格子系統（一字一格、一符一格、一空一格，橫書與直書零重疊） */
/* 1. 橫書科目（數學、生活、自然、社會、英語） */
.hcell-han{display:inline-block;width:1.75em;height:1.26em;vertical-align:-.25em;margin:0 .02em;overflow:visible}
.hcell-zy{display:inline-block;width:1.25em;height:1.32em;vertical-align:-.26em;margin:0 .03em;overflow:visible}
.h-num{display:inline-block;vertical-align:-.02em;line-height:1.25;margin:0 .04em;font-variant-numeric:tabular-nums}
.h-blank{display:inline-block;min-width:4.4em;padding:0 .16em;text-align:center;font-weight:600;margin:0 .1em;white-space:nowrap;letter-spacing:.04em}

/* 2. 直書國語科（全部統一為寬 42 單位之隱藏式格子，主軸 x=14，注音軌 x=31） */
.gcell{display:block;width:1.85em;margin:0 auto;overflow:visible}
.g-han{height:1.24em}
.g-zy{height:1.38em}
.g-punc{height:.95em}
.g-blank{height:2.9em}
.g-badge{height:1.8em}

/* 直式 A4（數學／生活／自然／社會／英語） */
.ex-wrap{padding:24px 30px;color:#111;font-size:var(--ex-fs,15px);line-height:var(--ex-lh,1.55);height:100%;display:flex;flex-direction:column}
.ex-wrap.has-ruby{line-height:1.82}
.ex-hd{border-bottom:2px solid #222;padding-bottom:6px;margin-bottom:8px;flex:none}
.ex-hd h3{margin:0 0 4px;font-size:1.28rem;text-align:center;letter-spacing:.04em}
.ex-sub{font-size:.84rem;color:#444;margin:2px 0;text-align:left}
.ex-info{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:.92rem;font-weight:600;margin-top:6px}
.ex-info span{white-space:nowrap}
.ex-cols2{display:grid;grid-template-columns:1fr 1fr;flex:1;align-items:start}
.ex-col-l{padding-right:14px;border-right:1px solid #bbb;min-height:100%}
.ex-col-r{padding-left:14px}
.ex-col-1{flex:1}
.ex-sec{font-weight:700;font-size:1em;background:#fff3df;color:#7a3b00;padding:3px 8px;border-left:4px solid #ff7a1a;margin:6px 0 6px}
.ex-q{display:grid;grid-template-columns:auto 1fr;column-gap:6px;margin-bottom:var(--ex-gap,8px);break-inside:avoid;align-items:baseline}
.ex-q .qno{font-weight:700;white-space:nowrap;padding-right:2px}
.ex-q .qbody{min-width:0}
.ex-q .qt{word-break:break-word}
.ex-q .qt-zh-hint{margin-top:2px;font-size:.9em;color:#475569;padding-left:.2em;line-height:1.38}
.ex-q .qpts{color:#555;font-size:.84em;margin-left:3px;white-space:nowrap}
.ex-q .qopts{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:4px;font-size:.94em}
.ex-q .qopt{display:inline-flex;align-items:baseline;gap:4px;max-width:100%}
.ex-q .opt-lbl{flex:none;white-space:nowrap}
.ex-q .opt-txt{min-width:0}
.q-arrow{display:inline-flex;align-items:center;justify-content:center;min-width:1.45em;margin:0 .16em;text-align:center;vertical-align:middle;line-height:1}
.eng-clue{white-space:nowrap;display:inline-block;letter-spacing:.04em}
.ex-q .qbox{border:1px dashed #aaa;border-radius:5px;margin-top:4px}
.ex-q .qbox.calc{height:var(--ex-box-calc,28px)}
.ex-q .qbox.word{height:var(--ex-box-word,40px)}
.ex-match{display:grid;grid-template-columns:1.2fr 1fr;gap:4px 12px;align-items:baseline;margin-top:4px;font-size:.93em;padding:6px 10px;background:#fafafa;border:1px solid #dcdcdc;border-radius:6px}
.ex-match div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ex-svg{margin:4px 0 2px;max-width:100%}
.ex-svg svg{display:block;max-width:100%;height:auto}
.ex-ans-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px}
.ex-ans{margin:2px 0;font-size:.92rem}

/* 國語科：A4 橫式直書（由右至左，隱藏式格子欄流） */
.a4.ex-land{width:1122px;height:794px}
.ex-zh-wrap{display:flex;flex-direction:row-reverse;align-items:flex-start;width:100%;height:100%;padding:22px 26px;color:#111;font-size:var(--ex-fs,13.5px);gap:4px;overflow:hidden}
.ex-zh-hd{writing-mode:vertical-rl;text-orientation:upright;border-left:2px solid #222;padding-left:10px;margin-left:6px;height:100%;display:flex;flex-direction:column;justify-content:space-between;flex:none;font-family:"BiauKai","DFKai-SB","標楷體","Noto Sans TC",serif}
.ex-zh-hd h3{margin:0;font-size:1.22rem;letter-spacing:.06em;line-height:1.3}
.ex-zh-hd .ex-sub{font-size:.8rem;color:#444;margin-right:4px;line-height:1.3}
.ex-zh-hd .ex-zh-info{display:flex;justify-content:space-between;gap:10px;font-size:.9rem;font-weight:600;padding-bottom:32px}
.ex-zh-sec{writing-mode:vertical-rl;text-orientation:upright;font-weight:700;background:#fff3df;color:#7a3b00;padding:8px 4px;border-top:4px solid #ff7a1a;margin:0 4px;height:100%;flex:none;font-size:.96em;line-height:1.25;font-family:"BiauKai","DFKai-SB","標楷體","Noto Sans TC",serif}
.ex-zh-q{display:flex;flex-direction:row-reverse;align-items:flex-start;height:100%;margin:0 3px;flex:none;gap:2px}
.ex-zh-col{display:flex;flex-direction:column;align-items:center;height:100%;flex:none;width:1.85em}
.ex-zh-q .qbox{border:1.2px dashed #94a3b8;border-radius:5px;width:var(--zh-box-calc,2.6em);height:94%;margin:0 2px;flex:none}
.ex-zh-q .qbox.word{width:var(--zh-box-word,3.8em)}
.ex-zh-q .qbox.word.wide{width:var(--zh-box-word-wide,5.4em)}
.tcy{text-combine-upright:all;-webkit-text-combine:horizontal;display:inline-block;min-width:1em;text-align:center;line-height:1;font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;font-variant-numeric:tabular-nums;font-weight:inherit}
.v-arrow{display:inline-flex;align-items:center;justify-content:center;width:1em;height:1.1em;text-align:center;line-height:1;font-family:"Noto Sans TC",sans-serif;vertical-align:middle}
.qend-glue{white-space:nowrap;display:inline}
.qblank-glue{white-space:nowrap;display:inline}

@media print{
  #examSheet{display:block;padding:0;gap:0}
  .ex-wrap{padding:8mm 10mm}
  .ex-zh-wrap{padding:8mm 10mm}
  .a4:last-child{break-after:auto!important;page-break-after:auto!important}
}

/* 即時題數與兩頁一張顯眼狀態橫幅 */
.cap-banner{font-size:1.02rem;font-weight:700;padding:9px 14px;border-radius:10px;margin:8px 0 4px;display:flex;align-items:center;gap:8px;transition:.15s}
.cap-banner.ok{background:#e7f8ee;border:2px solid #28a745;color:#136529}
.cap-banner.warn{background:#fdeaea;border:2px solid #dc3545;color:#a71d2a}
`;

async function domPageToPng(pgEl){
  const w=pgEl.offsetWidth||794, h=pgEl.offsetHeight||1122;
  const clone=pgEl.cloneNode(true);
  clone.querySelectorAll('.edge,.cap').forEach(e=>e.remove());
  clone.style.boxShadow='none';
  clone.style.margin='0';
  const xhtml=new XMLSerializer().serializeToString(clone);
  const svgStr=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <style>${EXAM_EXPORT_CSS}</style>
    <foreignObject x="0" y="0" width="${w}" height="${h}">${xhtml}</foreignObject>
  </svg>`;
  const img=new Image();
  const ok=await new Promise(res=>{
    img.onload=()=>res(true);
    img.onerror=()=>res(false);
    img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgStr);
  });
  if(!ok)return null;
  const scale=2.4;
  const cv=document.createElement('canvas');
  cv.width=Math.round(w*scale); cv.height=Math.round(h*scale);
  const ctx=cv.getContext('2d');
  ctx.fillStyle='#ffffff';
  ctx.fillRect(0,0,cv.width,cv.height);
  ctx.drawImage(img,0,0,cv.width,cv.height);
  const b64=cv.toDataURL('image/png').replace(/^data:image\/\w+;base64,/,'');
  return {b64,w,h};
}

async function exportExamXlsx(){
  if(!curExam)generateFromUI();
  if(!curExam||!curExam.sections.length){$('exMsg').textContent='請至少選擇一種題型並大於 0 題';return;}
  const {meta,sections}=curExam;
  const twoCol=meta.layout==='2col';
  const pubName=CURR_META.pubs[meta.pub]||meta.pub;
  const diffName={easy:'基礎熟練',mid:'標準評量',hard:'素養挑戰',mix:'混合難度'}[meta.diff];
  const isZh=meta.subject==='國語';

  const allDomPages=[...document.querySelectorAll('#examSheet .a4')];
  const qDomPages=meta.withAns&&allDomPages.length>1 ? allDomPages.slice(0,-1) : allDomPages;
  const ansDomPage=meta.withAns&&allDomPages.length>1 ? allDomPages[allDomPages.length-1] : null;

  const wb=new ExcelJS.Workbook();
  const orient=isZh?'landscape':'portrait';

  // 工作表 1：評量測驗卷（100% 與預覽畫面完全一致，含完整注音、聲調、直橫標點與 SVG 圖解）
  const cpr=window.COPYRIGHT_STATEMENT||'🌻 向日葵國小伴學誌｜108課綱原創練習・專屬訂製請勿轉售';
  const ws=wb.addWorksheet('評量測驗卷',{
    pageSetup:{paperSize:9,orientation:orient,scale:100,horizontalDpi:300,verticalDpi:300,
      margins:{left:.2,right:.2,top:.2,bottom:.2,header:.1,footer:.1},horizontalCentered:true,verticalCentered:true},
    headerFooter:{oddFooter:`&C${cpr}　｜　第 &P 頁／共 &N 頁（A4 ${isZh?'橫式直書':'直式'}）`},
    views:[{state:'normal',zoomScale:100,showGridLines:false}]
  });

  const colsPerSheet=isZh?14:10;
  const rowsPerPage=isZh?28:40;
  const rowPt=isZh?19.5:19.5;
  const imgW=isZh?1036:734;
  const imgH=isZh?728:1036;

  for(let c=1;c<=colsPerSheet;c++) ws.getColumn(c).width=10.5;

  for(let p=0;p<qDomPages.length;p++){
    const rStart=p*rowsPerPage;
    for(let r=1;r<=rowsPerPage;r++) ws.getRow(rStart+r).height=rowPt;
    const png=await domPageToPng(qDomPages[p]);
    if(png){
      const imgId=wb.addImage({base64:png.b64,extension:'png'});
      ws.addImage(imgId,{tl:{col:0,row:rStart},ext:{width:imgW,height:imgH},editAs:'oneCell'});
    }
    if(p<qDomPages.length-1) ws.getRow(rStart+rowsPerPage).addPageBreak();
  }

  // 工作表 2：解答與解析（方向與試卷完全一致：國語 A4 橫式直書、其餘 A4 直式）
  if(meta.withAns&&ansDomPage){
    const wa=wb.addWorksheet('解答與解析',{
      pageSetup:{paperSize:9,orientation:orient,scale:100,horizontalDpi:300,verticalDpi:300,
        margins:{left:.2,right:.2,top:.2,bottom:.2,header:.1,footer:.1},horizontalCentered:true,verticalCentered:true},
      headerFooter:{oddFooter:`&C${cpr}　｜　解答與解析（A4 ${isZh?'橫式直書':'直式'}）`},
      views:[{state:'normal',zoomScale:100,showGridLines:false}]
    });
    for(let c=1;c<=colsPerSheet;c++) wa.getColumn(c).width=10.5;
    for(let r=1;r<=rowsPerPage;r++) wa.getRow(r).height=rowPt;
    const ansPng=await domPageToPng(ansDomPage);
    if(ansPng){
      const aId=wb.addImage({base64:ansPng.b64,extension:'png'});
      wa.addImage(aId,{tl:{col:0,row:0},ext:{width:imgW,height:imgH},editAs:'oneCell'});
    }
  }

  // 工作表 3：題目與解答文字明細（供教師複製或二次編輯文字）
  const wt=wb.addWorksheet('題目文字明細',{
    pageSetup:{paperSize:9,orientation:orient,scale:100,horizontalDpi:300,verticalDpi:300,
      margins:{left:.35,right:.35,top:.35,bottom:.4,header:.15,footer:.2},horizontalCentered:true},
    views:[{state:'normal',zoomScale:100,showGridLines:true}]
  });
  wt.getColumn(1).width=8; wt.getColumn(2).width=54; wt.getColumn(3).width=24; wt.getColumn(4).width=10;
  let tr=1;
  wt.mergeCells(tr,1,tr,4);
  Object.assign(wt.getCell(tr,1),{value:`國小 ${meta.grade} 年級${meta.sem}學期 ${meta.subject}評量測驗卷 — 題目與解答文字明細（${pubName}・${diffName}）`,font:{name:'Noto Sans TC',size:12,bold:true}});
  wt.getRow(tr).height=24; tr++;
  sections.forEach(sec=>{
    wt.mergeCells(tr,1,tr,4);
    Object.assign(wt.getCell(tr,1),{value:sec.heading,font:{name:'Noto Sans TC',size:11,bold:true,color:{argb:'FF7A3B00'}},fill:{type:'pattern',pattern:'solid',fgColor:{argb:'FFFFF3DF'}}});
    wt.getRow(tr).height=20; tr++;
    sec.qs.forEach((q,i)=>{
      let qTxt=normSubNums(q.q);
      if(sec.kind==='mc'){const L=meta.subject==='英語'?['(A)','(B)','(C)','(D)']:['①','②','③','④'];qTxt+='　'+q.opts.map((o,k)=>`${L[k]} ${o}`).join('　');}
      else if(sec.kind==='match'){const L='ㄅㄆㄇㄈㄉㄊㄋㄌ';qTxt+='　'+q.pairs.map((p,k)=>`(${k+1})${p[0]} / ${L[k]}.${q.right[k]}`).join('；');}
      let ans=q.a;
      if(sec.kind==='mc'){const ix=q.opts.indexOf(q.a);const L=meta.subject==='英語'?['(A)','(B)','(C)','(D)']:['①','②','③','④'];ans=`${L[ix]} ${q.a}`;}
      else if(sec.kind==='match'){const L='ㄅㄆㄇㄈㄉㄊㄋㄌ';ans=q.pairs.map((p,j)=>`(${j+1})→${L[q.right.indexOf(p[1])]}`).join('、');}
      wt.getCell(tr,1).value=`第 ${i+1} 題`; wt.getCell(tr,1).font={name:'Noto Sans TC',size:10,bold:true};
      wt.getCell(tr,2).value=qTxt; wt.getCell(tr,2).font={name:'Noto Sans TC',size:10}; wt.getCell(tr,2).alignment={wrapText:true,vertical:'top'};
      wt.getCell(tr,3).value=String(ans)+(q.exp?`（${q.exp}）`:''); wt.getCell(tr,3).font={name:'Noto Sans TC',size:10}; wt.getCell(tr,3).alignment={wrapText:true,vertical:'top'};
      wt.getCell(tr,4).value=`${q.pts} 分`; wt.getCell(tr,4).font={name:'Noto Sans TC',size:10};
      wt.getRow(tr).height=Math.max(20,Math.ceil(qTxt.length/32)*15+4); tr++;
    });
  });

  const buf=await wb.xlsx.writeBuffer();
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
  a.download=`${meta.grade}年級_${meta.subject}_評量測驗卷.xlsx`;
  a.click();
  $('exMsg').style.color='#1f9d55';
  $('exMsg').textContent=isZh
    ? `已匯出：${meta.grade}年級${meta.sem}學期 國語評量測驗卷（A4 橫式直書・與預覽 100% 同步保真）`
    : `已匯出：${meta.grade}年級${meta.sem}學期 ${meta.subject}評量測驗卷（A4 直式${twoCol?'・左右雙欄':''}・與預覽 100% 同步保真）`;
}

// ===== 6. 介面連動、混合式隨機骰子與上限檢查 =====
function applyTermSelection(){
  const tt=$('exTermType')?$('exTermType').value:'all';
  const chks=[...document.querySelectorAll('#exUnits input')];
  if(!chks.length||tt==='unit')return;
  const mid=Math.ceil(chks.length/2);
  chks.forEach((c,i)=>c.checked=(tt==='all')||(tt==='mid'&&i<mid)||(tt==='final'&&i>=mid));
}
function fillSubjects(){
  const g=$('exGrade').value, subs=CURR_META.subjectsByGrade[g]||[], prev=$('exSubj').value;
  $('exSubj').innerHTML=subs.map(s=>`<option value="${s}">${s}</option>`).join('');
  if(subs.includes(prev))$('exSubj').value=prev;
  fillUnits();
}
function fillUnits(){
  const g=$('exGrade').value, s=$('exSubj').value, sem=$('exSem').value, pub=$('exPub').value;
  let list=((CURRICULUM[g]||{})[s]||{})[sem]||[];
  let twMap=null;
  if(s==='國語'&&window.TW){
    const twKey=sem==='上'?'115上':'114下';
    const pKey=pub==='std'?'n':pub;
    const twLs=((TW[twKey]||{})[pKey]||[]).filter(x=>x.g==+g);
    if(twLs.length){
      twMap=new Map(twLs.map(x=>[x.t,x]));
      list=twLs.map(x=>({name:x.t,topics:[`生字 ${x.c.length} 字`]}));
    }
  }
  $('exUnits').innerHTML=list.map((u,idx)=>{
    const tw=twMap?twMap.get(u.name):null;
    const sChars=tw?(tw.c.filter(c=>c[1]==='s').map(c=>c[0]).join('')||tw.c.map(c=>c[0]).join('')):'';
    const rChars=tw?tw.c.filter(c=>c[1]==='r').map(c=>c[0]).join(''):'';
    return `<label class="uchk" data-pop-title="${esc(u.name)}" data-pop-chars="${esc(sChars)}" data-pop-rchars="${esc(rChars)}" data-pop-topics="${esc((u.topics||[]).join('、'))}"><input type="checkbox" data-uidx="${idx}" value="${esc(u.name)}" checked><span class="uchk-main"><span class="uchk-name">${esc(u.name)}</span><small>${esc(u.topics.join('、'))}</small></span></label>`;
  }).join('');
  applyTermSelection();
  document.querySelectorAll('#exUnits input').forEach(chk=>{
    chk.onchange=()=>{
      if($('exTermType'))$('exTermType').value='unit';
      generateFromUI();
    };
  });
  if(window.bindLessonHoverPopover) window.bindLessonHoverPopover($('exUnits'));
}
function clampInput(id){
  const e=$(id), mx=+e.max||20, mn=+e.min||0;
  if(+e.value>mx)e.value=mx; if(+e.value<mn)e.value=mn;
}
// 兩階段版面滿版均衡引擎（第一優先：renderExam 行距／欄距伸展；第二優先：僅當仍不滿或超頁時才微調題數＆題型）
function autoBalanceExamToTarget(targetPages, maxTotal, baseCfg, syncUi=false){
  if(!curExam) return;
  const KIND_TITLES={
    mc: getExamSectionTitle(baseCfg.subject,'mc'),
    tf: getExamSectionTitle(baseCfg.subject,'tf'),
    fill: getExamSectionTitle(baseCfg.subject,'fill'),
    match: getExamSectionTitle(baseCfg.subject,'match'),
    calc: getExamSectionTitle(baseCfg.subject,'calc'),
    word: getExamSectionTitle(baseCfg.subject,'word')
  };
  const CN=['一','二','三','四','五','六'];
  const refreshHeadings=()=>{
    assignScores(curExam.sections);
    curExam.sections.forEach((s,i)=>{
      const same=s.qs.every(q=>q.pts===s.qs[0].pts);
      const ptsDesc=same?`每題 ${s.qs[0].pts} 分，共 ${s.ptsTotal} 分`:`共 ${s.ptsTotal} 分`;
      s.heading=`${CN[i]}、${s.title}（${ptsDesc}）`;
    });
  };
  const totalQCount=()=>curExam.sections.reduce((a,s)=>a+s.qs.length,0);
  const removeOneFromKind=(k, doMeasure=true)=>{
    const sIdx=curExam.sections.findIndex(s=>s.kind===k);
    if(sIdx<0) return false;
    const sec=curExam.sections[sIdx];
    if(sec.qs.length>1) sec.qs.pop();
    else if(curExam.sections.length>1) curExam.sections.splice(sIdx,1);
    else return false;
    refreshHeadings();
    if(doMeasure) renderExam(true);
    return true;
  };
  const addOneToKind=(k, doMeasure=true)=>{
    const extQ=new Set(baseCfg.excludeQuestions||[]);
    const extS=new Set(baseCfg.excludeSigs||[]);
    const extT=new Set(baseCfg.excludeTopics||[]);
    const extA=new Set(baseCfg.excludeArchetypes||[]);
    curExam.sections.forEach(s=>s.qs.forEach(q=>{
      extQ.add(q.q);
      extS.add(normalizeTemplateSig(q.q));
      inferTopicKeys(q, baseCfg.subject).forEach(t=>extT.add(t));
      inferArchetypeKeys(q, baseCfg.subject, s.kind).forEach(a=>extA.add(a));
    }));
    const singleCfg={
      ...baseCfg,
      excludeQuestions:extQ, excludeSigs:extS,
      excludeTopics:extT, excludeArchetypes:extA,
      nMc:k==='mc'?1:0, nTf:k==='tf'?1:0, nFill:k==='fill'?1:0,
      nMatch:k==='match'?1:0, nCalc:k==='calc'?1:0, nWord:k==='word'?1:0
    };
    let extra=generateExamQuestions(singleCfg);
    let exSec=extra&&extra.sections&&extra.sections.find(s=>s.kind===k);
    if(!exSec||!exSec.qs.length){
      // 題庫已被前面各份用盡：退而只避開「本份」已有題目，確保每份仍能補滿版面
      const ownQ=new Set(), ownS=new Set();
      curExam.sections.forEach(s=>s.qs.forEach(q=>{ownQ.add(q.q);ownS.add(normalizeTemplateSig(q.q));}));
      extra=generateExamQuestions({...singleCfg, excludeQuestions:ownQ, excludeSigs:ownS, excludeTopics:new Set(), excludeArchetypes:new Set()});
      exSec=extra&&extra.sections&&extra.sections.find(s=>s.kind===k);
    }
    if(!exSec||!exSec.qs.length) return false;
    const qNew=exSec.qs[0];
    if(baseCfg.excludeQuestions) baseCfg.excludeQuestions.add(qNew.q);
    if(baseCfg.excludeSigs) baseCfg.excludeSigs.add(normalizeTemplateSig(qNew.q));
    let targetSec=curExam.sections.find(s=>s.kind===k);
    if(!targetSec){
      const orderIdx=['mc','tf','fill','match','calc','word'];
      targetSec={kind:k,title:KIND_TITLES[k]||k,qs:[]};
      curExam.sections.push(targetSec);
      curExam.sections.sort((a,b)=>orderIdx.indexOf(a.kind)-orderIdx.indexOf(b.kind));
    }
    targetSec.qs.push(qNew);
    refreshHeadings();
    if(doMeasure) renderExam(true);
    return true;
  };

  // 1. 若超過目標頁數，依佔空間順序適量精簡題數
  const trimKinds=['word','calc','match','fill','mc','tf'];
  for(let step=0; step<24 && curExam._lastPageCount>targetPages; step++){
    let trimmed=false;
    for(const k of trimKinds){
      const sec=curExam.sections.find(s=>s.kind===k);
      if(sec && sec.qs.length>(k==='match'||k==='word'?1:2)){
        if(removeOneFromKind(k,true)){trimmed=true;break;}
      }
    }
    if(!trimmed){
      for(const k of trimKinds){
        const sec=curExam.sections.find(s=>s.kind===k);
        if(sec && sec.qs.length>1){if(removeOneFromKind(k,true)){trimmed=true;break;}}
      }
    }
    if(!trimmed) break;
  }

  // 2. 第一優先已由 renderExam() 伸展行距；僅在仍不足目標頁數或第2頁／末欄仍留白時，啟動第二優先補題（先批次快速逼近，再微調，最後一次完整繪製）
  const limits={mc:32,tf:26,fill:28,match:3,calc:16,word:9};
  const enabledSet=new Set(['mc','tf','fill','match','calc','word']);
  [['mc','Mc'],['tf','Tf'],['fill','Fill'],['match','Match'],['calc','Calc'],['word','Word']].forEach(([k,u])=>{
    if(syncUi){
      if($('chk'+u)&&!$('chk'+u).checked) enabledSet.delete(k);
    }else if(baseCfg && +baseCfg['n'+u]===0){
      enabledSet.delete(k);
    }
  });
  const growCycle=['mc','fill','tf','calc','word','match'].filter(k=>enabledSet.has(k));
  const blockedKinds=new Set();
  const needsMore=()=> curExam._lastPageCount<targetPages || (curExam._lastPageCount===targetPages && ((curExam._lastPageFill||0)<0.955 || (curExam._lastTailFill||0)<0.95 || (curExam._pageFills||[]).some(f=>f<0.95)));
  let gStep=0, stalled=0;
  // 若目前仍只有 1 頁且目標為 2 頁，或最後一頁填充率低於 86%，先批量補題再量測，大幅節省 DOM reflow 時間
  for(let round=0; round<4 && (curExam._lastPageCount < targetPages || ((curExam._lastPageFill||0)<0.86 || (curExam._lastTailFill||0)<0.86)) && totalQCount()<maxTotal && growCycle.length; round++){
    let batchAdded = 0;
    const stepBatch = curExam._lastPageCount < targetPages ? 4 : 3;
    for(let b=0; b<stepBatch && totalQCount()<maxTotal; b++){
      const k = growCycle[gStep % growCycle.length];
      gStep++;
      const sec=curExam.sections.find(s=>s.kind===k);
      if((sec?sec.qs.length:0) < limits[k] && addOneToKind(k, false)) batchAdded++;
    }
    if(!batchAdded) break;
    renderExam(true);
    while(curExam._lastPageCount > targetPages && batchAdded > 0){
      const k = growCycle[(gStep - 1 + growCycle.length) % growCycle.length];
      if(removeOneFromKind(k, true)) batchAdded--;
      else break;
    }
    if(curExam._lastPageCount > targetPages) break;
  }
  while(needsMore() && totalQCount()<maxTotal && growCycle.length && gStep<60 && blockedKinds.size<growCycle.length && stalled<growCycle.length*2){
    const k=growCycle[gStep % growCycle.length];
    gStep++;
    if(blockedKinds.has(k)){stalled++;continue;}
    const sec=curExam.sections.find(s=>s.kind===k);
    const curLen=sec?sec.qs.length:0;
    if(curLen >= limits[k]){blockedKinds.add(k);stalled++;continue;}
    const ok=addOneToKind(k,true);
    if(!ok){
      blockedKinds.add(k);stalled++;
    }else if(curExam._lastPageCount>targetPages){
      removeOneFromKind(k,true);
      blockedKinds.add(k);
      stalled++;
    }else{
      stalled=0;
    }
  }

  renderExam(false);
  if(syncUi){
    [['mc','Mc'],['tf','Tf'],['fill','Fill'],['match','Match'],['calc','Calc'],['word','Word']].forEach(([k,u])=>{
      const sec=curExam.sections.find(s=>s.kind===k);
      if($('num'+u)) $('num'+u).value=String(sec?sec.qs.length:0);
    });
    updateCapInfo(curExam._lastPageCount);
  }
}

function generateFromUI(arg){
  const skipAutoBalance = arg === true;
  ['numMc','numTf','numFill','numMatch','numCalc','numWord'].forEach(clampInput);
  const allChks=[...document.querySelectorAll('#exUnits input')];
  const checkedChks=allChks.filter(i=>i.checked);
  const units=checkedChks.map(i=>i.value);
  const unitIndices=checkedChks.map(i=>+i.dataset.uidx);
  const cfg={
    pub:$('exPub').value, grade:$('exGrade').value, sem:$('exSem').value, subject:$('exSubj').value,
    diff:$('exDiff').value, layout:$('exLayout').value, withAns:$('exAns').checked, units,
    unitIndices, allUnitsCount:allChks.length,
    nMc:$('chkMc').checked?+$('numMc').value:0,
    nTf:$('chkTf').checked?+$('numTf').value:0,
    nFill:$('chkFill').checked?+$('numFill').value:0,
    nMatch:$('chkMatch').checked?+$('numMatch').value:0,
    nCalc:$('chkCalc').checked?+$('numCalc').value:0,
    nWord:$('chkWord').checked?+$('numWord').value:0
  };
  $('exMsg').textContent='';
  curExam=generateExamQuestions(cfg);
  const willBalance = !skipAutoBalance && $('exTwoPage') && $('exTwoPage').checked && $('exLayout').value==='2col';
  renderExam(willBalance);
  if(willBalance){
    const isZh=cfg.subject==='國語';
    autoBalanceExamToTarget(2, isZh?80:60, cfg, true);
  }
}
let lastDiceSig='';
function rollMixedDice(){
  const diffs=['easy','mid','hard','mix'];
  const curD=$('exDiff').value;
  $('exDiff').value=pick(diffs.filter(d=>d!==curD));
  $('exTwoPage').checked=true;
  $('exLayout').value='2col';

  const isZh=$('exSubj').value==='國語';
  let counts, sig='', guard=0;
  do{
    counts = isZh
      ? {Mc:rnd(6,8), Tf:rnd(5,7), Fill:rnd(4,6), Match:rnd(1,2), Calc:rnd(2,4), Word:rnd(2,3)}
      : {Mc:rnd(6,9), Tf:rnd(5,7), Fill:rnd(4,6), Match:rnd(1,2), Calc:rnd(2,4), Word:rnd(2,3)};
    sig=Object.values(counts).join('-');
    guard++;
  }while(sig===lastDiceSig && guard<15);

  ['Mc','Tf','Fill','Match','Calc','Word'].forEach(k=>{
    $('chk'+k).checked=true;
    $('num'+k).value=counts[k];
  });
  generateFromUI(false);
  lastDiceSig=['Mc','Tf','Fill','Match','Calc','Word'].map(k=>$('num'+k).value).join('-');
}

window.generateExamQuestions = generateExamQuestions;

// ===== 7. 前後台訂單串接、對帳管理、勾選列印與 Google 試算表同步引擎 =====
function buildDefaultSampleBatchCsv(){
  const now = new Date();
  const fmtT = d => `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  const t1 = fmtT(new Date(now.getTime() - 2*3600*1000));
  const t2 = fmtT(new Date(now.getTime() - 45*60*1000));
  const t3 = fmtT(new Date(now.getTime() - 15*60*1000));
  const p1 = new Date(now.getTime() - 7*24*3600*1000);
  const p2 = new Date(now.getTime() - 8*24*3600*1000);
  const p1Str = fmtT(p1), p2Str = fmtT(p2);
  const curWk = (typeof window.computeBatchWeekFromTimeStr==='function') ? window.computeBatchWeekFromTimeStr(t1, now) : '本週梯次';
  const prevWk = (typeof window.computeBatchWeekFromTimeStr==='function') ? window.computeBatchWeekFromTimeStr(p1Str, p1) : '上週梯次';
  const pPrint1 = fmtT(new Date(p1.getTime() + 5*3600*1000));
  const pPrint2 = fmtT(new Date(p2.getTime() + 6*3600*1000));
  return [
    'order_id,parent_label,plan,grade,sem,pub,subj,scope,diff,ruby,custom_words,custom_units,paid_status,amount,sheets,packType,remit_last5,contact,reconcile_note,created_at,batch_week,print_status,print_count,printed_at',
    `A01,王媽媽#8821,綜合套組,1,上,康軒,國語,全冊總複習,混合難度,是,,,已付款,100,20,綜合包,88210,0912-345-678,查帳OK,${t1},${curWk},未列印,0,`,
    `A02,林爸爸#3094,評量測驗卷,2,上,南一,數學,期中複習,標準評量,是,,,已付款,100,20,綜合包,30945,0922-111-222,台新核帳OK,${t2},${curWk},未列印,0,`,
    `A03,陳小姐#6512,筆畫寫字帖,3,上,翰林,國語,全冊總複習,標準評量,是,,,待核帳,100,20,綜合包,65129,0933-888-999,待確認入帳,${t3},${curWk},未列印,0,`,
    `A04,張媽媽#1178,評量測驗卷,4,上,康軒,自然科學,自選單元,素養挑戰,否,,月亮的圓缺變化,已付款,25,5,客製包,11782,0955-666-777,上週郵局查帳OK,${p1Str},${prevWk},已經列印,1,${pPrint1}`,
    `A05,黃先生#9405,評量測驗卷,6,上,南一,社會,期末複習,基礎熟練,否,,台灣的自然資源與物產,已付款,75,15,客製包,94051,0966-000-111,上週國泰查帳OK,${p2Str},${prevWk},已經列印,1,${pPrint2}`
  ].join('\n');
}
const SAMPLE_BATCH_CSV = buildDefaultSampleBatchCsv();

const LOCAL_ORDERS_KEY = 'kids_workshop_orders_db_v2';
let curBatchOrders = [];

function splitCsvLine(line){
  const res=[]; let cur='', inQ=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'){
      if(inQ&&line[i+1]==='"'){cur+='"';i++;}
      else inQ=!inQ;
    }else if((ch===','||ch==='\t')&&!inQ){
      res.push(cur.trim());cur='';
    }else{
      cur+=ch;
    }
  }
  res.push(cur.trim());
  return res;
}

function normalizeOrderRow(raw, idx){
  const order_id = String(raw.order_id || raw['取貨編號'] || raw['訂單編號'] || `A${String(idx+1).padStart(2,'0')}`).trim();
  const parent_label = String(raw.parent_label || raw['家長稱呼'] || raw['家長'] || '').trim();
  const planRaw = String(raw.plan || raw['方案'] || '綜合套組').trim();
  const isPreschool = /preschool|幼兒|小班|中班|大班/i.test(planRaw + ' ' + String(raw.packType||'') + ' ' + String(raw.grade||'') + ' ' + String(raw.pub||''));
  let plan = 'both', planName = '綜合套組（寫字帖＋測驗卷）';
  if(isPreschool){
    plan='preschool'; planName='幼兒園運筆寫字帖';
  }else if(/寫字|筆畫|筆順|生字|stroke/i.test(planRaw) && !/綜合|套組|雙享|both|\+|＋/i.test(planRaw)){
    plan='stroke'; planName='筆畫練習寫字帖';
  }else if(/測驗|評量|考卷|exam/i.test(planRaw) && !/綜合|套組|雙享|both|\+|＋/i.test(planRaw)){
    plan='exam'; planName='國小評量測驗卷';
  }

  const preLevel = raw.preLevel || (/大班/.test(String(raw.grade||raw.diff||''))?'large':(/中班/.test(String(raw.grade||raw.diff||''))?'mid':'small'));
  const preTopic = raw.preTopic || (/注音/.test(String(raw.subj||raw.scope||''))?'zy':(/數字/.test(String(raw.subj||raw.scope||''))?'num':(/ABC/i.test(String(raw.subj||raw.scope||''))?'abc':'all')));
  const preIllust = raw.preIllust !== undefined ? !!raw.preIllust : true;

  const gMatch = String(raw.grade || raw['年級'] || '').match(/[1-6]/);
  const grade = isPreschool
    ? (String(raw.grade||'').trim() || `幼兒園${preLevel==='large'?'大班':(preLevel==='mid'?'中班':'小班')}`)
    : (gMatch ? gMatch[0] : '');
  const semRaw = String(raw.sem || raw['學期'] || '上').trim();
  const sem = isPreschool ? (semRaw || '適齡先修') : (/下|2/.test(semRaw) ? '下' : '上');

  const pubRaw = String(raw.pub || raw['版本'] || (isPreschool?'pre':'std')).trim();
  let pub = isPreschool?'pre':'std', pubName = isPreschool?'台灣幼教適齡課綱':'108課綱通用';
  if(!isPreschool){
    if(/南一|^n$/i.test(pubRaw)){pub='n';pubName='南一版';}
    else if(/康軒|^k$/i.test(pubRaw)){pub='k';pubName='康軒版';}
    else if(/翰林|^h$/i.test(pubRaw)){pub='h';pubName='翰林版';}
  }

  let subj = String(raw.subj || raw['科目'] || '國語').trim();
  if(subj==='自然') subj='自然科學';
  if(subj==='英文'||subj==='美語') subj='英語';

  const scopeRaw = String(raw.scope || raw['範圍'] || 'all').trim();
  let scope = 'all', scopeName = '全冊總複習';
  if(/期中|mid/i.test(scopeRaw)){scope='mid';scopeName='期中複習卷';}
  else if(/期末|final/i.test(scopeRaw)){scope='final';scopeName='期末複習卷';}
  else if(/自選|單元|unit/i.test(scopeRaw)){scope='unit';scopeName='自選單元';}

  const diffRaw = String(raw.diff || raw['難度'] || 'mid').trim();
  let diff = 'mid', diffName = '標準評量';
  if(/基礎|簡單|easy/i.test(diffRaw)){diff='easy';diffName='基礎熟練';}
  else if(/素養|挑戰|困難|hard/i.test(diffRaw)){diff='hard';diffName='素養挑戰';}
  else if(/混合|mix/i.test(diffRaw)){diff='mix';diffName='混合難度';}

  const rubyRaw = raw.ruby !== undefined ? String(raw.ruby).trim() : String(raw['注音'] || '').trim();
  const ruby = rubyRaw ? /^(是|要|附|true|1|yes|y)$/i.test(rubyRaw) : (+grade<=2);

  const custom_words = String(raw.custom_words || raw['自訂生字'] || '').trim();
  const custom_units = String(raw.custom_units || raw['自選單元名稱'] || '').trim();
  if(custom_units && scope==='all'){scope='unit';scopeName='自選單元';}

  const paidRaw = String(raw.reconcile_status || raw.paid_status || raw['付款狀態'] || '待核帳').trim();
  const isInvalid = /無效|取消|invalid/i.test(paidRaw);
  const isPaid = !isInvalid && (/已付|已入帳|有效單|paid/i.test(paidRaw));
  const reconcile_status = isInvalid ? '❌ 無效單' : (isPaid ? '✅ 已入帳（有效單）' : '待核帳');
  const paid_status = isInvalid ? '無效單' : (isPaid ? '已付款' : '待核帳');

  const rawAmt = String(raw.amount || raw['金額'] || '').replace(/[^\d]/g,'');
  const rawSheets = String(raw.sheets || raw['訂購張數'] || raw['張數'] || '').replace(/[^\d]/g,'');
  const sheets = rawSheets ? Math.max(1, +rawSheets) : (rawAmt ? Math.max(1, Math.round(+rawAmt / 5)) : (plan==='both'?20:(custom_units||custom_words?1:20)));
  const defaultAmt = sheets * 5;
  const amount = rawAmt || String(defaultAmt);
  const packType = String(raw.packType || raw.packtype || raw['方案模式'] || (sheets >= 20 && !custom_units && !custom_words ? '綜合包' : '客製包')).trim();
  const remit_last5 = String(raw.remit_last5 || raw['後五碼'] || raw['匯款後五碼'] || '').trim();
  const contact = String(raw.contact || raw['聯絡電話'] || '').trim();
  const reconcile_note = String(raw.reconcile_note || raw['對帳備註'] || '').trim();

  let created_at = String(raw.created_at || raw['下單時間'] || '').trim();
  if(!created_at && raw.created_ts){
    const dt = new Date(+raw.created_ts);
    if(!isNaN(dt.getTime())){
      created_at = `${String(dt.getMonth()+1).padStart(2,'0')}/${String(dt.getDate()).padStart(2,'0')} ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
    }
  }
  const created_ts = raw.created_ts ? +raw.created_ts : 0;
  let batch_week = String(raw.batch_week || raw['批次週次'] || '').trim();
  if(!batch_week){
    batch_week = typeof window.computeBatchWeekFromTimeStr === 'function'
      ? window.computeBatchWeekFromTimeStr(created_at, created_ts ? new Date(created_ts) : undefined)
      : '本週梯次';
  }

  let print_count = Math.max(0, +(raw.print_count ?? raw['列印次數'] ?? 0) || 0);
  const prtRaw = String(raw.print_status || raw['列印狀態'] || '').trim();
  const isPrinted = raw.isPrinted !== undefined ? !!raw.isPrinted : (print_count > 0 || (/已經列印|已列印|printed/i.test(prtRaw) && !/未列印/.test(prtRaw)));
  if(isPrinted && print_count === 0) print_count = 1;
  const printed_at = String(raw.printed_at || raw['列印時間'] || '').trim();
  const print_status = isPrinted ? '已經列印' : '未列印';
  const isCompleted = isPaid && isPrinted && !isInvalid;

  const strokeMode = raw.strokeMode === 'B' ? 'B' : 'A';
  const cols = [5,6,7,8].includes(+raw.cols) ? +raw.cols : (+grade<=2?5:7);
  const layout = raw.layout === '1col' ? '1col' : '2col';
  const rowNumber = raw.rowNumber ? +raw.rowNumber : 0;

  // 參數合法性檢核
  const errors = [];
  if(!parent_label) errors.push('缺少家長稱呼');
  if(plan === 'preschool'){
    if(!grade) errors.push('請指定幼兒園班別');
  }else if(!grade || +grade<1 || +grade>6) errors.push('年級須為 1～6');
  else {
    const validSubs = (window.CURR_META && CURR_META.subjectsByGrade[grade]) || ['國語','數學','生活','自然科學','社會','英語'];
    if(plan!=='stroke' && !validSubs.includes(subj)){
      errors.push(`${grade}年級無「${subj}」科（可選：${validSubs.join('、')}）`);
    }
  }
  const valid = errors.length===0;
  const selectedForPrint = raw.selectedForPrint !== undefined ? !!raw.selectedForPrint : (valid && isPaid && !isPrinted);

  return {
    order_id, parent_label, contact, remit_last5, plan, planName, packType, sheets, grade, sem, pub, pubName,
    preLevel, preTopic, preIllust,
    subj, scope, scopeName, diff, diffName, ruby, custom_words, custom_units,
    strokeMode, cols, layout, rowNumber, created_at, created_ts, batch_week,
    isPrinted, print_count, printed_at, print_status, isCompleted,
    paid_status, reconcile_status, reconcile_note, isPaid, isInvalid, amount,
    valid, errors, selectedForPrint
  };
}
window.normalizeOrderRow = normalizeOrderRow;

function parseBatchCsv(text){
  const lines = String(text||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  if(!lines.length) return [];
  const stdCols = ['order_id','parent_label','plan','grade','sem','pub','subj','scope','diff','ruby','custom_words','custom_units','paid_status','amount','sheets','packType','remit_last5','contact','reconcile_note','created_at','batch_week','print_status','print_count','printed_at'];
  const firstCells = splitCsvLine(lines[0]);
  const hasHeader = /order_id|取貨|家長|parent|plan|方案|grade|年級/i.test(firstCells.join(','));
  const headers = hasHeader ? firstCells.map(h=>h.toLowerCase()) : stdCols;
  const startRow = hasHeader ? 1 : 0;
  const orders = [];
  for(let r=startRow;r<lines.length;r++){
    const cells = splitCsvLine(lines[r]);
    if(cells.every(c=>!c)) continue;
    const obj = {};
    if(!hasHeader){
      stdCols.forEach((col,idx)=>{ obj[col] = cells[idx]||''; });
    }else{
      headers.forEach((h,idx)=>{ obj[h] = cells[idx]||''; });
    }
    orders.push(normalizeOrderRow(obj, orders.length));
  }
  return orders;
}
window.parseBatchCsv = parseBatchCsv;

const LOCAL_ORDERS_CLEARED_KEY = 'kids_orders_cleared_v1';
const ORDER_IDB_NAME = 'SunflowerOrderBackupDB';
const ORDER_IDB_STORE = 'backups';
let _cloudBackupTimer = null;

function _openOrderBackupIDB(){
  return new Promise((resolve)=>{
    if(typeof indexedDB === 'undefined'){ resolve(null); return; }
    try{
      const req = indexedDB.open(ORDER_IDB_NAME, 1);
      req.onupgradeneeded = (e)=>{
        const db = e.target.result;
        if(!db.objectStoreNames.contains(ORDER_IDB_STORE)){
          db.createObjectStore(ORDER_IDB_STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = ()=> resolve(req.result);
      req.onerror = ()=> resolve(null);
    }catch(_){ resolve(null); }
  });
}

async function mirrorOrdersToIndexedDB(orders, reason='auto'){
  const db = await _openOrderBackupIDB();
  if(!db) return false;
  return new Promise((resolve)=>{
    try{
      const tx = db.transaction(ORDER_IDB_STORE, 'readwrite');
      const st = tx.objectStore(ORDER_IDB_STORE);
      const nowIso = new Date().toISOString();
      const nowTxt = formatNowMMDDHHmm();
      const cleanArr = Array.isArray(orders) ? orders : [];
      st.put({ id:'latest', savedAt: nowIso, savedLabel: nowTxt, reason, count: cleanArr.length, orders: cleanArr });
      const reqSnaps = st.get('snapshots');
      reqSnaps.onsuccess = ()=>{
        const prev = (reqSnaps.result && Array.isArray(reqSnaps.result.items)) ? reqSnaps.result.items : [];
        const nextSnap = { savedAt: nowIso, savedLabel: nowTxt, reason, count: cleanArr.length, orders: cleanArr };
        const items = [nextSnap, ...prev].slice(0, 20);
        st.put({ id:'snapshots', items });
      };
      tx.oncomplete = ()=>{
        try{ localStorage.setItem('sunflower_last_idb_backup_at', nowTxt); }catch(_){}
        refreshBackupStatusUI();
        resolve(true);
      };
      tx.onerror = ()=> resolve(false);
    }catch(_){ resolve(false); }
  });
}

async function readOrdersFromIndexedDB(){
  const db = await _openOrderBackupIDB();
  if(!db) return null;
  return new Promise((resolve)=>{
    try{
      const tx = db.transaction(ORDER_IDB_STORE, 'readonly');
      const req = tx.objectStore(ORDER_IDB_STORE).get('latest');
      req.onsuccess = ()=> resolve(req.result || null);
      req.onerror = ()=> resolve(null);
    }catch(_){ resolve(null); }
  });
}

const DEFAULT_CLOUD_GAS_URL = 'https://script.google.com/macros/s/AKfycbygUe5Y8ZbjERVcM6OVIZG_u91Bmp634I7EzekqXxR9B1PrJ-hv67hpsQD9dlQEuIc/exec';
let _cloudAutoSyncTimer = null;

function getAdminCloudBackupCreds(){
  let url = '', token = '';
  try{
    url = (localStorage.getItem('kids_gas_webapp_url') || localStorage.getItem('sunflower_gas_url') || '').trim();
    const ssTok = (sessionStorage.getItem('kids_admin_session_token') || '').trim();
    const lsTok = (localStorage.getItem('kids_cloud_session_token') || '').trim();
    token = (ssTok && ssTok !== 'local-dev-session' && ssTok !== 'local-hash-session') ? ssTok : (lsTok || ssTok);
  }catch(_){}
  if(!url && $('gasUrlInput')) url = ($('gasUrlInput').value || '').trim();
  if(!url) url = (window.DEFAULT_GAS_WEBAPP_URL || DEFAULT_CLOUD_GAS_URL).trim();
  return { url, token };
}

window.startCloudAutoSyncTimer = function(){
  if(typeof setInterval !== 'function') return;
  if(_cloudAutoSyncTimer) return;
  _cloudAutoSyncTimer = setInterval(()=>{
    const { url, token } = getAdminCloudBackupCreds();
    if(url && token && token !== 'local-dev-session' && token !== 'local-hash-session'){
      backupOrdersToGoogleCloud(curBatchOrders, true);
    }
  }, 5 * 60 * 1000);
};

window.autoConnectCloudOnLogin = async function(username, password){
  const { url } = getAdminCloudBackupCreds();
  if(!url || typeof fetch !== 'function') return { ok:false };
  try{
    localStorage.setItem('kids_gas_webapp_url', url);
    if($('gasUrlInput')) $('gasUrlInput').value = url;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'adminLogin', username: String(username||'admin').trim(), password: String(password||'').trim() })
    });
    const data = await resp.json();
    if(data && data.ok && data.sessionToken){
      try{
        sessionStorage.setItem('kids_admin_session_token', data.sessionToken);
        localStorage.setItem('kids_cloud_session_token', data.sessionToken);
      }catch(_){}
      refreshBackupStatusUI();
      if(typeof window.startCloudAutoSyncTimer === 'function') window.startCloudAutoSyncTimer();
      if(curBatchOrders && curBatchOrders.length){
        backupOrdersToGoogleCloud(curBatchOrders, true);
      }
      return data;
    }
  }catch(_){}
  return { ok:false };
};

window.triggerInstantCloudBackup = function(){
  const { url, token } = getAdminCloudBackupCreds();
  if(url && token && token !== 'local-dev-session' && token !== 'local-hash-session'){
    backupOrdersToGoogleCloud(curBatchOrders, true);
  }
};

async function backupOrdersToGoogleCloud(orders, silent=false){
  const { url, token } = getAdminCloudBackupCreds();
  if(!url || !token || token === 'local-dev-session' || token === 'local-hash-session'){
    refreshBackupStatusUI();
    if(!silent){
      if($('cloudSetupPanel')) $('cloudSetupPanel').style.display='';
      if($('batchMsg')){
        $('batchMsg').style.color='#b45309';
        $('batchMsg').textContent='ℹ️ 尚未取得本瀏覽器的 Google 雲端永久授權憑證！請點右上角「🔐 管理員後台」重新輸入一次管理員密碼即可自動直連（無須另填雲端密碼）；本機 IndexedDB 仍已保護中。';
      }
      if($('cloudWizardMsg')){
        $('cloudWizardMsg').style.color='#b45309';
        $('cloudWizardMsg').textContent='ℹ️ 請先由網站右上角管理員登入一次即可完成自動直連並永久保留憑證，重整網頁皆自動連線，無須再次輸入密碼。';
      }
    }
    return { ok:false, reason:'no_cloud_creds' };
  }
  if(!silent){
    if($('batchMsg')){
      $('batchMsg').style.color='#b45309';
      $('batchMsg').textContent=`⏳ 正在連線 Google 雲端並上傳備份 ${orders.length} 筆訂單至試算表與雲端硬碟，請稍候...`;
    }
    if($('cloudWizardMsg')){
      $('cloudWizardMsg').style.color='#b45309';
      $('cloudWizardMsg').textContent='⏳ 正在上傳雲端備份中...';
    }
  }
  try{
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'backupOrders', token, orders })
    });
    const data = await resp.json();
    if(data && data.ok){
      const lbl = formatNowMMDDHHmm();
      try{ localStorage.setItem('sunflower_last_cloud_backup_at', lbl); }catch(_){}
      refreshBackupStatusUI();
      const okTxt = `☁️ 雲端備份完成！已備份 ${data.count||orders.length} 筆訂單（最新備份時間：${lbl}），已寫入 Google 試算表「系統訂單備份紀錄」與雲端硬碟；下一步可繼續查帳修改，或隨時點「📥 從雲端救回訂單」讀取此版本。`;
      if(!silent){
        if($('batchMsg')){ $('batchMsg').style.color='#1f9d55'; $('batchMsg').textContent=okTxt; }
        if($('cloudWizardMsg')){ $('cloudWizardMsg').style.color='#136529'; $('cloudWizardMsg').textContent=okTxt; }
      }
      return data;
    }
    const errTxt = `⚠️ 雲端備份未成功：${(data&&data.error)||'授權已過期'}。請點擊右上角重新登入一次管理員後台即可自動刷新憑證。`;
    if(!silent){
      if($('batchMsg')){ $('batchMsg').style.color='#c0392b'; $('batchMsg').textContent=errTxt; }
      if($('cloudWizardMsg')){ $('cloudWizardMsg').style.color='#c0392b'; $('cloudWizardMsg').textContent=errTxt; }
    }
    return data || { ok:false };
  }catch(err){
    const failTxt = `⚠️ 雲端備份連線失敗（本機 IndexedDB 仍已安全備份）：${err.message}。請確認網路連線或於「雲端與密碼設定」確認端點網址。`;
    if(!silent){
      if($('batchMsg')){ $('batchMsg').style.color='#c0392b'; $('batchMsg').textContent=failTxt; }
      if($('cloudWizardMsg')){ $('cloudWizardMsg').style.color='#c0392b'; $('cloudWizardMsg').textContent=failTxt; }
    }
    return { ok:false, error: err.message };
  }
}

async function restoreOrdersFromGoogleCloud(){
  const { url, token } = getAdminCloudBackupCreds();
  if(!url || !token || token === 'local-dev-session' || token === 'local-hash-session'){
    if($('batchMsg')){
      $('batchMsg').style.color='#b45309';
      $('batchMsg').textContent='ℹ️ 尚未取得本瀏覽器 Google 雲端永久授權憑證，無法讀取雲端備份！請先由右上角重新登入一次管理員密碼即可自動直連，或使用右側「📂 匯入 JSON 還原」。';
    }
    return;
  }
  if($('batchMsg')){
    $('batchMsg').style.color='#b45309';
    $('batchMsg').textContent='⏳ 正在連線 Google 雲端並讀取最新訂單紀錄，請稍候...';
  }
  try{
    const sep = url.includes('?') ? '&' : '?';
    const resp = await fetch(`${url}${sep}action=getOrdersBackup&token=${encodeURIComponent(token)}`);
    const data = await resp.json();
    if(data && data.ok && Array.isArray(data.orders)){
      curBatchOrders = data.orders.map((o,i)=>normalizeOrderRow(o,i));
      const lbl = formatNowMMDDHHmm();
      try{ localStorage.setItem('sunflower_last_cloud_backup_at', lbl); }catch(_){}
      saveOrdersToLocalDB();
      syncCsvBoxFromOrders();
      renderBatchTable(curBatchOrders);
      refreshBackupStatusUI();
      const okTxt = `📥 已成功從 Google 雲端（${data.source||'試算表備份'}）救回 ${curBatchOrders.length} 筆訂單（雲端存檔時間：${data.savedAt||lbl}｜最新同步：${lbl}）！下一步：下方清單與對帳備註已同步更新，可直接核帳或列印。`;
      if($('batchMsg')){ $('batchMsg').style.color='#1f9d55'; $('batchMsg').textContent=okTxt; }
      if($('cloudWizardMsg')){ $('cloudWizardMsg').style.color='#136529'; $('cloudWizardMsg').textContent=okTxt; }
    }else if($('batchMsg')){
      $('batchMsg').style.color='#c0392b';
      $('batchMsg').textContent=`⚠️ 無法取得雲端備份：${(data&&data.error)||'雲端目前尚無訂單備份紀錄'}。您可先按「☁️ 立即備份」建立第一份最新備份。`;
    }
  }catch(err){
    if($('batchMsg')){
      $('batchMsg').style.color='#c0392b';
      $('batchMsg').textContent=`⚠️ 從 Google 雲端救回失敗：${err.message}。請確認網路或端點設定後再試。`;
    }
  }
}

function refreshBackupStatusUI(){
  const locEl = $('backupLocalStatus');
  const cldEl = $('backupCloudStatus');
  if(!locEl && !cldEl) return;
  let lastIdb = '', lastCld = '';
  try{
    lastIdb = localStorage.getItem('sunflower_last_idb_backup_at') || '';
    lastCld = localStorage.getItem('sunflower_last_cloud_backup_at') || '';
  }catch(_){}
  if(locEl){
    locEl.textContent = lastIdb
      ? `✅ 本機 IndexedDB 雙寫鏡像完成（共 ${curBatchOrders.length} 筆・更新於 ${lastIdb}）`
      : `本機 IndexedDB 自動鏡像就緒（目前 ${curBatchOrders.length} 筆）`;
  }
  if(cldEl){
    const { url, token } = getAdminCloudBackupCreds();
    const isConnected = !!(url && token && token !== 'local-dev-session' && token !== 'local-hash-session');
    if(isConnected){
      cldEl.textContent = lastCld
        ? `☁️ Google 雲端雙重自動備份已啟用｜最新備份時間：${lastCld}｜每 5 分鐘與每次異動自動同步中`
        : `☁️ Google 雲端已直接連線（每 5 分鐘與每次異動自動同步｜尚無同步時間紀錄，可點右側「☁️ 立即備份」）`;
      cldEl.style.color = '#14532d';
    }else{
      cldEl.textContent = `雲端備份：已載入預設試算表端點（登入網站後台一次即自動建立永久直連憑證；目前由本機 IndexedDB＋JSON 保護）`;
      cldEl.style.color = '#9a3412';
    }
    if($('btnToggleCloudSetup')){
      $('btnToggleCloudSetup').textContent = isConnected ? '✅ 雲端已連線（設定）' : '⚙️ 雲端與密碼設定';
      $('btnToggleCloudSetup').style.background = isConnected ? '#e7f8ee' : '#fff7ed';
      $('btnToggleCloudSetup').style.borderColor = isConnected ? '#22c55e' : '#fb923c';
      $('btnToggleCloudSetup').style.color = isConnected ? '#136529' : '#9a3412';
    }
    if($('gasUrlInput') && !$('gasUrlInput').value && url){
      $('gasUrlInput').value = url;
    }
  }
}

function exportOrdersJsonBackup(){
  const payload = {
    app: 'sunflower-study-shop',
    exportedAt: new Date().toISOString(),
    count: curBatchOrders.length,
    orders: curBatchOrders
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `向日葵國小伴學誌_訂單完整備份_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
}

function scheduleCloudAutoBackup(){
  if(typeof clearTimeout==='function') clearTimeout(_cloudBackupTimer);
  if(typeof setTimeout!=='function' || typeof fetch!=='function') return;
  _cloudBackupTimer = setTimeout(()=>{
    const { url, token } = getAdminCloudBackupCreds();
    if(url && token && token !== 'local-dev-session' && token !== 'local-hash-session'){
      backupOrdersToGoogleCloud(curBatchOrders, true);
    }
  }, 1500);
}

function saveOrdersToLocalDB(explicitClear=false){
  try{
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(curBatchOrders));
    if(explicitClear && curBatchOrders.length === 0) localStorage.setItem(LOCAL_ORDERS_CLEARED_KEY, '1');
    else localStorage.removeItem(LOCAL_ORDERS_CLEARED_KEY);
  }catch(_){}
  updateNavOrderBadge();
  mirrorOrdersToIndexedDB(curBatchOrders, explicitClear?'clear':'save');
  scheduleCloudAutoBackup();
}

function loadOrdersFromLocalDB(){
  try{
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if(raw !== null && raw !== ''){
      const arr = JSON.parse(raw);
      if(Array.isArray(arr)){
        return arr.map((o,i)=>normalizeOrderRow(o,i));
      }
    }
  }catch(_){}
  return null;
}
window.loadOrdersFromLocalDB = loadOrdersFromLocalDB;
window.backupOrdersToGoogleCloud = backupOrdersToGoogleCloud;

function syncCsvBoxFromOrders(){
  if(!$('batchCsvInput')) return;
  const csvCols=['order_id','parent_label','plan','grade','sem','pub','subj','scope','diff','ruby','custom_words','custom_units','paid_status','amount','sheets','packType','remit_last5','contact','reconcile_note','created_at','batch_week','print_status','print_count','printed_at'];
  const csvEsc=v=>{const s=String(v==null?'':v);return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s;};
  const csvLines=[csvCols.join(','), ...curBatchOrders.map(o=>csvCols.map(c=>csvEsc(c==='ruby'?(o.ruby?'是':'否'):o[c])).join(','))];
  $('batchCsvInput').value = csvLines.join('\n');
}

function updateNavOrderBadge(){
  const badge = $('navOrdBadge');
  if(!badge) return;
  const pendCount = curBatchOrders.filter(o=>!o.isPaid && !o.isInvalid).length;
  badge.textContent = String(curBatchOrders.length);
  badge.title = pendCount>0 ? `共 ${curBatchOrders.length} 筆訂單（${pendCount} 筆待核帳）` : `共 ${curBatchOrders.length} 筆訂單`;
}

// 供家長前台訂購完成時直接呼叫：即時將新成立之訂單寫入後台對帳清單！
window.receiveFrontendOrders = function(newOrderItems){
  if(!curBatchOrders.length){
    const saved = loadOrdersFromLocalDB();
    curBatchOrders = (saved !== null) ? saved : [];
  }
  const normalized = (Array.isArray(newOrderItems)?newOrderItems:[newOrderItems]).map((o,idx)=>normalizeOrderRow(o, curBatchOrders.length+idx));
  curBatchOrders = [...normalized, ...curBatchOrders];
  saveOrdersToLocalDB();
  syncCsvBoxFromOrders();
  renderBatchTable(curBatchOrders);
  return normalized;
};

// 同步後台系統批次時間軸看板（顯示當前週次、截單時間點與 9 點前後交貨分界）
window.refreshBatchSysClock = function(){
  const bar = $('batchSysClockBar');
  if(!bar) return;
  const sched = typeof window.computePickupSchedule === 'function'
    ? window.computePickupSchedule()
    : { batchLabel:'本週最新批次', cutoffStr:'週三 21:00', deliveryStr:'當週週五～週日', nextDeliveryStr:'次週週五～週日', isWedAfterCutoff:false };
  const now = new Date();
  const nowStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  bar.innerHTML = `
    <div>📅 <b>當前梯次：</b>${esc(sched.batchLabel)}　｜　🕒 <b>系統時間：</b>${esc(nowStr)}</div>
    <div>⏰ <b>截單／交貨分界：</b><b>${esc(sched.cutoffStr)} 前</b>入帳 → <b>${esc(sched.deliveryStr)}</b> 交貨；<b>9 點後</b>順延 <b>${esc(sched.nextDeliveryStr)}</b></div>
  `;
};

async function pushReconcileToCloud(_order){
  // 已撤除 Google Apps Script 外部同步欄位，對帳狀態與備註直接即時保存於本機系統資料庫與匯出 CSV
}

function getCurrentBatchWeekLabel(){
  return (typeof window.computePickupSchedule === 'function')
    ? window.computePickupSchedule().batchLabel
    : '本週梯次';
}

function populateWeekFilter(orders){
  const sel = $('batchWeekFilter');
  if(!sel) return;
  const prev = sel.value || '__CURRENT__';
  const curWeek = getCurrentBatchWeekLabel();
  const counts = new Map();
  (orders||[]).forEach(o=>{
    const w = o.batch_week || curWeek;
    counts.set(w, (counts.get(w)||0)+1);
  });
  const weeks = [...counts.keys()];
  const pastDoneCount = (orders||[]).filter(o=>o.batch_week && o.batch_week!==curWeek && o.isCompleted).length;
  const opts = [
    `<option value="__CURRENT__">📅 本週進行中（隱藏往週已完成${pastDoneCount?` ${pastDoneCount} 筆`:''}）</option>`,
    `<option value="__ALL__">📚 全部歷史週次（共 ${(orders||[]).length} 筆）</option>`,
    ...weeks.map(w=>`<option value="${esc(w)}">${esc(w)}（${counts.get(w)} 筆）</option>`)
  ];
  const weekVals = ['__CURRENT__', '__ALL__', ...weeks];
  sel.innerHTML = opts.join('');
  sel.value = weekVals.includes(prev) ? prev : '__CURRENT__';
}

function getFilteredBatchOrders(orders){
  const list = Array.isArray(orders) ? orders : [];
  const wk = $('batchWeekFilter') ? $('batchWeekFilter').value : '__CURRENT__';
  const st = $('batchStatusFilter') ? $('batchStatusFilter').value : 'all';
  const kw = $('batchSearchInput') ? $('batchSearchInput').value.trim().toLowerCase() : '';
  const curWeek = getCurrentBatchWeekLabel();
  return list.filter(o=>{
    const ow = o.batch_week || curWeek;
    if(wk === '__CURRENT__'){
      if(ow !== curWeek && o.isCompleted) return false;
    }else if(wk !== '__ALL__'){
      if(ow !== wk) return false;
    }
    if(st === 'pend' && (o.isPaid || o.isInvalid)) return false;
    if(st === 'unprinted' && (!o.isPaid || o.isInvalid || o.isPrinted)) return false;
    if(st === 'printed' && (!o.isPrinted || o.isInvalid)) return false;
    if(st === 'invalid' && !o.isInvalid) return false;
    if(kw){
      const hay = `${o.order_id||''} ${o.parent_label||''} ${o.remit_last5||''} ${o.contact||''} ${o.subj||''} ${o.reconcile_note||''}`.toLowerCase();
      if(!hay.includes(kw)) return false;
    }
    return true;
  });
}
window.getFilteredBatchOrders = getFilteredBatchOrders;

function renderReconcileStats(orders){
  const bar = $('recStatsBar');
  if(!bar) return;
  const paidList = orders.filter(o=>o.isPaid && !o.isInvalid);
  const pendList = orders.filter(o=>!o.isPaid && !o.isInvalid);
  const prtList = orders.filter(o=>o.valid && o.selectedForPrint);
  const printedDone = orders.filter(o=>o.isPrinted && !o.isInvalid).length;
  const paidSum = paidList.reduce((acc,o)=>acc+(+o.amount||0), 0);
  const pendSum = pendList.reduce((acc,o)=>acc+(+o.amount||0), 0);
  bar.innerHTML = `
    <div class="rec-stat-card">
      <div class="lbl">📊 篩選顯示訂單</div>
      <div class="val">${orders.length} 筆 <small style="font-size:.78rem">（已印 ${printedDone}）</small></div>
    </div>
    <div class="rec-stat-card paid">
      <div class="lbl">✅ 已入帳核對完成</div>
      <div class="val">${paidList.length} 筆 <small style="font-size:.82rem">（實收 $${paidSum}）</small></div>
    </div>
    <div class="rec-stat-card pend">
      <div class="lbl">⏳ 待核帳／未入帳</div>
      <div class="val">${pendList.length} 筆 <small style="font-size:.82rem">（待核 $${pendSum}）</small></div>
    </div>
    <div class="rec-stat-card prt">
      <div class="lbl">🖨️ 目前勾選準備列印</div>
      <div class="val">${prtList.length} 筆</div>
    </div>
  `;
}

function renderBatchTable(orders){
  const sumEl=$('batchSummary'), wrap=$('batchTableWrap');
  updateNavOrderBadge();
  if(typeof window.refreshBatchSysClock === 'function') window.refreshBatchSysClock();
  populateWeekFilter(orders);
  const viewOrders = getFilteredBatchOrders(orders);
  renderReconcileStats(viewOrders);
  if(!sumEl||!wrap)return;
  if(!orders.length){
    sumEl.style.display='none';
    wrap.innerHTML='<p class="hint">尚無訂單資料，請從前台測試下單、匯入 CSV，或點擊「📋 載入範例訂單」。</p>';
    return;
  }
  const curWeek = getCurrentBatchWeekLabel();
  const hiddenPastDone = orders.filter(o=>o.batch_week && o.batch_week!==curWeek && o.isCompleted).length;
  const wkSelVal = $('batchWeekFilter') ? $('batchWeekFilter').value : '__CURRENT__';
  if(!viewOrders.length){
    sumEl.style.display='flex';
    sumEl.className='cap-banner ok';
    sumEl.textContent = wkSelVal==='__CURRENT__' && hiddenPastDone
      ? `✅ 本週目前無待處理訂單（系統已自動隱藏往週已完成 ${hiddenPastDone} 筆，可由上方「📅 週次／梯次」切換「📚 全部歷史週次」隨時調閱）。`
      : 'ℹ️ 目前篩選條件下無符合訂單，請切換上方週次或狀態篩選。';
    wrap.innerHTML='<p class="hint">目前篩選無符合顯示的訂單；往週已完成紀錄可於上方「📅 週次／梯次」下拉選單隨時調閱。</p>';
    return;
  }

  const okCount = viewOrders.filter(o=>o.valid).length;
  const errCount = viewOrders.length - okCount;
  const selCount = viewOrders.filter(o=>o.valid && o.selectedForPrint).length;
  const hiddenHint = (wkSelVal==='__CURRENT__' && hiddenPastDone>0) ? `｜已隱藏往週已完成 ${hiddenPastDone} 筆（可由週次選單調閱）` : '';
  sumEl.style.display='flex';
  sumEl.className = 'cap-banner ' + (errCount>0?'warn':'ok');
  sumEl.textContent = errCount>0
    ? `⚠️ 顯示 ${viewOrders.length} 筆訂單（總庫 ${orders.length} 筆）：${okCount} 筆合法、${errCount} 筆有誤｜已勾選欲列印：${selCount} 筆${hiddenHint}`
    : `✅ 顯示 ${viewOrders.length} 筆訂單全部合法（總庫 ${orders.length} 筆）｜已勾選欲列印：${selCount} 筆${hiddenHint}`;

  const rowsHtml = viewOrders.map((o)=>{
    const i = curBatchOrders.indexOf(o);
    const shortPlan = o.plan==='both'?'綜合套組':(o.plan==='exam'?'評量測驗卷':'筆畫寫字帖');
    const stCls = o.isInvalid ? 'st-inv' : (o.isPaid ? 'st-paid' : 'st-pend');
    const rowCls = o.isInvalid ? 'row-inv' : (o.isPaid ? 'row-paid' : 'row-pend');
    const prtBadge = o.isPrinted
      ? `<span class="prt-badge is-printed" title="最近列印：${esc(o.printed_at||'已列印')}">✅ 已經列印（${o.print_count||1}次）${o.printed_at?`<small>${esc(o.printed_at)}</small>`:''}</span>`
      : `<span class="prt-badge not-printed">🖨️ 未列印</span>`;
    return `<tr class="${rowCls}${o.selectedForPrint?' is-picked':''}" data-order-id="${esc(o.order_id)}">
    <td style="text-align:center">
      <label class="chk" title="勾選是否列印此筆家長教材" style="justify-content:center">
        <input type="checkbox" class="ord-print-chk" data-idx="${i}" ${o.selectedForPrint?'checked':''} ${!o.valid?'disabled':''}>
      </label>
    </td>
    <td>
      <div class="ord-id-line"><span class="ord-id-pill">${esc(o.order_id)}</span> <b class="ord-parent">${esc(o.parent_label||'(未填)')}</b></div>
      ${o.contact?`<div style="font-size:.77rem;color:#475569;margin-top:2px">📞 ${esc(o.contact)}</div>`:''}
      <div style="font-size:.74rem;color:#64748b;margin-top:2px">${o.created_at?`🕒 ${esc(o.created_at)}`:'🕒 未填時間'}</div>
      <div style="margin-top:3px"><span class="week-pill">${esc(o.batch_week||curWeek)}</span></div>
    </td>
    <td>
      <div><b>${esc(shortPlan)}</b> <span class="ord-pack-tag">${esc(o.packType||'綜合包')}</span>・<b>${o.sheets||20} 張</b></div>
      <div style="font-size:.8rem;color:#1e293b;margin-top:2px">${o.grade?`${o.grade}年級${o.sem}`:'-'}・${esc(o.pubName)}・<b>${esc(o.subj)}</b>｜${esc(o.scopeName)}（${esc(o.diffName)}/${o.ruby?'注音':'無注音'}）</div>
      ${o.custom_units?`<div style="font-size:.75rem;color:#475569">範圍：${esc(o.custom_units)}</div>`:''}
      ${o.custom_words?`<div style="font-size:.75rem;color:#475569">生字：${esc(o.custom_words.slice(0,16))}</div>`:''}
    </td>
    <td>
      <div class="ord-amt">$${esc(o.amount)}</div>
      <div class="ord-last5">末五碼：${esc(o.remit_last5||'未填')}</div>
      <div style="margin-top:4px">${prtBadge}</div>
    </td>
    <td>
      <div style="display:flex;align-items:center;gap:4px;margin-bottom:4px">
        <input type="checkbox" class="ord-paid-chk" data-idx="${i}" ${o.isPaid?'checked':''} title="打勾代表已核對匯款入帳">
        <select class="rec-status-sel ${stCls}" data-idx="${i}" style="max-width:100%;font-size:.78rem">
          <option value="待核帳" ${!o.isPaid&&!o.isInvalid?'selected':''}>⏳ 待核帳</option>
          <option value="✅ 已入帳（有效單）" ${o.isPaid?'selected':''}>✅ 已入帳</option>
          <option value="❌ 無效單" ${o.isInvalid?'selected':''}>❌ 無效單</option>
        </select>
      </div>
      <input type="text" class="rec-note-input" data-idx="${i}" value="${esc(o.reconcile_note||'')}" placeholder="填寫對帳備註" style="width:100%">
    </td>
    <td style="text-align:center">
      <div class="ord-actions">
        ${o.valid?`<span class="badge-ok">✅ 合法</span>`:`<span class="badge-err">❌ 有誤</span><div style="font-size:.7rem;color:#a71d2a">${esc(o.errors.join('；'))}</div>`}
        <button type="button" class="btn-mini pagepick ord-page-pick-btn" data-idx="${i}" ${!o.valid?'disabled':''} title="列出此訂單所有頁面，可單獨檢視並只列印其中出錯的某一頁">📄 單頁補印</button>
        <button type="button" class="btn-mini reprint ord-reprint-btn" data-idx="${i}" ${!o.valid?'disabled':''} title="發現整份需重印時，點此重生成整份並記錄列印次數">🔁 整筆重印</button>
        <button type="button" class="btn-mini del ord-del-btn" data-idx="${i}" title="刪除此筆訂單（刪除後不復活）">🗑️ 刪除</button>
      </div>
    </td>
  </tr>`;
  }).join('');

  wrap.innerHTML = `<table class="batch-tbl orders-tbl">
    <colgroup><col style="width:44px"><col style="width:20%"><col style="width:28%"><col style="width:16%"><col style="width:21%"><col style="width:94px"></colgroup>
    <thead><tr>
      <th style="text-align:center">印製</th>
      <th>批號／家長／下單時間</th>
      <th>訂購內容與範圍明細</th>
      <th>金額／列印狀態</th>
      <th>💰 對帳確認＆備註紀錄</th>
      <th style="text-align:center">檢核＆操作</th>
    </tr></thead>
    <tbody>${rowsHtml}</tbody>
  </table>`;

  // 綁定「勾選列印」事件
  wrap.querySelectorAll('.ord-print-chk').forEach(chk=>{
    chk.onchange=()=>{
      const idx=+chk.dataset.idx;
      if(curBatchOrders[idx]){
        curBatchOrders[idx].selectedForPrint = chk.checked;
        saveOrdersToLocalDB();
        renderBatchTable(curBatchOrders);
      }
    };
  });

  // 綁定「對帳確認打勾」事件（打勾即設為已入帳，未印過者自動勾選列印）
  wrap.querySelectorAll('.ord-paid-chk').forEach(chk=>{
    chk.onchange=()=>{
      const idx=+chk.dataset.idx;
      const ord=curBatchOrders[idx];
      if(!ord)return;
      ord.isPaid = chk.checked;
      ord.isInvalid = false;
      ord.reconcile_status = chk.checked ? '✅ 已入帳（有效單）' : '待核帳';
      ord.paid_status = chk.checked ? '已付款' : '待核帳';
      ord.isCompleted = ord.isPaid && ord.isPrinted && !ord.isInvalid;
      ord.selectedForPrint = chk.checked && ord.valid && !ord.isPrinted;
      if(chk.checked && !ord.reconcile_note){
        const now=new Date();
        ord.reconcile_note = `${now.getMonth()+1}/${now.getDate()} 核帳OK`;
      }
      saveOrdersToLocalDB();
      syncCsvBoxFromOrders();
      pushReconcileToCloud(ord);
      renderBatchTable(curBatchOrders);
    };
  });

  // 綁定「對帳狀態下拉選單」事件
  wrap.querySelectorAll('.rec-status-sel').forEach(sel=>{
    sel.onchange=()=>{
      const idx=+sel.dataset.idx;
      const ord=curBatchOrders[idx];
      if(!ord)return;
      const v=sel.value;
      ord.reconcile_status = v;
      ord.isInvalid = /無效/.test(v);
      ord.isPaid = !ord.isInvalid && /已入帳/.test(v);
      ord.paid_status = ord.isInvalid ? '無效單' : (ord.isPaid ? '已付款' : '待核帳');
      ord.isCompleted = ord.isPaid && ord.isPrinted && !ord.isInvalid;
      ord.selectedForPrint = ord.isPaid && ord.valid && !ord.isPrinted;
      saveOrdersToLocalDB();
      syncCsvBoxFromOrders();
      pushReconcileToCloud(ord);
      renderBatchTable(curBatchOrders);
    };
  });

  // 綁定「對帳備註欄」即時儲存事件
  wrap.querySelectorAll('.rec-note-input').forEach(inp=>{
    inp.onchange=()=>{
      const idx=+inp.dataset.idx;
      const ord=curBatchOrders[idx];
      if(!ord)return;
      ord.reconcile_note = inp.value.trim();
      saveOrdersToLocalDB();
      syncCsvBoxFromOrders();
      pushReconcileToCloud(ord);
    };
  });

  // 綁定「單筆整份重印」與「指定單頁補印」事件
  wrap.querySelectorAll('.ord-page-pick-btn').forEach(btn=>{
    btn.onclick=async()=>{
      const idx=+btn.dataset.idx;
      const ord=curBatchOrders[idx];
      if(!ord || !ord.valid) return;
      await generateBatchAll([ord]);
      const pgCnt = $('batchSheet') ? $('batchSheet').querySelectorAll('.a4').length : 0;
      if($('batchMsg')){
        $('batchMsg').style.color='#1f9d55';
        $('batchMsg').textContent=`📄 已展開【${ord.order_id} ${ord.parent_label}】共 ${pgCnt} 頁，請點下方「單頁快速列印」頁籤或捲動至該頁標題右側按「🖨️ 僅列印此頁」！`;
      }
      const targetBar = $('batchSinglePgBar') || $('batchSheet');
      if(targetBar && typeof targetBar.scrollIntoView === 'function'){
        targetBar.scrollIntoView({ behavior:'smooth', block:'nearest' });
      }
    };
  });

  wrap.querySelectorAll('.ord-reprint-btn').forEach(btn=>{
    btn.onclick=async()=>{
      const idx=+btn.dataset.idx;
      const ord=curBatchOrders[idx];
      if(!ord || !ord.valid) return;
      await generateBatchAll([ord]);
      markOrdersAsPrinted([idx]);
      if($('batchMsg')){
        $('batchMsg').style.color='#1f9d55';
        $('batchMsg').textContent=`🔁 已重新生成【${ord.order_id} ${ord.parent_label}】準備重複列印（目前累積列印 ${ord.print_count} 次），請確認列印對話框！`;
      }
      let st=$('examPrintStyle');if(!st){st=document.createElement('style');st.id='examPrintStyle';document.head.appendChild(st);}
      st.textContent='@media print{@page{size:A4 portrait;margin:0}}';
      window.print();
    };
  });

  // 綁定「單筆刪除」事件（立即刪除並寫入本機 DB，不再復活）
  wrap.querySelectorAll('.ord-del-btn').forEach(btn=>{
    btn.onclick=()=>{
      const idx=+btn.dataset.idx;
      if(idx<0 || idx>=curBatchOrders.length) return;
      const removed = curBatchOrders.splice(idx, 1)[0];
      lastClearedOrdersSnapshot = [removed, ...curBatchOrders];
      saveOrdersToLocalDB();
      syncCsvBoxFromOrders();
      renderBatchTable(curBatchOrders);
      if($('btnUndoClearOrders')) $('btnUndoClearOrders').style.display='';
      if($('batchMsg')){
        $('batchMsg').style.color='#b45309';
        $('batchMsg').textContent=`🗑️ 已刪除訂單「${removed.order_id} ${removed.parent_label}」；如誤刪可點上方「↩️ 復原清空」或重新匯入。`;
      }
    };
  });
}

// 產生每筆訂單專屬「一張 A4 半張雙聯裁切單（上聯：貼袋外取貨單｜虛線撕開｜下聯：內部揀貨單）」
function buildCoverPageA4(order, idx, totalOrders, stats, wmText){
  const pg = document.createElement('div');
  pg.className = 'a4 cover-a4';
  pg.appendChild(Object.assign(document.createElement('div'),{className:'edge'}));
  const today = new Date().toISOString().slice(0,10);
  const sched = typeof window.computePickupSchedule === 'function'
    ? window.computePickupSchedule()
    : { batchLabel:'當週梯次', deliveryStr:'每週五中午 12:00 起 ～ 每週日晚上 21:00 止' };
  const batchSeq = `第 ${idx+1}/${totalOrders} 袋`;
  const cpr = window.COPYRIGHT_STATEMENT || '🌻 向日葵國小伴學誌｜108課綱原創練習・專屬訂製請勿轉售';

  const pickCheckItems = [];
  if(stats.strokePages>0) pickCheckItems.push(`<li>☐ <b>筆畫寫字帖</b>：${stats.strokePages} 頁（收錄 ${stats.strokeChars} 字・${order.strokeMode==='B'?'教育部格':'筆順引導'}）</li>`);
  if(stats.examQPages>0) pickCheckItems.push(`<li>☐ <b>${esc(order.grade)}年級${esc(order.sem)} ${esc(order.subj)}測驗卷</b>：試卷 ${stats.examQPages} 頁</li>`);
  if(stats.examAnsPages>0) pickCheckItems.push(`<li>☐ <b>免費附贈解答</b>：${stats.examAnsPages} 頁</li>`);
  if(stats.paddedBlank) pickCheckItems.push(`<li>☐ <b>雙面防串頁墊頁</b>：1 頁</li>`);

  const inner = document.createElement('div');
  inner.className = 'cover-wrap';
  inner.innerHTML = `
    <!-- 上半聯：貼於包裝袋外【取貨單】（不顯示取貨地點、不顯示已入帳金額） -->
    <div class="cover-half cover-half-pickup">
      <div>
        <div class="cover-brand">
          <h2>🌻 向日葵國小伴學誌｜訂製教材取貨單</h2>
          <span>批號：${batchSeq}｜${esc(sched.batchLabel)}</span>
        </div>
        <div class="cover-hero">
          <div class="cover-box">
            <div class="lbl">📦 取貨編號（PICKUP ID）</div>
            <div class="val-big">${esc(order.order_id)}</div>
          </div>
          <div class="cover-box">
            <div class="lbl">👨‍👩‍👧 取貨家長稱呼＋手機末四碼</div>
            <div class="val-mid">${esc(order.parent_label)}</div>
          </div>
        </div>
      </div>
      <div class="cover-grid">
        <div><b>年級／科目：</b><span>${order.plan==='preschool'?`${esc(order.grade)}｜${esc(order.subj)}`:`國小 ${esc(order.grade)} 年級 ${esc(order.sem)}｜${esc(order.subj)}（${esc(order.pubName)}）`}</span></div>
        <div><b>訂購方案：</b><span>${esc(order.planName)}（${esc(order.packType||'綜合包')}）</span></div>
        <div><b>教材張數：</b><span>共 ${order.sheets||20} 張內容（印製 ${stats.contentPages-1} 頁＋本取貨聯）</span></div>
        <div><b>領取時程：</b><span><b>${esc(sched.deliveryStr)}</b>（請於週五中午 12:00 以後至週日晚上 21:00 以前憑編號領取）</span></div>
      </div>
      <div style="font-size:.78rem;color:#666;border-top:1px dashed #ddd;padding-top:5px;margin-top:6px;display:flex;justify-content:space-between;gap:8px">
        <span>※ 客製教材僅供個人練習，請核對取貨編號與家長稱呼後領取</span>
        <span>印製日：${today}</span>
      </div>
    </div>

    <!-- 中間裁切虛線 -->
    <div class="cut-line"><span>✂️ ──── 沿此虛線對半裁切（上聯外貼包裝袋 ／ 下聯留存揀貨或入袋核對） ──── ✂️</span></div>

    <!-- 下半聯：內部檢貨存查【揀貨單】（含帳務核對、後五碼、詳細單元與項目勾選） -->
    <div class="cover-half cover-half-picklist">
      <div>
        <div class="cover-brand" style="border-bottom-color:#8b5a2b;margin-bottom:8px">
          <h2 style="color:#6b3e00;font-size:1.05rem">📋 內部揀貨裝袋明細單（核對留存聯）</h2>
          <span>批號 ${batchSeq}｜單號 ${esc(order.order_id)}</span>
        </div>
        <div class="cover-grid" style="border-top:none;padding-top:0;font-size:.84rem">
          <div><b>家長／電話：</b><span>${esc(order.parent_label)}${order.contact?`（${esc(order.contact)}）`:''}</span></div>
          <div><b>下單／梯次：</b><span>${esc(order.created_at||'—')}｜${esc(sched.batchLabel)}</span></div>
          <div><b>年級／版本：</b><span>${order.plan==='preschool'?`${esc(order.grade)}・${esc(order.pubName)}`:`${esc(order.grade)}年級${esc(order.sem)}・${esc(order.pubName)}`}・${esc(order.subj)}</span></div>
          <div><b>範圍／規格：</b><span>${esc(order.scopeName)}・${esc(order.diffName)}・${order.ruby?'附注音':'無注音'}</span></div>
        </div>
        <div class="cover-items">
          <h4>📦 裝袋項目逐筆檢核（總印製：${stats.contentPages} 頁）</h4>
          <ul class="cover-list">${pickCheckItems.join('')}</ul>
          ${order.custom_units?`<div style="font-size:.78rem;color:#555;margin-top:4px">📌 指定單元/課次：${esc(order.custom_units)}</div>`:''}
          ${order.custom_words?`<div style="font-size:.78rem;color:#555;margin-top:2px">📌 指定生字：${esc(order.custom_words)}</div>`:''}
        </div>
      </div>
      <div class="cover-foot">
        <div style="font-size:.82rem;color:#333">
          <b>💳 後五碼：</b>${esc(order.remit_last5||'未填')}　｜　<b>應付／張數：</b>${order.sheets||20} 張 / NT$ ${esc(order.amount)}
          ${order.reconcile_note?`<br><span style="color:#136529">📝 對帳備註：${esc(order.reconcile_note)}</span>`:''}
        </div>
        <div class="cover-status ${order.isPaid?'paid':'unpaid'}" style="font-size:.95rem;padding:4px 10px">
          ${order.isPaid ? `✅ 已入帳 $${esc(order.amount)}` : `⏳ 待核帳 $${esc(order.amount)}`}
        </div>
      </div>
    </div>
  `;
  pg.appendChild(inner);
  if(window.createWatermarkLayer) pg.appendChild(window.createWatermarkLayer(794,1122,wmText));
  pg.appendChild(Object.assign(document.createElement('div'),{className:'cap',textContent:`${cpr}　｜　雙聯取貨／揀貨單 ${order.order_id}（${order.parent_label}）`}));
  return pg;
}

// 將橫式國語測驗卷（1122×794）封裝進直式 A4 容器（794×1122）並順時針旋轉 90 度，支援整批免切換方向一鍵列印
function wrapLandscapePageForBatch(landPg){
  const holder = document.createElement('div');
  holder.className = 'a4 batch-land-holder';
  holder.appendChild(Object.assign(document.createElement('div'),{className:'edge'}));
  const inner = document.createElement('div');
  inner.className = 'ex-land-inner exam-a4';
  [...landPg.childNodes].forEach(node=>{
    if(node.classList && node.classList.contains('edge')) return;
    inner.appendChild(node.cloneNode(true));
  });
  holder.appendChild(inner);
  return holder;
}

const LAZY_EXAM_PROFILES = [
  { name:'基礎觀念＋雙選穩固卷', diff:'easy', nMc:11, nTf:9,  nFill:6, nMatch:0, nCalc:0, nWord:0 },
  { name:'五題型均衡評量卷',     diff:'mid',  nMc:8,  nTf:6,  nFill:5, nMatch:1, nCalc:4, nWord:0 },
  { name:'填空實作＋圖文配對卷', diff:'mid',  nMc:6,  nTf:0,  nFill:8, nMatch:1, nCalc:4, nWord:3 },
  { name:'觀念是非＋基礎應用卷', diff:'easy', nMc:0,  nTf:10, nFill:7, nMatch:0, nCalc:4, nWord:3 },
  { name:'精選選擇＋實戰加強卷', diff:'mid',  nMc:11, nTf:0,  nFill:7, nMatch:0, nCalc:5, nWord:0 },
  { name:'閱讀素養＋圖表挑戰卷', diff:'hard', nMc:8,  nTf:6,  nFill:0, nMatch:1, nCalc:3, nWord:4 },
  { name:'高分易錯診斷特訓卷', diff:'hard', nMc:9,  nTf:7,  nFill:6, nMatch:0, nCalc:4, nWord:0 },
  { name:'期中期末進階總複習', diff:'mix',  nMc:7,  nTf:6,  nFill:5, nMatch:1, nCalc:4, nWord:3 }
];
window.LAZY_EXAM_PROFILES = LAZY_EXAM_PROFILES;
window.normalizeTemplateSig = normalizeTemplateSig;

// 依單張試卷答案彙整出精簡「免費附贈紙本解答彙整頁」（採動態實測高度自動分頁，絕不底端截斷、不產空白頁）
function buildBatchAnswerPagesA4(records, order, wmText){
  const out = [];
  if(!records.length) return out;
  const optMap = order.subj==='英語' ? ['(A)','(B)','(C)','(D)'] : ['①','②','③','④'];
  const matchL = 'ㄅㄆㄇㄈㄉㄊㄋㄌ';
  const cpr = window.COPYRIGHT_STATEMENT||'🌻 向日葵國小伴學誌｜108課綱原創練習・專屬訂製請勿轉售';

  const makePageShell = ()=>{
    const pg = document.createElement('div');
    pg.className = 'a4 exam-a4';
    pg.appendChild(Object.assign(document.createElement('div'),{className:'edge'}));
    const inner = document.createElement('div');
    inner.className = 'ex-inner';
    inner.style.padding = '22px 28px 34px';
    const hd = document.createElement('div');
    hd.className = 'ex-hd';
    hd.style.cssText = 'margin-bottom:10px;padding-bottom:6px';
    hd.innerHTML = `<h3 class="ans-hd-title" style="font-size:17px">🎁 免費附贈紙本解答彙整｜國小 ${esc(order.grade)} 年級${esc(order.sem)} ${esc(order.subj)}</h3>
      <div class="ex-sub">取貨編號：${esc(order.order_id)}　｜　家長：${esc(order.parent_label)}　｜　共 ${records.length} 份不重複試卷詳解對照</div>`;
    inner.appendChild(hd);
    pg.appendChild(inner);
    return { pg, inner, hd };
  };

  const renderSecDiv = (rec, sec)=>{
    const CN=['一','二','三','四','五','六'];
    const secIdx = rec.sections.indexOf(sec);
    const secPrefix = secIdx >= 0 && CN[secIdx] ? `${CN[secIdx]}、` : '';
    const items = sec.qs.map((q,qi)=>{
      let ans = q.a;
      if(sec.kind==='mc'){ const ix=q.opts.indexOf(q.a); ans = `${optMap[ix]||''} ${q.a}`; }
      else if(sec.kind==='match'){ ans = q.pairs.map((pr,j)=>`(${j+1})→${matchL[q.right.indexOf(pr[1])]}`).join('/'); }
      ans = String(ans).replace(/(^|\s)(\d+)\.\s/g,'$1($2) ');
      return `<b>${qi+1}.</b>${esc(ans)}`;
    }).join('　');
    const div = document.createElement('div');
    div.style.marginTop = '3px';
    div.innerHTML = `<span style="color:#b35a00;font-weight:700">${esc(secPrefix + sec.title)}：</span>${items}`;
    return div;
  };

  const makeCardShell = (rec, isCont=false)=>{
    const card = document.createElement('div');
    card.style.cssText = 'border:1.5px solid #cbd5e1;border-radius:8px;padding:7px 11px;margin-bottom:8px;background:#fafcff;font-size:12px;line-height:1.42';
    card.innerHTML = `<div style="font-weight:800;color:#1e3a5f;border-bottom:1px dashed #cbd5e1;padding-bottom:3px;margin-bottom:4px">第 ${rec.sheetNo} 份｜${esc(rec.profileName)}${isCont?'（續）':''}　<small style="font-weight:600;color:#64748b">範圍：${esc(rec.unitsLabel)}</small></div>`;
    return card;
  };

  // 以隱藏實測容器計算實際像素高度（1122px A4 保留底部 74px 安全區 → 上限 1048px）
  const meas = document.createElement('div');
  meas.style.cssText = 'position:fixed;left:-9999px;top:0;visibility:hidden;z-index:-1';
  document.body.appendChild(meas);

  const MAX_H = 1048;
  const pageItems = [];
  let cur = makePageShell();
  meas.appendChild(cur.pg);
  pageItems.push(cur);

  records.forEach(rec=>{
    const cardFull = makeCardShell(rec, false);
    rec.sections.forEach(sec=> cardFull.appendChild(renderSecDiv(rec, sec)));
    cur.inner.appendChild(cardFull);
    if(cur.inner.scrollHeight <= MAX_H){
      return;
    }
    // 整卡加入會超過單頁安全高度：若本頁已有其他試卷卡，先開新頁放這張整卡；若空頁單卡就超過，則拆大題分頁
    cur.inner.removeChild(cardFull);
    if(cur.inner.children.length > 1){
      meas.removeChild(cur.pg);
      cur = makePageShell();
      meas.appendChild(cur.pg);
      pageItems.push(cur);
      cur.inner.appendChild(cardFull);
      if(cur.inner.scrollHeight <= MAX_H){
        return;
      }
      cur.inner.removeChild(cardFull);
    }
    // 單卡過長時按大題逐步安全裝入，保證絕不截斷
    let partCard = makeCardShell(rec, false);
    cur.inner.appendChild(partCard);
    rec.sections.forEach(sec=>{
      const sd = renderSecDiv(rec, sec);
      partCard.appendChild(sd);
      if(cur.inner.scrollHeight > MAX_H && partCard.children.length > 2){
        partCard.removeChild(sd);
        meas.removeChild(cur.pg);
        cur = makePageShell();
        meas.appendChild(cur.pg);
        pageItems.push(cur);
        partCard = makeCardShell(rec, true);
        partCard.appendChild(sd);
        cur.inner.appendChild(partCard);
      }
    });
  });

  if(cur.pg.parentNode === meas) meas.removeChild(cur.pg);
  document.body.removeChild(meas);

  const totalPages = pageItems.length;
  pageItems.forEach((item, p)=>{
    const tEl = item.hd.querySelector('.ans-hd-title');
    if(tEl) tEl.textContent += `（${p+1}/${totalPages}）`;
    if(window.createWatermarkLayer) item.pg.appendChild(window.createWatermarkLayer(794,1122,wmText||''));
    item.pg.appendChild(Object.assign(document.createElement('div'),{className:'cap',textContent:`${cpr}　｜　免費附贈解答彙整 第 ${p+1} / ${totalPages} 頁`}));
    out.push(item.pg);
  });
  return out;
}

// 依單筆訂單設定產生測驗卷 DOM 頁面陣列（支援 1 份自訂單張、及 10/20 張完全不重複綜合包）
const __batchYieldToUI = () => new Promise(r => setTimeout(r, 0));
async function buildExamPagesForOrder(order, withAns, wmText, keepLandscapeRaw=false, onProgress=null){
  const prevRuby = $('exRuby').checked;
  const prevTwo = $('exTwoPage').checked;
  const prevExam = curExam;

  $('exRuby').checked = !!order.ruby;
  $('exTwoPage').checked = true;

  let allU = (((window.CURRICULUM||{})[order.grade]||{})[order.subj]||{})[order.sem] || [];
  if(order.subj==='國語' && window.TW){
    const twKey = order.sem==='下'?'114下':'115上';
    const pKey = (order.pub==='std'||!order.pub)?'k':order.pub;
    const twLs = ((TW[twKey]||TW['115上']||{})[pKey]||[]).filter(x=>x.g==+order.grade);
    if(twLs.length) allU = twLs.map(x=>({name:x.t,topics:[`生字 ${x.c.length} 字`]}));
  }
  let pickedIdx = allU.map((_,i)=>i);
  if(order.scope==='mid'){
    const mid = Math.ceil(allU.length/2);
    pickedIdx = pickedIdx.slice(0,mid);
  }else if(order.scope==='final'){
    const mid = Math.ceil(allU.length/2);
    pickedIdx = pickedIdx.slice(mid);
  }else if(order.scope==='unit' && order.custom_units){
    const keys = order.custom_units.split(/[、,，;；/]/).map(s=>s.trim()).filter(Boolean);
    const m = allU.map((u,i)=>keys.some(k=>u.name.includes(k)||k.includes(u.name))?i:-1).filter(i=>i>=0);
    if(m.length) pickedIdx = m;
  }

  const rawSheets = +order.sheets || (order.packType==='客製包' ? 1 : 20);
  const examSheetsTarget = order.sampleLimit ? 1 : Math.max(1, Math.min(25, order.plan==='both' ? Math.floor(rawSheets/2) : rawSheets));
  const isZh = order.subj==='國語';
  const box = $('examSheet');
  const savedNodes = [...box.childNodes];

  const excludeQuestions = new Set();
  const excludeSigs = new Set();
  const qDomPages = [];
  const ansRecords = [];
  let singleAnsPageCount = 0;

  const pickSheetUnits = (sIdx)=>{
    const L = pickedIdx.length;
    if(L <= 1) return pickedIdx;
    if(order.packType==='客製包' && order.custom_units && examSheetsTarget===1) return pickedIdx;
    if(sIdx < L) return [pickedIdx[sIdx]];
    if(sIdx < L * 2){
      const a = (sIdx - L) % L;
      const b = (a + 1 + Math.floor((sIdx - L) / L)) % L;
      return a===b ? [pickedIdx[a]] : [pickedIdx[a], pickedIdx[b]];
    }
    if(L >= 3){
      const a = sIdx % L;
      return [pickedIdx[a], pickedIdx[(a+1)%L], pickedIdx[(a+2)%L]];
    }
    return pickedIdx;
  };

  for(let s=0; s<examSheetsTarget; s++){
    const profIdx = order.sampleLimit && order.previewSheetIdx != null ? +order.previewSheetIdx : s;
    const isPreviewLazy = !!order.sampleLimit && order.packType==='綜合包';
    const prof = (examSheetsTarget > 1 || order.packType==='綜合包')
      ? LAZY_EXAM_PROFILES[profIdx % LAZY_EXAM_PROFILES.length]
      : { name:'客製專屬評量卷', diff:order.diff||'mid', nMc:isZh?7:7, nTf:6, nFill:5, nMatch:1, nCalc:3, nWord:2 };

    const sheetIdxArr = pickSheetUnits(profIdx);
    const sheetUnits = sheetIdxArr.map(i=>allU[i]?.name).filter(Boolean);
    const effDiff = (order.packType==='綜合包' || order.diff==='mix') ? prof.diff : (order.diff||prof.diff);
    const wantSingleExamAns = (examSheetsTarget === 1 && !!withAns && !order.sampleLimit);

    const cfg = {
      pub: order.pub, grade: String(order.grade), sem: order.sem, subject: order.subj,
      diff: effDiff, layout: order.layout||'2col', withAns: wantSingleExamAns, units: sheetUnits,
      unitIndices: sheetIdxArr, allUnitsCount: allU.length, wmText,
      excludeQuestions, excludeSigs,
      nMc: prof.nMc, nTf: prof.nTf, nFill: prof.nFill,
      nMatch: prof.nMatch, nCalc: prof.nCalc, nWord: prof.nWord
    };

    curExam = generateExamQuestions(cfg);
    if(typeof autoBalanceExamToTarget==='function'){
      renderExam(true);
      // 每張測驗卷正反兩面共 2 頁，先依行距／欄距伸展，不足或溢頁再微調題數，確保正反兩面皆 90%~100% 飽滿無空白
      autoBalanceExamToTarget(2, isZh?80:70, cfg, false);
    } else {
      renderExam(false);
    }
    const rawPages = [...box.querySelectorAll('.a4')];
    const diffZh = {easy:'基礎熟練',mid:'標準評量',hard:'素養挑戰',mix:'混合難度（由淺入深）'}[effDiff] || '標準評量';
    const unitsLabel = sheetUnits.length ? sheetUnits.join('、') : '全冊綜合';

    const qCountThisExam = (curExam && curExam._lastPageCount) ? curExam._lastPageCount : Math.min(2, rawPages.length);
    rawPages.forEach((p, pIdx)=>{
      const isTrailingSingleAns = wantSingleExamAns && pIdx >= qCountThisExam;
      if(!isTrailingSingleAns && (examSheetsTarget > 1 || isPreviewLazy)){
        const subEl = p.querySelector('.ex-sub');
        const sideLabel = pIdx===0 ? '正面第1頁' : '背面第2頁';
        const labelNo = isPreviewLazy ? `樣本第 ${profIdx+1} 張（${sideLabel}）` : `第 ${s+1}/${examSheetsTarget} 份（${sideLabel}）`;
        if(subEl){
          subEl.textContent = `${labelNo}・${prof.name}　｜　難度：${diffZh}　｜　範圍：${unitsLabel}`;
        }
        const capEl = p.querySelector('.cap');
        if(capEl){
          capEl.textContent = `${window.COPYRIGHT_STATEMENT||''}　｜　${labelNo}`;
        }
      }
    });

    const converted = keepLandscapeRaw
      ? rawPages
      : rawPages.map(p => p.classList.contains('ex-land') ? wrapLandscapePageForBatch(p) : p);

    if(wantSingleExamAns && converted.length > qCountThisExam){
      singleAnsPageCount = converted.length - qCountThisExam;
    }
    qDomPages.push(...converted);

    if(onProgress) onProgress(s+1, examSheetsTarget);
    await __batchYieldToUI();

    if(withAns && examSheetsTarget > 1 && curExam && curExam.sections){
      ansRecords.push({
        sheetNo: s+1,
        profileName: prof.name,
        unitsLabel,
        sections: curExam.sections
      });
    }
  }

  let ansDomPages = [];
  if(withAns && examSheetsTarget > 1 && ansRecords.length){
    ansDomPages = buildBatchAnswerPagesA4(ansRecords, order, wmText);
  }

  box.innerHTML = '';
  savedNodes.forEach(n=>box.appendChild(n));
  curExam = prevExam;
  $('exRuby').checked = prevRuby;
  $('exTwoPage').checked = prevTwo;

  const allPages = [...qDomPages, ...ansDomPages];
  let ansCount = examSheetsTarget > 1 ? ansDomPages.length : singleAnsPageCount;
  const qCount = Math.max(0, allPages.length - ansCount);
  // 雙數頁（正反面）規範：若單份含解答恰為奇數頁（如 2 頁試卷＋1 頁解答＝3 頁），補 1 頁「錯題訂正與複習筆記」保持 4 頁雙數正反面
  if(!order.sampleLimit && allPages.length > 0 && allPages.length % 2 === 1){
    const notePg = document.createElement('div');
    notePg.className = 'a4';
    notePg.appendChild(Object.assign(document.createElement('div'),{className:'edge'}));
    notePg.innerHTML += `<div class="ex-inner" style="padding:18px 26px;display:flex;flex-direction:column;height:1005px;box-sizing:border-box">
      <div style="border-bottom:2.5px solid #222;padding-bottom:8px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:baseline">
        <b style="font-size:1.15rem;color:#7a3b00">✏️ 錯題訂正 ＆ 家長複習筆記頁（${esc(order.subj||'評量')}）</b>
        <span style="font-size:.82rem;color:#64748b">訂正日期：____ 年 ____ 月 ____ 日｜家長簽章：____________</span>
      </div>
      <div style="flex:1;border:1.5px dashed #cbd5e1;border-radius:10px;padding:14px 18px;background:repeating-linear-gradient(to bottom, transparent 0px, transparent 35px, #e2e8f0 36px)">
        <div style="font-size:.88rem;color:#64748b;background:#fff;display:inline-block;padding:0 6px;margin-bottom:8px">把本次訂正不會的題目寫下來再練習一次，進步最快喔！</div>
      </div>
    </div>`;
    if(window.createWatermarkLayer) notePg.appendChild(window.createWatermarkLayer(794,1122,wmText||''));
    notePg.appendChild(Object.assign(document.createElement('div'),{className:'cap',textContent:`${window.COPYRIGHT_STATEMENT||'🌻 向日葵國小伴學誌'}　｜　錯題訂正與家長簽名頁`}));
    allPages.push(notePg);
    if(ansCount > 0) ansCount++;
  }
  return { pages: allPages, qPages: qCount, ansPages: ansCount };
}

// 供家長前台即時預覽呼叫：同時回傳指定張次之正面＋背面雙面 DOM 陣列，以及單頁相容函式
window.buildExamPreviewPagesForStore = async function(order){
  const res = await buildExamPagesForOrder(
    { ...order, sampleLimit: 1 },
    false,
    '向日葵國小伴學誌・線上樣本預覽請勿截圖轉售',
    true
  );
  return res.pages.slice(0, 2);
};
window.buildExamPreviewForStore = async function(order){
  const pages = await window.buildExamPreviewPagesForStore(order);
  const sideIdx = +order.previewPageSide === 1 && pages.length > 1 ? 1 : 0;
  return pages[sideIdx] || pages[0] || null;
};

let lastBatchPrintedOrderIndices = [];
let lastClearedOrdersSnapshot = null;

function formatNowMMDDHHmm(d=new Date()){
  return `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function markOrdersAsPrinted(indices){
  const nowStr = formatNowMMDDHHmm();
  let changed = 0;
  (indices||[]).forEach(realIdx=>{
    const ord = curBatchOrders[realIdx];
    if(!ord) return;
    ord.isPrinted = true;
    ord.print_status = '已經列印';
    ord.print_count = (ord.print_count || 0) + 1;
    ord.printed_at = nowStr;
    ord.isCompleted = ord.isPaid && !ord.isInvalid && ord.isPrinted;
    ord.selectedForPrint = false;
    changed++;
  });
  if(changed){
    saveOrdersToLocalDB();
    syncCsvBoxFromOrders();
    renderBatchTable(curBatchOrders);
  }
}

async function generateBatchAll(overrideOrders=null){
  if(!curBatchOrders.length && !overrideOrders){
    const saved = loadOrdersFromLocalDB();
    curBatchOrders = (saved !== null) ? saved : parseBatchCsv($('batchCsvInput').value);
    renderBatchTable(curBatchOrders);
  }
  // 僅針對「參數合法」且「管理員有打勾選取列印 (selectedForPrint)」或指定重複列印的家長訂單進行產製！
  const selectedOrders = Array.isArray(overrideOrders)
    ? overrideOrders.filter(o=>o && o.valid)
    : curBatchOrders.filter(o=>o.valid && o.selectedForPrint);
  if(!selectedOrders.length){
    $('batchMsg').style.color='#c0392b';
    $('batchMsg').textContent='⚠️ 目前沒有勾選任何欲列印的訂單！請先在上方表格左欄勾選「🖨️ 印製」（或點擊「☑️ 僅勾選已入帳(未印)」）。';
    if($('batchProgress')) $('batchProgress').style.display='none';
    return;
  }
  lastBatchPrintedOrderIndices = selectedOrders
    .map(o=>curBatchOrders.indexOf(o))
    .filter(idx=>idx>=0);

  const sheet = $('batchSheet');
  sheet.innerHTML = '';
  const withCover = $('batchWithCover').checked;
  const withAns = $('batchWithAns').checked;
  const duplexPad = $('batchDuplexPad').checked;
  const orderWm = $('batchOrderWm').checked;
  const baseWm = (($('wmText')?$('wmText').value:'')||'向日葵國小伴學誌・專屬訂製請勿轉售').trim();

  let st=$('examPrintStyle');if(!st){st=document.createElement('style');st.id='examPrintStyle';document.head.appendChild(st);}
  st.textContent='@media print{@page{size:A4 portrait;margin:0}}';

  let grandTotalPages = 0;
  const batchContentCache = new Map();
  // 顯示產製進度條
  if($('batchProgress')){
    $('batchProgress').style.display='flex';
    $('batchProgressText').textContent='開始生成教材…';
    $('batchProgressFill').style.width='0%';
  }
  await __batchYieldToUI();
  const clonePagesWithWm = (pages, targetWm) => pages.map(pg => {
    const c = pg.cloneNode(true);
    if(window.createWatermarkLayer){
      c.querySelectorAll('.wm-layer').forEach(oldWm => {
        const w = +oldWm.dataset.wmW || 794, h = +oldWm.dataset.wmH || 1122;
        oldWm.replaceWith(window.createWatermarkLayer(w, h, targetWm));
      });
    }
    return c;
  });

  for(let i=0;i<selectedOrders.length;i++){
    const ord = selectedOrders[i];
    if(selectedOrders.length > 1){
      $('batchMsg').style.color = '#7a3b00';
      $('batchMsg').textContent = `⏳ 正在產製第 ${i+1} / ${selectedOrders.length} 筆訂單（${ord.parent_label}）...`;
    }
    if($('batchProgress')){
      $('batchProgressText').textContent = selectedOrders.length > 1
        ? `產製中 ${i+1} / ${selectedOrders.length} 筆（${ord.parent_label}）`
        : '產製中（單筆訂單）…';
      $('batchProgressFill').style.width = `${((i + 0.5) / selectedOrders.length * 100).toFixed(1)}%`;
    }
    const wmText = orderWm ? `${baseWm}（${ord.parent_label}・#${ord.order_id}）` : baseWm;
    const specKey = JSON.stringify({
      plan: ord.plan, g: ord.grade, sem: ord.sem, pub: ord.pub, subj: ord.subj,
      sc: ord.scope, diff: ord.diff, ruby: ord.ruby, ly: ord.layout,
      cols: ord.cols, sm: ord.strokeMode, sh: ord.sheets,
      cw: ord.custom_words, cu: ord.custom_units,
      pl: ord.preLevel, pt: ord.preTopic, pi: ord.preIllust, withAns
    });

    let strokeRes = {pages:[], charCount:0};
    let examRes = {pages:[], qPages:0, ansPages:0};
    const cached = batchContentCache.get(specKey);
    if(cached){
      strokeRes = { pages: clonePagesWithWm(cached.strokePages, wmText), charCount: cached.charCount };
      examRes = { pages: clonePagesWithWm(cached.examPages, wmText), qPages: cached.qPages, ansPages: cached.ansPages };
    }else{
      if(ord.plan==='preschool' && window.PRESCHOOL_BANK){
        const lvlGuess = ord.preLevel || (/大班/.test(ord.grade)?'large':(/中班/.test(ord.grade)?'mid':'small'));
        const topGuess = ord.preTopic || (/注音/.test(ord.subj)?'zy':(/數字/.test(ord.subj)?'num':(/ABC/i.test(ord.subj)?'abc':'all')));
        const preRes = window.PRESCHOOL_BANK.buildPages({
          level: lvlGuess, topic: topGuess, sheets: +ord.sheets || 10, illust: ord.preIllust !== false, wmText
        });
        strokeRes = { pages: preRes.pages || [], charCount: preRes.itemCount || 0 };
      }else if(ord.plan==='stroke' || ord.plan==='both'){
        if(window.buildStrokePagesForOrder){
          strokeRes = await window.buildStrokePagesForOrder(ord, wmText);
        }
      }
      if(ord.plan==='exam' || ord.plan==='both'){
        examRes = await buildExamPagesForOrder(ord, withAns, wmText, false, (done,total)=>{
          if($('batchProgress') && selectedOrders.length){
            const pct = ((i + done/total) / selectedOrders.length * 100);
            $('batchProgressFill').style.width = `${pct.toFixed(1)}%`;
            $('batchProgressText').textContent = `產製第 ${i+1} / ${selectedOrders.length} 筆・考卷 ${done}/${total} 張`;
          }
        });
      }
      batchContentCache.set(specKey, {
        strokePages: strokeRes.pages.map(p => p.cloneNode(true)),
        charCount: strokeRes.charCount,
        examPages: examRes.pages.map(p => p.cloneNode(true)),
        qPages: examRes.qPages,
        ansPages: examRes.ansPages
      });
    }
    if(selectedOrders.length > 1 && i < selectedOrders.length - 1){
      await new Promise(r => requestAnimationFrame(r));
    }

    const makeDuplexBlank = (hintTxt) => {
      const blank = document.createElement('div');
      blank.className = 'a4';
      blank.appendChild(Object.assign(document.createElement('div'),{className:'edge'}));
      blank.innerHTML += `<div style="height:100%;display:flex;align-items:center;justify-content:center;color:#bbb;font-size:13px">${esc(hintTxt)}</div>`;
      return blank;
    };

    const orderPages = [];
    if(withCover){
      const covPagesCount = 2 + strokeRes.pages.length + examRes.pages.length;
      const statsTmp = {
        withCover, strokePages: strokeRes.pages.length, strokeChars: strokeRes.charCount,
        examPages: examRes.pages.length, examQPages: examRes.qPages, examAnsPages: examRes.ansPages,
        contentPages: covPagesCount, paddedBlank: (covPagesCount % 2 === 1), totalPages: covPagesCount + (covPagesCount % 2 === 1 ? 1 : 0)
      };
      orderPages.push({label:`【訂單 ${ord.order_id}｜${ord.parent_label}】A4 取貨封面頁`, el: buildCoverPageA4(ord, i, selectedOrders.length, statsTmp, wmText)});
      // 訂單首頁第 2 頁預設空白頁，雙面列印時確保直接接續下一張才開始印考卷／寫字帖
      orderPages.push({label:`【訂單 ${ord.order_id}｜${ord.parent_label}】取貨封面空白背面（雙面防串頁）`, el: makeDuplexBlank('（訂單封面背面預設空白頁 — 下一張第 3 頁起開始印製教材）')});
    }
    strokeRes.pages.forEach((p,idx)=>{
      const sKind = ord.plan==='preschool' ? '幼兒園運筆寫字帖' : '筆畫練習寫字帖';
      orderPages.push({label:`【訂單 ${ord.order_id}｜${ord.parent_label}】${sKind} 第 ${idx+1}/${strokeRes.pages.length} 頁`, el:p});
    });
    examRes.pages.forEach((p,idx)=>{
      const isAns = withAns && examRes.ansPages>0 && idx >= examRes.qPages;
      if(!isAns && (examRes.qPages||0) >= 2 && idx < examRes.qPages){
        p.dataset.exOrder = String(ord.order_id);
        p.dataset.exSheet = String(Math.floor(idx/2));
      }
      orderPages.push({label:`【訂單 ${ord.order_id}｜${ord.parent_label}】${ord.subj}評量測驗卷 ${isAns?`解答頁 ${idx-examRes.qPages+1}`:`第 ${idx+1} 頁`}`, el:p});
    });
    // 若此筆訂單（含多筆訂單或解答結尾）為奇數頁，末尾自動補 1 張空白背面頁維持雙數張對印
    if(duplexPad && orderPages.length % 2 === 1){
      orderPages.push({label:`【訂單 ${ord.order_id}】雙面列印結尾空白背面`, el: makeDuplexBlank('（雙面列印防串頁空白背面 — 確保整數張雙面列印不印錯）')});
    }

    const sheetPairs = [];
    for(let k=0; k<orderPages.length; k+=2){
      const pgA = orderPages[k];
      const pgB = orderPages[k+1] || null;
      const sheetIdx = Math.floor(grandTotalPages / 2);
      if(pgB && pgB.el.classList.contains('batch-land-holder')) pgB.el.classList.add('batch-land-back');
      const p1 = grandTotalPages + 1;
      const p2 = grandTotalPages + (pgB ? 2 : 1);
      const pgRangeLbl = pgB ? `第 ${p1}-${p2} 頁` : `第 ${p1} 頁`;
      pgA.el.dataset.batchPg = String(grandTotalPages);
      pgA.el.dataset.batchSheet = String(sheetIdx);
      if(pgB){
        pgB.el.dataset.batchPg = String(grandTotalPages + 1);
        pgB.el.dataset.batchSheet = String(sheetIdx);
      }
      // 每兩頁（1 張正反面）綁定出現一次「🖨️ 僅列印此張（1-2頁）」按鈕
      const cap = document.createElement('div');
      cap.className = 'pcap batch-pcap';
      cap.innerHTML = `<span class="batch-pcap-lbl">【第 ${sheetIdx+1} 張｜${pgRangeLbl}】${esc(pgA.label)}</span>`
        + `<button type="button" class="btn btn-mini pri batch-print-one-pg" data-sheet="${sheetIdx}">🖨️ 僅列印此張（${p1}${pgB?'-'+p2:''}頁）</button>`
        + ((pgB && pgA.el.dataset.exSheet !== undefined && pgA.el.dataset.exOrder === pgB.el.dataset.exOrder && pgA.el.dataset.exSheet === pgB.el.dataset.exSheet)
          ? `<button type="button" class="btn btn-mini batch-regen-one" data-order="${esc(pgA.el.dataset.exOrder)}" data-exsheet="${pgA.el.dataset.exSheet}">🔄 重新生成此份（2頁）</button>` : '');
      sheet.appendChild(cap);
      sheet.appendChild(pgA.el);
      if(pgB) sheet.appendChild(pgB.el);
      sheetPairs.push({ sheetIdx, p1, p2: pgB ? p2 : p1, label: pgA.label });
      grandTotalPages += pgB ? 2 : 1;
    }
    if(!window._batchSinglePgMeta) window._batchSinglePgMeta = [];
    if(i===0) window._batchSinglePgMeta = [];
    window._batchSinglePgMeta.push(...sheetPairs);
  }

  const allSheetPairs = window._batchSinglePgMeta || [];
  sheet.querySelectorAll('.batch-print-one-pg').forEach(b=>{
    b.onclick=()=>printSingleBatchPage(+b.dataset.sheet);
  });
  sheet.querySelectorAll('.batch-regen-one').forEach(b=>{
    b.onclick=()=>regenBatchExamSheet(b.dataset.order, +b.dataset.exsheet, b);
  });
  if(allSheetPairs.length){
    const jb = document.createElement('div');
    jb.className = 'batch-jump-bar noprint';
    jb.innerHTML = `<b style="color:#7a3b00">📑 跳到</b><select class="batch-jump-sel">${allSheetPairs.map(it=>`<option value="${it.sheetIdx}">第 ${it.sheetIdx+1} 張（第${it.p1}${it.p2>it.p1?'-'+it.p2:''}頁）${esc(String(it.label).replace(/^【/,'').replace(/】.*$/,''))}</option>`).join('')}</select>`
      + `<button type="button" class="btn btn-mini batch-jump-top">⏫ 第一頁</button>`
      + `<span class="duplex-tip">國語橫式＝書本式翻面；其餘直式＝長邊翻頁。列印時維持預設「雙面・長邊翻頁」即可，系統已自動補償方向。</span>`;
    sheet.insertBefore(jb, sheet.firstChild);
    const jumpTo = (n)=>{
      const t = sheet.querySelector(`.a4[data-batch-sheet="${n}"]`);
      if(t && t.scrollIntoView) t.scrollIntoView({behavior:'smooth', block:'start'});
    };
    jb.querySelector('.batch-jump-sel').onchange = (e)=>jumpTo(+e.target.value);
    jb.querySelector('.batch-jump-top').onclick = ()=>{ jb.querySelector('.batch-jump-sel').value = allSheetPairs[0].sheetIdx; jumpTo(allSheetPairs[0].sheetIdx); };
  }
  if($('batchSinglePgBar')){
    const bar = $('batchSinglePgBar');
    if(allSheetPairs.length){
      bar.style.display='flex';
      bar.innerHTML = `<b style="font-size:.84rem;color:#7a3b00;margin-right:4px">📄 雙面綁定補印（共 ${allSheetPairs.length} 張／${grandTotalPages} 頁）：</b>`
        + allSheetPairs.map(it=>{
          const rTxt = it.p2 > it.p1 ? `第${it.p1}-${it.p2}頁` : `第${it.p1}頁`;
          return `<span class="batch-pg-pill"><a href="#" class="batch-pg-jump" data-sheet="${it.sheetIdx}" style="color:#7a3b00;text-decoration:none;font-weight:700">${rTxt}</a> <button type="button" class="btn btn-mini pri batch-bar-print-btn" data-sheet="${it.sheetIdx}" title="${esc(it.label)}">🖨️</button></span>`;
        }).join('');
      bar.querySelectorAll('.batch-pg-jump').forEach(a=>{
        a.onclick=(e)=>{
          e.preventDefault();
          const target = sheet.querySelector(`.a4[data-batch-sheet="${a.dataset.sheet}"]`);
          if(target && typeof target.scrollIntoView === 'function') target.scrollIntoView({behavior:'smooth',block:'start'});
        };
      });
      bar.querySelectorAll('.batch-bar-print-btn').forEach(b=>{
        b.onclick=()=>printSingleBatchPage(+b.dataset.sheet);
      });
    } else {
      bar.style.display='none';
      bar.innerHTML='';
    }
  }

  if(typeof window.renderBatchMinimap === 'function') window.renderBatchMinimap(allSheetPairs);

  $('batchMsg').style.color='#1f9d55';
  $('batchMsg').textContent=`🎉 已依勾選生成 ${selectedOrders.length} 筆家長訂單，總計 ${grandTotalPages} 頁 A4（雙面列印共 ${Math.ceil(grandTotalPages/2)} 張整數紙；每兩頁 1-2、3-4 綁定），可整批印製或針對單張補印！`;
  if($('batchProgress')){
    $('batchProgress').style.display='none';
    $('batchProgressText').textContent='完成';
    $('batchProgressFill').style.width='100%';
  }
}

let __batchMinimapBound = false;
function __batchMinimapScrollSync(){
  const ticks = document.querySelectorAll('.batch-minimap-tick');
  if(!ticks.length) return;
  const sheet = $('batchSheet');
  if(!sheet) return;
  const mid = window.innerHeight * 0.5;
  let activeSheet = null;
  sheet.querySelectorAll('.a4[data-batch-sheet]').forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top <= mid && r.bottom >= 0) activeSheet = el.dataset.batchSheet;
  });
  ticks.forEach(t=>t.classList.toggle('active', t.dataset.sheet===String(activeSheet)));
}
window.renderBatchMinimap = function(allSheetPairs){
  const box = $('batchMinimap');
  if(!box) return;
  if(!Array.isArray(allSheetPairs) || !allSheetPairs.length){
    box.classList.remove('show'); box.innerHTML='';
    const tip0 = document.getElementById('batchMinimapTip'); if(tip0) tip0.classList.remove('show');
    return;
  }
  let tipEl = document.getElementById('batchMinimapTip');
  if(!tipEl){ tipEl = document.createElement('div'); tipEl.id='batchMinimapTip'; tipEl.className='batch-minimap-tip'; document.body.appendChild(tipEl); }
  box.innerHTML = '<div class="batch-minimap-track"></div>';
  const n = allSheetPairs.length;
  const span = n>1 ? 92 : 0;
  allSheetPairs.forEach((it, i)=>{
    const t = document.createElement('div');
    t.className = 'batch-minimap-tick' + (/空白|防串頁/.test(String(it.label||'')) ? ' is-blank' : '');
    t.style.top = `${4 + (n>1 ? (i/(n-1))*span : 46)}%`;
    t.dataset.sheet = String(it.sheetIdx);
    const range = it.p2 > it.p1 ? `第${it.p1}-${it.p2}頁` : `第${it.p1}頁`;
    t.dataset.tip = `第 ${it.sheetIdx+1} 張・${range}`;
    t.onmouseenter = ()=>{ tipEl.textContent = t.dataset.tip; const r=t.getBoundingClientRect(); tipEl.style.top=(r.top+r.height/2)+'px'; tipEl.classList.add('show'); };
    t.onmouseleave = ()=> tipEl.classList.remove('show');
    t.onclick = ()=>{
      const target = document.querySelector(`#batchSheet .a4[data-batch-sheet="${t.dataset.sheet}"]`);
      if(target && target.scrollIntoView) target.scrollIntoView({behavior:'smooth', block:'start'});
    };
    box.appendChild(t);
  });
  box.classList.add('show');
  if(!__batchMinimapBound){
    __batchMinimapBound = true;
    window.addEventListener('scroll', ()=>{
      const b = document.getElementById('batchMinimap');
      if(b && b.classList.contains('show')) __batchMinimapScrollSync();
    }, {passive:true});
  }
  requestAnimationFrame(__batchMinimapScrollSync);
};
window.showBatchMinimap = function(){
  if(!window._batchSinglePgMeta || !window._batchSinglePgMeta.length) return;
  const sheet = $('batchSheet');
  if(!sheet || !sheet.querySelectorAll('.a4').length) return;
  if(typeof window.renderBatchMinimap==='function') window.renderBatchMinimap(window._batchSinglePgMeta);
};
window.hideBatchMinimap = function(){
  const b=$('batchMinimap'); if(b){ b.classList.remove('show'); b.innerHTML=''; }
  const tip=document.getElementById('batchMinimapTip'); if(tip) tip.classList.remove('show');
};

function regenBatchExamSheet(orderId, exSheet, btn){
  const sheet = $('batchSheet');
  if(!sheet) return;
  const els = [...sheet.querySelectorAll('.a4')].filter(e=>e.dataset.exOrder===String(orderId) && e.dataset.exSheet===String(exSheet));
  const ord = curBatchOrders.find(o=>String(o.order_id)===String(orderId));
  if(els.length < 2 || !ord) return;
  if(btn){ btn.disabled = true; btn.textContent = '⏳ 重新生成中…'; }
  setTimeout(async ()=>{
    try{
      const baseWm = (($('wmText')?$('wmText').value:'')||'向日葵國小伴學誌・專屬訂製請勿轉售').trim();
      const wm = $('batchOrderWm').checked ? `${baseWm}（${ord.parent_label}・#${ord.order_id}）` : baseWm;
      const res = await buildExamPagesForOrder({ ...ord, sampleLimit: 1, previewSheetIdx: exSheet }, false, wm);
      const np = res.pages.slice(0,2);
      if(np.length < 2) throw new Error('產生頁數不足');
      np.forEach((n,i)=>{
        const old = els[i];
        Object.assign(n.dataset, old.dataset);
        if(old.classList.contains('batch-land-back') && n.classList.contains('batch-land-holder')) n.classList.add('batch-land-back');
        n.querySelectorAll('.ex-sub').forEach(el=>{ el.textContent = el.textContent.replace(/樣本第 (\d+) 張/, '第 $1 份'); });
        n.querySelectorAll('.cap').forEach(el=>{ el.textContent = el.textContent.replace(/樣本第 (\d+) 張/, '第 $1 份'); });
        old.replaceWith(n);
      });
      if(btn){
        btn.disabled = false;
        btn.textContent = '✅ 已重新生成（再按可重跑）';
        btn.title = '若此單含解答頁，解答頁仍為原題，請以重新「產生批次」取得對應解答';
      }
    }catch(err){
      if(btn){ btn.disabled = false; btn.textContent = '⚠️ 失敗，點此重試'; }
      console.error(err);
    }
  }, 30);
}

function printSingleBatchPage(sheetIdx){
  const sheet = $('batchSheet');
  if(!sheet) return;
  const targets = [...sheet.querySelectorAll(`.a4[data-batch-sheet="${sheetIdx}"]`)];
  if(!targets.length) return;
  sheet.querySelectorAll('.a4.is-print-target,.a4.is-print-target-last').forEach(el=>{
    el.classList.remove('is-print-target','is-print-target-last');
  });
  targets.forEach((el, idx)=>{
    el.classList.add('is-print-target');
    if(idx === targets.length - 1) el.classList.add('is-print-target-last');
  });
  document.body.classList.add('print-only-single-page');
  let st=$('examPrintStyle');if(!st){st=document.createElement('style');st.id='examPrintStyle';document.head.appendChild(st);}
  st.textContent='@media print{@page{size:A4 portrait;margin:0}}';
  const p1 = sheetIdx * 2 + 1, p2 = p1 + targets.length - 1;
  if($('batchMsg')){
    $('batchMsg').style.color='#1f9d55';
    $('batchMsg').textContent=`🖨️ 已鎖定雙面補印「第 ${sheetIdx+1} 張（第 ${p1}${p2>p1?'-'+p2:''} 頁）」，只會印出該張正反面（其餘頁面已自動隱藏）！`;
  }
  const cleanup = ()=>{
    document.body.classList.remove('print-only-single-page');
    targets.forEach(el=>el.classList.remove('is-print-target','is-print-target-last'));
  };
  if(typeof window.addEventListener === 'function'){
    window.addEventListener('afterprint', cleanup, { once: true });
  }
  setTimeout(cleanup, 1500);
  window.print();
}

function downloadBatchTemplate(){
  const freshCsv = buildDefaultSampleBatchCsv();
  const blob = new Blob(['\uFEFF'+freshCsv], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '向日葵國小伴學誌_每週批次訂單範本.csv';
  a.click();
}

function exportReconcileCsv(){
  const cols = ['order_id','created_at','batch_week','parent_label','contact','planName','grade','sem','pubName','subj','scopeName','diffName','amount','remit_last5','reconcile_status','print_status','print_count','printed_at','reconcile_note'];
  const headers = ['取貨編號','下單時間','批次週次','家長稱呼＋末四碼','聯絡電話','訂購方案','年級','學期','版本','科目','範圍','難度','應付金額','匯款後五碼','對帳狀態','列印狀態','列印次數','最近列印時間','對帳備註紀錄'];
  const escCsv = v => { const s=String(v==null?'':v); return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s; };
  const lines = [headers.join(','), ...curBatchOrders.map(o=>cols.map(c=>escCsv(o[c])).join(','))];
  const blob = new Blob(['\uFEFF'+lines.join('\n')], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `向日葵國小伴學誌_對帳與訂單紀錄_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

function initExamUI(){
  if(!$('exGrade'))return;
  $('exGrade').onchange=()=>{if($('exRuby'))$('exRuby').checked=(+$('exGrade').value<=2);fillSubjects();if(curExam)generateFromUI();};
  $('exSem').onchange=()=>{fillUnits();if(curExam)generateFromUI();};
  $('exSubj').onchange=()=>{fillUnits();if(curExam)generateFromUI();};
  $('exPub').onchange=()=>{fillUnits();if(curExam)generateFromUI();};
  if($('exTermType'))$('exTermType').onchange=()=>{applyTermSelection();if(curExam)generateFromUI();};
  $('exUnitAll').onclick=()=>{document.querySelectorAll('#exUnits input').forEach(i=>i.checked=true);if(curExam)generateFromUI();};
  $('exUnitNone').onclick=()=>{document.querySelectorAll('#exUnits input').forEach(i=>i.checked=false);if(curExam)generateFromUI();};
  $('btnExGen').onclick=generateFromUI;
  $('btnExDice').onclick=rollMixedDice;
  $('btnExXlsx').onclick=()=>exportExamXlsx().catch(e=>{$('exMsg').textContent='匯出失敗：'+e.message;});
  $('btnExPrint').onclick=()=>{
    if(!curExam) generateFromUI();
    const isZh = curExam && curExam.meta && curExam.meta.subject === '國語';
    let st=$('examPrintStyle');if(!st){st=document.createElement('style');st.id='examPrintStyle';document.head.appendChild(st);}
    st.textContent=isZh?'@media print{@page{size:A4 landscape;margin:0}}':'@media print{@page{size:A4 portrait;margin:0}}';
    window.print();
  };
  ['exLayout','exTwoPage','exAns','exRuby','exDiff','chkMc','chkTf','chkFill','chkMatch','chkCalc','chkWord','numMc','numTf','numFill','numMatch','numCalc','numWord'].forEach(id=>{const e=$(id);if(!e)return;e.onchange=generateFromUI;if(e.type==='number')e.oninput=generateFromUI;});

  const refreshWatermarks=()=>{
    if($('viewStroke')&&$('viewStroke').style.display!=='none'&&typeof render==='function') render();
    if($('viewExam')&&$('viewExam').style.display!=='none'&&curExam) renderExam();
    if($('batchSheet')){
      $('batchSheet').querySelectorAll('.wm-layer').forEach(oldWm=>{
        const w=+oldWm.dataset.wmW||794, h=+oldWm.dataset.wmH||1122;
        const newWm=window.createWatermarkLayer(w,h,'');
        oldWm.replaceWith(newWm);
      });
    }
  };
  ['wmEnable','wmText','wmAlpha','wmScale','wmAngle','wmDensity'].forEach(id=>{
    const e=$(id); if(!e)return;
    e.onchange=refreshWatermarks;
    if(e.type==='text') e.oninput=refreshWatermarks;
  });
  if(typeof window.refreshBatchSysClock==='function') window.refreshBatchSysClock();
  const refreshBatchView = ()=>renderBatchTable(curBatchOrders);
  if($('batchWeekFilter')) $('batchWeekFilter').onchange=refreshBatchView;
  if($('batchStatusFilter')) $('batchStatusFilter').onchange=refreshBatchView;
  if($('batchSearchInput')) $('batchSearchInput').oninput=refreshBatchView;

  if($('btnBatchSample')){
    $('btnBatchSample').onclick=()=>{
      const freshCsv = buildDefaultSampleBatchCsv();
      $('batchCsvInput').value=freshCsv;
      curBatchOrders=parseBatchCsv(freshCsv);
      lastClearedOrdersSnapshot=null;
      if($('btnUndoClearOrders')) $('btnUndoClearOrders').style.display='none';
      saveOrdersToLocalDB();
      renderBatchTable(curBatchOrders);
    };
  }
  if($('btnBatchTpl')) $('btnBatchTpl').onclick=downloadBatchTemplate;
  if($('btnBatchParse')){
    $('btnBatchParse').onclick=()=>{
      curBatchOrders=parseBatchCsv($('batchCsvInput').value);
      saveOrdersToLocalDB();
      renderBatchTable(curBatchOrders);
    };
  }
  if($('batchFile')){
    $('batchFile').onchange=e=>{
      const f=e.target.files&&e.target.files[0]; if(!f)return;
      const r=new FileReader();
      r.onload=()=>{
        $('batchCsvInput').value=String(r.result||'');
        curBatchOrders=parseBatchCsv($('batchCsvInput').value);
        saveOrdersToLocalDB();
        renderBatchTable(curBatchOrders);
      };
      r.readAsText(f,'UTF-8');
    };
  }
  if($('btnSelPaid')){
    $('btnSelPaid').onclick=()=>{
      const visible = getFilteredBatchOrders(curBatchOrders);
      const visSet = new Set(visible);
      const hasUnprintedPaid = visible.some(o=>o.valid && o.isPaid && !o.isPrinted);
      curBatchOrders.forEach(o=>{
        if(visSet.has(o)){
          o.selectedForPrint = o.valid && o.isPaid && (hasUnprintedPaid ? !o.isPrinted : true);
        }
      });
      saveOrdersToLocalDB();
      renderBatchTable(curBatchOrders);
    };
  }
  if($('btnSelAll')){
    $('btnSelAll').onclick=()=>{
      const visSet = new Set(getFilteredBatchOrders(curBatchOrders));
      curBatchOrders.forEach(o=>{ if(visSet.has(o)) o.selectedForPrint = o.valid; });
      saveOrdersToLocalDB();
      renderBatchTable(curBatchOrders);
    };
  }
  if($('btnSelNone')){
    $('btnSelNone').onclick=()=>{
      curBatchOrders.forEach(o=>{ o.selectedForPrint = false; });
      saveOrdersToLocalDB();
      renderBatchTable(curBatchOrders);
    };
  }
  if($('btnExportRecCsv')) $('btnExportRecCsv').onclick=exportReconcileCsv;
  if($('btnClearLocalOrders')){
    $('btnClearLocalOrders').onclick=()=>{
      if(curBatchOrders.length) lastClearedOrdersSnapshot = curBatchOrders.map(o=>({...o}));
      curBatchOrders = [];
      if($('batchCsvInput')) $('batchCsvInput').value = '';
      if($('batchSheet')) $('batchSheet').innerHTML = '';
      saveOrdersToLocalDB(true);
      renderBatchTable(curBatchOrders);
      if($('btnUndoClearOrders') && lastClearedOrdersSnapshot && lastClearedOrdersSnapshot.length){
        $('btnUndoClearOrders').style.display='';
      }
      if($('batchMsg')){
        $('batchMsg').style.color='#b45309';
        $('batchMsg').textContent='🗑️ 已清空全部訂單（預設範例不會再自動冒出）；如誤按可點「↩️ 復原清空」救回。';
      }
    };
  }
  if($('btnCloudBackupNow')) $('btnCloudBackupNow').onclick=()=>backupOrdersToGoogleCloud(curBatchOrders, false);
  if($('btnCloudRestoreNow')) $('btnCloudRestoreNow').onclick=()=>restoreOrdersFromGoogleCloud();
  if($('btnToggleCloudSetup')){
    $('btnToggleCloudSetup').onclick=()=>{
      const p=$('cloudSetupPanel'); if(!p) return;
      p.style.display = p.style.display==='none' ? '' : 'none';
      if(p.style.display==='' && $('gasUrlInput') && !$('gasUrlInput').value.trim()){
        try{ $('gasUrlInput').value = localStorage.getItem('kids_gas_webapp_url') || DEFAULT_CLOUD_GAS_URL; }catch(_){ $('gasUrlInput').value = DEFAULT_CLOUD_GAS_URL; }
      }
    };
  }
  if($('btnCloseCloudSetup')){
    $('btnCloseCloudSetup').onclick=()=>{ if($('cloudSetupPanel')) $('cloudSetupPanel').style.display='none'; };
  }
  if($('btnConnectGoogleCloud')){
    $('btnConnectGoogleCloud').onclick=async()=>{
      const url = ($('gasUrlInput')?.value || DEFAULT_CLOUD_GAS_URL).trim();
      const msgEl = $('cloudWizardMsg');
      const setMsg = (txt, col)=>{ if(msgEl){ msgEl.style.color=col; msgEl.textContent=txt; } };
      if(!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec/i.test(url)){
        setMsg('⚠️ 請貼上有效的 Google Apps Script Web App 網址（開頭為 https://script.google.com/macros/s/.../exec）', '#c0392b');
        return;
      }
      setMsg('⏳ 正在套用網址並直接連線測試 Google 雲端...', '#b45309');
      try{
        localStorage.setItem('kids_gas_webapp_url', url);
        if($('gasUrlInput')) $('gasUrlInput').value = url;
        const res = await backupOrdersToGoogleCloud(curBatchOrders, false);
        if(res && res.ok){
          setMsg('✅ 已直接連線並完成最新雲端備份！（往後免輸入密碼，每 5 分鐘自動備份）', '#136529');
        } else if(res && res.reason === 'no_cloud_creds'){
          setMsg('ℹ️ 已儲存端點網址！請點右上角重新驗證一次網站管理員密碼即可自動建立永久直連憑證（無須另填雲端密碼）。', '#b45309');
        }
      }catch(err){
        setMsg(`❌ 連線失敗：${err.message}（請確認網路與網址設定）`, '#c0392b');
      }
    };
  }
  if($('btnCloudTestBackup')) $('btnCloudTestBackup').onclick=()=>backupOrdersToGoogleCloud(curBatchOrders, false);
  if($('btnDisconnectGoogleCloud')){
    $('btnDisconnectGoogleCloud').onclick=()=>{
      try{
        localStorage.removeItem('kids_gas_webapp_url');
        localStorage.removeItem('kids_cloud_session_token');
        localStorage.removeItem('sunflower_last_cloud_backup_at');
        if(sessionStorage.getItem('kids_admin_session_token') !== 'local-dev-session'){
          sessionStorage.setItem('kids_admin_session_token', 'local-hash-session');
        }
      }catch(_){}
      if($('gasUrlInput')) $('gasUrlInput').value=DEFAULT_CLOUD_GAS_URL;
      refreshBackupStatusUI();
      if($('cloudWizardMsg')){
        $('cloudWizardMsg').style.color='#b45309';
        $('cloudWizardMsg').textContent='🔌 已清除本機自訂端點與雲端憑證並重設為預設網址（本機 IndexedDB 備份仍持續保護中）。';
      }
    };
  }
  if($('btnExportJsonBackup')) $('btnExportJsonBackup').onclick=exportOrdersJsonBackup;
  if($('importJsonBackupFile')){
    $('importJsonBackupFile').onchange=e=>{
      const f=e.target.files&&e.target.files[0]; if(!f)return;
      const r=new FileReader();
      r.onload=()=>{
        try{
          const parsed=JSON.parse(String(r.result||'[]'));
          const arr=Array.isArray(parsed)?parsed:(Array.isArray(parsed.orders)?parsed.orders:null);
          if(!arr) throw new Error('格式不符，找不到 orders 陣列');
          curBatchOrders=arr.map((o,i)=>normalizeOrderRow(o,i));
          saveOrdersToLocalDB();
          syncCsvBoxFromOrders();
          renderBatchTable(curBatchOrders);
          if($('batchMsg')){
            $('batchMsg').style.color='#1f9d55';
            $('batchMsg').textContent=`📂 已從 JSON 備份檔成功還原 ${curBatchOrders.length} 筆訂單！`;
          }
        }catch(err){
          if($('batchMsg')){
            $('batchMsg').style.color='#c0392b';
            $('batchMsg').textContent=`⚠️ 匯入 JSON 備份失敗：${err.message}`;
          }
        }
        e.target.value='';
      };
      r.readAsText(f,'UTF-8');
    };
  }
  if($('btnUndoClearOrders')){
    $('btnUndoClearOrders').onclick=()=>{
      if(!lastClearedOrdersSnapshot || !lastClearedOrdersSnapshot.length) return;
      curBatchOrders = lastClearedOrdersSnapshot.map((o,i)=>normalizeOrderRow(o,i));
      lastClearedOrdersSnapshot = null;
      $('btnUndoClearOrders').style.display='none';
      saveOrdersToLocalDB();
      syncCsvBoxFromOrders();
      renderBatchTable(curBatchOrders);
      if($('batchMsg')){
        $('batchMsg').style.color='#1f9d55';
        $('batchMsg').textContent=`↩️ 已還原 ${curBatchOrders.length} 筆訂單紀錄！`;
      }
    };
  }
  if($('btnBatchGen')) $('btnBatchGen').onclick=()=>generateBatchAll();
  if($('btnBatchPrint')){
    $('btnBatchPrint').onclick=async()=>{
      if(!$('batchSheet').querySelectorAll('.a4').length) await generateBatchAll();
      if(!$('batchSheet').querySelectorAll('.a4').length) return;
      if(lastBatchPrintedOrderIndices && lastBatchPrintedOrderIndices.length){
        markOrdersAsPrinted(lastBatchPrintedOrderIndices);
      }
      let st=$('examPrintStyle');if(!st){st=document.createElement('style');st.id='examPrintStyle';document.head.appendChild(st);}
      st.textContent='@media print{@page{size:A4 portrait;margin:0}}';
      window.print();
    };
  }

  // 初始化載入本機已保存之訂單（注意：若為明確清空後的空陣列 []，保留清空狀態；若 localStorage 意外遺失則自動從 IndexedDB 救回！）
  const initialOrders = loadOrdersFromLocalDB();
  if(initialOrders !== null){
    curBatchOrders = initialOrders;
    syncCsvBoxFromOrders();
    mirrorOrdersToIndexedDB(curBatchOrders, 'init');
  }else{
    const freshCsv = buildDefaultSampleBatchCsv();
    if($('batchCsvInput')) $('batchCsvInput').value = freshCsv;
    curBatchOrders = parseBatchCsv(freshCsv);
    saveOrdersToLocalDB();
    readOrdersFromIndexedDB().then(bk=>{
      let wasCleared = false;
      try{ wasCleared = localStorage.getItem(LOCAL_ORDERS_CLEARED_KEY) === '1'; }catch(_){}
      if(!wasCleared && bk && Array.isArray(bk.orders) && bk.orders.length > curBatchOrders.length){
        curBatchOrders = bk.orders.map((o,i)=>normalizeOrderRow(o,i));
        saveOrdersToLocalDB();
        syncCsvBoxFromOrders();
        renderBatchTable(curBatchOrders);
      }
    });
  }
  renderBatchTable(curBatchOrders);
  refreshBackupStatusUI();

  if($('exRuby'))$('exRuby').checked=(+$('exGrade').value<=2);
  fillSubjects();
}
initExamUI();
})();
