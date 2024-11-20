import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request, res: Response) {
    try {
        const prompt = 'You are a helpful assistant.'; // The system prompt

        // Stream response from the OpenAI model
        const result = streamText({
            model: openai('gpt-4-turbo'),
            system: prompt, // Using the prompt as a system message
        });

        // Await the result and get the response text
        const response = await result.toTextStreamResponse();

        // Send the response with the generated text
        res.json({
            response: response.body, // Assuming response.body is the text generated
        });
    } catch (error) {
        // Handle error if something goes wrong
        console.error('Error during streaming:', error);
        res.json({ error: 'Internal Server Error' });
    }
}
