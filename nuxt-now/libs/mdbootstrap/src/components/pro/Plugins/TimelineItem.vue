<template>
  <li ref="timelineItem" :class="wrapperClass">
    <!--Section Title -->
    <a :href="href">
      <span :class="markerClass">
        <mdb-icon v-if="icon" :far="far" :fad="fad" :fal="fal" :class="iconClass" :icon="icon" :fab="fab" aria-hidden="true"></mdb-icon>
        <p v-else>{{marker}}</p>
      </span>
    </a>

    <div v-if="light" class="timeline-tail"></div>

    <div v-if="animation" v-animateOnScroll="animation" :class="stepClass">
      <mdb-icon
      v-if="!light"
      :color="colorful ? color : 'white'" 
      :class="arrowClass" 
      :icon="inverted || width < 1200? 'caret-left' : 'caret-right'" 
      size="3x"
      :style="colorful ? 'top: 8px' : ''"/>
      <h4 v-if="!light && title" class='font-weight-bold' :class="headerClass">{{title}}</h4>
      <p v-if="time && !light" class="text-muted mt-4" :class="colorful && 'px-4'"><mdb-icon far icon="clock" aria-hidden="true"/> {{time}}</p>
      <p
        class="mb-0 mt-4" :class="colorful && 'px-4 pb-4'"
      >{{content}}</p>
    </div>

    <div v-else :class="stepClass" ref="stepContent">
      <img v-if="image && !light" :src="imgSrc" class="img-fluid">
      <mdb-icon
      v-if="!light && !image" 
      :color="colorful ? color : 'white'" 
      :class="arrowClass" 
      :icon="inverted || width < 1200? 'caret-left' : 'caret-right'" 
      size="3x"
      :style="colorful ? 'top: 8px' : ''"/>
      <h4 v-if="!light" class='font-weight-bold' :class="headerClass">{{title}}</h4>
      <p v-if="time && !light" class="text-muted mt-4" :class="colorful || image && 'px-4'"><mdb-icon far icon="clock" aria-hidden="true"/> {{time}}</p>
      <p
        v-if="content"
        :class="textClass"
      >{{content}}</p>
      <slot></slot>
    </div>
  </li>
</template>

<script>
import mdbIcon from "../../Content/Fa";
import mdbBtn from "../../Components/Button";
import animateOnScroll from '../../../directives/AnimateOnScroll';

const TimelineItem = {
  name: "TimelineItem",
  components: {
    mdbIcon,
    mdbBtn
  },
  props: {
    tag: {
      type: String,
      default: "li"
    },
    content: {
      type: String,
    },
    title: {
      type: String,
    },
    icon: String,
    marker: String,
    far: {
      type: Boolean,
      default: false
    },
    fab: {
      type: Boolean,
      default: false
    },
    fad: {
      type: Boolean,
      default: false
    },
    fal: {
      type: Boolean,
      default: false
    },
    inverted: {
      type: Boolean,
      default: false
    },
    time: String,
    href: {
      type: String,
      default: "#!"
    },
    color: {
      type: String,
    },
    iconClass: {
      type: String,
    },
    tailStyle: {
      type: String,
      default: 'solid'
    },
    tailColor: {
      type: String,
      default: '#E8E8E8'
    },
    animation: [Object, String],
    imgSrc: String
  },
  data() {
    return {
      colors: ["primary", "secondary", "danger", "warning", "success", "info", "default", "elegant", "stylish", "unique", "special", "mdb"],
      width: null
    };
  },
  computed: {
    colorful() {
      return this.$parent.colorful;
    },
    simple() {
      return this.$parent.simple;
    },
    light() {
      return this.$parent.light;
    },
    image() {
      return this.$parent.images;
    },
    hoverable() {
      return this.$parent.hoverable;
    },
    lineColor(){
      return this.$parent.lineColor;
    },
    wrapperClass() {
      return [
        this.light ? 'd-flex align-items-end pb-3 relative-container' : "timeline-item-wrapper",
        this.inverted ? 'timeline-inverted' : ''
      ];
    },
    // timelineItemClass() {
    //   return [
    //     this.light && "timeline-light-item",
    //     this.inverted && "timeline-inverted"
    //   ];
    // },
    markerClass(){
      return [
        "circle",
        this.simple || this.light ? '' : 'z-depth-1-half',
        this.colors.indexOf(this.color) > -1 ? this.color + '-color' : this.color
      ];
    },
    headerClass(){
      return [
        (this.colorful || this.image) && 'p-3',
        this.colorful && `timeline-header ${this.color}-color white-text`,
        this.colorful ? this.colors.indexOf(this.color) > -1 ? this.color + '-color' : this.color : ''
      ];
    },
    arrowClass() {
      return [
        this.inverted || this.width < 1200 ? 'timeline-icon-inverted' : 'timeline-icon',
        this.colorful ? '' : this.inverted || this.width < 1200 ? 'icon-shadow-inverted' : 'icon-shadow'
      ];
    },
    stepClass(){
      return [
        this.light ? '' : 'step-content z-depth-1 ml-xl-0',
        this.colorful || this.image ? this.light ? 'p-0 m-0' : 'p-0 mt-2' : this.light ? 'p-0' : 'p-4',
        this.hoverable && 'hoverable'
      ];
    },
    textClass() {
      return [
        "mb-0",
        this.light ? "mr-2 ml-2" : "mt-4",
        (this.colorful || this.image) && 'px-4 pb-4'
      ];
    }
  },
  methods: {
    setWidth() {
      this.width = window.innerWidth;
    },
    setCSSVariables() {
      this.$refs.timelineItem.style.setProperty('--mdb-timeline-color', this.lineColor);
      this.$refs.timelineItem.style.setProperty('--timeline-border-color', this.tailColor);
      this.$refs.timelineItem.style.setProperty('--timeline-border-style', this.tailStyle);
    }
  },
  mounted() {
    this.setCSSVariables();
    this.setWidth();
    window.addEventListener('resize', this.setWidth);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setWidth);
  },
  directives: {
    animateOnScroll
  }
};

