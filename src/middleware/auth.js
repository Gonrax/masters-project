const jwt = require('jsonwebtoken')
const sql = require("../models/sqlQueriesUsers");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        const decoded = jwt.verify(token, 'dominikHusarMastersProject')
        const user = await sql.getUserById(decoded._id)
        if (!user) {
            throw new Error()
        }

        const tokenActive = await sql.isTokenActive(token)

        if(tokenActive.active === 0)
        {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.render('error', {error: "Please Log in first before proceeding", login: true})
    }
}

module.exports = auth