export function initialize(/* application */) {
  /*Automatically add aria labels to input type texts*/
/* @Matthias, is it still useful ? (coming from v6)
  Ember.TextSupport.reopen({
    attributeBindings: ['aria-label', 'aria-labelledby']
  });
*/

  // application.inject('route', 'foo', 'service:foo');
  /*Automatically add the route name as a class on the body tag - important to tweak some styles on some pages*/
  Ember.Route.reopen({
	activate () {
		// 		contentLoading = false;//temp trigger fatal error test
		var classes = this.genClasses()
		if (classes !== 'application') {
			Ember.$('body').addClass(classes)
		}
		document.contentLoading = false;//global defined in index.html
		$('#appLoading').hide(2000);
	},

	deactivate () {
		Ember.$('body').removeClass(this.genClasses())
	},

	genClasses () {
		const classes = this.routeName.split('.');
		// add a "route-" prefix to the class name to avoid possible css clashes
		const newClasses = classes.map(el => 'route-' + el);
		if (this.classNames) {
			for (var name of this.classNames) {
				newClasses.push(name)
			}
		}

		return newClasses.join(' ')
	}
  })
}

export default {
  name: 'body-class',
  initialize
/*  after: 'i18n',
  initialize: function() {
	  Ember.$('body').addClass( i18n.locale );
  }*/
};
