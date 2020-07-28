import { SingUpController } from './singup'
import { AddAccountModel, AddAccount, EmailValidator, AccountModel } from '../singup/singup-protocols'
import { ServerError, EmptyDataError, MissingParamError, InvalidParamError } from '../../errors/index-error'

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
  async add(account: AddAccountModel): Promise<AccountModel> {
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
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      }
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

describe('SingUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const singUp = singUpMock()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', async () => {
    const singUp = singUpMock()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const singUp = singUpMock()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const singUp = singUpMock()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        email: 'any_email@email.com'
      }
    }
    const httpResponse = await singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if no data is provided', async () => {
    const singUp = singUpMock()
    const httpRequest = {
      body: {}
    }
    const httpResponse = await singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new EmptyDataError('Error to receive sing up data'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
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
    const httpResponse = await singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 400 if the password is not equals the password confirmation', async () => {
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
    const httpResponse = await await singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('password and password confirmation are not the same'))
  })

  test('Should call once the email validator function', async () => {
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
    await singUp.singUpController.handle(httpRequest)
    expect(calledOnce).toBeTruthy()
  })

  test('Should return 500 if email validator throws an exception', async () => {
    const singUpController = new SingUpController(emailValidatorServiceMock(), addAccountServiceMock())

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('Error: error_email_validator_service'))
  })

  test('Should call add account with valid values', async () => {
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
    await singUp.singUpController.handle(httpRequest)
    expect(addAcountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if was not possible add a new account', async () => {
    const singUp = singUpMock()
    jest.spyOn(singUp.emailValidatorStub, 'isValid').mockReturnValueOnce(true)
    jest.spyOn(singUp.addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error('error_add_account_service')))
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('Error: error_add_account_service'))
  })

  test('Should return 200 if valid data is provided', async () => {
    const singUp = singUpMock()
    jest.spyOn(singUp.emailValidatorStub, 'isValid').mockReturnValueOnce(true)
    jest.spyOn(singUp.addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve({
      id: 'any_id_123',
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })))

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await singUp.singUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'any_id_123',
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })
})