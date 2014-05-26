/* globals $ */
"use strict";

$(document).ready(function(){

    var mytracker;
    var record = false;
    var geoarray = [];
    var lat, longi, twoPointsDis;
    var last_pos, cur_pos;
    var totalDis = 0; 
    var d = 0;
    
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
        $('#cur_pos').html("<div>Distance: <b>"+totalDis+"</b></div>");
    }
    
    function run(){
        navigator.geolocation.getCurrentPosition(getPosition);
    }
    
    function start(){
        geoarray = [];
        record = true;
        mytracker  = setInterval(run, 5000);
    }
    
    function stopp(){
        var key;
        var keyarray = [];
        record = false;
        window.clearInterval(mytracker);
        $('#cur_pos').html("<h4> Total Distance: <u>"+totalDis*1000+"</u></h4>");
        key = "Tracker" + Date.now();
        window.localStorage.setItem(key,JSON.stringify(geoarray));
        console.log(JSON.stringify(geoarray));
        if(window.localStorage.getItem("tracker")) {
           keyarray = JSON.parse(window.localStorage.getItem("tracker"));
        }
        keyarray.push(key);
        window.localStorage.setItem("tracker", JSON.stringify(keyarray));
                console.log("end stopp");

    }
    
    function getPerX(elem){
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
    
    function gesamt(){
        console.log(" beginn gesamt");
        var keys, i, j, einzelstrecke=[], laenge=0, count=0;
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
            
            d = (laenge*1000).toFixed();
            if (d < 10000) {
                d = d + ' m';
            } else {
                d = (d / 1000).toFixed(2) + ' km';
            }
            
            $('#cur_pos').html("Gesamtstrecke: " + d + " | Messwerte: " + count);
        } else {
            $('#cur_pos').html("keine Daten vorhanden");
        }
    }

    if (navigator.geolocation) {
        $("#startstop").on("click", function() {
           if($("#startstop").html()  == 'Start') {
                start();
                $("#startstop").html('Stopp');
           } else {
                stopp();
                $("#startstop").html('Start');
           }
        });
        $("#gesamt").on("click", gesamt);
        $("#testminutes").on("click", function() { console.log( JSON.stringify(getPerX('min')) ); });
        $("#testmonth").on("click", function() { console.log( JSON.stringify(getPerX('month')) ); });
    }
    else {
        console.log('Geolocation is not supported for this Browser/OS version yet.');
    }
    
});