import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json", "utf-8");
    const parsedData = JSON.parse(data);

    // Verifica que la propiedad 'recursos' esté presente y no sea un array vacío
    if (parsedData.recursos && Array.isArray(parsedData.recursos)) {
      return parsedData;
    } else {
      throw new Error("La propiedad 'recursos' no está definida o no es un array.");
    }
  } catch (error) {
    console.log("Error al leer o analizar el archivo db.json:", error.message);
    return { recursos: [] }; // Retorna un array vacío si ocurre un error
  }
};

// Función para escribir datos
const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log("Error al escribir el archivo db.json:", error.message);
  }
};

// Endpoint base
app.get("/", (req, res) => {
  res.send("Welcome to my first API with Node.js");
});

// Obtener todos los recursos
app.get("/recursos", (req, res) => {
  const data = readData();
  res.json(data.recursos);
});

// Obtener un recurso por ID
app.get("/recursos/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const recurso = data.recursos.find((recurso) => recurso.id_recurso === id);

  if (recurso) {
    res.json(recurso);
  } else {
    res.status(404).json({ message: "Recurso no encontrado" });
  }
});

// Agregar un nuevo recurso
app.post("/recursos", (req, res) => {
  const data = readData();
  const body = req.body;
  const newRecurso = {
    id_recurso: data.recursos.length + 1,
    ...body,
  };
  data.recursos.push(newRecurso);
  writeData(data);
  res.json(newRecurso);
});

// Actualizar un recurso
app.put("/recursos/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const recursoIndex = data.recursos.findIndex((recurso) => recurso.id_recurso === id);

  if (recursoIndex !== -1) {
    data.recursos[recursoIndex] = {
      ...data.recursos[recursoIndex],
      ...body,
    };
    writeData(data);
    res.json({ message: "Recurso actualizado exitosamente" });
  } else {
    res.status(404).json({ message: "Recurso no encontrado" });
  }
});

// Eliminar un recurso
app.delete("/recursos/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const recursoIndex = data.recursos.findIndex((recurso) => recurso.id_recurso === id);

  if (recursoIndex !== -1) {
    data.recursos.splice(recursoIndex, 1);
    writeData(data);
    res.json({ message: "Recurso eliminado exitosamente" });
  } else {
    res.status(404).json({ message: "Recurso no encontrado" });
  }
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
