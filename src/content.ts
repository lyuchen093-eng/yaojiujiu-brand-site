import type { BrandCase } from "./types";

const demoCaseDate = "2024-01-01T00:00:00.000Z";

const galleryCounts: Record<string, number> = {
  baobaolu: 16,
  buleide: 17,
  chaye: 18,
  "duanweizhi-ip": 17,
  "jinzhong-youli": 16,
  luoman: 16,
  shangshangce: 18,
  "xiangkou-mianpu": 16,
  xiaochengxu: 6,
  xiaoerliang: 11,
  xunge: 16,
  yaojiujiu: 18,
  "yunqi-zaowu": 11,
};

export const brand = {
  name: "幺玖玖品牌策划",
  tagline: "让品牌先被看懂，再被记住，最后被选择。",
  promise:
    "幺玖玖以品牌策略为起点，整合定位、视觉识别、IP 形象、包装系统、内容传播与落地应用，帮助成长型品牌建立清晰、稳定、可持续的竞争表达。",
  wechat: "Soen_Nov24",
  qr: "/brand/wechat-qr.png",
};

export const strategyPillars = [
  {
    title: "品牌诊断",
    description: "梳理品类、客群、竞争与现有资产，先判断品牌卡在哪里，再决定设计从哪里发力。",
  },
  {
    title: "定位表达",
    description: "把品牌价值转译成一句主张、一套关键词、一组识别线索，让用户快速理解你是谁。",
  },
  {
    title: "视觉系统",
    description: "从 LOGO、色彩、字体、辅助图形到门店/物料/包装，建立可复制的视觉秩序。",
  },
  {
    title: "内容增长",
    description: "把策略变成可拍、可发、可复盘的内容资产，让品牌表达进入真实传播场景。",
  },
];

export const services = [
  {
    title: "品牌策略全案",
    description: "品牌诊断、定位方向、命名口径、价值主张、品牌故事、传播关键词与阶段打法。",
  },
  {
    title: "VI 视觉识别系统",
    description: "LOGO、标准字、标准色、辅助图形、版式规范、应用物料与视觉手册整理。",
  },
  {
    title: "IP 形象与角色系统",
    description: "角色定位、形象设定、表情动作、延展应用，让品牌拥有更亲近的传播载体。",
  },
  {
    title: "包装与产品视觉",
    description: "围绕货架识别、品类联想和购买理由，建立包装结构、画面系统与系列化语言。",
  },
  {
    title: "门店与物料落地",
    description: "菜单、海报、工服、手提袋、杯套、招牌等高频触点统一，提升线下识别效率。",
  },
  {
    title: "内容策划与陪跑",
    description: "把品牌策略拆成短视频、图文、活动和节点传播，用内容持续放大品牌资产。",
  },
];

export const methods = [
  {
    title: "看见问题",
    text: "从品类位置、用户认知、竞品表达和现有视觉资产中找到真正影响成交的阻力。",
  },
  {
    title: "建立主张",
    text: "明确品牌要占据的心智位置，形成可被内部执行、可被外部感知的表达核心。",
  },
  {
    title: "形成系统",
    text: "把策略转化为视觉识别、辅助图形、包装、物料、内容模板和应用规范。",
  },
  {
    title: "投入场景",
    text: "让设计进入门店、货架、小程序、社媒和视频内容，并根据反馈继续迭代。",
  },
];

export const caseCategories = ["餐饮茶饮", "文旅礼品", "科技服务", "IP角色", "品牌自建", "数字产品"];

