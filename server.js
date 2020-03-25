require('dotenv').config()
const express = require('express')
const fs = require('fs')
const os = require('os')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { showDateTime } = require('./my_modules/my_modules.js')
const Student = require('./models/Student')
const PORT = process.env.PORT || 5000

const app = express()

// CRUD OPERATION
// C:CREATE, R:READ, U:UPDATE, D:DELETE
// GET: Reading
// POST: CREATING
// PUT: UPDATING
// DELETE: DELETING

// connect mongodb with the server

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) return console.log(err)
    console.log('The server is connnected to MongoDB database')
  }
)

// We are setting our view engine, ejs

app.set('view engine', 'ejs')
// Middle ware

app.use((req, res, next) => {
  const user = os.hostname
  const page = req.url
  const date = showDateTime()
  const content = `${user} access ${page} page on ${date}\n`
  fs.appendFile('log.txt', content, err => {
    if (err) throw err

    console.log('content has been saved')
  })
  // must thing to do
  next()
})

// Serving static files in express
app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// the home route

app.get('/', (req, res) => {
  res.render('pages/index')
})

// the about route
app.get('/about', (req, res) => {
  res.render('pages/about')
})

// the contact route
app.get('/contact', (req, res) => {
  res.render('pages/contact')
})

// all students route, show route or the UI
app.get('/students', (req, res) => {
  Student.find({}, (err, students) => {
    if (err) return res.status(404).send('Not found')
    res.render('pages/students', { students })
  })
})

// route for a signle student, show route or UI
app.get('/students/:id', (req, res) => {
  const id = req.params.id
  Student.findOne({ _id: id }, (err, student) => {
    if (err) return res.status(404).send('Not found')
    res.render('pages/student', { student })
  })
})

// A form route to add student, show or UI
app.get('/student/add', (req, res) => {
  res.render('pages/add-student')
})

// An edit for to update student data, show or UI
app.get('/student/edit/:id', (req, res) => {
  const id = req.params.id
  Student.findOne({ _id: id }, (err, student) => {
    if (err) return res.status(404).send(err)
    res.render('pages/edit-student', { student })
  })
})

// GET all students, an API or JSON
app.get('/api/v1.0.0/students', (req, res) => {
  Student.find({}, (err, students) => {
    if (err) return res.status(404).send('Not found')
    res.json(students)
  })
})

// GET a single student, an object
app.get('/api/v1.0.0/students/:id', (req, res) => {
  const id = req.params.id
  Student.findOne({ _id: id }, (err, student) => {
    if (err) return res.status(404).send('Not found')
    res.send(student)
  })
})

// adding student route, api
app.post('/api/v.1.0/students', (req, res) => {
  req.body.skills = req.body.skills.split(',')
  const newStudent = new Student(req.body)
  newStudent.save(err => {
    if (err) return res.status(404).send('Not found')
    res.redirect('/students')
  })
})

// edit path or route, api
app.post('/api/v.1.0/students/:id/edit', (req, res) => {
  const id = req.params.id
  req.body.skills = req.body.skills.split(',')
  const { firstName, lastName, age, country, bio, skills } = req.body
  Student.findOne({ _id: id }, (err, student) => {
    if (err) return res.status(404).send(err)
    student.firstName = firstName
    student.lastName = lastName
    student.age = age
    student.country = country
    student.skills = skills
    student.bio = bio

    student.save(err => {
      if (err) return res.status(404).send(err)
      res.redirect('/students')
    })
  })
})

// route to delete
app.get('/api/v.1.0/students/:id/delete', (req, res) => {
  const id = req.params.id
  Student.deleteOne({ _id: id }, (err, student) => {
    if (err) return res.status(404).send(err)
    res.redirect('/students')
  })
})

// listen port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})
