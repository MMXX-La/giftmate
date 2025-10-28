// src/components/CalendarTab.jsx

import React from 'react';
import PageHeader from './PageHeader.jsx';

/* ---------- Tab: 日历 ---------- */

function CalendarTab({ events, getPersonById, markBought }) {
  const totalBudgetApprox = events.reduce((acc, ev) => {
    const match = ev.priceHint.match(/\d+/);
    if (match) {
      return acc + parseInt(match[0], 10);
    }
    return acc;
  }, 0);

  return (
    <div className="flex flex-col">
      <PageHeader title="送礼日历" />

      <div className="p-4 flex flex-col gap-6">
        {/* 概览卡片 */}
        <div className="bg-indigo-600 text-white rounded-2xl p-4 shadow-md flex flex-col gap-1">
          <div className="text-sm">
            待准备礼物：{events.length} 件
          </div>
          <div className="text-lg font-semibold">
            预计总预算：￥{totalBudgetApprox}
          </div>
          <div className="text-xs text-indigo-100">
            提前准备，不要拖到当天 🫠
          </div>
        </div>

        {/* 列表 */}
        <div className="flex flex-col gap-4">
          {events
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((ev) => {
              const person = getPersonById(ev.personId);
              return (
                <div
                  key={ev.id}
                  className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3"
                >
                  <div className="text-xs text-neutral-500">
                    {ev.date} · {ev.scenario}
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="text-base font-semibold text-neutral-900">
                        {person?.name || "(未知对象)"}（
                        {person?.relation || "?"}）
                      </div>
                      <div className="text-sm text-neutral-600">
                        {ev.giftName}{" "}
                        <span className="text-neutral-400">
                          {ev.priceHint}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 leading-relaxed">
                        {ev.note}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div
                        className={
                          "text-[11px] font-medium px-2 py-1 rounded-full " +
                          (ev.status === "bought"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600")
                        }
                      >
                        {ev.status === "bought"
                          ? "已购买"
                          : "未购买"}
                      </div>

                      {ev.status !== "bought" && (
                        <button
                          className="text-xs text-indigo-600 underline"
                          onClick={() => markBought(ev.id)}
                        >
                          标记已买
                        </button>
                      )}
                    </div>
                  </div>

                  <button className="w-full border border-neutral-300 text-neutral-800 rounded-xl py-2 text-xs font-medium">
                    查看详情 / 修改提醒
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default CalendarTab;