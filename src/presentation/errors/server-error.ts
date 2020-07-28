export class ServerError extends Error {
  constructor(message?: string) {
    super(`Internal Server Error: ${message}`)
  }
}