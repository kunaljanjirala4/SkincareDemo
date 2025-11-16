document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // ==               CORE LOGIC & SHARED VARIABLES               ==
    // =================================================================

    let cart = JSON.parse(localStorage.getItem('skincareLabCart')) || [];
    let shippingAddress = JSON.parse(localStorage.getItem('skincareShippingAddress')) || {};
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const saveCart = () => localStorage.setItem('skincareLabCart', JSON.stringify(cart));
    const saveShippingAddress = () => localStorage.setItem('skincareShippingAddress', JSON.stringify(shippingAddress));

    // Simulated Tax Rates for Demonstration
    const TAX_RATES = {
        'MI': 0.06,    // Michigan
        'CA': 0.0725,  // California
        'NY': 0.04,    // New York
        'DEFAULT': 0.05 // A default rate for other states
    };

    // =================================================================
    // ==                   PAGE-SPECIFIC SCRIPTS                     ==
    // =================================================================

    // --- SHOP PAGE SCRIPT ---
    if (currentPage === 'shop.html' || currentPage === 'index.html') {
        const addToCart = (productName, productPrice) => {
            const existingProduct = cart.find(item => item.name === productName);
            if (existingProduct) {
                if (existingProduct.quantity < 10) {
                    existingProduct.quantity++;
                } else {
                    alert("You can only add a maximum of 10 items.");
                    return;
                }
            } else {
                cart.push({ name: productName, price: parseFloat(productPrice), quantity: 1 });
            }
            saveCart();
            showSuccessAlert(`${productName} has been added to cart!`);
        };

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const productName = productCard.getAttribute('data-name');
                    const productPrice = productCard.getAttribute('data-price');
                    addToCart(productName, productPrice);
                }
            });
        });
    }

    // --- CART PAGE SCRIPT (`cart.html`) ---
    if (currentPage === 'cart.html') {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartSubtotalElement = document.getElementById('cart-subtotal');
        const clearCartBtn = document.getElementById('clear-cart-btn');
        const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout');

        const updateCartPage = () => {
            const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="p-6 text-center">
                        <p class="text-gray-600 text-lg">Your cart is currently empty.</p>
                        <a href="shop.html" class="mt-4 inline-block bg-pink-100 text-pink-700 py-2 px-5 rounded-lg hover:bg-pink-200 font-semibold">
                            Continue Shopping
                        </a>
                    </div>
                `;
                if(proceedToCheckoutBtn) proceedToCheckoutBtn.classList.add('hidden');
            } else {
                if(proceedToCheckoutBtn) proceedToCheckoutBtn.classList.remove('hidden');
                cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item flex items-center justify-between p-4 border-b border-gray-200">
                        <div class="flex items-center gap-4 w-2/5">
                            <img src="https://via.placeholder.com/80" alt="${item.name}" class="w-20 h-20 object-cover rounded-md">
                            <div>
                                <p class="font-semibold text-pink-600">${item.name}</p>
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
            cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        };

        cartItemsContainer.addEventListener('click', e => {
            const target = e.target;
            const name = target.dataset.name;
            if (!name) return;

            const item = cart.find(p => p.name === name);
            if (!item) return;

            const action = target.dataset.action;

            if (action === 'plus' && item.quantity < 10) item.quantity++;
            if (action === 'minus' && item.quantity > 1) item.quantity--;
            if (target.classList.contains('delete-item')) {
                cart = cart.filter(p => p.name !== name);
            }
            saveCart();
            updateCartPage();
        });

        clearCartBtn.addEventListener('click', () => {
            if (cart.length > 0 && confirm('Are you sure you want to clear your entire cart?')) {
                cart = [];
                saveCart();
                updateCartPage();
            }
        });

        updateCartPage();
    }

    // --- CHECKOUT PAGE SCRIPT (`checkout.html`) ---
    if (currentPage === 'checkout.html') {
        const shippingForm = document.getElementById('shipping-form');
        const summaryItems = document.getElementById('summary-items');
        const subtotalEl = document.getElementById('summary-subtotal');
        const taxEl = document.getElementById('summary-tax');
        const totalEl = document.getElementById('summary-total');

        const updateOrderSummary = () => {
            const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
            const state = shippingAddress.state || '';
            const taxRate = TAX_RATES[state.toUpperCase()] || TAX_RATES['DEFAULT'];
            const tax = subtotal * taxRate;
            const total = subtotal + tax;

            if (summaryItems) {
                summaryItems.innerHTML = cart.map(item => `<div class="flex justify-between"><span>${item.name} x ${item.quantity}</span> <span>$${(item.price * item.quantity).toFixed(2)}</span></div>`).join('');
            }
            if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
            if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
            if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
        };

        if (shippingForm) {
            shippingForm.addEventListener('input', e => {
                shippingAddress[e.target.name] = e.target.value;
                saveShippingAddress();
                if (e.target.name === 'state' || e.target.name === 'zip') {
                    updateOrderSummary();
                }
            });

            shippingForm.addEventListener('submit', e => {
                e.preventDefault();
                if (cart.length === 0) {
                    alert("Your cart is empty!");
                    return;
                }
                showSuccessAlert("Order placed successfully! Thank you.");
                localStorage.removeItem('skincareLabCart');
                localStorage.removeItem('skincareShippingAddress');
                setTimeout(() => window.location.href = 'index.html', 2000);
            });

            Object.keys(shippingAddress).forEach(key => {
                if (shippingForm.elements[key]) {
                    shippingForm.elements[key].value = shippingAddress[key];
                }
            });
        }
        
        updateOrderSummary();
    }

    // --- DEBUG VERSION for product.html ---
if (currentPage === 'product.html') {
    console.log('Checkpoint 1: Product page script has started.');

    const container = document.getElementById('product-detail-container');
    const loadingEl = document.getElementById('product-loading');

    // A quick check to make sure the basic HTML elements are there
    if (!container || !loadingEl) {
        console.error("CRITICAL ERROR: The basic HTML containers 'product-detail-container' or 'product-loading' were not found on the page.");
        return; // Stop the script if the page structure is wrong
    }
    console.log('Checkpoint 2: Found container and loading elements successfully.');

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    console.log('Checkpoint 3: Reading product ID from URL. The ID is:', productId);

    // This is a very important check. Does the 'allProducts' variable exist?
    if (typeof allProducts === 'undefined' || allProducts.length === 0) {
        console.error("CRITICAL ERROR: The 'allProducts' database is missing or empty in main.js! Make sure you are using the version of main.js with the large product list at the top.");
        loadingEl.innerText = "Error: Product database not found.";
        return; 
    }

    const product = allProducts.find(p => p.id == productId);
    console.log('Checkpoint 4: Searching database for the product. Product found:', product);

    if (product) {
        console.log('Checkpoint 5: Product was found! Preparing to display details.');
        
        // Set the page title
        document.title = `${product.name} - SkincareLab`;
        
        // Hide the loading message and inject the final HTML
        loadingEl.style.display = 'none';
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
            </div>
        `;
        console.log('Checkpoint 6: Successfully updated the page with product details.');
    } else {
        console.error('Checkpoint 5b: Product was NOT found. This ID does not exist in the database or the URL is incorrect.');
        loadingEl.innerHTML = '<h1 class="text-2xl font-bold text-center">Product Not Found</h1><p class="text-center mt-2">The product ID from the URL does not exist.</p><a href="shop.html" class="block text-center mt-4 text-[#8A307F] hover:underline">Return to Shop</a>';
    }
}
    // --- AI ROUTINE FINDER SCRIPT (`routine-finder.html`) ---