export const demoCases: BrandCase[] = [
  makeCase({
    id: "baobaolu",
    title: "抱抱鹿",
    client: "抱抱鹿",
    category: "VI 视觉系统",
    industry: "亲子消费",
    serviceType: "品牌识别 / 视觉手册",
    coverImage: "/cases/baobaolu.png",
    summary: "以亲和、陪伴、轻松互动为核心，构建适合亲子消费场景的品牌识别与延展应用。",
  }),
  makeCase({
    id: "buleide",
    title: "布雷德 BLADE",
    client: "布雷德",
    category: "VI 全案",
    industry: "潮流消费",
    serviceType: "品牌策略 / VI 全案",
    coverImage: "/cases/buleide.png",
    summary: "以锋利、速度、能量感为识别方向，建立更具年轻化与视觉冲击力的品牌系统。",
  }),
  makeCase({
    id: "chaye",
    title: "茶野",
    client: "茶野",
    category: "茶饮品牌",
    industry: "茶饮",
    serviceType: "品牌视觉 / 包装延展",
    coverImage: "/cases/chaye.png",
    summary: "围绕自然茶感和日常松弛感，打造茶饮品牌的视觉调性、包装语言与线下物料。",
  }),
  makeCase({
    id: "duanweizhi-ip",
    title: "段位制 IP 人物",
    client: "中国建球段位制",
    category: "IP 角色",
    industry: "体育文化",
    serviceType: "IP 形象 / 视觉识别",
    coverImage: "/cases/duanweizhi-ip.png",
    summary: "将段位体系转译为更易传播的角色形象，提升规则认知、活动传播和社群记忆点。",
  }),
  makeCase({
    id: "jinzhong-youli",
    title: "晋中有礼",
    client: "晋中有礼",
    category: "文旅礼品",
    industry: "城市文创",
    serviceType: "城市礼品 / VI 系统",
    coverImage: "/cases/jinzhong-youli.png",
    summary: "提取地域文化与礼赠场景，构建具有地方识别度的文旅礼品品牌视觉系统。",
  }),
  makeCase({
    id: "luoman",
    title: "洛缦 LOMAN",
    client: "洛缦",
    category: "VI 视觉系统",
    industry: "美学生活",
    serviceType: "品牌识别 / 视觉规范",
    coverImage: "/cases/luoman.png",
    summary: "以柔和、精致、秩序感为基调，为美学生活品牌建立完整 VI 与应用规范。",
  }),
  makeCase({
    id: "shangshangce",
    title: "上上策",
    client: "上上策",
    category: "策略品牌",
    industry: "咨询服务",
    serviceType: "品牌命名 / 视觉识别",
    coverImage: "/cases/shangshangce.png",
    summary: "强化“策略感”和可信度，用更清晰的视觉结构承接咨询服务的专业表达。",
  }),
  makeCase({
    id: "xiangkou-mianpu",
    title: "巷口面铺",
    client: "巷口面铺",
    category: "餐饮品牌",
    industry: "本地餐饮",
    serviceType: "餐饮 VI / 门店物料",
    coverImage: "/cases/xiangkou-mianpu.png",
    summary: "以街巷烟火气和高频用餐场景为核心，建立面铺品牌的门店识别与物料系统。",
  }),
  makeCase({
    id: "xiaochengxu",
    title: "小程序界面系统",
    client: "小程序项目",
    category: "数字产品",
    industry: "线上工具",
    serviceType: "界面视觉 / 产品体验",
    coverImage: "/cases/xiaochengxu.png",
    summary: "围绕用户路径、功能层级和品牌一致性，设计适合移动端转化的小程序界面系统。",
  }),
  makeCase({
    id: "xiaoerliang",
    title: "小二两",
    client: "小二两",
    category: "餐饮品牌",
    industry: "餐饮酒食",
    serviceType: "VI 手册 / 包装物料",
    coverImage: "/cases/xiaoerliang.png",
    summary: "从品牌识别、工服、包装到线下物料，建立小二两更有记忆点的餐饮视觉体系。",
  }),
  makeCase({
    id: "xunge",
    title: "讯格 XUNGRID",
    client: "讯格",
    category: "科技品牌",
    industry: "科技服务",
    serviceType: "科技 VI / 品牌规范",
    coverImage: "/cases/xunge.png",
    summary: "以网格、秩序、连接为视觉线索，为科技服务品牌建立理性且易延展的识别系统。",
  }),
  makeCase({
    id: "yaojiujiu",
    title: "幺玖玖品牌策划",
    client: "幺玖玖",
    category: "品牌自建",
    industry: "品牌策划",
    serviceType: "自有品牌 / 视觉系统",
    coverImage: "/cases/yaojiujiu.png",
    summary: "围绕策略、增长、对话与上升感，建立幺玖玖品牌策划自身的视觉识别和应用系统。",
  }),
  makeCase({
    id: "yunqi-zaowu",
    title: "云栖造物",
    client: "云栖造物",
    category: "文创品牌",
    industry: "东方生活",
    serviceType: "Logo 设计 / 品牌视觉",
    coverImage: "/cases/yunqi-zaowu.png",
    summary: "把东方意境、手作温度与现代品牌识别结合，形成更具文化感的品牌视觉语言。",
  }),
];

function makeCase(input: {
  id: string;
  title: string;
  client: string;
  category: string;
  industry: string;
  serviceType: string;
  coverImage: string;
  summary: string;
}): BrandCase {
  return {
    ...input,
    gallery: makeGallery(input.id, input.coverImage),
    challenge: "项目需要从零散视觉或模糊表达中，提炼出更清晰的品牌认知、场景触点和可持续延展的设计语言。",
    solution:
      "以品牌策略为起点，先明确核心识别方向，再展开 LOGO、色彩、辅助图形、版式、包装/物料/界面等应用系统，让每个触点服务同一个品牌印象。",
    results: ["建立统一视觉识别", "形成可落地应用规范", "提升品牌展示与提案质感"],
    highlights: ["策略先行", "系统化延展", "适合上线展示"],
    videoUrl: "",
    status: "published",
    createdAt: demoCaseDate,
    updatedAt: demoCaseDate,
  };
}

function makeGallery(id: string, coverImage: string) {
  const count = galleryCounts[id] || 0;

  if (!count) {
    return coverImage ? [coverImage] : [];
  }

  return Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return `/cases/gallery/${id}/${number}.png`;
  });
}
