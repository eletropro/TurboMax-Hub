import React from "react";
import { DollarSign, Percent, TrendingUp, Compass, Flame, ArrowUpRight, Zap, Award } from "lucide-react";
import { RideInfo, DriverSettings, DriverStats } from "../types";

interface DashboardViewProps {
  stats: DriverStats;
  settings: DriverSettings;
  history: RideInfo[];
}

export default function DashboardView({ stats, settings, history }: DashboardViewProps) {
  // Safe defaults
  const totalEarned = stats.totalEarnings;
  const processedCount = stats.scannedCount;
  const acceptedCount = stats.acceptedCount;
  const rejectedCount = stats.rejectedCount;
  const totalKm = stats.totalKm;

  // Compute stats helper
  const acceptRatio = processedCount > 0 ? Math.round((acceptedCount / processedCount) * 100) : 0;
  const averageEarnedPerKm = totalKm > 0 ? parseFloat((totalEarned / totalKm).toFixed(2)) : 0;

  // Target goals percentages
  const dailyProgress = Math.min(Math.round((totalEarned / settings.dailyTarget) * 100), 100);
  const weeklyProgress = Math.min(Math.round((totalEarned / settings.weeklyTarget) * 100), 100);

  // Heatmap cities zones simulation for Brazil
  const hotZones = [
    { neighborhood: "Itaim Bibi / Berrini", demandMultiplier: "2.1x", averagePrice: "R$ 38.50/corrida", status: "Excelente", color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/20" },
    { neighborhood: "Congonhas Aeroporto", demandMultiplier: "1.9x", averagePrice: "R$ 48.00/corrida", status: "Muito Alta", color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/20" },
    { neighborhood: "Vila Madalena / Pinheiros", demandMultiplier: "1.7x", averagePrice: "R$ 29.30/corrida", status: "Alta", color: "text-cyan-400 bg-cyan-950/40 border-cyan-500/20" },
    { neighborhood: "Barra da Tijuca (RJ)", demandMultiplier: "1.8x", averagePrice: "R$ 41.20/corrida", status: "Alta", color: "text-cyan-400 bg-cyan-950/40 border-cyan-500/20" },
    { neighborhood: "Savassi / Lourdes (BH)", demandMultiplier: "1.6x", averagePrice: "R$ 24.50/corrida", status: "Estável-Alta", color: "text-amber-400 bg-amber-950/40 border-amber-500/20" }
  ];

  // Group real history by day of week to construct authentic charts
  const daysOfWeek = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const weeklyData = daysOfWeek.map(day => ({ day, value: 0 }));

  history.forEach(ride => {
    try {
      const date = new Date(ride.timestamp);
      // Get standard day index where 0 is Sunday, 1 is Monday, etc.
      const rawDayIndex = date.getDay();
      // Map so Monday is index 0, Sunday is index 6
      const mappedIndex = rawDayIndex === 0 ? 6 : rawDayIndex - 1;
      if (mappedIndex >= 0 && mappedIndex < 7) {
        weeklyData[mappedIndex].value += parseFloat(ride.value.toFixed(2));
      }
    } catch (err) {
      // safe fallback
    }
  });

  const maxWeeklyVal = Math.max(...weeklyData.map(d => d.value)) || 100;

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Earned Card */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-lg hover:border-white/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase font-bold">Ganhos Detetados</p>
              <h2 className="text-2xl font-extrabold font-mono text-white mt-1.5">R$ {totalEarned.toFixed(2)}</h2>
            </div>
            <div className="p-2.5 bg-emerald-600/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between font-mono">
            <span className="text-[10px] text-slate-400">Estimados via aceites</span>
            <span className="text-[10px] text-emerald-400 flex items-center bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
              <TrendingUp className="w-3 h-3 mr-1" /> +14.2%
            </span>
          </div>
        </div>

        {/* Dynamic Accept Ratio Card */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-lg hover:border-white/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase font-bold">Taxa de Aceite IA</p>
              <h2 className="text-2xl font-extrabold font-mono text-white mt-1.5">{acceptRatio}%</h2>
            </div>
            <div className="p-2.5 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between font-mono">
            <span className="text-[10px] text-slate-400">Filtrando corridas ruins</span>
            <span className="text-[10px] text-blue-400 bg-blue-950/40 px-2.5 py-0.5 rounded-full border border-blue-500/20 font-bold">
              {acceptedCount} Aceit / {processedCount} Anal
            </span>
          </div>
        </div>

        {/* Average per KM */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-lg hover:border-white/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase font-bold">Média Líquida por KM</p>
              <h2 className="text-2xl font-extrabold font-mono text-white mt-1.5">R$ {averageEarnedPerKm > 0 ? averageEarnedPerKm.toFixed(2) : settings.minPricePerKm.toFixed(2)}/km</h2>
            </div>
            <div className="p-2.5 bg-amber-600/10 text-amber-500 rounded-xl border border-amber-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between font-mono">
            <span className="text-[10px] text-slate-400">Mínimo cadastrado: R$ {settings.minPricePerKm.toFixed(2)}</span>
            <span className="text-[10px] text-amber-400 bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-bold">
              Sua meta
            </span>
          </div>
        </div>

        {/* Processed Rides Card */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-lg hover:border-white/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase font-bold">Quilometragem IA</p>
              <h2 className="text-2xl font-extrabold font-mono text-white mt-1.5">{totalKm.toFixed(1)} km</h2>
            </div>
            <div className="p-2.5 bg-purple-600/10 text-purple-400 rounded-xl border border-purple-500/20">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between font-mono">
            <span className="text-[10px] text-slate-400">Total rodado em simulação</span>
            <span className="text-[10px] text-purple-400 bg-purple-950/40 px-2.5 py-0.5 rounded-full border border-purple-500/20 font-bold">
              {stats.totalTimeMinutes} min dirigidos
            </span>
          </div>
        </div>
      </div>

      {/* Targets and Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Custom Premium Chart of DriverMax performance */}
        <div className="lg:col-span-8 bg-[#111111] border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-widest block">Rendimento Financeiro</span>
                <h3 className="text-base font-bold text-white">Análise de Lucros da Semana</h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Ganhos R$
                </span>
                <span className="text-[10px] text-slate-500">Atualizado: Agora</span>
              </div>
            </div>

            {/* Premium custom responsive SVG barchart */}
            <div className="relative w-full h-[220px] flex items-end">
              {weeklyData.reduce((acc, curr) => acc + curr.value, 0) === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 rounded-2xl border border-white/5 pointer-events-none select-none z-10">
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider mb-1">Gráfico de Ganhos Zerado</span>
                  <p className="text-[10px] text-slate-500 font-mono text-center px-4 max-w-xs">
                    Aguardando a primeira corrida do simulador para gerar a projeção semanal.
                  </p>
                </div>
              )}
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                {/* Y grids */}
                <line x1="30" y1="20" x2="580" y2="20" stroke="#222222" strokeDasharray="3,3" />
                <line x1="30" y1="80" x2="580" y2="80" stroke="#222222" strokeDasharray="3,3" />
                <line x1="30" y1="140" x2="580" y2="140" stroke="#222222" strokeDasharray="3,3" />
                <line x1="30" y1="190" x2="580" y2="190" stroke="#333333" />

                {/* Bars */}
                {weeklyData.map((d, index) => {
                  const barWidth = 32;
                  const totalBars = weeklyData.length;
                  const chartWidthAvailable = 550;
                  const x = 30 + (index * (chartWidthAvailable / totalBars)) + (chartWidthAvailable / totalBars - barWidth) / 2;
                  
                  // Compute height proportionally
                  const height = (d.value / maxWeeklyVal) * 150;
                  const y = 190 - height;
                  
                  return (
                    <g key={index} className="group cursor-pointer">
                      {/* Interactive hover tooltip simulation background */}
                      <rect
                        x={x - 10}
                        y="10"
                        width={barWidth + 20}
                        height="180"
                        fill="transparent"
                        className="hover:fill-blue-500/5 transition-colors duration-200"
                      />
                      
                      {/* Rounded neon gradient simulation bar */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={height}
                        rx="6"
                        fill="url(#bentoBlueGradient)"
                        className="transition-all duration-300"
                      />

                      {/* Spark glow overlay */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height="12"
                        rx="4"
                        fill="#2563eb"
                        opacity="0.8"
                      />

                      {/* Text value on top of bars */}
                      <text
                        x={x + barWidth / 2}
                        y={y - 8}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="700"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-mono"
                      >
                        R${d.value}
                      </text>
                    </g>
                  );
                })}

                {/* Definitions for gorgeous premium blue gradients */}
                <defs>
                  <linearGradient id="bentoBlueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="60%" stopColor="#1e40af" />
                    <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* X Labels */}
            <div className="flex justify-between pl-8 pr-6 mt-2 text-xs font-mono text-slate-500 select-none font-bold">
              {weeklyData.map((d, idx) => (
                <span key={idx}>{d.day}</span>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-6 flex justify-between text-xs items-center font-mono">
            <p className="text-slate-400">Total da semana em simulação:</p>
            <p className="font-bold text-white text-sm">R$ {weeklyData.reduce((acc, curr) => acc + curr.value, 0).toFixed(2)}</p>
          </div>
        </div>

        {/* Neon target trackers widget */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 space-y-6 flex flex-col justify-between h-full shadow-xl">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide mb-5 uppercase font-mono text-blue-400">Objetivos & Ganhos</h3>
              
              <div className="space-y-6">
                {/* Daily Goal Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs text-slate-300 font-semibold">Meta Diária</span>
                      <p className="text-[10px] text-slate-450 font-mono">Consumo da meta estipulada</p>
                    </div>
                    <span className="text-xs font-extrabold font-mono text-blue-400">{dailyProgress}%</span>
                  </div>
                  
                  <div className="h-3 bg-black rounded-full overflow-hidden border border-white/5 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${dailyProgress}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-slate-450 font-mono font-bold">
                    <span>Acumulado: R${totalEarned.toFixed(0)}</span>
                    <span>Alvo: R${settings.dailyTarget.toFixed(0)}</span>
                  </div>
                </div>

                {/* Weekly Goal Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs text-slate-300 font-semibold">Meta Semanal</span>
                      <p className="text-[10px] text-slate-450 font-mono">Progresso financeiro semanal</p>
                    </div>
                    <span className="text-xs font-extrabold font-mono text-emerald-400">{weeklyProgress}%</span>
                  </div>
                  
                  <div className="h-3 bg-black rounded-full overflow-hidden border border-white/5 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${weeklyProgress}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-slate-450 font-mono font-bold">
                    <span>Acumulado: R${totalEarned.toFixed(0)}</span>
                    <span>Alvo: R${settings.weeklyTarget.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement card reward */}
            <div className="bg-white/5 p-4 border border-white/5 rounded-2xl flex items-center gap-3.5 mt-4">
              <div className="p-2.5 bg-blue-600/15 rounded-xl text-blue-400 border border-blue-500/20 shrink-0">
                <Award className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Desempenho Otimizado</p>
                <p className="text-[10px] text-slate-400">Você já filtou {rejectedCount} corridas desvantajosas hoje.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-red-600/10 rounded-xl text-red-500 border border-red-500/20">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">Zonas Quentes & Multiplicadores</h3>
            <p className="text-xs text-slate-400">Regiões com os maiores multiplicadores dinâmicos reais registrados no momento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {hotZones.map((z, idx) => (
            <div key={idx} className="p-4.5 bg-white/5 border border-white/5 rounded-2xl space-y-3 hover:border-white/10 transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300 line-clamp-1">{z.neighborhood}</span>
                <span className={`text-[9px] px-2.5 py-0.5 rounded-full border font-mono tracking-wider uppercase font-bold ${
                  z.status === "Excelente" ? "text-emerald-400 bg-emerald-950/40 border-emerald-500/20" :
                  z.status === "Muito Alta" ? "text-blue-400 bg-blue-950/40 border-blue-500/20" : "text-amber-400 bg-amber-950/40 border-amber-500/20"
                }`}>
                  {z.status}
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-extrabold text-white font-mono">{z.demandMultiplier}</span>
                  <span className="text-[10px] text-slate-500 font-mono">dinâmico</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">{z.averagePrice}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
