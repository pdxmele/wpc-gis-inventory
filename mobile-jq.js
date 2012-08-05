// Start with the map page
window.location.replace(window.location.href.split("#")[0] + "#mappage");

var selectedFeature = null;

$(document).ready(function() {

    // fix height of content
    function fixContentHeight() {
        var footer = $("div[data-role='footer']:visible"),
            content = $("div[data-role='content']:visible:visible"),
            viewHeight = $(window).height(),
            contentHeight = viewHeight - footer.outerHeight();

        if ((content.outerHeight() + footer.outerHeight()) !== viewHeight) {
            contentHeight -= (content.outerHeight() - content.height() + 1);
            content.height(contentHeight);
        }

        if (window.map && window.map instanceof OpenLayers.Map) {
            map.updateSize();
        } else {
            // initialize map
            init(function(feature) { 
                selectedFeature = feature; 
                $.mobile.changePage("#popup", "pop"); 
            });
            initLayerList();
        }
    }
    $(window).bind("orientationchange resize pageshow", fixContentHeight);
    document.body.onload = fixContentHeight;

    // Map zoom  
    $("#plus").click(function(){
        map.zoomIn();
    });
    $("#minus").click(function(){
        map.zoomOut();
    });
    $("#locate").click(function(){
        var control = map.getControlsBy("id", "locate-control")[0];
        if (control.active) {
            control.getCurrentLocation();
        } else {
            control.activate();
        }
    });
    
    $('#popup').live('pageshow',function(event, ui){
        for (var attr in selectedFeature.attributes){
            if (attr == "id") {
                document.getElementById("cornerID").innerHTML = selectedFeature.attributes[attr];
            }
            if (attr == "c_direct"){
                document.getElementById("direction").innerHTML = selectedFeature.attributes[attr];
            }
            if (attr == "st_lf_nm"){
                document.getElementById("streetR").innerHTML = selectedFeature.attributes[attr];
            }
            if (attr == "st_rt_nm"){
                document.getElementById("streetL").innerHTML = selectedFeature.attributes[attr];
            }
        }
        
    });

});

function initLayerList() {
    $('#layerspage').page();
    $('<li>', {
            "data-role": "list-divider",
            text: "Base Layers"
        })
        .appendTo('#layerslist');
    var baseLayers = map.getLayersBy("isBaseLayer", true);
    $.each(baseLayers, function() {
        addLayerToList(this);
    });

    $('<li>', {
            "data-role": "list-divider",
            text: "Overlay Layers"
        })
        .appendTo('#layerslist');
    var overlayLayers = map.getLayersBy("isBaseLayer", false);
    $.each(overlayLayers, function() {
        addLayerToList(this);
    });
    $('#layerslist').listview('refresh');
    
    map.events.register("addlayer", this, function(e) {
        addLayerToList(e.layer);
    });
}

function addLayerToList(layer) {
    var item = $('<li>', {
            "data-icon": "check",
            "class": layer.visibility ? "checked" : ""
        })
        .append($('<a />', {
            text: layer.name
        })
            .click(function() {
                $.mobile.changePage('#mappage');
                if (layer.isBaseLayer) {
                    layer.map.setBaseLayer(layer);
                } else {
                    layer.setVisibility(!layer.getVisibility());
                }
            })
        )
        .appendTo('#layerslist');
    layer.events.on({
        'visibilitychanged': function() {
            $(item).toggleClass('checked');
        }
    });
}