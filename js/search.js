// search.js
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const table = document.getElementById('farmersTable');
  const rows = table.querySelectorAll('tbody tr');

  searchInput.addEventListener('keyup', function () {
    const query = this.value.toLowerCase();

    rows.forEach(row => {
      const name = row.cells[0].textContent.toLowerCase();
      const location = row.cells[2].textContent.toLowerCase();
      const culture = row.cells[3].textContent.toLowerCase();

      if (name.includes(query) || location.includes(query) || culture.includes(query)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
});