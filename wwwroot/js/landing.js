const API_BASE = '/api';

// Load clients and trainers
async function showClientLogin() {
    closeModals();
    try {
        const response = await fetch(`${API_BASE}/clients`);
        const clients = await response.json();
        
        const clientList = document.getElementById('clientList');
        if (clients.length === 0) {
            clientList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">👤</div><p>No clients found. Create your first account!</p></div>';
        } else {
            clientList.innerHTML = clients.map(client => `
                <div class="user-item" onclick="loginAsClient(${client.clientID})">
                    <h4>${client.name}</h4>
                    <p>${client.email || 'No email'}</p>
                </div>
            `).join('');
        }
        
        document.getElementById('clientLoginModal').classList.add('active');
    } catch (error) {
        console.error('Error loading clients:', error);
        alert('Failed to load clients');
    }
}

async function showTrainerLogin() {
    closeModals();
    try {
        const response = await fetch(`${API_BASE}/trainers`);
        const trainers = await response.json();
        
        const trainerList = document.getElementById('trainerList');
        if (trainers.length === 0) {
            trainerList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💪</div><p>No trainers found. Create your first account!</p></div>';
        } else {
            trainerList.innerHTML = trainers.map(trainer => `
                <div class="user-item" onclick="loginAsTrainer(${trainer.trainerID})">
                    <h4>${trainer.name}</h4>
                    <p>${trainer.specialty || 'Trainer'} - $${trainer.hourlyRate ? trainer.hourlyRate.toFixed(2) : '0.00'}/hr</p>
                </div>
            `).join('');
        }
        
        document.getElementById('trainerLoginModal').classList.add('active');
    } catch (error) {
        console.error('Error loading trainers:', error);
        alert('Failed to load trainers');
    }
}

function loginAsClient(clientID) {
    sessionStorage.setItem('userType', 'client');
    sessionStorage.setItem('userId', clientID);
    window.location.href = '/client.html';
}

function loginAsTrainer(trainerID) {
    sessionStorage.setItem('userType', 'trainer');
    sessionStorage.setItem('userId', trainerID);
    window.location.href = '/trainer.html';
}

function createNewClient() {
    closeModals();
    document.getElementById('createClientModal').classList.add('active');
}

function createNewTrainer() {
    closeModals();
    document.getElementById('createTrainerModal').classList.add('active');
}

async function submitNewClient(event) {
    event.preventDefault();
    
    const client = {
        name: document.getElementById('newClientName').value,
        email: document.getElementById('newClientEmail').value,
        phone: document.getElementById('newClientPhone').value,
        membershipStatus: 'Active'
    };
    
    try {
        const response = await fetch(`${API_BASE}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client)
        });
        
        if (response.ok) {
            const newClient = await response.json();
            loginAsClient(newClient.clientID);
        } else {
            alert('Failed to create client account');
        }
    } catch (error) {
        console.error('Error creating client:', error);
        alert('Failed to create client account');
    }
}

async function submitNewTrainer(event) {
    event.preventDefault();
    
    const rate = parseFloat(document.getElementById('newTrainerRate').value);
    const trainer = {
        name: document.getElementById('newTrainerName').value,
        specialty: document.getElementById('newTrainerSpecialty').value,
        hourlyRate: rate,
        contactInfo: document.getElementById('newTrainerContact').value,
        vitalcoreFee: rate * 0.2 // 20% fee
    };
    
    try {
        const response = await fetch(`${API_BASE}/trainers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trainer)
        });
        
        if (response.ok) {
            const newTrainer = await response.json();
            loginAsTrainer(newTrainer.trainerID);
        } else {
            alert('Failed to create trainer account');
        }
    } catch (error) {
        console.error('Error creating trainer:', error);
        alert('Failed to create trainer account');
    }
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}
