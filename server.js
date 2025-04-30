const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

let comentarios = [];

// Ruta principal (index.html)
app.get('/', (req, res) => {
  const html = fs.readFileSync('public/index.html', 'utf8');
  const renderComentarios = comentarios.map(c =>
    `<p><strong>${c.nombre}:</strong> ${c.comentario}</p>`
  ).join('\n');
  const finalHtml = html.replace('<!-- COMENTARIOS -->', renderComentarios);
  res.send(finalHtml);
});

// Página de fotos
app.get('/fotos', (req, res) => {
  const archivos = fs.readdirSync('./uploads');
  const imagenesHtml = archivos.map(nombre => {
    return `<img src="/uploads/${nombre}" alt="${nombre}" />`;
  }).join('\n');

  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>Galería de Fotos</title>
    <style>
      body {
        background-color: #121212;
        color: white;
        font-family: Arial, sans-serif;
        margin: 0;
      }
      header {
        background-color: #1f1f1f;
        padding: 20px;
        text-align: center;
      }
      header h1 {
        color: #ff6600;
        margin: 0;
      }
      nav {
        background-color: #2e2e2e;
        text-align: center;
        padding: 10px 0;
      }
      nav a {
        color: white;
        text-decoration: none;
        margin: 0 15px;
        font-weight: bold;
      }
      nav a:hover, nav a.active {
        color: #ff6600;
      }
      .container {
        padding: 20px;
      }
      .galeria {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }
      .galeria img {
        width: 100%;
        border-radius: 10px;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>Blog Motero</h1>
      <p>Pasión por las dos ruedas</p>
    </header>

    <nav>
      <a href="/">Inicio</a>
      <a href="/fotos" class="active">Fotos</a>
      <a href="/videos">Videos</a>
      <a href="/entradas">Entradas</a>
      <a href="/contacto">Contacto</a>
    </nav>

    <div class="container">
      <h2>Galería de Fotos</h2>
      <div class="galeria">
        ${imagenesHtml}
      </div>
    </div>
  </body>
  </html>
  `;

  res.send(html);
});

// Subida de fotos
app.post('/subir-foto', upload.single('foto'), (req, res) => {
  console.log('Foto subida:', req.file);
  res.redirect('/');
});

// Comentarios
app.post('/comentar', (req, res) => {
  const { nombre, comentario } = req.body;
  if (nombre && comentario) {
    comentarios.push({ nombre, comentario });
  }
  res.redirect('/');
});

// Start
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
