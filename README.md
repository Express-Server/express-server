# express-server
It's a simple web application, writen in JavaScript. \
Still work in progress.

# Set-up
To get this server to work on your cumputer, you will need to follow the following steps:

## 1. 
Fork and clone the project. \
You can do that eather using **terminal**, or **GitHub Desktop** app.

## 2.
Locate the repository folder on your computer.
- If you are running **Linux/Mac**, do that using the `cd` command.
### Example:
```cmd
$ cd Desktop/Express-Server
```

- If you are running on **Windows**, also use the `cd` command.

But make sure you are on the right disc! \
If you are on the wrong disc, use `d:` command to switch to the another.
### Example:
```cmd
$ cd Desktop/Express-Server

$ d:
```
## 3.
Create development database, using `nmp run db`.
That will create an [Sqlite] database file `./dev-db.sqlite3` with three users:
`testuser`, `cotirubex` and `chrachel`. The passwords are the same as the user names.

You need to have [Sqlite] installed on your computer!
### Example:
```cmd
$ nmp run db
```

## 4.
Start the application, Using `npm start` command.
### Example:
```cmd
$ nmp start
```
And you are good to go!


[Sqlite]: https://www.sqlite.org/index.html