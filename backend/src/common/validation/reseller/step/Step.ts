import { Question } from '../question/Question';
import { Validator } from '../validator/Validator';
import { StepId } from './StepId';

export interface Step {
  getId(): StepId;
  getName(): string;
  getDescription(): string;
  getEndpointMethod(): string;
  getEndpointUrl(): string;
  getDocsUrl(): string;
  getValidators(): Validator[];
  getQuestions(): Question[];
}
