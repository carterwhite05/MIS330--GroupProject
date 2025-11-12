// API Base URL
const API_BASE = '/api';

// Current state
let currentSection = 'trainers';
let editingId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadTrainers();
});

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(section) {
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === section);
    });
    
    // Update active section
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.toggle('active', sec.id === section);
    });
    
    currentSection = section;
    
    // Load data for section
    switch(section) {
        case 'trainers': loadTrainers(); break;
        case 'clients': loadClients(); break;
        case 'facilities': loadFacilities(); break;
        case 'sessions': loadSessions(); break;
        case 'payments': loadPayments(); break;
    }
}

// Trainers
async function loadTrainers() {
    try {
        const response = await fetch(`${API_BASE}/trainers`);
        const trainers = await response.json();
        const tbody = document.querySelector('#trainersTable tbody');
        tbody.innerHTML = trainers.map(trainer => `
            <tr>
                <td>${trainer.trainerID}</td>
                <td>${trainer.name}</td>
                <td>${trainer.specialty || 'N/A'}</td>
                <td>$${trainer.hourlyRate ? trainer.hourlyRate.toFixed(2) : '0.00'}</td>
                <td>${trainer.contactInfo || 'N/A'}</td>
                <td>$${trainer.vitalcoreFee ? trainer.vitalcoreFee.toFixed(2) : '0.00'}</td>
                <td class="action-buttons">
                    <button class="btn btn-small btn-primary" onclick="editTrainer(${trainer.trainerID})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteTrainer(${trainer.trainerID})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading trainers:', error);
        alert('Failed to load trainers');
    }
}

function showTrainerModal(trainer = null) {
    editingId = trainer?.trainerID || null;
    document.getElementById('modalTitle').textContent = trainer ? 'Edit Trainer' : 'Add Trainer';
    
    document.getElementById('formFields').innerHTML = `
        <div class="form-group">
            <label>Name *</label>
            <input type="text" id="name" required value="${trainer?.name || ''}">
        </div>
        <div class="form-group">
            <label>Specialty</label>
            <input type="text" id="specialty" value="${trainer?.specialty || ''}">
        </div>
        <div class="form-group">
            <label>Hourly Rate</label>
            <input type="number" step="0.01" id="hourlyRate" value="${trainer?.hourlyRate || ''}">
        </div>
        <div class="form-group">
            <label>Contact Info</label>
            <input type="text" id="contactInfo" value="${trainer?.contactInfo || ''}">
        </div>
        <div class="form-group">
            <label>VitalCore Fee</label>
            <input type="number" step="0.01" id="vitalcoreFee" value="${trainer?.vitalcoreFee || ''}">
        </div>
    `;
    
    document.getElementById('modalForm').onsubmit = (e) => {
        e.preventDefault();
        saveTrainer();
    };
    
    document.getElementById('modal').classList.add('active');
}

async function saveTrainer() {
    const trainer = {
        name: document.getElementById('name').value,
        specialty: document.getElementById('specialty').value || null,
        hourlyRate: parseFloat(document.getElementById('hourlyRate').value) || null,
        contactInfo: document.getElementById('contactInfo').value || null,
        vitalcoreFee: parseFloat(document.getElementById('vitalcoreFee').value) || null
    };
    
    try {
        const url = editingId ? `${API_BASE}/trainers/${editingId}` : `${API_BASE}/trainers`;
        const method = editingId ? 'PUT' : 'POST';
        
        if (editingId) {
            trainer.trainerID = editingId;
        }
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trainer)
        });
        
        if (response.ok) {
            closeModal();
            loadTrainers();
        } else {
            alert('Failed to save trainer');
        }
    } catch (error) {
        console.error('Error saving trainer:', error);
        alert('Failed to save trainer');
    }
}

async function editTrainer(id) {
    try {
        const response = await fetch(`${API_BASE}/trainers/${id}`);
        const trainer = await response.json();
        showTrainerModal(trainer);
    } catch (error) {
        console.error('Error loading trainer:', error);
        alert('Failed to load trainer');
    }
}

async function deleteTrainer(id) {
    if (!confirm('Are you sure you want to delete this trainer?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/trainers/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadTrainers();
        } else {
            alert('Failed to delete trainer');
        }
    } catch (error) {
        console.error('Error deleting trainer:', error);
        alert('Failed to delete trainer');
    }
}

// Clients
async function loadClients() {
    try {
        const response = await fetch(`${API_BASE}/clients`);
        const clients = await response.json();
        const tbody = document.querySelector('#clientsTable tbody');
        tbody.innerHTML = clients.map(client => `
            <tr>
                <td>${client.clientID}</td>
                <td>${client.name}</td>
                <td>${client.email || 'N/A'}</td>
                <td>${client.phone || 'N/A'}</td>
                <td>${client.membershipStatus || 'N/A'}</td>
                <td class="action-buttons">
                    <button class="btn btn-small btn-primary" onclick="editClient(${client.clientID})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteClient(${client.clientID})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading clients:', error);
        alert('Failed to load clients');
    }
}

function showClientModal(client = null) {
    editingId = client?.clientID || null;
    document.getElementById('modalTitle').textContent = client ? 'Edit Client' : 'Add Client';
    
    document.getElementById('formFields').innerHTML = `
        <div class="form-group">
            <label>Name *</label>
            <input type="text" id="name" required value="${client?.name || ''}">
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" id="email" value="${client?.email || ''}">
        </div>
        <div class="form-group">
            <label>Phone</label>
            <input type="tel" id="phone" value="${client?.phone || ''}">
        </div>
        <div class="form-group">
            <label>Membership Status</label>
            <select id="membershipStatus">
                <option value="">Select Status</option>
                <option value="Active" ${client?.membershipStatus === 'Active' ? 'selected' : ''}>Active</option>
                <option value="Inactive" ${client?.membershipStatus === 'Inactive' ? 'selected' : ''}>Inactive</option>
                <option value="Suspended" ${client?.membershipStatus === 'Suspended' ? 'selected' : ''}>Suspended</option>
            </select>
        </div>
    `;
    
    document.getElementById('modalForm').onsubmit = (e) => {
        e.preventDefault();
        saveClient();
    };
    
    document.getElementById('modal').classList.add('active');
}

async function saveClient() {
    const client = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value || null,
        phone: document.getElementById('phone').value || null,
        membershipStatus: document.getElementById('membershipStatus').value || null
    };
    
    try {
        const url = editingId ? `${API_BASE}/clients/${editingId}` : `${API_BASE}/clients`;
        const method = editingId ? 'PUT' : 'POST';
        
        if (editingId) {
            client.clientID = editingId;
        }
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client)
        });
        
        if (response.ok) {
            closeModal();
            loadClients();
        } else {
            alert('Failed to save client');
        }
    } catch (error) {
        console.error('Error saving client:', error);
        alert('Failed to save client');
    }
}

