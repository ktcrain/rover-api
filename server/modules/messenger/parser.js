const util = require('util');
const Message = require('./Message');

module.exports = class Parser {

    // constructor() {}

    parse(message) {

        const defaultMessage = new Message().body;
      
        let parsedMsg;
      
        try {
          parsedMsg = Object.assign(defaultMessage, JSON.parse(message));
          console.log('received: %s', util.inspect(parsedMsg, {showHidden: false, depth: null}));  
        }
        catch(jsonError) {
          console.log(jsonError);
          console.log('received (non-json): %s', message);
          parsedMsg = Object.assign(defaultMessage, { body: message });
         }
      
         return parsedMsg;
      }
}