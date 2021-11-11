import knex, { Knex } from 'knex'
const knexfile = require("../../../knexfile")

export default class KnexAdapter {

    static connection: Knex;
    static env: string = 'test';

    static async resetMigrations(): Promise<void> {
        await KnexAdapter.connection.migrate.rollback()
        await KnexAdapter.connection.migrate.latest()
    }

    static async open(env: string): Promise<void> {
        KnexAdapter.env = env
        KnexAdapter.connection = knex(knexfile[KnexAdapter.env]) 
    }

    static async close(): Promise<void> {
        await KnexAdapter.connection.destroy()
        KnexAdapter.connection = null
    }

    static async count(table: string): Promise<number>{
        const { count } = await KnexAdapter.connection(table).count().first()
        return Number(count);
    }

}