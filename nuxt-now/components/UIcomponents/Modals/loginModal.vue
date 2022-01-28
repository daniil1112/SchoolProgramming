<template>
    <mdb-container>
        <mdb-modal :show="show" @close="$emit('hide')" centered>
            <mdb-modal-header class="text-center">
                <mdb-modal-title tag="h4" bold class="w-100">Sign in</mdb-modal-title>
            </mdb-modal-header>
            <mdb-modal-body class="mx-3 grey-text">
                <mdb-input
                        label="Login"
                        icon="envelope"
                        type="text"
                        class="mb-5"
                        required
                        v-model="user.login"
                        :isValid="validate.login === 1"
                        :customValidation="validate.login > 0"
                        :invalidFeedback="invalidFeedbackLogin"
                        @change="validateLogin"
                />
                <mdb-input
                        label="Password"
                        icon="lock"
                        type="password"
                        required
                        v-model="user.password"
                        :isValid="validate.password === 1"
                        :customValidation="validate.password > 0"
                        :invalidFeedback="invalidFeedbackPassword"
                        @change="validatePassword"
                />
            </mdb-modal-body>
            <mdb-modal-footer center>
                <mdb-btn gradient="blue" block rounded @click.native="login">Sign In</mdb-btn>
            </mdb-modal-footer>
        </mdb-modal>
    </mdb-container>
</template>

<script>
    export default {
        name: "loginModal",

        props:['show'],


        data(){
            return{
                user: {
                    login: "",
                    password: "",
                },
                validate: {
                    login: 0,
                    password: 0,
                },
                loading: false,
            }
        },

        computed:{
            invalidFeedbackLogin() {
                if (this.validate.login === 1) return ""
                else if (this.validate.login === 2) return "Введите логин"
                else if (this.validate.login === 3) return "Слишком короткий логин"
                else if (this.validate.login === 4) return "Слишком длинный логин"
            },
            invalidFeedbackPassword() {
                if (this.validate.password === 1) return ""
                else if (this.validate.password === 2) return "Введите пароль"
                else if (this.validate.password === 3) return "Слишком короткий пароль"
            },

        },

        methods:{
            async login(){
                await this.validateLogin()
                await this.validatePassword()
                if (this.validate.login === 1 && this.validate.password === 1) {
                    this.loading = true
                    await this.$auth
                        .loginWith("local", { data: this.user })
                        .then((data) => {
                            if (data.data.error) {
                                let title, message
                                title = "Ошибка при входе"
                                if (data.data.code === 1) {
                                    message = "Логин или пароль имеют неверный формат"
                                } else if (data.data.code === 2) {
                                    message = "Неверный логин или пароль"
                                } else if (data.data.code === 3) {
                                    message = "Неизвестная ошибка"
                                }
                                this.$notify.error({
                                    title,
                                    message,
                                })
                            }
                        })
                    this.loading = false;
                    this.$emit('hide')
                }

            },
            validateLogin() {
                if (this.user.login.length === 0) this.validate.login = 2
                else if (this.user.login.length < 2) this.validate.login = 3
                else if (this.user.login.length >= 50) this.validate.login = 4
                else this.validate.login = 1
            },
            validatePassword() {
                if (this.user.password.length === 0) this.validate.password = 2
                else if (this.user.password.length < 6) this.validate.password = 3
                else this.validate.password = 1
            },
        }
    }
</script>

<style scoped>

</style>