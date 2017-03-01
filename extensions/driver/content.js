if (!location.href.startsWith('chrome-extension://')) {
    const script = document.createElement('script')
    script.textContent = `${sendMessageToExtension}`
    document.documentElement.appendChild(script)
}

document.addEventListener('pageMessage', ev => {
    chrome.runtime.sendMessage(ev.detail, sendResponse)
})

function sendResponse(response) {
    const event = new CustomEvent(response._id, { detail: response })
    document.dispatchEvent(event)
}

function sendMessageToExtension(extensionId, message) {
    return new Promise((resolve, reject) => {
        const _id = Math.random().toString()

        const event = new CustomEvent('pageMessage', {
            detail: {
                _id,
                message,
                extensionId
            }
        })

        const responseHandler = (event) => {
            resolve(event.detail)
            document.removeEventListener(_id, responseHandler)
        }

        document.addEventListener(_id, responseHandler)

        document.dispatchEvent(event)
    })
}