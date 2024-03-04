export interface WebSocket {
  emit(sessionId: string, data: any): Promise<void>;
}
