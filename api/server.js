// BUILD YOUR SERVER HERE
const express = require ('express')
const User = require('./users/model')
const server = express()

server.use(express.json())

server.get('/api/users', (req,res) => {
  User.find()
  .then(user => {
    !user
      ? res.status(500).json({ message: 'The users information could not be retrieved' })
      : res.status(200).json(user)
  })
})

server.get('/api/users/:id', (req,res) => {
  const id = req.params.id
  User.findById(id)
  .then(user => {
    !user
      ? res.status(404).json({message: 'The user with the specified ID does not exist'})
      : res.status(200).json(user)
  })
})

server.post('/api/users', (req,res) => {
  const {name, bio} = req.body
  !name || !bio
  ? res.status(400).json({message: 'Please provide name and bio for the user'})
  : User.insert(req.body)
      .then(user => {
        res.status(201).json(user)
    })
    .catch(err => {
      res.status(500).json({
        message: 'There was an error while savign the user to the database',
        err: err.message,
        stack: err.stack,
      })
    })
})

server.delete('/api/users/:id', (req,res) => {
  User.remove(req.params.id)
  .then(deleted => {
    !deleted
      ? res.status(404).json({
        message: 'The user with the specified ID does not exist'
      })
      : res.json(deleted)
  })
  .catch(err => {
    res.status(500).json({
      message: 'The user could not be removed'
    })
  })

})

server.put('/api/users/:id', async (req,res) => {
  try {
  const { name, bio } = req.body
  const user = await User.findById(req.params.id)
  const updatedUser = await User.update(req.params.id, req.body)
    !user
    ? res.status(404).json({message: 'The user with the specified ID does not exist'})
      : !name || !bio
        ? res.status(400).json({ message: 'Please provide name and bio for the user' })
        : res.status(200).json(updatedUser)
      }
      catch (err){
    res.status(500).json({
      message: 'The user information could not be modified',
      err: err.message,
      stack: err.stack,
    })
  }
})

module.exports = server;