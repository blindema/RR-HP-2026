// Create a module that returns the current date and time.
// Use the exports keyword to make properties and methods available outside the module file.
exports.myDateTime = function () {
    var heute = new (Date);
    return heute.toString();
}; 

// JavaScript Date Object bei "new Date()":  'Tue Aug 22 2023 18:53:25 GMT+0200 (Mitteleuropäische Sommerzeit)'
// - By default, JavaScript will use the browser's time zone and display a date as a full text string
// - When you display a date object in HTML, it is automatically converted to a string, with the toString() method.
// - The toISOString() method converts a date to a string using the ISO standard: '2023-08-22T17:01:26.596Z'
// - Date.toLocaleString([locales[, options]]) Als erster optionaler Parameter kann ein Gebietsschema (Locale) angegeben werden, bspw. für Deutschland 'de-DE'. Beispiel: "21.11.2016, 09:59:00". 


/// Funktion um ein Datum / Uhrzeit in einem String zusammenzubauen
exports.DT_Bauen = function(type)
{
    let datumAktuell = new Date();                             // Tue Aug 22 2023 18:53:25 GMT+0200 (Mitteleuropäische Sommerzeit)
    let datumAktuellISO = datumAktuell.toISOString();          // 2023-08-22T17:01:26.596Z'
    let datumLokal  = datumAktuell.toLocaleString('DE-de');    // Datum, Zeit mit lokaler Zeitzone (Achtung; auch einstellige Werte)
    //console.log("DatumLokal: ", datumLokal);

    let d = {                       // Struktur fürs Datum
        jahr    : "",
        monat   : "",
        tag     : "",
        stunde  : "",
        minute  : "",
        sekunde : "",
        wt      : "",               //Wochentag
        zz      : "GMT+0100",       // Zeitzone
        sz      : false             // Sommerzeit?
        }
        
    let dateTimeString = datumLokal.split(',');             // dateTimeString:  [ '24.8.2023', ' 15:08:45' ]
    let dateString = dateTimeString[0].split('.');          // dateString    :  [ '24', '8', '2023']
    let timeString = dateTimeString[1].split(':');          // timeString    :  [ '15', '08', '45' ]
    //console.log("datumLokal: ",dateTimeString);

    d.jahr = dateString[2];
    if (dateString[1].length < 2) { d.monat = "0" + dateString[1] }
        else { d.monat = dateString[1] };
    if (dateString[0].length < 2) { d.tag = "0" + dateString[0] }
        else { d.tag = dateString[0] };
    d.stunde    = timeString[0];
    d.minute    = timeString[1];
    d.sekunde   = timeString[2];
    d.wt        = datumAktuell.toString().substring(0,3);
    if (datumAktuell.toString().indexOf("Sommerzeit") > 0 ) {sz = true}
        else {sz = false};
    console.log("d: ", d);

    switch (type) {
        case "Std":  // Standard: '25.08.2023 08:30:00' 
            return d.tag + '.' + d.monat + '.' + d.jahr + ' ' + d.stunde + ':' + d.minute + ':' + d.sekunde;

        case "Jahr8r":  // '20150301'      
            return d.jahr + d.monat + d.tag;

        case "Jahr8v":  // '01032015'      
            return d.tag + d.monat + d.jahr;

        case "Jahr4v":  // '2015'      
            return d.jahr;

        case "Jahr10v":  // '01.03.2015'      
            return d.tag + '.' + d.monat + '.' + d.jahr;

        case "WT":  // 'Montag' 
            switch (d.wt) {
                case "Sun": return "Sonntag";
                case "Mon": return "Montag";
                case "Tue": return "Dienstag";
                case "Wed": return "Mittwoch";
                case "Thu": return "Donnerstag";
                case "Fri": return "Freitag";
                case "Sat": return "Samstag";
                default:
                    return ""; // Notlösung, da der Compiler sonst meckert
            }

        case "WTeIx":  // '1' 
            switch (datumAktuell.DayOfWeek.ToString()) {
                case "Sun": return "0";
                case "Mon": return "1";
                case "Tue": return "2";
                case "Wed": return "3";
                case "Thu": return "4";
                case "Fri": return "5";
                case "Sat": return "6";
                default:
                    return "";
            }

        case "WTIx":  // '1' 
            switch (datumAktuell.DayOfWeek.ToString()) {
                case "Mon": return "1";
                case "Tue": return "2";
                case "Wed": return "3";
                case "Thu": return "4";
                case "Fri": return "5";
                case "Sat": return "6";
                case "Sun": return "7";
                default:
                    return "";
            }

        default:    // Der Interpreter verlangt einen default Wert.
            return  d.tag + '.' + d.monat + '.' + d.jahr;
    }
}

