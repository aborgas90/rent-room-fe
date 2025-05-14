const ROOM_ID_KEY = "room_id";

/**
 * Simpan room_id booking ke localStorage
 * @param {string|number} roomId
 */
export function saveBookingRoomId(roomId) {
  if (!roomId) return;
  localStorage.setItem(ROOM_ID_KEY, String(roomId));
}

/**
 * Ambil room_id booking dari localStorage
 * @returns {string|null}
 */
export function getBookingRoomId() {
  return localStorage.getItem(ROOM_ID_KEY);
}

/**
 * Hapus room_id booking dari localStorage
 */
export function clearBookingRoomId() {
  localStorage.removeItem(ROOM_ID_KEY);
}
