// 真实文生图 API 封装 + 角色资产本地存储
// 闭环：生成（真实图片 + 人设档案）→ 保存入库 → 资产库查看 / 复用

const API_BASE = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image";
const STORE_KEY = "castvault_characters_v1";
const MAX_STORED = 50; // 只存图片直链与文本，体积很小

export const STYLES = {
  realistic: {
    label: "写实",
    en: "photorealistic cinematic character art, realistic skin texture, natural lighting, highly detailed",
  },
  anime: {
    label: "动漫",
    en: "japanese anime style, cel shading, clean line art, vibrant colors, key visual",
  },
  guofeng: {
    label: "国风",
    en: "chinese xianxia fantasy art, flowing hanfu robes, misty mountains, ethereal, ink wash influence",
  },
  cyber: {
    label: "赛博朋克",
    en: "cyberpunk style, neon lights, rainy futuristic city, sci-fi, blade runner atmosphere, cinematic",
  },
  dark: {
    label: "暗黑",
    en: "dark fantasy art, gothic, moody dramatic lighting, deep shadows, painterly",
  },
  fresh: {
    label: "清新",
    en: "soft watercolor illustration, bright pastel colors, dreamy atmosphere, gentle light",
  },
};

const QUALITY_SUFFIX =
  "full body character portrait, standing pose, detailed beautiful face, looking at viewer, plain background";

/** 构造文生图直链（可直接作为 <img src>，无需 fetch，规避跨域限制） */
export function buildImageUrl(prompt, style = "realistic") {
  const styleEn = STYLES[style]?.en ?? STYLES.realistic.en;
  const full = `${prompt}, ${styleEn}, ${QUALITY_SUFFIX}`;
  return `${API_BASE}?prompt=${encodeURIComponent(full)}&image_size=portrait_4_3`;
}

// —— 人设档案生成（本地确定性模板，随 prompt / 风格组合）——
const NAME_POOL = [
  "星澜", "陆辞", "苏鸢", "沈夜", "江离", "白砚",
  "顾朝", "温简", "林霁", "秦霜", "谢云舟", "闻人璟",
  "楚青", "夜珩", "月见", "祁雾",
];

const TRAIT_POOL = [
  ["冷静克制", "观察力极强", "在压力下保持判断力"],
  ["外冷内热", "重承诺", "习惯独自承担风险"],
  ["机敏善辩", "适应力强", "擅长在混乱中找机会"],
  ["沉稳可靠", "计划缜密", "对细节有近乎偏执的要求"],
  ["桀骜不驯", "直觉敏锐", "关键时刻总能打破僵局"],
  ["温柔坚定", "共情力强", "善于凝聚人心"],
];

const VOICE_BY_STYLE = {
  realistic: "沉稳中音 · 语速适中",
  anime: "清亮少年音 · 富有张力",
  guofeng: "温润古风音 · 吐字从容",
  cyber: "冷感电子音 · 带轻微混响",
  dark: "低沉磁性 · 气声偏多",
  fresh: "明亮治愈 · 节奏轻快",
};

function pick(arr, seed) {
  return arr[Math.abs(seed) % arr.length];
}

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h;
}

/** 组装角色三件套（立绘直链 + 档案 + 声线）；图片加载状态由页面通过 <img onLoad> 感知 */
export function buildCharacter({ prompt, style = "realistic" }) {
  const seed = hashSeed(prompt + style + Date.now());
  const traits = pick(TRAIT_POOL, seed);
  const name = pick(NAME_POOL, seed);
  const styleLabel = STYLES[style]?.label ?? "写实";

  return {
    id: `c_${Date.now()}`,
    name,
    role: prompt.length > 12 ? `${prompt.slice(0, 12)}…` : prompt,
    style,
    styleLabel,
    prompt,
    imageUrl: buildImageUrl(prompt, style),
    profile: {
      traits,
      background: `基于「${prompt}」生成的${styleLabel}风格角色。可用于短剧分镜、角色立绘与跨场景一致性创作。`,
    },
    voice: VOICE_BY_STYLE[style] ?? VOICE_BY_STYLE.realistic,
    episodes: 0,
    reuse: 0,
    version: "v1.0",
    custom: true,
    createdAt: Date.now(),
  };
}

// —— 本地资产库 ——
export function getCustomCharacters() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCharacter(character) {
  const list = getCustomCharacters().filter((c) => c.id !== character.id);
  const next = [character, ...list].slice(0, MAX_STORED);
  localStorage.setItem(STORE_KEY, JSON.stringify(next));
  return next;
}

export function removeCharacter(id) {
  const next = getCustomCharacters().filter((c) => c.id !== id);
  localStorage.setItem(STORE_KEY, JSON.stringify(next));
  return next;
}
