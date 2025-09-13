if (!campgroundsGeoJSON.features.length) {
  console.warn("No valid campgrounds to display on the map.");
} else {
  maptilersdk.config.apiKey = maptilerApiKey;

  const map = new maptilersdk.Map({
    container: 'cluster-map',
    style: maptilersdk.MapStyle.DATAVIZ.BRIGHT, // You can change to SATELLITE, etc.
    center: campgroundsGeoJSON.features[0].geometry.coordinates, // initial center
    zoom: 5
  });

  map.on('load', () => {
    map.addSource('campgrounds', {
      type: 'geojson',
      data: campgroundsGeoJSON,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });

    // Cluster circles
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'campgrounds',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#00BCD4', 10, '#2196F3', 30, '#3F51B5'],
        'circle-radius': ['step', ['get', 'point_count'], 15, 10, 20, 30, 25]
      }
    });

    // Cluster labels
    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'campgrounds',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    });

    // Individual points
    map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'campgrounds',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 6,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });

    // Zoom to cluster on click
    map.on('click', 'clusters', async (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties.cluster_id;
      const zoom = await map.getSource('campgrounds').getClusterExpansionZoom(clusterId);
      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom
      });
    });

    // Click on single point: center map + show popup
    map.on('click', 'unclustered-point', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const { popUpMarkup } = e.features[0].properties;

      map.easeTo({ center: coordinates, zoom: map.getZoom() + 2 });

      new maptilersdk.Popup()
        .setLngLat(coordinates)
        .setHTML(popUpMarkup)
        .addTo(map);
    });

    map.on('mouseenter', 'clusters', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
      map.getCanvas().style.cursor = '';
    });
  });
}
