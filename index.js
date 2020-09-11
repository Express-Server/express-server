const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

const messages = []

app.get("/", (req, res) => {
    res.send(`
    <form method="post">
        <input name="message"/>
        <input type="submit"/>
        <ul>
            ${messages
                .map(message => `<li>${message}</li>`)
                .join("")}
        </ul>
    </form>
    `)
})

app.post("/", (req, res) => {
    console.log(req.body)

    messages.push(req.body.message)
    res.redirect(302, "/")
})

app.listen(8080, "0.0.0.0") 
console.log("listeing on http://localhost:8080")
