document.getElementById("uploadBtn").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a CSV file first!");
    return;
  }

  Papa.parse(file, {
    header: true,   // use first row as header
    skipEmptyLines: true,
    complete: function(results) {
      displayCSV(results.meta.fields, results.data);
    }
  });
});

function displayCSV(headers, data) {
  const tableHead = document.querySelector("#leaderboard thead");
  const tableBody = document.querySelector("#leaderboard tbody");

  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='100%'>No data available</td></tr>";
    return;
  }

  // Header row
  const headerRow = document.createElement("tr");
  headers.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col.trim();
    headerRow.appendChild(th);
  });
  tableHead.appendChild(headerRow);

  // Sort rows by Execution Time (ascending)
  data.sort((a, b) => parseFloat(a["Execution Time (ms)"]) - parseFloat(b["Execution Time (ms)"]));

  // Data rows
  data.forEach((rowObj, index) => {
    const row = document.createElement("tr");

    headers.forEach(col => {
      const td = document.createElement("td");
      td.textContent = rowObj[col];
      row.appendChild(td);
    });

    // Highlight top 3 ranks
    if (index === 0) row.style.backgroundColor = "#ffd700"; // gold
    else if (index === 1) row.style.backgroundColor = "#c0c0c0"; // silver
    else if (index === 2) row.style.backgroundColor = "#cd7f32"; // bronze

    tableBody.appendChild(row);
  });
}
