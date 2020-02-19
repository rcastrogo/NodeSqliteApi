"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var body_parser_1 = __importDefault(require("body-parser"));
var DataManager_1 = require("./dal/DataManager");
// Create a new express application instance
var app = express_1.default();
app.use('/pwa', express_1.default.static(__dirname + '/html'));
// parse requests of content-type - application/x-www-form-urlencoded
// parse requests of content-type - application/json
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
var data = [];
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.get('/user', function (req, res) {
    if (data.length == 0) {
        LoadJson();
    }
    res.send(JSON.stringify(data));
});
app.get('/user/:id', function (req, res) {
    if (data.length == 0) {
        LoadJson();
    }
    var target = data.filter(function (u) { return u.id.toString() == req.params.id; })[0];
    if (target) {
        return res.send(target);
    }
    return res.status(404).send({
        message: "User not found with id " + req.params.id
    });
});
app.get('/init-db', function (req, res) {
    new DataManager_1.DataManager().InitDB();
    return res.send("");
});
app.get('/data', function (req, res) {
    var __dataManager = new DataManager_1.DataManager();
    __dataManager.GetAlluser(function (err, rows) {
        if (err) {
            return res.status(404).send({
                message: err
            });
        }
        return res.send(rows);
    });
});
app.get('/data/:id', function (req, res) {
    new DataManager_1.DataManager().GetOne(req.params.id, function (err, row) {
        if (err) {
            return res.status(404).send({ message: err });
        }
        if (!row) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        return res.send(row);
    });
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
function LoadJson() {
    var file = path_1.default.resolve(__dirname, './data/usuarios.json');
    var content = fs_1.default.readFileSync(file, 'utf8');
    data = JSON.parse(content);
}
//# sourceMappingURL=app.js.map