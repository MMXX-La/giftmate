// src/components/AddWishModal.jsx

import React from 'react';

/* ---------- 弹窗：添加心愿 ---------- */

function AddWishModal({
  close,
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
  return (
    <div className="absolute inset-0 bg-black/40 flex items-end justify-center z-[999]">
      <div className="bg-white w-full max-w-md rounded-t-2xl p-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="flex items-start justify-between">
          <div className="text-base font-semibold text-neutral-900">
            添加心愿
          </div>
          <button
            className="text-sm text-neutral-400"
            onClick={close}
          >
            ✕
          </button>
        </div>

        <input
          className="w-full rounded-xl border border-neutral-300 p-3 text-sm"
          placeholder="心愿名称（比如 Switch Pro手柄）"
          value={wishName}
          onChange={(e) => setWishName(e.target.value)}
        />

        <input
          className="w-full rounded-xl border border-neutral-300 p-3 text-sm"
          placeholder="价格提示（比如 ￥300-400，二手可）"
          value={wishPrice}
          onChange={(e) => setWishPrice(e.target.value)}
        />

        <textarea
          className="w-full rounded-xl border border-neutral-300 p-3 text-sm"
          placeholder="备注（颜色偏米白/黄，不要蓝色）"
          value={wishNote}
          onChange={(e) => setWishNote(e.target.value)}
        />

        <div className="text-xs text-neutral-500">心愿类型</div>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { val: "must", label: "我真的很想要" },
            { val: "nice", label: "小礼物也行" },
            { val: "avoid", label: "请千万别送" },
          ].map((opt) => (
            <button
              key={opt.val}
              className={
                "rounded-xl border px-3 py-2 " +
                (wishGroup === opt.val
                  ? "bg-indigo-50 border-indigo-400 text-indigo-600"
                  : "bg-white border-neutral-300 text-neutral-800")
              }
              onClick={() => setWishGroup(opt.val)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-500">谁可以看到？</div>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { val: "public", label: "公开" },
            { val: "close", label: "亲密好友" },
            { val: "private", label: "仅自己" },
          ].map((opt) => (
            <button
              key={opt.val}
              className={
                "rounded-xl border px-3 py-2 " +
                (wishVis === opt.val
                  ? "bg-indigo-50 border-indigo-400 text-indigo-600"
                  : "bg-white border-neutral-300 text-neutral-800")
              }
              onClick={() => setWishVis(opt.val)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 text-sm">
          <button
            className="text-neutral-500"
            onClick={close}
          >
            取消
          </button>
          <button
            className="bg-indigo-600 text-white rounded-xl px-4 py-2 font-semibold"
            onClick={addWish}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddWishModal;