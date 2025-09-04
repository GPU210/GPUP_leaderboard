// URL of CSV file in GitHub repo (use RAW link)
const csvUrl = "https://raw.githubusercontent.com/gpu210/GPUP_leaderboard/main/score.csv";

// Fetch and parse CSV
fetch(csvUrl)
  .then(response => {
    if (!response.ok) throw new Error("Failed to fetch CSV file");
    return response.text();
  })
  .then(csvText => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        const headers = results.meta.fields;
        const data = results.data;

        displayMainTable(headers, data);       // Raw data
        displayRankings(headers, data);        // Rankings per algorithm
        highlightChampion(data);               // Champion
      }
    });
  })
  .catch(error => {
    console.error("Error loading CSV:", error);
    document.querySelector("#main-table tbody").innerHTML =
      "<tr><td colspan='100%'>Failed to load leaderboard</td></tr>";
  });

/* ------------------------
   MAIN TABLE (RAW DATA)
-------------------------*/
function displayMainTable(headers, data) {
  const tableHead = document.querySelector("#main-table thead");
  const tableBody = document.querySelector("#main-table tbody");

  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  // Header row
  const headerRow = document.createElement("tr");
  headers.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col.trim();
    headerRow.appendChild(th);
  });
  tableHead.appendChild(headerRow);

  // Data rows
  data.forEach(rowObj => {
    const row = document.createElement("tr");
    headers.forEach(col => {
      const td = document.createElement("td");
      td.textContent = rowObj[col];
      row.appendChild(td);
    });
    tableBody.appendChild(row);
  });
}

/* ------------------------
   RANKINGS PER ALGORITHM
-------------------------*/
function displayRankings(headers, data) {
  const section = document.getElementById("ranking-section");
  section.innerHTML = "<h2>📌 Rankings by Algorithm</h2>";

  // Group by Algorithm
  const algoGroups = {};
  data.forEach(row => {
    const algo = row["Algorithm"] || "Unknown";
    if (!algoGroups[algo]) algoGroups[algo] = [];
    algoGroups[algo].push(row);
  });

  // Create table for each algorithm
  for (const algo in algoGroups) {
    const algoData = [...algoGroups[algo]];

    // Sort by Execution Time, then Peak Memory
    algoData.sort((a, b) => {
      const timeA = parseFloat(a["Execution Time (ms)"]) || Infinity;
      const timeB = parseFloat(b["Execution Time (ms)"]) || Infinity;
      if (timeA !== timeB) return timeA - timeB;

      const memA = parseFloat(a["Peak Memory"]) || Infinity;
      const memB = parseFloat(b["Peak Memory"]) || Infinity;
      return memA - memB;
    });

    // Section title
    const title = document.createElement("h3");
    title.textContent = `🔹 ${algo} Rankings`;
    section.appendChild(title);

    // Table
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Header row with Rank
    const headerRow = document.createElement("tr");
    headerRow.appendChild(Object.assign(document.createElement("th"), { textContent: "Rank" }));
    headers.forEach(col => {
      const th = document.createElement("th");
      th.textContent = col.trim();
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Data rows
    algoData.forEach((rowObj, index) => {
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

      tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    section.appendChild(table);
  }
}

/* ------------------------
   CHAMPION (Top overall)
-------------------------*/
function highlightChampion(data) {
  if (data.length === 0) return;

  // Sort overall (Execution Time + Peak Memory)
  const sorted = [...data].sort((a, b) => {
    const timeA = parseFloat(a["Execution Time (ms)"]) || Infinity;
    const timeB = parseFloat(b["Execution Time (ms)"]) || Infinity;
    if (timeA !== timeB) return timeA - timeB;

    const memA = parseFloat(a["Peak Memory"]) || Infinity;
    const memB = parseFloat(b["Peak Memory"]) || Infinity;
    return memA - memB;
  });

  const winner = sorted[0];
  const champDiv = document.getElementById("champion-details");

  champDiv.innerHTML = `
    <strong>${winner["Author"]} (${winner["Roll Number"]})</strong><br>
    ⏱ Execution Time: ${winner["Execution Time (ms)"]} ms<br>
    💾 Peak Memory: ${winner["Peak Memory"]} MB<br>
    🏅 Algorithm: ${winner["Algorithm"]}
  `;
}
