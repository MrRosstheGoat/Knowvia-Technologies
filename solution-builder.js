/**
 * KNOWVIA TECHNOLOGIES - Solution Builder JavaScript
 * Handles solution configuration, pricing calculation, and form submission
 */

// =========================================
// CONFIGURATION
// =========================================

// EmailJS Configuration (uses same config as main site)
const EMAILJS_CONFIG = {
    publicKey: 'eMkHOv0OPSiu_NxWs',
    serviceId: 'service_9o7rmza',
    templateId: 'template_xnfuaqn'
};

// Pricing Configuration
const PRICING = {
    website: {
        base: 0,
        features: {
            landing: { name: 'Landing Page', price: 30 },
            about: { name: 'About Us Page', price: 25 },
            services: { name: 'Services Page', price: 35 },
            contact: { name: 'Contact Forms', price: 40 },
            blog: { name: 'Blog / CMS', price: 80 },
            admin: { name: 'Admin Dashboard', price: 150 },
            auth: { name: 'User Authentication', price: 100 },
            ecommerce: { name: 'E-commerce Functionality', price: 250 },
            payments: { name: 'Payment Integration', price: 120 },
            seo: { name: 'SEO Optimization', price: 60 },
            api: { name: 'API Integrations', price: 100 }
        }
    },
    mobile: {
        base: 0,
        platforms: {
            android: { name: 'Android', price: 0 },
            ios: { name: 'iOS', price: 50 },
            cross: { name: 'Cross-Platform', price: 100 }
        },
        features: {
            auth: { name: 'User Authentication', price: 80 },
            profiles: { name: 'User Profiles', price: 60 },
            dashboard: { name: 'Dashboard / Home Screen', price: 70 },
            push: { name: 'Push Notifications', price: 50 },
            realtime: { name: 'Real-Time Data', price: 120 },
            chat: { name: 'In-App Chat', price: 150 },
            payments: { name: 'Payments & Subscriptions', price: 130 },
            gps: { name: 'Location / GPS', price: 80 },
            offline: { name: 'Offline Mode', price: 100 },
            admin: { name: 'Admin Dashboard', price: 180 },
            analytics: { name: 'Analytics', price: 70 }
        }
    },
    ai: {
        base: 80,
        features: {
            ml: { name: 'Machine Learning', price: 150 },
            nlp: { name: 'Natural Language Processing', price: 120 },
            cv: { name: 'Computer Vision', price: 180 },
            predictive: { name: 'Predictive Analytics', price: 140 },
            recommendation: { name: 'Recommendation Systems', price: 160 },
            chatbot: { name: 'Chatbots / Virtual Assistants', price: 100 }
        }
    },
    iot: {
        base: 100,
        features: {
            sensors: { name: 'Sensors & Data Collection', price: 80 },
            monitoring: { name: 'Device Monitoring', price: 100 },
            dashboard: { name: 'Real-Time Dashboards', price: 120 },
            remote: { name: 'Remote Control / Automation', price: 150 },
            alerts: { name: 'Alerts & Notifications', price: 60 },
            cloud: { name: 'Cloud Integration', price: 100 },
            edge: { name: 'Edge Computing', price: 180 },
            mobile: { name: 'Mobile App Integration', price: 130 }
        }
    }
};

// =========================================
// STATE MANAGEMENT
// =========================================

const state = {
    entryPath: 'product', // 'product' or 'problem'
    solutionType: 'website', // 'website', 'mobile', 'ai', 'iot'
    selectedPlatform: 'cross', // For mobile: 'android', 'ios', 'cross'
    selectedFeatures: {
        website: [],
        mobile: [],
        iot: []
    },
    aiOptions: {
        types: [],
        dataSources: [],
        outcomes: []
    }
};

// =========================================
// INITIALIZATION
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }

    // Initialize modules
    initNavigation();
    initEntryPathSelection();
    initSolutionTypeSelection();
    initFeatureSelection();
    initPlatformSelection();
    initOptionSelection();
    initFormSubmission();
    initHeaderScroll();

    // Initial price calculation
    updatePricing();
});

