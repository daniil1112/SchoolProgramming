<template>
  <div>
    <transition name="fade" @enter="showImg = true">
      <div
        v-if="showLightbox"
        class="img-swiper box"
        @click.self="closeDialog"
        ref="box"
      >
        <transition
          enter-active-class="animated zoomIn"
          leave-active-class="animated zoomOut"
          @leave="toggleLightbox(-1)"
        >
          <div v-if="showImg" class="d-flex; justify-content-center">
            <!-- visible image  -->

            <transition-group
              class="list-unstyled d-flex justify-content-center align-items-center w-100 h-100"
              tag="ul"
              style="position: relative;"
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <li
                v-for="img in imgList"
                v-show="img.index === imgIndex"
                v-bind:data-index="index"
                :key="img.index"
                class="img-wrapper"
              >
                <img
                  :style="imgStyle"
                  class="img"
                  :src="img.img"
                  ref="img"
                  :alt="img.caption"
                  draggable="false"
                  @mousedown="dragStart($event, true)"
                  v-touch:start="dragStart"
                  v-touch:end="dragEnd"
                  v-touch:moving="drag"
                  v-touch:tap="tap"
                  v-touch:swipe="swipe"
                />
              </li>
            </transition-group>
          </div>
        </transition>

        <!-- visible image  -->

        <!-- caption  -->

        <div class="caption px-3" v-if="currentImg.caption">
          <p>{{ currentImg.caption }}</p>
        </div>

        <!-- caption -->

        <!-- buttons -->
        <div v-if="!touchScreen">
          <div v-if="imgList.length !== 1" class="btn__prev">
            <mdb-btn
              class="ml-0 pl-0"
              flat
              size="lg"
              :waves="false"
              icon="arrow-left"
              @click="changeImg(-1)"
            />
          </div>

          <div v-if="imgList.length !== 1" class="btn__next">
            <mdb-btn
              class="mr-0 pr-0"
              flat
              size="lg"
              :waves="false"
              icon="arrow-right"
              @click="changeImg(1)"
            />
          </div>

          <div class="d-flex justify-content-end toolbar-btns">
            <mdb-btn
              @click="zoomIn"
              flat
              :waves="false"
              class="white-text m-0 pr-3"
            >
              <mdb-icon size="lg" icon="search-plus" />
            </mdb-btn>
            <mdb-btn
              @click="zoomOut"
              flat
              :waves="false"
              class="white-text m-0 px-3"
            >
              <mdb-icon size="lg" icon="search-minus" />
            </mdb-btn>
            <mdb-btn
              @click="fullscreen = !fullscreen"
              flat
              :waves="false"
              class="white-text m-0 px-3"
            >
              <mdb-icon size="lg" :icon="fullscreen ? 'compress' : 'expand'" />
            </mdb-btn>
            <mdb-btn
              @click="closeDialog"
              flat
              :waves="false"
              class="white-text m-0 p-0 pl-3"
            >
              <mdb-icon size="lg" icon="times" />
            </mdb-btn>
          </div>
        </div>
        <!-- buttons -->

        <!-- pagination -->
        <div v-if="imgList.length !== 1" class="pagination-total">
          {{ imgIndex + 1 }}/{{ imgTotal }}
        </div>
        <!-- pagination -->
      </div>
    </transition>

    <mdb-container v-if="gallery">
      <mdb-row class="mdb-lightbox" :class="{ 'no-margin': !gap }">
        <mdb-col
          :md="`${Math.floor(12 / columns)}`"
          v-for="(img, i) in imgList"
          :key="i"
        >
          <figure>
            <img
              @click="toggleLightbox(i)"
              :src="img.thumbnail"
              class="img-fluid"
              :class="imgClass"
              alt
            />
          </figure>
        </mdb-col>
      </mdb-row>
    </mdb-container>
  </div>
</template>

<script>
import { mdbIcon } from "../../Content/Fa";
import { mdbBtn } from "../../Components/Button";
import { mdbContainer } from "../../Layout/Container";
import { mdbRow } from "../../Layout/Row";
import { mdbCol } from "../../Layout/Col";

