const path = require('path')
const express = require('express')
const hbs = require('hbs')
const cookieParser = require('cookie-parser')
const userRouter = require("./routers/users");
const jobsRouter = require("./routers/jobs");
const softAuth = require("./middleware/softAuth");

const app = express()
const port = process.env.PORT || 3000

//Define paths for express config
const pubDir = express.static(path.join(__dirname, '../public'))
const viewPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialPath)

//setup static directory to serve
app.use(pubDir)
app.use(express.json())
app.use(cookieParser())

//routing requests
app.use(userRouter)
app.use(jobsRouter)

//HELPERS HBS
hbs.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('dateFormat', function (value) {
    return value.toISOString().replace(/T/, ' ').replace(/\..+/, '')
});
//HELPERS HBS

app.get('', softAuth, (req, res) => {
    res.render('index', {
        title: 'Auction',
        user: req.user
    })
})

app.get('*', softAuth, (req, res) => {
    res.render('error', {
        title: '404',
        error: 'Page not found',
        user: req.user
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})