<template>
  <component :is="tag" :class="className">
    <!-- controlls  multiitem -->
    <div v-if="multi && controlls" :class="'controls-top'">
      <mdb-btn
        tag="a"
        :class="navClass"
        :color="navColor"
        :floating="floating"
        :icon="leftIcon"
        @click="changeItem(activeItem - 1)"
      ></mdb-btn>
      <mdb-btn
        tag="a"
        :class="navClass"
        :color="navColor"
        :floating="floating"
        :icon="rightIcon"
        @click="changeItem(activeItem + 1)"
      ></mdb-btn>
    </div>
    <div v-else-if="testimonial && controlls">
      <a
        class="carousel-control carousel-control-prev left"
        style="z-index: 1000"
        @click="changeItem(activeItem - 1)"
      >
        <span class="icon-prev" aria-hidden="true"></span>
        <span class="sr-only">Prev</span>
      </a>
      <a
        class="carousel-control carousel-control-next right"
        style="z-index: 1000"
        @click="changeItem(activeItem + 1)"
      >
        <span class="icon-next" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
    <!-- controlls -->

    <!-- carousel inner -->

    <div
      class="carousel-inner"
      v-touch:swipe.left="swipeLeft"
      v-touch:swipe.right="swipeRight"
    >
      <div v-if="multi" class="items-container w-100 container p-0">
        <div
          v-for="(set, i) in sets"
          class="item animated row"
          :key="i"
          v-show="i === prevItem || i === activeItem"
          :style="{
            'z-index': `${i === activeItem ? '2' : i === prevItem ? '1' : '0'}`,
            position: `${i === activeItem ? 'relative' : 'absolute'}`
          }"
          :class="
            `${
              i === activeItem ? enterClass : i === prevItem ? leaveClass : ''
            }`
          "
        >
          <mdb-col
            :col="`${Math.floor(12 / visibleItems)}`"
            v-for="item in set"
            :key="item"
            class="p-3"
            style="height: max-content;"
          >
            <slot :name="item + 1"></slot>
          </mdb-col>
        </div>
      </div>

      <div v-else class="items-container w-100 p-0">
        <div
          v-for="(item, i) in items"
          class="item animated"
          :key="i"
          :style="
            `z-index: ${
              i === activeItem ? '2' : i === prevItem ? '1' : '0'
            }; position: ${i === activeItem ? 'relative' : 'absolute'}`
          "
          :class="`${i === activeItem ? enterClass : leaveClass}`"
        >
          <div>
            <slot v-if="customSlots" :name="`${i + 1}`"></slot>

            <mdb-view v-else>
              <img
                v-if="items[i].img"
                :src="items[i].src"
                :alt="items[i].alt"
                class="d-block w-100"
              />
              <video
                v-if="items[i].video"
                class="video-fluid d-block"
                :autoPlay="items[i].auto"
                :loop="items[i].loop"
                :muted="items[i].muted"
              >
                <source :src="items[i].src" type="video/mp4" />
              </video>
              <mdb-mask
                v-if="items[i].mask"
                :overlay="items[i].mask"
              ></mdb-mask>
            </mdb-view>
            <div
              v-if="typeof items !== 'number' && items[i].caption"
              class="carousel-caption animated"
              :class="
                items[i].caption.animation
                  ? items[i].caption.animation
                  : 'fadeIn'
              "
            >
              <h3 class="h3-responsive" v-if="items[i].caption.title">
                {{ items[i].caption.title }}
              </h3>
              <p v-if="items[i].caption.text">{{ items[i].caption.text }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- default controls -->

      <div v-if="controlls && !multi && !testimonial">
        <a
          class="carousel-control-prev"
          @click="changeActiveItem(activeItem - 1)"
          style="z-index: 1000"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Prev</span>
        </a>
        <a
          class="carousel-control-next"
          @click="changeActiveItem(activeItem + 1)"
          style="z-index: 1000"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>

      <!-- default controlls  -->
    </div>

    <!-- carousel inner  -->

    <!-- indicators  -->
    <ol class="carousel-indicators" v-if="indicators">
      <li
        v-for="index in numOfItems"
        :key="index - 1"
        :class="
          `${activeItem === index - 1 ? 'active' : ''} ${indicatorsColor}`
        "
        @click="changeActiveItem(index - 1)"
      ></li>
    </ol>
    <!-- indicators -->

    <!-- carousel indicators - thumbnails -->

    <ol class="carousel-indicators" v-if="thumbnails">
      <li
        v-for="(item, i) in items"
        :key="i"
        @click="changeActiveItem(i)"
        :class="{ active: i === activeItem }"
      >
        <img
          :src="item.thumbnail ? item.thumbnail : item.src"
          :width="thumbnailWidth"
        />
      </li>
    </ol>

    <!-- carousel indicators - thumbnails -->
  </component>
</template>

<script>
import mdbCarousel from "../../../mixins/mdbCarousel";
import mdbRow from "../../Layout/Row";
import mdbCol from "../../Layout/Col";
import mdbContainer from "../../Layout/Container";

const Carousel = {
  components: {
    mdbRow,
    mdbCol,
    mdbContainer
  },
  props: {
    multi: {
      type: Boolean,
      default: false
    },
    thumbnails: {
      type: Boolean,
      default: false
    },
    testimonial: {
      type: Boolean,
      default: false
    },
    one: {
      type: Boolean,
      default: false
    },
    touch: {
      type: Boolean,
      default: false
    },
    display: {
      type: Number,
      default: 3
    },
    leftIcon: {
      type: String,
      default: "chevron-left"
    },
    rightIcon: {
      type: String,
      default: "chevron-right"
    },
    floating: {
      type: Boolean,
      default: true
    },
    navClass: {
      type: String
    },
    navColor: {
      type: String,
      default: "primary"
    },
    indicatorsColor: {
      type: String,
      default: "primary"
    },
    thumbnailWidth: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      mobile: false,
      visibleItems: 3
    };
  },
  methods: {
    resizeHandler() {
      if (window.innerWidth > 990 && this.multi) {
        this.visibleItems = this.display;
      } else if (this.multi) {
        this.visibleItems = 1;
      }
    },
    swipeLeft() {
      this.touch && this.changeActiveItem(this.activeItem + 1);
    },
    swipeRight() {
      this.touch && this.changeActiveItem(this.activeItem - 1);
    }
  },
  mounted() {
    window.addEventListener("resize", this.resizeHandler);
    this.visibleItems = window.innerWidth > 990 ? this.display : 1;
  },
  updated() {
    if (this.multi && this.activeItem > this.numOfItems - 1) {
      this.activeItem = this.numOfItems - 1;
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeHandler);
  },
  computed: {
    sets() {
      const dictionary = {};

      const count =
        typeof this.items === "number" ? this.items : this.items.length;

      if (this.one && this.visibleItems !== 1) {
        for (let index = 0; index < count; index++) {
          let next = index + 1 === count ? 0 : index + 1;
          let prev = index - 1 === -1 ? count - 1 : index - 1;

          dictionary[index] = [prev, index, next];
        }

        return Object.values(dictionary);
      }

      let key = 0;

      for (let index = 0; index < count; index++) {
        if (index !== 0 && index % this.visibleItems === 0) key++;

        if (!dictionary[key]) dictionary[key] = [];

        dictionary[key].push(index);
      }

      return Object.values(dictionary);
    },
    numOfItems() {
      const items =
        typeof this.items === "number" ? this.items : this.items.length;

      if (this.one) return this.items;

      if (this.multi) return this.sets.length;

      return items;
    },
    className() {
      return [
        "carousel",
        this.multi ? "carousel-multi-item" : "carousel-fade",
        this.thumbnails && "carousel-thumbnails",
        this.testimonial && "testimonial-carousel"
      ];
    }
  },
  mixins: [mdbCarousel]
};

