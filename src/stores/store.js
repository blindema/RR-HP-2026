// Axios-Modul: XMLHTTPRequest 
import axios from "axios";

// Pinia-Modul: verwalten von zentralen Daten 
import { defineStore } from "pinia";

// Imports Middleware from Toastification
import { useToast } from 'vue-toastification';         // graphische Darstellung von Hinweisen
const toast = useToast();


//==========================================================================================//
// Der Store besteht aus 3 Telen , welche in einem Objekt gehalten werden.                  //                                                            
// 1. Variablen Speicher                                                                    //                                                            
// 2. Funktionen                                                                            //                                                            
// 3. Gatters                                                                               //                                                            
//==========================================================================================//

export const useRRStore = defineStore('RRStore', {

  //
  // 1. Variablen Speicher
  //
  state: () => ({
    anwendungen: [],
    listen     : [],
    notizen    : []

  }),

  //
  // 2. Funktionen
  //
  actions: {

    // Toggle Feld 'checked' in der Bibliothek.Liste.Zeile 
    setCheckedState(listenNr, rowNr) {
      console.log(this.bibliothek[listenNr].rows[rowNr]);
      if ( this.bibliothek[listenNr].rows[rowNr].checked == true ) {
        this.bibliothek[listenNr].rows[rowNr].checked = false;     }
      else { this.bibliothek[listenNr].rows[rowNr].checked = true; }
    },

  /**
  * Lade das Array anwendungen
  * @param {array} DB-Rows
  * @return ()
  */
  lade_anwendungen (arg1) {
    console.log("* lade_anwendung => Eintritt ");    
    let anw = [];    
    arg1.forEach(row => {
      let id = row.Id;                // ein Punkt ist im JSON-Objekt nicht zulässig
      let name = row.Name;            // deshalb diese neue Zuweisung
      let zeile = { id, name };       // wird autom. umgewandelt in {id: 'ii', name:'xxxx'}
      //console.log('zeile: ', zeile); 
      //anw.push(zeile); 
      this.anwendungen.push(zeile);          
    });    
    console.log("   anwendungen:  ",  this.anwendungen);
    console.log("* Array anwendungen im Store geladen. ");
  
  // Hinweis:
  // let zeile = {id : '', name : ''};
  // id und Name sind Objekte und es wird nur der Objektverweis im Array gespeichert und nicht die aktuellen Werte !!
  },


  /**
  * Lade das Array listen
  * @param {array} DB-Rows
  * @return ()
  */
  lade_listen (arg1) {
    console.log("* lade_listen => Eintritt ");    
    let list = [];    
    arg1.forEach(row => {
      let id = row.Id;                // ein Punkt ist im JSON-Objekt nicht zulässig
      let name = row.Name;            // deshalb diese neue Zuweisung
      let zeile = { id, name };       // wird autom. umgewandelt in {id: 'ii', name:'xxxx'}
      //console.log('zeile: ', zeile); 
      //anw.push(zeile); 
      this.listen.push(zeile);          
    });    
    console.log("   listen:  ",  this.listen);
    console.log("* Array listen im Store geladen. ");
  },



  /**
  * Lade das Array notizen
  * @param {array} DB-Rows
  * @return ()
  */
  lade_notizen (arg1) {
    console.log("* lade_notizen => Eintritt ");    
    let list = [];    
    arg1.forEach(row => {
      let id = row.Id;                // ein Punkt ist im JSON-Objekt nicht zulässig
      let name = row.Name;            // deshalb diese neue Zuweisung
      let zeile = { id, name };       // wird autom. umgewandelt in {id: 'ii', name:'xxxx'}
      //console.log('zeile: ', zeile); 
      //anw.push(zeile); 
      this.notizen.push(zeile);          
    });    
    console.log("   notizen:  ",  this.notizen);
    console.log("* Array notizen im Store geladen. ");
  },




  /**
    * Lade Bibliothek (JSON-Datei) vom Server
    * @param ()
    * @return ()
    */
  // axion1() {
  //   axios
  //   .get('http://rroessler.de/select1.php')
  //   .then(function (response) {
  //     // handle success
  //     this.bibliothek = response.data;
  //     console.log('Response: ', response);
  //     console.log('Ausgabe: ', this.bibliothek);
  //   })
  //   .catch(function (error) {
  //     // handle error
  //     console.log(error);
  //   })
  //   .finally(function () {
  //     // always executed
  //   }); 
  // },


          
  /**
    * Eine neue Zeile dem JSON Objekt hinzufügen
    * @param {string, string}  newItem
    */


      
  /**
    * Den Inhalt einer Zeile verändern
    * @param {number} listId Listennummer
    * @param {number} rowId Zeilennummer
    * @param {string} newItem neues Item
    */
  updRow(listId, rowId, newItem) {
    console.log("* updRow => Eintritt ");
    let myTS = Date.now();  // zB: "1701933925137"

    // Die veränderten Daten in das Array einpflegen
    //this.bibliothek[listId].rows[rowId].update = myTS;
    console.log('Content alt: ', this.bibliothek[listId].rows[rowId].content);
    this.bibliothek[listId].rows[rowId].content = newItem;
    console.log('Content neu: ', this.bibliothek[listId].rows[rowId].content);
    console.log("Row nach Upd: \n", this.bibliothek[listId].rows[rowId]);

    // Update-Datum der Liste anpassen
    //this.bibliothek[listid].update = myTS; 

    //console.log(Bibliothek.#bibliothek)

    this.postJSON();                             // Bibliothek rausschreiben  
      
    toast.success('Row updated');
    console.log("* updRow => Austritt ");
  }, 


  /**
    * Eine Zeile löschen
    * @param {string} listId Listennummer 
    * @param {string} rowId Zeilennummer   */
  delRow(listId, rowId) {
    console.log("* delRow => Eintritt ");
    let myTS = Date.now();  // zB: "1701933925137"

    // Eine Zeile aus dem Array löschen
    this.bibliothek[listId].rows.splice(rowId,1);
    console.log("Row gelöscht: ", rowId);
       
    this.bibliothek[listId].update = myTS;       // Update-Datum der Liste anpassen 
    this.bibliothek[listId].count--;             // Zähler reduzieren

    this.postJSON();                              // Bibliothek rausschreiben     
      
    toast.success('Row deleted');
    console.log("* delRow => Austritt ");
  } 

},
 
//
// 3. Getters (Variablen auslesen)
//

// Variablen schreiben manuell über Funktionen!
});