




const tbody = document.querySelector('#cryptoTable tbody');
const searchInput = document.getElementById('search');

async function fetchCryptoData() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false'
    );
    const data = await res.json();
    renderTable(data);
  } catch (err) {
    console.error('Error fetching crypto data:', err);
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:red;">Failed to load data. Try again later.</td></tr>`;
  }
}

function renderTable(coins) {
  tbody.innerHTML = '';

  coins.forEach((coin, index) => {
    const changeClass = coin.price_change_percentage_24h > 0 ? 'positive' : 'negative';
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>
        <img src="${coin.image}" alt="${coin.name}" width="24" style="vertical-align:middle; margin-right:8px;"/>
        <strong>${coin.name}</strong> <small>(${coin.symbol.toUpperCase()})</small>
      </td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td class="${changeClass}">
        ${coin.price_change_percentage_24h ? coin.price_change_percentage_24h.toFixed(2) + '%' : 'N/A'}
      </td>
      <td>$${(coin.market_cap / 1e9).toFixed(2)}B</td>
    `;
    tbody.appendChild(row);
  });
}

// Search functionality
searchInput.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const rows = tbody.querySelectorAll('tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(term) ? '' : 'none';
  });
});

// Initial load + auto refresh
fetchCryptoData();
setInterval(fetchCryptoData, 60000); // refresh every 60 seconds

// Make table headers clickable for simple sorting (optional extension)
