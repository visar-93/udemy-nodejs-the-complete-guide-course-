import {MongoClient, Database } from "https://deno.land/x/mongo@v0.8.0/mod.ts";

let db: Database;

export function connect() {
  const client = new MongoClient();
  client.connectWithUri(
      "mongodb+srv://user:password@cluster1.epldc.mongodb.net/?retryWrites=true&w=majority",
    );
    db = client.database('todo-app');
}

export function getDb() {
  return db;
}

