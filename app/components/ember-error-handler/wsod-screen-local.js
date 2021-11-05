import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../../templates/components/ember-error-handler/wsod-screen-local';

export default Component.extend({
  layout,

  descriptors: null,
  debugMessage: null,

  message: computed(function () {
    return this.get('descriptors.firstObject.normalizedMessage');
  }),

  stackTrace: computed(function () {
	  const stackTrace = (this.get('descriptors.firstObject.normalizedStack') || this.descriptors[0].error.stack || '')
      .replace(new RegExp('\\n', 'g'), '<br />');
    return stackTrace ? stackTrace : 'No stack trace available';
  })
});