async function editClient(id) {
    try {
        const response = await fetch(`${API_BASE}/clients/${id}`);
        const client = await response.json();
        showClientModal(client);
    } catch (error) {
        console.error('Error loading client:', error);
        alert('Failed to load client');
    }
}

async function deleteClient(id) {
    if (!confirm('Are you sure you want to delete this client?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/clients/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadClients();
        } else {
            alert('Failed to delete client');
        }
    } catch (error) {
        console.error('Error deleting client:', error);
        alert('Failed to delete client');
    }
}

// Facilities
async function loadFacilities() {
    try {
        const response = await fetch(`${API_BASE}/facilities`);
        const facilities = await response.json();
        const tbody = document.querySelector('#facilitiesTable tbody');
        tbody.innerHTML = facilities.map(facility => `
            <tr>
                <td>${facility.facilityID}</td>
                <td>${facility.location || 'N/A'}</td>
                <td>${facility.roomName || 'N/A'}</td>
                <td>${facility.equipment || 'N/A'}</td>
                <td>${facility.capacity || 'N/A'}</td>
                <td class="action-buttons">
                    <button class="btn btn-small btn-primary" onclick="editFacility(${facility.facilityID})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteFacility(${facility.facilityID})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading facilities:', error);
        alert('Failed to load facilities');
    }
}

function showFacilityModal(facility = null) {
    editingId = facility?.facilityID || null;
    document.getElementById('modalTitle').textContent = facility ? 'Edit Facility' : 'Add Facility';
    
    document.getElementById('formFields').innerHTML = `
        <div class="form-group">
            <label>Location</label>
            <input type="text" id="location" value="${facility?.location || ''}">
        </div>
        <div class="form-group">
            <label>Room Name</label>
            <input type="text" id="roomName" value="${facility?.roomName || ''}">
        </div>
        <div class="form-group">
            <label>Equipment</label>
            <textarea id="equipment" rows="3">${facility?.equipment || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Capacity</label>
            <input type="number" id="capacity" value="${facility?.capacity || ''}">
        </div>
    `;
    
    document.getElementById('modalForm').onsubmit = (e) => {
        e.preventDefault();
        saveFacility();
    };
    
    document.getElementById('modal').classList.add('active');
}

async function saveFacility() {
    const facility = {
        location: document.getElementById('location').value || null,
        roomName: document.getElementById('roomName').value || null,
        equipment: document.getElementById('equipment').value || null,
        capacity: parseInt(document.getElementById('capacity').value) || null
    };
    
    try {
        const url = editingId ? `${API_BASE}/facilities/${editingId}` : `${API_BASE}/facilities`;
        const method = editingId ? 'PUT' : 'POST';
        
        if (editingId) {
            facility.facilityID = editingId;
        }
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(facility)
        });
        
        if (response.ok) {
            closeModal();
            loadFacilities();
        } else {
            alert('Failed to save facility');
        }
    } catch (error) {
        console.error('Error saving facility:', error);
        alert('Failed to save facility');
    }
}

async function editFacility(id) {
    try {
        const response = await fetch(`${API_BASE}/facilities/${id}`);
        const facility = await response.json();
        showFacilityModal(facility);
    } catch (error) {
        console.error('Error loading facility:', error);
        alert('Failed to load facility');
    }
}

async function deleteFacility(id) {
    if (!confirm('Are you sure you want to delete this facility?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/facilities/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadFacilities();
        } else {
            alert('Failed to delete facility');
        }
    } catch (error) {
        console.error('Error deleting facility:', error);
        alert('Failed to delete facility');
    }
}

// Sessions
async function loadSessions() {
    try {
        const response = await fetch(`${API_BASE}/sessionbookings`);
        const sessions = await response.json();
        const tbody = document.querySelector('#sessionsTable tbody');
        tbody.innerHTML = sessions.map(session => `
            <tr>
                <td>${session.sessionID}</td>
                <td>${session.client?.name || 'N/A'}</td>
                <td>${session.trainer?.name || 'N/A'}</td>
                <td>${session.facility?.roomName || 'N/A'}</td>
                <td>${session.date ? new Date(session.date).toLocaleDateString() : 'N/A'}</td>
                <td>${session.startTime || 'N/A'} - ${session.endTime || 'N/A'}</td>
                <td>${session.status || 'N/A'}</td>
                <td>$${session.totalFee ? session.totalFee.toFixed(2) : '0.00'}</td>
                <td class="action-buttons">
                    <button class="btn btn-small btn-primary" onclick="editSession(${session.sessionID})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteSession(${session.sessionID})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading sessions:', error);
        alert('Failed to load sessions');
    }
}

async function showSessionModal(session = null) {
    editingId = session?.sessionID || null;
    document.getElementById('modalTitle').textContent = session ? 'Edit Session' : 'Add Session';
    
    // Load clients, trainers, and facilities for dropdowns
    const [clients, trainers, facilities] = await Promise.all([
        fetch(`${API_BASE}/clients`).then(r => r.json()),
        fetch(`${API_BASE}/trainers`).then(r => r.json()),
        fetch(`${API_BASE}/facilities`).then(r => r.json())
    ]);
    
    document.getElementById('formFields').innerHTML = `
        <div class="form-group">
            <label>Client</label>
            <select id="clientID">
                <option value="">Select Client</option>
                ${clients.map(c => `<option value="${c.clientID}" ${session?.clientID === c.clientID ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Trainer</label>
            <select id="trainerID">
                <option value="">Select Trainer</option>
                ${trainers.map(t => `<option value="${t.trainerID}" ${session?.trainerID === t.trainerID ? 'selected' : ''}>${t.name}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Facility</label>
            <select id="facilityID">
                <option value="">Select Facility</option>
                ${facilities.map(f => `<option value="${f.facilityID}" ${session?.facilityID === f.facilityID ? 'selected' : ''}>${f.roomName}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Date</label>
            <input type="date" id="date" value="${session?.date ? session.date.split('T')[0] : ''}">
        </div>
        <div class="form-group">
            <label>Start Time</label>
            <input type="time" id="startTime" value="${session?.startTime || ''}">
        </div>
        <div class="form-group">
            <label>End Time</label>
            <input type="time" id="endTime" value="${session?.endTime || ''}">
        </div>
        <div class="form-group">
            <label>Status</label>
            <select id="status">
                <option value="">Select Status</option>
                <option value="Scheduled" ${session?.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                <option value="Completed" ${session?.status === 'Completed' ? 'selected' : ''}>Completed</option>
                <option value="Cancelled" ${session?.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
        </div>
        <div class="form-group">
            <label>Total Fee</label>
            <input type="number" step="0.01" id="totalFee" value="${session?.totalFee || ''}">
        </div>
    `;
    
    document.getElementById('modalForm').onsubmit = (e) => {
        e.preventDefault();
        saveSession();
    };
    
    document.getElementById('modal').classList.add('active');
}

async function saveSession() {
    const session = {
        clientID: parseInt(document.getElementById('clientID').value) || null,
        trainerID: parseInt(document.getElementById('trainerID').value) || null,
        facilityID: parseInt(document.getElementById('facilityID').value) || null,
        date: document.getElementById('date').value || null,
        startTime: document.getElementById('startTime').value || null,
        endTime: document.getElementById('endTime').value || null,
        status: document.getElementById('status').value || null,
        totalFee: parseFloat(document.getElementById('totalFee').value) || null
    };
    
    try {
        const url = editingId ? `${API_BASE}/sessionbookings/${editingId}` : `${API_BASE}/sessionbookings`;
        const method = editingId ? 'PUT' : 'POST';
        
        if (editingId) {
            session.sessionID = editingId;
        }
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(session)
        });
        
        if (response.ok) {
            closeModal();
            loadSessions();
        } else {
            alert('Failed to save session');
        }
    } catch (error) {
        console.error('Error saving session:', error);
        alert('Failed to save session');
    }
}

async function editSession(id) {
    try {
        const response = await fetch(`${API_BASE}/sessionbookings/${id}`);
        const session = await response.json();
        await showSessionModal(session);
    } catch (error) {
        console.error('Error loading session:', error);
        alert('Failed to load session');
    }
}

async function deleteSession(id) {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/sessionbookings/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadSessions();
        } else {
            alert('Failed to delete session');
        }
    } catch (error) {
        console.error('Error deleting session:', error);
        alert('Failed to delete session');
    }
}

// Payments
async function loadPayments() {
    try {
        const response = await fetch(`${API_BASE}/payments`);
        const payments = await response.json();
        const tbody = document.querySelector('#paymentsTable tbody');
        tbody.innerHTML = payments.map(payment => `
            <tr>
                <td>${payment.paymentID}</td>
                <td>${payment.sessionID || 'N/A'}</td>
                <td>${payment.trainer?.name || 'N/A'}</td>
                <td>$${payment.amountPaid ? payment.amountPaid.toFixed(2) : '0.00'}</td>
                <td>${payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}</td>
                <td>${payment.paymentStatus || 'N/A'}</td>
                <td class="action-buttons">
                    <button class="btn btn-small btn-primary" onclick="editPayment(${payment.paymentID})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deletePayment(${payment.paymentID})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading payments:', error);
        alert('Failed to load payments');
    }
}

async function showPaymentModal(payment = null) {
    editingId = payment?.paymentID || null;
    document.getElementById('modalTitle').textContent = payment ? 'Edit Payment' : 'Add Payment';
    
    // Load sessions and trainers for dropdowns
    const [sessions, trainers] = await Promise.all([
        fetch(`${API_BASE}/sessionbookings`).then(r => r.json()),
        fetch(`${API_BASE}/trainers`).then(r => r.json())
    ]);
    
    document.getElementById('formFields').innerHTML = `
        <div class="form-group">
            <label>Session</label>
            <select id="sessionID">
                <option value="">Select Session</option>
                ${sessions.map(s => `<option value="${s.sessionID}" ${payment?.sessionID === s.sessionID ? 'selected' : ''}>Session #${s.sessionID}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Trainer</label>
            <select id="trainerID">
                <option value="">Select Trainer</option>
                ${trainers.map(t => `<option value="${t.trainerID}" ${payment?.trainerID === t.trainerID ? 'selected' : ''}>${t.name}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Amount Paid</label>
            <input type="number" step="0.01" id="amountPaid" value="${payment?.amountPaid || ''}">
        </div>
        <div class="form-group">
            <label>Payment Date</label>
            <input type="date" id="paymentDate" value="${payment?.paymentDate ? payment.paymentDate.split('T')[0] : ''}">
        </div>
        <div class="form-group">
            <label>Payment Status</label>
            <select id="paymentStatus">
                <option value="">Select Status</option>
                <option value="Pending" ${payment?.paymentStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="Completed" ${payment?.paymentStatus === 'Completed' ? 'selected' : ''}>Completed</option>
                <option value="Failed" ${payment?.paymentStatus === 'Failed' ? 'selected' : ''}>Failed</option>
            </select>
        </div>
    `;
    
    document.getElementById('modalForm').onsubmit = (e) => {
        e.preventDefault();
        savePayment();
    };
    
    document.getElementById('modal').classList.add('active');
}

async function savePayment() {
    const payment = {
        sessionID: parseInt(document.getElementById('sessionID').value) || null,
        trainerID: parseInt(document.getElementById('trainerID').value) || null,
        amountPaid: parseFloat(document.getElementById('amountPaid').value) || null,
        paymentDate: document.getElementById('paymentDate').value || null,
        paymentStatus: document.getElementById('paymentStatus').value || null
    };
    
    try {
        const url = editingId ? `${API_BASE}/payments/${editingId}` : `${API_BASE}/payments`;
        const method = editingId ? 'PUT' : 'POST';
        
        if (editingId) {
            payment.paymentID = editingId;
        }
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payment)
        });
        
        if (response.ok) {
            closeModal();
            loadPayments();
        } else {
            alert('Failed to save payment');
        }
    } catch (error) {
        console.error('Error saving payment:', error);
        alert('Failed to save payment');
    }
}

async function editPayment(id) {
    try {
        const response = await fetch(`${API_BASE}/payments/${id}`);
        const payment = await response.json();
        await showPaymentModal(payment);
    } catch (error) {
        console.error('Error loading payment:', error);
        alert('Failed to load payment');
    }
}

async function deletePayment(id) {
    if (!confirm('Are you sure you want to delete this payment?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/payments/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadPayments();
        } else {
            alert('Failed to delete payment');
        }
    } catch (error) {
        console.error('Error deleting payment:', error);
        alert('Failed to delete payment');
    }
}

// Modal utilities
function closeModal() {
    document.getElementById('modal').classList.remove('active');
    editingId = null;
}
