export default {
    status: [
        "GET",
        "/status"
    ],
    getSessions: [
        "GET",
        "/sessions"
    ],
    getSession: [
        "GET",
        "/session/:sessionId"
    ],
    deleteSession: [
        "DELETE",
        "/session/:sessionId"
    ],
    setTimeouts: [
        "POST",
        "/session/:sessionId/timeouts", [
            "type",
            "ms"
        ]
    ],
    setAsyncScriptTimeout: [
        "POST",
        "/session/:sessionId/timeouts/async_script", [
            "ms"
        ]
    ],
    setImplicitWaitTimeout: [
        "POST",
        "/session/:sessionId/timeouts/implicit_wait", [
            "ms"
        ]
    ],
    getWindowHandle: [
        "GET",
        "/session/:sessionId/window_handle"
    ],
    getWindowHandles: [
        "GET",
        "/session/:sessionId/window_handles"
    ],
    switchToWindow: [
        "POST",
        "/session/:sessionId/window", [
            "name"
        ]
    ],
    closeWindow: [
        "DELETE",
        "/session/:sessionId/window"
    ],
    setWindowSize: [
        "POST",
        "/session/:sessionId/window/:windowHandle/size", [
            "width",
            "height"
        ]
    ],
    getWindowSize: [
        "GET",
        "/session/:sessionId/window/:windowHandle/size"
    ],
    setWindowPosition: [
        "POST",
        "/session/:sessionId/window/:windowHandle/position", [
            "x",
            "y"
        ]
    ],
    getWindowPosition: [
        "GET",
        "/session/:sessionId/window/:windowHandle/position"
    ],
    maximizeWindow: [
        "POST",
        "/session/:sessionId/window/:windowHandle/maximize"
    ],
    getCurrentURL: [
        "GET",
        "/session/:sessionId/url"
    ],
    go: [
        "POST",
        "/session/:sessionId/url", [
            "url"
        ]
    ],
    goForward: [
        "POST",
        "/session/:sessionId/forward"
    ],
    goBack: [
        "POST",
        "/session/:sessionId/back"
    ],
    refresh: [
        "POST",
        "/session/:sessionId/refresh"
    ],
    executeScript: [
        "POST",
        "/session/:sessionId/execute", [
            "script",
            "args"
        ]
    ],
    executeAsyncScript: [
        "POST",
        "/session/:sessionId/execute_async", [
            "script",
            "args"
        ]
    ],
    screenshot: [
        "GET",
        "/session/:sessionId/screenshot"
    ],
    switchToFrame: [
        "POST",
        "/session/:sessionId/frame", [
            "id"
        ]
    ],
    switchToParentFrame: [
        "POST",
        "/session/:sessionId/frame/parent"
    ],
    getAllCookies: [
        "GET",
        "/session/:sessionId/cookie"
    ],
    setCookie: [
        "POST",
        "/session/:sessionId/cookie", [
            "cookie"
        ]
    ],
    deleteAllCookies: [
        "DELETE",
        "/session/:sessionId/cookie"
    ],
    deleteCookie: [
        "DELETE",
        "/session/:sessionId/cookie/:name"
    ],
    getSource: [
        "GET",
        "/session/:sessionId/source"
    ],
    getTitle: [
        "GET",
        "/session/:sessionId/title"
    ],
    findElement: [
        "POST",
        "/session/:sessionId/element", [
            "using",
            "value"
        ]
    ],
    findElements: [
        "POST",
        "/session/:sessionId/elements", [
            "using",
            "value"
        ]
    ],
    getActiveElement: [
        "POST",
        "/session/:sessionId/element/active"
    ],
    findChildElement: [
        "POST",
        "/session/:sessionId/element/:id/element", [
            "using",
            "value"
        ]
    ],
    findChildElements: [
        "POST",
        "/session/:sessionId/element/:id/elements", [
            "using",
            "value"
        ]
    ],
    keys: [
        "POST",
        "/session/:sessionId/keys", [
            "value"
        ]
    ],
    click: [
        "POST",
        "/session/:sessionId/element/:id/click"
    ],
    clear: [
        "POST",
        "/session/:sessionId/element/:id/clear"
    ],
    submit: [
        "POST",
        "/session/:sessionId/element/:id/submit"
    ],
    getElementText: [
        "GET",
        "/session/:sessionId/element/:id/text"
    ],
    keysElement: [
        "POST",
        "/session/:sessionId/element/:id/value", [
            "value"
        ]
    ],
    getElementTagName: [
        "GET",
        "/session/:sessionId/element/:id/name"
    ],
    isElementSelected: [
        "GET",
        "/session/:sessionId/element/:id/selected"
    ],
    isElementEnabled: [
        "GET",
        "/session/:sessionId/element/:id/enabled"
    ],
    getElementAttribute: [
        "GET",
        "/session/:sessionId/element/:id/attribute/:name"
    ],
    isElementEqual: [
        "GET",
        "/session/:sessionId/element/:id/equals/:other"
    ],
    isElementDysplayed: [
        "GET",
        "/session/:sessionId/element/:id/displayed"
    ],
    getElementLocation: [
        "GET",
        "/session/:sessionId/element/:id/location"
    ],
    getElementLocationInView: [
        "GET",
        "/session/:sessionId/element/:id/location_in_view"
    ],
    getElementSize: [
        "GET",
        "/session/:sessionId/element/:id/size"
    ],
    getElementCssProperty: [
        "GET",
        "/session/:sessionId/element/:id/css/:propertyName"
    ],
    getOrientation: [
        "GET",
        "/session/:sessionId/orientation"
    ],
    setOrientation: [
        "POST",
        "/session/:sessionId/orientation", [
            "orientation"
        ]
    ],
    getAlertText: [
        "GET",
        "/session/:sessionId/alert_text"
    ],
    setAlertText: [
        "POST",
        "/session/:sessionId/alert_text", [
            "text"
        ]
    ],
    acceptAlert: [
        "POST",
        "/session/:sessionId/accept_alert"
    ],
    dismissAlert: [
        "POST",
        "/session/:sessionId/dismiss_alert"
    ],
    mouseMoveTo: [
        "POST",
        "/session/:sessionId/moveto", [
            "element",
            "xoffset",
            "yoffset"
        ]
    ],
    mouseClick: [
        "POST",
        "/session/:sessionId/click", [
            "button"
        ]
    ],
    mouseDoubleClick: [
        "POST",
        "/session/:sessionId/doubleclick"
    ],
    mouseDown: [
        "POST",
        "/session/:sessionId/buttondown", [
            "button"
        ]
    ],
    mouseUp: [
        "POST",
        "/session/:sessionId/buttonup", [
            "button"
        ]
    ],
    touchClick: [
        "POST",
        "/session/:sessionId/touch/click", [
            "element"
        ]
    ],
    touchDown: [
        "POST",
        "/session/:sessionId/touch/down", [
            "x",
            "y"
        ]
    ],
    touchUp: [
        "POST",
        "/session/:sessionId/touch/up", [
            "x",
            "y"
        ]
    ],
    touchMove: [
        "POST",
        "session/:sessionId/touch/move", [
            "x",
            "y"
        ]
    ],
    touchScroll: [
        "POST",
        "session/:sessionId/touch/scroll", [
            "element",
            "xoffset",
            "yoffset"
        ]
    ],
    touchDoubleClick: [
        "POST",
        "session/:sessionId/touch/doubleclick", [
            "element"
        ]
    ],
    touchLongClick: [
        "POST",
        "session/:sessionId/touch/longclick", [
            "element"
        ]
    ],
    touchFlick: [
        "POST",
        "session/:sessionId/touch/flick", [
            "element",
            "xoffset",
            "yoffset",
            "speed",
            "xspeed",
            "yspeed"
        ]
    ],
    getGeoLocation: [
        "GET",
        "/session/:sessionId/location"
    ],
    setGeoLocation: [
        "POST",
        "/session/:sessionId/location", [
            "location"
        ]
    ],
    setLocalStorage: [
        "POST",
        "/session/:sessionId/local_storage", [
            "key",
            "value"
        ]
    ],
    getLocalStorageKeys: [
        "GET",
        "/session/:sessionId/local_storage"
    ],
    clearLocalStorage: [
        "DELETE",
        "/session/:sessionId/local_storage"
    ],
    getLocalStorageValue: [
        "GET",
        "/session/:sessionId/local_storage/key/:key"
    ],
    deleteLocalStorageValue: [
        "DELETE",
        "/session/:sessionId/local_storage/key/:key"
    ],
    getLocalStorageSize: [
        "GET",
        "/session/:sessionId/local_storage/size"
    ],
    getSessionStorageKeys: [
        "GET",
        "/session/:sessionId/session_storage"
    ],
    setSessionStorage: [
        "POST",
        "/session/:sessionId/session_storage", [
            "key",
            "value"
        ]
    ],
    deleteSessionStorage: [
        "DELETE",
        "/session/:sessionId/session_storage"
    ],
    getSessionStorageValue: [
        "GET",
        "/session/:sessionId/session_storage/key/:key"
    ],
    deleteSessionStorageValue: [
        "DELETE",
        "/session/:sessionId/session_storage/key/:key"
    ],
    getSessionStorageSize: [
        "GET",
        "/session/:sessionId/session_storage/size"
    ]
}