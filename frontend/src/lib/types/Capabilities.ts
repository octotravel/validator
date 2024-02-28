import type { CapabilityId } from "@octocloud/types";

export interface Capability {
    id: CapabilityId;
    name: string;
    description: string;
}

export interface CapabilitiesStore {
    capabilities: string[];
    isLoading: boolean;
    error: string | null;
}