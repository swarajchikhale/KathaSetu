import React from 'react';
import {
  FileText,
  TableProperties,
  UserCheck,
  SplitSquareVertical,
  Image as ImageIcon,
  ShieldAlert
} from 'lucide-react';
import { AdaptationProject } from '../types/adaptation';

interface StepNavProps {
  currentStep: AdaptationProject['workflowStep'];
  onSelectStep: (step: AdaptationProject['workflowStep']) => void;
  project: AdaptationProject;
}

export const StepNav: React.FC<StepNavProps> = ({
  currentStep,
  onSelectStep,
  project
}) => {
  const steps: {
    id: AdaptationProject['workflowStep'];
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge?: string;
    isGate?: boolean;
    locked?: boolean;
  }[] = [
    {
      id: 'upload',
      label: '1. Input & Culture',
      sublabel: 'Screenplay & Dialect',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'extraction',
      label: '2. Scene Extraction',
      sublabel: `${project.scenes.length} Scenes | ${project.characters.length} Chars`,
      icon: <TableProperties className="w-4 h-4" />
    },
    {
      id: 'approval',
      label: '3. Human Approval Gate',
      sublabel: project.isApprovedForVisuals ? 'Approved' : 'Action Required',
      icon: <UserCheck className="w-4 h-4" />,
      isGate: true,
      badge: project.isApprovedForVisuals ? 'VERIFIED' : 'GATE'
    },
    {
      id: 'screenplay',
      label: '4. Adapted Screenplay',
      sublabel: 'Side-by-Side Diff',
      icon: <SplitSquareVertical className="w-4 h-4" />
    },
    {
      id: 'visuals',
      label: '5. Visual Gallery',
      sublabel: 'Bible & Keyframes',
      icon: <ImageIcon className="w-4 h-4" />,
      locked: !project.isApprovedForVisuals
    },
    {
      id: 'continuity_export',
      label: '6. Continuity & Export',
      sublabel: `${project.contradictions.filter(c => !c.resolved).length} Warnings`,
      icon: <ShieldAlert className="w-4 h-4" />
    }
  ];

  return (
    <nav className="bg-stone-900/60 border-b border-stone-800 px-4 lg:px-8 py-2.5 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[760px] gap-2">
        {steps.map((step, idx) => {
          const isActive = currentStep === step.id;
          const isCompleted = idx < steps.findIndex((s) => s.id === currentStep);

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              disabled={step.locked}
              className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all relative ${
                isActive
                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200 shadow-sm shadow-amber-950/20'
                  : step.locked
                  ? 'opacity-40 cursor-not-allowed text-stone-500 hover:bg-transparent'
                  : 'hover:bg-stone-800/60 text-stone-400 hover:text-stone-200'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-400'
                    : isCompleted
                    ? 'bg-stone-800 text-stone-300'
                    : 'bg-stone-900 text-stone-500'
                }`}
              >
                {step.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold truncate block">
                    {step.label}
                  </span>
                  {step.badge && (
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                        project.isApprovedForVisuals
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {step.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-stone-400 block truncate">
                  {step.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
