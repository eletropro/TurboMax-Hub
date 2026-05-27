import React, { useState, useEffect } from "react";
import { 
  Smartphone, ShieldAlert, Sparkles, TrendingUp, Settings as SettingsIcon, 
  History as HistoryIcon, DollarSign, Users, Bell, Volume2, Navigation, 
  MapPin, Compass, HelpCircle, CheckCircle2, Zap, AlertTriangle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { RideInfo, DriverSettings, DriverStats, AffiliateInfo, NotificationAlert } from "./types";
import OcrScanner from "./components/OcrScanner";
import DashboardView from "./components/DashboardView";
import SettingsView from "./components/SettingsView";
import HistoryView from "./components/HistoryView";
import AffiliatesView from "./components/AffiliatesView";
import OverlayWidget from "./components/OverlayWidget";

export default function App() {
  const [activeTab, setActiveTab] = useState<'radar' | 'dashboard' | 'config' | 'historico' | 'afiliados'>('radar');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Custom alerts notifications state
  const [alerts, setAlerts] = useState<NotificationAlert[]>([
    {
      id: "1",
      type: "info",
      title: "Boas-vindas ao TurboMax HUD",
      message: "Cadastre suas configurações de km e combustível para ter a análise financeira de IA ideal.",
      timestamp: new Date().toISOString(),
      read: false
    }
  ]);

  // Configurations
  const [settings, setSettings] = useState<DriverSettings>({
    fuelPrice: 5.75,
    kmPerLiter: 11.5,
    minPricePerKm: 2.10,
    minPricePerMinute: 0.35,
    minHourlyEarnings: 35.0,
    dailyTarget: 300.0,
    weeklyTarget: 1500.0,
    blockedRegions: ["Capão Redondo", "Complexo da Maré", "Jacarezinho", "Brasilândia", "Periferia Risco"],
    autoOverlayEnabled: true
  });

  // History state preloaded with some realistic simulation entries from "yesterday"
  const [history, setHistory] = useState<RideInfo[]>([
    {
      id: "hist-1",
      app: "Uber",
      category: "Comfort",
      value: 48.50,
      distance: 10.5,
      timeMinutes: 20,
      pickupAddress: "Aeroporto de Congonhas, São Paulo",
      destinationAddress: "Av. Paulista, 1200 - Bela Vista",
      classification: "excellent",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      fuelCost: 5.25,
      netProfit: 43.25,
      earningsPerKm: 4.62,
      earningsPerMinute: 2.43,
      recommendation: "accept",
      aiExplanation: "Corrida excelente! R$ 4,62 por km rodado e R$ 145 por hora. Ótimo custo-benefício.",
      riskLevel: "low"
    },
    {
      id: "hist-2",
      app: "99",
      category: "99Pop",
      value: 14.20,
      distance: 8.4,
      timeMinutes: 25,
      pickupAddress: "Rua Augusta, 1500 - Consolação",
      destinationAddress: "Vila Guilherme, Zona Norte",
      classification: "average",
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      fuelCost: 4.20,
      netProfit: 10.00,
      earningsPerKm: 1.69,
      earningsPerMinute: 0.57,
      recommendation: "attention",
      aiExplanation: "Atenção: R$ 1,69 por km fica um pouco abaixo da taxa ideal de R$ 2,00. O trânsito local encarece o tempo.",
      riskLevel: "medium"
    }
  ]);

  // Affiliate module state
  const [affiliate, setAffiliate] = useState<AffiliateInfo>({
    referralCode: "DRIVER-JET-8392",
    referralsCount: 5,
    commissionsEarned: 25.00,
    plan: "gratis"
  });

  // Main interactive active test ride scanner hook
  const [activeRide, setActiveRide] = useState<RideInfo | null>({
    id: "init-ride",
    app: "Uber",
    category: "UberX",
    value: 34.50,
    distance: 7.2,
    timeMinutes: 18,
    pickupAddress: "Av. Paulista, 1000 - Bela Vista, São Paulo",
    destinationAddress: "Av. Ibirapuera, 2100 - Moema, São Paulo",
    classification: "excellent",
    timestamp: new Date().toISOString(),
    fuelCost: 3.60,
    netProfit: 30.90,
    earningsPerKm: 4.79,
    earningsPerMinute: 1.92,
    recommendation: "accept",
    aiExplanation: "Selecione uma corrida do simulador acima ou faça upload de um print para iniciar! Esta corrida de teste da Av. Paulista para Moema oferece excelentes R$ 4,79 por km.",
    riskLevel: "low"
  });

  // Simulated Overlay floating HUD state
  const [overlayRide, setOverlayRide] = useState<RideInfo | null>(null);

  // Compute stats on-the-fly from the accepted ride history
  const [stats, setStats] = useState<DriverStats>({
    totalEarnings: 62.70,
    totalKm: 18.9,
    totalTimeMinutes: 45,
    acceptedCount: 2,
    rejectedCount: 1,
    scannedCount: 3
  });

  // Re-calculate statistics dynamically whenever the history changes
  useEffect(() => {
    const acceptedOnly = history.filter(h => h.recommendation === "accept");
    const totalEarnings = history.reduce((acc, curr) => acc + curr.value, 0);
    const totalKm = history.reduce((acc, curr) => acc + curr.distance, 0);
    const totalTimeMinutes = history.reduce((acc, curr) => acc + curr.timeMinutes, 0);
    const acceptedCount = history.filter(h => h.recommendation === "accept").length;
    const rejectedCount = history.filter(h => h.recommendation === "reject").length;

    setStats({
      totalEarnings,
      totalKm,
      totalTimeMinutes,
      acceptedCount,
      rejectedCount,
      scannedCount: history.length
    });
  }, [history]);

  // Hook triggered when a ride is scanned
  const handleRideAnalyzed = (ride: RideInfo) => {
    setActiveRide(ride);
    
    // Auto-open HUD overlay on-screen instantly when ride starts (non-manual)
    if (settings.autoOverlayEnabled) {
      setOverlayRide(ride);
    }
    
    // Automatically trigger notification alerts
    const newAlert: NotificationAlert = {
      id: Math.random().toString(),
      type: ride.recommendation === "accept" ? "excellent" : ride.recommendation === "reject" ? "danger" : "info",
      title: ride.recommendation === "accept" ? "🔥 Corrida Excelente!" : ride.recommendation === "reject" ? "⚠️ Fora de Margem / Risco" : "Atenção Operacional",
      message: `${ride.app} de R$ ${ride.value.toFixed(2)} (${ride.distance}km). Lucro líquido de R$ ${ride.netProfit}.`,
      timestamp: new Date().toISOString(),
      read: false
    };

    setAlerts(prev => [newAlert, ...prev]);

    // Feed sound trigger logic
    if (activeTab !== "radar") {
      setActiveTab("radar");
    }
  };

  // Log ride decision inside driver history
  const handleRecordRideHistory = (ride: RideInfo) => {
    // Add to state history
    setHistory(prev => [ride, ...prev]);
    
    // Trigger small animation feedback
    const completedAlert: NotificationAlert = {
      id: Math.random().toString(),
      type: "info",
      title: "Salvo no Histórico",
      message: `Corrida de R$ ${ride.value.toFixed(2)} cadastrada com sucesso nas métricas de ganhos diários.`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setAlerts(prev => [completedAlert, ...prev]);
  };

  // Actions for simulated driver screen buttons
  const executeSimulationChoice = (status: 'accept' | 'reject') => {
    if (!activeRide) return;
    const finalRide = {
      ...activeRide,
      recommendation: status === 'accept' ? 'accept' as const : 'reject' as const,
      timestamp: new Date().toISOString()
    };
    handleRecordRideHistory(finalRide);
  };

  const clearHistory = () => {
    setHistory([]);
    setAlerts([]);
  };

  const handleUpgradePlan = (plan: 'gratis' | 'premium') => {
    setAffiliate(prev => ({
      ...prev,
      plan: plan
    }));
  };

  const handleMockLogin = (provider: 'google' | 'apple') => {
    setUserEmail(provider === 'google' ? "motorista.parceiro@gmail.com" : "apple.driver@icloud.com");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col font-sans antialiased relative overflow-x-hidden selection:bg-blue-600 selection:text-white pb-3">
      
      {/* Space grid background visual glow decorations - Blue based */}
      <div className="absolute top-[-250px] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-950/20 blur-[130px] pointer-events-none select-none animate-pulse" />
      <div className="absolute bottom-[10%] right-[5%] w-[450px] h-[450px] rounded-full bg-emerald-950/10 blur-[130px] pointer-events-none select-none" />

      {/* Floating HUD Widget wrapper if active */}
      {overlayRide && (
        <OverlayWidget 
          ride={overlayRide} 
          onClose={() => setOverlayRide(null)} 
        />
      )}

      {/* Primary Top Header bar - Polished Bento Style */}
      <header id="drivermax-header" className="sticky top-0 z-40 bg-[#111111]/85 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/20 transition-transform duration-300 hover:scale-105">
            <Zap className="w-5 h-5 text-white stroke-[3px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-display">TURBO<span className="text-blue-500">MAX HUD</span></h1>
              <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">PRO v2.6</span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Intelligent Cruise & Ride Assistant</p>
          </div>
        </div>

        {/* Global summary metric indicators - Bento Segment */}
        <div className="hidden md:flex items-center gap-6 text-xs border border-white/5 bg-white/5 px-5 py-2.5 rounded-2xl backdrop-blur-md">
          <div className="text-center">
            <span className="text-[9px] text-slate-500 font-mono block uppercase font-bold">Hoje Bruto</span>
            <span className="font-bold text-white font-mono text-sm">R$ {stats.totalEarnings.toFixed(2)}</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-center">
            <span className="text-[9px] text-slate-500 font-mono block uppercase font-bold">Taxa de Aceite</span>
            <span className="font-bold text-emerald-400 font-mono text-sm">
              {stats.scannedCount > 0 ? Math.round((stats.acceptedCount / stats.scannedCount) * 100) : 100}%
            </span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-center">
            <span className="text-[9px] text-slate-500 font-mono block uppercase font-bold">Plano Ativo</span>
            <span className="font-bold text-blue-400 font-mono flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-blue-400" />
              {affiliate.plan === "premium" ? "PRO PREMIUM" : "GRÁTIS"}
            </span>
          </div>
        </div>

        {/* User alert dropdown badge indicator */}
        <div className="flex items-center gap-3">
          {alerts.length > 0 && (
            <div className="relative group">
              <button className="p-2.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer">
                <Bell className="w-4 h-4 text-blue-400" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              </button>

              {/* Toggle notification inline overlay popover listing */}
              <div className="absolute right-0 top-11 w-72 bg-[#111111] border border-white/10 rounded-2xl p-4 shadow-2xl space-y-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-50">
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest border-b border-white/5 pb-1.5 font-bold">Alertas Recentes ({alerts.length})</p>
                <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                  {alerts.map((al, idx) => (
                    <div key={idx} className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-[11px] leading-snug">
                      <p className="font-semibold text-white">{al.title}</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">{al.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {userEmail && (
            <div className="text-xs font-mono text-slate-400 hidden lg:block bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              {userEmail}
            </div>
          )}
        </div>
      </header>

      {/* Main Responsive Grid Layout containing side-by-side emulator */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
        
        {/* Left Side: Desktop Workspace Menu tabs and controls */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Internal Tab menu tags navigation - Bento Style */}
          <nav id="drivermax-menu" className="flex flex-wrap gap-1.5 bg-[#111111] p-2 border border-white/10 rounded-2xl shadow-xl self-start">
            <button
              onClick={() => setActiveTab('radar')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-250 cursor-pointer ${
                activeTab === "radar" ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] border border-blue-400/20" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Radar OCR e IA</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-250 cursor-pointer ${
                activeTab === "dashboard" ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] border border-blue-400/20" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Painel de Ganhos</span>
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-250 cursor-pointer ${
                activeTab === "config" ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] border border-blue-400/20" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Metas e Carro</span>
            </button>
            <button
              onClick={() => setActiveTab('historico')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-250 cursor-pointer ${
                activeTab === "historico" ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] border border-blue-400/20" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <HistoryIcon className="w-4 h-4" />
              <span>Historial</span>
            </button>
            <button
              onClick={() => setActiveTab('afiliados')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-250 cursor-pointer ${
                activeTab === "afiliados" ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] border border-blue-400/20" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Afiliados e Planos</span>
            </button>
          </nav>

          {/* Active Workspaces Render view */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.18 }}
              >
                {activeTab === "radar" && (
                  <OcrScanner 
                    settings={settings} 
                    onRideAnalyzed={handleRideAnalyzed} 
                    activeOverlayRide={overlayRide}
                    setOverlayRide={setOverlayRide}
                  />
                )}
                
                {activeTab === "dashboard" && (
                  <DashboardView 
                    stats={stats} 
                    settings={settings} 
                    history={history}
                  />
                )}

                {activeTab === "config" && (
                  <SettingsView 
                    settings={settings} 
                    onSaveSettings={(updated) => setSettings(updated)} 
                  />
                )}

                {activeTab === "historico" && (
                  <HistoryView 
                    history={history} 
                    onClearHistory={clearHistory}
                  />
                )}

                {activeTab === "afiliados" && (
                  <AffiliatesView 
                    affiliate={affiliate} 
                    onUpgradePlan={handleUpgradePlan} 
                    mockLogin={handleMockLogin}
                    userEmail={userEmail}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Immersive Cell Phone driving screen emulator */}
        <div id="visual-phone-simulator" className="lg:col-span-4 flex flex-col items-center justify-start">
          <div className="sticky top-[100px] w-full max-w-[340px] bg-[#0c0c0c] border-[6px] border-[#222] rounded-[44px] aspect-[9/18.5] shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(37,99,235,0.12)] overflow-hidden flex flex-col justify-between relative">
            
            {/* Phone speaker notch design */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-[#222] rounded-b-2xl z-50 flex items-center justify-center">
              <span className="w-12 h-1 bg-[#0f0f0f] rounded-full mr-2" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e293b]" />
            </div>

            {/* Simulated Live Top Banner GPS route */}
            <div className="bg-[#0b1328] px-4 pt-8 pb-3.5 border-b border-slate-900 flex justify-between items-center text-[10px] text-slate-400 select-none font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE (5G)
              </span>
              <span>12:52 PM</span>
            </div>

            {/* Simulated phone screen body content */}
            <div className="flex-1 relative flex flex-col bg-[#070b16] select-none p-4 divide-y divide-slate-900 overflow-hidden">
              
              {activeRide ? (
                /* Receiving call offer state visual matching Uber or 99 UI */
                <div className="flex-1 flex flex-col justify-between space-y-4 animate-fade-in pt-2">
                  <div className="space-y-3.5">
                    
                    {/* Platform logo badge offer header */}
                    <div className="flex justify-between items-center bg-[#111111] p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full ${activeRide.app === "Uber" ? "bg-white" : "bg-yellow-500"}`} />
                        <span className="text-xs font-black text-white">{activeRide.app} Oferta</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">{activeRide.category}</span>
                    </div>

                    {/* Vector GPS Simulated Route display */}
                    <div className="relative h-24 bg-black rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
                      {/* Grid background simulation */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:14px_24px] opacity-20" />
                      
                      {/* Driver coordinates overlay map visual elements */}
                      <div className="absolute w-[200px] h-[200px] rounded-full border border-blue-500/10 animate-ping opacity-60" />
                      <div className="absolute w-[100px] h-[100px] rounded-full border border-blue-500/20" />
                      
                      {/* Real-time route line */}
                      <svg className="w-full h-full absolute" viewBox="0 0 100 80">
                        <path d="M 20 60 Q 50 10 80 30" fill="transparent" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3,3" />
                        <circle cx="20" cy="60" r="4" fill="#10b981" />
                        <circle cx="80" cy="30" r="4" fill="#2563eb" />
                      </svg>

                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/90 p-1 px-2 rounded text-[9px] font-mono border border-white/10">
                        <Navigation className="w-2.5 h-2.5 text-blue-400" />
                        <span>Ver Rota GPS</span>
                      </div>
                    </div>

                    {/* Ride detailed metrics from Uber offer */}
                    <div className="space-y-1.5 p-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Preço Oferecido:</span>
                        <span className="font-extrabold text-white text-xs">R$ {activeRide.value.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total KM Viagem:</span>
                        <span className="font-bold text-slate-200 font-mono">{activeRide.distance.toFixed(1)} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duração Viagem:</span>
                        <span className="font-bold text-slate-200 font-mono">{activeRide.timeMinutes} min</span>
                      </div>
                    </div>

                  </div>

                  {/* JetMax Custom Floating Super-Overlay HUD injected on simulator screen! */}
                  <div className="bg-[#111111]/95 border border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.2)] rounded-2xl p-3.5 space-y-2 relative overflow-hidden">
                    <div className="flex justify-between items-center border-b border-white/5 pb-1.5 text-[9px] font-mono">
                      <span className="text-blue-400 font-bold flex items-center gap-1 text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> JetMax Auto-HUD
                      </span>
                      <span className={`font-bold uppercase text-[10px] ${
                        activeRide.classification === "excellent" ? "text-emerald-400" : "text-amber-500"
                      }`}>{activeRide.classification}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] py-1 text-center font-mono">
                      <div className="bg-white/5 p-1.5 rounded-xl border border-white/5">
                        <span className="text-[8px] text-slate-500 block uppercase font-bold">R$ / KM</span>
                        <span className="font-bold text-slate-200 text-xs">R${activeRide.earningsPerKm.toFixed(2)}</span>
                      </div>
                      <div className="bg-white/5 p-1.5 rounded-xl border border-white/5">
                        <span className="text-[8px] text-slate-500 block uppercase font-bold">LÍQUIDO EST.</span>
                        <span className="font-bold text-emerald-400 text-xs">R${activeRide.netProfit.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-[9px] text-slate-300 leading-tight border border-white/5 p-1.5 rounded-xl bg-white/5">
                      {activeRide.recommendation === "accept" ? "💡 IA sugere aceitar esta corrida imediatamente!" : "⚠️ IA sugere recusar devido a rentabilidade."}
                    </p>
                  </div>

                  {/* Accept / Reject actions at bottom matching native Uber driver screen buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pb-2">
                    <button
                      onClick={() => executeSimulationChoice('reject')}
                      className="py-2.5 bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-white border border-red-500/20 text-xs font-semibold rounded-xl transition-all cursor-pointer text-center"
                    >
                      Recusar
                    </button>
                    <button
                      onClick={() => executeSimulationChoice('accept')}
                      className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all cursor-pointer text-center shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                    >
                      Aceitar Oferta
                    </button>
                  </div>
                </div>
              ) : (
                /* Idle driving status GPS tracking coordinate */
                <div className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-4 pt-12 animate-fade-in">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center animate-pulse">
                      <Compass className="w-8 h-8 text-blue-500" />
                    </div>
                    {/* Pulsing signal halo */}
                    <div className="absolute inset-0 rounded-full border border-blue-500/10 scale-125 animate-ping opacity-40" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Busca por Viagens Ativa</h4>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-[180px]">
                      Pronto para leitura da tela. Use os controles de presets do TurboMax no painel à esquerda.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Small Simulated Home handle device bezel bar */}
            <div className="bg-[#111111] py-2.5 flex justify-center border-t border-white/5">
              <span className="w-20 h-1 bg-[#222222] rounded-full" />
            </div>

          </div>
        </div>

      </main>

      {/* Modern Mini-Footer Copyright credits with no margin telemetry clutter */}
      <footer className="bg-[#0a0a0a] border-t border-white/5 py-8 text-center text-xs text-slate-500 mt-auto select-none">
        <p>© 2026 TurboMax Optimizer Corp. Projetado para motoristas Uber & 99 de alta lucratividade.</p>
        <p className="text-[10px] text-slate-600 mt-1">Conectividade baseada em Google ML Kit, Tesseract e Gemini AI.</p>
      </footer>

    </div>
  );
}
