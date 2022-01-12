const filterObject = (object, ...allowedFields) => {
    const newObject = {}
    Object.keys(object).forEach(item => {
        if (allowedFields.includes(item)) newObject[item] = object[item]
    })
    return newObject
}

module.exports = filterObject