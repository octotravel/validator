/** biome-ignore-all lint/correctness/noUnusedImports: <?> */
import { Backend } from '@octocloud/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeepMockProxy, MockProxy, mock, mockDeep } from 'vitest-mock-extended';
import { Session } from '../../../../../../types/Session';
import { RequestScopedContext } from '../../../../../requestContext/RequestScopedContext';
import { RequestScopedContextProvider } from '../../../../../requestContext/RequestScopedContextProvider';
import { Scenario } from '../../../scenario/Scenario';
import { SessionService } from '../../../session/SessionService';
import { SessionStepGuard } from '../../../session/SessionStepGuard';
import { SessionStepValidationProcessor } from '../../../session/SessionStepValidationProcessor';
import { GetSupplierStep } from '../../../step/reseller/supplier/GetSupplierStep';
import { Step } from '../../../step/Step';
import { SupplierFacade } from '../SupplierFacade';

/*
describe('SupplierFacade', () => {
  let backend: DeepMockProxy<Backend>;
  let getSupplierStep: DeepMockProxy<GetSupplierStep>;
  let requestScopedContextProvider: DeepMockProxy<RequestScopedContextProvider>;
  let requestScopedContext: RequestScopedContext;
  let sessionStepGuard: DeepMockProxy<SessionStepGuard>;
  let sessionStepValidationProcessor: DeepMockProxy<SessionStepValidationProcessor>;
  let sessionService: DeepMockProxy<SessionService>;

  let supplierFacade: SupplierFacade;

  beforeEach(() => {
    backend = mockDeep<Backend>();
    getSupplierStep = mockDeep<GetSupplierStep>();
    requestScopedContextProvider = mockDeep<RequestScopedContextProvider>();
    requestScopedContext = new RequestScopedContext();
    requestScopedContext.setRequest(new Request('http://localhost:3000/'));
    requestScopedContext.setSession(mockDeep<Session>());
    requestScopedContext.setScenario(mockDeep<Scenario>());
    requestScopedContext.setStep(mockDeep<Step>());
    sessionStepGuard = mockDeep<SessionStepGuard>();
    sessionStepValidationProcessor = mockDeep<SessionStepValidationProcessor>();
    sessionService = mockDeep<SessionService>();

    supplierFacade = new SupplierFacade(
        backend,
        getSupplierStep,
        requestScopedContextProvider,
        sessionStepGuard,
        sessionStepValidationProcessor,
        sessionService
    );
  });

  describe('getSupplier', () => {
    it('should correctly delegate work', async () => {
      requestScopedContextProvider.getRequestScopedContext.mockReturnValueOnce(requestScopedContext);
      // console.log(requestScopedContextProvider);
        await supplierFacade.getSupplier();
        expect(requestScopedContextProvider.getRequestScopedContext).toBeCalledTimes(1);
    });
  });
});
*/
