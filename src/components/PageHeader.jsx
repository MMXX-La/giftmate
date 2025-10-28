// src/components/PageHeader.jsx

import React from 'react';

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

export default PageHeader;