import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <div className="glass-card rounded-full px-4 py-1.5">
          <p className="font-general text-sm uppercase md:text-[10px] text-violet-300">
            M1 · AI 角色生成引擎
          </p>
        </div>

        <AnimatedTitle
          title="描<b>述</b>你心中的<br />角<b>色</b>，即刻生成"
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext">
          <p className="text-blue-50/90">立绘 + 人设档案 + 声音样本，AI 三件套一起出</p>
          <p className="text-blue-50/40">
            写实、动漫、国风、赛博朋克——六种风格可选，
            从创意到完整角色不超过 60 秒
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image glow-border">
          <img
            src="img/about.webp"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;