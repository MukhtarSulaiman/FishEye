// Adding attributes
function addingAtributes(element, attributes) {
    for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            element.setAttribute(key, attributes[key]);
        }
    }
}

export { addingAtributes };
