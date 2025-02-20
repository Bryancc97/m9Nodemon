import express from "express";
import fs from "fs"; // Trabajar con archivos
import bodyParser from "body-parser"; // Para recibir JSON en la petición POST

// Creo el objeto de la aplicación
const app = express();
app.use(bodyParser.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log("Error al leer el archivo db.json:", error);
    return { notificacions: [] }; // Retorna un array vacío si ocurre un error
  }
};

// Función para escribir información en db.json
const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 2)); // Añado `null, 2` para formatear el JSON
  } catch (error) {
    console.log("Error al escribir en el archivo db.json:", error);
  }
};

// Endpoint base
app.get("/", (req, res) => {
  res.send("Welcome to my first API with Node.js");
});

// Endpoint para obtener todas las notificaciones
app.get("/notificacions", (req, res) => {
  const data = readData();
  res.json(data.notificacions);
});

// Endpoint para obtener una notificación por ID
app.get("/notificacions/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);  // Convertimos el id a número
  const notificacion = data.notificacions.find((notificacion) => notificacion.id_notificacions === id);  // Usamos `id_notificacions` en lugar de `id`

  if (notificacion) {
    res.json(notificacion);
  } else {
    res.status(404).json({ message: "Notificación no encontrada" });
  }
});

// Endpoint POST para agregar una nueva notificación
app.post("/notificacions", (req, res) => {
  const data = readData();
  const body = req.body;

  const newNotificacion = {
    id_notificacions: data.notificacions.length + 1, // Generamos un nuevo ID
    ...body,
  };

  data.notificacions.push(newNotificacion);
  writeData(data);

  res.json(newNotificacion);
});

// Endpoint PUT para modificar una notificación
app.put("/notificacions/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  
  const notificacionIndex = data.notificacions.findIndex((notificacion) => notificacion.id_notificacions === id); // Cambié `id` por `id_notificacions`
  
  if (notificacionIndex !== -1) {
    data.notificacions[notificacionIndex] = {
      ...data.notificacions[notificacionIndex],
      ...body,
    };
    writeData(data);
    res.json({ message: "Notificación actualizada exitosamente" });
  } else {
    res.status(404).json({ message: "Notificación no encontrada" });
  }
});

// Endpoint DELETE para eliminar una notificación
app.delete("/notificacions/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  
  const notificacionIndex = data.notificacions.findIndex((notificacion) => notificacion.id_notificacions === id); // Cambié `id` por `id_notificacions`

  if (notificacionIndex !== -1) {
    data.notificacions.splice(notificacionIndex, 1); // Elimina la notificación
    writeData(data);
    res.json({ message: "Notificación eliminada exitosamente" });
  } else {
    res.status(404).json({ message: "Notificación no encontrada" });
  }
});

// Función para escuchar peticiones en el puerto 3000
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
