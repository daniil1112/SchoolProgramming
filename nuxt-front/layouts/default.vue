<template>
  <div>
    <Navbar />
    <main>
        <nuxt />
        <Alert />
    </main>
  </div>
</template>
<script>
  import Alert from '@/components/Alert'
  import Navbar from "../components/Navbar";
  export default {
    components: {Navbar,Alert},
  }
</script>

<style>

</style>
