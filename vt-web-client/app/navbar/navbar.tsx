import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/">
        <Image width={200} height={40}
          src="/youtube-logo.svg" alt="YouTube Logo"/>
      </Link>
    </nav>
  );
}