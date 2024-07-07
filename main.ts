import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.46/deno-dom-wasm.ts";
import { Readability } from "npm:@mozilla/readability";

async function handler(request: Request): Promise<Response> {
  if (request.method != "POST") {
    const body = JSON.stringify({
      message: "Wrong method, accept only post",
    });
    console.log("Wrong method, accept only post");
    return new Response(body, {
      status: 405,
      headers: {
        "content-type": "application/json; charset=utf-8",
        Allow: "POST",
      },
    });
  }

  const body = await request.text();
  if (!body) {
    const body = JSON.stringify({
      message: "Bad request, send html content to be cleaned",
    });
    console.log("Empty body is bad request");
    return new Response(body, {
      status: 400,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }

  try {
    const document = new DOMParser().parseFromString(body, "text/html");
    if (!document) {
      throw new Error("Failed to parse HTML document");
    }
    const reader = new Readability(document);
    const article = reader.parse();
    if (!article) {
      throw new Error("Failed to parse article from document");
    }
    const responseData = JSON.stringify(article);
    console.log(`Article processed: title=${article.title}`);
    return new Response(responseData, {
      status: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    console.error("Error processing article:", error.message);
    const body = JSON.stringify({ message: "Internal server error" });
    return new Response(body, {
      status: 500,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
}

const port = parseInt(Deno.env.get("PORT") || "3000", 10);
console.log(`Server running on port ${port}`);
serve(handler, { port });
