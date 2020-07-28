import { ServerError, EmptyDataError, MissingParamError, InvalidParamError } from './../errors/index-error'

import { internalServerError } from './../helpers/http-helper'
import { EmailValidator } from './../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
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
    try {
      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return internalServerError(new ServerError(error.message))
    }
  }
}