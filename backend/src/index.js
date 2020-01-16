const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
const cors = require('cors');

const app = express()

mongoose.connect('mongodb+srv://artorias:fluminense@cluster0-2kcqr.mongodb.net/week10?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(3333)


// Metodos HTTP: GET, POST, PUT, DELETE

// Tipos de paremetros:
// Query Params: req.query(Filtros, ordenação, paginação, ...)
// Route Params: req.params(Identificar um recurso na alteração ou remoção)
// Body: req.body (Dados para criação ou alteração de um registro)

//MongoDB (Não-relacional)

