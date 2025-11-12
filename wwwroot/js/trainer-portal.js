const API_BASE = '/api';
let currentTrainer = null;
let allSessions = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Check if logged in
    const userId = sessionStorage.getItem('userId');
    const userType = sessionStorage.getItem('userType');
    
    if (!userId || userType !== 'trainer') {
        window.location.href = '/landing.html';
        return;
    }
    
    await loadCurrentTrainer(userId);
    await loadAllData();
    initTabs();
    initFilters();
    
    // Auto-update rate fee
    document.getElementById('profileRate').addEventListener('input', (e) => {
        const rate = parseFloat(e.target.value) || 0;
        document.getElementById('profileFee').value = (rate * 0.2).toFixed(2);
    });
});

async function loadCurrentTrainer(trainerId) {
    try {
        const response = await fetch(`${API_BASE}/trainers/${trainerId}`);
        currentTrainer = await response.json();
        document.getElementById('trainerName').textContent = currentTrainer.name;
        loadProfile();
    } catch (error) {
        console.error('Error loading trainer:', error);
        logout();
    }
}

async function loadAllData() {
    try {
        const [sessionsRes, paymentsRes] = await Promise.all([
            fetch(`${API_BASE}/sessionbookings`),
            fetch(`${API_BASE}/payments`)
        ]);
        
        allSessions = await sessionsRes.json();
        const allPayments = await paymentsRes.json();
        
        // Filter my sessions
        const mySessions = allSessions.filter(s => s.trainerID === currentTrainer.trainerID);
        const myPayments = allPayments.filter(p => p.trainerID === currentTrainer.trainerID);
        
        updateDashboard(mySessions, myPayments);
        loadSessions();
        loadEarnings(myPayments, mySessions);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function updateDashboard(sessions, payments) {
    const upcoming = sessions.filter(s => s.status === 'Scheduled' && new Date(s.date) >= new Date()).length;
    const completed = sessions.filter(s => s.status === 'Completed').length;
    const uniqueClients = new Set(sessions.map(s => s.clientID)).size;
    const totalEarnings = payments.filter(p => p.paymentStatus === 'Completed').reduce((sum, p) => sum + (p.amountPaid || 0), 0);
    
    document.getElementById('upcomingSessions').textContent = upcoming;
    document.getElementById('completedSessions').textContent = completed;
    document.getElementById('totalClients').textContent = uniqueClients;
    document.getElementById('totalEarnings').textContent = `$${totalEarnings.toFixed(2)}`;
    
    // Load upcoming sessions
    const upcomingList = sessions
        .filter(s => s.status === 'Scheduled' && new Date(s.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    
    const container = document.getElementById('upcomingSessionsList');
    if (upcomingList.length === 0) {
        container.innerHTML = '<div style="background: white; padding: 2rem; border-radius: 0.75rem; text-align: center; color: var(--text-secondary);"><p>No upcoming sessions scheduled.</p></div>';
    } else {
        container.innerHTML = `
            <h3 style="margin: 2rem 0 1rem;">Upcoming Sessions</h3>
            ${upcomingList.map(session => renderSessionCard(session)).join('')}
        `;
    }
}

function renderSessionCard(session) {
    const statusClass = session.status?.toLowerCase() || 'scheduled';
    return `
        <div class="session-card ${statusClass}" style="margin-bottom: 1rem;">
            <div class="card-header">
                <div>
                    <div class="card-title">${session.client?.name || 'Unknown Client'}</div>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Session #${session.sessionID}</p>
                </div>
                <span class="card-status status-${statusClass}">${session.status || 'Scheduled'}</span>
            </div>
            <div class="card-details">
                <div class="detail-row">
                    <span>Date:</span>
                    <strong>${session.date ? new Date(session.date).toLocaleDateString() : 'TBD'}</strong>
                </div>
                <div class="detail-row">
                    <span>Time:</span>
                    <strong>${session.startTime || 'TBD'} - ${session.endTime || 'TBD'}</strong>
                </div>
                <div class="detail-row">
                    <span>Facility:</span>
                    <strong>${session.facility?.roomName || 'TBD'}</strong>
                </div>
                <div class="detail-row">
                    <span>Fee:</span>
                    <strong>$${session.totalFee ? session.totalFee.toFixed(2) : '0.00'}</strong>
                </div>
            </div>
            ${session.status === 'Scheduled' ? `
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="btn btn-success btn-sm" style="flex: 1;" onclick="completeSession(${session.sessionID})">Mark Complete</button>
                    <button class="btn btn-danger btn-sm" style="flex: 1;" onclick="cancelSession(${session.sessionID})">Cancel</button>
                </div>
            ` : ''}
        </div>
    `;
}

function loadSessions() {
    const mySessions = allSessions.filter(s => s.trainerID === currentTrainer.trainerID);
    displayFilteredSessions(mySessions);
}

function displayFilteredSessions(sessions) {
    let filtered = sessions;
    if (currentFilter !== 'all') {
        filtered = sessions.filter(s => s.status === currentFilter);
    }
    
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const container = document.getElementById('allSessionsList');
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><p>No sessions found.</p></div>';
    } else {
        container.innerHTML = filtered.map(s => renderSessionCard(s)).join('');
    }
}

async function loadEarnings(payments, sessions) {
    const completedPayments = payments.filter(p => p.paymentStatus === 'Completed');
    const pendingPayments = payments.filter(p => p.paymentStatus === 'Pending');
    
    const totalPaid = completedPayments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
    const totalPending = pendingPayments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
    
    document.getElementById('totalPaid').textContent = `$${totalPaid.toFixed(2)}`;
    document.getElementById('pendingPayments').textContent = `$${totalPending.toFixed(2)}`;
    
    // Load earnings history
    const container = document.getElementById('earningsHistory');
    if (payments.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💰</div><p>No earnings history yet.</p></div>';
    } else {
        container.innerHTML = `
            <h3 style="margin-bottom: 1rem;">Payment History</h3>
            ${payments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)).map(payment => {
                const session = sessions.find(s => s.sessionID === payment.sessionID);
                return `
                    <div class="payment-card" style="margin-bottom: 1rem;">
                        <div class="card-header">
                            <div>
                                <div class="card-title">Session #${payment.sessionID}</div>
                                <p style="color: var(--text-secondary); font-size: 0.9rem;">${session?.client?.name || 'Unknown Client'}</p>
                            </div>
                            <span class="card-status ${payment.paymentStatus === 'Completed' ? 'status-completed' : 'status-scheduled'}">${payment.paymentStatus}</span>
                        </div>
                        <div class="card-details">
                            <div class="detail-row">
                                <span>Amount:</span>
                                <strong style="color: var(--success-color);">$${payment.amountPaid ? payment.amountPaid.toFixed(2) : '0.00'}</strong>
                            </div>
                            <div class="detail-row">
                                <span>Date:</span>
                                <strong>${payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}</strong>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        `;
    }
}

function loadProfile() {
    document.getElementById('profileName').value = currentTrainer.name;
    document.getElementById('profileSpecialty').value = currentTrainer.specialty || '';
    document.getElementById('profileRate').value = currentTrainer.hourlyRate || '';
    document.getElementById('profileContact').value = currentTrainer.contactInfo || '';
    document.getElementById('profileFee').value = currentTrainer.vitalcoreFee || '';
}

async function updateProfile(event) {
    event.preventDefault();
    
    const rate = parseFloat(document.getElementById('profileRate').value);
    const updatedTrainer = {
        ...currentTrainer,
        name: document.getElementById('profileName').value,
        specialty: document.getElementById('profileSpecialty').value,
        hourlyRate: rate,
        contactInfo: document.getElementById('profileContact').value,
        vitalcoreFee: rate * 0.2
    };
    
    try {
        const response = await fetch(`${API_BASE}/trainers/${currentTrainer.trainerID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTrainer)
        });
        
        if (response.ok) {
            currentTrainer = updatedTrainer;
            document.getElementById('trainerName').textContent = currentTrainer.name;
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile');
    }
}

async function completeSession(sessionId) {
    if (!confirm('Mark this session as completed?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/sessionbookings/${sessionId}`);
        const session = await response.json();
        session.status = 'Completed';
        
        await fetch(`${API_BASE}/sessionbookings/${sessionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(session)
        });
        
        await loadAllData();
    } catch (error) {
        console.error('Error completing session:', error);
        alert('Failed to complete session');
    }
}

async function cancelSession(sessionId) {
    if (!confirm('Are you sure you want to cancel this session?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/sessionbookings/${sessionId}`);
        const session = await response.json();
        session.status = 'Cancelled';
        
        await fetch(`${API_BASE}/sessionbookings/${sessionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(session)
        });
        
        await loadAllData();
    } catch (error) {
        console.error('Error cancelling session:', error);
        alert('Failed to cancel session');
    }
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            loadSessions();
        });
    });
}

function closeSessionModal() {
    document.getElementById('sessionDetailModal').classList.remove('active');
}

function logout() {
    sessionStorage.clear();
    window.location.href = '/landing.html';
}
