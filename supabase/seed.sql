-- ============================================================================
--  The Belgian Waffle Xpress — Seed data
--  Run AFTER schema.sql. Re-running clears and re-inserts the menu + settings.
--  (Orders & order_items are NOT touched.)
--  Menu transcribed from the official "Just Waffle It" menu cards.
-- ============================================================================

delete from menu_items;
delete from categories;
delete from restaurant_settings;

-- --- Branding ---------------------------------------------------------------
insert into restaurant_settings (name, tagline, primary_color, secondary_color, whatsapp_number, currency)
values (
  'The Belgian Waffle Xpress',
  'Just Waffle It',
  '#d97706',   -- warm amber/gold from the menu
  '#5b3a1a',   -- dark chocolate brown
  '919876543210',  -- TODO: replace with the real restaurant WhatsApp number (intl digits only)
  '₹'
);

-- --- Categories -------------------------------------------------------------
insert into categories (name, description, sort_order) values
  ('Best Sellers',                null, 5),
  ('The OGs',                     'Belgian Waffle Sandwiches — the classics', 10),
  ('Cheesecake Inspired',         'Belgian Waffle Sandwiches', 20),
  ('Ice Cream Waffle Sandwiches', 'Belgian Waffle Sandwiches', 30),
  ('Flavor Explorations',         'Belgian Waffle Sandwiches', 40),
  ('Bubble Waffles',              null, 50),
  ('Waffle Pops',                 null, 60),
  ('Waffle Cakes',                'Single / Double Layer', 70),
  ('Milkshakes',                  null, 80),
  ('Ice Cream Sundaes',           null, 90),
  ('Mini Bubble Pancakes',        null, 100),
  ('Summer Coolers',              null, 110),
  ('Mini Waffle Box of 4',        null, 120),
  ('Add Ons',                     null, 130);

-- Convenience: a CTE-free pattern — reference category id via a subquery.

-- BEST SELLERS
insert into menu_items (category_id, name, description, price, secondary_price, secondary_label, is_bestseller, sort_order) values
  ((select id from categories where name='Best Sellers'), 'Premium Mini Waffle Box', 'Nutella Cheesecake + Blueberry Cheesecake + Cookie N Cream and Kitkat Delight', 350, null, null, true, 10),
  ((select id from categories where name='Best Sellers'), 'Naughty Nutella WS', null, 170, null, null, true, 20),
  ((select id from categories where name='Best Sellers'), 'Kunafa Choco-Crunch WS', null, 190, null, null, true, 30),
  ((select id from categories where name='Best Sellers'), 'Deathly Hallows Chocolate Waffle Cake', 'Single / Double layer', 280, 470, 'Double Layer', true, 40);

-- THE OGs
insert into menu_items (category_id, name, price, sort_order) values
  ((select id from categories where name='The OGs'), 'Butterscotch Bliss', 140, 10),
  ((select id from categories where name='The OGs'), 'Honey Butter Classic', 100, 20),
  ((select id from categories where name='The OGs'), 'Naughty Nutella', 170, 30),
  ((select id from categories where name='The OGs'), 'Red Strawberry Cream Dream', 150, 40),
  ((select id from categories where name='The OGs'), 'Kitkat Delight', 160, 50),
  ((select id from categories where name='The OGs'), 'Trichoco Blast', 160, 60),
  ((select id from categories where name='The OGs'), 'Cotton Candy Crunch', 140, 70),
  ((select id from categories where name='The OGs'), 'OG Red Velvet', 150, 80),
  ((select id from categories where name='The OGs'), 'Molten Milk/Dark Chocolate', 140, 90),
  ((select id from categories where name='The OGs'), 'Blueberry/Strawberry Cream Rush', 140, 100),
  ((select id from categories where name='The OGs'), 'Maple Melt', 100, 110),
  ((select id from categories where name='The OGs'), 'Mint Oreo Crunch', 150, 120),
  ((select id from categories where name='The OGs'), 'Cookie & Cream', 150, 130);

