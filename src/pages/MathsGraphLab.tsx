import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  Moon,
  Plus,
  RotateCcw,
  Trash2,
  Sun,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import SEO from '@/components/SEO';
import { GraphCanvas } from '@/features/graph-lab/GraphCanvas';
import { ExpressionEditor } from '@/features/graph-lab/ExpressionEditor';
import { GuidedJourneyPanel } from '@/features/graph-lab/GuidedJourneyPanel';
import { inferAsymptotes } from '@/features/graph-lab/asymptotes';
import {
  EQUATION_FAMILIES,
  getFamily,
  initialParameters,
  type ParameterKey,
} from '@/features/graph-lab/equation-presets';
import { ParameterInspector } from '@/features/graph-lab/ParameterInspector';
import {
  TRANSFORMATION_JOURNEY,
  resumeGuidedStep,
  createInitialGuidedProgress,
  readGuidedState,
  writeGuidedState,
  type GraphLabMode,
  type GuidedProgress,
} from '@/features/graph-lab/guided-transformations';
import { parseExpression } from '@/features/graph-lab/parser';
import { sampleExpression } from '@/features/graph-lab/sampling';
import type { GraphExpression, Viewport } from '@/features/graph-lab/types';
import { DEFAULT_VIEWPORT, formatViewportBound, validateViewport, zoomViewport } from '@/features/graph-lab/viewport';
import { readGraphLabTheme, writeGraphLabTheme, type GraphLabTheme } from '@/features/graph-lab/graph-lab-theme';
import '@/features/graph-lab/graph-lab-theme.css';

const COLORS = ['#c51f3a', '#5d568e', '#2f7b66', '#a36a12', '#8e4d8c', '#22649a', '#9a4f27', '#486b2b'];
const MAX_EXPRESSIONS = 20;

const viewportToDraft = (viewport: Viewport) => ({
  xMin: formatViewportBound(viewport.xMin),
  xMax: formatViewportBound(viewport.xMax),
  yMin: formatViewportBound(viewport.yMin),
  yMax: formatViewportBound(viewport.yMax),
});

type FreeWorkspace = {
  expressions: GraphExpression[];
  viewport: Viewport;
  selectedFamilyId: string;
  selectedFormId: string;
  parameterValues: Record<ParameterKey, number>;
  isPresetDriven: boolean;
};

