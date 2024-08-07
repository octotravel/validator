export interface ScenarioResult {
	name: string;
	success: boolean;
	validationResult: ValidationResult;
	request: ScenarioRequest | null;
	response: ScenarioResponse | null;
	// eslint-disable-next-line
	errors: any[]; // validation errors
	description: string;
}

export enum ValidationResult {
	SUCCESS = 'SUCCESS',
	WARNING = 'WARNING',
	FAILED = 'FAILED'
}

export interface ScenarioRequest {
	url: string;
	method: string;
	// eslint-disable-next-line
	body: any | null;
	headers: Record<string, string>;
}

export interface ScenarioResponse {
	body: string | null;
	status: number | null;
	error: {
		// eslint-disable-next-line
		body: any;
	} | null;
	headers: Record<string, string>;
}

export interface SupplierFlowResult {
	name: string;
	success: boolean;
	validationResult: ValidationResult;
	totalScenarios: number;
	succesScenarios: number;
	scenarios: ScenarioResult[];
	docs: string;
}

export interface SupplierValidationStore {
	flows: SupplierFlowResult[];
	isLoading: boolean;
	error: string | null;
}

export interface SupplierValidationRequestData {
	endpoint: string;
	headers: Record<string, string>;
}

export interface SupplierAdditionalHeaders {
	key: string;
	value: string;
}
