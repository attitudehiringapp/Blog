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
  
  // Obtenemos las fotos de la carpeta uploads
  const renderFotos = getFotos(); 

  // Reemplazamos el marcador de posición con las fotos
  const finalHtml = html.replace('<!-- IMÁGENES -->', renderFotos);

  res.send(finalHtml);
});

// Función que obtiene las fotos de la carpeta 'uploads'
function getFotos() {
  const folderPath = path.join(__dirname, 'uploads');
  const files = fs.readdirSync(folderPath);
  
  // Filtramos solo las imágenes (puedes añadir más tipos si es necesario)
  const imageFiles = files.filter(file => ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase()));
  
  // Generamos el HTML con las imágenes
  return imageFiles.map(file => `<img src="/uploads/${file}" alt="${file}" />`).join('');
}

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
