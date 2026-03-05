/**
 * MainView
 * @author Norton 2022
 */
import { router, eventDepot } from "/app/router.js";

class MainView {

    constructor() {

    }

    async render(context) {
        this.template = await getTemplate('/app/views/templates/main.hbs');
        this.dom = document.getElementById('main');
        this.dom.innerHTML = this.template(context);

        router.setRouteLinks(this.dom);
        document.title = `Home - CoinBaseCamp Trader App`;
        window.scrollTo(0,0);
        this.addEventListeners();
    }

    addEventListeners = () => {

    }


}

export { MainView };