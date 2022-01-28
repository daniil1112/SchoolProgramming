<template>
    <mdb-navbar class="flexible-navbar white" position="top" double scrolling>
        <mdb-navbar-brand @click.native="$emit('toggle-side-nav')" class="button-collapse"><mdb-icon icon="bars"/></mdb-navbar-brand>
        <mdb-navbar-toggler/>
        <mdb-navbar-nav class="right-nav" right>
            <mdb-dropdown class="nav-item" tag="li" v-show="$auth.loggedIn">
                <mdb-dropdown-toggle slot="toggle" tag="li" outline="none" class="btn-transparent">
                    <mdb-icon icon="user"/> <span class="clearfix d-none d-sm-inline-block" v-if="$auth.loggedIn">{{$auth.user.name}}</span>
                </mdb-dropdown-toggle>
                <mdb-dropdown-menu left>
                    <mdb-dropdown-item @click="$auth.logout()">Log Out</mdb-dropdown-item>
                    <mdb-dropdown-item>My account</mdb-dropdown-item>
                </mdb-dropdown-menu>
            </mdb-dropdown>
            <mdb-nav-item  tag="li" v-show="!$auth.loggedIn">
                <mdb-icon icon="user" /><mdb-button class="clearfix d-none d-sm-inline-block" @click="$emit('open-login-form')">Войти</mdb-button>
            </mdb-nav-item>
        </mdb-navbar-nav>
    </mdb-navbar>
</template>

<script>
    export default {
        name: 'Navbar',
        props: {
            page: {
                type: String
            }
        },
        data () {
            return {
                activePage: this.page,
                toggle: false
            }
        },

        computed: {
            computedPage () {
                return {
                    activePage: this.page
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .navbar .nav-item {
        line-height: 24px;
        font-size: 16px;
    }
    .navbar .dropdown-toggle {
        padding: 0 10px;
        font-size: 16px;
    }

    .navbar ul {
        padding: 5px 0;
    }

    .navbar .btn {
        font-weight: 300;
    }

    .navbar-collapse {
        order: 0 !important;
    }

    .navbar .notifications-nav .dropdown-menu {
        width: 23rem; }

    .navbar-expand-lg .navbar-nav {
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        flex-direction: row;
    }

    .btn-transparent {
        background-color: transparent !important;
        color: #000;
        text-transform: none;
        box-shadow: none !important;
    }

    .btn-transparent:hover, .btn-transparent:active {
        box-shadow: none !important;
    }
    .clearfix:hover{
        cursor: pointer;
    }

</style>