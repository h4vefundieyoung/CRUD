export abstract class Service {
  abstract requestData(method: string, body?: string, param?: string): Promise<Response>
}