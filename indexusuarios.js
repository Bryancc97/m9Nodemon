import express from "express";
import fs from "fs"; //treballar amb arxius
import bodyParser from "body-parser"; //Ho afegim per entendre que estem rebent un json des de la petició post.

//Creo l'objecte de l'aplicació
const app=express();
app.use(bodyParser.json())

const readData=()=>{
    try{
        const data=fs.readFileSync("./db.json");
        //console.log(data);
        //console.log(JSON.parse(data));
        return JSON.parse(data)

    }catch(error){
        console.log(error);
    }
};
//Funció per escriure informació
const writeData=(data)=>{
    try{
        fs.writeFileSync("./db.json",JSON.stringify(data));

    }catch(error){
        console.log(error);
    }
}
//Funció per llegir la informació
//readData();

app.get("/",(req,res)=>{
    res.send("Wellcome to my first API with Node.js");
});

//Creem un endpoint per obtenir tots els llibres
app.get("/users",(req,res)=>{
    const data=readData();
    res.json(data.users);
})
//Creem un endpoint per obtenir un llibre per un id
app.get("/users/:id_usuari",(req,res)=>{
    const data=readData();
    //Extraiem l'id de l'url recordem que req es un objecte tipus requets
    // que conté l'atribut params i el podem consultar
    const id_usuari=parseInt(req.params.id_usuari);
    const user=data.users.find((user)=>user.id_usuari===id_usuari);
    res.json(user);
})

//Creem un endpoint del tipus post per afegir un llibre

app.post("/users",(req,res)=>{
    const data=readData();
    const body=req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newUser={
        id_usuari:data.users.length+1,
        ...body,
    };
    data.users.push(newUser);
    writeData(data);
    res.json(newUser);
});

//Creem un endpoint per modificar un llibre


app.put("/users/:id_usuari", (req, res) => {
    const data = readData();
    const body = req.body;
    const id_usuari = parseInt(req.params.id_usuari);
    const userIndex = data.users.findIndex((user) => user.id_usuari === id_usuari);
    data.users[userIndex] = {
      ...data.users[userIndex],
      ...body,
    };
    writeData(data);
    res.json({ message: "User updated successfully" });
  });

//Creem un endpoint per eliminar un usuario
app.delete("/users/:id_usuari", (req, res) => {
    const data = readData();
    const id_usuari = parseInt(req.params.id_usuari);
    const userIndex = data.users.findIndex((user) => user.id_usuari === id_usuari);
    //splice esborra a partir de userIndex, el número de elements 
    // que li indiqui al segon argument, en aquest cas 1
    data.users.splice(userIndex, 1);
    writeData(data);
    res.json({ message: "User deleted successfully" });
  });

//Funció per escoltar
app.listen(3000,()=>{
    console.log("Server listing on port 3000");
});