'use strict';

const AWS = require('aws-sdk'); 

const swapi = require('swapi-node');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.guardar = async(event, context, callback) => {
	
	const requestBody = JSON.parse(event.body);
	let vehiculo = convertirRequestBodyToVehiculo(requestBody);
	vehiculo = validar(vehiculo);
	if(vehiculo == undefined)
		return;
	await guardar(vehiculo);
	return callback(null, getRespuesta(vehiculo));
};

module.exports.listar = async(event, context, callback) => {
	return callback(null, getRespuesta(await encontrarTodos()));
};

module.exports.get = async(event, context, callback) => {
	const _id = event.pathParameters.id;
	
	let vehiculo = await encontrarPorId(_id);
	
	if(vehiculo === undefined){
		let vehicle = await encontrarEnSWAPI(_id);
		vehicle.id = _id;
		
		let vehiculo = convertirVehicleToVehiculo(vehicle);
		await guardar(vehiculo);
		return callback(null, getRespuesta(vehiculo));
		
	}
	return callback(null, getRespuesta(vehiculo));
};

async function encontrarEnSWAPI(id){
	let vehicle = await swapi.getVehicle(id);
	return vehicle;
}

function convertirVehicleToVehiculo(vehicle){
	let vehiculo = {};
	
	vehiculo.id = vehicle.id;
	vehiculo.nombre = vehicle.name;
	vehiculo.modelo = vehicle.model;
	vehiculo.clase_vehiculo = vehicle.vehicle_class;
	vehiculo.fabricante = vehicle.manufacturer;
	vehiculo.longitud = vehicle.length;
	vehiculo.costo_en_creditos = vehicle.cost_in_credits;
	vehiculo.tripulacion = vehicle.crew;
	vehiculo.pasajeros = vehicle.passengers;
	vehiculo.velocidad_maxima_atmosfera = vehicle.max_atmosphering_speed;
	vehiculo.capacidad_maxima = vehicle.cargo_capacity;
	vehiculo.consumibles = vehicle.consumables;
	vehiculo.peliculas = vehicle.films;
	vehiculo.pilotos = vehicle.pilots;
	vehiculo.url_vehiculo = vehicle.url;
	
	return vehiculo;
};

function convertirRequestBodyToVehiculo (requestBody){
	let vehiculo = {};
	
	vehiculo.id = requestBody.id;
	vehiculo.nombre = requestBody.nombre;
	vehiculo.modelo = requestBody.modelo;
	vehiculo.clase_vehiculo = requestBody.clase_vehiculo;
	vehiculo.fabricante = requestBody.fabricante;
	vehiculo.longitud = requestBody.longitud;
	vehiculo.costo_en_creditos = requestBody.costo_en_creditos;
	vehiculo.tripulacion = requestBody.tripulacion;
	vehiculo.pasajeros = requestBody.pasajeros;
	vehiculo.velocidad_maxima_atmosfera = requestBody.velocidad_maxima_atmosfera;
	vehiculo.capacidad_maxima = requestBody.capacidad_maxima;
	vehiculo.consumibles = requestBody.consumibles;
	vehiculo.peliculas = requestBody.peliculas;
	vehiculo.pilotos = requestBody.pilotos;
	vehiculo.url_vehiculo = requestBody.url_vehiculo;
	return vehiculo;
};

function validar(vehiculo){
	if (typeof vehiculo.id !== 'string' ||
		typeof vehiculo.nombre !== 'string' ||	
		typeof vehiculo.modelo !== 'string' || 
		typeof vehiculo.clase_vehiculo !== 'string' ||
		typeof vehiculo.fabricante !== 'string' ||
		typeof vehiculo.longitud !== 'string' ||
		typeof vehiculo.costo_en_creditos !== 'string' ||
		typeof vehiculo.tripulacion !== 'string' ||
		typeof vehiculo.pasajeros !== 'string' ||
		typeof vehiculo.velocidad_maxima_atmosfera !== 'string' ||
		typeof vehiculo.capacidad_maxima !== 'string' ||
		typeof vehiculo.consumibles !== 'string' ||
		typeof vehiculo.url_vehiculo !== 'string' ||
		!Array.isArray(vehiculo.peliculas) ||
		!Array.isArray(vehiculo.pilotos)
	){
		console.error('Fallo al validar el vehiculo');
		return;
	}
	return vehiculo;
};

async function encontrarTodos () {
	const parametros = {
        TableName: process.env.TABLA_VEHICULO,
        ProjectionExpression: "id, nombre, modelo, clase_vehiculo, fabricante, longitud, costo_en_creditos, tripulacion, pasajeros, velocidad_maxima_atmosfera, capacidad_maxima, consumibles, peliculas, pilotos, url_vehiculo, creado, editado"
    };

    let resultado = await dynamoDb.scan(parametros).promise();
	return resultado.Items;
};

async function encontrarPorId (_id) {
	const parametros = {
		TableName: process.env.TABLA_VEHICULO,
		Key: {
			id: _id,
		}
	};
	let resultado = await dynamoDb.get(parametros).promise();
	return resultado.Item;
};

async function guardar(vehiculo){
	const timestamp = new Date().getTime();
	
	vehiculo.creado = timestamp;
	vehiculo.editado = timestamp;
	
	const parametros = {
		TableName: process.env.TABLA_VEHICULO,
		Item: vehiculo,
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