'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.guardar = (event, context, callback) => {
	
	const requestBody = JSON.parse(event.body);
	
	personaPersistir(personaCrear(requestBody))
    .then(persona => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Se guardo exitosamente la persona ${persona.nombre_apellidos}`,
          persona: persona
        })
      });
    })
    .catch(error => {
      console.log(error);
	  
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `No se logro guardar a la persona ${persona.nombre_apellidos}`,
        })
      })
    });
};

const personaPersistir = persona => {
	if(persona == undefined)
		return;
	
	console.log('Persistiendo persona');
	
	const personaDB = {
		TableName: process.env.TABLA_PERSONA,
		Item: persona,
	};
	return dynamoDb.put(personaDB).promise()
		.then(resultado => persona);
};


const personaCrear = requestBody => {
	
	let persona = {};
	
	persona = personaSet(requestBody);
	
	persona = personaEsValida(persona);
	
	if(persona == undefined)
		return;
	
	const timestamp = new Date().getTime();
	
	persona.id = uuid.v1();
	persona.creado = timestamp;
	persona.editado = timestamp;
	
	return persona;
}

const personaSet = requestBody =>{
	let persona = {};
	
	persona.nombre_apellidos = requestBody.nombre_apellidos;
	persona.anio_nacimiento = requestBody.anio_nacimiento;
	persona.color_ojos = requestBody.color_ojos;
	persona.genero = requestBody.genero;
	persona.color_cabello = requestBody.color_cabello;
	persona.altura = requestBody.altura;
	persona.masa = requestBody.masa;
	persona.color_piel = requestBody.color_piel;
	persona.url_planeta = requestBody.url_planeta;
	persona.peliculas = requestBody.peliculas;
	persona.especies = requestBody.especies;
	persona.naves_estelares = requestBody.naves_estelares;
	persona.vehiculos = requestBody.vehiculos;
	
	return persona;
}

const personaEsValida = persona =>{
	if (typeof persona.nombre_apellidos !== 'string' || 
		typeof persona.anio_nacimiento !== 'string' || 
		typeof persona.color_ojos !== 'string' ||
		typeof persona.genero !== 'string' ||
		typeof persona.color_cabello !== 'string' ||
		typeof persona.altura !== 'string' ||
		typeof persona.masa !== 'string' ||
		typeof persona.color_piel !== 'string' ||
		typeof persona.url_planeta !== 'string' ||
		!Array.isArray(persona.peliculas) ||
		!Array.isArray(persona.especies) ||
		!Array.isArray(persona.naves_estelares) ||
		!Array.isArray(persona.vehiculos)
	){
		console.error('Fallo al validar la persona');
		callback(new Error('No se logro guardar la persona, fallo al validar la persona'));
		return;
	}
	return persona;
}

module.exports.listar = (event, context, callback) => {
	var parametros = {
        TableName: process.env.TABLA_PERSONA,
        ProjectionExpression: "id, nombre_apellidos, anio_nacimiento, color_ojos, genero, color_cabello, altura, masa, color_piel, url_planeta, peliculas, especies, naves_estelares, vehiculos, creado, editado"
    };

    console.log("Leyendo tabla persona");
	
    const onLeerTabla = (error, resultado) => {

        if (error) {
            console.log('Fallo al leer los datos:', JSON.stringify(error, null, 2));
            callback(error);
        } else {
            console.log("Lectura exitosa");
			
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    personas: resultado.Items
                })
            });
        }
    };

    dynamoDb.scan(parametros, onLeerTabla);
}