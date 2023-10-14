/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 *
 */

import { onRequest } from "firebase-functions/v2/https";
import { Validator } from "node-input-validator";
import { initializeApp } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
// import * as logger from "firebase-functions/logger";
// logger.info("Hello logs!", { structuredData: true });

let initialised = false;

export const subscribe_to_newsletters = onRequest(async (request, response) => {
    if (!initialised) {
        initializeApp();
        initialised = true;
    }

    const db = getFirestore();

    const { name, email } = request.body;

    const v = new Validator(
        { name, email },
        { name: "required|minLength:2|maxLength:50|regex:^[a-zA-Z\\s]+$", email: "required|email" }
    );

    const matched = await v.check();

    if (!matched) {
        const error = v.errors;
        if (error?.name?.rule === "regex") {
            error.name.message = "The name must be alphabetic characters only.";
        }

        response.status(400).send(v.errors);
        return;
    }

    const subscribersRef = db.collection("subscribers");
    const subscribers = await subscribersRef.where("email", "==", email).get();
    const [hasBeenSubscribed] = subscribers?.docs?.map((doc) => doc?.data()?.subscribed);

    // Has been subscribed
    if (subscribers.size > 0 && hasBeenSubscribed) {
        response.status(400).send({
            email: {
                message: "You have already subscribed. Thank you",
            },
        });
        return;
    }

    // Has not been subscribed. Most likely existing subscriber but unsubscribed
    if (subscribers.size > 0 && !hasBeenSubscribed) {
        const [subscriber] = subscribers.docs;
        await subscriber.ref.update({ subscribed: true });
        response.send({
            success: true,
            message: "Thank you for subscribing again.",
        });
        return;
    }

    await subscribersRef.add({ name, email, subscribed: true });

    response.send({
        success: true,
        message: "Thank you for subscribing.",
    });
});
