'use strict';

module.exports.guardar = (event, context, callback) => {
  callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Se agrego la persona`
        })
  });
};
