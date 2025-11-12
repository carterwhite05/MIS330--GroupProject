const API_BASE = '/api';
let currentClient = null;
let selectedTrainer = null;
let facilities = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Check if logged in
    const userId = sessionStorage.getItem('userId');
    const userType = sessionStorage.getItem('userType');
    
    if (!userId || userType !== 'client') {
        window.location.href = '/landing.html';
        return;
    }
    
    await loadCurrentClient(userId);
    await loadFacilities();
    await loadTrainers();
    initTabs();
});

async function loadCurrentClient(clientId) {
    try {
        const response = await fetch(`${API_BASE}/clients/${clientId}`);
        currentClient = await response.json();
        document.getElementById('clientName').textContent = currentClient.name;
    } catch (error) {
        console.error('Error loading client:', error);
        logout();
    }
}

async function loadFacilities() {
    try {
        const response = await fetch(`${API_BASE}/facilities`);
        facilities = await response.json();
    } catch (error) {
        console.error('Error loading facilities:', error);
    }
}

async function loadTrainers() {
    try {
        const response = await fetch(`${API_BASE}/trainers`);
        const trainers = await response.json();
        
        const grid = document.getElementById('trainerGrid');
        if (trainers.length === 0) {
            grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💪</div><p>No trainers available at the moment.</p></div>';
            return;
        }
        
        grid.innerHTML = trainers.map(trainer => {
            const initials = trainer.name.split(' ').map(n => n[0]).join('').substring(0, 2);
            return `
                <div class="trainer-card">
                    <div class="trainer-header">
                        <div class="trainer-avatar">${initials}</div>
                        <div class="trainer-info">
                            <h3>${trainer.name}</h3>
                            <p class="trainer-specialty">${trainer.specialty || 'Personal Trainer'}</p>
                        </div>
                    </div>
                    <div class="trainer-rate">$${trainer.hourlyRate ? trainer.hourlyRate.toFixed(2) : '0.00'} <span>/hour</span></div>
                    <p>${trainer.contactInfo || ''}</p>
                    <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="bookSession(${trainer.trainerID})">Book Session</button>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading trainers:', error);
    }
}

async function loadMyBookings() {
    try {
        const response = await fetch(`${API_BASE}/sessionbookings`);
        const allBookings = await response.json();
        const myBookings = allBookings.filter(b => b.clientID === currentClient.clientID);
        
        const list = document.getElementById('bookingsList');
        if (myBookings.length === 0) {
            list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><p>You have no bookings yet. Browse trainers to book your first session!</p></div>';
            return;
        }
        
        list.innerHTML = myBookings.sort((a, b) => new Date(b.date) - new Date(a.date)).map(booking => {
            const statusClass = booking.status?.toLowerCase() || 'scheduled';
            return `
                <div class="booking-card ${statusClass}">
                    <div class="card-header">
                        <div>
                            <div class="card-title">${booking.trainer?.name || 'Unknown Trainer'}</div>
                            <p style="color: var(--text-secondary);">${booking.trainer?.specialty || ''}</p>
                        </div>
                        <span class="card-status status-${statusClass}">${booking.status || 'Scheduled'}</span>
                    </div>
                    <div class="card-details">
                        <div class="detail-row">
                            <span>Date:</span>
                            <strong>${booking.date ? new Date(booking.date).toLocaleDateString() : 'TBD'}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Time:</span>
                            <strong>${booking.startTime || 'TBD'} - ${booking.endTime || 'TBD'}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Facility:</span>
                            <strong>${booking.facility?.roomName || 'TBD'}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Total Fee:</span>
                            <strong>$${booking.totalFee ? booking.totalFee.toFixed(2) : '0.00'}</strong>
                        </div>
                    </div>
                    ${booking.status === 'Scheduled' ? `<button class="btn btn-danger btn-sm" style="width: 100%; margin-top: 1rem;" onclick="cancelBooking(${booking.sessionID})">Cancel Session</button>` : ''}
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

async function loadPayments() {
    try {
        const response = await fetch(`${API_BASE}/payments`);
        const allPayments = await response.json();
        
        // Get my sessions first
        const sessionsResponse = await fetch(`${API_BASE}/sessionbookings`);
        const allSessions = await sessionsResponse.json();
        const mySessionIds = allSessions.filter(s => s.clientID === currentClient.clientID).map(s => s.sessionID);
        
        const myPayments = allPayments.filter(p => mySessionIds.includes(p.sessionID));
        
        const list = document.getElementById('paymentsList');
        if (myPayments.length === 0) {
            list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💳</div><p>No payment history yet.</p></div>';
            return;
        }
        
        list.innerHTML = myPayments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)).map(payment => `
            <div class="payment-card">
                <div class="card-header">
                    <div class="card-title">Payment for Session #${payment.sessionID}</div>
                    <span class="card-status ${payment.paymentStatus === 'Completed' ? 'status-completed' : 'status-scheduled'}">${payment.paymentStatus}</span>
                </div>
                <div class="card-details">
                    <div class="detail-row">
                        <span>Trainer:</span>
                        <strong>${payment.trainer?.name || 'Unknown'}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Amount:</span>
                        <strong>$${payment.amountPaid ? payment.amountPaid.toFixed(2) : '0.00'}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Date:</span>
                        <strong>${payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}</strong>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading payments:', error);
    }
}

async function bookSession(trainerId) {
    try {
        const response = await fetch(`${API_BASE}/trainers/${trainerId}`);
        selectedTrainer = await response.json();
        
        // Populate trainer info
        const initials = selectedTrainer.name.split(' ').map(n => n[0]).join('').substring(0, 2);
        document.getElementById('selectedTrainerInfo').innerHTML = `
            <div class="trainer-header">
                <div class="trainer-avatar">${initials}</div>
                <div class="trainer-info">
                    <h3>${selectedTrainer.name}</h3>
                    <p class="trainer-specialty">${selectedTrainer.specialty || 'Personal Trainer'}</p>
                    <p class="trainer-rate">$${selectedTrainer.hourlyRate.toFixed(2)}/hour</p>
                </div>
            </div>
        `;
        
        // Populate facilities
        const facilitySelect = document.getElementById('facilitySelect');
        facilitySelect.innerHTML = '<option value="">Choose a facility...</option>' + 
            facilities.map(f => `<option value="${f.facilityID}">${f.roomName} - ${f.location}</option>`).join('');
        
        // Set min date to today
        document.getElementById('sessionDate').min = new Date().toISOString().split('T')[0];
        
        // Add change listeners for cost calculation
        document.getElementById('duration').addEventListener('change', updateBookingSummary);
        
        document.getElementById('bookSessionModal').classList.add('active');
    } catch (error) {
        console.error('Error loading trainer:', error);
        alert('Failed to load trainer details');
    }
}

function updateBookingSummary() {
    const duration = parseFloat(document.getElementById('duration').value);
    const hourlyRate = selectedTrainer.hourlyRate;
    const totalCost = (hourlyRate * duration).toFixed(2);
    
    document.getElementById('bookingSummary').innerHTML = `
        <div class="summary-row">
            <span>Hourly Rate:</span>
            <span>$${hourlyRate.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Duration:</span>
            <span>${duration} hour(s)</span>
        </div>
        <div class="summary-row total">
            <span>Total Cost:</span>
            <span>$${totalCost}</span>
        </div>
    `;
}

async function submitBooking(event) {
    event.preventDefault();
    
    const date = document.getElementById('sessionDate').value;
    const startTime = document.getElementById('startTime').value;
    const duration = parseFloat(document.getElementById('duration').value);
    const facilityId = parseInt(document.getElementById('facilitySelect').value);
    
    // Calculate end time
    const [hours, minutes] = startTime.split(':');
    const endHour = parseInt(hours) + Math.floor(duration);
    const endMinute = parseInt(minutes) + ((duration % 1) * 60);
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`;
    
    const totalFee = selectedTrainer.hourlyRate * duration;
    
    const booking = {
        clientID: currentClient.clientID,
        trainerID: selectedTrainer.trainerID,
        facilityID: facilityId,
        date: date,
        startTime: startTime + ':00',
        endTime: endTime,
        status: 'Scheduled',
        totalFee: totalFee
    };
    
    try {
        const response = await fetch(`${API_BASE}/sessionbookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking)
        });
        
        if (response.ok) {
            const newBooking = await response.json();
            
            // Create payment record
            const payment = {
                sessionID: newBooking.sessionID,
                trainerID: selectedTrainer.trainerID,
                amountPaid: totalFee,
                paymentDate: new Date().toISOString().split('T')[0],
                paymentStatus: 'Completed'
            };
            
            await fetch(`${API_BASE}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payment)
            });
            
            closeBookingModal();
            alert('Session booked successfully!');
            switchTab('bookings');
        } else {
            alert('Failed to book session');
        }
    } catch (error) {
        console.error('Error booking session:', error);
        alert('Failed to book session');
    }
}

async function cancelBooking(sessionId) {
    if (!confirm('Are you sure you want to cancel this session?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/sessionbookings/${sessionId}`);
        const booking = await response.json();
        booking.status = 'Cancelled';
        
        await fetch(`${API_BASE}/sessionbookings/${sessionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking)
        });
        
        loadMyBookings();
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking');
    }
}

function closeBookingModal() {
    document.getElementById('bookSessionModal').classList.remove('active');
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingSummary').innerHTML = '';
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });
}

function switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
    
    // Load data for tab
    if (tabName === 'bookings') {
        loadMyBookings();
    } else if (tabName === 'payments') {
        loadPayments();
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = '/landing.html';
}
