var Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
  url: '/invoice/charges',
  comparator: 'service_id'
});
