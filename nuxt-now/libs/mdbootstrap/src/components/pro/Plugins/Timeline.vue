<template>
  <ul :class="timelineClass">
    <slot></slot>
  </ul>
</template>

<script>
import mdbTimelineItem from "./TimelineItem";

const Timeline = {
  name: "Timeline",
  components: {
    mdbTimelineItem
  },
  props: {
    light: {
      type: Boolean,
      default: false
    },
    colorful: {
      type: Boolean,
      default: false
    },
    simple: {
      type: Boolean,
      default: false
    },
    images: {
      type: Boolean,
      default: false
    },
    lineColor: {
      type: String,
      default: 'rgb(204, 204, 204)'
    }
  },
  data() {
    return {
      offsetTop: 0,
      elements: []
    };
  },
  computed: {
    timelineClass() {
      return [
        this.light ? "timeline-light" : "stepper stepper-vertical",
        this.colorful ? "colorful-timeline" : this.simple ? "timeline-simple" : this.images ? "timeline-images" : "timeline"
      ];
    }
  }
};

export default Timeline;
export { Timeline as mdbTimeline };
</script>

<style>
  .timeline-light {
    list-style: none;
    padding-left: 1em;
    line-height: 1.5em;
    font-size: 20px;
  }

  .timeline-light .timeline-light-item {
      position: relative;
  }

  .timeline-light .timeline-light-item.timeline-light-item-tail {
        position: absolute;
        border-left: 2px solid #E8E8E8;
        height: 100%;
        width: 0;
        bottom: 0;
        left: 14px;
      }

  .timeline-light .timeline-light-item.timeline-light-item-head {
        position: absolute;
        width: 14px;
        height: 14px;
        left: 15px;
        bottom: 4px;
        transform: translate(-50%, 0);
        border: 2px solid #1890FF;
        border-radius: 50%;
        background: #fff;
        z-index: 1;
      }

    .timeline-light .timeline-light-item.timeline-light-item-content {
        margin-left: 30px;
        padding-top: 0.2em;
        line-height: 3em;
        height: 2em;
      }
</style>
