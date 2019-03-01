module.exports = class Message {
    constructor() {
        this.body = {
            ct: null, // clientType
            u: null, // username
            i: null, // input
            b: null, // message body
        }
    }
}