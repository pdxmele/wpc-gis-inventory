// My Bing API key. Please get your own at http://bingmapsportal.com/ and use that instead.
var apiKey = "Ao5Ew1XnxVey8Mh0jgfL32mbQN1pNLQoDv48u1r5BJrGsf8r0Bach7FYO5wTpbHl";

// initialize map when page ready
var map;
var gg = new OpenLayers.Projection("EPSG:4326");
var sm = new OpenLayers.Projection("EPSG:900913");

var init = function (onSelectFeatureFunction) {

    var vector = new OpenLayers.Layer.Vector("Location range", {});

    //unique styling so evaluated = y shows up differently
    var myStyleMap = new OpenLayers.StyleMap({pointRadius: 7});
    var lookup = {
      "y": {fillColor: "green"},
      "n": {fillColor: "orange"}
    }
    myStyleMap.addUniqueValueRules("default", "evaluated", lookup);

    var cartoDB = new OpenLayers.Layer.Vector("Corners", {
        projection: sm,
        strategies: [new OpenLayers.Strategy.BBOX(), 
            new OpenLayers.Strategy.Refresh({interval: 60000, force: true})],
            protocol: new OpenLayers.Protocol.Script({
            url: "http://pdxmele.cartodb.com/api/v2/sql",
            params: {q: "select * from corners", format: "geojson"},
            format: new OpenLayers.Format.GeoJSON({
                ignoreExtraDims: true
            }),
            callbackKey: "callback"
        }),
            styleMap: myStyleMap
    });

    var selectControl = new OpenLayers.Control.SelectFeature(cartoDB, {
        autoActivate:true,
        onSelect: onSelectFeatureFunction});

    var geolocate = new OpenLayers.Control.Geolocate({
        id: 'locate-control',
        geolocationOptions: {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 7000
        }
    });
    // create map
    map = new OpenLayers.Map({
        div: "map",
        theme: null,
        projection: sm,
        numZoomLevels: 18,
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            geolocate,
            selectControl
        ],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize'
            }),
            /*new OpenLayers.Layer.XYZ("MapBox Streets",
                [
                "http://a.tiles.mapbox.com/v3/mapbox.mapbox-streets/${z}/${x}/${y}.png",
                "http://b.tiles.mapbox.com/v3/mapbox.mapbox-streets/${z}/${x}/${y}.png",
                "http://c.tiles.mapbox.com/v3/mapbox.mapbox-streets/${z}/${x}/${y}.png",
                "http://d.tiles.mapbox.com/v3/mapbox.mapbox-streets/${z}/${x}/${y}.png"
                ], {
                    attribution: "Tiles &copy; <a href='http://mapbox.com/'>MapBox</a> | " + 
                        "Data &copy; <a href='http://www.openstreetmap.org/'>OpenStreetMap</a> " +
                        "and contributors, CC-BY-SA",
                    //sphericalMercator: true,
                    //wrapDateLine: true,
                    transitionEffect: "resize",
                    //buffer: 1,
                    numZoomLevels: 17
                    }
            ),
            new OpenLayers.Layer.Bing({
                key: apiKey,
                type: "Road",
                // custom metadata parameter to request the new map style - only useful
                // before May 1st, 2011
                metadataParams: {
                    mapVersion: "v1"
                },
                name: "Bing Road",
                transitionEffect: 'resize'
            }),*/
            new OpenLayers.Layer.Bing({
                key: apiKey,
                type: "Aerial",
                name: "Bing Aerial",
                transitionEffect: 'resize'
            }),
            new OpenLayers.Layer.Bing({
                key: apiKey,
                type: "AerialWithLabels",
                name: "Bing Aerial + Labels",
                transitionEffect: 'resize'
            }),
            vector,
            cartoDB
        ],
        center: new OpenLayers.LonLat(-13654000, 5705400),
        zoom:18
    });

    var style = {
        fillOpacity: 0.1,
        fillColor: '#000',
        strokeColor: '#f00',
        strokeOpacity: 0.6
    };
    geolocate.events.register("locationupdated", this, function(e) {
        vector.removeAllFeatures();
        vector.addFeatures([
            new OpenLayers.Feature.Vector(
                e.point,
                {},
                {
                    graphicName: 'cross',
                    strokeColor: '#f00',
                    strokeWidth: 2,
                    fillOpacity: 0,
                    pointRadius: 10
                }
            ),
            //after geolocates, draws a location range on the map
            new OpenLayers.Feature.Vector(
                OpenLayers.Geometry.Polygon.createRegularPolygon(
                    new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                    e.position.coords.accuracy / 2,
                    50,
                    0
                ),
                {},
                style
            )
        ]);
        map.zoomToExtent(vector.getDataExtent());
    });
};
