/**
 * 작성자 : 성우창
 * 수정 날짜 : 24.01.08
 * JikCo test Server!
 */
const http = require('http');
const express = require('express');
const app = express();

const db = require('./DB/DBconn');

const port = 4000;

app.set('port',port);

app.get('/',(req,res)=>{
    db.query(`SELECT * FROM JikCo.CATEGORY`,function(err,CATEGORY){
        if(err) throw err;
        console.log(CATEGORY);
        // res.json(CATEGORY);
        var parent = `<h2>Category</h2><table border="1">
                    <th>ID</th>
                    <th>이름</th>
                    <th>Description</th>`;
        var description = CATEGORY.map(CATEGORY => 
            parent += `<tr>
            <td>${CATEGORY.CategoryID}</td>
            <td>${CATEGORY.CategoryName}</td>
            <td>${CATEGORY.Description}</td>
            </tr>`
            );
        res.send('JikCo test Server!!!'+parent);
    });
    
});

app.listen(port, ()=>{
    console.log('test Server is running...');
});

module.exports = app;