/*
 * CircuitryLib: Russian localization
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
                'Ones\' complement to two\'s complement device': 'Преобразователь из обратного в дополнительный код',
                'Two\'s complement to ones\' complement device': 'Преобразователь из дополнительного в обратный код',
                'Adder device': 'Полный сумматор в дополнительном коде',
                'Decrement device': 'Устройство декремента',
                'Increment device': 'Устройство инкремента',
                'Negation for two\'s complement': 'Отрицание в дополнительном коде',
                'Digital comparator device': 'Цифровой компаратор',
                'Equality device': 'Поразрядная эквиваленция',
                'Demultiplexer device': 'Демультиплексор',
                'Multiplexer device': 'Мультиплексор',
                'Logic AND gate': 'Вентиль логического И',
                'Logic NOT gate': 'Вентиль логического НЕ',
                'Logic OR gate': 'Вентиль логического ИЛИ',
                'NOOP device': 'Пустое устройство',

                'first_signals': 'Входы первого операнда (first_signals)',
                'second_signals': 'Входы второго операнда (second_signals)',
                'data_signals': 'Входы данных (data_signals)',
                'address_signals': 'Адресные входы (address_signals)',
                'output_signals': 'Выходы (output_signals)',
                'strobe_signals': 'Строб-сигналы (strobe_signals)',

                'Device settings': 'Настройки устройства',
                'Save settings': 'Сохранить настройки устройства',

                'Choose Device from grid.': 'Необходимо выбрать устройство из списка.',
                'Choose Adapter from list.': 'Необходимо выбрать адаптер для обработки устройства.',
                'Set up chosen Device.': 'Необходимо настроить сигналы устройства.',
                'An error occured during processing.': 'Произошла ошибка при обработке данных.',

                'Process': 'Обработка',
                'Processing result:': 'Результат обработки:',
                'Adapter to process chosen Device': 'Адаптер для обработки устройства',
                'Device library name': 'Имя библиотеки устройства',
                'Device class name': 'Имя класса устройства',
                'Device description': 'Описание устройства',
                'Available Devices': 'Доступные устройства'
            }
        }

    });

});