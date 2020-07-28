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
  
---  
### Proximo item ...


