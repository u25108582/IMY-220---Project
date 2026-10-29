
import Posts from "./Posts";

function PostList({ posts }) {
    return (
        <div className="post-list">
            {posts.map((post) => (
                <Posts
                    key={post._id}
                    id={post._id}
                    title={post.Title}
                    author={post.Author}
                    img={post.Images?.[0]}
                    tags={post.Tags}
                    likes={post.Likes}
                    comments={post.Comments}
                    posted={post.Posted}
                />
            ))}
        </div>
    );
}

export default PostList;