<template>
  <div>
    <a class="carousel-control carousel-item-prev left" @click.prevent="prev">
      <span class="icon-prev" aria-hidden="true"></span>
      <span class="sr-only">Prev</span>
    </a>
    <a class="carousel-control carousel-item-next right" @click.prevent="next">
      <span class="icon-next" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
</template>

<script>
const TestimonialNavigation = {
  methods: {
    prev() {
      this.$emit('changeSlide', {'slideIndex': 'prev'});
    },
    next() {
      this.$emit('changeSlide', {'slideIndex': 'next'});
    }
  }
};

export default TestimonialNavigation;
export { TestimonialNavigation as mdbTestimonialNavigation };
</script>

<style scoped>
</style>
