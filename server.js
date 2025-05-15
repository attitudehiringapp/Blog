const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Rutas
let comentarios = [];

app.post('/subir-foto', upload.single('foto'), (req, res) => {
  console.log('Foto subida:', req.file);
  res.redirect('/');
});

app.post('/comentar', (req, res) => {
  const { nombre, comentario } = req.body;
  if (nombre && comentario) {
    comentarios.push({ nombre, comentario });
  }
  res.redirect('/');
});

app.get('/', (req, res) => {
  const html = fs.readFileSync('public/index.html', 'utf8');
  const renderComentarios = comentarios.map(c =>
    `<p><strong>${c.nombre}:</strong> ${c.comentario}</p>`
  ).join('\n');
  const finalHtml = html.replace('<!-- COMENTARIOS -->', renderComentarios);
  res.send(finalHtml);
});

app.get('/fotos', (req, res) => {
  fs.readdir('./uploads', (err, files) => {
    if (err) {
      return res.status(500).send('Error al leer las imágenes');
    }

    const imagenesHtml = files.map(file => 
      `<div class="imagen"><img src="/uploads/${file}" alt="${file}"></div>`
    ).join('\n');

    const html = fs.readFileSync('public/fotos.html', 'utf8');
    const finalHtml = html.replace('<!-- GALERIA -->', imagenesHtml);
    res.send(finalHtml);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
