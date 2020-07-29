import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidator Adapter', () => {
  test('Should return false if an invalid email is provided', async () => {
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const isValid = emailValidatorAdapter.isValid('invalid_email@email.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if an invalid email is provided', async () => {
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const isValid = emailValidatorAdapter.isValid('valid_email@email.com')
    expect(isValid).toBe(false)
  })
})