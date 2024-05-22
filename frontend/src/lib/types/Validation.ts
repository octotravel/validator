export interface ValidationResult {
	isValid: boolean;
	// eslint-disable-next-line
	data: Record<string, any>;
	errors: WebSocketValidationResultItem[];
	warnings: WebSocketValidationResultItem[];
	scenarioId: string;
	stepId: string;
}

export interface WebSocketValidationResultItem {
	message: string;
	path: string;
	// eslint-disable-next-line
	data: any;
}

export interface ResultsStore extends ValidationResult {
	utcCreatedAt: string;
}

export interface ValidationResultStore {
	results: ResultsStore[];
	isLoading: boolean;
}
