import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Routebase extends Route {
	@service intl;
	@service('debug') dbgS;
	@service cookies;

	constructor(){
		super(...arguments);
// 		Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
	};

	//Initial or Re-render :
	didReceiveAttrs(){
		this.dbgS.error('Routebase::didReceiveAttrs(', ...arguments, ')');
		this._super(...arguments);
	};

	willRender(){
		this.dbgS.error('Routebase::willRender(', ...arguments, ')');
		this._super(...arguments);
	};

	didInsertElement(){
		this.dbgS.error('Routebase::didInsertElement(', ...arguments, ')');
		this._super(...arguments);
//     Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  };

/*finally not needed:
  afterRenderEvent(){
 	  this.intl.installTranslatorTools();
  };
*/

}
