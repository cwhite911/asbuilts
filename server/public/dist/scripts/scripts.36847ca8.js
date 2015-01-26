"use strict";angular.module("asbuiltsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","autocomplete","agsserver","leaflet-directive","ngDragDrop","angularFileUpload"]).value("projectConstants",{version:.1,documentBaseUrl:"http://gis.raleighnc.gov/asbuilts/PROJECT_TRACKING/"}).config(["$routeProvider","$httpProvider",function(a,b){a.when("/",{templateUrl:"views/form.html",controller:"FormCtrl"}).when("/addDocument",{templateUrl:"views/start.html",controller:"StartCtrl"}).when("/instructions",{templateUrl:"views/instructions.html"}).when("/form",{templateUrl:"views/form.html",controller:"FormCtrl"}).when("/stats",{templateUrl:"views/stats.html",controller:"StatsCtrl"}).when("/map",{templateUrl:"views/map.html",controller:"MapCtrl"}).when("/document/:documentid",{templateUrl:"views/documents.html",controller:"DocCtrl"}).when("/error",{templateUrl:"404.html"}).otherwise({redirectTo:"/error"}),b.defaults.useXDomain=!0,delete b.defaults.headers.common["X-Requested-With"]}]),angular.module("asbuiltsApp").service("ags",["$resource",function(a){var b="http://:name.raleighnc.gov/arcgis/rest/services/PublicUtility/:folder/:serviceType";this.AgsLayers=function(a){return this.items=a,this},this.AgsLayers.prototype.getLayerId=function(a){for(var b=0,c=this.items.length;c>b;b++)if(this.items[b].name===a)return this.items[b].id},this.paramDefaults={test:{name:"mapstest",folder:"ProjectTracking",serviceType:"FeatureServer"},fs:{name:"mapstest",id:"0",folder:"ProjectTracking",serviceType:"FeatureServer"},addFeature:{name:"mapstest",id:"5",folder:"ProjectTracking",serviceType:"FeatureServer"}},this.ServerActions=function(){this.actions={}},this.ServerActions.prototype={Type:function(a,b,c,d,e){this.method=a||"GET",this.timeout=b||5e3,this.params=c||{},this.cache=d||!1,this.headers=e||{"Content-Type":"application/json"}},setAction:function(a,b,c,d,e,f){var g=new this.Type(b,c,d,e,f);this.actions[a]=g},changeParams:function(a,b){return angular.extends(this.actions[a],b),this}},this.testActions=new this.ServerActions,this.testActions.setAction("getService","GET",5e3,{f:"json"},!0),this.testActions.setAction("getAll","GET",5e3,{f:"json",outFields:"*",where:"OBJECTID > 0",returnGeometry:!1},!0),this.testActions.setAction("delete","POST",5e3,{f:"json"},!1,{"Content-Type":"text/plain"}),this.testActions.setAction("newDocument","POST",5e3,{f:"json"},!1,{"Content-Type":"text/plain"}),this.testActions.setAction("update","POST",5e3,{f:"json"},!1,{"Content-Type":"text/plain"}),this.testServer=a(b,this.paramDefaults.test,this.testActions.actions),this.features=a(b+"/:id/query",this.paramDefaults.fs,this.testActions.actions),this.deleteFeatures=a(b+"/:id/deleteFeatures",this.paramDefaults.addFeature,this.testActions.actions),this.addDocument=a(b+"/:id/addFeatures",this.paramDefaults.addFeature,this.testActions.actions),this.updateDocument=a(b+"/:id/updateFeatures",this.paramDefaults.addFeature,this.testActions.actions),this.addFieldFromTable=function(a,b,c,d){return a.map(function(a){b.forEach(function(b){a.attributes[c]===b.attributes[c]?a.attributes[d]=b.attributes[d]:a})}),a}}]);var app=angular.module("asbuiltsApp");app.factory("OptionsFactory",[function(){var a=function(a,b,c,d,e){return this.f=a||"json",this.outFields=b||"*",this.where=c||"OBJECTID > 0",this.orderByFields=d||null,this.returnGeometry=e||"false",this};return a.prototype={getOptions:function(){return this},updateOptions:function(a,b){return Object.keys(this).indexOf(a)>-1?this[a]=b:this,this},addOptions:function(a,b){return this[a]=b,this},removeOptions:function(a){return delete this[a],this}},a}]),app.factory("AddFeatureOptionsFactory",[function(){var a=function(a){return this.options={f:a.f||"json",features:a.features||[{atttributes:{}}]},this};return a.prototype={addOptions:function(a){return angular.extend(this.options,a),this},getOptions:function(){return this.options}},a}]),app.factory("DeleteOptionsFactory",[function(){var a=function(a){return this.options={f:a.f||"json",objectIds:a.objectIds||null},this};return a.prototype={deleteOptions:function(a){return angular.extend(this.options,a),this},getOptions:function(){return this.options}},a}]),angular.module("asbuiltsApp").service("projectSearch",["ags","OptionsFactory","$filter","$cacheFactory",function(a,b,c,d){var e=d("projectCache"),f=new b("json","*","","PROJECTNAME ASC",!1);f.addOptions("serviceType","MapServer");a.testServer.getService({serviceType:"MapServer"}).$promise.then(function(b){var c=new a.AgsLayers(b.layers).getLayerId("Project Tracking");f.addOptions("id",c)});return{autoFillProjects:function(b){function d(a){for(var b=[],c=0,d=a.length;d>c;c++)b.indexOf(b[c])?a:b.push(this[c]);return b}var g=[],b=b.toUpperCase(),h=e.get(b);if(h){var i=c("filter")(h,b);if(i.length>0)return i.map(function(a){return a.trim()}),d(i),c("limitTo")(i,5)||"im from the cache"}return f.addOptions("text",b.toUpperCase()),a.features.getAll(f).$promise.then(function(a){try{if(a.features.length>0){for(var b=0,c=a.features.length;c>b;b++)g.push(a.features[b].attributes.PROJECTNAME+":"+a.features[b].attributes.DEVPLANID+":"+a.features[b].attributes.PROJECTID);d(g)}else g.push("Sorry No Record Found...")}catch(e){console.log("Sorry the server is not responding :(")}}),e.put(b,g),c("limitTo")(g,5)||"Im from the server"}}}]),angular.module("asbuiltsApp").service("StreetSearch",["$http","$filter","$cacheFactory",function(a,b,c){var d=c("streetCache"),e=[];this.autoFill=function(c){var f=d.get(c);if(f){var g=b("filter")(f,c);if(g.length>0)return g.map(function(a){return a.trim()}),b("limitTo")(g,5)}var h={f:"json",outFields:"ADDRESS",text:c,returnGeometry:!1,orderByFields:"ADDRESS ASC"},i="http://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/0/query";return a.get(i,{params:h,cache:!0}).success(function(a){for(var b in a.features){var f=a.features[b].attributes.ADDRESS.replace(/[0-9]/g,"");-1===e.indexOf(f)&&e.push(f)}d.put(c,e)}),b("limitTo")(e,5)}}]),angular.module("asbuiltsApp").factory("DocumentFactory",["ags","AddFeatureOptionsFactory","DeleteOptionsFactory","$cacheFactory",function(a,b,c,d){function e(a){var b=[{attributes:a}],c=angular.toJson(b);return c}var f=d("docId"),g=function(a){return this.data={PROJECTNAME:a.PROJECTNAME||"",PROJECTID:a.PROJECTID||"",DOCID:a.DOCID||0,WATER:a.WATER||0,SEWER:a.SEWER||0,REUSE:a.REUSE||0,STORM:a.STORM||0,FORMERNAME:a.FORMERNAME||"",ALIAS:a.ALIAS||"",DEVPLANID:a.DEVPLANID,STREET_1:a.STREET_1||"",STREET_2:a.STREET_2||"",STREET_3:a.STREET_3||"",STREET_4:a.STREET_4||"",NOTES:a.NOTES||"",TAGS:a.TAGS||"",ENGID:a.ENGID||"",DOCTYPEID:a.DOCTYPEID||"",SHEETTYPEID:a.SHEETTYPEID||""},this};return g.prototype={setValue:function(a){return angular.extend(this.data,a),this},getData:function(){return this.data},postNewDoc:function(){var c=this,d=new b({features:e(c.data)});a.testActions.actions.newDocument.params=d.getOptions(),a.addDocument.newDocument().$promise.then(function(a){f.put("newId",a.addResults[0].objectId),c.setValue({OBJECTID:a.addResults[0].objectId}),console.log(f.get("newId"))})},updateDoc:function(){for(var c in this.data)this.data[c]?this.data:delete this.data[c];console.log("Updated: "+this.data.OBJECTID);var d=new b({features:e(this.data)});a.testActions.actions.update.params=d.getOptions(),a.updateDocument.update().$promise.then(function(a){console.log(a)})},deleteDoc:function(){var b=new c(this.data);console.log("Deleted: "+this.data.objectIds),a.testActions.actions.delete.params=b.getOptions(),a.deleteFeatures.delete().$promise.then(function(a){console.log(a)})}},g}]),angular.module("asbuiltsApp").controller("HeaderController",["$scope","$location",function(a,b){a.isActive=function(a){return a===b.path()}}]),angular.module("asbuiltsApp").factory("IconFactory",[function(){var a=function(a,b,c,d,e,f){return this.name=a,this.message=b,this.icon={iconUrl:c,iconSize:d,iconAnchor:e,popupAnchor:f},this},b=function(){return this.list=[],this};return b.prototype={addIcon:function(b,c,d,e,f,g){this.list.push(new a(b,c,d,e,f,g))}},b}]),angular.module("asbuiltsApp").directive("documentForm",["ags","OptionsFactory","DocumentFactory","StreetSearch","$timeout",function(a,b,c,d,e){return{restrict:"E",transclude:!0,scope:{project:"="},templateUrl:"views/document-form.html",link:function(f){a.testServer.getService().$promise.then(function(c){var d=new a.AgsLayers(c.layers.concat(c.tables)),e=d.getLayerId("RPUD.ENGINEERINGFIRM"),g=d.getLayerId("RPUD.SHEETTYPES"),h=d.getLayerId("RPUD.DOCUMENTTYPES");f.supportTables=[{name:"engTypes",id:e,joinField:"ENGID",addField:"SIMPLIFIEDNAME"},{name:"sheetTypes",id:g,joinField:"SHEETTYPEID",addField:"SHEETTYPE"},{name:"docTypes",id:h,joinField:"DOCTYPEID",addField:"DOCUMENTTYPE"}],f.project="",f.refresh=function(c){if(c){f.supportTables.forEach(function(d){var e=d.name,g=new b("json","*","",d.addField+" ASC",!1).addOptions("id",d.id);a.features.getAll(g).$promise.then(function(b){switch(d.data=b.features,a.addFieldFromTable(c,d.data,d.joinField,d.addField),e){case"engTypes":f.engTypes=d.data;break;case"sheetTypes":f.sheetTypes=d.data;break;case"docTypes":f.docTypes=d.data;break;default:console.log("Table not found")}})});var d=["WATER","SEWER","REUSE","STORM"];c.forEach(function(a){a.edit=!1;for(var b=0,c=d.length;c>b;b++)a.attributes[d[b]]=a.attributes[d[b]]?"true":"false"})}},f.$watchCollection("project",function(){f.refresh(f.project)})}),f.selectionOptions={bool:[{name:"true",id:1},{name:"false",id:0}]},f.autoFill=function(a){f.streets=d.autoFill(a)},f.edit=function(a){f.project.forEach(function(a){a.edit=!1}),a.edit=!0,e(function(){a.edit=!1},6e4)},f.addDoc=!0,f.add=function(){f.newDocument=new c({PROJECTNAME:f.project[0].attributes.PROJECTNAME,PROJECTID:f.project[0].attributes.PROJECTID,DEVPLANID:f.project[0].attributes.DEVPLANID,DOCID:f.project.length+1}),f.newDocument.postNewDoc(),f.newDoc=f.newDocument.getData(),f.project.push({attributes:f.newDoc,edit:!1})},f.post=function(a){f.updateDocument=new c(a).setValue(a),f.updateDocument.updateDoc()},f.delete=function(a,b){f.deleteDocument=new c(b).setValue(b),f.deleteDocument.deleteDoc(),f.project.splice(a,1)}}}}]),angular.module("asbuiltsApp").directive("pdfCarousel",function(){return{restrict:"E",transclude:!0,scope:{docs:"="},templateUrl:"views/pdf-carousel.html",link:function(a){a.$watchCollection("docs",function(){a.moveFoward=function(){var b=a.docs.shift();a.docs.push(b)},a.moveBackward=function(){var b=a.docs.pop();a.docs.unshift(b)}})}}}),angular.module("asbuiltsApp").controller("StatsCtrl",["$scope","$http","$timeout","OptionsFactory","ags",function(a,b,c,d,e){e.testServer.getService().$promise.then(function(b){a.layers=new e.Layers(b.layers.concat(b.tables));var c=new OptionsFactory("json","*","DEVPLANID = 'GH-5-2011'","PROJECTNAME ASC","true");c.addOptions("id",a.layers.getLayerId("Project Tracking"));var d=e.features.getAll(c);console.log(d)})}]),angular.module("asbuiltsApp").controller("RecentCtrl",["$scope","$cookieStore","$rootScope",function(a,b,c){a.recent=b.get("projects"),a.$watchCollection("myrecent",function(){a.recent=b.get("projects")})}]),angular.module("asbuiltsApp").controller("MapCtrl",["$scope","$http","$filter","$sce","leafletData","projectSearch","projectConstants","IconFactory",function(a,b,c,d,e,f,g,h){function i(a){return a.reduce(function(b,c){return[b[0]+c[0]/a.length,b[1]+c[1]/a.length]},[0,0])}function j(b,c){a.viewData=b,c.bindPopup("<h4>PROJECT NAME:"+b.properties.PROJECTNAME+"</h4>"),c.on("mouseover",function(){a.viewData=b.properties,q(a.centroid)}),c.on("mouseout",function(){})}function k(a){for(var b in a)a[b]?a[b]:delete a[b]}a.searchStatus=!1,angular.extend(a,{center:{lat:35.843768,lng:-78.6450559,zoom:13},layers:{baselayers:{xyz:{name:"OpenStreetMap (XYZ)",url:"https://{s}.tiles.mapbox.com/v3/examples.3hqcl3di/{z}/{x}/{y}.png",type:"xyz"},raleigh:{name:"Basic Base Map",type:"dynamic",url:"http://maps.raleighnc.gov/arcgis/rest/services/BaseMap/MapServer",visible:!1,layerOptions:{layers:["*"],opacity:1,attribution:"Copyright:© 2014 City of Raleigh"}}},overlays:{projects:{name:"Project Tracking",type:"dynamic",url:"http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/MapServer",visible:!1,layerOptions:{layers:[2],opacity:.5,attribution:"Copyright:© 2014 City of Raleigh"}},sewer:{name:"Sewer Collection Network",type:"dynamic",url:"http://maps.raleighnc.gov/arcgis/rest/services/PublicUtility/SewerExternal/MapServer",visible:!1,layerOptions:{layers:[0,1,2,3,4],opacity:1,attribution:"Copyright:© 2014 City of Raleigh"}},water:{name:"Water Distribution Network",type:"dynamic",url:"http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/WaterDistribution/MapServer",visible:!1,layerOptions:{layers:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],opacity:1,attribution:"Copyright:© 2014 City of Raleigh"}},reuse:{name:"Reuse Distribution Network",type:"dynamic",url:"http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/ReclaimedDistribution/MapServer",visible:!1,layerOptions:{layers:[0,1,2,3,4,5,6,7,8,9,10,11],opacity:1,attribution:"Copyright:© 2014 City of Raleigh"}}}},legend:{position:"bottomleft",colors:["#FFF","#28c9ff","#0000ff","#ecf386","#28c9ff","#0000ff","#FFF"],labels:['<img src="../images/ab.png" height="20px" width="20px" /> AS-Built','<img src="../images/cp.png" height="20px" width="20px" /> Construction Plan','<img src="../images/al.png" height="20px" width="20px" /> Acceptance Letter','<img src="../images/wl.png" height="20px" width="20px" /> Warranty Letter','<img src="../images/soc.png" height="20px" width="20px" /> Statement of Cost','<img src="../images/p.png" height="20px" width="20px" /> Permits','<img src="../images/plat.png" height="20px" width="20px" /> Plats']}});var l=new L.FeatureGroup,m={edit:{featureGroup:l},draw:{polygon:{shapeOptions:{color:"blue"}}}},n=new L.Control.Draw(m);angular.extend(a,{controls:{custom:[n]}}),e.getMap().then(function(a){a.on("draw:created",function(b){var c=b.layer;l.addLayer(c),l.addTo(a),console.log(l),console.log(JSON.stringify(c.toGeoJSON()))}),a.on("draw:edited",function(a){var b=a.layers;console.log(b),b.eachLayer(function(){})})});var o=new h;o.addIcon("ASBUILTS","AS-Builts","../images/ab.png",[38,38],[0,0],[5,5]),o.addIcon("CONSTUCTION_PLAN","Construction Plan","../images/cp.png",[38,38],[0,0],[5,0]),o.addIcon("ACCEPTANCE_LETTER","Acceptance Letter","../images/al.png",[38,38],[0,0],[-5,5]),o.addIcon("WARRANTY_LETTER","Warranty Letter","../images/wl.png",[38,38],[0,0],[5,-5]),o.addIcon("STATEMENT_OF_COST","Statement of Cost","../images/soc.png",[38,38],[0,0],[-5,0]),o.addIcon("PERMITS","Permit","../images/p.png",[38,38],[0,0],[-5,-5]),o.addIcon("Plat","Plat","../images/plat.png",[38,38],[0,0],[5,5]);var p=o.list,q=function(b){b={lat:b[0],lng:b[1]};var c=[{lat:b.lat+5e-4,lng:b.lng+.002},{lat:b.lat+.001,lng:b.lng+.002},{lat:b.lat+.0015,lng:b.lng+.002},{lat:b.lat,lng:b.lng+.002},{lat:b.lat-5e-4,lng:b.lng+.002},{lat:b.lat-.001,lng:b.lng+.002},{lat:b.lat-.0015,lng:b.lng+.002}];angular.extend(a,{markers:{},paths:{}});for(var d in p){var e=p[d].name;a.markers[e]=c[d],a.markers[e].draggable=!0,a.markers[e].icon=p[d].icon,a.markers[e].message=p[d].message}};a.autoFillProjects=function(b){a.searchStatus=!1,a.project_docs=!1,angular.element(".angular-leaflet-map").removeClass("map-move"),a.projects=f.autoFillProjects(b)},a.searchControl=function(f){console.log(f);var h=f.split(":"),l={f:"json",outFields:"*",where:"PROJECTID =  '"+h[2]+"'",outSR:4326,returnGeometry:!0},m="http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/2/query",n="http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/5/query";b.get(m,{params:l,cache:!0}).success(function(b){e.getMap().then(function(d){function e(a){for(var b=[a],c=0,d=b[0].length;d>c;c++)for(var e=0;e<b[0][c].length;e++)f.push([b[0][c][e][1],b[0][c][e][0]]),b[0][c][e]=[b[0][c][e][1],b[0][c][e][0]];return b}a.project_info=b.features[0].attributes,a.project_info.CREATEDON=c("date")(a.project_info.CREATEDON,"MM/dd/yyyy"),a.project_info.DEVPLAN_APPROVAL=c("date")(a.project_info.DEVPLAN_APPROVAL,"MM/dd/yyyy"),a.project_info.EDITEDON=c("date")(a.project_info.EDITEDON,"MM/dd/yyyy"),k(a.project_info);var f=[];a.poly=[],angular.copy(b.features[0].geometry.rings,a.poly),a.mygeojson={type:"FeatureCollection",features:[{type:"Feature",id:b.features[0].attributes.PROJECTID,properties:b.features[0].attributes,geometry:{type:"MultiPolygon",coordinates:[b.features[0].geometry.rings]}}]};var g=e(a.poly);angular.extend(a,{geojson:{data:a.mygeojson,style:{fillColor:"rgba(253, 165, 13, 0.0)",weight:3,opacity:1,color:"rgba(253, 165, 13, 0.71)",dashArray:"4"},onEachFeature:j,resetStyleOnMouseout:!0}}),a.centroid=i(f),d.fitBounds(L.multiPolygon(g).getBounds()),a.searchStatus=!0})}),b.get(n,{params:l,cache:!0}).success(function(b){if(0!==b.features.length){angular.element(".angular-leaflet-map").addClass("map-move"),console.log(b.features);var c;a.project_docs=b.features.map(function(a){c=a.attributes.DOCTYPEID?a.attributes.DOCTYPEID.toLowerCase():"";var b={url:d.trustAsResourceUrl(g.documentBaseUrl+a.attributes.PROJECTID+"/"+a.attributes.PROJECTID+"-"+a.attributes.DOCTYPEID+"-"+a.attributes.DOCID+".pdf"),name:a.attributes.PROJECTID+"-"+a.attributes.DOCTYPEID+"-"+a.attributes.DOCID,resid:a.attributes.PROJECTID+"-"+a.attributes.DOCTYPEID+"-"+a.attributes.DOCID+"res",icon:"../images/"+c+".png"};return b});for(var e in a.project_docs){var f="#"+a.project_docs[e].resid;$(f).resizable()}}})},a.list1={title:"AngularJS - Drag Me"};var r="http://mapstest.raleighnc.gov/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task/execute";a.dpi=90,a.print_format="PDF",a.exportSizes=[{size:[500,500]},{size:[700,500]},{size:[700,1e3]}],a.printFormatList=["PDF","PNG8","PNG32","JPG","GIF","EPS","SVG","SVGZ"];var s={mapOptions:{},operationalLayers:[],baseMap:[{title:"Basemap",baseMapLayers:[{url:"http://maps.raleighnc.gov/arcgis/rest/services/BaseMap/MapServer",opacity:1}]}],exportOptions:{dpi:a.dpi,outputSize:[700,500]||a.output}};e.getMap().then(function(b){b.on("move",function(){a.mapbounds=b.getBounds(),s.mapOptions.extent={xmin:a.mapbounds._southWest.lat,ymin:a.mapbounds._southWest.lng,xmax:a.mapbounds._northEast.lat,ymax:a.mapbounds._northEast.lng},s.operationalLayers=[],b.eachLayer(function(a){b.hasLayer(a)?s.operationalLayers.push({url:a.url}):console.log("No layers added to print")})});var c=L.control({position:"bottomright"});c.onAdd=function(){var a=L.DomUtil.create("div","info legend");return a.innerHTML='<button class="btn btn-primary btn-sm mapPrint" data-toggle="modal" data-target="#myModal">Print</button>',a},c.addTo(b)}),a.print_params={Web_Map_as_JSON:s,format:a.print_format,Layout_Template:"MAP_ONLY",f:"json"},a.$watch("print_params",function(){},!0),a.printMap=function(){b.get(r,{params:a.print_params,headers:{"Content-Type":"text/plain"}}).success(function(a){console.log(a)})}}]),angular.module("asbuiltsApp").controller("FormCtrl",["$scope","$http","$filter","StreetSearch",function(a,b,c,d){function e(b,c){for(var d in a.servers[0].test.layers)for(var e in a.servers[0].test.layers[d])if(a.servers[0].test.layers[d][e].name===b){var f=a.servers[0].test.FeatureServer+"/"+a.servers[0].test.layers[d][e].id+"/"+c;return f}}function f(a,b,c,d){for(var e in a)for(var f in b)a[e].attributes[c]===b[f].attributes[c]&&(a[e].attributes[d]=b[f].attributes[d])}function g(a){var b=[];for(var c in a)b.push(a[c].attributes.DOCID);return b.sort(function(a,b){return b-a}),b[0]}function h(b){for(var c in a.sheets)1===a.sheets[c].attributes[b]?a.sheets[c].attributes[b]="True":0===a.sheets[c].attributes[b]&&(a.sheets[c].attributes[b]="False")}a.pageControls={continueButton:!1,deleteLastRecord:!1,table:!1,noRecords:!1},a.fields=null,a.projects=null,a.formSuccess=!1,a.selections=[{name:!0,id:1},{name:!1,id:0}],a.selectionOptions={project:"--Please Select Project--",doctype:"--Please Select Document Type--",engineer:"--Please Select Engineering Firm--",tf:"--Please Select--",sheet:"--Please Select Sheet--"};var i=0;a.servers=[{test:{FeatureServer:"http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer",layers:[]}},{WAKE:{Addresses:"http://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/0/query"}}];var j=function(c,d,e){var f={f:"json",outFields:"*",where:"OBJECTID >"+c,orderByFields:d+" ASC",returnGeometry:!1};for(var g in a.servers[0].test.layers)for(var h in a.servers[0].test.layers[g])if(a.servers[0].test.layers[g][h].name===e){var i=a.servers[0].test.FeatureServer+"/"+a.servers[0].test.layers[g][h].id+"/query";b.get(i,{params:f,cache:!0}).success(function(b){if("RPUD.ENGINEERINGFIRM"===e&&(a.engfirms=b.features),"Project Tracking"===e){a.projects=b.features,a.projectnames=[];for(var c in a.projects)a.projectnames.push(a.projects[c].attributes.PROJECTNAME+":"+a.projects[c].attributes.DEVPLANID+":"+a.projects[c].attributes.PROJECTID)}"RPUD.PTK_DOCUMENTS"===e&&(a.fields=b.fields),"RPUD.SHEETTYPES"===e&&(a.sheetdisc=b.features),"RPUD.DOCUMENTTYPES"===e&&(a.doctypes=b.features)})}};b.get(a.servers[0].test.FeatureServer,{params:{f:"json"},cache:!0}).success(function(b){a.servers[0].test.layers.push(b.layers),a.servers[0].test.layers.push(b.tables),setTimeout(function(){j(i,"OBJECTID","RPUD.PTK_DOCUMENTS"),j(i,"PROJECTNAME","Project Tracking"),j(i,"SIMPLIFIEDNAME","RPUD.ENGINEERINGFIRM"),j(i,"SHEETTYPE","RPUD.SHEETTYPES"),j(i,"DOCUMENTTYPE","RPUD.DOCUMENTTYPES")},1e3)}),a.change=function(d){var i=d.split(":");a.form.PROJECTID=parseInt(i[2]),a.form.DEVPLANID=i[1],a.form.PROJECTNAME=i[0];var j=["SEALDATE","SEALNUMBER","ENGID","FORMERNAME","ALIAS"],k={f:"json",outFields:"*",where:"PROJECTID =  '"+i[2]+"'",orderByFields:"DOCID ASC",returnGeometry:!1},l=e("RPUD.PTK_DOCUMENTS","query");b.get(l,{params:k}).success(function(b){if(console.log(b),a.sheets=b.features,f(a.sheets,a.doctypes,"DOCTYPEID","DOCUMENTTYPE"),f(a.sheets,a.sheetdisc,"SHEETTYPEID","SHEETTYPE"),f(a.sheets,a.engfirms,"ENGID","SIMPLIFIEDNAME"),h("WATER"),h("SEWER"),h("REUSE"),h("STORM"),a.sheetFields=b.fields,0===a.sheets.length){a.pageControls.table=!1,a.pageControls.noRecords=!0;for(var d in j)a.form[j[d]]=null;a.form.DOCID=1}else{a.pageControls.table=!0,a.pageControls.noRecords=!1,a.form.DOCID=g(a.sheets)+1;for(var d in j)a.form[j[d]]=a.sheets[0].attributes[j[d]],a.form.SEALDATE=c("date")(a.sheets[0].attributes.SEALDATE,"yyyy-MM-dd"),a.selectionOptions.engineer=a.sheets[0].attributes.SIMPLIFIEDNAME}})},a.autoFill=function(b){a.streets=d.autoFill(b)},a.nextSheet=function(){a.selectionOptions.project=a.entry.PROJECTNAME,a.pageControls.table=!0;var b=c("date")(a.lastDate,"yyyy-MM-dd");console.log(b),a.form={PROJECTNAME:a.entry.PROJECTNAME,SEALDATE:b,SEALNUMBER:a.entry.SEALNUMBER,DOCID:a.entry.DOCID+1,DEVPLANID:a.entry.DEVPLANID,JURISDICTION:a.entry.JURISDICTION,PROJECTID:a.entry.PROJECTID}},a.delete=function(){var c=e("RPUD.PTK_DOCUMENTS","deleteFeatures");b.post(c,a.postResults,{params:{f:"json",objectIds:a.postResults.objectId},headers:{"Content-Type":"text/plain"}}).success(function(b){console.log(b),a.form.DOCID===a.entry.DOCID+1&&(a.form.DOCID=a.entry.DOCID),a.sheets.pop()}),0===a.sheets.length&&(a.pageControls.table=!1,a.pageControls.noRecords=!0,a.sheets=[])},a.submit=function(c){if(-1!==c.SEALDATE.indexOf("-")){a.lastDate=c.SEALDATE;var d=c.SEALDATE.split("-");a.lastDate=d[1]+"/"+d[2]+"/"+d[0]}var f={PROJECTNAME:c.PROJECTNAME,SEALDATE:a.lastDate,SEALNUMBER:c.SEALNUMBER,DOCTYPEID:c.DOCTYPEID.attributes.DOCTYPEID,DOCID:c.DOCID,ENGID:c.ENGID.attributes.ENGID,WATER:c.WATER.id,SEWER:c.SEWER.id,REUSE:c.REUSE.id,STORM:c.STORM.id,FORMERNAME:c.FORMERNAME||null,ALIAS:c.ALIAS||null,DEVPLANID:c.DEVPLANID,STREET_1:c.STREET_1||null,STREET_2:c.STREET_2||null,STREET_3:c.STREET_3||null,STREET_4:c.STREET_4||null,NOTES:c.NOTES||null,TAGS:c.TAGS||null,PROJECTID:c.PROJECTID,SHEETTYPEID:c.SHEETTYPEID.attributes.SHEETTYPEID};a.pageControls.table=!1,a.entry=f,a.entry.SIMPLIFIEDNAME=c.ENGID.attributes.SIMPLIFIEDNAME;var g=[{attributes:f}],h=angular.toJson(g),i={params:{f:"json",features:h},headers:{"Content-Type":"text/plain"}},j=e("RPUD.PTK_DOCUMENTS","addFeatures");b.post(j,f,i).success(function(b){console.log(b),a.form.$setPristine(),a.form={},a.postResults=b.addResults[0],a.sheets.push({attributes:f})}),a.pageControls.deleteLastRecord=!0,a.pageControls.continueButton=!0},a.over,a.tableEdits={edit:{cell:function(c,d){var e={};e.OBJECTID=c,e[d]=a.table[d];var f=[{attributes:e}],g=angular.toJson(f),h={params:{f:"json",features:g},headers:{"Content-Type":"text/plain"}};b.post(a.servers[0].test.FeatureServer+"/"+a.servers[0].test.tables[0].id+"/updateFeatures",e,h).success(function(a){console.log(a)})}},"delete":{row:function(c){var d=e("RPUD.PTK_DOCUMENTS","deleteFeatures");b.post(d,a.postResults,{params:{f:"json",objectIds:c},headers:{"Content-Type":"text/plain"}}).success(function(b){console.log(b);for(var d in a.sheets)a.sheets[d].attributes.OBJECTID===c&&(console.log(d),a.sheets.splice(d,1))}),0===a.sheets.length&&(a.pageControls.noRecords=!0,a.pageControls.table=!1)}}}}]),angular.module("asbuiltsApp").controller("DocCtrl",["$scope","$routeParams","$http","$sce",function(a,b,c,d){function e(a){for(var b in a[0].attributes)a[0].attributes[b]?a[0].attributes[b]:delete a[0].attributes[b]}function f(a,b,c,d){for(var e in a)for(var f in b)a[e].attributes[c]===b[f].attributes[c]&&(console.log("Join Fields Match"),a[e].attributes[d]=b[f].attributes[d],delete a[e].attributes[c])}var g="http://gis.raleighnc.gov/asbuilts/PROJECT_TRACKING/";a.documentid=b.documentid,a.doc=a.documentid.split("-"),a.url=d.trustAsResourceUrl(g+a.doc[0]+"/"+a.documentid+".pdf");var h={f:"json",outFields:"*",where:"PROJECTID = "+a.doc[0]+" AND DOCTYPEID = '"+a.doc[1]+"' AND DOCID = "+a.doc[2]},i={f:"json",outFields:"*",where:"OBJECTID > 0"},j="http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/5/query";c.get(j,{params:h,cache:!0}).success(function(b){console.log(b),a.documentDetails=b.features,e(a.documentDetails);var d="http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/9/query";c.get(d,{params:i,cache:!0}).success(function(b){console.log(b),a.doctypes=b.features,f(a.documentDetails,a.doctypes,"DOCTYPEID","DOCUMENTTYPE")})}),a.$watch("documentDetails",function(){console.log(a.documentDetails)},!0)}]),angular.module("asbuiltsApp").controller("uploadCtrl",["$scope","FileUploader",function(a,b){a.loadStatus={addFile:{status:!1,message:"Please check fields file name incorrect"}};var c=a.uploader=new b({url:"/upload",removeAfterUpload:!0});c.filters.push({name:"checkName",fn:function(b,c){var d=/[0-9]{6}-[A-Z]{2}-[0-9]*/;return d.test(c.formData.newName)?(console.log("Passed RegEx"),c.formData.newName):(a.loadStatus.addFile.message="Invalid File Name: "+c.formData.newName,console.log("Failed RegEx: "+c.formData.newName),!1)}}),c.filters.push({name:"checkFileType",fn:function(b){var c="|"+b.type.slice(b.type.lastIndexOf("/")+1)+"|";return a.loadStatus.addFile.message="Invalid File Type: "+c+", please select a pdf.",-1!=="|pdf|PDF".indexOf(c)}}),c.onWhenAddingFileFailed=function(){a.loadStatus.addFile.status=!0},c.onAfterAddingFile=function(a){console.info("onAfterAddingFile",a)},c.onAfterAddingAll=function(a){console.info("onAfterAddingAll",a)},c.onBeforeUploadItem=function(a){return a.file.name=a.formData.newName+".pdf",console.log(a),a},c.onProgressItem=function(a,b){console.info("onProgressItem",a,b)},c.onProgressAll=function(a){console.info("onProgressAll",a)},c.onSuccessItem=function(a,b,c,d){console.info("onSuccessItem",a,b,c,d)},c.onErrorItem=function(a,b,c,d){console.info("onErrorItem",a,b,c,d)},c.onCancelItem=function(a,b,c,d){console.info("onCancelItem",a,b,c,d)},c.onCompleteItem=function(a,b,c,d){console.info("onCompleteItem",a,b,c,d)}}]),angular.module("asbuiltsApp").controller("StartCtrl",["$scope","$cookieStore","OptionsFactory","ags","projectSearch","$rootScope","Ags",function(a,b,c,d,e,f,g){var h=new g({host:"mapstest.raleighnc.gov"}),i={folder:"PublicUtility",service:"ProjectTracking",server:"FeatureServer",layer:"RPUD.DOCUMENTTYPES",geojson:!1,actions:"query",params:{f:"json",where:"OBJECTID > 0"}};h.request(i).then(function(a){console.log(a)});var j=f;a.project={};{var k=new c("json","*","","DOCID ASC",!1);d.testServer.getService().$promise.then(function(a){var b=new d.AgsLayers(a.tables).getLayerId("RPUD.PTK_DOCUMENTS");k.addOptions("id",b)})}a.autoFillProjects=function(b){a.searchStatus=!1,a.project_docs=!1,a.projects=e.autoFillProjects(b),j.myrecent=a.projects},a.searchControl=function(c){function e(a){var c=b.get("projects");void 0!==c&&c.length>0&&-1===c.indexOf(a)?(console.log("Add to Cookie"),c.unshift(a),c.length>5?c.pop():c,b.put("projects",c)):c||(console.log("new cookie"),b.put("projects",[a]))}e(c);var f="PROJECTID = "+c.split(":")[2];k.updateOptions("where",f),d.features.getAll(k).$promise.then(function(b){a.project=b.features,a.searchStatus=!0,a.project_docs=!0})}}]);