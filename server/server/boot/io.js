module.exports = function(app) {
    app.on('started', function() {
      app.io = require('socket.io').listen(app.server)
  
      let locations = [];

      app.io.on('connection', socket => {
          console.log('user is connected')
      
          socket.on('position', (location, userId) => {
            const ownerData = {...location, ...userId}
            locations.push(ownerData);
          })

          socket.emit('mapPositions', locations.map(a => {
             return {
                 latitude: a.latitude,
                 longitude: a.longitude
             }
          }));
          
          socket.on('disconnectUser', (userId) => {
            locations = locations.filter(a => a.userId !== userId) || [];
            socket.disconnect();
            console.log('user is disconnected');
          });
      });
    });
  }
