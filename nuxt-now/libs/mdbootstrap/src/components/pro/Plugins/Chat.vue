<template>
  <div>
    <div class="chat-message">
      <ul :class="className" :style="scrollStyle">
        <li v-for="message in messages" :key="message.id">
          <div
            v-if="message.userId === loggedUserId"
            class="d-flex justify-content-between mb-4"
          >
            <mdb-avatar
              class="mr-2"
              tag="img"
              circle
              :width="avatarWidth"
              :src="message.avatar"
            />
            <mdb-chat-message
              :name="message.name"
              :message="message.content"
              :time="message.date"
            />
          </div>
          <div v-else class="d-flex justify-content-between mb-4" >
            <mdb-chat-message
              :name="message.name"
              :message="message.content"
              :time="message.date"
            />
            <mdb-avatar
              class="ml-2"
              tag="img"
              :width="avatarWidth"
              circle
              :src="message.avatar"
            />
          </div>
        </li>
      </ul>
      <div>
        <div class="white">
          <div class="form-group basic-textarea">
            <textarea
              class="form-control pl-2 my-0"
              id="exampleFormControlTextarea2"
              rows="3"
              placeholder="Type your message here..."
              v-model="newMessage"
            ></textarea>
          </div>
        </div>
        <mdb-btn :color="outline ? null : color" :outline="color ? null : outline" rounded size="sm" @click="sendMessage">Send</mdb-btn>
      </div>
    </div>
  </div>
</template>

<script>
import mdbBtn from "../../Components/Button";
import mdbAvatar from "../Content/Avatar";
import mdbChatMessage from "./ChatMessage";
import mdbCard from "../../Components/Card";

const Chat = {
  name: "Chat",
  components: {
    mdbAvatar,
    mdbChatMessage,
    mdbBtn,
    mdbCard,
  },
  props: {
    chat: {
      type: Array
    },
    loggedUserId: Number,
    avatarWidth: {
      type: Number,
      default: 100
    },
    color: {
      type: String,
    },
    outline: {
      type: String,
    },
    scrollbarClass: {
      type: String
    },
    scroll: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 500
    },
  },
  data() {
    return {
      newMessage: ""
    };
  },
  computed: {
    messages() {
      const messages = [];
      this.chat.forEach(user => {
        user.messages.forEach(message => {
          messages.push({
            userId: user.id,
            name: user.name,
            avatar: user.img,
            ...message
          });
        });
      });
      return messages.sort((a, b) => {
        if (a.id > b.id) {
          return 1;
        } else if (a.id < b.id) {
          return -1;
        }
        return 0;
      });
    },
    receiver() {
      return this.chat.find(user => user.id !== this.loggedUserId);
    },
    className() {
      return [
        "list-unstyled",
        this.scroll ? `chat-1 ${this.scrollbarClass} pr-3` : "chat"
      ];
    },
    scrollStyle() {
      return this.scroll ? `height: ${this.height}px` : '';
    }
  },
  methods: {
    sendMessage() {
      const messageDate = new Date().toString();
      this.$emit("send", {
        date: messageDate,
        content: this.newMessage,
        unread: true
      });
      this.newMessage = "";
    }
  }
};

export default Chat;
export { Chat as mdbChat };
</script>

<style scoped>

</style>
