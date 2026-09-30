import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
  MessageSquare,
  Users,
  Compass,
  Check,
  Lock,
  Unlock,
  Edit3
} from 'lucide-react';
import {
  CanonicalCharacter,
  CanonicalCostume,
  CulturalAdaptationPlan,
  DialectOption
} from '../../types/adaptation';

interface ApprovalScreenProps {
  culture: DialectOption;
  plan: CulturalAdaptationPlan;
  characters: CanonicalCharacter[];
  costumes: CanonicalCostume[];
  isApproved: boolean;
  onToggleApproval: (approved: boolean) => void;
  onUpdatePlan: (updated: Partial<CulturalAdaptationPlan>) => void;
  onProceedToScreenplay: () => void;
  onProceedToVisuals: () => void;
}

export const ApprovalScreen: React.FC<ApprovalScreenProps> = ({
  culture,
  plan,
  characters,
  costumes,
  isApproved,
  onToggleApproval,
  onUpdatePlan,
  onProceedToScreenplay,
  onProceedToVisuals
}) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'characters' | 'costumes' | 'uncertainties'>('plan');
  const [checklist, setChecklist] = useState({
    noDuplicateCharacters: true,
    exactDialectVerified: true,
    preservesCoreDramaticConflict: true,
    costumeLogicJustified: true,
    nonVerbalHierarchyReviewed: true
  });

  const allChecklistItemsChecked = Object.values(checklist).every(Boolean);

  const toggleChecklistItem = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Human Approval Gate Banner */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isApproved
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isApproved ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <Lock className="w-5 h-5 text-amber-400" />
              )}
              <h2 className="text-lg font-serif font-bold text-stone-100">
                {isApproved
                  ? 'Cultural Adaptation Plan & Canonical Identities: APPROVED'
                  : 'Stage 3: Mandatory Human Approval Gate'}
              </h2>
            </div>
            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              {isApproved
                ? 'Visual asset generation and screenplay adaptation pipelines are now unlocked with locked canonical IDs and stable continuity references.'
                : 'Review cultural justifications, character aliases, kinship addresses, and costume bibles. Image generation is gated until human sign-off.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleApproval(!isApproved)}
              disabled={!allChecklistItemsChecked && !isApproved}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                isApproved
                  ? 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
                  : allChecklistItemsChecked
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-950/50'
                  : 'bg-stone-800 text-stone-500 opacity-60 cursor-not-allowed border border-stone-800'
              }`}
            >
              {isApproved ? (
                <>
                  <Unlock className="w-4 h-4 text-stone-400" />
                  <span>Revoke Approval (Unlock for Editing)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sign &amp; Approve Cultural Plan</span>
                </>
              )}
            </button>

            {isApproved && (
              <button
                onClick={onProceedToScreenplay}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>View Adapted Screenplay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Verification Checklist */}
        {!isApproved && (
          <div className="mt-5 pt-4 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[
              { key: 'noDuplicateCharacters', label: 'Canonical aliases merged (no duplicate characters)' },
              { key: 'exactDialectVerified', label: `Exact dialect verified: ${culture.name.split('(')[0]}` },
              { key: 'preservesCoreDramaticConflict', label: 'Core dramatic purpose and emotional arc preserved' },
              { key: 'costumeLogicJustified', label: 'Costumes linked to verified dramatic time-steps' },
              { key: 'nonVerbalHierarchyReviewed', label: 'Seating, gestures and honorifics culturally grounded' }
            ].map((item) => (
              <label
                key={item.key}
                onClick={() => toggleChecklistItem(item.key as any)}
                className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer select-none p-2 rounded-lg bg-stone-950/60 hover:bg-stone-950 border border-stone-800"
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                    checklist[item.key as keyof typeof checklist]
                      ? 'bg-emerald-500 border-emerald-500 text-stone-950'
                      : 'border-stone-600 bg-stone-900'
                  }`}
                >
                  {checklist[item.key as keyof typeof checklist] && (
                    <Check className="w-3 h-3 stroke-[3]" />
                  )}
                </div>
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'plan'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Cultural Adaptation Strategy</span>
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
          <span>Character Transformation Map ({characters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('costumes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'costumes'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>World Building &amp; Costumes ({costumes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('uncertainties')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'uncertainties'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Assumptions &amp; Uncertainty Log ({plan.uncertaintiesAndAssumptions?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Cultural Plan Strategy */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          {/* Preservation of Story Callout */}
          <div className="p-5 bg-stone-900 border border-stone-800 rounded-2xl space-y-2">
            <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold">
              Story Preservation Principle (Brief Section 3)
            </span>
            <p className="text-xs text-stone-200 leading-relaxed font-sans">
              {plan.whyStoryIsPreserved}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Verbal Strategy */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                Verbal Adaptation Strategy
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-stone-300 block">Dialect &amp; Phonology:</span>
                  <p className="text-stone-400 mt-0.5">{plan.verbalAdaptationStrategy.dialectFeatures}</p>
                </div>
                <div>
                  <span className="font-semibold text-stone-300 block">Kinship &amp; Honorifics:</span>
                  <p className="text-stone-400 mt-0.5">{plan.verbalAdaptationStrategy.kinshipAndHonorifics}</p>
                </div>
                <div>
                  <span className="font-semibold text-stone-300 block">Humor, Rhythm &amp; Cadence:</span>
                  <p className="text-stone-400 mt-0.5">{plan.verbalAdaptationStrategy.humourAndCadence}</p>
                </div>
                <div>
                  <span className="font-semibold text-stone-300 block">Code-Switching Policy:</span>
                  <p className="text-stone-400 mt-0.5">{plan.verbalAdaptationStrategy.codeSwitchingPolicy}</p>
                </div>
              </div>
            </div>

            {/* Non-Verbal Strategy */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                Non-Verbal &amp; Spatial Hierarchy
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-stone-300 block">Greetings &amp; Respect:</span>
                  <p className="text-stone-400 mt-0.5">{plan.nonVerbalAdaptationStrategy.greetingsAndRespect}</p>
                </div>
                <div>
                  <span className="font-semibold text-stone-300 block">Seating &amp; Spatial Hierarchy:</span>
                  <p className="text-stone-400 mt-0.5">{plan.nonVerbalAdaptationStrategy.seatingAndSpatialHierarchy}</p>
                </div>
                <div>
                  <span className="font-semibold text-stone-300 block">Eye Contact &amp; Physical Touch:</span>
                  <p className="text-stone-400 mt-0.5">{plan.nonVerbalAdaptationStrategy.touchAndEyeContact}</p>
                </div>
                <div>
                  <span className="font-semibold text-stone-300 block">Eating, Drinking &amp; Hospitality:</span>
                  <p className="text-stone-400 mt-0.5">{plan.nonVerbalAdaptationStrategy.eatingAndFoodHospitality}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Character Transformation Map */}
      {activeTab === 'characters' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-semibold text-stone-100">
              Character Cultural Transformation Map
            </h3>
            <p className="text-xs text-stone-400">
              How neutral source roles are mapped to authentic positions in {culture.name} family and community structure.
            </p>
          </div>

          <div className="space-y-4">
            {plan.characterAdaptationMap.map((mapping) => (
              <div
                key={mapping.canonicalId}
                className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400">{mapping.canonicalId}</span>
                    <span className="text-stone-400">&bull;</span>
                    <span className="text-stone-300 font-semibold">{mapping.sourceName}</span>
                    <span className="text-stone-500">&rarr;</span>
                    <span className="text-amber-300 font-bold">{mapping.adaptedName}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                    {mapping.socialRoleShift}
                  </span>
                </div>
                <div className="text-stone-300 leading-relaxed pt-1">
                  <span className="text-stone-400 font-semibold">Cultural Justification:</span>{' '}
                  {mapping.culturalJustification}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: World Building & Costumes */}
      {activeTab === 'costumes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-stone-100">
              Regional Material Culture &amp; Environment
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-stone-300 block">Architecture &amp; Domestic Space:</span>
                <p className="text-stone-400 mt-0.5">{plan.worldBuilding.architecture}</p>
              </div>
              <div>
                <span className="font-semibold text-stone-300 block">Wardrobe, Weaves &amp; Dyes:</span>
                <p className="text-stone-400 mt-0.5">{plan.worldBuilding.wardrobeAndFabrics}</p>
              </div>
              <div>
                <span className="font-semibold text-stone-300 block">Transport &amp; Domestic Tools:</span>
                <p className="text-stone-400 mt-0.5">{plan.worldBuilding.transportAndProps}</p>
              </div>
              <div>
                <span className="font-semibold text-stone-300 block">Soundscape &amp; Public Rituals:</span>
                <p className="text-stone-400 mt-0.5">{plan.worldBuilding.soundscapeAndRituals}</p>
              </div>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-stone-100">
              Costume Variant Plan ({costumes.length} unique variants)
            </h3>
            <div className="space-y-3">
              {costumes.map((cos) => (
                <div
                  key={cos.id}
                  className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400">{cos.id}</span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      Scenes: {cos.scenesAppearing.join(', ')}
                    </span>
                  </div>
                  <div className="font-semibold text-stone-200">{cos.label}</div>
                  <div className="text-stone-400 text-[11px]">{cos.garments} ({cos.fabrics})</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Uncertainty Log */}
      {activeTab === 'uncertainties' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-semibold text-stone-100">
              Uncertainties, Assumptions &amp; Edge Cases
            </h3>
            <p className="text-xs text-stone-400">
              Brief Requirement 10: &quot;Clear handling of model failure, uncertain cultural knowledge and incomplete source documents.&quot;
            </p>
          </div>

          <div className="space-y-3">
            {plan.uncertaintiesAndAssumptions?.map((u, i) => (
              <div
                key={i}
                className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-300 flex items-start gap-3"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">{u}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
