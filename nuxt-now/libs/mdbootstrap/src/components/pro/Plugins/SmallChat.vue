<template>
  <div>
    <mdb-card-header class="white d-flex justify-content-between p-0 pb-2">
      <a @click="open = true" class="heading d-flex justify-content-start">
        <mdb-avatar class="mr-2" tag="img" circle :width="32" :src="receiver.img"/>
        <div class="data" :class="open ? '' : 'd-flex'">
          <p class="name mb-0 pr-2">
            <strong>{{receiver.name}}</strong>
          </p>
          <p v-if="receiver.online" class="activity text-muted mb-0">
            <mdb-icon color="success" icon="circle"/>
            <span v-if="open">Active now</span>
          </p>
          <p v-else class="activity text-muted mb-0">Offline</p>
        </div>
      </a>
      <div v-if="open" class="grey-text icons">
        <mdb-btn
          @click="$emit('video', $event)"
          size="lg"
          icon="video"
          class="p-0 ml-0"
          flat
          color="ghost"
        ></mdb-btn>
        <mdb-btn
          @click="$emit('call', $event)"
          size="lg"
          icon="phone"
          class="p-0 ml-0"
          flat
          color="ghost"
        ></mdb-btn>
        <mdb-btn
          @click="$emit('settings', $event)"
          size="lg"
          icon="cog"
          class="p-0 ml-0"
          flat
          color="ghost"
        ></mdb-btn>
        <mdb-btn @click="open = !open" size="lg" icon="times" class="p-0 ml-0" flat color="ghost"></mdb-btn>
      </div>
      <mdb-btn
        v-else
        @click="open = !open"
        size="lg"
        icon="chevron-up"
        class="p-0 ml-0"
        flat
        color="ghost"
      ></mdb-btn>
    </mdb-card-header>
    <mdb-scrollbar v-if="open" height="260px">
      <div class="chat-message pt-3">
        <ul :class="className">
          <slot name="media"></slot>
          <li v-for="(message, i) in messages" :key="message.id">
            <div v-if="message.userId === loggedUserId" class="d-flex justify-content-end mb-2">
              <mdb-chat-message
                small
                :name="message.name"
                :message="message.content"
                :time="message.time"
                color="bg-primary"
                whiteText
              />
            </div>
            <div v-else class="d-flex justify-content-start align-items-end mb-2">
              <mdb-avatar
                v-if="!messages[i+1] || messages[i+1].userId === loggedUserId"
                class="ml-2"
                tag="img"
                :width="32"
                circle
                :src="message.avatar"
              />
              <div v-else style="width: 40px"></div>
              <mdb-chat-message
                small
                :name="message.name"
                :message="message.content"
                :time="message.time"
                color="bg-light"
                blackText
              />
            </div>
          </li>
        </ul>
      </div>
    </mdb-scrollbar>
    <mdb-card-footer v-if="open" class="text-muted white pt-1 pb-0 px-2">
      <input
        type="text"
        class="form-control pl-0"
        placeholder="Type a message..."
        v-model="newMessage"
        @keypress.enter="sendMessage"
      >
      <div class="d-flex justify-content-between">
        <div>
          <mdb-btn
            @click="$emit('fileImage', $event)"
            size="lg"
            icon="file-image"
            class="p-0 ml-0"
            flat
            color="ghost"
          ></mdb-btn>
          <mdb-btn
            @click="$emit('reaction', $event)"
            size="lg"
            icon="laugh"
            class="p-0 ml-0"
            flat
            color="ghost"
          ></mdb-btn>
          <mdb-btn
            @click="$emit('game', $event)"
            size="lg"
            icon="gamepad"
            class="p-0 ml-0"
            flat
            color="ghost"
          ></mdb-btn>
          <mdb-btn
            @click="$emit('attach', $event)"
            size="lg"
            icon="paperclip"
            class="p-0 ml-0"
            flat
            color="ghost"
          ></mdb-btn>
          <mdb-btn
            @click="$emit('camera', $event)"
            size="lg"
            icon="camera"
            class="p-0 ml-0"
            flat
            color="ghost"
          ></mdb-btn>
        </div>
        <mdb-btn
          @click="$emit('like', $event)"
          size="lg"
          icon="thumbs-up"
          class="p-0 ml-0"
          flat
          color="ghost"
        ></mdb-btn>
      </div>
    </mdb-card-footer>
  </div>
</template>

<script>
import mdbIcon from "../../Content/Fa";
import mdbBtn from "../../Components/Button";
import mdbAvatar from "../Content/Avatar";
import mdbChatMessage from "./ChatMessage";
import mdbCard from "../../Components/Card";
import mdbCardFooter from "../../Components/CardFooter";
import mdbCardHeader from "../../Components/CardHeader";
import mdbMedia from "../../Layout/Media";
import mdbMediaBody from "../../Layout/MediaBody";
import mdbMediaImage from "../../Layout/MediaImage";
import mdbScrollbar from "../../Advanced/Scrollbar";

const SmallChat = {
  name: "SmallChat",
  components: {
    mdbIcon,
    mdbAvatar,
    mdbChatMessage,
    mdbBtn,
    mdbCard,
    mdbCardFooter,
    mdbCardHeader,
    mdbMedia,
    mdbMediaImage,
    mdbMediaBody,
    mdbScrollbar
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
      default: "default"
    }
  },
  data() {
    return {
      newMessage: "",
      open: true
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
      return ["list-unstyled", "pr-4"];
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

export default SmallChat;
export { SmallChat as mdbSmallChat };
</script>

<style scoped>

</style>
