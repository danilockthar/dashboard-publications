import { gql } from "graphql-request";
import { getSession } from "next-auth/client";
import { useState } from "react";
import SideLayout from "../../components/SideLayout";
import { graphQLClient } from "../../lib/graphql-client";
import dynamic from "next/dynamic";
import styles from "../../styles/slug.module.scss";

const EditorComponent = dynamic(() => import("../../components/Editor"), {
  ssr: false,
});

const UniquePost = ({ data, err }) => {
  console.log(data, "slug data");

  if (err) {
    return (
      <SideLayout>
        <div className={styles.slugWrapper}>
          <h1> 404. Ups</h1>
        </div>
      </SideLayout>
    );
  }
  return (
    <SideLayout>
      <div className={styles.slugWrapper}>
        {/* <button onClick={submit}> Publicar </button>
        <input
          name="title"
          value={inputs.title}
          onChange={(e) => handleInputs(e)}
        />
        <textarea
          name="excerpt"
          value={inputs.excerpt}
          onChange={(e) => handleInputs(e)}
        /> */}
        <EditorComponent
          content={data.content}
          title={data.title}
          excerpt={data.excerpt}
        />
      </div>
    </SideLayout>
  );
};

export default UniquePost;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  let err = false;
  if (!session || !session.token) {
    context.res.setHeader("Location", `http://localhost:3000/`); // Replace <link> with your url link
    context.res.statusCode = 302;
    return {
      props: {
        data: [],
      },
    };
  }
  const query = gql`
    query getPostBySlug($slug: String!) {
      postBySlug(slug: $slug) {
        _id
        title
        excerpt
        created_at
        author {
          _id
          email
          name
          authId
        }
        tags {
          tag
        }
        content {
          data {
            caption
            withBorder
            withBackground
            code
            stretched
            text
            style
            items
            file {
              url
            }
            level
          }
          type
        }
      }
    }
  `;

  const variables = {
    slug: context.query.slug,
  };

  const response = await graphQLClient.request(query, variables);

  if (response.postBySlug === null) {
    err = true;
  }

  return {
    props: {
      err,
      data: response.postBySlug || {},
    },
  };
}
