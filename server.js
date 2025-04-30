const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

let comentarios = [];

// Página principal
app.get('/', (req, res) => {
  const html = fs.readFileSync('public/index.html', 'utf8');
  const renderComentarios = comentarios.map(c =>
    `<p><strong>${c.nombre}:</strong> ${c.comentario}</p>`
  ).join('\n');
  const finalHtml = html.replace('<!-- COMENTARIOS -->', renderComentarios);
  res.send(finalHtml);
});

// Página de galería de fotos
app.get('/fotos', (req, res) => {
  const htmlTemplate = fs.readFileSync('public/fotos.html', 'utf8');
  const imageFiles = fs.readdirSync('uploads').filter(file =>
    /\.(jpg|jpeg|png|gif)$/i.test(file)
  );
  const galleryHtml = imageFiles.map(file =>
    `<img src="/uploads/${file}" alt="${file}">`
  ).join('\n');
  const finalHtml = htmlTemplate.replace('<!-- FOTOS -->', galleryHtml);
  res.send(finalHtml);
});

// Subir foto
app.post('/subir-foto', upload.single('foto'), (req, res) => {
  console.log('Foto subida:', req.file);
  res.redirect('/');
});

// Agregar comentario
app.post('/comentar', (req, res) => {
  const { nombre, comentario } = req.body;
  if (nombre && comentario) {
    comentarios.push({ nombre, comentario });
  }
  res.redirect('/');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
