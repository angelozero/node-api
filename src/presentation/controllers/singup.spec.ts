import { EmailValidator } from './../protocols/email-validator'
import { SingUpController } from './singup'
import { AddAccountModel, AddAccount } from '../../domain/usecases/add-account'
import { AccountModel } from '../../domain/models/account-model'
import { ServerError, EmptyDataError, MissingParamError, InvalidParamError } from './../errors/index-error'

interface SingUpTypes {
  emailValidatorStub: EmailValidatorStub
  addAccountStub: AddAccountStub
  singUpController: SingUpController
}

class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    return true
  }
}

class AddAccountStub implements AddAccount {
  add(account: AddAccountModel): AccountModel {
    const fakeAccount = {
      id: 'valid_id',
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    }
    return fakeAccount
  }
}

const singUpMock = (): SingUpTypes => {
  const emailValidatorStub = new EmailValidatorStub()
  const addAccountStub = new AddAccountStub()
  const singUpController = new SingUpController(emailValidatorStub, addAccountStub)

  return { emailValidatorStub, addAccountStub, singUpController }
}

const emailValidatorServiceMock = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      throw new Error('error_email_validator_service')
    }
  }
  return new EmailValidatorStub()
}

const addAccountServiceMock = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
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

  test('Should return 400 if the password is not equals the password confirmation', () => {
    const singUp = singUpMock()
    jest.spyOn(singUp.emailValidatorStub, 'isValid').mockReturnValueOnce(true)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password_error'
      }
    }
    const httpResponse = singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('password and password confirmation are not the same'))
  })

  test('Should call once the email validator function', () => {
    const singUp = singUpMock()
    const calledOnce = jest.spyOn(singUp.emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    singUp.singUpController.handle(httpRequest)
    expect(calledOnce).toBeTruthy()
  })

  test('Should return 500 if email validator throws an exception', () => {
    const singUpController = new SingUpController(emailValidatorServiceMock(), addAccountServiceMock())

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('error_email_validator_service'))
  })

  test('Should call add account with valid values', () => {
    const singUp = singUpMock()
    jest.spyOn(singUp.emailValidatorStub, 'isValid').mockReturnValueOnce(true)
    const addAcountSpy = jest.spyOn(singUp.addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    singUp.singUpController.handle(httpRequest)
    expect(addAcountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })
})