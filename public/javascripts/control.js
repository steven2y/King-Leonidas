// Generated by CoffeeScript 1.4.0
(function() {
  var BinaryCounter, Display, DisplayRowView;

  Display = Backbone.Model.extend({
    initialize: function(id, options) {
      this.socket = options.socket;
      return this.bind("change", function(model) {
        console.log("change");
        console.log(model.toJSON());
        return this.socket.emit("controlShowDisplay", model.toJSON());
      });
    }
  });

  DisplayRowView = Backbone.View.extend({
    initialize: function() {
      this.render();
      return this.model.on("change", this.refreshFromModel, this);
    },
    templateRow: "<tr><td><span class='badge badge-info'><i class='icon-resize-vertical'></i></span>{{timestamp}}</td><td><input class='message' type='text' value='{{message}}'/></td><td>{{height}}x{{width}} (px)</td></tr>",
    render: function() {
      this.row = $(_.template(this.templateRow, this.model.toJSON()));
      this.inputMessage = this.row.find("input.message");
      this.inputMessage.on("change", _.bind(this.updateMessageModel, this));
      this.$el.append(this.row);
      return this;
    },
    updateMessageModel: function(e) {
      var value;
      value = $(e.target).val();
      return this.model.set({
        'message': value
      });
    },
    refreshFromModel: function() {
      this.inputMessage.val(this.model.get('message'));
      return console.log('refresh');
    }
  });

  BinaryCounter = (function() {

    function BinaryCounter(table, msInput) {
      this.table = table;
      this.msInput = msInput;
      this.counter = 0;
    }

    BinaryCounter.prototype.start = function(ms) {
      return this.timer = window.setInterval(_.bind(this.loadBits, this), parseInt(this.msInput.val()));
    };

    BinaryCounter.prototype.stop = function() {
      return window.clearInterval(this.timer);
    };

    BinaryCounter.prototype.loadBits = function() {
      var binary, binaryReverse, bit, display, i, _i, _len, _results;
      this.counter++;
      console.log(this.counter);
      binary = this.counter.toString(2);
      binaryReverse = binary.split("").reverse().join("");
      display = this.table.find('input.message');
      _results = [];
      for (i = _i = 0, _len = binaryReverse.length; _i < _len; i = ++_i) {
        bit = binaryReverse[i];
        if (display[i]) {
          _results.push(this.displayBit(display[i], bit));
        }
      }
      return _results;
    };

    BinaryCounter.prototype.displayBit = function(input, bit) {
      $(input).val(bit);
      return $(input).change();
    };

    return BinaryCounter;

  })();

  $(document).ready(function() {
    var app, binaryCounter, _log, _s_log;
    _.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g
    };
    app = {};
    app.models = [];
    app.server = io.connect("/");
    console.log("Loading");
    _log = function(message) {
      return console.log(message);
    };
    _s_log = function(o) {
      return console.log(JSON.stringify(o));
    };
    app.showDisplay = function(message) {
      var _this = this;
      _log(message);
      $("table#displayList").empty();
      return $.each(message, function(key, display) {
        var model;
        model = new Display(display, {
          socket: app.server
        });
        app.models.push(model);
        return new DisplayRowView({
          model: model,
          el: $("table#displayList")
        });
      });
    };
    app.server.on("connect", function() {
      return _log("Connected to the server" + arguments);
    });
    app.server.emit("controlRegister");
    app.server.on("showDisplayList", app.showDisplay);
    app.server.on("message", function(data) {
      return _log("Received message: " + data.message);
    });
    $("table#displayList").sortable({
      items: "tr",
      handle: "span.badge"
    });
    binaryCounter = new BinaryCounter($("table#displayList"), $("input#speed"));
    $('button#startStopBinary').click(function() {
      var value;
      value = $('button#startStopBinary').text();
      if (value === 'start') {
        binaryCounter.start();
        return $('button#startStopBinary').text('stop');
      } else {
        binaryCounter.stop();
        return $('button#startStopBinary').text('start');
      }
    });
    return window.app = app;
  });

}).call(this);
