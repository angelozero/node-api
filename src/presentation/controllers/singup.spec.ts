import { EmailValidator } from './../protocols/email-validator'
import { SingUpController } from './singup'
import { MissingParamError } from '../errors/missing-param-error'
import { EmptyDataError } from './../errors/empty-data-error'
import { InvalidParamError } from './../errors/invalid-param-error'

interface SingUpTypes {
  emailValidatorStub: EmailValidatorStub
  singUpController: SingUpController
}

class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    return true
  }
}

const singUpMock = (): SingUpTypes => {
  const emailValidatorStub = new EmailValidatorStub()
  const singUpController = new SingUpController(emailValidatorStub)
  return { singUpController, emailValidatorStub }
}

describe('SingUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const singUp = singUpMock()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const singUp = singUpMock()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const singUp = singUpMock()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provided', () => {
    const singUp = singUpMock()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        email: 'any_email@email.com'
      }
    }
    const httpResponse = singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
  test('Should return 400 if no data is provided', () => {
    const singUp = singUpMock()
    const httpRequest = {
      body: {}
    }
    const httpResponse = singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new EmptyDataError('Error to receive sing up data'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    const singUp = singUpMock()
    jest.spyOn(singUp.emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})