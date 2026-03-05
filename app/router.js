/**
 * Generic router to override default link handling within the application
 * @author Norton 2022
 */
class Router {
  constructor() {
    this.routingTable = {};
    this.navigateTo = this.navigateTo.bind(this);
    this.setRouteLinks = this.setRouteLinks.bind(this);
  }
}

/**
 * Add(path, handler) - adds a path to the router list with a handler function
 * @param {String} path e.g. '/generic.html' ?
 * @param {fn(props)} handler fn for this path, where props is array of URL params,
 *                            e.g. [page=about,serviceId=4,uid=whatever]
 */
Router.prototype.add = function (path, handler) {
  this.routingTable[path] = handler;
};

/**
 * navigateTo(path, query, pop, state)
 * @param {String} path
 * @param {String} query
 * @param {Boolean} pop
 * @param {Object} state - Optional ephemeral state object to pass to the handler
 */
Router.prototype.navigateTo = function (path, query, pop, state = {}) {
  // Note: Auth is handled server-side via session cookies
  // The server will redirect to login if not authenticated
  // We don't check cookies client-side as they're httpOnly

  let handler = this.routingTable[path];
  
  // If no exact handler found, try to find a matching pattern
  if (!handler) {
    // Sort registered paths by length (longest first) to match most specific route
    const sortedPaths = Object.keys(this.routingTable).sort((a, b) => b.length - a.length);
    
    for (const registeredPath of sortedPaths) {
      if (path.startsWith(registeredPath + '/') || path === registeredPath) {
        handler = this.routingTable[registeredPath];
        break;
      }
    }
  }

  if (!handler) {
    console.warn(`No handler found for path: ${path}`);
    // Default to home - server will redirect to login if not authenticated
    handler = this.routingTable['/home'] || this.routingTable['/'];
  }

  // Handle history state push
  if (!pop) {
    var historyState = { path: path, query: query || '' };
    history.pushState(historyState, path + (query || ''), path + (query || ''));
  }

  // Strip the initial '?' and create an array of params,
  // include these in a navigationRequest object
  var queryStr = (query || '').substring(1);
  let navigationRequest = { path: path, parameters: queryStr.split("&") };

  // Parse query parameters into an object
  const queryParams = {};
  if (navigationRequest.parameters && Array.isArray(navigationRequest.parameters)) {
    navigationRequest.parameters.forEach(param => {
      if (param) {
        const [key, value] = param.split('=');
        if (key) queryParams[key] = value || '';
      }
    });
    // Add queryParams to navigationRequest
    navigationRequest.queryParams = queryParams;
  }

  handler({ ...navigationRequest, ...state });
};

/**
 *  setRouteLinks - finds all the links (anchors) that need to be
 * handled by the router and attaches a method to call navigateTo
 */
Router.prototype.setRouteLinks = function (...nodes) {
  
  const loginLink = document.querySelector("a[name='loginLink']");
  nodes.forEach((node) => {

    // in addition to the "node" passed in, also look for the loginLink by name
    let anchorElements = node.querySelectorAll("a[data-route-link]");
    if (loginLink) {
      anchorElements = Array.from(anchorElements).concat(loginLink);
    }
    anchorElements.forEach((el) => {
      el.addEventListener("click", (e) => {

        // Login link: full-page navigation (different SPA entry point).
        // Build the redirectUrl fresh from window.location each click —
        // never mutate el.search, which would compound on every click.
        if (el.name === 'loginLink') {
          e.preventDefault();
          const currentLocation = window.location.pathname + window.location.search;
          // Use the base href from the element (e.g. /login?redirectUrl=) but
          // strip any previously-appended redirectUrl value so we start clean.
          const baseHref = el.pathname; // e.g. '/login'
          window.location.href = `${baseHref}?redirectUrl=${encodeURIComponent(currentLocation)}`;
          return;
        }

        // HTMLAnchorElement has the following properties:
        // pathname - path from the href attribute (no query string)
        // search - query string including leading ? from the href attribute
        // hash - hash fragment including leading # from the href attribute
        
        // Combine search and hash into query parameter
        let query = el.search || '';
        if (el.hash) {
          query = query ? `${query}${el.hash}` : el.hash;
        }
        
        this.navigateTo(el.pathname, query, false);
        e.preventDefault();
      });
    });
  });
};

// Norton's EventDepot, inspired by Carver's EventEmitter
class EventDepot {

    constructor() {
        // eventRegistry will be of the form:
        // { event1: [eventHandler, eventHandler...], event2: [eventHandler, eventHandler...] }
        this.eventRegistry = {};
    }

    addListener(eventName, listener) {
        
        let currentKeys = Object.keys(this.eventRegistry);
        if (!currentKeys.includes(eventName)) {
            this.eventRegistry[eventName] = [];
        }
        this.eventRegistry[eventName].push(listener);

    }

    fire(eventName, eventData) {

        if (this.eventRegistry[eventName]) {
            let handlers = this.eventRegistry[eventName];
            for (let handler of handlers) {
                handler(eventData);                
            }
        }
    } 

    removeListener(eventName, listener) {
        if (this.eventRegistry[eventName]) {
            this.eventRegistry[eventName] = 
            this.eventRegistry[eventName].filter(l => l !== listener);
        }
    }

    destroy() {
        this.eventRegistry = {};
    }
}

const eventDepot = new EventDepot();
const router = new Router();

export { router, eventDepot };
