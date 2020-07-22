> ##01 - Configurando o ambiente


> ###Configurando o Git

* Configurando atalhos para uso do git ( se caso houver problemas em acessar o visual code através do comando ```git config --global --edit``` acesse este [link](https://stackoverflow.com/questions/53847777/associating-visual-studio-code-with-git-in-mac))

* Como configuraçao alteramos apenas o comando ```git log``` para exibir de uma maneira mais formatada, com cores e limpa no console. O comando ```--wait``` faz com que o visual code aguarde para ser aberto enquanto o git nao carrega suas configurações.

```shell
[core]
	editor = code --wait
[alias]
	log = !git log --pretty=format:'%C(yellow)%h%C(red)%d %C(white)%s - %C(cyan)%cn, %C(green)%cr'
```


> ###Padronizando as mensagens dos *commits*

* Para padrão de *commits* estou usando o [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

* Adicionando a biblioteca [git-commit-msg-linter](https://www.npmjs.com/package/git-commit-msg-linter) para garantir que os formatos de mensagem dos commits sejam respeitados. Esta lib vai validar todos os commits feitos. Se caso houver um commit fora do padrão a seguinte mensagem sera exibida:

```shell
  ************* Invalid Git Commit Message **************
  commit message: add msg-linter
  correct format: <type>(<scope>): <subject>
  example:        docs: update README

  type:
    feat     a new feature
    fix      a bug fix
    docs     documentation only changes
    style    changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
    refactor a code change that neither fixes a bug nor adds a feature
    test     adding missing tests or correcting existing ones
    chore    changes to the build process or auxiliary tools and libraries such as documentation generation
    perf     a code change that improves performance
    ci       changes to your CI configuration files and scripts
    temp     temporary commit that won't be included in your CHANGELOG

  scope:
    Optional, can be anything specifying the place of the commit change.
    For example $location, $browser, $compile, $rootScope, ngHref, ngClick, ngView, etc.
    In App Development, scope can be a page, a module or a component.

  subject:
    A very short description of the change in one line.
```


> ###Adicionando TypeScript

* Instalar o [TypeScript](https://www.typescriptlang.org/docs/home.html) ```npm install -D typescript @types/node```. O uso do ```@types/node``` é uma biblioteca com os tipos do node.  

* Criando e configurando o arquivo ```tsconfig.json```.

*```"outDir": "./dist"```: diretorio aonde sera gerado o codigo em javascript*
*```"module": "commonjs"```: formato de geracao para os browsers*
*```"target": "es2019"```: versao a ser gerada. Para mais info acesse: [Node.js ES2015 Support](https://node.green/)*
*```"esModuleInterop": true```: conversao de modulos que usam o commonjs*
*```"allowJs": true```: para incluir arquivos de configuração se o formato deste arquivo for .js*


> ###Padrão de JavaScript e usando ESLint

* Estou seguindo o padrão chamado [JavaScript Standard Style](https://standardjs.com/rules.html)

* Acesse os links para usar o [ESLint](https://eslint.org/docs/user-guide/getting-started) e instalar o [eslint-config-standard-with-typescript](https://www.npmjs.com/package/eslint-config-standard-with-typescript)


> ###Adicionando Husky e Lint Staged

* Adicionando a lib [husky](https://www.npmjs.com/package/husky) para previnir *git commit / push / ...* errados ou mal formatados. Apos intalado criei um arquivo chamado ```.huskyrc.json```. Este arquivo vai ser lido sempre antes de qualquer ```pre-commit```. Isso em um projeto com uma grande demanda de arquivos pode gerar lentidando devido a verificação de cada arquivo que o eslint esta fazendo. Para resolver este problema vou usar em conjunto com o husky a biblioteca [lint-staged](https://www.npmjs.com/package/lint-staged). Com esta lib consigo fazer o eslint rodar apenas nos arquivos que estao na *staged area*. *Staged area* são os arquivos que vão entrar no próximo *commit*. Resumidamente, apenas sera executado o eslint nos arquivos que foram modificados e estao indo para o *commit*.