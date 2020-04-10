const jsonp = (object: any) => {
  if (Array.isArray(object)) {
    const origem = object
    object = []
    origem.forEach(item => {
      object.push(convert(item))
    })
  } else {
    convert(object)
  }
  return object
}

const convert = (object: any) => {
  let id
  if (object.hasOwnProperty('_id')) {
    id = object._id.toString()
  }
  object = JSON.parse(JSON.stringify(object))
  if (id) {
    object.id = id
  }
  return object
}

export default jsonp
