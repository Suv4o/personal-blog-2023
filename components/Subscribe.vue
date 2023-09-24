<template>
    <div
        class="gradiant-orange h-[400px] shadow-[10px_10px] shadow-beige border-2 border-white rounded-md flex flex-col items-center justify-center mt-12 mb-14"
    >
        <h2 class="text-2xl sm:text-3xl text-center text-secondary mb-6"><strong>SIGN UP FOR UPDATES</strong></h2>
        <form @submit.prevent="submit" ref="form" class="flex flex-col items-center">
            <div class="flex items-center">
                <label for="name" class="text-xl sm:text-2xl text-secondary sm:w-24 w-20 hidden xs:block">Name:</label>
                <input
                    class="text-xl sm:text-2xl p-2 block border-none border-b border-secondary rounded text-secondary shadow-[5px_-3px_7px] shadow-secondary my-2 h-10 sm:h-11 placeholder:text-gray-secondary placeholder:pl-1 placeholder:italic"
                    :class="`${isNameValid.error ? 'error-input text-white' : ''}`"
                    @focus="isNameValid.focus = true"
                    @blur="isNameValid.blur = true"
                    ref="name"
                    id="name"
                    placeholder="John Smith"
                    type="text"
                    v-model.trim="name"
                />
            </div>
            <div class="flex w-full">
                <div class="sm:w-24 w-20 hidden xs:block"></div>
                <div class="text-sm text-secondary mb-2">{{ isNameValid.message }}</div>
            </div>
            <div class="flex items-center">
                <label for="email" class="text-xl sm:text-2xl text-secondary sm:w-24 w-20 hidden xs:block"
                    >E-mail:</label
                >
                <input
                    class="text-xl sm:text-2xl p-2 block border-none border-b border-secondary rounded text-secondary shadow-[5px_-3px_7px] shadow-secondary my-2 h-10 sm:h-11 placeholder:text-gray-secondary placeholder:pl-1 placeholder:italic"
                    :class="`${isEmailValid.error ? 'error-input text-white' : ''}`"
                    @blur="isEmailValid.blur = true"
                    ref="email"
                    id="email"
                    placeholder="j.smith@gmail.com"
                    type="email"
                    v-model.trim="email"
                />
            </div>
            <div class="flex w-full">
                <div class="sm:w-24 w-20 hidden xs:block"></div>
                <div class="text-sm text-secondary">{{ isEmailValid.message }}</div>
            </div>
            <Button ref="submitButton" classes="blue mt-4" subscribe />
        </form>
        <div v-if="message" class="mt-6 text-secondary">
            {{ message }}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: "",
            email: "",
            message: "",
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
        };
    },
    methods: {
        async submit() {
            this.applyNameValidation();
            this.applyEmailValidation();

            if (this.isNameValid.error || this.isEmailValid.error) {
                return;
            }
            // check if there is a subscriber with the same email address already. If so, return!
            const checkResult = await this.checkingForExistingSubscribers();
            if (checkResult.data === "Exist") {
                this.message = "You're Already Subscribed!";
                setTimeout(() => {
                    this.message = "";
                }, 5000);
                this.resetForm();
                return;
            }
            // send the new subscriber's data to the firestore
            await this.sendToFirebase();
            // send an email to me
            this.sendingEmailToMe();
            this.message = "Thank you for Subscribing :-)";
            setTimeout(() => {
                this.message = "";
            }, 5000);
            //restart the form
            this.resetForm();
        },
        applyNameValidation(reset = false) {
            if (this.name.trim() === "" && !reset) {
                this.isNameValid.message = "The name field is required!";
                this.isNameValid.error = true;
            } else {
                this.isNameValid.message = "";
                this.isNameValid.blur = false;
                this.isNameValid.error = false;
            }
        },
        applyEmailValidation(reset = false) {
            if (this.email.trim() === "" && !reset) {
                this.isEmailValid.message = "The email field is required!";
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
        resetForm() {
            this.name = "";
            this.email = "";
            this.$nextTick(() => {
                this.$refs.name.blur();
                this.$refs.email.blur();
                this.applyNameValidation(true);
                this.applyEmailValidation(true);
            });
        },
        checkingForExistingSubscribers() {
            return new Promise((resolve, reject) => {
                firestore
                    .collection("subscribers")
                    .where("email", "==", this.email.toLowerCase())
                    .get()
                    .then((result) => {
                        if (!result.empty) {
                            resolve({ data: "Exist" });
                        } else {
                            resolve({ data: "NotExist" });
                        }
                    });
            }).catch(function (error) {
                reject("Error");
                console.log("Error getting documents: ", error);
            });
        },
        sendToFirebase() {
            return new Promise((resolve, reject) => {
                firestore
                    .collection("subscribers")
                    .add({
                        name: this.name,
                        email: this.email.toLowerCase(),
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
                const sendSubscriberEmail = functions.httpsCallable("sendSubscriberEmail");
                sendSubscriberEmail({
                    name: this.name,
                    email: this.email.toLowerCase(),
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
    },
};
</script>

<style scoped>
.gradiant-orange {
    background: rgb(var(--colour-primary-light));
    background: -moz-linear-gradient(90deg, rgb(var(--colour-primary-light)) 0%, rgb(var(--colour-primary)) 100%);
    background: -webkit-linear-gradient(90deg, rgb(var(--colour-primary-light)) 0%, rgb(var(--colour-primary)) 100%);
    background: linear-gradient(90deg, rgb(var(--colour-primary-light)) 0%, rgb(var(--colour-primary)) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#f1918b",endColorstr="#ee5f53",GradientType=1);
}

.error-input {
    background: repeating-linear-gradient(
        45deg,
        rgb(var(--colour-secondary-light)),
        rgb(var(--colour-secondary-light)) 10px,
        rgb(var(--colour-secondary)) 10px,
        rgb(var(--colour-secondary)) 20px
    );
}
</style>
