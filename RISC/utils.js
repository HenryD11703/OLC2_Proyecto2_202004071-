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

export const stringToBytes = (str) => { // String to 1 byte array
    const resultado = []
    let elementIndex = 0

    while (elementIndex < str.length) {
        resultado.push(str.charCodeAt(elementIndex))
        elementIndex++
    }
    resultado.push(0)
    return resultado;
}

export const numberToFloatingPoint = (number) => { // Number to 32 bit array
    const buffer = new ArrayBuffer(4);
    const float32 = new Float32Array(buffer);
    float32[0] = number;
    const uint32 = new Uint32Array(buffer);
    const integer = uint32[0];
    const hexRepresentation = integer.toString(16);
    return '0x' + hexRepresentation;
}