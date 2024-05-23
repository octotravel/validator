import {
  AvailabilityCalendar,
  AvailabilityCalendarBodySchema,
  Product,
  QuestionAnswer,
  Supplier,
} from '@octocloud/types';
import { Server } from 'http';
import request from 'supertest';
import { expect } from 'vitest';
import { SessionScenarioProgressStepStatus, SessionWithProgress } from '../../../../../../types/Session';
import { StepId } from '../../../step/StepId';
import { Scenario } from '../../Scenario';
import { ValidationResult } from '../../../ValidationResult';
import { ValidateSessionQuestionsAnswersResponse } from '../../../../../../api/v2/session/ValidateSessionQuestionsAnswersResponse';
import { LogicError } from '@octocloud/core';

export class ScenarioStepTestUtil {
  private getSupplierData: Supplier[] | null = null;
  private getProductsData: Product[] | null = null;
  private getProductData: Product | null = null;
  private getAvailabilityCalendarData: AvailabilityCalendar[] | null = null;

  public constructor(
    private readonly server: Server,
    private readonly headers: Record<string, string>,
    private readonly scenario: Scenario,
    private readonly sessionId: string,
  ) {}

  public async callAndCheckStep(stepId: StepId): Promise<void> {
    if (stepId === StepId.GET_SUPPLIER) {
      await this.callAndCheckGetSupplierStep();
    } else if (stepId === StepId.GET_PRODUCTS) {
      await this.callAndCheckGetProductsStep();
    } else if (stepId === StepId.GET_PRODUCT) {
      await this.callAndCheckGetProductStep();
    } else if (stepId === StepId.AVAILABILITY_CALENDAR) {
      await this.callAndCheckGetAvailabilityCalendar();
    } else {
      throw new LogicError('Step not implemented');
    }
  }

  public async callAndCheckGetSupplierStep(): Promise<void> {
    const getSupplierResponse = await request(this.server).get('/v2/reseller/octo/supplier').set(this.headers).send();
    expect(getSupplierResponse.status).toBe(200);
    await this.checkSession(StepId.GET_SUPPLIER, SessionScenarioProgressStepStatus.COMPLETED);

    this.getSupplierData = getSupplierResponse.body as Supplier[];
  }

  public async callAndCheckGetProductsStep(): Promise<void> {
    const getProductsResponse = await request(this.server).get('/v2/reseller/octo/products').set(this.headers).send();
    expect(getProductsResponse.status).toBe(200);
    await this.checkSession(StepId.GET_PRODUCTS, SessionScenarioProgressStepStatus.COMPLETED);

    this.getProductsData = getProductsResponse.body as Product[];
  }

  public async callAndCheckGetProductStep(): Promise<void> {
    const getProductResponse = await request(this.server)
      .get(`/v2/reseller/octo/products/${this.getProductsData![0].id}`)
      .set(this.headers)
      .send();
    expect(getProductResponse.status).toBe(200);
    await this.checkSession(StepId.GET_PRODUCT, SessionScenarioProgressStepStatus.PENDING_QUESTIONS);

    const getProductsStep = this.scenario.getSteps().find((step) => step.getId() === StepId.GET_PRODUCT)!;
    const questionAnswers: QuestionAnswer[] = await Promise.all(
      getProductsStep.getQuestions().map(async (question) => {
        return {
          questionId: question.id,
          value: await question.answer(),
        } as QuestionAnswer;
      }),
    );

    const validateQuestionAnswersResponse = await request(this.server)
      .post(`/v2/session/${this.sessionId}/validate-question-answers/${this.scenario.getId()}/${StepId.GET_PRODUCT}`)
      .set(this.headers)
      .send({
        answers: questionAnswers,
      });
    const validationResult = validateQuestionAnswersResponse.body as ValidateSessionQuestionsAnswersResponse;
    expect(validateQuestionAnswersResponse.status).toBe(200);
    expect(validationResult.errors.length).toBe(0);
    expect(validationResult.warnings.length).toBe(0);
    expect(validationResult.isValid).toBe(true);
    await this.checkSession(StepId.GET_PRODUCT, SessionScenarioProgressStepStatus.COMPLETED);
    this.getProductData = getProductResponse.body as Product;
  }

  public async callAndCheckGetAvailabilityCalendar(): Promise<void> {
    const availabilityCalendarPayload: AvailabilityCalendarBodySchema = {
      productId: this.getProductData!.id,
      optionId: this.getProductData!.options[0].id,
      localDateStart: new Date().toISOString(),
      localDateEnd: new Date().toISOString(),
    };

    const getAvailabilityCalendarResponse = await request(this.server)
      .post('/v2/reseller/octo/availability/calendar')
      .set(this.headers)
      .send(availabilityCalendarPayload);
    expect(getAvailabilityCalendarResponse.status).toBe(200);
    await this.checkSession(StepId.AVAILABILITY_CALENDAR, SessionScenarioProgressStepStatus.COMPLETED);

    this.getAvailabilityCalendarData = getAvailabilityCalendarResponse.body as AvailabilityCalendar[];
  }

  private async checkSession(
    stepIdToCheck: StepId,
    expectedStepStatus: SessionScenarioProgressStepStatus,
  ): Promise<void> {
    const getSessionResponse = await request(this.server).get(`/v2/session/${this.sessionId}`).set(this.headers).send();
    const getSessionData = getSessionResponse.body as SessionWithProgress;
    expect(
      getSessionData.scenariosProgress
        .find((scenario) => scenario.id === this.scenario.getId())!
        .steps.find((step) => step.id === stepIdToCheck)!.status,
    ).toBe(expectedStepStatus);
  }
}
