document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // ==               CORE LOGIC & SHARED VARIABLES               ==
    // =================================================================

    let cart = JSON.parse(localStorage.getItem('skincareLabCart')) || [];
    let shippingAddress = JSON.parse(localStorage.getItem('skincareShippingAddress')) || {};
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const saveCart = () => localStorage.setItem('skincareLabCart', JSON.stringify(cart));
    const saveShippingAddress = () => localStorage.setItem('skincareShippingAddress', JSON.stringify(shippingAddress));
    
    // =================================================================
    // ==         UNABRIDGED, COMPLETE MASTER PRODUCT DATABASE        ==
    // =================================================================
    const allProducts = [
        // --- Cleansers ---
        { id: 1, name: 'CeraVe Acne Foaming Cream Cleanser', price: 15.99, image: 'https://i5.walmartimages.com/seo/CeraVe-Acne-Foaming-Cream-Facial-Cleanser-Benzoyl-Peroxide-Hyaluronic-Acid-and-Niacinamide-5-fl-oz_3490e5a8-2329-4b04-a887-91a54727409c.d5f57348986c528c11e4003058b5b7c7.jpeg', category: 'cleanser acne', rating: 4.6, reviews: 1258, tag: 'Best Seller', description: 'A gentle yet effective acne-fighting cleanser with 4% Benzoyl Peroxide, Hyaluronic Acid, and Niacinamide to help clear acne and prevent new breakouts without drying the skin.', ingredients: 'Active: Benzoyl Peroxide 4%. Inactive: Water, Glycerin, Propylene Glycol, Cocamidopropyl Hydroxysultaine, Sodium C14-16 Olefin Sulfonate, Xanthan Gum, Potassium Hydroxide, Ceramide NP, Ceramide AP, Ceramide EOP, Carbomer, Niacinamide, Glycolic Acid, Sodium Chloride, Sodium Citrate, Sodium Hyaluronate.' },
        { id: 2, name: 'La Roche-Posay Effaclar Medicated Cleanser', price: 16.99, image: 'https://www.laroche-posay.us/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-lrp-us-master-catalog/default/dw83569762/2023-Approved-Images/Full-Product/Effaclar-Medicated-Gel-Cleanser/LRP_E-COMM_Packshots_EFFACLAR_MEDICATED_GEL_CLEANSER_3606000570146_1000x1000_1.jpg?sw=1200&sh=1200&sm=fit&q=70', category: 'cleanser acne', rating: 4.7, reviews: 3450, tag: '', description: 'Formulated with 2% Salicylic Acid and Lipo-Hydroxy Acid, this cleanser targets excess oil and helps clear acne breakouts.', ingredients: 'Active: Salicylic Acid 2%. Inactive: Water, Sodium Laureth Sulfate, Decyl Glucoside, Glycerin, Sodium Chloride, Coco-Betaine, PEG-150 Pentaerythrityl Tetrastearate, PEG-6 Caprylic/Capric Glycerides, Zinc Gluconate, Sodium Hydroxide, Capryloyl Salicylic Acid, Tetrasodium EDTA, Citric Acid, Menthol, Polyquaternium-47.' },
        { id: 3, name: 'Youth to the People Superfood Cleanser', price: 39.00, image: 'https://www.sephora.com/productimages/product/p411387-av-01-Lhero.jpg', category: 'cleanser aging', rating: 4.5, reviews: 8754, tag: 'Clean Beauty', description: 'A daily green juice cleanse for your face with a proprietary superfood-extract blend of kale, spinach, and green tea. Effective for removing makeup and preventing buildup in pores.', ingredients: 'Water, Sodium Cocoyl Glutamate, Cocamidopropyl Betaine, Panthenol, Glycerin, Aloe Barbadensis Leaf Juice, Brassica Oleracea Acephala (Kale) Leaf Extract, Spinacia Oleracea (Spinach) Leaf Extract, Camellia Sinensis (Green Tea) Leaf Extract.' },
        { id: 4, name: "Kiehl's Ultra Facial Cleanser", price: 25.00, image: 'https://www.kiehls.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-kiehls-master-catalog/default/dwb535805c/2022-Approved-Images/Full-Product/Ultra-Facial-Cleanser/kiehls-facial-cleansers-ultra-facial-cleanser-3605975037494-150ml.jpg?sw=1200&sh=1200&sm=fit&q=70', category: 'cleanser dryness', rating: 4.7, reviews: 4102, tag: '', description: 'A mild formula that cleanses without over-drying or stripping skin of its natural oils. Formulated with Squalane, Apricot Kernel Oil, and Avocado Oil, this gentle face wash is suitable for all skin types.', ingredients: 'Aqua/Water, Sodium Laureth Sulfate, Decyl Glucoside, Glycerin, Cocamidopropyl Betaine, Propylene Glycol, PEG-150 Distearate, Sodium Chloride, Squalane, Prunus Armeniaca Kernel Oil/Apricot Kernel Oil.' },
        { id: 5, name: 'Vanicream Gentle Facial Cleanser', price: 9.49, image: 'https://i5.walmartimages.com/seo/Vanicream-Gentle-Facial-Cleanser-for-Sensitive-Skin-8-fl-oz_4a11f99c-d40b-4654-86a0-8f9f21f1e98d.e5647614f494f1c1f44d8b9d3b14f49f.jpeg', category: 'cleanser dryness redness', rating: 4.8, reviews: 1987, tag: 'Derm-Recommended', description: 'A gentle and effective cleanser that helps remove dirt, oil and makeup without drying the skin. Leaves skin feeling clean and soft. Ideal for dry skin associated with eczema, psoriasis, ichthyosis, and winter itch.', ingredients: 'Purified Water, Glycerin, Coco-Glucoside, Sodium Cocoyl Glycinate, Acrylates Copolymer, Caprylyl Glycol, Mica, Sodium Chloride, 1,2-Hexanediol, Titanium Dioxide, Sodium Hydroxide, Disodium EDTA.' },
        
        // --- Serums ---
        { id: 6, name: 'RoC Retinol Correxion Deep Wrinkle Serum', price: 24.97, image: 'https://www.rocskincare.com/cdn/shop/products/retinol-correxion-deep-wrinkle-serum-1.jpg?v=1662058499&width=1200', category: 'serum aging', rating: 4.5, reviews: 18992, tag: 'Best Seller', description: 'A lightweight, silky serum that helps to visibly reduce the appearance of both fine lines and deep wrinkles. Powered by pure RoC Retinol.', ingredients: 'Water, Cyclopentasiloxane, Glycerin, Tetrahydroxypropyl Ethylenediamine, Dimethicone, Butylene Glycol, PPG-2 Myristyl Ether Propionate, Squalane, Glycine Soja (Soybean) Protein, Retinol, Glycolic Acid, Ascorbic Acid, Tocopherol.' },
        { id: 7, name: 'The Ordinary Granactive Retinoid 2% Emulsion', price: 12.20, image: 'https://images.sephora.com/is/image/SEPHORA/1911617?wid=1000', category: 'serum aging', rating: 4.3, reviews: 980, tag: '', description: 'A creamy serum that targets visible signs of aging through a highly-advanced retinoid active, which has been shown to deliver better results against signs of aging than retinol without irritation.', ingredients: 'Aqua (Water), Glycerin, Caprylic/Capric Triglyceride, Ethyl Linoleate, Propanediol, Dimethyl Isosorbide, Cetearyl Isononanoate, Bisabolol, Hydroxypinacolone Retinoate, Retinol, Tasmannia Lanceolata Fruit/Leaf Extract.' },
        { id: 8, name: 'The Ordinary Hyaluronic Acid 2% + B5', price: 9.90, image: 'https://images.sephora.com/is/image/SEPHORA/2031376?wid=1000', category: 'serum dryness', rating: 4.4, reviews: 7890, tag: '', description: 'A hydrating serum with low, medium, and high molecular weight hyaluronic acid, and a HA crosspolymer for multi-depth hydration. Vitamin B5 enhances surface hydration.', ingredients: 'Aqua (Water), Sodium Hyaluronate, Pentylene Glycol, Propanediol, Sodium Hyaluronate Crosspolymer, Panthenol, Ahnfeltia Concinna Extract, Glycerin, Trisodium Ethylenediamine Disuccinate, Citric Acid.' },
        { id: 9, name: 'CeraVe Skin Renewing Vitamin C Serum', price: 22.99, image: 'https://i5.walmartimages.com/seo/CeraVe-Skin-Renewing-Vitamin-C-Serum-with-10-Pure-Vitamin-C-1-fl-oz_492211f4-3074-4b47-b8ab-1025707b46a7.41164106e232810f601b3438a3901b0b.jpeg', category: 'serum aging protection', rating: 4.5, reviews: 15320, tag: 'Top Rated', description: 'With 10% pure vitamin C (L-ascorbic acid), this serum provides antioxidant protection and helps to visibly brighten your complexion and promote a more even skin tone.', ingredients: 'Aqua/Water, Ascorbic Acid, Glycerin, Dimethicone, Cetearyl Ethylhexanoate, Alcohol Denat., Sodium Hydroxide, Ammonium Polyacryloyldimethyl Taurate, Panthenol, Ceramide NP, Ceramide AP, Ceramide EOP.' },
        { id: 10, name: 'Glow Recipe Watermelon Glow Niacinamide Dew Drops', price: 35.00, image: 'https://www.sephora.com/productimages/product/p466122-av-01-Lhero.jpg', category: 'serum dryness pigmentation', rating: 4.6, reviews: 4521, tag: 'Viral Favorite', description: 'A breakthrough, multi-use highlighting serum that hydrates and visibly reduces the look of hyperpigmentation for a dewy, reflective glow—without mica, glitter, or gray cast.', ingredients: 'Aqua/Water, Propanediol, Glycereth-26, Glycerin, Niacinamide, 2,3-Butanediol, 1,2-Hexanediol, Cetyl Ethylhexanoate, Citrullus Lanatus Fruit Extract (Watermelon), Sodium Hyaluronate.' },
        { id: 11, name: 'The INKEY List Niacinamide Oil Control Serum', price: 8.99, image: 'https://us.theinkeylist.com/cdn/shop/products/niacinamide-1_1024x1024.jpg?v=1658422118', category: 'serum acne redness', rating: 4.4, reviews: 1234, tag: '', description: 'A lightweight, power-packed serum containing 10% Niacinamide that can be easily layered into your skincare routine. Helps to reduce excess oil, blemishes, and redness.', ingredients: 'Water (Aqua/Eau), Niacinamide, Glycerin, Propanediol, Butylene Glycol, Squalane, Leuconostoc/Radish Root Ferment Filtrate, Hyaluronic Acid, Phenoxyethanol, Hydroxyethyl Acrylate.' },
        
        // --- Moisturizers ---
        { id: 12, name: "Kiehl's Ultra Facial Cream", price: 38.00, image: 'https://www.kiehls.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-kiehls-master-catalog/default/dw769ca132/2022-Approved-Images/Full-Product/Ultra-Facial-Cream/kiehls-facial-creams-ultra-facial-cream-002-3605970360757-1-7oz.jpg?sw=1200&sh=1200&sm=fit&q=70', category: 'moisturizer dryness', rating: 4.8, reviews: 5230, tag: 'Cult Favorite', description: 'This iconic daily moisturizer provides 24-hour hydration for soft, smooth, healthy-looking skin. Formulated with Glacial Glycoprotein and Squalane.', ingredients: 'Aqua/Water, Glycerin, Cyclohexasiloxane, Squalane, Bis-PEG-18 Methyl Ether Dimethyl Silane, Sucrose Stearate, Stearyl Alcohol, Glacial Glycoprotein, Myristyl Myristate, Prunus Armeniaca Kernel Oil/Apricot Kernel Oil.' },
        { id: 13, name: 'CeraVe Moisturizing Cream', price: 17.78, image: 'https://i5.walmartimages.com/seo/CeraVe-Moisturizing-Cream-Daily-Face-and-Body-Moisturizer-for-Dry-Skin-19-oz_6a3068e1-3316-412e-a2f0-94a3a60a3795.342e5d77e48b5c160b721e7d8961914c.jpeg', category: 'moisturizer dryness', rating: 4.8, reviews: 89102, tag: 'Best Seller', description: 'A rich, non-greasy, fast-absorbing moisturizing cream for normal to dry skin on the face and body. Features MVE Technology for 24-hour hydration and three essential ceramides.', ingredients: 'Aqua/Water, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Cetyl Alcohol, Ceteareth-20, Petrolatum, Potassium Phosphate, Ceramide NP, Ceramide AP, Ceramide EOP, Carbomer, Dimethicone.' },
        { id: 14, name: 'Neutrogena Hydro Boost Water Gel', price: 21.49, image: 'https://i5.walmartimages.com/seo/Neutrogena-Hydro-Boost-Hyaluronic-Acid-Water-Gel-Face-Moisturizer-1-7-oz_09395f2a-7965-442a-974e-ac50f8646b52.50285a867c295b9c3f76859349884a44.jpeg', category: 'moisturizer acne dryness', rating: 4.6, reviews: 75230, tag: '', description: 'Instantly quenches dry skin and boosts hydration. This oil-free, non-comedogenic formula with Hyaluronic Acid absorbs quickly like a gel but has the long-lasting moisturizing power of a cream.', ingredients: 'Water, Dimethicone, Glycerin, Cetearyl Olivate, Polyacrylamide, Sorbitan Olivate, Phenoxyethanol, Dimethicone/Vinyl Dimethicone Crosspolymer, Synthetic Beeswax, C13-14 Isoparaffin, Dimethiconol, Carbomer, Sodium Hyaluronate.' },
        { id: 15, name: 'La Roche-Posay Toleriane Double Repair Moisturizer', price: 22.99, image: 'https://www.laroche-posay.us/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-lrp-us-master-catalog/default/dw388316e6/2023-Approved-Images/Full-Product/Toleriane/Double-Repair-Face-Moisturizer/LRP_E-COMM_Packshots_TOLERIANE_DOUBLE_REPAIR_MOISTURIZER_3337875545792_1000x1000_1.jpg?sw=1200&sh=1200&sm=fit&q=70', category: 'moisturizer dryness redness', rating: 4.7, reviews: 15678, tag: '', description: 'This oil-free face moisturizer helps restore healthy-looking skin and the skin barrier with ingredients like Ceramide-3, Niacinamide, and Glycerin.', ingredients: 'Aqua/Water, Glycerin, Dimethicone, Niacinamide, Zea Mays Starch/Corn Starch, Ceramide NP, Carbomer, Sodium Hydroxide, Caprylyl Glycol, Citric Acid.' },
        { id: 16, name: 'Drunk Elephant Lala Retro Whipped Cream', price: 62.00, image: 'https://www.drunkelephant.com/cdn/shop/products/lala-retro-whipped-cream-1_1200x.jpg?v=1669677274', category: 'moisturizer dryness aging', rating: 4.5, reviews: 3120, tag: '', description: 'A rescue cream infused with six rare African oils and a ceramide complex for intense moisture and replenishing barrier support.', ingredients: 'Water, Glycerin, Caprylic/Capric Triglyceride, Isopropyl Isostearate, Pseudozyma Epicola/Camellia Sinensis Seed Oil/Glucose/Glycine Soja (Soybean) Meal/Malt Extract/Yeast Extract Ferment Filtrate, Sclerocarya Birrea Seed Oil.' },
        
        // --- Sunscreens ---
        { id: 17, name: 'Supergoop! Unseen Sunscreen SPF 40', price: 38.00, image: 'https://images.sephora.com/is/image/SEPHORA/2031509?wid=1000', category: 'sunscreen protection', rating: 4.5, reviews: 4500, tag: 'Top Rated', description: 'A totally invisible, weightless, and scentless sunscreen with SPF 40 that leaves a velvety finish. It also acts as a makeup-gripping primer.', ingredients: 'Active: Avobenzone 3%, Homosalate 8%, Octisalate 5%, Octocrylene 4%. Inactive: Isododecane, Dimethicone Crosspolymer, Dimethicone/Bis-Isobutyl PPG-20 Crosspolymer, Polymethylsilsesquioxane, Isohexadecane.' },
        { id: 18, name: 'EltaMD UV Clear Broad-Spectrum SPF 46', price: 41.00, image: 'https://i5.walmartimages.com/seo/EltaMD-UV-Clear-Tinted-Face-Sunscreen-SPF-46-Sun-Protection-for-Oily-Skin-1-7-oz_b5e5c777-a164-4b55-a0a6-19412f9e42e5.04e262111c1e08929e7424d622f3e82b.jpeg', category: 'sunscreen protection acne redness', rating: 4.7, reviews: 21500, tag: 'Derm-Recommended', description: 'An oil-free sunscreen that helps calm and protect sensitive skin types prone to discoloration and breakouts associated with acne and rosacea. It contains niacinamide, hyaluronic acid and lactic acid.', ingredients: 'Active: Zinc Oxide 9.0%, Octinoxate 7.5%. Inactive: Purified Water, Cyclopentasiloxane, Niacinamide, Octyldodecyl Neopentanoate, Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate Copolymer, Polyisobutene.' },
        { id: 19, name: 'La Roche-Posay Anthelios Melt-in Milk SPF 60', price: 27.99, image: 'https://www.laroche-posay.us/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-lrp-us-master-catalog/default/dw8a67d02e/2023-Approved-Images/Full-Product/Anthelios-Melt-in-Milk-Sunscreen-SPF-60/LRP_E-COMM_Packshots_ANTHELIOS_MELT_IN_MILK_SPF_60_3606000546129_1000x1000_1.jpg?sw=1200&sh=1200&sm=fit&q=70', category: 'sunscreen protection', rating: 4.7, reviews: 11340, tag: '', description: 'A velvety, fast-absorbing sunscreen lotion that leaves skin hydrated and smooth. Formulated with Cell-Ox Shield technology for broad-spectrum UVA/UVB protection.', ingredients: 'Active: Avobenzone 3%, Homosalate 10%, Octisalate 5%, Octocrylene 7%. Inactive: Water, Styrene/Acrylates Copolymer, Dimethicone, Polymethylsilsesquioxane, Butyloctyl Salicylate, Glycerin.' },
        { id: 20, name: 'Biore UV Aqua Rich Watery Essence SPF50+', price: 14.50, image: 'https://m.media-amazon.com/images/I/51BS8g1eTmL.jpg', category: 'sunscreen protection', rating: 4.8, reviews: 35000, tag: 'Cult Favorite', description: 'A watery essence with a transparent feel that blends effortlessly on the skin. Features a micro defense formula with hyaluronic acid & royal jelly extract for a light, hydrating feel.', ingredients: 'Water, Ethanol, Ethylhexyl Methoxycinnamate, Ethylhexyl Triazone, Isopropyl Palmitate, (Lauryl Methacrylate/Sodium Methacrylate) Crosspolymer, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Hydrogenated Polyisobutene, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine.' },
        { id: 21, name: 'Black Girl Sunscreen Broad Spectrum SPF 30', price: 15.99, image: 'https://i5.walmartimages.com/seo/Black-Girl-Sunscreen-Broad-Spectrum-SPF-30-3-fl-oz_b01639d6-11f8-450b-8d82-895180f68481.045f2849b2575f0f3535948f95c02421.jpeg', category: 'sunscreen protection', rating: 4.7, reviews: 8900, tag: '', description: 'Specially designed for women of color, this sunscreen dries completely clear so it doesn’t leave a white-cast. It’s filled with moisturizing ingredients like jojoba and avocado.', ingredients: 'Active: Avobenzone 3%, Homosalate 10%, Octisalate 5%, Octocrylene 2.75%. Inactive: Acrylates, Aloe Barbadensis Leaf (Aloe Vera) Juice, Butyrospermum Parkii (Shea) Butter, Daucus Carota Sativa (Carrot) Seed Oil, Helianthus Annuus (Sunflower) Seed Oil.' }
    ];

    // --- UNIVERSAL ADD TO CART FUNCTIONALITY ---
    const addToCart = (productName, productPrice) => {
        const existingProduct = cart.find(item => item.name === productName);
        if (existingProduct) {
            if (existingProduct.quantity < 10) {
                existingProduct.quantity++;
            } else {
                alert("Maximum quantity of 10 reached.");
                return;
            }
        } else {
            cart.push({ name: productName, price: parseFloat(productPrice), quantity: 1 });
        }
        saveCart();
        updateCartIcon();
        showSuccessAlert(`${productName} has been added to cart!`);
    };

    document.body.addEventListener('click', (e) => {
        const addToCartButton = e.target.closest('.add-to-cart');
        if (addToCartButton) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productName = productCard.dataset.name;
                const productPrice = productCard.dataset.price;
                addToCart(productName, productPrice);
            }
        }
    });
    // =================================================================
    // ==                   PAGE-SPECIFIC SCRIPTS                     ==
    // =================================================================

    // --- SCRIPT FOR SHOP PAGE (`shop.html`) ---
    if (currentPage === 'shop.html') {
        const filterControls = document.getElementById('filter-controls');
        const productGrid = document.getElementById('product-grid');
        
        // This logic will work on the hardcoded products in your HTML
        if (filterControls && productGrid) {
            const productItems = productGrid.querySelectorAll('.product-grid-item');
            let activeFilters = { type: 'all', concern: 'all' };

            filterControls.addEventListener('click', (e) => {
                const clickedButton = e.target.closest('.filter-btn');
                if (!clickedButton) return;

                const filterValue = clickedButton.dataset.filter;

                // Update the active filter for the correct group (type or concern)
                if (clickedButton.classList.contains('type-filter')) {
                    activeFilters.type = filterValue;
                    document.querySelectorAll('.type-filter').forEach(btn => btn.classList.remove('active'));
                } else if (clickedButton.classList.contains('concern-filter')) {
                    activeFilters.concern = filterValue;
                    document.querySelectorAll('.concern-filter').forEach(btn => btn.classList.remove('active'));
                }
                
                // Set the clicked button to active
                clickedButton.classList.add('active');
                
                // Loop through all product items and show/hide them based on both active filters
                productItems.forEach(item => {
                    const itemCategories = item.dataset.category.split(' ');
                    
                    const typeMatch = activeFilters.type === 'all' || itemCategories.includes(activeFilters.type);
                    const concernMatch = activeFilters.concern === 'all' || itemCategories.includes(activeFilters.concern);
                    
                    if (typeMatch && concernMatch) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
    }

    // --- SCRIPT FOR CART PAGE (`cart.html`) ---
    if (currentPage === 'cart.html') {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartSubtotalElement = document.getElementById('cart-subtotal');
        const clearCartBtn = document.getElementById('clear-cart-btn');
        const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout');

        const updateCartPage = () => {
            const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `<div class="p-6 text-center"><p class="text-gray-600 text-lg">Your cart is currently empty.</p><a href="shop.html" class="mt-4 inline-block bg-rose-100 text-[#8A307F] py-2 px-5 rounded-lg hover:bg-rose-200 font-semibold">Continue Shopping</a></div>`;
                if(proceedToCheckoutBtn) proceedToCheckoutBtn.classList.add('hidden');
            } else {
                if(proceedToCheckoutBtn) proceedToCheckoutBtn.classList.remove('hidden');
                cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item flex items-center justify-between p-4 border-b border-gray-200">
                        <div class="flex items-center gap-4 w-2/5">
                            <img src="https://via.placeholder.com/80" alt="${item.name}" class="w-20 h-20 object-cover rounded-md">
                            <div>
                                <p class="font-semibold text-[#8A307F]">${item.name}</p>
                                <p class="text-sm text-gray-500">$${item.price.toFixed(2)} each</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <button class="qty-btn bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center transition" data-name="${item.name}" data-action="minus">-</button>
                            <span class="font-medium text-lg">${item.quantity}</span>
                            <button class="qty-btn bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center transition" data-name="${item.name}" data-action="plus">+</button>
                        </div>
                        <div class="text-right w-1/5">
                            <p class="font-semibold text-gray-800">$${(item.price * item.quantity).toFixed(2)}</p>
                            <button class="delete-item text-xs text-red-500 hover:underline" data-name="${item.name}">Remove</button>
                        </div>
                    </div>
                `).join('');
            }
            if(cartSubtotalElement) cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            updateCartIcon(); // Also update the icon when the cart page changes
        };

        if (cartItemsContainer) {
            cartItemsContainer.addEventListener('click', e => {
                const target = e.target;
                const name = target.dataset.name;
                if (!name) return;
                const item = cart.find(p => p.name === name);
                if (!item) return;

                const action = target.dataset.action || (target.classList.contains('delete-item') ? 'delete' : '');
                
                if (action === 'plus' && item.quantity < 10) item.quantity++;
                if (action === 'minus' && item.quantity > 1) item.quantity--;
                if (action === 'delete') { cart = cart.filter(p => p.name !== name); }
                
                saveCart();
                updateCartPage();
            });
        }
        
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => { if (cart.length > 0 && confirm('Are you sure you want to clear your entire cart?')) { cart = []; saveCart(); updateCartPage(); } });
        }
        
        updateCartPage();
    }
    
    // --- SCRIPT FOR PRODUCT DETAIL PAGE (`product.html`) ---
    if (currentPage === 'product.html') {
        const container = document.getElementById('product-detail-container');
        const loadingEl = document.getElementById('product-loading');

        if (container) {
            const params = new URLSearchParams(window.location.search);
            const productId = params.get('id');
            const product = allProducts.find(p => p.id == productId);

            if (product) {
                document.title = `${product.name} - SkincareLab`;
                if(loadingEl) loadingEl.style.display = 'none';
                
                container.innerHTML = `
                    <div class="product-card" data-name="${product.name}" data-price="${product.price}">
                        <div class="grid md:grid-cols-2 gap-12 items-start">
                            <div class="bg-white p-8 rounded-lg shadow-md sticky top-28">
                                <img src="${product.image}" alt="${product.name}" class="w-full h-96 object-contain">
                            </div>
                            <div>
                                <h1 class="text-4xl font-bold text-slate-900">${product.name}</h1>
                                <div class="flex items-center gap-4 mt-4">
                                    <div class="flex items-center gap-1 text-amber-500" title="${product.rating} out of 5 stars">★★★★★</div>
                                    <span class="text-slate-500">${product.rating} (${product.reviews.toLocaleString()} reviews)</span>
                                </div>
                                <p class="text-3xl font-bold text-[#8A307F] my-6">$${product.price.toFixed(2)}</p>
                                <p class="text-slate-600 leading-relaxed mb-8">${product.description}</p>
                                <button class="add-to-cart w-full bg-[#8A307F] text-white py-3 px-6 rounded-lg hover:bg-[#6b2562] transition font-bold text-lg">Add to Cart</button>
                                <div class="mt-10">
                                    <h3 class="font-bold text-lg text-slate-800 mb-2">Key Ingredients:</h3>
                                    <p class="text-sm text-slate-500">${product.ingredients}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
            } else if (loadingEl) {
                loadingEl.innerHTML = '<h1 class="text-2xl font-bold text-center">Product Not Found</h1><a href="shop.html" class="block text-center mt-4 text-[#8A307F] hover:underline">Return to Shop</a>';
            }
        }
    }

    // =================================================================
    // ==                 UTILITY & GENERAL FUNCTIONS                 ==
    // =================================================================

    const cartIconCount = document.getElementById('cart-item-count');

    function updateCartIcon() {
        if (!cartIconCount) return;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartIconCount.textContent = totalItems;
            cartIconCount.classList.remove('hidden');
        } else {
            cartIconCount.classList.add('hidden');
        }
    }

    function showSuccessAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'fixed top-24 left-1/2 -translate-x-1/2 bg-[#8A307F] text-white text-center py-2 px-6 rounded-lg shadow-lg z-50';
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.style.transition = 'opacity 0.5s ease';
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 500);
        }, 2000);
    }
    
    // Run once on every page load to set the initial cart count
    updateCartIcon();

    // Active Navbar Link Styling
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        if (link.href.includes(currentPage)) {
            link.classList.add('text-[#8A307F]', 'font-semibold');
            link.classList.remove('text-slate-600');
        }
    });

});