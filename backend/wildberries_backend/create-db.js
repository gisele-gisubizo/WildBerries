const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '12345',
  database: 'postgres'
});

client.connect((err) => {
  if (err) {
    console.error('Connection error', err);
    return;
  }
  client.query('CREATE DATABASE wildberries;', (err, res) => {
    if (err) {
      console.error('Error creating database', err);
    } else {
      console.log('Database wildberries created successfully');
    }
    client.end();
  });
});
