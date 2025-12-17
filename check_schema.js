import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./server/database.sqlite');

db.all("PRAGMA table_info(customers)", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Customers Table Schema:", rows);
});
