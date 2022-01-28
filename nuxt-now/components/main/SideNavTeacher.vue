<template>
    <div class="white-skin mdb-admin-sidenav">
        <mdb-side-nav
                logo="https://mdbootstrap.com/img/logo/mdb-transaprent-noshadows.png"
                sideNavClass="sn-bg-4"
                mask="strong"
                :isCollapsed="toggle"
                @mouseover.native="toggle=false"
                @mouseleave.native="toggle=true"
                expand-on-hover
        >
            <li>
                <mdb-side-nav-nav v-if="$auth.loggedIn"
                                  over
                                  expand-on-hover
                                  slim>

                    <mdb-side-nav-cat name="Тесты" icon="tasks" >
                        <mdb-side-nav-item
                                to="/teacherinterface/materials/tests/create"
                                icon="plus"
                                @click.native="width < 1440 && toggleSideNav(false)"
                        >Добавить</mdb-side-nav-item>
                        <mdb-side-nav-item
                                to="/teacherinterface/materials/blocks/create"
                                icon="plus"
                                @click.native="width < 1440 && toggleSideNav(false)"
                        >Создать блок тестов</mdb-side-nav-item>
                    </mdb-side-nav-cat>
                    <mdb-side-nav-cat name="Программирование" icon="laptop" >
                        <mdb-side-nav-item
                                header
                                icon="plus"
                                @click.native="width < 1440 && toggleSideNav(false)"
                                to="/teacherinterface/materials/programming/add">Создать задачу</mdb-side-nav-item>
                        <mdb-side-nav-item
                                header
                                icon="list"
                                @click.native="width < 1440 && toggleSideNav(false)"
                                to="/teacherinterface/materials/programming/all">Список задач</mdb-side-nav-item>
                    </mdb-side-nav-cat>

                    <mdb-side-nav-item
                            icon="users"
                            header
                            @click.native="width < 1440 && toggleSideNav(false)"
                            to="/teacherinterface/groups">
                        Группы
                    </mdb-side-nav-item>
                </mdb-side-nav-nav>
            </li>
        </mdb-side-nav>
    </div>
</template>

<script>


    import Vue from 'vue'


    import waves from '@/libs/mdbootstrap/src/mixins/waves.js'



    export default {
        name: "SideNavTeacher",
        props: {
            waves: {
                type: Boolean,
                default: true
            },
            toggle: {
                type: Boolean
            }
        },





        data() {
            return {
                active: 0,
                elHeight: 0,
                windowHeight: 0,
                toggle: true,
                width: 0
            };
        },
        methods: {
            toggleSideNav(type) {
                this.$emit('toggle',type)
            },
            afterEnter(el) {
                el.style.maxHeight = "1000px";
            },
            beforeLeave(el) {
                el.style.maxHeight = 0;
            },
            setWidth() {
                this.width = window.innerWidth;
            },
        },
        mounted() {
            this.setWidth();
            window.addEventListener("resize", this.setWidth);
        },
        beforeDestroy() {
            window.removeEventListener("resize", this.setWidth);
        },
        watch: {
            toggle(value) {
                this.toggleSideNav(value);
            },
            sidenav(value) {
                this.toggle = value;
            },
            width(value) {
                if (value < 1440) {
                    this.toggle = false;
                } else this.toggle = true;
            }
        },
        mixins: [waves]
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style>
    .side-nav {
        opacity: 1 !important;
        transition: transform 0.3s linear !important;
    }
</style>