import { useState, useEffect } from 'react';

import Navigation from "../components/Navigation";
import PostList from "../components/PostList"
import Filters from "../components/Filters"

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <>
        <Navigation searchbar={true} />

        <main>
          <Filters />

          <p>Loading posts...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation searchbar={true} />

      <main>
        <Filters />
        
        <PostList posts={posts} />
      </main>
    </>
  );
}

export default Home;