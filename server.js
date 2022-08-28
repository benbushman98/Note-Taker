const express = require('express');
const fs = require('fs')
const util = require("util");
const path = require('path');
const id = require('./helpers/uuid');
const { notDeepEqual } = require('assert');

const PORT = process.env.PORT || 3001;

const app = express();

// MIDDLEWARE FOR PARSING JSON
app.use(express.json());


app.use(express.static('public'));


// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// END GET Route for notes page

// READ FROM DATABASE
const readDatabase = util.promisify(fs.readFile);
// END READ FROM DATABASE

// APPEND AND WRITE TO DATABASES
const appendToNote = (body, database) => {
    fs.readFile(database, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const noteData = JSON.parse(data);
            noteData.push(body);
            writeToDatabase(database, noteData)
        }
    });
};
const writeToDatabase = (file, body) => {
    fs.writeFile(file, JSON.stringify(body, null, 2), (err) =>
        err ? console.error(err) : console.log('\nAdded to Notes'))
}
// END APPEND AND WRITE TO DATABASES

// GET request to render notes to page
app.get('/api/notes', (req, res) => {
    const filePath = ('./db/db.json')
    readDatabase(filePath).then((data) => res.json(JSON.parse(data)));
})
// END GET request to render notes to page

// ADD TO NOTES
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (req.body) {
        let newNote = {
            title,
            text,
            id: id()
        };

        appendToNote(newNote, './db/db.json')


        res.json(newNote)
    }
});
// END ADD TO NOTES

// DELETE NOTE
app.delete('/api/notes/:id', function (req, res) {
    const id = req.params.id;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        const removeNote = JSON.parse(data).filter(newNote => newNote.id !== id);
        fs.writeFile('./db/db.json', JSON.stringify(removeNote, null, 2), (err) => {
            if (err) {
                console.log(err);
            }
            res.json(removeNote)
        })
    });
})
// END DELETE NOTE

// Wildcard redirect
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
// End Wildcard redirect

//  Listen to Port
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
// END Listen to Port