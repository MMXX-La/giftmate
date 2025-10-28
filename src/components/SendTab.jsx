// src/components/SendTab.jsx

import React from 'react';
import PageHeader from './PageHeader.jsx';

/* ---------- Tab: 送礼助手（主表单页） ---------- */

function SendTab({
  people,
  selectedPersonId,
  setSelectedPersonId,
  scenario,
  setScenario,
  customScenario,
  setCustomScenario,
  budget,
  setBudget,
  generateRecommendations,
  openAddPerson,
}) {
  const scenarios = [
    "生日",
    "安慰打气",
    "表达好感(低调)",
    "给老师/上级留好印象",
    "纪念日/周年日",
    "节日礼物",
    "其他",
  ];
  const budgets = ["<50", "50-100", "100-300", "300-600", "600+"];

  return (
    <div className="flex flex-col">
      {/* 顶部标题栏 */}
      <PageHeader
        title="送礼助手"
        rightBtnText="历史记录"
        onRightBtn={() => alert("TODO: 历史记录页")}
      />

      {/* 内容 */}
      <div className="p-4 flex flex-col gap-6">
        {/* 卡片1：送给谁 */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <div className="text-sm font-medium text-neutral-900">
            送给谁？
          </div>
          <div className="text-xs text-neutral-500">
            选择已有对象或新建画像
          </div>

          <select
            className="w-full rounded-xl border border-neutral-300 bg-white p-3 text-sm"
            value={selectedPersonId}
            onChange={(e) => setSelectedPersonId(e.target.value)}
          >
            <option value="">请选择</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}（{p.relation}）
              </option>
            ))}
          </select>

          <button
            className="text-sm text-indigo-600 font-medium underline self-start"
            onClick={openAddPerson}
          >
            + 新建对象画像
          </button>
        </div>

        {/* 卡片2：场合 */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <div className="text-sm font-medium text-neutral-900">
            什么场合？
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            {scenarios.map((sc) => (
              <button
                key={sc}
                className={
                  "rounded-xl border p-3 text-left " +
                  (scenario === sc
                    ? "bg-indigo-50 border-indigo-400 text-indigo-600"
                    : "bg-white border-neutral-300 text-neutral-800")
                }
                onClick={() => setScenario(sc)}
              >
                {sc}
              </button>
            ))}
          </div>

          {scenario === "其他" && (
            <input
              className="w-full rounded-xl border border-neutral-300 p-3 text-sm"
              placeholder="比如：他最近一直熬夜加班，想奖励一下"
              value={customScenario}
              onChange={(e) => setCustomScenario(e.target.value)}
            />
          )}
        </div>

        {/* 卡片3：预算 */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <div className="text-sm font-medium text-neutral-900">
            预算大概多少？
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            {budgets.map((b) => (
              <button
                key={b}
                className={
                  "rounded-xl border px-4 py-2 " +
                  (budget === b
                    ? "bg-indigo-50 border-indigo-400 text-indigo-600"
                    : "bg-white border-neutral-300 text-neutral-800")
                }
                onClick={() => setBudget(b)}
              >
                {b}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-neutral-500 min-h-[1rem]">
            {budget === "<50" &&
              "走心小物，不会给对方压力"}
            {budget === "50-100" &&
              "有心意但不夸张"}
            {budget === "100-300" &&
              "生日/纪念日档位，会被记住"}
            {budget === "300-600" &&
              "属于‘我很在意你’，注意关系边界"}
            {budget === "600+" &&
              "奢重档位，可能把关系往前推一大步"}
          </div>
        </div>

        {/* CTA */}
        <button
          className="w-full bg-indigo-600 text-white rounded-2xl py-4 text-base font-semibold shadow-md"
          onClick={generateRecommendations}
        >
          🎁 生成推荐礼物
        </button>
      </div>
    </div>
  );
}

export default SendTab;