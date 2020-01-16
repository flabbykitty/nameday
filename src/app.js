/**
 * Nameday App
 * 
 * Search on name to get what date
 * Search on date to get what name(s)
 * 
 * Search on country and timezone
 * 
 */


/**
 * Global variables
 */


let searchName = document.querySelector(".form-name");
let searchDate = document.querySelector(".form-date");
let searchDay = document.querySelector(".day-buttons");


/**
 * Functions 
 */


// Add options of timezones to select tag.
const renderListOfTimezones = async (data) => {
    let select = document.querySelector(".timezones");
    data.forEach(zone => {
        select.innerHTML += `<option>${zone.zone}</option>`
    });
};


// Add options of countries to select tag.
const renderListOfCountries = async (data) => {
    let select = document.querySelector(".countries");
    data.forEach(country => {
        select.innerHTML += `<option value="${country.code}">${country.country}</option>`
    });
};


// Check if country and timezone is chosen
const checkCountryAndTimezone = (country, timezone) => {
    if(!country || !timezone) {
        document.querySelector(".display").innerHTML = `
        <div class="alert alert-warning">Please choose both country and timezone.</div>`;
        return false;
    } else {
        return true;
    }
};


// Displaying results depending on what result we get back
const displayResult = (day, month, name, names) => {
    let div = document.createElement("DIV");
    div.classList.add("w-50");
    document.querySelector(".display").append(div);

    if(day) {
        div.innerHTML += `<p class="date">${day}/${month}</p>`;
    }

    if(name) {
        if(!day) {
            div.innerHTML += `<div class="alert alert-warning">Sorry, ${name} does not have a nameday</div>`
        } else {
            div.innerHTML += `<p class="name">${name}</p>`;
        }
    }

    if(names) {
        div.innerHTML += `<p class="other-names">${names}</p>`;
    }

}


// Handle the results of searching on a name
const renderDateOfName = (data, name, country) => {
    document.querySelector(".display").innerHTML = "";

    let date = null;

    // If there is less then 1 item in array, there is no result, and no name
    if(data.results.length < 1) {
        displayResult(null, null, name, null);
    // If there is 1 or more item in array, I have to find the right one.
    } else if(data.results.length >= 1) {
        // For each item in the array, check if the current item is the same as the searched name
        // And then save that info in variable date.
        for(let i = 0; i < data.results.length; i++) {
            if(data.results[i].name === name) {
                date = data.results[i];
                i = data.results.length + 1;
            // If no name exactly match, I have to check if there are more than one name, and maybe it's among them.
            } else {
                date = data.results.filter(result => {
                    // Find the result where there is a comma to seperate two or more names.
                    if(result.name.indexOf(",") > 1) {
                        // Split the string at the commas, and make an array
                        let res = result.name
                        .split(", ")
                        // Find in the array where the searched name match
                        .find(result => result === name);
                        if(res === name) {
                            return result;
                        }
                    }
                });
            }
        }
    }

    if(date) {
        let names = "";
        // If there are more then one name
        if(date[0]) {
            // Get the names that has the same nameday
            date.forEach(result => {
                getName(result.month, result.day, country)
                    .then(data => {
                        // If there are more than one name on the same nameday
                        // Get a string of the other names that has the same nameday, without the searched name
                        if(data.data[0].namedays[country].length !== name.length) {
                            names = data.data[0].namedays[country]
                            .split(", ")
                            .filter(item => item !== name)
                            .join(", ");
                        }

                        displayResult(result.day, result.month, name, names);
                    })
                    .catch(err => {
                        document.querySelector(".display").innerHTML = `
                        <div class="alert alert-danger">Sorry, I'm having trouble getting the names for you. <br> ${err}</div>`;
                    });
            });
        // If there is only one name
        } else {
            displayResult(date.day, date.month, name, names);
        }
    }
};


// Handle the result of searching on a date
const renderNameOnDate = (data, country) => {
    if(data.data[0].namedays[country] === "n/a") {
        document.querySelector(".display").innerHTML = `
        <div class="alert alert-warning">No one has nameday on this day</div>`;
    } else {
        document.querySelector(".display").innerHTML = "";
        displayResult(data.data[0].dates.day, data.data[0].dates.month, data.data[0].namedays[country], null);    
    }
};


// Handle the result of searching on yesterday/today/tomorrow
const renderNameOnDay = (data, country) => {
    document.querySelector(".display").innerHTML = "";
    displayResult(data.data[0].dates.day, data.data[0].dates.month, data.data[0].namedays[country], null);
};



/**
 * Calling functions
 */


// Fetch timezones from json file
getJSON("src/zone.json")
    .then(data => {
        renderListOfTimezones(data);
    })
    .catch((err) => {
        console.error(err);
        let select = document.querySelector(".timezones");
        select.innerHTML += `<option>Unable to get timezones</option>`
    });


// Fetch countries from json file
getJSON("src/country.json")
.then(data => {
    renderListOfCountries(data);
})
.catch((err) => {
    console.error(err);
    let select = document.querySelector(".countries");
    select.innerHTML += `<option>Unable to get countries</option>`
});



/**
 * Event listeners
 */


searchDay.addEventListener("click", e => {
    let day = e.target.id;
    let timezone = document.querySelector(".timezones").value;
    let country = document.querySelector(".countries").value;

    if(checkCountryAndTimezone(country, timezone)) {
        getNameOnDay(day, country, timezone)
            .then(data => {
                renderNameOnDay(data, country);
            })
            .catch(err => {
                document.querySelector(".display").innerHTML = `
                <div class="alert alert-danger">Sorry, I'm having trouble getting the names for you. <br> ${err}</div>`;
            });
    }
});



searchName.addEventListener("submit", e => {
    e.preventDefault();

    let timezone = document.querySelector(".timezones").value;
    let country = document.querySelector(".countries").value;
    
    let name = e.target.nameInput.value;
    e.target.nameInput.value = "";

    if(!name) {
        document.querySelector(".display").innerHTML = `
        <div class="alert alert-warning">Please enter a name.</div>`;
        return;
    }

    name = name.toLowerCase().trim();
    name = name[0].toUpperCase() + name.slice(1);

    if(checkCountryAndTimezone(country, timezone)) {
        getDate(name, country, timezone)
            .then(data => {
                renderDateOfName(data, name, country);
            })
            .catch(err => {
                document.querySelector(".display").innerHTML = `
                <div class="alert alert-danger">Sorry, I'm having trouble getting the date for you. <br> ${err}</div>`;
            });
    }
});



searchDate.addEventListener("submit", e => {
    e.preventDefault();

    let timezone = document.querySelector(".timezones").value;
    let country = document.querySelector(".countries").value;
    
    let date = e.target.dateInput.value;
    e.target.dateInput.value = "";

    if(!date) {
        document.querySelector(".display").innerHTML = `
        <div class="alert alert-warning">Please choose a date.</div>`;
        return;
    }

    date = date.split("-");
    let month = Number(date[1]);
    let day = Number(date[2]);

    if(checkCountryAndTimezone(country, timezone)) {
        getName(month, day, country, timezone)
            .then(data => {
                renderNameOnDate(data, country);
            })
            .catch(err => {
                document.querySelector(".display").innerHTML = `
                <div class="alert alert-danger">Sorry, I'm having trouble getting the names for you. <br> ${err}</div>`;
            });
    }
});
