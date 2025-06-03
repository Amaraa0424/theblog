'use server'

import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function createComment(postId: string, content: string, userId: string, parentId?: string) {
  if (!userId) {
    throw new Error('Authentication required to comment')
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
        parentId,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    })

    revalidateTag(`post-${postId}-comments`)
    return comment
  } catch (error) {
    console.error('Failed to create comment:', error)
    throw new Error('Failed to create comment')
  }
}

export async function toggleCommentLike(commentId: string, userId: string) {
  if (!userId) {
    throw new Error('Authentication required to like a comment')
  }

  try {
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    })

    if (existingLike) {
      await prisma.commentLike.delete({
        where: {
          id: existingLike.id,
        },
      })
      return false
    } else {
      await prisma.commentLike.create({
        data: {
          id: `${commentId}-${userId}`,
          commentId,
          userId,
        },
      })
      return true
    }
  } catch (error) {
    console.error('Failed to toggle comment like:', error)
    throw new Error('Failed to toggle comment like')
  }
}

export async function toggleLike(postId: string, userId: string) {
  if (!userId) {
    throw new Error('Authentication required to like posts')
  }

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      })
      return false // Post is now unliked
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      })
      return true // Post is now liked
    }
  } catch (error) {
    console.error('Failed to toggle like:', error)
    throw new Error('Failed to toggle like')
  }
} 