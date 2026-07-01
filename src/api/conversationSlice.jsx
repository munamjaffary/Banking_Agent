// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   conversations: [{ id: 1, title: "New Chat", messages: [] }],
//   activeConvId: 1,
// };

// const conversationSlice = createSlice({
//   name: "conversation",
//   initialState,
//   reducers: {
//     createNewChat: (state) => {
//       const newId =
//         state.conversations.length > 0
//           ? Math.max(...state.conversations.map((c) => c.id)) + 1
//           : 1;

//       state.conversations.unshift({
//         id: newId,
//         title: "New Chat",
//         messages: [],
//       });

//       state.activeConvId = newId;
//     },

//     selectChat: (state, action) => {
//       state.activeConvId = action.payload;
//     },

//     addMessage: (state, action) => {
//       const { convId, message } = action.payload;
//       const conv = state.conversations.find((c) => c.id === convId);

//       if (conv) {
//         conv.messages.push({
//           role: message.role,
//           content: message.content || "",
//           references: message.references || [],
//         });
//       }
//     },

//     updateLastMessage: (state, action) => {
//       const { convId, content, references } = action.payload;
//       const conv = state.conversations.find((c) => c.id === convId);

//       if (conv && conv.messages.length > 0) {
//         const lastMsg = conv.messages[conv.messages.length - 1];
//         if (content !== undefined) lastMsg.content = content;
//         if (references) lastMsg.references = references;
//       }
//     },
//   },
// });

// export const { createNewChat, selectChat, addMessage, updateLastMessage } =
//   conversationSlice.actions;

// export default conversationSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { nluSessionsToChats, rawEntries } from "../data/nluData";

const nluChats = nluSessionsToChats(rawEntries).map((c, i) => ({
  ...c,
  id: i + 2,
}));

const initialState = {
  conversations: [{ id: 1, title: "New Chat", messages: [] }, ...nluChats],
  activeConvId: 1,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    resetConversations: (state) => {
      state.conversations = [{ id: Date.now(), title: "New Chat", messages: [] }];
      state.activeConvId = state.conversations[0].id;
    },
    createNewChat: (state) => {
      const newId = Date.now();
      state.conversations.unshift({
        id: newId,
        title: "New Chat",
        messages: [],
      });
      state.activeConvId = newId;
    },

    selectChat: (state, action) => {
      state.activeConvId = action.payload;
    },

    renameChat: (state, action) => {
      const { id, title } = action.payload;
      const conv = state.conversations.find((c) => c.id === id);
      if (conv) conv.title = title;
    },

    deleteChat: (state, action) => {
      const idToDelete = action.payload;
      state.conversations = state.conversations.filter(
        (c) => c.id !== idToDelete,
      );
      if (state.activeConvId === idToDelete) {
        state.activeConvId =
          state.conversations.length > 0 ? state.conversations[0].id : null;
      }
    },

    clearMessages: (state) => {
      const conv = state.conversations.find((c) => c.id === state.activeConvId);
      if (conv) conv.messages = [];
    },

    truncateMessages: (state, action) => {
      const { convId, fromIndex } = action.payload;
      const conv = state.conversations.find((c) => c.id === convId);
      if (conv) {
        conv.messages = conv.messages.slice(0, fromIndex);
      }
    },

    addMessage: (state, action) => {
      const { convId, message } = action.payload;
      const conv = state.conversations.find((c) => c.id === convId);

      if (conv) {
        conv.messages.push({
          role: message.role,
          content: message.content || "",
          references: message.references || [],
        });

        if (conv.messages.length === 1 && message.role === "user") {
          conv.title = message.content.substring(0, 30) + "...";
        }
      }
    },

    updateLastMessage: (state, action) => {
      const { convId, content, references } = action.payload;
      const conv = state.conversations.find((c) => c.id === convId);

      if (conv?.messages.length > 0) {
        const lastMsg = conv.messages[conv.messages.length - 1];
        if (content !== undefined) lastMsg.content = content;
        if (references) lastMsg.references = references;
      }
    },

  },
});

export const {
  resetConversations,
  createNewChat,
  selectChat,
  renameChat,
  deleteChat,
  clearMessages,
  truncateMessages,
  addMessage,
  updateLastMessage,
} = conversationSlice.actions;

export default conversationSlice.reducer;
