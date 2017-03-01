const extensionId = '9d009613-1f79-4455-b5d2-f5fe09bbe044'
let proxy_auth

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
}, { urls: ["<all_urls>"] }, ["blocking"])