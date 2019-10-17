; (function () {

    var host = window.location.host;

    var nativeDispatcher = {
        callbacks: {},

        send: function (envelope) {
            this.dispatchMessage("event", envelope);
        },

        // `type` can either be "event" or "callback"
        dispatchMessage: function (type, envelope) {

            var src = "kwebtonative://" + type + "/?" + encodeURIComponent(JSON.stringify(envelope));
            var iframe = document.createElement("iframe");
            iframe.setAttribute("src", src);
            document.documentElement.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe = null;
        }
    };

    var KWebToNative = {
        listeners: {},

        dispatchers: [],

        targetDomain: '*',

        targetWindow: window.parent,

        on: function (type, fn) {
            if (!this.listeners.hasOwnProperty(type) || !this.listeners[type] instanceof Array) {
                this.listeners[type] = [];
            }

            this.listeners[type].push(fn);
        },

        off: function (type) {
            if (!this.listeners.hasOwnProperty(type) || !this.listeners[type] instanceof Array) {
                this.listeners[type] = [];
            }

            this.listeners[type] = [];
        },

        send: function (type, payload) {

            payload = payload || {};

            var envelope = this.createEnvelope(type, payload);

            this.dispatchers.forEach(function (dispatcher) {
                dispatcher.send(envelope);
            });

        },

        // Called by the native application when events are sent to JS from the app.
        // Will execute every function, FIFO order, that was attached to this event type.
        trigger: function (type, json) {
            var self = this;

            var listenerList = this.listeners[type] || [];

            for (var index = 0; index < listenerList.length; index++) {
                var listener = listenerList[index];
                listener(json);
            }

        },

        createEnvelope: function (type, payload) {
            return {
                type: type,
                payload: payload
            };
        }
    };

    // Dispatcher detection. Currently only supports iOS.
    // Looking for equivalent Android implementation.
    var i = 0,
        iOS = false,
        iDevice = ['iPad', 'iPhone', 'iPod'];

    for (; i < iDevice.length; i++) {
        if (navigator.platform.indexOf(iDevice[i]) >= 0) {
            iOS = true;
            break;
        }
    }

    var UIWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
    var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;

    if ((iOS && UIWebView) || isAndroid) {
        KWebToNative.dispatchers.push(nativeDispatcher);
    }
    window.KWebToNative = KWebToNative;
})();