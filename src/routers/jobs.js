const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const softAuth = require("../middleware/softAuth");
const auth = require("../middleware/auth");
const sql = require("../models/sqlQueriesJobs");


const router = express.Router()

router.get('/jobs', softAuth, async (req, res) => {
    try {
        const jobs = await sql.getJobs()
        res.render('jobs', {
            user: req.user,
            jobs: jobs
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/jobs/post', auth, (req, res) => {
    res.render('createJob', {
        user: req.user
    })
})

router.post('/jobs/post', auth, async (req, res) => {
    try {
        const jobId = await sql.createJob(req.body, req.user)
        res.send(jobId)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/jobs/me', auth, async (req, res) => {
    const jobs = await sql.getUserJobsById(req.user.id)
    res.render('myJobs', {
        user: req.user,
        jobs: jobs
    })
})

router.get('/jobs/:id', auth, async (req, res) => {
    const job = await sql.getJobById(req.params.id)
    if(job) {
        res.render('viewJob', {
            user: req.user,
            job: job
        })
    }else {
        res.render('error', {
            error: "This job does not exist please try again"
        })
    }
})

router.get('/jobs/timestamp_closed/:id', auth, async (req, res) => {
    const jobTimestamp = await sql.getJobTimestampClosed(req.params.id)
    if(jobTimestamp) {
        res.send({
            timestamp: jobTimestamp,
        })
    }else {
        res.status(404).send({
            error: "This job does not exist please try again"
        })
    }
})

const upload = multer({
    dest: "./public/images/jobs",
    limits: {
        fileSize: 5000000
    }
})

router.post('/job/image', auth, upload.single('jobImage'), async (req, res) => {
    res.send({fileName: req.file.filename})
})

router.get('/jobs/me/:id', auth, (req, res) => {
    console.log(req.params.id)
})

router.patch('/jobs/:id', auth, (req, res) => {

})

module.exports = router