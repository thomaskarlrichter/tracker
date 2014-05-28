"use strict";

(function(){

	var myapp = angular.module('tracker', ['ionic']);
	
	myapp.service('TrackerService', function() {
        var mytracker;
        var record = false;
        var geoarray = [];
        var lat, longi, twoPointsDis;
        var last_pos, cur_pos;
        var totalDis = 0; 
    
        function calculateDistance(lat1, lon1, lat2, lon2) {
            var R = 6371; // km
            var dLat = (lat2-lat1).toRad();
            var dLon = (lon2-lon1).toRad();
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            return d;
        }
        
        Number.prototype.toRad = function() {
            return this * Math.PI / 180;
        };
        
        function getPosition(position) {
            lat = position.coords.latitude;
            longi = position.coords.longitude;
            if(geoarray.length > 0){
               last_pos = geoarray[geoarray.length - 1];
            } else {
               last_pos = {lat: lat, longi: longi};
            }
            twoPointsDis = calculateDistance(lat, longi,
                                             last_pos.lat, last_pos.longi);
    
            cur_pos = {lat: lat, longi: longi, dis: twoPointsDis};                               
            geoarray.push(cur_pos);
            
            totalDis = 0; 
            for (var i = 0; i < geoarray.length; i++) {
               totalDis = totalDis + geoarray[i].dis;
            }
        }
        
        function run(){
            navigator.geolocation.getCurrentPosition(getPosition);
        }
        
	    var serviceInstance = {
	        start: function(){
                geoarray = [];
                record = true;
                mytracker  = setInterval(run, 5000);
            },
            stopp: function(){
                var key;
                var keyarray = [];
                record = false;
                window.clearInterval(mytracker);
                key = "Tracker" + Date.now();
                window.localStorage.setItem(key,JSON.stringify(geoarray));
                console.log(JSON.stringify(geoarray));
                if(window.localStorage.getItem("tracker")) {
                   keyarray = JSON.parse(window.localStorage.getItem("tracker"));
                }
                keyarray.push(key);
                window.localStorage.setItem("tracker", JSON.stringify(keyarray));
            },
	        gesamt: function(){
                console.log(" beginn gesamt");
                var keys, 
                  i, 
                  j,
                  gesamtstrecke, 
                  einzelstrecke=[], 
                  laenge=0, 
                  count=0;
                  
                keys = JSON.parse(window.localStorage.getItem("tracker"));
                console.log(keys);
                if (keys.length > 0) {
                    for(i=0; i< keys.length; i++){
                        console.log(keys[i]);
                        einzelstrecke = JSON.parse(window.localStorage.getItem(keys[i]));
                        console.log(einzelstrecke);
                        for(j=0; j < einzelstrecke.length; j++){
                            laenge += einzelstrecke[j].dis;
                            count++;
                        }
                    }
                    
                    gesamtstrecke = (laenge*1000).toFixed();
                    if (gesamtstrecke < 10000) {
                        gesamtstrecke = gesamtstrecke + ' m';
                    } else {
                        gesamtstrecke = (gesamtstrecke / 1000).toFixed(2) + ' km';
                    }
                }
                return {
    	            strecke: gesamtstrecke,
    	            count: count
    	        };
    	    },
    	    getPerX: function(elem){
                var elements = {};
                var keys;
                keys = JSON.parse(window.localStorage.getItem("tracker"));
                keys.forEach(function(key){
                    var _elements;
                    var steps = JSON.parse(window.localStorage.getItem(key));
                    var d = new Date(+key.split("Tracker")[1]);
                    if(elem === 'month'){
                        _elements = d.getMonth();
                    };
                    if(elem === 'day'){
                        _elements = d.getDay();
                    };
                    if(elem === 'min'){
                        _elements = d.getMinutes();
                    };
                    
                    if(elements[_elements] === undefined){
                        elements[_elements] = 0;
                    }
                    steps.forEach(function(step){
                        elements[_elements] += step.dis;
                    });
                });
                return elements;
            }
	    }
	    return serviceInstance;
	});

	myapp.controller('TrackerController', ['TrackerService', function(trackerService){
	    this.button = "Start";
	    
	    this.toogle = function() {
	        if( this.button === 'Start') {
	            trackerService.start();
	            this.button = 'Stopp';      
	        } else {
	            trackerService.stopp();
	            this.button = 'Start';
	        }
	    };
	    
	    this.count;
	    
		this.gesamtstrecke = 0;

        this.getGesamt = function(){
                var gesamt = trackerService.gesamt();
                this.gesamtstrecke = gesamt.strecke;
                this.count = gesamt.count;
        };		

	} ] );

})();