var mapView = new ol.View ({
    center: ol.proj.fromLonLat([72.585717,23.021245]),
    zoom: 5
});

var map = new ol.Map ({
    target:'map',
    view : mapView
});

var osmTile = new ol.layer.Tile ({
    title: "Open Street Map",
    visble: true,
    type: 'base',
    source: new ol.source.OSM()
});

map.addLayer(osmTile);


var IndiaDsTile = new ol.layer.Tile({
    title: 'India Districts',
    source: new ol.source.TileWMS({

        url: 'http://localhost:8080/geoserver/"store"/wms',
        params: {'LAYERS':'	','TILED': true},
        server: 'geoserver',
        visible: true

    })

});

map.addLayer(IndiaDsTile);


var IndiaStTile = new ol.layer.Tile({
    title: 'India States',
    source: new ol.source.TileWMS({

        url: 'http://localhost:8080/geoserver//wms',
        params: {'LAYERS':'','TILED': true},
        server: 'geoserver',
        visible: true

    })

});

map.addLayer(IndiaStTile);


var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode : 'click',
    startActive: false,
    groupSelectStyle: 'children'
});

map.addControl(layerSwitcher);

var mousePosition = new ol.control.MousePosition({
    className:'mousePosition',
    projection: 'EPSG:4326',
    coordinateFormat: function(coordinate){return ol.coordinate.format(coordinate,'{y} ,{x}', 6) ;}
    });
    
map.addControl(mousePosition);

var scaleControl = new ol.control.ScaleLine({
    bar: true, 
    text: true
});
map.addControl(scaleControl);


var popup = new ol.Overlay ({
    element: container, 
    autoPan: true, 
    autoPanAnimation:{
        duration: 250,
    },
    });
    
    map.addOverlay (popup);
    
    closer.onclick = function(){
        popup.setPosition(undefined);
        closer.blur();
        return false;
    };
    
    map.on('singleclick', function (evt){
        content.innerHTML='';
        var resolution = mapView.getResolution();
    
        var url= IndiaDsTile.getSource().getFeatureInfoUrl(evt.coordinate, resolution, 'EPSG:3857', {
        'INFO FORMAT': 'application/json',
        'propertyName': 'state, district'
        });
    
        if (url){
            $.getJSON (url, function (data){
                var feature = data.features[0];
                var props = feature.properties;
                content.innerHTML = "<h3> State : </h3> <p>" + props.state.toUpperCase() +"</p> <br> <h3> District : </h3> <p>" + props.district.toUpperCase() + "</p>"; 
                 popup.setPosition(evt.coordinate);
            })
        } else {
            popup.setPosition(undefined);
        }    
    });

// autolocate
var intervalAutolocate;
var posCurrent;

var geolocation = new ol.Geolocation ({
trackingOptions: {

enableHighAccuracy: true, 
},
tracking: true,
projection: mapView.getProjection()
});
var positionFeature = new ol.Feature();
positionFeature.setStyle(
    new ol.style.Style({
        image: new ol.style.circle({ 
            radius: 6,
            fill: new ol.style.Fill({   
                color: '#3399CC'
            }),
            stroke: new ol.style.Stroke({ 
                color: '#fff',
                width: 2,
            }),
        }),
    }),
);
var accuracyFeature = new ol.Feature();
var currentPositionLayer = new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
        features: [accuracyFeature, positionFeature],
    }),
});

function startAutolocate(){
    var coordinates = geolocation.getPosition();
    positionFeature.setGeometry (coordinates ? new ol.geom.Point(coordinates) : null);
    mapView.setCenter(coordinates);
    mapView.setZoom(16);
    accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    intervalAutolocate = setInterval(function (){
        var coordinates = geolocation. getPosition();
        var accuracy = geolocation.getAccuracyGeometry();
        positionFeature.setGeometry(coordinates ? new ol.geom.Point (coordinates) : null); map.getView().setCenter (coordinates);
        mapView.setZoom(16);
        accuracyFeature.setGeometry(accuracy);
    },10000);
}

function stopAutolocate(){
    clearInterval (intervalAutolocate); 
    positionFeature.setGeometry(null);
    accuracyFeature.setGeometry (null);
}

//live location
$("#btncrosshair").on("click",function(event) {
    $("#btnCrosshair").toggleClass("clicked");
    if ($("#btnCrosshair").hasClass("clicked")){
        startAutolocate();
    } else {
        stopAutolocate();
    }
});
*/

var lengthButton = document.createElement ('button' );
lengthButton.innerHTML='<img src="" alt=" " style="width: 17px;height:17px;filter:brightness(0) invert(1); vertical-align"';
lengthButton.className = 'myButton';
lengthButton.id = 'lengthButton';

var lengthElement = document.createElement ('div');
lengthElement.className = 'lengthButtonDiv';
lengthElement.appendchild(lengthButton);

var lengthControl = new ol.control.Control({
    element: lengthElement
})

var lengthFlag = false;
lengthButton.addEventListener("click", () => {
     // disableOtherInteraction('lengthButton');
    lengthButton.classList.toggle('clicked');
    lengthFlag = !lengthFlag;
    document.getElementById("map").style.cursor = "default";
    if (lengthFlag){
        map.removeInteraction (draw);
        addInteraction('LineString');
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0) elements[0].remove();
    }
})
map.addControl(lengthControl);

