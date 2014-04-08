App = Ember.Application.create();

App.GlosaryView = Ember.View.extend({
  templateName: 'glosary'
});

App.Router.map(function() {
    this.resource('hunt');
    this.resource('rltw');
    this.resource('ww');
    this.resource('career_profile');
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

    return model;
  }
});

var testProfile = {
    "heroes": [
        {
            "name": "Yharr",
            "id": 1,
            "level": 60,
            "hardcore": false,
            "gender": 0,
            "lastUpdated": 1341343147,
            "dead": false
        },
        {
            "name": "Worm",
            "id": 2,
            "level": 19,
            "hardcore": true,
            "gender": 0,
            "lastUpdated": 1339289897,
            "dead": false
        },
        {
            "name": "Korale",
            "id": 3,
            "level": 18,
            "hardcore": false,
            "gender": 0,
            "lastUpdated": 1344055324,
            "dead": false
        }
    ],
     "lastHeroPlayed": 3,
    "lastUpdated": 1344055324,
     "battleTag": "Straton#1",
     "mh_aps": 1.54,
     "oh_aps": 1.54
};

/* Current user  */
App.User = Ember.Object.extend({battletag_name: 'givanse',
                                                            battletag_code: '1303',
                                                            isValidBattletag: function() {
                                                                   var name = this.get('battletag_name');
                                                                   var code = this.get('battletag_code');
                                                                   if (! name || ! code) {
                                                                        return false;
                                                                   }
                                                                   // https://us.battle.net/support/en/article/BattleTagNamingPolicy
                                                                   // TODO: accented characters
                                                                   var parse_name = /^[a-zA-Z][a-zA-Z0-9]{2}[a-zA-Z0-9]{0,9}$/;
                                                                   if ( ! parse_name.test(name) ) {
                                                                        return false;
                                                                   }
                                                                   var parse_code = /^(\s*\d\s*){4}$/;
                                                                   if ( ! parse_code.test(code) ) {
                                                                        return false;
                                                                   }
                                                                   return true;
                                                            }.property('battletag_name', 'battletag_code'),
                                                            battletag: function() {
                                                                   if ( ! this.get('isValidBattletag') ) {
                                                                      return '';
                                                                   }
                                                                   return this.get('battletag_name') + '-' + 
                                                                              this.get('battletag_code');
                                                            }.property('isValidBattletag'),
                                                            careerProfile: function() {
                                                                   var date = new Date(testProfile.lastUpdated * 1000);
                                                                   testProfile.lastUpdatedDate = date.getDay() + '/' + 
                                                                                                                        date.getMonth() + '/' + 
                                                                                                                        date.getYear();
                                                                  return testProfile;

                                                                  if ( ! this.get('isValidBattletag') ) {
                                                                      return null;
                                                                  }
                                                                  var battletag = this.get('battletag');
                                                                  var url = 'http://us.battle.net/api/d3/profile/' + battletag;
                                                                  /* If the URL includes the string "callback=?" in the URL, 
                                                                      the request is treated as JSONP instead. */
                                                                  /* discuss.emberjs.com/t/promises-and-computed-properties/3333/10 */
                                                                  var self = this;
                                                                  //$.getJSON(url + '?callback=?', function(data) {
                                                                  /*$.ajax({url: url, type: 'GET', dataType: 'jsonp'})
                                                                    .success(function(data) {
                                                                          console.log(data);
                                                                          self.set('careerProfile', data);
                                                                      }
                                                                    );*/
                                                                  // TODO: Is it ok to not return? 
                                                                  // return;
                                                            }.property('isValidBattletag')});
App.user = App.User.create();

/*
App.CareerProfileController = Ember.Controller.extend({
  battletag: function() {
    //return this.get('battleTag');
    return "hello";
  }.property('battleTag')
});
var careerProfileController = App.CareerProfileController.create({ model: careerProfile });
*/

App.CareerProfileView = Ember.View.extend({
  templateName: 'career_profile',
  //,controller: careerProfileController
});
