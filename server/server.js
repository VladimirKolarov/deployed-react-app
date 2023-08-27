const PORT = process.env.PORT ?? 8000;
const express = require('express');
const {v4: uuidv4} = require ('uuid')
const cors = require('cors')
const app = express();
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors());
app.use(express.json())

// get all todos
app.get('/todos/:userEmail', async (req, res) => {
    const userEmail = req.params.userEmail
    try {
        const todos = await pool.query(`SELECT * FROM todos WHERE user_email = '${userEmail}'`);
        res.json(todos.rows);
    } catch (err) {
        console.error(err);
    }
})

//Create a new todo
app.post('/todos', async(req, res) => {
    const {user_email, title, progress, date} = req.body;
    const id = uuidv4();
    try {
        const newTodo = await pool.query(`INSERT INTO todos(id, user_email, title, progress, date) VALUES('${id}', '${user_email}', '${title}', ${progress}, '${date}')`);
        res.json(newTodo)
    } catch (err) {
        console.error(err);
    }
})

//Edit a todo
app.put('/todos/:id', async(req, res) => {
    const {id} = req.params;
    const {user_email, title, progress, date} = req.body;
    try {
        const editToDO = await pool.query(`UPDATE todos SET user_email = '${user_email}', title = '${title}', progress = '${progress}', date = '${date}' WHERE id = '${id}'`);
        res.json(editToDO);
    } catch (err) {
        console.error(err);
    }
})

//Delete a todo
app.delete('/todos/:id', async(req, res) => {
    const {id} = req.params;
    try {
        const deletedToDo = await pool.query(`DELETE FROM todos WHERE id = '${id}'`);
        res.json(deletedToDo);
    } catch (err) {
        console.error(err);
    }  
})

// SIGNUP
app.post('/signup', async (req, res)=>{
    const {email, password} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
        const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES ('${email}', '${hashedPassword}')`);

        const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'});

        res.json({email, token})
    } catch (err) {
        console.error(err);
        res.json({detail: err.detail})
    }
})

// LOGIN
app.post('/login', async (req, res)=>{
    const {email, password} = req.body;
    try {
        const users = await pool.query(`SELECT * FROM users WHERE email = '${email}'`)
        if (!users.rows.length) {
            return res.json({detail: 'User does not exist'});
        }

        const success = await bcrypt.compare(password, users.rows[0].hashed_password);
        const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'});

        if (success) {
            res.json({'email': users.rows[0].email, token})
        } else {
            res.json({detail: 'Login failed'})
        }
    } catch (err) {
        console.error(err);
    }
})

app.listen(PORT, ()=> console.log(`Server is running on PORT ${PORT}`))
