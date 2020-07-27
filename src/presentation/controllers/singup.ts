import { HttpRequest, HttpResponse } from '../protocols/http'
import { EmptyDataError } from './../errors/empty-data-error'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export class SingUpController {
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
  }
}