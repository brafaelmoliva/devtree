import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
    handle: string
    name: string
    email: string
    password: string
    description: string
    image: string
    links: string
    profileViews: number // ✅ Nuevo campo
}

const userSchema = new Schema({
    handle: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    links: {
        type: String,
        default: '[]'
    },
    profileViews: {
        type: Number,
        default: 0 // ✅ Contador inicia en 0
    }
})

const User = mongoose.model<IUser>('User', userSchema)
export default User
