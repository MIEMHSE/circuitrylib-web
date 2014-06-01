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
            if (!indexPanel.getSelectionModel().hasSelection()) {
                Ext.MessageBox.alert('CircuitryLib', 'Необходимо выбрать устройство из списка.');
                return;
            }
            if (!adaptersCombobox.value) {
                Ext.MessageBox.alert('CircuitryLib', 'Необходимо выбрать адаптер для обработки устройства.');
                return;
            }
            var adaptersRec = adaptersCombobox.findRecordByValue(adaptersCombobox.value),
                devicesRec = indexPanel.getSelectionModel().getSelection()[0],
                currentDeviceSettings = deviceSettings[devicesRec.get('fullclassname')],
                contenttype = adaptersRec.get('contenttype');

            if (!currentDeviceSettings || !currentDeviceSettings.output_signals) {
                Ext.MessageBox.alert('CircuitryLib', 'Необходимо настроить сигналы устройства.');
                return;
            }

            var getItems = {
                device_libname: devicesRec.get('libname'),
                device_classname: devicesRec.get('classname'),
                adapter_libname: adaptersRec.get('libname'),
                adapter_classname: adaptersRec.get('classname')
            };

            for (var signals_value in currentDeviceSettings) {
                if (currentDeviceSettings.hasOwnProperty(signals_value)) {
                    getItems[signals_value] = currentDeviceSettings[signals_value];
                }
            }

            var showResultWindow = function(contenttype, value) {
                var windowProperties = {
                    title : 'CircuitryLib',
                    width : 600,
                    height: 400,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        padding: 10
                    }
                };
                windowProperties['items'] = [
                    {
                        xtype: 'label',
                        text: 'Результат обработки:',
                        margin: '0 0 5 0'
                    },
                ];
                if (contenttype == 'text/plain') {
                    windowProperties['items'].push({
                        xtype: 'textarea',
                        value: value,
                        flex: 1
                    });
                } else if (contenttype == 'image/png') {
                    windowProperties['items'].push({
                        xtype: 'image',
                        src: value,
                        flex: 1
                    })
                }
                var resultWindow = Ext.create("Ext.Window", windowProperties).show();
            };

            var queryAddressList = [],
                queryAddress = '/handle?';
            for (var item in getItems) {
                if (getItems.hasOwnProperty(item)) {
                    queryAddressList.push(encodeURIComponent(item) + '=' + encodeURIComponent(getItems[item]));
                }
            }
            queryAddress += queryAddressList.join('&');

            if (contenttype == 'text/plain') {
                Ext.Ajax.request({
                   url: queryAddress,
                   method: 'GET',
                   extraParams: getItems,
                   success: function(response, opts) {
                      showResultWindow(contenttype, response.responseText);
                   },
                   failure: function(response, opts) {
                      Ext.MessageBox.alert('CircuitryLib', 'Произошла ошибка при обработке данных.');
                   }
                });
            } else if (contenttype == 'image/png') {
                showResultWindow(contenttype, queryAddress);
            }
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