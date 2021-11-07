const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')

const passwordValidators = [
    { validator: (v) => {return /(?=.*[a-z])/.test(v)}, message: 'Le mot de passe doit contenir au moins 1 caractère alphabétique minuscule' },
    { validator: (v) => {return /(?=.*[A-Z])/.test(v)}, message: 'Le mot de passe doit contenir au moins 1 caractère alphabétique majuscule' },
    { validator: (v) => {return /(?=.*[0-9])/.test(v)}, message: 'Le mot de passe doit contenir au moins 1 caractère numérique' },
    { validator: (v) => {return /(?=.*[!@#$%^&*])/.test(v)}, message: 'Le mot de passe doit contenir au moins un caractère spécial' },
]

const emailValidators = [
    { validator: (v) => {return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)}, message: "L'adresse email est invalide" },
]

const UserSchema = new Schema({
    email: { 
        type: String,
        required: [true, "L'adresse email est requise"],
        unique: true,
        uniqueCaseInsensitive: true,
        validate: emailValidators,
    },
    password: { 
        type: String,
        minlength: [8, 'Le mot de passe doit contenir au minimum 8 caractères'],
        maxlength: [128, 'Le mot de passe peut contenir au maximum 128 caractères'],
        validate: passwordValidators,
        required: [true, 'Le mot de passe est requis'],       
    }
})

UserSchema.pre('save', function(next) {
    var user = this
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)
            user.password = hash
            next()
        })
    })
})

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

UserSchema.plugin(uniqueValidator, { message: "Cette adresse email est déjà utilisée." })

module.exports = mongoose.model('User', UserSchema)