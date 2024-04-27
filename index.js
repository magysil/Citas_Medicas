//Importación de todas las dependencias 
import express from 'express';
import axios from 'axios';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import chalk from 'chalk';

console.clear();

const app = express();
const PORT = 3000;

moment.locale('es')
let usuarios = [];

//Función que recibe la información de la API y crea el arreglo con los datos necesarios, agrupandolos por genero
const infoUsuarios = (info) => {
    const {gender, name: {first,last} } = info
    usuarios.push({
        Genero: gender,
        Nombre: first,
        Apellido: last,
        Id: uuidv4().slice(0,6),
        Timestamp: moment().format('LLLL')
    })
    return _.groupBy(usuarios,'Genero' )
}

//Uso de axios para para hacer la petición a la Api de usuarios
app.get('/usuarios', async(req,res) =>{
    try{
        const respuesta = await axios.get('https://randomuser.me/api/'); 
        //console.log(respuesta)           
        const usuarioData = infoUsuarios(respuesta.data.results[0]);
        
        //Imprime por consola la lista de usuarios con fondo blaco y texto azul usando el paquete Chalk 
        console.log(chalk.bgWhite.blue(JSON.stringify(usuarioData, null, 2))); 

        //Platilla que muestra el listado de usuarios por pantalla dividido por género
        let usuariosGeneros = `
            ${usuarioData['female'] ? `
                 <h4> Mujeres</h4>
                    <ol>
                        ${usuarioData['female'].map(u => `<li>Nombre: ${u.Nombre} - Apellido: ${u.Apellido} - Id: ${u.Id} - Timestamp: ${u.Timestamp}</li>`).join('')}
                    </ol>
             ` : ''}

            ${usuarioData['male'] ? `
                <h4> Hombres</h4>
                    <ol>
                        ${usuarioData['male'].map(u => `<li>Nombre: ${u.Nombre} - Apellido: ${u.Apellido} - Id: ${u.Id} - Timestamp: ${u.Timestamp}</li>`).join('')}
                    </ol>
            ` : ''}
        `;

       res.send(usuariosGeneros)


    }catch(error){
        console.log('Error al registrar el usuario', error)
    }

})

//Levantamiento del servidor
app.listen(PORT, () =>{
    console.log(`Servidor en el puerto ${PORT}`)
})