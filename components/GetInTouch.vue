<template>
    <div class="flex flex-col items-center justify-center">
        <div class="title mt-12 mb-6"><strong>GET IN TOUCH</strong></div>
        <arrow-down class="mb-6"></arrow-down>
        <form @submit.prevent="submit" ref="form" class="flex flex-col justify-center items-center w-full">
            <div class="flex items-center w-full">
                <label for="name-contact" class="lable">Name:</label>
                <div class="w-full">
                    <input
                        :class="`${isNameValid.error ? 'error-input' : ''}`"
                        @focus="isNameValid.focus = true"
                        @blur="isNameValid.blur = true"
                        ref="name-contact"
                        id="name-contact"
                        type="text"
                        placeholder="John Smith"
                        class="input w-full"
                        name="name-contact"
                        v-model.trim="name"
                    />
                    <div class="error-message">{{ isNameValid.message }}</div>
                </div>
            </div>
            <div class="flex items-center w-full">
                <label for="email-contact" class="lable">E-mail:</label>
                <div class="w-full">
                    <input
                        :class="`${isEmailValid.error ? 'error-input' : ''}`"
                        @focus="isEmailValid.focus = true"
                        @blur="isEmailValid.blur = true"
                        ref="email-contact"
                        id="email-contact"
                        type="text"
                        placeholder="j.smith@gmail.com"
                        class="input w-full"
                        name="email-contact"
                        v-model.trim="email"
                    />
                    <div class="error-message">{{ isEmailValid.message }}</div>
                </div>
            </div>
            <div class="flex items-center w-full">
                <label for="mobile-contact" class="lable">Mobile:</label>
                <div class="w-full">
                    <input
                        :class="`${isMobileValid.error ? 'error-input' : ''}`"
                        @focus="isMobileValid.focus = true"
                        @blur="isMobileValid.blur = true"
                        ref="mobile-contact"
                        id="mobile-contact"
                        type="text"
                        placeholder="04 8888 8888"
                        class="input w-full"
                        name="mobile-contact"
                        v-model.trim="mobile"
                    />
                    <div class="error-message">{{ isMobileValid.message }}</div>
                </div>
            </div>
            <div class="flex items-center w-full">
                <label for="subject-contact" class="lable">Subject:</label>
                <div class="w-full">
                    <input
                        :class="`${isSubjectValid.error ? 'error-input' : ''}`"
                        @focus="isSubjectValid.focus = true"
                        @blur="isSubjectValid.blur = true"
                        ref="subject-contact"
                        id="subject-contact"
                        type="text"
                        placeholder="Super Star Blog!"
                        class="input w-full"
                        name="subject-contact"
                        v-model.trim="subject"
                    />
                    <div class="error-message">{{ isSubjectValid.message }}</div>
                </div>
            </div>
            <div class="flex align-start w-full">
                <label for="message-contact" class="lable mt-20">Message:</label>
                <div class="w-full">
                    <textarea
                        :class="`${isMessageValid.error ? 'error-input' : ''}`"
                        @focus="isMessageValid.focus = true"
                        @blur="isMessageValid.blur = true"
                        style="resize: none"
                        ref="message-contact"
                        id="message-contact"
                        rows="8"
                        cols="19"
                        placeholder="Say Hi!"
                        class="input w-full"
                        name="message-contact"
                        v-model.trim="message"
                    >
                    </textarea>
                    <div class="error-message">{{ isMessageValid.message }}</div>
                </div>
            </div>
            <Button ref="submitButton" classes="mt-6 mb-8" subscribe subscribeBtnName="Send a message" />
        </form>
        <div v-if="sentMessage" class="mb-8">sadas{{ sentMessage }}</div>
    </div>
    <arrow-down class="mb-6"></arrow-down>
    <HorizontalRule />
</template>

