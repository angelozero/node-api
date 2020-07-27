export class EmptyDataError extends Error {
  constructor(message?: string) {
    super(`Error in object: ${message}`)
    this.name = 'EmptyDataError'
  }
}