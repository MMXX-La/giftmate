// src/components/AddPersonModal.jsx

import React from 'react';

/* ---------- 弹窗：新建对象画像 ---------- */

function AddPersonModal({
  close,
  npName,
  setNpName,
  npGender,
  setNpGender,
  npAge,
  setNpAge,
  npRelation,
  setNpRelation,
  npInterests,
  setNpInterests,
  npTaboo,
  setNpTaboo,
  saveNewPerson,
}) {
  const interestOptions = [
    "游戏",
    "二次元",
    "kpop",
    "耽美",
    "健身",
    "护肤香氛",
    "咖啡",
    "手帐文具",
    "熬夜自救",
    "科技数码",
    "养猫/狗",
  ];

  function toggleInterest(tag) {
    setNpInterests((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  }

  return (
    <div className="absolute inset-0 bg-black/40 flex items-end justify-center z-[999]">
      <div className="bg-white w-full max-w-md rounded-t-2xl p-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="flex items-start justify-between">
          <div className="text-base font-semibold text-neutral-900">
            新建对象画像
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
          placeholder="称呼/昵称 (例：婷婷 / 部门Leader)"
          value={npName}
          onChange={(e) => setNpName(e.target.value)}
        />

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <div className="text-xs text-neutral-500">性别</div>
            <select
              className="rounded-xl border border-neutral-300 p-2"
              value={npGender}
              onChange={(e) => setNpGender(e.target.value)}
            >
              <option>女</option>
              <option>男</option>
              <option>不方便说</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-xs text-neutral-500">年龄段</div>
            <select
              className="rounded-xl border border-neutral-300 p-2"
              value={npAge}
              onChange={(e) => setNpAge(e.target.value)}
            >
              <option>18-22</option>
              <option>23-26</option>
              <option>27-30</option>
              <option>30+</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-xs text-neutral-500">关系</div>
            <select
              className="rounded-xl border border-neutral-300 p-2"
              value={npRelation}
              onChange={(e) => setNpRelation(e.target.value)}
            >
              <option>闺蜜</option>
              <option>好朋友</option>
              <option>同事</option>
              <option>上级</option>
              <option>老师</option>
              <option>暧昧对象</option>
              <option>恋人</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-xs text-neutral-500">兴趣标签</div>
          <div className="flex flex-wrap gap-2 text-xs">
            {interestOptions.map((tag) => (
              <button
                key={tag}
                className={
                  "rounded-xl border px-3 py-2 " +
                  (npInterests.includes(tag)
                    ? "bg-indigo-50 border-indigo-400 text-indigo-600"
                    : "bg-white border-neutral-300 text-neutral-800")
                }
                onClick={() => toggleInterest(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-xs text-neutral-500">雷区 / 禁忌</div>
          <textarea
            className="w-full rounded-xl border border-neutral-300 p-3 text-sm"
            placeholder="不要香水味太重；不喜欢粉色；不吃坚果"
            value={npTaboo}
            onChange={(e) => setNpTaboo(e.target.value)}
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
            onClick={saveNewPerson}
          >
            保存这个对象
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPersonModal;