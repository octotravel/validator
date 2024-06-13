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
import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';
import { get } from 'svelte/store';

export abstract class ScenariosService {
	public static getScenarios = async (toastStore: ToastStore) => {
		resellerScenariosListLoadingStore.set(true);
		const capabilities = get(resellerSessionStore).session?.capabilities;
		const response = await fetch(`/api/reseller/scenarios`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Octo-capabilities': capabilities?.join(',') || ''
			}
		});

		if (!response.ok) {
			const error = `Failed to fetch scenarios`;
			const t: ToastSettings = {
				message: error,
				background: 'variant-filled-warning'
			};
			toastStore.trigger(t);

			resellerSessionStore.update((s) => ({ ...s, error }));
			resellerScenariosListLoadingStore.set(false);
			return;
		}

		const scenarios = await response.json();

		const sessionStore = get(resellerSessionStore);

		const scenariosProgress: ScenarioProgress[] = scenarios.map((scenario: Scenario) => {
			const steps =
				sessionStore.session?.scenariosProgress.find((sp) => sp.id === scenario.id)?.steps || [];
			return {
				...scenario,
				steps
			};
		});

		if (!sessionStore.session) {
			resellerScenariosListLoadingStore.set(false);
			return;
		}

		const updatedSession: Session = {
			...sessionStore.session,
			scenariosProgress
		};

		resellerSessionStore.update((s) => ({ ...s, session: updatedSession }));
		resellerScenariosListLoadingStore.set(false);
	};

	public static getScenario = async (id: string, toastStore: ToastStore) => {
		resellerScenarioSelectedStore.update((s) => ({ ...s, isLoading: true, scenario: null }));
		resellerScenarioAnswersStore.update(() => []);

		const response = await fetch(`/api/reseller/scenario?id=${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			const error = `Failed to fetch scenario`;
			const t: ToastSettings = {
				message: error,
				background: 'variant-filled-warning'
			};

			resellerScenarioSelectedStore.update((s) => ({ ...s, isLoading: false, error }));
			toastStore.trigger(t);

			return;
		}

		const scenario = await response.json();

		const sessionStore = get(resellerSessionStore);

		const steps: ScenarioProgressStep[] = scenario.steps.map((step: Step) => {
			const progressStep = (
				sessionStore.session?.scenariosProgress.find((sp) => sp.id === scenario.id)?.steps || []
			).find((s) => s.id === step.id);
			return {
				...step,
				status: progressStep?.status || ScenarioProgressStepStatus.PENDING_VALIDATION
			};
		});

		if (!sessionStore.session) {
			return;
		}

		const newScenario: ScenarioProgress = {
			...scenario,
			steps
		};

		resellerScenarioSelectedStore.update((s) => ({
			...s,
			isLoading: false,
			scenario: newScenario
		}));

		const scenarioIndex = sessionStore.session.scenariosProgress.findIndex(
			(sp) => sp.id === scenario.id
		);

		const updatedSession: Session = {
			...sessionStore.session
		};

		updatedSession.scenariosProgress[scenarioIndex] = newScenario;

		resellerSessionStore.update((s) => ({ ...s, session: updatedSession }));
	};

	public static getStepsHistory = async (
		sessionId: string,
		scenarioId: string,
		toastStore: ToastStore
	) => {
		resellerScenarioValidationResultStore.update((s) => ({ ...s, isLoading: true }));

		const response = await fetch(
			`/api/reseller/stepshistory?id=${sessionId}&scenario-id=${scenarioId}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

		if (!response.ok) {
			const t: ToastSettings = {
				message: `Failed to fetch scenario: ${response.statusText}`,
				background: 'variant-filled-warning'
			};
			toastStore.trigger(t);

			return;
		}

		const stepsHistory = await response.json();
		// eslint-disable-next-line
		const results = stepsHistory.map((step: any) => {
			return {
				...step.validationResult,
				isValid: step.isValid,
				utcCreatedAt: new Date(step.createdAt).toISOString(),
				scenarioId,
				stepId: step.stepId
			};
		});

		resellerScenarioValidationResultStore.update((s) => ({ ...s, results, isLoading: false }));
	};

	public static postValidateQuestions = async (
		sessionId: string,
		scenarioId: string,
		stepId: string,
		toastStore: ToastStore
	) => {
		resellerScenarioQuestionsValidationStore.set({ isLoading: true, questions: [] });

		const data = get(resellerScenarioAnswersStore)
			.map((a) => {
				if (a.answer === '') {
					return;
				}
				return a;
			})
			.flatMap((a) => (a ? a : []));

		if (data.length !== get(resellerScenarioAnswersStore).length) {
			const t: ToastSettings = {
				message: `Please fill all the questions`,
				background: 'variant-filled-warning'
			};
			toastStore.trigger(t);

			resellerScenarioQuestionsValidationStore.update((s) => ({ ...s, isLoading: false }));

			return;
		}

		console.log(data);
		const body = {
			answers: data.map((a) => {
				return {
					questionId: a.questionId,
					value: a.answer
				};
			})
		};

		const response = await fetch(
			`/api/reseller/questions?id=${sessionId}&scenario-id=${scenarioId}&step-id=${stepId}`,
			{
				method: 'POST',
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

		if (!response.ok) {
			const t: ToastSettings = {
				message: `Failed to validate questions: ${response.statusText}`,
				background: 'variant-filled-warning'
			};
			toastStore.trigger(t);

			resellerScenarioQuestionsValidationStore.update((s) => ({ ...s, isLoading: false }));

			return;
		}

		const questionsValidation = (await response.json()) as QuestionValidation;

		const errors = questionsValidation.errors.map((e) => {
			return e.path;
		});

		const warnings = questionsValidation.warnings.map((w) => {
			return w.path;
		});

		const questions = questionsValidation.data.map((q) => {
			const isError = errors.includes(q.questionId);
			const isWarning = warnings.includes(q.questionId);
			return {
				questionId: q.questionId,
				isValid: !isError && !isWarning,
				error: questionsValidation.errors.find((e) => e.path === q.questionId)?.message || null,
				warning: questionsValidation.warnings.find((w) => w.path === q.questionId)?.message || null
			};
		});

		resellerScenarioQuestionsValidationStore.update((s) => ({ ...s, isLoading: false, questions }));
	};
}
