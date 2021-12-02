

exports.up = function(knex) {
     return knex.schema.createTable('accounts', t =>{
           t.uuid('id').primary()
           t.string('name').notNull()
           t.string('email').notNull().unique('email')
           t.string("phone").notNull().unique('phone')
           t.string("cpf").notNull().unique('cpf')
           t.string("password").notNull()
           t.integer("role").notNull()
           t.string("image")
           t.timestamp('created_at').default(knex.fn.now())
           t.timestamp('updated_at').default(knex.fn.now())
      })
     
     .createTable('addresses', t =>{
          t.uuid('id').primary()
          t.string('street').notNull()
          t.string('number').notNull()
          t.text('details')
          t.string('district').notNull()
          t.string('city').notNull()
          t.specificType('uf', 'char(2)').notNull()
          t.string('postalCode', 'char(8)').notNull()
          t.timestamp('created_at').default(knex.fn.now())
          t.timestamp('updated_at').default(knex.fn.now())
     })
  
     .createTable('companies', t =>{
          t.uuid('id').primary()
          t.uuid('address_id').notNull().references('addresses.id').unique()
          t.uuid('manager_id').notNull().references('accounts.id')
          t.string("company_name").notNull().unique()
          t.string("trade_name").notNull().unique()
          t.string("cnpj").unique()
          t.string("financial_email").unique()
          t.boolean("agreedToPrivacyTerms").default(false)
          t.integer("type").notNull()
          t.timestamp('created_at').default(knex.fn.now())
          t.timestamp('updated_at').default(knex.fn.now())
     })

     .createTable('rating_feedbacks', t =>{
          t.uuid('id').primary()
          t.uuid('account_id').notNull().references('accounts.id').unique()
          t.integer("grade").default(0)
          t.text("text").notNull()
          t.timestamp('created_at').default(knex.fn.now())
          t.timestamp('updated_at').default(knex.fn.now())
     })

     .createTable('suggestions_feedbacks', t =>{
          t.uuid('id').primary()
          t.uuid('account_id').notNull().references('accounts.id')
          t.text("text").notNull()
          t.json("items").notNull()
          t.timestamp('created_at').default(knex.fn.now())
          t.timestamp('updated_at').default(knex.fn.now())
     })

     .createTable('uploads', t =>{
          t.uuid('id').primary()
          t.uuid('account_id').notNull().references('accounts.id')
          t.text("src").notNull()
          t.json("name").notNull()
          t.string("contentType").notNull()
          t.integer("size").notNull()
          t.timestamp('created_at').default(knex.fn.now())
     })
};

exports.down = function(knex) {
  return knex.schema.dropTable("uploads").dropTable('suggestions_feedbacks').dropTable("rating_feedbacks").dropTable("companies").dropTable("addresses").dropTable("accounts")
};
