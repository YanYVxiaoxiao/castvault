import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TiLocationArrow } from "react-icons/ti";
import { RiSparkling2Line, RiImageLine, RiFileTextLine, RiMicLine, RiCheckLine, RiFolderDownloadLine } from "react-icons/ri";
import Navbar from "../components/Navbar";
import { STYLES, buildCharacter, saveCharacter, getCustomCharacters } from "../lib/characters";

const STYLE_LIST = Object.entries(STYLES).map(([id, v]) => ({ id, label: v.label, desc: "" }));

const STYLE_DESCS = {
  realistic: "真实感立绘",
  anime: "日系动漫画风",
  guofeng: "中国古风仙侠",
  cyber: "霓虹废土未来",
  dark: "哥特暗黑系",
  fresh: "明亮水彩感",
};

const QUICK_PROMPTS = [
  "冷艳女杀手，黑色风衣，雨夜都市",
  "少年剑客，白衣胜雪，竹林清风",
  "赛博格少女，霓虹义眼，废土世界",
  "民国女谍报员，旗袍，老上海洋房",
  "火焰异能者，赤发，燃烧的拳套",
];

export default function Generate() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [saved, setSaved] = useState(false);
  const [recent, setRecent] = useState([]);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    setRecent(getCustomCharacters());
  }, []);

  const handleGenerate = () => {
    if (!prompt.trim() || status === "loading") return;
    setSaved(false);
    setErrorMsg("");
    setIsFallback(false);
    // 档案/声线本地立即生成；立绘通过 <img onLoad> 感知真实出图
    setResult(buildCharacter({ prompt: prompt.trim(), style }));
    setStatus("loading");
  };

  const handleImageLoaded = () => setStatus("done");
  const handleImageError = () => {
    if (result?.fallbackUrl && !isFallback) {
      setIsFallback(true);
      setStatus("done");
      return;
    }
    setStatus("error");
    setErrorMsg("图像服务暂时不可用");
  };

  const handleSave = () => {
    if (!result) return;
    saveCharacter(isFallback ? { ...result, imageUrl: result.fallbackUrl } : result);
    setSaved(true);
    setRecent(getCustomCharacters());
  };

  const steps = [
    { icon: RiFileTextLine, label: "描述角色", hint: "输入文字提示词", active: true },
    { icon: RiImageLine, label: "选择风格", hint: "指定视觉风格", active: true },
    {
      icon: RiSparkling2Line,
      label: "生成三件套",
      hint: "立绘+档案+声线",
      active: status === "loading" || status === "done",
    },
  ];

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139, 92, 246, 0.04), transparent), radial-gradient(ellipse 50% 30% at 80% 100%, rgba(232, 212, 77, 0.02), transparent)"
      }} />

      <Navbar />
      <div className="relative mx-auto max-w-6xl px-6 pt-40 pb-24">
        {/* Header */}
        <div className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-600 animate-glow-pulse" />
          <p className="font-general text-sm uppercase tracking-[.2em] text-violet-600">M1 · AI 角色生成引擎</p>
        </div>

        <h1 className="special-font hero-heading text-gray-900">
          描<b>述</b>你心中的角<b>色</b>
        </h1>
        <p className="mt-6 max-w-xl font-circular-web text-lg leading-relaxed text-gray-500">
          立绘 + 人设档案 + 声线设定，AI 三件套一起出。满意后一键存入资产库。
        </p>

        {/* Step indicators */}
        <div className="mt-14 flex items-center gap-2 md:gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-1 items-center gap-3">
              <div className={`glass-card flex items-center gap-3 rounded-2xl px-4 py-3 flex-1 transition-all duration-300 ${
                step.active ? "border-violet-300/60" : ""
              }`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  step.active ? "bg-violet-100" : "bg-gray-100"
                }`}>
                  <step.icon className={`h-4 w-4 ${step.active ? "text-violet-600" : "text-gray-400"}`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">Step {i + 1}</span>
                  <span className={`text-sm font-medium ${step.active ? "text-gray-800" : "text-gray-500"}`}>{step.label}</span>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="h-px w-4 md:w-8 bg-gradient-to-r from-violet-300/30 to-violet-300/10 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Prompt input */}
        <div className="mt-10">
          <div className="glass-card group relative rounded-2xl p-1 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-focus-within:opacity-100" style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.05), transparent 70%)"
            }} />
            <div className="relative flex items-center gap-3 px-5 py-4">
              <RiSparkling2Line className="h-5 w-5 shrink-0 text-violet-600/60" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="描述你想要的角色形象、风格、气质..."
                className="flex-1 bg-transparent text-lg text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || status === "loading"}
                className={`shrink-0 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
                  prompt.trim() && status !== "loading"
                    ? "bg-yellow-300 text-black hover:scale-[1.03] glow-yellow"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {status === "loading" ? "生成中…" : "生成 →"}
              </button>
            </div>
          </div>

          {/* Quick prompts */}
          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                onClick={() => setPrompt(q)}
                className="glass-card text-xs text-gray-500 rounded-full px-4 py-1.5 transition-all duration-300 hover:text-violet-600 hover:border-violet-300/50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Style selector */}
        <div className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-500">选择风格</p>
            <p className="text-xs text-gray-400">选中: {STYLE_DESCS[style]}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {STYLE_LIST.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 ${
                  style === s.id
                    ? "glow-violet border border-violet-400/50 bg-violet-50"
                    : "glass-card hover:border-gray-200"
                }`}
              >
                {style === s.id && (
                  <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-violet-600 animate-glow-pulse" />
                )}
                <p className="text-sm font-bold text-gray-900/90 font-brand">{s.label}</p>
                <p className="mt-1 text-[10px] text-gray-500">{STYLE_DESCS[s.id]}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Result area */}
        <div className="mt-16">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-500">生成预览</p>
            {status === "done" && (
              saved ? (
                <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600">
                  <RiCheckLine className="h-3.5 w-3.5" /> 已存入资产库
                  <Link to="/gallery" className="ml-1 underline underline-offset-2 hover:text-green-700">
                    去看看 <TiLocationArrow className="inline h-3 w-3" />
                  </Link>
                </span>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-xs font-bold text-white transition-all hover:scale-[1.03] glow-violet"
                >
                  <RiFolderDownloadLine className="h-3.5 w-3.5" /> 保存到资产库
                </button>
              )
            )}
          </div>

          {status === "error" && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {errorMsg}。请检查网络后重试。
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* 立绘 */}
            <div className="glass-card relative aspect-[3/4] overflow-hidden rounded-2xl">
              {status === "idle" && (
                <div className="flex h-full flex-col items-center justify-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50">
                    <RiImageLine className="h-5 w-5 text-violet-600/40" />
                  </div>
                  <span className="text-sm text-gray-500">立绘生成</span>
                  <span className="text-[10px] text-gray-400">输入描述后出图</span>
                </div>
              )}
              {result && (
                <>
                  <img
                    src={isFallback ? result.fallbackUrl : result.imageUrl}
                    alt={result.name}
                    onLoad={handleImageLoaded}
                    onError={handleImageError}
                    className="h-full w-full object-cover"
                  />
                  {status === "loading" && (
                    <div className="absolute inset-0 z-10 flex h-full flex-col items-center justify-center gap-3 bg-white/85 backdrop-blur-sm">
                      <div className="three-body"><div className="three-body__dot" /><div className="three-body__dot" /><div className="three-body__dot" /></div>
                      <span className="text-xs text-violet-600/70">AI 正在绘制…</span>
                    </div>
                  )}
                </>
              )}
            </div>
            {isFallback && (
              <p className="mt-2 text-[10px] text-gray-400">演示样本 · 真实生成需平台鉴权</p>
            )}

            {/* 人设档案 */}
            <div className="glass-card relative aspect-[3/4] rounded-2xl p-5">
              {result ? (
                <div className="flex h-full flex-col gap-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-violet-500">Character Profile</p>
                  <h3 className="text-2xl font-black font-brand text-gray-900">{result.name}</h3>
                  <p className="text-xs text-gray-500">{result.styleLabel}风格 · {result.version}</p>
                  <div className="mt-1">
                    <p className="mb-1.5 text-[10px] uppercase tracking-wider text-gray-400">性格特征</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.profile.traits.map((t) => (
                        <span key={t} className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] text-violet-600">{t}</span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-500">{result.profile.background}</p>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50">
                    <RiFileTextLine className="h-5 w-5 text-violet-600/40" />
                  </div>
                  <span className="text-sm text-gray-500">人设档案</span>
                  <span className="text-[10px] text-gray-400">性格 · 背景自动生成</span>
                </div>
              )}
            </div>

            {/* 声线设定 */}
            <div className="glass-card relative aspect-[3/4] rounded-2xl p-5">
              {result ? (
                <div className="flex h-full flex-col gap-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-violet-500">Voice Design</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100">
                      <RiMicLine className="h-5 w-5 text-violet-600" />
                    </div>
                    <p className="text-sm font-bold text-gray-800">{result.voice}</p>
                  </div>
                  {/* 声纹装饰 */}
                  <div className="flex h-14 items-end gap-1">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full bg-violet-300/60"
                        style={{ height: `${20 + Math.abs(Math.sin(i * 1.7 + result.name.length)) * 80}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] leading-relaxed text-gray-400">
                    声线设定卡 · 用于 TTS 配音时的音色参考
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50">
                    <RiMicLine className="h-5 w-5 text-violet-600/40" />
                  </div>
                  <span className="text-sm text-gray-500">声线设定</span>
                  <span className="text-[10px] text-gray-400">专属声线参考</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent generations */}
        <div className="mt-16">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-500">最近生成</p>
            <Link to="/gallery" className="text-xs text-violet-600/70 hover:text-violet-600 transition-colors flex items-center gap-1">
              查看全部 <TiLocationArrow className="h-3 w-3" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="glass-card rounded-2xl px-6 py-10 text-center">
              <p className="text-sm text-gray-400">还没有保存的角色，生成第一个试试 →</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {recent.slice(0, 4).map((c) => (
                <Link key={c.id} to="/gallery" className="glass-card group rounded-2xl overflow-hidden transition-all duration-300 hover:border-violet-300/40">
                  <div className="aspect-square overflow-hidden bg-violet-50">
                    <img src={c.imageUrl} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold text-gray-800 font-brand">{c.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{c.styleLabel}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
