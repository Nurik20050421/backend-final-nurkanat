$(document).ready(() => {
    axios.get('/api/v2/')
        .then(response => {
            const portfolioItems = response.data;
            const portfolioGrid = $('#portfolioGrid');
            
            portfolioItems.forEach((portfolio, index) => {
                const images = portfolio.images;
                const activeClass = 'active';

                // Generate inner carousel items
                let carouselItems = '';
                images.forEach((image, i) => {
                    carouselItems += `
                        <div class="carousel-item ${i === 0 ? activeClass : ''}">
                            <img src="${image}" class="d-block w-100" alt="${portfolio.title}">
                            <div class="carousel-caption">
                                <h5>${portfolio.title}</h5>
                                <p>${portfolio.description}</p>                                
                            </div>
                             <div class="timestamp-overlay">
                                <small>Created: ${new Date(portfolio.createdAt).toLocaleDateString()}</small><br>
                                <small>Updated: ${new Date(portfolio.updatedAt).toLocaleDateString()}</small><br>
                                <small>Author: ${portfolio.author.lastName} ${portfolio.author.firstName}</small>
                            </div>
                        </div>
                    `;
                });

                // Generate carousel indicators
                let carouselIndicators = '';
                images.forEach((_, i) => {
                    carouselIndicators += `
                        <button type="button" data-bs-target="#carousel${index}" data-bs-slide-to="${i}"
                            class="${i === 0 ? activeClass : ''}" aria-current="true"></button>
                    `;
                });

                // Add carousel HTML to portfolio grid
                portfolioGrid.append(`
                    <div class="col-md-6 portfolio-item">
                        <div id="carousel${index}" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-indicators">
                                ${carouselIndicators}
                            </div>
                            <div class="carousel-inner">
                                ${carouselItems}
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carousel${index}" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carousel${index}" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                `);
            });
        })
        .catch(error => {
            console.error('Error fetching portfolio items:', error);
            $('#portfolioGrid').html('<div class="alert alert-danger" role="alert">Failed to load portfolio items.</div>');
        });
});