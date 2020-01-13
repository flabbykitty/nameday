/**
 * Nameday App
 * 
 * Search on name to get what date
 * Search on date to get what name(s)
 * 
 * Search on country
 * 
 */


let searchName = document.querySelector(".form-name");
let searchDate = document.querySelector(".form-date");
let searchDay = document.querySelector(".day-buttons");

// Search name

// Rendering the result to HTML
// WELCOME TO MY MONSTER FUNCTION! IT WILL EAT YOU UP AND SPIT YOU OUT!

const renderDateOfName = (data, name, country) => {
    console.log(data.results);
    
    document.querySelector(".name").innerHTML = "";
    document.querySelector(".date").innerHTML = "";
    document.querySelector(".other-names").innerHTML = "";

    // If array length in data.results < 1, print not success.
    // If array is >= 1, loop through array
    // If the result in the current iteration is the same as name, date = result
    // Else if it is not the same, find the result where there is more than one name
    // If name match, date = result of find
    // If there is a match and date is then true, print success, else if date is false, print not success.
    // Else if the array === 1, print success.

    let date = null;

    if(data.results.length < 1) {
        document.querySelector(".name").innerHTML = `Sorry, ${name} does not have a nameday :(`;
    } else if(data.results.length >= 1) {
        for(let i = 0; i < data.results.length; i++) {
            if(data.results[i].name === name) {
                date = data.results[i];
                i = data.results.length + 1;
            } else {
                date = data.results.find(result => {
                    if(result.name.indexOf(",") > 1) {
                        let res = result.name
                        .split(", ")
                        .find(result => result === name);
                        if(res === name) {
                            return result;
                        }
                    }
                });
            }
        }

        if(date) {
            document.querySelector(".name").innerHTML = name;
            document.querySelector(".date").innerHTML = `${date.day}/${date.month}`;
        } else {
            document.querySelector(".name").innerHTML = `Sorry, ${name} does not have a nameday :(`;
        }
    }

    // Get the names that also has nameday on the date that the searched name has
    if(date) {
        getName(date.month, date.day, country)
        .then(data => {
            // Take the name that has nameday the same day as the name searched on.
            // Make an array out of the names, filter so that only the ones that are not the name searched on remains, and then join back into a new fancy array. Boom.
            if(data.data[0].namedays[country].length !== name.length) {
                let names = data.data[0].namedays[country]
                .split(", ")
                .filter(item => item !== name)
                .join(", ");

                document.querySelector(".other-names").innerHTML = names;
            } else {
                document.querySelector(".other-names").innerHTML = "Only this person has nameday on this day.";
            }
        });
    }
};


searchName.addEventListener("submit", e => {
    e.preventDefault();

    let country = document.querySelector(".country").value;
    
    // Get value from input
    // Turn it into lowercase
    // Set the first character in the name to uppercase, and then add the rest of the name.
    // Because otherwise the find method will not work...
    let name = e.target.nameInput.value;
    name = name.toLowerCase();
    name = name[0].toUpperCase() + name.slice(1);

    // Fetch from API
    getDate(name, country)
    .then(data => {
        // Render the result from the API to HTML
        renderDateOfName(data, name, country);
    });
});



// Search date

const renderNameOnDate = (data, country) => {
    console.log(data);

    let name = data.data[0].namedays[country];
    
    document.querySelector(".name").innerHTML = "";
    document.querySelector(".date").innerHTML = "";
    document.querySelector(".other-names").innerHTML = "";

    document.querySelector(".name").innerHTML = name;
    document.querySelector(".date").innerHTML = `${data.data[0].dates.day}/${data.data[0].dates.month}`

};


searchDate.addEventListener("submit", e => {
    e.preventDefault();

    let country = document.querySelector(".country").value;

    // Get value from input ex.("2020-01-01")
    // Split the result into an array, splitting where the "-" is
    // Getting the month and the day from index 1 and 2 of the array
    // Casting the strings in to numbers, because the API does not want zeros in the beginning of a number.
    let date = e.target.dateInput.value;
    date = date.split("-");
    let month = Number(date[1]);
    let day = Number(date[2]);

    // Fetch from API
    getName(month, day, country)
    .then(data => {
        // Render the result from the API to HTML
        renderNameOnDate(data, country);
    });
});

// Search day 

const renderNameOnDay = (data, country) => {
    console.log(data);

    document.querySelector(".name").innerHTML = "";
    document.querySelector(".date").innerHTML = "";
    document.querySelector(".other-names").innerHTML = "";

    document.querySelector(".name").innerHTML = data.data[0].namedays[country];
    document.querySelector(".date").innerHTML = `${data.data[0].dates.day}/${data.data[0].dates.month}`;
    document.querySelector(".other-names").innerHTML = "";

};

searchDay.addEventListener("click", e => {
    let day = e.target.id;
    let timezone = "";
    let country = document.querySelector(".country").value;

    getNameOnDay(day, country)
    .then(data => {
        renderNameOnDay(data, country);
    });
});
