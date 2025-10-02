const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export async function generateAIResponse(userMessage, recipes = null) {
    try {
        console.log("Generating AI response for:", userMessage)

        let prompt = `Eres un asistente de cocina amigable y experto en español. Responde de manera conversacional y útil.

Usuario: ${userMessage}`

        if (recipes && recipes.length > 0) {
            prompt += `\n\nHe encontrado ${recipes.length} recetas que podrían interesarte:\n`
            recipes.forEach((recipe, index) => {
                prompt += `${index + 1}. ${recipe.title} (${recipe.readyInMinutes} minutos)\n`
            })
            prompt +=
                "\nPor favor, presenta estas recetas de manera atractiva y sugiere cuál podría ser mejor según el contexto."
        }

        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: prompt
            }),
        })

        if (!response.ok) {
            throw new Error(`Backend API error: ${response.status}`)
        }

        const data = await response.json()
        const aiResponse = data.response || "Lo siento, no pude generar una respuesta."

        console.log("AI response generated")
        return aiResponse
    } catch (error) {
        console.error("Error generating AI response:", error)
        return getFallbackResponse(userMessage, recipes)
    }
}

function getFallbackResponse(userMessage, recipes) {
    if (recipes && recipes.length > 0) {
        return `¡Genial! He encontrado ${recipes.length} recetas deliciosas para ti. Puedes ver los detalles de cada una abajo y guardar tus favoritas. ¿Te gustaría que te ayude con algo más?`
    }

    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("hola") || lowerMessage.includes("buenos")) {
        return "¡Hola! 👋 ¿Qué te gustaría cocinar hoy? Puedo ayudarte a buscar recetas, sugerir ingredientes o darte ideas para tus comidas."
    }

    if (lowerMessage.includes("gracias")) {
        return "¡De nada! 😊 Estoy aquí para ayudarte con cualquier duda sobre cocina. ¿Necesitas algo más?"
    }

    if (lowerMessage.includes("ayuda")) {
        return "Puedo ayudarte a:\n• Buscar recetas por ingredientes\n• Sugerir ideas de comidas\n• Guardar tus recetas favoritas\n\n¿Qué te gustaría hacer?"
    }

    return "Entiendo que quieres saber sobre comida. Intenta preguntarme sobre recetas específicas, ingredientes que tengas, o el tipo de comida que te gustaría preparar. ¡Estoy aquí para ayudarte! 🍳"
}