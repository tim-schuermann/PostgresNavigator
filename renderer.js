// Handle toggles, populate sidebar, etc.
const { getTableData } = require('./api');

const sidebar = document.getElementById('sidebar');
const queryButton = document.getElementById('query');

// Function to populate sidebar dynamically based on table data
async function populateSidebar() {
    const tables = ['costtypes', 'domains', 'projects'];
    
    for (const table of tables) {
        const data = await getTableData(table);
        
        // Create toggleable headline per table
        const button = document.createElement('button');
        button.className = "w-full text-left text-gray-700 py-2 px-3 rounded hover:bg-gray-200 focus:outline-none";
        button.textContent = table.charAt(0).toUpperCase() + table.slice(1);  // Capitalize table name
        sidebar.appendChild(button);

        // Create list for table items
        const list = document.createElement('ul');
        list.className = "mt-2 space-y-2";
        
        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <input type="checkbox" class="mr-2" data-table="${table}" data-id="${item.id}">${item.name}
            `;
            list.appendChild(listItem);
        });

        sidebar.insertBefore(button, queryButton);
        sidebar.insertBefore(list, queryButton);
    }
}

// Call the function to populate the sidebar on load
populateSidebar();

queryButton.addEventListener('click', async function() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
    const conditions = [];
    const params = [];
    
    checkboxes.forEach((checkbox, index) => {
        const table = checkbox.getAttribute('data-table');
        const id = checkbox.getAttribute('data-id');

        switch (table) {
            case 'costtypes':
                conditions.push(`costtypeid = $${index + 1}`);
                break;
            case 'domains':
                conditions.push(`domainid = $${index + 1}`);
                break;
            case 'projects':
                conditions.push(`projectid = $${index + 1}`);
                break;
        }
        params.push(id);
    });

    if (!conditions.length) {
        alert("Please select at least one item.");
        return;
    }

    const whereClause = conditions.join(' OR ');

    try {
        const res = await client.query(`SELECT * FROM items WHERE ${whereClause}`, params);
        const items = res.rows;
        
        const mainContent = document.getElementById('main');
        mainContent.innerHTML = '';

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <h2 class="text-xl font-semibold mb-3">${item.name}</h2>
                <p>Amount: ${item.amount}</p>
            `;
            mainContent.appendChild(itemDiv);
        });
    } catch (err) {
        console.error("Error fetching data", err);
        alert("Error fetching data. Please check the console for more details.");
    }
});
