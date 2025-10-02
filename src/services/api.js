const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export async function searchRecipes(query) {
    try{
        console.log('Searching recipes for: ', query)

        if(!SPOONACULAR_API_KEY){
            console.warn('Spoonacular API key is missing')
            return getMockRecipes()
        }

        const response = await fetch(
            `${SPOONACULAR_BASE_URL}/recipes/complexSearch?query=${encodeURIComponent(query)}&number=6&addRecipeInformation=true&fillIngredients=true&language=es&apiKey=${SPOONACULAR_API_KEY}`,
            )

        if(!response.ok){
            throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        console.log('Recipes found: ', data.results?.length || 0)

        return data.results || []
    }catch(error){
        console.error('Error searching recipes: ', error)
        return getMockRecipes()
    }
}

export async function sendChatMessage(message) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        })

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        return data.response
    } catch (error) {
        console.error('Error sending chat message:', error)
        throw error
    }
}

// Recetas en caso de fallo
function getMockRecipes() {
    return [
        {
            id: 1,
            title: "Paella Valenciana Tradicional",
            image: "/paella-valenciana-con-mariscos-y-arroz.jpg",
            readyInMinutes: 45,
            servings: 4,
            healthScore: 75,
            sourceUrl: "#",
            usedIngredients: [{ name: "arroz" }, { name: "pollo" }, { name: "mariscos" }, { name: "azafrán" }],
        },
        {
            id: 2,
            title: "Tacos al Pastor Mexicanos",
            image: "/tacos-al-pastor-con-pi-a-y-cilantro.jpg",
            readyInMinutes: 30,
            servings: 6,
            healthScore: 68,
            sourceUrl: "#",
            usedIngredients: [{ name: "carne de cerdo" }, { name: "piña" }, { name: "cilantro" }, { name: "tortillas" }],
        },
        {
            id: 3,
            title: "Ensalada César con Pollo",
            image: "/ensalada-cesar-con-pollo-a-la-parrilla.jpg",
            readyInMinutes: 20,
            servings: 2,
            healthScore: 82,
            sourceUrl: "#",
            usedIngredients: [{ name: "lechuga romana" }, { name: "pollo" }, { name: "parmesano" }, { name: "crutones" }],
        },
    ]
}