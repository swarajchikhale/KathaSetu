import React, { useState } from 'react';
import {
  Image as ImageIcon,
  User,
  Shirt,
  Film,
  RefreshCw,
  Code,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  CanonicalCharacter,
  CanonicalCostume,
  DialectOption,
  SceneRecord,
  VisualPromptSpec
} from '../../types/adaptation';

interface VisualsScreenProps {
  culture: DialectOption;
  characters: CanonicalCharacter[];
  costumes: CanonicalCostume[];
  scenes: SceneRecord[];
  isApproved: boolean;
  onRegenerateAsset: (
    type: 'character' | 'costume' | 'scene',
    id: string,
    title: string,
    subtitle: string,
    spec?: VisualPromptSpec
  ) => Promise<void>;
  onInspectSpec: (title: string, spec: VisualPromptSpec) => void;
  onProceedToContinuity: () => void;
  isProcessing: boolean;
}

export const VisualsScreen: React.FC<VisualsScreenProps> = ({
  culture,
  characters,
  costumes,
  scenes,
  isApproved,
  onRegenerateAsset,
  onInspectSpec,
  onProceedToContinuity,
  isProcessing
}) => {
  const [activeCategory, setActiveCategory] = useState<'characters' | 'costumes' | 'scenes'>('characters');
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const handleRetry = async (
    type: 'character' | 'costume' | 'scene',
    id: string,
    title: string,
    subtitle: string,
    spec?: VisualPromptSpec
  ) => {
    setRetryingId(id);
    try {
      await onRegenerateAsset(type, id, title, subtitle, spec);
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900 border border-stone-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-stone-100">
              Visual Production Pack &amp; Continuity Gallery
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-semibold">
              Canonical Assets Locked
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Character bible, costume plates, and scene keyframes. Single-asset retry enables targeted regeneration without rebuilding project memory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onProceedToContinuity}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <span>Continuity Audit &amp; Export Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
        <button
          onClick={() => setActiveCategory('characters')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeCategory === 'characters'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Character Bible ({characters.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('costumes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeCategory === 'costumes'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Shirt className="w-3.5 h-3.5" />
          <span>Costume Bible ({costumes.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('scenes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeCategory === 'scenes'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Scene Keyframes ({scenes.length})</span>
        </button>
      </div>

      {/* Section 1: Character Bible */}
      {activeCategory === 'characters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => {
            const isRetrying = retryingId === char.id;
            return (
              <div
                key={char.id}
                className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg flex flex-col group hover:border-stone-700 transition-all"
              >
                {/* Visual Asset Container */}
                <div className="relative aspect-[3/4] bg-stone-950 overflow-hidden">
                  {char.visualAssetUrl ? (
                    <img
                      src={char.visualAssetUrl}
                      alt={char.canonicalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-600 text-xs font-mono">
                      No Visual Generated
                    </div>
                  )}

                  {/* Overlaid Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-stone-950/80 backdrop-blur text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30">
                      {char.id}
                    </span>
                  </div>

                  {/* Single Asset Retry Action */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() =>
                        char.visualPromptSpec &&
                        onInspectSpec(char.canonicalName, char.visualPromptSpec)
                      }
                      className="p-2 rounded-lg bg-stone-950/80 backdrop-blur hover:bg-stone-900 text-stone-300 text-xs border border-stone-700 transition-colors"
                      title="Inspect Model Prompt Specification"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() =>
                        handleRetry(
                          'character',
                          char.id,
                          char.canonicalName,
                          `${char.role} (${culture.name})`,
                          char.visualPromptSpec
                        )
                      }
                      disabled={isRetrying}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500/90 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                      title="Regenerate only this visual without rebuilding project"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`}
                      />
                      <span>{isRetrying ? 'Regenerating...' : 'Retry Asset'}</span>
                    </button>
                  </div>
                </div>

                {/* Character Metadata Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-stone-100">
                        {char.canonicalName}
                      </h3>
                      <span className="text-[10px] font-mono text-stone-400">
                        Age {char.age}
                      </span>
                    </div>

                    <div className="text-amber-400/90 font-semibold text-[11px]">
                      Adapted: {char.adaptedName || char.canonicalName}
                    </div>

                    <p className="text-stone-300 line-clamp-2">
                      <span className="text-stone-400">Role:</span> {char.role}
                    </p>

                    <p className="text-stone-400 line-clamp-2 text-[11px]">
                      <span className="text-stone-400 font-semibold">Grooming:</span>{' '}
                      {char.grooming}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-800 text-[10px] font-mono text-stone-500">
                    Aliases: {char.aliases.join(', ')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Section 2: Costume Bible */}
      {activeCategory === 'costumes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {costumes.map((cos) => {
            const isRetrying = retryingId === cos.id;
            return (
              <div
                key={cos.id}
                className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg flex flex-col group hover:border-stone-700 transition-all"
              >
                <div className="relative aspect-[3/4] bg-stone-950 overflow-hidden">
                  {cos.visualAssetUrl ? (
                    <img
                      src={cos.visualAssetUrl}
                      alt={cos.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-600 text-xs font-mono">
                      No Plate Generated
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-stone-950/80 backdrop-blur text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30">
                      {cos.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-stone-900/80 backdrop-blur text-stone-300 font-mono text-[10px]">
                      {cos.characterId}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() =>
                        cos.visualPromptSpec &&
                        onInspectSpec(cos.label, cos.visualPromptSpec)
                      }
                      className="p-2 rounded-lg bg-stone-950/80 backdrop-blur hover:bg-stone-900 text-stone-300 text-xs border border-stone-700 transition-colors"
                      title="Inspect Model Prompt Specification"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() =>
                        handleRetry(
                          'costume',
                          cos.id,
                          cos.label,
                          `${cos.garments}`,
                          cos.visualPromptSpec
                        )
                      }
                      disabled={isRetrying}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500/90 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`}
                      />
                      <span>{isRetrying ? 'Regenerating...' : 'Retry Plate'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-2 text-xs flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-stone-100">{cos.label}</h3>
                      <span className="text-[10px] font-mono text-stone-400">
                        Scenes: {cos.scenesAppearing.join(', ')}
                      </span>
                    </div>

                    <div className="text-stone-300">
                      <span className="text-stone-400 font-semibold">Garments:</span>{' '}
                      {cos.garments}
                    </div>

                    <div className="text-stone-300">
                      <span className="text-stone-400 font-semibold">Fabrics:</span>{' '}
                      {cos.fabrics} • {cos.colors}
                    </div>

                    <div className="text-stone-400 text-[11px]">
                      Footwear: {cos.footwear} | Headwear: {cos.headwear}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Section 3: Scene Look Keyframes */}
      {activeCategory === 'scenes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenes.map((sc) => {
            const isRetrying = retryingId === sc.scene_id;
            return (
              <div
                key={sc.scene_id}
                className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg flex flex-col group hover:border-stone-700 transition-all"
              >
                <div className="relative aspect-[16/9] bg-stone-950 overflow-hidden">
                  {sc.visualKeyframeUrl ? (
                    <img
                      src={sc.visualKeyframeUrl}
                      alt={sc.slugline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-600 text-xs font-mono">
                      No Keyframe Generated
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-stone-950/80 backdrop-blur text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30">
                      {sc.scene_id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-stone-900/80 backdrop-blur text-stone-300 font-mono text-[10px]">
                      {sc.int_ext} • {sc.time}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() =>
                        sc.visualPromptSpec &&
                        onInspectSpec(sc.slugline, sc.visualPromptSpec)
                      }
                      className="p-2 rounded-lg bg-stone-950/80 backdrop-blur hover:bg-stone-900 text-stone-300 text-xs border border-stone-700 transition-colors"
                      title="Inspect Model Prompt Specification"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() =>
                        handleRetry(
                          'scene',
                          sc.scene_id,
                          `SCENE ${sc.scene_number}`,
                          `${sc.sub_location} (${sc.time})`,
                          sc.visualPromptSpec
                        )
                      }
                      disabled={isRetrying}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500/90 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`}
                      />
                      <span>{isRetrying ? 'Regenerating...' : 'Retry Keyframe'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-stone-100">{sc.slugline}</h3>
                  </div>
                  <p className="text-stone-300 leading-relaxed">{sc.dramatic_purpose}</p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap text-stone-400 font-mono text-[11px]">
                    <span>Characters: {sc.characters.join(', ')}</span>
                    <span>&bull;</span>
                    <span>Costumes: {sc.costume_ids.join(', ')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
