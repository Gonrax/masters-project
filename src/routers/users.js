const sql = require("../models/sqlQueriesUsers");
const auth = require("../middleware/auth");
const softAuth = require("../middleware/softAuth");
const express = require('express')
const bcrypt = require("bcryptjs");


const router = express.Router()

//get user my email
router.get('/user/me', auth, async (req, res) => {
    res.render('me', {
        user: req.user
    })
})

router.get('/user/login', softAuth, (req, res) => {
    res.render('login', {
        title: 'Auction',
        name: 'Dominik',
        user: req.user
    })
})

//user login
router.post('/user/login', softAuth, async (req, res) => {
    try {
        const user = await sql.getUserByEmail(req.body.email)
        if (user) {
            // check password
            const isMatch = await bcrypt.compare(req.body.password, user.password)

            if (isMatch) {
                //issue web token
                const token = await sql.logInUser(user.id)
                // res.redirect('/');
                res.cookie("jwt", token, {secure: false, httpOnly: false})
                res.send({token})
            } else {
                res.status(500).send("Wrong log in information")
            }
        } else {
            res.status(500).send({error: "Wrong log in information"})
        }
    } catch (e) {
        res.status(500).send("Please Enter valid Email and Password")
    }
})

//add user and get his email
router.post('/user/register', softAuth, async (req, res) => {
    try {
        const existingUser = await sql.getUserByEmail(req.body.email)
        if (!existingUser) {
            const {userId, token} = (await sql.createUser(req.body))
            const user = await sql.getUserById(userId)
            res.send({user, token})
        } else {
            res.send({error: "User Already exists"})
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/user/logout', auth, async (req, res) => {
    try {
        await sql.disableToken(req.token)
        res.redirect("/")
    } catch (e) {
        res.render('error', {
            e
        })
    }
})

module.exports = router