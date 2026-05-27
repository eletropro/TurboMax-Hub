import React, { useState } from "react";
import { X, Volume2, Move, AlertOctagon, Sparkles, Check, ChevronDown, Minimize2, Maximize2 } from "lucide-react";
import { motion } from "motion/react";
import { RideInfo } from "../types";

interface OverlayWidgetProps {
  ride: RideInfo | null;
  onClose: () => void;
}

export default function OverlayWidget({ ride, onClose }: OverlayWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!ride) return null;

  // Sound alert simulator
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      if (ride.classification === "excellent") {
        // High melody for great ride
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.35);
      } else if (ride.classification === "bad") {
        // Low double buzzer for bad ride
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(120, audioCtx.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.4);
      } else {
        // Simple chime
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
      }
    } catch (e) {
      console.warn("Navegador bloqueou reprodução imediata do sino de áudio:", e);
    }
  };

  const borderThemes = {
    excellent: "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.35)] bg-slate-950/95",
    good: "border-teal-500 shadow-[0_0_12px_rgba(20,184,166,0.25)] bg-slate-950/95",
    average: "border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.25)] bg-slate-950/95",
    bad: "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.35)] bg-slate-950/95"
  };

  const textThemes = {
    excellent: "text-emerald-400",
    good: "text-teal-400",
    average: "text-amber-400",
    bad: "text-red-400"
  };

  const buttonThemes = {
    excellent: "bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40",
    good: "bg-teal-950/40 text-teal-300 border-teal-500/30 hover:bg-teal-900/40",
    average: "bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/40",
    bad: "bg-red-950/40 text-red-300 border-red-500/30 hover:bg-red-900/40"
  };

  return (
    <motion.div
      drag
      dragElastic={0.1}
      dragMomentum={false}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`fixed bottom-20 right-6 z-50 w-80 border rounded-2xl backdrop-blur-lg p-4 transition-all duration-300 cursor-grab active:cursor-grabbing ${
        borderThemes[ride.classification]
      }`}
    >
      {/* Header of overlay */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-900/80 mb-3 select-none">
        <div className="flex items-center gap-2">
          {/* Animated signal dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="text-[10px] font-mono tracking-widest font-black text-slate-400">JETMAX OVERLAY HUD</span>
        </div>

        <div className="flex items-center gap-1.5 non-drag">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playAlertSound();
            }}
            title="Ativar áudio-feedback"
            className={`p-1 rounded hover:bg-slate-900 transition-colors cursor-pointer ${soundEnabled ? "text-cyan-400" : "text-slate-500"}`}
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isMinimized ? (
        <div className="flex items-center justify-between py-1 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white font-mono">Simulador HUD</span>
            <span className={`text-[10px] font-semibold ${textThemes[ride.classification]}`}>
              R$ {ride.value.toFixed(2)} - {ride.distance.toFixed(1)}km
            </span>
          </div>
          <span className={`text-[9px] font-bold py-0.5 px-2 rounded-full ${buttonThemes[ride.classification]}`}>
            {ride.recommendation === "accept" ? "Aceite" : "Recuse"}
          </span>
        </div>
      ) : (
        <div className="space-y-3.5">
          {/* Main cost calculator row */}
          <div className="grid grid-cols-3 gap-2 text-center bg-slate-900/50 p-2.5 rounded-xl border border-slate-900">
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase">Bruto</p>
              <p className={`text-sm font-bold mt-0.5 ${textThemes[ride.classification]}`}>
                R$ {ride.value.toFixed(2)}
              </p>
            </div>
            <div className="border-l border-slate-800">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Distância</p>
              <p className="text-sm font-bold text-white mt-0.5 font-mono">
                {ride.distance.toFixed(1)} km
              </p>
            </div>
            <div className="border-l border-slate-800">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Taxa/KM</p>
              <p className={`text-sm font-bold mt-0.5 ${textThemes[ride.classification]}`}>
                R$ {ride.earningsPerKm.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Profit estimation widget */}
          <div className="flex justify-between items-center text-xs bg-slate-900/20 p-2 border border-slate-900/50 rounded-lg">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Lucro Estimado</span>
            </div>
            <span className="font-extrabold text-emerald-400">R$ {ride.netProfit.toFixed(2)} líquido</span>
          </div>

          {/* AI Decision Alert */}
          <div className={`p-2.5 rounded-lg border text-xs flex gap-2 ${buttonThemes[ride.classification]}`}>
            {ride.recommendation === "accept" ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertOctagon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            )}
            <p className="text-slate-300 leading-normal line-clamp-3">{ride.aiExplanation}</p>
          </div>

          {/* Simulated Mobile app visual link and drag handle */}
          <div className="flex justify-between items-center text-[10px] text-slate-500 select-none">
            <span className="flex items-center gap-1">
              <Move className="w-3 h-3 text-slate-500" /> Arrastar HUD
            </span>
            <span>{ride.app} ({ride.category})</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
