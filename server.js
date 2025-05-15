const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

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
  const fotos = fs.readdirSync(path.join(__dirname, 'uploads'));
  const imagenesHtml = fotos.map(foto =>
    `<div class="imagen"><img src="/uploads/${foto}" alt="${foto}"></div>`
  ).join('\n');

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Galería de Fotos</title>
      <link rel="stylesheet" href="/estilos.css">
    </head>
    <body>
      <header>
        <h1>Blog Motero</h1>
        <nav>
          <a href="/">Inicio</a>
          <a href="/fotos" class="activo">Fotos</a>
          <a href="#">Videos</a>
          <a href="#">Entradas</a>
          <a href="#">Contacto</a>
        </nav>
      </header>
      <main>
        <h2>Galería de Fotos</h2>
        <div class="galeria">
          ${imagenesHtml}
        </div>
      </main>
    </body>
    </html>
  `;
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
