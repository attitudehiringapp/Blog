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
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

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
  const html = fs.readFileSync('public/fotos.html', 'utf8');
  const imagesDir = path.join(__dirname, 'public/uploads');

  let imageTags = '';
  if (fs.existsSync(imagesDir)) {
    const images = fs.readdirSync(imagesDir).filter(file =>
      ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase())
    );
    imageTags = images.map(img =>
      `<img src="/uploads/${img}" alt="${img}" style="max-width: 300px; margin: 10px;">`
    ).join('\n');
  }

  const finalHtml = html.replace('<!-- GALERIA -->', imageTags);
  res.send(finalHtml);
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
