$(document).ready(() => {
    // Fetch portfolio items to populate the dropdown
    axios.get('/api/v2/')
        .then(response => {
            const portfolioItems = response.data;
            const portfolioSelect = $('#portfolioSelect');

            portfolioItems.forEach(item => {
                portfolioSelect.append(`<option value="${item._id}">${item.title}</option>`);
            });
        })
        .catch(error => {
            console.error('Error fetching portfolio items:', error);
            $('#message').html('<div class="alert alert-danger">Failed to load portfolio items.</div>');
        });

    // Handle delete form submission
    $('#deleteForm').submit(function(event) {
        event.preventDefault();

        const selectedItemId = $('#portfolioSelect').val();
        if (!selectedItemId) {
            $('#message').html('<div class="alert alert-warning">Please select an item to delete.</div>');
            return;
        }

        axios.delete(`/api/v2/${selectedItemId}`)
            .then(response => {
                $('#message').html(`<div class="alert alert-success">${response.data.message}</div>`);
                $('#portfolioSelect').find(`option[value="${selectedItemId}"]`).remove(); // Remove deleted item from dropdown
            })
            .catch(error => {
                console.error('Error deleting portfolio item:', error);
                $('#message').html('<div class="alert alert-danger">Failed to delete the selected item.</div>');
            });
    });
});