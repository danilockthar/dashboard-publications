import { useState } from "react";
import Head from "next/head";
import Header from "../Header";

const Layout = ({ children, title }) => {
  return (
    <div>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
        />
        <meta charSet="utf-8" />
        <meta name="description" content="EDITORS" />
        <meta property="og:site_name" content="Editors" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,400;1,500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <title>{title}</title>
      </Head>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
