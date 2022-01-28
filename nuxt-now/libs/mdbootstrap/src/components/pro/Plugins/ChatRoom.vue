<template>
  <mdb-card :class="classNames">
    <mdb-card-body :class="small && 'p-2'">
      <slot></slot>
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import mdbCard from "../../Components/Card";
import mdbCardBody from "../../Components/CardBody";
import mdbCardHeader from "../../Components/CardHeader";

const ChatRoom = {
  name: "ChatRoom",
  components: {
    mdbCard,
    mdbCardBody,
    mdbCardHeader
  },
  props: {
    color: String,
    small: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classNames() {
      return [
        'chat-room',
        this.color,
        this.small && 'small-chat wide'
      ];
    }
  }
};

export default ChatRoom;
export { ChatRoom as mdbChatRoom };
</script>

<style>
.chat-room.small-chat {
  position: fixed;
  bottom: 0;
  right: 10px;
  -webkit-border-bottom-left-radius: 0;
  border-bottom-left-radius: 0;
  -webkit-border-bottom-right-radius: 0;
  border-bottom-right-radius: 0;
  width: 20rem; }
  .chat-room.small-chat.slim {
    height: 3rem; }
    
  .chat-room.small-chat .heading {
    height: 2.1rem; }
    .chat-room.small-chat .heading .data {
      line-height: 1.5; }
      .chat-room.small-chat .heading .data .name {
        font-size: .8rem; }
      .chat-room.small-chat .heading .data .activity {
        font-size: .75rem; } 
  .chat-room.small-chat .my-custom-scrollbar {
    position: relative;
    height: 18rem;
    overflow: auto; }
    .chat-room.small-chat .my-custom-scrollbar > .card-body {
      height: 18rem; }
      .chat-room.small-chat .my-custom-scrollbar > .card-body .chat-message .media img {
        width: 3rem; }
      .chat-room.small-chat .my-custom-scrollbar > .card-body .chat-message .media .media-body p {
        font-size: .7rem; }
      .chat-room.small-chat .my-custom-scrollbar > .card-body .chat-message .message-text {
        margin-left: 2.47rem; }
  .chat-room.small-chat .card-footer .form-control {
    border: none;
    padding: .375rem 0 .43rem 0;
    font-size: .9rem; }
    .chat-room.small-chat .card-footer .form-control:focus {
      -webkit-box-shadow: none;
      box-shadow: none; }
</style>
