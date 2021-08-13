const express = require('express')
const expressSession = require('express-session')
const bodyParser = require('body-parser')

const signup = require('./signup')
const login = require('./login')
const {knex} = require('./db-connection')

const saveMessage = (userId, message) =>
  knex('messages')
    .insert({
      text: message.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      user_id: userId,
    })

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSession({
  secret: 'cotirube',
}))

app.all('/signup', signup)
app.get('/login', login.loginFormRender)
app.post('/login', login.loginFormSubmit)
app.get('/logout', login.renderLogout)

const renderMessages = (req, res) => {
  console.log('session', req.session)
  if (req.session.user) {
    knex('messages')
      .join('users', 'messages.user_id', '=', 'users.id')
      .orderBy('timestamp', 'desc')
      .then(messages =>
        res.send(`
            <h1>${req.session.user.name} Vitaj!</h1>
            <a href="/logout" >odhlas sa</a>
                <h1>Zatiaľ napíš čo sťeš</h1>
                <h2>Ale nemusíš napísať ňišt</h2>
                <form method="post">
                    
                    <input name="message" placeholder="Správa"/>
                    <input type="submit"/>
                    <ul>
                        ${messages
    .map(message => `<li>${message.timestamp} [${message.name}]: ${message.text}</li>`)
    .join('')}
                    </ul>
                </form>
                `))} else {
    res.send(`
                        <h1>Nazdar neni si prihlaseny!/prihlasena!</h1>
                        <a href="/login" >Prihlas sa</a>
                        <div>alebo sa</div>
                        <a href="/signup">zaregistruj</a>.
                    `)
  }
            
}

app.get('/', renderMessages)





app.post('/', (req, res) => {
  knex('users')
    .where({name: req.session.user.name})
    .first()
    .then(user => {
      if (!user) {
        knex('users')
          .insert({name: req.body.userName})
          .then(id => { saveMessage(id, req.body.message)})
          .then(() => { res.redirect(302, '/')})
      } else
        saveMessage(user.id, req.body.message)
          .then(() => res.redirect(302, '/'))
    })
})




app.listen(8080, '0.0.0.0') 
console.log('listeing on http://localhost:8080')
