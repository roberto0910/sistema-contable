// Base de datos simulada
let clients = JSON.parse(localStorage.getItem('contable_clients')) || [
    { id: 'CL-001', name: 'Corporación XYZ', email: 'contacto@corporacionxyz.com', phone: '+1 234 567 8901', balance: 12500, status: 'active' },
    { id: 'CL-002', name: 'Empresa ABC', email: 'info@empresaabc.com', phone: '+1 234 567 8902', balance: 8750, status: 'active' },
    { id: 'CL-003', name: 'Compañía Global', email: 'ventas@companiaglobal.com', phone: '+1 234 567 8903', balance: 5200, status: 'inactive' }
];

let suppliers = JSON.parse(localStorage.getItem('contable_suppliers')) || [
    { id: 'PV-001', name: 'Suministros Generales S.A.', email: 'compras@suministrosgenerales.com', phone: '+1 234 567 8910', balance: 3450, status: 'active' },
    { id: 'PV-002', name: 'Tecnología Avanzada Ltda.', email: 'ventas@tecnologiaavanzada.com', phone: '+1 234 567 8911', balance: 1890, status: 'active' }
];

let invoices = JSON.parse(localStorage.getItem('contable_invoices')) || [
    { id: 'FAC-2023-001', clientId: 'CL-001', amount: 12500, date: '2023-05-15', dueDate: '2023-05-30', status: 'paid', description: 'Venta de servicios' },
    { id: 'FAC-2023-002', clientId: 'CL-002', amount: 8750, date: '2023-05-10', dueDate: '2023-05-25', status: 'pending', description: 'Venta de productos' }
];

let journalEntries = JSON.parse(localStorage.getItem('contable_journal')) || [
    { id: 1, date: '2023-05-15', description: 'Venta a Corporación XYZ', debitAccount: 'Cuentas por Cobrar', creditAccount: 'Ventas', amount: 12500 },
    { id: 2, date: '2023-05-14', description: 'Pago a Proveedor ABC', debitAccount: 'Cuentas por Pagar', creditAccount: 'Bancos', amount: 8340 }
];

let settings = JSON.parse(localStorage.getItem('contable_settings')) || {
    companyName: 'Mi Empresa S.A.',
    companyRut: '123456789-0',
    companyAddress: 'Av. Principal 123, Ciudad, País',
    companyPhone: '+1 234 567 8900',
    companyEmail: 'info@miempresa.com',
    currency: 'USD',
    adminName: 'A'
};

// Variables globales
let currentEditingClient = null;
let currentEditingSupplier = null;

