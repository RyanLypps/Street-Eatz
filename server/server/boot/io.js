module.exports = function(app) {
    app.on('started', function() {
      app.io = require('socket.io').listen(app.server)
    
      app.io.on('connection', socket => {
          console.log('user is connected')
          socket.on('disconnect', () => console.log('user is disconnected'))
      });
    });
  }
