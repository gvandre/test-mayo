const fs = require('fs')
const config = require('./utils/config')
const express = require('express');
const bodyParser = require('body-parser')

// Variables
const read = fs.createReadStream('./palabras/palabras.txt', 'utf8')
const PORT = config.port;
let longArray = []

// Set up the express app
const app = express();
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// get all todos
app.get(`/api`, (req, res) => {
    let sizeArr = longArray.length
    let wordKey = req.query.query ? req.query.query : '*ru??a'
    let controlTop = req.query.top ? parseInt(req.query.top) : Infinity
    let censitive = req.query.cs ? req.query.cs : false
    // Build
    let resultArray = []
    let rows = 0
    let wordLike = wordKey.indexOf('*') >= 0 ? true : false
    let wordLetters = wordKey.indexOf('?') >= 0 ? true : false
    let cleanWord = wordKey.replace('*', '').replace(/\?/g, '.')
    let regx = censitive ? new RegExp(`${cleanWord}`) : new RegExp(`${cleanWord}`, 'i')

    for (let i = 0; i < sizeArr; i++) {
        let word = longArray[i]
        if (rows === controlTop) break
        if (wordLike) {
            if (regx.test(word)) {
                resultArray.push(word)
                rows++
            }
        } else {
            if (wordLetters) {
                let subWord = word.match(regx)
                if(subWord){
                    if (subWord[0] === word) {
                        resultArray.push(word)
                        rows++
                    }
                }
            } else {
                if (word === wordKey) {
                    resultArray.push(word)
                    rows++
                }
            }
        }
    }

  res.status(200).send({
    success: 'true',
    total: resultArray.length,
    param: resultArray
  })
})

let longString = ''
read.on('data', chunk => {
    longString += chunk
})
read.on('end', () => {
    longArray = longString.split('\r\n')
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    });
})
