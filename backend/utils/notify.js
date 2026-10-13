function emitStaff(req, event, payload) {
  if (!req?.io) return;
  req.io.to("admin").emit(event, payload);
  req.io.to("staff").emit(event, payload);
}

function emitMechanic(req, mechanicId, event, payload) {
  if (!req?.io || !mechanicId) return;
  req.io.to(`mechanic-${mechanicId}`).emit(event, payload);
}

module.exports = { emitStaff, emitMechanic };