// Create a module that returns the current date and time.
// Use the exports keyword to make properties and methods available outside the module file.
exports.Fortschritt_Color = function (
     arg1   // Startdatum als ts
    ,arg2   // Endedatum in der Form yyyy-mm-dd
    ,arg3   // Fortschritt in Prozent
    )
     {
    console.log("Beginn Berechnung Farbcode für das Feld Fortschritt:");
    console.log("arg1: " , arg1);
    console.log("arg2: " , arg2);
    console.log("arg3: " , arg3);   

    let startDatum  = Date.parse( arg1.substring(0,10) );   // Startdatum als ts (nur Datum berücksichtigt)
    console.log("startDatum: ",startDatum);
    let endeDatum   = Date.parse(arg2);                     // Endedatum als ts (nur Datum berücksichtigt)
    console.log("endeDatum: ",endeDatum);
    let fortschritt = arg3;                                 // Fortschritt in %
    console.log("fortschritt: ",fortschritt);
    let dt          = new Date().toISOString();             // Datum von Heute im ISO Format als String
    console.log("dt: ",dt);
    let heuteDatum  = Date.parse(dt.substring(0,10));       // Datum von heute als ts (nur Datum berücksichtigt)
    console.log("heuteDatum: ",heuteDatum);

    // Die Rechnung funktioniert nicht, wenn das Endedatum schon erreicht ist! 
    if (endeDatum >= heuteDatum) {                                          // hier prüfen
        let diff_ende_start = endeDatum - startDatum;
        console.log("diff_ende_start: ",diff_ende_start);
        let diff_heute_start = heuteDatum - startDatum;
        console.log("diff_heute_start: ",diff_heute_start);
        let diff_in_prozent = diff_heute_start * 100 / diff_ende_start;     // Prozentrechnung: wieviel % müssten Heute fertig sein
        console.log("diff_in_prozent: ",diff_in_prozent);
        let verhältnis_Ist_Soll = fortschritt / diff_in_prozent;            // >1 übererfüllt; 1 im Zeitplan; <1 untererfüllt
        console.log("verhältnis_Ist_sool: ",verhältnis_Ist_Soll);
        let v = verhältnis_Ist_Soll;
        console.log("v: ",v);
        
        switch (true) {
            case v > 1.2 :                                      // Übererfüllt  
                return 'style="background-color: #27AE60;"'     // grün
            case v >= 0.9 && v <= 1.2 :                         // gut im Plan  
                return 'style="background-color: #27AE60;"'     // grün
            case v < 0.9 && v >= 0.6 :                          // dem Plan hinterher  
                return 'style="background-color: #FFC300;"'     // gelb
            case v < 0.6 :                                      // stark Untererfüllt  
                return 'style="background-color: #FF5733;"'     // rot        
            default:                                            // wenn nichts anders passt 
                return  'style="background-color: #fff;"'       // weiß
        }

    } 
    else {                                                      // das Endedatum ist schon überschritten
        return  'style="background-color: #3E3938;"'            // grau/schwarz
    }
}; 