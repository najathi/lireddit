import React from 'react'
import { withUrqlClient } from 'next-urql';

import NavBar from '../components/NavBar';
import { createUrqlClient } from '../util/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';

interface IndexProps {

}

const Index: React.FC<IndexProps> = ({ }) => {
  const [{ data }] = usePostsQuery();

  return (
    <div>
      <NavBar />
      <div>Index Page</div>
      <br />

      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </div>
  );
}

export default withUrqlClient(
  createUrqlClient,
  { ssr: true } // Enables server-side rendering using `getInitialProps`
)(Index);