const Lightbox = {
  name: "Lightbox",
  props: {
    imgs: {
      type: [Array, String]
    },
    captions: {
      type: [Array, String]
    },
    visible: {
      type: Boolean
    },
    index: {
      type: Number,
      default: 0
    },
    gallery: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Number,
      default: 3
    },
    gap: {
      type: Boolean,
      default: false
    },
    imgClass: {
      type: String
    }
  },
  components: {
    mdbIcon,
    mdbBtn,
    mdbContainer,
    mdbRow,
    mdbCol
  },
  data() {
    return {
      showImg: false,
      show: false,
      fullscreen: false,
      scale: 1,
      rotateDeg: 0,
      imgIndex: 0,
      tapCount: 0,
      top: 0,
      left: 0,
      dragX: false,
      dragY: false,
      dragged: false,
      touchScreen: false,
      point1: null,
      point2: null,
      detectFullscreen: [
        "fullscreenchange",
        "webkitfullscreenchange",
        "mozfullscreenchange",
        "msfullscreenchange"
      ]
    };
  },

  computed: {
    showLightbox() {
      return this.show || this.visible;
    },

    imgList() {
      let imgs;
      if (Object.prototype.toString.call(this.imgs) === "[object Array]") {
        imgs = this.imgs;
      } else {
        imgs = [this.imgs];
      }

      return imgs.map((img, i) => {
        if (typeof img === "object") {
          return { thumbnail: img.img, ...img, index: i };
        }

        const caption = this.captions ? this.captions[i] : "";

        return { thumbnail: img, img, index: i, caption };
      });
    },
    currentImg() {
      return this.imgList
        .filter(img => img.index === this.imgIndex)
        .find(i => i);
    },
    imgTotal() {
      return this.imgList.length || 0;
    },
    imgStyle() {
      return {
        cursor: `${this.dragged ? "move" : "initial"}`,
        position: "relative",
        transform: `
            scale(${this.scale})
            rotate(-${this.rotateDeg}deg)`,
        top: `${this.top}px`,
        left: `${this.left}px`
      };
    }
  },

  methods: {
    changeImg(direction) {
      let next =
        this.imgIndex + direction < 0
          ? this.imgList.length - 1
          : this.imgIndex + direction > this.imgList.length - 1
          ? 0
          : this.imgIndex + direction;
      this.reset();
      this.imgIndex = next;
    },

    closeDialog() {
      if (!this.dragged) {
        this.showImg = false;
        this.init();
      }
    },

    closeFullscreen() {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          /* Firefox */
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          /* Chrome, Safari and Opera */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          /* IE/Edge */
          document.msExitFullscreen();
        }
      }
    },

    detectTouch() {
      this.touchScreen = true;
      window.removeEventListener("touchstart", this.detectTouch, false);
    },

    drag(e) {
      if (this.dragged) {
        this.point2 = { ...this.point1 };

        this.point1 = {
          x: e.clientX || e.touches[0].clientX,
          y: e.clientY || e.touches[0].clientY
        };

        let { boundries } = this.getImagePosition();

        if (this.dragY) {
          let moveY = Math.floor(this.point1.y - this.point2.y);
          moveY =
            moveY < boundries.yMin
              ? boundries.yMin
              : moveY > boundries.yMax
              ? boundries.yMax
              : moveY;
          this.top = this.top + moveY;
        }
        if (this.dragX) {
          let moveX = Math.floor(this.point1.x - this.point2.x);
          moveX =
            moveX < boundries.xMin
              ? boundries.xMin
              : moveX > boundries.xMax
              ? boundries.xMax
              : moveX;

          this.left = this.left + moveX;
        }
      }
    },

    dragEnd() {
      window.removeEventListener("mousemove", this.drag);
      window.removeEventListener("mouseup", this.dragEnd);

      if (this.dragX || this.dragY) {
        this.dragged = false;
      }
    },

    dragStart(e, mouse) {
      if (this.dragX || this.dragY) {
        this.dragged = true;
        this.point1 = {
          x: e.clientX || e.touches[0].clientX,
          y: e.clientY || e.touches[0].clientY
        };
      }

      if (mouse) {
        window.addEventListener("mousemove", this.drag);
        window.addEventListener("mouseup", this.dragEnd);
      }
    },

    getImagePosition() {
      const img = this.$refs.img[this.imgIndex].getBoundingClientRect();

      const boundries = {
        xMax: img.left < 0 ? Math.abs(img.left) : 0,
        xMin: -(img.width - window.innerWidth - Math.abs(img.left)),
        yMax: img.top < 0 ? Math.abs(img.top) : 0,
        yMin: -(img.height - window.innerHeight - Math.abs(img.top))
      };

      const offsets = {
        left: img.left,
        right: img.width - window.innerWidth - Math.abs(img.left),
        top: img.top,
        bottom: img.height - window.innerHeight - Math.abs(img.top)
      };

      return { offsets, boundries };
    },

    handleKeyup(e) {
      if (this.showLightbox) {
        let key = e.keyCode ? e.keyCode : e.which;
        switch (key) {
          case 37:
            this.changeImg(-1);
            break;
          case 39:
            this.changeImg(1);
            break;
          case 38:
            this.zoomIn();
            break;
          case 40:
            this.zoomOut();
            break;
          case 27:
            this.closeDialog();
        }
      }
    },

    handleScroll(e) {
      if (this.showLightbox) {
        if (e.deltaY < 0) this.zoomIn();
        else this.zoomOut();
      }
    },

    init() {
      this.imgIndex = this.index;
      this.fullscreen = false;
      this.scale = 1;
      this.rotateDeg = 0;
      this.top = 0;
      this.left = 0;
    },

    openFullscreen(elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    },

    swipe(e) {
      if (this.scale === 1) {
        let direction = e === "left" ? 1 : -1;
        this.changeImg(direction);
      }
    },

    reset() {
      this.scale = 1;
      this.top = 0;
      this.left = 0;
      this.rotateDeg = 0;
    },

    rotate() {
      this.rotateDeg += 90;
    },

    tap() {
      this.tapCount += 1;

      setTimeout(() => {
        this.tapCount -= 1;
      }, 400);

      if (this.tapCount > 1) {
        let nextScale = this.scale === 1 ? 3 : 1;

        this.scale = nextScale;

        if (this.scale === 1) {
          this.top = 0;
          this.left = 0;
        }
      }
    },

    toggleLightbox(index) {
      if (index === -1) {
        this.$emit("hide");
        this.show = false;
      } else {
        this.show = true;
        this.imgIndex = index;
      }
    },

    toggleFullscreen() {
      if (document.fullscreenElement) return;
      this.fullscreen = false;
    },

    zoomIn() {
      const delta = 0.5;
      this.scale += delta;
    },

    zoomOut() {
      const delta = 0.5;
      this.scale = this.scale - delta > 1 ? this.scale - delta : 1;

      const { offsets } = this.getImagePosition();

      if (offsets.left > 0 || offsets.right < 0) this.left = 0;
      if (offsets.top > 0 || offsets.bottom < 0) this.top = 0;
    }
  },

  mounted() {
    window.addEventListener("touchstart", this.detectTouch, false);

    this.detectFullscreen.forEach(eventType =>
      document.addEventListener(eventType, this.toggleFullscreen, false)
    );

    window.addEventListener("wheel", this.handleScroll);

    window.addEventListener("keyup", this.handleKeyup);
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.handleKeyup);
    window.removeEventListener("wheel", this.handleScroll);
    this.detectFullscreen.forEach(eventType =>
      document.removeEventListener(eventType, this.toggleFullscreen)
    );
  },
  watch: {
    scale(value, prev) {
      const img = this.$refs.img[this.imgIndex].getBoundingClientRect();

      if (value > prev) {
        if (
          img.width * value - window.innerWidth > 0 ||
          img.height - window.innerWidth > 0
        ) {
          this.dragX = true;
        }

        if (img.height * value - window.innerWidth > 0) {
          this.dragY = true;
        }
      } else {
        if (img.width - window.innerWidth < 0 || value === 1) {
          this.dragX = false;
        }

        if (img.height * value - window.innerWidth < 0 || value === 1) {
          this.dragY = false;
        }
      }
    },
    visible(visible) {
      if (visible === true) {
        this.init();
      }
    },
    fullscreen(value) {
      if (value) {
        this.openFullscreen(this.$refs.box);
      } else {
        this.closeFullscreen();
      }
    }
  }
};

