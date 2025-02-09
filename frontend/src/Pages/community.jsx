import React, { useState, useEffect } from 'react';
import { getAllPosts } from '@/actions/commActions';

const Community = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        //console.log("useEffect executed");
        const handler = (event) => {
          if (event.origin !== 'https://onecompiler.com') {
            return;
          }
          console.log('Received message:', event.data);
        }
        window.onmessage = handler

        getAllPosts().then(res => {
            setPosts(res.data)
        })

    }, []);

    const handleDelete = (index) =>{
        const updatedPosts = [...posts]
        updatedPosts.splice(index, 1)
        setPosts(updatedPosts)
    }

    return (
        <div className="container-fluid mt-5">
            <div className="container">
                <div className="py-2">
                    {posts.map((p, i) => (
                        <div key={i} className="flex bg-transparent border-top border-left p-2">
                            <div className='title'>
                                {p?.title}
                            </div>
                            <div>
                                {p?.description}
                            </div>
                            <div className='d-flex small justify-content-end'>
                                {p?.userId}
                            </div>
                            {/* <div className="d-flex flex-wrap justify-content-between">
                                <button
                                    onClick={() => handleDelete(i)}
                                    className="my-1 btn btn-sm btn-outline-warning"
                                >
                                    Delete
                                </button>
                            </div> */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Community;