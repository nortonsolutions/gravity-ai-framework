import { AppController } from '/app/appController.js'
import { MainController } from '/app/mainController.js'
import { NavController } from '/app/navController.js'
import { router, eventDepot } from '/app/router.js'
import { messagesController } from '/app/messagesController.js' 
class App {
    constructor() {
        this.addRouterLinks()
        this.addEventDepotListeners()
        this.addWindowEventListeners()
    }
}

App.prototype.load = async function () {
    this.appController = new AppController()
    await this.appController.load()

    // Detect standalone mode from URL
    const currentPath = window.location.pathname

    let navContext = {}

    this.navController = new NavController()
    await this.navController.load(navContext)

    await this.registerComponents()

    this.mainController = new MainController()
    const currentSearch = window.location.search

    router.navigateTo(currentPath, currentSearch, false)
}


App.prototype.addRouterLinks = function () {
    // Root route — navigate guests to /stores, authenticated users to /home
    router.add('/', (request) => {
        this.mainController.load(request)
    })
}

App.prototype.registerComponents = async function () {
    // Templates served from /app (mapped to appMain/app)
    var componentsBase = '/app/views/templates/partials'

    var components = [
        // partials
    ]

    for (let component of components) {
        var template = await handleGet(
            componentsBase + '/' + component + '.hbs'
        )
        Handlebars.registerPartial(component, template)
    }
}

App.prototype.addEventDepotListeners = async function () {
    // ── Universal notify listener ─────────────────────────────────────────────
    // Any code in the app can do: eventDepot.fire('notify', { type, message, title })
    // type: 'success' | 'error' | 'warning' | 'info'
    // This is the single place that turns a notify event into a UI notification.
    eventDepot.addListener(
        'notify',
        ({ type = 'info', message = '', title } = {}) => {
            const isError = type === 'error'
            const defaultTitles = {
                success: 'Done',
                error: 'Error',
                warning: 'Warning',
                info: 'Info'
            }
            if (isError) {
                // Errors as a centred modal so they aren't missed
                Swal.fire({
                    icon: 'error',
                    title: title || defaultTitles[type],
                    html: message,
                    confirmButtonText: 'OK'
                })
            } else {
                // Success / info / warning as a toast (top-right, auto-dismisses)
                Swal.fire({
                    icon: type,
                    title: title || defaultTitles[type] || message,
                    text: title ? message : undefined,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3500,
                    timerProgressBar: true
                })
            }
        }
    )
}


App.prototype.addWindowEventListeners = function () {
    // Catches runtime errors (e.g. throw new Error(...))

    // if NODE_ENV=='development', show full stack trace for easier debugging
    window.addEventListener('error', (e) => {
        const error = e.error || {}
        let message =
            error.message || e.message || 'An unexpected error occurred'
        if (
            error.stack &&
            (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1')
        ) {
            message += `<hr><div class='text-left' style='font-size:0.8em;'>${error.stack}</div>`
        } else if (error.stack) {
            // In production, show only first line of stack trace
            const firstLine = error.stack.split('\n')[0]
            message += `<hr><div class='text-left' style='font-size:0.8em;'>${firstLine}</div>`
        }
        messagesController.displayError({ error, message })
    })

    // Catches unhandled Promise rejections (async errors)
    window.addEventListener('unhandledrejection', (e) => {
        const error = e.reason || {}
        let message =
            error.message || e.reason || 'An unexpected error occurred'
        if (error.stack) {
            message += `<hr><div class='text-left' style='font-size:0.8em;'>${error.stack}</div>`
        }
        messagesController.displayError({ error, message })
    })

    window.addEventListener('popstate', (e) => {
        if (e.state) {
            let { path, query } = e.state
            router.navigateTo(path, query, true)
        }
    })
}


export { App }
