/**
 * Nameday App
 * 
 * Search on name to get what date
 * Search on date to get what name(s)
 * 
 * Search on country and timezone
 * 
 */


let searchName = document.querySelector(".form-name");
let searchDate = document.querySelector(".form-date");
let searchDay = document.querySelector(".day-buttons");


// Add options of timezones to select.
const renderListOfTimezones = async (data) => {
    let select = document.querySelector(".timezones");
    data.forEach(zone => {
        select.innerHTML += `<option>${zone.zone}</option>`
    });
};


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
            div.innerHTML += `<p class="name">Sorry, ${name} does not have a nameday</p>`
        } else {
            div.innerHTML += `<p class="name">${name}</p>`;
        }
    }

    if(names) {
        div.innerHTML += `<p class="other-names">${names}</p>`;
    }

}



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
                    if(data.data[0].namedays[country].length !== name.length) {
                        names = data.data[0].namedays[country]
                        .split(", ")
                        .filter(item => item !== name)
                        .join(", ");

                        displayResult(result.day, result.month, name, names);
                    }
                });
            });
        // If there is only one name
        } else {
            displayResult(date.day, date.month, name, names);
        }
    }
};



const renderNameOnDate = (data, country) => {
    document.querySelector(".display").innerHTML = "";
    displayResult(data.data[0].dates.day, data.data[0].dates.month, data.data[0].namedays[country], null);    
};



const renderNameOnDay = (data, country) => {
    document.querySelector(".display").innerHTML = "";
    displayResult(data.data[0].dates.day, data.data[0].dates.month, data.data[0].namedays[country], null);
};



getJSON("src/zone.json")
.then(data => {
    renderListOfTimezones(data);
})
.catch(err => {
    alert(`Unable to fetch timezones, ${err}`);
});



searchDay.addEventListener("click", e => {
    let day = e.target.id;
    let timezone = document.querySelector(".timezones").value;
    let country = document.querySelector(".country").value;

    if(checkCountryAndTimezone(country, timezone)) {
        getNameOnDay(day, country, timezone)
        .then(data => {
            renderNameOnDay(data, country);
        });
    }
});



searchName.addEventListener("submit", e => {
    e.preventDefault();

    let timezone = document.querySelector(".timezones").value;
    let country = document.querySelector(".country").value;
    
    let name = e.target.nameInput.value;

    if(!name) {
        document.querySelector(".display").innerHTML = `
        <div class="alert alert-warning">Please enter a name.</div>`;
        return;
    }

    name = name.toLowerCase().trim();
    name = name[0].toUpperCase() + name.slice(1);

    if(checkCountryAndTimezone(country, timezone)) {
        // Fetch from API
        getDate(name, country, timezone)
        .then(data => {
            // Render the result from the API to HTML
            renderDateOfName(data, name, country);
        });
    }
});



searchDate.addEventListener("submit", e => {
    e.preventDefault();

    let timezone = document.querySelector(".timezones").value;
    let country = document.querySelector(".country").value;
    
    let date = e.target.dateInput.value;

    if(!date) {
        document.querySelector(".display").innerHTML = `
        <div class="alert alert-warning">Please choose a date.</div>`;
        return;
    }

    date = date.split("-");
    let month = Number(date[1]);
    let day = Number(date[2]);

    if(checkCountryAndTimezone(country, timezone)) {
        // Fetch from API
        getName(month, day, country, timezone)
        .then(data => {
            // Render the result from the API to HTML
            renderNameOnDate(data, country);
        });
    }
});