-- CHEESECAKE INSPIRED
insert into menu_items (category_id, name, price, sort_order) values
  ((select id from categories where name='Cheesecake Inspired'), 'Biscoff Cheesecake', 170, 10),
  ((select id from categories where name='Cheesecake Inspired'), 'Blueberry Cheesecake', 160, 20),
  ((select id from categories where name='Cheesecake Inspired'), 'Nutella Cheesecake', 170, 30),
  ((select id from categories where name='Cheesecake Inspired'), 'Strawberry Cheesecake', 160, 40);

-- ICE CREAM WAFFLE SANDWICHES
insert into menu_items (category_id, name, price, sort_order) values
  ((select id from categories where name='Ice Cream Waffle Sandwiches'), 'Triple Cookie Sundae', 170, 10),
  ((select id from categories where name='Ice Cream Waffle Sandwiches'), 'Nutty Special Sundae', 170, 20);

-- FLAVOR EXPLORATIONS
insert into menu_items (category_id, name, price, sort_order) values
  ((select id from categories where name='Flavor Explorations'), 'Caramel Melt', 150, 10),
  ((select id from categories where name='Flavor Explorations'), 'Mango Masti Velvet', 150, 20),
  ((select id from categories where name='Flavor Explorations'), 'Biscoff Delight', 160, 30),
  ((select id from categories where name='Flavor Explorations'), 'Walnut/Almond Indulgence', 160, 40),
  ((select id from categories where name='Flavor Explorations'), 'Tri Cookie Delight', 160, 50),
  ((select id from categories where name='Flavor Explorations'), 'Bubblegum Madness', 150, 60),
  ((select id from categories where name='Flavor Explorations'), 'Mint Cookie Crunch', 150, 70),
  ((select id from categories where name='Flavor Explorations'), 'Biscoff Kissed', 160, 80),
  ((select id from categories where name='Flavor Explorations'), 'Coffee Lover''s', 140, 90),
  ((select id from categories where name='Flavor Explorations'), 'Gems Milk Chocolate', 190, 100),
  ((select id from categories where name='Flavor Explorations'), 'Milk/Dark Choco Lava', 150, 110),
  ((select id from categories where name='Flavor Explorations'), 'Dark & White Fantasy', 160, 120),
  ((select id from categories where name='Flavor Explorations'), 'Kunafa Choco Crunch', 190, 130);

-- BUBBLE WAFFLES
insert into menu_items (category_id, name, price, sort_order) values
  ((select id from categories where name='Bubble Waffles'), 'Butterscotch Bomb', 240, 10),
  ((select id from categories where name='Bubble Waffles'), 'Caramel Drizzle', 240, 20),
  ((select id from categories where name='Bubble Waffles'), 'Coffee Treat', 260, 30),
  ((select id from categories where name='Bubble Waffles'), 'Cotton Candy Crunch', 240, 40),
  ((select id from categories where name='Bubble Waffles'), 'Rocky Road', 270, 50),
  ((select id from categories where name='Bubble Waffles'), 'Red Velvet', 260, 60),
  ((select id from categories where name='Bubble Waffles'), 'Trichoco Blast', 260, 70),
  ((select id from categories where name='Bubble Waffles'), 'Kitkat Crown', 260, 80),
  ((select id from categories where name='Bubble Waffles'), 'Nutella Blast', 280, 90),
  ((select id from categories where name='Bubble Waffles'), 'Dark & White', 270, 100),
  ((select id from categories where name='Bubble Waffles'), 'Biscoff Bliss', 270, 110),
  ((select id from categories where name='Bubble Waffles'), 'Belgian Milk/Dark Chocobomb', 280, 120);

