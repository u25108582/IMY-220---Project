function Comments({ comments }) {
    if (!comments || comments.length == 0) {
        return <p className="no-comments">No comments yet.</p>;
    }

    return (
        <div className="comment-section">
            {comments.map((c, index) => (
                <div key={index} className="comment-item">
                    <div className="comment-header">
                        <span className="comment-user">{c.username}</span>
                    </div>
                    <p className="comment-text">{c.comment}</p>
                </div>
            ))}
        </div>
    );
}

export default Comments;