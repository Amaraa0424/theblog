'use client';

import { useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';

const INCREMENT_POST_VIEW = gql`
  mutation IncrementPostView($id: String!) {
    incrementPostView(id: $id) {
      id
      viewCount
    }
  }
`;

interface ViewCounterProps {
  postId: string;
}

export function ViewCounter({ postId }: ViewCounterProps) {
  const [incrementView] = useMutation(INCREMENT_POST_VIEW, {
    onError: (error) => {
      console.error('Error incrementing view count:', error);
      // Remove the viewed flag so it can try again on next visit
      sessionStorage.removeItem(`viewed-${postId}`);
    }
  });

  useEffect(() => {
    const incrementViewCount = async () => {
      try {
        // Only increment the view count once per session
        const hasViewed = sessionStorage.getItem(`viewed-${postId}`);
        if (!hasViewed) {
          await incrementView({ 
            variables: { id: postId },
          });
          sessionStorage.setItem(`viewed-${postId}`, 'true');
        }
      } catch (error) {
        console.error('Error in ViewCounter effect:', error);
      }
    };

    incrementViewCount();
  }, [postId, incrementView]);

  // This component doesn't render anything
  return null;
} 