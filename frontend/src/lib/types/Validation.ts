export interface ValidationResult {
	isValid: boolean;
	data: Record<string, any>;
	errors: WebSocketValidationResultItem[];
	warnings: WebSocketValidationResultItem[];
	scenarioId: string;
	stepId: string;
}

export interface WebSocketValidationResultItem {
	message: string;
	path: string;
	data: any;
}

export interface ResultsStore extends ValidationResult{
	utcCreatedAt: string;
}

export interface ValidationResultStore {
	results: ResultsStore[];
}
