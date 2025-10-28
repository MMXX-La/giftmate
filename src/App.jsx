import React, { useState, useEffect } from "react";

/* ---------- 工具函数 / 小助手 ---------- */

// 标签翻译：公开 / 亲密好友 / 仅自己
function visLabel(v) {
  if (v === "public") return "公开";
  if (v === "close") return "亲密好友";
  if (v === "private") return "仅自己";
  return v;
}

// localStorage 读
function loadFromLocalStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// localStorage 写
function saveToLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

/* ---------- 主应用 ---------- */

function App() {
  // 当前 tab: "send" | "calendar" | "friends" | "me"
  const [tab, setTab] = useState("send");

  // “送礼助手”里，是否在看推荐结果页
  const [showRecPage, setShowRecPage] = useState(false);

  // ===== 持久化数据（people / events / wishlist）=====
  const [people, setPeople] = useState(() =>
    loadFromLocalStorage("giftmate_people", [
      {
        id: "p1",
        name: "牢高",
        gender: "女",
        ageRange: "18-22",
        relation: "闺蜜",
        interests: ["二次元", "kpop", "咖啡"],
        taboo: "不要香水味太重; 不要粉色",
      },
      {
        id: "p2",
        name: "老吴",
        gender: "男",
        ageRange: "27-30",
        relation: "领导",
        interests: ["咖啡", "出差保温杯"],
        taboo: "太私密的东西",
      },
    ])
  );

  const [events, setEvents] = useState(() =>
    loadFromLocalStorage("giftmate_events", [
      {
        id: "e1",
        personId: "p1",
        date: "2025-11-02",
        scenario: "生日",
        budget: "50-100",
        giftName: "星巴克圣诞限定保温杯",
        priceHint: "约￥129-159",
        note: "记得手写小卡片，不要只给杯子",
        status: "pending",
      },
      {
        id: "e2",
        personId: "p2",
        date: "2025-11-10",
        scenario: "表达感谢/上级",
        budget: "100-300",
        giftName: "TWG茶包礼盒",
        priceHint: "约￥200",
        note: "稳妥不越界，适合说谢谢",
        status: "bought",
      },
    ])
  );

  const [wishlist, setWishlist] = useState(() =>
    loadFromLocalStorage("giftmate_wishlist", [
      {
        id: "w1",
        group: "must",
        name: "Switch Pro手柄（原装）",
        priceHint: "约￥300-400，二手也可",
        note: "外观别太花🙏",
        visibility: "public",
      },
      {
        id: "w2",
        group: "must",
        name: "某某联名挂件",
        priceHint: "￥60左右",
        note: "最好是黄/米白，别挑蓝色",
        visibility: "close",
      },
      {
        id: "w3",
        group: "nice",
        name: "蒸汽眼罩补给包",
        priceHint: "￥30-50",
        note: "加班后用，别太香的味道",
        visibility: "public",
      },
      {
        id: "w4",
        group: "avoid",
        name: "烈香水 / 大红口红 / 情侣项链",
        priceHint: "",
        note: "会让我尴尬 or 头疼😅",
        visibility: "public",
      },
    ])
  );

  // 写回 localStorage
  useEffect(() => {
    saveToLocalStorage("giftmate_people", people);
  }, [people]);

  useEffect(() => {
    saveToLocalStorage("giftmate_events", events);
  }, [events]);

  useEffect(() => {
    saveToLocalStorage("giftmate_wishlist", wishlist);
  }, [wishlist]);

  // ===== 送礼助手表单状态 =====
  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [scenario, setScenario] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [budget, setBudget] = useState("");

  // ===== 弹窗：新建对象画像 =====
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [npName, setNpName] = useState("");
  const [npGender, setNpGender] = useState("女");
  const [npAge, setNpAge] = useState("18-22");
  const [npRelation, setNpRelation] = useState("闺蜜");
  const [npInterests, setNpInterests] = useState([]);
  const [npTaboo, setNpTaboo] = useState("");

  // ===== 推荐结果 ＆“加入送礼计划”弹窗 =====
  const [recs, setRecs] = useState([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planTargetGift, setPlanTargetGift] = useState(null);
  const [planDate, setPlanDate] = useState("");
  const [planNote, setPlanNote] = useState("");

  // ===== “添加心愿”弹窗 =====
  const [showAddWish, setShowAddWish] = useState(false);
  const [wishName, setWishName] = useState("");
  const [wishPrice, setWishPrice] = useState("");
  const [wishNote, setWishNote] = useState("");
  const [wishGroup, setWishGroup] = useState("must"); // must | nice | avoid
  const [wishVis, setWishVis] = useState("public");  // public | close | private


  // 小工具：根据 personId 找人
  function getPersonById(id) {
    return people.find((p) => p.id === id);
  }

  // 生成推荐
  function generateRecommendations() {
    if (!selectedPersonId || !scenario || !budget) {
      alert("请先把 送给谁 / 场合 / 预算 都选好");
      return;
    }

    const person = getPersonById(selectedPersonId);
    const rel = person?.relation || "朋友";
    const sc = scenario === "其他" ? customScenario : scenario;

    const draft = [];

    if (rel.includes("上级") || rel.includes("老师")) {
      draft.push({
        name: "高质茶包/咖啡礼盒",
        price: "约￥100-200",
        badge: "💼 职场安全",
        why: "稳妥、不越界、显得细心但不拍马屁。",
        risk: "⚠️ 避免太私人的东西(香水/围巾)。",
        cardNote:
          "这段时间多亏您照顾。希望这点小东西能让您休息的时候更舒服一些。",
      });
      draft.push({
        name: "保温杯(黑/银/深绿等低调色)",
        price: "约￥80-150",
        badge: "💼 职场安全",
        why: "办公常用，显关心健康，但不暧昧。",
        risk: "⚠️ 不要粉色卡通款，避免误会。",
        cardNote:
          "工作真的辛苦了，想让你（您）喝到热的/别总喝冰的。注意身体～",
      });
    } else {
      draft.push({
        name: "联名/限定保温杯",
        price: "约￥129-159",
        badge: "🔥 高好评",
        why: "日常可用+限定感=有心思。适合生日/安慰打气/暧昧但不太露。",
        risk: "⚠️ 不喝咖啡就换同系列水杯。",
        cardNote:
          "最近感觉你一直很忙，想让你在工位也能喝到热的。别太拼命啦 :)",
      });
      draft.push({
        name: "蒸汽眼罩 / 颈肩热敷包套装",
        price: "约￥40-80",
        badge: "💗 走心不暧昧",
        why: "表达‘我在关心你的疲劳’，但不会像口红那样暧昧到尴尬。",
        risk: "⚠️ 如果只是普通朋友，卡片别太暧昧就好。",
        cardNote:
          "别熬太晚啦。这是熬夜急救包，下次累了用一下，别硬扛～",
      });
    }

    const budgetNoteMap = {
      "<50": "走心小物，不会给对方压力",
      "50-100": "有心意但不夸张",
      "100-300": "生日/纪念日档位，会被记住",
      "300-600": "属于‘我很在意你’，注意关系边界",
      "600+": "奢重档位，可能把关系往前推一大步",
    };

    const finalList = draft.map((item, idx) => ({
      ...item,
      id: `rec_${Date.now()}_${idx}`,
      scenario: sc,
      budget,
      budgetNote: budgetNoteMap[budget] || "",
      personId: selectedPersonId,
    }));

    setRecs(finalList);
    setShowRecPage(true); // 打开推荐结果页
  }

  // “加入送礼计划” -> 打开计划弹窗
  function startPlan(rec) {
    setPlanTargetGift(rec);
    setPlanDate("");
    setPlanNote(rec.cardNote || "");
    setShowPlanModal(true);
  }

  // 确认加入日历
  function confirmPlan() {
    if (!planDate || !planTargetGift) {
      alert("请选择送礼日期");
      return;
    }
    const newEvent = {
      id: `e_${Date.now()}`,
      personId: planTargetGift.personId,
      date: planDate,
      scenario: planTargetGift.scenario,
      budget: planTargetGift.budget,
      giftName: planTargetGift.name,
      priceHint: planTargetGift.price,
      note: planNote,
      status: "pending",
    };

    const next = [...events, newEvent].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    setEvents(next);
    setShowPlanModal(false);
    alert("已加入你的送礼日历✅");
  }

  // 在日历页中“标记已买”
  function markBought(id) {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id ? { ...ev, status: "bought" } : ev
      )
    );
  }

  // 保存一个新人物画像
  function saveNewPerson() {
    if (!npName) {
      alert("请填写称呼/昵称");
      return;
    }
    const newPerson = {
      id: `p_${Date.now()}`,
      name: npName,
      gender: npGender,
      ageRange: npAge,
      relation: npRelation,
      interests: npInterests,
      taboo: npTaboo,
    };
    setPeople((prev) => [...prev, newPerson]);
    setSelectedPersonId(newPerson.id);
    setShowAddPerson(false);

    // 清空表单
    setNpName("");
    setNpGender("女");
    setNpAge("18-22");
    setNpRelation("闺蜜");
    setNpInterests([]);
    setNpTaboo("");
  }

  // 保存一个新心愿
  function addWish() {
    if (!wishName) {
      alert("请填写心愿名");
      return;
    }
    const w = {
      id: `w_${Date.now()}`,
      group: wishGroup,
      name: wishName,
      priceHint: wishPrice,
      note: wishNote,
      visibility: wishVis,
    };
    setWishlist((prev) => [...prev, w]);
    setShowAddWish(false);

    // 重置输入
    setWishName("");
    setWishPrice("");
    setWishNote("");
    setWishGroup("must");
    setWishVis("public");
  }

  // ===== 哪个页面内容？（pageContent） =====
  let pageContent = null;

  if (tab === "send") {
    if (showRecPage) {
      pageContent = (
        <RecPage
          recs={recs}
          goBack={() => setShowRecPage(false)}
          startPlan={startPlan}
        />
      );
    } else {
      pageContent = (
        <SendTab
          people={people}
          selectedPersonId={selectedPersonId}
          setSelectedPersonId={setSelectedPersonId}
          scenario={scenario}
          setScenario={setScenario}
          customScenario={customScenario}
          setCustomScenario={setCustomScenario}
          budget={budget}
          setBudget={setBudget}
          generateRecommendations={generateRecommendations}
          openAddPerson={() => setShowAddPerson(true)}
        />
      );
    }
  } else if (tab === "calendar") {
    pageContent = (
      <CalendarTab
        events={events}
        getPersonById={getPersonById}
        markBought={markBought}
      />
    );
  } else if (tab === "friends") {
    pageContent = <FriendsTab wishlist={wishlist} />;
  } else if (tab === "me") {
    pageContent = (
      <MeTab
        wishlist={wishlist}
        showAddWish={showAddWish}
        setShowAddWish={setShowAddWish}
        wishName={wishName}
        setWishName={setWishName}
        wishPrice={wishPrice}
        setWishPrice={setWishPrice}
        wishNote={wishNote}
        setWishNote={setWishNote}
        wishGroup={wishGroup}
        setWishGroup={setWishGroup}
        wishVis={wishVis}
        setWishVis={setWishVis}
        addWish={addWish}
      />
    );
  }


  // ===== 最终渲染（含手机容器 + 底部dock + 弹窗）=====
  return (
    // 整个浏览器背景：淡灰，模拟“手机放桌上”
    <div className="w-full min-h-screen flex justify-center bg-[rgb(245,245,245)] text-neutral-900">
      {/* 手机壳容器 */}
      <div className="relative w-full max-w-[420px] min-h-screen bg-[rgb(250,250,250)] flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.08)]">

        {/* 主内容滚动区 */}
        <div className="flex-1 overflow-y-auto pb-[80px]">
          {pageContent}
        </div>

        {/* 底部导航 Dock */}
        <BottomNav
          tab={tab}
          setTab={(k) => {
            setTab(k);
            if (k === "send") {
              setShowRecPage(false); // 回到送礼助手主界面
            }
          }}
        />

        {/* 弹窗：新建对象画像 */}
        {showAddPerson && (
          <AddPersonModal
            close={() => setShowAddPerson(false)}
            npName={npName}
            setNpName={setNpName}
            npGender={npGender}
            setNpGender={setNpGender}
            npAge={npAge}
            setNpAge={setNpAge}
            npRelation={npRelation}
            setNpRelation={setNpRelation}
            npInterests={npInterests}
            setNpInterests={setNpInterests}
            npTaboo={npTaboo}
            setNpTaboo={setNpTaboo}
            saveNewPerson={saveNewPerson}
          />
        )}

        {/* 弹窗：加入送礼计划 */}
        {showPlanModal && planTargetGift && (
          <PlanModal
            gift={planTargetGift}
            close={() => setShowPlanModal(false)}
            confirm={confirmPlan}
            planDate={planDate}
            setPlanDate={setPlanDate}
            planNote={planNote}
            setPlanNote={setPlanNote}
          />
        )}

        {/* 弹窗：添加心愿 */}
        {showAddWish && (
          <AddWishModal
            close={() => setShowAddWish(false)}
            wishName={wishName}
            setWishName={setWishName}
            wishPrice={wishPrice}
            setWishPrice={setWishPrice}
            wishNote={wishNote}
            setWishNote={setWishNote}
            wishGroup={wishGroup}
            setWishGroup={setWishGroup}
            wishVis={wishVis}
            setWishVis={setWishVis}
            addWish={addWish}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- 统一的页面头部组件 ---------- */

function PageHeader({ title, rightBtnText, onRightBtn, leftBack, onBack }) {
  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {leftBack && (
          <button
            className="text-neutral-500 text-sm"
            onClick={onBack}
          >
            ←
          </button>
        )}
        <div className="text-base font-semibold text-neutral-900">
          {title}
        </div>
      </div>

      {rightBtnText ? (
        <button
          className="text-xs text-neutral-500 underline"
          onClick={onRightBtn}
        >
          {rightBtnText}
        </button>
      ) : (
        <div className="w-10 h-4" />
      )}
    </div>
  );
}

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

      {/* 添加心愿弹窗（在 App 里其实也会渲染一份，这里只是以防万一） */}
      {showAddWish && (
        <AddWishModal
          close={() => setShowAddWish(false)}
          wishName={wishName}
          setWishName={setWishName}
          wishPrice={wishPrice}
          setWishPrice={setWishPrice}
          wishNote={wishNote}
          setWishNote={setWishNote}
          wishGroup={wishGroup}
          setWishGroup={setWishGroup}
          wishVis={wishVis}
          setWishVis={setWishVis}
          addWish={addWish}
        />
      )}
    </div>
  );
}

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

export default App;