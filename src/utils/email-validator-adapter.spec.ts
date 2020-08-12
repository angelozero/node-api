import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {

  let emailValidatorAdapter: EmailValidatorAdapter

  beforeEach(() => {
    emailValidatorAdapter = new EmailValidatorAdapter()
  })

  test('Should return false if an invalid email is provided', async () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = emailValidatorAdapter.isValid('invalid_email@email.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if an valid email is provided', async () => {
    const isValid = emailValidatorAdapter.isValid('valid_email@email.com')
    expect(isValid).toBe(true)
  })

  test('Should call validator with a valid email value before', async () => {
    const anyEmail = 'any_email@email.com'
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    emailValidatorAdapter.isValid(anyEmail)
    expect(isEmailSpy).toHaveBeenLastCalledWith(anyEmail)
  })
})