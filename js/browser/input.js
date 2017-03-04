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
            const id = await this.elementId(selector);
            await this.webdriver.keysElement({ value, id });
            await this.sleep(pause || this.options.pause.keys);
            if (submit)
                await this.submit({ ELEMENT: id }, submitPause);
            return;
        }
        return this.webdriver.keys({ value });
    }
    async type(selector, ...keys) {
        const el = await this.element(selector);
        await this.empty(el);
        return this.keys(el, ...keys);
    }
    sendKeys(...keys) {
        return this.keys(null, ...keys);
    }
    hotkeys(...keys) {
        return this.keys(null, '\uE000', ...keys, '\uE000');
    }
    async clear(selector) {
        return this.webdriver.clear({ id: await this.elementId(selector) });
    }
    async empty(selector) {
        const id = await this.elementId(selector);
        try {
            await this.webdriver.clear({ id });
        }
        catch (err) {
            if (err.statusCode == 12) {
                await this.script({ ELEMENT: id }, (el) => {
                    el.innerHTML = '';
                });
            }
            else {
                throw err;
            }
        }
    }
    async submit(selector, pause) {
        await this.webdriver.submit({ id: await this.elementId(selector) });
        await this.sleep(pause || this.options.pause.submit);
    }
    async check(checkbox, pause) {
        const id = await this.elementId(checkbox);
        if (!(await this.webdriver.isElementSelected({ id }))) {
            await this.click({ ELEMENT: id }, pause);
            return true;
        }
        return false;
    }
    async uncheck(checkbox, pause) {
        const id = await this.elementId(checkbox);
        if (await this.webdriver.isElementSelected({ id })) {
            await this.click({ ELEMENT: id }, pause);
            return true;
        }
        return false;
    }
    async uploadFile(input_file, filePath, pause) {
        await this.webdriver.keysElement({ id: await this.elementId(input_file), value: [filePath] });
        await this.sleep(pause || this.options.pause.upload);
    }
    select(select, option, submit, pause) {
        return this.selectUnselect(true, select, option, submit, pause);
    }
    unselect(select, option, submit, pause) {
        return this.selectUnselect(false, select, option, submit, pause);
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
                const els = await this.elements('option', select);
                el = els[option];
            }
            else if (typeof option === 'string') {
                el = await this.element(`option[value="${option}"]`, select);
            }
            else {
                let attrs = '';
                for (const [attr, value] of Object.entries(option)) {
                    attrs += `[${attr}="${value}"]`;
                }
                el = await this.element(`option${attrs}`, select);
            }
            if (check) {
                await this.check(el, pause);
            }
            else {
                await this.uncheck(el, pause);
            }
        }
        if (submit)
            await this.submit(el, submitPause);
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
        form = await this.element(form);
        for (const [name, value] of Object.entries(inputs)) {
            let els = await this.elements(`[name="${name}"]`, form);
            if (!els[0]) {
                els = await this.elements(`[id="${name}"]`, form);
            }
            const el = els[0];
            const type = await this.attr(el, 'type');
            if (['button', 'image', 'reset', 'submit'].includes(type)) {
                if (value)
                    await this.click(el, pause);
            }
            else if (type === 'radio') {
                for (let el of els) {
                    const val = await this.attr(el, 'value');
                    if (val == value) {
                        await this.check(el, pause);
                        break;
                    }
                }
            }
            else if (type === 'checkbox') {
                if (value)
                    await this.check(el, pause);
                else
                    await this.uncheck(el, pause);
            }
            else if (type === 'file') {
                await this.uploadFile(el, value, pause);
            }
            else if (type === 'hidden') {
                await this.script(el, (el, val) => el.setAttribute('value', val), value);
            }
            else {
                const tag = await this.tagName(el);
                if (tag === 'select') {
                    await this.select(el, value, pause);
                }
                else {
                    await this.type(el, value, pause);
                }
            }
        }
        if (submit)
            await this.submit(form, submitPause);
    }
}
exports.Input = Input;
