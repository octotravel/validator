import { it, expect, vi, describe, beforeEach } from 'vitest';
import {
	resellerSessionStore,
} from '../../../stores';
import { get } from 'svelte/store';
import { ScenariosService } from '../ScenarioService';
import { ScenarioProgressStepStatus } from '$lib/types/Session';

describe('ScenariosService', async () => {
  const step = {
    id: 'step1',
    name: 'Step 1',
    description: 'Description 1',
    endpointUrl: 'http://localhost:3000',
    docsUrl: 'http://localhost:3000',
    status: ScenarioProgressStepStatus.PENDING
  };
	beforeEach(() => {
		resellerSessionStore.set({
			session: {
				id: 'session1',
				name: 'Session 1',
				capabilities: [],
				currentScenario: null,
				currentStep: null,
				scenariosProgress: [
          {
            id: 'scenario1',
            name: 'Scenario 1',
            description: 'Description 1',
            requiredCapabilities: [],
            optionalCapabilities: [],
            steps: [step]
          },
          {
            id: 'scenario2',
            name: 'Scenario 2',
            description: 'Description 2',
            requiredCapabilities: [],
            optionalCapabilities: [],
            steps: [step]
          }
        ],
				url: 'http://localhost:3000'
			},
			isLoading: false,
			error: null
		});
	});
	it('should successfully fetch scenarios', async () => {
		const mockScenarios = [
			{ id: 'scenario1', name: 'Scenario 1', steps: [step] },
			{ id: 'scenario2', name: 'Scenario 2', steps: [step] }
		];

		global.fetch = vi
			.fn()
			.mockReturnValueOnce(new Response(JSON.stringify(mockScenarios), { status: 200 }));

		await ScenariosService.getScenarios({});

		expect(get(resellerSessionStore).session?.scenariosProgress).toEqual(mockScenarios);
	});
});
