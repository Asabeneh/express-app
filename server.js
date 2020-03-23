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

app.get('/', (req, res) => {
  let pathname = __dirname + '/views/index.html'
  res.sendFile(pathname)
})
app.get('/about', (req, res) => {
  let pathname = __dirname + '/views/about.html'
  res.sendFile(pathname)
})

app.get('/contact', (req, res) => {
  let pathname = __dirname + '/views/contact.html'
  res.sendFile(pathname)
})
app.get('/text', (req, res) => {
  res.send('SOME TEXT')
})
app.get('/students', (req, res) => {
  res.send(students)
})
app.get('/students/:id', (req, res) => {
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

app.post('/students', (req, res) => {
  const id = students.length + 1
  req.body._id = id
  students.push(req.body)
  res.send('A data has been created')
})

app.put('/students/:id', (req, res) => {
  const id = +req.params.id
  students = students.map(st => {
    if (st._id == id) {
      req.body._id = id
      return req.body
    }
    return st
  })
  res.send('A student data has been updated')
})

app.delete('/students/:id', (req, res) => {
  const id = req.params.id
  students = students.filter(st => st._id != id)

  res.send('A student has been deleted')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})
