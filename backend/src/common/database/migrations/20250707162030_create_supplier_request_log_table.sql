CREATE TABLE IF NOT EXISTS "supplier_request_log"
(
  id UUID NOT NULL,
  validation_run_id UUID NULL,
  created_at TIMESTAMP NOT NULL,
  req_body TEXT NULL,
  req_method VARCHAR(10) NULL,
  req_url VARCHAR(2048) NULL,
  req_headers TEXT NULL,
  res_status SMALLINT NULL,
  res_headers TEXT NULL,
  res_body TEXT NULL,
  res_duration DOUBLE PRECISION NULL,
  validation_result VARCHAR(50) NOT NULL,
  is_valid BOOLEAN NOT NULL
  );

CREATE INDEX idx_supplier_request_log_validation_run_id ON supplier_request_log(validation_run_id);
CREATE INDEX idx_supplier_request_log_created_at ON supplier_request_log(created_at DESC);
CREATE INDEX idx_supplier_request_log_is_valid ON supplier_request_log(is_valid);
