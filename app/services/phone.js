import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class PhoneService extends Service {

    route_renderer = null;
    @tracked phonePageClass = 'phone-page--hide';

    setPhoneRendererRoute(route) {
		this.route_renderer = route;
    }
    
    showPhonePage(templateName, model, controllerName) {
        this.phonePageClass = 'phone-page--show';
        this.route_renderer.phone_page_render(templateName, model, controllerName);
    }

    hidePhonePage() {
        this.phonePageClass = 'phone-page--hide';
    }
}