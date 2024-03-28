export interface CapabilitiesResponse {
  docsUrl: string;
  capabilities: CapabilityResponse[];
}

export interface CapabilityResponse {
  name: string;
  id: string;
  description: string;
}
