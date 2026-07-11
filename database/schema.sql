-- PostgreSQL Database Schema for MineGuardian X

-- 1. Personnel Roster
CREATE TABLE workers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('Admin', 'Supervisor', 'Worker', 'Rescue')),
    assigned_zone VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Device Registration Metadata
CREATE TABLE helmets (
    id VARCHAR(50) PRIMARY KEY,
    worker_id VARCHAR(50) REFERENCES workers(id) ON DELETE SET NULL,
    battery_health_percentage INT DEFAULT 100,
    firmware_version VARCHAR(20) DEFAULT '1.0.0',
    calibration_status VARCHAR(50) DEFAULT 'Calibrated',
    last_ping TIMESTAMP WITH TIME ZONE
);

-- 3. Live Telemetry Logs for analytics trends (1Hz scale)
CREATE TABLE telemetry_logs (
    id BIGSERIAL PRIMARY KEY,
    helmet_id VARCHAR(50) REFERENCES helmets(id) ON DELETE CASCADE,
    co_level NUMERIC(6,2),
    methane_level NUMERIC(6,2),
    heart_rate INT,
    spo2 INT,
    ambient_temp NUMERIC(4,1),
    ambient_humidity NUMERIC(4,1),
    motion_state VARCHAR(30),
    fall_detected BOOLEAN DEFAULT FALSE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ACRSA Prediction Audit Logs (EEI explanations)
CREATE TABLE acrsa_predictions (
    id BIGSERIAL PRIMARY KEY,
    worker_id VARCHAR(50) REFERENCES workers(id) ON DELETE CASCADE,
    risk_score INT CHECK (risk_score BETWEEN 0 AND 100),
    risk_category VARCHAR(20),
    confidence_score INT,
    reasoning TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Rescue Robot Fleet Registry
CREATE TABLE rescue_robots (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    battery_percentage INT,
    oxygen_supply_percentage INT,
    status VARCHAR(50) DEFAULT 'Idle',
    current_x NUMERIC(6,2),
    current_y NUMERIC(6,2),
    current_z NUMERIC(6,2)
);

CREATE INDEX idx_telemetry_recorded_at ON telemetry_logs (recorded_at DESC);
CREATE INDEX idx_predictions_created_at ON acrsa_predictions (created_at DESC);