export default Carousel;
export { Carousel as mdbCarousel };
</script>

<style scoped>
.item {
  min-width: 100%;
  translate: all 1s linear;
  position: absolute;
  top: 0;
}

.items-container {
  position: relative;
  overflow: hidden;
  transition: height 0.25s linear;
}

.carousel {
  height: max-content;
  transition: height 0.25s linear;
}

@media (max-width: 500px) {
  .carousel-multi-item .carousel-indicators li {
    max-width: 0.75rem;
    max-height: 0.75rem;
  }
}

@keyframes slideInOneLeft {
  from {
    visibility: visible;
    transform: translate3d(-33.33333333333%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

.slideInOneLeft {
  -webkit-animation-name: slideInOneLeft;
  animation-name: slideInOneLeft;
}

@-webkit-keyframes slideInOneRight {
  from {
    visibility: visible;
    transform: translate3d(33.33333333333%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideInOneRight {
  from {
    visibility: visible;
    transform: translate3d(33.33333333333%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

.slideInOneRight {
  -webkit-animation-name: slideInOneRight;
  animation-name: slideInOneRight;
}

@-webkit-keyframes slideOutOneLeft {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(-33.33333333333%, 0, 0);
  }
}

@keyframes slideOutOneLeft {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(-33.33333333333%, 0, 0);
  }
}

.slideOutOneLeft {
  -webkit-animation-name: slideOutOneLeft;
  animation-name: slideOutOneLeft;
}

@-webkit-keyframes slideOutOneRight {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(33.33333333333%, 0, 0);
  }
}

@keyframes slideOutOneRight {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(33.33333333333%, 0, 0);
  }
}

.slideOutOneRight {
  -webkit-animation-name: slideOutOneRight;
  animation-name: slideOutOneRight;
}
</style>
