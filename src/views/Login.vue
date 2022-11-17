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

                        <!-- <img class="one gif-img" src="@/assets/design-material/gif/asteroid.gif" alt="gif">
                        <img class="two gif-img" src="@/assets/design-material/gif/astronaut.gif" alt="gif">
                        <img class="three gif-img" ref="loginAnimation"
                            src="@/assets/design-material/gif/rocket-launch.png" alt="gif"> -->
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
                                <img for="email" src="@/assets/design-material/icons/email.png" alt="email" />
                                <input type="email" name="email" placeholder="Email" required id="email"
                                    v-model="email">
                            </label>

                            <label for="password" class="custom-label">
                                <img for="password" src="@/assets/design-material/icons/lock.png" alt="password" />
                                <input ref="signUpPass" type="password" name="password" placeholder="Password" required
                                    id="password" v-model="password">
                                <img v-if="showPassword" @click="togglePassword($event, 'signUpPass')"
                                    src="@/assets/design-material/icons/eye.png" alt="show password" />
                            </label>

                            <button @click="signUp">Sign up</button>
                        </form>
                    </div>

                    <div class="login">
                        <form>
                            <label for="chk" aria-hidden="true">Login</label>

                            <label for="login-email" class="custom-label">
                                <img for="login-email" src="@/assets/design-material/icons/email.png" alt="email" />
                                <input type="email" name="email" placeholder="Email" required id="login-email"
                                    v-model="email">
                            </label>

                            <label for="login-password" class="custom-label">
                                <img for="login-password" src="@/assets/design-material/icons/lock.png"
                                    alt="password" />
                                <input ref="loginPass" type="password" name="password" placeholder="Password" required
                                    id="login-password" v-model="password">
                                <img v-if="showPassword" @click="togglePassword($event, 'loginPass')"
                                    src="@/assets/design-material/icons/eye.png" alt="show password" />
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
        <warning-message :showWarning="showWarning">
            <template #warningIcon>
                <img src="@/assets/design-material/icons/warning.png" alt="warning icon">
            </template>

            <template #warningMessage>
                <p>{{ warningMessage }}</p>
            </template>

            <template #closeWarning>
                <img @click="closeWarning" src="@/assets/design-material/icons/close.png" alt="close icon">
            </template>
        </warning-message>
    </teleport>
</template>

<script>
import WarningMessage from '../components/global-components/WarningMessage.vue'

