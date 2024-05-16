import {
	resellerScenarioAnswersStore,
	resellerScenarioSelectedStore,
	resellerScenarioValidationResultStore,
	resellerScenariosListLoadingStore,
	resellerSessionStore
} from '$lib/stores';
import type { Scenario, Step } from '$lib/types/Scenarios';
import { ScenarioProgressStepStatus, type ScenarioProgress, type ScenarioProgressStep, type Session } from '$lib/types/Session';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { get } from 'svelte/store';

export abstract class ScenariosService {
	public static getScenarios = async (toastStore: any) => {
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

	public static getScenario = async (id: string, toastStore: any) => {
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
				status: progressStep?.status || ScenarioProgressStepStatus.PENDING_VALIDATION,
				questions: step.questions.map((q) => {
					return {
						...q,
						validation: {
							isValid: false,
							data: [],
							errors: []
						}
					};
				})
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
		toastStore: any
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
		toastStore: any
	) => {

		const body = {
			test: 'test'
		}

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

			return;
		}

		const questionsValidation = await response.json();
		

	};
}