// Funciones de utilidad
function formatCurrency(amount) {
    return `$${amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function generateId(prefix) {
    return `${prefix}-${Date.now()}`;
}

function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.querySelector('.main-content').insertBefore(alert, document.querySelector('.content-section.active'));
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Funciones para guardar datos
function saveClients() {
    localStorage.setItem('contable_clients', JSON.stringify(clients));
}

function saveSuppliers() {
    localStorage.setItem('contable_suppliers', JSON.stringify(suppliers));
}

function saveInvoices() {
    localStorage.setItem('contable_invoices', JSON.stringify(invoices));
}

function saveJournalEntries() {
    localStorage.setItem('contable_journal', JSON.stringify(journalEntries));
}

function saveSettings() {
    localStorage.setItem('contable_settings', JSON.stringify(settings));
}

// Funciones de navegación
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
        
        this.classList.add('active');
        const sectionId = this.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
        
        // Cargar datos específicos de la sección
        if (sectionId === 'clients') loadClients();
        if (sectionId === 'suppliers') loadSuppliers();
        if (sectionId === 'invoices') loadInvoices();
        if (sectionId === 'accounting') loadJournalEntries();
        if (sectionId === 'settings') loadSettings();
    });
});

// Dashboard - Funcionalidad de tarjetas
document.querySelectorAll('.dashboard-cards .card').forEach(card => {
    card.addEventListener('click', function() {
        const cardType = this.getAttribute('data-card');
        let message = '';
        
        switch(cardType) {
            case 'income':
                message = 'Mostrando detalles de ingresos...';
                break;
            case 'expense':
                message = 'Mostrando detalles de gastos...';
                break;
            case 'balance':
                message = 'Mostrando detalles del balance...';
                break;
            case 'clients':
                message = 'Mostrando detalles de clientes...';
                break;
        }
        
        showAlert(message, 'info');
    });
});

// Gestión de Clientes
function loadClients() {
    const tbody = document.getElementById('clients-table-body');
    tbody.innerHTML = '';
    
    clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.id}</td>
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${formatCurrency(client.balance)}</td>
            <td><span style="color: ${client.status === 'active' ? 'var(--success)' : 'var(--warning)'};">${client.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-outline" onclick="editClient('${client.id}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteClient('${client.id}')">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    currentEditingClient = clientId;
    document.getElementById('client-modal-title').textContent = 'Editar Cliente';
    document.getElementById('client-name').value = client.name;
    document.getElementById('client-email').value = client.email;
    document.getElementById('client-phone').value = client.phone;
    document.getElementById('client-balance').value = client.balance;
    document.getElementById('client-status').value = client.status;
    
    document.getElementById('client-modal').style.display = 'flex';
}

function deleteClient(clientId) {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
        clients = clients.filter(c => c.id !== clientId);
        saveClients();
        loadClients();
        showAlert('Cliente eliminado exitosamente');
    }
}

// Gestión de Proveedores
function loadSuppliers() {
    const tbody = document.getElementById('suppliers-table-body');
    tbody.innerHTML = '';
    
    suppliers.forEach(supplier => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${supplier.id}</td>
            <td>${supplier.name}</td>
            <td>${supplier.email}</td>
            <td>${formatCurrency(supplier.balance)}</td>
            <td><span style="color: ${supplier.status === 'active' ? 'var(--success)' : 'var(--warning)'};">${supplier.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-outline" onclick="editSupplier('${supplier.id}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteSupplier('${supplier.id}')">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editSupplier(supplierId) {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (!supplier) return;
    
    currentEditingSupplier = supplierId;
    document.getElementById('client-modal-title').textContent = 'Editar Proveedor';
    document.getElementById('client-name').value = supplier.name;
    document.getElementById('client-email').value = supplier.email;
    document.getElementById('client-phone').value = supplier.phone;
    document.getElementById('client-balance').value = supplier.balance;
    document.getElementById('client-status').value = supplier.status;
    
    document.getElementById('client-modal').style.display = 'flex';
}

function deleteSupplier(supplierId) {
    if (confirm('¿Está seguro de que desea eliminar este proveedor?')) {
        suppliers = suppliers.filter(s => s.id !== supplierId);
        saveSuppliers();
        loadSuppliers();
        showAlert('Proveedor eliminado exitosamente');
    }
}

// Gestión de Facturas
function loadInvoices() {
    const tbody = document.getElementById('invoices-table-body');
    tbody.innerHTML = '';
    
    invoices.forEach(invoice => {
        const client = clients.find(c => c.id === invoice.clientId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${invoice.id}</td>
            <td>${client ? client.name : 'Cliente no encontrado'}</td>
            <td>${new Date(invoice.date).toLocaleDateString()}</td>
            <td>${new Date(invoice.dueDate).toLocaleDateString()}</td>
            <td>${formatCurrency(invoice.amount)}</td>
            <td><span style="color: ${invoice.status === 'paid' ? 'var(--success)' : 'var(--warning)'};">${invoice.status === 'paid' ? 'Pagada' : 'Pendiente'}</span></td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-outline">Ver</button>
                <button class="btn btn-sm btn-outline">Editar</button>
                <button class="btn btn-sm btn-danger">Anular</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Gestión de Asientos Contables
function loadJournalEntries() {
    const tbody = document.getElementById('journal-table-body');
    tbody.innerHTML = '';
    
    journalEntries.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(entry.date).toLocaleDateString()}</td>
            <td>${entry.description}</td>
            <td>${entry.debitAccount}</td>
            <td>${entry.creditAccount}</td>
            <td>${formatCurrency(entry.amount)}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-outline">Ver</button>
                <button class="btn btn-sm btn-outline">Editar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Configuración
function loadSettings() {
    document.getElementById('company-name').value = settings.companyName;
    document.getElementById('company-rut').value = settings.companyRut;
    document.getElementById('company-address').value = settings.companyAddress;
    document.getElementById('company-phone').value = settings.companyPhone;
    document.getElementById('company-email').value = settings.companyEmail;
    document.getElementById('currency').value = settings.currency;
    document.getElementById('admin-name').value = settings.adminName;
    
    // Actualizar avatar del administrador
    document.querySelector('.user-avatar').textContent = settings.adminName;
}

// Event Listeners
document.getElementById('new-client-btn').addEventListener('click', () => {
    currentEditingClient = null;
    document.getElementById('client-modal-title').textContent = 'Nuevo Cliente';
    document.getElementById('client-form').reset();
    document.getElementById('client-modal').style.display = 'flex';
});

document.getElementById('client-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const clientData = {
        name: document.getElementById('client-name').value,
        email: document.getElementById('client-email').value,
        phone: document.getElementById('client-phone').value,
        balance: parseFloat(document.getElementById('client-balance').value),
        status: document.getElementById('client-status').value
    };
    
    if (currentEditingClient) {
        // Editar cliente existente
        const index = clients.findIndex(c => c.id === currentEditingClient);
        if (index !== -1) {
            clients[index] = { ...clients[index], ...clientData };
        }
    } else {
        // Nuevo cliente
        clientData.id = generateId('CL');
        clients.push(clientData);
    }
    
    saveClients();
    loadClients();
    document.getElementById('client-modal').style.display = 'none';
    showAlert(currentEditingClient ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente');
});

document.getElementById('new-invoice-btn').addEventListener('click', () => {
    // Llenar select de clientes
    const clientSelect = document.getElementById('invoice-client');
    clientSelect.innerHTML = '<option value="">Seleccionar cliente</option>';
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        clientSelect.appendChild(option);
    });
    
    // Establecer fecha actual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoice-date').value = today;
    
    // Establecer fecha de vencimiento (30 días después)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.getElementById('invoice-due-date').value = dueDate.toISOString().split('T')[0];
    
    document.getElementById('invoice-modal').style.display = 'flex';
});

document.getElementById('invoice-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const invoiceData = {
        id: generateId('FAC'),
        clientId: document.getElementById('invoice-client').value,
        amount: parseFloat(document.getElementById('invoice-amount').value),
        date: document.getElementById('invoice-date').value,
        dueDate: document.getElementById('invoice-due-date').value,
        status: 'pending',
        description: document.getElementById('invoice-description').value
    };
    
    invoices.push(invoiceData);
    saveInvoices();
    loadInvoices();
    document.getElementById('invoice-modal').style.display = 'none';
    showAlert('Factura creada exitosamente');
});

document.getElementById('new-entry-btn').addEventListener('click', () => {
    const newEntry = {
        id: journalEntries.length + 1,
        date: new Date().toISOString().split('T')[0],
        description: 'Nuevo asiento contable',
        debitAccount: 'Cuentas por Cobrar',
        creditAccount: 'Ventas',
        amount: 1000
    };
    
    journalEntries.push(newEntry);
    saveJournalEntries();
    loadJournalEntries();
    showAlert('Nuevo asiento contable creado');
});

document.getElementById('generate-report-btn').addEventListener('click', () => {
    const reportType = document.getElementById('report-type').value;
    const period = document.getElementById('report-period').value;
    const income = parseFloat(document.getElementById('report-income').value);
    const expenses = parseFloat(document.getElementById('report-expenses').value);
    const netIncome = income - expenses;
    
    let reportTitle = '';
    let reportContent = '';
    
    switch(reportType) {
        case 'income-statement':
            reportTitle = `Estado de Resultados - ${document.getElementById('report-period').options[document.getElementById('report-period').selectedIndex].text}`;
            reportContent = `
                <table>
                    <tr><td><strong>Ingresos Totales</strong></td><td>${formatCurrency(income)}</td></tr>
                    <tr><td><strong>Costos y Gastos</strong></td><td>${formatCurrency(expenses)}</td></tr>
                    <tr style="border-top: 2px solid var(--border);">
                        <td><strong>Utilidad Neta</strong></td><td><strong>${formatCurrency(netIncome)}</strong></td>
                    </tr>
                </table>
            `;
            break;
        case 'balance-sheet':
            reportTitle = `Balance General - ${document.getElementById('report-period').options[document.getElementById('report-period').selectedIndex].text}`;
            reportContent = `
                <table>
                    <tr><td><strong>Activos</strong></td><td>${formatCurrency(income * 2)}</td></tr>
                    <tr><td><strong>Pasivos</strong></td><td>${formatCurrency(expenses * 1.5)}</td></tr>
                    <tr><td><strong>Patrimonio</strong></td><td>${formatCurrency(netIncome)}</td></tr>
                </table>
            `;
            break;
    }
    
    document.getElementById('report-title').textContent = reportTitle;
    document.getElementById('report-content').innerHTML = reportContent;
    showAlert('Reporte generado exitosamente');
});

document.getElementById('export-excel-btn').addEventListener('click', () => {
    showAlert('Funcionalidad de exportación a Excel simulada. En una implementación real, se generaría un archivo Excel.', 'info');
});

document.getElementById('save-settings-btn').addEventListener('click', () => {
    settings.companyName = document.getElementById('company-name').value;
    settings.companyRut = document.getElementById('company-rut').value;
    settings.companyAddress = document.getElementById('company-address').value;
    settings.companyPhone = document.getElementById('company-phone').value;
    settings.companyEmail = document.getElementById('company-email').value;
    settings.currency = document.getElementById('currency').value;
    settings.adminName = document.getElementById('admin-name').value;
    
    saveSettings();
    loadSettings();
    showAlert('Configuración guardada exitosamente');
});

// Cerrar modales
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modalId = e.target.getAttribute('data-modal');
        document.getElementById(modalId).style.display = 'none';
    });
});

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadClients();
    loadSuppliers();
    loadInvoices();
    loadJournalEntries();
    loadSettings();
    
    // Configurar avatar inicial
    document.querySelector('.user-avatar').textContent = settings.adminName;
});