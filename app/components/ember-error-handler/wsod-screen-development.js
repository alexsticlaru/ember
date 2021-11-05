import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../../templates/components/ember-error-handler/wsod-screen-development';

export default Component.extend({
  layout,

  descriptors: null,
  debugMessage: null,

  message: computed(function () {
    return this.get('descriptors.firstObject.normalizedMessage');
  }),

  stackTrace: computed(function () {
    const stackTrace = (this.get('descriptors.firstObject.normalizedStack') || '')
      .replace(new RegExp('\\n', 'g'), '<br />');

    return stackTrace ? stackTrace : 'No stack trace available';

  })
});
