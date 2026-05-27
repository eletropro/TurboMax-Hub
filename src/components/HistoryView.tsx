import React, { useState } from "react";
import { Search, Calendar, Landmark, SlidersHorizontal, CheckSquare, XSquare, MapPin } from "lucide-react";
import { RideInfo } from "../types";

interface HistoryViewProps {
  history: RideInfo[];
  onClearHistory: () => void;
}

export default function HistoryView({ history, onClearHistory }: HistoryViewProps) {
  const [filterApp, setFilterApp] = useState<'All' | 'Uber' | '99'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'accept' | 'reject' | 'attention'>('All');
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = history.filter(ride => {
    const matchesApp = filterApp === 'All' || ride.app === filterApp;
    const matchesStatus = filterStatus === 'All' || ride.recommendation === filterStatus;
    const matchesSearch = 
      ride.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.destinationAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesApp && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filters Board banner */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por endereço..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-850 focus:border-cyan-500 text-xs text-slate-300 pl-9 pr-4 py-2 rounded-lg outline-none transition-colors"
            />
          </div>

          {/* App filter */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-850 w-full md:w-auto">
            <button
              onClick={() => setFilterApp('All')}
              className={`px-3 py-1 text-xs font-medium rounded cursor-pointer ${filterApp === 'All' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
            >
              Todos Apps
            </button>
            <button
              onClick={() => setFilterApp('Uber')}
              className={`px-3 py-1 text-xs font-medium rounded cursor-pointer ${filterApp === 'Uber' ? 'bg-black text-white border border-slate-800' : 'text-slate-400 hover:text-white'}`}
            >
              Uber
            </button>
            <button
              onClick={() => setFilterApp('99')}
              className={`px-3 py-1 text-xs font-medium rounded cursor-pointer ${filterApp === '99' ? 'bg-yellow-950 text-yellow-500 border border-yellow-500/20' : 'text-slate-400 hover:text-white'}`}
            >
              99
            </button>
          </div>

          {/* Status filter */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-850 w-full md:w-auto">
            <button
              onClick={() => setFilterStatus('All')}
              className={`px-3.5 py-1 text-xs font-medium rounded cursor-pointer ${filterStatus === 'All' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/20' : 'text-slate-400'}`}
            >
              Todos Status
            </button>
            <button
              onClick={() => setFilterStatus('accept')}
              className={`px-3.5 py-1 text-xs font-medium rounded cursor-pointer ${filterStatus === 'accept' ? 'bg-emerald-950 text-emerald-400' : 'text-slate-400'}`}
            >
              Aceitas
            </button>
            <button
              onClick={() => setFilterStatus('reject')}
              className={`px-3.5 py-1 text-xs font-medium rounded cursor-pointer ${filterStatus === 'reject' ? 'bg-red-950 text-red-500' : 'text-slate-400'}`}
            >
              Recusadas
            </button>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="text-xs text-red-400 hover:text-red-300 font-mono underline cursor-pointer border border-transparent p-1 px-2 rounded hover:bg-red-950/20 hover:border-red-500/20 transition-all"
        >
          Limpar Lista
        </button>
      </div>

      {/* History Cards flow */}
      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((ride) => (
            <div
              key={ride.id}
              className={`bg-slate-950 p-5 rounded-2xl border flex flex-col md:flex-row justify-between gap-4 transition-all hover:border-slate-800 ${
                ride.recommendation === "accept" ? "border-slate-850" : "border-slate-850 opacity-80"
              }`}
            >
              {/* Left Column: Identifiers, addresses, date */}
              <div className="space-y-3 md:max-w-xl">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-mono tracking-widest px-2 py-0.5 rounded border ${
                    ride.app === "Uber" ? "bg-black text-gray-200 border-gray-800" : "bg-yellow-950/45 text-yellow-500 border-yellow-500/20"
                  }`}>
                    {ride.app} - {ride.category}
                  </span>
                  
                  <span className={`text-[10px] font-mono flex items-center gap-1 px-2 py-0.5 rounded ${
                    ride.recommendation === "accept" ? "bg-emerald-950 text-emerald-400" :
                    ride.recommendation === "reject" ? "bg-red-950 text-red-400" : "bg-amber-950 text-amber-500"
                  }`}>
                    {ride.recommendation === "accept" ? <CheckSquare className="w-3 h-3" /> : <XSquare className="w-3 h-3" />}
                    {ride.recommendation === "accept" ? "ACEITA" : "RECUSADA"}
                  </span>

                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 pl-1">
                    <Calendar className="w-3 h-3" /> {new Date(ride.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Path Map Route Details */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex gap-2">
                    <span className="text-emerald-500 font-bold shrink-0 font-mono text-[9px] mt-0.5">PARTIDA</span>
                    <span className="text-slate-300">{ride.pickupAddress}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-cyan-400 font-bold shrink-0 font-mono text-[9px] mt-0.5">DESTINO</span>
                    <span className="text-slate-300">{ride.destinationAddress || "Corrida sem destino definido"}</span>
                  </div>
                </div>

                {/* Justification quote snippet */}
                <p className="text-[11px] text-slate-400 leading-relaxed italic bg-slate-900 border border-slate-900 px-3.5 py-2.5 rounded-lg border-l-2 border-l-cyan-500/40">
                  {ride.aiExplanation}
                </p>
              </div>

              {/* Right Column: Earnings Summary Grid */}
              <div className="flex flex-row md:flex-col justify-between md:text-right border-t md:border-t-0 border-slate-900 pt-3 md:pt-0 shrink-0 md:w-44">
                <div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Valor Bruto</p>
                  <p className="text-base font-extrabold text-white">R$ {ride.value.toFixed(2)}</p>
                </div>

                <div className="md:mt-3">
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Lucro Líquido</p>
                  <p className="text-sm font-semibold text-emerald-400">R$ {ride.netProfit.toFixed(2)}</p>
                  <span className="text-[9px] text-slate-550 font-mono">Gast. Gasolina: R${ride.fuelCost.toFixed(2)}</span>
                </div>

                <div className="md:mt-2">
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-900/60 border border-slate-850 px-2 py-0.5 rounded">
                    R${ride.earningsPerKm.toFixed(2)} / km
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-2">
            <SlidersHorizontal className="w-8 h-8 text-slate-600 animate-pulse" />
            <p className="text-sm font-medium text-slate-400">Nenhuma corrida registrada neste filtro</p>
            <p className="text-xs text-slate-500">
              Faça simulações ou envie prints no painel do Radar/OCR para expandir seu histórico operacional de lucros.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