const MathsGraphLab = () => {
  const nextIdRef = useRef(2);
  const [expressions, setExpressions] = useState<GraphExpression[]>([
    { id: 'expression-1', source: 'x^2 - 3', color: COLORS[0], visible: true },
  ]);
  const deferredExpressions = useDeferredValue(expressions);
  const [viewport, setViewport] = useState<Viewport>(DEFAULT_VIEWPORT);
  const [viewportDraft, setViewportDraft] = useState(() => viewportToDraft(DEFAULT_VIEWPORT));
  const [viewportError, setViewportError] = useState('');
  const [selectedFamilyId, setSelectedFamilyId] = useState('parabola');
  const [selectedFormId, setSelectedFormId] = useState('general');
  const [isPresetDriven, setIsPresetDriven] = useState(true);
  const initialForm = getFamily('parabola').forms[0];
  const [parameterValues, setParameterValues] = useState<Record<ParameterKey, number>>(() => initialParameters(initialForm));
  const [guidedProgress, setGuidedProgress] = useState<GuidedProgress>(() => (
    typeof window === 'undefined' ? createInitialGuidedProgress() : readGuidedState(window.localStorage) ?? createInitialGuidedProgress()
  ));
  const [mode, setMode] = useState<GraphLabMode>(() => (
    typeof window === 'undefined' ? 'guided' : readGuidedState(window.localStorage)?.lastMode ?? 'guided'
  ));
  const [freeWorkspace, setFreeWorkspace] = useState<FreeWorkspace | null>(null);
  const [guidedWorkspace, setGuidedWorkspace] = useState<FreeWorkspace | null>(null);
  const [guidedControlsUnlocked, setGuidedControlsUnlocked] = useState(false);
  const [theme, setTheme] = useState<GraphLabTheme>(() => (
    typeof window === 'undefined' ? 'light' : readGraphLabTheme(window.localStorage)
  ));
  const hasConfiguredInitialModeRef = useRef(false);

  useEffect(() => {
    document.body.dataset.daGraphLabActive = 'true';
    return () => { delete document.body.dataset.daGraphLabActive; };
  }, []);

  useEffect(() => {
    writeGuidedState(typeof window === 'undefined' ? null : window.localStorage, guidedProgress);
  }, [guidedProgress]);

  const plotExpressions = useMemo(() => deferredExpressions.map((expression) => {
    try {
      const ast = parseExpression(expression.source);
      const sampled = expression.visible
        ? sampleExpression(ast, viewport, 678, 406)
        : { segments: [], sampleCount: 0, hitBudget: false };
      return { ...expression, ...sampled, error: '' };
    } catch (caught) {
      return {
        ...expression,
        segments: [],
        sampleCount: 0,
        hitBudget: false,
        error: caught instanceof Error ? caught.message : 'That expression could not be read.',
      };
    }
  }), [deferredExpressions, viewport]);

  const guidedReferenceExpressions = useMemo(() => {
    if (mode !== 'guided' || !guidedControlsUnlocked) return [];
    const step = TRANSFORMATION_JOURNEY[Math.min(guidedProgress.stepIndex, TRANSFORMATION_JOURNEY.length - 1)];
    if (step.unlockedParameters.length === 0) return [];
    const family = getFamily(step.familyId);
    const form = family.forms.find((candidate) => candidate.id === step.formId) ?? family.forms[0];
    return form.buildExpressions(initialParameters(form)).flatMap((source, index) => {
      try {
        return [{
          id: `guided-reference-${index}`,
          source,
          color: '#66758d',
          visible: true,
          ...sampleExpression(parseExpression(source), viewport, 678, 406),
          error: '',
        }];
      } catch {
        return [];
      }
    });
  }, [guidedControlsUnlocked, guidedProgress.stepIndex, mode, viewport]);

  const errorsById = useMemo(
    () => new Map(plotExpressions.map((expression) => [expression.id, expression.error])),
    [plotExpressions],
  );

  const selectedFamily = getFamily(selectedFamilyId);
  const selectedForm = selectedFamily.forms.find((form) => form.id === selectedFormId) ?? selectedFamily.forms[0];
  const asymptotes = useMemo(() => {
    const candidates = isPresetDriven
      ? selectedForm.asymptotes?.(parameterValues, viewport) ?? []
      : expressions.filter((expression) => expression.visible).flatMap((expression) => inferAsymptotes(expression.source, viewport));
    const seen = new Set<string>();
    return candidates.filter((asymptote) => {
      const visible = asymptote.orientation === 'vertical'
        ? asymptote.value >= viewport.xMin && asymptote.value <= viewport.xMax
        : asymptote.value >= viewport.yMin && asymptote.value <= viewport.yMax;
      const key = `${asymptote.orientation}-${asymptote.value.toFixed(7)}`;
      if (!visible || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [expressions, isPresetDriven, parameterValues, selectedForm, viewport]);

  const applyViewport = (nextViewport: Viewport) => {
    const error = validateViewport(nextViewport);
    if (error) {
      setViewportError(error);
      return;
    }
    setViewport(nextViewport);
    setViewportDraft(viewportToDraft(nextViewport));
    setViewportError('');
  };

  const commitViewportDraft = (override?: Partial<typeof viewportDraft>) => {
    const draft = { ...viewportDraft, ...override };
    const parseBound = (value: string) => value.trim() === '' ? Number.NaN : Number(value);
    const candidate: Viewport = {
      xMin: parseBound(draft.xMin),
      xMax: parseBound(draft.xMax),
      yMin: parseBound(draft.yMin),
      yMax: parseBound(draft.yMax),
    };
    applyViewport(candidate);
  };

  const addExpression = () => {
    setExpressions((current) => {
      if (current.length >= MAX_EXPRESSIONS) return current;
      const id = `expression-${nextIdRef.current}`;
      nextIdRef.current += 1;
      return [...current, {
        id,
        source: 'sin(x)',
        color: COLORS[current.length % COLORS.length],
        visible: true,
      }];
    });
  };

  const setExpressionsFromForm = (
    familyId: string,
    formId: string,
    values: Record<ParameterKey, number>,
  ) => {
    const family = getFamily(familyId);
    const form = family.forms.find((candidate) => candidate.id === formId) ?? family.forms[0];
    const groupId = form.displayExpression ? `expression-group-${nextIdRef.current}` : undefined;
    setExpressions(form.buildExpressions(values).map((source, branchIndex) => {
      const id = `expression-${nextIdRef.current}`;
      nextIdRef.current += 1;
      return {
        id,
        source,
        color: COLORS[0],
        visible: true,
        lineStyle: branchIndex === 0 ? 0 : 0,
        groupId,
        isInternalBranch: Boolean(groupId && branchIndex > 0),
        displayLatex: branchIndex === 0 ? form.displayLatex?.(values) : undefined,
      };
    }));
  };

  const configureGuidedStep = (stepIndex: number) => {
    const step = TRANSFORMATION_JOURNEY[Math.min(stepIndex, TRANSFORMATION_JOURNEY.length - 1)];
    const family = getFamily(step.familyId);
    const form = family.forms.find((candidate) => candidate.id === step.formId) ?? family.forms[0];
    const values = initialParameters(form);
    setSelectedFamilyId(family.id);
    setSelectedFormId(form.id);
    setParameterValues(values);
    setIsPresetDriven(true);
    setExpressionsFromForm(family.id, form.id, values);
    applyViewport(family.viewport);
  };

  const chooseMode = (nextMode: GraphLabMode) => {
    if (nextMode === mode && guidedProgress.hasChosenMode) return;
    if (nextMode === 'guided') {
      setFreeWorkspace({ expressions, viewport, selectedFamilyId, selectedFormId, parameterValues, isPresetDriven });
      if (guidedWorkspace) {
        setExpressions(guidedWorkspace.expressions);
        applyViewport(guidedWorkspace.viewport);
        setSelectedFamilyId(guidedWorkspace.selectedFamilyId);
        setSelectedFormId(guidedWorkspace.selectedFormId);
        setParameterValues(guidedWorkspace.parameterValues);
        setIsPresetDriven(guidedWorkspace.isPresetDriven);
      } else {
        configureGuidedStep(guidedProgress.stepIndex);
      }
    } else {
      setGuidedWorkspace({ expressions, viewport, selectedFamilyId, selectedFormId, parameterValues, isPresetDriven });
      if (freeWorkspace) {
        setExpressions(freeWorkspace.expressions);
        applyViewport(freeWorkspace.viewport);
        setSelectedFamilyId(freeWorkspace.selectedFamilyId);
        setSelectedFormId(freeWorkspace.selectedFormId);
        setParameterValues(freeWorkspace.parameterValues);
        setIsPresetDriven(freeWorkspace.isPresetDriven);
      }
    }
    setMode(nextMode);
    setGuidedProgress((current) => ({ ...current, hasChosenMode: true, lastMode: nextMode }));
  };

  const updateGuidedProgress = (nextProgress: GuidedProgress) => {
    setGuidedProgress(nextProgress);
    if (!nextProgress.completed && nextProgress.stepIndex !== guidedProgress.stepIndex) configureGuidedStep(nextProgress.stepIndex);
  };

  const restartGuidedJourney = () => {
    const restarted = { ...createInitialGuidedProgress(), hasChosenMode: true, lastMode: 'guided' as const };
    setGuidedProgress(restarted);
    configureGuidedStep(0);
  };

  const revisitGuidedStep = (stepIndex: number) => {
    updateGuidedProgress(resumeGuidedStep(guidedProgress, stepIndex));
  };

  useEffect(() => {
    if (hasConfiguredInitialModeRef.current || !guidedProgress.hasChosenMode) return;
    hasConfiguredInitialModeRef.current = true;
    if (mode !== 'guided') return;
    const step = TRANSFORMATION_JOURNEY[Math.min(guidedProgress.stepIndex, TRANSFORMATION_JOURNEY.length - 1)];
    const family = getFamily(step.familyId);
    const form = family.forms.find((candidate) => candidate.id === step.formId) ?? family.forms[0];
    const values = initialParameters(form);
    setSelectedFamilyId(family.id);
    setSelectedFormId(form.id);
    setParameterValues(values);
    setIsPresetDriven(true);
    setExpressionsFromForm(family.id, form.id, values);
    applyViewport(family.viewport);
  }, [guidedProgress.hasChosenMode, guidedProgress.stepIndex, mode]);

  const chooseFamily = (familyId: string) => {
    const family = getFamily(familyId);
    const form = family.forms[0];
    const values = initialParameters(form);
    setSelectedFamilyId(family.id);
    setIsPresetDriven(true);
    setSelectedFormId(form.id);
    setIsPresetDriven(true);
    setParameterValues(values);
    setExpressionsFromForm(family.id, form.id, values);
    applyViewport(family.viewport);
  };

  const chooseForm = (formId: string) => {
    const family = getFamily(selectedFamilyId);
    const form = family.forms.find((candidate) => candidate.id === formId) ?? family.forms[0];
    const values = initialParameters(form);
    setSelectedFormId(form.id);
    setParameterValues(values);
    setExpressionsFromForm(family.id, form.id, values);
  };

  const changeParameter = (key: ParameterKey, value: number) => {
    const nextValues = { ...parameterValues, [key]: value };
    setIsPresetDriven(true);
    setParameterValues(nextValues);
    setExpressionsFromForm(selectedFamilyId, selectedFormId, nextValues);
  };

  const guidedParameterKeys = mode === 'guided'
    ? (guidedControlsUnlocked ? TRANSFORMATION_JOURNEY[Math.min(guidedProgress.stepIndex, TRANSFORMATION_JOURNEY.length - 1)].unlockedParameters : [])
    : undefined;

  const parameterInspector = <ParameterInspector
    family={selectedFamily}
    formId={selectedFormId}
    values={parameterValues}
    onFormChange={chooseForm}
    onParameterChange={changeParameter}
    compact
    parameterKeys={guidedParameterKeys}
    guidedTitle={mode === 'guided' ? 'Change only what this challenge needs' : undefined}
    emptyParameterMessage={mode === 'guided' ? (guidedControlsUnlocked ? 'This opening step uses the parent graph without changing a coefficient.' : 'Make a prediction to unlock this challenge’s controls.') : undefined}
  />;

  const updateExpression = (id: string, update: Partial<GraphExpression>) => {
    if (update.source !== undefined) setIsPresetDriven(false);
    setExpressions((current) => current.map((expression) => (
      expression.id === id ? { ...expression, ...update } : expression
    )));
  };

  const updateExpressionGroup = (expression: GraphExpression, update: Partial<GraphExpression>) => {
    if (!expression.groupId) {
      updateExpression(expression.id, update);
      return;
    }
    setExpressions((current) => current.map((candidate) => (
      candidate.groupId === expression.groupId ? { ...candidate, ...update } : candidate
    )));
  };

  const removeExpressionGroup = (expression: GraphExpression) => {
    setExpressions((current) => current.filter((candidate) => (
      expression.groupId ? candidate.groupId !== expression.groupId : candidate.id !== expression.id
    )));
  };

  const chooseTheme = (nextTheme: GraphLabTheme) => {
    setTheme(nextTheme);
    writeGraphLabTheme(typeof window === 'undefined' ? null : window.localStorage, nextTheme);
  };

  return (
    <div className="graph-lab-shell min-h-screen bg-[#fffdf8] text-[#172033]" data-graph-lab data-graph-lab-theme={theme}>
      <SEO
        title="DA Graph Lab | Interactive Mathematics"
        description="Explore functions, transformations and graphs with DA Tuition's interactive mathematics graphing lab."
        canonicalUrl="/maths-graph-lab"
      />
      <NavigationNew />
      <main className="graph-lab-themed">
        <header className="bg-[#071629] px-5 pb-9 pt-24 text-white lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link
              to="/subjects/mathematics"
              className="inline-flex min-h-11 items-center rounded-lg text-sm font-bold text-[#f1df9a] outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#f1df9a] focus-visible:ring-offset-4 focus-visible:ring-offset-[#071629]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Mathematics
            </Link>
            <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-black text-[#c88bd2]">DA Graph Lab</p>
                <h1 className="mt-2 max-w-3xl font-serif text-4xl font-medium leading-[1.08] tracking-[-0.035em] sm:text-5xl">See the equation become a graph.</h1>
              </div>
              <p className="max-w-xl text-sm leading-7 text-[#d5dfec] lg:text-right">Enter a function, compare its shape, then use the coordinate system to explain what changed.</p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {guidedProgress.hasChosenMode ? (
                <div className="inline-flex rounded-xl border border-white/20 bg-white/7 p-1" aria-label="Graph Lab mode">
                  <button type="button" onClick={() => chooseMode('guided')} aria-pressed={mode === 'guided'} className="inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-black text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#f1df9a] aria-pressed:bg-[#f1df9a] aria-pressed:text-[#071629]"><GraduationCap className="mr-2 h-4 w-4" /> Guided Learning</button>
                  <button type="button" onClick={() => chooseMode('free')} aria-pressed={mode === 'free'} className="inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-black text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#f1df9a] aria-pressed:bg-white aria-pressed:text-[#071629]"><BookOpen className="mr-2 h-4 w-4" /> Free Graph</button>
                </div>
              ) : null}
              <div className="inline-flex rounded-xl border border-white/20 bg-white/7 p-1" aria-label="Graph Lab appearance">
                <button type="button" onClick={() => chooseTheme('light')} aria-pressed={theme === 'light'} className="graph-lab-theme-choice inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-black text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#f1df9a] aria-pressed:bg-white aria-pressed:text-[#071629]"><Sun className="mr-2 h-4 w-4" /> Light</button>
                <button type="button" onClick={() => chooseTheme('dark')} aria-pressed={theme === 'dark'} className="graph-lab-theme-choice inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-black text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#f1df9a] aria-pressed:bg-[#f1df9a] aria-pressed:text-[#071629]"><Moon className="mr-2 h-4 w-4" /> Dark</button>
              </div>
            </div>
          </div>
        </header>

        {!guidedProgress.hasChosenMode ? (
          <section className="bg-[#f3f7fb] px-4 py-12 sm:px-5 lg:px-8" aria-labelledby="choose-mode-heading">
            <div className="mx-auto max-w-5xl">
              <p className="text-center text-sm font-black text-[#7a5709]">Choose how you want to use Graph Lab</p>
              <h2 id="choose-mode-heading" className="mx-auto mt-2 max-w-3xl text-center font-serif text-4xl font-medium tracking-[-0.035em] text-[#071629]">Learn with DA, or graph something quickly.</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <button type="button" onClick={() => chooseMode('guided')} className="rounded-2xl bg-[#071629] p-6 text-left text-white outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#5d568e] focus-visible:ring-offset-4">
                  <GraduationCap className="h-7 w-7 text-[#f1df9a]" />
                  <span className="mt-5 block text-xl font-black">Start Guided Learning</span>
                  <span className="mt-2 block text-sm leading-7 text-[#d5dfec]">A 12–15 minute transformation journey: predict, experiment, explain and receive a mastery summary.</span>
                  <span className="mt-5 inline-flex items-center text-sm font-black text-[#f1df9a]">Recommended for Years 11–12 <ArrowLeft className="ml-2 h-4 w-4 rotate-180" /></span>
                </button>
                <button type="button" onClick={() => chooseMode('free')} className="rounded-2xl border border-[#071629]/15 bg-white p-6 text-left text-[#071629] outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#5d568e] focus-visible:ring-offset-4">
                  <BookOpen className="h-7 w-7 text-[#5d568e]" />
                  <span className="mt-5 block text-xl font-black">Open Free Graph</span>
                  <span className="mt-2 block text-sm leading-7 text-[#40516b]">Enter, compare and transform functions without lesson prompts. Switch to guided learning whenever you want.</span>
                  <span className="mt-5 inline-flex items-center text-sm font-black text-[#5d568e]">Use the calculator <ArrowLeft className="ml-2 h-4 w-4 rotate-180" /></span>
                </button>
              </div>
            </div>
          </section>
        ) : (

        <section className="graph-lab-workspace bg-[#f3f7fb] px-4 py-6 sm:px-5 lg:px-8 lg:py-8" aria-label="Graphing workspace">
          <div className={`mx-auto grid max-w-[1600px] gap-4 ${mode === 'guided' ? 'min-[960px]:grid-cols-[minmax(300px,360px)_minmax(0,1fr)]' : 'min-[1180px]:grid-cols-[260px_minmax(520px,1fr)_340px] min-[1500px]:grid-cols-[280px_minmax(620px,1fr)_360px]'}`}>
            <div className={mode === 'guided' ? 'min-w-0' : 'hidden'}>
              <GuidedJourneyPanel progress={guidedProgress} onProgressChange={updateGuidedProgress} onRestart={restartGuidedJourney} onRevisit={revisitGuidedStep} onControlsUnlockedChange={setGuidedControlsUnlocked} parameterValues={parameterValues} controls={parameterInspector} />
            </div>
            <aside className={`${mode === 'free' ? 'block' : 'hidden'} graph-lab-panel rounded-2xl border border-[#071629]/12 bg-white p-4 sm:p-5`} aria-labelledby="expressions-heading">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 id="expressions-heading" className="text-base font-black text-[#071629]">Expressions</h2>
                  <p className="mt-1 text-xs text-[#536077]">Compare up to {MAX_EXPRESSIONS} functions</p>
                </div>
                <button
                  type="button"
                  onClick={addExpression}
                  disabled={expressions.length >= MAX_EXPRESSIONS}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#071629] text-[#f1df9a] outline-none transition-colors hover:bg-[#153458] focus-visible:ring-2 focus-visible:ring-[#8e4d8c] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Add expression"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {expressions.length === 0 ? (
                  <div className="rounded-xl bg-[#f3f7fb] p-4 text-sm leading-6 text-[#40516b]">
                    Add an expression or choose an example to begin.
                  </div>
                ) : expressions.filter((expression) => !expression.isInternalBranch).map((expression, index) => {
                  const error = errorsById.get(expression.id) ?? '';
                  const errorId = `${expression.id}-error`;
                  return (
                    <div key={expression.id}>
                      <div className="grid grid-cols-[1rem_minmax(0,1fr)] gap-x-2">
                        <span className="mt-5 h-1 w-4 rounded-full" style={{ backgroundColor: expression.color }} aria-hidden="true" />
                        <ExpressionEditor
                          id={expression.id}
                          value={expression.source}
                          onChange={(source) => updateExpression(expression.id, { source })}
                          describedBy={error ? errorId : undefined}
                          invalid={Boolean(error)}
                          label={`Expression ${index + 1}`}
                          displayLatex={expression.displayLatex}
                          readOnly={Boolean(expression.groupId)}
                        />
                        <div className="col-start-2 mt-1 flex justify-end gap-1" aria-label={`Expression ${index + 1} controls`}>
                          <button
                            type="button"
                            onClick={() => updateExpressionGroup(expression, { visible: !expression.visible })}
                            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#40516b] outline-none hover:bg-[#edf2f7] focus-visible:ring-2 focus-visible:ring-[#5d568e]"
                            aria-label={`${expression.visible ? 'Hide' : 'Show'} expression ${index + 1}`}
                          >
                            {expression.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeExpressionGroup(expression)}
                            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#8f3446] outline-none hover:bg-[#fff0f2] focus-visible:ring-2 focus-visible:ring-[#a52d43]"
                            aria-label={`Remove expression ${index + 1}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p id={errorId} className="mt-1.5 min-h-5 pl-6 text-xs leading-5 text-[#9b263c]" aria-live="polite">
                        {error}
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="mt-2 text-xs leading-5 text-[#536077]">
                Multiplication may be written as <code>2x</code>, <code>2(x+1)</code> or <code>2sin(x)</code>.
              </p>

              <div className="mt-5 border-t border-[#071629]/10 pt-5">
                <h3 className="text-sm font-black text-[#7a5709]">Try an example</h3>
                {(['Polynomial', 'Trigonometric', 'Other functions'] as const).map((category) => (
                  <div key={category} className="mt-4">
                    <p className="text-[11px] font-bold text-[#68758b]">{category}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {EQUATION_FAMILIES.filter((family) => family.category === category).map((family) => (
                        <button
                          key={family.id}
                          type="button"
                          onClick={() => chooseFamily(family.id)}
                          aria-pressed={isPresetDriven && selectedFamilyId === family.id}
                          className="graph-lab-example-chip min-h-11 rounded-full border border-[#071629]/20 px-3 py-2 text-xs font-bold text-[#172033] outline-none transition-colors hover:border-[#5d568e] hover:bg-[#f7f3fa] focus-visible:ring-2 focus-visible:ring-[#5d568e] focus-visible:ring-offset-2 aria-pressed:border-[#5d568e] aria-pressed:bg-[#eee8f4] aria-pressed:text-[#392e59]"
                        >
                          {family.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            <div className="graph-lab-panel graph-lab-graph-panel min-w-0 rounded-2xl bg-white p-3 shadow-[0_5px_8px_rgba(7,22,41,0.08)] sm:p-5">
              <GraphCanvas expressions={plotExpressions} referenceExpressions={guidedReferenceExpressions} viewport={viewport} asymptotes={asymptotes} onViewportChange={applyViewport} theme={theme} />

              <div className="mt-5 border-t border-[#071629]/10 pt-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                  <fieldset>
                    <legend className="text-sm font-black text-[#071629]">Viewport</legend>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {([
                        ['xMin', 'x minimum'],
                        ['xMax', 'x maximum'],
                        ['yMin', 'y minimum'],
                        ['yMax', 'y maximum'],
                      ] as const).map(([key, label]) => (
                        <label key={key} className="text-xs font-bold text-[#536077]">
                          {label}
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={viewportDraft[key]}
                            onChange={(event) => {
                              const value = event.target.value;
                              setViewportDraft((current) => ({ ...current, [key]: value }));
                              if (value.trim() === '') setViewportError('Use finite numbers for every boundary.');
                            }}
                            onBlur={(event) => commitViewportDraft({ [key]: event.currentTarget.value })}
                            onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur(); }}
                            aria-invalid={Boolean(viewportError)}
                            className="mt-1 h-11 w-full rounded-lg border border-[#071629]/20 px-3 font-mono text-sm text-[#172033] outline-none focus:border-[#5d568e] focus:ring-2 focus:ring-[#5d568e]/20 aria-[invalid=true]:border-[#a52d43]"
                          />
                        </label>
                      ))}
                    </div>
                    <p className="mt-1 min-h-5 text-xs text-[#9b263c]" aria-live="polite">{viewportError}</p>
                  </fieldset>

                  <div className="flex flex-wrap gap-2" aria-label="Graph view controls">
                    <button type="button" onClick={() => applyViewport(zoomViewport(viewport, 'in'))} className="inline-flex min-h-11 items-center rounded-lg border border-[#071629]/20 px-3 text-sm font-bold outline-none hover:bg-[#f3f7fb] focus-visible:ring-2 focus-visible:ring-[#5d568e]">
                      <ZoomIn className="mr-2 h-4 w-4" /> Zoom in
                    </button>
                    <button type="button" onClick={() => applyViewport(zoomViewport(viewport, 'out'))} className="inline-flex min-h-11 items-center rounded-lg border border-[#071629]/20 px-3 text-sm font-bold outline-none hover:bg-[#f3f7fb] focus-visible:ring-2 focus-visible:ring-[#5d568e]">
                      <ZoomOut className="mr-2 h-4 w-4" /> Zoom out
                    </button>
                    <button type="button" onClick={() => applyViewport(DEFAULT_VIEWPORT)} className="inline-flex min-h-11 items-center rounded-lg bg-[#071629] px-3 text-sm font-bold text-white outline-none hover:bg-[#153458] focus-visible:ring-2 focus-visible:ring-[#5d568e] focus-visible:ring-offset-2">
                      <RotateCcw className="mr-2 h-4 w-4" /> Reset view
                    </button>
                  </div>
                </div>

                {plotExpressions.some((expression) => expression.hitBudget) ? (
                  <p className="mt-3 rounded-lg bg-[#fff7df] px-3 py-2 text-sm text-[#6f4d05]" role="status">
                    This graph reached the safe sampling limit. Narrow the viewport for more detail.
                  </p>
                ) : null}

              </div>
            </div>
            {mode === 'free' ? <aside className="graph-lab-panel min-w-0 rounded-2xl border border-[#071629]/12 bg-white p-4 sm:p-5 min-[1180px]:sticky min-[1180px]:top-24 min-[1180px]:self-start" aria-label="Equation controls">
              {parameterInspector}
            </aside> : null}
          </div>
        </section>

        )}

        {guidedProgress.hasChosenMode && mode === 'free' ? <section className="px-5 py-12 lg:px-8" aria-labelledby="investigation-heading">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 border-y border-[#071629]/12 py-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <h2 id="investigation-heading" className="font-serif text-3xl font-medium tracking-[-0.03em] text-[#071629]">Change one thing at a time.</h2>
              <p className="mt-3 text-sm leading-7 text-[#40516b]">Add a second expression, keep the first visible, then alter one number. Describe the change using amplitude, period, translation, intercept or turning point.</p>
            </div>
            <div className="max-w-md rounded-xl bg-[#071629] p-5 text-white">
              <p className="font-black text-[#f1df9a]">Prediction prompt</p>
              <p className="mt-2 text-sm leading-7 text-[#d5dfec]">Before changing the equation, where do you expect the graph to move—and which part of the equation controls it?</p>
            </div>
          </div>
        </section> : null}
      </main>
      <FooterNew />
    </div>
  );
};

export default MathsGraphLab;
