///////////////////////////
//var IPADDR = 'http://127.0.0.1:8080' 8.1
var data1;
var IPADDR = 'http://119.23.128.14:8080'
//////////////////////////////
var tips = $("#tips");
var overview=$("#overview");
var searchIcon = $("#search_title_icon");
var searchContainer = $("#searchContainer");
////////////////////////query///////////////////
var queryType = {"click": 1, "name": 2, "area": 3, "multi": 4, "modify": 5,"statistic":6};
var currentType = -1;
var clickQuery = $("#clickQuery");
var nameQuery = $("#nameQuery");
var areaQuery = $("#areaQuery");
var multiQuery = $("#multiQuery");
var currentQueryConditionItem = $("#currentQueryCondition");
var createNewItem = $("#createNewItem");
var modifyItem = $("#modifyItem");

var static_county = $("#statistic_county")
var static_town = $("#statistic_town")
var infoStatistics = $("#infoStatistics");
var fishEnv = $("#fishEnv");
var line = $("#line");

var nameQueryButton = $("#nameQueryBT");

var debug;
var features;
var newFeature;
var modified = false;
///////////////////////地图图层相关////////////////
//新增图形的画笔
var draw;
var select = null;
// select interaction working on "click"
var selectClick = new ol.interaction.Select({
    condition: ol.events.condition.click,
    multi: true
});
var modify = new ol.interaction.Modify({
    features: selectClick.getFeatures()
});
modify.on('modifyend', function (e) {
    console.log("feature id is", e.features.getArray()[0].getId());
    modified = true;
    //editTransaction('update',editFeature,formatEditGML);
});
var activateStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 0, 0, 0.2)'
    }),
    stroke: new ol.style.Stroke({
        color: '#ff0000',
        width: 4
    })
});
var normalStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 0, 0, 0)'
    }),
    stroke: new ol.style.Stroke({
        color: '#ff0000',
        width: 4
    })
});
// select interaction working on "pointermove"
var selectPointerMove = new ol.interaction.Select({
    condition: ol.events.condition.pointerMove,
    style: activateStyle
    //multi: true
});

select = selectPointerMove;

var checkedFeature;
var checkedTableTR;
///////////////////////////////////////////////////

///////////////////////地图图层和Source/////////////////////////
var sourceEditWFS;
var layerEditWFS;
var editFeature;

var sourceAddWFS;
var layerAddWFS;
var addFeature;

var clientVectorLayer;
var clientVectorSource;
///////////////////////////////////////////////////////
function click2Query(type) {
    //map.removeLayer(layerWFS);
    //map.addLayer(layers[1]);

    currentType = type.data.type;
    console.log(type.data.type);
    if (currentType == queryType.click) {
        tips.hide();
        checkStatusin("check11");
        //currentQueryConditionItem.html("点击检索<span class=\"caret\"></span>");
    } else if (currentType == queryType.name) {
        //currentQueryConditionItem.html("按养殖户检索<span class=\"caret\"></span>");
        checkStatusin("check12");
        showSearch();
        
    } else if (currentType == queryType.area) {
        //currentQueryConditionItem.html("按养殖面积检索<span class=\"caret\"></span>");
        checkStatusin("check13");
        showSearch();
    } else if (currentType == queryType.multi) {
        //currentQueryConditionItem.html("多重条件检索<span class=\"caret\"></span>");
        showSearch();
    }
    //fix the bug which make the currentItem's width change when it's caption changed
    moveLine(currentQueryConditionItem);
}
///////////////////////end query///////////////
var map = null;
var layers;
var overlay;
var center = [120.8106659916, 30.7506028097];
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var xiangzhenSource ;
 var xiangzhenVec;

