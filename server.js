const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

let comentarios = [];

// Ruta para subir fotos
app.post('/subir-foto', upload.single('foto'), (req, res) => {
  console.log('Foto subida:', req.file);
  res.redirect('/');
});

// Ruta para subir comentarios
app.post('/comentar', (req, res) => {
  const { nombre, comentario } = req.body;
  if (nombre && comentario) {
    comentarios.push({ nombre, comentario });
  }
  res.redirect('/');
});

// Ruta principal para mostrar la galería y los comentarios
app.get('/', (req, res) => {
  const html = fs.readFileSync('public/index.html', 'utf8');

  const renderComentarios = comentarios.map(c =>
    `<p><strong>${c.nombre}:</strong> ${c.comentario}</p>`
  ).join('\n');

  const finalHtml = html.replace('<!-- COMENTARIOS -->', renderComentarios);
  res.send(finalHtml);
});

// Ruta para ver solo fotos
app.get('/fotos', (req, res) => {
  const html = fs.readFileSync('public/index.html', 'utf8');

  const renderComentarios = comentarios.map(c =>
    `<p><strong>${c.nombre}:</strong> ${c.comentario}</p>`
  ).join('\n');

  const finalHtml = html.replace('<!-- COMENTARIOS -->', renderComentarios);
  res.send(finalHtml);
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