var areaButton = document.createElement ('button');
areaButton.innerHTML='<img src=" " alt=" " style="width: 17px;height:17px;filter:brightness(0) invert(1); vertical-align"';
areaButton.className = 'myButton';
areaButton.id = 'areaButton';
 
var lareaElement = document.createElement ('div');
areaElement.className = 'areaButtonDiv';
areaElement.appendchild(areaButton);

var lengthControl = new ol.control.Control({
    element: areaElement
})

var areaFlag = false;
areaButton.addEventListener("click", () => {
     // disableOtherInteraction('lengthButton');
    areaButton.classList.toggle('clicked');
    areaFlag = !areaFlag;
    document.getElementById("map").style.cursor = "default";
    if (areaFlag){
        map.removeInteraction (draw);
        addInteraction('Polygon');
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0) elements[0].remove();
    }
})
map.addControl(areaControl);

/** 
 *Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = 'Click to continue polygon, Double click to complete';
/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
 var continueLineMsg = 'Click to continue line, Double click to complete';
 var draw; 
 var source = new ol.source.Vector();
var vector = new ol.layer.Vector ({
    source: source, 
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color:'rgba (255, 255, 255, 0.2)',
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33' ,
            width: 2,
        }),
        image: new ol.style.Circle({
            radius: 7, 
            fill: new ol.style.Fill({ 
                color: '#ffcc33',
            }),
        }),
    }),
});

map.addLayer(vector);

function addInteraction(intType) {

    draw = new ol.interaction.Draw({
        source: source,
        type: intType,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(200, 200, 200, 0.6)',
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10], 
                width: 2,
            }),
            image: new ol.style.Circle({
                radius: 5, 
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)',
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
            }),
        }),
    });
    map.addInteraction(draw);

    
    createMeasureTooltip();
    createHelpTooltip();

    /** 
     * Currently drawn feature.
     * @type {import("…./src/ol/Feature. js").default}
     */
    var sketch;
    /** 
     * Handle pointer move.
     * @param {import (" ../src/ol/MapBrowserEvent").default} evt The event.
     */
    var pointerMoveHandler = function (evt) {
        if (evt.dragging) {
            return;
        }
        /** @type {string} */
        var helpMsg = 'Click to start drawing'
        if (sketch) {
            var geom = sketch.getGeometry ();
        // if (geom instanceof ol.geom. Polygon) {
        //helpMsg - continuePolygonMsg;
        // } else if (geom instanceof o1. geom.LineString) {
        //helpMsg = continueLineMsg;
        //}
        //helpTooltipElement. innerHTML = helpMsg;
        //helpTooltip.setPosition(evt.coordinate);

        //helpTooltipElement.classList.remove('hidden');
        };

        map.on ('pointermove', pointerMoveHandler);
        // var listener;
        draw.on('drawstart', function (evt) {
        //set sketch
        sketch = evt.feature;
        /** @type {import(" ../src/ol/coordinate.js") .Coordinate |undefined} */
        var tooltipCoord = evt.coordinate;
        //listener = sketch.getGeometry).on('change', function (evt){
        sketch.getGeometry().on('change', function (evt) {
            var geom = evt.target;
            var output;
            if (geom instanceof ol.geom.Polygon) {
                output = formatArea (geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates ();
            } else if (geom instanceof ol.geom.LineString){
                output = formatLength (geom);
                tooltipCoord - geom.getLastCoordinate();
            }
            measureTooltipElement. innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
    });

    draw.on('drawend', function () {
        measureTooltipElement.className= 'ol-tooltip ol-tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        //unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
        //ol.Observable.unByKey(listener);
    });
}

/** 
* The help tooltip element.
* @type {HTMLElement}
*/ var helpTooltipElement;
/**
* Overlay to show the help messages.
* @type {Overlay}
*/ var helpTooltip;
/** 
    * Creates a new help tooltip
    */
    function createHelpTooltip() {
        if (helpTooltipElement) {
            helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'ol-tooltip hidden'
        helpTooltip = new ol.Overlay ({
            element: helpTooltipElement,
            offset: [15, 0], 
            positioning:'center-left',
        });
        map.addOverlay(helpTooltip);
    }
    map.getviewport().addEventListener('mouseout',function(){
        helpTooltipElement.classList.add('hidden');
    });

    /**
     * the measure tooltip element
     * @type {HTMLElement}
     */
    var measureTooltipElement;

    /**
     * @type {Overlay}
     */
    var measureTooltip;
    function createMeasureTooltip() {
        if (measureTooltipElement) {
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement ('div');
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
        measureTooltip = new ol.Overlay ({
            element: measureTooltipElement, 
            offset: [0, -15],
            positioning: 'bottom-center',
        });
        map.addOverlay(measureTooltip);
    }

/**
* @param {LineString} line The line.
* @return {string} The formatted length.
*/
var formatLength = function (line) {
    var length = ol.sphere.getLength(line);
    var output;
    if (length > 100) {
        output = Math.round( (length / 1000) * 100) / 100 +' '+ 'km';
    } else {
        output = Math.round(length * 100) / 100 +' '+'m';
    }
    return output;
}
/**
* @param {Polygon} polygon The polygon.
* @return {string} The formatted area.
*/
var formatArea = function (polygon) {
    var area = o1.sphere.getArea(polygon);
    var output;
    if (area > 18000){
        output = Math.round( (area / 1000000) * 100) / 100 +' '+ 'km<sup>2</sup>';
    } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
    }
    return output;
};

}