function initialMape() {
    /*
     var baseMap = new ol.layer.Tile({
     source: new ol.source.OSM()
     });
     */
    /**
     * wfs方式加载渔区图层
     * @type {ol.source.Vector}
     */
        //sources
    var wmsSource = new ol.source.TileWMS({
            url: IPADDR + '/geoserver/WebGIS/wms',
            params: {'LAYERS': 'nanhu'}
        });
    clientVectorSource = new ol.source.Vector({wrapX: false});

    //layers
    var tian_di_tu_satellite_layer = new ol.layer.Tile({
        title: "tiandituLayer",
        source: new ol.source.XYZ({
            url: 'http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}'
        })
    });
    // var boundarySource = new ol.source.TileWMS({
    //     url: IPADDR + '/geoserver/WebGIS/wms',
    //     params: {'LAYERS': 'xiangzhen'}
    // });
    // var boundaryLayer = new ol.layer.Tile({
    //     title: "boundaryLayer",
    //     source: boundarySource
    // });
    var fishLayer = new ol.layer.Tile({
        title: "fishwmsLayer",
        source: wmsSource
    });
    clientVectorLayer = new ol.layer.Vector({
        title: "queryFishLayer",
        source: clientVectorSource,
        style: normalStyle
    });
    // //乡镇边界WFS服务
    // xiangzhenSource = new ol.source.Vector({
    //     format: new ol.format.GeoJSON(),
    //     url: function (extent) {
    //         return 'http://119.23.128.14:8080/geoserver/jiashanFish/wfs?service=WFS&' +
    //             'version=1.1.0&request=GetFeature&typename=jiashanFish:xiangzhen&' +
    //             'outputFormat=application/json&srsname=EPSG:4326&' +
    //             'bbox=' + extent.join(',') + ',EPSG:4326';
    //     },
    //     strategy: ol.loadingstrategy.bbox
    // });
    // xiangzhenVec = new ol.layer.Vector({
    //     source: xiangzhenSource,
    //     style: new ol.style.Style({
    //         stroke: new ol.style.Stroke({
    //             color: 'rgba(255, 255,255, 0.1)',
    //             width: 0
    //         })
    //     })
    // });
    // layers = [tian_di_tu_satellite_layer, boundaryLayer, fishLayer, clientVectorLayer];
    layers = [tian_di_tu_satellite_layer, fishLayer, clientVectorLayer];
     var views = new ol.View({
        projection: 'EPSG:4326',
        center: center,
        zoom: 12,
        minZoom:11,
        maxZoom:18
    });

    map = new ol.Map({
        layers: layers,
        target: document.getElementById('map'),
        projection: 'EPSG:4326',
        view: views
    });


    overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));
    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };
    map.addOverlay(overlay);
    //////////////////////////////////draw////////////////////////
    // global so we can remove it later
    var value = "Polygon";

    function addInteractions() {
        var value = "Polygon";
        if (value !== 'None') {
            var geometryFunction, maxPoints;
            if (value === 'Square') {
                value = 'Circle';
                geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
            } else if (value === 'Box') {
                value = 'LineString';
                maxPoints = 2;
                geometryFunction = function (coordinates, geometry) {
                    if (!geometry) {
                        geometry = new ol.geom.Polygon(null);
                    }
                    var start = coordinates[0];
                    var end = coordinates[1];
                    geometry.setCoordinates([
                        [start, [start[0], end[1]], end, [end[0], start[1]], start]
                    ]);
                    return geometry;
                };
            }

            //map.addInteraction(draw);

        }
    }

    addInteractions();

    ////////////////////////////////////////////////
    /**
     * Add a click handler to the map to render the popup.
     */
    map.on('singleclick', function (evt) {
        if (currentType == queryType.click) {
            debug = evt;
            var viewResolution = /** @type {number} */ (views.getResolution());
            var coordinate = evt.coordinate;
            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
            var url = wmsSource.getGetFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:4326', {'INFO_FORMAT': 'text/html'});
            if (url) {
                querProperty($("#popup-content"), url, coordinate);
            }
        } else if (currentType == queryType.modify) {
            debug = evt;
            var viewResolution = /** @type {number} */ (views.getResolution());
            var coordinate = evt.coordinate;
            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
            var url = wmsSource.getGetFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:4326', {'INFO_FORMAT': 'text/html'});
            if (url) {
                console.log("url is："+url);
                querID(url);
            }
        }
    });
    ///
    var selectedID;
    var selectedFeature;
    if (select !== null) {
        map.addInteraction(select);

        select.on('select', function (e) {
            if (e.selected.length > 0) {
                var featureID = e.selected[0].getId();
                //activateStyle = e.selected[0].getStyle();
                selectedID = featureID;
                if (typeof(featureID) != "undefined") {
                    selectedFeature = e.selected[0];
                    //selectedFeature.setStyle(activateStyle)
                    jump2Table(featureID, true);
                }
                //console.log(featureID);
            } else if (e.deselected.length > 0) {
                //var featureID = e.selected[0].getId();
                var featureID = selectedFeature
                selectedID = featureID;
                if (typeof(featureID) != "undefined") {
                    jump2Table(selectedID, false);
                    //selectedFeature.setStyle(normalStyle)
                }
                //console.log(selectedID);
            }
        });

    }
}
//initial map end
function LayerControllor(action) {
    //恢复视野
    // var views = new ol.View({
    //     projection: 'EPSG:4326',
    //     center: [120.79828, 30.97123],
    //     zoom: 11
    // });
    // map.setView(views);
    if (action != infoStatistics ){
        
        map.removeLayer(xiangzhenVec);
        //TODO clear
        for(i=0;i<10;i++){
            $("#"+i).hide();
        }
        $("#qxyytjContainer").remove();
    }
    //图层控制
    if (action == currentQueryConditionItem) {
        checkStatus("check1");
        //queryVectorSource.clear();
        map.addLayer(clientVectorLayer);
        //点击查询
        clientVectorLayer.setVisible(true);
        clientVectorSource.clear();
        map.removeInteraction(selectClick);
        map.removeInteraction(modify);
        map.removeInteraction(interactionSnap);
        map.removeInteraction(draw);

        //sourceAddWFS.clear();
        //sourceEditWFS.clear();

    } else if (action == createNewItem) {
        checkStatus("check2");
        map.removeInteraction(selectClick);
        map.removeInteraction(modify);
        map.removeInteraction(interactionSnap);
        clientVectorLayer.setVisible(true);
        clientVectorSource.clear();
        
        //queryVectorSource.clear();
        //map.removeLayer(clientVectorLayer);
        //map.removeLayer(layerEditWFS);
    } else if (action == modifyItem) {
        checkStatus("check3");
        clientVectorLayer.setVisible(true);
        map.removeInteraction(draw);
        //queryVectorSource.clear();
        //map.removeLayer(clientVectorLayer);
        //map.removeLayer(layerAddWFS);
    } else {
        checkStatus("check4");
        map.removeInteraction(draw);
        map.removeInteraction(modify);
        map.removeInteraction(interactionSnap);

        clientVectorSource.clear();
        clientVectorLayer.setVisible(false);
        //map.removeLayer(clientVectorLayer);
    }
}

