<template>
  <component :is="tag" :class="className"><slot></slot></component>
</template>

<script>
const Testimonial = {
  props: {
    tag: {
      type: String,
      default: "div"
    }
  },
  computed: {
    className() {
      return [
        'testimonial',
        this.classes
      ];
    }
  }
};

export default Testimonial;
export { Testimonial as mdbTestimonial };
</script>

<style scoped>
</style>
