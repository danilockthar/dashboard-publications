import { useState } from "react";

import styles from "./index.module.scss";

const Header = () => {
  return (
    <div className={styles.header}>
      <h1> A S C</h1>
      <div className={styles.menu}>
        <a>HOME</a>
        <a>EDITORS</a>
      </div>
    </div>
  );
};

export default Header;
