// io.on('connection', (socket) => {
//   console.log(`Connected: ${socket.id}`);

//   // Store astrologer's socket ID
//   socket.on("register-astrologer", (astrologerId) => {
//     astrologerSocketMap[astrologerId] = socket.id;
//     console.log(`Astrologer ${astrologerId} registered with socket ${socket.id}`);
//   });

//   // Clean up on disconnect
//   socket.on('disconnect', () => {
//     // Remove astrologer from map (reverse lookup if needed)
//     for (const [id, sockId] of Object.entries(astrologerSocketMap)) {
//       if (sockId === socket.id) {
//         delete astrologerSocketMap[id];
//         break;
//       }
//     }
//     console.log(`Disconnected: ${socket.id}`);
//   });
// });
