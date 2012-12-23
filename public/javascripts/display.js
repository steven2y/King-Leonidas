// Generated by CoffeeScript 1.4.0
(function() {

  $(document).ready(function() {
    var app, _log, _s_log;
    _.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g
    };
    app = {};
    app.server = io.connect("/");
    console.log("Loading");
    _log = function(message) {
      return console.log(message);
    };
    _s_log = function(o) {
      console.log(JSON.stringify(o));
      return {
        welcome: "<h1>" + message + "</h1>",
        user: "<div #user>{{userName}}</div>"
      };
    };
    app.server.on("connect", function() {
      _log("Connected to the server" + arguments);
      app.display = new Date().getTime();
      $("h1").text("display " + app.display);
      app.server.emit("displayRegister", app.display);
      app.server.on("message", function(data) {
        return _log("Received message: " + data.message);
      });
      return app.server.on("overlayMessage", function(data) {
        return $("#overlay").empty().text(data.message).addClass('show').css("font-size", $(window).height() + "px");
      });
    });
    $(window).resize(function() {
      return $("#overlay").css("font-size", $(window).height() + "px");
    });
    return window.app = app;
  });

}).call(this);