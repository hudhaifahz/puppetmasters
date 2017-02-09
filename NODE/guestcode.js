module.exports = function () {
    var math = require('mathjs')
    var code = "";
    var dictionary = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < 5; i++ )
        code += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
    return code;
}
