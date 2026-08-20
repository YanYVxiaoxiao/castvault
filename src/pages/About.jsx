import { TiLocationArrow } from "react-icons/ti";
import { RiFocus3Line, RiTeamLine, RiLightbulbLine, RiToolsLine } from "react-icons/ri";
import Navbar from "../components/Navbar";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const TIMELINE = [
  { phase: "M1", title: "AI 角色生成引擎", desc: "文字描述 → 立绘 + 人设 + 声音，60秒出三件套", status: "已完成" },
  { phase: "M2", title: "角色资产库", desc: "版本管理 · 标签分类 · 跨项目复用，角色即资产", status: "已完成" },
  { phase: "M3", title: "一致性保持系统", desc: "LoRA + IP-Adapter，确保角色跨场景外观一致", status: "已完成" },
  { phase: "M4", title: "短剧编排引擎", desc: "角色 + 剧本 → 自动分镜 → 多集连拍", status: "规划中" },
];

const VALUES = [
  { icon: RiFocus3Line, title: "角色即资产", desc: "每个 AI 生成的角色都有版本、标签、复用记录，像代码一样管理" },
  { icon: RiLightbulbLine, title: "创意无门槛", desc: "从创意到完整角色不超过 60 秒，让创作者专注故事而非技术" },
  { icon: RiToolsLine, title: "工程化交付", desc: "不是玩具，是短剧生产流水线，从生成到管理到一致性全覆盖" },
];

export default function About() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-transparent">
      <div className="pointer-events-none fixed inset-0" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139, 92, 246, 0.06), transparent), radial-gradient(ellipse 50% 30% at 20% 100%, rgba(124, 108, 240, 0.04), transparent)"
      }} />

      <Navbar />

      {/* Hero */}
      <div className="relative mx-auto max-w-5xl px-6 pt-40 pb-20 text-center">
        <div className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-glow-pulse" />
          <p className="font-general text-sm uppercase tracking-[.2em] text-violet-600">关于 CastVault</p>
        </div>

        <h1 className="special-font hero-heading text-gray-900">
          AI 短剧角<b>色</b><br />IP 资产平<b>台</b>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl font-circular-web text-lg leading-relaxed text-gray-500">
          CastVault 解决 AI 短剧生产的核心痛点：角色不一致。生成、管理、保持一致性——
          一站式搞定，让创作者从「写提示词」升级为「运营角色 IP」。
        </p>

        {/* Stats row */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {[
            { n: "4", label: "核心模块" },
            { n: "60s", label: "生成耗时" },
            { n: "98%", label: "一致性通过率" },
            { n: "6+", label: "风格覆盖" },
          ].map((s, i) => (
            <div key={i} className="glass-card rounded-2xl px-6 py-4 text-center min-w-[100px]">
              <p className="text-3xl font-black font-brand text-violet-600">{s.n}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative mx-auto max-w-4xl px-6 py-20">
        <p className="mb-12 text-xs uppercase tracking-[0.15em] text-gray-400 text-center">产品演进路线</p>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-violet-300/30 via-violet-300/10 to-transparent" />

          {TIMELINE.map((item, i) => (
            <div key={i} className={`relative flex items-center gap-6 mb-8 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
              {/* Node */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  item.status === "已完成"
                    ? "border-violet-500 bg-violet-100/60 glow-violet"
                    : "border-gray-300 bg-white"
                }`}>
                  <span className="text-xs font-black font-brand text-gray-600">{item.phase}</span>
                </div>
              </div>

              {/* Card */}
              <div className={`glass-card rounded-2xl p-6 w-[calc(50%-3rem)] ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                <div className={`flex items-center gap-2 mb-3 ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                  {item.status === "已完成" && (
                    <span className="glass-card rounded-full px-2.5 py-0.5 text-[10px] text-violet-600/70">已完成</span>
                  )}
                  {item.status === "规划中" && (
                    <span className="glass-card rounded-full px-2.5 py-0.5 text-[10px] text-gray-400">规划中</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 font-brand">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed font-circular-web">{item.desc}</p>
              </div>

              {/* Spacer */}
              <div className="w-[calc(50%-3rem)]" />
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="relative mx-auto max-w-5xl px-6 py-20">
        <p className="mb-12 text-xs uppercase tracking-[0.15em] text-gray-400 text-center">核心设计理念</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <div key={i} className="glass-card group rounded-2xl p-8 transition-all duration-300 hover:border-violet-500/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100/60 mb-4 transition-all duration-300 group-hover:bg-violet-100">
                <v.icon className="h-6 w-6 text-violet-600/70" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 font-brand">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500 font-circular-web">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Character matrix */}
      <div className="relative mx-auto max-w-5xl px-6 py-20">
        <p className="mb-8 text-xs uppercase tracking-[0.15em] text-gray-400 text-center">角色矩阵</p>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {["Luna", "云璃", "暗影", "星瞳", "白鹿", "赤焰"].map((name, i) => {
            const colors = ["#d4a0c0", "#8bb8d0", "#6b6b7b", "#a0c4d4", "#c4b8a0", "#d4906b"];
            return (
              <div key={i} className="glass-card group rounded-2xl aspect-[3/4] flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:border-violet-500/30" style={{
                background: `linear-gradient(180deg, ${colors[i]}10 0%, ${colors[i]}30 100%)`
              }}>
                <span className="text-4xl font-black opacity-10 font-brand text-gray-900 group-hover:opacity-20 transition-opacity duration-300">
                  {name[0]}
                </span>
                <span className="text-xs text-gray-600 font-brand">{name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Contact />
      <Footer />
    </main>
  );
}
