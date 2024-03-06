
import { BedrockRuntimeClient, InvokeModelCommand, AccessDeniedException } from '@aws-sdk/client-bedrock-runtime';



async function llm (prompt: string){
    const keyId = process.env.ACCESSKEY_ID
    const secretKey = process.env.ACCESSKEY_SECRET
    console.log('keyId', keyId)
    const client = new BedrockRuntimeClient({ region: "us-east-1", credentials: {accessKeyId: keyId, secretAccessKey: secretKey}});

        const modelId = "anthropic.claude-v2";

        /* Claude requires you to enclose the prompt as follows: */
        const enclosedPrompt = `Human: ${prompt}\n\nAssistant:`;

        const payload = {
            prompt: enclosedPrompt,
            max_tokens_to_sample: 1000,
            temperature: 0.5,
            stop_sequences: ["\n\nHuman:"],
        };

        const command = new InvokeModelCommand({
            body: JSON.stringify(payload),
            contentType: "application/json",
            accept: "application/json",
            modelId,
          });
        
          try {
            const response = await client.send(command);
            const decodedResponseBody = new TextDecoder().decode(response.body);
        
            /** @type {ResponseBody} */
            const responseBody = JSON.parse(decodedResponseBody);
        
            return responseBody.completion;
          } catch (err) {
            if (err instanceof AccessDeniedException) {
              console.error(
                `Access denied. Ensure you have the correct permissions to invoke ${modelId}.`,
              );
            } else {
              console.error(err)
              throw err;
            }
          }
}

export default llm;