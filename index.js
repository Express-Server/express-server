const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

const messages = []

app.get("/delete/:messageId", (req, res) => {

    console.log("deleting message", req.params.messageId)
    messages.splice(req.params.messageId, 1)
    res.redirect(302, "/")
}) 
app.get("/", (req, res) => {
    res.send(`
    <h1>Zatiaľ napíš čo sťeš</h1>
    <h2>Ale nemusíš napísať ňišt</h2>
    <form method="post">
        <input name="message"/>
        <input type="submit"/>
        <ul>
            ${messages
                .map((message, index) => `<li>${
                    message
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                    } <a href="/delete/${index}">zmaz!</a></li>`)
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
