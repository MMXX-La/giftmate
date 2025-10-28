// src/components/PlanModal.jsx

import React from 'react';

/* ---------- 弹窗：加入送礼计划 ---------- */

function PlanModal({
  gift,
  close,
  confirm,
  planDate,
  setPlanDate,
  planNote,
  setPlanNote,
}) {
  return (
    <div className="absolute inset-0 bg-black/40 flex items-end justify-center z-[999]">
      <div className="bg-white w-full max-w-md rounded-t-2xl p-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="flex items-start justify-between">
          <div className="text-base font-semibold text-neutral-900">
            加入送礼计划
          </div>
          <button
            className="text-sm text-neutral-400"
            onClick={close}
          >
            ✕
          </button>
        </div>

        <div className="bg-neutral-100 rounded-xl p-3 text-xs text-neutral-700 leading-relaxed">
          <div className="text-neutral-900 text-sm font-medium">
            {gift.name}
          </div>
          <div className="text-neutral-600">{gift.price}</div>
          <div className="text-[11px] text-neutral-500 leading-relaxed whitespace-pre-line">
            {gift.cardNote}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-xs text-neutral-500">计划送礼日期</div>
          <input
            type="date"
            className="w-full rounded-xl border border-neutral-300 p-3 text-sm"
            value={planDate}
            onChange={(e) => setPlanDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-xs text-neutral-500">备注（可选）</div>
          <textarea
            className="w-full rounded-xl border border-neutral-300 p-3 text-sm"
            placeholder="记得写卡片；问她宿舍号；别买粉色"
            value={planNote}
            onChange={(e) => setPlanNote(e.target.value)}
          />
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
            onClick={confirm}
          >
            加入日历
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlanModal;