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

  // 台灣幼兒園筆順與方向引導貝茲平滑路徑庫（依實測字寬精確對齊；支援 'L' 直線、'Q' 二次貝茲、'C' 三次貝茲弧線）
  const STROKE_PATHS = {
    // 阿拉伯數字 0~9（配合無襯線圓體數字對齊）
    '0': [[[0.50,0.18], ['C', 0.14,0.18, 0.14,0.82, 0.50,0.82], ['C', 0.86,0.82, 0.86,0.18, 0.53,0.19]]],
    '1': [[[0.32,0.30], ['Q', 0.44,0.23, 0.54,0.18], ['L', 0.54,0.82]]],
    '2': [[[0.20,0.34], ['C', 0.20,0.14, 0.82,0.14, 0.80,0.34], ['C', 0.78,0.49, 0.42,0.62, 0.18,0.81], ['L', 0.84,0.81]]],
    '3': [[[0.22,0.27], ['C', 0.40,0.14, 0.80,0.18, 0.78,0.35], ['Q', 0.74,0.47, 0.46,0.49], ['C', 0.85,0.50, 0.84,0.84, 0.20,0.77]]],
    '4': [[[0.64,0.18], ['L', 0.18,0.64], ['L', 0.84,0.64]], [[0.64,0.18], ['L', 0.64,0.84]]],
    '5': [[[0.30,0.20], ['L', 0.26,0.47], ['C', 0.54,0.40, 0.84,0.52, 0.78,0.70], ['C', 0.72,0.85, 0.34,0.85, 0.20,0.76]], [[0.30,0.20], ['L', 0.78,0.20]]],
    '6': [[[0.66,0.18], ['C', 0.26,0.22, 0.16,0.56, 0.24,0.72], ['C', 0.36,0.86, 0.82,0.82, 0.80,0.62], ['C', 0.78,0.44, 0.30,0.46, 0.22,0.58]]],
    '7': [[[0.18,0.20], ['L', 0.82,0.20], ['Q', 0.56,0.50, 0.38,0.82]]],
    '8': [[[0.48,0.48], ['C', 0.16,0.38, 0.20,0.17, 0.50,0.17], ['C', 0.80,0.17, 0.84,0.38, 0.50,0.48], ['C', 0.14,0.58, 0.14,0.83, 0.50,0.83], ['C', 0.86,0.83, 0.86,0.58, 0.54,0.49]]],
    '9': [[[0.78,0.36], ['C', 0.76,0.15, 0.20,0.15, 0.20,0.36], ['C', 0.20,0.55, 0.74,0.55, 0.78,0.36], ['Q', 0.78,0.66, 0.42,0.83]]],

    // 注音符號（依教育部標準筆順＋台灣標楷體輪廓精準對位：ㄅ~ㄩ 共 37 個）
    'ㄅ': [[[0.26,0.33], ['L', 0.72,0.30], ['Q', 0.70,0.66, 0.58,0.80], ['Q', 0.50,0.78, 0.42,0.71]]],
    'ㄆ': [[[0.48,0.17], ['Q', 0.44,0.32, 0.40,0.45]], [[0.24,0.47], ['L', 0.72,0.44], ['Q', 0.56,0.68, 0.34,0.82]], [[0.48,0.56], ['Q', 0.62,0.67, 0.74,0.78]]],
    'ㄇ': [[[0.26,0.26], ['L', 0.26,0.80]], [[0.26,0.28], ['L', 0.72,0.26], ['L', 0.72,0.80]]],
    'ㄈ': [[[0.24,0.26], ['L', 0.76,0.26]], [[0.28,0.26], ['L', 0.28,0.76], ['L', 0.76,0.76]]],
    'ㄉ': [[[0.32,0.36], ['L', 0.72,0.34], ['Q', 0.68,0.68, 0.56,0.82], ['Q', 0.48,0.79, 0.42,0.73]], [[0.46,0.18], ['Q', 0.36,0.38, 0.24,0.54]]],
    'ㄊ': [[[0.56,0.18], ['Q', 0.42,0.25, 0.28,0.29]], [[0.22,0.48], ['L', 0.76,0.45]], [[0.48,0.25], ['Q', 0.44,0.56, 0.44,0.75], ['Q', 0.56,0.78, 0.76,0.75]]],
    'ㄋ': [[[0.28,0.25], ['L', 0.68,0.23], ['Q', 0.46,0.38, 0.32,0.47], ['L', 0.72,0.45], ['Q', 0.68,0.68, 0.56,0.81]]],
    'ㄌ': [[[0.24,0.36], ['L', 0.72,0.34], ['Q', 0.68,0.68, 0.58,0.82], ['Q', 0.50,0.79, 0.44,0.73]], [[0.50,0.17], ['Q', 0.40,0.56, 0.24,0.80]]],
    'ㄍ': [[[0.56,0.19], ['L', 0.30,0.50], ['L', 0.62,0.80]]],
    'ㄎ': [[[0.24,0.26], ['L', 0.74,0.25]], [[0.46,0.26], ['L', 0.34,0.50], ['L', 0.72,0.48], ['Q', 0.66,0.68, 0.56,0.82]]],
    'ㄏ': [[[0.30,0.30], ['L', 0.74,0.26]], [[0.34,0.30], ['Q', 0.32,0.56, 0.24,0.78]]],
    'ㄐ': [[[0.34,0.24], ['L', 0.34,0.72], ['Q', 0.48,0.65, 0.58,0.58]], [[0.66,0.19], ['L', 0.66,0.84]]],
    'ㄑ': [[[0.62,0.19], ['L', 0.30,0.50], ['L', 0.64,0.80]]],
    'ㄒ': [[[0.22,0.26], ['L', 0.78,0.25]], [[0.50,0.26], ['L', 0.50,0.82]]],
    'ㄓ': [[[0.30,0.38], ['L', 0.30,0.63], ['L', 0.72,0.61]], [[0.72,0.36], ['L', 0.72,0.65]], [[0.50,0.18], ['L', 0.50,0.84]]],
    'ㄔ': [[[0.62,0.20], ['Q', 0.46,0.31, 0.30,0.41]], [[0.64,0.39], ['Q', 0.44,0.53, 0.26,0.66]], [[0.50,0.50], ['L', 0.50,0.84]]],
    'ㄕ': [[[0.30,0.22], ['L', 0.70,0.21], ['L', 0.70,0.44]], [[0.30,0.44], ['L', 0.70,0.43]], [[0.30,0.22], ['Q', 0.28,0.56, 0.22,0.80]]],
    'ㄖ': [[[0.30,0.22], ['L', 0.30,0.80]], [[0.30,0.22], ['L', 0.70,0.21], ['L', 0.70,0.80]], [[0.30,0.50], ['L', 0.70,0.50]], [[0.30,0.78], ['L', 0.70,0.78]]],
    'ㄗ': [[[0.28,0.26], ['L', 0.72,0.24], ['Q', 0.70,0.50, 0.68,0.65], ['L', 0.54,0.58]], [[0.30,0.26], ['L', 0.30,0.84]]],
    'ㄘ': [[[0.22,0.37], ['L', 0.78,0.26]], [[0.48,0.17], ['L', 0.36,0.50], ['L', 0.74,0.45], ['Q', 0.68,0.68, 0.56,0.80]]],
    'ㄙ': [[[0.50,0.22], ['Q', 0.36,0.52, 0.28,0.72], ['Q', 0.48,0.69, 0.70,0.64]], [[0.60,0.52], ['Q', 0.68,0.65, 0.74,0.78]]],
    'ㄚ': [[[0.30,0.28], ['Q', 0.36,0.38, 0.40,0.48]], [[0.70,0.28], ['Q', 0.65,0.38, 0.60,0.48]], [[0.50,0.20], ['L', 0.50,0.84]]],
    'ㄛ': [[[0.33,0.28], ['L', 0.66,0.26], ['L', 0.62,0.46]], [[0.36,0.46], ['L', 0.62,0.46]], [[0.35,0.46], ['L', 0.35,0.68], ['Q', 0.42,0.78, 0.73,0.71]]],
    'ㄜ': [[[0.25,0.43], ['L', 0.76,0.38]], [[0.43,0.18], ['L', 0.43,0.69], ['Q', 0.48,0.79, 0.74,0.72]]],
    'ㄝ': [[[0.18,0.47], ['L', 0.78,0.35], ['L', 0.66,0.58]], [[0.53,0.18], ['L', 0.53,0.63]], [[0.34,0.28], ['L', 0.34,0.70], ['Q', 0.40,0.80, 0.76,0.73]]],
    'ㄞ': [[[0.26,0.24], ['L', 0.74,0.23]], [[0.32,0.46], ['L', 0.68,0.44], ['Q', 0.66,0.66, 0.58,0.82]], [[0.50,0.24], ['Q', 0.38,0.56, 0.24,0.82]]],
    'ㄟ': [[[0.18,0.46], ['Q', 0.31,0.25, 0.38,0.32], ['Q', 0.56,0.56, 0.78,0.74]]],
    'ㄠ': [[[0.48,0.18], ['L', 0.30,0.42], ['L', 0.54,0.40]], [[0.62,0.32], ['L', 0.28,0.74], ['L', 0.68,0.66]], [[0.62,0.56], ['Q', 0.68,0.67, 0.74,0.78]]],
    'ㄡ': [[[0.28,0.26], ['L', 0.72,0.25], ['Q', 0.52,0.56, 0.26,0.80]], [[0.34,0.38], ['Q', 0.56,0.62, 0.76,0.80]]],
    'ㄢ': [[[0.28,0.26], ['L', 0.72,0.25]], [[0.42,0.26], ['L', 0.32,0.50], ['L', 0.74,0.48], ['Q', 0.68,0.68, 0.58,0.82]]],
    'ㄣ': [[[0.33,0.33], ['L', 0.62,0.28], ['L', 0.31,0.54], ['L', 0.70,0.48], ['Q', 0.60,0.68, 0.44,0.80]]],
    'ㄤ': [[[0.24,0.41], ['L', 0.75,0.34]], [[0.48,0.19], ['Q', 0.42,0.56, 0.24,0.78]], [[0.52,0.46], ['L', 0.52,0.72], ['Q', 0.58,0.79, 0.78,0.75]]],
    'ㄥ': [[[0.48,0.20], ['Q', 0.36,0.50, 0.28,0.74], ['L', 0.74,0.72]]],
    'ㄦ': [[[0.36,0.22], ['Q', 0.33,0.56, 0.24,0.80]], [[0.58,0.22], ['L', 0.58,0.74], ['Q', 0.68,0.78, 0.80,0.76]]],
    'ㄧ': [[[0.20,0.50], ['L', 0.80,0.50]]],
    'ㄨ': [[[0.68,0.24], ['Q', 0.50,0.54, 0.26,0.80]], [[0.30,0.26], ['Q', 0.52,0.54, 0.74,0.80]]],
    'ㄩ': [[[0.26,0.26], ['L', 0.26,0.74], ['L', 0.74,0.74]], [[0.74,0.26], ['L', 0.74,0.80]]],

    // 英文字母大寫 A~Z（圓體字寬精準對齊）
    'A': [[[0.50,0.20], ['L', 0.16,0.79]], [[0.50,0.20], ['L', 0.84,0.79]], [[0.28,0.58], ['L', 0.72,0.58]]],
    'B': [[[0.24,0.20], ['L', 0.24,0.79]], [[0.24,0.20], ['C', 0.78,0.20, 0.78,0.49, 0.24,0.49]], [[0.24,0.49], ['C', 0.84,0.49, 0.84,0.79, 0.24,0.79]]],
    'C': [[[0.82,0.30], ['C', 0.62,0.15, 0.18,0.19, 0.18,0.50], ['C', 0.18,0.81, 0.62,0.85, 0.82,0.70]]],
    'D': [[[0.22,0.20], ['L', 0.22,0.79]], [[0.22,0.20], ['C', 0.86,0.20, 0.86,0.79, 0.22,0.79]]],
    'E': [[[0.24,0.20], ['L', 0.24,0.79]], [[0.24,0.20], ['L', 0.78,0.20]], [[0.24,0.49], ['L', 0.72,0.49]], [[0.24,0.79], ['L', 0.80,0.79]]],
    'F': [[[0.24,0.20], ['L', 0.24,0.79]], [[0.24,0.20], ['L', 0.80,0.20]], [[0.24,0.50], ['L', 0.72,0.50]]],
    'G': [[[0.80,0.30], ['C', 0.60,0.15, 0.18,0.19, 0.18,0.50], ['C', 0.18,0.81, 0.62,0.85, 0.82,0.70], ['L', 0.82,0.52]], [[0.54,0.52], ['L', 0.84,0.52]]],
    'H': [[[0.22,0.20], ['L', 0.22,0.79]], [[0.78,0.20], ['L', 0.78,0.79]], [[0.22,0.49], ['L', 0.78,0.49]]],
    'I': [[[0.28,0.20], ['L', 0.72,0.20]], [[0.50,0.20], ['L', 0.50,0.79]], [[0.28,0.79], ['L', 0.72,0.79]]],
    'J': [[[0.28,0.20], ['L', 0.78,0.20]], [[0.64,0.20], ['L', 0.64,0.62], ['C', 0.64,0.82, 0.24,0.83, 0.20,0.68]]],
    'K': [[[0.24,0.20], ['L', 0.24,0.79]], [[0.78,0.20], ['L', 0.26,0.50]], [[0.36,0.46], ['L', 0.80,0.79]]],
    'L': [[[0.24,0.20], ['L', 0.24,0.79], ['L', 0.80,0.79]]],
    'M': [[[0.18,0.79], ['L', 0.18,0.20]], [[0.18,0.20], ['L', 0.50,0.72]], [[0.82,0.20], ['L', 0.50,0.72]], [[0.82,0.20], ['L', 0.82,0.79]]],
    'N': [[[0.22,0.79], ['L', 0.22,0.20]], [[0.22,0.20], ['L', 0.78,0.79]], [[0.78,0.20], ['L', 0.78,0.79]]],
    'O': [[[0.50,0.18], ['C', 0.12,0.18, 0.12,0.81, 0.50,0.81], ['C', 0.88,0.81, 0.88,0.18, 0.54,0.19]]],
    'P': [[[0.24,0.20], ['L', 0.24,0.79]], [[0.24,0.20], ['C', 0.82,0.20, 0.82,0.53, 0.24,0.53]]],
    'Q': [[[0.50,0.18], ['C', 0.12,0.18, 0.12,0.80, 0.50,0.80], ['C', 0.88,0.80, 0.88,0.18, 0.54,0.19]], [[0.56,0.64], ['L', 0.84,0.84]]],
    'R': [[[0.24,0.20], ['L', 0.24,0.79]], [[0.24,0.20], ['C', 0.80,0.20, 0.80,0.51, 0.24,0.51]], [[0.46,0.51], ['L', 0.80,0.79]]],
    'S': [[[0.78,0.29], ['C', 0.64,0.15, 0.20,0.18, 0.22,0.34], ['C', 0.24,0.50, 0.80,0.48, 0.80,0.66], ['C', 0.80,0.84, 0.30,0.84, 0.20,0.70]]],
    'T': [[[0.16,0.20], ['L', 0.84,0.20]], [[0.50,0.20], ['L', 0.50,0.79]]],
    'U': [[[0.22,0.20], ['L', 0.22,0.56], ['C', 0.22,0.83, 0.78,0.83, 0.78,0.56], ['L', 0.78,0.20]]],
    'V': [[[0.18,0.20], ['L', 0.50,0.79]], [[0.82,0.20], ['L', 0.50,0.79]]],
    'W': [[[0.12,0.20], ['L', 0.31,0.79]], [[0.31,0.79], ['L', 0.50,0.33]], [[0.50,0.33], ['L', 0.69,0.79]], [[0.69,0.79], ['L', 0.88,0.20]]],
    'X': [[[0.20,0.20], ['L', 0.80,0.79]], [[0.80,0.20], ['L', 0.20,0.79]]],
    'Y': [[[0.18,0.20], ['L', 0.50,0.51]], [[0.82,0.20], ['L', 0.50,0.51]], [[0.50,0.51], ['L', 0.50,0.80]]],
    'Z': [[[0.20,0.20], ['L', 0.80,0.20], ['L', 0.20,0.79], ['L', 0.80,0.79]]],

    // 英文字母小寫 a~z（圓體小寫中線對齊）
    'a': [[[0.76,0.42], ['C', 0.58,0.32, 0.18,0.36, 0.18,0.57], ['C', 0.18,0.78, 0.60,0.80, 0.76,0.65]], [[0.76,0.37], ['L', 0.76,0.77]]],
    'b': [[[0.24,0.18], ['L', 0.24,0.78]], [[0.24,0.48], ['C', 0.82,0.32, 0.84,0.80, 0.24,0.72]]],
    'c': [[[0.78,0.44], ['C', 0.58,0.32, 0.18,0.36, 0.18,0.57], ['C', 0.18,0.78, 0.60,0.82, 0.78,0.70]]],
    'd': [[[0.76,0.48], ['C', 0.16,0.34, 0.16,0.80, 0.76,0.72]], [[0.76,0.18], ['L', 0.76,0.78]]],
    'e': [[[0.22,0.56], ['L', 0.80,0.56], ['C', 0.80,0.34, 0.20,0.34, 0.20,0.57], ['C', 0.20,0.80, 0.64,0.81, 0.78,0.70]]],
    'f': [[[0.74,0.20], ['Q', 0.46,0.15, 0.46,0.34], ['L', 0.46,0.79]], [[0.24,0.40], ['L', 0.68,0.40]]],
    'g': [[[0.76,0.45], ['C', 0.18,0.34, 0.18,0.77, 0.76,0.67]], [[0.76,0.37], ['L', 0.76,0.75], ['C', 0.76,0.94, 0.34,0.93, 0.22,0.84]]],
    'h': [[[0.24,0.18], ['L', 0.24,0.78]], [[0.24,0.48], ['C', 0.46,0.34, 0.76,0.36, 0.76,0.54], ['L', 0.76,0.78]]],
    'i': [[[0.50,0.39], ['L', 0.50,0.77]], [[0.50,0.22], ['L', 0.50,0.28]]],
    'j': [[[0.50,0.38], ['L', 0.50,0.74], ['C', 0.50,0.90, 0.32,0.92, 0.24,0.88]], [[0.50,0.19], ['L', 0.50,0.26]]],
    'k': [[[0.24,0.18], ['L', 0.24,0.78]], [[0.74,0.38], ['L', 0.28,0.59]], [[0.42,0.53], ['L', 0.78,0.78]]],
    'l': [[[0.50,0.18], ['L', 0.50,0.78]]],
    'm': [[[0.14,0.39], ['L', 0.14,0.77]], [[0.14,0.47], ['C', 0.28,0.35, 0.50,0.37, 0.50,0.52], ['L', 0.50,0.77]], [[0.50,0.47], ['C', 0.64,0.35, 0.86,0.37, 0.86,0.52], ['L', 0.86,0.77]]],
    'n': [[[0.24,0.39], ['L', 0.24,0.77]], [[0.24,0.47], ['C', 0.46,0.35, 0.76,0.37, 0.76,0.54], ['L', 0.76,0.77]]],
    'o': [[[0.50,0.36], ['C', 0.14,0.36, 0.14,0.78, 0.50,0.78], ['C', 0.86,0.78, 0.86,0.36, 0.54,0.37]]],
    'p': [[[0.24,0.38], ['L', 0.24,0.91]], [[0.24,0.46], ['C', 0.82,0.34, 0.82,0.77, 0.24,0.71]]],
    'q': [[[0.76,0.46], ['C', 0.18,0.34, 0.18,0.77, 0.76,0.71]], [[0.76,0.38], ['L', 0.76,0.91]]],
    'r': [[[0.28,0.39], ['L', 0.28,0.77]], [[0.28,0.48], ['Q', 0.48,0.35, 0.74,0.41]]],
    's': [[[0.74,0.44], ['C', 0.58,0.34, 0.24,0.37, 0.26,0.49], ['C', 0.28,0.58, 0.76,0.58, 0.74,0.69], ['C', 0.72,0.80, 0.34,0.80, 0.24,0.71]]],
    't': [[[0.48,0.21], ['L', 0.48,0.69], ['Q', 0.50,0.79, 0.72,0.76]], [[0.24,0.40], ['L', 0.72,0.40]]],
    'u': [[[0.24,0.38], ['L', 0.24,0.65], ['C', 0.24,0.82, 0.74,0.82, 0.74,0.61]], [[0.74,0.38], ['L', 0.74,0.77]]],
    'v': [[[0.20,0.38], ['L', 0.50,0.77]], [[0.80,0.38], ['L', 0.50,0.77]]],
    'w': [[[0.12,0.38], ['L', 0.31,0.77]], [[0.31,0.77], ['L', 0.50,0.43]], [[0.50,0.43], ['L', 0.69,0.77]], [[0.69,0.77], ['L', 0.88,0.38]]],
    'x': [[[0.22,0.38], ['L', 0.78,0.77]], [[0.78,0.38], ['L', 0.22,0.77]]],
    'y': [[[0.22,0.38], ['L', 0.50,0.74]], [[0.78,0.38], ['L', 0.34,0.91]]],
    'z': [[[0.22,0.39], ['L', 0.78,0.39], ['L', 0.22,0.77], ['L', 0.78,0.77]]]
  };

  function buildCharBoxes(g, sym, centerX, glyphY, baseFs){
    const s = String(sym || '');
    const chars = [...s];
    if(!chars.length) return [];
    const totalW = g.measureText(s).width;
    const rawWidths = chars.map(ch => Math.max(2, g.measureText(ch).width));
    const sumRaw = rawWidths.reduce((a,b) => a + b, 0) || 1;
    let curX = centerX - totalW / 2;
    const boxTop = glyphY - baseFs * 0.50;
    const minVisW = baseFs * 0.42;
    return chars.map((ch, idx) => {
      const advW = rawWidths[idx] * (totalW / sumRaw);
      const visW = Math.max(advW, minVisW);
      const cx = curX + advW / 2;
      const box = { ch, x: cx - visW / 2, y: boxTop, w: visW, h: baseFs };
      curX += advW;
      return box;
    });
  }

  function getStrokesForSym(g, sym, centerX, glyphY, baseFs){
    const boxes = buildCharBoxes(g, sym, centerX, glyphY, baseFs);
    const out = [];
    boxes.forEach(b => {
      const list = STROKE_PATHS[b.ch] || [];
      list.forEach(segs => out.push({ segs, box: b }));
    });
    return out;
  }

  function drawStrokeOrderOverlay(g, sym, centerX, glyphY, baseFs, clampBox, compact=false){
    const strokes = getStrokesForSym(g, sym, centerX, glyphY, baseFs);
    if(!strokes.length) return;
    const palette = ['#2563eb', '#e67e22', '#16a34a', '#9333ea'];
    const placedBadges = [];
    const r = Math.max(compact ? 4.0 : 4.8, Math.min(compact ? 5.6 : 6.6, clampBox.w * 0.056));

    strokes.forEach((st, idx) => {
      const segs = st.segs;
      if(!segs || segs.length < 2) return;
      const col = palette[idx % palette.length];
      const mapXY = (nx, ny) => [
        st.box.x + nx * st.box.w,
        st.box.y + ny * st.box.h
      ];
      const p0 = mapXY(segs[0][0], segs[0][1]);

      // 繪製流暢平滑之貝茲方向虛線 ＋ 末點切線箭頭
      g.save();
      g.strokeStyle = col;
      g.globalAlpha = compact ? 0.64 : 0.78;
      g.lineWidth = compact ? 1.15 : 1.45;
      g.lineCap = 'round';
      g.lineJoin = 'round';
      g.setLineDash([2.8, 2.2]);
      g.beginPath();
      g.moveTo(p0[0], p0[1]);

      let curX = p0[0], curY = p0[1];
      let tanX = 0, tanY = 0;
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
      g.stroke();
      g.setLineDash([]);

      // 依最後弧段精確切線繪製方向箭頭
      const ang = Math.atan2(tanY, tanX);
      const aLen = compact ? 4.6 : 5.6;
      g.fillStyle = col;
      g.beginPath();
      g.moveTo(curX + Math.cos(ang) * 1.8, curY + Math.sin(ang) * 1.8);
      g.lineTo(curX - aLen * Math.cos(ang - 0.52), curY - aLen * Math.sin(ang - 0.52));
      g.lineTo(curX - aLen * Math.cos(ang + 0.52), curY - aLen * Math.sin(ang + 0.52));
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

      g.globalAlpha = 0.94;
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
      // 頂格：放大可愛插圖徽章區 ＋ 清晰呼吸間距 ＋ 示範大字（附筆順 123 箭頭引導）
      g.fillStyle = item.kind === 'zy' ? '#fff7ed' : (item.kind === 'num' ? '#f0fdf4' : '#eff6ff');
      g.fillRect(bx, by, bw, bh);
      g.strokeStyle = item.kind === 'zy' ? '#fb923c' : (item.kind === 'num' ? '#4ade80' : '#60a5fa');
      g.lineWidth = 1.8;
      g.strokeRect(bx, by, bw, bh);

      const topH = showIllust ? Math.round(bh * 0.43) : 0;
      if(showIllust){
        g.fillStyle = 'rgba(255,255,255,0.92)';
        g.fillRect(bx+2, by+2, bw-4, topH);

        // 可愛圓形圖片底座＋大幅放大 Emoji 插圖
        const circleR = Math.max(12, Math.round(topH * 0.42));
        const iconCx = bx + 6 + circleR;
        const iconCy = by + 2 + topH * 0.50;
        g.save();
        g.fillStyle = item.kind === 'zy' ? '#ffedd5' : (item.kind === 'num' ? '#dcfce7' : '#dbeafe');
        g.beginPath();
        g.arc(iconCx, iconCy, circleR, 0, Math.PI * 2);
        g.fill();
        g.restore();

        const iconFs = Math.max(20, Math.round(topH * 0.68));
        g.font = `${iconFs}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
        g.textBaseline = 'middle';
        g.textAlign = 'center';
        g.fillText(item.icon || '🌟', iconCx, iconCy + 1);

        // 右側語詞小膠囊／點數提示，與大圖保留清楚間距
        g.fillStyle = '#5a2d00';
        const hintFs = Math.max(10.5, Math.min(14, Math.round(bw * 0.125)));
        g.font = `700 ${hintFs}px "Noto Sans TC","PingFang TC",sans-serif`;
        g.textAlign = 'right';
        if(item.kind === 'num' && item.dots > 0 && item.dots <= 5){
          g.fillText('●'.repeat(item.dots), bx + bw - 6, by + 2 + topH * 0.52);
        } else {
          g.fillText(item.hint || '', bx + bw - 6, by + 2 + topH * 0.52);
        }

        // 圖文之間柔和分隔線
        g.strokeStyle = item.kind === 'zy' ? '#fed7aa' : (item.kind === 'num' ? '#bbf7d0' : '#bfdbfe');
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(bx + 4, by + 2 + topH);
        g.lineTo(bx + bw - 4, by + 2 + topH);
        g.stroke();
      }

      // 下方示範大字（保留圖字間明確呼吸距離 gapPx）
      const sym = String(item.sym);
      const gapPx = showIllust ? Math.max(6, Math.round(bh * 0.045)) : 4;
      const modelTop = showIllust ? (by + 2 + topH + gapPx) : (by + 4);
      const modelH = Math.max(24, by + bh - modelTop - 4);
      const len = sym.length;
      const baseFs = len >= 3 ? modelH * 0.50 : (len === 2 ? modelH * 0.64 : modelH * 0.80);
      const fontFam = (item.kind === 'abc' || item.kind === 'num')
        ? '"Arial Rounded MT Bold","PingFang TC","Microsoft JhengHei",sans-serif'
        : '"BiauKai","DFKai-SB","標楷體","Noto Sans TC",sans-serif';
      g.font = `700 ${Math.round(baseFs)}px ${fontFam}`;
      g.fillStyle = '#1e293b';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(sym, bx + bw / 2, modelTop + modelH * 0.52);

      // 頂格僅在單字少筆畫示範時附上輕量虛線引導，複合字（如 Aa、10）保留清晰大字範本不遮擋
      if(len === 1){
        drawStrokeOrderOverlay(g, sym, bx + bw / 2, modelTop + modelH * 0.52, baseFs, {x: bx + 2, y: modelTop, w: bw - 4, h: modelH}, true);
      }
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

    // 漸層描紅引導：前 2～3 格（第 0 範字＋第 1、2 描紅格）均含「1、2、3 筆順＋箭頭」，後段漸淺至獨立格
    const sym = String(item.sym);
    const len = sym.length;
    const isLastBlank = (rowIdx === totalRows - 1 && totalRows >= 7);
    const baseFs = len >= 3 ? bh * 0.44 : (len === 2 ? bh * 0.56 : bh * 0.72);
    const fontFam = (item.kind === 'abc' || item.kind === 'num')
      ? '"Arial Rounded MT Bold","PingFang TC","Microsoft JhengHei",sans-serif'
      : '"BiauKai","DFKai-SB","標楷體","Noto Sans TC",sans-serif';
    g.font = `600 ${Math.round(baseFs)}px ${fontFam}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';

    if(!isLastBlank){
      const isGuide = rowIdx <= 2;
      const strokeColor = rowIdx === 1 ? '#94a3b8' : (rowIdx === 2 ? '#a8b8cc' : (rowIdx <= Math.ceil(totalRows * 0.55) ? '#cbd5e1' : '#e2e8f0'));
      if(isGuide || levelId === 'small'){
        // 柔和實線空心＋淡灰填色描紅框（消除外圈鋸齒虛線，讓內部筆順虛線清楚貼合）
        g.save();
        g.strokeStyle = strokeColor;
        g.lineWidth = levelId === 'small' ? 1.25 : 0.95;
        g.strokeText(sym, bx + bw/2, by + bh * 0.53);
        g.fillStyle = rowIdx === 1 ? 'rgba(148,163,184,0.18)' : 'rgba(203,213,225,0.15)';
        g.fillText(sym, bx + bw/2, by + bh * 0.53);
        g.restore();
      } else {
        g.fillStyle = strokeColor;
        g.fillText(sym, bx + bw/2, by + bh * 0.53);
      }

      // 前面 2 格練習格（rowIdx === 1, 2）加上依實測字寬對齊之筆順 123 編號與平滑弧線方向箭頭引導
      if(rowIdx === 1 || rowIdx === 2){
        drawStrokeOrderOverlay(g, sym, bx + bw / 2, by + bh * 0.53, baseFs, {x: bx + 2, y: by + 2, w: bw - 4, h: bh - 4}, rowIdx === 2);
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
