"use strict";
const fs = require("fs");
const URL = require("url");
const http = require("http");
const https = require("https");
const commands_1 = require("./commands");
class Webdriver {
    constructor(options) {
        this.sessionId = '';
        this.options = typeof options === 'string' ? { url: options } : Object.assign({}, options);
        this.options.url = this.options.url.replace(/\/+$/, '');
        if (this.options.debug === true) {
            this.debug = {
                logId: '' + process.pid,
                stdout: process.stdout,
                stderr: process.stderr
            };
        }
        else if (this.options.debug) {
            this.debug = Object.assign({}, this.options.debug);
            this.debug.logId = this.debug.logId || '' + process.pid;
            if (this.debug.stdout) {
                this.debug.stdout = typeof this.debug.stdout === 'string'
                    ? fs.createWriteStream(this.debug.stdout, { flags: 'a' }) : this.debug.stdout;
            }
            else if (this.debug.stdout !== false) {
                this.debug.stdout = process.stdout;
            }
            if (this.debug.stderr) {
                this.debug.stderr = typeof this.debug.stderr === 'string'
                    ? fs.createWriteStream(this.debug.stderr, { flags: 'a' }) : this.debug.stderr;
            }
            else if (this.debug.stderr !== false) {
                this.debug.stderr = this.debug.stdout || process.stdout;
            }
        }
        for (let command of Object.keys(commands_1.default)) {
            this[command] = (data) => {
                let path = commands_1.default[command][1];
                path = path.replace(/:([a-zA-Z_$]+)/g, (m, p) => {
                    if (p === 'sessionId') {
                        if (!this.sessionId)
                            throw new Error(`No set sessionId`);
                        return this.sessionId;
                    }
                    if (!(p in data))
                        throw new TypeError(`Invalid argument ${p} from ${command}`);
                    return data[p];
                });
                let postData = {};
                if (commands_1.default[command][2]) {
                    for (let p of commands_1.default[command][2]) {
                        if (p in data)
                            postData[p] = data[p];
                    }
                }
                return this._requestHandler(command, commands_1.default[command][0], path, Object.keys(postData).length ? postData : undefined);
            };
        }
    }
    async initSession(capabilities) {
        const options = URL.parse(this.options.url + '/session');
        options.method = 'POST';
        const result = await this.request(options, JSON.stringify(capabilities));
        this.sessionId = result.sessionId;
        return result;
    }
    request(options, postData) {
        return new Promise((resolve, reject) => {
            if (options.method == 'POST' && postData) {
                if (!options.headers)
                    options.headers = {};
                Object.assign(options.headers, {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Content-Length': Buffer.byteLength(postData, 'utf8')
                });
            }
            const _request = options.protocol === 'https:' ? https.request : http.request;
            const req = _request(options, res => {
                let data = '';
                res.setEncoding('utf8');
                res.on('data', chunk => { data += chunk; });
                res.on('end', () => {
                    if (res.statusCode != 200) {
                        let err = new Error(`${data}`);
                        err['statusCode'] = res.statusCode;
                        return reject(err);
                    }
                    const result = JSON.parse(data);
                    if (result.status) {
                        let err = new Error(`${result.value.message}`);
                        err['statusCode'] = result.status;
                        return reject(err);
                    }
                    resolve(result);
                });
            });
            req.on('error', reject);
            if (options.method === 'POST' && postData) {
                req.write(postData);
            }
            req.end();
        });
    }
    writeLog(data) {
        if (!this.debug || this.debug.disableLog)
            return;
        const out = data.status != 'ERROR' ? this.debug.stdout : this.debug.stderr;
        if (!out)
            return;
        const log = this.formatLog(data);
        out.write(log);
    }
    formatLog(data) {
        if (this.debug.format)
            return this.debug.format(this.debug.logId, data);
        return `[${data.status}] ${getDateTime()} ${this.debug.logId} (${data.command})
REQUEST: ${data.method} ${data.url} ${!data.postData ? '' : '\n' + data.postData}
RESPONSE: ${data.statusCode}
${data.data}\n\n`;
    }
    async _requestHandler(command, method, path, postData) {
        const url = this.options.url + path;
        const options = URL.parse(url);
        options.method = method;
        Object.assign(options, this.options, options);
        try {
            const data = await this.request(options, postData ? JSON.stringify(postData) : undefined);
            this.writeLog({
                status: 'INFO',
                command,
                method,
                url,
                postData: postData ? JSON.stringify(postData) : undefined,
                statusCode: 200,
                data: JSON.stringify(data)
            });
            return data.value;
        }
        catch (err) {
            if (err.statusCode) {
                this.writeLog({
                    status: 'ERROR',
                    command,
                    method,
                    url,
                    postData: postData ? JSON.stringify(postData) : undefined,
                    statusCode: err.statusCode,
                    data: err.message
                });
            }
            throw err;
        }
    }
}
exports.Webdriver = Webdriver;
function getDateTime() {
    const d = new Date();
    return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)} `
        + `${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}:${('0' + d.getSeconds()).slice(-2)}.${(d.getMilliseconds())}`;
}
