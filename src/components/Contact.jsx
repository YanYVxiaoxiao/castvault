import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    <img src={src} />
  </div>
);

const Contact = () => {
  return (
    <div id="contact" className="my-20 min-h-96 w-screen px-10">
      <div className="relative rounded-2xl border border-white/10 py-24 text-blue-50 sm:overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(10,10,14,0.95) 0%, rgba(5,5,7,0.98) 100%)" }}>
        <div className="pointer-events-none absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
          <ImageClipBox
            src="/img/contact-1.webp"
            clipClass="contact-clip-path-1"
          />
          <ImageClipBox
            src="/img/contact-2.webp"
            clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60"
          />
        </div>

        <div className="pointer-events-none absolute -top-40 left-20 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80">
          <ImageClipBox
            src="/img/swordman-partial.webp"
            clipClass="absolute md:scale-125"
          />
          <ImageClipBox
            src="/img/swordman.webp"
            clipClass="sword-man-clip-path md:scale-125"
          />
        </div>

        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.08), transparent 70%)" }} />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="glass-card mb-10 rounded-full px-4 py-1.5">
            <p className="font-general text-[10px] uppercase text-violet-300">
              加入我们
            </p>
          </div>

          <AnimatedTitle
            title="创意<b>无</b>限<br />角<b>色</b>永恒"
            containerClass="special-font !md:text-[6.2rem] w-full font-brand !text-5xl !font-black !leading-[.9] !text-white"
          />

          <Button
            title="联系我们"
            href="mailto:2220298269@qq.com"
            containerClass="mt-10 cursor-pointer glow-violet"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
