const db = require('./conf/auth.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const methodOvirride = require('method-override');
const app = express();
const port = 3000;

// Permite que você use verbos HTTP
app.use(methodOvirride('X-HTTP-Method'));
app.use(methodOvirride('X-HTTP-Method-Override'));
app.use(methodOvirride('X-Method-Override'));
app.use(methodOvirride('_method'));

app.use((req, resp, next) => {
  resp.header("Acess-Control-Allow-Origin", "*");
  resp.header("Acess-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accep");
  next()
});

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//ROTEAMENTO RAIZ
app.get('/clientes', async (req, res) => {
  const results = await db.selectFull();
  console.log(results);
  res.json(results);
});

app.get('/clientes/:id', async (req, res) => {
  const id = req.params.id;
  const results = await db.selectById(id);
  console.log(results);
  res.json(results);
});

app.post('/cliente', async (req, res) => {
  const name = req.body.name;
  const age = req.body.age;
  const uf = req.body.uf;

  const results = await db.insertCliente(name, age, uf);
  console.log(results);
  res.json(results);
});

app.put('/clientes/:id', async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const age = req.body.age;
  const uf = req.body.uf;

  const results = await db.updateCliente(name, age, uf, id);
  console.log(results);
  res.json(results);
});

app.delete('/cliente/:id', async (req, res) => {
  const id = req.params.id;

  const results = await db.deleteById(id);
  console.log(results);
  res.json(results);
});

app.listen(port, () => {
    console.log(`Example app listening at http://192.168.3.156:${port}`);
});