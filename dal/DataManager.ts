
import sqlite3 from 'sqlite3';
import { usuario } from '../models.usuario';

export class DataManager{

  constructor(){

  }

  private OnDatabaseReady(onReady : (db: sqlite3.Database) => any){
    var _db = new sqlite3.Database('./dist/data/data.db', 
                                    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
                                    (err) => { 
                                        if(err){
                                          console.log(err);
                                        }else{
                                            onReady(_db);  
                                        }
                                    });    
  }
  

  InitDB(){
    this.OnDatabaseReady( db => {
        db.serialize(() => {
            db.exec(`CREATE TABLE IF NOT EXISTS Users (
                        id integer NOT NULL PRIMARY KEY,
                        first_name text NOT NULL,
                        last_name text NOT NULL,
                        gender text,
                        company text,
                        email text NOT NULL UNIQUE );`, 
            (err) => { 
                if(err){
                    console.log(err);
                }else{
                
                }    
            });
        });
        db.close();
    });
  } 

  PopulateDb(usuarios: usuario[]){
    this.OnDatabaseReady( db => {
        db.serialize(() => {
            var __stmt = db.prepare("INSERT INTO Users (id, first_name, last_name, gender, company, email) " + 
                                    "VALUES (?, ?, ?, ?, ?, ?);",)
            usuarios.forEach( u => __stmt.run(u.id,
                                              u.first_name,
                                              u.last_name,
                                              u.gender,
                                              u.company,
                                              u.email) ); 
            __stmt.finalize();    
        });
        db.close();
    });                      
  }

  GetAlluser(onSuccess : (err:any,rows:any[]) => any){
    this.OnDatabaseReady( db => {
        db.serialize(() => {
            db.all("SELECT * FROM Users;", function(a, b){
              var __this = this;
              onSuccess(a, b);
            } );
        });
        db.close();
    });    
  }

  GetOne(id: string, onSuccess : (err:any,rows:any) => any){
    this.OnDatabaseReady( db => {
        db.serialize(() => {
            db.get("SELECT * FROM Users WHERE id = ?;", [~~id], onSuccess );
        });
        db.close();
    });    
  }

}