# 04 - Presentation Layer ( Camada Presentation )
###### SingUp, EmailValidator, HttpRequest, HttpResponse e Controller

---    

### Explicando a classe SingUp 
###### *classe ---> singup.ts / classe de teste ---> singup.spec.ts*

* Esta classe se encontra na camada ***[presentation](https://github.com/angelozero/node-api/blob/master/z-notes/02-architecture-diagram.md)*** da aplicação. Ela é responsável por conduzir o fluxo de login e / ou criação de uma nova conta. Conta com as interfaces ***EmailValidator***, ***HttpRequest***, ***HttpResponse*** e ***Controller***. Sua primeira validação verifica se o objeto *data* recebido tem valor, se não houver é devolvido um erro do tipo *bad request* informando que não houve dados informados suficiente para fazer as próximas validações. Na sequência temos as validações de campos recebidos dentro do objeto *data*. Os campos são: nome, email, password e passwordConfirmantion, ```const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']```. Se caso qualquer um desses campos não houver informação será devolvido como resposta um *bad request* dizendo que existe valores que não foram informados, mostrando qual o item não tem valor. Para a próxima validação temos a comparação entre senhas ( senha e senha confirmada ), se caso forem divergentes é retornado o erro *bad request*. Para a validação de email usamos o metodo da interface EmailValidator ( a implementação e explicação de uso esta em [05-email-validator-class](https://github.com/angelozero/node-api/blob/master/z-notes/05-email-validator-class.md) ). Se caso não for um email válido é retornado o erro *bad request* informando que o email é inválido. Por fim se caso de sucesso, todas as validações forem feitas com sucesso e a criação/validação da conta for feita com sucesso é retornado um objeto com todos os dados do usuário, ```const account = await this.addAccount.add({...})``` com a informação *success request* (status code 200). Se houver qualquer tipo de falha na criação ou validação da conta um erro genérico é disparado, *Internal Server Erro*. Este erro trata exatamente sobre esta falha retornando o *status code* 500.


* Classe ***singup.ts***

```javascript
export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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
      const account = await this.addAccount.add({
        name: httpRequest.body.name,
        email: httpRequest.body.email,
        password: httpRequest.body.password
      })

      return successRequest(account)

    } catch (error) {
      return internalServerError(new ServerError(error))
    }
  }
}
```

### Explicando a interface EmailValidator
###### *interface ---> email-validator.ts*

* Interface ***email-validator.ts***, protocolo a ser seguido para executar a validação de email

```javascript
export interface EmailValidator {
  isValid(email: string): boolean
}
```

### Explicando a interface HttpRequest e HttpResponse ( Protocols )
###### *interface ---> http.ts*

* Interface ***http.ts***, protocolo a ser seguido como entrada e resposta para qualquer requisição usado na aplicação. Para resposta é retornado um codigo mais um body ( não obrigatório ) e como requisição apenas um body.

```javascript
export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest {
  body?: any
}
```

### Explicando os métodos badRequest, internalServerError e successRequest
###### *classe ---> http-helper.ts*

* Métodos auxiliares que gerenciam o retorno de resposta das requisições. Para cada requisição de falha ou sucesso uma resposta correta.

```javascript
export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}

export const internalServerError = (error: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: error
  }
}

export const successRequest = (data: any): HttpResponse => {
  return {
    statusCode: 200,
    body: data
  }
}
```

### Explicando a interface Controller
###### *interface ---> controller.ts*

* Interface com o protocolo de como todos os controllers devem se comportar ou como devem ser executados.

```javascript
export interface Controller {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>
}
```

