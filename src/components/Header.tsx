import React from 'react';
import { Sparkles, BookOpen, ShieldCheck, Film, Download, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import { AdaptationProject } from '../types/adaptation';

interface HeaderProps {
  project: AdaptationProject;
  activeStep: string;
  onOpenDocs: (tab?: string) => void;
  onRunAudit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  activeStep,
  onOpenDocs,
  onRunAudit
}) => {
  const unresolvedContradictions = project.contradictions.filter(c => !c.resolved).length;

  return (
    <header className="border-b border-stone-800 bg-stone-950/90 backdrop-blur sticky top-0 z-40 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Platform Info */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-950/40 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-tight text-stone-100">
                KathaSetu
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                OTT Dialect Studio
              </span>
            </div>
            <p className="text-xs text-stone-400 truncate max-w-sm">
              Cultural Screenplay &amp; Visual Continuity Engine
            </p>
          </div>
        </div>

        {/* Selected Culture Badge */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          <div className="bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs text-stone-400">Culture:</span>
            <span className="text-xs font-semibold text-stone-200">
              {project.selectedCulture.name.split('(')[0]}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-300">
              {project.selectedSetting.toUpperCase()}
            </span>
          </div>

          {unresolvedContradictions > 0 ? (
            <button
              onClick={onRunAudit}
              className="bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/40 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs text-amber-300 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{unresolvedContradictions} Continuity Note{unresolvedContradictions > 1 ? 's' : ''}</span>
            </button>
          ) : (
            <div className="bg-emerald-950/40 border border-emerald-600/30 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Continuity Intact</span>
            </div>
          )}

          {project.isApprovedForVisuals && (
            <div className="bg-blue-950/40 border border-blue-600/30 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-xs text-blue-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Gate: Approved</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => onOpenDocs('architecture')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-all hover:border-stone-700"
            title="Inspect Agentic Architecture & System Logic"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Architecture &amp; AI Log</span>
          </button>

          <button
            onClick={() => onOpenDocs('tests')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-all hover:border-stone-700"
            title="Run Unit and Continuity Verification Tests"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Live Tests</span>
          </button>
        </div>
      </div>
    </header>
  );
};