var formatEditWFS = new ol.format.WFS();
var formatEditGML = new ol.format.GML({
    featureNS: 'http://www.vge.org/webgis',
    featurePrefix: 'WebGIS',
    featureType: ['nanhu'],
    //srsName: 'EPSG:4326'
});
function addEditLayer() {
    clientVectorSource.clear();
    map.addInteraction(selectClick);
    selectClick.on('select', function (e) {
        console.log("selected")
        if (e.selected.length > 0) {
            var featureID = e.selected[0].getId();
            //activateStyle = e.selected[0].getStyle();
            selectedID = featureID;
            //alert(featureID);
            if (typeof(featureID) != "undefined") {
                //jump2Table(featureID, true);
                var coordinate = e.selected[0].getGeometry().getLastCoordinate();
                editFeature = e.selected[0];
                // alert(editFeature);
                popEditOptions(featureID, coordinate);
            }
            //console.log(featureID);
        } else if (e.deselected.length > 0) {
            //var featureID = e.selected[0].getId();
            console.log("deselected");
            if (modified) {
                editTransaction('update', editFeature, formatEditGML);
            }
            selectedID = featureID;
            if (typeof(featureID) != "undefined" && currentType != queryType.modify) {
                jump2Table(selectedID, false);
            }
            //console.log(selectedID);
        }
    });
}
function popEditOptions(gid, coordinate) {
    var editOptionHTML = '<div class="btn-group">'
    editOptionHTML += '<button id="edit_delete" type="button" class="btn btn-lg btn-danger" onclick="doEdit(this)">删除 </button>';
    editOptionHTML += '<button id="edit_bound" type="button" class="btn  btn-lg btn-default" onclick="doEdit(this)">修改边界</button>'
    editOptionHTML += '<button id="edit_property" type="button" class="btn  btn-lg btn-default" onclick="doEdit(this)">编辑属性</button> </div>';
    $("#popup-content").html(editOptionHTML);
    overlay.setPosition(coordinate);
}
//
var interactionSnap
function doEdit(obj) {


    var Jobj = $(obj);
    var id = Jobj.attr("id");
    if (id == "edit_delete") {
        var del = confirm("确认删除么？将无法撤销或恢复！");
        if(del){
            editTransaction("delete", editFeature, formatEditGML);
        }else{
            return;
        }
        
    } else if (id == "edit_bound") {
        modified = false;
        interactionSnap = new ol.interaction.Snap({
            source: clientVectorSource
        });
        map.addInteraction(modify);
        map.addInteraction(interactionSnap);

    } else if (id == "edit_property") {
        editProperty();
    }
    overlay.setPosition(undefined);
}
//执行编辑（删除、更新）操作
function editTransaction(mode, f, formatGML) {
    var node;
    switch (mode) {
        case 'insert':
            node = formatEditWFS.writeTransaction([f], null, null, formatGML);
            break;
        case 'update':
            node = formatEditWFS.writeTransaction(null, [f], null, formatGML);
            break;
        case 'delete':
            node = formatEditWFS.writeTransaction(null, null, [f], formatGML);
            //clientVectorSource.removeFeature(f);
            break;
    }
    var xs = new XMLSerializer();
    if (mode == 'update') {
        node = revertLonAndLat(node);
    }
    var payload = xs.serializeToString(node);
    console.log("payload is:" + payload);
    $.ajax(IPADDR + '/geoserver/WebGIS/wfs', {
        type: 'POST',
        dataType: 'xml',
        //typename: 'fish',
        typename: 'nanhu',
        processData: false,
        contentType: 'text/xml',
        data: payload
    }).done(function (data) {
        //刷新WMS
        console.log(data);
        clientVectorSource.clear();
        layers[1].getSource().updateParams({"time": Date.now()});
        if (mode == "delete") {
            toast("删除成功", 2000);
        } else if (mode = "update") {
            toast("编辑边界成功", 2000);
            modified = false;
        }
    }).error(function () {
        if (mode == "delete") {
            toast("删除失败", 2000);
        } else if (mode = "update") {
            toast("编辑边界失败", 2000);
            modified = false;
        }
    })
};
function revertLonAndLat(node) {
    var pointList = node.getElementsByTagName('posList');
    var pointString = pointList[0].innerHTML;

    var pointArr = pointString.split(" ");
    var revertString = "";
    for (i = 0; i < pointArr.length - 1; i += 2) {
        if (i != 0) {
            revertString += (" " + pointArr[i + 1]);
            revertString += (" " + pointArr[i]);
        } else {
            revertString += (pointArr[i + 1]);
            revertString += (" " + pointArr[i]);
        }
    }
    console.log(revertString);
    pointList[0].innerHTML = revertString;
    var xs = new XMLSerializer();
    var payload = xs.serializeToString(node);
    console.log("function payload is:" + payload);
    return node;
}
//新增后显示增加
function editProperty() {
    isPropertyDivShow = true;
    $("#propertyArea").show()
    myLayout();
    var mapWidth = mapDiv.width();
    var mapHeight = mapDiv.height();
    map.setSize([mapWidth, mapHeight]);
    $("#propertyTable").html("");

    var property = editFeature.getProperties();
    var name = property.name;
    //var gid = property.gid;
    var gid = editFeature.getId();
    gid = gid.substr(6, gid.length)
    var area = property.area;
    var address = property.address;
    var description = property.description;
    var tableHTML = '<tr><td><label for=\"nameInput\">编号</label></td><td><input type=\"text\" class=\"form-control\" id=\"editFeatureID\" placeholder=\"\" disabled="true"　readOnly="true" value="' + gid + '"></td></tr>';
    tableHTML += ('<tr><td><label for=\"nameInput\">名称</label></td><td><input type=\"text\" class=\"form-control\" id=\"editNameInput\" placeholder=\"\"value="' + name + '"></td></tr>');
    tableHTML += ('<tr><td><label for=\"nameInput\">面积</label></td><td><input type=\"text\" class=\"form-control\" id=\"editAreaInput\" placeholder=\"\"disabled="true"　readOnly="true" value="' + area + '"></td></tr>');
    tableHTML += ('<tr><td><label for=\"nameInput\">地址</label></td><td><input type=\"text\" class=\"form-control\" id=\"editPinzhongInput\" placeholder=\"\"value="' + address + '"></td></tr>');
    // tableHTML += ('<tr><td><label for=\"nameInput\">类型</label></td><td><select class=\"form-control\" id=\"editTypeInput\"><option value="违建">违建</option><option value="未归类">未归类</option></select></td></tr>');
    tableHTML += ('<tr><td><label for=\"nameInput\">描述</label></td><td><input type=\"text\" class=\"form-control\" id=\"editTypeInput\" placeholder=\"\"value="' + description + '"></td></tr>');
    tableHTML += ('<tr><td colspan="2"><button id="updateFishBt" type="submit" class="btn btn-default" style="float:right" onclick="updateEdit()">确定</button></td></tr>');
    $("#propertyTable").html(tableHTML);
    //$('#editTypeInput').attr('value',leixing);
    $("#editTypeInput ").val(description);
}
function ssxz() {
    var mdata = {
        data: JSON.stringify({
            "gid": 1,
            "address": '日本',
        })
    }
    $.ajax({
        type: 'post',
        url: './api/initialssxz',
        data: mdata,
        success: function (data) {
            alert(data);
        },
        error: function (data) {
            alert("error" + data);
        }
    });
}
function updateEdit() {
    var description=$("#editTypeInput").val();
    var gid = $("#editFeatureID").val();
    var name = $("#editNameInput").val();
    var area = $("#editAreaInput").val();
    var address = $("#editPinzhongInput").val();
    //var type = $("#editTypeInput").val();
    var mdata = {
        data: JSON.stringify({
            "gid": gid,
            "name": name,
            "area": area,
            "address": address,
            "description": description
        })
    }
    $.ajax({
        type: 'post',
        url: './api/modify',
        data: mdata,
        success: function (data) {
            isPropertyDivShow = false;
            $("#propertyArea").hide()
            myLayout();
            var mapWidth = mapDiv.width();
            var mapHeight = mapDiv.height();
            map.setSize([mapWidth, mapHeight]);
            toast("编辑属性成功", 2000);
        },
        error: function () {
            isPropertyDivShow = false;
            $("#propertyArea").hide()
            myLayout();
            var mapWidth = mapDiv.width();
            var mapHeight = mapDiv.height();
            toast("编辑属性失败", 2000);
        }
    });
}
var formatWFS = new ol.format.WFS();
    var formatGML = new ol.format.GML({
        featureNS: 'http://www.vge.org/webgis',
        featurePrefix: 'WebGIS',
        featureType: ['nanhu'],
        //srsName: 'EPSG:4326'
    });
