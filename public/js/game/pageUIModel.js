define([
    'backbone'
], function(Backbone) {
   
    var pageUIModel = Backbone.Model.extend({
        urlRoot: 'game/pageUI'

        , initialize: function() {
            this.fetch();
        }
    });

   return pageUIModel;
});