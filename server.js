const express = require('express');
const fs = require('fs')
const path = require('path');
const uuid = require('./helpers/uuid')

const PORT = process.env.PORT || 3001;

const app = express();

// MIDDLEWARE FOR PARSING JSON
app.use(express.json());


app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
// END GET Route for homepage

// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// END GET Route for notes page

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
    fs.writeFile(file, JSON.stringify(body, null, 4), (err) =>
        err ? console.error(err) : console.log('\nAdded to Notes'))
}
// END APPEND AND WRITE TO DATABASES

// ADD TO NOTES
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (req.body) {
        let newNote = {
            title,
            text,
            note_id: uuid()
        };

        appendToNote(newNote, './db/db.json')

    }
});
// END ADD TO NOTES

//  Listen to Port
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
// END Listen to Port