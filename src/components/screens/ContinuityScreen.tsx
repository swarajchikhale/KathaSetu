import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Download,
  FileJson,
  FileText,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Eye,
  Check
} from 'lucide-react';
import {
  AdaptationProject,
  ContinuityContradiction
} from '../../types/adaptation';

interface ContinuityScreenProps {
  project: AdaptationProject;
  onResolveContradiction: (id: string) => void;
  onExportBundle: () => void;
  isProcessing: boolean;
}

export const ContinuityScreen: React.FC<ContinuityScreenProps> = ({
  project,
  onResolveContradiction,
  onExportBundle,
  isProcessing
}) => {
  const [selectedContradictionId, setSelectedContradictionId] = useState<string | null>(
    project.contradictions[0]?.id || null
  );
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const unresolved = project.contradictions.filter((c) => !c.resolved);
  const selectedContradiction = project.contradictions.find(
    (c) => c.id === selectedContradictionId
  );

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `scene_breakdown_${project.selectedCulture.id}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess('scene_breakdown.json');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadReport = () => {
    const reportText = `# ${project.title} - Cultural Adaptation & Visual Continuity Pack
**Culture & Dialect:** ${project.selectedCulture.name}
**Region:** ${project.selectedRegion}
**Setting:** ${project.selectedSetting.toUpperCase()}
**Script:** ${project.selectedScript.toUpperCase()}
**Date:** ${new Date().toLocaleDateString()}

---

## 1. Executive Summary & Narrative Preservation
${project.adaptationPlan.whyStoryIsPreserved}

## 2. Verbal & Non-Verbal Adaptation Rules
- **Dialect Lexicon:** ${project.adaptationPlan.verbalAdaptationStrategy.dialectFeatures}
- **Kinship Terms:** ${project.adaptationPlan.verbalAdaptationStrategy.kinshipAndHonorifics}
- **Spatial Seating:** ${project.adaptationPlan.nonVerbalAdaptationStrategy.seatingAndSpatialHierarchy}
- **Gestures & Respect:** ${project.adaptationPlan.nonVerbalAdaptationStrategy.greetingsAndRespect}

## 3. Canonical Character Bible
${project.characters
  .map(
    (c) => `### [${c.id}] ${c.canonicalName} &rarr; ${c.adaptedName}
- **Role:** ${c.role} (Adapted: ${c.adaptedRole})
- **Age:** ${c.age}
- **Grooming:** ${c.grooming}
- **Physical:** ${c.physicalDescription}
- **Aliases Merged:** ${c.aliases.join(', ')}
`
  )
  .join('\n')}

## 4. Costume Bible
${project.costumes
  .map(
    (cos) => `### [${cos.id}] ${cos.label}
- **Character:** ${cos.characterId}
- **Scenes Appearing:** ${cos.scenesAppearing.join(', ')}
- **Garments:** ${cos.garments}
- **Fabrics & Colors:** ${cos.fabrics} (${cos.colors})
- **Footwear/Headwear:** ${cos.footwear}, ${cos.headwear}
`
  )
  .join('\n')}

## 5. Structured Scene Breakdown
${project.scenes
  .map(
    (s) => `### Scene ${s.scene_number}: ${s.slugline}
- **Sub-Location:** ${s.sub_location} (${s.int_ext})
- **Time/Weather:** ${s.time} | ${s.weather}
- **Characters:** ${s.characters.join(', ')}
- **Costumes:** ${s.costume_ids.join(', ')}
- **Props In:** ${s.props_in.join(', ') || 'None'}
- **Props Out:** ${s.props_out.join(', ') || 'None'}
- **Dramatic Purpose:** ${s.dramatic_purpose}
- **Emotional Arc:** ${s.emotional_change}
`
  )
  .join('\n')}

## 6. Continuity Contradiction Audit Report
${project.contradictions
  .map(
    (contra) => `- [${contra.severity}] ${contra.type} (Affects: ${contra.affectedScenes.join(', ')}):
  Issue: ${contra.description}
  Resolution: ${contra.suggestedResolution}
  Status: ${contra.resolved ? 'RESOLVED' : 'ACTIVE AUDIT NOTE'}
`
  )
  .join('\n')}
`;

    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(reportText);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `continuity_report_${project.selectedCulture.id}.md`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess('continuity_report.md');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900 border border-stone-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-stone-100">
              Continuity Audit &amp; Production Export Studio
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${
                unresolved.length === 0
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              {unresolved.length === 0
                ? 'All Continuity Checks Passed'
                : `${unresolved.length} Contradiction Notes`}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Detect prop disappearances, costume teleportation, and character collisions. Download complete production package.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition-colors"
          >
            <FileJson className="w-3.5 h-3.5 text-amber-400" />
            <span>scene_breakdown.json</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>continuity_report.md</span>
          </button>

          <button
            onClick={onExportBundle}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Export Full Production Pack</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-600/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Successfully downloaded {downloadSuccess}!</span>
        </div>
      )}

      {/* Main Grid: Contradictions on Left, Affected Scenes on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Contradiction Engine List */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-bold text-stone-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Contradiction Detection Engine
            </span>
            <span className="text-xs font-normal text-stone-400 font-mono">
              Total Audited: {project.contradictions.length}
            </span>
          </h3>

          <div className="space-y-3">
            {project.contradictions.map((contra) => {
              const isSelected = selectedContradictionId === contra.id;
              return (
                <div
                  key={contra.id}
                  onClick={() => setSelectedContradictionId(contra.id)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                      : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold ${
                          contra.severity === 'CRITICAL'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {contra.severity}
                      </span>
                      <span className="font-mono font-bold text-stone-200">
                        {contra.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-stone-400">
                        Affects: {contra.affectedScenes.join(', ')}
                      </span>
                      {contra.resolved && (
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-2 text-stone-300 leading-relaxed">
                    {contra.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-stone-800 text-[11px] text-stone-400">
                    <span className="text-amber-400/90 font-semibold">Suggested Fix:</span>{' '}
                    {contra.suggestedResolution}
                  </div>

                  {!contra.resolved && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onResolveContradiction(contra.id);
                        }}
                        className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-medium transition-colors"
                      >
                        Mark Verified / Resolved
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Affected Scene Traceability */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            Affected Scene Traceability
          </h3>

          {selectedContradiction ? (
            <div className="space-y-4">
              <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl text-xs space-y-2">
                <span className="text-stone-400 font-semibold">Focusing on issue:</span>
                <p className="text-stone-200 font-mono text-[11px]">
                  {selectedContradiction.id} &bull; {selectedContradiction.type}
                </p>
                <div className="text-[11px] text-amber-300">
                  Affected Scenes: {selectedContradiction.affectedScenes.join(' & ')}
                </div>
              </div>

              {selectedContradiction.affectedScenes.map((sceneId) => {
                const sc = project.scenes.find((s) => s.scene_id === sceneId);
                if (!sc) return null;

                return (
                  <div
                    key={sc.scene_id}
                    className="p-5 bg-stone-900/90 border border-amber-500/30 rounded-2xl space-y-3 text-xs shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                        {sc.scene_id}
                      </span>
                      <span className="font-mono text-stone-400 text-[11px]">
                        {sc.time} &bull; {sc.sub_location}
                      </span>
                    </div>

                    <h4 className="font-mono text-xs font-bold text-stone-200">
                      {sc.slugline}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-stone-950 rounded-lg text-[11px]">
                      <div>
                        <span className="text-stone-400">Props In:</span>{' '}
                        <span className="font-mono text-emerald-400">
                          {sc.props_in.join(', ') || 'None'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400">Props Out:</span>{' '}
                        <span className="font-mono text-amber-400">
                          {sc.props_out.join(', ') || 'None'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400">Characters:</span>{' '}
                        <span className="font-mono text-stone-300">
                          {sc.characters.join(', ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400">Costumes:</span>{' '}
                        <span className="font-mono text-stone-300">
                          {sc.costume_ids.join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="text-stone-300 text-[11px] leading-relaxed">
                      <span className="text-stone-400">Emotional Transition:</span>{' '}
                      {sc.emotional_change}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-stone-900/40 border border-stone-800 rounded-2xl text-stone-500 text-xs">
              Select any contradiction on the left to inspect its affected scenes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
