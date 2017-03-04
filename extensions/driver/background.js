const extensionId = '9d009613-1f79-4455-b5d2-f5fe09bbe044'
let proxy_auth,
    oldWindowStates = {}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.extensionId !== extensionId) return

    const
        code = request.message.code,
        args = request.message.args,
        exec = new Function(code),
        response = Object.assign({}, request)

    delete(response.message)

    let result

    try {
        result = exec(...args)
    } catch (err) {
        response.error = {
            message: err.message,
            stack: err.stack
        }
        return sendResponse(response)
    }

    if (result instanceof Promise) {
        result.then(result => {
            response.message = result
            sendResponse(response)
        }, err => {
            response.error = {
                message: err.message,
                stack: err.stack
            }
            sendResponse(response)
        })
        return true
    }

    response.message = result
    sendResponse(response)
})

chrome.proxy.settings.clear({})

chrome.webRequest.onAuthRequired.addListener(details => {
    if (details.isProxy === true) {
        return proxy_auth ? {
            authCredentials: {
                'username': proxy_auth.login,
                'password': proxy_auth.password
            }
        } : void 0
    }
}, {
    urls: ["<all_urls>"]
}, ["blocking"])


function setProxy(scheme, host, port, auth) {
    console.log(scheme, host, port, auth)
    proxy_auth = auth
    return new Promise((resolve, reject) => {
        chrome.proxy.settings.set({
            value: {
                mode: "fixed_servers",
                rules: {
                    singleProxy: {
                        scheme,
                        host,
                        port
                    }
                }
            },
            scope: 'regular'
        }, resolve)
    })
}

function saveAsMHTML() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true }, tabs => {
            chrome.pageCapture.saveAsMHTML({ tabId: tabs[0].id }, mhtml => {
                const reader = new FileReader()
                reader.readAsDataURL(mhtml)
                reader.onloadend = () => {
                    resolve(reader.result)
                }
            })
        })
    })
}

function fullscreen(info, tab) {
    return new Promise((resolve, reject) => {
        chrome.windows.getCurrent(window => {
            if (window.state != "fullscreen") {
                oldWindowStates[window.id] = {
                    state: window.state,
                    height: window.height,
                    width: window.width,
                    left: window.left,
                    top: window.top
                };
                let oldState = oldWindowStates[window.id];
                console.log(oldState);
                chrome.windows.update(window.id, {
                    state: "fullscreen"
                }, resolve);
            } else {
                let oldState = oldWindowStates[window.id];
                console.log(oldState);
                if (oldState) {
                    chrome.windows.update(window.id, {
                        state: oldState.state,
                        height: oldState.height,
                        width: oldState.width,
                        left: oldState.left,
                        top: oldState.top
                    }, resolve);
                } else {
                    chrome.windows.update(window.id, {
                        state: "maximized"
                    }, resolve);
                }
            }
        });

    })
}