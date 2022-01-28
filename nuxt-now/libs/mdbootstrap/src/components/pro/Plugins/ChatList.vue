<template>
  <div
    class="white z-depth-1 px-3 pt-3 pb-0"
    :style="scroll && scrollStyle"
    :class="scroll && `members-panel-1 ${scrollbarClass}`"
  >
    <ul class="list-unstyled friend-list">
      <li
        @click="$emit('click', i)"
        v-for="(chat, i) in list"
        :ref="i"
        :key="i"
        class="p-2"
        :class="chat.active && 'grey lighten-3'"
      >
        <a class="d-flex justify-content-between" :class="chat.active && 'active'">
          <div class="d-flex justify-content-between">
            <mdb-avatar class="mr-2" tag="img" circle :width="50" :src="chat.avatar"/>
            <div class="text-small">
              <strong>{{chat.receiver}}</strong>
              <mdb-icon v-if="chat.receiverOnline" size="xs" color="success" icon="circle"/>
              <p class="last-message text-muted">{{displayMessage(chat.lastMessage.content)}} <mdb-icon v-if="chat.lastMessage.userId === chat.loggedUserId" far size="xs" icon="paper-plane"/></p>
            </div>
          </div>
          <div class="chat-footer">
            <p class="text-smaller text-muted mb-0">{{formatTime((currentTime - new Date(chat.lastMessage.date).getTime()) / 1000)}}</p>
            <mdb-badge v-if="chat.unread > 0" class="float-right" color="danger">{{chat.unread}}</mdb-badge>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
import { mdbIcon } from "../../Content/Fa";
import { mdbAvatar } from "../Content/Avatar";
import { mdbBadge } from "../../Components/Badge";

const ChatList = {
  components: {
    mdbIcon,
    mdbAvatar,
    mdbBadge
  },
  data() {
    return {
      currentTime: null
    };
  },
  props: {
    data: Array,
    scroll: {
      type: Boolean,
      default: false
    },
    scrollbarClass: {
      type: String
    },
    height: {
      type: Number
    }
  },
  methods: {
    findLastMessage(conversation) {
      let lastMessage;
      let receiver;
      let receiverOnline;
      let avatar;
      let unread = 0;
      const active = conversation.active || false;

      conversation.chat.forEach(user => {
        if (user.id !== conversation.loggedUserId) {
          receiver = user.name;
          avatar = user.img;
          receiverOnline = user.online;
        }
        user.messages.forEach(message => {
          if (message.unread) {
            unread += 1;
          }
          if (message.id === conversation.lastId) {
            lastMessage = { ...message, userId: user.id };
          }

        });
      });

      return {
        receiver,
        receiverOnline,
        avatar,
        loggedUserId: conversation.loggedUserId,
        lastMessage,
        unread,
        active,
      };
    },
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
    },
    displayMessage(message) {
      return message.length > 20 ? message.slice(0, 20).concat(" ..."): message;
    },
  },
  computed: {
    list() {
      return this.data.map(conversation => this.findLastMessage(conversation));
    },
    scrollStyle() {
      return `height: ${this.height}px`;
    }
  },
  mounted() {
    this.currentTime = new Date().getTime();
    window.setInterval(this.updateTime, 60000);
  },
  beforeDestroy() {
    window.clearInterval(this.updateTime);
  }
};

export default ChatList;
export { ChatList as mdbChatList };
</script>
<style>
.card.chat-room .members-panel-1,
.card.chat-room .chat-1 {
  position: relative;
  overflow-y: scroll;
}
.card.chat-room .friend-list li {
  border-bottom: 1px solid #e0e0e0; }
  .card.chat-room .friend-list li:last-of-type {
    border-bottom: none; }

</style>
