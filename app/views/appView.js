/**
 * appView
 * @author Norton 2022
 * @author Co-Pilot 2026
 */
import { imageRotator } from '/app/public/imageRotator.js';
import { registerHelpers } from '/app/public/handlebarsHelpersSPA.js';

class AppView {
  
  constructor() {}

  render = async function () {

    await this.preLoad("/cdn/npm/handlebars/4.7.8/handlebars.min.js");
    await this.preLoad("/cdn/npm/font-awesome/7.0.1/js/all.min.js");
    await this.preLoad("/cdn/npm/bootstrap/5.0.2/js/bootstrap.bundle.min.js");
    await this.preLoad("/cdn/npm/ajax/libs/sweetalert2/11.23.0/sweetalert2.min.js");
    await this.preLoad("/cdn/npm/ajax/libs/jquery/3.7.1/jquery.min.js");

    await this.preLoad("/app/public/general.js");
    await this.preLoad("/app/public/common.js");
    
    registerHelpers(Handlebars);
    
    // Load head meta tags
    let t = document.createElement("template");
    let text = await handleGet("/app/views/templates/appHead.html");
    t.innerHTML = text;
    document.head.append(t.content);
    
    // Load SPA styles
    let stylesTemplate = document.createElement("template");
    let stylesText = await handleGet("/app/views/css/spa-styles.html");
    stylesTemplate.innerHTML = stylesText;
    document.head.append(stylesTemplate.content);
    
    // Load component system styles
    let componentTemplate = document.createElement("template");
    let componentText = await handleGet("/app/views/css/component-system.html");
    componentTemplate.innerHTML = componentText;
    document.head.append(componentTemplate.content);
    
    // Initialize image rotators globally
    window.lsbImageRotator = imageRotator;
    
    // Setup MutationObserver to auto-init rotators on new DOM content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the new node or its children have rotator attributes
            const rotators = node.querySelectorAll ? node.querySelectorAll('[data-lsb-rotator]') : [];
            rotators.forEach(el => {
              if (!el.dataset.rotatorId) {
                const setName = el.dataset.lsbRotator;
                const interval = parseInt(el.dataset.interval) || 5000;
                const transition = el.dataset.transition || 'fade';
                imageRotator.startRotation(el, setName, interval, transition);
              }
            });
            // Also check the node itself
            if (node.dataset && node.dataset.lsbRotator && !node.dataset.rotatorId) {
              const setName = node.dataset.lsbRotator;
              const interval = parseInt(node.dataset.interval) || 5000;
              const transition = node.dataset.transition || 'fade';
              imageRotator.startRotation(node, setName, interval, transition);
            }
          }
        });
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

  };

  preLoad = function (scripting) {
    return new Promise((resolve, reject) => {
      var script = document.createElement("script");
      script.src = scripting;
      script.addEventListener("load", resolve);
      script.addEventListener("error", reject);
      document.body.appendChild(script);
    });
  };
}

export { AppView };