-- WAFFLE POPS
insert into menu_items (category_id, name, price, sort_order) values
  ((select id from categories where name='Waffle Pops'), 'Belgian Milk/Dark Choco', 70, 10),
  ((select id from categories where name='Waffle Pops'), 'Caramel Drizz', 70, 20),
  ((select id from categories where name='Waffle Pops'), 'Tri Chocolate', 70, 30),
  ((select id from categories where name='Waffle Pops'), 'Cotton Candy', 80, 40),
  ((select id from categories where name='Waffle Pops'), 'Mango Blast', 80, 50),
  ((select id from categories where name='Waffle Pops'), 'Mint Cookie', 80, 60),
  ((select id from categories where name='Waffle Pops'), 'OG Red Velvet', 80, 70),
  ((select id from categories where name='Waffle Pops'), 'Coffee Treat', 90, 80),
  ((select id from categories where name='Waffle Pops'), 'Kitkat', 90, 90),
  ((select id from categories where name='Waffle Pops'), 'Biscoff Kissed', 100, 100),
  ((select id from categories where name='Waffle Pops'), 'Nutella', 100, 110),
  ((select id from categories where name='Waffle Pops'), 'Twin Choco', 80, 120);

-- WAFFLE CAKES (single / double layer)
insert into menu_items (category_id, name, price, secondary_price, secondary_label, sort_order) values
  ((select id from categories where name='Waffle Cakes'), 'Naughty Nutella Fudge', 320, 540, 'Double Layer', 10),
  ((select id from categories where name='Waffle Cakes'), 'Red Velvet', 300, 490, 'Double Layer', 20),
  ((select id from categories where name='Waffle Cakes'), 'Candyland', 280, 470, 'Double Layer', 30),
  ((select id from categories where name='Waffle Cakes'), 'Deathly Hallows Chocolate', 280, 470, 'Double Layer', 40),
  ((select id from categories where name='Waffle Cakes'), 'Mocha Bliss', 300, 490, 'Double Layer', 50),
  ((select id from categories where name='Waffle Cakes'), 'Brownie Crunch', 300, 490, 'Double Layer', 60),
  ((select id from categories where name='Waffle Cakes'), 'Berry Love Red Velvet', 300, 490, 'Double Layer', 70),
  ((select id from categories where name='Waffle Cakes'), 'Almond/Walnut Indulgence', 300, 490, 'Double Layer', 80),
  ((select id from categories where name='Waffle Cakes'), 'Triple Choco Waffle Pizza', 280, 470, 'Double Layer', 90),
  ((select id from categories where name='Waffle Cakes'), 'Chocomint Crunch', 300, 490, 'Double Layer', 100),
  ((select id from categories where name='Waffle Cakes'), 'Biscoff Bliss', 320, 540, 'Double Layer', 110),
  ((select id from categories where name='Waffle Cakes'), 'B&W Waffle Pizza', 280, 470, 'Double Layer', 120),
  ((select id from categories where name='Waffle Cakes'), 'Kunafa Waffle Cake', 340, 580, 'Double Layer', 130);

-- MILKSHAKES
insert into menu_items (category_id, name, price, sort_order) values
  ((select id from categories where name='Milkshakes'), 'Belgian Milk/Dark Chocolate', 140, 10),
  ((select id from categories where name='Milkshakes'), 'Bubblegum', 150, 20),
  ((select id from categories where name='Milkshakes'), 'Hazelnut Cold Coffee', 160, 30),
  ((select id from categories where name='Milkshakes'), 'Kitkat Delight', 160, 40),
  ((select id from categories where name='Milkshakes'), 'Mango Masti', 140, 50),
  ((select id from categories where name='Milkshakes'), 'Nutella', 170, 60),
  ((select id from categories where name='Milkshakes'), 'Oreo Cookie', 150, 70),
  ((select id from categories where name='Milkshakes'), 'Pistachio', 190, 80),
  ((select id from categories where name='Milkshakes'), 'Signature Cold Coffee', 150, 90),
  ((select id from categories where name='Milkshakes'), 'Strawberry White Chocolate', 150, 100),
  ((select id from categories where name='Milkshakes'), 'The Red Velvet', 160, 110);

