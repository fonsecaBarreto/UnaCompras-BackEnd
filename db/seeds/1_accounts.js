
const { accounts } = require('../mocked/initial_data')

exports.seed = async function(knex) {
    await knex('accounts').del()
    await knex('accounts').insert(accounts);
};
  
  
  