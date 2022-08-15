const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const softAuth = require("../middleware/softAuth");
const auth = require("../middleware/auth");
const sql = require("../models/sqlQueriesJobs");
const sqlOffers = require("../models/sqlQueriesOffers");
const sqlAdditional = require("../models/sqlQueriesAdditional");


const router = express.Router()

router.get('/jobs', softAuth, async (req, res) => {
    try {
        const jobs = await sql.getJobs(req.user)
        res.render('jobs', {
            user: req.user,
            jobs: jobs
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/jobs/post', auth, async (req, res) => {
    const categories = await sqlAdditional.getAllCategories()
    res.render('createJob', {
        user: req.user,
        categories
    })
})

router.post('/job/cancel', auth, async (req, res) => {
    await sql.cancelJobById(req.body.id)
    res.send({success: true})
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
    const job = await sql.getJobById(req.params.id, 1, req.user)
    if (job) {
        if (job.timestamp_closed < Date.now()) {
            if(!(job.winner_id === req.user.id || job.creator_id === req.user.id)){
                res.render('error', {
                    error: "This job does not exist please try again",
                    user: req.user
                })
                return
            }
        }
        res.render('viewJob', {
            user: req.user,
            job: job
        })
    }else {
        res.render('error', {
            error: "This job does not exist please try again",
            user: req.user
        })
    }
})

router.get('/jobs/timestamp_closed/:id', auth, async (req, res) => {
    const jobTimestamp = await sql.getJobTimestampClosed(req.params.id)
    if (jobTimestamp) {
        res.send({
            timestamp: jobTimestamp,
        })
    } else {
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

router.get('/jobs/me/bids', auth, async (req, res) => {
    const jobs = await sql.getJobOffersOfUserById(req.user.id)
    res.render('mybids', {
        user: req.user,
        jobs: jobs
    })
})

router.get('/jobs/me/win', auth, async (req, res) => {
    const jobs = await sql.getWonJobs(req.user.id)
    console.log(jobs)
    res.render('wonJobs', {
        user: req.user,
        jobs: jobs
    })
})

router.post('/job/addBid', auth, async (req, res) => {
    try {
        const job = await sql.getJobById(req.body.job_id, 1, req.user)
        if (job.auction_type === 1 && req.user.id !== job.winner_id) { //english auction
            if (job.final_wage * 0.95 < req.body.bid) { // bid needs to be 5% smaller
                res.status(400).send({error: "Value is not 5% smaller than current winning bid"})
                return
            }

            const offer = await sqlOffers.addBid(job.id, req.body, req.user)
            if (offer) {
                await sql.updateJobWinnerAndWage(req.body, req.user)
                res.send({success: true, currentBid: req.body.bid})
            }

        } else if (job.auction_type === 2) { //dutch auction
            req.body.bid = job.final_wage
            const offer = await sqlOffers.addBid(job.id, req.body, req.user)
            if (offer) {
                await sql.updateJobWinnerAndWage(req.body, req.user)
                await sql.closeAuctionById(job.id)
                res.send({success: true})
            }
        } else if (job.auction_type === 3) { //FPSB auction TODO check user already did not place a bid
            const offer = await sqlOffers.addBid(job.id, req.body, req.user)
            if (offer) {
                res.send({success: true})
            }
        } else {
            res.status(400).send({error: "Error while creating offer"})
        }
    } catch (e) {
        res.status(400).send({error: e})
    }
})

const cronExpired = async () => {
    const expiredAuctions = await sql.getExpiredAuctions()


    for (const auction of expiredAuctions) {
        if (auction.auction_type === 1 || auction.auction_type === 2) { //if English or Dutch just close the auction
            await sql.closeAuctionById(auction.id)
        } else if (auction.auction_type === 3) {
            await sql.closeAuctionById(auction.id)
            const bestOffer = await sqlOffers.getBestOfferById(auction.id)
            if (bestOffer.offer < auction.wage) {
                await sql.updateJobWinnerAndWage({bid: bestOffer.offer, job_id: auction.id}, {id: bestOffer.user_id})
            }
        }
    }

    setTimeout(cronExpired, 5000);
}

const cronDutch = async () => {
    const dutchAuctions = await sql.getAllActiveDutchAuctions()
    for (const auction of dutchAuctions) {

        const wholeTimeframe = auction.timestamp_closed - auction.timestamp_posted
        const remainingTimeframe = auction.timestamp_closed - Date.now()
        let percentage = remainingTimeframe / wholeTimeframe
        let value = 1 - percentage + 0.2 * percentage

        await sql.updateJobWinnerAndWage({bid: auction.wage*value, job_id: auction.id}, {id: null})
    }

    setTimeout(cronDutch, 3600000);
}


cronExpired()
cronDutch()

module.exports = router