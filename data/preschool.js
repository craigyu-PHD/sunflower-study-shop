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
    // 阿拉伯數字 0~9（配合無襯線圓體數字像素中心線對齊）
    '0': [[[0.423,0.125], ['C',0.215,0.14,0.208,0.754,0.483,0.73], ['C',0.77,0.796,0.824,0.119,0.499,0.1]]],
    '1': [[[0.298,0.297], ['Q',0.442,0.229,0.554,0.18], ['L',0.55,0.725]]],
    '2': [[[0.234,0.319], ['C',0.11,0.052,0.898,0.054,0.715,0.28], ['C',0.702,0.393,0.42,0.526,0.258,0.708], ['L',0.791,0.72]]],
    '3': [[[0.201,0.212], ['C',0.425,0.068,0.711,0.09,0.713,0.245], ['Q',0.663,0.379,0.508,0.432], ['C',0.818,0.4,0.843,0.826,0.273,0.707]]],
    '4': [[[0.58,0.133], ['L',0.188,0.571], ['L',0.758,0.564]], [[0.632,0.154], ['L',0.633,0.735]]],
    '5': [[[0.393,0.1], ['L',0.302,0.372], ['C',0.638,0.296,0.783,0.441,0.702,0.592], ['C',0.7,0.777,0.397,0.753,0.271,0.684]], [[0.295,0.146], ['L',0.716,0.109]]],
    '6': [[[0.559,0.083], ['C',0.207,0.126,0.253,0.515,0.318,0.622], ['C',0.389,0.802,0.72,0.762,0.773,0.534], ['C',0.719,0.363,0.202,0.381,0.276,0.48]]],
    '7': [[[0.258,0.118], ['L',0.757,0.122], ['Q',0.464,0.426,0.429,0.778]]],
    '8': [[[0.506,0.422], ['C',0.248,0.354,0.186,0.071,0.58,0.109], ['C',0.73,0.147,0.775,0.403,0.41,0.39], ['C',0.212,0.486,0.245,0.727,0.476,0.773], ['C',0.757,0.726,0.806,0.493,0.565,0.39]]],
    '9': [[[0.685,0.311], ['C',0.768,0.053,0.163,0.098,0.278,0.295], ['C',0.208,0.524,0.66,0.523,0.687,0.321], ['Q',0.774,0.686,0.421,0.773]]],

    // 注音符號（依教育部標準筆順＋標楷體像素中心線與斜度對齊：ㄅ~ㄩ 共 37 個）
    'ㄅ': [[[0.235,0.41], ['L',0.749,0.319], ['Q',0.724,0.639,0.56,0.816], ['Q',0.521,0.828,0.444,0.741]]],
    'ㄆ': [[[0.381,0.175], ['Q',0.336,0.222,0.293,0.421]], [[0.267,0.39], ['L',0.723,0.335], ['Q',0.566,0.673,0.327,0.805]], [[0.454,0.584], ['Q',0.6,0.677,0.711,0.787]]],
    'ㄇ': [[[0.249,0.314], ['L',0.252,0.73]], [[0.367,0.289], ['Q',0.445,0.254,0.74,0.238], ['Q',0.755,0.388,0.735,0.725]]],
    'ㄈ': [[[0.248,0.331], ['L',0.743,0.26]], [[0.276,0.315], ['L',0.288,0.622], ['Q',0.298,0.713,0.395,0.74], ['L',0.754,0.724]]],
    'ㄉ': [[[0.404,0.374], ['L',0.772,0.336], ['Q',0.688,0.693,0.571,0.801], ['Q',0.573,0.835,0.453,0.742]], [[0.367,0.126], ['Q',0.275,0.335,0.239,0.468]]],
    'ㄊ': [[[0.543,0.177], ['Q',0.571,0.327,0.426,0.394]], [[0.251,0.493], ['L',0.737,0.41]], [[0.491,0.31], ['Q',0.431,0.469,0.343,0.777], ['Q',0.469,0.753,0.491,0.739], ['Q',0.696,0.674,0.692,0.677]]],
    'ㄋ': [[[0.317,0.208], ['L',0.614,0.196], ['Q',0.485,0.313,0.382,0.43], ['L',0.743,0.41], ['Q',0.626,0.694,0.554,0.799]]],
    'ㄌ': [[[0.275,0.418], ['L',0.729,0.348], ['Q',0.692,0.692,0.605,0.795], ['Q',0.556,0.817,0.483,0.747]], [[0.532,0.215], ['Q',0.474,0.57,0.241,0.8]]],
    'ㄍ': [[[0.438,0.236], ['Q',0.371,0.376,0.28,0.511], ['Q',0.334,0.638,0.451,0.773]], [[0.7,0.215], ['Q',0.621,0.372,0.523,0.513], ['Q',0.588,0.63,0.683,0.759]]],
    'ㄎ': [[[0.227,0.26], ['L',0.672,0.215]], [[0.445,0.291], ['Q',0.384,0.413,0.35,0.442], ['L',0.72,0.417], ['Q',0.704,0.698,0.562,0.814]]],
    'ㄏ': [[[0.317,0.287], ['L',0.74,0.221]], [[0.34,0.274], ['Q',0.335,0.538,0.23,0.731]]],
    'ㄐ': [[[0.359,0.252], ['L',0.372,0.623], ['Q',0.374,0.615,0.397,0.637], ['Q',0.437,0.63,0.587,0.553]], [[0.667,0.223], ['L',0.655,0.806]]],
    'ㄑ': [[[0.622,0.193], ['L',0.349,0.528], ['L',0.634,0.802]]],
    'ㄒ': [[[0.22,0.282], ['L',0.712,0.213]], [[0.525,0.242], ['L',0.533,0.745]]],
    'ㄓ': [[[0.283,0.312], ['L',0.296,0.524], ['Q',0.282,0.578,0.457,0.534], ['L',0.665,0.516]], [[0.713,0.282], ['L',0.677,0.548]], [[0.483,0.195], ['L',0.482,0.766]]],
    'ㄔ': [[[0.618,0.144], ['Q',0.516,0.32,0.347,0.425]], [[0.609,0.391], ['Q',0.515,0.533,0.299,0.66]], [[0.56,0.504], ['L',0.553,0.842]]],
    'ㄕ': [[[0.376,0.228], ['L',0.738,0.21], ['L',0.68,0.396]], [[0.349,0.422], ['L',0.679,0.385]], [[0.393,0.217], ['Q',0.319,0.632,0.295,0.77]]],
    'ㄖ': [[[0.297,0.263], ['L',0.288,0.757]], [[0.409,0.24], ['L',0.699,0.21], ['L',0.689,0.771]], [[0.394,0.395], ['L',0.574,0.579]], [[0.314,0.751], ['L',0.694,0.733]]],
    'ㄗ': [[[0.299,0.273], ['L',0.728,0.195], ['Q',0.716,0.475,0.631,0.558], ['L',0.62,0.553]], [[0.388,0.326], ['L',0.379,0.825]]],
    'ㄘ': [[[0.228,0.415], ['L',0.744,0.33]], [[0.478,0.174], ['Q',0.484,0.372,0.433,0.555], ['L',0.727,0.531], ['Q',0.695,0.666,0.562,0.79]]],
    'ㄙ': [[[0.527,0.236], ['Q',0.361,0.516,0.267,0.757], ['Q',0.505,0.691,0.713,0.64]], [[0.621,0.529], ['Q',0.738,0.657,0.764,0.76]]],
    'ㄚ': [[[0.358,0.305], ['Q',0.432,0.392,0.462,0.423]], [[0.684,0.258], ['Q',0.594,0.385,0.528,0.47]], [[0.41,0.299], ['L',0.561,0.821]]],
    'ㄛ': [[[0.283,0.265], ['L',0.542,0.243], ['L',0.561,0.449]], [[0.341,0.487], ['L',0.558,0.412]], [[0.314,0.588], ['L',0.35,0.695], ['Q',0.472,0.842,0.716,0.7]]],
    'ㄜ': [[[0.248,0.421], ['L',0.707,0.347]], [[0.51,0.185], ['L',0.356,0.705], ['Q',0.375,0.86,0.649,0.771]]],
    'ㄝ': [[[0.187,0.51], ['L',0.661,0.405], ['L',0.617,0.634]], [[0.645,0.218], ['L',0.634,0.564]], [[0.373,0.274], ['L',0.385,0.668], ['Q',0.414,0.848,0.74,0.755]]],
    'ㄞ': [[[0.318,0.257], ['L',0.738,0.205]], [[0.41,0.475], ['L',0.699,0.436], ['Q',0.673,0.648,0.58,0.82]], [[0.54,0.284], ['Q',0.455,0.657,0.254,0.835]]],
    'ㄟ': [[[0.188,0.351], ['Q',0.41,0.27,0.352,0.351], ['Q',0.471,0.565,0.761,0.746]]],
    'ㄠ': [[[0.455,0.234], ['L',0.276,0.478], ['L',0.431,0.292]], [[0.639,0.333], ['L',0.29,0.773], ['L',0.693,0.696]], [[0.593,0.585], ['Q',0.68,0.696,0.726,0.779]]],
    'ㄡ': [[[0.366,0.285], ['L',0.713,0.214], ['Q',0.621,0.558,0.278,0.789]], [[0.344,0.465], ['Q',0.653,0.618,0.777,0.797]]],
    'ㄢ': [[[0.298,0.239], ['L',0.695,0.192]], [[0.361,0.244], ['L',0.278,0.465], ['L',0.719,0.418], ['Q',0.678,0.666,0.544,0.789]]],
    'ㄣ': [[[0.37,0.23], ['L',0.30,0.52], ['L',0.73,0.44], ['Q',0.66,0.66,0.56,0.78]]],
    'ㄤ': [[[0.265,0.464], ['L',0.739,0.383]], [[0.522,0.215], ['Q',0.489,0.58,0.25,0.78]], [[0.494,0.477], ['L',0.505,0.821], ['Q',0.681,0.816,0.753,0.817]]],
    'ㄥ': [[[0.506,0.243], ['Q',0.334,0.527,0.241,0.739], ['L',0.641,0.695]]],
    'ㄦ': [[[0.346,0.234], ['Q',0.346,0.57,0.224,0.744]], [[0.542,0.227], ['L',0.551,0.772], ['Q',0.74,0.79,0.785,0.764]]],
    'ㄧ': [[[0.202,0.508], ['L',0.787,0.45]]],
    'ㄨ': [[[0.62,0.236], ['Q',0.554,0.575,0.273,0.802]], [[0.262,0.368], ['Q',0.58,0.542,0.766,0.791]]],
    'ㄩ': [[[0.254,0.337], ['L',0.261,0.708], ['Q',0.282,0.734,0.282,0.73], ['L',0.73,0.675]], [[0.74,0.255], ['L',0.734,0.731]]],

    // 英文字母大寫 A~Z（圓體大寫像素中心線對齊）
    'A': [[[0.418,0.195], ['L',0.163,0.758]], [[0.553,0.174], ['L',0.814,0.726]], [[0.255,0.542], ['L',0.744,0.553]]],
    'B': [[[0.24,0.193], ['L',0.246,0.713]], [[0.347,0.102], ['C',0.879,0.099,0.871,0.447,0.268,0.411]], [[0.294,0.423], ['C',0.919,0.415,0.922,0.783,0.313,0.729]]],
    'C': [[[0.775,0.197], ['C',0.606,0.054,0.197,0.088,0.205,0.399], ['C',0.186,0.763,0.564,0.772,0.713,0.674]]],
    'D': [[[0.222,0.197], ['L',0.237,0.717]], [[0.321,0.103], ['C',0.945,0.108,0.943,0.817,0.321,0.708]]],
    'E': [[[0.261,0.194], ['L',0.284,0.726]], [[0.276,0.115], ['L',0.758,0.112]], [[0.261,0.39], ['L',0.699,0.403]], [[0.269,0.705], ['L',0.777,0.719]]],
    'F': [[[0.299,0.2], ['L',0.307,0.726]], [[0.24,0.127], ['L',0.746,0.11]], [[0.252,0.414], ['L',0.693,0.4]]],
    'G': [[[0.791,0.207], ['C',0.586,0.053,0.104,0.084,0.18,0.422], ['C',0.156,0.736,0.525,0.786,0.782,0.67], ['L',0.82,0.608]], [[0.569,0.45], ['L',0.835,0.457]]],
    'H': [[[0.22,0.207], ['L',0.22,0.732]], [[0.784,0.206], ['L',0.778,0.732]], [[0.22,0.398], ['L',0.78,0.391]]],
    'I': [[[0.5,0.23], ['L',0.5,0.726]]],
    'J': [[[0.641,0.23], ['L',0.641,0.59], ['C',0.63,0.754,0.355,0.773,0.269,0.634]]],
    'K': [[[0.24,0.199], ['L',0.24,0.732]], [[0.694,0.164], ['L',0.262,0.5]], [[0.41,0.407], ['L',0.851,0.748]]],
    'L': [[[0.324,0.192], ['L',0.293,0.7], ['L',0.799,0.715]]],
    'M': [[[0.168,0.726], ['L',0.18,0.2]], [[0.279,0.143], ['L',0.5,0.716]], [[0.72,0.122], ['L',0.5,0.717]], [[0.82,0.207], ['L',0.822,0.732]]],
    'N': [[[0.22,0.726], ['L',0.22,0.2]], [[0.321,0.2], ['L',0.778,0.765]], [[0.777,0.2], ['L',0.762,0.726]]],
    'O': [[[0.458,0.102], ['C',0.064,0.132,0.097,0.742,0.48,0.722], ['C',0.88,0.779,0.887,0.182,0.643,0.13]]],
    'P': [[[0.261,0.199], ['L',0.269,0.726]], [[0.296,0.135], ['C',0.882,0.135,0.91,0.506,0.257,0.495]]],
    'Q': [[[0.426,0.112], ['C',0.088,0.128,0.078,0.742,0.488,0.722], ['C',0.9,0.757,0.88,0.166,0.633,0.132]], [[0.62,0.644], ['L',0.906,0.8]]],
    'R': [[[0.24,0.207], ['L',0.24,0.732]], [[0.297,0.151], ['C',0.879,0.124,0.896,0.494,0.308,0.443]], [[0.522,0.404], ['L',0.818,0.745]]],
    'S': [[[0.743,0.192], ['C',0.609,0.07,0.191,0.074,0.258,0.28], ['C',0.281,0.405,0.828,0.398,0.745,0.559], ['C',0.769,0.773,0.347,0.758,0.291,0.661]]],
    'T': [[[0.185,0.114], ['L',0.807,0.119]], [[0.5,0.2], ['L',0.496,0.726]]],
    'U': [[[0.22,0.2], ['L',0.22,0.533], ['C',0.226,0.778,0.734,0.799,0.769,0.558], ['L',0.78,0.2]]],
    'V': [[[0.233,0.195], ['L',0.484,0.732]], [[0.758,0.198], ['L',0.503,0.752]]],
    'W': [[[0.105,0.2], ['L',0.252,0.732]], [[0.285,0.708], ['L',0.431,0.24]], [[0.581,0.304], ['L',0.717,0.732]], [[0.73,0.732], ['L',0.892,0.2]]],
    'X': [[[0.289,0.147], ['L',0.757,0.731]], [[0.692,0.178], ['L',0.208,0.741]]],
    'Y': [[[0.257,0.146], ['L',0.507,0.484]], [[0.746,0.131], ['L',0.474,0.488]], [[0.5,0.47], ['L',0.496,0.726]]],
    'Z': [[[0.246,0.107], ['L',0.762,0.116], ['L',0.2,0.707], ['L',0.726,0.722]]],

    // 英文字母小寫 a~z（圓體小寫像素中心線對齊）
    'a': [[[0.734,0.391], ['C',0.51,0.213,0.199,0.303,0.246,0.645], ['C',0.282,0.775,0.542,0.764,0.683,0.634]], [[0.68,0.347], ['L',0.699,0.698]]],
    'b': [[[0.276,0.18], ['L',0.276,0.719]], [[0.308,0.376], ['C',0.91,0.243,0.88,0.8,0.313,0.696]]],
    'c': [[[0.754,0.406], ['C',0.557,0.217,0.267,0.285,0.28,0.508], ['C',0.256,0.753,0.574,0.802,0.731,0.635]]],
    'd': [[[0.745,0.383], ['C',0.066,0.245,0.102,0.791,0.735,0.734]], [[0.716,0.18], ['L',0.716,0.719]]],
    'e': [[[0.219,0.513], ['L',0.742,0.511], ['C',0.796,0.235,0.234,0.243,0.29,0.48], ['C',0.235,0.773,0.562,0.765,0.677,0.7]]],
    'f': [[[0.64,0.12], ['Q',0.47,0.10,0.47,0.30], ['L',0.47,0.71]], [[0.30,0.34], ['L',0.66,0.34]]],
    'g': [[[0.709,0.34], ['C',0.094,0.254,0.091,0.809,0.698,0.701]], [[0.716,0.37], ['L',0.7,0.778], ['C',0.729,0.947,0.427,0.936,0.308,0.918]]],
    'h': [[[0.287,0.183], ['L',0.289,0.713]], [[0.284,0.4], ['C',0.52,0.286,0.76,0.284,0.699,0.486], ['L',0.701,0.719]]],
    'i': [[[0.5,0.35], ['L',0.501,0.72]], [[0.5,0.14], ['L',0.5,0.18]]],
    'j': [[[0.5,0.35], ['L',0.497,0.784], ['C',0.511,0.921,0.38,0.939,0.278,0.898]], [[0.5,0.14], ['L',0.5,0.18]]],
    'k': [[[0.318,0.18], ['L',0.33,0.717]], [[0.672,0.302], ['L',0.31,0.59]], [[0.498,0.424], ['L',0.733,0.741]]],
    'l': [[[0.5,0.18], ['L',0.5,0.719]]],
    'm': [[[0.14,0.393], ['L',0.14,0.732]], [[0.162,0.37], ['C',0.377,0.248,0.56,0.287,0.499,0.52], ['L',0.5,0.719]], [[0.523,0.365], ['C',0.741,0.242,0.864,0.279,0.86,0.52], ['L',0.853,0.719]]],
    'n': [[[0.284,0.39], ['L',0.292,0.745]], [[0.293,0.407], ['C',0.519,0.291,0.768,0.31,0.721,0.526], ['L',0.721,0.732]]],
    'o': [[[0.395,0.324], ['C',0.22,0.332,0.208,0.702,0.441,0.739], ['C',0.789,0.78,0.842,0.334,0.526,0.29]]],
    'p': [[[0.276,0.38], ['L',0.276,0.91]], [[0.279,0.358], ['C',0.898,0.245,0.895,0.857,0.297,0.687]]],
    'q': [[[0.68,0.361], ['C',0.093,0.24,0.098,0.823,0.766,0.741]], [[0.71,0.38], ['L',0.716,0.91]]],
    'r': [[[0.368,0.398], ['L',0.35,0.733]], [[0.322,0.48], ['Q',0.5,0.262,0.69,0.314]]],
    's': [[[0.672,0.364], ['C',0.593,0.252,0.228,0.268,0.318,0.433], ['C',0.34,0.492,0.756,0.534,0.682,0.616], ['C',0.694,0.769,0.386,0.794,0.27,0.636]]],
    't': [[[0.48,0.21], ['L',0.478,0.665], ['Q',0.474,0.749,0.652,0.728]], [[0.292,0.319], ['L',0.693,0.342]]],
    'u': [[[0.284,0.38], ['L',0.285,0.602], ['C',0.26,0.754,0.655,0.795,0.716,0.55]], [[0.708,0.38], ['L',0.708,0.726]]],
    'v': [[[0.299,0.363], ['L',0.503,0.745]], [[0.723,0.294], ['L',0.522,0.693]]],
    'w': [[[0.135,0.376], ['L',0.294,0.741]], [[0.308,0.725], ['L',0.447,0.398]], [[0.53,0.371], ['L',0.684,0.719]], [[0.691,0.739], ['L',0.865,0.357]]],
    'x': [[[0.293,0.285], ['L',0.706,0.736]], [[0.734,0.32], ['L',0.274,0.735]]],
    'y': [[[0.309,0.38], ['L',0.503,0.781]], [[0.706,0.336], ['L',0.43,0.907]]],
    'z': [[[0.314,0.294], ['L',0.714,0.315], ['L',0.225,0.726], ['L',0.767,0.719]]]
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
