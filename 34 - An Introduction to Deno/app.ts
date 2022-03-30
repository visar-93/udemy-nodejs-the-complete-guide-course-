import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

await app.listen({ port: 8000 });










// const text = 'This is a test and it should be stored in a file!';

// const encoder = new TextEncoder();
// const data = encoder.encode(text);
// // const data = new TextEncoder().encode(text);

// Deno.writeFile('message.txt', data ).then(() => {
//     console.log('Wrote to file!');
// });
