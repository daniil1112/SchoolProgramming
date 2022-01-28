<template>
  <div :class="componentWrapper">
    <!-- stepper within -->
    <div v-if="within">
      <div class="d-flex justify-content-center" style="position: relative;">
        <div class="mx-4" v-for="(step, index) in steps" :key="index">
          <mdb-btn
            tag="a"
            :color="activeStep-1 === index ? stepperOptions.withinBtn.active : stepperOptions.withinBtn.color"
            floating
            class="white-text d-flex justify-content-center align-items-center"
            size="sm"
            @click="changeActiveStep(index+1, true)"
            :icon="step.icon"
            :far="step.far"
            :fab="step.fab"
            :fal="step.fal"
            :fad="step.fad"
          ><span v-if="!step.icon">{{index+1}}</span></mdb-btn>

          <p>{{step.name}}</p>
        </div>
        <span class="line-within"></span>
      </div>
    </div>
    <!-- stepper within -->

    <!-- simpleV -->
    <div v-else-if="simpleV" class="row" :class="{'mt-5': simpleV}">
      <div class="col-md-12">
        <ul :class="simpleClass" class="stepper-linear">
          <li
            v-for="(step, i) in steps"
            :key="i"
            class="step"
            :class="{'active': i + 1 === activeStep}"
          >
            <a class="ripple-parent w-100" @click="handleClick($event, i)">
              <span
                class="circle"
                :class="i + 1 < activeStep ? 'success-color' : i + 1 === activeStep ? stepperOptions.stepBtn.active : stepperOptions.stepBtn.color"
              >
                <mdb-icon v-if="i + 1 < activeStep" icon="check" />
                <span v-else>{{i+1}}</span>
              </span>
              <div class="label">{{step.name || `Step ${i + 1}`}}</div>
            </a>
            <transition
              @before-enter="beforeEnter"
              @enter="enter"
              @before-leave="beforeLeave"
              @leave="leave"
              :duration="{ enter: 600, leave: 200 }"
            >
              <div class="step-content w-100" v-if="i + 1 === activeStep" ref="stepContent">
                <slot :name="`${i+1}`"></slot>
                <p v-if="step.content">{{step.content}}</p>
                <div class="step-actions" v-if="buttons">
                  <mdb-btn
                    v-if="activeStep!==numOfSteps"
                    :color="stepperOptions.nextBtn.color"
                    size="sm"
                    @click="changeActiveStep(activeStep + 1)"
                  >{{stepperOptions.nextBtn.text}}</mdb-btn>
                  <mdb-btn
                    v-if="activeStep!==1 && activeStep!==numOfSteps"
                    :color="stepperOptions.prevBtn.color"
                    size="sm"
                    @click="changeActiveStep(activeStep - 1)"
                  >{{stepperOptions.prevBtn.text}}</mdb-btn>
                  <mdb-btn
                    v-if="activeStep===numOfSteps"
                    :color="stepperOptions.submitBtn.color"
                    size="sm"
                    @click="$emit('submit', $event)"
                  >{{stepperOptions.submitBtn.text}}</mdb-btn>
                </div>
              </div>
            </transition>
          </li>
        </ul>
      </div>
    </div>

    <!-- simpleV -->

    <!-- simpleH -->

    <div v-else-if="simpleH" class="row">
      <div class="col-md-12">
        <ul :class="simpleClass">
          <li
            v-for="(step, i) in steps"
            :key="i"
            class="horizontal-step step"
            :class="{'active': i + 1 === activeStep}"
          >
            <a class="ripple-parent w-100" @click="handleClick($event, i)">
              <span
                class="circle"
                :class="i + 1 < activeStep ? 'success-color' : i + 1 === activeStep ? stepperOptions.stepBtn.active : stepperOptions.stepBtn.color"
              >
                <mdb-icon v-if="i + 1 < activeStep" icon="check" />
                <span v-else>{{i+1}}</span>
              </span>
              <span class="label">{{step.name || `Step ${i + 1}`}}</span>
            </a>
            <span
              :style="i+1 === numOfSteps && 'background-color: transparent'"
              class="simple-line"
            ></span>
          </li>
        </ul>
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="step"
          :class="{'active': i + 1 === activeStep}"
          style="overflow: hidden;"
        >
          <transition enter-active-class="animated slideInLeft">
            <div class="step-content w-100" v-if="i + 1 === activeStep">
              <slot :name="`${i+1}`"></slot>
              <p v-if="step.content">{{step.content}}</p>
              <div class="step-actions" v-if="buttons">
                <mdb-btn
                  v-if="activeStep!==numOfSteps"
                  v-show="stepperOptions.nextBtn.show"
                  :color="stepperOptions.nextBtn.color"
                  size="sm"
                  @click="changeActiveStep(activeStep + 1)"
                >{{stepperOptions.nextBtn.text}}</mdb-btn>
                <mdb-btn
                  v-if="activeStep!==1 && activeStep!==numOfSteps"
                  :color="stepperOptions.prevBtn.color"
                  size="sm"
                  @click="changeActiveStep(activeStep - 1)"
                >{{stepperOptions.prevBtn.text}}</mdb-btn>
                <mdb-btn
                  v-if="activeStep===numOfSteps"
                  v-show="stepperOptions.submitBtn.show"
                  :color="stepperOptions.submitBtn.color"
                  size="sm"
                  @click="$emit('submit', $event)"
                >{{stepperOptions.submitBtn.text}}</mdb-btn>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- simpleH -->

    <div v-else :class="optionalColumnWrapper">
      <div :class="rowClass" :style="rowStyle">
        <div v-for="(step, index) in steps" :key="index">
          <mdb-tooltip trigger="hover" :options="{placement: 'top'}" :ref="'stepContent'+index">
            <div class="tooltip">{{step.name}}</div>
            <mdb-btn
              tag="a"
              floating
              size="lg"
              :color="index+1 === activeStep ? stepperOptions.stepBtn.active : stepperOptions.stepBtn.color"
              :outline="stepperOptions.stepBtn.color || index+1 === activeStep ? null : stepperOptions.stepBtn.outline"
              :iconClass="index+1 === activeStep ? '' : stepperOptions.stepBtn.iconClass"
              slot="reference"
              @click.native="changeActiveStep(index+1, true)"
              waves
              :icon="step.icon"
              :fad="step.fad"
              :far="step.far"
              :fal="step.fal"
              :fab="step.fab"
              :style="stepperOptions.stepBtn.outline && !(index+1 === activeStep) && !stepperOptions.stepBtn.color && 'background-color: white!important;'"
            ></mdb-btn>
          </mdb-tooltip>
        </div>
        <span
          :class="vertical ? `vertical-line ${stepperOptions.lineColor}` : `horizontal-line ${stepperOptions.lineColor}`"
        ></span>
      </div>
    </div>

    <div ref="contentRef" v-if="!(simpleH || simpleV)" :class="optionalContentWrapper">
      <div v-for="(step, i) in steps" :key="i">
        <div v-show="i+1 === activeStep">
          <keep-alive>
            <div>
              <slot :name="`${i+1}`"></slot>
            </div>
          </keep-alive>
        </div>
      </div>
      <mdb-btn
        v-if="buttons && activeStep!==numOfSteps"
        rounded
        class="float-right"
        type="button"
        :color="stepperOptions.nextBtn.outline ? null : stepperOptions.nextBtn.color"
        :outline="stepperOptions.nextBtn.outline"
        @click.native="changeActiveStep(activeStep + 1)"
        :icon="stepperOptions.nextBtn.icon"
        :far="stepperOptions.nextBtn.far"
        :fal="stepperOptions.nextBtn.fal"
        :fab="stepperOptions.nextBtn.fab"
        :fad="stepperOptions.nextBtn.fad"
        iconRight
        iconClass="ml-1"
      >{{stepperOptions.nextBtn.text}}</mdb-btn>
      <mdb-btn
        v-if="buttons && activeStep!==1"
        rounded
        class="float-left"
        type="button"
        :color="stepperOptions.prevBtn.outline ? null : stepperOptions.prevBtn.color"
        :outline="stepperOptions.prevBtn.outline"
        @click.native="changeActiveStep(activeStep - 1)"
        :icon="stepperOptions.prevBtn.icon"
        :far="stepperOptions.prevBtn.far"
        :fal="stepperOptions.prevBtn.fal"
        :fab="stepperOptions.prevBtn.fab"
        :fad="stepperOptions.prevBtn.fad"
        iconClass="mr-1"
      >{{stepperOptions.prevBtn.text}}</mdb-btn>
      <mdb-btn
        v-if="buttons && activeStep==numOfSteps"
        rounded
        class="float-right"
        type="button"
        :color="stepperOptions.submitBtn.outline ? null : stepperOptions.submitBtn.color"
        :outline="stepperOptions.submitBtn.outline"
        :icon="stepperOptions.submitBtn.icon"
        :far="stepperOptions.far"
        :fal="stepperOptions.submitBtn.fal"
        :fab="stepperOptions.submitBtn.fab"
        :fad="stepperOptions.submitBtn.fad"
        iconRight
        iconClass="ml-1"
        @click="$emit('submit', $event)"
      >{{stepperOptions.submitBtn.text}}</mdb-btn>
    </div>
  </div>
