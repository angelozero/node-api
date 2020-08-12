import { Encrypter } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

class EncrypterStub implements Encrypter {
  async encrypt(value: string): Promise<string> {
    return await new Promise(resolve => resolve('hasehd_password'))
  }
}

describe('DbAddAccount Usecase', () => {

  let dbAddAccount: DbAddAccount
  let encrypterStub: EncrypterStub

  beforeEach(() => {
    encrypterStub = new EncrypterStub()
    dbAddAccount = new DbAddAccount(encrypterStub)
  })

  test('Should call Encrypter with correct password', async () => {
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    await dbAddAccount.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw excpetion if Encrypter throws exception', async () => {
    const errorMessage = 'error_encrypter_exception'
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error(errorMessage))))

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    const promise = dbAddAccount.add(accountData)
    await expect(promise).rejects.toThrow('error_encrypter_exception')
  })
})