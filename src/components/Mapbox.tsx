import React, { useRef, useEffect, useState } from 'react'
import mapboxgl, { GeoJSONSource, LngLatBoundsLike } from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { bbox } from '@turf/turf'
import { Box } from '@chakra-ui/react'
import Gradient from 'javascript-color-gradient'
import 'mapbox-gl/dist/mapbox-gl.css'

import Sidebar from './Sidebar'
import { LngLat } from '../types'
import { DEFAULT_MODE, DEFAULT_ISO_OPACITY, MAPBOX_TOKEN, MAP_DEFAULT, EMPTY_GEOJSON, DEFAULT_API } from '../constants'
import { getRoute } from '../services/mapbox/routing'
import { FeatureCollection } from 'geojson'
const Mapbox = () => {
  const mapContainer = useRef(null)
  const [map, setMap] = useState<mapboxgl.Map>()
  const [loc, setLoc] = useState({
    lng: MAP_DEFAULT.location.lng,
    lat: MAP_DEFAULT.location.lat
  })
  const [params, setParams] = useState({
    api: DEFAULT_API,
    mode: (DEFAULT_MODE as string)
  })

  useEffect(() => {
    const container = mapContainer.current
    if (typeof window === 'undefined' || container === null) return

    const mapbox = new mapboxgl.Map({
      accessToken: MAPBOX_TOKEN,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: {
        lng: MAP_DEFAULT.location.lng,
        lat: MAP_DEFAULT.location.lat
      },
      container,
      zoom: MAP_DEFAULT.zoom
    })

    const marker = new mapboxgl.Marker({
      draggable: true
    }).setLngLat(MAP_DEFAULT.location).addTo(mapbox)
    marker.on('dragend', () => {
      console.log('On drag end')
      const lngLat = marker.getLngLat()
      setLoc(lngLat)
    })
    const end = new mapboxgl.Marker({ color: '#DD6B20' })
        
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      showUserLocation: false
    })
    geolocate.on('geolocate', pos => {
      const lngLat = {
        lng: (pos as GeolocationPosition).coords.longitude,
        lat: (pos as GeolocationPosition).coords.latitude
      }
      console.log('On geolocate')
      marker.setLngLat(lngLat)
      setLoc(lngLat)
    })
    mapbox.addControl(geolocate, 'bottom-right')
    mapbox.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

    // Map Events
    mapbox.on('load', () => {
      // Isochrone Layer
      addLayer(mapbox, 'iso', 'fill', {
        paint: {
          'fill-color': {
            type: 'identity',
            property: 'color'
          },
          'fill-opacity': {
            type: 'identity',
            property: 'opacity'
          }
        },
        layout: {
          visibility: 'visible'
        }
      })
      addLayer(mapbox, 'route', 'line', {
        paint: {
          'line-color': '#805AD5',
          'line-width': 5,
          'line-opacity': 0.75
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        }
      })
      mapbox.addLayer({
        id: 'route-label',
        type: 'symbol',
        source: 'route',
        layout: {
          'symbol-placement': 'line',
          'text-field': '{label}',
          'text-radial-offset': 0.5,
          'text-justify': 'auto',
          'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
        }
      })
      setMap(mapbox)
    })

    mapbox.on('click', (event) => {
      end.setLngLat(event.lngLat).addTo(mapbox)
      getRouteOnClick(mapbox, event.lngLat)
    })

    return () => {
      console.log('Removing map...')
      mapbox.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addLayer = (
    map: mapboxgl.Map,
    id: string,
    type: string,
    layerProps?: any,
    initData = EMPTY_GEOJSON
  ) => {
    map.addSource(id, {
      type: 'geojson',
      data: initData
    }).addLayer(
      {
        id: `${id}Layer`,
        source: id,
        type,
        ...layerProps
      }
    )
  }

  const getRouteOnClick = (map: mapboxgl.Map, coords: LngLat) => {
    if (!map) return
    getRoute({ mode: params.mode, src: loc, dst: coords}).then(route => {
      const src = map.getSource('route') as GeoJSONSource
      console.log(route)
      src.setData(route)
    })
  }

  useEffect(() => {
    const getAndSetIso = async () => {
      const url = `/api/isochrone?${new URLSearchParams({
        payload: JSON.stringify({
          center: loc,
          profile: params.mode
        }),
        api: params.api
      })}`
      const response = await fetch(url)
      if (!response.ok) {
        return
      }
      const data = await response.json()
      if (map && data.geojson) {
        const geojson = data.geojson as FeatureCollection
        // Assign colors
        const colorGradient = new Gradient()
        colorGradient.setGradient('#502ea8', '#e9446a')
        colorGradient.setMidpoint(geojson.features.length)
        const colors = colorGradient.getArray()
        geojson.features.forEach((feature, index) => {
          if (feature.properties) {
            feature.properties['color'] = colors[index]
            feature.properties['opacity'] = DEFAULT_ISO_OPACITY
          } 
        })
  
        // Set data
        const src = map.getSource('iso') as GeoJSONSource
        src.setData(geojson)
        map.fitBounds(bbox(geojson) as LngLatBoundsLike, {
          padding: 20
        })
      }
    }
    getAndSetIso()
  }, [map, loc, params])

  const toggleLayer = (layer: string, callbackOnVisible?: () => void) => {
    if (map) {
      const visible = map.getLayoutProperty(layer, 'visibility')
      if (visible !== 'visible' && callbackOnVisible) {
        callbackOnVisible()
      }
      map.setLayoutProperty(layer, 'visibility', visible === 'visible' ? 'none' : 'visible')
    }
  }

  return (
    <Box w='100%' h='100%'>
      <Box pos='absolute' p={4} float='left' zIndex={99}>
        <Sidebar
          params={params}
          setParams={setParams}
          toggleIso={() => toggleLayer('isoLayer')}
        />
      </Box>
      <Box w='100%' h='100%' ref={mapContainer} />
    </Box>
  )
}

export default Mapbox
