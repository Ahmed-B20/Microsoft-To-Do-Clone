<template>
    <teleport to='body'>
        <div class="login-container">
            <div class="main-content">
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
                                <img for="username" src="@/assets/design-material/icons/user.png" alt="email" />
                                <input type="text" name="username" placeholder="User name" required id="username">
                            </label>

                            <label for="email" class="custom-label">
                                <img for="email" src="@/assets/design-material/icons/user.png" alt="email" />
                                <input type="email" name="email" placeholder="Email" required id="email">
                            </label>

                            <label for="password" class="custom-label">
                                <img for="password" src="@/assets/design-material/icons/lock.png" alt="email" />
                                <input type="password" name="password" placeholder="Password" required id="password">
                            </label>

                            <button>Sign up</button>
                        </form>
                    </div>

                    <div class="login">
                        <form>
                            <label for="chk" aria-hidden="true">Login</label>

                            <label for="email" class="custom-label">
                                <img for="email" src="@/assets/design-material/icons/user.png" alt="email" />
                                <input type="email" name="email" placeholder="Email" required id="email">
                            </label>

                            <label for="password" class="custom-label">
                                <img for="password" src="@/assets/design-material/icons/lock.png" alt="email" />
                                <input type="password" name="password" placeholder="Password" required id="password">
                            </label>

                            <button>Login</button>
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