"use client";

import { useState } from "react";

const depthFrames = [
  { size: "100%", delay: "0ms" },
  { size: "76%", delay: "120ms" },
  { size: "54%", delay: "240ms" },
  { size: "36%", delay: "360ms" }
];

export function DoorPortal() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-[28rem]">
      <div className="glass-panel gradient-stroke rounded-[2.25rem] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Access preview</p>
            <h3 className="font-display mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">Open the platform</h3>
          </div>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {open ? "Close doors" : "Open doors"}
          </button>
        </div>

        <div className="relative aspect-[1/1.1] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#071120]">
          <div className="absolute inset-0 bg-grid bg-[size:56px_56px] opacity-[0.08]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(91,140,255,0.16),transparent_48%)]" />

          {depthFrames.map((frame, index) => (
            <div
              key={frame.size}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.5rem] border border-white/12 bg-[linear-gradient(180deg,rgba(14,24,42,0.95),rgba(7,14,26,0.88))] shadow-[0_25px_80px_rgba(0,0,0,0.32)] transition-all duration-700"
              style={{
                width: frame.size,
                height: frame.size,
                transitionDelay: frame.delay,
                transform: `translate(-50%, -50%) scale(${open ? 1 - index * 0.03 : 1})`
              }}
            >
              <div className="absolute inset-[10%] rounded-[1.1rem] border border-white/8 bg-[linear-gradient(135deg,rgba(91,140,255,0.08),rgba(53,224,255,0.03),transparent)]" />
              <div
                className="absolute left-0 top-0 h-full w-1/2 origin-left rounded-l-[1.45rem] border-r border-white/10 bg-[linear-gradient(180deg,rgba(18,31,54,0.98),rgba(10,19,34,0.98))] transition-transform duration-700"
                style={{
                  transform: open ? "perspective(1000px) rotateY(-105deg)" : "perspective(1000px) rotateY(0deg)",
                  transitionDelay: frame.delay
                }}
              />
              <div
                className="absolute right-0 top-0 h-full w-1/2 origin-right rounded-r-[1.45rem] border-l border-white/10 bg-[linear-gradient(180deg,rgba(18,31,54,0.98),rgba(10,19,34,0.98))] transition-transform duration-700"
                style={{
                  transform: open ? "perspective(1000px) rotateY(105deg)" : "perspective(1000px) rotateY(0deg)",
                  transitionDelay: frame.delay
                }}
              />
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent.amber shadow-[0_0_20px_rgba(255,184,77,0.85)]" />
            </div>
          ))}

          <div className="absolute inset-x-6 bottom-6 rounded-[1.4rem] border border-white/10 bg-white/6 px-4 py-3">
            <p className="text-sm leading-7 text-fog">
              A simple interaction, but a clear message: one platform opening into tenant flow, owner control, and admin command.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
