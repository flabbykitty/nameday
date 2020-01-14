/**
 * Nameday API
 */

 const getDate = async (name, country, timezone) => {
     const response = await fetch(`https://api.abalin.net/getdate?name=${name}&country=${country}&timezone=${timezone}`);
     return await response.json();
 }

const getName = async (month, day, country, timezone) => {
    const response = await fetch(`https://api.abalin.net/namedays?country=${country}&month=${month}&day=${day}&timezone=${timezone}`);
    return await response.json();
}

const getNameOnDay = async (day, country, timezone) => {
    const response = await fetch(`https://api.abalin.net/${day}?timezone=${timezone}&country=${country}`);
    return await response.json();
}

const getJSON = async (url) => {
    const response = await fetch(url);
    return await response.json();
}