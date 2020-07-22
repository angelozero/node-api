> ###Configurando o git

* Configurando atalhos para uso do git ( se caso houver problemas em acessar o visual code atraves do comando ```git config --global --edit``` acesse este [link](https://stackoverflow.com/questions/53847777/associating-visual-studio-code-with-git-in-mac))

* Como configuraçao alteramos apenas o comando ```git log``` para exibir de uma maneira mais formatada, com cores e limpa no console. O comando ```--wait``` faz com que o visual code aguarde para ser aberto enquanto o git nao carrega suas configurações.

```shell
[core]
	editor = code --wait
[alias]
	log = !git log --pretty=format:'%C(yellow)%h%C(red)%d %C(white)%s - %C(cyan)%cn, %C(green)%cr'
```

* Para padrão de *commits* estou usando o [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)