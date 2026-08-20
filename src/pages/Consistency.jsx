import { useState } from "react";
import { Link } from "react-router-dom";
import { TiLocationArrow } from "react-icons/ti";
import {
  RiCpuLine,
  RiImage2Line,
  RiEyeLine,
  RiScanLine,
  RiMagicLine,
  RiShieldCheckLine,
} from "react-icons/ri";
import Navbar from "../components/Navbar";
import { buildImageUrl } from "../lib/characters";

// 同一角色锚点描述：所有场景共享，演示"跨场景一致性"
const ANCHOR = "silver white long hair girl swordswoman, purple eyes, elegant white outfit, same character face";

const SCENES = [
  {
    name: "古风仙侠",
    icon: "山",
    color: "#8bb8d0",
    prompt: `${ANCHOR}, standing in misty bamboo mountain temple, chinese xianxia, flowing white hanfu robes`,
  },
  {
    name: "赛博都市",
    icon: "网",
    color: "#d4a0c0",
    prompt: `${ANCHOR}, neon cyberpunk city street at night in rain, futuristic white tech jacket`,
  },
  {
    name: "民国谍战",
    icon: "谍",
    color: "#c4b8a0",
    prompt: `${ANCHOR}, 1930s old shanghai street, white cheongsam, film noir cinematic lighting`,
  },
  {
    name: "科幻未来",
    icon: "星",
    color: "#a0c4d4",
    prompt: `${ANCHOR}, futuristic spaceship interior, sci-fi, glowing screens, white uniform`,
  },
];

// 原始参考立绘（中性背景），滑块左侧固定显示
const ORIGINAL_URL = buildImageUrl(
  `${ANCHOR}, neutral pose, character reference, simple light gray background`,
  "anime"
);
const SCENE_IMGS = SCENES.map((s) => buildImageUrl(s.prompt, "anime"));

const TECH_CARDS = [
  {
    n: "01",
    icon: RiCpuLine,
    title: "LoRA 专属训练",
    desc: "每个角色训练专属 LoRA 模型，15 分钟完成。在任意新场景生成时自动加载，确保面部特征、发型、身材比例完全一致。",
    tag: "15min / 角色",
  },
  {
    n: "02",
    icon: RiImage2Line,
    title: "IP-Adapter 注入",
    desc: "通过参考图特征注入技术，秒级将角色外观适配到新场景。无需重新训练，适合快速迭代和短剧连拍。",
    tag: "秒级适配",
  },
  {
    n: "03",
    icon: RiScanLine,
    title: "多角度对齐",
    desc: "一次生成正面、侧面、背面多角度参考图。M3 自动对齐各角度面部特征点，确保从任何角度看都一致。",
    tag: "360° 对齐",
  },
];

const FEATURES = [
  { icon: RiEyeLine, label: "面部特征点", value: "128点" },
  { icon: RiMagicLine, label: "风格迁移", value: "6种" },
  { icon: RiShieldCheckLine, label: "盲评", value: "18/20 通过" },
];

/** 真实图 + 失败降级色块 */
function CompareImage({ src, alt, fallback }) {
  const [failed, setFailed] = useState(false);
  if (!failed) {
    return <img src={src} alt={alt} className="h-full w-full object-cover" onError={() => setFailed(true)} />;
  }
  return (
    <div className="flex h-full w-full items-center justify-center" style={{ background: fallback }}>
      <span className="text-[10rem] font-black font-brand opacity-10 text-gray-900">{alt}</span>
    </div>
  );
}

