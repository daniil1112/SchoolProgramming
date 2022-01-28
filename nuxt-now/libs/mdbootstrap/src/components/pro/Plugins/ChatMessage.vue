<template>
  <div :class="classNames">
    <div v-if="!small" class="header">
      <strong class="primary-font">{{name}}</strong>
      <small class="pull-right text-muted">
        <mdb-icon icon="clock"/>
        {{displayTime}}
      </small>
    </div>
    <hr v-if="!small" class="w-100">
    <p class="mb-0" v-html="message"></p>
  </div>
</template>

<script>
import { mdbIcon } from "../../Content/Fa";

const ChatMessage = {
  name: "ChatMessage",
  components: {
    mdbIcon
  },
  props: {
    name: {
      type: String,
    },
    time: {
      type: String
    },
    message: {
      type: String,
      default: ""
    },
    small: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: "white"
    },
    whiteText: {
      type: Boolean,
      default: false
    },
    blackText: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      startTime: null,
      currentTime: null
    };
  },
  computed: {
    displayTime() {
      let time = (this.currentTime - this.startTime) / 1000;
      return this.formatTime(time);
    },
    classNames() {
      return [
        "chat-body",
        this.small ? "p-2" : "p-3",
        "ml-2",
        this.color,
        this.small ? "rounded card-text small-chat-body" : "z-depth-1",
        this.whiteText && 'white-text',
        this.blackText && 'black-text'
      ];
    }
  },
  methods: {
    formatTime(time) {
      let minutes, hours, days
      switch (true) {
        case time < 60:
          return `now`;
        case time < 3600:
          minutes = Math.floor(time / 60);
          return `${minutes} min`;
        case time >= 3600 && time < 86400:
          hours = Math.floor(time / 3600);
          return `${hours} h`;
        case time >= 86400:
          days = Math.floor(time / 86400);
          return `${days} d`;
      }
    },
    updateTime() {
      this.currentTime = new Date().getTime();
    }
  },
  mounted() {
    let timeReceived = this.time ? new Date(this.time) : new Date();
    this.startTime = timeReceived.getTime();
    this.currentTime = new Date().getTime();
    window.setInterval(this.updateTime, 60000);
  },
  beforeDestroy() {
    window.clearInterval(this.updateTime);
  }
};

export default ChatMessage;
export { ChatMessage as mdbChatMessage };
</script>
<style scoped>
.chat-body {
  min-width: 25% !important;
}
.small-chat-body {
  max-width: 70% !important;
  height: 100%;
}

</style>