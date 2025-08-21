/**
 * Fetches data from the AI model based on a given prompt.
 * @param {string} prompt - The prompt to send to the AI model.
 * @returns {Promise<string>} A promise that resolves with the AI-generated text.
 * @throws {Error} Throws an error if the API call fails or the response is invalid.
 */
async function fetchAiData(prompt) {
    // The API key will be handled by the environment, so we leave it empty here.
    const apiKey = ""; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }]
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // If the server responds with a non-2xx status, throw an error.
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Safely access the generated text from the response structure.
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            return text;
        } else {
            // If the response structure is not as expected, throw an error.
            throw new Error("Struktur respons API tidak valid atau kosong.");
        }
    } catch (error) {
        // Log the detailed error and re-throw it to be handled by the calling function.
        console.error("Error calling AI API:", error);
        throw error;
    }
}
