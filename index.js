const express = require("express")
const bodyParser = require("body-parser")
const gensalt = require('@kdf/salt')
const sha256 = require('crypto-js/sha256')

const knex = require('knex')({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        // TODO: Make it configurable
        filename: "./db.sqlite3",
    }
})

const saveMessage = (userId, message) =>
    knex("messages")
        .insert({
            text: message.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
            user_id: userId,
        })

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

app.get("/cotirube", (req, res) => {
    res.append('Set-Cookie', 'fuu=nevimco; HttpOnly')
    res.send("kokos")
})
app.get("/cesta", (req, res) => {
    res.send(`<pre>${JSON.stringify(req.headers, null, 2)}</pre>`)
})

const PASSWORD_ERROR_MESSAGE = `
    <div style="color: red">
        Passwords don't match!
    </div>
`
const USER_ERROR_MESSAGE = `
    <div style="color: red">
        This username already exists!
    </div>
`

const renderLoginForm = (passwordError, user) => `
<h1>Sign Up</h1>
<form method="post" style="display: flex; flex-direction: column" >
    <input type="text" placeholder="Username" name="username" />
    <input type="password" placeholder="Password" name="password" />
    <input type="password" placeholder="Repeat password" name="passwordCheck" />
    <input type="submit" value="Create acount!" />
    ${passwordError ? PASSWORD_ERROR_MESSAGE : ""}
    ${user ? USER_ERROR_MESSAGE : ""}
</form>
`

app.all("/signup", (req, res) => {
    console.log("dosla poziadavka")
    let passwordError 
    if (req.method === "POST") {
        if (req.body.password !== req.body.passwordCheck) {
            passwordError = true
        }
        knex("users")
            .where({name: req.body.username})
            .first()
            .then(user => {
                console.log("existing user", user)
                if (user || passwordError) {
                    res.send(renderLoginForm(passwordError, user))
                } else {
                    gensalt(16)
                        .then(salt => {

                            const saltString = salt.toString('hex')
                            knex("users")
                                .insert({
                                    name: req.body.username,
                                    salt: saltString,
                                    password_hash: sha256(req.body.password + saltString),
                                })
                                .then(id => res.redirect(302, "/"))
                        })
                    
                }
            })

    } else {
        console.log("necakam")
        res.send(renderLoginForm())
    }

    
})

app.get("/", (req, res) => {
    knex("messages")
        .join("users", "messages.user_id", "=", "users.id")
        .orderBy('timestamp', 'desc')
        .then(messages =>
            res.send(`
                <h1>Zatiaľ napíš čo sťeš</h1>
                <h2>Ale nemusíš napísať ňišt</h2>
                <form method="post">
                    <input name="userName" placeholder="Meno" />
                    <input name="message" placeholder="Správa"/>
                    <input type="submit"/>
                    <ul>
                        ${messages
                            .map(message => `<li>${message.timestamp} [${message.name}]: ${message.text}</li>`)
                            .join("")}
                    </ul>
                </form>
                `))
})


app.post("/", (req, res) => {
    console.log(req.body)

    knex("users")
        .where({name: req.body.userName})
        .first()
        .then(user => {
            if (!user) {
                knex("users")
                    .insert({name: req.body.userName})
                    .then(id =>
                        saveMessage(id, req.body.message)
                            .then(() => res.redirect(302, "/"))
                    )
            } else
                saveMessage(user.id, req.body.message)
                    .then(() => res.redirect(302, "/"))
        })
})

app.listen(8080, "0.0.0.0") 
console.log("listeing on http://localhost:8080")