// =========================================
// NAVIGATION MODULE
// =========================================

function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

// =========================================
// ENTRY PATH SELECTION
// =========================================

function initEntryPathSelection() {
    const pathCards = document.querySelectorAll('.entry-path-card');
    const solutionTypeStep = document.getElementById('stepSolutionType');
    const problemSection = document.getElementById('problemSection');
    const configurators = document.querySelectorAll('.solution-configurator');
    const contactStepNumber = document.getElementById('contactStepNumber');
    const costPanel = document.getElementById('costPanel');

    pathCards.forEach(card => {
        card.addEventListener('click', () => {
            // Update active state
            pathCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const path = card.dataset.path;
            state.entryPath = path;

            if (path === 'product') {
                // Show solution type selection and hide problem section
                solutionTypeStep.style.display = 'block';
                problemSection.classList.remove('active');

                // Show the active configurator
                const activeTab = document.querySelector('.solution-tab.active');
                if (activeTab) {
                    showConfigurator(activeTab.dataset.solution);
                }

                // Update step number
                contactStepNumber.textContent = '03';

                // Show cost panel
                costPanel.style.display = 'block';
            } else {
                // Hide solution type selection and configurators
                solutionTypeStep.style.display = 'none';
                configurators.forEach(c => c.classList.remove('active'));

                // Show problem section
                problemSection.classList.add('active');

                // Update step number
                contactStepNumber.textContent = '03';

                // Hide cost panel for problem-first path
                costPanel.style.display = 'none';
            }
        });
    });
}

// =========================================
// SOLUTION TYPE SELECTION
// =========================================

function initSolutionTypeSelection() {
    const tabs = document.querySelectorAll('.solution-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const solution = tab.dataset.solution;
            state.solutionType = solution;

            showConfigurator(solution);
            updatePricing();
        });
    });
}

function showConfigurator(solution) {
    const configurators = {
        website: document.getElementById('configWebsite'),
        mobile: document.getElementById('configMobile'),
        ai: document.getElementById('configAI'),
        iot: document.getElementById('configIoT')
    };

    // Hide all configurators
    Object.values(configurators).forEach(c => {
        if (c) c.classList.remove('active');
    });

    // Show selected configurator
    if (configurators[solution]) {
        configurators[solution].classList.add('active');
    }
}

// =========================================
// FEATURE SELECTION
// =========================================

function initFeatureSelection() {
    // Website features
    const webFeatures = document.querySelectorAll('input[name="web_feature"]');
    webFeatures.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateFeatureState('website', 'web_feature');
            updatePricing();
        });
    });

    // Mobile features
    const mobileFeatures = document.querySelectorAll('input[name="mobile_feature"]');
    mobileFeatures.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateFeatureState('mobile', 'mobile_feature');
            updatePricing();
        });
    });

    // IoT features
    const iotFeatures = document.querySelectorAll('input[name="iot_feature"]');
    iotFeatures.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateFeatureState('iot', 'iot_feature');
            updatePricing();
        });
    });
}

function updateFeatureState(type, inputName) {
    const checkboxes = document.querySelectorAll(`input[name="${inputName}"]:checked`);
    state.selectedFeatures[type] = Array.from(checkboxes).map(cb => cb.value);
}

// =========================================
// PLATFORM SELECTION (Mobile)
// =========================================

function initPlatformSelection() {
    const platforms = document.querySelectorAll('input[name="platform"]');

    platforms.forEach(radio => {
        radio.addEventListener('change', () => {
            state.selectedPlatform = radio.value;

            // Update visual state
            document.querySelectorAll('.platform-option .option-box').forEach(box => {
                box.classList.remove('active');
            });
            radio.nextElementSibling.classList.add('active');

            updatePricing();
        });
    });
}

// =========================================
// OPTION SELECTION (AI)
// =========================================

