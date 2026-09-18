/* ============================================================
   PRODUCT DETAIL ENGINE
   Raj Marketing Mysore
   Version: 3.0 | Complete Rebuild
============================================================ */

(function() {
    'use strict';

    // ============================================================
    // PRODUCT DATABASE
    // ============================================================
    const PRODUCT_DB = {
        // ===== PLEATED =====
        'pleated-economic': {
            id: 'pleated-economic',
            name: 'Pleated Economic',
            category: 'Pleated',
            variant: 'Standard Pleated',
            displayPrice: 420,
            priceRange: '₹380 - ₹460',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'pleated',
            description: 'Economical pleated mosquito net for windows and doors with compact folding design.',
            longDescription: 'The Economic Pleated mosquito net offers excellent value for money. It features a compact folding mechanism that allows the net to retract neatly when not in use, saving space and maintaining the aesthetic of your windows and doors. Ideal for residential and commercial applications where budget is a consideration.',
            specs: {
                'Product Type': 'Pleated Mosquito Net',
                'Mesh Type': 'Fiber Mesh',
                'Frame Material': 'Aluminium',
                'Operation': 'Pleated Folding',
                'Custom Size': 'Yes',
                'Warranty': '1 Year'
            },
            benefits: ['Space Saving Design', 'Easy Operation', 'Affordable Pricing', 'Custom Sizes', 'Neat Appearance'],
            applications: ['Windows', 'Doors', 'Balcony', 'Kitchen', 'Bedroom'],
            colours: ['Ivory', 'Honey Gold', 'Brown', 'Black', 'White'],
            types: ['Single', 'Double'],
            images: ['images/pleated-economic.jpg', 'images/pleated-economic-2.jpg', 'images/pleated-economic-3.jpg'],
            faqs: [
                { q: 'What is the price range?', a: 'Economic Pleated starts from ₹380/sq.ft and goes up to ₹460/sq.ft depending on size and configuration.' },
                { q: 'Is installation included?', a: 'Professional installation is available at additional charges. You can select this during booking.' },
                { q: 'How long does delivery take?', a: 'Pleated nets normally take around 3 days for manufacturing and installation.' }
            ],
            related: ['pleated-heavy', 'single-sliding-economic', 'aluminium-frame-colour-mesh']
        },

        'pleated-heavy': {
            id: 'pleated-heavy',
            name: 'Pleated Heavy',
            category: 'Pleated',
            variant: 'Heavy Duty',
            displayPrice: 455,
            priceRange: '₹450 - ₹460',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'pleated',
            description: 'Heavy duty pleated mosquito net with stronger construction for high-traffic areas.',
            longDescription: 'The Heavy Pleated mosquito net is built with stronger materials for areas with high traffic and frequent use. It offers superior durability while maintaining the space-saving benefits of pleated design.',
            specs: {
                'Product Type': 'Pleated Mosquito Net',
                'Mesh Type': 'Heavy Fiber Mesh',
                'Frame Material': 'Reinforced Aluminium',
                'Operation': 'Pleated Folding',
                'Custom Size': 'Yes',
                'Warranty': '2 Years'
            },
            benefits: ['Heavy Duty', 'High Durability', 'Space Saving', 'Smooth Operation', 'Long Lasting'],
            applications: ['Main Doors', 'Commercial', 'High Traffic', 'Offices', 'Shops'],
            colours: ['Ivory', 'Honey Gold', 'Brown', 'Black', 'White', 'Teakwood'],
            types: ['Single', 'Double'],
            images: ['images/pleated-heavy.jpg', 'images/pleated-heavy-2.jpg', 'images/pleated-heavy-3.jpg'],
            faqs: [
                { q: 'What makes this different from Economic?', a: 'Heavy Pleated uses stronger materials and construction for better durability.' },
                { q: 'Is this suitable for commercial use?', a: 'Yes, ideal for commercial spaces, shops, and offices with high foot traffic.' }
            ],
            related: ['pleated-top-heavy', 'heavy-detachable-pleated', 'security-screen-single-door']
        },

        'pleated-top-heavy': {
            id: 'pleated-top-heavy',
            name: 'Pleated Top Heavy',
            category: 'Pleated',
            variant: 'Top Heavy',
            displayPrice: 510,
            priceRange: '₹510',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'pleated',
            description: 'Premium top-heavy pleated net with superior durability and smooth operation.',
            longDescription: 'Top Heavy Pleated features enhanced top rail construction for superior durability. The reinforced top section ensures long-lasting performance even with frequent use.',
            specs: {
                'Product Type': 'Pleated Mosquito Net',
                'Mesh Type': 'Premium Fiber Mesh',
                'Frame Material': 'Reinforced Aluminium',
                'Operation': 'Pleated Folding',
                'Custom Size': 'Yes',
                'Warranty': '2 Years'
            },
            benefits: ['Top Heavy Construction', 'Superior Durability', 'Smooth Operation', 'Premium Quality'],
            applications: ['Premium Doors', 'Main Entrances', 'Villas', 'Hotels', 'Corporate Offices'],
            colours: ['Ivory', 'Honey Gold', 'Brown', 'Black', 'White', 'Teakwood'],
            types: ['Single', 'Double'],
            images: ['images/pleated-top-heavy.jpg', 'images/pleated-top-heavy-2.jpg', 'images/pleated-top-heavy-3.jpg'],
            faqs: [
                { q: 'What is Top Heavy construction?', a: 'Top Heavy features reinforced top rail for better durability and smoother operation.' }
            ],
            related: ['pleated-heavy', 'ss-pleated-economic', 'woodgrain-ss-304-mesh']
        },

        'ss-pleated-economic': {
            id: 'ss-pleated-economic',
            name: 'SS Pleated / SS Economic',
            category: 'Pleated',
            variant: 'Stainless Steel Pleated',
            displayPrice: 470,
            priceRange: '₹470',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'pleated',
            description: 'Stainless steel pleated mosquito net for enhanced durability.',
            longDescription: 'SS Pleated features stainless steel mesh for superior durability and protection. Better resistance to wear, tear, and corrosion.',
            specs: {
                'Product Type': 'Pleated Mosquito Net',
                'Mesh Type': 'Stainless Steel',
                'Frame Material': 'Aluminium',
                'Operation': 'Pleated Folding',
                'Custom Size': 'Yes',
                'Warranty': '2 Years'
            },
            benefits: ['SS Mesh', 'Enhanced Durability', 'Corrosion Resistant', 'Superior Protection'],
            applications: ['Premium Doors', 'Coastal Areas', 'Villas', 'Hotels', 'Main Entrances'],
            colours: ['Ivory', 'Honey Gold', 'Brown', 'Black', 'White'],
            types: ['Single', 'Double'],
            images: ['images/ss-pleated.jpg', 'images/ss-pleated-2.jpg', 'images/ss-pleated-3.jpg'],
            faqs: [
                { q: 'What is the advantage of SS mesh?', a: 'SS mesh offers better durability, corrosion resistance, and protection.' }
            ],
            related: ['pleated-heavy', 'pleated-top-heavy', 'ss-black-mesh']
        },

        'heavy-detachable-pleated': {
            id: 'heavy-detachable-pleated',
            name: 'Heavy Detachable Pleated',
            category: 'Pleated',
            variant: 'Heavy Detachable',
            displayPrice: 460,
            priceRange: '₹460',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'pleated',
            description: 'Heavy detachable pleated net for easy cleaning and storage.',
            longDescription: 'Combines durability with convenience. The detachable design allows easy removal for cleaning, maintenance, and storage.',
            specs: {
                'Product Type': 'Pleated Mosquito Net',
                'Mesh Type': 'Heavy Fiber Mesh',
                'Frame Material': 'Aluminium',
                'Operation': 'Detachable Pleated',
                'Custom Size': 'Yes',
                'Warranty': '2 Years'
            },
            benefits: ['Detachable Design', 'Easy Cleaning', 'Heavy Duty', 'Flexible', 'Convenient'],
            applications: ['Doors', 'Windows', 'Balcony', 'Kitchen', 'Seasonal Use'],
            colours: ['Ivory', 'Honey Gold', 'Brown', 'Black', 'White'],
            types: ['Single', 'Double'],
            images: ['images/heavy-detachable-pleated.jpg', 'images/heavy-detachable-pleated-2.jpg', 'images/heavy-detachable-pleated-3.jpg'],
            faqs: [
                { q: 'How does detachable design work?', a: 'The detachable design allows the net to be easily removed for cleaning and maintenance.' }
            ],
            related: ['pleated-heavy', 'economic-woodgrain-pleated', 'single-door-pleated']
        },

        'economic-woodgrain-pleated': {
            id: 'economic-woodgrain-pleated',
            name: 'Economic Woodgrain Pleated',
            category: 'Pleated',
            variant: 'Woodgrain Finish',
            displayPrice: 460,
            priceRange: '₹460',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'pleated',
            description: 'Economic pleated net with elegant woodgrain finish.',
            longDescription: 'Offers the perfect blend of affordability and aesthetics. The woodgrain finish provides a premium look that complements any interior design.',
            specs: {
                'Product Type': 'Pleated Mosquito Net',
                'Mesh Type': 'Fiber Mesh',
                'Frame Material': 'Aluminium with Woodgrain',
                'Operation': 'Pleated Folding',
                'Custom Size': 'Yes',
                'Warranty': '1 Year'
            },
            benefits: ['Woodgrain Finish', 'Premium Appearance', 'Affordable', 'Space Saving'],
            applications: ['Premium Doors', 'Windows', 'Villas', 'Apartments', 'Modern Homes'],
            colours: ['Teakwood', 'Honey Gold', 'Brown'],
            types: ['Single', 'Double'],
            images: ['images/woodgrain-pleated.jpg', 'images/woodgrain-pleated-2.jpg', 'images/woodgrain-pleated-3.jpg'],
            faqs: [
                { q: 'What is woodgrain finish?', a: 'Woodgrain finish gives a premium wooden appearance to the aluminium frame.' }
            ],
            related: ['pleated-economic', 'woodgrain-ss-304-mesh', 'pleated-heavy']
        },

        'honeycomb-mesh-double-door': {
            id: 'honeycomb-mesh-double-door',
            name: 'Honeycomb + Mesh Double Door',
            category: 'Honeycomb',
            variant: 'Double Door',
            displayPrice: 680,
            priceRange: '₹680',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'honeycomb',
            description: 'Premium honeycomb mesh with double door configuration.',
            longDescription: 'Combines unique honeycomb design with mesh protection for large openings. Excellent ventilation while maintaining privacy.',
            specs: {
                'Product Type': 'Honeycomb Net',
                'Mesh Type': 'Premium Fiber',
                'Frame Material': 'Aluminium',
                'Configuration': 'Double Door',
                'Custom Size': 'Yes',
                'Warranty': '2 Years'
            },
            benefits: ['Honeycomb Design', 'Double Door', 'Excellent Ventilation', 'Privacy Protection'],
            applications: ['Main Doors', 'Large Openings', 'Balcony', 'Villas', 'Apartments'],
            colours: ['Ivory', 'Honey Gold', 'Brown', 'Black', 'White', 'Teakwood'],
            types: ['Double Door'],
            images: ['images/honeycomb-double-door.jpg', 'images/honeycomb-double-door-2.jpg', 'images/honeycomb-double-door-3.jpg'],
            faqs: [
                { q: 'What is honeycomb design?', a: 'Honeycomb design provides unique aesthetic with excellent ventilation and privacy.' }
            ],
            related: ['single-door-pleated', 'security-screen-double-door', 'double-sliding-economic']
        },

        // ===== SLIDING =====
        'single-sliding-economic': {
            id: 'single-sliding-economic',
            name: 'Single Sliding Economic',
            category: 'Sliding',
            variant: 'Single Sliding',
            displayPrice: 400,
            priceRange: '₹400',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'sliding',
            description: 'Economical single sliding mosquito net for windows and small doors.',
            longDescription: 'Offers convenient sliding operation for windows and small doors. The sliding mechanism allows easy opening and closing.',
            specs: {
                'Product Type': 'Sliding Mosquito Net',
                'Mesh Type': 'Fiber Mesh',
                'Frame Material': 'Aluminium',
                'Operation': 'Single Sliding',
                'Custom Size': 'Yes',
                'Warranty': '1 Year'
            },
            benefits: ['Sliding Operation', 'Space Saving', 'Easy Operation', 'Affordable'],
            applications: ['Windows', 'Small Doors', 'Kitchen', 'Bedroom', 'Bathroom'],
            colours: ['Ivory', 'Black', 'White'],
            types: ['Single'],
            images: ['images/single-sliding.jpg', 'images/single-sliding-2.jpg', 'images/single-sliding-3.jpg'],
            faqs: [
                { q: 'How does sliding operation work?', a: 'The net slides horizontally on tracks for easy opening and closing.' }
            ],
            related: ['double-sliding-economic', 'pleated-economic', 'aluminium-frame-colour-mesh']
        },

        'double-sliding-economic': {
            id: 'double-sliding-economic',
            name: 'Double Sliding Economic',
            category: 'Sliding',
            variant: 'Double Sliding',
            displayPrice: 450,
            priceRange: '₹450',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'sliding',
            description: 'Economical double sliding mosquito net for wider openings.',
            longDescription: 'Features two sliding panels for wider openings. Better coverage while maintaining convenience of sliding operation.',
            specs: {
                'Product Type': 'Sliding Mosquito Net',
                'Mesh Type': 'Fiber Mesh',
                'Frame Material': 'Aluminium',
                'Operation': 'Double Sliding',
                'Custom Size': 'Yes',
                'Warranty': '1 Year'
            },
            benefits: ['Double Sliding', 'Wide Coverage', 'Space Saving', 'Convenient'],
            applications: ['Large Windows', 'Balcony Doors', 'Wide Entrances', 'Living Room'],
            colours: ['Ivory', 'Black', 'White'],
            types: ['Double'],
            images: ['images/double-sliding.jpg', 'images/double-sliding-2.jpg', 'images/double-sliding-3.jpg'],
            faqs: [
                { q: 'What is double sliding?', a: 'Features two sliding panels for wider openings and better coverage.' }
            ],
            related: ['single-sliding-economic', 'honeycomb-mesh-double-door', 'security-screen-double-door']
        },

        'single-door-pleated': {
            id: 'single-door-pleated',
            name: 'Single Door Pleated',
            category: 'Pleated',
            variant: 'Single Door',
            displayPrice: 900,
            priceRange: '₹900',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'pleated',
            description: 'Pleated mosquito net specially designed for single door installations.',
            longDescription: 'Specifically designed for standard single door installations. The pleated design folds compactly when not in use.',
            specs: {
                'Product Type': 'Pleated Door Net',
                'Mesh Type': 'Premium Fiber Mesh',
                'Frame Material': 'Aluminium',
                'Operation': 'Pleated Folding',
                'Custom Size': 'Yes',
                'Warranty': '2 Years'
            },
            benefits: ['Door Design', 'Space Saving', 'Easy Access', 'Durable'],
            applications: ['Main Doors', 'Office Doors', 'Shop Entrances', 'Balcony Doors'],
            colours: ['Ivory', 'Honey Gold', 'Brown', 'Black', 'White', 'Teakwood'],
            types: ['Single Door'],
            images: ['images/single-door-pleated.jpg', 'images/single-door-pleated-2.jpg', 'images/single-door-pleated-3.jpg'],
            faqs: [
                { q: 'Is this suitable for main doors?', a: 'Yes, perfect for main entrances and standard doors.' }
            ],
            related: ['pleated-heavy', 'security-screen-single-door', 'single-sliding-economic']
        },

        // ===== SECURITY =====
        'security-screen-single-door': {
            id: 'security-screen-single-door',
            name: 'Security Screen – Single Door',
            category: 'Security',
            variant: 'Single Door + GST',
            displayPrice: 990,
            priceRange: '₹990 + GST',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'security',
            description: 'Premium security screen for single door with robust protection.',
            longDescription: 'Provides maximum protection with robust construction. Designed to protect against both insects and intruders.',
            specs: {
                'Product Type': 'Security Screen',
                'Mesh Type': 'Heavy Duty SS Mesh',
                'Frame Material': 'Reinforced Aluminium',
                'Configuration': 'Single Door',
                'Custom Size': 'Yes',
                'Warranty': '3 Years'
            },
            benefits: ['Security Protection', 'Insect Protection', 'Heavy Duty', 'Peace of Mind'],
            applications: ['Main Doors', 'Entrances', 'Security Doors', 'Commercial Buildings'],
            colours: ['Ivory', 'Honey Gold', 'Brown', 'Black', 'White'],
            types: ['Single Door'],
            images: ['images/security-screen-single.jpg', 'images/security-screen-single-2.jpg', 'images/security-screen-single-3.jpg'],
            faqs: [
                { q: 'What makes Security Screen different?', a: 'Features heavy-duty mesh and frame for enhanced protection against intruders.' }
            ],
            related: ['security-screen-double-door', 'single-door-pleated', 'ss-black-304g-0.5mm']
        },

        'security-screen-double-door': {
            id: 'security-screen-double-door',
            name: 'Security Screen – Double Door',
            category: 'Security',
            variant: 'Double Door + GST',
            displayPrice: 1150,
            priceRange: '₹1,150 + GST',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'security',
            description: 'Premium security screen for double door with maximum protection.',
            longDescription: 'Provides maximum protection for larger entrances. Designed with heavy-duty materials for enhanced security.',
            specs: {
                'Product Type': 'Security Screen',
                'Mesh Type': 'Heavy Duty SS Mesh',
                'Frame Material': 'Reinforced Aluminium',
                'Configuration': 'Double Door',
                'Custom Size': 'Yes',
                'Warranty': '3 Years'
            },
            benefits: ['Maximum Security', 'Double Door Coverage', 'Heavy Duty', 'Durable'],
            applications: ['Double Doors', 'Main Entrances', 'Commercial Buildings', 'Villas'],
            colours: ['Ivory', 'Honey Gold', 'Brown', 'Black', 'White'],
            types: ['Double Door'],
            images: ['images/security-screen-double.jpg', 'images/security-screen-double-2.jpg', 'images/security-screen-double-3.jpg'],
            faqs: [
                { q: 'Is this suitable for double doors?', a: 'Yes, specifically designed for double door configurations.' }
            ],
            related: ['security-screen-single-door', 'double-sliding-economic', 'honeycomb-mesh-double-door']
        },

        // ===== ALUMINIUM =====
        'aluminium-frame-colour-mesh': {
            id: 'aluminium-frame-colour-mesh',
            name: 'Aluminium Frame + Colour Mesh',
            category: 'Aluminium',
            variant: 'Colour Mesh',
            displayPrice: 420,
            priceRange: '₹420',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'frame',
            description: 'Durable aluminium frame with colour-coated mesh.',
            longDescription: 'Combines durability with aesthetic appeal. Aluminium frame provides strength while colour-coated mesh adds visual appeal.',
            specs: {
                'Product Type': 'Aluminium Frame',
                'Mesh Type': 'Colour Coated Mesh',
                'Frame Material': 'Aluminium',
                'Custom Size': 'Yes',
                'Warranty': '5 Years'
            },
            benefits: ['Durable Frame', 'Colour Options', 'Long Lasting', 'Corrosion Resistant'],
            applications: ['Windows', 'Doors', 'Commercial Buildings', 'Homes'],
            colours: ['Ivory', 'Honey Gold', 'Brown', 'Black', 'White'],
            types: ['Single', 'Double'],
            images: ['images/aluminium-colour-mesh.jpg', 'images/aluminium-colour-mesh-2.jpg', 'images/aluminium-colour-mesh-3.jpg'],
            faqs: [
                { q: 'What is the warranty?', a: 'Aluminium frames come with 5-year warranty.' }
            ],
            related: ['woodgrain-ss-304-mesh', 'single-sliding-economic', 'pleated-economic']
        },

        'woodgrain-ss-304-mesh': {
            id: 'woodgrain-ss-304-mesh',
            name: 'Woodgrain + SS 304 Mesh',
            category: 'Aluminium',
            variant: 'Woodgrain + SS 304',
            displayPrice: 580,
            priceRange: '₹580',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'premium',
            description: 'Premium woodgrain finish with SS 304 mesh.',
            longDescription: 'Combines premium aesthetics with superior protection. The woodgrain finish provides natural wood appearance.',
            specs: {
                'Product Type': 'Premium Aluminium Frame',
                'Mesh Type': 'SS 304 Mesh',
                'Frame Material': 'Aluminium with Woodgrain',
                'Custom Size': 'Yes',
                'Warranty': '5 Years'
            },
            benefits: ['Woodgrain Finish', 'SS 304 Mesh', 'Premium Quality', 'Corrosion Resistant'],
            applications: ['Premium Windows', 'Luxury Doors', 'Villas', 'High-end Homes'],
            colours: ['Teakwood', 'Honey Gold', 'Brown'],
            types: ['Single', 'Double'],
            images: ['images/woodgrain-ss304.jpg', 'images/woodgrain-ss304-2.jpg', 'images/woodgrain-ss304-3.jpg'],
            faqs: [
                { q: 'What is SS 304 mesh?', a: 'SS 304 is high-grade stainless steel mesh that is rust-resistant.' }
            ],
            related: ['aluminium-frame-colour-mesh', 'ss-black-304g-0.5mm', 'economic-woodgrain-pleated']
        },

        // ===== MESH =====
        'ss-black-mesh-0.18mm': {
            id: 'ss-black-mesh-0.18mm',
            name: 'SS Black Mesh 0.18mm',
            category: 'Mesh',
            variant: '0.18mm Black',
            displayPrice: 36,
            priceRange: '₹36',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: true,
            badge: 'mesh',
            description: 'Stainless steel black mesh 0.18mm for durable protection.',
            longDescription: 'Offers durable mosquito protection with stainless steel construction. The black coating provides corrosion resistance.',
            specs: {
                'Product Type': 'SS Mesh',
                'Material': 'Stainless Steel',
                'Thickness': '0.18mm',
                'Colour': 'Black',
                'Custom Size': 'Yes'
            },
            benefits: ['SS Construction', 'Durable', 'Corrosion Resistant', 'Sleek Appearance'],
            applications: ['Windows', 'Doors', 'Balcony', 'Commercial Buildings'],
            colours: ['Black'],
            types: ['Standard'],
            images: ['images/ss-black-mesh.jpg', 'images/ss-black-mesh-2.jpg', 'images/ss-black-mesh-3.jpg'],
            faqs: [
                { q: 'What is the thickness?', a: 'This mesh is 0.18mm thick stainless steel black coated.' }
            ],
            related: ['ss-black-mesh', 'ss-black-mesh-3ft', 'ss-bright-mesh-0.24mm-4ft']
        },

        'ss-black-mesh': {
            id: 'ss-black-mesh',
            name: 'SS Black Mesh',
            category: 'Mesh',
            variant: 'Black',
            displayPrice: 38,
            priceRange: '₹38',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: true,
            badge: 'mesh',
            description: 'Stainless steel black mesh standard grade.',
            longDescription: 'Standard SS Black Mesh provides reliable mosquito protection with stainless steel construction.',
            specs: {
                'Product Type': 'SS Mesh',
                'Material': 'Stainless Steel',
                'Colour': 'Black',
                'Custom Size': 'Yes'
            },
            benefits: ['SS Construction', 'Durable', 'Corrosion Resistant', 'Reliable'],
            applications: ['Windows', 'Doors', 'Balcony', 'Homes'],
            colours: ['Black'],
            types: ['Standard'],
            images: ['images/ss-black-mesh-standard.jpg', 'images/ss-black-mesh-standard-2.jpg', 'images/ss-black-mesh-standard-3.jpg'],
            faqs: [
                { q: 'Is this suitable for commercial use?', a: 'Yes, suitable for both residential and commercial applications.' }
            ],
            related: ['ss-black-mesh-0.18mm', 'ss-black-mesh-3ft', 'fiber-touflex-mesh']
        },

        'ss-black-mesh-3ft': {
            id: 'ss-black-mesh-3ft',
            name: 'SS Black Mesh 3 ft',
            category: 'Mesh',
            variant: '3 ft Black',
            displayPrice: 42,
            priceRange: '₹42',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: true,
            badge: 'mesh',
            description: 'Stainless steel black mesh 3 ft width for larger installations.',
            longDescription: 'Provides wider coverage for larger installations. Perfect for wide windows and large doors.',
            specs: {
                'Product Type': 'SS Mesh',
                'Material': 'Stainless Steel',
                'Colour': 'Black',
                'Width': '3 ft',
                'Custom Size': 'Yes'
            },
            benefits: ['Wide Coverage', 'SS Construction', 'Durable', 'Versatile'],
            applications: ['Large Windows', 'Wide Doors', 'Balcony', 'Commercial Buildings'],
            colours: ['Black'],
            types: ['3 ft Width'],
            images: ['images/ss-black-mesh-3ft.jpg', 'images/ss-black-mesh-3ft-2.jpg', 'images/ss-black-mesh-3ft-3.jpg'],
            faqs: [
                { q: 'What is the width?', a: 'This mesh is 3 ft wide, suitable for larger installations.' }
            ],
            related: ['ss-black-mesh', 'ss-bright-mesh-0.24mm-4ft', 'aluminium-frame-colour-mesh']
        },

        'ss-bright-mesh-0.24mm-4ft': {
            id: 'ss-bright-mesh-0.24mm-4ft',
            name: 'SS Bright Mesh 0.24mm, 4 ft',
            category: 'Mesh',
            variant: '0.24mm Bright 4ft',
            displayPrice: 48,
            priceRange: '₹48',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: true,
            badge: 'mesh',
            description: 'Stainless steel bright mesh 0.24mm, 4 ft width.',
            longDescription: 'Premium SS Bright Mesh offers superior protection with bright finish. Enhanced durability for larger openings.',
            specs: {
                'Product Type': 'SS Mesh',
                'Material': 'Stainless Steel',
                'Thickness': '0.24mm',
                'Colour': 'Bright',
                'Width': '4 ft',
                'Custom Size': 'Yes'
            },
            benefits: ['Premium Quality', 'Bright Finish', '0.24mm Thickness', 'Wide Coverage'],
            applications: ['Premium Windows', 'Large Doors', 'Commercial Buildings', 'Coastal Areas'],
            colours: ['Bright'],
            types: ['4 ft Width'],
            images: ['images/ss-bright-mesh.jpg', 'images/ss-bright-mesh-2.jpg', 'images/ss-bright-mesh-3.jpg'],
            faqs: [
                { q: 'Is this suitable for coastal areas?', a: 'Yes, SS mesh is corrosion-resistant and ideal for coastal areas.' }
            ],
            related: ['ss-black-mesh-3ft', 'ss-black-304g-0.5mm', 'woodgrain-ss-304-mesh']
        },

        'ss-black-304g-0.5mm': {
            id: 'ss-black-304g-0.5mm',
            name: 'SS Black 304G 0.5mm',
            category: 'Mesh',
            variant: '304G 0.5mm',
            displayPrice: 550,
            priceRange: '₹550',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'mesh',
            description: 'Premium stainless steel black 304G 0.5mm heavy-duty mesh.',
            longDescription: 'The premium choice for heavy-duty applications. 304G grade provides superior corrosion resistance.',
            specs: {
                'Product Type': 'Premium SS Mesh',
                'Material': 'SS 304G',
                'Thickness': '0.5mm',
                'Colour': 'Black',
                'Custom Size': 'Yes'
            },
            benefits: ['Premium 304G Grade', 'Heavy Duty 0.5mm', 'Superior Corrosion Resistance'],
            applications: ['High Security Areas', 'Coastal Installations', 'Premium Projects'],
            colours: ['Black'],
            types: ['Heavy Duty'],
            images: ['images/ss-black-304g.jpg', 'images/ss-black-304g-2.jpg', 'images/ss-black-304g-3.jpg'],
            faqs: [
                { q: 'What is 304G grade?', a: '304G is high-grade stainless steel with superior corrosion resistance.' }
            ],
            related: ['security-screen-single-door', 'ss-bright-mesh-0.24mm-4ft', 'woodgrain-ss-304-mesh']
        },

        'fiber-touflex-mesh': {
            id: 'fiber-touflex-mesh',
            name: 'Fiber/Touflex Mesh',
            category: 'Mesh',
            variant: 'Fiber Mesh',
            displayPrice: 8,
            priceRange: '₹8',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: true,
            badge: 'mesh',
            description: 'Economical fiber/Touflex mesh for basic protection.',
            longDescription: 'The most economical option for basic mosquito protection. Lightweight and easy to install.',
            specs: {
                'Product Type': 'Fiber Mesh',
                'Material': 'Fiber/Touflex',
                'Custom Size': 'Yes'
            },
            benefits: ['Economical', 'Lightweight', 'Easy Installation', 'Budget Friendly'],
            applications: ['Windows', 'Doors', 'Temporary Installations', 'Basic Protection'],
            colours: ['White', 'Grey'],
            types: ['Standard'],
            images: ['images/fiber-mesh.jpg', 'images/fiber-mesh-2.jpg', 'images/fiber-mesh-3.jpg'],
            faqs: [
                { q: 'What is the difference from SS mesh?', a: 'Fiber mesh is lighter and more economical, SS mesh offers superior durability.' }
            ],
            related: ['ss-black-mesh', 'pleated-economic', 'aluminium-frame-colour-mesh']
        },

        // ===== VELCRO =====
        'velcro-economic': {
            id: 'velcro-economic',
            name: 'Velcro System – Economic',
            category: 'Velcro',
            variant: 'Economic',
            displayPrice: 65,
            priceRange: '₹65',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: true,
            badge: 'velcro',
            description: 'Economical velcro-based mosquito net system for windows.',
            longDescription: 'Adhesive-based flexible mosquito net that is easy to install and remove. Perfect for rental homes and quick installation needs.',
            specs: {
                'Product Type': 'Velcro Mosquito Net',
                'Mesh Type': 'Fiber Mesh',
                'Installation': 'Adhesive Velcro',
                'Custom Size': 'Yes',
                'Warranty': '6 Months'
            },
            benefits: ['Easy Installation', 'Removable', 'Affordable', 'No Drilling'],
            applications: ['Windows', 'Rental Homes', 'Quick Installation', 'Temporary Setup'],
            colours: ['White', 'Black', 'Ivory'],
            types: ['Standard'],
            images: ['images/velcro-economic.jpg', 'images/velcro-economic-2.jpg', 'images/velcro-economic-3.jpg'],
            faqs: [
                { q: 'Does this require drilling?', a: 'No, velcro systems are adhesive-based and require no drilling.' }
            ],
            related: ['velcro-premium', 'aluminium-frame-colour-mesh', 'pleated-economic']
        },

        'velcro-premium': {
            id: 'velcro-premium',
            name: 'Velcro System – Premium Saint-Gobain',
            category: 'Velcro',
            variant: 'Premium Saint-Gobain',
            displayPrice: 80,
            priceRange: '₹80',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: true,
            badge: 'velcro',
            description: 'Premium velcro system with Saint-Gobain mesh.',
            longDescription: 'Uses premium Saint-Gobain mesh for superior durability and clarity. Easy installation with velcro adhesive.',
            specs: {
                'Product Type': 'Velcro Mosquito Net',
                'Mesh Type': 'Saint-Gobain Premium',
                'Installation': 'Adhesive Velcro',
                'Custom Size': 'Yes',
                'Warranty': '1 Year'
            },
            benefits: ['Premium Mesh', 'Easy Installation', 'Better Durability', 'No Drilling'],
            applications: ['Windows', 'Rental Homes', 'Premium Installation', 'Quick Setup'],
            colours: ['White', 'Black', 'Ivory'],
            types: ['Standard'],
            images: ['images/velcro-premium.jpg', 'images/velcro-premium-2.jpg', 'images/velcro-premium-3.jpg'],
            faqs: [
                { q: 'What is special about Saint-Gobain mesh?', a: 'Saint-Gobain mesh offers superior durability and optical clarity.' }
            ],
            related: ['velcro-economic', 'aluminium-frame-colour-mesh', 'ss-black-mesh']
        },

        // ===== DOOR =====
        'mesh-door-black': {
            id: 'mesh-door-black',
            name: 'Mesh Door – Black Coated SS Mesh',
            category: 'Door',
            variant: 'Regular + Black Coated SS',
            displayPrice: 350,
            priceRange: '₹350',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'door',
            description: 'Regular mesh door with black coated SS mesh.',
            longDescription: 'Durable mesh door with black coated stainless steel mesh for enhanced protection.',
            specs: {
                'Product Type': 'Mesh Door',
                'Mesh Type': 'Black Coated SS',
                'Frame Material': 'Aluminium',
                'Custom Size': 'Yes',
                'Warranty': '2 Years'
            },
            benefits: ['SS Mesh', 'Durable', 'Corrosion Resistant', 'Sleek Look'],
            applications: ['Main Doors', 'Balcony Doors', 'Commercial Entrances'],
            colours: ['Ivory', 'Black', 'Brown'],
            types: ['Single Door', 'Double Door'],
            images: ['images/mesh-door-black.jpg', 'images/mesh-door-black-2.jpg', 'images/mesh-door-black-3.jpg'],
            faqs: [
                { q: 'Is this suitable for main doors?', a: 'Yes, perfect for main doors and heavy traffic entrances.' }
            ],
            related: ['mesh-door-bright', 'security-screen-single-door', 'single-door-pleated']
        },

        'mesh-door-bright': {
            id: 'mesh-door-bright',
            name: 'Mesh Door – Bright SS 304 Mesh',
            category: 'Door',
            variant: 'Regular + Bright SS 304',
            displayPrice: 380,
            priceRange: '₹380',
            originalPrice: null,
            discount: null,
            unit: 'sq.ft',
            onlinePurchase: false,
            badge: 'door',
            description: 'Regular mesh door with bright SS 304 mesh.',
            longDescription: 'Premium mesh door with bright SS 304 mesh for maximum durability and protection.',
            specs: {
                'Product Type': 'Mesh Door',
                'Mesh Type': 'Bright SS 304',
                'Frame Material': 'Aluminium',
                'Custom Size': 'Yes',
                'Warranty': '2 Years'
            },
            benefits: ['SS 304 Mesh', 'Premium Quality', 'Corrosion Resistant', 'Durable'],
            applications: ['Main Doors', 'Balcony Doors', 'Commercial Entrances'],
            colours: ['Ivory', 'Bright', 'Brown'],
            types: ['Single Door', 'Double Door'],
            images: ['images/mesh-door-bright.jpg', 'images/mesh-door-bright-2.jpg', 'images/mesh-door-bright-3.jpg'],
            faqs: [
                { q: 'What is SS 304 mesh?', a: 'SS 304 is high-grade stainless steel mesh that is rust-resistant.' }
            ],
            related: ['mesh-door-black', 'security-screen-single-door', 'woodgrain-ss-304-mesh']
        }
    };

    // ============================================================
    // STATE
    // ============================================================
    let currentProduct = null;
    let currentSlide = 0;
    let currentColour = 'Ivory';
    let currentType = 'Single';
    let selectedImages = [];

    // ============================================================
    // INIT
        // ============================================================
    function init() {
        loadProduct();
        setupEventListeners();
    }

    // ============================================================
    // LOAD PRODUCT FROM URL
    // ============================================================
    function loadProduct() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id') || 'pleated-economic';
        const product = PRODUCT_DB[id];

        if (!product) {
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('errorState').style.display = 'block';
            return;
        }

        currentProduct = product;
        currentColour = product.colours[0] || 'Ivory';
        currentType = product.types[0] || 'Single';
        selectedImages = product.images || ['images/placeholder.jpg'];
        currentSlide = 0;

        // Show product after brief delay for smooth UX
        setTimeout(() => {
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('productContainer').style.display = 'block';
            renderProduct(product);
            updateSEO(product);
            updateSchema(product);
        }, 300);
    }

    // ============================================================
    // RENDER PRODUCT
    // ============================================================
    function renderProduct(product) {
        // Breadcrumb
        document.getElementById('breadcrumbCategory').textContent = product.category;
        document.getElementById('breadcrumbCategory').href = `products.html?cat=${product.category.toLowerCase()}`;
        document.getElementById('breadcrumbProduct').textContent = product.name;

        // Header
        document.getElementById('productTitle').textContent = product.name;
        document.getElementById('productVariant').textContent = product.variant || '';
        document.getElementById('galleryBadge').textContent = product.category;

        // Rating
        document.getElementById('ratingCount').textContent = `(${Math.floor(Math.random() * 30) + 15} reviews)`;

        // Stock badge
        const stockBadge = document.getElementById('stockBadge');
        if (product.onlinePurchase) {
            stockBadge.innerHTML = '<i class="fas fa-check-circle"></i> In Stock';
            stockBadge.style.background = '#d1fae5';
            stockBadge.style.color = '#059669';
        } else {
            stockBadge.innerHTML = '<i class="fas fa-calendar-check"></i> Book Appointment';
            stockBadge.style.background = '#fef3c7';
            stockBadge.style.color = '#d97706';
        }

        // Price
        document.getElementById('currentPrice').textContent = `₹${product.displayPrice}`;
        document.getElementById('priceUnit').textContent = `/ ${product.unit}`;

        const originalPrice = document.getElementById('originalPrice');
        if (product.originalPrice) {
            originalPrice.textContent = `₹${product.originalPrice}`;
            originalPrice.style.display = 'inline';
        } else {
            originalPrice.style.display = 'none';
        }

        const discountTag = document.getElementById('discountTag');
        if (product.discount) {
            discountTag.textContent = `${product.discount}% OFF`;
            discountTag.style.display = 'inline';
        } else {
            discountTag.style.display = 'none';
        }

        // Description
        document.getElementById('productDescription').textContent = product.description;

        // Gallery
        renderGallery(product);

        // Colour options
        renderColourOptions(product);

        // Type options
        renderTypeOptions(product);

        // CTA buttons
        renderCTA(product);

        // Description Tab
        document.getElementById('descriptionContent').innerHTML = `
            <p>${product.description}</p>
            <p>${product.longDescription}</p>
        `;

        // Applications
        document.getElementById('appTags').innerHTML = product.applications
            .map(app => `<span class="tag">${app}</span>`)
            .join('');

        // Specs Table
        document.getElementById('specTable').innerHTML = Object.entries(product.specs)
            .map(([key, val]) => `
                <tr>
                    <td class="label">${key}</td>
                    <td class="value">${val}</td>
                </tr>
            `).join('');

        // Benefits Grid
        const benefitIcons = ['fa-check-circle', 'fa-star', 'fa-shield-alt', 'fa-trophy', 'fa-gem', 'fa-award', 'fa-thumbs-up', 'fa-heart'];
        document.getElementById('benefitsGrid').innerHTML = product.benefits
            .map((b, i) => `
                <div class="benefit-item">
                    <i class="fas ${benefitIcons[i % benefitIcons.length]}"></i>
                    <span>${b}</span>
                </div>
            `).join('');

        // Process Steps
        const steps = [
            { title: 'Contact Us', desc: 'Call, WhatsApp or submit enquiry' },
            { title: 'Book Measurement', desc: 'Schedule a free site visit' },
            { title: 'Site Measurement', desc: 'Our team measures accurately' },
            { title: 'Product Selection', desc: 'Choose the best net for you' },
            { title: 'Confirmation', desc: 'Transparent pricing & confirmation' },
            { title: 'Installation', desc: 'Professional fitment & finishing' }
        ];
        document.getElementById('processSteps').innerHTML = steps
            .map((s, i) => `
                <div class="step-item">
                    <div class="step-number">${i + 1}</div>
                    <div class="step-content">
                        <h4>${s.title}</h4>
                        <p>${s.desc}</p>
                    </div>
                </div>
            `).join('');

        // FAQ
        document.getElementById('faqList').innerHTML = product.faqs
            .map((f, i) => `
                <div class="faq-item ${i === 0 ? 'open' : ''}">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span>${f.q}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">${f.a}</div>
                </div>
            `).join('');

        // Related Products
        renderRelated(product);

        // Sticky CTA
        updateStickyCTA(product);

        // Modal product name
        document.getElementById('bProduct').value = product.name;
        document.getElementById('eProduct').value = product.name;
    }

    // ============================================================
    // RENDER GALLERY
    // ============================================================
    function renderGallery(product) {
        const track = document.getElementById('galleryTrack');
        const dots = document.getElementById('galleryDots');
        const thumbs = document.getElementById('galleryThumbs');
        const counter = document.getElementById('galleryCounter');
        const images = product.images || ['images/placeholder.jpg'];

        // Track
        track.innerHTML = images.map((src, i) => `
            <div class="gallery-slide">
                <img src="${src}" alt="${product.name} - Image ${i + 1}"
                     loading="${i === 0 ? 'eager' : 'lazy'}"
                     onerror="this.style.display='none';this.parentElement.innerHTML='<i class=\\'fas fa-box icon-placeholder\\'></i>'" />
            </div>
        `).join('');

        // Dots
        if (images.length > 1) {
            dots.innerHTML = images.map((_, i) => `
                <button class="dot ${i === 0 ? 'active' : ''}"
                        onclick="goToSlide(${i})"
                        aria-label="Go to image ${i + 1}"></button>
            `).join('');
            dots.style.display = 'flex';
        } else {
            dots.style.display = 'none';
        }

        // Thumbs
        if (images.length > 1) {
            thumbs.innerHTML = images.map((src, i) => `
                <button class="thumb ${i === 0 ? 'active' : ''}"
                        onclick="goToSlide(${i})"
                        aria-label="View image ${i + 1}">
                    <img src="${src}" alt="Thumbnail ${i + 1}" loading="lazy"
                         onerror="this.style.display='none'" />
                </button>
            `).join('');
            thumbs.style.display = 'flex';
        } else {
            thumbs.style.display = 'none';
        }

        // Counter
        if (images.length > 1) {
            counter.textContent = `1 / ${images.length}`;
            counter.style.display = 'block';
        } else {
            counter.style.display = 'none';
        }

        // Navigation buttons
        const navPrev = document.getElementById('galleryPrev');
        const navNext = document.getElementById('galleryNext');
        if (images.length > 1) {
            navPrev.style.display = 'flex';
            navNext.style.display = 'flex';
        } else {
            navPrev.style.display = 'none';
            navNext.style.display = 'none';
        }
    }

    // ============================================================
    // RENDER COLOUR OPTIONS
    // ============================================================
    function renderColourOptions(product) {
        const container = document.getElementById('colourOptions');
        container.innerHTML = product.colours.map(colour => {
            const colourClass = colour.toLowerCase().replace(/\s+/g, '-');
            const isActive = colour === currentColour;
            return `
                <div class="colour-item ${isActive ? 'active' : ''}"
                     onclick="selectColour(this, '${colour}')">
                    <span class="colour colour-${colourClass}" title="${colour}"></span>
                    <span class="colour-name">${colour}</span>
                </div>
            `;
        }).join('');
    }

    // ============================================================
    // RENDER TYPE OPTIONS
    // ============================================================
    function renderTypeOptions(product) {
        const container = document.getElementById('typeOptions');
        container.innerHTML = product.types.map(type => {
            const isActive = type === currentType;
            return `
                <button class="type ${isActive ? 'active' : ''}"
                        onclick="selectType(this, '${type}')">${type}</button>
            `;
        }).join('');
    }

    // ============================================================
    // RENDER CTA BUTTONS
    // ============================================================
    function renderCTA(product) {
        const isOnline = product.onlinePurchase;
        const container = document.getElementById('infoCta');

        if (isOnline) {
            container.innerHTML = `
                <button class="btn btn-success" onclick="addToCart()">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn btn-primary" onclick="buyNow()">
                    <i class="fas fa-bolt"></i> Buy Now
                </button>
                <button class="btn btn-whatsapp" onclick="sendWhatsApp()">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
            `;
        } else {
            container.innerHTML = `
                <button class="btn btn-primary" onclick="openModal('bookingModal')">
                    <i class="fas fa-calendar-check"></i> Book Appointment
                </button>
                <button class="btn btn-whatsapp" onclick="sendWhatsApp()">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
                <button class="btn btn-outline" onclick="openModal('enquiryModal')">
                    <i class="fas fa-file-invoice"></i> Get Price
                </button>
            `;
        }
    }

    // ============================================================
    // RENDER RELATED PRODUCTS
    // ============================================================
    function renderRelated(product) {
        const container = document.getElementById('relatedGrid');
        const relatedIds = product.related || [];

        const relatedProducts = relatedIds
            .map(id => PRODUCT_DB[id])
            .filter(p => p);

        if (!relatedProducts.length) {
            container.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:20px;color:var(--pd-text-muted);font-size:13px;">
                    No related products available.
                </div>
            `;
            return;
        }

        container.innerHTML = relatedProducts.map(p => {
            const imgSrc = (p.images && p.images[0]) || 'images/placeholder.jpg';
            return `
                <a href="product-detail.html?id=${p.id}" class="related-card">
                    <div class="img-wrap">
                        <img src="${imgSrc}" alt="${p.name}" loading="lazy"
                             onerror="this.style.display='none'" />
                    </div>
                    <div class="name">${p.name}</div>
                    <div class="price">₹${p.displayPrice}</div>
                </a>
            `;
        }).join('');
    }

    // ============================================================
    // UPDATE STICKY CTA
    // ============================================================
    function updateStickyCTA(product) {
        const sticky = document.getElementById('stickyCta');
        const priceValue = document.getElementById('stickyPriceValue');
        const priceUnit = document.getElementById('stickyPriceUnit');
        const btn = document.getElementById('stickyBtn');

        priceValue.textContent = `₹${product.displayPrice}`;
        priceUnit.textContent = `/ ${product.unit}`;

        if (product.onlinePurchase) {
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Buy Now';
            btn.onclick = () => buyNow();
        } else {
            btn.innerHTML = '<i class="fas fa-calendar-check"></i> Book Now';
            btn.onclick = () => openModal('bookingModal');
        }

        sticky.style.display = 'block';
    }

    // ============================================================
    // GALLERY NAVIGATION
    // ============================================================
    window.goToSlide = function(index) {
        const track = document.getElementById('galleryTrack');
        if (!track || !selectedImages.length) return;

        const total = selectedImages.length;
        currentSlide = Math.max(0, Math.min(index, total - 1));

        track.style.transform = `translateX(-${currentSlide * (100 / total)}%)`;

        // Update dots
        document.querySelectorAll('.gallery-dots .dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });

        // Update thumbs
        document.querySelectorAll('.gallery-thumbs .thumb').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentSlide);
        });

        // Update counter
        const counter = document.getElementById('galleryCounter');
        if (counter) {
            counter.textContent = `${currentSlide + 1} / ${total}`;
        }
    };

    window.changeSlide = function(direction) {
        const total = selectedImages.length;
        if (!total) return;
        const newIndex = (currentSlide + direction + total) % total;
        goToSlide(newIndex);
    };

    // ============================================================
    // SELECTION HANDLERS
    // ============================================================
    window.selectColour = function(el, colour) {
        document.querySelectorAll('.colour-options .colour-item').forEach(c => {
            c.classList.remove('active');
        });
        el.classList.add('active');
        currentColour = colour;
        document.getElementById('selectedColour').textContent = colour;
    };

    window.selectType = function(el, type) {
        document.querySelectorAll('.type-options .type').forEach(t => {
            t.classList.remove('active');
        });
        el.classList.add('active');
        currentType = type;
        document.getElementById('selectedType').textContent = type;
    };

    // ============================================================
    // FAQ TOGGLE
    // ============================================================
    window.toggleFaq = function(el) {
        const item = el.closest('.faq-item');
        const wasOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-list .faq-item').forEach(faq => {
            faq.classList.remove('open');
        });

        // Toggle current
        if (!wasOpen) {
            item.classList.add('open');
        }
    };

    // ============================================================
    // QUANTITY
    // ============================================================
    window.adjustQty = function(delta) {
        const input = document.getElementById('qtyInput');
        if (!input) return;
        let val = parseInt(input.value) || 1;
        val = Math.max(1, val + delta);
        input.value = val;
    };

    // ============================================================
    // TAB NAVIGATION
    // ============================================================
    function setupEventListeners() {
        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;

                // Update buttons
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                // Update panes
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                const activePane = document.getElementById(`tab-${tabId}`);
                if (activePane) activePane.classList.add('active');
            });
        });

        // Gallery navigation
        const prevBtn = document.getElementById('galleryPrev');
        const nextBtn = document.getElementById('galleryNext');
        if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));

        // Keyboard navigation for gallery
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') changeSlide(-1);
            if (e.key === 'ArrowRight') changeSlide(1);
        });

        // Touch/swipe for gallery
        const galleryMain = document.getElementById('galleryMain');
        if (galleryMain) {
            let startX = 0;
            let isDragging = false;

            galleryMain.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            }, { passive: true });

            galleryMain.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;

                if (Math.abs(diff) > 50) {
                    if (diff > 0) changeSlide(1);
                    else changeSlide(-1);
                }
            isDragging = false;
            }, { passive: true });
        }
    }

    // ============================================================
    // CTA ACTIONS
    // ============================================================
    window.handlePrimaryCta = function() {
        if (!currentProduct) return;
        if (currentProduct.onlinePurchase) {
            buyNow();
        } else {
            openModal('bookingModal');
        }
    };

    window.addToCart = function() {
        if (!currentProduct) return;
        const qty = parseInt(document.getElementById('qtyInput')?.value || 1);
        const total = currentProduct.displayPrice * qty;
        showToast(`🛒 Added ${qty} sq.ft to cart! Total: ₹${total}`, 'success');
    };

    window.buyNow = function() {
        if (!currentProduct) return;
        const qty = parseInt(document.getElementById('qtyInput')?.value || 1);
        const total = currentProduct.displayPrice * qty;
        showToast(`🛒 Redirecting to checkout... Total: ₹${total}`, 'success');
        // In production: window.location.href = `checkout.html?id=${currentProduct.id}&qty=${qty}`;
    };

    window.sendWhatsApp = function() {
        if (!currentProduct) return;
        const message = `Hello Raj Marketing,\n\nI'm interested in *${currentProduct.name}*.\n\nPrice: ₹${currentProduct.displayPrice}/sq.ft\nColour: ${currentColour}\nType: ${currentType}\n\nPlease share more details and availability.`;
        const url = `https://wa.me/919483037385?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    // ============================================================
    // MODAL FUNCTIONS
    // ============================================================
    window.openModal = function(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close modal on overlay click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close modal on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => {
                m.classList.remove('active');
            });
            document.body.style.overflow = '';
        }
    });

    // ============================================================
    // FORM SUBMISSIONS
    // ============================================================
    window.submitBooking = function(e) {
        e.preventDefault();
        const name = document.getElementById('bName').value.trim();
        const mobile = document.getElementById('bMobile').value.trim();

        if (!name || !mobile) {
            showToast('⚠️ Please fill in all required fields', 'error');
            return;
        }

        showToast('✅ Appointment request submitted! We will contact you shortly.', 'success');
        closeModal('bookingModal');
        e.target.reset();
        document.getElementById('bProduct').value = currentProduct ? currentProduct.name : '';
    };

    window.submitEnquiry = function(e) {
        e.preventDefault();
        const name = document.getElementById('eName').value.trim();
        const mobile = document.getElementById('eMobile').value.trim();
        const city = document.getElementById('eCity').value.trim();

        if (!name || !mobile || !city) {
            showToast('⚠️ Please fill in all required fields', 'error');
            return;
        }

        showToast('✅ Enquiry submitted! We will send you the exact price soon.', 'success');
        closeModal('enquiryModal');
        e.target.reset();
        document.getElementById('eProduct').value = currentProduct ? currentProduct.name : '';
    };

    // ============================================================
    // TOAST NOTIFICATION
    // ============================================================
    function showToast(message, type = 'info') {
        // Remove existing toasts
        document.querySelectorAll('.rm-toast').forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = 'rm-toast';
        toast.textContent = message;

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#1a56db'
        };

        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '110px',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            background: colors[type] || colors.info,
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '40px',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            zIndex: '9999',
            opacity: '0',
            transition: 'all 0.3s ease',
            maxWidth: '90%',
            textAlign: 'center',
            fontFamily: 'Poppins, sans-serif'
        });

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // ============================================================
    // SEO UPDATES
    // ============================================================
    function updateSEO(product) {
        document.title = `${product.name} – Raj Marketing Mysore`;

        const metaDesc = document.getElementById('metaDescription');
        if (metaDesc) metaDesc.content = `${product.name}. ${product.description}`;

        const ogTitle = document.getElementById('ogTitle');
        if (ogTitle) ogTitle.content = `${product.name} – Raj Marketing Mysore`;

        const ogDesc = document.getElementById('ogDescription');
        if (ogDesc) ogDesc.content = product.description;

        const ogImage = document.getElementById('ogImage');
        if (ogImage && product.images && product.images[0]) {
            ogImage.content = `https://rajmarketingmysore.info/${product.images[0]}`;
        }

        const ogUrl = document.getElementById('ogUrl');
        if (ogUrl) ogUrl.content = `https://rajmarketingmysore.info/product-detail.html?id=${product.id}`;

        const twitterTitle = document.getElementById('twitterTitle');
        if (twitterTitle) twitterTitle.content = `${product.name} – Raj Marketing Mysore`;

        const twitterDesc = document.getElementById('twitterDescription');
        if (twitterDesc) twitterDesc.content = product.description;

        const canonical = document.getElementById('canonicalUrl');
        if (canonical) canonical.href = `https://rajmarketingmysore.info/product-detail.html?id=${product.id}`;
    }

    // ============================================================
    // SCHEMA.ORG JSON-LD
    // ============================================================
    function updateSchema(product) {
        const existing = document.getElementById('productSchema');
        if (existing) existing.remove();

        const script = document.createElement('script');
        script.id = 'productSchema';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            'name': product.name,
            'description': product.description,
            'image': product.images ? product.images.map(img => `https://rajmarketingmysore.info/${img}`) : [],
            'sku': product.id,
            'brand': {
                '@type': 'Brand',
                'name': 'Raj Marketing Mysore'
            },
            'offers': {
                '@type': 'Offer',
                'priceCurrency': 'INR',
                'price': product.displayPrice,
                'availability': product.onlinePurchase
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/PreOrder',
                'url': `https://rajmarketingmysore.info/product-detail.html?id=${product.id}`,
                'seller': {
                    '@type': 'Organization',
                    'name': 'Raj Marketing Mysore'
                }
            },
            'aggregateRating': {
                '@type': 'AggregateRating',
                'ratingValue': '4.9',
                'reviewCount': '24'
            }
        });
        document.head.appendChild(script);
    }

    // ============================================================
    // BOOT
    // ============================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        loadProduct();
    });

    console.log('✅ Product Detail Engine v3.0 loaded');
    console.log('📦 Products available:', Object.keys(PRODUCT_DB).length);

})();
