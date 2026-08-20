import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { TiLocationArrow } from "react-icons/ti";

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 4;
    const tiltY = (relativeX - 0.5) * -4;

    const newTransform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.98, .98, .98)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({ src, title, description, isComingSoon }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();

    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  return (
    <div className="relative size-full">
      <video
        src={src}
        loop
        muted
        autoPlay
        className="absolute left-0 top-0 size-full object-cover object-center"
      />
      <div className="gradient-overlay absolute inset-0 z-[5] pointer-events-none" />
      <div className="relative z-10 flex size-full flex-col justify-between p-6 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-sm leading-relaxed text-blue-50/70">{description}</p>
          )}
        </div>

        {isComingSoon && (
          <Link
            ref={hoverButtonRef}
            to="/gallery"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative flex w-fit cursor-pointer items-center gap-1.5 overflow-hidden rounded-full px-5 py-2 text-xs uppercase text-white/60 transition-colors duration-300 hover:text-white"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(120px circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(139, 92, 246, 0.4), transparent)`,
              }}
            />
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">进入资产库</p>
          </Link>
        )}
      </div>
    </div>
  );
};

const Features = () => (
  <section id="gallery" className="bg-black pb-52">
    <div className="container mx-auto px-3 md:px-10">
      <div className="px-5 py-32">
        <p className="font-circular-web text-lg text-blue-50/90">
          M2 · 角色资产库
        </p>
        <p className="mt-2 max-w-md font-circular-web text-lg text-blue-50/40 leading-relaxed">
          版本管理 · 标签分类 · 跨项目复用。角色像代码一样有版本号，
          像素材一样可检索，像资产一样可沉淀。
        </p>
      </div>

      <BentoTilt className="glow-border border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-2xl md:h-[65vh]">
        <BentoCard
          src="videos/feature-1.mp4"
          title={
            <>
              角<b>色</b>库
            </>
          }
          description="AI 生成的短剧角色资产库，每个角色独立版本记录，一键导入新项目。"
          isComingSoon
        />
      </BentoTilt>

      <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
        <BentoTilt className="glow-border bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
          <BentoCard
            src="videos/feature-2.mp4"
            title={
              <>
                L<b>u</b>na
              </>
            }
            description="赛博朋克黑客角色 · 12 集短剧作品 · 已跨项目复用 3 次"
            isComingSoon
          />
        </BentoTilt>

        <BentoTilt className="glow-border bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
          <BentoCard
            src="videos/feature-3.mp4"
            title={
              <>
                云<b>璃</b>
              </>
            }
            description="古风仙侠剑修 · 8 集作品 · AI 多角度面部一致"
            isComingSoon
          />
        </BentoTilt>

        <BentoTilt className="glow-border bento-tilt_1 me-14 md:col-span-1 md:me-0">
          <BentoCard
            src="videos/feature-4.mp4"
            title={
              <>
                星<b>瞳</b>
              </>
            }
            description="科幻 AI 觉醒角色 · 15 集作品 · LoRA 专属模型训练"
            isComingSoon
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_2">
          <Link
            to="/gallery"
            className="glow-violet relative flex size-full flex-col justify-between rounded-2xl p-6"
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #4C1D95 100%)" }}
          >
            <div className="absolute inset-0 rounded-2xl bg-black/20" />
            <h1 className="bento-title special-font relative z-10 max-w-64 text-white">
              更多角<b>色</b>等<b>你</b>来
            </h1>
            <TiLocationArrow className="relative z-10 m-5 scale-[5] self-end text-white/80" />
          </Link>
        </BentoTilt>

        <BentoTilt className="glow-border bento-tilt_2">
          <video
            src="videos/feature-5.mp4"
            loop
            muted
            autoPlay
            className="size-full object-cover object-center"
          />
          <div className="gradient-overlay absolute inset-0 z-[5] pointer-events-none" />
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;
