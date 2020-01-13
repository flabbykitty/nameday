/**
 * Nameday API
 */

 const getDate = async (name, country) => {
     const response = await fetch(`https://api.abalin.net/getdate?name=${name}&country=${country}`);
     return await response.json();
 }

const getName = async (month, day, country) => {
    const response = await fetch(`https://api.abalin.net/namedays?country=${country}&month=${month}&day=${day}&timezone=America/Toronto`);
    return await response.json();
}

const getNameOnDay = async (day, country) => {
    const response = await fetch(`https://api.abalin.net/${day}?timezone=America/Toronto&country=${country}`);
    return await response.json();
}