// Change this to the raw GitHub URL of your CSV file
const CSV_URL = "https://raw.githubusercontent.com/<your-username>/gpu-leaderboard/main/scores.csv";

function parseCSV(text) {
  const [header, ...rows] = text.trim().split("\n");
  const cols = header.split(",");
  return rows.map(r => {
    const values = r.split(",");
    return Object.fromEntries(cols.map((c, i) => [c.trim(), values[i]?.trim()]));
  });
}

function renderTable(data) {
  if (!data.length) return "<p>No data available</p>";

  const cols = Object.keys(data[0]);
  let html = "<table><thead><tr>";
  cols.forEach(c => html += `<th>${c}</th>`);
  html += "</tr></thead><tbody>";

  data.forEach(row => {
    html += "<tr>";
    cols.forEach(c => html += `<td>${row[c]}</td>`);
    html += "</tr>";
  });

  html += "</tbody></table>";
  return html;
}

async function loadCSV() {
  const res = await fetch(CSV_URL);
  const text = await res.text();
  const data = parseCSV(text);
  document.getElementById("leaderboard").innerHTML = renderTable(data);
}

loadCSV();
