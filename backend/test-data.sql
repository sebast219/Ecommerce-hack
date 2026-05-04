-- Insertar datos de prueba para el nuevo sistema de órdenes

-- 1. Crear categoría de prueba
INSERT INTO categories (id, name, slug, description, createdAt, updatedAt) 
VALUES ('cat-test-001', 'Security Tools', 'security-tools', 'Professional security testing tools', datetime('now'), datetime('now'));

-- 2. Crear producto de prueba con inventario
INSERT INTO products (id, name, slug, description, price, sku, categoryId, images, tags, isActive, difficulty, isPhysical, createdAt, updatedAt)
VALUES ('prod-test-001', 'NMAP Pro', 'nmap-pro', 'Professional network mapping and scanning tool', 49.99, 'NMAP-PRO-001', 'cat-test-001', '["https://example.com/nmap.jpg"]', '["network", "scanner", "security"]', true, 'INTERMEDIATE', true, datetime('now'), datetime('now'));

-- 3. Crear inventario del producto
INSERT INTO productInventories (id, productId, quantity, lowStockThreshold, reservedQuantity, createdAt, updatedAt)
VALUES ('inv-test-001', 'prod-test-001', 100, 10, 0, datetime('now'), datetime('now'));

-- 4. Crear dirección de prueba para el usuario
INSERT INTO addresses (id, userId, street, city, state, zipCode, country, isDefault, type, createdAt, updatedAt)
VALUES ('addr-test-001', 'cmokhkgl0000013bem08ugfh4', '123 Test Street', 'Test City', 'Test State', '12345', 'Test Country', true, 'SHIPPING', datetime('now'), datetime('now'));
