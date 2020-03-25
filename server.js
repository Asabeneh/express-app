const express = require('express')
const fs = require('fs')
const os = require('os')
const bodyParser = require('body-parser')
const { showDateTime } = require('./my_modules/my_modules.js')
const PORT = process.env.PORT || 5000

const app = express()

// CRUD OPERATION
// C:CREATE, R:READ, U:UPDATE, D:DELETE
// GET: Reading
// POST: CREATING
// PUT: UPDATING
// DELETE: DELETING

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

let students = [
  {
    _id: 1,
    firstName: 'Asab',
    lastName: 'Yeta',
    age: 250,
    country: 'Finland',
    skills: ['HTML', 'CSS', 'JS', 'React']
  },
  {
    _id: 2,
    firstName: 'Atik',
    lastName: 'Rhaman',
    age: 25,
    country: 'Finland',
    skills: ['HTML', 'CSS', 'JS', 'React', 'Redux', 'Node']
  },
  {
    _id: 3,
    firstName: 'Bibek',
    lastName: 'Dhakal',
    age: 21,
    country: 'Finland',
    skills: ['HTML', 'CSS', 'JS', 'React', 'MongoDB']
  },
  {
    _id: 4,
    firstName: 'Arthur',
    lastName: 'Arthur',
    age: 25,
    country: 'Finland',
    skills: ['HTML', 'CSS', 'JS', 'React', 'Redux']
  }
]

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
  const student = {
    name: 'Asabeneh',
    age: 250,
    country: 'Finland',
    skills: ['HTML', 'CSS', 'JS']
  }

  res.render('pages/students', { students })
})

// route for a signle student, show route or UI
app.get('/students/:id', (req, res) => {
  const id = req.params.id
  const student = students.find(st => st._id == id)
  res.render('pages/student', { student })
})

// A form route to add student, show or UI
app.get('/student/add', (req, res) => {
  res.render('pages/add-student')
})

// An edit for to update student data, show or UI
app.get('/student/edit/:id', (req, res) => {
  const id = req.params.id
  const student = students.find(st => st._id == id)
  console.log(student)

  res.render('pages/edit-student', { student })
})

// GET all students, an API or JSON
app.get('/api/v1.0.0/students', (req, res) => {
  res.send(students)
})

// GET a single student, an object
app.get('/students/api/:id', (req, res) => {
  const id = req.params.id
  const student = students.find(
    st => st._id == id || st.firstName.toLowerCase() == id.toLowerCase()
  )

  if (student) {
    res.send(student)
  } else {
    res.send('Student with this id does not exist')
  }
})

// adding student route, api
app.post('/api/v.1.0/students', (req, res) => {
  console.log(req.body)
  const id = students.length + 1
  req.body.skills = req.body.skills.split(',')
  req.body._id = id
  students.push(req.body)
  res.redirect('/students')
})

// edit path or route, api
app.post('/api/v.1.0/students/:id/edit', (req, res) => {
  const id = +req.params.id
  students = students.map(st => {
    if (st._id == id) {
      req.body._id = id
      return req.body
    }
    return st
  })
  res.redirect('/students')
})

// route to delete
app.get('/api/v.1.0/students/:id/delete', (req, res) => {
  const id = req.params.id
  students = students.filter(st => st._id != id)
  res.redirect('/students')
})

// listen port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})


