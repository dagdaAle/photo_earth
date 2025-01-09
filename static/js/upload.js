const fileInput = document.getElementById('fileInput');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');

saveBtn.onclick = () => {
  const file = fileInput.files[0];
  if (!file) {
    alert('Seleziona una foto prima di salvare!');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64Data = e.target.result;
    // Salviamo in localStorage
    savePoint(lat, lon, base64Data);
    // Torniamo alla pagina principale
    window.location.href = "/";
  };
  reader.readAsDataURL(file);
};

cancelBtn.onclick = () => {
  // Torniamo all'indice senza salvare
  window.location.href = "/";
};

// Funzione per salvare le info in localStorage
function savePoint(lat, lon, base64Img) {
  let points = JSON.parse(localStorage.getItem('earthPoints')) || [];
  points.push({ lat, lon, img: base64Img });
  localStorage.setItem('earthPoints', JSON.stringify(points));
}
