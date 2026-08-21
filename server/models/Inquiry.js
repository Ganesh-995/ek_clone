import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    mobile: { type: String, required: true, trim: true, maxlength: 30 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true },
)

export default mongoose.model('Inquiry', inquirySchema)
