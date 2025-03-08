const { Server } = require('socket.io');

function initializeSocket(server) {
    const io = new Server(server, {
        cors: { origin: '*' }
    });

    io.on('connection', (socket) => {
        console.log('New WebSocket connection:', socket.id);

        socket.on('invoiceAdded', () => {
            io.emit('updateContacts');
        });

        socket.on('disconnect', () => {
            console.log('WebSocket disconnected:', socket.id);
        });
    });

    return io;
}

module.exports = initializeSocket;
