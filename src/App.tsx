import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StepNav } from './components/StepNav';
import { UploadScreen } from './components/screens/UploadScreen';
import { ExtractionScreen } from './components/screens/ExtractionScreen';
import { ApprovalScreen } from './components/screens/ApprovalScreen';
import { ScreenplayScreen } from './components/screens/ScreenplayScreen';
import { VisualsScreen } from './components/screens/VisualsScreen';
import { ContinuityScreen } from './components/screens/ContinuityScreen';
import { DocumentationModal } from './components/DocumentationModal';
import { PromptSpecModal } from './components/PromptSpecModal';
import {
  AdaptationProject,
  CanonicalCharacter,
  CanonicalCostume,
  CulturalAdaptationPlan,
  DialectOption,
  SceneRecord,
  SettingType,
  VisualPromptSpec,
  WritingScript
} from './types/adaptation';
import { DIALECT_REGISTRY } from './data/dialectRegistry';
import { BENCHMARK_SCREENPLAYS } from './data/sampleScreenplays';
import {
  buildBenchmarkExtraction,
  generateAdaptationPlan
} from './utils/benchmarkExtraction';
import {
  buildPromptSpec,
  generateVisualPlate
} from './utils/proceduralVisuals';

export default function App() {
  const initialBenchmark = BENCHMARK_SCREENPLAYS[0];
  const initialCulture = DIALECT_REGISTRY[0]; // Majhi

  // Initial benchmark extraction
  const initialExtraction = buildBenchmarkExtraction(initialBenchmark.text, initialCulture);
  const initialPlan = generateAdaptationPlan(
    initialCulture,
    initialCulture.region,
    'rural',
    'latin',
    initialExtraction.characters
  );

  const [project, setProject] = useState<AdaptationProject>({
    id: 'proj_harvest_divide_majhi',
    title: initialBenchmark.title,
    sourceScreenplayText: initialBenchmark.text,
    selectedCulture: initialCulture,
    selectedRegion: initialCulture.region,
    selectedSetting: 'rural',
    selectedScript: 'latin',
    scenes: initialExtraction.scenes,
    characters: initialExtraction.characters,
    costumes: initialExtraction.costumes,
    locations: initialExtraction.locations,
    props: initialExtraction.props,
    adaptationPlan: initialPlan,
    contradictions: initialExtraction.contradictions,
    workflowStep: 'upload',
    isApprovedForVisuals: true // Pre-approved for instant demo readiness, but can be toggled
  });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [docsModalTab, setDocsModalTab] = useState<string | null>(null);
  const [inspectingSpec, setInspectingSpec] = useState<{
    title: string;
    spec: VisualPromptSpec;
  } | null>(null);

  // Handlers for Upload & Culture selection
  const handleScreenplayTextChange = (text: string) => {
    setProject((prev) => ({ ...prev, sourceScreenplayText: text }));
  };

  const handleCultureChange = (culture: DialectOption) => {
    // When culture changes, update adaptation plan
    const updatedPlan = generateAdaptationPlan(
      culture,
      culture.region,
      project.selectedSetting,
      project.selectedScript,
      project.characters
    );

    // Re-render procedural visual plates for the new culture
    const updatedCharacters = project.characters.map((char) => {
      const spec = buildPromptSpec('character', char.canonicalName, culture, {
        role: char.role,
        age: char.age
      });
      return {
        ...char,
        visualPromptSpec: spec,
        visualAssetUrl: generateVisualPlate('character', char.canonicalName, `${char.role} (${culture.name})`, culture, spec)
      };
    });

    const updatedCostumes = project.costumes.map((cos) => {
      const spec = buildPromptSpec('costume', cos.label, culture, {
        costume: `${cos.garments} (${cos.fabrics})`
      });
      return {
        ...cos,
        visualPromptSpec: spec,
        visualAssetUrl: generateVisualPlate('costume', cos.label, `${cos.garments}`, culture, spec)
      };
    });

    const updatedScenes = project.scenes.map((sc) => {
      const spec = buildPromptSpec('scene', sc.slugline, culture, {
        setting: culture.culturalAnchors.architecture,
        time: sc.time
      });
      return {
        ...sc,
        visualPromptSpec: spec,
        visualKeyframeUrl: generateVisualPlate('scene', `SCENE ${sc.scene_number}`, `${sc.sub_location}`, culture, spec)
      };
    });

    setProject((prev) => ({
      ...prev,
      selectedCulture: culture,
      selectedRegion: culture.region,
      adaptationPlan: updatedPlan,
      characters: updatedCharacters,
      costumes: updatedCostumes,
      scenes: updatedScenes
    }));
  };

  const handleRegionChange = (region: string) => {
    setProject((prev) => ({
      ...prev,
      selectedRegion: region,
      adaptationPlan: { ...prev.adaptationPlan, region }
    }));
  };

  const handleSettingChange = (setting: SettingType) => {
    setProject((prev) => ({
      ...prev,
      selectedSetting: setting,
      adaptationPlan: { ...prev.adaptationPlan, settingType: setting }
    }));
  };

  const handleScriptChange = (script: WritingScript) => {
    setProject((prev) => ({
      ...prev,
      selectedScript: script,
      adaptationPlan: { ...prev.adaptationPlan, writingScript: script }
    }));
  };

  const handleStartExtraction = async () => {
    setIsProcessing(true);
    try {
      // Attempt server extraction
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: project.sourceScreenplayText,
          cultureId: project.selectedCulture.id
        })
      });

      if (res.ok) {
        const data = await res.json();
        const plan = generateAdaptationPlan(
          project.selectedCulture,
          project.selectedRegion,
          project.selectedSetting,
          project.selectedScript,
          data.characters
        );
        setProject((prev) => ({
          ...prev,
          scenes: data.scenes,
          characters: data.characters,
          costumes: data.costumes,
          locations: data.locations,
          props: data.props,
          contradictions: data.contradictions,
          adaptationPlan: plan,
          workflowStep: 'extraction'
        }));
      } else {
        // Fallback to local deterministic extraction
        const localExt = buildBenchmarkExtraction(project.sourceScreenplayText, project.selectedCulture);
        const plan = generateAdaptationPlan(
          project.selectedCulture,
          project.selectedRegion,
          project.selectedSetting,
          project.selectedScript,
          localExt.characters
        );
        setProject((prev) => ({
          ...prev,
          ...localExt,
          adaptationPlan: plan,
          workflowStep: 'extraction'
        }));
      }
    } catch (e) {
      const localExt = buildBenchmarkExtraction(project.sourceScreenplayText, project.selectedCulture);
      const plan = generateAdaptationPlan(
        project.selectedCulture,
        project.selectedRegion,
        project.selectedSetting,
        project.selectedScript,
        localExt.characters
      );
      setProject((prev) => ({
        ...prev,
        ...localExt,
        adaptationPlan: plan,
        workflowStep: 'extraction'
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateScene = (sceneId: string, updated: Partial<SceneRecord>) => {
    setProject((prev) => ({
      ...prev,
      scenes: prev.scenes.map((s) => (s.scene_id === sceneId ? { ...s, ...updated } : s))
    }));
  };

  const handleUpdateCharacter = (charId: string, updated: Partial<CanonicalCharacter>) => {
    setProject((prev) => ({
      ...prev,
      characters: prev.characters.map((c) => (c.id === charId ? { ...c, ...updated } : c))
    }));
  };

  const handleToggleApproval = (approved: boolean) => {
    setProject((prev) => ({
      ...prev,
      isApprovedForVisuals: approved,
      adaptationPlan: { ...prev.adaptationPlan, approvedByHuman: approved }
    }));
  };

  const handleResolveContradiction = (id: string) => {
    setProject((prev) => ({
      ...prev,
      contradictions: prev.contradictions.map((c) =>
        c.id === id ? { ...c, resolved: true } : c
      )
    }));
  };

  // Single-Asset Retry Generator (Requirement 10: "A way to retry one failed asset without rebuilding the entire project")
  const handleRegenerateAsset = async (
    type: 'character' | 'costume' | 'scene',
    id: string,
    title: string,
    subtitle: string,
    spec?: VisualPromptSpec
  ) => {
    try {
      const res = await fetch('/api/generate-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          entityId: id,
          title,
          subtitle,
          cultureId: project.selectedCulture.id,
          spec
        })
      });

      if (res.ok) {
        const { assetUrl, promptSpec } = await res.json();
        if (type === 'character') {
          setProject((prev) => ({
            ...prev,
            characters: prev.characters.map((c) =>
              c.id === id ? { ...c, visualAssetUrl: assetUrl, visualPromptSpec: promptSpec } : c
            )
          }));
        } else if (type === 'costume') {
          setProject((prev) => ({
            ...prev,
            costumes: prev.costumes.map((cos) =>
              cos.id === id ? { ...cos, visualAssetUrl: assetUrl, visualPromptSpec: promptSpec } : cos
            )
          }));
        } else {
          setProject((prev) => ({
            ...prev,
            scenes: prev.scenes.map((sc) =>
              sc.scene_id === id ? { ...sc, visualKeyframeUrl: assetUrl, visualPromptSpec: promptSpec } : sc
            )
          }));
        }
      } else {
        // Fallback procedural regen
        const newSeed = Math.floor(Math.random() * 899999) + 100000;
        const newSpec: VisualPromptSpec = spec
          ? { ...spec, seed: newSeed }
          : buildPromptSpec(type, title, project.selectedCulture, {});
        const assetUrl = generateVisualPlate(type, title, subtitle, project.selectedCulture, newSpec);

        if (type === 'character') {
          setProject((prev) => ({
            ...prev,
            characters: prev.characters.map((c) =>
              c.id === id ? { ...c, visualAssetUrl: assetUrl, visualPromptSpec: newSpec } : c
            )
          }));
        } else if (type === 'costume') {
          setProject((prev) => ({
            ...prev,
            costumes: prev.costumes.map((cos) =>
              cos.id === id ? { ...cos, visualAssetUrl: assetUrl, visualPromptSpec: newSpec } : cos
            )
          }));
        } else {
          setProject((prev) => ({
            ...prev,
            scenes: prev.scenes.map((sc) =>
              sc.scene_id === id ? { ...sc, visualKeyframeUrl: assetUrl, visualPromptSpec: newSpec } : sc
            )
          }));
        }
      }
    } catch (e) {
      console.error('Failed to regenerate single asset:', e);
    }
  };

  const handleExportBundle = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/export-bundle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      if (res.ok) {
        const { filename, markdownReport, data } = await res.json();
        // Trigger file download
        const blob = new Blob([markdownReport], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `katha_setu_${project.selectedCulture.id}_production_pack.md`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (e) {
      console.error('Export bundle failed:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950">
      {/* Header */}
      <Header
        project={project}
        activeStep={project.workflowStep}
        onOpenDocs={(tab) => setDocsModalTab(tab || 'architecture')}
        onRunAudit={() => setProject((prev) => ({ ...prev, workflowStep: 'continuity_export' }))}
      />

      {/* Step Navigation Pipeline */}
      <StepNav
        currentStep={project.workflowStep}
        onSelectStep={(step) => setProject((prev) => ({ ...prev, workflowStep: step }))}
        project={project}
      />

      {/* Main Content Rendered by Pipeline Step */}
      <main className="flex-1">
        {project.workflowStep === 'upload' && (
          <UploadScreen
            screenplayText={project.sourceScreenplayText}
            onScreenplayChange={handleScreenplayTextChange}
            selectedCulture={project.selectedCulture}
            onCultureChange={handleCultureChange}
            selectedRegion={project.selectedRegion}
            onRegionChange={handleRegionChange}
            selectedSetting={project.selectedSetting}
            onSettingChange={handleSettingChange}
            selectedScript={project.selectedScript}
            onScriptChange={handleScriptChange}
            onStartExtraction={handleStartExtraction}
            isProcessing={isProcessing}
          />
        )}

        {project.workflowStep === 'extraction' && (
          <ExtractionScreen
            scenes={project.scenes}
            characters={project.characters}
            costumes={project.costumes}
            locations={project.locations}
            props={project.props}
            onUpdateScene={handleUpdateScene}
            onUpdateCharacter={handleUpdateCharacter}
            onProceedToApproval={() =>
              setProject((prev) => ({ ...prev, workflowStep: 'approval' }))
            }
            onReExtract={handleStartExtraction}
            isProcessing={isProcessing}
          />
        )}

        {project.workflowStep === 'approval' && (
          <ApprovalScreen
            culture={project.selectedCulture}
            plan={project.adaptationPlan}
            characters={project.characters}
            costumes={project.costumes}
            isApproved={project.isApprovedForVisuals}
            onToggleApproval={handleToggleApproval}
            onUpdatePlan={(updated) =>
              setProject((prev) => ({
                ...prev,
                adaptationPlan: { ...prev.adaptationPlan, ...updated }
              }))
            }
            onProceedToScreenplay={() =>
              setProject((prev) => ({ ...prev, workflowStep: 'screenplay' }))
            }
            onProceedToVisuals={() =>
              setProject((prev) => ({ ...prev, workflowStep: 'visuals' }))
            }
          />
        )}

        {project.workflowStep === 'screenplay' && (
          <ScreenplayScreen
            scenes={project.scenes}
            culture={project.selectedCulture}
            script={project.selectedScript}
            onProceedToVisuals={() =>
              setProject((prev) => ({ ...prev, workflowStep: 'visuals' }))
            }
          />
        )}

        {project.workflowStep === 'visuals' && (
          <VisualsScreen
            culture={project.selectedCulture}
            characters={project.characters}
            costumes={project.costumes}
            scenes={project.scenes}
            isApproved={project.isApprovedForVisuals}
            onRegenerateAsset={handleRegenerateAsset}
            onInspectSpec={(title, spec) => setInspectingSpec({ title, spec })}
            onProceedToContinuity={() =>
              setProject((prev) => ({ ...prev, workflowStep: 'continuity_export' }))
            }
            isProcessing={isProcessing}
          />
        )}

        {project.workflowStep === 'continuity_export' && (
          <ContinuityScreen
            project={project}
            onResolveContradiction={handleResolveContradiction}
            onExportBundle={handleExportBundle}
            isProcessing={isProcessing}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800 bg-stone-950 py-4 px-4 lg:px-8 text-center text-xs text-stone-500 font-mono">
        KathaSetu Cultural Screenplay &amp; Visual Adaptation Studio &bull; OTT Dialect AI Engineering Assignment
      </footer>

      {/* Modals */}
      {docsModalTab && (
        <DocumentationModal
          initialTab={docsModalTab}
          project={project}
          onClose={() => setDocsModalTab(null)}
        />
      )}

      {inspectingSpec && (
        <PromptSpecModal
          title={inspectingSpec.title}
          spec={inspectingSpec.spec}
          onClose={() => setInspectingSpec(null)}
        />
      )}
    </div>
  );
}
