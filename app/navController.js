/**
 * NavController
 * @author Norton 2022
 */
 import { NavView } from "/app/views/navView.js";
import { router, eventDepot } from "/app/router.js"; 
 
 export class NavController {
 
     constructor() {
         this.navView = new NavView();
     }
 
     load(context) {
        this.navView.render(context);
     }
 }