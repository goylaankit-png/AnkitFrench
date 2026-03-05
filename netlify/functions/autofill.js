exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { frenchWord, apiKey } = JSON.parse(event.body);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `You are a French language expert helping a TEF exam student. For the French word/phrase: "${frenchWord}" Return ONLY valid JSON (no markdown): {"english":"English meaning","example_fr":"Natural French sentence at TEF B1/B2 level","example_en":"English translation","category":"one of: Verbs, Nouns, Adjectives, Professions, Expressions, Grammar, Other","icon":"single emoji"}`
      }]
    })
  });

  const data = await response.json();
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  };
};
