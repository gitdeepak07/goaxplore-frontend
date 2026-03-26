import API from "../app/config/api";

const API_BASE = `${API}/api`;

export async function getBookedSlots(activityId: number, /*date string*/) {
  try {
    const res = await fetch(`${API_BASE}/slots/${activityId}`)
    const json = await res.json()

    // backend returns plain array
    const slots = Array.isArray(json) ? json : (json.data || [])

    return slots
      .filter((slot: any) => slot.capacity_available === 0)
      .map((slot: any) => slot.start_time)
  } catch {
    return []
  }
}

export async function createBooking(data: any) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Booking API failed")
  }

  return res.json()
}
