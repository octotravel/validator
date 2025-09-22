import { Server } from 'node:http';
import { LogicError } from '@octocloud/core';
import {
  Availability,
  AvailabilityBodySchema,
  AvailabilityCalendar,
  AvailabilityCalendarBodySchema,
  Booking,
  CancelBookingBodySchema,
  ConfirmBookingBodySchema,
  CreateBookingBodySchema,
  Product,
  QuestionAnswer,
  Supplier,
} from '@octocloud/types';
import request from 'supertest';
import { expect } from 'vitest';
import { ValidateSessionQuestionsAnswersResponse } from '../../../../../../api/reseller/session/ValidateSessionQuestionsAnswersResponse';
import { SessionScenarioProgressStepStatus, SessionWithProgress } from '../../../../../../types/Session';
import { StepId } from '../../../step/StepId';
import { Scenario } from '../../Scenario';

export class ScenarioStepTestUtil {
  private getSupplierData: Supplier[] | null = null;
  private getProductsData: Product[] | null = null;
  private getProductData: Product | null = null;
  private getAvailabilityCalendarData: AvailabilityCalendar[] | null = null;
  private getAvailabilityData: Availability[] | null = null;
  private bookingReservationData: Booking | null = null;
  private bookingConfirmationData: Booking | null = null;
  private bookingCancellationData: Booking | null = null;

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
    } else if (stepId === StepId.AVAILABILITY_CHECK) {
      await this.callAndCheckGetAvailability();
    } else if (stepId === StepId.BOOKING_RESERVATION) {
      await this.callAndCheckBookingReservation();
    } else if (stepId === StepId.BOOKING_CONFIRMATION) {
      await this.callAndCheckBookingConfirmation();
    } else if (stepId === StepId.BOOKING_CANCELLATION) {
      await this.callAndCheckBookingCancellation();
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

  public async callAndCheckGetAvailability(): Promise<void> {
    const availabilityCheckPayload: AvailabilityBodySchema = {
      productId: this.getProductData!.id,
      optionId: this.getProductData!.options[0].id,
      localDateStart: new Date().toISOString(),
      localDateEnd: new Date().toISOString(),
    };

    const getAvailabilityResponse = await request(this.server)
      .post('/v2/reseller/octo/availability')
      .set(this.headers)
      .send(availabilityCheckPayload);
    expect(getAvailabilityResponse.status).toBe(200);
    await this.checkSession(StepId.AVAILABILITY_CHECK, SessionScenarioProgressStepStatus.COMPLETED);

    this.getAvailabilityData = getAvailabilityResponse.body as Availability[];
  }

  public async callAndCheckBookingReservation(): Promise<void> {
    const bookingReservationPayload: CreateBookingBodySchema = {
      productId: this.getProductData!.id,
      optionId: this.getProductData!.options[0].id,
      availabilityId: this.getAvailabilityData![0].id,
      unitItems: [
        {
          unitId: this.getProductData!.options[0].units[0].id,
        },
      ],
    };

    const bookingReservationResponse = await request(this.server)
      .post('/v2/reseller/octo/bookings')
      .set(this.headers)
      .send(bookingReservationPayload);
    expect(bookingReservationResponse.status).toBe(200);
    await this.checkSession(StepId.BOOKING_RESERVATION, SessionScenarioProgressStepStatus.COMPLETED);

    this.bookingReservationData = bookingReservationResponse.body as Booking;
  }

  public async callAndCheckBookingConfirmation(): Promise<void> {
    const bookingReservationPayload: ConfirmBookingBodySchema = {
      contact: {},
      emailReceipt: false,
      unitItems: [
        {
          unitId: this.getProductData!.options[0].units[0].id,
        },
      ],
    };

    const bookingConfirmationResponse = await request(this.server)
      .post(`/v2/reseller/octo/bookings/${this.bookingReservationData!.uuid}/confirm`)
      .set(this.headers)
      .send(bookingReservationPayload);

    expect(bookingConfirmationResponse.status).toBe(200);
    await this.checkSession(StepId.BOOKING_CONFIRMATION, SessionScenarioProgressStepStatus.PENDING_QUESTIONS);

    const bookingConfirmationStep = this.scenario
      .getSteps()
      .find((step) => step.getId() === StepId.BOOKING_CONFIRMATION)!;
    const questionAnswers: QuestionAnswer[] = await Promise.all(
      bookingConfirmationStep.getQuestions().map(async (question) => {
        return {
          questionId: question.id,
          value: await question.answer(bookingReservationPayload, bookingConfirmationResponse.body),
        } as QuestionAnswer;
      }),
    );

    const validateQuestionAnswersResponse = await request(this.server)
      .post(
        `/v2/session/${this.sessionId}/validate-question-answers/${this.scenario.getId()}/${StepId.BOOKING_CONFIRMATION}`,
      )
      .set(this.headers)
      .send({
        answers: questionAnswers,
      });
    const validationResult = validateQuestionAnswersResponse.body as ValidateSessionQuestionsAnswersResponse;
    expect(validateQuestionAnswersResponse.status).toBe(200);
    expect(validationResult.errors.length).toBe(0);
    expect(validationResult.warnings.length).toBe(0);
    expect(validationResult.isValid).toBe(true);
    await this.checkSession(StepId.BOOKING_CONFIRMATION, SessionScenarioProgressStepStatus.COMPLETED);
    this.bookingConfirmationData = bookingConfirmationResponse.body as Booking;
  }

  public async callAndCheckBookingCancellation(): Promise<void> {
    const bookingCancellationPayload: CancelBookingBodySchema = {
      reason: 'Test!',
      emailReceipt: false,
    };

    const bookingCancellationResponse = await request(this.server)
      .post(`/v2/reseller/octo/bookings/${this.bookingConfirmationData!.uuid}/cancel`)
      .set(this.headers)
      .send(bookingCancellationPayload);
    expect(bookingCancellationResponse.status).toBe(200);
    await this.checkSession(StepId.BOOKING_CANCELLATION, SessionScenarioProgressStepStatus.COMPLETED);

    this.bookingCancellationData = bookingCancellationResponse.body as Booking;
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
