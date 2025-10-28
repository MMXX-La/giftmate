// src/App.jsx

import React, { useState, useEffect } from "react";
import { visLabel, loadFromLocalStorage, saveToLocalStorage } from "./utils/helpers.js";
import BottomNav from "./components/BottomNav.jsx";
import PageHeader from "./components/PageHeader.jsx";
import AddPersonModal from "./components/AddPersonModal.jsx";
import PlanModal from "./components/PlanModal.jsx";
import AddWishModal from "./components/AddWishModal.jsx";
import SendTab from "./components/SendTab.jsx";
import RecPage from "./components/RecPage.jsx";
import CalendarTab from "./components/CalendarTab.jsx";
import MeTab from "./components/MeTab.jsx";
import FriendsTab from "./components/FriendsTab.jsx";
import { allGifts } from "./utils/giftDatabase.js";

/* ---------- 新增的工具函数 ---------- */

// 把预算字符串 (如 "100-300" 或 "<50") 转换成对象
function parseBudget(budgetStr) {
  if (budgetStr === "<50") {
    return { min: 0, max: 50 };
  }
  if (budgetStr === "600+") {
    return { min: 600, max: Infinity };
  }
  const parts = budgetStr.split("-");
  if (parts.length === 2) {
    return { min: parseInt(parts[0], 10), max: parseInt(parts[1], 10) };
  }
  return { min: 0, max: Infinity }; // 默认情况
}


/* ---------- 主应用 ---------- */

function App() {
  // ... (所有的 useState 状态都保持不变) ...
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
        giftName: "星巴克五月天限定保温杯",
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
        giftName: "小罐茶",
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
        name: "Switch Pro2手柄",
        priceHint: "约￥500",
        note: "要正版",
        visibility: "public",
      },
      {
        id: "w2",
        group: "must",
        name: "Labubu联名挂件",
        priceHint: "￥60左右",
        note: "最好是黄/米白，别挑蓝色",
        visibility: "close",
      },
      {
        id: "w3",
        group: "nice",
        name: "蒸汽眼罩",
        priceHint: "￥30-50",
        note: "有叶黄素",
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

  // ... (两个 useEffect 保持不变) ...
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

  // ... (所有的 useState 状态都保持不变) ...
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

// 生成推荐 (V4: 修复了“职场安全”礼物会泄露给非职场关系的BUG)
  function generateRecommendations() {
    if (!selectedPersonId || !scenario || !budget) {
      alert("请先把 送给谁 / 场合 / 预算 都选好");
      return;
    }

    const person = getPersonById(selectedPersonId);
    const sc = scenario === "其他" ? customScenario : scenario;
    
    // 1. 获取所有需要的数据
    const personInterests = person?.interests || []; // 兴趣
    const personRelation = person?.relation || ""; // 关系
    const personTaboo = person?.taboo || ""; // 雷区字符串
    const selectedBudget = parseBudget(budget); // 预算对象 {min, max}

    let recommendedGifts = [];

    // 2. 过滤器 1: 按兴趣/关系匹配
    if (personRelation.includes("上级") || personRelation.includes("老师") || sc.includes("上级")) {
      recommendedGifts = allGifts.filter(gift => 
        gift.tags.includes("职场安全")
      );
    } 
    else {
      // 找出所有匹配兴趣的礼物 (**** BUG修复在这里 ****)
      const interestMatches = allGifts.filter(gift => 
        !gift.tags.includes("职场安全") && // <--- 增加了这个条件！
        personInterests.some(interest => gift.tags.includes(interest))
      );
      
      // 找出所有“通用”礼物
      const generalGifts = allGifts.filter(gift => 
        gift.tags.includes("通用") && !gift.tags.includes("职场安全")
      );
      
      // 合并两者（并去重）
      const combined = [...interestMatches, ...generalGifts];
      recommendedGifts = [...new Set(combined)];
    }

    // 3. 过滤器 2: 排除雷区
    recommendedGifts = recommendedGifts.filter(gift => {
      if (gift.tabooTags.length === 0) return true;
      const isHitTaboo = gift.tabooTags.some(tag => personTaboo.includes(tag));
      return !isHitTaboo;
    });

    // 4. 过滤器 3: 筛选预算
    recommendedGifts = recommendedGifts.filter(gift => {
      const hasOverlap = gift.maxPrice >= selectedBudget.min && gift.minPrice <= selectedBudget.max;
      return hasOverlap;
    });
    
    // 预算档位说明（这个不变）
    const budgetNoteMap = {
      "<50": "走心小物，不会给对方压力",
      "50-100": "有心意但不夸张",
      "100-300": "生日/纪念日档位，会被记住",
      "300-600": "属于‘我很在意你’，注意关系边界",
      "600+": "奢重档位，可能把关系往前推一大步",
    };

    // 5. 格式化最终结果
    const finalList = recommendedGifts.map((item, idx) => ({
      ...item,
      id: `rec_${Date.now()}_${idx}`,
      scenario: sc,
      budget,
      budgetNote: budgetNoteMap[budget] || "",
      personId: selectedPersonId,
      price: item.priceText, // 确保 price 字段是文本
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
      priceHint: planTargetGift.priceText, // 使用 priceText
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

  // ... (markBought, saveNewPerson, addWish 函数都保持不变) ...
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
        setShowAddWish={() => setShowAddWish(true)} // 简化传递
        // (MeTab 不再需要那么多 props 了)
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

export default App;