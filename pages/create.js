import { getSession, signIn, signOut, useSession } from "next-auth/client";
import SideLayout from "../components/SideLayout";
import styles from "../styles/create.module.scss";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { ContextState } from "../context/global";
import { useRouter } from "next/router";

const EditorComponent = dynamic(() => import("../components/Editor"), {
  ssr: false,
});

export default function Create({ session, data, error, fuser }) {
  const { faunaUser, setFaunaUser } = useContext(ContextState);
  const [willRefresh, setwillRefresh] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log(willRefresh, "ref?");
  }, [willRefresh]);

  useEffect(() => {
    setFaunaUser(fuser);
  }, [fuser]);

  return (
    <SideLayout>
      <div className={styles.wrapper}>
        <h1>Mis artículos:</h1>

        <div className={styles.postWrapper}>
          {data.length > 0 &&
            data.map((item) => {
              console.log(item, "item");
              return (
                <Link href={`/post/${encodeURIComponent(item.slug)}`}>
                  <a>{item.title}</a>
                </Link>
              );

              return <h1> {item.title} </h1>;
            })}
        </div>
        <EditorComponent setwillRefresh={setwillRefresh} />
        {session && (
          <>
            <span className={"span"}>
              <small>Signed in as</small>
              <br />
              <strong>{session.user.email || session.user.name}</strong>
            </span>
            <a
              href={`/api/auth/signout`}
              className={"as"}
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
              Sign out
            </a>
          </>
        )}
      </div>
    </SideLayout>
  );
}

// Export the `session` prop to use sessions with Server Side Rendering
export async function getServerSideProps(context) {
  const session = await getSession(context);
  let data = [];
  let error = { exist: false };
  if (!session || !session.token) {
    context.res.setHeader("Location", `http://localhost:3000/`); // Replace <link> with your url link
    context.res.statusCode = 302;
    return {
      props: {
        data: [],
      },
    };
  }

  if (session && session.token) {
    const res = await fetch(`http://localhost:3000/api/items`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + session.token,
      },
    });
    switch (res.status) {
      case 409:
        console.log("409");
        context.res.setHeader("Location", `http://localhost:3000/`); // Replace <link> with your url link
        context.res.statusCode = 302;
        return {
          props: {
            data: [],
          },
        };
        break;
    }
    data = await res.json();
  }
  return {
    props: {
      session,
      fuser: data.userdata,
      data: data.items || [],
      error,
    },
  };
}
