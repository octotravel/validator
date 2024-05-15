export interface Question {
  id: string;
  label: string;
  description: string;
  input: QuestionInptut;
  answer: () => Promise<any>;
}

export interface QuestionInptut {
  type: QuestionInputType;
  options: QuestionInputOptitons[];
}

export enum QuestionInputType {
  BOOLEAN = 'boolean',
  STRING = 'string',
  NUMBER = 'number',
  OPTION = 'option',
}

interface QuestionInputOptitons {
  label: string;
  value: string;
}

export interface QuestionAnswer {
  questionId: string;
  value: any;
}
