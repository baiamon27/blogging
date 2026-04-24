// src/pages/PostPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const res = await postsAPI.getOne(id);
      setPost(res.data);
      if (user) {
        setLiked(res.data.likes?.includes(user.id));
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  }, [id, user]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const res = await postsAPI.like(id);
    setLiked(res.data.liked);
    setPost(prev => ({ ...prev, likes: prev.likes ? [...prev.likes] : [] }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    await postsAPI.addComment(id, comment);
    setComment('');
    fetchPost();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await postsAPI.delete(id);
      navigate('/');
    }
  };

  if (!post) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <article style={styles.post}>
        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} style={styles.image} />
        )}
        <h1 style={styles.title}>{post.title}</h1>
        <div style={styles.meta}>
          <span>By {post.author.username}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span>👁️ {post.views} views</span>
        </div>
        
        <div style={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <div style={styles.tags}>
          {post.tags?.map(tag => (
            <span key={tag} style={styles.tag}>#{tag}</span>
          ))}
        </div>
        
        <div style={styles.actions}>
          <button onClick={handleLike} style={styles.likeButton}>
            {liked ? '❤️' : '🤍'} {post.likes?.length || 0} Likes
          </button>
          
          {user && (user.id === post.author._id || user.role === 'admin') && (
            <div style={styles.adminActions}>
              <button onClick={() => navigate(`/edit/${id}`)} style={styles.editButton}>
                Edit
              </button>
              <button onClick={handleDelete} style={styles.deleteButton}>
                Delete
              </button>
            </div>
          )}
        </div>
        
        <div style={styles.commentsSection}>
          <h3>Comments ({post.comments?.length || 0})</h3>
          
          {user && (
            <form onSubmit={handleComment} style={styles.commentForm}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                required
                style={styles.commentInput}
              />
              <button type="submit" style={styles.submitButton}>Post Comment</button>
            </form>
          )}
          
          <div style={styles.commentsList}>
            {post.comments?.map(comment => (
              <div key={comment._id} style={styles.comment}>
                <strong>{comment.user?.username}</strong>
                <p>{comment.content}</p>
                <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 20px'
  },
  post: {
    background: 'white',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  image: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '1.5rem'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: '#2c3e50'
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    color: '#888',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #eee'
  },
  content: {
    lineHeight: '1.8',
    fontSize: '1.1rem',
    color: '#333',
    marginBottom: '2rem'
  },
  tags: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem'
  },
  tag: {
    background: '#ecf0f1',
    padding: '0.3rem 0.8rem',
    borderRadius: '3px',
    fontSize: '0.9rem'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '1rem 0',
    borderTop: '1px solid #eee',
    borderBottom: '1px solid #eee'
  },
  likeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '5px'
  },
  adminActions: {
    display: 'flex',
    gap: '1rem'
  },
  editButton: {
    background: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  deleteButton: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  commentsSection: {
    marginTop: '2rem'
  },
  commentForm: {
    marginBottom: '2rem'
  },
  commentInput: {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    marginBottom: '1rem',
    fontFamily: 'inherit'
  },
  submitButton: {
    background: '#2ecc71',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  comment: {
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '5px'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem'
  }
};

export default PostPage;