/**
 * Nameday API
 */

 const getDate = async (name, country) => {
     const response = await fetch(`https://api.abalin.net/getdate?name=${name}&country=${country}`);
     return await response.json();
 }

const getName = async (month, day, country) => {
    const response = await fetch(`https://api.abalin.net/namedays?country=${country}&month=${month}&day=${day}`);
    return await response.json();
}