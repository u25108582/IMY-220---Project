import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import Navigation from '../components/Navigation';
import Comments from '../components/Comments';
import Image from '../components/Image';
import Tags from '../components/Tags';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/post/${id}`);
        if (!response.ok) {
          throw new Error("Post not found");
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navigation searchbar={true} />
        <main style={{ textAlign: 'center', marginTop: '40px' }}>
          <p>Loading post...</p>
        </main>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navigation searchbar={true} />
        <main style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ color: 'red' }}>{error || "Post not found"}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation searchbar={true} />

      <main>
        <div className="post">
          <h2 className="post-title">{post.Title}</h2>

          <span className="post-author">
            Posted by <Link to={`/Profile/${post.Author}`} className="author-link">{post.Author}</Link>
          </span>

          <Image img={post.Images?.[0]} alt={post.Title} />

          <Tags tags={post.Tags} />

          {post.content && <p className="post-text">{post.content}</p>}

          <div className="post-stat">
            <span>{post.Likes} Likes</span>
            <span>{post.Comments?.length || 0} Comments</span>
          </div>

          <Comments comments={post.Comments} />
        </div>
      </main>
    </>
  );
}

export default PostDetail;