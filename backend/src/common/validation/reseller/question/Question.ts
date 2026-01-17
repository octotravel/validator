export interface Question {
  id: string;
  label: string;
  description: string;
  input: QuestionInptut;
  answer: (requestData: object, responseData: object) => Promise<unknown>;
}

export interface QuestionInptut {
  type: QuestionInputType;
  options: QuestionInputOptions[];
}

export enum QuestionInputType {
  BOOLEAN = 'boolean',
  STRING = 'string',
  NUMBER = 'number',
  OPTION = 'option',
}

interface QuestionInputOptions {
  label: string;
  value: string;
}

export interface QuestionAnswer {
  questionId: string;
  value: unknown;
}
