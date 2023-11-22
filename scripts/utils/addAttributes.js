// Adding attributes
function addingAtributes(element, attributes) {
    for (const key in attributes) {
        // eslint-disable-next-line no-prototype-builtins
        if (attributes.hasOwnProperty(key)) {
            element.setAttribute(key, attributes[key]);
        }
    }
}

export { addingAtributes };
