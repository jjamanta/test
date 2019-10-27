import React, { Component } from 'react';

import Post from './Post';

import './PostList.css';

class PostList extends Component {
  state = {
    posts: [
      {
        id: 1,
        author: {
          name: "Julio Alcantara",
          avatar: "../../src/assets/profile.png"
        },
        date: "4 Jun 2019",
        content: "Pessoal, alguem sabe se a Rocketseat esta contratanfo?",
        comments: [
          {
            id: 1,
            author: {
              name: "Diego fernandes",
              avatar: "../../src/assets/profile.png"
            },
            content: "Conteudo do Comentario"
          }
        ]
      },
      {
        id: 2,
        author: {
          name: "Mario Brota",
          avatar: "../../src/assets/profile.png"
        },
        date: "6 Jun 2019",
        content: "Ola pessoal alguem ja conhece React?",
        comments: [
          {
            id: 2,
            author: {
              name: "Paulo Pereira",
              avatar: "../../src/assets/profile.png"
            },
            content: "Estou trabalhando a 6 meses."
          },
          {
            id: 3,
            author: {
              name: "Paulo Pereira",
              avatar: "../../src/assets/profile.png"
            },
            content: "Estou trabalhando a 6 meses."
          }
        ]
      },
      {
        id: 3,
        author: {
          name: "Mario Brota",
          avatar: "../../src/assets/profile.png"
        },
        date: "6 Jun 2019",
        content: "Ola pessoal o ques estao achando do curso?",
        comments: [
          {
            id: 4,
            author: {
              name: "Paulo Pereira",
              avatar: "../../src/assets/profile.png"
            },
            content: "Estou gostando muito."
          },
          {
            id: 5,
            author: {
              name: "Sergio Teixeira",
              avatar: "../../src/assets/profile.png"
            },
            content: "Material Fantastico."
          },
          {
            id: 6,
            author: {
              name: "Paula Alcantara",
              avatar: "../../src/assets/profile.png"
            },
            content: "Estou achando um pouco demais para meu conhecimento.."
          }
        ]
      },
    ]
  }

  render() {
    return (
      <div>
        {this.state.posts.map(item => <Post key={item.id} post={item} />)}
      </div>
    )
  }
}

export default PostList;