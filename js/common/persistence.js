/**
 * persistence.js
 *
 * Copyright (c) 2014 Dvubuz Games
 *
 */

(function Persistence(w)) {

    var ls = w.localStorage;
    var enabled = !!ls;

    var _instance = {
        /**
         * Constants
         */
        _KEY: "psidata",
        SOUND: "sound",
        MUSIC: "music",

        /**
         * Private
         */
        _autocommit: false,

        _data: null,

        init: function() {
            if (!enabled) {
                this.reset();
                return;
            }

            this.data = ls[_KEY];
            if (!this.data) {
                this.reset();
            }
        },

        reset: function() {
            this.data = {
                // defaults ?
            };
        },

        get: function(key, defValue) {
            var value = this.data[key];
            return value !== null ? value : defValue;
        },

        set: function(key, value) {
            if (!enabled) return;

            this.data[key] = value;
            
            if (this._autocommit)
                this.commit();

            return this;
        },

        commit: function() {
            if (!enabled) return;

            ls.setItem(this._KEY, JSON.stringify(this.data));
            return this;
        }
    };
    Object.defineProperty(_instance, 'autoCommit', {
        get: function() { return _instance._autocommit; },
        set: function(autoCommit) { _instance._autocommit = autoCommit; }
    }); 
    w.persistence = _instance;
}(window);