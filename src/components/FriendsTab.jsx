// src/components/FriendsTab.jsx

import React from 'react';
import PageHeader from './PageHeader.jsx';

/* ---------- Tab: 好友心愿单示例 ---------- */

function FriendsTab({ wishlist }) {
  const publicItems = wishlist.filter(
    (w) => w.visibility !== "private"
  );

  return (
    <div className="flex flex-col">
      <PageHeader title="好友心愿单示例" />

      <div className="p-4 flex flex-col gap-6">
        {/* 好友卡 */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-800 font-semibold text-sm">
            她
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium text-neutral-900">
              婷婷
            </div>
            <div className="text-[11px] text-neutral-500 leading-relaxed">
              我喜欢实用但好看的小东西，颜色别太夸张～
            </div>
            <div className="text-[11px] text-neutral-400">
              生日：11月02日
            </div>
          </div>
        </div>

        {/* 心愿列表 */}
        <div className="flex flex-col gap-3">
          {publicItems.map((it) => (
            <div
              key={it.id}
              className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col gap-2"
            >
              <div className="text-sm font-semibold text-neutral-900">
                {it.name}
              </div>
              {it.priceHint && (
                <div className="text-xs text-neutral-600">
                  {it.priceHint}
                </div>
              )}
              {it.note && (
                <div className="text-xs text-neutral-500 leading-relaxed">
                  {it.note}
                </div>
              )}

              <button className="bg-indigo-600 text-white rounded-xl py-2 text-xs font-semibold w-full">
                我就送这个
              </button>
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-neutral-400 pt-4">
          想要别人也知道你想要什么？安装App并创建你的心愿单
        </div>
      </div>
    </div>
  );
}

export default FriendsTab;