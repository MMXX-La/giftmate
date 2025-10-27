import React, { useState, useEffect } from "react";

/**
 * 小工具：安全读取 localStorage 里的 JSON
 * key: 存在 localStorage 里的键名
 * fallback: 如果本地没有存过，就用这个默认值
 */
function loadFromLocalStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("loadFromLocalStorage failed for", key, err);
    return fallback;
  }
}

/**
 * 小工具：把某个值写进 localStorage（自动转成JSON字符串）
 */
function saveToLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("saveToLocalStorage failed for", key, err);
  }
}

function App() {
  const [tab, setTab] = useState("send"); // "send" | "calendar" | "friends" | "me"

  //
  // 1. 初始化状态时，优先从 localStorage 取数据
  //    如果还没有存过，就用我们写死的默认假数据
  //
  const [people, setPeople] = useState(() =>
    loadFromLocalStorage("giftmate_people", [
      {
        id: "p1",
        name: "婷婷",
        gender: "女",
        ageRange: "18-22",
        relation: "闺蜜",
        interests: ["二次元", "kpop", "咖啡"],
        taboo: "不要香水味太重; 不要粉色",
      },
      {
        id: "p2",
        name: "部门Leader",
        gender: "男",
        ageRange: "27-30",
        relation: "上级",
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
        note: "加班后用，别买太香的味道",
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

  // 2. 每当 people / events / wishlist 改变，就写回 localStorage
  useEffect(() => {
    saveToLocalStorage("giftmate_people", people);
  }, [people]);

  useEffect(() => {
    saveToLocalStorage("giftmate_events", events);
  }, [events]);

  useEffect(() => {
    saveToLocalStorage("giftmate_wishlist", wishlist);
  }, [wishlist]);

  // 送礼助手里的 UI 选择
  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [scenario, setScenario] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [budget, setBudget] = useState("");

  // 新建送礼对象弹窗
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [npName, setNpName] = useState("");
  const [npGender, setNpGender] = useState("女");
  const [npAge, setNpAge] = useState("18-22");
  const [npRelation, setNpRelation] = useState("闺蜜");
  const [npInterests, setNpInterests] = useState([]);
  const [npTaboo, setNpTaboo] = useState("");

  // 推荐结果（不需要持久化：它是临时推荐，可以刷新后重新算）
  const [recs, setRecs] = useState([]);

  // “加入送礼计划”弹窗
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planTargetGift, setPlanTargetGift] = useState(null);
  const [planDate, setPlanDate] = useState("");
  const [planRemind, setPlanRemind] = useState("3d");
  const [planCustomRemind, setPlanCustomRemind] = useState("");
  const [planNote, setPlanNote] = useState("");

  function getPersonById(id) {
    return people.find((p) => p.id === id);
  }

  // 生成推荐礼物（规则版）
  function generateRecommendations() {
    if (!selectedPersonId || !scenario || !budget) {
      alert("请先把 送给谁 / 场合 / 预算 都选好");
      return;
    }

    const person = getPersonById(selectedPersonId);
    const rel = person?.relation || "朋友";
    const sc = scenario === "其他" ? customScenario : scenario;

    const cards = [];
    function pushCard(card) {
      cards.push(card);
    }

    if (rel.includes("上级") || rel.includes("老师")) {
      pushCard({
        name: "高质茶包/咖啡礼盒",
        price: "约￥100-200",
        badge: "💼 职场安全",
        why: "稳妥、不越界、显得细心但不拍马屁。适合表达感谢、维系良好印象。",
        risk: "⚠️ 避免太私人的东西(香水、围巾)，保持中性专业。",
        cardNote:
          "这段时间多亏您照顾。希望这点小东西能让您休息的时候更舒服一些。",
      });

      pushCard({
        name: "保温杯(不夸张颜色)",
        price: "约￥80-150",
        badge: "💼 职场安全",
        why: "日常办公可用，显关心健康/休息，不会太亲密。",
        risk: "⚠️ 选黑/银/深绿，别选粉色/卡通，避免误读。",
        cardNote:
          "工作真的辛苦了，想让你（您）喝到热的/别总喝冰的。注意身体～",
      });
    } else {
      pushCard({
        name: "星巴克/联名限定保温杯",
        price: "约￥129-159",
        badge: "🔥 高好评",
        why: "日常可用+限定感=有心思。适合生日、安慰打气、暧昧但不太露。",
        risk: "⚠️ 如果TA不喝咖啡，换成同系列保温水杯。",
        cardNote:
          "最近感觉你一直很忙，想让你在工位也能喝到热的。别太拼命啦 :)",
      });

      pushCard({
        name: "蒸汽眼罩 / 颈肩热敷包补给套装",
        price: "约￥40-80",
        badge: "💗 走心不暧昧",
        why: "‘照顾你的疲劳’这种关心是很加分的，但不会像送口红那样太暧昧。",
        risk: "⚠️ 避免写太露骨的暧昧备注，如果只是朋友关系。",
        cardNote:
          "别熬太晚啦。这是熬夜急救包，下次累了用一下，别硬扛～",
      });
    }

    const budgetNoteMap = {
      "<50": "走心小物，不会让对方有‘你花太多了’的压力。",
      "50-100": "看起来用心，但不会夸张。",
      "100-300": "适合生日/纪念日，会被记住。",
      "300-600": "这已经是‘我很在意你’级别，注意关系边界。",
      "600+": "奢重档位，可能把关系往前推一大步。",
    };

    const withMeta = cards.map((c, idx) => ({
      ...c,
      id: `rec_${Date.now()}_${idx}`,
      selectedPersonId,
      scenario: sc,
      budget,
      budgetNote: budgetNoteMap[budget] || "",
    }));

    setRecs(withMeta);

    const el = document.getElementById("rec-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  // 用户点“加入送礼计划”
  function addToPlan(rec) {
    setPlanTargetGift(rec);
    setPlanDate("");
    setPlanRemind("3d");
    setPlanCustomRemind("");
    setPlanNote("");
    setShowPlanModal(true);
  }

  // 在弹窗里确认加入日历
  function confirmAddPlan() {
    if (!planDate || !planTargetGift) {
      alert("请选择送礼日期");
      return;
    }

    const newEvent = {
      id: `e_${Date.now()}`,
      personId: planTargetGift.selectedPersonId,
      date: planDate,
      scenario: planTargetGift.scenario,
      budget: planTargetGift.budget,
      giftName: planTargetGift.name,
      priceHint: planTargetGift.price,
      note: planNote || planTargetGift.cardNote,
      status: "pending",
    };

    const updated = [...events, newEvent].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    setEvents(updated);

    setShowPlanModal(false);
    alert("已加入你的送礼日历✅");
  }

  // 日历tab里“标记已买”
  function markBought(id) {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, status: "bought" } : ev))
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col text-neutral-900">
      <div className="flex-1 overflow-y-auto pb-24 bg-[rgb(250,250,250)]">
        {tab === "send" && (
          <SendTabUI
            people={people}
            setShowAddPerson={setShowAddPerson}
            selectedPersonId={selectedPersonId}
            setSelectedPersonId={setSelectedPersonId}
            scenario={scenario}
            setScenario={setScenario}
            customScenario={customScenario}
            setCustomScenario={setCustomScenario}
            budget={budget}
            setBudget={setBudget}
            recs={recs}
            generateRecommendations={generateRecommendations}
            addToPlan={addToPlan}
          />
        )}

        {tab === "calendar" && (
          <CalendarTabUI
            events={events}
            getPersonById={(id) => people.find((p) => p.id === id)}
            markBought={markBought}
          />
        )}

        {tab === "friends" && <FriendsTabUI wishlist={wishlist} />}

        {tab === "me" && (
          <MeTabUI wishlist={wishlist} setWishlist={setWishlist} />
        )}
      </div>

      <BottomNav tab={tab} setTab={setTab} />

      {showAddPerson && (
        <AddPersonModal
          close={() => setShowAddPerson(false)}
          save={(personObj) => {
            const newPerson = {
              ...personObj,
              id: `p_${Date.now()}`,
            };
            // 更新 people（这会触发 useEffect 保存到localStorage）
            setPeople((prev) => [...prev, newPerson]);
            setSelectedPersonId(newPerson.id);
            setShowAddPerson(false);
          }}
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
        />
      )}

      {showPlanModal && planTargetGift && (
        <PlanModal
          gift={planTargetGift}
          close={() => setShowPlanModal(false)}
          confirm={confirmAddPlan}
          planDate={planDate}
          setPlanDate={setPlanDate}
          planRemind={planRemind}
          setPlanRemind={setPlanRemind}
          planCustomRemind={planCustomRemind}
          setPlanCustomRemind={setPlanCustomRemind}
          planNote={planNote}
          setPlanNote={setPlanNote}
        />
      )}
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-base font-semibold text-neutral-900">{title}</div>
      {subtitle && (
        <div className="text-xs text-neutral-500">{subtitle}</div>
      )}
    </div>
  );
}

function SendTabUI(props) {
  const {
    people,
    setShowAddPerson,
    selectedPersonId,
    setSelectedPersonId,
    scenario,
    setScenario,
    customScenario,
    setCustomScenario,
    budget,
    setBudget,
    recs,
    generateRecommendations,
    addToPlan,
  } = props;

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
    <div className="p-4 flex flex-col gap-6">
      {/* 头部 */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold">送礼助手</div>
          <div className="text-xs text-neutral-500">
            3步生成不尴尬的礼物推荐
          </div>
        </div>
        <button className="text-xs text-neutral-500 underline">
          历史记录
        </button>
      </div>

      {/* Step1 对象 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 flex flex-col gap-3">
        <SectionTitle
          title="送给谁？"
          subtitle="选择已有对象或新建画像"
        />

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
          onClick={() => setShowAddPerson(true)}
        >
          + 新建对象画像
        </button>
      </div>

      {/* Step2 场合 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 flex flex-col gap-3">
        <SectionTitle title="什么场合？" />

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
              onClick={() => {
                setScenario(sc);
              }}
            >
              {sc}
            </button>
          ))}
        </div>

        {scenario === "其他" && (
          <input
            className="w-full rounded-xl border border-neutral-300 bg-white p-3 text-sm"
            placeholder="比如：他最近一直熬夜加班，想奖励一下"
            value={customScenario}
            onChange={(e) => setCustomScenario(e.target.value)}
          />
        )}
      </div>

      {/* Step3 预算 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 flex flex-col gap-3">
        <SectionTitle title="预算大概多少？" />

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

        <div className="text-xs text-neutral-500 min-h-[1rem]">
          {budget === "<50" &&
            "走心小物，不会让对方有‘你花太多了’压力"}
          {budget === "50-100" &&
            "看起来用心，但不会夸张"}
          {budget === "100-300" &&
            "适合生日/纪念日，会被记住"}
          {budget === "300-600" &&
            "这已经是‘我很在意你’级别，注意关系边界"}
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

      {/* 推荐结果 */}
      <div id="rec-section" className="flex flex-col gap-4">
        {recs.length > 0 && (
          <div className="pt-2 text-sm text-neutral-500">
            为你准备的礼物清单：
          </div>
        )}

        {recs.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 flex flex-col gap-3"
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
                附赠小卡片可以这样写：
              </div>
              <div className="whitespace-pre-line">{r.cardNote}</div>
            </div>

            <div className="text-[11px] text-neutral-500">
              {r.budgetNote}
            </div>

            <button
              className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-semibold shadow"
              onClick={() => addToPlan(r)}
            >
              加入送礼计划
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarTabUI({ events, getPersonById, markBought }) {
  const totalBudgetApprox = events.reduce((acc, ev) => {
    const match = ev.priceHint.match(/\d+/);
    if (match) {
      return acc + parseInt(match[0], 10);
    }
    return acc;
  }, 0);

  return (
    <div className="p-4 flex flex-col gap-6">
      {/* summary card */}
      <div className="bg-indigo-600 text-white rounded-2xl p-4 shadow-md flex flex-col gap-1">
        <div className="text-sm">
          本月待准备礼物：{events.length} 件
        </div>
        <div className="text-lg font-semibold">
          预计总预算：￥{totalBudgetApprox}
        </div>
        <div className="text-xs text-indigo-100">
          建议优先搞定最近的生日，不要拖到当天 🫠
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {events
          .slice()
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((ev) => {
            const person = getPersonById(ev.personId);
            return (
              <div
                key={ev.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 flex flex-col gap-3"
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

      <button className="fixed bottom-24 right-4 bg-indigo-600 text-white rounded-full shadow-xl px-4 py-3 text-sm font-semibold">
        + 新增送礼节点
      </button>
    </div>
  );
}

function MeTabUI({ wishlist, setWishlist }) {
  const [showAddWish, setShowAddWish] = useState(false);
  const [wishName, setWishName] = useState("");
  const [wishPrice, setWishPrice] = useState("");
  const [wishNote, setWishNote] = useState("");
  const [wishGroup, setWishGroup] = useState("must");
  const [wishVis, setWishVis] = useState("public");

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
    setWishName("");
    setWishPrice("");
    setWishNote("");
    setWishGroup("must");
    setWishVis("public");
  }

  function groupItems(g) {
    return wishlist.filter((w) => w.group === g);
  }

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="text-lg font-semibold">我的心愿单</div>
          <div className="text-xs text-neutral-500">
            告诉朋友你喜欢什么，避免尴尬礼物
          </div>
        </div>
        <button className="text-xs text-indigo-600 underline">
          分享心愿单
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 flex flex-col gap-2">
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

      <button
        className="w-full border border-dashed border-indigo-400 text-indigo-600 rounded-2xl py-4 text-sm font-semibold"
        onClick={() => setShowAddWish(true)}
      >
        + 添加心愿
      </button>

      {showAddWish && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-2xl p-4 flex flex-col gap-4 shadow-xl">
            <div className="text-base font-semibold text-neutral-900">
              添加心愿
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

            <div className="text-xs text-neutral-500">
              心愿类型
            </div>
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

            <div className="text-xs text-neutral-500">
              谁可以看到？
            </div>
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
                onClick={() => setShowAddWish(false)}
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
      )}
    </div>
  );
}

function WishGroupBlock({ title, items }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm font-semibold text-neutral-900">
        {title}
      </div>
      <div className="flex flex-col gap-3">
        {items.length === 0 && (
          <div className="text-xs text-neutral-400 border border-neutral-200 rounded-xl p-3 text-center">
            暂无
          </div>
        )}
        {items.map((it) => (
          <div
            key={it.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 flex flex-col gap-1"
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
        ))}
      </div>
    </div>
  );
}

function visLabel(v) {
  if (v === "public") return "公开";
  if (v === "close") return "亲密好友";
  if (v === "private") return "仅自己";
  return v;
}

function FriendsTabUI({ wishlist }) {
  const publicItems = wishlist.filter(
    (w) => w.visibility !== "private"
  );

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="text-lg font-semibold">
          好友心愿单示例
        </div>
        <div className="text-xs text-neutral-500">
          这是别人分享给你的链接落地页形态
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 flex items-start gap-3">
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

      <div className="flex flex-col gap-3">
        {publicItems.map((it) => (
          <div
            key={it.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 flex flex-col gap-2"
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
  );
}

function AddPersonModal({
  close,
  save,
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

  function handleSave() {
    if (!npName) {
      alert("请填写称呼/昵称");
      return;
    }
    save({
      name: npName,
      gender: npGender,
      ageRange: npAge,
      relation: npRelation,
      interests: npInterests,
      taboo: npTaboo,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
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
          <div className="text-xs text-neutral-500">
            兴趣标签
          </div>
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
          <div className="text-xs text-neutral-500">
            雷区 / 禁忌
          </div>
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
            onClick={handleSave}
          >
            保存这个对象
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanModal({
  gift,
  close,
  confirm,
  planDate,
  setPlanDate,
  planRemind,
  setPlanRemind,
  planCustomRemind,
  setPlanCustomRemind,
  planNote,
  setPlanNote,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
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
          <div className="text-xs text-neutral-500">
            计划送礼日期
          </div>
          <input
            type="date"
            className="w-full rounded-xl border border-neutral-300 p-3 text-sm"
            value={planDate}
            onChange={(e) => setPlanDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-xs text-neutral-500">提醒我</div>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { val: "today", label: "当天上午9点" },
              { val: "3d", label: "提前3天" },
              { val: "custom", label: "自定义" },
            ].map((opt) => (
              <button
                key={opt.val}
                className={
                  "rounded-xl border px-3 py-2 " +
                  (planRemind === opt.val
                    ? "bg-indigo-50 border-indigo-400 text-indigo-600"
                    : "bg-white border-neutral-300 text-neutral-800")
                }
                onClick={() => setPlanRemind(opt.val)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {planRemind === "custom" && (
            <input
              className="w-full rounded-xl border border-neutral-300 p-3 text-sm"
              placeholder="比如 提前1天 晚上8点提醒"
              value={planCustomRemind}
              onChange={(e) =>
                setPlanCustomRemind(e.target.value)
              }
            />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-xs text-neutral-500">
            备注（可选）
          </div>
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

function BottomNav({ tab, setTab }) {
  const items = [
    { key: "send", label: "送礼", icon: "🎁" },
    { key: "calendar", label: "日历", icon: "📅" },
    { key: "friends", label: "好友", icon: "👀" },
    { key: "me", label: "我的", icon: "💖" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex justify-around py-3 text-xs z-40">
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
          <div className="text-base leading-none">{it.icon}</div>
          <div className="leading-none">{it.label}</div>
        </button>
      ))}
    </div>
  );
}

function visLabel(v) {
  if (v === "public") return "公开";
  if (v === "close") return "亲密好友";
  if (v === "private") return "仅自己";
  return v;
}

export default App;