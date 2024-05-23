import { beforeEach, describe, it, expect } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';
import { Session } from '../../../../../types/Session';
import { SessionStepGuard } from '../SessionStepGuard';
import { ScenarioService } from '../../scenario/ScenarioService';
import { SessionScenarioProgressProvider } from '../SessionScenarioProgressProvider';
import { SessionScenarioNotSetError } from '../error/SessionScenarioNotSetError';
import { uuid4 } from '@sentry/utils';
import { CapabilityId } from '@octocloud/types';
import { TestStep } from './TestStep';

describe('SessionStepGuard', () => {
  const mockScenarioService = mock<ScenarioService>();
  const mockSessionScenarioProgressProvider = mock<SessionScenarioProgressProvider>();
  let session: Session;
  let sessionStepGuard: SessionStepGuard;

  beforeEach(() => {
    mockReset(mockScenarioService);
    mockReset(mockSessionScenarioProgressProvider);
    sessionStepGuard = new SessionStepGuard(mockScenarioService, mockSessionScenarioProgressProvider);
  });

  it('should throw SessionScenarioNotSetError due to unset currentScenario in session', async () => {
    session = {
      id: uuid4(),
      name: 'test session',
      capabilities: [CapabilityId.Pricing],
      currentScenario: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const targetStep = new TestStep();

    await expect(sessionStepGuard.check(session, targetStep)).rejects.toThrow(SessionScenarioNotSetError);
  });

  it('should throw SessionScenarioNotSetError due to unset currentScenario in session', async () => {
    session = {
      id: uuid4(),
      name: 'test session',
      capabilities: [CapabilityId.Pricing],
      currentScenario: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // const targetStep = container.resolve(GetSupplierStep);

    // await expect(sessionStepGuard.check(session, targetStep)).rejects.toThrow(SessionScenarioStepNotAllowedError.createForInvalidFirstStep(targetStep));
  });

  /*
  it('should throw SessionScenarioStepNotAllowedError if targetStep does not exist in scenario', async () => {
    const session: Session = { currentScenario: 'scenarioId', currentStep: null, id: '1' };
    const targetStep = mock<Step>();
    const scenario = mock<Scenario>();

    mockScenarioService.getResellerScenarioById.mockResolvedValue(scenario);
    scenario.getId.mockReturnValue('scenarioId');
    scenario.getSteps.mockReturnValue([]);

    await expect(sessionStepGuard.check(session, targetStep)).rejects.toThrow(SessionScenarioStepNotAllowedError);
  });

  it('should throw SessionScenarioStepNotAllowedError if trying to set an invalid first step', async () => {
    const session: Session = { currentScenario: 'scenarioId', currentStep: null, id: '1' };
    const targetStep = mock<Step>();
    const scenario = mock<Scenario>();
    const firstStep = mock<Step>();

    targetStep.getId.mockReturnValue('targetStepId');
    firstStep.getId.mockReturnValue('firstStepId');
    scenario.getId.mockReturnValue('scenarioId');
    scenario.getSteps.mockReturnValue([firstStep]);

    mockScenarioService.getResellerScenarioById.mockResolvedValue(scenario);

    await expect(sessionStepGuard.check(session, targetStep)).rejects.toThrow(SessionScenarioStepNotAllowedError);
  });

  it('should throw SessionIsInInvalidState if currentStep does not exist in scenario', async () => {
    const session: Session = { currentScenario: 'scenarioId', currentStep: 'currentStepId', id: '1' };
    const targetStep = mock<Step>();
    const scenario = mock<Scenario>();
    const firstStep = mock<Step>();

    scenario.getId.mockReturnValue('scenarioId');
    scenario.getSteps.mockReturnValue([firstStep]);

    mockScenarioService.getResellerScenarioById.mockResolvedValue(scenario);

    await expect(sessionStepGuard.check(session, targetStep)).rejects.toThrow(SessionIsInInvalidState);
  });

  it('should throw SessionScenarioStepNotAllowedError if target step is not in current progress and is invalid', async () => {
    const session: Session = { currentScenario: 'scenarioId', currentStep: 'currentStepId', id: '1' };
    const targetStep = mock<Step>();
    const scenario = mock<Scenario>();
    const firstStep = mock<Step>();
    const currentStep = mock<Step>();
    const steps = [firstStep, currentStep, targetStep];

    currentStep.getId.mockReturnValue('currentStepId');
    targetStep.getId.mockReturnValue('targetStepId');
    firstStep.getId.mockReturnValue('firstStepId');
    scenario.getId.mockReturnValue('scenarioId');
    scenario.getSteps.mockReturnValue(steps);

    mockScenarioService.getResellerScenarioById.mockResolvedValue(scenario);
    mockSessionScenarioProgressProvider.getSessionScenarioProgress.mockResolvedValue([]);

    await expect(sessionStepGuard.check(session, targetStep)).rejects.toThrow(SessionScenarioStepNotAllowedError);
  });

  it('should pass check if target step is valid and in sequence', async () => {
    const session: Session = { currentScenario: 'scenarioId', currentStep: 'currentStepId', id: '1' };
    const targetStep = mock<Step>();
    const scenario = mock<Scenario>();
    const firstStep = mock<Step>();
    const currentStep = mock<Step>();
    const steps = [firstStep, currentStep, targetStep];

    currentStep.getId.mockReturnValue('currentStepId');
    targetStep.getId.mockReturnValue('targetStepId');
    firstStep.getId.mockReturnValue('firstStepId');
    scenario.getId.mockReturnValue('scenarioId');
    scenario.getSteps.mockReturnValue(steps);

    mockScenarioService.getResellerScenarioById.mockResolvedValue(scenario);
    mockSessionScenarioProgressProvider.getSessionScenarioProgress.mockResolvedValue([]);

    await expect(sessionStepGuard.check(session, targetStep)).resolves.not.toThrow();
  });

  it('should pass check if target step is already in progress', async () => {
    const session: Session = { currentScenario: 'scenarioId', currentStep: 'currentStepId', id: '1' };
    const targetStep = mock<Step>();
    const scenario = mock<Scenario>();
    const firstStep = mock<Step>();
    const currentStep = mock<Step>();
    const steps = [firstStep, currentStep, targetStep];

    currentStep.getId.mockReturnValue('currentStepId');
    targetStep.getId.mockReturnValue('targetStepId');
    firstStep.getId.mockReturnValue('firstStepId');
    scenario.getId.mockReturnValue('scenarioId');
    scenario.getSteps.mockReturnValue(steps);

    mockScenarioService.getResellerScenarioById.mockResolvedValue(scenario);
    mockSessionScenarioProgressProvider.getSessionScenarioProgress.mockResolvedValue([
      { id: 'scenarioId', steps: [{ id: 'targetStepId' }] },
    ]);

    await expect(sessionStepGuard.check(session, targetStep)).resolves.not.toThrow();
  }); */
});