function initOptionSelection() {
    // AI Types
    const aiTypes = document.querySelectorAll('input[name="ai_type"]');
    aiTypes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            state.aiOptions.types = getCheckedValues('ai_type');
            updatePricing();
        });
    });

    // AI Data Sources
    const aiData = document.querySelectorAll('input[name="ai_data"]');
    aiData.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            state.aiOptions.dataSources = getCheckedValues('ai_data');
        });
    });

    // AI Outcomes
    const aiOutcomes = document.querySelectorAll('input[name="ai_outcome"]');
    aiOutcomes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            state.aiOptions.outcomes = getCheckedValues('ai_outcome');
        });
    });
}

function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
}

// =========================================
// PRICING CALCULATION
// =========================================

function updatePricing() {
    const solutionTypeName = document.getElementById('solutionTypeName');
    const baseCostEl = document.getElementById('baseCost');
    const platformCostLine = document.getElementById('platformCostLine');
    const platformCostEl = document.getElementById('platformCost');
    const featuresCostEl = document.getElementById('featuresCost');
    const totalCostEl = document.getElementById('totalCost');
    const featuresList = document.getElementById('featuresList');

    let baseCost = 0;
    let platformCost = 0;
    let featuresCost = 0;
    let selectedFeatureNames = [];

    switch (state.solutionType) {
        case 'website':
            solutionTypeName.textContent = 'Website Development';
            baseCost = PRICING.website.base;
            platformCostLine.style.display = 'none';

            state.selectedFeatures.website.forEach(feature => {
                if (PRICING.website.features[feature]) {
                    featuresCost += PRICING.website.features[feature].price;
                    selectedFeatureNames.push(PRICING.website.features[feature].name);
                }
            });
            break;

        case 'mobile':
            solutionTypeName.textContent = 'Mobile Application';
            baseCost = PRICING.mobile.base;

            // Platform cost
            if (PRICING.mobile.platforms[state.selectedPlatform]) {
                platformCost = PRICING.mobile.platforms[state.selectedPlatform].price;
                platformCostLine.style.display = 'flex';
                platformCostEl.textContent = `$${platformCost}`;
            }

            state.selectedFeatures.mobile.forEach(feature => {
                if (PRICING.mobile.features[feature]) {
                    featuresCost += PRICING.mobile.features[feature].price;
                    selectedFeatureNames.push(PRICING.mobile.features[feature].name);
                }
            });
            break;

        case 'ai':
            solutionTypeName.textContent = 'AI Solution';
            baseCost = PRICING.ai.base;
            platformCostLine.style.display = 'none';

            // Calculate AI feature costs based on selected types
            state.aiOptions.types.forEach(type => {
                if (PRICING.ai.features[type]) {
                    featuresCost += PRICING.ai.features[type].price;
                    selectedFeatureNames.push(PRICING.ai.features[type].name);
                }
            });
            break;

        case 'iot':
            solutionTypeName.textContent = 'IoT System';
            baseCost = PRICING.iot.base;
            platformCostLine.style.display = 'none';

            state.selectedFeatures.iot.forEach(feature => {
                if (PRICING.iot.features[feature]) {
                    featuresCost += PRICING.iot.features[feature].price;
                    selectedFeatureNames.push(PRICING.iot.features[feature].name);
                }
            });
            break;
    }

    // Update display
    baseCostEl.textContent = `$${baseCost}`;
    featuresCostEl.textContent = `$${featuresCost}`;
    totalCostEl.textContent = `$${baseCost + platformCost + featuresCost}`;

    // Update features list
    if (selectedFeatureNames.length > 0) {
        featuresList.innerHTML = selectedFeatureNames.map(name => `<li>${name}</li>`).join('');
    } else {
        featuresList.innerHTML = '<li class="no-features">No features selected yet</li>';
    }
}

// =========================================
// FORM SUBMISSION
// =========================================

