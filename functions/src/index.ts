import * as sgMail from "@sendgrid/mail";
import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import { Validator } from "node-input-validator";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import logger from "firebase-functions/logger";

type EmailMessage = {
    to: string;
    from: string;
    subject: string;
    text: string;
    html: string;
};

setGlobalOptions({ maxInstances: 10 });
let initialised = false;

async function sendEmail(message: EmailMessage) {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string;

    sgMail.setApiKey(SENDGRID_API_KEY);

    try {
        await sgMail.send(message);
    } catch (error) {
        logger.error(error);
    }
}

function buildEmailMessageForContactForm(
    name: string,
    email: string,
    mobile: string,
    subject: string,
    message: string
) {
    const NOTIFICATION_TO_EMAIL = process.env.NOTIFICATION_TO_EMAIL as string;
    const NOTIFICATION_FROM_EMAIL = process.env.NOTIFICATION_FROM_EMAIL as string;

    const emailMessage = {
        to: NOTIFICATION_TO_EMAIL,
        from: NOTIFICATION_FROM_EMAIL,
        subject: "New Contact Form",
        text: `New Contact Form\n\n Name: ${name} \n Email: ${email} \n Mobile: ${mobile} \n Subject: ${subject} \n Message: ${message}`,
        html: `New Contact Form<br/><br/><strong>Name:</strong>  ${name}<br/> <strong>Email:</strong> ${email}<br/> <strong>Mobile:</strong> ${mobile}<br/> <strong>Subject:</strong> ${subject}<br/> <strong>Message:</strong> ${message}`,
    };
    return emailMessage;
}

function buildEmailMessageForNewSubscriber(name: string, email: string) {
    const NOTIFICATION_TO_EMAIL = process.env.NOTIFICATION_TO_EMAIL as string;
    const NOTIFICATION_FROM_EMAIL = process.env.NOTIFICATION_FROM_EMAIL as string;

    const message = {
        to: NOTIFICATION_TO_EMAIL,
        from: NOTIFICATION_FROM_EMAIL,
        subject: "New Subscriber",
        text: `New Subscriber\n\n Name: ${name} \n Email: ${email}`,
        html: `New Subscriber<br/><br/><strong>Name:</strong>  ${name}<br/> <strong>Email:</strong> ${email}`,
    };
    return message;
}

function buildEmailMessageForUnsubscribe(name: string, email: string) {
    const NOTIFICATION_TO_EMAIL = process.env.NOTIFICATION_TO_EMAIL as string;
    const NOTIFICATION_FROM_EMAIL = process.env.NOTIFICATION_FROM_EMAIL as string;

    const message = {
        to: NOTIFICATION_TO_EMAIL,
        from: NOTIFICATION_FROM_EMAIL,
        subject: "Unsubscribe",
        text: `Unsubscribe\n\n Name: ${name} \n Email: ${email}`,
        html: `Unsubscribe<br/><br/><strong>Name:</strong>  ${name}<br/> <strong>Email:</strong> ${email}`,
    };
    return message;
}

function buildEmailMessageForSubscriberAgain(name: string, email: string) {
    const NOTIFICATION_TO_EMAIL = process.env.NOTIFICATION_TO_EMAIL as string;
    const NOTIFICATION_FROM_EMAIL = process.env.NOTIFICATION_FROM_EMAIL as string;

    const message = {
        to: NOTIFICATION_TO_EMAIL,
        from: NOTIFICATION_FROM_EMAIL,
        subject: "Subscriber Again",
        text: `Subscriber Again\n\n Name: ${name} \n Email: ${email}`,
        html: `Subscriber Again<br/><br/><strong>Name:</strong>  ${name}<br/> <strong>Email:</strong> ${email}`,
    };
    return message;
}

