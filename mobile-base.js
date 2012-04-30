// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

// initialize map when page ready
var map;
var gg = new OpenLayers.Projection("EPSG:4326");
var sm = new OpenLayers.Projection("EPSG:900913");

var init = function (onSelectFeatureFunction) {

    var vector = new OpenLayers.Layer.Vector("Location range", {}); //must also take out vector mention below if remove

    var curbLayer = new OpenLayers.Layer.Vector("Demo curb", {
        styleMap: new OpenLayers.StyleMap({
            externalGraphic: "img/mobile-loc.png",
            graphicOpacity: 1.0,
            graphicWidth: 16,
            graphicHeight: 26,
            graphicYOffset: -26
        })
    });

    var curbs = getFeatures();
/*$.getJSON(
"http://pdxmele.cartodb.com/api/v1/sql?q=SELECT%20*%20FROM%20curb_ramps%20LIMIT%20100&format=geojson"/*,
function(geojson) {
$.each(geojson.features, function(i, feature) {
curbLayer.addGeoJSON(feature);
});*/

    curbLayer.addFeatures(curbs);

    var selectControl = new OpenLayers.Control.SelectFeature(curbLayer, {
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
            new OpenLayers.Layer.XYZ("MapBox Streets",
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
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize'
            }),
            /*new OpenLayers.Layer.Bing({
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
            curbLayer
        ],
        center: new OpenLayers.LonLat(-13656000, 5704000),
        zoom:17
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

    function getFeatures() {
        

        var features = 
//fail cartodb attempts
/*$.getJSON(
"http://pdxmele.cartodb.com/api/v1/sql?q=SELECT%20*%20FROM%20curb_ramps%20LIMIT%20100&format=geojson&callback=?",
function(geojson) {
$.each(geojson.features, function(i, feature) {
.addGeoJSON(feature);
})*/

//$.getJSON('http://pdxmele.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM curb_ramps LIMIT 100')

{
            "type": "FeatureCollection",
            "features": [
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [-13656000, 5704000]},
                    "properties": {"Name": "Example point", "Type":"Curb ramp", "Status":"Not surveyed"}}/*,
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [790300, 6573900]},
                    "properties": {"Name": "Marc Jansen", "Country":"Germany", "City":"Bonn"}},
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [568600, 6817300]},
                    "properties": {"Name": "Bart van den Eijnden", "Country":"Netherlands", "City":"Utrecht"}},
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [-7909900, 5215100]},
                    "properties": {"Name": "Christopher Schmidt", "Country":"United States of America", "City":"Boston"}},
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [-937400, 5093200]},
                    "properties": {"Name": "Jorge Gustavo Rocha", "Country":"Portugal", "City":"Braga"}},
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [-355300, 7547800]},
                    "properties": {"Name": "Jennie Fletcher ", "Country":"Scotland", "City":"Edinburgh"}},
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [657068.53608487, 5712321.2472725]},
                    "properties": {"Name": "Bruno Binet ", "Country":"France", "City":"Chambéry"}},
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [667250.8958124, 5668048.6072737]},
                    "properties": {"Name": "Eric Lemoine", "Country":"France", "City":"Theys"}},
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [653518.03606319, 5721118.5122914]},
                    "properties": {"Name": "Antoine Abt", "Country":"France", "City":"La Motte Servolex"}},
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [657985.78042416, 5711862.6251028]},
                    "properties": {"Name": "Pierre Giraud", "Country":"France", "City":"Chambéry"}},
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [742941.93818208, 5861818.9477535]},
                    "properties": {"Name": "Stéphane Brunner", "Country":"Switzerland", "City":"Paudex"}},
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [736082.61064069, 5908165.4649505]},
                    "properties": {"Name": "Frédéric Junod", "Country":"Switzerland", "City":"Montagny-près-Yverdon"}},
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [771595.97057525, 5912284.7041793]},
                    "properties": {"Name": "Cédric Moullet", "Country":"Switzerland", "City":"Payerne"}},
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [744205.23922364, 5861277.319748]},
                    "properties": {"Name": "Benoit Quartier", "Country":"Switzerland", "City":"Lutry"}},
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [1717430.147101, 5954568.7127565]},
                    "properties": {"Name": "Andreas Hocevar", "Country":"Austria", "City":"Graz"}},
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [-12362007.067301,5729082.2365672]},
                    "properties": {"Name": "Tim Schaub", "Country":"United States of America", "City":"Bozeman"}} */
            ]
        };

        var reader = new OpenLayers.Format.GeoJSON();

        return reader.read(features);
    }

};