<script>
export default {
    data() {
        return {
            name: "",
            email: "",
            mobile: "",
            subject: "",
            message: "",
            sentMessage: "",
            isNameValid: {
                message: "",
                error: false,
                blur: false,
            },
            isEmailValid: {
                message: "",
                error: false,
                blur: false,
            },
            isMobileValid: {
                message: "",
                error: false,
                blur: false,
            },
            isSubjectValid: {
                message: "",
                error: false,
                blur: false,
            },
            isMessageValid: {
                message: "",
                error: false,
                blur: false,
            },
        };
    },
    methods: {
        async submit() {
            this.applyNameValidation();
            this.applyEmailValidation();
            this.applyMobileValidation();
            this.applySubjectValidation();
            this.applyMessageValidation();

            if (
                this.isNameValid.error ||
                this.isEmailValid.error ||
                this.isMobileValid.error ||
                this.isSubjectValid.error ||
                this.isMessageValid.error
            ) {
                return;
            }

            // send the new subscriber's data to the firestore
            await this.sendToFirebase();
            // send an email to me
            this.sendingEmailToMe();
            this.sentMessage = "Thank you for contacting me! I`ll get in touch with you as soon as possible!";
            setTimeout(() => {
                this.sentMessage = "";
            }, 5000);
            //restart the form
            this.resetForm();
        },
        applyNameValidation(reset = false) {
            if (this.name.trim() === "" && !reset) {
                this.isNameValid.message = "The Name field is required!";
                this.isNameValid.error = true;
            } else {
                this.isNameValid.message = "";
                this.isNameValid.blur = false;
                this.isNameValid.error = false;
            }
        },
        applyEmailValidation(reset = false) {
            if (this.email.trim() === "" && !reset) {
                this.isEmailValid.message = "The Email field is required!";
                this.isEmailValid.error = true;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim()) && !reset) {
                this.isEmailValid.message = "Please enter a valid Email Address!";
                this.isEmailValid.error = true;
            } else {
                this.isEmailValid.message = "";
                this.isEmailValid.blur = false;
                this.isEmailValid.error = false;
            }
        },
        applyMobileValidation(reset = false) {
            if (this.mobile.trim() === "" && !reset) {
                this.isMobileValid.message = "The Mobile field is required!";
                this.isMobileValid.error = true;
            } else if (!/^[0-9]+$/.test(this.mobile.trim()) && !reset) {
                this.isMobileValid.message = "Only numeric values are allowed!";
                this.isMobileValid.error = true;
            } else if (!/\d{8,12}/.test(this.mobile.trim()) && !reset) {
                this.isMobileValid.message = "Between 8 to 12 digits allowed!";
                this.isMobileValid.error = true;
            } else {
                this.isMobileValid.message = "";
                this.isMobileValid.blur = false;
                this.isMobileValid.error = false;
            }
        },
        applySubjectValidation(reset = false) {
            if (this.subject.trim() === "" && !reset) {
                this.isSubjectValid.message = "The Subject field is required!";
                this.isSubjectValid.error = true;
            } else {
                this.isSubjectValid.message = "";
                this.isSubjectValid.blur = false;
                this.isSubjectValid.error = false;
            }
        },
        applyMessageValidation(reset = false) {
            if (this.message.trim() === "" && !reset) {
                this.isMessageValid.message = "The Message field is required!";
                this.isMessageValid.error = true;
            } else if (this.message.length > 500 && !reset) {
                this.isMessageValid.message = "No more than 500 characters allowed!";
                this.isMessageValid.error = true;
            } else {
                this.isMessageValid.message = "";
                this.isMessageValid.blur = false;
                this.isMessageValid.error = false;
            }
        },
        resetForm() {
            this.name = "";
            this.email = "";
            this.mobile = "";
            this.subject = "";
            this.message = "";
            this.$nextTick(() => {
                this.$refs["name-contact"].blur();
                this.$refs["email-contact"].blur();
                this.$refs["mobile-contact"].blur();
                this.$refs["subject-contact"].blur();
                this.$refs["message-contact"].blur();
                this.applyNameValidation(true);
                this.applyEmailValidation(true);
                this.applyMobileValidation(true);
                this.applySubjectValidation(true);
                this.applyMessageValidation(true);
            });
        },
        sendToFirebase() {
            return new Promise((resolve, reject) => {
                firestore
                    .collection("contact-form")
                    .add({
                        Name: this.name,
                        Email: this.email.toLowerCase(),
                        Mobile: this.mobile,
                        Subject: this.subject,
                        Message: this.message,
                    })
                    .then(() => {
                        resolve("Done");
                    })
                    .catch((error) => {
                        reject("Error");
                        console.error("Error adding document in the database: ", error);
                    });
            });
        },
        sendingEmailToMe() {
            return new Promise((resolve, reject) => {
                const sendContactFormEmail = functions.httpsCallable("sendContactFormEmail");
                sendContactFormEmail({
                    Name: this.name,
                    Email: this.email.toLowerCase(),
                    Mobile: this.mobile,
                    Subject: this.subject,
                    Message: this.message,
                });
                resolve("Email has been sent!");
            });
        },
    },
    watch: {
        name() {
            this.applyNameValidation();
        },
        email() {
            this.applyEmailValidation();
        },
        mobile() {
            this.applyMobileValidation();
        },
        subject() {
            this.applySubjectValidation();
        },
        message() {
            this.applyMessageValidation();
        },
        "isNameValid.blur": {
            handler() {
                this.applyNameValidation();
            },
        },
        "isEmailValid.blur": {
            handler() {
                this.applyEmailValidation();
            },
        },
        "isMobileValid.blur": {
            handler() {
                this.applyMobileValidation();
            },
        },
        "isSubjectValid.blur": {
            handler() {
                this.applySubjectValidation();
            },
        },
        "isMessageValid.blur": {
            handler() {
                this.applyMessageValidation();
            },
        },
    },
};
</script>

<style scoped>
.title {
    @apply text-4xl text-center text-secondary;
}

@media (max-width: 767px) {
    .title {
        @apply text-2xl;
    }
}

.input {
    @apply text-2xl py-2 block border-b border-beige-gray rounded text-secondary shadow-[5px_-3px_7px] shadow-beige-gray my-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
}

@media (max-width: 767px) {
    .input {
        @apply text-lg p-2;
    }
}

.input::placeholder {
    @apply text-beige-gray italic pl-1;
}

.lable {
    @apply text-2xl mr-8 w-[25%] text-gray;
}

@media (max-width: 767px) {
    .lable {
        @apply text-lg mr-5 w-[30%];
    }
}

@media (max-width: 390px) {
    .lable {
        @apply hidden;
    }
}

.error-input {
    @apply text-white;
    background: repeating-linear-gradient(
        45deg,
        rgb(var(--colour-secondary-light)),
        rgb(var(--colour-secondary-light)) 10px,
        rgb(var(--colour-secondary)) 10px,
        rgb(var(--colour-secondary)) 20px
    );
}

.error-message {
    @apply text-sm text-secondary;
}
</style>
