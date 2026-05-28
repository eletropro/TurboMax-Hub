import React, { useState } from "react";
import { Fuel, ShieldAlert, Target, ShieldCheck, DollarSign, Plus, Trash2, CheckCircle2, Smartphone } from "lucide-react";
import { DriverSettings } from "../types";

interface SettingsViewProps {
  settings: DriverSettings;
  onSaveSettings: (settings: DriverSettings) => void;
}

export default function SettingsView({ settings, onSaveSettings }: SettingsViewProps) {
  const [fuelPrice, setFuelPrice] = useState(settings.fuelPrice);
  const [kmPerLiter, setKmPerLiter] = useState(settings.kmPerLiter);
  const [minPricePerKm, setMinPricePerKm] = useState(settings.minPricePerKm);
  const [minPricePerMinute, setMinPricePerMinute] = useState(settings.minPricePerMinute);
  const [minHourlyEarnings, setMinHourlyEarnings] = useState(settings.minHourlyEarnings);
  const [dailyTarget, setDailyTarget] = useState(settings.dailyTarget);
  const [weeklyTarget, setWeeklyTarget] = useState(settings.weeklyTarget);
  
  // Regiões bloqueadas
  const [blockedInput, setBlockedInput] = useState("");
  const [blockedRegions, setBlockedRegions] = useState<string[]>(settings.blockedRegions);
  const [autoOverlayEnabled, setAutoOverlayEnabled] = useState(settings.autoOverlayEnabled ?? true);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const handleAddRegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (blockedInput.trim() !== "" && !blockedRegions.includes(blockedInput.trim())) {
      const updated = [...blockedRegions, blockedInput.trim()];
      setBlockedRegions(updated);
      setBlockedInput("");
      
      // Auto-save immediately
      onSaveSettings({
        ...settings,
        blockedRegions: updated,
        autoOverlayEnabled
      });
    }
  };

  const handleRemoveRegion = (indexToRemove: number) => {
    const updated = blockedRegions.filter((_, idx) => idx !== indexToRemove);
    setBlockedRegions(updated);
    
    // Auto-save immediately
    onSaveSettings({
      ...settings,
      blockedRegions: updated,
      autoOverlayEnabled
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      fuelPrice: Number(fuelPrice),
      kmPerLiter: Number(kmPerLiter),
      minPricePerKm: Number(minPricePerKm),
      minPricePerMinute: Number(minPricePerMinute),
      minHourlyEarnings: Number(minHourlyEarnings),
      dailyTarget: Number(dailyTarget),
      weeklyTarget: Number(weeklyTarget),
      blockedRegions,
      autoOverlayEnabled
    });
    
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Visual Feedback saved banner */}
      {showSavedFeedback && (
        <div className="p-4 bg-emerald-600/10 border border-emerald-500/20 text-emerald-300 rounded-3xl flex items-center gap-3.5 animate-slide-in font-mono">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white">Configurações Salvas com Sucesso</p>
            <p className="text-[10px] text-slate-350">As novas metas de km, preços de combustível e bloqueios de segurança já foram aplicados à análise do radar.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Car and minimum metrics */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Fuel cost metrics */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3.5">
              <div className="p-2.5 bg-amber-600/15 rounded-xl text-amber-500 border border-amber-500/20">
                <Fuel className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Custo do Combustível & Carro</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Preço do Litro (R$)</label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-xs font-bold text-slate-500 font-mono">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#181818] border border-white/10 hover:border-white/25 focus:border-blue-500 text-xs text-white pl-10 pr-4 py-2.5 rounded-2xl outline-none transition-all font-mono"
                  />
                </div>
                <p className="text-[9px] text-slate-500 font-mono">Ex: R$ 5,69 (Gasolina) ou R$ 3,89 (Etanol)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Consumo do Carro (km/L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={kmPerLiter}
                  onChange={(e) => setKmPerLiter(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#181818] border border-white/10 hover:border-white/25 focus:border-blue-500 text-xs text-white px-4 py-2.5 rounded-2xl outline-none transition-all font-mono"
                />
                <p className="text-[9px] text-slate-500 font-mono">Ex: 10.5 km/L (Trânsito urbano convencional)</p>
              </div>
            </div>
          </div>

          {/* Filtering Metrics thresholds */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3.5">
              <div className="p-2.5 bg-blue-600/15 rounded-xl text-blue-400 border border-blue-500/20">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Filtro de Rentabilidade Mínima</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Preço Mínimo por KM (R$)</label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-xs font-bold text-slate-500 font-mono">R$</span>
                  <input
                    type="number"
                    step="0.1"
                    value={minPricePerKm}
                    onChange={(e) => setMinPricePerKm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#181818] border border-white/10 hover:border-white/25 focus:border-blue-500 text-xs text-white pl-10 pr-4 py-2.5 rounded-2xl outline-none transition-all font-mono"
                  />
                </div>
                <p className="text-[9px] text-slate-500 font-mono">Recomendado no Brasil: no mínimo R$ 2,00 por km.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Ganhos por Hora (R$/h)</label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-xs font-bold text-slate-500 font-mono">R$</span>
                  <input
                    type="number"
                    step="1"
                    value={minHourlyEarnings}
                    onChange={(e) => setMinHourlyEarnings(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#181818] border border-white/10 hover:border-white/25 focus:border-blue-500 text-xs text-white pl-10 pr-4 py-2.5 rounded-2xl outline-none transition-all font-mono"
                  />
                </div>
                <p className="text-[9px] text-slate-500 font-mono">Meta ativa desejável: R$ 35,00/h a R$ 50,00/h.</p>
              </div>
            </div>
          </div>

          {/* Targets thresholds */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3.5">
              <div className="p-2.5 bg-emerald-600/15 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Metas de Produtividade</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Meta Financeira Diária (R$)</label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-xs font-bold text-slate-500 font-mono">R$</span>
                  <input
                    type="number"
                    step="10"
                    value={dailyTarget}
                    onChange={(e) => setDailyTarget(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#181818] border border-white/10 hover:border-white/25 focus:border-blue-500 text-xs text-white pl-10 pr-4 py-2.5 rounded-2xl outline-none transition-all font-mono"
                  />
                </div>
                <p className="text-[9px] text-slate-500 font-mono font-mono">Ex: R$ 300 / dia bruto.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Meta Financeira Semanal (R$)</label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-xs font-bold text-slate-500 font-mono">R$</span>
                  <input
                    type="number"
                    step="50"
                    value={weeklyTarget}
                    onChange={(e) => setWeeklyTarget(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#181818] border border-white/10 hover:border-white/25 focus:border-blue-500 text-xs text-white pl-10 pr-4 py-2.5 rounded-2xl outline-none transition-all font-mono"
                  />
                </div>
                <p className="text-[9px] text-slate-500 font-mono">Ex: R$ 1.500 / semana bruto.</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl transition-all duration-300 font-mono tracking-widest uppercase cursor-pointer text-center shadow-lg shadow-blue-500/15"
          >
            Salvar Parâmetros Financeiros
          </button>
        </div>

        {/* Right Column: Safety Blocklist Control */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Overlay Configuration Settings Widget */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3.5">
              <div className="p-2.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">HUD Flutuante Automático</h3>
                <p className="text-[9px] text-slate-500 mt-0.5 font-mono">Abrir análises sobrepostas automaticamente na tela do celular</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="space-y-1.5 pr-4">
                <p className="text-xs font-bold text-slate-200 font-mono">Ativar Auto-HUD</p>
                <p className="text-[9px] text-slate-500 leading-relaxed font-mono">
                  O mini-hud surge na tela de forma 100% automática sempre que o aplicativo detectar uma nova corrida (via simulador ou OCR screenshot).
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                <input
                  type="checkbox"
                  checked={autoOverlayEnabled}
                  onChange={(e) => {
                    const nextVal = e.target.checked;
                    setAutoOverlayEnabled(nextVal);
                    // Save instantly to let App pick it up
                    onSaveSettings({
                      fuelPrice: Number(fuelPrice),
                      kmPerLiter: Number(kmPerLiter),
                      minPricePerKm: Number(minPricePerKm),
                      minPricePerMinute: Number(minPricePerMinute),
                      minHourlyEarnings: Number(minHourlyEarnings),
                      dailyTarget: Number(dailyTarget),
                      weeklyTarget: Number(weeklyTarget),
                      blockedRegions,
                      autoOverlayEnabled: nextVal
                    });
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white peer-checked:after:border-white"></div>
              </label>
            </div>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-full shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-white/5 pb-3.5">
                <div className="p-2.5 bg-red-600/15 text-red-500 border border-red-500/20 rounded-xl">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Regiões de Risco</h3>
                  <p className="text-[9px] text-slate-500 mt-0.5 font-mono">Corrida com destino nestas zonas alertam rejeição imediata</p>
                </div>
              </div>

              {/* Add blocked region inline form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Capão Redondo, Zona Norte"
                  value={blockedInput}
                  onChange={(e) => setBlockedInput(e.target.value)}
                  className="w-full bg-[#181818] border border-white/10 hover:border-white/25 focus:border-red-500 text-xs text-white px-4 py-2.5 rounded-2xl outline-none transition-all font-mono"
                />
                <button
                  onClick={handleAddRegion}
                  type="button"
                  className="p-2.5 bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900 hover:text-white rounded-2xl transition-all duration-300 cursor-pointer shrink-0"
                >
                  <Plus className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Blocked Region Badges list */}
              <div className="space-y-2 mt-4 max-h-[220px] overflow-y-auto pr-1">
                {blockedRegions.length > 0 ? (
                  blockedRegions.map((region, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 bg-[#181818] rounded-2xl border border-white/5 hover:border-red-500/10 transition-colors"
                    >
                      <span className="text-xs text-slate-300 font-bold font-mono flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        {region}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRegion(idx)}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center space-y-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    <p className="text-[11px] text-slate-400 font-bold font-mono">Nenhuma região bloqueada</p>
                    <p className="text-[9px] text-slate-500 font-mono">Você aceitará corridas em todas as localizações extraídas pelo OCR.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-white/5 pt-4 text-[10px] text-slate-500 leading-normal font-mono">
              🛡️ Dica de segurança TurboMax: Para destinos perigosos, o sistema do app realiza um scan geográfico aproximado local para te alertar antes de você pegar o passageiro.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
