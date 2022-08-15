const knex = require("../db/mysql")

const getAllCategories = () => {
    return knex('categories').select()
}

module.exports = {
    getAllCategories
}