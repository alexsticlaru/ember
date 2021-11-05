import DS from 'ember-data';
const {Transform} = DS;

export default Transform.extend({
  serialize: function(serialized) {
    return serialized;
  },
  deserialize: function(value) {
    return new Date(moment.utc(value));
  }
});
