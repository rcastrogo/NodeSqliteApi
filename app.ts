import express from 'express';
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import {usuario} from "./models.usuario";
import {DataManager} from "./dal/DataManager"



// Create a new express application instance
const app: express.Application = express();

app.use('/pwa', express.static(__dirname + '/docs'));

// parse requests of content-type - application/x-www-form-urlencoded
// parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var data: usuario[] = [];

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/user', function (req, res) {
  if(data.length == 0){
    LoadJson();  
  }
  res.send(JSON.stringify(data));
});

app.get('/user/:id', function (req, res) {
  if(data.length == 0){
    LoadJson();  
  }
  var target = data.filter( u => u.id.toString() == req.params.id )[0];
  if(target){
    return res.send(target);
  }

  return res.status(404).send({
    message: "User not found with id " + req.params.id
  }); 

});

app.get('/init-db', function (req, res) {
  new DataManager().InitDB();
  return res.send("");
})

app.get('/data', function (req, res) { 
  var __dataManager = new DataManager();
  __dataManager.GetAlluser( (err:any, rows:any) => {
    if(err){
      return res.status(404).send({
        message: err
      }); 
    }
    return res.send(rows); 
  });
})

app.get('/data/:id', function (req, res) {
  new DataManager().GetOne(req.params.id, (err:any, row:any) => {
    if(err){
      return res.status(404).send({ message: err }); 
    }
    if(!row){
      return res.status(404).send({
        message: "User not found with id " + req.params.id
      }); 
    }
    return res.send(row); 
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

function LoadJson(): void{
  var file = path.resolve(__dirname, './data/usuarios.json')
  var content = fs.readFileSync(file, 'utf8');
  data = JSON.parse(content);
}