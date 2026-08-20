import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { TiLocationArrow } from "react-icons/ti";
import { RiSearchLine, RiGitBranchLine, RiHistoryLine, RiPaletteLine, RiDeleteBinLine, RiCheckLine } from "react-icons/ri";
import Navbar from "../components/Navbar";
import { buildImageUrl, getCustomCharacters, removeCharacter } from "../lib/characters";

// 内置示例角色：真实文生图直链（失败时回退渐变色块）
const STYLE_ID = {
  赛博朋克: "cyber",
  古风仙侠: "guofeng",
  暗黑都市: "dark",
  科幻未来: "cyber",
  民国谍战: "realistic",
  热血少年: "anime",
};

const BASE_CHARACTERS = [
  { name: "Luna", role: "赛博黑客", style: "赛博朋克", episodes: 12, reuse: 3, version: "v2.4", color: "#d4a0c0", desc: "霓虹都市的幽灵入侵者，擅长网络渗透与物理潜入" },
  { name: "云璃", role: "仙门剑修", style: "古风仙侠", episodes: 8, reuse: 5, version: "v3.1", color: "#8bb8d0", desc: "青云峰首席弟子，剑意通明，心若琉璃" },
  { name: "暗影", role: "都市异能者", style: "暗黑都市", episodes: 5, reuse: 2, version: "v1.8", color: "#6b6b7b", desc: "游走在灰色地带的暗能量掌控者" },
  { name: "星瞳", role: "AI 觉醒体", style: "科幻未来", episodes: 15, reuse: 7, version: "v4.0", color: "#a0c4d4", desc: "首个通过图灵测试的自我意识 AI" },
  { name: "白鹿", role: "民国谍报员", style: "民国谍战", episodes: 6, reuse: 1, version: "v1.2", color: "#c4b8a0", desc: "军统特工，代号白鹿，擅长伪装" },
  { name: "赤焰", role: "火焰异能者", style: "热血少年", episodes: 20, reuse: 4, version: "v2.9", color: "#d4906b", desc: "少年热血，拳套燃烧，永不退缩" },
].map((c) => ({
  ...c,
  filterTag: c.style,
  imageUrl: buildImageUrl(c.desc, STYLE_ID[c.style] || "realistic"),
}));

function BentoTilt({ children, className = "" }) {
  const [s, setS] = useState("");
  const ref = useRef(null);
  const move = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setS(`perspective(800px) rotateX(${((e.clientY - r.top) / r.height - 0.5) * 4}deg) rotateY(${((e.clientX - r.left) / r.width - 0.5) * -4}deg) scale3d(.98,.98,.98)`);
  };
  return <div ref={ref} className={className} onMouseMove={move} onMouseLeave={() => setS("")} style={{ transform: s }}>{children}</div>;
}

/** 有图显图，加载失败降级为渐变色块水印 */
function CharacterVisual({ char, className = "" }) {
  const [failed, setFailed] = useState(false);
  const src = char.image || char.imageUrl;
  if (src && !failed) {
    return (
      <div className={`relative overflow-hidden bg-violet-50 ${className}`}>
        <img src={src} alt={char.name} className="h-full w-full object-cover" onError={() => setFailed(true)} />
      </div>
    );
  }
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ background: `linear-gradient(180deg, ${char.color || "#8B5CF6"}20 0%, ${char.color || "#8B5CF6"}50 50%, ${char.color || "#8B5CF6"}80 100%)` }}
    >
      <span className="text-[12rem] font-black opacity-10 select-none font-brand text-white">{char.name[0]}</span>
    </div>
  );
}

