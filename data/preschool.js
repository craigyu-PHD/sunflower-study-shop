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

  // 台灣幼兒園標準筆順與矢量中心線路徑庫（字體輪廓與虛線共用同一條中心線，100% 絕對置中不偏斜；支援 'L'、'Q'、'C'）
  const STROKE_PATHS = {
    // 阿拉伯數字 0~9（圓潤工整教科書標準比例）
    '0': [[[0.50,0.16], ['C',0.16,0.16, 0.16,0.84, 0.50,0.84], ['C',0.84,0.84, 0.84,0.16, 0.50,0.16]]],
    '1': [[[0.34,0.28], ['Q',0.46,0.22, 0.54,0.16], ['L',0.54,0.84]]],
    '2': [[[0.23,0.33], ['C',0.23,0.13, 0.77,0.13, 0.77,0.34], ['C',0.77,0.52, 0.44,0.65, 0.22,0.83], ['L',0.78,0.83]]],
    '3': [[[0.25,0.26], ['C',0.40,0.13, 0.76,0.16, 0.75,0.34], ['Q',0.74,0.47, 0.46,0.49], ['C',0.80,0.51, 0.80,0.85, 0.23,0.77]]],
    '4': [[[0.63,0.16], ['L',0.20,0.63], ['L',0.82,0.63]], [[0.63,0.16], ['L',0.63,0.84]]],
    '5': [[[0.30,0.18], ['L',0.27,0.46], ['C',0.54,0.40, 0.80,0.52, 0.76,0.70], ['C',0.72,0.85, 0.36,0.85, 0.22,0.76]], [[0.30,0.18], ['L',0.76,0.18]]],
    '6': [[[0.68,0.18], ['C',0.32,0.18, 0.20,0.48, 0.22,0.68], ['C',0.24,0.86, 0.78,0.86, 0.78,0.64], ['C',0.78,0.45, 0.28,0.45, 0.22,0.62]]],
    '7': [[[0.22,0.18], ['L',0.78,0.18], ['Q',0.56,0.48, 0.40,0.84]]],
    '8': [[[0.50,0.48], ['C',0.20,0.40, 0.22,0.16, 0.50,0.16], ['C',0.78,0.16, 0.80,0.40, 0.50,0.48], ['C',0.18,0.56, 0.18,0.84, 0.50,0.84], ['C',0.82,0.84, 0.82,0.56, 0.50,0.48]]],
    '9': [[[0.78,0.36], ['C',0.78,0.14, 0.22,0.14, 0.22,0.36], ['C',0.22,0.56, 0.76,0.56, 0.78,0.36], ['Q',0.78,0.66, 0.42,0.84]]],

    // 注音符號 ㄅ~ㄩ（依教育部標準筆順＋工整楷書比例＋圓滑轉折）
    'ㄅ': [[[0.26,0.32], ['L',0.73,0.28], ['Q',0.71,0.64, 0.58,0.81], ['Q',0.50,0.78, 0.42,0.70]]],
    'ㄆ': [[[0.48,0.17], ['Q',0.44,0.31, 0.40,0.44]], [[0.24,0.47], ['L',0.73,0.42], ['Q',0.56,0.67, 0.32,0.82]], [[0.47,0.55], ['Q',0.61,0.68, 0.75,0.80]]],
    'ㄇ': [[[0.26,0.26], ['L',0.26,0.81]], [[0.26,0.28], ['Q',0.50,0.25, 0.73,0.25], ['Q',0.74,0.42, 0.74,0.81]]],
    'ㄈ': [[[0.24,0.26], ['L',0.76,0.24]], [[0.27,0.26], ['L',0.27,0.68], ['Q',0.27,0.76, 0.36,0.76], ['L',0.78,0.74]]],
    'ㄉ': [[[0.27,0.36], ['L',0.73,0.32], ['Q',0.70,0.66, 0.58,0.82], ['Q',0.49,0.79, 0.42,0.71]], [[0.49,0.17], ['Q',0.39,0.44, 0.24,0.64]]],
    'ㄊ': [[[0.63,0.19], ['Q',0.48,0.24, 0.32,0.28]], [[0.22,0.48], ['L',0.78,0.42]], [[0.47,0.24], ['Q',0.45,0.52, 0.45,0.68], ['Q',0.45,0.77, 0.58,0.77], ['L',0.76,0.74]]],
    'ㄋ': [[[0.29,0.25], ['L',0.69,0.21], ['Q',0.48,0.36, 0.32,0.48], ['L',0.73,0.44], ['Q',0.69,0.68, 0.56,0.82]]],
    'ㄌ': [[[0.26,0.36], ['L',0.73,0.32], ['Q',0.70,0.66, 0.58,0.82], ['Q',0.49,0.79, 0.42,0.71]], [[0.49,0.17], ['Q',0.40,0.54, 0.24,0.80]]],
    'ㄍ': [[[0.45,0.20], ['Q',0.33,0.37, 0.24,0.49], ['Q',0.34,0.63, 0.46,0.80]], [[0.71,0.20], ['Q',0.59,0.37, 0.50,0.49], ['Q',0.60,0.63, 0.72,0.80]]],
    'ㄎ': [[[0.25,0.26], ['L',0.75,0.23]], [[0.46,0.25], ['Q',0.40,0.38, 0.34,0.49], ['L',0.72,0.45], ['Q',0.67,0.68, 0.56,0.82]]],
    'ㄏ': [[[0.30,0.27], ['L',0.75,0.23]], [[0.32,0.27], ['Q',0.30,0.56, 0.22,0.80]]],
    'ㄐ': [[[0.34,0.25], ['L',0.34,0.66], ['Q',0.35,0.72, 0.44,0.67], ['Q',0.53,0.62, 0.62,0.56]], [[0.68,0.18], ['L',0.68,0.84]]],
    'ㄑ': [[[0.62,0.18], ['Q',0.45,0.36, 0.31,0.49], ['Q',0.46,0.63, 0.64,0.82]]],
    'ㄒ': [[[0.20,0.26], ['L',0.80,0.23]], [[0.50,0.25], ['L',0.50,0.83]]],
    'ㄓ': [[[0.30,0.36], ['L',0.30,0.57], ['Q',0.30,0.63, 0.38,0.62], ['L',0.72,0.59]], [[0.72,0.35], ['L',0.72,0.64]], [[0.50,0.18], ['L',0.50,0.84]]],
    'ㄔ': [[[0.62,0.20], ['Q',0.46,0.31, 0.30,0.40]], [[0.64,0.39], ['Q',0.44,0.53, 0.25,0.65]], [[0.50,0.50], ['L',0.50,0.84]]],
    'ㄕ': [[[0.31,0.23], ['L',0.69,0.21], ['L',0.69,0.43]], [[0.31,0.44], ['L',0.69,0.43]], [[0.31,0.23], ['Q',0.29,0.56, 0.22,0.81]]],
    'ㄖ': [[[0.31,0.22], ['L',0.31,0.80]], [[0.31,0.22], ['L',0.69,0.20], ['L',0.69,0.80]], [[0.31,0.50], ['L',0.69,0.48]], [[0.31,0.78], ['L',0.69,0.76]]],
    'ㄗ': [[[0.28,0.28], ['L',0.70,0.24], ['Q',0.69,0.48, 0.66,0.62], ['L',0.53,0.56]], [[0.32,0.28], ['L',0.32,0.84]]],
    'ㄘ': [[[0.23,0.41], ['L',0.77,0.32]], [[0.48,0.18], ['Q',0.41,0.36, 0.35,0.53], ['L',0.73,0.47], ['Q',0.68,0.68, 0.56,0.81]]],
    'ㄙ': [[[0.50,0.20], ['Q',0.36,0.48, 0.26,0.72], ['Q',0.48,0.69, 0.70,0.65]], [[0.60,0.52], ['Q',0.68,0.66, 0.75,0.80]]],
    'ㄚ': [[[0.31,0.30], ['Q',0.37,0.39, 0.42,0.48]], [[0.70,0.28], ['Q',0.64,0.38, 0.57,0.48]], [[0.50,0.19], ['L',0.50,0.84]]],
    'ㄛ': [[[0.30,0.26], ['L',0.64,0.24], ['L',0.62,0.46]], [[0.35,0.47], ['L',0.62,0.46]], [[0.35,0.47], ['L',0.35,0.67], ['Q',0.35,0.77, 0.48,0.77], ['L',0.75,0.73]]],
    'ㄜ': [[[0.24,0.44], ['L',0.76,0.39]], [[0.46,0.20], ['L',0.46,0.67], ['Q',0.46,0.77, 0.59,0.77], ['L',0.76,0.74]]],
    'ㄝ': [[[0.19,0.51], ['L',0.78,0.39], ['L',0.67,0.58]], [[0.56,0.19], ['L',0.56,0.60]], [[0.35,0.28], ['L',0.35,0.67], ['Q',0.35,0.77, 0.48,0.77], ['L',0.77,0.74]]],
    'ㄞ': [[[0.25,0.25], ['L',0.75,0.23]], [[0.31,0.47], ['L',0.68,0.44], ['Q',0.66,0.66, 0.58,0.82]], [[0.50,0.25], ['Q',0.38,0.56, 0.24,0.82]]],
    'ㄟ': [[[0.21,0.44], ['Q',0.33,0.30, 0.40,0.35], ['Q',0.56,0.55, 0.78,0.76]]],
    'ㄠ': [[[0.48,0.18], ['Q',0.39,0.31, 0.30,0.42], ['L',0.54,0.39]], [[0.62,0.31], ['Q',0.45,0.52, 0.28,0.74], ['L',0.68,0.67]], [[0.62,0.56], ['Q',0.68,0.68, 0.74,0.79]]],
    'ㄡ': [[[0.28,0.26], ['L',0.72,0.24], ['Q',0.52,0.56, 0.26,0.81]], [[0.34,0.38], ['Q',0.56,0.62, 0.76,0.81]]],
    'ㄢ': [[[0.28,0.26], ['L',0.72,0.23]], [[0.41,0.25], ['Q',0.36,0.38, 0.31,0.49], ['L',0.73,0.46], ['Q',0.68,0.68, 0.57,0.82]]],
    'ㄣ': [[[0.41,0.21], ['Q',0.35,0.37, 0.30,0.51], ['L',0.72,0.45], ['Q',0.65,0.66, 0.54,0.81]]],
    'ㄤ': [[[0.24,0.42], ['L',0.76,0.36]], [[0.48,0.19], ['Q',0.42,0.56, 0.24,0.80]], [[0.52,0.46], ['L',0.52,0.70], ['Q',0.52,0.78, 0.64,0.78], ['L',0.78,0.75]]],
    'ㄥ': [[[0.48,0.20], ['Q',0.36,0.50, 0.27,0.75], ['L',0.74,0.71]]],
    'ㄦ': [[[0.36,0.22], ['Q',0.33,0.56, 0.24,0.80]], [[0.58,0.22], ['L',0.58,0.70], ['Q',0.58,0.78, 0.70,0.78], ['L',0.80,0.75]]],
    'ㄧ': [[[0.20,0.51], ['L',0.80,0.48]]],
    'ㄨ': [[[0.68,0.22], ['Q',0.50,0.53, 0.26,0.81]], [[0.29,0.25], ['Q',0.52,0.53, 0.74,0.81]]],
    'ㄩ': [[[0.26,0.25], ['L',0.26,0.68], ['Q',0.26,0.75, 0.35,0.75], ['L',0.74,0.72]], [[0.74,0.24], ['L',0.74,0.80]]],

    // 英文字母大寫 A~Z（精準對齊英文四線三格：頂線 0.18、中虛線 0.44、紅基線 0.72）
    'A': [[[0.50,0.18], ['L',0.18,0.72]], [[0.50,0.18], ['L',0.82,0.72]], [[0.29,0.54], ['L',0.71,0.54]]],
    'B': [[[0.24,0.18], ['L',0.24,0.72]], [[0.24,0.18], ['C',0.74,0.18, 0.74,0.44, 0.24,0.44]], [[0.24,0.44], ['C',0.80,0.44, 0.80,0.72, 0.24,0.72]]],
    'C': [[[0.80,0.28], ['C',0.62,0.14, 0.20,0.18, 0.20,0.45], ['C',0.20,0.72, 0.62,0.76, 0.80,0.62]]],
    'D': [[[0.24,0.18], ['L',0.24,0.72]], [[0.24,0.18], ['C',0.82,0.18, 0.82,0.72, 0.24,0.72]]],
    'E': [[[0.24,0.18], ['L',0.24,0.72]], [[0.24,0.18], ['L',0.76,0.18]], [[0.24,0.44], ['L',0.70,0.44]], [[0.24,0.72], ['L',0.78,0.72]]],
    'F': [[[0.24,0.18], ['L',0.24,0.72]], [[0.24,0.18], ['L',0.78,0.18]], [[0.24,0.44], ['L',0.70,0.44]]],
    'G': [[[0.78,0.28], ['C',0.60,0.14, 0.20,0.18, 0.20,0.45], ['C',0.20,0.72, 0.62,0.76, 0.80,0.62], ['L',0.80,0.48]], [[0.52,0.48], ['L',0.80,0.48]]],
    'H': [[[0.24,0.18], ['L',0.24,0.72]], [[0.76,0.18], ['L',0.76,0.72]], [[0.24,0.44], ['L',0.76,0.44]]],
    'I': [[[0.50,0.18], ['L',0.50,0.72]]],
    'J': [[[0.66,0.18], ['L',0.66,0.54], ['C',0.66,0.74, 0.26,0.75, 0.24,0.58]]],
    'K': [[[0.24,0.18], ['L',0.24,0.72]], [[0.76,0.18], ['L',0.26,0.46]], [[0.38,0.42], ['L',0.78,0.72]]],
    'L': [[[0.24,0.18], ['L',0.24,0.72], ['L',0.78,0.72]]],
    'M': [[[0.18,0.72], ['L',0.18,0.18]], [[0.18,0.18], ['L',0.50,0.64]], [[0.82,0.18], ['L',0.50,0.64]], [[0.82,0.18], ['L',0.82,0.72]]],
    'N': [[[0.22,0.72], ['L',0.22,0.18]], [[0.22,0.18], ['L',0.78,0.72]], [[0.78,0.18], ['L',0.78,0.72]]],
    'O': [[[0.50,0.18], ['C',0.14,0.18, 0.14,0.72, 0.50,0.72], ['C',0.86,0.72, 0.86,0.18, 0.50,0.18]]],
    'P': [[[0.24,0.18], ['L',0.24,0.72]], [[0.24,0.18], ['C',0.78,0.18, 0.78,0.48, 0.24,0.48]]],
    'Q': [[[0.50,0.18], ['C',0.14,0.18, 0.14,0.72, 0.50,0.72], ['C',0.86,0.72, 0.86,0.18, 0.50,0.18]], [[0.56,0.58], ['L',0.84,0.78]]],
    'R': [[[0.24,0.18], ['L',0.24,0.72]], [[0.24,0.18], ['C',0.78,0.18, 0.78,0.46, 0.24,0.46]], [[0.46,0.46], ['L',0.78,0.72]]],
    'S': [[[0.76,0.27], ['C',0.62,0.14, 0.22,0.17, 0.24,0.31], ['C',0.26,0.45, 0.78,0.44, 0.78,0.60], ['C',0.78,0.74, 0.30,0.75, 0.22,0.63]]],
    'T': [[[0.18,0.18], ['L',0.82,0.18]], [[0.50,0.18], ['L',0.50,0.72]]],
    'U': [[[0.22,0.18], ['L',0.22,0.52], ['C',0.22,0.76, 0.78,0.76, 0.78,0.52], ['L',0.78,0.18]]],
    'V': [[[0.18,0.18], ['L',0.50,0.72]], [[0.82,0.18], ['L',0.50,0.72]]],
    'W': [[[0.14,0.18], ['L',0.32,0.72]], [[0.32,0.72], ['L',0.50,0.32]], [[0.50,0.32], ['L',0.68,0.72]], [[0.68,0.72], ['L',0.86,0.18]]],
    'X': [[[0.20,0.18], ['L',0.80,0.72]], [[0.80,0.18], ['L',0.20,0.72]]],
    'Y': [[[0.18,0.18], ['L',0.50,0.46]], [[0.82,0.18], ['L',0.50,0.46]], [[0.50,0.46], ['L',0.50,0.72]]],
    'Z': [[[0.20,0.18], ['L',0.80,0.18], ['L',0.20,0.72], ['L',0.80,0.72]]],

    // 英文字母小寫 a~z（精準對齊英文四線三格：頂線 0.18、中虛線 0.44、紅基線 0.72、底線 0.90）
    'a': [[[0.74,0.46], ['C',0.56,0.40, 0.20,0.43, 0.20,0.58], ['C',0.20,0.74, 0.58,0.75, 0.74,0.65]], [[0.74,0.44], ['L',0.74,0.72]]],
    'b': [[[0.24,0.18], ['L',0.24,0.72]], [[0.24,0.50], ['C',0.80,0.38, 0.80,0.76, 0.24,0.68]]],
    'c': [[[0.76,0.49], ['C',0.58,0.40, 0.20,0.43, 0.20,0.58], ['C',0.20,0.73, 0.58,0.76, 0.76,0.67]]],
    'd': [[[0.76,0.50], ['C',0.20,0.38, 0.20,0.76, 0.76,0.68]], [[0.76,0.18], ['L',0.76,0.72]]],
    'e': [[[0.22,0.58], ['L',0.78,0.58], ['C',0.78,0.40, 0.22,0.40, 0.22,0.58], ['C',0.22,0.75, 0.62,0.76, 0.75,0.68]]],
    'f': [[[0.72,0.22], ['C',0.64,0.15, 0.46,0.16, 0.46,0.32], ['L',0.46,0.72]], [[0.26,0.44], ['L',0.68,0.44]]],
    'g': [[[0.74,0.50], ['C',0.20,0.38, 0.20,0.76, 0.74,0.68]], [[0.74,0.44], ['L',0.74,0.74], ['C',0.74,0.92, 0.34,0.92, 0.24,0.84]]],
    'h': [[[0.24,0.18], ['L',0.24,0.72]], [[0.24,0.52], ['C',0.44,0.40, 0.76,0.42, 0.76,0.56], ['L',0.76,0.72]]],
    'i': [[[0.50,0.44], ['L',0.50,0.72]], [[0.50,0.26], ['L',0.50,0.29]]],
    'j': [[[0.56,0.44], ['L',0.56,0.76], ['C',0.56,0.92, 0.34,0.92, 0.24,0.86]], [[0.56,0.26], ['L',0.56,0.29]]],
    'k': [[[0.24,0.18], ['L',0.24,0.72]], [[0.72,0.44], ['L',0.26,0.60]], [[0.40,0.55], ['L',0.74,0.72]]],
    'l': [[[0.50,0.18], ['L',0.50,0.72]]],
    'm': [[[0.14,0.44], ['L',0.14,0.72]], [[0.14,0.52], ['C',0.28,0.41, 0.50,0.42, 0.50,0.56], ['L',0.50,0.72]], [[0.50,0.52], ['C',0.64,0.41, 0.86,0.42, 0.86,0.56], ['L',0.86,0.72]]],
    'n': [[[0.24,0.44], ['L',0.24,0.72]], [[0.24,0.52], ['C',0.46,0.41, 0.76,0.42, 0.76,0.56], ['L',0.76,0.72]]],
    'o': [[[0.50,0.44], ['C',0.16,0.44, 0.16,0.72, 0.50,0.72], ['C',0.84,0.72, 0.84,0.44, 0.50,0.44]]],
    'p': [[[0.24,0.44], ['L',0.24,0.90]], [[0.24,0.50], ['C',0.80,0.38, 0.80,0.76, 0.24,0.68]]],
    'q': [[[0.76,0.50], ['C',0.20,0.38, 0.20,0.76, 0.76,0.68]], [[0.76,0.44], ['L',0.76,0.90]]],
    'r': [[[0.30,0.44], ['L',0.30,0.72]], [[0.30,0.52], ['Q',0.48,0.40, 0.72,0.46]]],
    's': [[[0.72,0.48], ['C',0.58,0.40, 0.26,0.43, 0.28,0.52], ['C',0.30,0.59, 0.74,0.58, 0.72,0.66], ['C',0.70,0.75, 0.34,0.75, 0.24,0.68]]],
    't': [[[0.48,0.22], ['L',0.48,0.64], ['Q',0.48,0.73, 0.72,0.71]], [[0.26,0.44], ['L',0.70,0.44]]],
    'u': [[[0.24,0.44], ['L',0.24,0.62], ['C',0.24,0.76, 0.74,0.76, 0.74,0.58]], [[0.74,0.44], ['L',0.74,0.72]]],
    'v': [[[0.20,0.44], ['L',0.50,0.72]], [[0.80,0.44], ['L',0.50,0.72]]],
    'w': [[[0.14,0.44], ['L',0.32,0.72]], [[0.32,0.72], ['L',0.50,0.48]], [[0.50,0.48], ['L',0.68,0.72]], [[0.68,0.72], ['L',0.86,0.44]]],
    'x': [[[0.22,0.44], ['L',0.78,0.72]], [[0.78,0.44], ['L',0.22,0.72]]],
    'y': [[[0.22,0.44], ['L',0.50,0.70]], [[0.78,0.44], ['L',0.34,0.90]]],
    'z': [[[0.22,0.44], ['L',0.78,0.44], ['L',0.22,0.72], ['L',0.78,0.72]]]
  };

  function getCharRelWidth(ch){
    if(ch === '1' || ch === 'I' || ch === 'i' || ch === 'l' || ch === 'j') return 0.56;
    if(ch === 'M' || ch === 'W' || ch === 'm' || ch === 'w') return 1.05;
    if(/[a-z]/.test(ch)) return 0.80;
    return 0.92;
  }

  function buildCharBoxes(sym, rect){
    const chars = [...String(sym || '')];
    if(!chars.length) return [];
    if(chars.length === 1){
      const side = Math.min(rect.w, rect.h);
      return [{ ch: chars[0], x: rect.x + (rect.w - side) / 2, y: rect.y + (rect.h - side) / 2, w: side, h: side }];
    }
    const rels = chars.map(getCharRelWidth);
    const sumRel = rels.reduce((a, b) => a + b, 0);
    const boxW = Math.min(rect.w, rect.h * Math.max(1.0, sumRel * 0.58));
    const boxH = Math.min(rect.h, boxW / Math.max(0.85, sumRel * 0.52));
    const startX = rect.x + (rect.w - boxW) / 2;
    const startY = rect.y + (rect.h - boxH) / 2;
    let curX = startX;
    return chars.map((ch, idx) => {
      const w = boxW * (rels[idx] / sumRel);
      const b = { ch, x: curX, y: startY, w, h: boxH };
      curX += w;
      return b;
    });
  }

  function traceStrokePath(g, segs, box){
    const mapXY = (nx, ny) => [box.x + nx * box.w, box.y + ny * box.h];
    const p0 = mapXY(segs[0][0], segs[0][1]);
    g.beginPath();
    g.moveTo(p0[0], p0[1]);
    let curX = p0[0], curY = p0[1], tanX = 0, tanY = 0;
    for(let i = 1; i < segs.length; i++){
      const seg = segs[i];
      const cmd = seg[0];
      if(cmd === 'L'){
        const [ex, ey] = mapXY(seg[1], seg[2]);
        g.lineTo(ex, ey);
        tanX = ex - curX; tanY = ey - curY;
        curX = ex; curY = ey;
      } else if(cmd === 'Q'){
        const [cx, cy] = mapXY(seg[1], seg[2]);
        const [ex, ey] = mapXY(seg[3], seg[4]);
        g.quadraticCurveTo(cx, cy, ex, ey);
        tanX = ex - cx; tanY = ey - cy;
        if(Math.hypot(tanX, tanY) < 0.5){ tanX = ex - curX; tanY = ey - curY; }
        curX = ex; curY = ey;
      } else if(cmd === 'C'){
        const [c1x, c1y] = mapXY(seg[1], seg[2]);
        const [c2x, c2y] = mapXY(seg[3], seg[4]);
        const [ex, ey] = mapXY(seg[5], seg[6]);
        g.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
        tanX = ex - c2x; tanY = ey - c2y;
        if(Math.hypot(tanX, tanY) < 0.5){ tanX = ex - c1x; tanY = ey - c1y; }
        if(Math.hypot(tanX, tanY) < 0.5){ tanX = ex - curX; tanY = ey - curY; }
        curX = ex; curY = ey;
      }
    }
    return { p0, endX: curX, endY: curY, tanX, tanY };
  }

  function drawVectorGlyph(g, sym, rect, opts){
    const boxes = buildCharBoxes(sym, rect);
    const items = [];
    boxes.forEach(b => {
      (STROKE_PATHS[b.ch] || []).forEach(segs => items.push({ segs, box: b }));
    });
    if(!items.length) return;
    const lw = Math.max(4, (opts.lineWidth || boxes[0].h * 0.145));
    g.save();
    g.lineCap = 'round';
    g.lineJoin = 'round';
    if(opts.mode === 'trace'){
      // 先繪外輪廓再清出空心通道，確保輪廓圓潤無鋸齒，且內部筆順虛線 100% 絕對置中
      g.strokeStyle = opts.outlineColor || '#94a3b8';
      g.lineWidth = lw;
      items.forEach(it => { traceStrokePath(g, it.segs, it.box); g.stroke(); });
      g.strokeStyle = opts.innerColor || '#f8fafc';
      g.lineWidth = Math.max(2.5, lw * 0.72);
      items.forEach(it => { traceStrokePath(g, it.segs, it.box); g.stroke(); });
    } else {
      g.strokeStyle = opts.color || '#1e293b';
      g.lineWidth = lw;
      items.forEach(it => { traceStrokePath(g, it.segs, it.box); g.stroke(); });
    }
    g.restore();
  }

  function drawStrokeOrderOverlay(g, sym, rect, clampBox, compact=false, darkBg=false){
    const boxes = buildCharBoxes(sym, rect);
    const strokes = [];
    boxes.forEach(b => {
      (STROKE_PATHS[b.ch] || []).forEach(segs => strokes.push({ segs, box: b }));
    });
    if(!strokes.length) return;
    const palette = darkBg
      ? ['#60a5fa', '#fb923c', '#4ade80', '#c084fc']
      : ['#2563eb', '#e67e22', '#16a34a', '#9333ea'];
    const placedBadges = [];
    const r = Math.max(compact ? 3.9 : 4.8, Math.min(compact ? 5.2 : 6.5, clampBox.w * 0.055));

    strokes.forEach((st, idx) => {
      const segs = st.segs;
      if(!segs || segs.length < 2) return;
      const col = palette[idx % palette.length];
      g.save();
      g.strokeStyle = col;
      g.globalAlpha = darkBg ? 0.94 : 0.88;
      g.lineWidth = compact ? 1.3 : 1.55;
      g.lineCap = 'round';
      g.lineJoin = 'round';
      g.setLineDash([2.8, 2.3]);
      const { p0, endX, endY, tanX, tanY } = traceStrokePath(g, segs, st.box);
      g.stroke();
      g.setLineDash([]);

      // 依末弧段精確切線繪製方向箭頭
      const ang = Math.atan2(tanY, tanX);
      const aLen = compact ? 4.4 : 5.5;
      g.fillStyle = col;
      g.beginPath();
      g.moveTo(endX + Math.cos(ang) * 1.8, endY + Math.sin(ang) * 1.8);
      g.lineTo(endX - aLen * Math.cos(ang - 0.52), endY - aLen * Math.sin(ang - 0.52));
      g.lineTo(endX - aLen * Math.cos(ang + 0.52), endY - aLen * Math.sin(ang + 0.52));
      g.closePath();
      g.fill();

      // 筆順數字圓點 1, 2, 3（沿起筆外側安全微調，確保貼合不飛出格框且互不遮擋）
      let bx0 = p0[0] - r * 0.72;
      let by0 = p0[1] - r * 0.72;
      const minX = clampBox.x + r + 1.5, maxX = clampBox.x + clampBox.w - r - 1.5;
      const minY = clampBox.y + r + 1.5, maxY = clampBox.y + clampBox.h - r - 1.5;
      bx0 = Math.max(minX, Math.min(maxX, bx0));
      by0 = Math.max(minY, Math.min(maxY, by0));
      const offsets = [[0,0],[r*2.15,0],[-r*2.15,0],[0,-r*2.15],[0,r*2.15],[r*1.8,r*1.8]];
      for(const [ox, oy] of offsets){
        const candX = Math.max(minX, Math.min(maxX, bx0 + ox));
        const candY = Math.max(minY, Math.min(maxY, by0 + oy));
        if(placedBadges.every(([px, py]) => Math.hypot(candX - px, candY - py) >= r * 2.08)){
          bx0 = candX; by0 = candY;
          break;
        }
      }
      placedBadges.push([bx0, by0]);

      g.globalAlpha = 0.96;
      g.fillStyle = col;
      g.beginPath();
      g.arc(bx0, by0, r, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = '#fff';
      g.lineWidth = 1.1;
      g.stroke();

      g.fillStyle = '#fff';
      g.font = `800 ${Math.round(r * 1.32)}px "Noto Sans TC",sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(String(idx + 1), bx0, by0 + 0.4);
      g.restore();
    });
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

    const pad = levelId === 'large' ? 2.5 : 3;
    const bx = pad, by = pad, bw = cw - pad*2, bh = chh - pad*2;

    if(rowIdx === 0){
      // 頂格：上方可愛插圖徽章區 ＋ 下方放大加粗之黑色實心示範大字（虛線 100% 置中）
      g.fillStyle = item.kind === 'zy' ? '#fff7ed' : (item.kind === 'num' ? '#f0fdf4' : '#eff6ff');
      g.fillRect(bx, by, bw, bh);
      g.strokeStyle = item.kind === 'zy' ? '#fb923c' : (item.kind === 'num' ? '#4ade80' : '#60a5fa');
      g.lineWidth = 1.8;
      g.strokeRect(bx, by, bw, bh);

      const topH = showIllust ? Math.round(bh * 0.36) : 0;
      if(showIllust){
        g.fillStyle = 'rgba(255,255,255,0.92)';
        g.fillRect(bx+2, by+2, bw-4, topH);

        const circleR = Math.max(11, Math.round(topH * 0.41));
        const iconCx = bx + 6 + circleR;
        const iconCy = by + 2 + topH * 0.50;
        g.save();
        g.fillStyle = item.kind === 'zy' ? '#ffedd5' : (item.kind === 'num' ? '#dcfce7' : '#dbeafe');
        g.beginPath();
        g.arc(iconCx, iconCy, circleR, 0, Math.PI * 2);
        g.fill();
        g.restore();

        const iconFs = Math.max(18, Math.round(topH * 0.68));
        g.font = `${iconFs}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
        g.textBaseline = 'middle';
        g.textAlign = 'center';
        g.fillText(item.icon || '🌟', iconCx, iconCy + 1);

        if(item.kind === 'num' && item.dots > 0 && item.dots <= 10){
          const cnt = item.dots;
          const colsD = Math.min(5, cnt);
          const rowsD = cnt > 5 ? 2 : 1;
          const dotsLeft = iconCx + circleR + 6;
          const dotsRight = bx + bw - 5;
          const availW = Math.max(18, dotsRight - dotsLeft);
          const availH = Math.max(12, topH - 6);
          const dotR = Math.max(1.9, Math.min(3.3, availW / (colsD * 2.75), availH / (rowsD * 2.8)));
          const stepX = dotR * 2.55;
          const stepY = dotR * 2.65;
          const totalH = (rowsD - 1) * stepY;
          const baseCy = by + 2 + topH * 0.50 - totalH / 2;
          g.save();
          g.fillStyle = '#15803d';
          for(let dIdx = 0; dIdx < cnt; dIdx++){
            const rI = Math.floor(dIdx / 5);
            const cI = dIdx % 5;
            const rowCnt = rI === 0 ? Math.min(5, cnt) : (cnt - 5);
            const rowStartX = dotsRight - (rowCnt - 1) * stepX - dotR;
            const cxD = Math.max(dotsLeft + dotR, rowStartX + cI * stepX);
            const cyD = baseCy + rI * stepY;
            g.beginPath();
            g.arc(cxD, cyD, dotR, 0, Math.PI * 2);
            g.fill();
          }
          g.restore();
        } else {
          g.fillStyle = '#5a2d00';
          const hintFs = Math.max(10, Math.min(13.5, Math.round(bw * 0.12)));
          g.font = `700 ${hintFs}px "Noto Sans TC","PingFang TC",sans-serif`;
          g.textAlign = 'right';
          g.fillText(item.hint || '', bx + bw - 6, by + 2 + topH * 0.52);
        }

        g.strokeStyle = item.kind === 'zy' ? '#fed7aa' : (item.kind === 'num' ? '#bbf7d0' : '#bfdbfe');
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(bx + 4, by + 2 + topH);
        g.lineTo(bx + bw - 4, by + 2 + topH);
        g.stroke();
      }

      // 下方黑色實心範例大字：更大更粗，確保視覺醒目清楚
      const sym = String(item.sym);
      const gapPx = showIllust ? 2 : 3;
      const modelTop = showIllust ? (by + 2 + topH + gapPx) : (by + 2);
      const modelH = Math.max(28, by + bh - modelTop - 2);
      const modelRect = { x: bx + 3, y: modelTop, w: bw - 6, h: modelH };
      const len = sym.length;
      const boldLw = Math.max(5.5, (len >= 2 ? modelH * 0.125 : modelH * 0.175));
      drawVectorGlyph(g, sym, modelRect, { mode: 'solid', color: '#0f172a', lineWidth: boldLw });

      if(len === 1){
        drawStrokeOrderOverlay(g, sym, modelRect, {x: bx + 2, y: modelTop, w: bw - 4, h: modelH}, true, true);
      }
      return cv;
    }

    // 練習格框線：英文採用「四線三格」、數字與注音採用「十字虛線引導大格」
    g.strokeStyle = item.kind === 'zy' ? '#f59e0b' : (item.kind === 'num' ? '#22c55e' : '#3b82f6');
    g.lineWidth = 1.4;
    g.strokeRect(bx, by, bw, bh);

    if(item.kind === 'abc'){
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
      g.lineWidth = 0.8;
      g.strokeStyle = '#e5e7eb';
      g.setLineDash([4,3]);
      g.beginPath();
      g.moveTo(bx + bw/2, by); g.lineTo(bx + bw/2, by + bh);
      g.moveTo(bx, by + bh/2); g.lineTo(bx + bw, by + bh/2);
      g.stroke();
      g.setLineDash([]);
    }

    // 漸層描紅引導：前 2 格（rowIdx === 1, 2）為空心輪廓＋100% 置中筆順虛線＋123 箭頭，後段漸淺至獨立格
    const sym = String(item.sym);
    const len = sym.length;
    const isLastBlank = (rowIdx === totalRows - 1 && totalRows >= 7);
    const cellRect = item.kind === 'abc'
      ? { x: bx + 4, y: by, w: bw - 8, h: bh }
      : { x: bx + 4, y: by + 4, w: bw - 8, h: bh - 8 };
    const traceLw = Math.max(4.5, (len >= 2 ? bh * 0.11 : bh * 0.145));

    if(!isLastBlank){
      const isGuide = rowIdx <= 2;
      const strokeColor = rowIdx === 1 ? '#94a3b8' : (rowIdx === 2 ? '#a8b8cc' : (rowIdx <= Math.ceil(totalRows * 0.55) ? '#cbd5e1' : '#e2e8f0'));
      if(isGuide || levelId === 'small'){
        drawVectorGlyph(g, sym, cellRect, {
          mode: 'trace',
          outlineColor: strokeColor,
          innerColor: rowIdx === 1 ? '#f1f5f9' : '#f8fafc',
          lineWidth: traceLw
        });
      } else {
        drawVectorGlyph(g, sym, cellRect, {
          mode: 'fade',
          color: strokeColor,
          lineWidth: traceLw * 0.85
        });
      }

      if(rowIdx === 1 || rowIdx === 2){
        drawStrokeOrderOverlay(g, sym, cellRect, {x: bx + 2, y: by + 2, w: bw - 4, h: bh - 4}, rowIdx === 2, false);
      }
    } else {
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
    let wantPages = cfg.singlePass ? Math.max(2, Math.ceil(baseItems.length / cols)) : (sheets * 2);
    if(wantPages % 2 === 1) wantPages += 1;
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

    const A4W = 794, MARGIN = 24, HEADER_H = 82;
    const CONTENT_W = A4W - MARGIN * 2;
    const CONTENT_H = 1122 - 20 - HEADER_H - 34; // 保留頂部標題框與底部版權列 34px
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
          <b>🐣 向日葵幼兒園寫字帖｜${lvl.name}</b>
          <span>${lvl.stageTitle}・${topicLabel}</span>
        </div>
        <div class="pre-a4-info">
          <span>寶貝姓名：<span class="pre-name-box"></span></span>
          <span>日期：　 月　 日</span>
          <span>⭐🌟</span>
        </div>`;
      pg.appendChild(hd);

      const leftOff = Math.round((A4W - cols * cwMax) / 2);
      const topOff = HEADER_H + 4;
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
