import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', async () => {
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const isValid = emailValidatorAdapter.isValid('invalid_email@email.com')
    expect(isValid).toBe(false)
  })
})