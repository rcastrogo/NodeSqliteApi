"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3_1 = __importDefault(require("sqlite3"));
var DataManager = /** @class */ (function () {
    function DataManager() {
    }
    DataManager.prototype.OnDatabaseReady = function (onReady) {
        var _db = new sqlite3_1.default.Database('./dist/data/data.db', sqlite3_1.default.OPEN_READWRITE | sqlite3_1.default.OPEN_CREATE, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                onReady(_db);
            }
        });
    };
    DataManager.prototype.InitDB = function () {
        this.OnDatabaseReady(function (db) {
            db.serialize(function () {
                db.exec("CREATE TABLE IF NOT EXISTS Users (\n                        id integer NOT NULL PRIMARY KEY,\n                        first_name text NOT NULL,\n                        last_name text NOT NULL,\n                        gender text,\n                        company text,\n                        email text NOT NULL UNIQUE );", function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                    }
                });
            });
            db.close();
        });
    };
    DataManager.prototype.PopulateDb = function (usuarios) {
        this.OnDatabaseReady(function (db) {
            db.serialize(function () {
                var __stmt = db.prepare("INSERT INTO Users (id, first_name, last_name, gender, company, email) " +
                    "VALUES (?, ?, ?, ?, ?, ?);");
                usuarios.forEach(function (u) { return __stmt.run(u.id, u.first_name, u.last_name, u.gender, u.company, u.email); });
                __stmt.finalize();
            });
            db.close();
        });
    };
    DataManager.prototype.GetAlluser = function (onSuccess) {
        this.OnDatabaseReady(function (db) {
            db.serialize(function () {
                db.all("SELECT * FROM Users;", onSuccess);
            });
            db.close();
        });
    };
    DataManager.prototype.GetOne = function (id, onSuccess) {
        this.OnDatabaseReady(function (db) {
            db.serialize(function () {
                db.get("SELECT * FROM Users WHERE id = ?;", [~~id], onSuccess);
            });
            db.close();
        });
    };
    return DataManager;
}());
exports.DataManager = DataManager;
//# sourceMappingURL=DataManager.js.map