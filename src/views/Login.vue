<template>
    <teleport to='body'>
        <div class="login-container">
            <div class="main-content-login">
                <div class="container">
                    <div class="screen">
                        <div class="screen__background">
                            <span class="screen__background__shape screen__background__shape4"></span>
                            <span class="screen__background__shape screen__background__shape3"></span>
                            <span class="screen__background__shape screen__background__shape2"></span>
                            <span class="screen__background__shape screen__background__shape1"></span>
                        </div>
                    </div>
                </div>

                <div class="main">
                    <input type="checkbox" id="chk" aria-hidden="true">

                    <div class="signup">
                        <form>
                            <label for="chk" aria-hidden="true">Sign up</label>

                            <label for="username" class="custom-label">
                                <img for="username" src="@/assets/design-material/icons/user.png" alt="username" />
                                <input type="text" name="username" placeholder="User name" required id="username"
                                    v-model="username">
                            </label>

                            <label for="email" class="custom-label">
                                <img for="email" src="@/assets/design-material/icons/user.png" alt="email" />
                                <input type="email" name="email" placeholder="Email" required id="email"
                                    v-model="email">
                            </label>

                            <label for="password" class="custom-label">
                                <img for="password" src="@/assets/design-material/icons/lock.png" alt="password" />
                                <input type="password" name="password" placeholder="Password" required id="password"
                                    v-model="password">
                            </label>

                            <button @click="signUp">Sign up</button>
                        </form>
                    </div>

                    <div class="login">
                        <form>
                            <label for="chk" aria-hidden="true">Login</label>

                            <label for="login-email" class="custom-label">
                                <img for="login-email" src="@/assets/design-material/icons/user.png" alt="email" />
                                <input type="email" name="email" placeholder="Email" required id="login-email"
                                    v-model="email">
                            </label>

                            <label for="login-password" class="custom-label">
                                <img for="login-password" src="@/assets/design-material/icons/lock.png"
                                    alt="password" />
                                <input type="password" name="password" placeholder="Password" required
                                    id="login-password" v-model="password">
                            </label>

                            <button @click="login">Login</button>
                        </form>
                    </div>

                    <div class="screen">
                        <div class="screen__background">
                            <span class="screen__background__shape screen__background__shape4"></span>
                            <span class="screen__background__shape screen__background__shape3"></span>
                            <span class="screen__background__shape screen__background__shape2"></span>
                            <span class="screen__background__shape screen__background__shape1"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script>
import { allUsers } from '@/stores/allUsers.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'Login',
    data() {
        return {
            username: '',
            email: '',
            password: '',
            regexForMail: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
            regexForPassword: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
            regexForUsername: /^[A-Za-z][A-Za-z0-9_]{3,16}$/,
            usernameState: false,
            emailState: false,
            passwordState: false,
            signInBefore: false,
            signUpData: {}
        }
    },
    computed: {
        ...mapWritableState(allUsers, ['allUsers']),
    },
    methods: {
        signUp(event) {
            event.preventDefault();

            if (this.emailState && this.emailState && this.passwordState && this.signInBefore) {
                this.signUpData.id = this.allUsers[0].numberOfUsers + 1
            } else {
                console.log('error');
            }
        }
    },
    watch: {
        email() {
            if (this.regexForMail.test(this.email)) {
                this.emailState = true

                this.allUsers[0].usersCredentials.forEach((userInfo, index) => {
                    if (userInfo.email === this.email) {
                        this.signInBefore = false
                    } else {
                        if (index + 1 === this.allUsers[0].usersCredentials.length) {
                            this.signInBefore = true
                            this.signUpData.email = this.email
                        }
                    }
                })
            } else {
                this.emailState = false
                console.log('error');
            }
        },
        password() {
            if (this.regexForPassword.test(this.password)) {
                this.passwordState = true
                this.signUpData.password = this.password
                console.log('ff');
            } else {
                this.passwordState = false
                console.log('error');
            }
        },
        username() {
            if (this.regexForUsername.test(this.username)) {
                this.usernameState = true
                this.signUpData.username = this.username
            } else {
                this.usernameState = false
                console.log('error');
            }
        }
    }
}
</script>