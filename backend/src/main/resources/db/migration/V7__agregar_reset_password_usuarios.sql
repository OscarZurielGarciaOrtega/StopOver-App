ALTER TABLE usuarios ADD COLUMN reset_code VARCHAR(10);
ALTER TABLE usuarios ADD COLUMN reset_code_expiracion DATETIME;