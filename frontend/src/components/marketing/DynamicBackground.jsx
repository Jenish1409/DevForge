export default function DynamicBackground() {
  const dynamicBgStyles = `
  @keyframes drift {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(40px, -60px) scale(1.1); }
    66% { transform: translate(-30px, 40px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes grid-pan {
    0% { transform: translateY(0); }
    100% { transform: translateY(40px); }
  }
  .animate-drift-1 { animation: drift 25s ease-in-out infinite; }
  .animate-drift-2 { animation: drift 35s ease-in-out infinite reverse; }
  .animate-drift-3 { animation: drift 28s ease-in-out infinite 5s; }
  .animate-grid-pan { animation: grid-pan 3s linear infinite; }
  `;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style>{dynamicBgStyles}</style>
      
      {/* Subtle Panning Grid Pattern */}
      <div className="absolute -inset-10 opacity-[0.03] dark:opacity-[0.07] animate-grid-pan"
           style={{
             backgroundImage: 'linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}
      />
      {/* Gradient overlay to fade grid edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/50 to-zinc-50 dark:via-zinc-950/50 dark:to-zinc-950" />

      {/* Floating Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 blur-[120px] animate-drift-1" />
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[60%] rounded-full bg-cyan-500/10 dark:bg-cyan-500/10 blur-[120px] animate-drift-2" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] animate-drift-3" />
      
      {/* Scattered Floating Particles (Stars/Dust) */}
      <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-emerald-400/50 blur-[1px] animate-drift-2" />
      <div className="absolute top-[60%] right-[25%] w-2 h-2 rounded-full bg-cyan-400/50 blur-[2px] animate-drift-1" />
      <div className="absolute top-[40%] left-[45%] w-1 h-1 rounded-full bg-indigo-400/60 blur-[1px] animate-drift-3" />
    </div>
  )
}