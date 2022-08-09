const knex = require("../db/mysql")
const validator = require('validator')
const bcrypt = require('bcryptjs')

const createJob = async (body, user) => {
    try{
        console.log(body.image)
        const jobId = await knex('job').insert({
            user_id: user.id,
            title: body.title,
            category_id: body.category_id,
            auction_type: 0,
            auction_subtype: 0,
            wage: body.wage,
            description_short: body.description_short,
            description_long: body.description_long,
            //TODO to from dates
            timestamp_job: knex.fn.now(),
            timestamp_posted: knex.fn.now(),
            timestamp_closed: body.timestamp_closed,
            location:"Bratislava", //todo not hardcode
            image: body.image,
            status: 1
        })
        return {jobId}
    } catch (e) {
        return e
    }
}

const getUserJobsById = (id) => {
    return knex('job').select('job.*', 'category.name').where({user_id: id}).join('category', 'job.category_id', '=', 'category.id').orderBy('status', "desc")
}

const getJobs = () => {
    return knex('job').select('job.*', 'category.name').where({status: 1}).andWhere('timestamp_closed', '>', knex.fn.now()).join('category', 'job.category_id', '=', 'category.id')
}

const getJobById = (id) => {
    return knex('job').select('job.*', 'category.name').where({status: 1, 'job.id': id}).andWhere('timestamp_closed', '>', knex.fn.now()).join('category', 'job.category_id', '=', 'category.id').first()
}

const getJobTimestampClosed = (id) => {
    return knex('job').select('job.timestamp_closed').where({status: 1, 'job.id': id}).andWhere('timestamp_closed', '>', knex.fn.now()).first()
}

module.exports = {
    createJob,
    getUserJobsById,
    getJobs,
    getJobById,
    getJobTimestampClosed
}