// Contact form
export const contact_form = onRequest({ cors: "*" }, async (request, response) => {
    if (!initialised) {
        admin.initializeApp();
        initialised = true;
    }

    const db = getFirestore();

    const { name, email, mobile, subject, message, recaptchaToken } = request.body as {
        name: string;
        email: string;
        mobile: string;
        subject: string;
        message: string;
        recaptchaToken: string;
    };

    // Validate recaptcha
    const RE_CAPTCHA_SECRET_KEY = process.env.RE_CAPTCHA_SECRET_KEY as string;

    const responseRecaptcha = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${RE_CAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });

    const { success } = await responseRecaptcha.json();

    if (!success) {
        response.status(400).send({
            message: "Invalid recaptcha",
        });
        return;
    }

    const v = new Validator(
        { name, email, mobile, subject, message },
        {
            name: "required|minLength:2|maxLength:50|regex:^[a-zA-Z\\s]+$",
            email: "required|email",
            mobile: "required|maxLength:20",
            subject: "required|minLength:2|maxLength:50",
            message: "required|minLength:2|maxLength:1000",
        }
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

    const contactUsRef = db.collection("contact-form");
    await contactUsRef.add({ name, email, mobile, subject, message });
    await sendEmail(buildEmailMessageForContactForm(name, email, mobile, subject, message));

    response.send({
        success: true,
        message: "Thank you for contacting us. We will get back to you shortly.",
    });
});

// Subscribe to newsletters
export const subscribe_to_newsletters = onRequest({ cors: "*" }, async (request, response) => {
    if (!initialised) {
        admin.initializeApp();
        initialised = true;
    }

    const db = getFirestore();

    const { name, email, recaptchaToken } = request.body as { name: string; email: string; recaptchaToken: string };

    // Validate recaptcha
    const RE_CAPTCHA_SECRET_KEY = process.env.RE_CAPTCHA_SECRET_KEY as string;

    const responseRecaptcha = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${RE_CAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });

    const { success } = await responseRecaptcha.json();

    if (!success) {
        response.status(400).send({
            message: "Invalid recaptcha",
        });
        return;
    }

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
    const subscribers = await subscribersRef.where("email", "==", email?.toLowerCase()).get();
    const [hasBeenSubscribed] = subscribers?.docs?.map((doc) => doc?.data()?.subscribed);

    // Has been subscribed
    if (subscribers.size > 0 && hasBeenSubscribed) {
        response.status(400).send({
            message: "You have already subscribed. Thank you",
        });
        return;
    }

    // Has not been subscribed. Most likely existing subscriber but unsubscribed
    if (subscribers.size > 0 && !hasBeenSubscribed) {
        const [subscriber] = subscribers.docs;
        await subscriber.ref.update({ name, subscribed: true });
        await sendEmail(buildEmailMessageForSubscriberAgain(name, email?.toLowerCase()));

        response.send({
            success: true,
            message: "Thank you for subscribing again.",
        });
        return;
    }

    await subscribersRef.add({ name, email: email?.toLowerCase(), subscribed: true });
    await sendEmail(buildEmailMessageForNewSubscriber(name, email?.toLowerCase()));

    response.send({
        success: true,
        message: "Thank you for subscribing.",
    });
});

// Unsubscribe from newsletters
export const unsubscribe_to_newsletters = onRequest({ cors: "*" }, async (request, response) => {
    if (!initialised) {
        admin.initializeApp();
        initialised = true;
    }

    const { "0": subscriberId } = request.params;

    const db = getFirestore();

    const subscribersRef = db.collection("subscribers");
    // Get subscriber by uuid
    const subscriber = await subscribersRef.doc(subscriberId).get();
    const subscriberData = subscriber.data();

    if (!subscriberData) {
        response.status(404).send({
            message: "Subscriber not found",
        });
        return;
    }

    if (!subscriberData?.subscribed) {
        response.status(400).send({
            message: "You have already unsubscribed.",
        });
        return;
    }

    const { name, email } = subscriberData as { name: string; email: string };
    await subscriber.ref.update({ subscribed: false });
    await sendEmail(buildEmailMessageForUnsubscribe(name, email));

    response.send({
        message: "You have been unsubscribed.",
    });
});
