// src/utils/giftDatabase.js

// 标签翻译：
// "职场安全": "给老师/上级留好印象"
// "安慰打气": "安慰打气"
// "kpop": "kpop"
// "二次元": "二次元"
// "咖啡": "咖啡"
// "熬夜自救": "熬夜自救"
// "通用": (通用礼物)

export const allGifts = [
  {
    id: "g1",
    name: "高质茶包/咖啡礼盒 (TWG, etc.)",
    priceText: "约￥100-200", // 保留文字用于显示
    minPrice: 100,
    maxPrice: 200,
    badge: "💼 职场安全",
    why: "稳妥、不越界、显得细心但不拍马屁。",
    risk: "⚠️ 避免太私人的东西(香水/围巾)。",
    cardNote:
      "这段时间多亏您照顾。希望这点小东西能让您休息的时候更舒服一些。",
    tags: ["职场安全", "咖啡"],
    tabooTags: [], // 雷区标签
  },
  {
    id: "g2",
    name: "保温杯(黑/银/深绿等低调色)",
    priceText: "约￥80-150",
    minPrice: 80,
    maxPrice: 150,
    badge: "💼 职场安全",
    why: "办公常用，显关心健康，但不暧昧。",
    risk: "⚠️ 不要粉色卡通款，避免误会。",
    cardNote:
      "工作真的辛苦了，想让你（您）喝到热的/别总喝冰的。注意身体～",
    tags: ["职场安全", "通用"],
    tabooTags: ["粉色"], // 牢高的雷区
  },
  {
    id: "g3",
    name: "蒸汽眼罩 / 颈肩热敷包套装",
    priceText: "约￥40-80",
    minPrice: 40,
    maxPrice: 80,
    badge: "💗 走心不暧昧",
    why: "表达‘我在关心你的疲劳’，但不会像口红那样暧昧到尴尬。",
    risk: "⚠️ 如果只是普通朋友，卡片别太暧昧就好。",
    cardNote:
      "别熬太晚啦。这是熬夜急救包，下次累了用一下，别硬扛～",
    tags: ["安慰打气", "熬夜自救", "通用"],
    tabooTags: [],
  },
  {
    id: "g4",
    name: "动漫角色联名挂件/摆件",
    priceText: "约￥80-150",
    minPrice: 80,
    maxPrice: 150,
    badge: "🎯 精准狙击",
    why: "如果对方是二次元，送这个会非常惊喜。表明你真的了解ta的爱好。",
    risk: "⚠️ 一定要搞清楚对方到底喜欢哪个角色！",
    cardNote:
      "锵锵！猜我发现了什么好东西～ 希望你喜欢这个！",
    tags: ["二次元", "通用"],
    tabooTags: [],
  },
  {
    id: "g5",
    name: "偶像/KPOP组合新专辑或周边",
    priceText: "约￥100-200",
    minPrice: 100,
    maxPrice: 200,
    badge: "🎯 精准狙击",
    why: "追星女孩/男孩的刚需，送这个绝对没错。",
    risk: "⚠️ 确保你知道ta喜欢的是哪个组合/偶像。",
    cardNote:
      "上次听你说起，就记下啦。希望你（的偶像）走花路！",
    tags: ["kpop"],
    tabooTags: [],
  },
  {
    id: "g6",
    name: "手冲咖啡入门套装",
    priceText: "约￥150-300",
    minPrice: 150,
    maxPrice: 300,
    badge: "☕️ 提升品位",
    why: "适合喜欢咖啡、追求生活品质的朋友。",
    risk: "⚠️ 如果对方只是随便喝喝速溶，可能get不到。",
    cardNote:
      "希望这个小套装能给你忙碌的早晨带来一点点仪式感和好心情～",
    tags: ["咖啡", "通用"],
    tabooTags: [],
  },
  {
    id: "g7", // 新增一个用于测试雷区的礼物
    name: "中性香水 (如 祖玛珑 蓝风铃)",
    priceText: "约￥300-600",
    minPrice: 300,
    maxPrice: 600,
    badge: "✨ 品质之选",
    why: "中性香水不容易出错，适合表达心意。",
    risk: "⚠️ 对方是‘牢高’，她不T-T香水味重。",
    cardNote: "希望这个味道能给你带来好心情。",
    tags: ["通用", "安慰打气"],
    tabooTags: ["香水"], // 牢高的雷区
  }
];