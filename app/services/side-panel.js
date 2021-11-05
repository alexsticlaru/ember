import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SidePanelService extends Service {

    route_renderer = null;
    @tracked sidePanelClass = 'side-panel--hide';
    setSidePanelRendererRoute(route) {
		this.route_renderer = route;
    }

    showSidePanel(templateName, model, controllerName) {
        this.sidePanelClass = 'side-panel--show';
        this.route_renderer.side_panel_render(templateName, model, controllerName);
    }

    hideSidePanel() {
        this.sidePanelClass = 'side-panel--hide';
    }
}
