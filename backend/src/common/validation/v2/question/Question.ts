export interface Question {
  getId(): string;
  getQuestion: () => string;
  getOptions: () => string;
}