export default Lightbox;
export { Lightbox as mdbLightbox };
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.img-swiper {
  position: relative;
}
.box {
  z-index: 9998;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img {
  max-width: 80vw;
  max-height: 80vh;
  transition: transform 0.3s linear;
}

.btn__prev,
.btn__next {
  position: absolute;
  color: #fff;
  opacity: 0.6;
  transition: all 0.2s linear;
}
.btn__prev:hover,
.btn__next:hover,
.btn__close:hover {
  opacity: 1;
}

.btn__next {
  top: 50%;
  right: 20px;
  font-size: 40px;
}
.btn__prev {
  top: 50%;
  left: 20px;
}

.pagination-total {
  position: absolute;
  font-size: 16px;
  top: 16px;
  left: 16px;
  color: white;
  opacity: 0.75;
}

.toolbar-wrapper {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
}

.toolbar-btns {
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 6px;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  padding-right: 50px;
}

.toolbar-btns .btn i {
  opacity: 0.6;
  transition: all 0.3s ease-in-out;
}

.toolbar-btns .btn i:hover {
  opacity: 1;
}

.touch {
  position: relative;
  top: -36px;
}

@media screen and (min-height: 500px) and (max-width: 860px) {
  .touch {
    position: relative;
    top: 250px;
  }
  .img {
    max-width: 100vw;
    max-height: 100vh;
  }
}

.caption {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 0;
  text-align: center;
  color: #ccc;
  padding-top: 15px;
  width: 100vw;
  display: flex;
  justify-content: center;
}

.caption p {
  font-size: 13px;
  max-width: 600px;
}

.img-wrapper {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
