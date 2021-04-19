import { useState } from "react";
import { IoLogoVk } from "react-icons/io";
import { MdDashboard, MdLibraryBooks } from "react-icons/md";

import styles from "./index.module.scss";

const SideHeader = () => {
  return (
    <div className={styles.sideHeader}>
      <IoLogoVk color={"white"} size="5vw" />
      <div className={styles.menu}>
        <a>
          {" "}
          <MdDashboard /> DASHBOARD
        </a>
        <a>
          <MdLibraryBooks />
          PUBLICACIONES
        </a>
      </div>
    </div>
  );
};

export default SideHeader;
