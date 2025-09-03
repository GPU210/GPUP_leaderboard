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

  if (rows.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='100%'>No data available</td></tr>";
    return;
  }

  // Header row
  const headerRow = document.createElement("tr");
  rows[0].forEach(col => {
    const th = document.createElement("th");
    th.textContent = col.trim();
    headerRow.appendChild(th);
  });
  tableHead.appendChild(headerRow);

  // Sort rows (by last column, assuming it's score, descending)
  const dataRows = rows.slice(1);
  dataRows.sort((a, b) => {
    const scoreA = parseFloat(a[a.length - 1]) || 0;
    const scoreB = parseFloat(b[b.length - 1]) || 0;
    return scoreB - scoreA;
  });

  // Data rows
  dataRows.forEach(rowArr => {
    const row = document.createElement("tr");
    rowArr.forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell.trim();
      row.appendChild(td);
    });
    tableBody.appendChild(row);
  });
}
