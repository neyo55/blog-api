import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_BASE_URL}/api/posts/${editId}`, { title, content });
        setEditId(null);
      } else {
        await axios.post(`${API_BASE_URL}/api/posts`, { title, content });
      }
      setTitle('');
      setContent('');
      fetchPosts();
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditId(post._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div className="App">
      <h1>Blog App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <button type="submit">{editId ? 'Update Post' : 'Create Post'}</button>
      </form>
      <div className="posts">
        {posts.map((post) => (
          <div key={post._id} className="post">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => handleDelete(post._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
