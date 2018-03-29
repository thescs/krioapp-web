function GetMap() {
	if(osmrendered == true) return(true);
	map = new OpenLayers.Map("OSMap");//инициализация карты
    var mapnik = new OpenLayers.Layer.OSM();//создание слоя карты
    map.addLayer(mapnik);//добавление слоя
    map.zoomToMaxExtent();
	map.events.register("click", map, function(evt){
		var lonlat = map.getLonLatFromViewPortPx(evt.xy);
		
		console.info("latitude : " + lonlat.lat + ", longitude : " + lonlat.lon);
		hrntLoadNearGuysajax(1,50, Array(lonlat.lat,lonlat.lon),document.nearguysCallback);
	});
    // Широта/долгота
    var lonlat = new OpenLayers.LonLat(localStorage.lon, localStorage.lat);
    map.setCenter(lonlat.transform(
            new OpenLayers.Projection("EPSG:4326"), // переобразование в WGS 1984
            new OpenLayers.Projection("EPSG:900913") // переобразование проекции
          ), 15 // масштаб 17 крут
        );

    //создаем новый слой оборудования
    var layerMarkers = new OpenLayers.Layer.Markers("Equipments");
    map.addLayer(layerMarkers);//добавляем этот слой к карте

    // Маркер текущего еквипмента
    var size = new OpenLayers.Size(21, 25);//размер картинки для маркера
    //смещение картинки для маркера
    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
    //картинка для маркера
    var icon = new OpenLayers.Icon('/img/common/switch_svg.gif', size, offset);
    layerMarkers.addMarker(//добавляем маркер к слою маркеров
        new OpenLayers.Marker(lonlat, //координаты вставки маркера
        icon));//иконка маркера

    // шкала для выбора заранее настроенного масштаба
    //map.addControl(new OpenLayers.Control.PanZoomBar());

    // панель инструментов (сдвиг и масштабирование)
    //map.addControl(new OpenLayers.Control.MouseToolbar());

    // переключатель видимости слоев
    //map.addControl(new OpenLayers.Control.LayerSwitcher({'ascending':false}));

    // ссылка внизу карты на текущее положение/масштаб
    //map.addControl(new OpenLayers.Control.Permalink());
    //map.addControl(new OpenLayers.Control.Permalink('permalink'));

    // координаты текущего положения мыши
    // преобразование из метров в градусы с помощью proj4js
    /*map.addControl(
        new OpenLayers.Control.MousePosition({
            displayProjection: new OpenLayers.Projection('EPSG:4326')
        })
    );*/

    // обзорная карта
    //map.addControl(new OpenLayers.Control.OverviewMap());

    // горячие клавиши
    //map.addControl(new OpenLayers.Control.KeyboardDefaults());
	var osmrendered = true;
}