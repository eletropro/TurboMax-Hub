import React, { useState } from "react";
import { Award, Shield, User, Copy, Check, Users, Sparkles, DollarSign, LogIn, Lock, CheckCircle2 } from "lucide-react";
import { AffiliateInfo } from "../types";

interface AffiliatesViewProps {
  affiliate: AffiliateInfo;
  onUpgradePlan: (plan: 'gratis' | 'premium') => void;
  mockLogin: (provider: 'google' | 'apple') => void;
  userEmail: string | null;
}

export default function AffiliatesView({ affiliate, onUpgradePlan, mockLogin, userEmail }: AffiliatesViewProps) {
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleCopyCode = () => {
    navigator.clipboard.writeText(affiliate.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectPlan = (plan: 'gratis' | 'premium') => {
    onUpgradePlan(plan);
    setSuccessMsg(
      plan === "premium" 
        ? "Assinatura JetMax Premium ativada! Obrigado por apoiar os motoristas com inteligência artificial." 
        : "Seu plano foi alterado para Grátis."
    );
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Visual Feedback saved banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-xl flex items-center gap-3.5 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white">Status da Conta Atualizado</p>
            <p className="text-[10px] text-slate-300">{successMsg}</p>
          </div>
        </div>
      )}

      {/* Login Google / Apple visual simulator if not authenticated */}
      <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Identidade TurboMax HUD</span>
            <h3 className="text-lg font-bold text-white">Conta & Conectividade</h3>
            <p className="text-xs text-slate-400">
              {userEmail ? `Autenticado com o Google: ${userEmail}` : "Conecte sua conta para sincronizar dados em múltiplos celulares Android/iOS"}
            </p>
          </div>

          {!userEmail ? (
            <div className="flex flex-wrap gap-2.5 justify-center">
              <button
                onClick={() => mockLogin('google')}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white rounded-xl transition-all duration-300 cursor-pointer font-bold"
              >
                <LogIn className="w-4 h-4 text-blue-400" />
                <span>Entrar com Google</span>
              </button>
              <button
                onClick={() => mockLogin('apple')}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white rounded-xl transition-all duration-300 cursor-pointer font-bold"
              >
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Entrar com Apple</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
              <div className="p-2 bg-blue-600/15 text-blue-400 rounded-full border border-blue-500/20">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Você está conectado</p>
                <p className="text-[10px] font-mono text-slate-400">{userEmail}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subscription pricing tiers */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-900 pb-3">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">PLANOS DE ASSINATURA</span>
            <h3 className="text-base font-semibold text-white">Escolha a Potência da sua Operação</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Plan Tier */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-5 ${
              affiliate.plan === "gratis" ? "border-slate-700 bg-slate-900/20" : "border-slate-900 bg-transparent"
            }`}>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-300">Plano Grátis</h4>
                  <p className="text-[10px] text-slate-500">Recursos Básicos e Simulações</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-white">R$ 0</span>
                  <span className="text-[10px] text-slate-500">/ grátis para sempre</span>
                </div>
                
                <ul className="space-y-1.5 text-[11px] text-slate-400">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-slate-500" />
                    <span>Scan OCR Básico</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-slate-500" />
                    <span>Limites normais por km</span>
                  </li>
                  <li className="flex items-center gap-1.5 opacity-40">
                    <Check className="w-3.5 h-3.5 text-slate-500" />
                    <span>Dicas faladas por Voz</span>
                  </li>
                </ul>
              </div>

              <button
                disabled={affiliate.plan === "gratis"}
                onClick={() => selectPlan('gratis')}
                className={`w-full py-2 text-xs font-medium rounded-lg text-center transition-all ${
                  affiliate.plan === "gratis" 
                    ? "bg-slate-900 text-slate-400 border border-slate-800" 
                    : "bg-slate-900 text-white hover:bg-slate-850 cursor-pointer"
                }`}
              >
                {affiliate.plan === "gratis" ? "Plano Ativo" : "Mudar para Grátis"}
              </button>
            </div>

            {/* Premium Plan Tier */}
            <div className={`p-5 rounded-xl border relative flex flex-col justify-between space-y-5 overflow-hidden ${
              affiliate.plan === "premium" ? "border-cyan-500 bg-cyan-950/20" : "border-slate-900 bg-slate-950/60"
            }`}>
              {/* Premium indicator edge */}
              <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-600 to-cyan-500 text-[9px] text-white font-extrabold tracking-widest px-3 py-1 rounded-bl-lg font-mono">
                POPULAR
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-semibold text-white">Plano JetMax Pro</h4>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-cyan-400">R$ 19,90</span>
                  <span className="text-[10px] text-slate-400">/ mensal</span>
                </div>

                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Análise OCR em tempo real sem limite</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Metas Geográficas Ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Áudio-Feedback Integrado</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Prioridade em Horário de Pico</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => selectPlan('premium')}
                className={`w-full py-2 text-xs font-semibold rounded-lg text-center transition-all ${
                  affiliate.plan === "premium"
                    ? "bg-cyan-950 text-cyan-400 border border-cyan-500/50"
                    : "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:brightness-110 cursor-pointer"
                }`}
              >
                {affiliate.plan === "premium" ? "Plano Ativo" : "Assinar JetMax Premium"}
              </button>
            </div>
          </div>
        </div>

        {/* Affiliate Reward platform info */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-900 pb-3">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">SISTEMA DE AFILIADOS</span>
              <h3 className="text-base font-semibold text-white">Indique Amigos e Ganhe R$</h3>
            </div>

            <p className="text-xs text-slate-400 leading-normal">
              Indique outros motoristas parceiros Uber ou 99 no grupo de WhatsApp. Para cada indicado que assinar o Plano Premium, você ganha **R$ 5,00 recorrentes** todo mês.
            </p>

            {/* Referral code widget */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-mono uppercase">Seu link de afiliado</label>
              <div className="flex bg-slate-900 border border-slate-850 p-2 rounded-lg items-center justify-between">
                <span className="text-xs text-slate-200 font-mono font-bold pl-2 truncate">{affiliate.referralCode}</span>
                <button
                  onClick={handleCopyCode}
                  className="p-1 px-3 bg-cyan-950 text-cyan-400 border border-cyan-500/20 rounded text-xs flex gap-1.5 hover:bg-cyan-900 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copiado!" : "Copiar"}</span>
                </button>
              </div>
            </div>

            {/* Performance referral cards metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-mono tracking-widest">Indicados</span>
                  <p className="text-base font-bold text-white mt-1">{affiliate.referralsCount} motoristas</p>
                </div>
                <Users className="w-5 h-5 text-purple-400" />
              </div>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-mono tracking-widest">Comissão Ganha</span>
                  <p className="text-base font-bold text-emerald-400 mt-1">R$ {affiliate.commissionsEarned.toFixed(2)}</p>
                </div>
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-900 pt-4 text-[10px] text-slate-500 text-center">
            🔗 Os ganhos de afiliados são pagos automaticamente via PIX todos os sábados.
          </div>
        </div>
      </div>
    </div>
  );
}
