// CSV file in GitHub repo (raw link)
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
        groupAndDisplay(results.data);
        highlightChampion(results.data);
      }
    });
  })
  .catch(error => {
    console.error("Error loading CSV:", error);
    document.getElementById("leaderboard-container").innerHTML =
      "<p>⚠️ Failed to load leaderboard</p>";
  });

// Group by Algorithm and display separate tables
function groupAndDisplay(data) {
  const container = document.getElementById("leaderboard-container");
  container.innerHTML = "";

  // Group rows by algorithm
  const grouped = {};
  data.forEach(row => {
    const algo = row["Algorithm"] || "Unknown";
    if (!grouped[algo]) grouped[algo] = [];
    grouped[algo].push(row);
  });

  // Create a table per algorithm
  for (const algo in grouped) {
    const algoData = grouped[algo];

    // Sort by Execution Time, then Peak Memory
    algoData.sort((a, b) => {
      const timeA = parseFloat(a["Execution Time (ms)"]) || Infinity;
      const timeB = parseFloat(b["Execution Time (ms)"]) || Infinity;
      if (timeA !== timeB) return timeA - timeB;

      const memA = parseFloat(a["Peak Memory"]) || Infinity;
      const memB = parseFloat(b["Peak Memory"]) || Infinity;
      return memA - memB;
    });

    // Create section
    const section = document.createElement("section");
    section.classList.add("algo-section");

    // Title
    const title = document.createElement("h2");
    title.textContent = `⚡ ${algo} Leaderboard`;
    section.appendChild(title);

    // Table
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Headers (Rank + CSV headers)
    const headerRow = document.createElement("tr");
    ["Rank", "Author", "Roll Number", "Execution Time (ms)", "Peak Memory"].forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Rows
    algoData.forEach((row, index) => {
      const tr = document.createElement("tr");

      // Rank
      const rankCell = document.createElement("td");
      rankCell.textContent = index + 1;
      tr.appendChild(rankCell);

      // Columns
      ["Author", "Roll Number", "Execution Time (ms)", "Peak Memory"].forEach(col => {
        const td = document.createElement("td");
        td.textContent = row[col];
        tr.appendChild(td);
      });

      // Highlight top 3
      if (index === 0) tr.style.backgroundColor = "#ffd700"; // Gold
      else if (index === 1) tr.style.backgroundColor = "#c0c0c0"; // Silver
      else if (index === 2) tr.style.backgroundColor = "#cd7f32"; // Bronze

      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    section.appendChild(table);

    container.appendChild(section);
  }
}

// Highlight global champion across all algorithms
function highlightChampion(data) {
  if (data.length === 0) return;

  // Sort all data globally
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