export default TimelineItem;
export { TimelineItem as mdbTimelineItem };
</script>

<style scoped>

.relative-container {
  position: relative;
}

.timeline-light li:not(:last-child) .timeline-tail {
  width: 2px;
  border-left: 2px var(--timeline-border-style) var(--timeline-border-color);
  height: 30px;
  position: absolute;
  left: 9px;
  top: 24px;
}
.timeline-icon {
  position: absolute;
  right: -15px;
  top: 17px;
}

.icon-shadow {
  text-shadow: 6px 2px 8px rgba(0, 0, 0, 0.15);
}

.timeline-icon-inverted {
  position: absolute;
  left: -15px;
  top: 17px;
}

.icon-shadow-inverted {
  text-shadow: -3px 2px 4px rgba(0, 0, 0, 0.15);
}

@media (max-width: 1200px) {
  .stepper.timeline li {
    -webkit-box-align: end;
    -webkit-align-items: flex-end;
    -ms-flex-align: end;
    align-items: flex-end;
  }
}

.stepper.timeline li a {
  padding: 0px 24px;
  left: 50%;
}
@media (max-width: 450px) {
  .stepper.timeline li a {
    left: 6%;
  }
}
@media (min-width: 451px) and (max-width: 1200px) {
  .stepper.timeline li a {
    left: 6%;
  }
}
.stepper.timeline li a .circle {
  width: 50px;
  height: 50px;
  line-height: 50px;
  font-size: 1.4em;
  text-align: center;
  position: absolute;
  top: 16px;
  margin-left: -50px;
  background-color: #ccc;
  z-index: 2;
}

.stepper.timeline li .step-content {
  width: 45%;
  float: left;
  border-radius: 2px;
  position: relative;
}

@media (max-width: 450px) {
  .stepper.timeline li .step-content {
    width: 80%;
    left: 3rem;
    margin-right: 3rem;
    margin-bottom: 2rem;
    float: right;
  }
}
@media (min-width: 451px) and (max-width: 1200px) {
  .stepper.timeline li .step-content {
    width: 85%;
    left: 3rem;
    margin-right: 3rem;
    margin-bottom: 2rem;
    float: right;
  }
}

.stepper.timeline li.timeline-inverted {
  -webkit-box-align: end;
  -webkit-align-items: flex-end;
  -ms-flex-align: end;
  align-items: flex-end;
}
.stepper.timeline li.timeline-inverted .step-content {
  float: right;
}

.stepper.stepper-vertical li:not(:last-child):after {
  content: " ";
  position: absolute;
  width: 3px;
  background-color: #e0e0e0;
  left: 50%;
  top: 57px;
  margin-left: -1.5px;
}
@media (max-width: 450px) {
  .stepper.stepper-vertical li:not(:last-child):after {
    left: 6%;
  }
}
@media (min-width: 451px) and (max-width: 1200px) {
  .stepper.stepper-vertical li:not(:last-child):after {
    left: 6%;
  }
}

