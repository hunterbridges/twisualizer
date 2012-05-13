if (!Array.indexOf){
  Array.prototype.indexOf = function(obj){
    return _.indexOf(this, obj);
  };
}

var Templates = {};
(function($) {
  var loadedTemplatesCount = 0;
  var templatesToLoad = [];
  var baseData = null;

  var startAppWhenReady = function () {
    if (templatesToLoad.length === loadedTemplatesCount &&
        baseData) {
      var appView = new AppView(baseData);
    }
  };

  // Determine which mustache templates to load.
  var templateNames = [
    'appBase',
    'barChart',
    'zipChart'
  ];

  _.each(templateNames, function (item) {
    var path = 'mustache/'+item+'.mustache';
    var tpl = {path: path, name: item};
    templatesToLoad.push(tpl);
  });

  // Load templates via AJAX.
  _.each(templatesToLoad, function(item) {
    $.get(item.path, function (data) {
      loadedTemplatesCount++;
      Templates[item.name] = data;
      startAppWhenReady();
    });
  });

  $.get('dump.json', function(data) {
    baseData = data;
    startAppWhenReady();
  });
}(jQuery));
