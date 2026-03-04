import { useEffect, useRef } from "react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import WelcomeScreen from "./WelcomeScreen";
import styles from "./ChatBox.module.css";

export default function ChatBox({ messages, isLoading, onSuggestion, settings }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className={styles.box}>
      {messages.length === 0 && !isLoading
        ? <WelcomeScreen onSuggestion={onSuggestion} />
        : <>
            {messages.map(m => (
              <Message key={m.id} msg={m} onSuggestion={onSuggestion} />
            ))}
            {isLoading && <TypingIndicator />}
          </>
      }
      <div ref={bottomRef} />
    </div>
  );
}