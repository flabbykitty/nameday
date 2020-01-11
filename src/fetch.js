/**
 * Nameday API
 */

 const getDate = async name => {
     const response = await fetch(`https://api.abalin.net/getdate?name=${name}&country=se`);
     return await response.json();
 }

const getName = async (month, day) => {
    const response = await fetch(`https://api.abalin.net/namedays?country=se&month=${month}&day=${day}`);
    return await response.json();
}