export class ResourceNotFoundError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly resourceId: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ResourceNotFoundError';
    
  }
}