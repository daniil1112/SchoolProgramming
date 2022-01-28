<template>
  <loading :active.sync="loading" :can-cancel="false" :is-full-page="true" />
</template>

<script>
// Import component
import Loading from "vue-loading-overlay"
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css"
export default {
  components: { Loading },
  data: () => {
    return {
      loading: false,
    }
  },

  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    },
  },
}
</script>
