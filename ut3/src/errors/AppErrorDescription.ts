export class AppErrorDescription extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly InvalidDescription: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'AppErrorDescription';
  }
}
