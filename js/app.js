App = Ember.Application.create();

App.GlosaryView = Ember.View.extend({
  templateName: 'glosary'
});

App.Router.map(function() {
    this.resource('hunt');
    this.resource('rltw');
    this.resource('ww');
});

// http://us.battle.net/d3/en/forum/topic/6037344497
var rltwAPS = [0.90909,
               0.95238,
               1.00000,
               1.05263,
               1.11111,
               1.17647,
               1.25000,
               1.33333,
               1.42857,
               1.53846,
               1.66666,
               1.81818,
               2.00000,
               2.22222,
               2.50000,
               2.85714,
               3.33333,
               4.00000,
               5.00000];

App.RltwRoute = Ember.Route.extend({
  model: function() {
    model = [];

    for(var i = 0; i < rltwAPS.length; i++) {
        var aps = rltwAPS[i];
        var fpt = 20 / aps;
        var tps = 60 / fpt;
        var tornadoDuration = 3; /* seconds */
        var tticks = tps * 3;
        var row = {aps: aps.toFixed(4), 
                   fpt: Math.round(fpt), 
                   tps: tps.toFixed(2), 
                   tticks: Math.ceil(tticks)};
        model.push(row);
    }
    console.log(model);

    return model;
  }
});
