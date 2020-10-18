'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.guardar = (event, context, callback) => {
	
	const requestBody = JSON.parse(event.body);
	
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
	
	personaPersistir(personaCrear(persona))
    .then(resultado => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Se guardo exitosamente la persona ${persona.nombre_apellidos}`,
          persona: resultado
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
	console.log('Persistiendo persona');
	
	const personaDB = {
		TableName: process.env.TABLA_PERSONA,
		Item: persona,
	};
	return dynamoDb.put(personaDB).promise()
		.then(resultado => persona);
};


const personaCrear = persona => {
	const timestamp = new Date().getTime();
	
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
	
	return {
		id: uuid.v1(),
		nombre_apellidos: persona.nombre_apellidos,
		anio_nacimiento: persona.anio_nacimiento,
		color_ojos: persona.color_ojos,
		genero: persona.genero,
		color_cabello: persona.color_cabello,
		altura: persona.altura,
		masa: persona.masa,
		color_piel: persona.color_piel,
		url_planeta: persona.url_planeta,
		peliculas: persona.peliculas,
		especies: persona.especies,
		naves_estelares: persona.naves_estelares,
		vehiculos: persona.vehiculos,
		creado: timestamp,
		editado: timestamp,
	};
}
