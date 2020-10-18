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
	
	
  callback(null, {
        statusCode: 200,
        body: JSON.stringify(persona)
  });
};
