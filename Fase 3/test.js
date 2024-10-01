import pg from "pg";
import fs from "fs";

var sql = fs.readFileSync('../Fase 2/Varer.sql').toString();

pg.connect('postgres://test:test@localhost/test', function (err, client, done) {
    if (err) {
        console.log('error: ', err);
        process.exit(1);
    }
    client.query(sql, function (err, result) {
        done();
        if (err) {
            console.log('error: ', err);
            process.exit(1);
        }
        process.exit(0);
    });
});