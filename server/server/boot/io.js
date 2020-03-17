module.exports = function(app) {
    app.on('started', function() {
      app.io = require('socket.io').listen(app.server)
  
      let locations = [];

      app.io.on('connection', socket => {
          console.log('user is connected')
      
          socket.on('position', (location, businessId) => {
            const ownerData = {...location, ...businessId}
            locations.push(ownerData);
          })

          socket.emit('mapPositions', locations.map(a => {
             return {
                 latitude: a.latitude,
                 longitude: a.longitude,
                 businessId: a.businessIds
             }
          }));
          
          socket.on('disconnectUser', (businessId) => {
            locations = locations.filter(a => a.businessIds !== businessId) || [];
            socket.disconnect();
            console.log('user is disconnected');
          });
      });
    });
  }