export default function Gallery() {
  const [filter, setFilter] = useState("全部");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [imported, setImported] = useState(false);
  const [custom, setCustom] = useState([]);

  useEffect(() => {
    setCustom(getCustomCharacters());
  }, []);

  // 用户生成的角色优先排在最前面
  const all = [
    ...custom.map((c) => ({ ...c, color: "#8B5CF6", filterTag: c.styleLabel })),
    ...BASE_CHARACTERS,
  ];

  const tags = ["全部", ...Array.from(new Set(all.map((c) => c.filterTag)))];

  const filtered = all.filter((c) => {
    if (filter !== "全部" && c.filterTag !== filter) return false;
    if (search && !c.name.includes(search) && !(c.role || "").includes(search)) return false;
    return true;
  });

  const stats = [
    { icon: RiGitBranchLine, n: all.length, label: "角色总数" },
    { icon: RiHistoryLine, n: 38 + custom.length, label: "版本记录" },
    { icon: RiPaletteLine, n: 22, label: "跨项目复用" },
    { icon: RiSearchLine, n: `${tags.length - 1}种`, label: "风格覆盖" },
  ];

  const handleDelete = (id) => {
    setCustom(removeCharacter(id));
    setSelected(null);
  };

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139, 92, 246, 0.06), transparent), radial-gradient(ellipse 50% 30% at 20% 100%, rgba(124, 108, 240, 0.04), transparent)"
      }} />

      <Navbar />
      <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-24">
        {/* Header */}
        <div className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-glow-pulse" />
          <p className="font-general text-sm uppercase tracking-[.2em] text-violet-600">M2 · 角色资产库</p>
        </div>

        <h1 className="special-font hero-heading text-gray-900" style={{ textShadow: "none" }}>
          角<b>色</b>资<b>产</b>库
        </h1>
        <p className="mt-4 max-w-xl font-circular-web text-lg leading-relaxed text-gray-500">
          版本管理 · 标签分类 · 跨项目复用。每个角色都是可沉淀的数字资产。
        </p>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100/60">
                <s.icon className="h-5 w-5 text-violet-600/70" />
              </div>
              <div>
                <p className="text-2xl font-black font-brand text-gray-900">{s.n}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <p className="mt-10 mb-3 text-right text-[11px] text-gray-400">演示环境 · 数据为示例口径</p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="glass-card relative flex items-center gap-3 rounded-full px-5 py-3 transition-all duration-300 focus-within:border-violet-400/40">
            <RiSearchLine className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索角色名称或类型..."
              className="w-64 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
                  filter === f
                    ? "bg-violet-600 text-white font-semibold shadow-md shadow-violet-500/20"
                    : "glass-card text-gray-400 hover:text-gray-900 hover:border-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Character Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((char) => (
            <BentoTilt key={char.id || char.name} className="glow-border rounded-2xl overflow-hidden bg-white">
              <div
                onClick={() => { setSelected(char); setImported(false); }}
                className="group relative aspect-[4/5] cursor-pointer overflow-hidden"
              >
                <CharacterVisual char={char} className="absolute inset-0 h-full w-full transition-transform duration-200 ease-out group-hover:scale-[1.02]" />

                {/* 真实图上的暗渐变，保证文字可读 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />

                {char.custom && (
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-bold text-white">我的角色</span>
                  </div>
                )}

                {/* Top badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-[10px] text-white/90">{char.version}</span>
                  <span className="rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-[10px] text-white/90">{char.episodes} 集</span>
                </div>

                {/* Content */}
                <div className="absolute bottom-12 left-0 right-0 z-10 p-6">
                  <p className="text-xs tracking-[0.15em] uppercase text-white/60">{char.filterTag}</p>
                  <h3 className="text-3xl font-black text-white mt-1 font-brand">
                    {char.name}
                  </h3>
                  <p className="text-sm text-white/70 mt-0.5">{char.role}</p>
                </div>

                {/* Bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-4 border-t border-white/15 flex justify-between items-center bg-white/90 backdrop-blur-sm">
                  <span className="text-xs text-gray-600">已复用 {char.reuse} 次</span>
                  <span className="text-xs text-violet-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    详情 <TiLocationArrow />
                  </span>
                </div>
              </div>
            </BentoTilt>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-20 text-center py-20 glass-card rounded-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <RiSearchLine className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-circular-web">没有找到匹配的角色</p>
            <p className="text-gray-400 text-sm mt-1">尝试更换关键词或筛选条件</p>
            <Link to="/generate" className="mt-5 inline-flex items-center gap-1 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-bold text-white glow-violet">
              去生成一个 <TiLocationArrow />
            </Link>
          </div>
        )}

        {/* Detail side panel */}
        {selected && (
          <div
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={() => setSelected(null)}
          >
            <div
              className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-gray-200 bg-white p-8"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: "float 0.4s ease-out" }}
            >
              <button
                onClick={() => setSelected(null)}
                className="glass-card mb-6 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-900 transition-colors"
              >
                ✕
              </button>

              <CharacterVisual char={selected} className="aspect-[3/4] w-full rounded-2xl overflow-hidden mb-6" />

              <div className="flex items-center gap-2">
                {selected.custom && (
                  <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold text-violet-600">我的角色</span>
                )}
                <p className="text-xs tracking-[0.15em] uppercase text-violet-600/60">{selected.filterTag}</p>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mt-2 font-brand">{selected.name}</h2>
              <p className="text-base text-gray-500 mt-1">{selected.role}</p>
              <p className="mt-4 text-sm leading-relaxed text-gray-500 font-circular-web">
                {selected.desc || selected.profile?.background}
              </p>

              {selected.profile?.traits && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {selected.profile.traits.map((t) => (
                    <span key={t} className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] text-violet-600">{t}</span>
                  ))}
                </div>
              )}

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="glass-card rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-violet-600 font-brand">{selected.version}</p>
                  <p className="text-[10px] text-gray-500">版本</p>
                </div>
                <div className="glass-card rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-gray-900 font-brand">{selected.episodes}</p>
                  <p className="text-[10px] text-gray-500">集数</p>
                </div>
                <div className="glass-card rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-gray-900 font-brand">{selected.reuse}</p>
                  <p className="text-[10px] text-gray-500">复用</p>
                </div>
              </div>

              {selected.voice && (
                <p className="mt-4 text-xs text-gray-500">声线：<span className="text-gray-800 font-medium">{selected.voice}</span></p>
              )}

              <div className="mt-6 flex gap-3">
                {imported ? (
                  <Link
                    to="/generate"
                    className="flex-1 flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white transition-all"
                  >
                    <RiCheckLine className="h-4 w-4" /> 已选择，去创作
                  </Link>
                ) : (
                  <button
                    onClick={() => setImported(true)}
                    className="flex-1 rounded-full bg-violet-500 px-6 py-3 text-sm font-bold text-white hover:scale-[1.02] glow-violet transition-all duration-300"
                  >
                    导入到新项目 →
                  </button>
                )}
                {selected.custom && (
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="删除角色"
                  >
                    <RiDeleteBinLine className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
