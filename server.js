const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuración de almacenamiento con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // Carpeta 'uploads' donde se guardan las fotos
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname) // Nombre único para cada archivo
});
const upload = multer({ storage });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Sirve archivos estáticos de la carpeta 'public'
app.use('/uploads', express.static('uploads')); // Sirve imágenes de la carpeta 'uploads'

let comentarios = [];
let fotos = []; // Aquí almacenaremos los nombres de las fotos subidas

// Ruta para subir fotos
app.post('/subir-foto', upload.single('foto'), (req, res) => {
  console.log('Foto subida:', req.file);
  fotos.push(req.file.filename); // Guardamos el nombre de la foto
  res.redirect('/');
});

// Ruta para el formulario de comentarios (Página de inicio)
app.get('/', (req, res) => {
  const html = fs.readFileSync('public/index.html', 'utf8');

  const renderComentarios = comentarios.map(c =>
    `<p><strong>${c.nombre}:</strong> ${c.comentario}</p>`
  ).join('\n');

  const finalHtml = html.replace('<!-- COMENTARIOS -->', renderComentarios);

  res.send(finalHtml);
});

// Ruta para ver todas las fotos subidas
app.get('/fotos', (req, res) => {
  const html = fs.readFileSync('public/fotos.html', 'utf8');

  // Renderizamos las fotos subidas
  const renderFotos = fotos.map(foto => 
    `<img src="/uploads/${foto}" alt="Foto subida" />`
  ).join('\n');

  const finalHtml = html.replace('<!-- FOTOS -->', renderFotos);

  res.send(finalHtml);
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
