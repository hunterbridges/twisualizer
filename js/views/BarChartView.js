var BarChartView = Backbone.View.extend({
  events: {
    'click a.show_more': 'showMoreClicked',
    'click a.show_less': 'showLessClicked'
  },

  initialize: function(title, countHash, cutoff, el) {
    _.bindAll(this,
      'render',
      'showMoreClicked',
      'showLessClicked'
    );
    this.countHash = countHash;
    this.title = title;
    this.cutoff = cutoff || 10;

    if (el) this.setElement(el);
    this.$el.addClass('bar_chart');
    this.render();
  },

  render: function() {
    var rows = [];
    var maxVal = 0;
    _(this.countHash).each(function(value, key) {
      rows.push({
        label: key,
        count: value
      });
      if (value > maxVal) maxVal = value;
    });
    rows = _(rows).sortBy(function(item) {
      return 0 - item.count;
    });
    var i = 1;
    var view = this;
    rows = _(rows).map(function(item) {
      var ret = _(item).extend({
        width: (item.count * 1.0 / maxVal * 1.0) * 100.0,
        more: i > view.cutoff
      });
      i++;
      return ret;
    });
    var data = {
      title: this.title,
      rows: rows
    };
    var html = Mustache.to_html(Templates.barChart, data);
    this.$el.html(html);

    this.$el.find('.more').hide();
    this.$el.find('a.show_less').hide();
    if (i <= this.cutoff) this.$el.find('a.show_more').hide();
  },

  showMoreClicked: function(e) {
    this.$el.find('a.show_more').hide();
    this.$el.find('a.show_less').show();
    this.$el.find('.more').show();
    return false;
  },

  showLessClicked: function(e) {
    this.$el.find('a.show_less').hide();
    this.$el.find('a.show_more').show();
    this.$el.find('.more').hide();
    return false;
  }

});
