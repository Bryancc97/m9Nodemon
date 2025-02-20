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
    return { reservas: [] }; // Retorna un array vacío si ocurre un error
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

// Endpoint para obtener todas las reservas
app.get("/reservas", (req, res) => {
  const data = readData();
  res.json(data.reservas);
});

// Endpoint para obtener una reserva por ID
app.get("/reservas/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);  // Convertimos el id a número
  const reserva = data.reservas.find((reserva) => reserva.id_reserva === id);  // Usamos `id_reserva` en lugar de `id`

  if (reserva) {
    res.json(reserva);
  } else {
    res.status(404).json({ message: "Reserva no encontrada" });
  }
});

// Endpoint POST para agregar una nueva reserva
app.post("/reservas", (req, res) => {
  const data = readData();
  const body = req.body;

  const newReserva = {
    id_reserva: data.reservas.length + 1, // Generamos un nuevo ID
    ...body,
  };

  data.reservas.push(newReserva);
  writeData(data);

  res.json(newReserva);
});

// Endpoint PUT para modificar una reserva
app.put("/reservas/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  
  const reservaIndex = data.reservas.findIndex((reserva) => reserva.id_reserva === id); // Cambié `id` por `id_reserva`
  
  if (reservaIndex !== -1) {
    data.reservas[reservaIndex] = {
      ...data.reservas[reservaIndex],
      ...body,
    };
    writeData(data);
    res.json({ message: "Reserva actualizada exitosamente" });
  } else {
    res.status(404).json({ message: "Reserva no encontrada" });
  }
});

// Endpoint DELETE para eliminar una reserva
app.delete("/reservas/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  
  const reservaIndex = data.reservas.findIndex((reserva) => reserva.id_reserva === id); // Cambié `id` por `id_reserva`

  if (reservaIndex !== -1) {
    data.reservas.splice(reservaIndex, 1); // Elimina la reserva
    writeData(data);
    res.json({ message: "Reserva eliminada exitosamente" });
  } else {
    res.status(404).json({ message: "Reserva no encontrada" });
  }
});

// Función para escuchar peticiones en el puerto 3000
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
