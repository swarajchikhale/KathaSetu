import React, { useState } from 'react';
import {
  Table,
  Users,
  Shirt,
  Box,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  Plus,
  ArrowRight,
  Eye,
  Sliders,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  CanonicalCharacter,
  CanonicalCostume,
  CanonicalLocation,
  CanonicalProp,
  SceneRecord
} from '../../types/adaptation';

interface ExtractionScreenProps {
  scenes: SceneRecord[];
  characters: CanonicalCharacter[];
  costumes: CanonicalCostume[];
  locations: CanonicalLocation[];
  props: CanonicalProp[];
  onUpdateScene: (sceneId: string, updated: Partial<SceneRecord>) => void;
  onUpdateCharacter: (charId: string, updated: Partial<CanonicalCharacter>) => void;
  onProceedToApproval: () => void;
  onReExtract: () => void;
  isProcessing: boolean;
}

export const ExtractionScreen: React.FC<ExtractionScreenProps> = ({
  scenes,
  characters,
  costumes,
  locations,
  props,
  onUpdateScene,
  onUpdateCharacter,
  onProceedToApproval,
  onReExtract,
  isProcessing
}) => {
  const [activeTab, setActiveTab] = useState<'scenes' | 'characters' | 'costumes' | 'props'>('scenes');
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0]?.scene_id || 'SC01');
  const [editingCharId, setEditingCharId] = useState<string | null>(null);

  const selectedScene = scenes.find((s) => s.scene_id === selectedSceneId) || scenes[0];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900 border border-stone-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-stone-100">
              Structured Scene &amp; Entity Extraction
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
              Extraction Complete
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Review and edit extracted scenes, normalized character identities, costumes, and continuity states before cultural adaptation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReExtract}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs font-medium transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>Re-Run Extraction</span>
          </button>

          <button
            onClick={onProceedToApproval}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <span>Proceed to Canonical Approval Gate</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('scenes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'scenes'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Scene Records ({scenes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('characters')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'characters'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Canonical Characters ({characters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('costumes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'costumes'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Shirt className="w-3.5 h-3.5" />
          <span>Costume Registry ({costumes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('props')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'props'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Props &amp; Locations ({props.length + locations.length})</span>
        </button>
      </div>

      {/* Tab 1: Scenes View */}
      {activeTab === 'scenes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scene List Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 px-1">
              Scene Sequence
            </h3>
            <div className="space-y-2">
              {scenes.map((scene) => {
                const isSelected = scene.scene_id === selectedSceneId;
                return (
                  <button
                    key={scene.scene_id}
                    onClick={() => setSelectedSceneId(scene.scene_id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/60 shadow-sm'
                        : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {scene.scene_id}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                        {scene.int_ext} • {scene.time}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-stone-200 mt-1.5 truncate">
                      {scene.sub_location}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-1 line-clamp-2">
                      {scene.short_summary}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      {scene.characters.map((cid) => (
                        <span
                          key={cid}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700"
                        >
                          {cid}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Scene Breakdown Detail */}
          {selectedScene && (
            <div className="lg:col-span-8 space-y-5 bg-stone-900/90 border border-stone-800 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                      {selectedScene.scene_id}
                    </span>
                    <h3 className="font-mono text-sm font-bold text-stone-100">
                      {selectedScene.slugline}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    {selectedScene.day_or_date} • {selectedScene.weather}
                  </p>
                </div>
              </div>

              {/* Editable Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-300">
                    Dramatic Purpose
                  </label>
                  <textarea
                    value={selectedScene.dramatic_purpose}
                    onChange={(e) =>
                      onUpdateScene(selectedScene.scene_id, {
                        dramatic_purpose: e.target.value
                      })
                    }
                    rows={2}
                    className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300">
                    Emotional Arc Transition
                  </label>
                  <textarea
                    value={selectedScene.emotional_change}
                    onChange={(e) =>
                      onUpdateScene(selectedScene.scene_id, {
                        emotional_change: e.target.value
                      })
                    }
                    rows={2}
                    className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* Character State & Knowledge Tracking */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                  State &amp; Continuity Matrix ({selectedScene.character_states?.length || 0} characters)
                </h4>
                <div className="space-y-2">
                  {selectedScene.character_states?.map((state) => (
                    <div
                      key={state.character_id}
                      className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-amber-400">
                          {state.character_id}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          Physical: {state.injuries_or_physical || 'Nominal'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-300">
                        <div>
                          <span className="text-stone-400">Before:</span>{' '}
                          {state.emotional_state_before}
                        </div>
                        <div>
                          <span className="text-stone-400">After:</span>{' '}
                          {state.emotional_state_after}
                        </div>
                      </div>
                      <div className="text-[11px] text-stone-400">
                        <span className="text-amber-300">Knowledge gained:</span>{' '}
                        {state.knowledge_gained || 'None'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Props In & Out */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    Props Entering Scene (Props In)
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedScene.props_in?.length ? (
                      selectedScene.props_in.map((p) => (
                        <span
                          key={p}
                          className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 text-xs font-mono"
                        >
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-stone-500 italic">No props carried in</span>
                    )}
                  </div>
                </div>

                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                  <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    Props Leaving Scene (Props Out)
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedScene.props_out?.length ? (
                      selectedScene.props_out.map((p) => (
                        <span
                          key={p}
                          className="px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40 text-xs font-mono"
                        >
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-stone-500 italic">No props carried out</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Raw Scene JSON Inspection */}
              <div className="pt-2">
                <details className="text-xs text-stone-400 group">
                  <summary className="cursor-pointer hover:text-stone-300 font-mono text-[11px] py-1">
                    [+] View Extracted Scene Record JSON
                  </summary>
                  <pre className="mt-2 p-3 rounded-lg bg-stone-950 border border-stone-800 overflow-x-auto text-[11px] font-mono text-amber-300/90 max-h-48">
                    {JSON.stringify(
                      {
                        scene_id: selectedScene.scene_id,
                        location_id: selectedScene.location_id,
                        time: selectedScene.time,
                        characters: selectedScene.characters,
                        costume_ids: selectedScene.costume_ids,
                        props_in: selectedScene.props_in,
                        props_out: selectedScene.props_out,
                        emotional_change: selectedScene.emotional_change,
                        continuity_warnings: selectedScene.continuity_warnings
                      },
                      null,
                      2
                    )}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Canonical Characters Table */}
      {activeTab === 'characters' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-stone-100">
                Canonical Character Identities
              </h3>
              <p className="text-xs text-stone-400">
                Ensure aliases are merged into single canonical IDs. No duplicate characters permitted.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950 text-stone-400 border-b border-stone-800 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3">Canonical ID</th>
                  <th className="p-3">Source Name</th>
                  <th className="p-3">Merged Aliases</th>
                  <th className="p-3">Age &amp; Role</th>
                  <th className="p-3">Personality &amp; Relationships</th>
                  <th className="p-3">Adapted Regional Name</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {characters.map((char) => (
                  <tr key={char.id} className="hover:bg-stone-800/40">
                    <td className="p-3 font-mono font-bold text-amber-400">
                      {char.id}
                    </td>
                    <td className="p-3 font-semibold text-stone-200">
                      {char.canonicalName}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {char.aliases.map((a) => (
                          <span
                            key={a}
                            className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 font-mono text-[10px]"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-stone-300">
                      Age {char.age} • <span className="text-stone-400">{char.role}</span>
                    </td>
                    <td className="p-3 text-stone-300 max-w-xs truncate">
                      {char.personality}
                    </td>
                    <td className="p-3 font-semibold text-amber-300">
                      {char.adaptedName || 'Pending Plan'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setEditingCharId(char.id)}
                        className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Costume Registry */}
      {activeTab === 'costumes' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-semibold text-stone-100">
              Costume Registry &amp; Continuity Mapping
            </h3>
            <p className="text-xs text-stone-400">
              Costumes remain stable across scenes unless a verified dramatic reason causes a change.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {costumes.map((cos) => (
              <div
                key={cos.id}
                className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-400">
                    {cos.id}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                    Scenes: {cos.scenesAppearing.join(', ')}
                  </span>
                </div>
                <div className="font-semibold text-stone-200">{cos.label}</div>
                <div className="text-stone-300">
                  <span className="text-stone-400">Garments:</span> {cos.garments}
                </div>
                <div className="text-stone-300">
                  <span className="text-stone-400">Fabrics &amp; Colors:</span>{' '}
                  {cos.fabrics} • {cos.colors}
                </div>
                <div className="text-stone-300">
                  <span className="text-stone-400">Footwear &amp; Headwear:</span>{' '}
                  {cos.footwear}, {cos.headwear}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Props & Locations */}
      {activeTab === 'props' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-stone-100">
              Canonical Props ({props.length})
            </h3>
            <div className="space-y-3">
              {props.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400">{p.id}</span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {p.firstIntroducedScene} &rarr; {p.lastKnownScene}
                    </span>
                  </div>
                  <div className="font-semibold text-stone-200">{p.name}</div>
                  <div className="text-stone-400 text-[11px]">{p.description}</div>
                  <div className="text-amber-300/90 text-[11px] mt-1">
                    Adapted: {p.culturalAdaptedEquivalent}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-stone-100">
              Canonical Locations ({locations.length})
            </h3>
            <div className="space-y-3">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400">{loc.id}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                      {loc.type}
                    </span>
                  </div>
                  <div className="font-semibold text-stone-200">{loc.name}</div>
                  <div className="text-stone-400 text-[11px]">{loc.architectureDetails}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
