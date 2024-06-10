import {
  FileImage,
  Mic,
  Paperclip,
  PlusCircle,
  SendHorizontal,
  Smile,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Message, loggedInUserData, UserData, userData } from "@/app/data";
import { Textarea } from "../ui/textarea";
import { EmojiPicker } from "../emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface ChatBottombarProps {
  sendMessage: (newMessage: Message) => void;
  isMobile: boolean;
}

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({
  sendMessage,
  isMobile,
}: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  const [isWaiting, setIsWaiting] = React.useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  // const handleThumbsUp = () => {
  //   const newMessage: Message = {
  //     id: message.length + 1,
  //     name: loggedInUserData.name,
  //     avatar: loggedInUserData.avatar,
  //     message: "👍",
  //   };
  //   sendMessage(newMessage);
  //   setMessage("");
  // };
  const handleAPI = (message: string) => {
    const jsonMsg = {
      text: message,
    };
    setIsWaiting(true);

    fetch("https://9af9-103-94-190-27.ngrok-free.app/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonMsg),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // This parses the JSON response body
      })
      .then((data) => {
        console.log("Received:", data);
        // Assuming the API returns the message object that was sent
        // Add the received message to the chat interface
        const newMessage: Message = {
          id: message.length + 2,
          name: "Chat bot",
          avatar: "/User1.ico",
          message: data.text,
        };
        sendMessage(newMessage);
        console.log(userData);

        // Optionally handle any other logic with the response
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
        // Optionally handle errors, e.g., displaying a notification to the user
      })
      .finally(() => {
        setIsWaiting(false);
      });
  };
  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: message.length + 1,
        name: loggedInUserData.name,
        avatar: loggedInUserData.avatar,
        message: message.trim(),
      };
      const newAIMessage: Message = {
        id: message.length + 2,
        name: "Chat bot",
        avatar: "/User1.ico",
        message: "this is AI".trim(),
      };
      sendMessage(newMessage);
      console.log(userData);
      handleAPI(message.trim());
      setMessage("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div className="p-5 flex justify-between w-full  items-center gap-2">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <Textarea
            autoComplete="off"
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder="Aa"
            className=" w-full border rounded-full flex items-center h-11 resize-none overflow-hidden bg-background"
            disabled={isWaiting}
          ></Textarea>
        </motion.div>

        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-11 w-11",
            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
          )}
          onClick={handleSend}
        >
          <SendHorizontal size={30} className="text-muted-foreground" />
        </Link>
      </AnimatePresence>
    </div>
  );
}
