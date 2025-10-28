
import React from 'react';
import PageHeader from './PageHeader.jsx';
import { visLabel } from '../utils/helpers.js';

/* ---------- Tab: 我的心愿单 ---------- */

function MeTab({
  wishlist,
  showAddWish,
  setShowAddWish,
  wishName,
  setWishName,
  wishPrice,
  setWishPrice,
  wishNote,
  setWishNote,
  wishGroup,
  setWishGroup,
  wishVis,
  setWishVis,
  addWish,
}) {
  function groupItems(group) {
    return wishlist.filter((w) => w.group === group);
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="我的心愿单"
        rightBtnText="分享"
        onRightBtn={() => alert("TODO: 分享心愿单链接")}
      />

      <div className="p-4 flex flex-col gap-6">
        {/* 个人信息卡片 */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-semibold text-sm">
              我
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-medium text-neutral-900">
                我的昵称
              </div>
              <div className="text-[11px] text-neutral-500">
                生日：11月02日
              </div>
            </div>
          </div>
          <div className="text-xs text-neutral-700 leading-relaxed">
            我喜欢实用的小东西，也喜欢可爱但不要太夸张的周边～
          </div>
        </div>

        {/* 心愿分组 */}
        <WishGroupBlock
          title="我真的很想要"
          items={groupItems("must")}
        />

        <WishGroupBlock
          title="小礼物也可以！不贵但会开心"
          items={groupItems("nice")}
        />

        <WishGroupBlock
          title="请不要送我这些🚫"
          items={groupItems("avoid")}
        />

        {/* 新增心愿 按钮 */}
        <button
          className="w-full border border-dashed border-indigo-400 text-indigo-600 rounded-2xl py-4 text-sm font-semibold"
          onClick={() => setShowAddWish(true)}
        >
          + 添加心愿
        </button>
      </div>
    </div>
  );
}

/* ---------- 心愿分组复用块 ---------- */

function WishGroupBlock({ title, items }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm font-semibold text-neutral-900">
        {title}
      </div>
      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <div className="text-xs text-neutral-400 border border-neutral-200 rounded-xl p-3 text-center bg-white shadow-sm">
            暂无
          </div>
        ) : (
          items.map((it) => (
            <div
              key={it.id}
              className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col gap-1"
            >
              <div className="text-sm font-medium text-neutral-900">
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
              <div className="text-[10px] text-neutral-400">
                可见性：{visLabel(it.visibility)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MeTab;