///////////////
function addCreateLayer() {
    clientVectorSource.clear();
    // var formatWFS = new ol.format.WFS();
    // var formatGML = new ol.format.GML({
    //     featureNS: 'http://www.vge.org',
    //     featurePrefix: 'jiashanFish',
    //     featureType: ['fish'],
    //     //srsName: 'EPSG:4326'
    // });
    var xs = new XMLSerializer();
    /*
     sourceAddWFS = new ol.source.Vector({
     loader: function (extent) {
     $.ajax(IPADDR + '/geoserver/jiashanFish/wfs', {
     type: 'GET',
     data: {
     service: 'WFS',
     version: '1.1.0',
     request: 'GetFeature',
     typename: 'fish',
     //                srsname: 'EPSG:4326',
     bbox: extent.join(',') + ',EPSG:4326'
     }
     }).done(function (response) {
     showModal('正在绘制wfs图层，请稍后...');
     sourceAddWFS.addFeatures(formatWFS.readFeatures(response));
     hideModal();
     });
     },
     //strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ()),
     strategy: ol.loadingstrategy.bbox,
     projection: 'EPSG:4326'
     });
     */

    /*
     layerAddWFS = new ol.layer.Vector({
     title:"addFishLayer",
     source: sourceAddWFS,
     style: new ol.style.Style({
     stroke: new ol.style.Stroke({
     color: 'rgba(0, 0, 255, 1.0)',
     width: 2
     })
     })
     });
     */

    //
    //wfs-t
    var dirty = {};
    var transactWFS = function (mode, f) {
        var node;
        switch (mode) {
            case 'insert':
                node = formatWFS.writeTransaction([f], null, null, formatGML);
                break;
            case 'update':
                node = formatWFS.writeTransaction(null, [f], null, formatGML);
                break;
            case 'delete':
                node = formatWFS.writeTransaction(null, null, [f], formatGML);
                break;
        }
        var payload = xs.serializeToString(node);
        console.log("payload is:" + payload);

        $.ajax(IPADDR + '/geoserver/WebGIS/wfs', {
            type: 'POST',
            dataType: 'xml',
            //typename: 'fish',
            typename: 'nanhu',
            processData: false,
            contentType: 'text/xml',
            data: payload
        }).done(function (data) {
        data1=data;
            console.log(data);
//            var parser = new DOMParser();
//            var doc = parser.parseFromString(data, "text/xml");
//            console.log(doc);
            var insertID = data.getElementsByTagName("ogc:FeatureId")[0].getAttribute("fid");//暂时ogc:
            var gid = insertID.substr(insertID.indexOf(".") + 1, insertID.length);
            console.log("response id is:" + gid);
            //sourceAddWFS.clear();
            var coordinates = f.getGeometry().getCoordinates()[0];
            var sphere = new ol.Sphere(6378137);
            // var area_m = sphere.geodesicArea(coordinates[0]);
            var area_m = sphere.geodesicArea(coordinates);
            var area_666 = Math.abs(area_m / 666.66);
            area_666 = area_666.toFixed(2);
            console.log("area is:" + area_666);
            insertArea(gid, area_666);
            /*
            addNewFish(gid, area_666);
            //sourceAddWFS.clear();
            layers[2].getSource().updateParams({"time": Date.now()});
            hideModal();
            */
        });
    };
    function insertArea(gid,area){
         var mdata = {
        data: JSON.stringify({
            "gid": gid,
            "name": 'default',
            "area": area,
            "address": 'default',
            "description": 'default'
        })
    }
    $.ajax({
        type: 'post',
        url: './api/modify',
        data: mdata,
        success: function (data) {
            console.log("success"+data);
            toast("初始化面积成功", 1000);
             addNewFish(gid, area);
            
            //sourceAddWFS.clear();
            layers[1].getSource().updateParams({"time": Date.now()});
            //hideModal();

        },
        error: function (error) {
            console.log("error"+error);
            quxiao();
            toast("初始化面积失败", 1000);
        }
    });
    }
    /*
     var draw = new ol.interaction.Draw({
     source: layerWFS.getSource(),
     type: (value),
     geometryFunction: geometryFunction,
     maxPoints: maxPoints
     });
     */
    draw = new ol.interaction.Draw({
        type: 'Polygon',  //multipolygon修改为polygon，需要与geoserver一致
        geometryName: 'geom',
        source: clientVectorSource
    });
    draw.on('drawend', function (e) {
        newFeature = e;
        //计算面积
        //debug.feature.getGeometry().getArea()
        //showModal("图形入库", "正在执行图形入库操作，大约需要5秒，请稍后");
        transactWFS('insert', e.feature);
    });
    //map.removeLayer(layers[2]);
    //map.addLayer(layerAddWFS);
    map.addInteraction(draw);
}

