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

type BodySendEmail = {
    test: boolean;
    blog_image_url: string;
    blog_url: string;
    blog_name: string;
    subscriber_name: string;
    blog_briefly_describe: string;
    blog_highlights: string[];
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
export const contact_form = onRequest(
    { cors: ["https://www.trpkovski.com", "https://trpkovski.com"] },
    async (request, response) => {
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
    }
);

// Subscribe to newsletters
export const subscribe_to_newsletters = onRequest(
    { cors: ["https://www.trpkovski.com", "https://trpkovski.com"] },
    async (request, response) => {
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
    }
);

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

// Send new blog post info to newsletters' subscribers
export const send_blog_post_info_to_subscribers = onRequest({ cors: "*" }, async (request, response) => {
    if (!initialised) {
        admin.initializeApp();
        initialised = true;
    }

    const { authorization } = request.headers;

    if (!authorization) {
        response.status(401).send({
            message: "Unauthorized",
        });
        return;
    }

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || token !== process.env.SECURITY_TOKEN) {
        response.status(401).send({
            message: "Unauthorized",
        });
        return;
    }

    const { test, blog_image_url, blog_url, blog_name, blog_briefly_describe, blog_highlights } =
        request.body as BodySendEmail;

    if (!blog_image_url || !blog_url || !blog_name || !blog_briefly_describe || !blog_highlights) {
        response.status(400).send({
            message: "Missing required fields",
        });
        return;
    }

    let onlySubscribedSubscribers = null;

    if (test) {
        onlySubscribedSubscribers = [
            {
                id: "F7Mv8EvOYarz03AbUNWf",
                name: "Aleksandar Trpkovski",
                email: "aleksandar.trpkovski@gmail.com",
                subscribed: true,
            },
            {
                id: "F7Mv8EvOYarz03AbUNWf",
                name: "Aleks Trpkovski",
                email: "a_trpkovski_1988@yahoo.com",
                subscribed: true,
            },
        ];
    } else {
        // const db = getFirestore();
        // const subscribersRef = db.collection("subscribers");
        // const subscribers = await subscribersRef.get();
        // const subscribersData = subscribers.docs.map((doc) => {
        //     return {
        //         id: doc.id,
        //         name: doc.data()?.name,
        //         email: doc.data()?.email,
        //         subscribed: doc.data()?.subscribed,
        //     };
        // });
        // onlySubscribedSubscribers = subscribersData.filter((subscriber) => subscriber.subscribed);
    }

    // @ts-ignore
    for (const subscriber of onlySubscribedSubscribers) {
        const html = buildHtmlNewBlogPostEmailNewsletters({
            ...request.body,
            subscriber_name: subscriber.name,
            subscriber_id: subscriber.id,
        });

        const text = `New Blog Article - sent to: ${request.body.name}, ${request.body.email}`;

        await sendEmail(
            buildEmailMessageForNewBlogPostEmailNewsletters(subscriber.email, `New Article: ${blog_name}`, text, html)
        );
    }

    response.send({
        message: "The email has been sent to all subscribers.",
    });
});

function buildEmailMessageForNewBlogPostEmailNewsletters(email: string, subject: string, text: string, html: string) {
    const NOTIFICATION_FROM_EMAIL = process.env.NOTIFICATION_FROM_EMAIL as string;

    const message = {
        to: email,
        from: NOTIFICATION_FROM_EMAIL,
        subject,
        text,
        html,
    };
    return message;
}

