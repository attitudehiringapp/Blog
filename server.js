const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuración de almacenamiento con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),  // Archivos subidos a 'public/uploads'
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)  // Renombrar el archivo para evitar colisiones
});
const upload = multer({ storage });

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));  // Archivos estáticos servidos desde la carpeta 'public'
app.use('/uploads', express.static('public/uploads'));  // Archivos subidos accesibles desde '/uploads'

let comentarios = [];

// Ruta para subir fotos
app.post('/subir-foto', upload.single('foto'), (req, res) => {
  console.log('Foto subida:', req.file);  // Ver los detalles de la foto subida
  res.redirect('/');  // Redirigir al inicio después de subir la foto
});

// Ruta para enviar comentarios
app.post('/comentar', (req, res) => {
  const { nombre, comentario } = req.body;
  if (nombre && comentario) {
    comentarios.push({ nombre, comentario });  // Guardar comentario
  }
  res.redirect('/');  // Redirigir al inicio después de enviar el comentario
});

// Ruta principal para mostrar el contenido
app.get('/', (req, res) => {
  const html = fs.readFileSync('public/index.html', 'utf8');  // Leer el archivo HTML

  // Renderizar los comentarios en el HTML
  const renderComentarios = comentarios.map(c =>
    `<p><strong>${c.nombre}:</strong> ${c.comentario}</p>`
  ).join('\n');

  const finalHtml = html.replace('<!-- COMENTARIOS -->', renderComentarios);  // Insertar los comentarios en el HTML

  res.send(finalHtml);  // Enviar el HTML resultante al navegador
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
