(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.nav-bar').addClass('sticky-top');
        } else {
            $('.nav-bar').removeClass('sticky-top');
        }
    });
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: true,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });

    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 24,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            992: {
                items: 2
            }
        }
    });
    
})(jQuery);

// Data for regions and their locations
const regionData = {
    "North": ["Srinagar-Pahalgam", "Jim Corbett", "Jaipur", "Gurgaon", "Rishikesh", "Kasauli", "Mussoorie-Dehradun", "Pench"],
    "South": ["Coonoor", "Coorg"],
    "West": ["Goa", "Alibaug", "Lonavala-Khandala", "Mahabaleshwar", "Karjat"],
    "International": ["Maldives", "Bali", "Phuket", "Koh Samui", "Sri Lanka"]
};
const allLocations = [
    "Goa", "Alibaug", "Lonavala-Khandala", "Mahabaleshwar", "Karjat", 
    "Srinagar-Pahalgam", "Jim Corbett", "Jaipur", "Gurgaon", "Rishikesh", 
    "Kasauli", "Udaipur", "Mussoorie-Dehradun", "Coonoor", "Coorg", 
    "Bhimtal", "Pench", "Maldives", "Bali", "Phuket", 
    "Koh Samui", "Sri Lanka"
];

// Populate locations based on selected region
function populateLocations() {
    const region = document.getElementById('region').value;
    const locationSelect = document.getElementById('location');
    
    locationSelect.innerHTML = '<option value="" selected>Select Location</option>'; // Reset locations
    
    if (region) {
        const locations = regionData[region] || [];
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationSelect.appendChild(option);
        });
    } else {
        // Show all locations if no region is selected
        allLocations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationSelect.appendChild(option);
        });
    }
}

// Scroll to results section
function scrollToResults() {
    const resultsSection = document.querySelector('.container-xxl');
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Search villas based on filters
async function searchVillas() {
    const keyword = document.getElementById('searchKeyword').value.trim().toLowerCase();
    const region = document.getElementById('region').value;
    const location = document.getElementById('location').value;
    const isPetFriendly = document.getElementById('petFriendlyButton').classList.contains('active');
    const isSeniorFriendly = document.getElementById('seniorCitizenFriendlyButton').classList.contains('active');

    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (region) params.append('region', region);
    if (location) params.append('location', location);
    if (isPetFriendly) params.append('pet_friendly', 'Yes');
    if (isSeniorFriendly) params.append('senior_citizen_friendly', 'Yes');

    try {
        const response = await fetch(`/api/search_villas?${params.toString()}`);
        const results = await response.json();

        if (results.length === 1 && results[0].villa_name.toLowerCase() === keyword) {
            // Redirect to specific villa's page if the villa name is matched
            window.location.href = `/villas/${results[0].id}.html`;
        } else {
            // Display the results, replacing the category section
            displayVillas(results);
            scrollToResults();
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

// Function to display villas in place of the category section
function displayVillas(villas) {
    const categorySection = document.querySelector('.container-xxl');
    let villaHTML;
    if (villas.length > 0) {
        villaHTML = `
            <div class="container-xxl">
                <div class="container">
                    <div class="row g-0 gx-5 align-items-end">
                        <div class="col-lg-12">
                            <div class="text-start mx-auto mb-5 wow slideInLeft" data-wow-delay="0.1s">
                                <h1 class="mb-3">Explore Villas</h1>
                            </div>
                        </div>
                    </div>
                    <div class="tab-content">
                        <div id="tab-1" class="tab-pane fade show p-0 active">
                            <div class="row g-4">
                                ${villas.map(villa => `
                                    <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                        <div class="property-item rounded overflow-hidden">
                                            <div class="position-relative overflow-hidden">
                                                <a href="/villas/${villa.id}.html"><img class="img-fluid" src="/uploads/${villa.villa_image}" alt="image"/></a>
                                            </div>
                                            <div class="p-4 pb-0">
                                                <h5 class="text-primary mb-3"></h5>
                                                <a class="d-block h5 mb-2" href="/villas/${villa.id}.html">${villa.villa_name}</a>
                                                <p><i class="fa fa-map-marker-alt text-primary me-2"></i>${villa.location}</p>
                                            </div>
                                            <div class="d-flex border-top">
                                                <small class="flex-fill text-center border-end py-2"><i class="fa fa-users text-primary me-1"></i>${villa.num_guests}</small>
                                                <small class="flex-fill text-center border-end py-2"><i class="fa fa-bed text-primary me-1"></i>${villa.num_bedrooms}</small>
                                                <small class="flex-fill text-center py-2" style="padding-left: 0.75rem; padding-right: 0.5rem;"><i class="fa fa-bath text-primary me-1"></i>${villa.num_bathrooms}</small>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        villaHTML = `
            <div class="container-xxl py-5">
                <div class="container">
                    <div class="text-start mx-auto mb-5 wow slideInLeft" data-wow-delay="0.1s">
                        <h1 class="mb-3">No Results Found</h1>
                        <p>Sorry, we couldn't find any villas matching your search criteria. Please try again with different filters.</p>
                    </div>
                </div>
            </div>
        `;
    }
    categorySection.innerHTML = villaHTML;
}

// Handle search button click
document.getElementById('searchButton').addEventListener('click', searchVillas);

// Handle Enter key for search
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchVillas();
    }
});

// Event listeners
document.getElementById('region').addEventListener('change', populateLocations);
document.getElementById('searchButton').addEventListener('click', searchVillas);
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchVillas();
    }
});

// Toggle button states for filters
document.getElementById('petFriendlyButton').addEventListener('click', function() {
    this.classList.toggle('active');
    searchVillas();
});

document.getElementById('seniorCitizenFriendlyButton').addEventListener('click', function() {
    this.classList.toggle('active');
    searchVillas();
});

// Initial population of locations
populateLocations();