if (currentPage === 'routine-finder.html') {
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    const steps = {
        1: document.getElementById('step-1'),
        2: document.getElementById('step-2'),
        loading: document.getElementById('step-loading'),
    };

    const userAnswers = {};
    let currentStep = 1;

    const showStep = (stepNumber) => {
        // Hide all step containers first
        Object.values(steps).forEach(stepEl => {
            if (stepEl) stepEl.classList.add('hidden');
        });
        // Show the correct step container
        if (steps[stepNumber]) {
            steps[stepNumber].classList.remove('hidden');
            steps[stepNumber].classList.add('fade-in');
        }
    };

    if (quizContainer) {
        // CORRECTED EVENT LISTENER LOGIC
        quizContainer.addEventListener('click', (e) => {
            // Use .closest() to find the button, no matter if the user clicks the text or the padding
            const quizOption = e.target.closest('.quiz-option');
            
            // Proceed only if a valid quiz option button was clicked
            if (quizOption) {
                const field = quizOption.dataset.field;
                const value = quizOption.dataset.value;
                userAnswers[field] = value;

                currentStep++;
                if (steps[currentStep]) {
                    showStep(currentStep);
                } else {
                    // End of quiz, start AI simulation
                    showStep('loading');
                    fetchAiRoutine(userAnswers).then(displayRoutine);
                }
            }
        });
    }

    const fetchAiRoutine = (answers) => {
        console.log("Simulating AI call with answers:", answers);

        return new Promise(resolve => {
            setTimeout(() => {
                let routine = {
                    cleanser: { name: "Gentle Gel Cleanser", reason: "A good starting point for all skin types. It cleanses without stripping natural oils." },
                    treatment: { name: "Targeted Serum", reason: "Serums deliver potent ingredients deep into the skin to address specific concerns." },
                    moisturizer: { name: "Hydrating Lotion", reason: "Essential for maintaining your skin's moisture barrier, keeping it healthy and plump." },
                    spf: { name: "Broad-Spectrum SPF 30+", reason: "The most crucial step to prevent sun damage, aging, and hyperpigmentation." }
                };
                if (answers.skinType === 'Oily') {
                    routine.cleanser.name = 'Salicylic Acid Cleanser';
                    routine.moisturizer.name = 'Lightweight Gel Moisturizer';
                }
                if (answers.skinType === 'Dry') {
                    routine.cleanser.name = 'Hydrating Cream Cleanser';
                    routine.moisturizer.name = 'Rich Barrier Cream';
                }
                if (answers.concern === 'Acne') {
                    routine.treatment = { name: 'BHA (Salicylic Acid) Serum', reason: 'Salicylic Acid exfoliates inside the pore, clearing out congestion and preventing breakouts.' };
                }
                if (answers.concern === 'Aging') {
                    routine.treatment = { name: 'Retinoid Serum (PM)', reason: 'Retinoids are the gold standard for anti-aging, boosting collagen to reduce fine lines.' };
                }
                if (answers.concern === 'Pigmentation') {
                    routine.treatment = { name: 'Vitamin C Serum (AM)', reason: 'Vitamin C is a powerful antioxidant that brightens the skin and fades dark spots.' };
                }
                 if (answers.concern === 'Redness') {
                    routine.treatment = { name: 'Niacinamide Serum', reason: 'Niacinamide is a calming superstar that strengthens the skin barrier and reduces inflammation.' };
                }
                resolve(routine);
            }, 2500);
        });
    };

    const displayRoutine = (routine) => {
        if(quizContainer) quizContainer.classList.add('hidden');
        if(resultsContainer) {
            resultsContainer.classList.remove('hidden');
            resultsContainer.classList.add('fade-in');
            resultsContainer.innerHTML = `
                <div class="text-center mb-12"><h1 class="text-4xl font-bold text-slate-900">Your Personalized Routine</h1><p class="text-lg text-slate-600 mt-2">Based on your answers, here is the ideal starting plan for your skin.</p></div>
                <div class="bg-white p-8 rounded-lg shadow-md"><div class="grid md:grid-cols-2 gap-8">
                    <div><h2 class="text-2xl font-bold mb-4 flex items-center"><svg class="w-6 h-6 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> AM Routine</h2><div class="space-y-4"><div class="p-4 bg-rose-50 rounded-md"><strong>1. Cleanse:</strong> ${routine.cleanser.name}</div><div class="p-4 bg-rose-50 rounded-md"><strong>2. Treat:</strong> ${routine.treatment.name.includes('(AM)') ? routine.treatment.name : 'Niacinamide or Vitamin C'}</div><div class="p-4 bg-rose-50 rounded-md"><strong>3. Moisturize:</strong> ${routine.moisturizer.name}</div><div class="p-4 bg-rose-50 rounded-md"><strong>4. Protect:</strong> ${routine.spf.name}</div></div></div>
                    <div><h2 class="text-2xl font-bold mb-4 flex items-center"><svg class="w-6 h-6 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg> PM Routine</h2><div class="space-y-4"><div class="p-4 bg-indigo-50 rounded-md"><strong>1. Cleanse:</strong> ${routine.cleanser.name}</div><div class="p-4 bg-indigo-50 rounded-md"><strong>2. Treat:</strong> ${routine.treatment.name}</div><div class="p-4 bg-indigo-50 rounded-md"><strong>3. Moisturize:</strong> ${routine.moisturizer.name}</div></div></div>
                </div><div class="mt-10 pt-6 border-t"><h3 class="text-xl font-bold text-slate-800">Your Key Ingredient:</h3><p class="text-slate-600 mt-2">${routine.treatment.reason}</p></div><div class="mt-8 text-center"><a href="shop.html" class="bg-[#C74760] text-white py-3 px-8 rounded-full font-bold hover:bg-[#B3354D] transition-colors text-lg shadow-lg">Shop Recommended Products</a></div></div>`;
        }
    };
}
    // =================================================================
    // ==                 UTILITY & GENERAL FUNCTIONS                 ==
    // =================================================================

    function showSuccessAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'fixed top-20 left-1/2 -translate-x-1/2 bg-pink-600 text-white text-center py-2 px-6 rounded-lg shadow-lg z-50';
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.style.transition = 'opacity 0.5s ease';
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 500);
        }, 3000);
    }

    // Active Navbar Link Styling
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        if (link.href.includes(currentPage)) {
            link.classList.add('text-[#C74760]', 'font-semibold');
            link.classList.remove('text-slate-600');
        }
    });

});