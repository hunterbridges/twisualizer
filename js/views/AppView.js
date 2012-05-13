var AppView = Backbone.View.extend({
  initialize: function(baseData) {
    _.bindAll(this,
      'render',
      'prepData'
    );

    this.baseData = baseData;
    this.preppedData = null;

    this.setElement($('#app').get());
    this.prepData();
    this.render();
  },

  render: function() {
    this.$el.html(Mustache.to_html(Templates.appBase));
    var mentionedMeChart = new BarChartView(
      "Mentioned Me",
      this.preppedData.mentioned_me,
      10,
      $('#mentioned_me').get()
    );

    var iveMentionedChart = new BarChartView(
      "I've Mentioned",
      this.preppedData.ive_mentioned,
      10,
      $('#ive_mentioned').get()
    );

    var iveRetweetedChart = new BarChartView(
      "I've Retweeted",
      this.preppedData.ive_retweeted,
      10,
      $('#ive_retweeted').get()
    );

    var conversationBreakdown = new ZipChartView(
      "Conversation Breakdown (me/them)",
      this.preppedData.conversation_breakdown,
      10,
      $('#conversation_breakdown').get()
    );

    var ignoreBreakdown = new BarChartView(
      "I Ignore",
      this.preppedData.ignore_breakdown,
      5,
      $('#ignore_breakdown').get()
    );

    var ignoreBreakdown = new BarChartView(
      "I Annoy",
      this.preppedData.annoy_breakdown,
      5,
      $('#annoy_breakdown').get()
    );
  },

  prepData: function() {
    this.preppedData = _.clone(this.baseData);
    var view = this;
    var ive_mentioned = {};
    _(this.preppedData.ive_mentioned).each(function (val, key) {
      if ($.trim(key) === '') return;
      ive_mentioned[key.toLowerCase()] = val;
    });
    this.preppedData.ive_mentioned = ive_mentioned;

    var mentioned_me = {};
    _(this.preppedData.mentioned_me).each(function (val, key) {
      if ($.trim(key) === '') return;
      mentioned_me[key.toLowerCase()] = val;
    });
    this.preppedData.mentioned_me = mentioned_me;

    var mentionedKeys = _(ive_mentioned).keys();
    var mentionedMeKeys = _(mentioned_me).keys();

    var iConverseWith = _(mentionedKeys).intersect(mentionedMeKeys);
    var iIgnore = _(mentionedMeKeys).difference(iConverseWith);
    var iAnnoy = _(mentionedKeys).difference(iConverseWith);

    var conversationBreakdown = {};
    _(iConverseWith).each(function(name) {
      conversationBreakdown[name] = [
        ive_mentioned[name],
        mentioned_me[name]
      ];
    });

    var ignoreBreakdown = {};
    _(iIgnore).each(function(name) {
      ignoreBreakdown[name] = mentioned_me[name];
    });

    var annoyBreakdown = {};
    _(iAnnoy).each(function(name) {
      annoyBreakdown[name] = ive_mentioned[name];
    });

    this.preppedData.conversation_breakdown = conversationBreakdown;
    this.preppedData.ignore_breakdown = ignoreBreakdown;
    this.preppedData.annoy_breakdown = annoyBreakdown;

    this.preppedData.network.i_ignore = iIgnore;
    this.preppedData.network.i_annoy = iAnnoy;
    this.preppedData.network.i_converse_with = iConverseWith;
  }
});
