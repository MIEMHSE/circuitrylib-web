/*
 * CircuitryLib: Common objects
 * @author Sergey Sobko
 * @email: S.Sobko@profitware.ru
 */

Ext.onReady(function () {

    // CircuitryLib model
    Ext.define('circuitrylibModel', {
        extend: 'Ext.data.Model',
        fields: [
            {
                name: 'libname',
                type: 'string'
            },
            {
                name: 'classname',
                type: 'string'
            },
            {
                name: 'fullclassname',
                convert : function (v, rec) {
                    return rec.get('libname') + '.' + rec.get('classname');
                }
            },
            {
                name: 'docstring',
                type: 'string',
                mapping: 'info.__doc__'
            },
            {
                name: 'signals',
                type: 'string',
                mapping: 'info.mandatory_signals'
            },
            {
                name: 'constraints',
                mapping: 'info.constraints'
            }
        ]
    });

    // Adapters
    var adaptersStore = Ext.create('Ext.data.Store', {
        model: 'circuitrylibModel',
        proxy: {
            type: 'ajax',
            url: '/description.json',
            reader: {
                type: 'json',
                root: 'adapters'
            }
        },
        autoLoad: true,
        storeId: 'adaptersStore'
    });

    // Devices
    var devicesStore = Ext.create('Ext.data.Store', {
        model: 'circuitrylibModel',
        proxy: {
            type: 'ajax',
            url: '/description.json',
            reader: {
                type: 'json',
                root: 'devices'
            }
        },
        autoLoad: true,
        storeId: 'devicesStore',
        sortOnLoad: true,
        sorters: { property: 'libname', direction : 'ASC' }
    });

    // Main common toolbar menu
    Ext.create('Ext.toolbar.Toolbar', {
        items: [
            {
                text: 'Главная',
                handler: function () {
                    window.location.href = '/';
                }
            }
        ],
        margin: '0 0 5 0',
        id: 'mainToolbar'
    });

});