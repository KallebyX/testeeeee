import { Client } from 'pg';

const client = new Client({
  user: 'Kalleby',
  host: 'localhost',
  database: 'bancodados',
  password: 'kk030904',
  port: 5432,
});


export default client;;
