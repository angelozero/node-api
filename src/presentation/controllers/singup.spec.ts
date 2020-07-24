import { SingUpController } from './singup'

describe('SingUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const singUpController = new SingUpController()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
