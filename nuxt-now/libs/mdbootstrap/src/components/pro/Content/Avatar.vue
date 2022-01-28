<template>
  <component :is="tag" :class="className" v-bind="$attrs" :style="style">
    <slot></slot>
  </component>
</template>

<script>
const Avatar = {
  props: {
    tag: {
      type: String,
      default: "div"
    },
    wrapperClass: {
      type: String
    },
    round: {
      type: Boolean
    },
    circle: {
      type: Boolean
    },
    width: {
      type: Number,
      default: 100
    }
  },
  computed: {
    className() {
      return [
        "avatar",
        this.round && "rounded",
        this.circle && "rounded-circle",
        this.wrapperClass
      ];
    },
    style() {
      if (this.circle) {
        return {
          height: `${this.width}px!important`,
          width: `${this.width}px!important`
        };
      }
      return {
        width: `${this.width}px!important`
      };
    }
  }
};

export default Avatar;
export { Avatar as mdbAvatar };
</script>

<style scoped>
</style>
