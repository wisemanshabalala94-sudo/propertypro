const doors = Array.from({ length: 7 }, (_, index) => ({
  id: index,
  size: 100 - index * 11,
  delay: `${index * 1.4}s`
}));

export function InfiniteDoorHero() {
  return (
    <div className="relative mx-auto flex aspect-[1/1.08] w-full max-w-[30rem] items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#071020] shadow-glow">
      <div className="absolute inset-0 bg-grid bg-[size:72px_72px] opacity-[0.14]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(91,140,255,0.26),transparent_42%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(53,224,255,0.08),transparent)] animate-pulseLine" />

      <div className="relative h-[82%] w-[82%] [perspective:1500px]">
        {doors.map((door) => (
          <div
            key={door.id}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] border border-white/15 bg-[linear-gradient(180deg,rgba(18,31,54,0.85),rgba(9,18,32,0.6))] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] [transform-style:preserve-3d] animate-doorDrift"
            style={{
              width: `${door.size}%`,
              height: `${door.size}%`,
              animationDelay: door.delay
            }}
          >
            <div className="absolute inset-[10%] rounded-[1.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(91,140,255,0.08),rgba(53,224,255,0.04),transparent)]" />
            <div className="absolute right-[12%] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-accent.amber shadow-[0_0_20px_rgba(255,184,77,0.8)]" />
          </div>
        ))}

        <div className="absolute left-1/2 top-1/2 h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/20 bg-[linear-gradient(180deg,#1f3356,#0c1527)] shadow-[0_0_50px_rgba(91,140,255,0.25)]">
          <div className="absolute inset-[16%] rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(53,224,255,0.15),rgba(207,124,255,0.12))]" />
          <div className="absolute right-[18%] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-accent.amber shadow-[0_0_20px_rgba(255,184,77,0.85)]" />
          <div className="absolute left-1/2 top-[18%] h-[42%] w-[2px] -translate-x-1/2 rounded-full bg-white/50" />
          <div className="absolute left-1/2 top-[12%] h-10 w-10 -translate-x-1/2 rounded-full border border-accent.cyan/60 bg-[radial-gradient(circle,rgba(53,224,255,0.65),rgba(91,140,255,0.06))] shadow-[0_0_30px_rgba(53,224,255,0.55)]" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-6 bottom-6 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
        <p className="font-display text-base tracking-[0.24em] text-white/75">INFINITE ACCESS</p>
        <p className="mt-2 text-sm leading-7 text-fog">
          One verified key. Infinite doors. Every building, rent stream, approval path, and finance signal in view.
        </p>
      </div>
    </div>
  );
}
