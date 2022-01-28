<template>
  <div class="mdb-parallax" v-bind:style="{ height: `${handledH}px` }">
    <div :class="wrapperClasses">
      <img :src="src" :alt="alt" ref="img" class="mdb-parallax-image" :style="styles"/>
        <slot></slot>
    </div>
  </div>
</template>

<script>
const Parallax = {
  name: 'Parallax',

  props: {
    // MDBView:
    src: {
      type: String
    },
    alt: {
      type: String
    },
    hover: {
      type: Boolean,
      default: false
    },
    zoom: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: Boolean,
      default: false
    },
    imageClass: {
      type: String
    },
    wrapperClass: {
      type: String
    },
    gradient: {
      type: String
    },
    circle: {
      type: Boolean
    },
    cascade: {
      type: Boolean
    },
    // others:
    height: {
      type: [String, Number],
      default: 500
    },
    factor: {
      type: [Number, String],
      default: 1
    },

  },
  data() {
    return {
      isBooted: false,
      // mixin:
      elOffsetTop: 0,
      parallax: 0,
      parallaxDist: 0,
      percentScrolled: 0,
      scrollTop: 0,
      windowHeight: 0,
      windowBottom: 0
    };
  },

  methods: {
    calcDimensions () {
      const offset = this.$el.getBoundingClientRect();

      // the number of pixels the document is currently scrolled along the vertical axis:
      this.scrollTop = window.pageYOffset;

      // original height of an image minus parallax height:
      this.parallaxDist = this.imgHeight - this.handledH;

      // the element's distance from the top of page plus the ammount of px scrolled
      this.elOffsetTop = offset.top + this.scrollTop;

      // yes
      this.windowHeight = window.innerHeight;

      // the element's distance from the top + height of the window
      this.windowBottom = this.scrollTop + this.windowHeight;
    },
    translate() {
      this.calcDimensions();

      this.percentScrolled = ((this.windowBottom - this.elOffsetTop) / (parseInt(this.handledH) + this.windowHeight));

      this.parallax = Math.round(this.parallaxDist * this.percentScrolled * parseFloat(this.factor));
    },
    listeners() {
      window.addEventListener('scroll', this.translate, false);
      window.addEventListener('resize', this.translate, false);
    },
    init() {
      const img = this.$refs.img;

      if (!img) return;

      if (img.complete) {
        this.translate();
        this.listeners();
      } else {
        img.addEventListener('load', () => {
          this.translate();
          this.listeners();
        }, false);
      }
    },
  },
  mounted() {
    this.init();
  },
  computed: {
    imgHeight() {
      return this.$refs.img.naturalHeight;
    },
    styles() {
      return {
        display: 'block',
        opacity: this.isBooted ? 1 : 0,
        transform: `translate3d(-50%, ${this.parallax}px, 0)`,
        backgroundAttachment: this.fixed? 'fixed' : null,
      };
    },
    wrapperClasses() {
      return {
        'mdb-parallax-image-wrapper': true,
        'view': true,
        'overlay' : this.hover,
        'zoom' : this.zoom,
        'rounded' : this.rounded,
        'rounded-circle' : this.circle,
        'view-cascade': this.cascade,
        [`gradient-card-header ${this.gradient}-gradient`]: this.gradient,
        [this.wrapperClass]: this.wrapperClass,
      };
    },
    handledH() {
      let formattedH;
      if (!isNaN(this.height)) {
        formattedH = parseInt(this.height);
      } else if (this.height === 'full') {
        formattedH = window.innerHeight;
      } else if (this.height === 'half') {
        formattedH = window.innerHeight/2;
      } else {
        throw new Error("mdbParallax height props accepts 'full', 'half' and pixels as values");
      }
      return formattedH;
    },
  },
  watch: {
    parallax() {
      this.isBooted = true;
    }
  },
};
export default Parallax;
export { Parallax as mdbParallax };
</script>

<style scoped>

.mdb-parallax {
  position: relative;
  display: block;
  overflow: hidden;
}

.mdb-parallax-image-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  contain: strict;
}
.mdb-parallax-image {
  position: absolute;
  bottom: 0;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  display: none;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  will-change: transform;
  transition: 0.3s opacity cubic-bezier(0.25, 0.8, 0.5, 1);
}
</style>
