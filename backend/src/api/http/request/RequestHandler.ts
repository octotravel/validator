export interface RequestHandler {
  handleRequest(request: Request): Promise<Response>;
}
