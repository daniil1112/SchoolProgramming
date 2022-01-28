<template>
    <div v-if="show" id="mdb-preloader" class="preloader animated fadeIn" :class="preloaderClass">
        <mdb-spinner :big="big" :small="small" :crazy="crazy" :color="spinnerColor" :multicolor="multicolor" class="spinner"></mdb-spinner>
    </div>
</template>

<script>
import { mdbSpinner } from './Preloader';

const PreloadingScript = {
  components: {
    mdbSpinner
  },
  data() {
    return {
      show: true
    };
  },
  props: {
    color: {
      type: String,
      default: "white"
    },
    opacity: {
      type: Number,
      default: 1
    },
    big: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    crazy: {
      type: Boolean,
      default: false
    },
    spinnerColor: {
      type: String,
      default: "blue"
    },
    multicolor: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    },
    animation: {
      type: String,
      default: 'fadeOut'
    }
  },
  methods: {
    setOpacity(value){
      this.$el.style.opacity = `${value}`;
    },
  },
  watch: {
    loading(newState) {    
      if (newState === false) {
        this.$el.classList.add(this.animation);
        setTimeout(() => {
          this.show = newState;
        }, 2000);
      }
    }
  },
  mounted() {
    this.setOpacity(this.opacity);
  },
  computed: {
    preloaderClass() {
      let colors = ["primary", "secondary", "danger", "warning", "success", "info", "default", "elegant", "stylish", "unique", "special"];
      return [this.color ? colors.indexOf(this.color) === -1 ? this.color : this.color+ "-color" : ""];
    },
  }
};

export default PreloadingScript;
export { PreloadingScript as mdbPreloadingScript };
</script>

<style scoped>
.preloader {
  display: flex;
  justify-content: center;
  align-items: center;
}
.spinner {
  background-color: transparent;
}
</style>
