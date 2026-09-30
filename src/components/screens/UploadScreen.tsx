import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  BookOpen,
  MapPin,
  Building2,
  FileCode,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DialectOption, SettingType, WritingScript } from '../../types/adaptation';
import { DIALECT_REGISTRY } from '../../data/dialectRegistry';
import { BENCHMARK_SCREENPLAYS } from '../../data/sampleScreenplays';

interface UploadScreenProps {
  screenplayText: string;
  onScreenplayChange: (text: string) => void;
  selectedCulture: DialectOption;
  onCultureChange: (culture: DialectOption) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  selectedSetting: SettingType;
  onSettingChange: (setting: SettingType) => void;
  selectedScript: WritingScript;
  onScriptChange: (script: WritingScript) => void;
  onStartExtraction: () => void;
  isProcessing: boolean;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  screenplayText,
  onScreenplayChange,
  selectedCulture,
  onCultureChange,
  selectedRegion,
  onRegionChange,
  selectedSetting,
  onSettingChange,
  selectedScript,
  onScriptChange,
  onStartExtraction,
  isProcessing
}) => {
  const [activeBenchmarkId, setActiveBenchmarkId] = useState<string>('the_harvest_divide');

  const handleBenchmarkSelect = (id: string) => {
    setActiveBenchmarkId(id);
    const found = BENCHMARK_SCREENPLAYS.find((b) => b.id === id);
    if (found) {
      onScreenplayChange(found.text);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onScreenplayChange(content);
        setActiveBenchmarkId('custom');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/30 border border-stone-800 rounded-2xl p-6 lg:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OTT Production Platform Specification</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-100 tracking-tight">
            Cultural Screenplay &amp; Visual Adaptation Studio
          </h1>
          <p className="mt-2 text-stone-300 text-sm lg:text-base leading-relaxed">
            Transform short neutral screenplays into exact, deep Indian regional cultures and dialects.
            Every adaptation rebuilds the story world: vernacular idioms, non-verbal posture, kinship hierarchy,
            and canonical visual assets (character bible, costume bible, and keyframes) without narrative drift.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Accurate scene &amp; canonical entity extraction
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Human approval gate before visual generation
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Physical contradiction &amp; prop continuity audit
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Screenplay Input */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-stone-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  1. Neutral Screenplay Input (3-5 Scenes)
                </h2>
                <p className="text-xs text-stone-400">
                  Select a supplied benchmark or paste/upload your own screenplay text
                </p>
              </div>

              {/* Upload Button */}
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors">
                <Upload className="w-3.5 h-3.5 text-stone-400" />
                <span>Upload TXT/DOC</span>
                <input
                  type="file"
                  accept=".txt,.text,.fountain,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Benchmark Preset Selector */}
            <div className="flex flex-wrap gap-2 pt-1">
              {BENCHMARK_SCREENPLAYS.map((benchmark) => (
                <button
                  key={benchmark.id}
                  onClick={() => handleBenchmarkSelect(benchmark.id)}
                  className={`px-3 py-2 rounded-xl text-left border text-xs transition-all ${
                    activeBenchmarkId === benchmark.id
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-300'
                  }`}
                >
                  <div className="font-semibold text-stone-200">{benchmark.title}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    {benchmark.pageCount} • {benchmark.sceneCount} Scenes • {benchmark.characterCount} Characters
                  </div>
                </button>
              ))}
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={screenplayText}
                onChange={(e) => {
                  onScreenplayChange(e.target.value);
                  setActiveBenchmarkId('custom');
                }}
                rows={16}
                placeholder="Paste screenplay here in standard slugline format (SCENE 1: INT. LOCATION - TIME)..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-4 font-mono text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors leading-relaxed"
              />
              <div className="absolute bottom-3 right-4 text-[11px] font-mono text-stone-500 bg-stone-950/80 px-2 py-0.5 rounded">
                {screenplayText.split('\n').length} lines • {screenplayText.length} characters
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Exact Culture & Dialect Selection */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-base font-semibold text-stone-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                2. Exact Indian Culture &amp; Dialect
              </h2>
              <div className="mt-1.5 flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  High precision required: Broad labels like &quot;Punjabi look&quot; or &quot;North Indian village&quot; are prohibited by brief.
                </span>
              </div>
            </div>

            {/* Dialect Selection List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {DIALECT_REGISTRY.map((dialect) => {
                const isSelected = selectedCulture.id === dialect.id;
                return (
                  <button
                    key={dialect.id}
                    onClick={() => {
                      onCultureChange(dialect);
                      onRegionChange(dialect.region);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-100 shadow-sm'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{dialect.name}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                        {dialect.state}
                      </span>
                    </div>
                    <div className="text-xs text-stone-400 mt-1">{dialect.region}</div>
                    <div className="text-[11px] text-amber-300/80 mt-1 italic line-clamp-1">
                      &quot;{dialect.sampleGreeting}&quot;
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Setting (Rural vs Urban) */}
            <div className="space-y-2 pt-2 border-t border-stone-800">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-stone-400" />
                Setting Environment
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['rural', 'semi-urban', 'urban'] as SettingType[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => onSettingChange(st)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border capitalize transition-all ${
                      selectedSetting === st
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Writing Script */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-stone-400" />
                Output Writing Script
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'latin', label: 'Latin (Transliteration)' },
                  { id: 'devanagari', label: 'Devanagari (देवनागरी)' },
                  { id: 'gurmukhi', label: 'Gurmukhi (ਗੁਰਮੁਖੀ)' },
                  { id: 'nastaliq', label: 'Nastaliq (نستعلیق)' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onScriptChange(s.id as WritingScript)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
                      selectedScript === s.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Details Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">
                Specific Region / Locality
              </label>
              <input
                type="text"
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value)}
                placeholder="e.g. Majha Belt (Tarn Taran border village)"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Primary Action Button */}
            <div className="pt-3">
              <button
                onClick={onStartExtraction}
                disabled={isProcessing || !screenplayText.trim()}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Extracting Structured Entities &amp; Scenes...</span>
                  </>
                ) : (
                  <>
                    <span>Run Scene Extraction &amp; Normalization</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
