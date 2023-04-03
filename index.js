const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {
    allowInsecurePrototypeAccess
} = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cardRoutes = require('./routes/card')
const User = require('./models/user')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine) // регистрация в экспрессе движка handlebars
app.set('view engine', 'hbs') // с помощью set метода начинаем использовать handlebars
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('642af40b989cea9e3c399a24')
        req.user = user
        next()
    } catch (e) {
        console.log(e)
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
    extended: true
}))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        const url = `mongodb+srv://deandre25:0000@cluster0.d1taaii.mongodb.net/shop`

        await mongoose.connect(url, {
            useNewUrlParser: true
        })

        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'deyneka2003@gmail.com',
                name: 'Andrii',
                cart: {
                    items: []
                }
            })
            await user.save()
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()