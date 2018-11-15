const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000
const mongoose = require('mongoose')
const Todos = require('./model/todo')


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// set the base path for views
app.use(express.static(__dirname + ('/public')))

// set views enging ejs
app.set('views', 'views')
app.set('view engine', 'ejs')

// mongodb configuration 
mongoose.Promise = global.Promise;
const mongoDB = 'mongodb://<dbuser>:<dbpassword>@ds149593.mlab.com:49593/users'; // use your database user and password in here <dbuser>:<dbpassword>
mongoose.connect(mongoDB, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err) return console.log(err)
})

var task = [];

// get the todo list
app.get('/', (req, res, next) => {
    Todos.find((err, todos) => {
        if (err) return next(err)
        res.render('index', { task: todos })
    })

})

// add new todo task
app.post('/addtask', function (req, res, next) {
    let todos = new Todos(req.body);
    todos.name = req.body.newtask
    if(todos.name){
        Todos.create(todos, (err, docs) => {
            if (err) return next(err)
            res.redirect("/");
        })
    }else{
        res.redirect("/");
    }
    
});

// move task to completed
app.post('/removetask', function (req, res, next) {
    const ids = req.body.check

    if (ids) {
        Todos.updateMany({ _id: { $in: ids } }, { $set: { completed: 1 } }, (err, docs) => {
            if (err) return next(err)
            res.redirect("/");            
        })
    }else{
        res.redirect("/");            
    }

});

// re-add task to todo list
app.post('/readdtask', (req, res, next) => {
    const ids = req.body.readd
    if (ids) {
        Todos.updateMany({ _id: { $in: ids } }, { $set: { completed: 0 } }, (err, docs) => {
            if (err) return next(err)
            res.redirect('/');
        })
    }else{
        res.redirect("/");            
    }
})

app.listen(port, () => console.log(`Server started at port: ${port}`))
