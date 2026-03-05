/**
 * MainController
 * @author Norton 2026
 */
import { MainView } from "/app/views/MainView.js";
import { router, eventDepot } from "/app/router.js";

export class MainController {
  constructor() {
    this.MainView = new MainView();

    this.user = {};
  }

  async load(request) {
    let params = getParamsFromRequest(request);
   
    let context = {
      ...this.user,
      ...params,
      title: "WallStreet Trader App",
    };

    this.MainView.render(context);
  }
    
}
