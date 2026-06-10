-- Sample Menu Items for The Belgian Waffle Xpress
-- Run this in Supabase SQL Editor after running DATABASE_SCHEMA.sql

-- First, get the category IDs (or manually from Supabase UI)
-- SELECT id, name FROM categories;

-- Replace the category IDs below with your actual IDs from the query above

-- Assuming categories were inserted in order:
-- Category 1: लॉन्च (ਲੰਚ) - Breakfast
-- Category 2: पेय (ਪਾਣ) - Beverages
-- Category 3: डेज़र्ट (ਮਿਠਾਈ) - Desserts
-- Category 4: विशेष (ਵਿਸ਼ੇਸ਼) - Special

-- Get actual category IDs:
WITH categories_data AS (
  SELECT 
    (SELECT id FROM categories WHERE name = 'लॉन्च (ਲੰਚ)') as breakfast_id,
    (SELECT id FROM categories WHERE name = 'पेय (ਪਾਣ)') as beverages_id,
    (SELECT id FROM categories WHERE name = 'डेज़र्ट (ਮਿਠਾਈ)') as desserts_id,
    (SELECT id FROM categories WHERE name = 'विशेष (ਵਿਸ਼ੇਸ਼)') as special_id
)
INSERT INTO menu_items (category_id, name, description, price, display_order) VALUES

-- BREAKFAST ITEMS
((SELECT breakfast_id FROM categories_data), 'नुटेला वेफल', 'बेल्जियम वेफल, नुटेला, बादाम | Belgian Waffle, Nutella, Almonds', 170.00, 1),
((SELECT breakfast_id FROM categories_data), 'चॉकलेट डिलाइट वेफल', 'चॉकलेट सॉस और क्रीम | Chocolate sauce and cream', 150.00, 2),
((SELECT breakfast_id FROM categories_data), 'स्ट्रॉबेरी क्रीम वेफल', 'ताजा स्ट्रॉबेरी और व्हिप्ड क्रीम | Fresh strawberries and whipped cream', 160.00, 3),
((SELECT breakfast_id FROM categories_data), 'केला नुटेला वेफल', 'केला, नुटेला, चॉकलेट | Banana, Nutella, Chocolate', 150.00, 4),
((SELECT breakfast_id FROM categories_data), 'वनीला आइसक्रीम वेफल', 'वनीला आइसक्रीम और कारमेल सॉस | Vanilla ice cream and caramel sauce', 140.00, 5),

-- BEVERAGES
((SELECT beverages_id FROM categories_data), 'हॉट चॉकलेट', 'गर्म चॉकलेट दूध | Hot chocolate milk', 80.00, 1),
((SELECT beverages_id FROM categories_data), 'कोल्ड कॉफी', 'ठंडी कॉफी, दूध, क्रीम | Cold coffee with milk and cream', 100.00, 2),
((SELECT beverages_id FROM categories_data), 'मोचा मिल्क', 'कॉफी और चॉकलेट का मिश्रण | Mix of coffee and chocolate', 110.00, 3),
((SELECT beverages_id FROM categories_data), 'हॉट कॉफी', 'फ्रेश ब्रू कॉफी | Fresh brew coffee', 70.00, 4),
((SELECT beverages_id FROM categories_data), 'आइसड कोल्ड ड्रिंक', 'ठंडा पेय | Chilled soft drink', 50.00, 5),

-- DESSERTS
((SELECT desserts_id FROM categories_data), 'चॉकलेट ब्राउनी', 'समृद्ध चॉकलेट ब्राउनी | Rich chocolate brownie', 120.00, 1),
((SELECT desserts_id FROM categories_data), 'चीजकेक', 'न्यूयॉर्क स्टाइल चीजकेक | New York style cheesecake', 140.00, 2),
((SELECT desserts_id FROM categories_data), 'गुलाब जामुन', 'मीठे गुलाब जामुन | Sweet gulab jamun', 80.00, 3),
((SELECT desserts_id FROM categories_data), 'पनीर के लड्डू', 'घर का बना पनीर मिठाई | Homemade paneer sweet', 100.00, 4),

-- SPECIAL ITEMS
((SELECT special_id FROM categories_data), 'डबल चॉकलेट वेफल', 'डबल चॉकलेट, whipped cream, चॉकलेट चिप्स | Double chocolate heaven', 200.00, 1),
((SELECT special_id FROM categories_data), 'प्रीमियम न्यूटेला बॉक्स', '4 वेफल: नुटेला, स्ट्रॉबेरी, केला, वनीला | Sampler box', 350.00, 2),
((SELECT special_id FROM categories_data), 'आइसक्रीम संडे', 'आइसक्रीम, फल, नट, सॉस | Ice cream sundae', 120.00, 3);

-- Verify the items were inserted
SELECT 
  c.name as category,
  m.name as item,
  m.description,
  m.price,
  m.display_order
FROM menu_items m
JOIN categories c ON m.category_id = c.id
ORDER BY c.display_order, m.display_order;
