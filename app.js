document.getElementById("uploadBtn").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a CSV file first!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    displayCSV(text);
  };
  reader.readAsText(file);
});

function displayCSV(csvText) {
  const rows = csvText.trim().split("\n").map(r => r.split(","));

  const tableHead = document.querySelector("#leaderboard thead");
  const tableBody = document.querySelector("#leaderboard tbody");

  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  // Header
  const headerRow = document.createElement("tr");
  rows[0].forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  });
  tableHead.appendChild(headerRow);

  // Data rows
  for (let i = 1; i < rows.length; i++) {
    const row = document.createElement("tr");
    rows[i].forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell;
      row.appendChild(td);
    });
    tableBody.appendChild(row);
  }
}
