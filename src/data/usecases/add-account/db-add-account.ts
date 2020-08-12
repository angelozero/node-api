import { AddAccount, AddAccountModel, AccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {

  private readonly encrypter: Encrypter
  private readonly addAcountRepository: AddAccountRepository

  constructor(encrypter: Encrypter, addAcountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAcountRepository = addAcountRepository
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    // dentro do add estou criando um objeto novo "{}" inserindo nele tudo que ha dentro de "accountData" e por fim substituindo o valor de "password" com o que esta em "hashedPassword" do novo objeto
    const accountDataModel = await this.addAcountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return await new Promise(resolve => resolve(accountDataModel))
  }
}