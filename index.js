const express = require('express')
const dotenv = require("dotenv")

const app = express()
dotenv.config()

const port = process.env.PORT || 8000
const mongoose = require('mongoose')
const Todos = require('./model/todo')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// set the base path for views
app.use(express.static(__dirname + ('/public')))

// set views enging ejs
app.set('views', 'views')
app.set('view engine', 'ejs')

// mongodb configuration 
mongoose.Promise = global.Promise;
const mongoDB = process.env.MONGO_URI; // use your mongo database uri
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
    if (todos.name) {
        Todos.create(todos, (err, docs) => {
            if (err) return next(err)
            res.redirect("/");
        })
    } else {
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
    } else {
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
    } else {
        res.redirect("/");
    }
})

// delete task to todo list
app.delete('/deletetask/:id', (req, res, next) => {
    const id = req.params.id
    if (id) {
        Todos.findById(id, (err, docs) => {
            if (err) {
                return res.redirect(404, "/");
            } else {
                if (docs && docs._id) {
                    Todos.deleteOne({ _id: id }, (err, docs) => {
                        if (err) return next(err)
                        return res.redirect(200, "/");
                    })
                } else {
                    return res.redirect(404, "/");
                }
            }
        })
    } else {
        return res.redirect(404, "/");
    }
})

app.listen(port, () => console.log(`Server started at port: ${port}. http://localhost:5000/`))
