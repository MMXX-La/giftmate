// src/components/RecPage.jsx

import React from 'react';
import PageHeader from './PageHeader.jsx';

/* ---------- Tab: 推荐结果全屏页 ---------- */

function RecPage({ recs, goBack, startPlan }) {
  return (
    <div className="flex flex-col bg-white min-h-full">
      <PageHeader
        title="推荐礼物"
        leftBack
        onBack={goBack}
      />

      <div className="p-4 flex flex-col gap-4">
        {recs.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div className="text-base font-semibold text-neutral-900 leading-snug">
                {r.name}
              </div>
              <div className="text-xs bg-neutral-100 rounded-full px-2 py-1 text-neutral-600 whitespace-nowrap">
                {r.badge}
              </div>
            </div>

            <div className="text-sm text-neutral-600">{r.price}</div>

            <div className="text-sm text-neutral-800 leading-relaxed">
              {r.why}
            </div>
            <div className="text-xs text-red-500 leading-relaxed">
              {r.risk}
            </div>

            <div className="bg-neutral-100 rounded-xl p-3 text-xs text-neutral-700 leading-relaxed">
              <div className="font-medium text-neutral-800 mb-1">
                小卡片可以这样写：
              </div>
              <div className="whitespace-pre-line">{r.cardNote}</div>
            </div>

            <div className="text-[11px] text-neutral-500">
              {r.budgetNote}
            </div>

            <button
              className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-semibold shadow"
              onClick={() => startPlan(r)}
            >
              加入送礼计划
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecPage;