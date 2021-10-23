import axios from 'axios'
import bodyParser from 'body-parser'
// import dotenv from 'dotenv'
import express from 'express'

const app = express()
dotenv.config()

app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }));

//TODO

// set up Diaglowflow Chat bot to send automatic responses back
// https://www.youtube.com/watch?v=0NXqwT3Y09E&t=310s

const BASE_URL ="https://us-central1-rival-chatbot-challenge.cloudfunctions.net"

const createAccount =  async function (req, res, next)  {
  try {
    const response = await axios({
      method: 'post',
      url: `${BASE_URL}/challenge-register`,
      data : {
        "name": "Darwin Balino",
        "email": "darwinbalino@gmail.com"
      }
    }).catch(err => console.log(err))

    //store => "user_id": "6294101615968256"
    req.userId = response.data
    console.log(response.data)
    next()
  } catch (error) {
    res.status(400).json({message: error.message})
  }
}

const getConvoId = async function (req, res, next) {
    //access => "user_id": "6294101615968256"
  const userId = req.userId
  try {
    const response = await axios({
      method: 'post',
      url: `${BASE_URL}/challenge-conversation`,
      data: userId
    })
    console.log(response.data)
    //store =>  "conversation_id": "6253474949890048"
    req.convoId = response.data
    next()
  } catch (error) {
    res.status(400).json({message: error.message})
  }
}
const initializeConvo = async function (req, res, next) {
    //access => 6253474949890048
const convoId = req.convoId.conversation_id
  try {
    const response = await axios({
      method: 'get',
      url: `${BASE_URL}/challenge-behaviour/${convoId}`,
    }).catch(err => console.log(err))
    const arr = response.data.messages
    const data = arr[arr.length - 1] //get last message
    console.log(data)
    // next()
    res.send(data)
  } catch (error) {
    res.status(400).json({message: error.message})
  }
}

// call this to start
// chains all routes
app.get('/', [createAccount, getConvoId, initializeConvo])


const port = process.env.PORT || 5000
app.listen(port, () => (console.log(`Server listening on port ${port}`)))