-- ICE CREAM SUNDAES
insert into menu_items (category_id, name, price, sort_order) values
  ((select id from categories where name='Ice Cream Sundaes'), 'Strawberry Red Velvet', 130, 10),
  ((select id from categories where name='Ice Cream Sundaes'), 'Kitkat', 140, 20),
  ((select id from categories where name='Ice Cream Sundaes'), 'Brownie', 130, 30),
  ((select id from categories where name='Ice Cream Sundaes'), 'Biscoff Sundae', 130, 40);

-- MINI BUBBLE PANCAKES
insert into menu_items (category_id, name, price, sort_order) values
  ((select id from categories where name='Mini Bubble Pancakes'), 'Naughty Nutella', 160, 10),
  ((select id from categories where name='Mini Bubble Pancakes'), 'Coffee Lover''s', 130, 20),
  ((select id from categories where name='Mini Bubble Pancakes'), 'Butterscotch Crunch', 130, 30),
  ((select id from categories where name='Mini Bubble Pancakes'), 'Trichoco Blast', 140, 40),
  ((select id from categories where name='Mini Bubble Pancakes'), 'OG Red Velvet', 140, 50),
  ((select id from categories where name='Mini Bubble Pancakes'), 'Kitkat Delight', 150, 60),
  ((select id from categories where name='Mini Bubble Pancakes'), 'Tripple Cookie Delight', 150, 70),
  ((select id from categories where name='Mini Bubble Pancakes'), 'Pistachio Drizzle', 170, 80),
  ((select id from categories where name='Mini Bubble Pancakes'), 'Biscoff Bites', 160, 90);

-- SUMMER COOLERS
insert into menu_items (category_id, name, price, sort_order) values
  ((select id from categories where name='Summer Coolers'), 'Chatpata Cola', 90, 10),
  ((select id from categories where name='Summer Coolers'), 'Electric Lagoon', 110, 20),
  ((select id from categories where name='Summer Coolers'), 'Green Apple Giddy Up', 110, 30),
  ((select id from categories where name='Summer Coolers'), 'Iced Americano', 90, 40),
  ((select id from categories where name='Summer Coolers'), 'Kala Khatta', 110, 50),
  ((select id from categories where name='Summer Coolers'), 'Masala Lemonade', 90, 60),
  ((select id from categories where name='Summer Coolers'), 'Minty Magic Virgin Mojito', 90, 70),
  ((select id from categories where name='Summer Coolers'), 'Strawberry Splash Mojito', 110, 80),
  ((select id from categories where name='Summer Coolers'), 'The OG Peach Iced Tea', 100, 90);

-- MINI WAFFLE BOX OF 4
insert into menu_items (category_id, name, description, price, sort_order) values
  ((select id from categories where name='Mini Waffle Box of 4'), 'Chocolate Mini Waffle Box Of 4', 'Molten Milk Chocolate + Almond Indulgence + OG Red Velvet, and Red Velvet Strawberry Creamcheese', 280, 10),
  ((select id from categories where name='Mini Waffle Box of 4'), 'Assorted Mini Waffle Box Of 4', 'Naughty Nutella + Molten Milk Chocolate + Rich Dark Overflow, and Dark & White Fantasy', 300, 20),
  ((select id from categories where name='Mini Waffle Box of 4'), 'Premium Mini Waffle Box', 'Nutella Cheesecake + Blueberry Cheesecake + Cookie N Cream and Kitkat Delight', 350, 30);

-- ADD ONS
insert into menu_items (category_id, name, price, sort_order) values
  ((select id from categories where name='Add Ons'), 'KitKat Bits', 20, 10),
  ((select id from categories where name='Add Ons'), 'Roasted Almonds', 20, 20),
  ((select id from categories where name='Add Ons'), 'Extra Fillings', 30, 30),
  ((select id from categories where name='Add Ons'), 'Biscoff Bits', 20, 40),
  ((select id from categories where name='Add Ons'), 'Oreo', 10, 50),
  ((select id from categories where name='Add Ons'), 'Banana', 20, 60),
  ((select id from categories where name='Add Ons'), 'Extra Nutella', 50, 70),
  ((select id from categories where name='Add Ons'), 'Ice Cream Cup (Vanilla/Chocolate)', 50, 80);
