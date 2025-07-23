-- Insert sample data for testing
INSERT INTO products (name, price, tag, category, description, rating, image) VALUES
("'Wireless Headphones'", 99.99, "'electronics'", "'Audio'", "'High-quality wireless headphones with noise cancellation'", 4.5, "'/placeholder.svg?height=200&width=200'"),
("'Smartphone Case'", 24.99, "'accessories'", "'Mobile'", "'Durable protective case for smartphones'", 4.2, "'/placeholder.svg?height=200&width=200'"),
("'Laptop Stand'", 49.99, "'accessories'", "'Computer'", "'Adjustable aluminum laptop stand'", 4.7, "'/placeholder.svg?height=200&width=200'"),
("'Coffee Mug'", 15.99, "'home'", "'Kitchen'", "'Ceramic coffee mug with heat retention'", 4.3, "'/placeholder.svg?height=200&width=200'"),
("'Desk Lamp'", 79.99, "'home'", "'Office'", "'LED desk lamp with adjustable brightness'", 4.6, "'/placeholder.svg?height=200&width=200'");

INSERT INTO user_addresses (user_id, name, street, city, state, zip, country) VALUES
("'550e8400-e29b-41d4-a716-446655440000'", "'John Doe'", "'123 Main St'", "'New York'", "'NY'", "'10001'", "'USA'"),
("'550e8400-e29b-41d4-a716-446655440001'", "'Jane Smith'", "'456 Oak Ave'", "'Los Angeles'", "'CA'", "'90210'", "'USA'");

INSERT INTO orders (id, user_id, address_id, total, status, tracking_number, payment_status, razorpay_payment_id) VALUES
("'ORD-2024-001'", "'550e8400-e29b-41d4-a716-446655440000'", 1, 149.98, "'shipped'", "'TRK123456789'", "'paid'", "'pay_123456789'"),
("'ORD-2024-002'", "'550e8400-e29b-41d4-a716-446655440001'", 2, 74.98, "'processed'", "'TRK987654321'", "'paid'", "'pay_987654321'"),
("'ORD-2024-003'", "'550e8400-e29b-41d4-a716-446655440000'", 1, 24.99, "'placed'", null, "'pending'", null);

INSERT INTO order_items (order_id, product_id, name, price, quantity, image) VALUES
("'ORD-2024-001'", 1, "'Wireless Headphones'", 99.99, 1, "'/placeholder.svg?height=200&width=200'"),
("'ORD-2024-001'", 3, "'Laptop Stand'", 49.99, 1, "'/placeholder.svg?height=200&width=200'"),
("'ORD-2024-002'", 2, "'Smartphone Case'", 24.99, 1, "'/placeholder.svg?height=200&width=200'"),
("'ORD-2024-002'", 3, "'Laptop Stand'", 49.99, 1, "'/placeholder.svg?height=200&width=200'"),
("'ORD-2024-003'", 2, "'Smartphone Case'", 24.99, 1, "'/placeholder.svg?height=200&width=200'");

INSERT INTO order_timeline (order_id, status) VALUES
("'ORD-2024-001'", "'placed'"),
("'ORD-2024-001'", "'processed'"),
("'ORD-2024-001'", "'shipped'"),
("'ORD-2024-002'", "'placed'"),
("'ORD-2024-002'", "'processed'"),
("'ORD-2024-003'", "'placed'");

INSERT INTO payments (razorpay_payment_id, amount, currency, payment_status, paid_at) VALUES
("'pay_123456789'", 149.98, "'INR'", "'captured'", NOW() - INTERVAL "'2 days'"),
("'pay_987654321'", 74.98, "'INR'", "'captured'", NOW() - INTERVAL "'1 day'");

INSERT INTO cart_items (user_id, product_id, name, quantity, price, image) VALUES
("'550e8400-e29b-41d4-a716-446655440000'", 4, "'Coffee Mug'", 2, 15.99, "'/placeholder.svg?height=200&width=200'"),
("'550e8400-e29b-41d4-a716-446655440001'", 5, "'Desk Lamp'", 1, 79.99, "'/placeholder.svg?height=200&width=200'");
