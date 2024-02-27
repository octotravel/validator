import { CapabilityId } from '@octocloud/types';
import { Question } from '../question/Question';
import { Validator } from '../validator/Validator';

export interface Step {
  getId(): string;
  getName(): string;
  getDocsUrl(): string;
  getValidators(): Validator[];
  getQuestions(): Question[];
}
