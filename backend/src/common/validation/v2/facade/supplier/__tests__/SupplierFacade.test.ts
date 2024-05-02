import { SupplierFacade } from '../SupplierFacade';
import { Backend } from '@octocloud/core';
import { DeepMockProxy, MockProxy, mock, mockDeep } from 'vitest-mock-extended';
import { GetSupplierStep } from '../../../step/reseller/supplier/GetSupplierStep';
import { RequestScopedContextProvider } from '../../../../../requestContext/RequestScopedContextProvider';
import { SessionStepProcessor } from '../../../session/SessionStepProcessor';
import { SessionStepGuard } from '../../../session/SessionStepGuard';
import { SessionService } from '../../../session/SessionService';
import { beforeEach, describe, expect, it } from 'vitest';
import { RequestScopedContext } from '../../../../../requestContext/RequestScopedContext';
import { Session } from '../../../../../../types/Session';
import { Scenario } from '../../../scenario/Scenario';
import { Step } from '../../../step/Step';

/*
describe('SupplierFacade', () => {
  let backend: DeepMockProxy<Backend>;
  let getSupplierStep: DeepMockProxy<GetSupplierStep>;
  let requestScopedContextProvider: DeepMockProxy<RequestScopedContextProvider>;
  let requestScopedContext: RequestScopedContext;
  let sessionStepGuard: DeepMockProxy<SessionStepGuard>;
  let sessionStepProcessor: DeepMockProxy<SessionStepProcessor>;
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
    sessionStepProcessor = mockDeep<SessionStepProcessor>();
    sessionService = mockDeep<SessionService>();

    supplierFacade = new SupplierFacade(
        backend,
        getSupplierStep,
        requestScopedContextProvider,
        sessionStepGuard,
        sessionStepProcessor,
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
