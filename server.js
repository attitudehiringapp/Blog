const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Lista de fotos subidas
let fotos = [];

// Ruta para la página principal
app.get('/', (req, res) => {
  const html = fs.readFileSync('public/index.html', 'utf8');

  const renderFotos = fotos.map(foto => 
    `<img src="/uploads/${foto}" alt="Foto subida" />`
  ).join('\n');

  const finalHtml = html.replace('<!-- FOTOS -->', renderFotos);

  res.send(finalHtml);
});

// Ruta para subir fotos
app.post('/subir-foto', upload.single('foto'), (req, res) => {
  console.log('Foto subida:', req.file);
  fotos.push(req.file.filename); // Guardamos el nombre de la foto
  res.redirect('/');
});

// Ruta para la página de fotos
app.get('/fotos', (req, res) => {
  const html = fs.readFileSync('public/fotos.html', 'utf8');

  const renderFotos = fotos.map(foto => 
    `<img src="/uploads/${foto}" alt="Foto subida" />`
  ).join('\n');

  const finalHtml = html.replace('<!-- FOTOS -->', renderFotos);

  res.send(finalHtml);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
