/*
 * CircuitryLib: Index page
 * @author Sergey Sobko
 * @email: S.Sobko@profitware.ru
 */

Ext.onReady(function () {

    var deviceSettings = {};

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

    var settingsButton = Ext.create('Ext.button.Button', {
        text: 'Настройки устройства',
        handler: function () {
            if (indexPanel.getSelectionModel().hasSelection()) {
                var settingsWindow;

                var row = indexPanel.getSelectionModel().getSelection()[0],
                    constraints = row.get('constraints'),
                    fullclassname = row.get('fullclassname');

                if (!deviceSettings[fullclassname])
                    deviceSettings[fullclassname] = {};

                var toolbars = [],
                    numberInputs = {};

                for (var constraint in constraints) {
                    if (constraints.hasOwnProperty(constraint)) {

                        numberInputs[constraint] = Ext.create('Ext.form.NumberField', {
                            minValue: constraints[constraint].min,
                            maxValue: constraints[constraint].max,
                            value: deviceSettings[fullclassname][constraint] || constraints[constraint].min
                        });

                        toolbars.push(
                            Ext.create('Ext.toolbar.Toolbar', {
                                items: [
                                    {
                                        xtype: 'label',
                                        text: constraint,
                                        margin: '0 5 0 5'
                                    },
                                    {
                                        xtype: 'tbfill'
                                    },
                                    numberInputs[constraint]
                                ],
                                margin: '0 0 5 0'
                            })
                        );
                    }
                }

                toolbars.push(
                    Ext.create('Ext.toolbar.Toolbar', {
                        margin: '0 0 5 0',
                        flex: 1
                    })
                );

                toolbars.push(
                    Ext.create('Ext.toolbar.Toolbar', {
                        items: [
                            {
                                xtype: 'tbfill'
                            },
                            {
                                xtype: 'button',
                                text: 'Сохранить настройки устройства',
                                handler: function() {
                                    for (var constraint in constraints) {
                                        if (constraints.hasOwnProperty(constraint)) {
                                            deviceSettings[fullclassname][constraint] = numberInputs[constraint].getValue();
                                        }
                                    }
                                    settingsWindow.close();
                                }
                            }
                        ],
                        margin: '0 0 5 0'
                    })
                );

                settingsWindow = Ext.create("Ext.Window", {
                    title : 'CircuitryLib',
                    width : 400,
                    height: 250,
                    items: toolbars,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        padding: 10
                    }
                }).show();

            } else {
                Ext.MessageBox.alert('CircuitryLib', 'Необходимо выбрать устройство из списка.');
            }
        }
    });

    var goButton = Ext.create('Ext.button.Button', {
        text: 'Обработка',
        handler: function () {
            Ext.MessageBox.alert('CircuitryLib', 'Необходимо выбрать устройство из списка.');
        }
    });

    var indexToolbar = Ext.create('Ext.toolbar.Toolbar', {
        items: [
            settingsButton,
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