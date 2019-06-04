const express = require('express')
const fs = require('fs')
const config = require('./utils/config')

// Variables
const read = fs.createReadStream('./palabras/palabras.txt', 'utf8')
const PORT = config.port;
let longArray = []

// Levantamos el express app
const app = express();

let longString = ''
// Data por pedasos
read.on('data', chunk => {
    // construcción del string
    longString += chunk
})
read.on('end', () => {
    // Convertimso el string a Array
    longArray = longString.split('\r\n')
    // Levatamos el servidor
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    });
})
// APi REST
app.get(`/api`, (req, res) => {
    // Validamos que exista el parametro query
    let query = req.query.query ? req.query.query : ''
    if (!query) {
        res.status(400).send({
            success: 'false',
            message: 'parametro [query] es importante'
        })
        return
    }
    let sizeArr = longArray.length
    let controlTop = req.query.top ? parseInt(req.query.top) : Infinity
    let censitive = req.query.cs ? req.query.cs : false
    // Build
    let resultArray = []
    let rows = 0
    
    // BUIL A REGEX (https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/RegExp)
    // Remplazamos todos los ? por caracteres posibles a través de "."
    let builRegex = query.replace(/\?/g,'.')
    
    // Todos los que inicien y finalicen con "*"
    if (/^\*.*\*$/.test(builRegex)) {
        console.log('Ejemplo: *oa*, todos los que tienen "oa" en cualquier posicion')
        builRegex = builRegex.replace(/\*/g, '.*')
    // Todos los que contengan "*" pero no en los extremos
    } else if (/^[^\*].*[^\*]$/.test(builRegex)) {
        console.log('Ejemplo: o*a, todos los que inician con "o" y finalizan con "a"')
        builRegex = `^${builRegex.replace(/\*/g, '.*')}$`
    // Todos los que solo inicien con  "*"
    } else if (/^\*.*/.test(builRegex)) {
        console.log('Ejemplo: *a, todos los que finalizan con a')
        builRegex = `${builRegex.replace(/\*/g, '.*')}$`
    // Todos los que solo finalicen con  "*"
    } else if (/.*\*$/.test(builRegex)) {
        console.log('Ejemplo: a*, todos los que inicien con a')
        builRegex = `^${builRegex.replace(/\*/g, '.*')}`
    }
    // texto censible
    builRegex = censitive ? new RegExp(builRegex) : new RegExp(builRegex, 'i')
    console.log(builRegex)

    // recorremos cada fila para buscar el patron construido
    for (let i = 0; i < sizeArr; i++) {
        let word = longArray[i]
        // Si contiene top, entonces solo recorremos hasta esa cantidad
        if (controlTop === rows) break
        // Validamos el patron con el metodo EXEC, ya que solo nos trae BOOL y no todas las coincidencias, la cual
        // nos da mayor perfomance
        if (builRegex.exec(word)) {
            // agregamos los resultado y contamos
            resultArray.push(word)
            rows++
        }
    }
    // Retorna el resultado
    res.status(200).send({
        success: 'true',
        total: resultArray.length,
        result: resultArray
    })
})
