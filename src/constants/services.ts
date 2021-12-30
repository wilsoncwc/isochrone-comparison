import { getMapboxIso } from '../services/mapbox'
import { getTravelTimeIso } from '../services/traveltime'
import { getOPRIso } from '../services/openrouteservice'
import { Isochrone, IsoParams, TravelMode } from '../types'

interface IsoDetails {
  modes: TravelMode[];
  handler: (params: IsoParams) => Promise<Isochrone>
}

const DEFAULT_API = 'Mapbox'
const ISO_APIS: { [name: string]: IsoDetails } = {
  'Mapbox': {
    modes: [TravelMode.Walk, TravelMode.Cycle, TravelMode.Drive],
    handler: getMapboxIso
  },
  'TravelTime': {
    modes: [TravelMode.Walk, TravelMode.Cycle, TravelMode.Drive, TravelMode.Transport],
    handler: getTravelTimeIso
  },
  'OpenRouteService': {
    modes: [TravelMode.Walk, TravelMode.Cycle, TravelMode.Drive],
    handler: getOPRIso
  }
}
const modeSupported = (api: string, mode: string) => (ISO_APIS[api]?.modes as string[]).includes(mode)

export {
  DEFAULT_API,
  ISO_APIS,
  modeSupported
}
