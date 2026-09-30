import React, { useState } from 'react';
import {
  SplitSquareVertical,
  BookOpen,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Eye,
  FileText,
  Volume2,
  Copy,
  Check
} from 'lucide-react';
import { DialectOption, SceneRecord, WritingScript } from '../../types/adaptation';

interface ScreenplayScreenProps {
  scenes: SceneRecord[];
  culture: DialectOption;
  script: WritingScript;
  onProceedToVisuals: () => void;
}

export const ScreenplayScreen: React.FC<ScreenplayScreenProps> = ({
  scenes,
  culture,
  script,
  onProceedToVisuals
}) => {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [filterType, setFilterType] = useState<'all' | 'dialogue' | 'action'>('all');
  const [copied, setCopied] = useState<boolean>(false);

  const currentScene = scenes[selectedSceneIndex] || scenes[0];

  const filteredLines = (currentScene?.lines || []).filter((l) => {
    if (filterType === 'dialogue') return l.type === 'dialogue';
    if (filterType === 'action') return l.type === 'action';
    return true;
  });

  const handleCopyAdaptedText = () => {
    const text = scenes
      .map(
        (s) =>
          `=== ${s.slugline} ===\n\n` +
          s.lines
            .map((l) =>
              l.type === 'dialogue'
                ? `${l.character}\n${l.adaptedText || l.text}\n`
                : `${l.adaptedText || l.text}\n`
            )
            .join('\n')
      )
      .join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900 border border-stone-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-stone-100">
              Adapted Screenplay Studio
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-semibold">
              Dialect: {culture.name.split('(')[0]}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Side-by-side comparative analysis of source neutral lines versus culturally adapted vernacular dialogue and physical staging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyAdaptedText}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Full Script' : 'Copy Adapted Script'}</span>
          </button>

          <button
            onClick={onProceedToVisuals}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <span>Proceed to Visual Production Pack</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scene Navigation Selector */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {scenes.map((s, idx) => (
            <button
              key={s.scene_id}
              onClick={() => setSelectedSceneIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedSceneIndex === idx
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              Scene {s.scene_number}: {s.sub_location}
            </button>
          ))}
        </div>

        {/* Line Filter */}
        <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 p-1 rounded-lg">
          {(['all', 'dialogue', 'action'] as const).map((ft) => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-all ${
                filterType === ft
                  ? 'bg-stone-800 text-amber-300 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {ft}
            </button>
          ))}
        </div>
      </div>

      {/* Screenplay Comparison Container */}
      <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header bar of comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 bg-stone-900/90 border-b border-stone-800 text-xs font-mono font-bold">
          <div className="p-3.5 border-r border-stone-800 text-stone-400 flex items-center justify-between">
            <span>ORIGINAL NEUTRAL SOURCE SCRIPT</span>
            <span className="text-[10px] text-stone-500 font-normal">Standard English</span>
          </div>
          <div className="p-3.5 text-amber-300 flex items-center justify-between bg-amber-950/20">
            <span>CULTURALLY ADAPTED SCREENPLAY ({culture.name.toUpperCase()})</span>
            <span className="text-[10px] text-amber-400/80 font-normal">Script: {script.toUpperCase()}</span>
          </div>
        </div>

        {/* Scene Heading */}
        <div className="p-4 bg-stone-900/40 border-b border-stone-800/80 text-center font-mono text-xs text-stone-300">
          <span className="font-bold text-amber-400">{currentScene?.slugline}</span>
        </div>

        {/* Line by Line Comparison */}
        <div className="divide-y divide-stone-800/60">
          {filteredLines.map((line) => (
            <div
              key={line.id}
              className={`grid grid-cols-1 md:grid-cols-2 hover:bg-stone-900/20 transition-colors ${
                line.type === 'dialogue' ? 'bg-amber-950/5' : ''
              }`}
            >
              {/* Left Column: Source Neutral */}
              <div className="p-4 lg:p-5 border-r border-stone-800/80 font-mono text-xs space-y-1">
                {line.type === 'dialogue' ? (
                  <div className="space-y-1">
                    <span className="font-bold text-stone-300 tracking-wider">
                      {line.character}
                    </span>
                    <p className="text-stone-300 leading-relaxed pl-4 border-l-2 border-stone-800">
                      {line.text}
                    </p>
                  </div>
                ) : (
                  <p className="text-stone-400 leading-relaxed italic">
                    {line.text}
                  </p>
                )}
              </div>

              {/* Right Column: Culturally Adapted */}
              <div className="p-4 lg:p-5 font-mono text-xs space-y-2 bg-amber-950/10">
                {line.type === 'dialogue' ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 tracking-wider">
                        {line.character} (Adapted Kinship Address)
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Dialect Dialogue
                      </span>
                    </div>
                    <p className="text-amber-100 font-sans text-sm font-medium leading-relaxed pl-4 border-l-2 border-amber-500/40">
                      {line.adaptedText || line.text}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-amber-400/80 block">
                      [CULTURAL STAGING &amp; PHYSICAL GESTURES]
                    </span>
                    <p className="text-stone-300 font-sans leading-relaxed italic">
                      {line.adaptedText || line.text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
