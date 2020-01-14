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


const renderListOfTimezones = async (data) => {
    let select = document.querySelector(".timezones");
    data.forEach(zone => {
        select.innerHTML += `<option>${zone.zone}</option>`
    })

}



const renderDateOfName = (data, name, country) => {
    console.log(data.results);
    
    document.querySelector(".name").innerHTML = "";
    document.querySelector(".date").innerHTML = "";
    document.querySelector(".other-names").innerHTML = "";

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
            if(data.data[0].namedays[country].length !== name.length) {
                let names = data.data[0].namedays[country]
                .split(", ")
                .filter(item => item !== name)
                .join(", ");

                document.querySelector(".other-names").innerHTML = names;
            }
        });
    }
};



const renderNameOnDate = (data, country) => {
    console.log(data);

    let name = data.data[0].namedays[country];
    
    document.querySelector(".name").innerHTML = "";
    document.querySelector(".date").innerHTML = "";
    document.querySelector(".other-names").innerHTML = "";
    
    document.querySelector(".name").innerHTML = name;
    document.querySelector(".date").innerHTML = `${data.data[0].dates.day}/${data.data[0].dates.month}`
    
};



const renderNameOnDay = (data, country) => {
    console.log(data);
    
    document.querySelector(".name").innerHTML = "";
    document.querySelector(".date").innerHTML = "";
    document.querySelector(".other-names").innerHTML = "";
    
    document.querySelector(".name").innerHTML = data.data[0].namedays[country];
    document.querySelector(".date").innerHTML = `${data.data[0].dates.day}/${data.data[0].dates.month}`;
    document.querySelector(".other-names").innerHTML = "";

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
    
    getNameOnDay(day, country, timezone)
    .then(data => {
        renderNameOnDay(data, country);
    });
});

searchName.addEventListener("submit", e => {
    e.preventDefault();

    let timezone = document.querySelector(".timezones").value;
    let country = document.querySelector(".country").value;
    
    let name = e.target.nameInput.value;
    name = name.toLowerCase();
    name = name[0].toUpperCase() + name.slice(1);
    
    // Fetch from API
    getDate(name, country, timezone)
    .then(data => {
        // Render the result from the API to HTML
        renderDateOfName(data, name, country);
    });
});

searchDate.addEventListener("submit", e => {
    e.preventDefault();

    let timezone = document.querySelector(".timezones").value;
    let country = document.querySelector(".country").value;
    
    let date = e.target.dateInput.value;
    date = date.split("-");
    let month = Number(date[1]);
    let day = Number(date[2]);

    // Fetch from API
    getName(month, day, country, timezone)
    .then(data => {
        // Render the result from the API to HTML
        renderNameOnDate(data, country);
    });
});
