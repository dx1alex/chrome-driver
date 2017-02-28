"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const base_1 = require("./base");
class Input extends base_1.Base {
    async keys(selector, ...keys) {
        let value = [];
        let submit, pause = 0, submitPause = 0;
        for (let key of keys) {
            if (typeof key !== 'boolean' && typeof key !== 'number') {
                value.push(typeof key === 'string' ? key : key.map(helpers_1.checkUnicode).join());
            }
            else if (typeof key === 'boolean') {
                submit = key;
            }
            else if (typeof key === 'number') {
                if (submit)
                    submitPause = key;
                else
                    pause = typeof submit === 'boolean' ? pause : key;
            }
        }
        if (selector) {
            const id = await this._.elementId(selector);
            await this.webdriver.keysElement({ value, id });
            await this._.sleep(pause || this.options.pause.keys);
            if (submit)
                await this._.submit({ ELEMENT: id }, submitPause);
            return;
        }
        return this.webdriver.keys({ value });
    }
    async type(selector, ...keys) {
        const el = await this._.element(selector);
        await this._.empty(el);
        return this._.keys(el, ...keys);
    }
    sendKeys(...keys) {
        return this._.keys(null, ...keys);
    }
    hotkeys(...keys) {
        return this._.keys(null, '\uE000', ...keys, '\uE000');
    }
    async clear(selector) {
        return this.webdriver.clear({ id: await this._.elementId(selector) });
    }
    async empty(selector) {
        const id = await this._.elementId(selector);
        try {
            await this.webdriver.clear({ id });
        }
        catch (err) {
            if (err.statusCode == 12) {
                await this._.script({ ELEMENT: id }, (el) => {
                    el.innerHTML = '';
                });
            }
            else {
                throw err;
            }
        }
    }
    async submit(selector, pause) {
        await this.webdriver.submit({ id: await this._.elementId(selector) });
        await this._.sleep(pause || this.options.pause.submit);
    }
    async check(checkbox, pause) {
        const id = await this._.elementId(checkbox);
        if (!(await this.webdriver.isElementSelected({ id }))) {
            await this._.click({ ELEMENT: id }, pause);
            return true;
        }
        return false;
    }
    async uncheck(checkbox, pause) {
        const id = await this._.elementId(checkbox);
        if (await this.webdriver.isElementSelected({ id })) {
            await this._.click({ ELEMENT: id }, pause);
            return true;
        }
        return false;
    }
    async uploadFile(input_file, filePath, pause) {
        await this.webdriver.keysElement({ id: await this._.elementId(input_file), value: [filePath] });
        await this._.sleep(pause || this.options.pause.upload);
    }
    select(select, option, submit, pause) {
        return this._.selectUnselect(true, select, option, submit, pause);
    }
    unselect(select, option, submit, pause) {
        return this._.selectUnselect(false, select, option, submit, pause);
    }
    async selectUnselect(check, select, option, ...submitAndPause) {
        let submit, pause = 0, submitPause = 0;
        for (let val of submitAndPause) {
            if (typeof val === 'boolean') {
                submit = val;
            }
            else if (typeof val === 'number') {
                if (submit)
                    submitPause = val;
                else
                    pause = typeof submit === 'boolean' ? pause : val;
            }
        }
        let el;
        const options = Array.isArray(option) ? option : [option];
        for (let option of options) {
            if (typeof option === 'number') {
                const els = await this._.elements('option', select);
                el = els[option];
            }
            else if (typeof option === 'string') {
                el = await this._.element(`option[value="${option}"]`, select);
            }
            else {
                let attrs = '';
                for (const [attr, value] of Object.entries(option)) {
                    attrs += `[${attr}="${value}"]`;
                }
                el = await this._.element(`option${attrs}`, select);
            }
            if (check) {
                await this._.check(el, pause);
            }
            else {
                await this._.uncheck(el, pause);
            }
        }
        if (submit)
            await this._.submit(el, submitPause);
    }
    async form(form, inputs, ...submitAndPause) {
        let submit, pause = 0, submitPause = 0;
        for (let val of submitAndPause) {
            if (typeof val === 'boolean') {
                submit = val;
            }
            else if (typeof val === 'number') {
                if (submit)
                    submitPause = val;
                else
                    pause = typeof submit === 'boolean' ? pause : val;
            }
        }
        form = await this._.element(form);
        for (const [name, value] of Object.entries(inputs)) {
            let els = await this._.elements(`[name="${name}"]`, form);
            if (!els[0]) {
                els = await this._.elements(`[id="${name}"]`, form);
            }
            const el = els[0];
            const type = await this._.attr(el, 'type');
            if (['button', 'image', 'reset', 'submit'].includes(type)) {
                if (value)
                    await this._.click(el, pause);
            }
            else if (type === 'radio') {
                for (let el of els) {
                    const val = await this._.attr(el, 'value');
                    if (val == value) {
                        await this._.check(el, pause);
                        break;
                    }
                }
            }
            else if (type === 'checkbox') {
                if (value)
                    await this._.check(el, pause);
                else
                    await this._.uncheck(el, pause);
            }
            else if (type === 'file') {
                await this._.uploadFile(el, value, pause);
            }
            else if (type === 'hidden') {
                await this._.script(el, (el, val) => el.setAttribute('value', val), value);
            }
            else {
                const tag = await this._.tagName(el);
                if (tag === 'select') {
                    await this._.select(el, value, pause);
                }
                else {
                    await this._.type(el, value, pause);
                }
            }
        }
        if (submit)
            await this._.submit(form, submitPause);
    }
}
exports.Input = Input;
