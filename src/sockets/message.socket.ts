import { Server, Socket } from "socket.io";
import { MessageService } from "src/services/message.service.js";

export const messageSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId; // set during auth

    socket.on("join_conversation", (conversationId: string) => {
      socket.join(conversationId);
    });

    socket.on(
      "send_message",
      async ({ toUserId, content }) => {
        const conversationId =
          await MessageService.getOrCreateDirectConversation(
            userId,
            toUserId
          );

        const message = await MessageService.saveMessage(
          conversationId,
          userId,
          content
        );

        io.to(conversationId).emit("new_message", message);
      }
    );
  });
};
