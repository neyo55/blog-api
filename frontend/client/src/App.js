// This is for the container and the .env contains the correct URL
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Automatically use .env value or fallback
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
console.log('API_BASE_URL =', API_BASE_URL);

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
      const res = await axios.get(`${API_BASE_URL}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_BASE_URL}/posts/${editId}`, { title, content });
        setEditId(null);
      } else {
        await axios.post(`${API_BASE_URL}/posts`, { title, content });
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
      await axios.delete(`${API_BASE_URL}/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div className="App">
      <h1>Neyo55 Blog App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Blog Title"
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






// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// console.log('API_BASE_URL =', API_BASE_URL);


// const App = () => {
//   const [posts, setPosts] = useState([]);
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [editId, setEditId] = useState(null);

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const fetchPosts = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/posts`);
//       setPosts(res.data);
//     } catch (err) {
//       console.error('Error fetching posts:', err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editId) {
//         await axios.put(`${API_BASE_URL}/api/posts/${editId}`, { title, content });
//         setEditId(null);
//       } else {
//         await axios.post(`${API_BASE_URL}/api/posts`, { title, content });
//       }
//       setTitle('');
//       setContent('');
//       fetchPosts();
//     } catch (err) {
//       console.error('Error saving post:', err);
//     }
//   };

//   const handleEdit = (post) => {
//     setTitle(post.title);
//     setContent(post.content);
//     setEditId(post._id);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${API_BASE_URL}/api/posts/${id}`);
//       fetchPosts();
//     } catch (err) {
//       console.error('Error deleting post:', err);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Neyo55 Blog App</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Blog Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//         <textarea
//           placeholder="Content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           required
//         ></textarea>
//         <button type="submit">{editId ? 'Update Post' : 'Create Post'}</button>
//       </form>
//       <div className="posts">
//         {posts.map((post) => (
//           <div key={post._id} className="post">
//             <h2>{post.title}</h2>
//             <p>{post.content}</p>
//             <button onClick={() => handleEdit(post)}>Edit</button>
//             <button onClick={() => handleDelete(post._id)}>Delete</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default App;












// // This file is part of the blog app frontend.
// // It fetches, creates, updates, and deletes blog posts using a REST API.
// // Make sure to set the REACT_APP_API_BASE_URL environment variable to point to your API
// // server, or it will default to 'http://localhost:3000'.
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// // Set the API base URL from environment variables or default to localhost
// // This allows the app to be flexible for different environments (development, production, etc.)
// // Ensure that the API server is running and accessible at this URL.
// // You can set this in your .env file as REACT_APP_API_BASE_URL=http://
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

// // Main App component
// // This component manages the state of the blog posts and handles user interactions
// // It uses React hooks for state management and side effects (fetching data).
// const App = () => {
//   const [posts, setPosts] = useState([]);
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [editId, setEditId] = useState(null);

//   // Fetch posts from the API when the component mounts
//   // This function is called once when the component mounts to load existing posts.
//   // It uses axios to make a GET request to the API and updates the state with the fetched posts.
//   // If there's an error during the fetch, it logs the error to the console.
//   // The posts are expected to be in the format returned by the API.
//   // Each post should have at least an _id, title, content, and author.
//   // The posts will be displayed in a list format, and each post will have options to
//   // edit or delete it.
//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   // Fetch posts from the API when the component mounts
//   // This function makes a GET request to the API to retrieve all blog posts
//   // It updates the state with the fetched posts so they can be displayed in the UI.
//   // If there's an error, it logs the error to the console.
//   // This is called once when the component mounts due to the empty dependency array.
//   // You can also call this function after creating, updating, or deleting a post to refresh
//   // the list of posts displayed in the UI.
//   // Make sure your API server is running and accessible at the specified API_BASE_URL.
//   // The posts are expected to be in the format returned by the API.
//   // Each post should have at least an _id, title, content, and author.
//   // The posts will be displayed in a list format, and each post will have options to
//   // edit or delete it.
//   // The posts are stored in the state variable 'posts', which is initialized as an empty
//   // array. This allows the component to re-render whenever the posts are updated.
//   // The posts will be displayed in a simple list format, with each post showing its title
//   // and content. There will also be buttons to edit or delete each post.
//   const fetchPosts = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/posts`);
//       setPosts(res.data);
//     } catch (err) {
//       console.error('Error fetching posts:', err);
//     }
//   };

//   // Handle form submission for creating or updating posts
//   // If editId is set, it updates the existing post; otherwise, it creates a new post.
//   // It resets the form fields after submission and refetches the posts to update
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editId) {
//         await axios.put(`${API_BASE_URL}/posts/${editId}`, { title, content });
//         setEditId(null);
//       } else {
//         await axios.post(`${API_BASE_URL}/posts`, { title, content });
//       }
//       setTitle('');
//       setContent('');
//       fetchPosts();
//     } catch (err) {
//       console.error('Error saving post:', err);
//     }
//   };

//   // Handle editing a post
//   // This function sets the form fields to the values of the post being edited.
//   // It allows the user to modify the title and content of an existing post.
//   // When the user clicks the edit button for a post, this function is called with the
//   // post object as an argument. It sets the title and content state variables to the
//   // values of the post, and sets the editId to the _id of the post being edited.
//   // This allows the form to display the current values of the post, so the user can
//   // modify them. When the form is submitted, it will update the existing post
//   // instead of creating a new one.
//   const handleEdit = (post) => {
//     setTitle(post.title);
//     setContent(post.content);
//     setEditId(post._id);
//   };

//   // Handle deleting a post
//   // This function sends a DELETE request to the API to remove the post with the given id
//   // After deletion, it refetches the posts to update the list displayed in the UI
//   // It uses the post's _id to identify which post to delete.
//   // When the user clicks the delete button for a post, this function is called with the
//   // _id of the post as an argument. It sends a DELETE request to the API
//   // to remove the post from the database. After the post is deleted, it calls fetchPosts
//   // to refresh the list of posts displayed in the UI. If there's an error during
//   // the deletion, it logs the error to the console.
//   // This ensures that the UI stays in sync with the database, and the deleted post
//   // is no longer displayed in the list of posts.
//   // Make sure your API server is running and accessible at the specified API_BASE_URL.
//   // The posts are expected to be in the format returned by the API.
//   // Each post should have at least an _id, title, content, and author.
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${API_BASE_URL}/posts/${id}`);
//       fetchPosts();
//     } catch (err) {
//       console.error('Error deleting post:', err);
//     }
//   };

//   // Render the main application UI
//   // This includes a form for creating or editing posts and a list of existing posts.
//   // The form allows users to enter a title and content for a new post or edit an
//   // existing post. The list displays all posts with options to edit or delete each one.
//   // The form is controlled by the state variables title, content, and editId.
//   // When the form is submitted, it calls handleSubmit to either create a new post or
//   // update an existing one. The list of posts is displayed below the form, with each
//   // post showing its title and content. Each post has buttons to edit or delete it.
//   // The edit button sets the form fields to the values of the post being edited,
//   // allowing the user to modify the title and content. The delete button removes the
//   // post from the database and updates the list of posts displayed in the UI.
//   return (
//     <div className="App">
//       <h1>Neyo55 Blog App</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Blog Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//         <textarea
//           placeholder="Content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           required
//         ></textarea>
//         <button type="submit">{editId ? 'Update Post' : 'Create Post'}</button>
//       </form>
//       <div className="posts">
//         {posts.map((post) => (
//           <div key={post._id} className="post">
//             <h2>{post.title}</h2>
//             <p>{post.content}</p>
//             <button onClick={() => handleEdit(post)}>Edit</button>
//             <button onClick={() => handleDelete(post._id)}>Delete</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Export the App component as default
// // This allows it to be imported and used in other files, such as index.js.
// // It is the main entry point for the React application.
// export default App;
