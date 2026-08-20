import { useState } from "react";

const PRIVACY_SECTIONS = [
  {
    title: "一、我们收集什么",
    body: "CastVault 只收集你主动输入的角色描述（提示词）、所选风格，以及生成结果的图片链接。我们不收集姓名、手机号、身份证等身份信息，也不要求注册账号。",
  },
  {
    title: "二、数据存在哪里",
    body: "你生成并保存的角色全部保存在当前浏览器的本地存储（localStorage）里，不会上传到服务器。清除浏览器数据会一并删除这些角色，建议及时截图或导出留存。",
  },
  {
    title: "三、第三方服务",
    body: "立绘由第三方文生图接口生成，你的提示词会被发送至该接口用于出图。请不要在提示词中填写真实的个人隐私信息；除出图所必需外，我们不会将你的输入用于其他用途。",
  },
  {
    title: "四、你的权利",
    body: "你可以随时在「角色资产库」中删除任意角色，删除后本地数据即刻移除；也可以通过清空浏览器本地存储一次性清除全部数据。",
  },
  {
    title: "五、联系我们",
    body: "本产品为个人作品集演示项目（非商业运营）。如对数据处理方式有疑问，可在首页「联系我们」区块留言。",
  },
];

const Footer = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <footer className="w-screen border-t border-white/8 bg-black py-6 text-blue-50/40">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-center text-sm font-light md:text-left">
          &copy; 2026 潘米河. AI 短剧角色 IP 资产平台
        </p>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setPrivacyOpen(true)}
            className="text-center text-sm font-light transition-colors duration-300 hover:text-blue-50/70 md:text-right"
          >
            隐私政策
          </button>
          <span className="text-violet-300/60 font-brand font-black text-sm">CastVault</span>
        </div>
      </div>

      {privacyOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setPrivacyOpen(false)}
        >
          <div
            className="my-[8vh] w-full max-w-2xl rounded-2xl bg-white p-8 text-gray-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-brand text-2xl font-black text-gray-900">隐私政策</h2>
                <p className="mt-1 text-xs text-gray-400">最后更新：2026 年 10 月</p>
              </div>
              <button
                type="button"
                onClick={() => setPrivacyOpen(false)}
                aria-label="关闭"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-gray-600">
              我们尽量少地收集数据——能存在你自己浏览器里的，就不放到服务器上。
            </p>

            <div className="mt-6 flex flex-col gap-5">
              {PRIVACY_SECTIONS.map((s) => (
                <div key={s.title}>
                  <h3 className="text-sm font-semibold text-gray-900">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{s.body}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setPrivacyOpen(false)}
              className="mt-8 w-full rounded-full bg-violet-600 py-3 text-sm font-bold text-white transition-all hover:scale-[1.01]"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
