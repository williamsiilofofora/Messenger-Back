import { UserPreferences } from "typescript";
import { Message } from "../models/messages";
import { IProfile } from "../models/profiles";

async function getAllMessages(user: IProfile, conversationId?: string) {
  try {
    const userId = user._id;
    const query: { $or: any; $and?: any } = {
      $or: [{ emitter: userId }, { targets: userId }],
      $and: [{ conversationId: conversationId }],
    };
    if (!conversationId) delete query.$and;
    return await Message.find(query, null, {
      sort: { createdAt: 1 },
    });
    // return messages;
  } catch (error) {
    throw new Error("Error while searching for messages in DB");
  }
}

const createMessage = async (
  user: IProfile,
  conversationId: string,
  targets: string[],
  content: string
) => {
    try {
        const newMessage = new Message({
            conversationId: conversationId,
            emitter: user._id,
            targets: targets,
            content: content,
        });
        newMessage.save();
        
            console.log('nouveau message', newMessage);
            return newMessage;

        } catch (error) {
            throw new Error(error)
    }
}

export { getAllMessages, createMessage };
