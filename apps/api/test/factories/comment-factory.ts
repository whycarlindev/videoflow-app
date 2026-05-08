import { Injectable } from '@nestjs/common'

import { CommentProps } from '@/domain/comment/enterprise/entities/comment'
import { PrismaCommentMapper } from '@/infra/database/prisma/mappers/prisma-comment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { makeComment } from './make-comment'

@Injectable()
export class CommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaComment(override: Partial<CommentProps> = {}) {
    const comment = makeComment(override)

    await this.prisma.comment.create({
      data: PrismaCommentMapper.toPrisma(comment),
    })

    return comment
  }
}
