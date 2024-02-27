import { Question } from '../question/Question';
import { Validator } from '../validator/Validator';
import { StepId } from '../types/StepId';

export interface Step {
  getId(): StepId;
  getName(): string;
  getDocsUrl(): string;
  getValidators(): Validator[];
  getQuestions(): Question[];
}
