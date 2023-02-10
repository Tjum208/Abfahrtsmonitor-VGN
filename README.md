# Abfahrtsmonitor-VGN
Ein Abfahrtsmonitor für den VGN. 

Dieses Script fügt ein Widget auf euren Home Bildschirm mit den nächsten Abfahrten an einem bestimmten Haltepunkt hinzu. 
Das Widget gibt die Nächsten 2 Abfahrten mit Verspätung auf Sekunden genau angegeben.

![image](https://user-images.githubusercontent.com/95881893/218197171-b322f143-a2ef-42f8-91cf-907d40f70fd3.png)

# Installation: #
Zur Verwendung benötigt ihr die kostenlose App [Scriptable](https://apps.apple.com/de/app/scriptable/id1405459188). 
Nach der Installation der App muss die Datei `Abfahrt.js` heruntergeladen und abgespeichert werden. Im Anschluss kann die Datei über die Teilen-Funktion in Scriptable importiert werden.
Um das Widget auf euren Home Bildschirm hinzuzufügen, erstellt ein Scriptable Widget und wählt als `Script: Abfahrt` und bei `When Interacting: Run Script` aus.
Nun habt ihr das Script erfolgreich hinzugefügt.

# Konfiguration der HST #
Um den angezeigten Haltepunkt zu konfigurieren, muss die `hstid` getauscht werden. Um die ID zu tauschen, muss die App Scriptable geöffnet werden und das Script `Abfahrt` mit einem Klick auf die drei Punkte bearbeitet werden. 
Die Variable `hstid` am Anfang von Script muss abgeändert werden. Eine Liste mit allen Haltepunkten des VGNs ist in der Datei halt_id im Repossitory angehängt.

ACHTUNG: Nicht alle angegeben `Hst_id` Einträge funktionieren!

# Konfiguration des Verkehrsmittels 
Um das ausgegebene Verkehrsmittel zu ändern, muss das `product` getauscht werden. Dies geschieht auf dem gleichen Weg die oben bereits geschrieben. 


### Bitte beachten:
Das Tool befindet sich noch in einer Beta Phase und hat noch nicht seine finale Version erreicht! 
Die Filterung nach bestimmten Linien ist bis jetzt nur für den Haltepunkt Rathaus Fürth umgesetzt (`hstid = "2164`)
