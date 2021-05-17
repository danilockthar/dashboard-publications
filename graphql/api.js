import fetch from "isomorphic-unfetch";
import { slugify } from "../lib/slugify";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const nowFunc = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = date.getDate();
  if (day <= 9) {
    day = "0" + day;
  }
  const fecha = `${year}-${month}-${day}`;
  return fecha;
};

export const createAnUser = async (email, name, authId) => {
  let vacio = " ";
  const query = `mutation createAnUsuario($email: String!, $name: String!, $authId: String!) {
        createUser(data: {email: $email, name:$name, role: AUTHOR, authId: $authId}){
            _id
            name
            email
            authId
          }
  }`;
  const res = await fetch("https://graphql.fauna.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { email, name, authId },
    }),
  });
  const data = await res.json();
  return { data: data };
};

export const createOnePost = async (
  title,
  excerpt,
  contenido,
  tags,
  authorRef
) => {
  const query = `mutation CreateAPost($title: String!, $excerpt: String!, $contenido: [BlocksInput], $slug: String!, $tags: [TagInput], $created_at: Date, $authorRef: ID!) {
    createPost(data: {
      title: $title
      excerpt: $excerpt
      content: $contenido
      author: {
        connect: $authorRef
      }
      slug: $slug
      created_at: $created_at
      tags: $tags
      show: true
    }) {
       title
       excerpt
       content{
         data{
          text
          url
          code
          level
          withBorder
          caption
          withBackground
          stretched
         }
         type
       }
       slug
       show
    }
 }`;
  const slug = slugify(title);
  const created_at = nowFunc();
  const res = await fetch("https://graphql.fauna.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        title,
        excerpt,
        contenido,
        slug,
        tags,
        created_at,
        authorRef,
      },
    }),
  });
  const data = await res.json();
  return { data: data };
};
