// Adding attributes
function addingAtributes(element, attributes) {
    for (let key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            element.setAttribute(key, attributes[key]);
        }
    }
}

export { addingAtributes };