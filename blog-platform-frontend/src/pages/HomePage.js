// src/pages/HomePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await postsAPI.getAll(page);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Latest Posts</h1>
      <div style={styles.postsGrid}>
        {posts.map(post => (
          <article key={post._id} style={styles.postCard}>
            {post.imageUrl && (
              <img src={post.imageUrl} alt={post.title} style={styles.postImage} />
            )}
            <div style={styles.postContent}>
              <h2>
                <Link to={`/post/${post._id}`} style={styles.postTitle}>
                  {post.title}
                </Link>
              </h2>
              <p style={styles.excerpt}>{post.excerpt}</p>
              <div style={styles.postMeta}>
                <span>By {post.author.username}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>👁️ {post.views} views</span>
              </div>
              <div style={styles.tags}>
                {post.tags?.map(tag => (
                  <span key={tag} style={styles.tag}>#{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={styles.pageButton}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 20px'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#2c3e50'
  },
  postsGrid: {
    display: 'grid',
    gap: '2rem'
  },
  postCard: {
    background: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s'
  },
  postImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  postContent: {
    padding: '1.5rem'
  },
  postTitle: {
    color: '#2c3e50',
    textDecoration: 'none',
    fontSize: '1.5rem',
    marginBottom: '1rem',
    display: 'inline-block'
  },
  excerpt: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '1rem'
  },
  postMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: '1rem'
  },
  tags: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  tag: {
    background: '#ecf0f1',
    padding: '0.2rem 0.6rem',
    borderRadius: '3px',
    fontSize: '0.8rem',
    color: '#2c3e50'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem',
    alignItems: 'center'
  },
  pageButton: {
    padding: '0.5rem 1rem',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem'
  }
};

export default HomePage;