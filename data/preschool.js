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

  // 台灣幼兒園標準公版字型（標楷體／圓體）＋ 筆順中心線虛線導引（支援 'L'、'Q'、'C'）
  const STROKE_PATHS = {
    // 阿拉伯數字 0~9（配合無襯線圓體數字像素中心線對齊）
    '0': [[[0.448,0.105], ['C',0.212,0.124,0.209,0.743,0.5,0.775], ['C',0.784,0.755,0.783,0.108,0.539,0.116]]],
    '1': [[[0.305,0.296], ['Q',0.4,0.244,0.56,0.174], ['L',0.564,0.722]]],
    '2': [[[0.297,0.259], ['C',0.214,0.075,0.833,0.054,0.697,0.308], ['C',0.686,0.407,0.371,0.547,0.284,0.707], ['L',0.724,0.719]]],
    '3': [[[0.265,0.201], ['C',0.42,0.095,0.787,0.12,0.67,0.271], ['Q',0.615,0.375,0.553,0.386], ['C',0.817,0.468,0.778,0.797,0.305,0.737]]],
    '4': [[[0.564,0.13], ['L',0.181,0.618], ['L',0.792,0.559]], [[0.625,0.196], ['L',0.632,0.739]]],
    '5': [[[0.357,0.142], ['L',0.301,0.401], ['C',0.62,0.33,0.829,0.44,0.695,0.624], ['C',0.65,0.76,0.404,0.768,0.291,0.67]], [[0.33,0.148], ['L',0.723,0.116]]],
    '6': [[[0.582,0.111], ['C',0.242,0.151,0.24,0.491,0.308,0.631], ['C',0.397,0.797,0.744,0.759,0.721,0.544], ['C',0.837,0.367,0.25,0.384,0.271,0.507]]],
    '7': [[[0.232,0.165], ['L',0.727,0.131], ['Q',0.479,0.439,0.413,0.776]]],
    '8': [[[0.499,0.428], ['C',0.235,0.324,0.2,0.103,0.544,0.103], ['C',0.746,0.149,0.777,0.351,0.422,0.402], ['C',0.199,0.499,0.218,0.748,0.481,0.748], ['C',0.783,0.749,0.806,0.509,0.582,0.409]]],
    '9': [[[0.713,0.348], ['C',0.746,0.07,0.186,0.123,0.27,0.286], ['C',0.216,0.542,0.68,0.516,0.706,0.319], ['Q',0.767,0.635,0.463,0.789]]],

    // 注音符號（依教育部標準筆順＋標楷體像素中心線與斜度對齊：ㄅ~ㄩ 共 37 個）
    'ㄅ': [[[0.239,0.411], ['L',0.748,0.324], ['Q',0.721,0.649,0.571,0.805], ['Q',0.558,0.846,0.448,0.759]]],
    'ㄆ': [[[0.378,0.149], ['Q',0.389,0.413,0.393,0.429]], [[0.213,0.412], ['L',0.694,0.358], ['Q',0.6,0.662,0.328,0.795]], [[0.419,0.564], ['Q',0.593,0.678,0.716,0.787]]],
    'ㄇ': [[[0.248,0.315], ['L',0.254,0.744]], [[0.335,0.296], ['Q',0.476,0.252,0.741,0.238], ['Q',0.749,0.34,0.739,0.721]]],
    'ㄈ': [[[0.258,0.326], ['L',0.752,0.261]], [[0.274,0.32], ['L',0.289,0.66], ['Q',0.325,0.734,0.429,0.74], ['L',0.76,0.72]]],
    'ㄉ': [[[0.36,0.386], ['L',0.761,0.326], ['Q',0.703,0.674,0.563,0.816], ['Q',0.551,0.812,0.436,0.736]], [[0.411,0.152], ['Q',0.314,0.352,0.227,0.471]]],
    'ㄊ': [[[0.557,0.173], ['Q',0.552,0.327,0.407,0.373]], [[0.248,0.491], ['L',0.735,0.409]], [[0.508,0.259], ['Q',0.39,0.539,0.375,0.744], ['Q',0.466,0.76,0.555,0.71], ['Q',0.733,0.667,0.708,0.69]]],
    'ㄋ': [[[0.301,0.201], ['L',0.598,0.184], ['Q',0.482,0.316,0.382,0.435], ['L',0.718,0.394], ['Q',0.662,0.649,0.539,0.808]]],
    'ㄌ': [[[0.269,0.465], ['L',0.734,0.354], ['Q',0.742,0.715,0.587,0.815], ['Q',0.581,0.819,0.507,0.768]], [[0.533,0.22], ['Q',0.46,0.594,0.24,0.799]]],
    'ㄍ': [[[0.444,0.225], ['Q',0.369,0.376,0.279,0.512], ['Q',0.354,0.653,0.451,0.785]], [[0.69,0.23], ['Q',0.618,0.374,0.523,0.515], ['Q',0.593,0.631,0.69,0.778]]],
    'ㄎ': [[[0.224,0.26], ['L',0.696,0.215]], [[0.451,0.288], ['Q',0.392,0.391,0.35,0.445], ['L',0.721,0.418], ['Q',0.708,0.685,0.56,0.817]]],
    'ㄏ': [[[0.338,0.282], ['L',0.745,0.219]], [[0.34,0.289], ['Q',0.333,0.541,0.225,0.741]]],
    'ㄐ': [[[0.36,0.257], ['L',0.369,0.599], ['Q',0.385,0.642,0.401,0.639], ['Q',0.456,0.618,0.597,0.549]], [[0.664,0.223], ['L',0.651,0.81]]],
    'ㄑ': [[[0.609,0.215], ['L',0.346,0.526], ['L',0.634,0.802]]],
    'ㄒ': [[[0.228,0.285], ['L',0.755,0.204]], [[0.523,0.257], ['L',0.523,0.778]]],
    'ㄓ': [[[0.288,0.32], ['L',0.296,0.52], ['Q',0.289,0.57,0.377,0.57], ['L',0.659,0.509]], [[0.714,0.279], ['L',0.675,0.557]], [[0.483,0.21], ['L',0.483,0.784]]],
    'ㄔ': [[[0.619,0.146], ['Q',0.52,0.317,0.344,0.425]], [[0.619,0.381], ['Q',0.485,0.562,0.292,0.663]], [[0.573,0.503], ['L',0.581,0.823]]],
    'ㄕ': [[[0.37,0.231], ['L',0.735,0.207], ['L',0.69,0.386]], [[0.338,0.421], ['L',0.661,0.387]], [[0.375,0.195], ['Q',0.33,0.611,0.267,0.787]]],
    'ㄖ': [[[0.30,0.25], ['L',0.30,0.76]], [[0.34,0.24], ['L',0.69,0.21], ['L',0.69,0.76]], [[0.32,0.50], ['L',0.68,0.47]], [[0.34,0.75], ['L',0.69,0.73]]],
    'ㄗ': [[[0.325,0.265], ['L',0.733,0.195], ['Q',0.716,0.457,0.636,0.565], ['L',0.613,0.55]], [[0.414,0.339], ['L',0.376,0.81]]],
    'ㄘ': [[[0.233,0.409], ['L',0.748,0.334]], [[0.488,0.168], ['Q',0.48,0.333,0.433,0.55], ['L',0.722,0.533], ['Q',0.696,0.665,0.563,0.789]]],
    'ㄙ': [[[0.529,0.236], ['Q',0.37,0.507,0.263,0.752], ['Q',0.487,0.703,0.702,0.637]], [[0.621,0.532], ['Q',0.717,0.654,0.761,0.767]]],
    'ㄚ': [[[0.359,0.304], ['Q',0.39,0.341,0.465,0.434]], [[0.703,0.229], ['Q',0.612,0.356,0.56,0.446]], [[0.416,0.274], ['L',0.545,0.82]]],
    'ㄛ': [[[0.352,0.263], ['L',0.608,0.228], ['L',0.576,0.436]], [[0.357,0.481], ['L',0.579,0.417]], [[0.332,0.52], ['L',0.332,0.651], ['Q',0.356,0.795,0.7,0.732]]],
    'ㄜ': [[[0.23,0.45], ['L',0.73,0.36]], [[0.46,0.21], ['L',0.46,0.68], ['Q',0.47,0.78,0.74,0.72]]],
    'ㄝ': [[[0.219,0.499], ['L',0.694,0.4], ['L',0.624,0.628]], [[0.644,0.23], ['L',0.63,0.577]], [[0.368,0.257], ['L',0.396,0.72], ['Q',0.452,0.821,0.714,0.767]]],
    'ㄞ': [[[0.284,0.265], ['L',0.719,0.204]], [[0.394,0.49], ['L',0.701,0.43], ['Q',0.673,0.646,0.58,0.82]], [[0.505,0.311], ['Q',0.428,0.621,0.258,0.834]]],
    'ㄟ': [[[0.196,0.367], ['Q',0.261,0.259,0.354,0.33], ['Q',0.485,0.604,0.773,0.739]]],
    'ㄠ': [[[0.455,0.236], ['L',0.281,0.464], ['L',0.415,0.292]], [[0.642,0.336], ['L',0.285,0.776], ['L',0.686,0.697]], [[0.602,0.596], ['Q',0.693,0.709,0.725,0.769]]],
    'ㄡ': [[[0.397,0.285], ['L',0.701,0.214], ['Q',0.624,0.566,0.278,0.788]], [[0.345,0.47], ['Q',0.662,0.628,0.754,0.755]]],
    'ㄢ': [[[0.298,0.24], ['L',0.654,0.192]], [[0.361,0.243], ['L',0.278,0.465], ['L',0.715,0.419], ['Q',0.678,0.666,0.547,0.786]]],
    'ㄣ': [[[0.37,0.23], ['L',0.30,0.52], ['L',0.73,0.44], ['Q',0.66,0.66,0.56,0.78]]],
    'ㄤ': [[[0.266,0.465], ['L',0.728,0.383]], [[0.522,0.215], ['Q',0.49,0.58,0.25,0.78]], [[0.48,0.408], ['L',0.511,0.816], ['Q',0.744,0.823,0.72,0.817]]],
    'ㄥ': [[[0.506,0.243], ['Q',0.334,0.529,0.241,0.739], ['L',0.641,0.695]]],
    'ㄦ': [[[0.342,0.264], ['Q',0.346,0.568,0.227,0.737]], [[0.529,0.23], ['L',0.529,0.782], ['Q',0.796,0.798,0.785,0.759]]],
    'ㄧ': [[[0.203,0.509], ['L',0.77,0.45]]],
    'ㄨ': [[[0.62,0.236], ['Q',0.554,0.575,0.273,0.803]], [[0.26,0.368], ['Q',0.579,0.546,0.761,0.777]]],
    'ㄩ': [[[0.248,0.324], ['L',0.261,0.698], ['Q',0.272,0.739,0.29,0.729], ['L',0.741,0.674]], [[0.74,0.25], ['L',0.734,0.726]]],

    // 英文字母大寫 A~Z（圓體大寫像素中心線對齊）
    'A': [[[0.418,0.202], ['L',0.162,0.753]], [[0.569,0.199], ['L',0.823,0.739]], [[0.265,0.536], ['L',0.737,0.554]]],
    'B': [[[0.24,0.214], ['L',0.246,0.713]], [[0.306,0.128], ['C',0.817,0.135,0.856,0.482,0.296,0.405]], [[0.316,0.398], ['C',0.899,0.399,0.89,0.801,0.304,0.713]]],
    'C': [[[0.8,0.258], ['C',0.681,0.068,0.117,0.112,0.205,0.456], ['C',0.22,0.762,0.605,0.775,0.739,0.655]]],
    'D': [[[0.234,0.217], ['L',0.238,0.713]], [[0.275,0.121], ['C',0.937,0.12,0.935,0.796,0.314,0.721]]],
    'E': [[[0.261,0.208], ['L',0.269,0.713]], [[0.254,0.13], ['L',0.719,0.132]], [[0.265,0.412], ['L',0.708,0.416]], [[0.269,0.707], ['L',0.769,0.719]]],
    'F': [[[0.322,0.216], ['L',0.299,0.707]], [[0.261,0.139], ['L',0.753,0.122]], [[0.266,0.424], ['L',0.683,0.409]]],
    'G': [[[0.799,0.22], ['C',0.559,0.078,0.105,0.114,0.166,0.46], ['C',0.193,0.736,0.55,0.787,0.78,0.666], ['L',0.822,0.603]], [[0.596,0.441], ['L',0.858,0.475]]],
    'H': [[[0.221,0.203], ['L',0.221,0.719]], [[0.784,0.211], ['L',0.778,0.732]], [[0.214,0.416], ['L',0.783,0.41]]],
    'I': [[[0.5,0.23], ['L',0.5,0.726]]],
    'J': [[[0.641,0.23], ['L',0.641,0.589], ['C',0.633,0.756,0.349,0.756,0.298,0.665]]],
    'K': [[[0.24,0.203], ['L',0.24,0.719]], [[0.698,0.158], ['L',0.271,0.5]], [[0.449,0.388], ['L',0.828,0.738]]],
    'L': [[[0.299,0.193], ['L',0.299,0.713], ['L',0.762,0.713]]],
    'M': [[[0.166,0.719], ['L',0.18,0.216]], [[0.264,0.142], ['L',0.513,0.719]], [[0.795,0.165], ['L',0.486,0.698]], [[0.82,0.21], ['L',0.823,0.719]]],
    'N': [[[0.22,0.719], ['L',0.22,0.213]], [[0.297,0.182], ['L',0.774,0.747]], [[0.777,0.209], ['L',0.762,0.726]]],
    'O': [[[0.42,0.112], ['C',0.061,0.156,0.113,0.737,0.482,0.731], ['C',0.898,0.755,0.908,0.146,0.595,0.119]]],
    'P': [[[0.261,0.212], ['L',0.269,0.719]], [[0.307,0.134], ['C',0.896,0.121,0.88,0.484,0.317,0.457]]],
    'Q': [[[0.423,0.112], ['C',0.066,0.151,0.104,0.745,0.492,0.725], ['C',0.89,0.757,0.906,0.14,0.595,0.119]], [[0.618,0.639], ['L',0.879,0.787]]],
    'R': [[[0.24,0.206], ['L',0.24,0.719]], [[0.306,0.136], ['C',0.866,0.135,0.876,0.492,0.284,0.429]], [[0.532,0.429], ['L',0.812,0.743]]],
    'S': [[[0.731,0.214], ['C',0.687,0.079,0.154,0.102,0.269,0.283], ['C',0.32,0.419,0.873,0.4,0.739,0.594], ['C',0.765,0.762,0.329,0.757,0.276,0.649]]],
    'T': [[[0.222,0.172], ['L',0.806,0.177]], [[0.5,0.216], ['L',0.496,0.726]]],
    'U': [[[0.22,0.209], ['L',0.22,0.51], ['C',0.205,0.778,0.737,0.815,0.757,0.54], ['L',0.78,0.211]]],
    'V': [[[0.241,0.214], ['L',0.481,0.725]], [[0.754,0.201], ['L',0.523,0.723]]],
    'W': [[[0.111,0.231], ['L',0.254,0.738]], [[0.254,0.732], ['L',0.446,0.256]], [[0.578,0.3], ['L',0.714,0.719]], [[0.732,0.732], ['L',0.886,0.211]]],
    'X': [[[0.206,0.17], ['L',0.779,0.737]], [[0.715,0.145], ['L',0.241,0.702]]],
    'Y': [[[0.259,0.144], ['L',0.511,0.494]], [[0.74,0.138], ['L',0.468,0.495]], [[0.503,0.492], ['L',0.496,0.732]]],
    'Z': [[[0.276,0.136], ['L',0.759,0.138], ['L',0.186,0.711], ['L',0.766,0.719]]],

    // 英文字母小寫 a~z（圓體小寫像素中心線對齊）
    'a': [[[0.707,0.354], ['C',0.479,0.207,0.203,0.264,0.239,0.585], ['C',0.19,0.78,0.539,0.763,0.699,0.642]], [[0.684,0.393], ['L',0.706,0.705]]],
    'b': [[[0.276,0.18], ['L',0.276,0.719]], [[0.285,0.399], ['C',0.878,0.19,0.922,0.854,0.292,0.696]]],
    'c': [[[0.759,0.402], ['C',0.587,0.221,0.255,0.283,0.265,0.515], ['C',0.268,0.755,0.579,0.783,0.71,0.659]]],
    'd': [[[0.682,0.36], ['C',0.089,0.206,0.092,0.882,0.7,0.691]], [[0.716,0.18], ['L',0.716,0.717]]],
    'e': [[[0.246,0.513], ['L',0.697,0.499], ['C',0.787,0.201,0.235,0.243,0.29,0.478], ['C',0.235,0.773,0.573,0.765,0.677,0.7]]],
    'f': [[[0.64,0.12], ['Q',0.47,0.1,0.47,0.3], ['L',0.47,0.71]], [[0.3,0.34], ['L',0.66,0.34]]],
    'g': [[[0.724,0.29], ['C',0.088,0.185,0.089,0.871,0.679,0.682]], [[0.716,0.37], ['L',0.696,0.759], ['C',0.742,0.941,0.479,0.944,0.353,0.92]]],
    'h': [[[0.287,0.183], ['L',0.292,0.713]], [[0.332,0.356], ['C',0.534,0.267,0.76,0.28,0.692,0.488], ['L',0.701,0.719]]],
    'i': [[[0.5,0.35], ['L',0.501,0.72]], [[0.5,0.14], ['L',0.5,0.18]]],
    'j': [[[0.5,0.35], ['L',0.497,0.784], ['C',0.511,0.921,0.38,0.939,0.278,0.898]], [[0.5,0.14], ['L',0.5,0.18]]],
    'k': [[[0.322,0.18], ['L',0.329,0.717]], [[0.675,0.302], ['L',0.31,0.59]], [[0.513,0.445], ['L',0.728,0.732]]],
    'l': [[[0.5,0.18], ['L',0.5,0.719]]],
    'm': [[[0.14,0.393], ['L',0.14,0.719]], [[0.157,0.37], ['C',0.395,0.241,0.559,0.287,0.499,0.526], ['L',0.5,0.719]], [[0.519,0.373], ['C',0.76,0.238,0.859,0.279,0.846,0.52], ['L',0.853,0.719]]],
    'n': [[[0.284,0.39], ['L',0.292,0.726]], [[0.336,0.352], ['C',0.58,0.251,0.721,0.293,0.704,0.482], ['L',0.701,0.719]]],
    'o': [[[0.393,0.324], ['C',0.22,0.334,0.205,0.699,0.448,0.732], ['C',0.787,0.78,0.842,0.334,0.526,0.29]]],
    'p': [[[0.276,0.38], ['L',0.276,0.91]], [[0.33,0.31], ['C',0.898,0.176,0.883,0.917,0.299,0.687]]],
    'q': [[[0.639,0.3], ['C',0.076,0.19,0.1,0.868,0.772,0.734]], [[0.71,0.38], ['L',0.716,0.91]]],
    'r': [[[0.383,0.388], ['L',0.383,0.687]], [[0.385,0.497], ['Q',0.435,0.27,0.68,0.311]]],
    's': [[[0.705,0.384], ['C',0.518,0.204,0.258,0.314,0.308,0.416], ['C',0.32,0.502,0.742,0.531,0.679,0.61], ['C',0.738,0.779,0.368,0.759,0.307,0.675]]],
    't': [[[0.465,0.206], ['L',0.466,0.646], ['Q',0.495,0.749,0.623,0.729]], [[0.295,0.319], ['L',0.66,0.338]]],
    'u': [[[0.289,0.379], ['L',0.302,0.611], ['C',0.25,0.785,0.699,0.746,0.707,0.574]], [[0.703,0.38], ['L',0.708,0.719]]],
    'v': [[[0.311,0.38], ['L',0.499,0.745]], [[0.684,0.382], ['L',0.496,0.737]]],
    'w': [[[0.144,0.397], ['L',0.295,0.736]], [[0.305,0.724], ['L',0.455,0.385]], [[0.549,0.417], ['L',0.69,0.732]], [[0.699,0.731], ['L',0.851,0.388]]],
    'x': [[[0.258,0.295], ['L',0.731,0.73]], [[0.744,0.323], ['L',0.255,0.734]]],
    'y': [[[0.311,0.38], ['L',0.48,0.746]], [[0.678,0.4], ['L',0.431,0.899]]],
    'z': [[[0.261,0.294], ['L',0.701,0.312], ['L',0.25,0.733], ['L',0.769,0.719]]]
  };

  function buildCharBoxes(g, sym, centerX, glyphY, baseFs){
    const s = String(sym || '');
    const chars = [...s];
    if(!chars.length) return [];
    const totalW = g.measureText(s).width;
    const rawWidths = chars.map(c => Math.max(g.measureText(c).width, baseFs * 0.28));
    const sumRaw = rawWidths.reduce((a, b) => a + b, 0);
    const boxTop = glyphY - baseFs * 0.50;

    if(chars.length === 1){
      const boxW = Math.max(totalW, baseFs * 0.85);
      return [{ ch: chars[0], x: centerX - boxW / 2, y: boxTop, w: boxW, h: baseFs }];
    }
    let curX = centerX - totalW / 2;
    const minVisW = baseFs * 0.62;
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

  function drawStrokeOrderOverlay(g, sym, centerX, glyphY, baseFs, clampBox, compact=false, darkBg=false){
    const strokes = getStrokesForSym(g, sym, centerX, glyphY, baseFs);
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
      const mapXY = (nx, ny) => [
        st.box.x + nx * st.box.w,
        st.box.y + ny * st.box.h
      ];
      const p0 = mapXY(segs[0][0], segs[0][1]);

      g.save();
      g.strokeStyle = col;
      g.globalAlpha = darkBg ? 0.94 : 0.85;
      g.lineWidth = compact ? 1.2 : 1.5;
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

      const ang = Math.atan2(tanY, tanX);
      const aLen = compact ? 4.4 : 5.5;
      g.fillStyle = col;
      g.beginPath();
      g.moveTo(curX + Math.cos(ang) * 1.8, curY + Math.sin(ang) * 1.8);
      g.lineTo(curX - aLen * Math.cos(ang - 0.52), curY - aLen * Math.sin(ang - 0.52));
      g.lineTo(curX - aLen * Math.cos(ang + 0.52), curY - aLen * Math.sin(ang + 0.52));
      g.closePath();
      g.fill();

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
      // 頂格：上方可愛插圖徽章＋1~10點點提示，下方放大加粗之標準公版黑色實心示範字
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

      // 下方公版黑色實心示範字（再放大、再加粗，保留最標準字體輪廓）
      const sym = String(item.sym);
      const gapPx = showIllust ? 2 : 3;
      const modelTop = showIllust ? (by + 2 + topH + gapPx) : (by + 2);
      const modelH = Math.max(28, by + bh - modelTop - 2);
      const len = sym.length;
      const baseFs = len >= 3 ? modelH * 0.56 : (len === 2 ? modelH * 0.72 : modelH * 0.88);
      const fontFam = (item.kind === 'abc' || item.kind === 'num')
        ? '"Arial Rounded MT Bold","PingFang TC","Microsoft JhengHei",sans-serif'
        : '"BiauKai","DFKai-SB","標楷體","Noto Sans TC",sans-serif';
      g.font = `900 ${Math.round(baseFs)}px ${fontFam}`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      const gx = bx + bw / 2, gy = modelTop + modelH * 0.52;
      g.save();
      g.fillStyle = '#0f172a';
      g.strokeStyle = '#0f172a';
      g.lineJoin = 'round';
      g.lineWidth = Math.max(1.4, baseFs * 0.045);
      g.strokeText(sym, gx, gy);
      g.fillText(sym, gx, gy);
      g.restore();

      if(len === 1){
        drawStrokeOrderOverlay(g, sym, gx, gy, baseFs, {x: bx + 2, y: modelTop, w: bw - 4, h: modelH}, true, true);
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

      if(rowIdx === 1 || rowIdx === 2){
        drawStrokeOrderOverlay(g, sym, bx + bw / 2, by + bh * 0.53, baseFs, {x: bx + 2, y: by + 2, w: bw - 4, h: bh - 4}, rowIdx === 2, false);
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
