// src/utils/helpers.js

// 标签翻译：公开 / 亲密好友 / 仅自己
export function visLabel(v) {
  if (v === "public") return "公开";
  if (v === "close") return "亲密好友";
  if (v === "private") return "仅自己";
  return v;
}

// localStorage 读
export function loadFromLocalStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// localStorage 写
export function saveToLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}