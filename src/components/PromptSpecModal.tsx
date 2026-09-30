import React, { useState } from 'react';
import { X, Code, Copy, Check, Sparkles, Sliders } from 'lucide-react';
import { VisualPromptSpec } from '../types/adaptation';

interface PromptSpecModalProps {
  title: string;
  spec: VisualPromptSpec;
  onClose: () => void;
}

export const PromptSpecModal: React.FC<PromptSpecModalProps> = ({
  title,
  spec,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(spec, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-stone-100">
              Visual Reproduction Specification: {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3 p-3 bg-stone-950 rounded-xl border border-stone-800 font-mono text-[11px]">
            <div>
              <span className="text-stone-500 block">MODEL</span>
              <span className="text-amber-400 font-semibold">{spec.model}</span>
            </div>
            <div>
              <span className="text-stone-500 block">ASPECT RATIO</span>
              <span className="text-stone-200">{spec.aspectRatio}</span>
            </div>
            <div>
              <span className="text-stone-500 block">GENERATION SEED</span>
              <span className="text-stone-200">{spec.seed}</span>
            </div>
          </div>

          <div>
            <label className="text-stone-300 font-semibold block mb-1">
              Positive Production Prompt
            </label>
            <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-300 font-mono text-[11px] leading-relaxed select-all">
              {spec.positivePrompt}
            </div>
          </div>

          <div>
            <label className="text-stone-300 font-semibold block mb-1">
              Negative Cultural / Quality Prompt
            </label>
            <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-400 font-mono text-[11px] leading-relaxed select-all">
              {spec.negativePrompt}
            </div>
          </div>

          <div>
            <label className="text-stone-300 font-semibold block mb-1">
              Camera &amp; Lighting Rig
            </label>
            <p className="text-stone-300 bg-stone-950 p-2.5 rounded-lg border border-stone-800 text-[11px]">
              {spec.cameraAndLighting}
            </p>
          </div>

          <div>
            <label className="text-stone-300 font-semibold block mb-1">
              Cultural Authenticity Verification Checklist
            </label>
            <div className="space-y-1.5">
              {spec.culturalAuthenticityChecklist.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-stone-300 text-[11px]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/60 flex items-center justify-between">
          <span className="text-[11px] font-mono text-stone-500">
            Reproducible Structured Spec
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied JSON' : 'Copy Prompt JSON'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
