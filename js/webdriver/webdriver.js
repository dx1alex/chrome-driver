"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const URL = require("url");
const http = require("http");
const https = require("https");
const commands_1 = require("./commands");
const helpers_1 = require("../helpers");
class Webdriver {
    constructor(options) {
        this.sessionId = '';
        this.options = typeof options === 'string' ? { remote: options } : Object.assign({}, options);
        this.options.remote = this.options.remote.replace(/\/+$/, '');
        if (this.options.log && typeof this.options.log !== 'object') {
            this.logStream = typeof this.options.log === 'boolean'
                ? process.stdout
                : fs.createWriteStream(this.options.log, { flags: 'a' });
        }
        else {
            this.logStream = this.options.log;
        }
        for (const command of Object.keys(commands_1.default)) {
            Webdriver.prototype[command] = (data) => {
                let path = commands_1.default[command][1];
                path = path.replace(/:([a-zA-Z_$]+)/g, (m, p) => {
                    if (p === 'sessionId') {
                        if (data && 'sessionId' in data) {
                            return data['sessionId'];
                        }
                        if (!this.sessionId) {
                            throw new Error(`No set sessionId`);
                        }
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
                return this._requestHandler(command, commands_1.default[command][0], path, Object.keys(postData).length ? postData : void 0);
            };
        }
    }
    async initSession(capabilities) {
        const options = URL.parse(this.options.remote + '/session');
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
    async _requestHandler(command, method, path, postData) {
        const url = this.options.remote + path;
        const options = URL.parse(url);
        options.method = method;
        Object.assign(options, this.options, options);
        const timeStart = Date.now();
        try {
            const data = await this.request(options, postData ? JSON.stringify(postData) : void 0);
            if (this.logStream) {
                const timeEnd = Date.now();
                writeLog(this.logStream, {
                    status: 'OK',
                    statusCode: 200,
                    date: timeStart,
                    command,
                    method,
                    url,
                    postData: postData ? JSON.stringify(postData) : void 0,
                    data: JSON.stringify(data),
                    time: (timeEnd - timeStart),
                });
            }
            return data.value;
        }
        catch (err) {
            if (this.logStream) {
                const timeEnd = Date.now();
                writeLog(this.logStream, {
                    status: 'ERROR',
                    statusCode: err.statusCode,
                    date: timeStart,
                    command,
                    method,
                    url,
                    postData: postData ? JSON.stringify(postData) : void 0,
                    data: err.message,
                    time: (timeEnd - timeStart),
                });
            }
            throw err;
        }
    }
}
exports.Webdriver = Webdriver;
function writeLog(out, data) {
    return out.write(formatLog(data));
}
function formatLog(data) {
    return `[${data.status}] ${helpers_1.getDateTime(new Date(data.date))} ${data.time}ms\n${data.command}:
REQUEST: ${data.method} ${data.url} ${!data.postData ? '' : '\n' + data.postData}
RESPONSE: ${data.statusCode}
${data.data}\n\n`;
}
