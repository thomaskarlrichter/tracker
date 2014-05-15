/* globals $ */
"use strict";

$(document).ready(function(){

    var mytracker;
    
    var geoarray = [];
    var lat, long, twoPointsDis;
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
    };
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    };
    function getPosition(position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        if(geoarray.length > 0){
           last_pos = geoarray[geoarray.length - 1];
        } else {
           last_pos = {lat: lat, long: long};
        }
        twoPointsDis = calculateDistance(lat, long,
                                         last_pos.lat, last_pos.long);
        
        cur_pos = {lat: lat, long: long, dis: twoPointsDis};                               
        geoarray.push(cur_pos);
        
        for (var i = 0; i < geoarray.length; i++) {
           totalDis = totalDis + geoarray[i].dis;
        }
        $('#cur_pos').html("<h2>"+(new Date()).toUTCString()+"</h2><div><i>lat: "+cur_pos.lat +
                            "</i>: <i>long: "+cur_pos.long+
                            "</i> LastDist: <b>"+twoPointsDis+
                            "</b></i> Total Distance: <b>"+totalDis+"</b></div>");
    };
    
    function run(){
        navigator.geolocation.getCurrentPosition(getPosition);
    };
    
    function start(){
        mytracker  = setInterval(run, 10000);
    };
    
    function stopp(){
        window.clearInterval(mytracker);
        $('#cur_pos').html("<h2>"+ geoarray.length +" Positions saved in Array</h2>"+
                        "<h3> Total Distance: <u>"+totalDis*1000+" Meter moved</u></h3>");
    };
    
    if (navigator.geolocation) {
        $("#start").on("click", start);
        $("#stopp").on("click", stopp);
    }
    else {
        console.log('Geolocation is not supported for this Browser/OS version yet.');
    }
    
});