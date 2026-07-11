import React, { useState } from 'react';
import { useMineStore } from '../stores/mineStore';
import { Lock, Mail, Shield, AlertTriangle, Key } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { setCurrentPage, initialize, startSimulation } = useMineStore();
  const [role, setRole] = useState<'Admin' | 'Supervisor' | 'Rescue'>('Supervisor');
  const [email, setEmail] = useState('supervisor@mineguardian.net');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide valid authorization credentials.');
      return;
    }
    setError('');
    // Initialize standard simulation on login
    initialize();
    startSimulation();
    setCurrentPage('Twin');
  };

  const selectRole = (r: 'Admin' | 'Supervisor' | 'Rescue') => {
    setRole(r);
    if (r === 'Supervisor') setEmail('supervisor@mineguardian.net');
    else if (r === 'Admin') setEmail('admin@mineguardian.net');
    else setEmail('rescue_lead@mineguardian.net');
  };

  return (
    <div className="min-h-screen w-full bg-[#050B18] grid-bg flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Neon Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgba(0,212,255,0.04)] rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgba(255,59,48,0.03)] rounded-full blur-3xl" />

      {/* Main Glass Box */}
      <div className="w-full max-w-md glass-card rounded-2xl p-8 shadow-glowCyan relative z-10">
        
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-tr from-[#00D4FF] to-blue-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-glowCyan mb-3 animate-pulse">
            MG
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-[#E8F4FD] font-mono">
            MINEGUARDIAN X
          </h2>
          <p className="text-xs text-mine-cyan font-semibold uppercase tracking-widest mt-1">
            CMARI Collaborative Safety Engine
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-950 border border-red-500 text-red-300 p-3 rounded-lg text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {(['Supervisor', 'Admin', 'Rescue'] as const).map((r) => {
            const isSelected = role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => selectRole(r)}
                className={`py-2 rounded-lg text-xs font-mono font-bold tracking-wider border transition-all ${
                  isSelected 
                    ? 'bg-[#00D4FF] text-black border-[#00D4FF] shadow-glowCyan' 
                    : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.1)] hover:border-[rgba(0,212,255,0.25)]'
                }`}
              >
                {r.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-mine-textMuted uppercase tracking-wider mb-2 font-mono">
              AUTHORIZED USER EMAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-mine-textMuted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#132235] border border-[rgba(0,212,255,0.15)] rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#E8F4FD] focus:outline-none focus:border-[#00D4FF] transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-mine-textMuted uppercase tracking-wider mb-2 font-mono">
              SECURITY ACCESS TOKEN
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-mine-textMuted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#132235] border border-[rgba(0,212,255,0.15)] rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#E8F4FD] focus:outline-none focus:border-[#00D4FF] transition-all font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-mine-cyan pt-2">
            <span className="flex items-center gap-1.5 cursor-pointer hover:underline font-mono">
              <Key className="w-3.5 h-3.5" />
              Request OTP Pin
            </span>
            <span className="text-mine-textMuted font-mono">IEEE Spec V3.4</span>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-[#00D4FF] to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-extrabold uppercase py-3 rounded-lg text-sm tracking-widest transition-all shadow-glowCyan flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Establish Secure Console
          </button>
        </form>

        {/* Footnote */}
        <div className="mt-8 text-center text-[10px] text-mine-textMuted font-mono">
          System encrypted via AES-256 GCM client tokens.
          <br />
          MineGuardian X Safety Core.
        </div>

      </div>

    </div>
  );
};
