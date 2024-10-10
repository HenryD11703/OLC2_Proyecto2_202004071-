export const stringArray = (string) => { // String to 32 bit array
    const result = [];
    let elementIndex = 0;
    let intRepresentation = 0;
    let shift = 0;

    while (elementIndex < string.length) {
        intRepresentation |= string.charCodeAt(elementIndex) << shift;
        shift += 8;

        if (shift >= 32) {
            result.push(intRepresentation);
            intRepresentation = 0;
            shift = 0;
        }

        elementIndex++;
    }

    if (shift > 0) {
        result.push(intRepresentation);
    } else {
        result.push(0); // Null terminated string
    }

    return result;

}