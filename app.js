document.getElementById("uploadBtn").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a CSV file first!");
    return;
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      displayCSV(results.meta.fields, results.data);
      highlightChampion(results.data);
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

  // Add Rank column
  const headerRow = document.createElement("tr");
  headerRow.appendChild(Object.assign(document.createElement("th"), { textContent: "Rank" }));
  headers.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col.trim();
    headerRow.appendChild(th);
  });
  tableHead.appendChild(headerRow);

  // Sort by Execution Time (asc), then Peak Memory (asc)
  data.sort((a, b) => {
    const timeA = parseFloat(a["Execution Time (ms)"]) || Infinity;
    const timeB = parseFloat(b["Execution Time (ms)"]) || Infinity;
    if (timeA !== timeB) return timeA - timeB;

    const memA = parseFloat(a["Peak Memory"]) || Infinity;
    const memB = parseFloat(b["Peak Memory"]) || Infinity;
    return memA - memB;
  });

  // Add rows
  data.forEach((rowObj, index) => {
    const row = document.createElement("tr");

    // Rank column
    const rankCell = document.createElement("td");
    rankCell.textContent = index + 1;
    row.appendChild(rankCell);

    headers.forEach(col => {
      const td = document.createElement("td");
      td.textContent = rowObj[col];
      row.appendChild(td);
    });

    // Highlight top 3
    if (index === 0) row.style.backgroundColor = "#ffd700"; // gold
    else if (index === 1) row.style.backgroundColor = "#c0c0c0"; // silver
    else if (index === 2) row.style.backgroundColor = "#cd7f32"; // bronze

    tableBody.appendChild(row);
  });
}

function highlightChampion(data) {
  if (data.length === 0) return;

  const winner = data[0];
  const champDiv = document.getElementById("champion-details");

  champDiv.innerHTML = `
    <strong>${winner["Author"]} (${winner["Roll Number"]})</strong><br>
    ⏱ Execution Time: ${winner["Execution Time (ms)"]} ms<br>
    💾 Peak Memory: ${winner["Peak Memory"]} MB<br>
    🏅 Algorithm: ${winner["Algorithm"]}
  `;
}
