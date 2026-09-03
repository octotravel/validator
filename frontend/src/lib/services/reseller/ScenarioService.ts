import { apiRequest, showError, showWarning } from '$lib/services/api';
import {
	resellerScenarioAnswersStore,
	resellerScenarioQuestionsValidationStore,
	resellerScenarioSelectedStore,
	resellerScenarioValidationResultStore,
	resellerScenariosListLoadingStore,
	resellerSessionStore
} from '$lib/stores';
import type { QuestionValidation, Scenario, Step } from '$lib/types/Scenarios';
import {
	ScenarioProgressStepStatus,
	type ScenarioProgress,
	type ScenarioProgressStep,
	type Session
} from '$lib/types/Session';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { get } from 'svelte/store';

let scenarioRequestSeq = 0;

export abstract class ScenariosService {
	public static getScenarios = async (toastStore: ToastStore) => {
		resellerScenariosListLoadingStore.set(true);

		try {
			const capabilities = get(resellerSessionStore).session?.capabilities;

			const result = await apiRequest<Scenario[]>('/api/reseller/scenarios', {
				headers: { 'Octo-capabilities': capabilities?.join(',') || '' }
			});

			if (!result.ok) {
				resellerSessionStore.update((s) => ({ ...s, error: result.error }));
				showError(toastStore, 'Could not load scenarios', result.error);
				return;
			}

			const sessionStore = get(resellerSessionStore);

			if (!sessionStore.session) {
				return;
			}

			const existing = sessionStore.session.scenariosProgress;

			const scenariosProgress: ScenarioProgress[] = (result.data ?? []).map((scenario) => ({
				...scenario,
				steps: existing.find((sp) => sp.id === scenario.id)?.steps || []
			}));

			const updatedSession: Session = { ...sessionStore.session, scenariosProgress };

			resellerSessionStore.update((s) => ({ ...s, session: updatedSession, error: null }));
		} finally {
			resellerScenariosListLoadingStore.set(false);
		}
	};

	public static getScenario = async (id: string, toastStore: ToastStore) => {
		const seq = ++scenarioRequestSeq;

		resellerScenarioSelectedStore.update((s) => ({
			...s,
			isLoading: true,
			scenario: null,
			error: null
		}));
		resellerScenarioAnswersStore.set([]);

		try {
			const result = await apiRequest<Scenario>(
				`/api/reseller/scenario?id=${encodeURIComponent(id)}`
			);

			if (seq !== scenarioRequestSeq) {
				return;
			}

			if (!result.ok) {
				resellerScenarioSelectedStore.update((s) => ({ ...s, error: result.error }));
				showError(toastStore, 'Could not load scenario', result.error);
				return;
			}

			const scenario = result.data;
			const sessionStore = get(resellerSessionStore);

			if (!scenario || !sessionStore.session) {
				return;
			}

			const progressSteps =
				sessionStore.session.scenariosProgress.find((sp) => sp.id === scenario.id)?.steps || [];

			const steps: ScenarioProgressStep[] = (scenario.steps ?? []).map((step: Step) => ({
				...step,
				status:
					progressSteps.find((s) => s.id === step.id)?.status ||
					ScenarioProgressStepStatus.PENDING_VALIDATION
			}));

			const newScenario: ScenarioProgress = { ...scenario, steps };

			resellerScenarioSelectedStore.update((s) => ({ ...s, scenario: newScenario, error: null }));

			const updatedSession: Session = {
				...sessionStore.session,
				scenariosProgress: sessionStore.session.scenariosProgress.map((sp) =>
					sp.id === scenario.id ? newScenario : sp
				)
			};

			resellerSessionStore.update((s) => ({ ...s, session: updatedSession }));
		} finally {
			if (seq === scenarioRequestSeq) {
				resellerScenarioSelectedStore.update((s) => ({ ...s, isLoading: false }));
			}
		}
	};

	public static getStepsHistory = async (
		sessionId: string,
		scenarioId: string,
		toastStore: ToastStore
	) => {
		resellerScenarioValidationResultStore.update((s) => ({ ...s, isLoading: true }));

		try {
			// eslint-disable-next-line
			const result = await apiRequest<any[]>(
				`/api/reseller/stepshistory?id=${encodeURIComponent(sessionId)}&scenario-id=${encodeURIComponent(scenarioId)}`
			);

			if (!result.ok) {
				showError(toastStore, 'Could not load validation history', result.error);
				return;
			}

			// eslint-disable-next-line
			const results = (result.data ?? []).map((step: any) => ({
				...step.validationResult,
				isValid: step.isValid,
				utcCreatedAt: new Date(step.createdAt).toISOString(),
				scenarioId,
				stepId: step.stepId
			}));

			resellerScenarioValidationResultStore.update((s) => ({ ...s, results }));
		} finally {
			resellerScenarioValidationResultStore.update((s) => ({ ...s, isLoading: false }));
		}
	};

	public static postValidateQuestions = async (
		sessionId: string,
		scenarioId: string,
		stepId: string,
		toastStore: ToastStore
	) => {
		resellerScenarioQuestionsValidationStore.set({ isLoading: true, questions: [] });

		try {
			const answers = get(resellerScenarioAnswersStore);
			const data = answers.filter((a) => a.answer !== '');

			if (data.length !== answers.length) {
				showWarning(toastStore, 'Please fill in all the questions');
				return;
			}

			const body = {
				answers: data.map((a) => ({ questionId: a.questionId, value: a.answer }))
			};

			const result = await apiRequest<QuestionValidation>(
				`/api/reseller/questions?id=${encodeURIComponent(sessionId)}&scenario-id=${encodeURIComponent(scenarioId)}&step-id=${encodeURIComponent(stepId)}`,
				{ method: 'POST', body: JSON.stringify(body) }
			);

			if (!result.ok) {
				showError(toastStore, 'Could not validate answers', result.error);
				return;
			}

			const questionsValidation = result.data;

			if (!questionsValidation) {
				showError(toastStore, 'Could not validate answers', 'The response was empty.');
				return;
			}

			const errors = questionsValidation.errors.map((e) => e.path);
			const warnings = questionsValidation.warnings.map((w) => w.path);

			const questions = questionsValidation.data.map((q) => ({
				questionId: q.questionId,
				isValid: !errors.includes(q.questionId) && !warnings.includes(q.questionId),
				error: questionsValidation.errors.find((e) => e.path === q.questionId)?.message || null,
				warning: questionsValidation.warnings.find((w) => w.path === q.questionId)?.message || null
			}));

			resellerScenarioQuestionsValidationStore.update((s) => ({ ...s, questions }));
		} finally {
			resellerScenarioQuestionsValidationStore.update((s) => ({ ...s, isLoading: false }));
		}
	};
}
