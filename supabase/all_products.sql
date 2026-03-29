-- ============================================
-- HP GLOW - COMPLETE PRODUCT CATALOG (58 Products)
-- Single SQL file - All products & variations
-- Last updated: 2026-03-30
-- ============================================

-- Clear existing data
DELETE FROM product_variations;
DELETE FROM products;
DELETE FROM categories;

-- ============================================
-- CATEGORIES (UUID IDs)
-- ============================================
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
('d0a80121-0001-4e78-94f8-585d77059001', 'FATLOSS / METABOLIC',          'FlaskConical', 1, true),
('d0a80121-0002-4e78-94f8-585d77059002', 'BRAIN / COGNITIVE / MOOD',     'Brain',        2, true),
('d0a80121-0003-4e78-94f8-585d77059003', 'BEAUTY, HAIR AND SKIN',        'Sparkles',     3, true),
('d0a80121-0004-4e78-94f8-585d77059004', 'HEALING / REGENERATION / GUT', 'Heart',        4, true),
('d0a80121-0005-4e78-94f8-585d77059005', 'LONGETIVITY / MITOCHONDRIAL',  'Zap',          5, true),
('d0a80121-0006-4e78-94f8-585d77059006', 'MUSCLE BUILDING / STRENGTH',   'Dumbbell',     6, true),
('d0a80121-0007-4e78-94f8-585d77059007', 'SLEEP AND SEXUAL HEALTH',      'Moon',         7, true),
('d0a80121-0008-4e78-94f8-585d77059008', 'IMMUNITY AND RESILIENCE',      'Shield',       8, true),
('d0a80121-0009-4e78-94f8-585d77059009', 'All',                          'Package',      9, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, icon = EXCLUDED.icon, sort_order = EXCLUDED.sort_order, active = EXCLUDED.active;

-- ============================================
-- ALL 58 PRODUCTS + VARIATIONS
-- ============================================
DO $$
DECLARE
  pid UUID;
  -- Category UUID shortcuts
  cat_fatloss    UUID := 'd0a80121-0001-4e78-94f8-585d77059001';
  cat_brain      UUID := 'd0a80121-0002-4e78-94f8-585d77059002';
  cat_beauty     UUID := 'd0a80121-0003-4e78-94f8-585d77059003';
  cat_healing    UUID := 'd0a80121-0004-4e78-94f8-585d77059004';
  cat_longevity  UUID := 'd0a80121-0005-4e78-94f8-585d77059005';
  cat_muscle     UUID := 'd0a80121-0006-4e78-94f8-585d77059006';
  cat_sleep      UUID := 'd0a80121-0007-4e78-94f8-585d77059007';
  cat_immunity   UUID := 'd0a80121-0008-4e78-94f8-585d77059008';
  cat_all        UUID := 'd0a80121-0009-4e78-94f8-585d77059009';
BEGIN

  -- 1. TIRZEPATIDE (8 sizes) - Featured
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Tirzepatide',
    'Tirzepatide is a prescription medication that mimics two natural hormones, GLP-1 and GIP, to help regulate blood sugar and appetite. It works by stimulating insulin release when blood sugar is high, slowing digestion, and reducing appetite, which often leads to significant weight loss. It is primarily used for type 2 diabetes management and obesity treatment and may also improve heart health by lowering cardiovascular risk factors.',
    cat_fatloss::text, 549.00, 99.0, 100000, true, true, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '2.5mg',  2.5,  549.00,  100000),
  (pid, '5mg',    5.0,  649.00,  100000),
  (pid, '7.5mg',  7.5,  749.00,  100000),
  (pid, '10mg',   10.0, 849.00,  100000),
  (pid, '12.5mg', 12.5, 949.00,  100000),
  (pid, '15mg',   15.0, 1049.00, 100000),
  (pid, '20mg',   20.0, 1249.00, 100000),
  (pid, '30mg',   30.0, 1549.00, 100000);

  -- 2. 5 AMINO (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    '5 Amino',
    '5-Amino (5-Amino-1MQ) is a research compound that supports metabolic health by inhibiting NNMT, enhancing cellular energy use, promoting fat metabolism, improving insulin sensitivity, and supporting healthy glucose regulation. It may also help reduce fat accumulation, increase energy expenditure, and maintain overall metabolic balance, making it of interest in studies on obesity and metabolic syndrome.',
    cat_fatloss::text, 573.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '50mg',  50.0,  573.00,  100000),
  (pid, '100mg', 100.0, 1000.00, 100000);

  -- 3. ADAMAX 5mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Adamax 5mg',
    'Adamax may help enhance focus, memory, and overall mental clarity by supporting brain signaling and cognitive function. It is believed to promote neuroprotection, helping protect brain cells from stress and damage. Some research suggests it may increase BDNF levels, which supports learning, mood, and brain plasticity. It is also explored for its potential to reduce mental fatigue and improve productivity.',
    cat_brain::text, 647.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 4. AHK-Cu 100mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'AHK-Cu 100mg',
    'AHK-Cu is a copper-binding peptide (Alanine-Histidine-Lysine with copper) known for its regenerative and anti-aging properties. It supports collagen production, wound healing, and skin repair while helping reduce inflammation and oxidative stress. In skincare, it''s used to improve skin firmness, reduce fine lines, and promote a more even tone.',
    cat_beauty::text, 329.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 5. AOD-9604 5mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'AOD-9604 5mg',
    'AOD-9604 is a synthetic peptide fragment derived from human growth hormone (HGH), designed specifically to target fat metabolism without affecting blood sugar or growth pathways. It works by stimulating lipolysis (fat breakdown) and inhibiting lipogenesis (fat storage), which is why it''s marketed for fat loss and weight management. Unlike full HGH, it does not appear to significantly impact insulin levels or cause tissue growth.',
    cat_fatloss::text, 500.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 6. ARA-290 10mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'ARA-290 10mg',
    'ARA-290 is a synthetic peptide that supports neuroprotection, tissue repair, and metabolic regulation by activating the body''s innate repair receptor. It helps reduce neuropathic pain, improve nerve regeneration, relieve small-fiber and diabetic neuropathy, suppress inflammation, promote tissue healing, enhance metabolic control, improve glucose and lipid profiles, and support immune balance and vascular function.',
    cat_healing::text, 317.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 7. BACTERIOSTATIC WATER (3 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Bacteriostatic Water',
    'Bacteriostatic water (often called "BAC water") is sterile water that contains a small amount of benzyl alcohol (about 0.9%) to prevent bacterial growth. It''s commonly used in clinics for mixing injectable medications and peptides.',
    cat_all::text, 43.00, 99.0, 100000, true, false, 'Store at room temperature'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '10ml', 10.0, 43.00,  100000),
  (pid, '30ml', 30.0, 99.00,  100000),
  (pid, '50ml', 50.0, 149.00, 100000);

  -- 8. BPC-157 (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'BPC-157',
    'BPC-157 10mg - a synthetic peptide derived from a protective protein found in the stomach. It''s known for its potential healing and regenerative properties, especially in muscles, tendons, ligaments, and the gut. Research suggests it may promote tissue repair, reduce inflammation, improve blood vessel formation (angiogenesis), and support recovery from injuries.',
    cat_healing::text, 390.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  390.00, 100000),
  (pid, '10mg', 10.0, 695.00, 100000);

  -- 9. BPC-157 + TB500 (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'BPC-157 + TB500',
    'BPC-157 5mg + TB-500 5mg is a peptide combination commonly used in research and performance communities to support injury recovery and tissue repair. BPC-157 may help accelerate healing of muscles, tendons, ligaments, and the gut by reducing inflammation and promoting angiogenesis. TB-500 is studied for its ability to improve cell migration, tissue regeneration, flexibility, and muscle recovery.',
    cat_healing::text, 482.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '10mg (5mg+5mg)',   10.0, 482.00, 100000),
  (pid, '20mg (10mg+10mg)', 20.0, 890.00, 100000);

  -- 10. CAGRILINTIDE (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Cagrilintide',
    'Cagrilintide is an experimental injectable peptide designed to support weight loss and metabolic health. It mimics the hormone amylin, which works alongside insulin to regulate appetite, slow stomach emptying, and reduce post-meal blood sugar spikes. By suppressing appetite and promoting satiety, it helps reduce calorie intake and can contribute to fat loss.',
    cat_fatloss::text, 909.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  909.00,  100000),
  (pid, '10mg', 10.0, 1500.00, 100000);

  -- 11. CARDIOGEN 20mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Cardiogen 20mg',
    'Cardiogen is a short peptide bioregulator designed to support cardiovascular health by helping maintain healthy heart muscle function, improving resilience of cardiac tissues to stress, and promoting proper blood vessel tone and circulation.',
    cat_longevity::text, 592.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 12. CEREBROLYSIN 60mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Cerebrolysin 60mg',
    'Cerebrolysin is a peptide-based neuroprotective and neurotrophic preparation that supports brain health by enhancing memory, learning, and attention, protecting neurons from oxidative stress and apoptosis, and promoting synaptic plasticity and nerve regeneration.',
    cat_brain::text, 281.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 13. CJC-1295 WITHOUT DAC (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'CJC-1295 10mg Without DAC',
    'CJC-1295 is a GHRH analog that stimulates natural growth hormone and IGF-1 production, supporting lean muscle growth, fat metabolism, bone density, and tissue repair. It also enhances recovery, metabolic regulation, anti-aging effects, and overall anabolic and regenerative processes.',
    cat_muscle::text, 805.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  805.00,  100000),
  (pid, '10mg', 10.0, 1400.00, 100000);

  -- 14. CJC-1295 w/o DAC + IPAMORELIN 10mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'CJC-1295 w/o dac + Ipamorelin 10mg',
    'CJC-1295 w/o DAC + Ipamorelin 10mg is a combination of two peptides to stimulate natural growth hormone release. Supporting fat loss and lean muscle growth, enhancing recovery, improving sleep quality, and boosting energy and vitality.',
    cat_muscle::text, 482.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 15. CJC-1295 WITH DAC 5mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'CJC-1295 with DAC 5mg',
    'CJC-1295 with DAC is a long-acting GHRH analog that stimulates natural growth hormone and IGF-1 production over an extended period, supporting lean muscle growth, fat metabolism, bone density, and tissue repair.',
    cat_muscle::text, 848.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 16. DSIP (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'DSIP',
    'DSIP (Delta Sleep-Inducing Peptide) is a research peptide that may help improve sleep quality, promote deeper restorative sleep, and support recovery from stress or physical strain. It is also studied for its potential to regulate stress hormones, reduce fatigue, and modulate pain perception.',
    cat_sleep::text, 750.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  750.00,  100000),
  (pid, '10mg', 10.0, 1300.00, 100000);

  -- 17. EPITALON (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Epitalon',
    'Epitalon is a synthetic peptide studied for its potential anti-aging and longevity effects. It is believed to work by regulating the enzyme telomerase, which helps maintain the length of telomeres. By supporting telomere health, epithalon may promote cellular repair, improve immune function, enhance sleep quality, and potentially slow some aspects of aging.',
    cat_longevity::text, 305.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '10mg', 10.0, 305.00, 100000),
  (pid, '50mg', 50.0, 900.00, 100000);

  -- 18. FAT BLASTER 10ml (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Fat Blaster 10ml',
    'Fat Blaster is designed to help support fat metabolism and energy production. It works by enhancing the breakdown of stored fats and assisting the body in converting them into usable energy. It may help boost energy levels and support liver function for better detoxification.',
    cat_all::text, 695.00, 99.0, 100000, true, false, 'Store at room temperature'
  );

  -- 19. GHK-CU (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'GHK-CU',
    'GHK-Cu is a naturally occurring copper peptide known for its regenerative and anti-aging effects. It plays a key role in wound healing, tissue repair, and skin rejuvenation by stimulating collagen, elastin, and glycosaminoglycan production. It may also promote hair growth and support tissue repair throughout the body.',
    cat_healing::text, 299.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '50mg',  50.0,  299.00, 100000),
  (pid, '100mg', 100.0, 500.00, 100000);

  -- 20. GHRP-2 ACETATE (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'GHRP-2 Acetate',
    'GHRP-2 Acetate is a growth hormone-releasing peptide that may help stimulate the body''s natural production of growth hormone. It''s often associated with benefits like improved muscle growth, fat metabolism, and recovery after workouts.',
    cat_fatloss::text, 305.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  305.00, 100000),
  (pid, '10mg', 10.0, 530.00, 100000);

  -- 21. GHRP-6 ACETATE (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'GHRP-6 Acetate',
    'GHRP-6 Acetate is a growth hormone-releasing peptide commonly associated with increased appetite, improved muscle growth, and enhanced recovery. It may also support fat metabolism and better sleep quality through its effects on hormone release.',
    cat_fatloss::text, 305.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  305.00, 100000),
  (pid, '10mg', 10.0, 530.00, 100000);

  -- 22. GLOW 70mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'GLOW 70mg',
    'Glow is a research peptide blend designed to support skin health, repair, and rejuvenation at the cellular level. It combines GHK-Cu, BPC-157, and TB-500 to enhance skin radiance, improve elasticity, and accelerate recovery from minor tissue damage.',
    cat_muscle::text, 1019.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 23. GLUTATHIONE 1200mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Glutathione 1200mg',
    'Glutathione is a powerful antioxidant naturally produced in the body that helps protect cells from oxidative stress and free radical damage. It plays a key role in detoxification, supporting the liver in removing toxins, heavy metals, and waste products.',
    cat_longevity::text, 360.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 24. GLUTATHIONE 1500mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Glutathione 1500mg',
    'Glutathione 1500mg is a high-dose antioxidant commonly used for skin health and overall detox support. It helps neutralize free radicals, which may improve skin brightness and reduce signs of aging over time.',
    cat_beauty::text, 400.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 25. HEXARELIN ACETATE 5mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Hexadecimal Acetate 5mg',
    'Hexarelin Acetate 5mg is a potent growth hormone-releasing peptide that may strongly increase natural GH levels. It''s commonly associated with enhanced muscle growth, faster recovery, and improved strength.',
    cat_healing::text, 421.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 26. HGH 191-176 5mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'HGH 191-176 5mg',
    'HGH 176-191 is a synthetic peptide fragment of human growth hormone designed to support fat metabolism by promoting fat breakdown, reducing body fat, and improving lean body composition.',
    cat_fatloss::text, 464.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 27. HMG 75IU (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'HMG 75IU',
    'HMG-regulating peptides are designed to support cardiovascular and metabolic health by modulating HMG-CoA reductase activity, helping lower LDL cholesterol, and improving lipid metabolism.',
    cat_fatloss::text, 329.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 28. HUMANIN 10mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Humanin 10mg',
    'Humanin may help protect cells from stress and damage, especially in the brain and nervous system. It is associated with improved mitochondrial function, which supports energy production and overall cellular health.',
    cat_longevity::text, 934.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 29. IGF-1 LR3 (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'IGF-1 LR3',
    'IGF-1 is a peptide hormone that supports growth and tissue repair by stimulating cell proliferation, differentiation, and protein synthesis. It promotes lean muscle growth, bone density, and connective tissue health.',
    cat_muscle::text, 1061.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '0.1mg', 0.1, 1061.00, 100000),
  (pid, '1mg',   1.0, 2500.00, 100000);

  -- 30. IPAMORELIN (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Ipamorelin',
    'Ipamorelin is a synthetic peptide that stimulates the release of growth hormone from the pituitary gland in a gentle, targeted way. It supports muscle growth, fat metabolism, recovery, and energy levels without significantly affecting cortisol or appetite.',
    cat_muscle::text, 390.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  390.00, 100000),
  (pid, '10mg', 10.0, 695.00, 100000);

  -- 31. KISSPEPTIN (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Kisspeptin',
    'Kisspeptin is a naturally occurring peptide that plays a crucial role in regulating the reproductive system. It stimulates the release of gonadotropin-releasing hormone (GnRH) from the hypothalamus.',
    cat_sleep::text, 451.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  451.00, 100000),
  (pid, '10mg', 10.0, 800.00, 100000);

  -- 32. KLOW 80mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'KLOW 80mg',
    'KLOW is a multi-peptide research blend combining BPC-157, TB-500, GHK-Cu, and KPV designed to support tissue repair, cellular regeneration, and inflammation control.',
    cat_healing::text, 1214.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 33. KPV (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'KPV',
    'KPV is a small peptide fragment derived from alpha-MSH studied for its anti-inflammatory and immune-modulating properties. It may help reduce inflammation, support wound healing, protect tissues from oxidative stress, and promote gut health.',
    cat_healing::text, 317.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  317.00, 100000),
  (pid, '10mg', 10.0, 550.00, 100000);

  -- 34. L-CARNITINE 600mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'L-Carnitine 600mg',
    'L-Carnitine helps your body convert stored fat into energy by transporting fatty acids into the mitochondria. It may improve exercise performance and endurance, reduce fatigue, and support brain function and heart health.',
    cat_all::text, 299.00, 99.0, 100000, true, false, 'Store at room temperature'
  );

  -- 35. LEMON BOTTLE 10ml (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Lemon Bottle 10ml',
    'Lemon Bottle is a peptide product marketed for fat loss, detox, and metabolism support that typically combines amino acids and lipotropic nutrients designed to help improve fat breakdown, energy use, and liver function.',
    cat_fatloss::text, 360.00, 99.0, 100000, true, false, 'Store at room temperature'
  );

  -- 36. LIPO-C WITH B12 10ml (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Lipo-C with B12 10ml',
    'Lipo-C with B12 is a lipotropic injection that helps support fat metabolism by assisting the body in breaking down and transporting fats more efficiently. The added vitamin B12 helps boost energy levels, improve metabolism, and reduce fatigue.',
    cat_all::text, 354.00, 99.0, 100001, true, false, 'Store at room temperature'
  );

  -- 37. LL37 5mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'LL37 5mg',
    'LL-37 is an antimicrobial peptide that supports the body''s innate immune defense by fighting bacteria, viruses, and fungi. It also modulates inflammation, promotes wound healing and tissue repair, and supports skin barrier integrity.',
    cat_immunity::text, 650.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 38. MAZDUTIDE 10mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Mazdutide 10mg',
    'Mazdutide is a long-acting dual GLP-1 and glucagon receptor agonist peptide developed to support metabolic health by suppressing appetite, enhancing insulin secretion, and increasing energy expenditure.',
    cat_fatloss::text, 573.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 39. MELANOTAN II 10mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Melanotan II 10mg',
    'Melanotan II is a synthetic peptide designed to stimulate melanin production, resulting in darker skin and faster tanning with reduced need for UV exposure.',
    cat_beauty::text, 268.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 40. MOTS-C (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Mots-C',
    'MOTS-C is a naturally occurring mitochondrial-derived peptide that plays a key role in cellular energy regulation and metabolism. It helps improve insulin sensitivity, glucose utilization, and fat metabolism.',
    cat_fatloss::text, 329.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  329.00, 100000),
  (pid, '10mg', 10.0, 580.00, 100000);

  -- 41. NAD+ (3 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'NAD+',
    'NAD+ (Nicotinamide Adenine Dinucleotide) is a vital coenzyme found in every cell that plays a central role in energy production, DNA repair, and cellular metabolism. It helps mitochondria convert nutrients into energy, supports healthy aging, and enhances cellular repair.',
    cat_longevity::text, 400.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '100mg', 100.0, 400.00,  100000),
  (pid, '250mg', 250.0, 750.00,  100000),
  (pid, '500mg', 500.0, 1200.00, 100000);

  -- 42. OXYTOCIN (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Oxytocin',
    'Oxytocin is a peptide hormone that supports social bonding, emotional regulation, and reproductive health. It also enhances sexual arousal and satisfaction, promotes relaxation and stress reduction, and supports cardiovascular function.',
    cat_brain::text, 342.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '2mg', 2.0, 342.00, 100000),
  (pid, '5mg', 5.0, 600.00, 100000);

  -- 43. PE 22-88 10mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'PE 22-88 10mg',
    'PE-22-88 is a synthetic peptide derived from growth hormone-releasing hormone that supports natural growth hormone release, helping promote lean body mass, enhance fat metabolism, and improve tissue repair and recovery.',
    cat_longevity::text, 390.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 44. PINEALON (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Pinealon',
    'Pinealon is a short synthetic peptide that supports brain health by protecting neurons from oxidative stress, enhancing memory and learning, and promoting overall cognitive function.',
    cat_brain::text, 287.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '10mg', 10.0, 287.00, 100000),
  (pid, '20mg', 20.0, 500.00, 100000);

  -- 45. PT-141 10mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'PT-141 10mg',
    'PT-141 (Bremelanotide) is a synthetic peptide that targets the central nervous system to enhance sexual desire and arousal. It stimulates melanocortin receptors in the brain to increase libido in both men and women.',
    cat_sleep::text, 329.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 46. RETATRUTIDE (8 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Retatrutide',
    'Retatrutide is an investigational triple-receptor agonist peptide drug that activates GLP-1, GIP, and glucagon receptors all at once to regulate metabolism, suppress appetite, improve insulin sensitivity, and increase energy expenditure.',
    cat_fatloss::text, 756.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '2mg',  2.0,  756.00,  100000),
  (pid, '3mg',  3.0,  900.00,  100000),
  (pid, '4mg',  4.0,  1050.00, 100000),
  (pid, '5mg',  5.0,  1200.00, 100000),
  (pid, '8mg',  8.0,  1500.00, 100000),
  (pid, '10mg', 10.0, 1800.00, 100000),
  (pid, '15mg', 15.0, 2400.00, 100000),
  (pid, '20mg', 20.0, 3000.00, 100000);

  -- 47. SELANK (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Selank',
    'Selank is a synthetic peptide developed from the naturally occurring tetrapeptide tuftsin, studied for its anxiolytic, cognitive, and mood-enhancing effects. It may help reduce anxiety and stress, improve mental clarity, focus, and memory.',
    cat_brain::text, 360.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  360.00, 100000),
  (pid, '10mg', 10.0, 630.00, 100000);

  -- 48. SEMAGLUTIDE (5 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Semaglutide',
    'Semaglutide is a medication that mimics a natural hormone called GLP-1, which regulates blood sugar and appetite. It helps lower blood sugar by stimulating insulin release and slowing digestion. It also suppresses appetite, leading to weight loss.',
    cat_fatloss::text, 360.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '2mg',  2.0,  360.00,  100000),
  (pid, '3mg',  3.0,  480.00,  100000),
  (pid, '5mg',  5.0,  700.00,  100000),
  (pid, '7mg',  7.0,  950.00,  100000),
  (pid, '10mg', 10.0, 1300.00, 100000);

  -- 49. SEMAX (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Semax',
    'Semax is a synthetic peptide derived from ACTH, primarily studied for its neuroprotective, cognitive, and mood-enhancing effects. It may help improve memory, focus, learning, and mental clarity, reduce anxiety and stress, and support brain health.',
    cat_healing::text, 359.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  359.00, 100000),
  (pid, '10mg', 10.0, 630.00, 100000);

  -- 50. SERMORELIN (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Sermorelin',
    'Sermorelin is a GHRH analog that stimulates natural growth hormone production, supporting lean muscle growth, fat metabolism, bone density, and tissue repair.',
    cat_muscle::text, 756.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  756.00,  100000),
  (pid, '10mg', 10.0, 1300.00, 100000);

  -- 51. SLU-PP-322 5mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'SLU-PP-322 5mg',
    'SLU-PP-322 is a research compound that supports cellular energy and metabolism by activating estrogen-related receptors, promoting mitochondrial biogenesis, improving fat metabolism, and enhancing insulin sensitivity.',
    cat_fatloss::text, 604.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 52. SNAP 8 10mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Snap 8 10mg',
    'SNAP-8 (Acetyl Octapeptide-3) is a synthetic peptide commonly used in cosmetic skincare to help reduce the appearance of wrinkles and fine lines by mildly inhibiting muscle contractions.',
    cat_beauty::text, 268.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 53. SS-31 (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'SS-31',
    'SS-31 (Elamipretide) is a synthetic peptide that targets mitochondria to improve their function and reduce oxidative stress. It helps stabilize mitochondrial membranes, enhance energy production, and protect cells from damage.',
    cat_longevity::text, 1673.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  1673.00, 100000),
  (pid, '10mg', 10.0, 3000.00, 100000);

  -- 54. SURVODUTIDE 10mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Surovodutine 10mg',
    'Survodutide is an investigational dual-agonist peptide that activates both the GLP-1 and glucagon receptors to support metabolic health by suppressing appetite, enhancing energy expenditure, and improving glucose metabolism.',
    cat_fatloss::text, 1153.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 55. TB-500 10mg (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'TB-500 10mg',
    'TB-500 is a synthetic peptide derived from thymosin beta-4, studied for its potential to support tissue repair, healing, and recovery. It may promote cell migration, angiogenesis, and reduction of inflammation.',
    cat_healing::text, 756.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  756.00,  100000),
  (pid, '10mg', 10.0, 1300.00, 100000);

  -- 56. TESAMORELIN (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Tesamorelin',
    'Tesamorelin is a synthetic peptide analog of GHRH that stimulates the pituitary gland to produce growth hormone. It is used to reduce visceral fat and support body composition improvements.',
    cat_muscle::text, 939.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  939.00,  100000),
  (pid, '10mg', 10.0, 1600.00, 100000);

  -- 57. THYMALIN 10mg (no sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Thymalin 10mg',
    'Thymalin is a short peptide bioregulator that supports immune system function by enhancing T-cell activity, improving immune surveillance, and helping balance immune responses.',
    cat_immunity::text, 360.00, 99.0, 100000, true, false, 'Store at -20°C'
  );

  -- 58. THYMOSIN ALPHA (2 sizes)
  INSERT INTO products (name, description, category, base_price, purity_percentage, stock_quantity, available, featured, storage_conditions)
  VALUES (
    'Thymosin Alpha',
    'Thymosin Alpha-1 (Ta1) is a naturally occurring peptide that plays a key role in immune system regulation. It helps enhance T-cell function, modulate immune responses, and improve the body''s defense against infections and diseases.',
    cat_immunity::text, 878.00, 99.0, 100000, true, false, 'Store at -20°C'
  ) RETURNING id INTO pid;
  INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity) VALUES
  (pid, '5mg',  5.0,  878.00,  100000),
  (pid, '10mg', 10.0, 1500.00, 100000);

  -- UPDATE AVAILABILITY BASED ON STOCK
  UPDATE products p
  SET available = EXISTS (
    SELECT 1 FROM product_variations pv
    WHERE pv.product_id = p.id AND pv.stock_quantity > 0
  )
  WHERE EXISTS (SELECT 1 FROM product_variations pv2 WHERE pv2.product_id = p.id);

END $$;

-- VERIFY
SELECT 'Products: ' || COUNT(*) FROM products;
SELECT 'Variations: ' || COUNT(*) FROM product_variations;
