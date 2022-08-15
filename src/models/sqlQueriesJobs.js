const knex = require("../db/mysql")
const validator = require('validator')
const bcrypt = require('bcryptjs')

const createJob = async (body, user) => {
    try {
        const jobId = await knex('jobs').insert({
            creator_id: user.id,
            title: body.title,
            category_id: body.category_id,
            auction_type: body.type,
            wage: body.wage,
            final_wage: body.wage,
            description_short: body.description_short,
            description_long: body.description_long,
            timestamp_posted: knex.fn.now(),
            timestamp_closed: body.timestamp_closed,
            image: body.image,
            status: 1
        })
        return {jobId}
    } catch (e) {
        return e
    }
}

const getUserJobsById = (id) => {
    return knex('jobs').select('jobs.*', 'categories.name')
        .where({creator_id: id})
        .join('categories', 'jobs.category_id', '=', 'categories.id')
        .orderBy('status', "desc").orderBy('timestamp_closed', "asc")
}

const getJobOffersOfUserById = (id) => {
    return knex('offers').select('offers.offer', 'jobs.*', 'categories.name')
        .where({user_id: id, status: 1})
        .join('jobs', 'jobs.id', '=', 'offers.job_id')
        .join('categories', 'jobs.category_id', '=', 'categories.id')
        .groupBy('job_id')
        .orderBy('timestamp_closed', "asc")
}

const getWonJobs = (id) => {
    return knex('jobs').select('jobs.*', 'categories.name', 'offersT.offer')
        .join('categories', 'jobs.category_id', '=', 'categories.id')
        .leftJoin(
            knex('offers').select('job_id').min('offer as offer').where({'user_id': id}).groupBy('job_id').as('offersT'),
            'jobs.id', '=', 'offersT.job_id'
        )
        .where({winner_id: id, status: 0})
        .orderBy('timestamp_closed', "desc")
}

const getJobs = (user) => {
    if (user) {
        return knex('jobs').select('jobs.*', 'categories.name', 'offersT.offer')
            .where({status: 1})
            .andWhere('timestamp_closed', '>', knex.fn.now())
            .join('categories', 'jobs.category_id', '=', 'categories.id')
            .leftJoin(
                knex('offers').select('job_id').min('offer as offer').where({'user_id': user.id}).groupBy('job_id').as('offersT'),
                'jobs.id', '=', 'offersT.job_id'
            )
            .groupBy('jobs.id')
            .orderBy('timestamp_closed', "desc")
    }
    return knex('jobs').select('jobs.*', 'categories.name')
        .where({status: 1})
        .andWhere('timestamp_closed', '>', knex.fn.now())
        .join('categories', 'jobs.category_id', '=', 'categories.id')
        .orderBy('timestamp_closed', "desc")
}

const getJobById = (id, status, user) => {
    return knex('jobs').select('jobs.*', 'categories.name', 'offersT.offer')
        .where({'jobs.id': id})
        .join('categories', 'jobs.category_id', '=', 'categories.id')
        .leftJoin(
            knex('offers').select('job_id').min('offer as offer').where({'user_id': user.id}).groupBy('job_id').as('offersT'),
            'jobs.id', '=', 'offersT.job_id'
        )
        .first()
}

const getJobTimestampClosed = (id) => {
    return knex('jobs').select('jobs.timestamp_closed')
        .where({'jobs.id': id})
        .first()
}

const updateJobWinnerAndWage = (body, user) => {
    return knex('jobs').update({final_wage: body.bid, winner_id: user.id})
        .where({id: body.job_id})
}

const closeAuctionById = (id) => {
    return knex('jobs').update({status: 0})
        .where({id: id})
}

const getExpiredAuctions = () => {
    return knex('jobs').where({status: 1})
        .andWhere('timestamp_closed', '<', knex.fn.now())
}

const getAllActiveDutchAuctions = () => {
    return knex('jobs').where({auction_type: 2, status: 1})
}

const cancelJobById = (id) => {
    return knex('jobs').update({status: 0, winner_id: null})
        .where({id: id})
}


module.exports = {
    createJob,
    getUserJobsById,
    getJobs,
    getJobById,
    getJobTimestampClosed,
    updateJobWinnerAndWage,
    closeAuctionById,
    getJobOffersOfUserById,
    getWonJobs,
    getExpiredAuctions,
    getAllActiveDutchAuctions,
    cancelJobById
}