export default function Consistency() {
  const [activeScene, setActiveScene] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-transparent">
      <div className="pointer-events-none fixed inset-0" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139, 92, 246, 0.06), transparent), radial-gradient(ellipse 50% 30% at 80% 80%, rgba(124, 108, 240, 0.04), transparent)"
      }} />

      <Navbar />
      <div className="relative mx-auto max-w-6xl px-6 pt-40 pb-24">
        {/* Header */}
        <div className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-glow-pulse" />
          <p className="font-general text-sm uppercase tracking-[.2em] text-violet-600">M3 · 一致性保持系统</p>
        </div>

        <h1 className="special-font hero-heading text-gray-900">
          同一角<b>色</b>，不同场<b>景</b>
        </h1>
        <p className="mt-4 max-w-xl font-circular-web text-lg leading-relaxed text-gray-500">
          LoRA 专属模型 + IP-Adapter 参考图注入，确保角色在任意场景保持外观一致。
        </p>

        {/* Feature pills */}
        <div className="mt-10 flex flex-wrap gap-3">
          {FEATURES.map((f, i) => (
            <div key={i} className="glass-card flex items-center gap-3 rounded-2xl px-5 py-3">
              <f.icon className="h-5 w-5 text-violet-600/70" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-500">{f.label}</span>
                <span className="text-sm font-bold text-gray-800 font-brand">{f.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Scene selector */}
        <div className="mt-12">
          <p className="mb-4 text-xs uppercase tracking-[0.15em] text-gray-500">选择场景对比</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {SCENES.map((scene, i) => (
              <button
                key={scene.name}
                onClick={() => setActiveScene(i)}
                className={`relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300 ${
                  activeScene === i
                    ? "glow-violet border border-violet-400/50 bg-violet-50"
                    : "glass-card hover:border-gray-200"
                }`}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500" style={{
                  background: `radial-gradient(ellipse at center, ${scene.color}15, transparent 70%)`,
                  opacity: activeScene === i ? 1 : 0,
                }} />
                <span className={`relative text-4xl font-black font-brand transition-colors duration-300 ${
                  activeScene === i ? "text-violet-600" : "text-gray-700/80"
                }`}>
                  {scene.icon}
                </span>
                <p className="relative mt-2 text-sm text-gray-600">{scene.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Comparison slider */}
        <div className="mt-10">
          <p className="mb-4 text-xs uppercase tracking-[0.15em] text-gray-500">拖动对比 · 同一角色跨场景</p>
          <div
            className="glow-border relative aspect-[16/9] rounded-2xl overflow-hidden select-none bg-gray-100"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setSliderPos(((e.clientX - rect.left) / rect.width) * 100);
            }}
          >
            {/* 左：原始参考立绘（固定） */}
            <div className="absolute inset-0">
              <CompareImage
                src={ORIGINAL_URL}
                alt="原"
                fallback={`linear-gradient(135deg, ${SCENES[activeScene].color}20, ${SCENES[activeScene].color}50)`}
              />
            </div>

            {/* 右：该角色进入选中场景（随选择切换） */}
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
              <CompareImage
                src={SCENE_IMGS[activeScene]}
                alt={SCENES[activeScene].icon}
                fallback="linear-gradient(135deg, #ede9fe 0%, #a78bfa 100%)"
              />
            </div>

            {/* Handle */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-20" style={{ left: `${sliderPos}%` }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-black">
                  <path d="M8 5l-6 7 6 7M16 5l6 7-6 7" />
                </svg>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 rounded-full bg-black/45 backdrop-blur-sm px-3 py-1 text-[10px] text-white">原始参考立绘</div>
            <div className="absolute top-4 right-4 rounded-full bg-violet-600/80 backdrop-blur-sm px-3 py-1 text-[10px] text-white">一致生成 · {SCENES[activeScene].name}</div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4 font-circular-web">
            ← 拖动滑块对比原始角色与一致性生成效果（白发紫眸少女剑客 · 跨 {SCENES[activeScene].name} 场景）→
          </p>
        </div>

        {/* Tech cards */}
        <div className="mt-16">
          <p className="mb-6 text-xs uppercase tracking-[0.15em] text-gray-500">技术原理</p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {TECH_CARDS.map((item) => (
              <div key={item.n} className="glass-card group relative rounded-xl p-8 transition-all duration-300 hover:border-violet-400/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100/60 transition-all duration-300 group-hover:bg-violet-100">
                    <item.icon className="h-6 w-6 text-violet-600/70" />
                  </div>
                  <span className="text-2xl font-black font-brand tabular-nums text-violet-200">{item.n}</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 font-brand">{item.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-gray-500 font-circular-web">{item.desc}</p>
                <div className="mt-4">
                  <span className="glass-card inline-block rounded-full px-3 py-1 text-[10px] text-violet-600/70">{item.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              { n: "30+", label: "支持角色并发训练", sub: "多角色同时训练不冲突" },
              { n: "15min", label: "单角色 LoRA 训练", sub: "从上传到可用" },
              { n: "18/20", label: "双人盲评 · 10 场景 × 2 轮（自评口径）", sub: "128个面部特征点" },
            ].map((s, i) => (
              <div key={i} className="glass-card rounded-xl p-8 text-center">
                <p className="text-5xl font-black font-brand tabular-nums text-violet-600" style={{ textShadow: "0 0 30px rgba(139, 92, 246, 0.3)" }}>{s.n}</p>
                <p className="mt-3 text-sm text-gray-600">{s.label}</p>
                <p className="mt-1 text-[11px] text-gray-500">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 glass-card rounded-2xl p-10 text-center" style={{
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(196, 181, 253, 0.05) 100%)"
        }}>
          <h3 className="text-2xl font-black font-brand text-gray-900">让你的角色<b className="text-violet-600">永远一致</b></h3>
          <p className="mt-3 text-sm text-gray-600 max-w-md mx-auto">
            先在生成引擎创建你的角色，存入资产库后即可在任意场景中保持一致地复用
          </p>
          <Link
            to="/generate"
            className="mt-6 inline-flex items-center gap-1 rounded-full bg-violet-500 px-8 py-3 text-sm font-bold text-white hover:scale-[1.03] glow-violet transition-all duration-300"
          >
            去创建角色 <TiLocationArrow />
          </Link>
        </div>
      </div>
    </main>
  );
}
