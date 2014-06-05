/*
 * CircuitryLib: Common objects
 * @author Sergey Sobko
 * @email: S.Sobko@profitware.ru
 */

Ext.onReady(function () {

    Ext.define('CircuitryLib.Functions', {
        statics: {
            localize: function(text) {
                var strings = this.strings;
                if (strings.hasOwnProperty(text)) {
                    return strings[text];
                }
                return text;
            },
            strings: {
                'Decrement device': 'Декремент'
            }
        }

    });

});