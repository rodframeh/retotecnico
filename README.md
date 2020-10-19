# Reto Técnico
## Herramientas
- Node.js, Serverless Framework, AWS Lambda, AWS Dynamo, Git, GitHub.
## Flujo integración

![](C:\Users\Jimena\Desktop\retotecnico\flujo-integracion.JPG)

## Pasos
1. Crear repositorio y rama developer en github y clonar en la maquina local.
2. Se accede a la carpeta con el nombre del proyecto.
3. Se cambia a la rama `developer`.
4. Se crea el proyecto con el framework serverless basado en un template aws `sls create --template aws-nodejs --path servicio-X --name X`.
5. Se accede al proyecto y se configura el nuevo paquete npm con `npm init -y`.
6. Se requiere instalar el paquete aws-sdk `npm install --save aws-sdk`, es el AWS SDK para javascript.
7. Se requiere instalar el paquete aws-sdk `npm install --save bluebird`, es una biblioteca para manejar los promises.
8. Se requiere instalar el paquete swapi-node `npm install --save swapi-node`, es una biblioteca que nos permite obtener recursos de SWAPI.
9. Se exportan las variables siguientes variables, para que serverless framework pueda tener acceso a desplegar el proyecto.
9.1. Se exportan la variable `export AWS_ACCESS_KEY_ID=<VALOR>`.
9.2. Se exportan la variable `export AWS_SECRET_ACCESS_KEY=<VALOR>`.
10. Se despliega y prueba el proyecto con `sls deploy`.