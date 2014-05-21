21.05.2014
- UserInterface: responsive
- Zeit muss angezeigt werden

+----------------------------+
|  start()  [time] [strecke] |
|                            |
|                            |
|                            |
|  [select tag monat]        |
|                            |

- testen 
- GPS Icon musste angezeigt werden
- Zeichnen von Strecken in Google maps
- Formatierte Ausgabe von Distanzen
- 


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
wenn start gedrückt wurde wird in Minutenabstand die Zeit bestimme, eine location ausgelesen diese in
localStorage mit dem Timestring als key und einem JSON objekt als value weggeschrieben und schliesslich
die Koordinaten in einer <ul> ausgegeben.
bei betätigen des Toogle-Stopp buttons wird der Interval gelöscht clearInterval()
