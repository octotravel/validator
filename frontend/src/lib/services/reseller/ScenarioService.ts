import {
	resellerScenarioSelectedStore,
	resellerScenariosListLoadingStore,
	resellerSessionStore
} from '$lib/stores';
import type { Scenario, Step } from '$lib/types/Scenarios';
import type { ScenarioProgress, ScenarioProgressStep, Session } from '$lib/types/Session';
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
			const t: ToastSettings = {
				message: `Failed to fetch scenarios: ${response.statusText}`,
				background: 'variant-filled-warning'
			};
			toastStore.trigger(t);

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
		resellerScenarioSelectedStore.set({ isLoading: true, scenario: null });

		const response = await fetch(`/api/reseller/scenario?id=${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			const t: ToastSettings = {
				message: `Failed to fetch scenario: ${response.statusText}`,
				background: 'variant-filled-warning'
			};
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
				status: progressStep?.status || 'pending'
			};
		});

		if (!sessionStore.session) {
			return;
		}

		const newScenario: ScenarioProgress = {
			...scenario,
			steps
		};

		resellerScenarioSelectedStore.set({ isLoading: false, scenario: newScenario });

		const scenarioIndex = sessionStore.session.scenariosProgress.findIndex(
			(sp) => sp.id === scenario.id
		);

		const updatedSession: Session = {
			...sessionStore.session
			// scenariosProgress: [
			// 	...sessionStore.session.scenariosProgress.filter((sp) => sp.id !== scenario.id),
			// 	newScenario
			// ]
		};

		updatedSession.scenariosProgress[scenarioIndex] = newScenario;

		resellerSessionStore.update((s) => ({ ...s, session: updatedSession }));
	};
}
