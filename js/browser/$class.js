"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class $Class extends base_1.Base {
    $(selector) {
        return new Proxy(this, {
            get: (browser, command, r) => {
                if (typeof browser[command] === 'function' && $Class._$List.includes(command)) {
                    return async (...args) => {
                        if (typeof selector === 'string')
                            selector = await this._.element(selector);
                        return browser[command](selector, ...args);
                    };
                }
            }
        });
    }
}
$Class._$List = [
    'script', 'scriptAll', 'scriptAllAsync', 'scriptAsync', 'html', 'text', 'tagName', 'attr', 'prop', 'css',
    'classList', 'size', 'location', 'locationInView', 'keys', 'type', 'clear', 'empty', 'submit', 'check',
    'uncheck', 'uploadFile', 'select', 'unselect', 'form', 'click', 'mouseMoveTo', 'mouseClickTo', 'isExists',
    'isSelected', 'isEnabled', 'isFocused', 'isReadonly', 'isVisible', 'hasText', 'hasClass', 'hasAttribute'
];
exports.$Class = $Class;