import { allUsers } from '@/stores/allUsers.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'Login',
    beforeRouteEnter(to, from, next) {
        if (!!JSON.parse(localStorage.getItem("allUsers"))[0].idOfLoginUser) {
            next({ name: 'home' })
        } else {
            next()
        }
    },
    components: {
        WarningMessage
    },
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
            loginEmailState: false,
            loginPasswordState: false,
            loginIndex: null,
            signUpData: {},
            showPassword: false,
            warningMessage: '',
            showWarning: false
        }
    },
    computed: {
        ...mapWritableState(allUsers, ['allUsers']),
    },
    methods: {
        signUp(event) {
            event.preventDefault();
            if (this.emailState && this.usernameState && this.passwordState && this.signInBefore) {
                this.signUpData.id = this.allUsers[0].numberOfUsers + 1
                this.signUpData.loginStatus = true
                this.signUpData.lastLogin = new Date()

                this.allUsers[0].usersCredentials.push(this.signUpData)
                this.allUsers[0].idOfLoginUser = this.signUpData.id
                this.allUsers[0].numberOfUsers++
                localStorage.setItem("allUsers", JSON.stringify(this.allUsers));

                this.emailState = false
                this.usernameState = false
                this.passwordState = false
                this.signInBefore = false
                this.showPassword = false
                this.signUpData = {}

                // this.$refs.loginAnimation.style.height = '120px'
                // this.$refs.loginAnimation.src = this.$refs.loginAnimation.src.replace('png', 'gif')

                // setTimeout(() => {
                //     this.$router.push({ name: 'home' })
                // }, 2000)

                setTimeout(() => {
                    this.$router.push({ name: 'home' })
                }, 200)
            } else {
                this.showWarning = true
                this.warningMessage = "Wrong Data Formate"
            }
        },
        login(event) {
            event.preventDefault();
            console.log(this.emailState, this.passwordState, this.loginEmailState, this.loginPasswordState)

            if (this.emailState && this.passwordState && this.loginEmailState && this.loginPasswordState) {
                this.allUsers[0].usersCredentials[this.loginIndex].lastLogin = new Date()
                localStorage.setItem("allUsers", JSON.stringify(this.allUsers));

                this.emailState = false
                this.passwordState = false
                this.loginEmailState = false
                this.loginPasswordState = false
                this.showPassword = false

                // this.$refs.loginAnimation.src = this.$refs.loginAnimation.src.replace('png', 'gif')
                // this.$refs.loginAnimation.style.height = '120px'

                // setTimeout(() => {
                //     // this.$router.push({ name: 'home' })
                // }, 2000)

                setTimeout(() => {
                    this.$router.push({ name: 'home' })
                }, 200)
            } else {
                this.showWarning = true
                this.warningMessage = 'Wrong Email Or Password'
            }
        },
        togglePassword(event, target) {
            if (this.showPassword) {
                if (this.$refs[target].type === 'text') {
                    this.$refs[target].type = 'password'
                    event.target.src = event.target.src.replace('hidden', 'eye')
                } else {
                    this.$refs[target].type = 'text'
                    event.target.src = event.target.src.replace('eye', 'hidden')
                }
            }
        },
        closeWarning() {
            this.showWarning = false
        }
    },
    watch: {
        email() {
            if (this.regexForMail.test(this.email)) {
                this.emailState = true
                if (this.allUsers[0].usersCredentials.length > 0) {
                    this.allUsers[0].usersCredentials.forEach((userInfo, index) => {
                        if (userInfo.email === this.email) {
                            this.signInBefore = false
                            this.allUsers[0].idOfLoginUser = index + 1

                            // this.showWarning = true
                            // this.warningMessage = 'This Mail Is Already Sign In'

                            this.loginEmailState = true
                            this.loginIndex = index
                        } else {
                            if (index + 1 === this.allUsers[0].usersCredentials.length) {
                                this.signInBefore = false
                                this.signUpData.email = this.email
                                this.loginEmailState = false
                            }
                        }
                    })
                } else {
                    this.signUpData.email = this.email
                    this.signInBefore = true
                }
            } else {
                this.emailState = false
                this.showWarning = true
                this.warningMessage = 'Wrong Email Format'
            }
        },
        password() {
            this.showPassword = true
            if (this.regexForPassword.test(this.password)) {
                this.passwordState = true
                this.signUpData.password = this.password

                this.allUsers[0].usersCredentials.forEach((userInfo, index) => {
                    if (userInfo.password === this.password) {
                        this.loginPasswordState = true
                    } else {
                        if (index + 1 === this.allUsers[0].usersCredentials.length) {
                            this.loginPasswordState = false
                        }
                    }
                })
            } else {
                this.passwordState = false
                this.showWarning = true
                this.warningMessage = "Wrong Password Format, Must Contain Numbers, - Character, _ Character, Capital and Small latter's And Length Between 3-16"
            }
        },
        username() {
            if (this.regexForUsername.test(this.username)) {
                this.usernameState = true
                this.signUpData.username = this.username
            } else {
                this.usernameState = false
                this.showWarning = true
                this.warningMessage = "Wrong UserName Format, Can Contain Numbers, Special Character, Capital and Small latter's And Length Between 6-16"
            }
        },
        showWarning() {
            if (this.showWarning) {
                setTimeout(() => {
                    this.showWarning = false
                }, 3000)
            }
        }
    }
}
</script>