export default class SeedService {

    constructor() {}

    toHexString(byteArray) {
        return Array.prototype.map.call(byteArray, function(byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    }
    toByteArray(hexString) {
        var result = [];
        for (var i = 0; i < hexString.length; i += 2) {
            // @ts-ignore
            result.push(parseInt(hexString.substr(i, 2), 16));
        }
        return result;
    }
}