//end of draw
var HH;
function querProperty(content, qurl, coordinate) {
    var mdata = {
        data: JSON.stringify({
            "url": qurl
        })
    }

    $.ajax({
        type: 'post',
        url: './api/query',
        data: mdata,
        success: function (data) {
            content.html(data);
            console.log(data);
            ///*
            var table = $(".featureInfo")[0];

            var ths = table.getElementsByTagName("th");
            var l = ths.length;
            // ths[l - 1].remove();
            ths[1].remove();
            ths[0].remove();

            var tds = table.getElementsByTagName("td");
            l = tds.length;
            // tds[l - 1].remove();
            tds[l-1].setAttribute("id", "tbimgurl");
            console.log($('#tbimgurl').text());
            var img = document.createElement("img");
            img.setAttribute("id", "floatImage");
            img.setAttribute("src", './static/images/upload/'+ $('#tbimgurl').text());
            $('#tbimgurl').text('');
            tds[l - 1].appendChild(img);
            tds[1].remove();
            tds[0].remove();
            //*/
            overlay.setPosition(coordinate);
        }
    });
}
//
function querID(qurl) {
    var mdata = {
        data: JSON.stringify({
            "url": qurl
        })
    }

    $.ajax({
        type: 'post',
        url: './api/id',
        data: mdata,
        success: function (id) {
            console.log(id);
            if (id != "none") {
                getFeatureByID(id)
            }
        }
    });
}

function mainMenuClick(item) {
    moveLine(item);
    LayerControllor(item);
    if (item != createNewItem && typeof(draw) != "undefined") {
        map.removeInteraction(draw);
    }
    isPropertyDivShow = false;
    $("#propertyArea").hide()
    myLayout();
    var mapWidth = mapDiv.width();
    var mapHeight = mapDiv.height();
    map.setSize([mapWidth, mapHeight]);
    //
    overlay.setPosition(undefined);
    closer.blur();
    /*
     if (item != currentQueryConditionItem) {
     currentType = -1;
     //隐藏掉右侧属性
     isPropertyDivShow = false;
     $("#propertyArea").hide()
     myLayout();
     var mapWidth = mapDiv.width();
     var mapHeight = mapDiv.height();
     map.setSize([mapWidth, mapHeight]);
     //隐藏掉检索面板
     //TODO
     searchContainer.hide();
     tips.hide();
     }else {
     searchContainer.hide();
     tips.show();
     }
     */
    if (item == currentQueryConditionItem) {
        searchContainer.hide();
        tips.show();
    } else {
        currentType = -1;
        searchContainer.hide();
        tips.hide();
    }
}
function startDraw() {
    clientVectorLayer.setVisible(true);
    moveLine(createNewItem);
    //showModal('正在请求wfs图层数据，请稍后...');
    addCreateLayer();
}

function modiSearch() {
    searchContainer.hide();
    tips.show();
}
function showSearch() {
    if (currentType != -1 && currentType != queryType.click) {
        if (currentType == queryType.name) {
            $("#nameQueryBlock").show();
            $("#areaQueryBlock").hide();
            $("#mutiQueryBlock").hide();
        } else if (currentType == queryType.area) {
            $("#nameQueryBlock").hide();
            $("#areaQueryBlock").show();
            $("#mutiQueryBlock").hide();
        } else if (currentType == queryType.multi) {
            $("#nameQueryBlock").show();
            $("#areaQueryBlock").show();
            $("#mutiQueryBlock").show();
        }
        searchContainer.show();
        tips.hide();
    } else {
        searchContainer.hide();
        tips.hide();
    }
}
function review(){
    //TODO release all
        clientVectorSource.clear();
        clientVectorLayer.setVisible(false);
        map.removeInteraction(selectClick);
        map.removeInteraction(modify);
        map.removeInteraction(interactionSnap);
        map.removeInteraction(draw);
     var views = new ol.View({
        projection: 'EPSG:4326',
        center: center,
        zoom: 12,
        minZoom:11,
        maxZoom:18
    });
    
    map.setView(views);
}
function moveLine(focusItem) {
    var jqueyObject = focusItem;
    var width = jqueyObject.innerWidth();
    var positionY = jqueyObject.offset().top;
    var postionX = jqueyObject.offset().left;
    focusItem.css("color","#ff9200");

    line.width(width);
    line.offset({left: postionX});
    //console.log("width is :" + width + ",positionX is:" + postionX + ",positionY is:" + positionY);
}
$(document).ready(new function () {
    //initialMape();
    var token = getCookie("token");
    if(token!=null){
        //TODO login`
    }else{

    }
    moveLine(currentQueryConditionItem);
    searchIcon.click(modiSearch);
    //复位按钮函数
    overview.click(review);
    tips.click(showSearch);
    clickQuery.click({"type": 1}, click2Query);
    nameQuery.click({"type": 2}, click2Query);
    areaQuery.click({"type": 3}, click2Query);
    multiQuery.click({"type": 4}, click2Query);
    static_county.click(statciByCounty);
    static_town.click(statciByTown)
    //
    nameQueryButton.click(query);
    //createNewItem.click(startDraw);
    createNewItem.bind("click", function () {
        mainMenuClick(createNewItem);
        startDraw();
    })
    modifyItem.bind("click", function () {
        mainMenuClick(modifyItem);
        currentType = queryType.modify;
        addEditLayer();
    })
    currentQueryConditionItem.bind("click", function () {
        mainMenuClick(currentQueryConditionItem);
    });
    infoStatistics.bind("click", function () {
        mainMenuClick(infoStatistics);
    });
    fishEnv.bind("click", function () {
        mainMenuClick(fishEnv);
    });
});
function mainLayout() {
    initialMape();
}

