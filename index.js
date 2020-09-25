const express = require("express")
const bodyParser = require("body-parser")

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
