const knex = require("../db/mysql")
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const test = () => {
    return knex('user')
}

const createUser = async (body) => {
    try {
        const hashedPassword = await bcrypt.hash(body.password, 8)
        // const isMatch = await bcrypt.compare(body.password, hashedPassword)

        const userId = await knex('user').insert({
            email: body.email,
            first_name: body.first_name,
            last_name: body.last_name,
            password: hashedPassword,
            image: "1234",
            role: 0
        })

        const token = createJWT(userId)
        await knex('user_token').insert({user_id: userId, token: token})

        return {userId, token}
    } catch (e) {
        return e
    }
}

const logInUser = async (userId) => {
    const token = await createJWT(userId)
    await knex('user_token').insert({user_id: userId, token: token})
    return token
}

const createJWT = (userId) => {
    return jwt.sign({_id: userId}, 'dominikHusarMastersProject', {expiresIn: '7 days'})
}

const getUserById = (id) => {
    return knex('user').select().where({id: id}).first()
}

const getUserByEmail = (email) => {
    return knex('user').select().where({email: email}).first()
}

const disableToken = (token) => {
    return knex('user_token').where({token: token}).update({active: 0})
}

const isTokenActive = (token) => {
    return knex('user_token').where({token: token}).select("active").first()
}


module.exports = {
    test: test,
    createUser: createUser,
    getUserByEmail: getUserByEmail,
    getUserById: getUserById,
    logInUser: logInUser,
    disableToken: disableToken,
    isTokenActive: isTokenActive
}