function query() {
    showModal("查询", "正在查询...")
    switch (currentType) {
        case 2:
            getFeatureByAttribute();
            break;
        case 3:
            queryBYArea();
            break;
        case 4:
            queryByMutiCondition();
            break;
    }
}
//
var checkedSelectedBt = $("#defaultTypeBt");
function getSelectType(type) {
    if (checkedSelectedBt != undefined) {
        checkedSelectedBt.removeClass("btn-primary");
        checkedSelectedBt.addClass("btn-default");
    }
    checkedSelectedBt = $(type);
    checkedSelectedBt.removeClass("btn-default");
    checkedSelectedBt.addClass("btn-primary");
    console.log(checkedSelectedBt.text());
}
//复合查询
function queryByMutiCondition() {
    var nameVal = $("#nameInput").val().trim();
    var minVal = $("#minValue").val().trim();
    var maxVal = $("#maxValue").val().trim();
    var leixingVal = checkedSelectedBt.text().trim();
    var f = ol.format.filter;
    var fc;
    if (nameVal != "") {
        //有姓名条件
        if ((minVal != "" && maxVal != "") && (minVal > 0 || minVal == 0) && (maxVal > minVal || maxVal == minVal)) {
            //有面积查询条件
            if (leixingVal != "") {
                //有类型查询条件
                fc = f.and(
                    //name area type
                    f.equalTo("name", nameVal),
                    f.between("area", minVal, maxVal),
                    f.equalTo("descrition", leixingVal)
                )
            } else {
                //无类型查询条件
                fc = f.and(
                    //name arear
                    f.equalTo("name", nameVal),
                    f.between("area", minVal, maxVal)
                )
            }
        } else {
            //无面积查询条件
            if (leixingVal != "") {
                //有类型查询条件
                fc = f.and(
                    f.equalTo("name", nameVal),
                    f.equalTo("description", leixingVal)
                )
            } else {
                //无类型查询条件
                fc = f.equalTo("name", nameVal);
            }
        }
    } else {
        //无姓名条件
        if ((minVal != "" && maxVal != "") && (minVal > 0 || minVal == 0) && (maxVal > minVal || maxVal == minVal)) {
            //有面积查询条件
            if (leixingVal != "") {
                //有类型查询条件
                fc = f.and(
                    f.between("area", minVal, maxVal),
                    f.equalTo("description", leixingVal)
                )
            } else {
                //无类型查询条件
                fc = f.between("area", minVal, maxVal);
            }
        } else {
            //无面积查询条件
            if (leixingVal != "") {
                //有类型查询条件
                fc = f.equalTo("description", leixingVal);
            } else {
                //无类型查询条件
                alert("至少选择一个查询条件");
            }
        }
    }

    // generate a GetFeature request
    var featureRequest = new ol.format.WFS().writeGetFeature({
        srsName: 'EPSG:4326',
        featureNS: 'http://www.vge.org/webgis',
        featurePrefix: 'WebGIS',
        featureTypes: ['nanhu'],
        outputFormat: 'application/json',
        filter: fc
    });
    console.log("name" + nameVal + "min" + minVal + "max" + maxVal);
    console.log("muti query " + new XMLSerializer().serializeToString(featureRequest));
    action(featureRequest);

}
//根据面积查询
function getFeatureByAttribute() {
    var name =$("#nameInput").val()+'*';
    var featureRequest = new ol.format.WFS().writeGetFeature({
        srsName: 'EPSG:4326',
        featureNS: 'http://www.vge.org/webgis',
        featurePrefix: 'WebGIS',
        featureTypes: ['nanhu'],
        outputFormat: 'application/json',
        filter: ol.format.filter.like('name', name)//修改
    });
    console.log(featureRequest);
    action(featureRequest);
}
function getFeatureByID(id) {
    var featureRequest = new ol.format.WFS().writeGetFeature({
        srsName: 'EPSG:4326',
        featureNS: 'http://www.vge.org/webgis',
        featurePrefix: 'WebGIS',
        featureTypes: ['nanhu'],
        outputFormat: 'application/json',
        filter: ol.format.filter.equalTo('gid', id)
    });
    fetch(IPADDR + '/geoserver/WebGIS/wfs', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
    }).then(function (response) {
        return response.json();
    }).then(function (json) {
        var GeoJSON = new ol.format.GeoJSON({
            geometryName: 'geom'
        });
        //var features = new ol.format.GeoJSON().readFeatures(json);
        var features = GeoJSON.readFeatures(json);
        debugFeature = features;
        //
        clientVectorLayer.setVisible(true);
        clientVectorSource.clear();
        clientVectorSource.addFeatures(features);
        map.getView().fit(clientVectorSource.getExtent(), /** @type {ol.Size} */ (map.getSize()));
    }).catch(function (error) {
        console.log(error)
    });
}

