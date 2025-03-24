// Franchise Tracker Application

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initNavigation();
    initDashboard();
    initLeadsTable();
    initPipeline();
    initDevelopmentTracker();
    initModalHandlers();
});

// Navigation between views
function initNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and views
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show the corresponding view
            const viewId = this.getAttribute('data-view');
            document.getElementById(viewId).classList.add('active');
        });
    });
}

// Dashboard initialization
function initDashboard() {
    // Initialize charts
    initPipelineChart();
    initDevelopmentChart();
    
    // Date range filter
    const dateRange = document.getElementById('date-range');
    if (dateRange) {
        dateRange.addEventListener('change', function() {
            // In a real application, this would filter the dashboard data
            console.log('Date range changed to:', this.value);
            // For demo purposes, we'll just reload the charts
            initPipelineChart();
            initDevelopmentChart();
        });
    }
}

// Pipeline Chart
function initPipelineChart() {
    const ctx = document.getElementById('pipeline-chart');
    if (!ctx) return;
    
    // Check if chart already exists and destroy it
    if (ctx.chart) {
        ctx.chart.destroy();
    }
    
    // Create new chart
    ctx.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.pipeline.labels,
            datasets: [{
                label: 'Number of Leads',
                data: chartData.pipeline.data,
                backgroundColor: '#e84c3d',
                borderColor: '#e84c3d',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Development Chart
function initDevelopmentChart() {
    const ctx = document.getElementById('development-chart');
    if (!ctx) return;
    
    // Check if chart already exists and destroy it
    if (ctx.chart) {
        ctx.chart.destroy();
    }
    
    // Create new chart
    ctx.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.development.labels,
            datasets: [{
                label: 'Franchises in Stage',
                data: chartData.development.data,
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: '#3498db',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Leads Table
function initLeadsTable() {
    const tableBody = document.querySelector('#leads-table tbody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Populate table with leads data
    leadsData.forEach(lead => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${lead.name}</td>
            <td>${lead.location}</td>
            <td>${lead.email}<br>${lead.phone}</td>
            <td>${formatSource(lead.source)}</td>
            <td><span class="status-badge ${lead.status}">${formatStatus(lead.status)}</span></td>
            <td>${formatDate(lead.createdDate)}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${lead.id}">Edit</button>
                <button class="action-btn view-btn" data-id="${lead.id}">View</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const leadId = this.getAttribute('data-id');
            openLeadModal('edit', leadId);
        });
    });
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const leadId = this.getAttribute('data-id');
            viewLeadDetails(leadId);
        });
    });
    
    // Add event listener to search input
    const searchInput = document.getElementById('lead-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterLeads();
        });
    }
    
    // Add event listeners to filters
    const statusFilter = document.getElementById('lead-status-filter');
    const sourceFilter = document.getElementById('lead-source-filter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterLeads);
    }
    
    if (sourceFilter) {
        sourceFilter.addEventListener('change', filterLeads);
    }
}

// Filter leads based on search and filter values
function filterLeads() {
    const searchValue = document.getElementById('lead-search').value.toLowerCase();
    const statusFilter = document.getElementById('lead-status-filter').value;
    const sourceFilter = document.getElementById('lead-source-filter').value;
    
    const tableRows = document.querySelectorAll('#leads-table tbody tr');
    
    tableRows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const location = row.cells[1].textContent.toLowerCase();
        const contact = row.cells[2].textContent.toLowerCase();
        const source = row.cells[3].textContent.toLowerCase();
        const status = row.cells[4].textContent.toLowerCase();
        
        const matchesSearch = name.includes(searchValue) || 
                              location.includes(searchValue) || 
                              contact.includes(searchValue);
        
        const matchesStatus = statusFilter === 'all' || status.includes(statusFilter.toLowerCase());
        const matchesSource = sourceFilter === 'all' || source.includes(sourceFilter.toLowerCase());
        
        if (matchesSearch && matchesStatus && matchesSource) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Format lead source for display
function formatSource(source) {
    const sourceMap = {
        'website': 'Website',
        'referral': 'Referral',
        'social': 'Social Media',
        'event': 'Event',
        'other': 'Other'
    };
    
    return sourceMap[source] || source;
}

// Format lead status for display
function formatStatus(status) {
    const statusMap = {
        'new': 'New',
        'contacted': 'Contacted',
        'qualified': 'Qualified',
        'unqualified': 'Unqualified'
    };
    
    return statusMap[status] || status;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Initialize Sales Pipeline
function initPipeline() {
    // Populate pipeline stages with cards
    for (const [stageId, leads] of Object.entries(pipelineData)) {
        const stageElement = document.getElementById(stageId);
        if (!stageElement) continue;
        
        // Clear existing cards
        stageElement.innerHTML = '';
        
        // Add cards for each lead in this stage
        leads.forEach(lead => {
            const card = document.createElement('div');
            card.className = 'pipeline-card';
            card.setAttribute('data-id', lead.id);
            
            card.innerHTML = `
                <h4>${lead.name}</h4>
                <p>${lead.location}</p>
                <p class="card-notes">${lead.notes}</p>
                <div class="card-footer">
                    <span>${formatDate(lead.date)}</span>
                    <button class="card-action">Move →</button>
                </div>
            `;
            
            stageElement.appendChild(card);
        });
    }
    
    // Add event listeners to card action buttons
    document.querySelectorAll('.card-action').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.pipeline-card');
            const leadId = card.getAttribute('data-id');
            // In a real app, this would open a modal to move the lead to another stage
            alert(`Move lead ${leadId} to next stage`);
        });
    });
}

