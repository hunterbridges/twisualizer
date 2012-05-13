var ZipChartView = Backbone.View.extend({
  events: {
    'click a.show_more': 'showMoreClicked',
    'click a.show_less': 'showLessClicked'
  },

  initialize: function(title, countPairHash, cutoff, el) {
    _.bindAll(this,
      'render',
      'showMoreClicked',
      'showLessClicked'
    );
    this.countPairHash = countPairHash;
    this.title = title;
    this.cutoff = cutoff || 10;

    if (el) this.setElement(el);
    this.$el.addClass('zip_chart');
    this.render();
  },

  render: function() {
    var rows = [];
    _(this.countPairHash).each(function(value, key) {
      rows.push({
        label: key,
        count_a: value[0],
        count_b: value[1]
      });
    });
    rows = _(rows).sortBy(function(item) {
      return 0 - item.count_a - item.count_b;
    });
    var i = 1;
    var view = this;
    rows = _(rows).map(function(item) {
      var sum = item.count_a + item.count_b;
      var ret = _(item).extend({
        width_a: (item.count_a * 1.0 / sum * 1.0) * 100.0,
        width_b: (item.count_b * 1.0 / sum * 1.0) * 100.0,
        more: i > view.cutoff
      });
      i++;
      return ret;
    });
    var data = {
      title: this.title,
      rows: rows
    };
    var html = Mustache.to_html(Templates.zipChart, data);
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
