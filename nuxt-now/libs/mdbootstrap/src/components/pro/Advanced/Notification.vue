<template>
  <transition :enter-active-class="enterActiveClass" :leave-active-class="leaveActiveClass" @before-enter="beforeEnter" @after-enter="afterEnter" @before-leave="beforeLeave">
    <div class="md-toast" :class="['md-toast-'+type]" :style="{backgroundColor:toastBackgroundColor}" v-if="show">
      <button class="md-toast-close-button" role="button" @click="hideToastr" v-if="closeButton">×</button>
      <div class="md-toast-progress" v-if="progressBar" :style="'width: ' + progress.percent + '%'"></div>
      <!-- <div class="toast-icon">
        <img :src="iconSrc"/>
      </div> -->
      <div class="md-toast-title">{{title}}</div>
      <div class="md-toast-message">{{message}}</div>
    </div>
  </transition>
</template>


<script>
const Notification = {
  name: 'Notification',
  data: () => {
    return {
      progress: {
        hideEta: 0,
        percent: 0,
        intervalId: null
      },
      show: false,
      defaultIcons: {
        // success: require('./assets/success.png'),
        // info: require('./assets/info.png'),
        // warning: require('./assets/warning.png'),
        // error: require('./assets/error.png')
      }
    };
  },
  props: {
    type: {
      type: String,
      default: 'success'
    },
    position: {
      type: String,
      default: 'top center'
    },
    title: {
      type: String
    },
    message: {
      type: String
    },
    closeButton: {
      type: Boolean,
      default: true
    },
    progressBar: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    timeOut: {
      default: '1500'
    },
    showMethod: {
      type: String,
      default: 'fadeIn'
    },
    hideMethod: {
      type: String,
      default: 'fadeOut'
    },
    showDuration: {
      default: '1000'
    },
    hideDuration: {
      default: '1000'
    },
    delay: {
      default: '0'
    },
    successColor: {
      type: String
    },
    infoColor: {
      type: String
    },
    warningColor: {
      type: String
    },
    errorColor: {
      type: String
    },
    color: {
      type: String
    }
  },
  mounted() {
    let toastContainer = document.querySelector(`.toastr-container.md-toast-${this.positionClass}`);
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.classList.add('toastr-container');
      toastContainer.id = 'toast-container';
      toastContainer.classList.add(`md-toast-${this.positionClass}`);
      document.body.appendChild(toastContainer);
    }
    toastContainer.appendChild(this.$el);
    setTimeout(() => this.showToastr(), this.delay);
  },
  computed: {
    positionClass() {
      return this.position.split(' ').join('-');
    },
    enterActiveClass() {
      return 'animated ' + this.showMethod;
    },
    leaveActiveClass() {
      return 'animated ' + this.hideMethod;
    },
    toastBackgroundColor() {
      if (this.color) {
        return this.color;
      }
      if (this.type === 'success' && this.successColor) {
        return this.successColor;
      } else if (this.type === 'info' && this.infoColor) {
        return this.infoColor;
      } else if (this.type === 'warning' && this.warningColor) {
        return this.warningColor;
      } else if (this.type === 'error' && this.errorColor) {
        return this.errorColor;
      }
      return null;

    },
    iconSrc() {
      if (this.icon) return this.icon;
      return this.defaultIcons[this.type];
    }
  },
  methods: {
    showToastr() {
      this.show = true;
      this.sto = setTimeout(() => this.hideToastr(), this.timeOut);
      if (this.progressBar) {
        this.progress.hideEta = new Date().getTime() + parseFloat(this.timeOut);
        this.progress.intervalId = setInterval(() => this.refreshProgress(), 10);
      }
    },
    hideToastr() {
      clearTimeout(this.sto);
      clearTimeout(this.progress.intervalId);
      this.show = false;
    },
    refreshProgress() {
      this.progress.percent = ((this.progress.hideEta - (new Date().getTime())) / this.timeOut) * 100;
    },
    beforeEnter(el) {
      el.style.animationDuration = this.showDuration + 'ms';
    },
    afterEnter() {
      this.$el.classList.add('animated');
      this.$el.classList.add(this.showMethod);
    },
    beforeLeave(el) {
      el.style.animationDuration = this.hideDuration + 'ms';
    }
  }
};

export default Notification;
export { Notification as mdbNotification };
</script>
