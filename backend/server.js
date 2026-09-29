// Import des modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

// Initialisation du serveur
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.message);
  } else {
    console.log('Base de données connectée avec succès.');
  }
});

// Création des tables si elles n’existent pas
db.run(`CREATE TABLE IF NOT EXISTS roster (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  result TEXT NOT NULL
)`);

// Routes API
app.get('/roster', (req, res) => {
  db.all('SELECT * FROM roster', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/roster', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO roster (name) VALUES (?)', [name], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name });
  });
});

app.get('/matches', (req, res) => {
  db.all('SELECT * FROM matches', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/matches', (req, res) => {
  const { result } = req.body;
  db.run('INSERT INTO matches (result) VALUES (?)', [result], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, result });
  });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur Saiuzu lancé sur http://localhost:${PORT}`);
});

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../frontend')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

