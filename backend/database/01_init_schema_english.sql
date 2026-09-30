CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    device_code VARCHAR(50) UNIQUE NOT NULL,
    device_name VARCHAR(150) NOT NULL,
    serial_or_version VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    ticket_code VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT REFERENCES customers(id),
    device_id INT REFERENCES devices(id),
    issue_description TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING',
    created_by_account_id INT REFERENCES accounts(id),
    assigned_technician_id INT REFERENCES accounts(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ticket_sessions (
    id SERIAL PRIMARY KEY,
    session_token UUID UNIQUE NOT NULL,
    ticket_id INT REFERENCES tickets(id),
    qr_image_base64 TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE
);
