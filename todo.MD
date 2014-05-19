19.05.2014 Aufträge: 
 - Testen: Farzad macht das
 - functions schreiben, die Gesamtstrecke im Monat, Wochen, Tag berechnet und in ein Array speichert (return);
 - Cordova einarbeiten

------------------------------
1. gps messen
[link1](http://www.html5rocks.com/en/tutorials/geolocation/trip_meter/)

2. lat und long in json object in localStorage speichern
[link2](http://www.html5rocks.com/en/tutorials/webdatabase/todo/)

## UI

besteht aus start/stop button
wenn start gedr�ckt wurde wird in Minutenabstand die Zeit bestimme, eine location ausgelesen diese in
localStorage mit dem Timestring als key und einem JSON objekt als value weggeschrieben und schliesslich
die Koordinaten in einer <ul> ausgegeben.
bei betätigen des Toogle-Stopp buttons wird der Interval gel�scht clearInterval()