</template>

<script>
import mdbTooltip from "../../Advanced/Tooltip";
import mdbBtn from "../../Components/Button";
import mdbStepper from "../../../mixins/mdbStepper";
import waves from "../../../mixins/waves";

const Stepper = {
  components: {
    mdbTooltip,
    mdbBtn
  },
  props: {
    buttons: {
      type: Boolean,
      default: false
    },
    vertical: {
      type: Boolean,
      defaut: false
    },
    within: {
      type: Boolean,
      default: false
    },
    validation: {
      type: Boolean,
      default: false
    },
    validatedSteps: Object,
    options: {
      type: Object,
      default: () => {
        return {};
      }
    },
    linear: {
      type: Boolean,
      default: false
    },
    darkWaves: {
      type: Boolean,
      default: true
    },
    simpleH: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    allValid(step) {
      for (let i = 1; i < step; i++) {
        if (!this.validatedSteps[i]) {
          return false;
        }
      }
      return true;
    },
    allowNext(step, unordered) {
      if (step < this.activeStep) return true;
      if (unordered) {
        return this.allValid(step);
      }
      return this.validatedSteps[this.activeStep];
    },
    validateStep() {
      this.$emit("validate", this.activeStep);
    },
    changeActiveStep(i, unordered = false) {
      if (this.linear && i > this.activeStep + 1) return;

      let step = i < 1 ? 1 : i > this.numOfSteps ? this.numOfSteps : i;

      if (this.validation && step > this.activeStep) this.validateStep();

      if (!this.validation || this.allowNext(step, unordered)) {
        this.activeStep = step;

        this.$emit("changeStep", step);
      }
    },
    handleClick(e, i) {
      this.wave(e);
      this.changeActiveStep(i + 1);
    }
  },
  computed: {
    stepperOptions() {
      return {
        stepBtn: {
          outline: "indigo",
          active: "indigo",
          iconClass: "indigo-text",
          ...this.options.stepBtn
        },
        nextBtn: {
          color: "indigo",
          text: "Next",
          show: true,
          ...this.options.nextBtn
        },
        prevBtn: {
          color: "indigo",
          text: "Previous",
          ...this.options.prevBtn
        },
        submitBtn: {
          color: "success",
          text: "Submit",
          show: true,
          ...this.options.submitBtn
        },
        withinBtn: {
          color: "default",
          active: "indigo",
          ...this.options.withinBtn
        },
        lineColor: this.options.lineColor ? this.options.lineColor : "indigo",
        verticalSpacing: this.options.verticalSpacing
          ? this.options.verticalSpacing
          : 120
      };
    },

    componentWrapper() {
      return [
        "pb-5",
        this.vertical ? "row pt-5 d-flex justify-content-center" : ""
      ];
    },
    optionalColumnWrapper() {
      return this.vertical ? "col-md-2 pl-5 pl-md-0" : "";
    },
    rowClass() {
      if (this.vertical)
        return "d-flex flex-column justify-content-between h-100";
      else return "d-flex justify-content-between";
    },
    rowStyle() {
      const height = this.vertical
        ? `min-height: ${this.numOfSteps *
            this.stepperOptions.verticalSpacing}px`
        : "";
      return `position: relative; ${height}`;
    },

    optionalContentWrapper() {
      return this.vertical ? "col-md-7" : "";
    }
  },

  mixins: [mdbStepper, waves]
};

export default Stepper;
export { Stepper as mdbStepper };
</script>

<style scoped>
.horizontal-line {
  position: absolute;
  height: 2px;
  width: calc(100% - 20px);
  top: 40px;
  left: 10px;
}

.simple-line {
  height: 1px;
  width: calc(100% - 20px);
  background-color: rgba(0, 0, 0, 0.2);
}
.vertical-line {
  position: absolute;
  width: 2px;
  height: calc(100% - 20px);
  top: 10px;
  left: 40px;
}

.line-within {
  position: absolute;
  height: 1px;
  width: calc(100% - 20px);
  top: 28px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.2);
}

.stepper-vertical .step a:hover {
  background-color: rgba(0, 0, 0, 0.06) !important;
}
.horizontal-step:hover {
  background-color: initial;
}

.horizontal-step a:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.step a {
  transition: background-color 0.2s linear;
}

.stepper-vertical .step-content {
  height: 0;
  overflow: hidden;
  transition: all 0.5s ease-out;
}

.stepper-horizontal .step-content {
  max-width: 0px;
  overflow: hidden;
  transition: all 0.5s ease-out;
}

.stepper-horizontal li:not(:last-child):after {
  display: none;
}
</style>
