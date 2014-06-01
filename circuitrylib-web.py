#!/usr/bin/env python
# -*- coding: utf-8 -*-

__author__ = 'Sergey Sobko'
__email__ = 'S.Sobko@profitware.ru'
__copyright__ = 'Copyright 2014, The Profitware Group'

import json

from flask import Flask, jsonify, render_template, request, Response, send_file
from circuitry import self_describe

app = Flask(__name__)

description = self_describe(description_type='dict')

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/description.json')
def describe():
    return jsonify(**description)


@app.route('/handle')
def handle():
    device_libname, device_classname = map(request.args.get, ['device_libname', 'device_classname'])
    adapter_libname, adapter_classname = map(request.args.get, ['adapter_libname', 'adapter_classname'])
    content_type = 'text/plain'
    imported_device_library, imported_adapter_library = None, None

    if device_classname and device_libname:
        for device in description['devices']:
            if device['libname'] == device_libname and device['classname'] == device_classname:
                imported_device_library = __import__(device_libname, globals(), locals(), ['*'], -1)
                break

    if imported_device_library and adapter_classname and adapter_libname:
        for adapter in description['adapters']:
            if adapter['libname'] == adapter_libname and adapter['classname'] == adapter_classname:
                imported_adapter_library = __import__(adapter_libname, globals(), locals(), ['*'], -1)
                break

    if imported_device_library and imported_adapter_library:
        if device_classname in dir(imported_device_library):
            device_class = imported_device_library.__dict__.get(device_classname)
            mandatory_signals = device_class.mandatory_signals

            signals_dict = dict()
            signals_str_dict = dict()
            for signal in iter(mandatory_signals):
                got_signal = request.args.get(signal)
                if got_signal:
                    signals_dict[signal] = {
                        'signals_letter': signal[0] if signal != 'strobe_signals' else 'z',
                        'signals_count': int(got_signal)
                    }
                    signals_str_dict[signal] = '%(signals_letter)s:%(signals_count)d' % signals_dict[signal]

            if len(signals_dict) != len(mandatory_signals):
                raise Exception('Not all mandatory signals are filled')

            mandatory_signals_using_subs = device_class.mandatory_signals_using_subs
            if mandatory_signals_using_subs:
                for mandatory_signals_sub in mandatory_signals_using_subs:
                    s_dict = signals_dict[mandatory_signals_sub]
                    letter, count = s_dict['signals_letter'], s_dict['signals_count']
                    subs_dict = dict()
                    for i in range(0, count):
                        key_name = '%s%d' % (letter, i)
                        value = 1
                        subs_dict[key_name] = value

                    signals_str_dict['%s_subs' % mandatory_signals_sub] = subs_dict

            device_object = device_class(**signals_str_dict)
        else:
            raise Exception('Device class cannot be found in library')

        if adapter_classname in dir(imported_adapter_library):
            adapter_class = imported_adapter_library.__dict__.get(adapter_classname)
            content_type = adapter_class.default_content_type or content_type
            output = adapter_class(device_object).default_method()
        else:
            raise Exception('Adapter class cannot be found in library')

        if content_type != 'text/plain':
            return send_file(output, mimetype=content_type)

        return Response(output, content_type=content_type)

    raise Exception('Device or Adapter class cannot be found')


if __name__ == '__main__':
    app.run(debug=True)
