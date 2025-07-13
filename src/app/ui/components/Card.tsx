import styles from "./card.module.css";

interface CardProps {
  image: string;
  title: string;
  description: string;
  buttons: Array<{
    text: string;
    onClick?: () => void;
  }>;
  alt: string;
}

export default function Card({
  image,
  title,
  description,
  buttons,
  alt,
}: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={image || "/placeholder.svg"}
          alt={alt}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <div
          className={`${styles.buttonContainer} ${
            buttons.length > 1 ? styles.twoButtons : ""
          }`}
        >
          {buttons.map((button, index) => (
            <button
              key={index}
              className={styles.button}
              onClick={button.onClick}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
