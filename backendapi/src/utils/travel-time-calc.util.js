import { Client } from "@googlemaps/google-maps-services-js";
import * as dotenv from "dotenv";
dotenv.config();

//returns travel time in milliseconds
export async function getTravelTimeInSeconds(origin, destination) {
    console.log("origin", origin);
    console.log("destination", destination);
    const client = new Client({});
    try {
        const r = await client
            .directions({
                params: {
                    origin,
                    destination,
                    key: process.env.GOOGLE_MAPS_API_KEY,
                },
                timeout: 1000, // milliseconds
            });
        return r.data.routes[0].legs[0].duration.value;
    } catch (e) {
        console.error(e.message);
        throw e;
    }
}