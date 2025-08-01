import { Question } from '../../../question/Question';
import { RequestHeadersValidator } from '../../../validator/request/RequestHeadersValidator';
import { AvailabilityCheckValidator } from '../../../validator/reseller/availability/AvailabilityCheckValidator';
import { Validator } from '../../../validator/Validator';
import { Step } from '../../Step';
import { StepId } from '../../StepId';

export class AvailabilityCheckStep implements Step {
  public getId(): StepId {
    return StepId.AVAILABILITY_CHECK;
  }

  public getName(): string {
    return 'Availability Check';
  }

  public getDescription(): string {
    return "Availability Check endpoint is slightly slower as it will return an object for each individual departure time (or day). You have to perform this step to retrieve an availabilityId in order to confirm a sale, so if you just want to use this endpoint and skip the calendar endpoint then that's perfectly ok.";
  }

  public getEndpointMethod(): string {
    return 'POST';
  }

  public getEndpointUrl(): string {
    return '/availability';
  }

  public getDocsUrl(): string {
    return 'https://docs.octo.travel/octo-api-core/availability#availability-check';
  }

  public getValidators(): Validator[] {
    return [new RequestHeadersValidator(), new AvailabilityCheckValidator()];
  }

  public getQuestions(): Question[] {
    return [];
  }
}
