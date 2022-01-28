<template>
  <div id="app" class="fixed-sn">

    <side-nav class="white-skin" :toggle="sidenavToggle" @toggle="setToggle"/>


    <div class="flexible-content" >
      <navbar
              :page="activePage"
              @open-login-form="loginForm=true"
              @toggle-side-nav="sidenavToggle = true"
      />


      <main>
        <div>
          <mdb-container>
            <nuxt/>
          </mdb-container>
        </div>
        <login-modal :show="loginForm" @hide="loginForm=false"/>
      </main>


    </div>

  </div>
</template>

<script>
  import '@fortawesome/fontawesome-svg-core/styles.css';
  import SideNav from './../components/main/SideNav'
  import Navbar from './../components/main/Navbar'
  import LoginModal from "../components/UIcomponents/Modals/loginModal";
  // import Copyrights from './components/Footer'

  export default {
    name: 'App',
    layout: "empty",
    components: {
      LoginModal,
      SideNav,
      Navbar,
      // Copyrights
    },
    methods:{
      setToggle(toggle){
        this.sidenavToggle = toggle
      }
    },
    data () {
      return {
        activePage: 'Dashboard v.1',
        loginForm: false,
        sidenavToggle: true
      }
    },
    mounted () {
      this.activePage = this.$route.name
    },
    updated () {
      this.activePage = this.$route.name
    }
  }
</script>

<style>
  html {
    font-size: 16px;
    width: 100%;
  }

  h1, h2, h3, h4, h5, h6, p, button, a, ul, li{
    font-family: 'Roboto', 'Arial', 'Calibri';
  }

  body {
    font-weight: 300;
    background-color: #eee!important;
  }

  main {
    min-height: 90vh;
  }

  .fixed-sn footer {
    padding-left: 0;
  }

  .side-nav .logo-sn {
    padding-bottom: 1rem;
    padding-top: 1rem;
    border-bottom: 1px solid rgba(153, 153, 153, 0.3);
  }

  .navbar .btn, .navbar .nav-item, .navbar .nav-link {
    padding: 0;
  }

  .select-wrapper input.select-dropdown {
    font-size: 14px;
  }

  .form-control {
    font-size: 14px;
  }

  .cascading-admin-card {
    margin-top: 20px; }
  .cascading-admin-card .admin-up {
    margin-left: 4%;
    margin-right: 4%;
    margin-top: -20px; }
  .cascading-admin-card .admin-up .fas, .cascading-admin-card .admin-up .far, .cascading-admin-card .admin-up .fab {
    padding: 1.7rem;
    font-size: 2rem;
    color: #fff;
    text-align: left;
    -webkit-border-radius: 3px;
    border-radius: 3px; }
  .cascading-admin-card .admin-up .data {
    float: right;
    margin-top: 2rem;
    text-align: right; }
  .cascading-admin-card .admin-up .data p {
    color: #999999;
    font-size: 12px; }

  .classic-admin-card .card-body {
    color: #fff;
    margin-bottom: 0;
    padding: 0.9rem; }
  .classic-admin-card .card-body p {
    font-size: 13px;
    opacity: 0.7;
    margin-bottom: 0; }
  .classic-admin-card .card-body h4 {
    margin-top: 10px; }
  .classic-admin-card .card-body .float-right .fas, .classic-admin-card .card-body .float-right .far, .classic-admin-card .card-body .float-right .fab {
    font-size: 3rem;
    opacity: 0.5; }

  .table-ui {
    border: 1px solid #e0e0e9;
  }

  .fullscreen {
    background: #fff;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 100000;
    min-height: 100vh;
  }

  .fullscreen-view {
    height: 100vh;
  }

  .form-control {
    height: calc(2rem + 1px);
    padding: 0.375rem 0.75rem;
  }

  .list-group .ml-auto {
    float: right;
    flex: none !important;
  }

  .datepicker-overlay {
    z-index: 9999 !important;
  }


  .navbar-brand {
    cursor: pointer
  }
</style>