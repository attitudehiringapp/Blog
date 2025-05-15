const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

let comentarios = [];

// Página principal
app.get('/', (req, res) => {
  const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
  const renderComentarios = comentarios.map(c =>
    `<p><strong>${c.nombre}:</strong> ${c.comentario}</p>`
  ).join('\n');
  const finalHtml = html.replace('<!-- COMENTARIOS -->', renderComentarios);
  res.send(finalHtml);
});

// Página de fotos
app.get('/fotos', (req, res) => {
  try {
    const htmlTemplate = fs.readFileSync(path.join(__dirname, 'public', 'fotos.html'), 'utf8');
    const imageDir = path.join(__dirname, 'uploads');
    const imageFiles = fs.readdirSync(imageDir).filter(file =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    const galleryHtml = imageFiles.map(file =>
      `<img src="/uploads/${file}" alt="${file}" style="max-width: 300px; margin: 10px;">`
    ).join('\n');
    const finalHtml = htmlTemplate.replace('<!-- FOTOS -->', galleryHtml);
    res.send(finalHtml);
  } catch (err) {
    console.error('Error en /fotos:', err);
    res.status(500).send('Error interno del servidor');
  }
});

// Comentarios
app.post('/comentar', (req, res) => {
  const { nombre, comentario } = req.body;
  if (nombre && comentario) {
    comentarios.push({ nombre, comentario });
  }
  res.redirect('/');
});

// Subida de fotos
app.post('/subir-foto', upload.single('foto'), (req, res) => {
  console.log('Foto subida:', req.file);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
