<template>
  <transition :name="transitionName">
    <div ref="overlay" v-if="show" class="sliding-card-overlay">
      <div :style="wrapperStyle">
      <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
const SlidingCard = {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'bottom'
    },
    width: Number
  },
  computed: {
    transitionName() {
      return `sliding-card-${this.direction}`;
    },
    wrapperStyle(){
      return this.width ? `min-width: ${this.width}px;` : '';
    }
  }
};

export default SlidingCard;
export { SlidingCard as mdbSlidingCard };
</script>

<style>
.sliding-card-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: white;
  z-index: 100;
}

/* bottom */

.sliding-card-bottom-enter-active {
  transition-property: top, height, overflow;
  transition-duration: 0.4s;
  transition-timing-function: linear;
}

.sliding-card-bottom-leave-active {
  transition: all 0.4s ease-out;
}

.sliding-card-bottom-enter-to,
.sliding-card-bottom-leave {
  top: 0;
  overflow: hidden;
  height: 95%;
}

.sliding-card-bottom-enter,
.sliding-card-bottom-leave-to {
  top: 100%;
  overflow: hidden;
  height: 0px;
}

/* top */

.sliding-card-top-enter-active {
  transition-property: top, height, overflow;
  transition-duration: 0.4s;
  transition-timing-function: linear;
}

.sliding-card-top-leave-active {
  transition: all 0.4s ease-out;
}

.sliding-card-top-enter-to,
.sliding-card-top-leave {
  overflow: hidden;
  height: 100%;
}

.sliding-card-top-enter,
.sliding-card-top-leave-to {
  overflow: hidden;
  height: 0px;
}
/* left */

.sliding-card-left-enter-active {
  transition-property: all;
  transition-duration: 0.4s;
  transition-timing-function: linear;
}

.sliding-card-left-leave-active {
  transition: all 0.4s ease-out;
}

.sliding-card-left-enter-to,
.sliding-card-left-leave {
  overflow: hidden;
  width: 100%;
}

.sliding-card-left-enter,
.sliding-card-left-leave-to {
  overflow: hidden;
  width: 0px;
}

/* right */

.sliding-card-right-enter-active {
  transition-property: left, width, overflow;
  transition-duration: 0.4s;
  transition-timing-function: linear;
}

.sliding-card-right-leave-active {
  transition: all 0.4s ease-out;
}

.sliding-card-right-enter-to,
.sliding-card-right-leave {
  left: 0;
  overflow: hidden;
  width: 100%;
}

.sliding-card-right-enter,
.sliding-card-right-leave-to {
  left: 100%;
  overflow: hidden;
  width: 0;
}


</style>