function initFormSubmission() {
    const submitBtn = document.getElementById('submitRequest');
    const formSuccess = document.getElementById('formSuccess');

    if (!submitBtn) return;

    submitBtn.addEventListener('click', async () => {
        // Validate form
        if (!validateForm()) {
            return;
        }

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Submitting...</span>';

        try {
            // Gather all form data
            const formData = gatherFormData();

            // Log form data for debugging
            console.log('Form Data:', formData);

            // Check if EmailJS is configured
            if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
                // EmailJS not configured - simulate sending
                await new Promise(resolve => setTimeout(resolve, 1500));
                console.warn(' EmailJS not configured. Form data logged above.');
            } else {
                // Send via EmailJS
                const templateParams = {
                    from_name: formData.contact.fullName,
                    reply_to: formData.contact.email,
                    to_email: 'chitategareth@gmail.com',
                    message: formatEmailMessage(formData)
                };

                await emailjs.send(
                    EMAILJS_CONFIG.serviceId,
                    EMAILJS_CONFIG.templateId,
                    templateParams
                );
            }

            // Show success message
            formSuccess.classList.add('visible');
            submitBtn.style.display = 'none';

            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
            console.error('Failed to submit request:', error);
            alert('Failed to submit request. Please try again or email us directly at chitategareth@gmail.com');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <span>Submit Request</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
            `;
        }
    });
}

function validateForm() {
    const fields = {
        fullName: { el: document.getElementById('fullName'), error: document.getElementById('nameError') },
        email: { el: document.getElementById('emailAddress'), error: document.getElementById('emailError') },
        phone: { el: document.getElementById('phone'), error: document.getElementById('phoneError') }
    };

    let isValid = true;

    // Validate name
    if (!fields.fullName.el.value.trim()) {
        showFieldError(fields.fullName.error, 'Name is required');
        isValid = false;
    } else {
        clearFieldError(fields.fullName.error);
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fields.email.el.value.trim()) {
        showFieldError(fields.email.error, 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(fields.email.el.value)) {
        showFieldError(fields.email.error, 'Please enter a valid email');
        isValid = false;
    } else {
        clearFieldError(fields.email.error);
    }

    // Validate phone
    if (!fields.phone.el.value.trim()) {
        showFieldError(fields.phone.error, 'Phone number is required');
        isValid = false;
    } else {
        clearFieldError(fields.phone.error);
    }

    // Validate problem-specific fields
    if (state.entryPath === 'problem') {
        const problemDesc = document.getElementById('problemDescription');
        const industry = document.getElementById('industry');
        const scale = document.getElementById('scale');
        const urgency = document.getElementById('urgency');

        if (!problemDesc.value.trim()) {
            problemDesc.style.borderColor = 'var(--color-white)';
            isValid = false;
        }
        if (!industry.value) {
            industry.style.borderColor = 'var(--color-white)';
            isValid = false;
        }
        if (!scale.value) {
            scale.style.borderColor = 'var(--color-white)';
            isValid = false;
        }
        if (!urgency.value) {
            urgency.style.borderColor = 'var(--color-white)';
            isValid = false;
        }
    }

    // Scroll to first error
    if (!isValid) {
        const firstError = document.querySelector('.form-error.visible, .form-group input:invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    return isValid;
}

function showFieldError(errorEl, message) {
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
    }
}

function clearFieldError(errorEl) {
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
    }
}

function gatherFormData() {
    const data = {
        entryPath: state.entryPath,
        contact: {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('emailAddress').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            company: document.getElementById('companyName').value.trim()
        }
    };

    if (state.entryPath === 'product') {
        data.solutionType = state.solutionType;

        switch (state.solutionType) {
            case 'website':
                data.features = state.selectedFeatures.website.map(f => PRICING.website.features[f]?.name || f);
                data.description = document.getElementById('webDescription').value.trim();
                data.estimatedCost = calculateTotalCost();
                break;

            case 'mobile':
                data.platform = state.selectedPlatform;
                data.features = state.selectedFeatures.mobile.map(f => PRICING.mobile.features[f]?.name || f);
                data.description = document.getElementById('mobileDescription').value.trim();
                data.estimatedCost = calculateTotalCost();
                break;

            case 'ai':
                data.aiTypes = state.aiOptions.types;
                data.dataSources = state.aiOptions.dataSources;
                data.outcomes = state.aiOptions.outcomes;
                data.description = document.getElementById('aiDescription').value.trim();
                data.estimatedCost = calculateTotalCost(); // Now uses calculation
                break;

            case 'iot':
                data.features = state.selectedFeatures.iot.map(f => PRICING.iot.features[f]?.name || f);
                data.description = document.getElementById('iotDescription').value.trim();
                data.estimatedCost = calculateTotalCost();
                break;
        }
    } else {
        // Problem-first path
        data.problemDescription = document.getElementById('problemDescription').value.trim();
        data.industry = document.getElementById('industry').value;
        data.currentTools = document.getElementById('currentTools').value.trim();
        data.scale = document.getElementById('scale').value;
        data.urgency = document.getElementById('urgency').value;
        data.estimatedCost = 'To be determined after assessment';
    }

    return data;
}

function calculateTotalCost() {
    let total = 0;

    switch (state.solutionType) {
        case 'website':
            total = PRICING.website.base;
            state.selectedFeatures.website.forEach(f => {
                if (PRICING.website.features[f]) {
                    total += PRICING.website.features[f].price;
                }
            });
            break;

        case 'mobile':
            total = PRICING.mobile.base;
            if (PRICING.mobile.platforms[state.selectedPlatform]) {
                total += PRICING.mobile.platforms[state.selectedPlatform].price;
            }
            state.selectedFeatures.mobile.forEach(f => {
                if (PRICING.mobile.features[f]) {
                    total += PRICING.mobile.features[f].price;
                }
            });
            break;

        case 'ai':
            total = PRICING.ai.base;
            state.aiOptions.types.forEach(type => {
                if (PRICING.ai.features[type]) {
                    total += PRICING.ai.features[type].price;
                }
            });
            break;

        case 'iot':
            total = PRICING.iot.base;
            state.selectedFeatures.iot.forEach(f => {
                if (PRICING.iot.features[f]) {
                    total += PRICING.iot.features[f].price;
                }
            });
            break;
    }

    return `$${total}`;
}

function formatEmailMessage(formData) {
    let message = `
  KNOWVIA TECHNOLOGIES - SOLUTION REQUEST

  REQUEST TYPE: ${formData.entryPath === 'product' ? 'Product Configuration' : 'Problem Description'}

  CONTACT INFORMATION
  -------------------
  Name: ${formData.contact.fullName}
  Email: ${formData.contact.email}
  Phone: ${formData.contact.phone}
  Company: ${formData.contact.company || 'N/A'}
`;

    if (formData.entryPath === 'product') {
        message += `
  SOLUTION TYPE: ${formData.solutionType.toUpperCase()}
`;

        if (formData.platform) {
            message += `  Platform: ${formData.platform}\n`;
        }

        if (formData.features && formData.features.length > 0) {
            message += `\n  Selected Features:\n`;
            formData.features.forEach(f => {
                message += `  - ${f}\n`;
            });
        }

        if (formData.aiTypes && formData.aiTypes.length > 0) {
            message += `\n  AI Types: ${formData.aiTypes.join(', ')}\n`;
        }

        if (formData.dataSources && formData.dataSources.length > 0) {
            message += `  Data Sources: ${formData.dataSources.join(', ')}\n`;
        }

        if (formData.outcomes && formData.outcomes.length > 0) {
            message += `  Expected Outcomes: ${formData.outcomes.join(', ')}\n`;
        }

        if (formData.description) {
            message += `\n  Additional Requirements:\n  ${formData.description}\n`;
        }

        message += `\n  ESTIMATED COST: ${formData.estimatedCost}\n`;

    } else {
        message += `
  PROBLEM DESCRIPTION
  -------------------
  ${formData.problemDescription}

  DETAILS
  -------
  Industry: ${formData.industry}
  Current Tools: ${formData.currentTools || 'None specified'}
  Scale: ${formData.scale}
  Urgency: ${formData.urgency}

  ESTIMATED COST: ${formData.estimatedCost}
`;
    }

    message += `
  -------------------
  Submitted via Knowvia Technologies
  Solution Builder
`;

    return message;
}

// =========================================
// UTILITY FUNCTIONS
// =========================================

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}