// Single source of truth for the destination KB index name.
// Imported by both the ingest script (build-time) and the query tool (request-time)
// so they can never drift apart.
export const DESTINATIONS_INDEX = 'destinations'
