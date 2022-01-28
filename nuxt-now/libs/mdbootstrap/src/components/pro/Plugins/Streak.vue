<template>
<div :class="wrapperClasses" class="streak" :style="streakWrapperStyle">
  <div class="flex-center" :class="overlayClasses">
    <ul class="mb-0 list-unstyled">
      <li>
        <h2 class="h2-responsive" :class="quoteClasses">
          <Fa icon="quote-left" aria-hidden="true" v-if="marks"/> {{quote}}
          <Fa icon="quote-right" aria-hidden="true" v-if="marks"/></h2>
      </li>
      <li class="mb-0">
        <h5 class="text-center font-italic mb-0" :class="byClasses">~ {{by}}</h5>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import Fa from '../../Content/Fa';
const Streak = {
  name: 'Streak',
  props: {
    quote: {
      type: String
    },
    by: {
      type: String
    },
    md: {
      type: Boolean
    },
    lg: {
      type: Boolean
    },
    marks: {
      default: true
    },
    wrapperClass: {
      type: String,
      default: 'grey lighten-3'
    },
    quoteClass: {
      type: String,
      default: ''
    },
    byClass: {
      type: String,
      default: ''
    },
    overlayClass: {
      type: String
    },
    picture: {
      type: String
    }
  },
  components: {
    Fa
  },
  computed: {
    wrapperClasses() {
      let classList = [];
      classList.push(this.wrapperClass);
      this.md && classList.push('streak-md');
      this.lg && classList.push('streak-lg');
      this.picture && classList.push('streak-photo');
      return classList;
    },
    quoteClasses() {
      let classList=[];
      classList.push(this.quoteClass);
      
      return classList;
    },
    byClasses() {
      let classList=[];
      classList.push(this.byClass);
      
      return classList;
    },
    streakWrapperStyle() {
      return this.picture ? {'background-image':`url("${this.picture}")`} : false;
    },
    overlayClasses() {
      let classList=[];
      classList.push(this.overlayClass);
      return classList;
    }
  }
};

export default Streak;
export {Streak as mdbStreak};
</script>

<style>

</style>
