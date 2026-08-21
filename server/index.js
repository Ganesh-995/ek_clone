import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import Inquiry from './models/Inquiry.js'

const app = express()
const port = process.env.PORT || 5000
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: allowedOrigin }))
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
})

app.post('/api/inquiries', async (request, response) => {
  try {
    const inquiry = await Inquiry.create(request.body)
    response.status(201).json({ message: 'Inquiry saved successfully', inquiryId: inquiry._id })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({ message: 'Please provide valid inquiry details.' })
    }
    console.error('Failed to save inquiry:', error)
    response.status(500).json({ message: 'Unable to save inquiry right now.' })
  }
})

const startServer = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing. Add it to your .env file.')
  }

  await mongoose.connect(process.env.MONGODB_URI)
  app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`)
  })
}

startServer().catch((error) => {
  console.error('Server startup failed:', error.message)
  process.exit(1)
})