// Initialize Development Tracker
function initDevelopmentTracker() {
    const developmentGrid = document.querySelector('.development-grid');
    if (!developmentGrid) return;
    
    // Clear existing cards
    developmentGrid.innerHTML = '';
    
    // Add cards for each franchise in development
    developmentData.forEach(franchise => {
        const card = document.createElement('div');
        card.className = 'development-card';
        
        // Create stages list HTML
        let stagesHTML = '';
        franchise.stages.forEach(stage => {
            let statusIcon = '○';
            if (stage.status === 'completed') statusIcon = '✓';
            if (stage.status === 'current') statusIcon = '●';
            
            stagesHTML += `
                <div class="stage-item">
                    <div class="stage-status ${stage.status}">${statusIcon}</div>
                    <div class="stage-name">${stage.name}</div>
                    <div class="stage-date">${stage.date}</div>
                </div>
            `;
        });
        
        card.innerHTML = `
            <h3>${franchise.name} - ${franchise.location}</h3>
            <p>Agreement signed: ${formatDate(franchise.agreementDate)}</p>
            <div class="progress-container">
                <div class="progress-label">
                    <span>Progress</span>
                    <span>${franchise.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${franchise.progress}%"></div>
                </div>
            </div>
            <p>Current stage: ${franchise.currentStage}</p>
            <p class="dev-notes">${franchise.notes}</p>
            <div class="stage-list">
                ${stagesHTML}
            </div>
        `;
        
        developmentGrid.appendChild(card);
    });
    
    // Add event listener to search input
    const searchInput = document.getElementById('development-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterDevelopment();
        });
    }
    
    // Add event listener to stage filter
    const stageFilter = document.getElementById('development-stage-filter');
    if (stageFilter) {
        stageFilter.addEventListener('change', filterDevelopment);
    }
}

// Filter development franchises
function filterDevelopment() {
    const searchValue = document.getElementById('development-search').value.toLowerCase();
    const stageFilter = document.getElementById('development-stage-filter').value;
    
    const cards = document.querySelectorAll('.development-card');
    
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const currentStage = card.querySelector('p:nth-of-type(2)').textContent.toLowerCase();
        
        const matchesSearch = title.includes(searchValue);
        const matchesStage = stageFilter === 'all' || currentStage.includes(stageFilter.toLowerCase());
        
        if (matchesSearch && matchesStage) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Modal Handlers
function initModalHandlers() {
    const modal = document.getElementById('lead-modal');
    const addLeadBtn = document.getElementById('add-lead-btn');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancel-lead');
    const leadForm = document.getElementById('lead-form');
    
    // Open modal when Add New Lead button is clicked
    if (addLeadBtn) {
        addLeadBtn.addEventListener('click', function() {
            openLeadModal('add');
        });
    }
    
    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeModal();
        });
    }
    
    // Close modal when Cancel button is clicked
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            closeModal();
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Handle form submission
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, this would save the lead data
            const formData = {
                name: document.getElementById('lead-name').value,
                email: document.getElementById('lead-email').value,
                phone: document.getElementById('lead-phone').value,
                location: document.getElementById('lead-location').value,
                source: document.getElementById('lead-source').value,
                notes: document.getElementById('lead-notes').value
            };
            
            console.log('Form submitted:', formData);
            
            // Close the modal and refresh the leads table
            closeModal();
            
            // Add the new lead to the data (in a real app, this would be an API call)
            const newLead = {
                id: leadsData.length + 1,
                ...formData,
                status: 'new',
                createdDate: new Date().toISOString().split('T')[0]
            };
            
            leadsData.push(newLead);
            
            // Refresh the leads table
            initLeadsTable();
            
            // Show success message
            alert('Lead added successfully!');
        });
    }
}

// Open lead modal for adding or editing
function openLeadModal(mode, leadId) {
    const modal = document.getElementById('lead-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('lead-form');
    
    if (!modal || !modalTitle || !form) return;
    
    // Reset form
    form.reset();
    
    if (mode === 'add') {
        modalTitle.textContent = 'Add New Lead';
    } else if (mode === 'edit') {
        modalTitle.textContent = 'Edit Lead';
        
        // Find the lead data
        const lead = leadsData.find(l => l.id == leadId);
        if (lead) {
            // Populate form with lead data
            document.getElementById('lead-name').value = lead.name;
            document.getElementById('lead-email').value = lead.email;
            document.getElementById('lead-phone').value = lead.phone;
            document.getElementById('lead-location').value = lead.location;
            document.getElementById('lead-source').value = lead.source;
            document.getElementById('lead-notes').value = lead.notes;
        }
    }
    
    // Display the modal
    modal.style.display = 'flex';
}

// Close the modal
function closeModal() {
    const modal = document.getElementById('lead-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// View lead details
function viewLeadDetails(leadId) {
    // Find the lead data
    const lead = leadsData.find(l => l.id == leadId);
    if (lead) {
        // In a real application, this would open a detailed view
        alert(`Lead Details:\nName: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nLocation: ${lead.location}\nSource: ${formatSource(lead.source)}\nStatus: ${formatStatus(lead.status)}\nCreated: ${formatDate(lead.createdDate)}\nNotes: ${lead.notes}`);
    }
}