function buildHtmlNewBlogPostEmailNewsletters(
    body: BodySendEmail & { subscriber_name: string; subscriber_id: string }
) {
    const emailTemplate = `
    <!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title><!--[if !mso]><!-- --><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; }
    .ReadMsgBody { width:100%; }
    .ExternalClass { width:100%; }
    .ExternalClass * { line-height:100%; }
    body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
    table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
    img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
    p { display:block;margin:13px 0; }</style><!--[if !mso]><!--><style type="text/css">@media only screen and (max-width:480px) {
      @-ms-viewport { width:320px; }
      @viewport { width:320px; }
    }</style><!--<![endif]--><!--[if mso]>
  <xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
  </xml>
  <![endif]--><!--[if lte mso 11]>
  <style type="text/css">
    .outlook-group-fix { width:100% !important; }
  </style>
  <![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);</style><!--<![endif]--><style type="text/css">@media only screen and (min-width:480px) {
  .mj-column-per-35 { width:35% !important; max-width: 35%; }
.mj-column-per-65 { width:65% !important; max-width: 65%; }
.mj-column-per-100 { width:100% !important; max-width: 100%; }
}</style><style type="text/css">@media only screen and (max-width:480px) {
table.full-width-mobile { width: 100% !important; }
td.full-width-mobile { width: auto !important; }
}


noinput.mj-menu-checkbox { display:block!important; max-height:none!important; visibility:visible!important; }

@media only screen and (max-width:480px) {
  .mj-menu-checkbox[type="checkbox"] ~ .mj-inline-links { display:none!important; }
  .mj-menu-checkbox[type="checkbox"]:checked ~ .mj-inline-links,
  .mj-menu-checkbox[type="checkbox"] ~ .mj-menu-trigger { display:block!important; max-width:none!important; max-height:none!important; font-size:inherit!important; }
  .mj-menu-checkbox[type="checkbox"] ~ .mj-inline-links > a { display:block!important; }
  .mj-menu-checkbox[type="checkbox"]:checked ~ .mj-menu-trigger .mj-menu-icon-close { display:block!important; }
  .mj-menu-checkbox[type="checkbox"]:checked ~ .mj-menu-trigger .mj-menu-icon-open { display:none!important; }
}</style></head><body style="background-color:#e0f2ff;"><div style="background-color:#e0f2ff;"><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="background:#173353;background-color:#173353;Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#173353;background-color:#173353;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:210px;" ><![endif]--><div class="mj-column-per-35 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="left" style="font-size:0px;padding:0px 10px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:40px;"><a href="https://www.trpkovski.com" target="_blank" style="text-decoration: none; color: inherit;"><img alt="logo" height="auto" src="https://res.cloudinary.com/suv4o/image/upload/f_auto,w_70/v1697884715/blog/logo" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;" width="40"></a></td></tr></tbody></table></td></tr></table></div><!--[if mso | IE]></td><td class="" style="vertical-align:top;width:390px;" ><![endif]--><div class="mj-column-per-65 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;word-break:break-word;"><!--[if !mso><!--> <input type="checkbox" id="e7c8d3adec8e4506" class="mj-menu-checkbox" style="display:none !important; max-height:0; visibility:hidden;"><!--<![endif]--><div class="mj-menu-trigger" style="display:none;max-height:0px;max-width:0px;font-size:0px;overflow:hidden;"><label for="e7c8d3adec8e4506" class="mj-menu-label" style="display:block;cursor:pointer;mso-hide:all;-moz-user-select:none;user-select:none;align:center;color:#ee5f53;font-size:30px;font-family:Ubuntu, Helvetica, Arial, sans-serif;text-transform:uppercase;text-decoration:none;line-height:30px;padding:10px;"><span class="mj-menu-icon-open" style="mso-hide:all;">&#9776; </span><span class="mj-menu-icon-close" style="display:none;mso-hide:all;">&#8855;</span></label></div><div class="mj-inline-links"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center"><tr><td style="padding:15px 10px;" class="" ><![endif]--> <a class="mj-link" href="https://www.trpkovski.com/" target="_blank" style="display: inline-block; color: #ffffff; font-family: Ubuntu, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: normal; line-height: 22px; text-decoration: none; text-transform: uppercase; padding: 15px 10px;">home </a><!--[if mso | IE]></td><td style="padding:15px 10px;" class="" ><![endif]--> <a class="mj-link" href="https://www.trpkovski.com/articles" target="_blank" style="display: inline-block; color: #ffffff; font-family: Ubuntu, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: normal; line-height: 22px; text-decoration: none; text-transform: uppercase; padding: 15px 10px;">articles </a><!--[if mso | IE]></td><td style="padding:15px 10px;" class="" ><![endif]--> <a class="mj-link" href="https://www.trpkovski.com/get-in-touch" target="_blank" style="display: inline-block; color: #ffffff; font-family: Ubuntu, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: normal; line-height: 22px; text-decoration: none; text-transform: uppercase; padding: 15px 10px;">get in touch </a><!--[if mso | IE]></td></tr></table><![endif]--></div></td></tr></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="background:#efe8df;background-color:#efe8df;Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#efe8df;background-color:#efe8df;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-top:20px;text-align:center;vertical-align:top;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:400px;"><img alt="blog post hero image" height="auto" src="{{blog_image_url}}" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;" width="400"></td></tr></tbody></table></td></tr><tr><td align="center" style="font-size:0px;padding:0px 10px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:24px;line-height:170%;text-align:center;color:#6d6e71;"><p>Hey {{subscriber_name}},</p><p>I am excited to share with you my latest article, <a href="{{blog_url}}" style="text-decoration: none; color: #ee5f53;">{{blog_name}}</a></p><p>In this article, I delve deep into {{blog_briefly_describe}}.</p><p>Here are some highlights:</p>{{blog_highlights}}<p>Thank you for being a part of my web development community.</p><p>Happy coding!</p><p>Warm regards,</p><p>Aleksandar Trpkovski</p></div></td></tr></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="background:#ee5f53;background-color:#ee5f53;Margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ee5f53;background-color:#ee5f53;width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:0;text-align:center;vertical-align:top;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]--><div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tr><td align="center" style="font-size:0px;padding:10px 25px;padding-top:20px;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;"><div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:#ffffff;"><p><a href="https://www.trpkovski.com/unsubscribe?id={{subscriber_id}}" style="text-decoration: none; color: inherit; font-size: 20px;">Unsubscribe</a></p></div></td></tr></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></div></body></html>
`;

    const {
        blog_image_url,
        blog_url,
        blog_name,
        subscriber_name,
        subscriber_id,
        blog_briefly_describe,
        blog_highlights,
    } = body;

    const blog_highlights_html = `<ul>${blog_highlights.map((highlight) => `<li>${highlight}</li>`).join("")}</ul>`;

    const response = emailTemplate
        .replace("{{blog_image_url}}", blog_image_url)
        .replace("{{blog_url}}", blog_url)
        .replace("{{blog_name}}", blog_name)
        .replace("{{subscriber_name}}", subscriber_name)
        .replace("{{subscriber_id}}", subscriber_id)
        .replace("{{blog_briefly_describe}}", blog_briefly_describe)
        .replace("{{blog_briefly_describe}}", blog_briefly_describe)
        .replace("{{blog_highlights}}", blog_highlights_html);

    return response;
}
