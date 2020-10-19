'use strict';

const AWS = require('aws-sdk'); 

const swapi = require('swapi-node');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.guardar = async(event, context, callback) => {
	
	const requestBody = JSON.parse(event.body);
	let persona = convertirRequestBodyToPersona(requestBody);
	persona = validar(persona);
	if(persona == undefined)
		return;
	await guardar(persona);
	return callback(null, getRespuesta(persona));
};

module.exports.listar = async(event, context, callback) => {
	return callback(null, getRespuesta(await encontrarTodos()));
};

module.exports.get = async(event, context, callback) => {
	const _id = event.pathParameters.id;
	
	let persona = await encontrarPorId(_id);
	
	if(persona === undefined){
		let people = await encontrarEnSWAPI(_id);
		people.id = _id;
		
		let persona = convertirPeopleToPersona(people);
		await guardar(persona);
		return callback(null, getRespuesta(persona));
		
	}
	return callback(null, getRespuesta(persona));
};

async function encontrarEnSWAPI(id){
	let people = await swapi.getPerson(id);
	return people;
}

function convertirPeopleToPersona(people){
	let persona = {};
	
	persona.id = people.id;
	persona.nombre_apellidos = people.name;
	persona.anio_nacimiento = people.birth_year;;
	persona.color_ojos = people.eye_color;
	persona.genero = people.gender;
	persona.color_cabello = people.hair_color;
	persona.altura = people.height;
	persona.masa = people.mass;
	persona.color_piel = people.skin_color;
	persona.url_planeta = people.homeworld;
	persona.peliculas = people.films;
	persona.especies = people.species;
	persona.naves_estelares = people.starships;
	persona.vehiculos = people.vehicles;
	
	return persona;
};

function convertirRequestBodyToPersona (requestBody){
	let persona = {};
	
	persona.id = requestBody.id;
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
};

function validar(persona){
	if (typeof persona.id !== 'string' ||
		typeof persona.nombre_apellidos !== 'string' ||	
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
		return;
	}
	return persona;
};

async function encontrarTodos () {
	const parametros = {
        TableName: process.env.TABLA_PERSONA,
        ProjectionExpression: "id, nombre_apellidos, anio_nacimiento, color_ojos, genero, color_cabello, altura, masa, color_piel, url_planeta, peliculas, especies, naves_estelares, vehiculos, creado, editado"
    };

    let resultado = await dynamoDb.scan(parametros).promise();
	return resultado.Items;
};

async function encontrarPorId (_id) {
	const parametros = {
		TableName: process.env.TABLA_PERSONA,
		Key: {
			id: _id,
		}
	};
	let resultado = await dynamoDb.get(parametros).promise();
	return resultado.Item;
};

async function guardar(persona){
	const timestamp = new Date().getTime();
	
	persona.creado = timestamp;
	persona.editado = timestamp;
	
	const parametros = {
		TableName: process.env.TABLA_PERSONA,
		Item: persona,
	};
	let resultado = await dynamoDb.put(parametros).promise();
	return resultado;
};

function getRespuesta(resultado){
	const respuesta = {
        statusCode: 200,
        body: JSON.stringify(resultado),
    };
    return respuesta;
};