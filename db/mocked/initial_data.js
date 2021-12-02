const { hashSync } = require("bcrypt");
const { v4 } = require("uuid");

const createAccount = (role =1, email, phone, cpf, name) =>({
    id: v4(),
    password: hashSync("123456",12), 
    name,email, phone, cpf,
    image: null,
    role: role
})


const accounts= [ 
    createAccount(0, 'client@mail.com',"00000000", "507.434.340-21", "Cliente Teste"),
    createAccount(1, 'admin@mail.com',"00000001", "397.017.710-36", "Admin Teste"),
]

module.exports = { accounts }