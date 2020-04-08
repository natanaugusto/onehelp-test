'use strict';

const jsonp = object => {
  if (Array.isArray(object)) {
    const origem = object;
    object = [];
    origem.forEach(item => {
      object.push(convert(item));
    });
  } else {
    convert(object);
  }
  return object;
};

const convert = object => {
  let id;
  if (object.hasOwnProperty('_id')) {
    id = object._id.toString();
  }
  object = JSON.parse(JSON.stringify(object));
  if (id) {
    object.id = id;
  }
  return object;
};

module.exports = jsonp;
