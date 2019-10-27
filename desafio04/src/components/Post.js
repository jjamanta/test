import React, { Component } from 'react';

import PostComment from './PostComment';

import profile from '../../src/assets/profile.png';

import './Post.css';

function Post({ post }) {
  console.log(post);
  return (
    <div className='cssPost'>
      <div className='cssDivPost'>
        <div className='cssDivAvatar'>
          <img className='cssAvatar' src={profile}></img>
        </div>
        <div className='cssDivName'>
          <label className='cssName'>{post.author.name}</label><br />
          <label className='cssDate'>{post.date}</label>
        </div>
      </div>
      <br />
      <label className='cssContent'>{post.content}</label> <br />
      <hr className='cssHorizontalBar'></hr> <br />
      {post.comments.map(item => <PostComment key={item.id} comment={item} />)}
      <br />
    </div >
  )
}

export default Post;