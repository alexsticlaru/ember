import DS from 'ember-data';
const {Transform} = DS;

export default Transform.extend({
  serialize: function(serialized) {
    return serialized;
  },
  deserialize: function(value) {
    console.log('locale is', value);

    if (value === 'fr' || value === 'nl') {
      return 'en';
    } else {
      return value;
    }
  }
});
