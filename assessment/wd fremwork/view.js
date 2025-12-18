// DOM Elements
const tableContainer = document.getElementById('tableContainer');
const searchInput = document.getElementById('searchInput');
const recordCount = document.getElementById('recordCount');

// Load and display data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadAndDisplayGuests();
    
    // Add search functionality
    searchInput.addEventListener('input', function() {
        filterGuests(this.value.toLowerCase());
    });
});

// Load guests from localStorage and display in table
function loadAndDisplayGuests() {
    // Get data from localStorage
    const guests = JSON.parse(localStorage.getItem('hotelGuests')) || [];
    
    // Update record count
    recordCount.textContent = guests.length;
    
    // If no data exists
    if (guests.length === 0) {
        displayNoDataMessage();
        return;
    }
    
    // Create table
    const table = document.createElement('table');
    
    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Full Name</th>
            <th>Phone Number</th>
            <th>Email Address</th>
            <th>Aadhar Card</th>
            <th>Check-in Date</th>
            <th>Check-out Date</th>
            <th>Purpose</th>
            <th>Registration Date</th>
            <th>Actions</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    tbody.id = 'guestsTableBody';
    
    // Sort guests by registration date (newest first)
    const sortedGuests = guests.sort((a, b) => b.id - a.id);
    
    // Add rows for each guest
    sortedGuests.forEach(guest => {
        const row = document.createElement('tr');
        
        // Format dates for display
        const checkInDate = formatDate(guest.checkIn);
        const checkOutDate = formatDate(guest.checkOut);
        
        row.innerHTML = `
            <td>${guest.fullName}</td>
            <td>${guest.phone}</td>
            <td>${guest.email}</td>
            <td>${guest.aadhar}</td>
            <td>${checkInDate}</td>
            <td>${checkOutDate}</td>
            <td>${getPurposeLabel(guest.purpose)}</td>
            <td>${guest.registrationDate}</td>
            <td class="action-buttons">
                <button class="delete-btn" onclick="deleteGuest(${guest.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}

// Format date from YYYY-MM-DD to DD/MM/YYYY
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
}

// Get purpose label for display
function getPurposeLabel(purposeKey) {
    const purposes = {
        'business': 'Business',
        'leisure': 'Leisure/Vacation',
        'wedding': 'Wedding/Event',
        'medical': 'Medical',
        'other': 'Other'
    };
    
    return purposes[purposeKey] || purposeKey;
}

// Display message when no data is available
function displayNoDataMessage() {
    tableContainer.innerHTML = `
        <div class="no-data">
            <i class="fas fa-database"></i>
            <h3>No Guest Data Available</h3>
            <p>No guest registrations have been submitted yet.</p>
            <p>Use the registration form to add new guest records.</p>
            <a href="index.html" class="btn view-btn" style="margin-top: 20px;">
                <i class="fas fa-user-plus"></i> Go to Registration Form
            </a>
        </div>
    `;
}

// Filter guests based on search input
function filterGuests(searchTerm) {
    const rows = document.querySelectorAll('#guestsTableBody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        if (rowText.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update record count to show filtered results
    if (searchTerm) {
        recordCount.textContent = `${visibleCount} of ${rows.length}`;
    } else {
        recordCount.textContent = rows.length;
    }
}

// Delete a guest record
function deleteGuest(guestId) {
    if (confirm('Are you sure you want to delete this guest record? This action cannot be undone.')) {
        // Get current guests
        let guests = JSON.parse(localStorage.getItem('hotelGuests')) || [];
        
        // Filter out the guest to delete
        guests = guests.filter(guest => guest.id !== guestId);
        
        // Save back to localStorage
        localStorage.setItem('hotelGuests', JSON.stringify(guests));
        
        // Reload the table
        loadAndDisplayGuests();
        
        // Show confirmation message
        alert('Guest record deleted successfully.');
    }
}

// Optional: Function to clear all data (for testing)
function clearAllData() {
    if (confirm('Are you sure you want to delete ALL guest records? This action cannot be undone.')) {
        localStorage.removeItem('hotelGuests');
        loadAndDisplayGuests();
        alert('All guest records have been deleted.');
    }
}