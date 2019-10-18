const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {userApp} = require('./routes/users');
const port = 5003;

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}))
//parse application/json
app.use(bodyParser.json())

app.use('/user',userApp)

app.listen(port,()=>console.log(`listening on port number ${port}`))