const PORT = process.env.PORT ?? 8000;
const express = require('express');
const {v4: uuidv4} = require ('uuid')
const cors = require('cors')
const app = express();
const pool = require('./db')

app.use(cors());
app.use(express.json())

// get all todos
app.get('/todos/:userEmail', async (req, res) => {
    const userEmail = req.params.userEmail
    try {
        const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail]);
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
        const newTodo = await pool.query(`INSERT INTO todos(id, user_email, title, progress, date) VALUES('${id}', '${user_email}', '${title}', ${progress}, '${date}')`)
    } catch (err) {
        console.error(err);
    }
})

app.listen(PORT, ()=> console.log(`Server is running on PORT ${PORT}`))
