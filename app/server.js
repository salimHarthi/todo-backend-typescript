/// <reference path="../typings/express/express.d.ts"/>
/// <reference path="../typings/body-parser/body-parser.d.ts"/>
const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
const todos = [{ id: -1, title: 'test', order: 'test1', completed: false }];
let id = 0;
function createCallback(res, onSuccess) {
  return function callback(err, data) {
    if (err || !data) {
      res.send(500, 'Something bad happened!');
      return;
    }
    onSuccess(data);
  };
}

app.get('/', function (req, res) {
  res.json(todos);
});
app.get('/:id', function (req, res) {
  var index = todos.findIndex((x) => x.id == Number(req.params.id));
  if (index > -1) {
    res.json(todos[index]);
  } else {
    res.json(null);
  }
});
app.post('/', function (req, res) {
  let data = {
    id: id++,
    title: req.body.title,
    order: req.body.order,
    completed: req.body.completed || false,
  };
  todos.push(data);
  res.json(data);
});
app.patch('/:id', function (req, res) {
  var foundIndex = todos.findIndex((x) => x.id == Number(req.params.id));
  if (foundIndex > -1) {
    todos[foundIndex] = {
      id: Number(req.params.id),
      title: req.body.title,
      order: req.body.order,
      completed: req.body.completed,
    };
  }

  res.json(todos[foundIndex]);
});
app.delete('/', function (req, res) {
  todos.length = 0;
  res.json(todos);
});
app.delete('/:id', function (req, res) {
  let index = todos.findIndex((x) => x.id == Number(req.params.id));
  if (index > -1) {
    todos.splice(index, 1);
  }
  res.json(todos);
});
app.listen(Number(process.env.PORT || 5000));
