//import { Configuration, OpenAIApi } from "openai";
const { Configuration, OpenAIApi } = require("openai");
module.exports = async function(context, req) {
    const OPENAI_API_KEY = "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"
    const configuration = new Configuration({
        apiKey: OPENAI_API_KEY,
        organization:"org-7mkGMU85Hfkk0eHX3mXTkNh8"
    });
    const ingredients = req.body;
    const openai = new OpenAIApi(configuration);
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{"role": "system", "content": "You are a helpful assistant."}, 
            {role: "user",
            content: `I am sending you a list of products I have. 
            every product has its name, expiration date and amount. 
            Suggest a recipe including part of the products I have,
            try to use as much as posible products with sooner expiration dates.
            in your answer don't share the expiration dates and
             write only the recipe with no introduction and with no notes.
             also, in the recipe, show the translated to english product names and not the original product names.
            The list:${ingredients}`}],
        });
        const recipe = completion.data.choices[0].message;
        context.res = {
            body: recipe,
        };
    } catch (error) {
        context.res = {status: 500, body: error.message,};
    }
};
