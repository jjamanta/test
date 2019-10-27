import React, { Component } from 'react';

import './PostComment.css';

import profile from '../../src/assets/profile.png';

function PostComment({ comment }) {
  console.log(comment);

  return (
    <>
      <img className='clsCommentAvatar' src={profile}></img>
      <div className='cssCommentContent'>
        <label>{<strong>comment.author.name</strong>}{comment.content}</label>
      </div>
    </>
  )
}

export default PostComment;