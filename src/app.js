/**
 * Nameday App
 * 
 * Search on name to get what date
 * Search on date to get what name(s)
 * 
 * Search on country
 * 
 */


// Search name

// Get reference to the form for searching on a name
let searchName = document.querySelector(".form-name");

// Rendering the result to HTML
const renderDateOfName = (data, name) => {
    console.log(data.results);

    let displayDate = document.querySelector(".display-date");

    // If array length in data.results < 1, print not success.
    // If array is > 1, find the matching name with higher order array method find().
    // If there is a match and date is then true, print success, else if date is false, print not success.
    // Else if the array === 1, print success.

    if(data.results.length < 1) {
        displayDate.innerHTML = `<p>Sorry, ${name} does not have a nameday :(</p>`;
    } else if(data.results.length > 1) {
        let date = data.results.find(result => result.name === name);
        if(date) {
            displayDate.innerHTML = `<p>${name} has nameday on ${date.day}/${date.month}</p>`;
        } else {
            displayDate.innerHTML = `<p>Sorry, ${name} does not have a nameday :(</p>`;
        }
    } else {
        displayDate.innerHTML = `<p>${name} has nameday on ${data.results[0].day}/${data.results[0].month}</p>`;
    }
};


searchName.addEventListener("submit", e => {
    e.preventDefault();
    
    // Get value from input
    // Turn it into lowercase
    // Set the first character in the name to uppercase, and then add the rest of the name.
    // Because otherwise the find method will not work...
    let name = e.target.nameInput.value;
    name = name.toLowerCase();
    name = name[0].toUpperCase() + name.slice(1);

    // Fetch from API
    getDate(name)
    .then(data => {
        // Render to HTML
        renderDateOfName(data, name);
    });
});





// Get value from search input (date)