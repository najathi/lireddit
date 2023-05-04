import { Query, Resolver, Arg, Mutation } from "type-graphql";

import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    async posts(): Promise<Post[]> {
        return await Post.find();
    }

    @Query(() => Post, { nullable: true })
    async post(@Arg("id") id: number): Promise<Post | null> {
        return await Post.findOne({ where: { id } })
    }

    @Mutation(() => Post)
    async createPost(@Arg("title") title: string): Promise<Post> {
        return Post.create({ title }).save();
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg("identifier") id: number,
        @Arg("title", () => String, { nullable: true }) title: string,
    ): Promise<Post | null> {
        const post = await Post.findOne({ where: { id } });
        if (!post) {
            return null;
        }
        if (typeof title !== 'undefined') {
            await Post.update({ id }, { title });
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(@Arg("id") id: number): Promise<Boolean> {
        await Post.delete(id);
        return true;
    }
}
