App = Ember.Application.create();

App.ApplicationRoute = Ember.Route.extend({
    setupController: function(controller, model) {
        var tModel = {
                "lastUpdated": 1344055324,
                "battleTag": "TestUser#0101",
                "mh_aps": 3.54,
                "oh_aps": 4.54
            };
        this._super(controller, tModel);
    }
});

/* Current user  */
App.User = Ember.Object.extend({
    battletag_name: 'givanse',
    battletag_code: '1303',

    isValidBattletagName: function() {
        var name = this.get('battletag_name');
        if (! name) {
            return false;
        }
        // https://us.battle.net/support/en/article/BattleTagNamingPolicy
        // TODO: var accented = 'ÀÁÅÃÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ';
        var parse_name = /^[a-zA-Z][a-zA-Z0-9]{2,11}$/;
        if ( ! parse_name.test(name) ) {
            return false;
        }
        return true;
    }.property('battletag_name'),

    isValidBattletagCode: function() {
        var code = this.get('battletag_code');
        if (! code) {
            return false;
        }
        var parse_code = /^(\s*\d\s*){4}$/;
        if ( ! parse_code.test(code) ) {
            return false;
        }
        return true;
    }.property('battletag_code'),

    isValidBattletag: function() {
        return this.get('isValidBattletagName') === true && 
               this.get('isValidBattletagCode') === true;
    }.property('isValidBattletagName', 'isValidBattletagCode'),

    battletag: function() {
        if ( ! this.get('isValidBattletag') ) {
            return '';
        }
        return this.get('battletag_name') + '-' + 
               this.get('battletag_code');
    }.property('isValidBattletag'),

    careerProfile: function() {
        if ( ! this.get('isValidBattletag') ) {
            return null;
        }
        var battletag = this.get('battletag');
        var url = 'http://us.battle.net/api/d3/profile/' + battletag + '/';
        /* discuss.emberjs.com/t/promises-and-computed-properties/3333/10 */
        var self = this;
        $.ajax({url: url, type: 'GET', dataType: 'jsonp'})
         .success(function(data) {
             var date = new Date(data.lastUpdated * 1000);
             data.lastUpdatedDate = date.getDate() + ' / ' + 
                                    (date.getMonth() + 1) + ' / ' + 
                                    date.getFullYear();
             data.mh_aps = 1.54;
             data.oh_aps = 2.94;
             self.set('careerProfile', data);
         });
    }.property('isValidBattletag')
});

App.user = App.User.create();

App.Router.map(function() {
    this.resource('hunt');
    this.resource('rltw');
    this.resource('ww');
    this.resource('career_profile');
    this.resource('table_breakpoint');
    this.resource('tr_breakpoint');
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
        // TODO: Display data logic? move to controller?
        var aps = rltwAPS[i];
        var fpt = 20 / aps;
        var tps = 60 / fpt;
        var tornadoDuration = 3; /* seconds */
        var tticks = tps * 3;
        var next_bp = (i + 1 === rltwAPS.length) ? null : rltwAPS[ i + 1];
        var row = {aps: aps.toFixed(4),
                          fpt: Math.round(fpt), 
                          tps: tps.toFixed(2), 
                          t_ticks: Math.ceil(tticks),
                          next_bp: next_bp};
        model.push(row);
    }

    return model;
    }
});

/* Views */

App.GlosaryView = Ember.View.extend({
    templateName: 'glosary'
});

App.CareerProfileView = Ember.View.extend({
    templateName: 'career_profile'
});

App.TableBreakpointView = Ember.View.extend({
    tagName: 'div',
    classNames: ['table_breakpoint_wrap'],
    templateName: 'table_breakpoint'
});

App.TrBreakpointView = Ember.View.extend({
    tagName: 'tr',
    templateName: 'tr_breakpoint',
    classNameBindings: ['isActive'],
    isActive: function() {
        var tr = this.get('content');
        var user_aps = this.get('user_aps');
        if ( tr.aps < user_aps ) {
                if ( ! tr.next_bp || user_aps < tr.next_bp ) {
                    return true;
                }
        }
        return false;
    }.property('user_aps')
});

/*EOF*/
