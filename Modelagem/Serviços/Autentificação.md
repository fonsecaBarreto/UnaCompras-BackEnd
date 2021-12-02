
## Autentificação

- Usuario envia uma requisição HTTP ( contendo um token de autentificação no "Header" ) para o servidor.
- Servidor ler o "Header" e o desencripta com a chave secreta
- Servidor Valida se o token contem referencia a um ID de usuario valido e se a seção ja foi expirada.
- se for valido:
    -retorna resposta com o conteudo desejado. (status: 200)
- do contrario :
    -retorna resposta indicando status 401
    -regista a ocorrencia no sistema
    -enviar um e-mail de alerta ao usuario.   


## Login

#schema: 

- Usuario envia uma requisição HTTP contendo as credenciais ( { emailOrPhone e password } ) para o servidor.
- Servidor valida as entradas
- se for inválido:
  - retorna resposta mensagem de conflito
- do contrario:
  - Servidor Valida se o usuario existe e senha competem 
  - se for valido:
      -retorna resposta com o token de autentificação.
  - do contrario :
      -retorna resposta indicando status 401 

