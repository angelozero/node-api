# 03 - Testes

---    

### Testando a classe SingUpController
###### *classe ---> singup.ts / classe de teste ---> singup.spec.ts*

* Simples teste na classe SingUpController

```javascript
describe('SingUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const singUp = singUpMock() // return a object with a object {singUpController, emailValidatorStub (interface for Spy)}
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
```

* Teste *mockando* a interface que faz validação de email. *Mocko* o método isValid fazendo retornar false. A classe SingUpController recebe uma interface no seu construtor da qual para invocar esta validação precisará implementar este método. Aqui criei uma classe que implementa esta interface apenas para o mock, a validação mesmo do método sera executado em outro teste. 

```javascript

describe('SingUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const singUp = singUpMock() // return a object with a object {singUpController, emailValidatorStub (interface for Spy)}
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
```

* *Mockando* a interface para garantir que o metodo isValid, do validador de email, foi chamado.
```javascript
  test('Should call once the email validator function', () => {
    const singUp = singUpMock()
    const calledOnce = jest.spyOn(singUp.emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    singUp.singUpController.handle(httpRequest)
    expect(calledOnce).toBeTruthy()
  })
```
  
* Teste de falha isolado da classe de criaçao de conta, refatoraçao necessaria para deixar o método de criar uma nova conta assincrono.

```javascript
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
```

* Teste de sucesso.

```javascript
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
```

---

### Testando a classe EmailValidatorAdapter
###### *classe ---> email-validator-adapter.ts / classe de teste ---> email-validator-adapter.spec.ts*

* Teste executando a validação de email.

```javascript
  
```