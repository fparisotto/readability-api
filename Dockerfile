FROM denoland/deno:1.44.4

WORKDIR /app
EXPOSE 3000
COPY ./deno.jsonc .
COPY ./deno.lock .
COPY ./main.ts .
RUN deno cache main.ts
CMD ["run", "--allow-net", "--allow-env", "main.ts"]
