/*
 * CircuitryLib: Index page
 * @author Sergey Sobko
 * @email: S.Sobko@profitware.ru
 */

Ext.onReady(function () {

    // Adapters combobox
    var adaptersCombobox = Ext.create('Ext.form.field.ComboBox', {
        store: Ext.getStore('adaptersStore'),
        displayField: 'classname',
        valueField: 'fullclassname',
        editable: false,
        forceSelection: true,
        queryMode: 'local',
        width: 300,
        listeners: {
            change: function (field, newValue) {
                field.setValue(newValue);
            }
        },
        id: 'adaptersCombobox'
    });

    var goButton = Ext.create('Ext.button.Button', {
        text: 'Обработка',
        handler: function () {
            Ext.MessageBox.alert('CircuitryLib', 'Необходимо выбрать устройство из списка.');
        }
    });

    var indexToolbar = Ext.create('Ext.toolbar.Toolbar', {
        items: [
            {
                xtype: 'label',
                text: 'Адаптер для обработки устройства',
                margin: '0 5 0 5'
            },
            adaptersCombobox,
            {
                xtype: 'tbfill'
            },
            goButton
        ],
        margin: '0 0 5 0'
    });

    // Create panel with two flexible columns using monitoring model
    var indexPanel = Ext.create('Ext.grid.Panel', {
        store: Ext.getStore('devicesStore'),
        columns: [
            {
                text: 'Имя библиотеки устройства',
                dataIndex: 'libname',
                flex: 1
            },
            {
                text: 'Имя класса устройства',
                dataIndex: 'classname',
                flex: 2
            },
            {
                text: 'Описание устройства',
                dataIndex: 'docstring',
                flex: 3
            }
        ],
        flex: 1,
        title: 'Доступные устройства'
    });

    // Main container for Index page
    Ext.create('Ext.container.Viewport', {
        items: [
            Ext.getCmp('mainToolbar'),
            indexToolbar,
            indexPanel
        ],
        renderTo: Ext.getBody(),
        layout: {
            type: 'vbox',
            align: 'stretch',
            padding: 10
        }
    });
});