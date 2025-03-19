const mongoose = require('mongoose')
const jwt= require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'user must have a name!'],
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: [true, 'user must have a email!'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'user must have a password!'],
        minLength: 6
    }

})
UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.generateToken= function(){
   return jwt.sign({userId:this._id, name: this.name}, process.env.JWT_SECREt, {expiresIn: '30d'} )

}
UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports= mongoose.model('User', UserSchema)