@media (max-width: 1200px) {
  .stepper.colorful-timeline li {
    -webkit-box-align: end;
    -webkit-align-items: flex-end;
    -ms-flex-align: end;
    align-items: flex-end;
  }
}

.stepper.colorful-timeline li a {
  padding: 0px 24px;
  left: 50%;
}
@media (max-width: 450px) {
  .stepper.colorful-timeline li a {
    left: 6%;
  }
}
@media (min-width: 451px) and (max-width: 1200px) {
  .stepper.colorful-timeline li a {
    left: 6%;
  }
}
.stepper.colorful-timeline li a .circle {
  width: 50px;
  height: 50px;
  line-height: 50px;
  font-size: 1.4em;
  text-align: center;
  position: absolute;
  top: 16px;
  margin-left: -50px;
  background-color: #ccc;
  z-index: 2;
}

.stepper.colorful-timeline li .step-content {
  width: 45%;
  float: left;
  border-radius: 2px;
  position: relative;
}

@media (max-width: 450px) {
  .stepper.colorful-timeline li .step-content {
    width: 80%;
    left: 3rem;
    margin-right: 3rem;
    margin-bottom: 2rem;
    float: right;
  }
  .stepper.colorful-timeline li .step-content:before {
    border-left-width: 0;
    border-right-width: 15px;
    left: -15px;
    right: auto;
  }
  .stepper.colorful-timeline li .step-content:after {
    border-left-width: 0;
    border-right-width: 14px;
    left: -14px;
    right: auto;
  }
}
@media (min-width: 451px) and (max-width: 1200px) {
  .stepper.colorful-timeline li .step-content {
    width: 85%;
    left: 3rem;
    margin-right: 3rem;
    margin-bottom: 2rem;
    float: right;
  }
  .stepper.colorful-timeline li .step-content:before {
    border-left-width: 0;
    border-right-width: 15px;
    left: -15px;
    right: auto;
  }
  .stepper.colorful-timeline li .step-content:after {
    border-left-width: 0;
    border-right-width: 14px;
    left: -14px;
    right: auto;
  }
}
.stepper.colorful-timeline li .step-content .timeline-header {
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}

.stepper.colorful-timeline li.timeline-inverted {
  -webkit-box-align: end;
  -webkit-align-items: flex-end;
  -ms-flex-align: end;
  align-items: flex-end;
}
.stepper.colorful-timeline li.timeline-inverted .step-content {
  float: right;
}
.stepper.colorful-timeline li.timeline-inverted .step-content:before {
  border-left-width: 0;
  border-right-width: 15px;
  left: -15px;
  right: auto;
}
.stepper.colorful-timeline li.timeline-inverted .step-content:after {
  border-left-width: 0;
  border-right-width: 14px;
  left: -14px;
  right: auto;
}

@media (max-width: 450px) {
  .stepper.stepper-vertical.colorful-timeline li:not(:last-child):after {
    left: 6%;
  }
}
@media (min-width: 451px) and (max-width: 1200px) {
  .stepper.stepper-vertical.colorful-timeline li:not(:last-child):after {
    left: 6%;
  }
}

@media (max-width: 450px) {
  .stepper.stepper-vertical li:not(:last-child):after {
    left: 6%;
  }
}
@media (min-width: 451px) and (max-width: 1200px) {
  .stepper.stepper-vertical li:not(:last-child):after {
    left: 6%;
  }
}

@media (max-width: 1200px) {
  .stepper.timeline-simple li {
    -webkit-box-align: end;
    -webkit-align-items: flex-end;
    -ms-flex-align: end;
    align-items: flex-end;
  }
}

.stepper.timeline-simple li a {
  padding: 0px;
  left: 50%;
}
@media (max-width: 450px) {
  .stepper.timeline-simple li a {
    left: 6%;
  }
}
@media (min-width: 451px) and (max-width: 1200px) {
  .stepper.timeline-simple li a {
    left: 6%;
  }
}
.stepper.timeline-simple li a .circle {
  margin-top: 0.9rem;
  width: 23px;
  height: 23px;
  line-height: 23px;
  font-size: 1.4em;
  text-align: center;
  position: absolute;
  top: 16px;
  margin-left: -12px;
  background-color: #ccc;
  z-index: 2;
}

.stepper.timeline-simple li .step-content {
  width: 45%;
  float: left;
  border-radius: 2px;
  position: relative;
}

