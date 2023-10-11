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

// import * as logger from "firebase-functions/logger";
// logger.info("Hello logs!", { structuredData: true });

export const subscribe_to_newsletters = onRequest(async (request, response) => {
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
    }

    response.send({
        name,
        email,
    });
});
