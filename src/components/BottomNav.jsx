
import React from 'react';

/* ---------- 底部导航 Dock ---------- */
function BottomNav({ tab, setTab }) {
  const items = [
    { key: "send", label: "送礼", icon: "🎁" },
    { key: "calendar", label: "日历", icon: "📅" },
    { key: "friends", label: "好友", icon: "👀" },
    { key: "me", label: "我的", icon: "💖" },
  ];

  return (
    <div
      className="
        fixed
        bottom-0 left-0 right-0
        flex justify-center
        z-40
      "
    >
      <div
        className="
          w-full max-w-[420px]
          h-[64px]
          bg-white
          border-t border-neutral-200
          flex justify-around items-center
          text-[11px]
          shadow-[0_-4px_12px_rgba(0,0,0,0.06)]
        "
      >
        {items.map((it) => (
          <button
            key={it.key}
            className={
              "flex flex-col items-center gap-1 px-2 " +
              (tab === it.key
                ? "text-indigo-600"
                : "text-neutral-500")
            }
            onClick={() => setTab(it.key)}
          >
            <div className="text-lg leading-none">{it.icon}</div>
            <div className="leading-none">{it.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BottomNav;