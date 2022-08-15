const knex = require("../db/mysql")

const addBid = async (job_id, body, user) => {
    try{
        const offer = await knex('offers').insert({
            job_id: job_id,
            user_id: user.id,
            offer: body.bid,
            timestamp: knex.fn.now()
        })
        return {offer}
    } catch (e) {
        return e
    }
}

const getBestOfferById = (id) => {
    return knex('offers').select('user_id', 'offer')
        .where({job_id: id})
        .orderBy('offer','asc')
        .first()
}


module.exports = {
    addBid,
    getBestOfferById
}