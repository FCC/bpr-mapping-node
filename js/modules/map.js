'use strict';

var layers = {
    deployment: require('./layers-deployment.js'),
    speed: require('./layers-speed.js'),
    providers: require('./layers-providers.js')
};

var Map = {
    init: function() {

        Map.createMap();

        // toggle map container width
        $('#map-container').on('click', '.control-full a', function() {
            $('header .container, header .container-fluid, main')
                .toggleClass('container container-fluid')
                .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
                    function(e) {
                        Map.map.invalidateSize();
                    });
        });

        //legend
        /*if (!mapOpts.legend) {
            $('.map-legend, .legend__icon').toggleClass('hide');
        }

        $('#btn-closeLegend').on('click', function(e) {
            e.preventDefault();
            $('.map-legend').hide('fast');
        });

        $('#btn-openLegend').on('click', function(e) {
            e.preventDefault();
            $('.map-legend').show('fast');
        });*/

    },
    createMap: function() {
            var map;
            // var mapData = Map.data;
            var initialzoom = 4;
            var maxzoom = 15;
            var minzoom = 3;
            var center_lat = 38.82;
            var center_lon = -94.96;
            var baseLayer = {};
            var layerControl;
            var layerPath = window.location.pathname.split('/')[1];
            var mapLayer = {};

            Map.geoURL = '/gwc/service/wms?tiled=true';
            Map.geo_space = 'fcc';

            L.mapbox.accessToken = 'pk.eyJ1IjoiY29tcHV0ZWNoIiwiYSI6InMyblMya3cifQ.P8yppesHki5qMyxTc2CNLg';
            map = L.mapbox.map('map-container', 'fcc.k74ed5ge', {
                    attributionControl: true,
                    maxZoom: maxzoom,
                    minZoom: minzoom,
                    zoomControl: true
                })
                .setView([center_lat, center_lon], initialzoom);

            var hash = L.hash(map);

            //base layers
            baseLayer.Street = L.mapbox.tileLayer('fcc.k74ed5ge').addTo(map);
            baseLayer.Satellite = L.mapbox.tileLayer('fcc.k74d7n0g');
            baseLayer.Terrain = L.mapbox.tileLayer('fcc.k74cm3ol');

            //get tile layers based on location pathname
            for (var layer in layers[layerPath]) {
                mapLayer[layer] = L.tileLayer.wms(Map.geoURL, layers[layerPath][layer]).setZIndex(11).addTo(map);
            }

            //layer control
            layerControl = L.control.layers(
                baseLayer, mapLayer, {
                    position: 'topleft'
                }
            ).addTo(map);

            Map.map = map;

            Map.geocoder = L.mapbox.geocoder('mapbox.places-v1');

        } //end createMap
}; //end MapLayers

module.exports = Map;
