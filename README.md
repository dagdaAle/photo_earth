# photo_earth

Un'applicazione web interattiva che visualizza un modello 3D della Terra, permette di selezionare punti sulla superficie e caricare immagini associate a tali posizioni.

## Descrizione

Flask-Terra è un progetto web che combina le librerie Flask (per il backend) e Three.js (per il frontend) per creare un'esperienza interattiva. L'applicazione permette di:

*   Visualizzare un modello 3D della Terra con texture realistiche.
*   Ruotare e zoomare la Terra usando i controlli orbitali.
*   Cliccare sulla superficie della Terra per selezionare una posizione.
*   Caricare un'immagine associata alla posizione selezionata.
*   Salvare le posizioni e le immagini nel localStorage del browser.
*   Visualizzare dei marker sulla Terra per le posizioni salvate.

## Tecnologie Utilizzate

*   **Flask:** Framework web Python per la gestione del backend.
*   **Three.js:** Libreria JavaScript per la creazione di grafica 3D nel browser.
*   **HTML/CSS:** Per la struttura e lo stile delle pagine web.
*   **JavaScript:** Per la logica del frontend e l'interazione con Three.js.