@media (max-width: 450px) {
  .stepper.timeline-simple li .step-content {
    width: 80%;
    left: 3rem;
    margin-right: 3rem;
    margin-bottom: 2rem;
    float: right;
  }
  .stepper.timeline-simple li .step-content:before {
    border-left-width: 0;
    border-right-width: 15px;
    left: -15px;
    right: auto;
  }
  .stepper.timeline-simple li .step-content:after {
    border-left-width: 0;
    border-right-width: 14px;
    left: -14px;
    right: auto;
  }
}
@media (min-width: 451px) and (max-width: 1200px) {
  .stepper.timeline-simple li .step-content {
    width: 85%;
    left: 3rem;
    margin-right: 3rem;
    margin-bottom: 2rem;
    float: right;
  }
  .stepper.timeline-simple li .step-content:before {
    border-left-width: 0;
    border-right-width: 15px;
    left: -15px;
    right: auto;
  }
  .stepper.timeline-simple li .step-content:after {
    border-left-width: 0;
    border-right-width: 14px;
    left: -14px;
    right: auto;
  }
}

.stepper.timeline-simple li.timeline-inverted {
  -webkit-box-align: end;
  -webkit-align-items: flex-end;
  -ms-flex-align: end;
  align-items: flex-end;
}
.stepper.timeline-simple li.timeline-inverted .step-content {
  float: right;
}

.stepper.stepper-vertical.timeline-simple li:not(:last-child):after {
  content: " ";
  position: absolute;
  width: 2px;
  background-color: var(--mdb-timeline-color);
  left: 50%;
  top: 32px;
  height: 100%;
  margin-left: -1.5px;
}

@media (max-width: 450px) {
  .stepper.stepper-vertical.timeline-simple li:not(:last-child):after {
    left: 6%;
  }
}
@media (min-width: 451px) and (max-width: 1200px) {
  .stepper.stepper-vertical.timeline-simple li:not(:last-child):after {
    left: 6%;
  }
}

@media (max-width: 1200px) {
  .stepper.timeline-images li {
    -webkit-box-align: end;
    -webkit-align-items: flex-end;
    -ms-flex-align: end;
    align-items: flex-end;
  }
}

.stepper.timeline-images li a {
  padding: 0px;
  left: 50%;
}
@media (max-width: 450px) {
  .stepper.timeline-images li a {
    left: 6%;
  }
}
@media (min-width: 451px) and (max-width: 1200px) {
  .stepper.timeline-images li a {
    left: 6%;
  }
}
.stepper.timeline-images li a .circle {
  margin-top: 0.9rem;
  width: 23px;
  height: 23px;
  line-height: 23px;
  font-size: 1em;
  text-align: center;
  position: absolute;
  top: 16px;
  margin-left: -12px;
  background-color: #ccc;
  z-index: 2;
}

.stepper.timeline-images li .step-content {
  width: 45%;
  float: left;
  border-radius: 2px;
  position: relative;
}
.stepper.timeline-images li .step-content.hoverable {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
.stepper.timeline-images li .step-content.hoverable:hover {
  box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
@media (max-width: 450px) {
  .stepper.timeline-images li .step-content {
    width: 80%;
    left: 3rem;
    margin-right: 3rem;
    margin-bottom: 2rem;
    float: right;
  }
}
@media (min-width: 451px) and (max-width: 1200px) {
  .stepper.timeline-images li .step-content {
    width: 85%;
    left: 3rem;
    margin-right: 3rem;
    margin-bottom: 2rem;
    float: right;
  }
}

.stepper.timeline-images li.timeline-inverted {
  -webkit-box-align: end;
  -webkit-align-items: flex-end;
  -ms-flex-align: end;
  align-items: flex-end;
}
.stepper.timeline-images li.timeline-inverted .step-content {
  float: right;
}

.stepper.stepper-vertical.timeline-images li:not(:last-child):after {
  content: " ";
  position: absolute;
  width: 2px;
  background-color: var(--mdb-timeline-color);
  left: 50%;
  top: 32px;
  height: 100%;
  margin-left: -1.5px;
}
@media (max-width: 450px) {
  .stepper.stepper-vertical.timeline-images li:not(:last-child):after {
    left: 6%;
  }
}
@media (min-width: 451px) and (max-width: 1200px) {
  .stepper.stepper-vertical.timeline-images li:not(:last-child):after {
    left: 6%;
  }
}


</style>