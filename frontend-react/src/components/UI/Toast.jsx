import styles from "./Toast.module.css";

export default function Toast({ msg, error }) {
  if (!msg) return null;
  return (
    <div className={`${styles.toast} ${error ? styles.error : ""}`}>
      {msg}
    </div>
  );
}