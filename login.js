const {knex} = require('./db-connection')
const {hashPassword} = require('./auth')

const loginFormTemplate = (errors = []) => `
<h1>Log in</h1>
<form method="post" style="display: flex; flex-direction: column" >
    <input type="text" placeholder="Username" name="username" />
    <input type="password" placeholder="Password" name="password" />
    <input type="submit" value="Log in!" />
    <ul style="color: red">
        ${errors.map(error => `<li>${error}</li>`).join('')}
    </ul>
</form>
`

const loginFormRender = (req, res) =>
  res.send(loginFormTemplate())

const loginFormSubmit = async (req, res) => {
  const user = await knex('users')
    .where({name: req.body.username})
    .first()

  if (user) {
    const hashedPassword = hashPassword(req.body.password, user.salt)

    if (hashedPassword === user.password_hash) {
      req.session.user = user
      res.redirect(302, '/')
    } else {
      res.send(loginFormTemplate(['Wrong Password!!!']))
    }
  } else {
    res.send(loginFormTemplate(['This username doesn\'t exist!']))
  }    
}

const renderLogout = (req, res) => {
  req.session.user = undefined
  res.redirect(302, '/')
}

module.exports = {
  loginFormRender,
  loginFormSubmit,
  renderLogout,
}