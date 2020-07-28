import { AddAccount } from './../../domain/usecases/add-account';
import { ServerError, EmptyDataError, MissingParamError, InvalidParamError } from './../errors/index-error'
import { badRequest, internalServerError } from './../helpers/index-helpers'
import { HttpRequest, HttpResponse, Controller } from './../protocols/index-protocols'
import { EmailValidator } from './../protocols/email-validator'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    // get all fields from a object
    // if (httpRequest.body) {
    //   const requiredFields = Object.keys(httpRequest.body)
    //   console.log(requiredFields)
    // }

    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    if (Object.keys(httpRequest.body).length <= 0) {
      return badRequest(new EmptyDataError('Error to receive sing up data'))
    }

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
      return badRequest(new InvalidParamError('password and password confirmation are not the same'))
    }

    try {
      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        return badRequest(new InvalidParamError('email'))
      }
      this.addAccount.add({
        name: httpRequest.body.name,
        email: httpRequest.body.email,
        password: httpRequest.body.password
      })
    } catch (error) {
      return internalServerError(new ServerError(error.message))
    }
  }
}