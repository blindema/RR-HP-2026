//=================================================================================//
// Funktion : Hier werden Daten und Funktionen zur zentralen Verwendung definiert  //
// Version  : 1.1                                                                  //
// Hinweise :                                                                      //
// Revision :                                                                      //
// 22.10.2025 Erweitert mit Konstanten für SystemView.vue 
//=================================================================================//

import { ref } from "vue";

export const useData = () => {  // Start Definitions-Block

  //-------------------------------------------------------------------------------//
  // State Definition (Variablen Definitionen)                                     //
  //-------------------------------------------------------------------------------//
  // altes Beispiel
  const data = ref({
    name: 'Rüdi',
    age:  50
  });

  // Zugangspunkt ioBroker auf Raspi5 (ref ist hier nicht notwendig)
  const ioBroker = ({
    protokoll:     'http',
    ipAddress:     "192.168.178.75",
    simpleApiPort: "8087"
  })


  //--------------------------------------------------------------------------------//
  // Function Definition                                                            //
  //--------------------------------------------------------------------------------//

  // setzt den Unix-Timestamp in 'mm.tt.' um
  const dat_kurz = (arg) => {
    //console.log(arg);
    let myDate1 = new Date(arg);               // TS im JSON ohne Hochkommas angeben; sind sonst String
    let myDate2 = myDate1.toISOString();       // 2023-12-07T08:13:47.385Z    
    return  myDate2.substring(8,10) + '.' + myDate2.substring(5,7) + '.';    // Tag und Monat
  };

  // setzt den yyyy-mm-dd hh:mm:ss-Timestamp in 'tt.mm' um
  const dat_kurz2 = (arg) => {
    console.log("ARG_kurz2: " +arg);
      return  arg.substring(8,10) + '.' + arg.substring(5,7) + '.';    // Tag und Monat
  };

  // setzt den yyyy-mm-dd hh:mm:ss-Timestamp in 'tt.mm.yyyy ss.mm' um
  const dat_de15 = (arg) => {
    //console.log("ARG_dat15: " +arg);
    return  arg.substring(8,10) + '.' + arg.substring(5,7) + '.' + arg.substring(0,4) + ' ' + arg.substring(11,16); 
  };

  // Prüft, ob der create-TS gleich dem update-TS ist (Satz wurde erstellt und noch nicht verändert),
  // dann liefere den update-TS als '0000.00.00 00:00:00' zurück.; sonst den Originalwert
  const dat_de15_check = (argU, argC) => {
    if ( argU == argC )  return "0000-00-00 00:00:000Z";
    if ( argU == null )  return "0000-00-00 00:00:000Z";
    else return argU;
  };

  // Berechnet die Farbe für den Progress-Bar in der ToDo-liste
  // Die Farbe bildet das verhältnis ab von erreichtem Fortschritt zur verbleibender Restzeit
  // Fortschritt in %  : Range von 0 - 100
  // Restlaufzeit in % : verstrichene Zeit / Gesamtzeit * 100
  const progressColor = ( rowIx,  
                          arg1,   // Startdatum in der Form yyyy-mm-dd hh:mm:ss
                          arg2,   // Endedatum in der Form yyyy-mm-dd
                          arg3    // Fortschritt in Prozent
                        ) => {

    //console.log("Berechnung Farbcode für das Feld Fortschritt in Aufgabe", rowIx + 1 );
    //console.log("  arg1: " , arg1, "  arg2: ", arg2, "  arg3: ", arg3);   


    let startDatum  = Date.parse( arg1.substring(0,10) );   // Startdatum als TS (nur Datum berücksichtigt)
    let endeDatum   = Date.parse(arg2);                     // Endedatum als TS (nur Datum berücksichtigt)
    let fortschritt = arg3;                                 // Fortschritt in %
    let dt          = new Date().toISOString();             // Datum von Heute im ISO Format als String
    let heuteDatum  = Date.parse(dt.substring(0,10));       // Datum von heute als TS (nur Datum berücksichtigt)
    //console.log("  heuteDatum:", heuteDatum, " startDatum:",startDatum, " endeDatum:",endeDatum, " fortschritt:",fortschritt);

    // Die Rechnung funktioniert nicht, wenn das Endedatum schon überschritten ist!  
    if (endeDatum >= heuteDatum) {                                          // hier prüfen

      let diff_start_ende     = endeDatum - startDatum;                     // gesamte Laufzeit
      let diff_start_heute    = heuteDatum - startDatum;                    // Laufzeit bis Heute
      if (diff_start_heute == 0) diff_start_heute = 1;                      // Heute = Starttag (setzte von 0 auf 1 wegen späterer Diffision)
      let diff_in_prozent     = diff_start_heute * 100 / diff_start_ende;   // Prozentrechnung: wieviel % müssten Heute fertig sein
      //console.log("  Diff_start_heute:", diff_start_heute, "  Diff_start_ende:", diff_start_ende, "  Diff_in_Prozent:", diff_in_prozent);      
      
      let verhältnis_ist_soll = fortschritt / diff_in_prozent;              // >1 übererfüllt; 1 im Zeitplan; <1 untererfüllt
      //console.log("  Verhältnis Ist/Soll (>1: besser; 1: neutral; <1: schlechter)  ==> ", verhältnis_ist_soll);

      let v = verhältnis_ist_soll;    // einfach  nur den Variablennamen verkürzen      
        
      switch (true) {                 // das Verhältnis auswerten
            case v > 1.2 :                                      // Übererfüllt  
                return 'lawngreen';    // grün
            case v >= 0.9 && v <= 1.2 :                         // gut im Plan  
                return 'lawngreen;'    // grün
            case v < 0.9 && v >= 0.6 :                          // dem Plan hinterher  
                return 'khaki;'        // gelb
            case v < 0.6 :                                      // stark Untererfüllt        
                return 'hotpink;'      // rot        
            default:                                            // wenn nichts anders passt 
                return  '#fff;'        // weiß
      }
    } 

    else {                                                      // das Endedatum ist schon überschritten
        return  '#3E3938;"'            // grau/schwarz
    }

  }

  // klappt das Menü bei kleinem BS aus
  const showSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    console.log('Button clicked');
    sidebar.style.display = 'flex';
  };

  // klappt das Menü bei kleinem BS wieder ein
  const hideSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    console.log('Button clicked');
    sidebar.style.display = 'none';
  };

  // Alle Definitionen zurückgeben!
  return { useData, ioBroker, dat_kurz, dat_kurz2, dat_de15, dat_de15_check, progressColor, showSidebar, hideSidebar };

}  // Ende Definitions-Block
