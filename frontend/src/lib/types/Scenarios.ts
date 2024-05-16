import type { CapabilityId } from '@octocloud/types';

export type ScenariosResponse = Scenario[];

export interface Scenario {
	id: string;
	name: string;
	description: string;
	requiredCapabilities: CapabilityId[];
	optionalCapabilities: CapabilityId[];
	steps: Step[];
}

export interface ScenariosStore {
	scenarios: Scenario[] | null;
	isLoading: boolean;
	error: string | null;
}

export interface ScenarioStore {
	scenario: Scenario | null;
	isLoading: boolean;
	error: string | null;
}

export interface Step {
	id: string;
	name: string;
	description: string;
	questions: Question[];
	endpointMethod: string;
	endpointUrl: string;
	docsUrl: string;
}

export interface Question {
	id: string;
	label: string;
	description: string;
	input: Input;
	validation: QuestionValidation;
}

export interface Input {
	type: QuestionInputType;
	options: Option[];
}

interface Option {
	label: string;
	value: string;
}

export enum QuestionInputType {
	BOOLEAN = 'boolean',
	STRING = 'string',
	NUMBER = 'number',
	OPTION = 'option',
  }

export interface QuestionValidation {
	isValid: boolean;
	data: {questionId: string; value: any}[];
	errors: {type: string; path: string; message: string; data: any}[];
	warnings: {type: string; path: string; message: string; data: any}[];
}
