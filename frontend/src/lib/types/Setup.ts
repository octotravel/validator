export interface SessionSetupStep {
	name: string;
	description: string;
	controls: Control;
}

interface Control {
	back: boolean;
	forward: boolean;
	isLast?: boolean;
}