function queryBYArea() {
    var minVal = $("#minValue").val();
    var maxVal = $("#maxValue").val();
    console.log("min" + minVal + ",max" + maxVal);
    var f = ol.format.filter;
    var featureRequest = new ol.format.WFS().writeGetFeature({
        srsName: 'EPSG:4326',
        featureNS: 'http://www.vge.org/webgis',
        featurePrefix: 'WebGIS',
        featureTypes: ['nanhu'],
        outputFormat: 'application/json',
        filter: ol.format.filter.between("area", minVal, maxVal)
    });
    console.log(featureRequest);
    action(featureRequest);
}
var debugFeature;
function action(featureRequest) {
    fetch(IPADDR + '/geoserver/WebGIS/wfs', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
    }).then(function (response) {
        rs2 = response;
        return response.json();
    }).then(function (json) {
        //如果从编辑转过来，需要取消掉点击事件
        map.removeInteraction(selectClick);
        //rs2 = json;
        var features = new ol.format.GeoJSON().readFeatures(json);
        var fc = features.length;
        //showModal("绘制图形","共"+fc+"个图形，可能需要10秒左右");
        clientVectorSource.clear();
        clientVectorSource.addFeatures(features);
        map.getView().fit(clientVectorSource.getExtent(), /** @type {ol.Size} */ (map.getSize()));
        refreshDable(json)
        hideModal();
    }).catch(function (error) {
        hideModal();
        console.log(error)
        refreshDable("none")
        //alert(error);
    });
}
//新增后显示增加
function addNewFish(gid, area) {
    isPropertyDivShow = true;
    $("#propertyArea").show()
    myLayout();
    var mapWidth = mapDiv.width();
    var mapHeight = mapDiv.height();
    map.setSize([mapWidth, mapHeight]);
    $("#propertyTable").html("");

    var tableHTML = '<tr><td><label for=\"nameInput\">编号</label></td><td><input type=\"text\" class=\"form-control\" id=\"newFeatureID\" placeholder=\"\" disabled="true"　readOnly="true" value="' + gid + '"></td></tr>';
    tableHTML += ('<tr><td><label for=\"nameInput\">名称</label></td><td><input type=\"text\" class=\"form-control\" id=\"addNameInput\" placeholder=\"\"></td></tr>');
    tableHTML += ('<tr><td><label for=\"nameInput\">面积</label></td><td><input type=\"text\" class=\"form-control\" id=\"addAreaInput\" placeholder=\"\"disabled="true"　readOnly="true" value="' + area + '"></td></tr>');
    tableHTML += ('<tr><td><label for=\"nameInput\">地址</label></td><td><input type=\"text\" class=\"form-control\" id=\"addPinzhongInput\" placeholder=\"\"></td></tr>');
    // tableHTML += ('<tr><td><label for=\"nameInput\">类型</label></td><td><select class=\"form-control\" id=\"addTypeInput\"><option value="违建">违建</option><option value="未归类">未归类</option></select></td></tr>');
    tableHTML += ('<tr><td><label for=\"nameInput\">描述</label></td><td><input type=\"text\" class=\"form-control\" id=\"addTypeInput\" placeholder=\"\"></td></tr>');
    tableHTML += ('<tr><td colspan="2"><button id="updateFishBt" type="submit" class="btn btn-primary" style="float:right;width:90px;margin-right:10px" onclick="update()">确定</button><button id="quxiao" type="submit" class="btn btn-danger" style="float:left;width:90px;margin-left:10px" onclick="quxiao()">取消</button></td></tr>');
    $("#propertyTable").html(tableHTML);

}
function update() {
    var description=$("#addTypeInput").val();
    var gid = $("#newFeatureID").val()
    var name = $("#addNameInput").val();
    var area = $("#addAreaInput").val();
    var address = $("#addPinzhongInput").val();
    //var type = $("#addTypeInput").val();
    if(name==""){
        toast("名称不能为空",5000);
        return;
    }
    if(address==""){
        toast("地址不能为空",5000);
        return;
    }
    if(description==""){
        toast("描述不能为空",5000);
        return;
    }
    var mdata = {
        data: JSON.stringify({
            "gid": gid,
            "name": name,
            "area": area,
            "address": address,
            "description": description
        })
    }
    $.ajax({
        type: 'post',
        url: './api/modify',
        data: mdata,
        success: function (data) {

            isPropertyDivShow = false;
            $("#propertyArea").hide()
            myLayout();
            var mapWidth = mapDiv.width();
            var mapHeight = mapDiv.height();
            map.setSize([mapWidth, mapHeight]);

            layers[1].getSource().updateParams({"time": Date.now()});
            toast("新建图形成功", 1000);

        },
        error: function (error) {
            toast("新建图形失败", 1000);
        }
    });
}
//
function editTransaction1(mode, f, formatGML) {
    var node;
    switch (mode) {
        case 'insert':
            node = formatWFS.writeTransaction([f], null, null, formatGML);
            break;
        case 'update':
            node = formatWFS.writeTransaction(null, [f], null, formatGML);
            break;
        case 'delete':
            node = formatWFS.writeTransaction(null, null, [f], formatGML);
            //clientVectorSource.removeFeature(f);
            break;
    }
    var xs = new XMLSerializer();
    if (mode == 'update') {
        node = revertLonAndLat(node);
    }
    var payload = xs.serializeToString(node);
    console.log("payload is:" + payload);
    $.ajax(IPADDR + '/geoserver/WebGIS/wfs', {
        type: 'POST',
        dataType: 'xml',
        //typename: 'fish',
        typename: 'nanhu',
        processData: false,
        contentType: 'text/xml',
        data: payload
    }).done(function (data) {
        //刷新WMS
        console.log(data);
        clientVectorSource.clear();
        layers[2].getSource().updateParams({"time": Date.now()});
        if (mode == "delete") {
            toast("删除成功", 2000);
        } else if (mode = "update") {
            toast("编辑边界成功", 2000);
            modified = false;
        }
    }).error(function () {
        if (mode == "delete") {
            toast("删除失败", 2000);
        } else if (mode = "update") {
            toast("编辑边界失败", 2000);
            modified = false;
        }
    })
};
//
function getFeatureByID1(id) {
    var featureRequest = new ol.format.WFS().writeGetFeature({
        srsName: 'EPSG:4326',
        featureNS: 'http://www.vge.org/webgis',
        featurePrefix: 'WebGIS',
        featureTypes: ['nanhu'],
        outputFormat: 'application/json',
        filter: ol.format.filter.equalTo('gid', id)
    });
    fetch(IPADDR + '/geoserver/WebGIS/wfs', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
    }).then(function (response) {
        return response.json();
    }).then(function (json) {
        var GeoJSON = new ol.format.GeoJSON({
            geometryName: 'geom'
        });
        //var features = new ol.format.GeoJSON().readFeatures(json);
        var features = GeoJSON.readFeatures(json);
        //alert(features);
        editTransaction1("delete", features, formatGML);

        }).catch(function (error) {
        console.log(error)
    });
}
//新增取消按钮
function quxiao(){
     //隐藏table
     isPropertyDivShow = false;
     $("#propertyArea").hide();
     myLayout();
     var mapWidth = mapDiv.width();
     var mapHeight = mapDiv.height();
     map.setSize([mapWidth, mapHeight]);
     //删除新增的图形
     var gid = $("#newFeatureID").val();
     var mdata = {
        data: JSON.stringify({
           "gid": gid
        })};
     $.ajax({
         type:'post',
         url:'./api/cancle',
         data:mdata,
         success:function(data){
             console.log(data)
             if(data=="success"){
                 toast("取消新建图形成功", 1000);
                 layers[1].getSource().updateParams({"time": Date.now()});
                 clientVectorSource.clear();
             }
         }
     });
       
}
//查询后显示并刷新表格
function refreshDable(data) {
    if (data != "none") {
        //show table
        isPropertyDivShow = true;
        $("#propertyArea").show()
        myLayout();
        var mapWidth = mapDiv.width();
        var mapHeight = mapDiv.height();

        map.setSize([mapWidth, mapHeight]);
        //mainLayout();
        //clear table
        $("#propertyTable").html("");
        //fill table
        var tableHTML = '<tr><th>序号</th><th>名称</th><th>面积</th><th>地址</th><th>描述</th><th>照片</th></tr>';

        for (i = 0; i < data.features.length; i++) {
            var property = data.features[i].properties;
            var name = property.name;
            var id = data.features[i].id;
            var area = property.area;
            var address = property.address;
            var description = property.description;
            var imageurl = property.imageurl;
            var itemHTML = '<tr id =\'' + id + '\' style =\"overflow: auto\" onclick=\"jump2Map(\'' + id + '\')\">'
            itemHTML += ("<td>" + (i + 1) + "</td>");
            itemHTML += ("<td>" + name + "</td>" + "<td>" + area + "</td>" + "<td>" + address + "</td>" + "<td>" + description + "</td>"+ "<td><img src='./static/images/upload/" + imageurl + "'></td></tr>");
            tableHTML += itemHTML;

             console.log($('#tbimgurl').text());


        }
        $("#propertyTable").html(tableHTML);
    } else {
        toast("查询失败", 2000);
    }
    //<tr><td>1</td><td>杨巧根</td><td>河蟹</td></tr>
}
//指定时间内显示提示框
function toast(text, time) {
    showModal("提示", text);
    setTimeout(function () {
        hideModal();
    }, time);
}
var extDebug;
function jump2Map(id) {
    ////
    if (checkedFeature != undefined) {
        checkedFeature.setStyle(normalStyle);
        //checkedFeature.reset();
    }
    if (checkedTableTR != undefined) {
        checkedTableTR.css("background-color", "#ffffff");
    }
    var feature = clientVectorSource.getFeatureById(id);
    var trID = id.replace(".", "\\.");
    var clickedTR = $("#" + trID);
    console.log("#" + id.replace(".", "\\\\."));
    clickedTR.css("background-color", "#FDD7BD");
    checkedTableTR = clickedTR;
    checkedFeature = feature;
    if (feature != undefined) {
        //map.getView().fit(feature.getExtent(), /** @type {ol.Size} */ (map.getSize()));
        var ext = feature.getGeometry().getExtent();
        extDebug = ext;
        map.getView().fit(getExt(ext), /** @type {ol.Size} */ (map.getSize()));
        feature.setStyle(activateStyle);
        //feature.setStyle(styles);
        //
    };

}
function getExt(ext) {
    var modifiedExt;
    var minOffset = 0.001;
    var area = ((ext[0] - ext[2]) * (ext[1] - ext[3])) * 10000000;

    if (ext[2] - ext[0] < 0.002) {
        var center = (ext[2] + ext[0]) / 2.0;
        ext[0] = center - minOffset;
        ext[2] = center + minOffset;

    }
    if (ext[3] - ext[1] < 0.002) {
        var center = (ext[3] + ext[1]) / 2.0;
        ext[1] = center - minOffset;
        ext[3] = center + minOffset;
    }
    return ext;
}
function jump2Table(id, isSelected) {
    var clickedTR;
    var trID;
    if (checkedTableTR != undefined) {
        checkedTableTR.css("background-color", "#ffffff");
    }
    if (isSelected) {
        //var feature = queryVectorSource.getFeatureById(id);
        trID = id.replace(".", "\\.");
        clickedTR = $("#" + trID);
        clickedTR.css("background-color", "#FDD7BD");
        checkedTableTR = clickedTR;
        $("#propertyArea").css("overflow","hidden") ;
        $("#pbody").css("height","500px") ;
        $("#pbody").css("overflow","scroll") ;
        // $("#pArea").css("width",$("#propertyTable").width()) ;
        // $("#propertyArea").scrollTop(0);
        // var pos = clickedTR.position().top - 100;
        // $("#propertyArea").scrollTop(pos);
        // console.log(trID + "pos is:" + pos);
    }
    //ScroolTO

}
function showModal(title, text) {
    console.log("show:"+title);
    hideModal();
    $(".bs-example-modal-sm").modal('show');
    $("#modal_text").text(text);
    $("#modal_title").text(title)
}
function hideModal() {
    $(".modal-backdrop").hide();
    $(".bs-example-modal-sm").modal('hide');
}
//统计违建面积
function statciByCounty() {
    checkStatusin("check14");
    showModal("统计", "正在统计...");
    for(i=0;i<10;i++){
            $("#"+i).hide();
        }
    $("#qxyytj").remove();
    getAllArea();
    /*
    var allarr = allarrstr.split(",");
    //创建画板
    var oDiv = document.createElement("div");
    oDiv.id = "qxyytj";
    oDiv.style.backgroundColor = "black";
    // oDiv.style.opacity = "0";
    oDiv.style.position = "absolute";
    oDiv.style.width = "600px";
    oDiv.style.height = "300px";
    oDiv.style.top = "50%";
    oDiv.style.left = "50%";
    oDiv.style.marginLeft = "-300px";
    oDiv.style.marginTop = "-150px";
    oDiv.style.zIndex = "1003";
    document.body.appendChild(oDiv);
    createGraph2("全县渔业统计", "qxyytj", allarr[0].substring(1), allarr[1], allarr[2], allarr[3]);
    hideModal()
    */
}
//统计违建数量
function statciByTown() {
    // currentType = queryType.statistic;
    // checkStatusin("check15");
    // map.addLayer(xiangzhenVec);
    // showModal("统计", "正在统计...");
    // for(i=0;i<10;i++){
    //         $("#"+i).show();
    //     }
    //     $("#qxyytjContainer").remove();
    // getAreaByName("test");
    checkStatusin("check15");
    showModal("统计", "正在统计...");
    for(i=0;i<10;i++){
            $("#"+i).hide();
        }
    $("#qxyytj").remove();
    getCount();

}
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); //正则匹配
    if(arr=document.cookie.match(reg)){
      return unescape(arr[2]);
    }
    else{
     return null;
    }
} 

function checkStatus(liID)
{  
    for(i=1;i<5;i++)
        {   
            var id="check"+i;
            if(id==liID)
                document.getElementById(id).style.visibility = "visible";
            else 
                document.getElementById(id).style.visibility = "hidden";
        }
}

function checkStatusin(lID)
{  
    for(i=11;i<16;i++)
        {   
            var id="check"+i;
            if(id==lID)
                document.getElementById(id).style.visibility = "visible";
            else 
                document.getElementById(id).style.visibility = "hidden";
        }
}