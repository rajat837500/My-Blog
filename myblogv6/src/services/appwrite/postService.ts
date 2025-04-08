import conf from "../../conf/conf";
import { Client, Databases, ID, Models, Query } from "appwrite";

class PostService {
  private client: Client;
  private database: Databases;


  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.database = new Databases(this.client);
  }

  /**
   * Creates a new post.
   * @param userId - ID of the user creating the post
   * @param userName - Name of the user
   * @param title - Post title
   * @param content - Post content
   * @param imageUrl - URL of the uploaded image (optional)
   * @param youtubeUrl - YouTube video URL (optional)
   * @param thumbnailUrl - Extracted YouTube thumbnail (if applicable)
   * @param status - Post status ("active" or "inactive")
   * @returns Promise resolving to the created post
   */
  async createPost({
    userId,
    userName,
    title,
    content,
    imageUrl,
    youtubeUrl,
    thumbnailUrl,
    status = "Inactive",
    userAvatar,
  }: {
    userId: string;
    userName: string;
    title: string;
    content: string;
    imageUrl?: string | null;
    youtubeUrl?: string | null;
    thumbnailUrl?: string | null;
    status?: "Active" | "Inactive";
    userAvatar?: string;
  }): Promise<Models.Document> {
    try {
      return await this.database.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        {
          userId,
          userName,
          title,
          content,
          imageUrl,
          youtubeUrl,
          thumbnailUrl,
          status,
          userAvatar,
        }
      );
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  /**
   * Fetches all active posts.
   * @returns Promise resolving to a list of active posts
   */
  async fetchActivePosts(): Promise<Models.DocumentList<Models.Document>> {
    try {
      return await this.database.listDocuments(
        conf.appwriteDatabaseId, 
        conf.appwriteCollectionId, 
        [
        Query.equal("status", "Active"),
        Query.orderDesc("$createdAt"),
        ]
    );
    } catch (error) {
      console.error("Error fetching active posts:", error);
      throw error;
    }
  }

  /**
   * Fetches all posts by a specific user.
   * @param userId - ID of the user whose posts to fetch
   * @returns Promise resolving to the user's posts
   */
  async fetchUserPosts(userId: string): Promise<Models.DocumentList<Models.Document>> {
    try {
      return await this.database.listDocuments(
        conf.appwriteDatabaseId, 
        conf.appwriteCollectionId, 
        [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
        ]
    );
    } catch (error) {
      console.error("Error fetching user posts:", error);
      throw error;
    }
  }

  /**
   * Updates the status of a post (e.g., to "active" or "inactive").
   * @param postId - ID of the post to update
   * @param status - New status ("active" or "inactive")
   * @returns Promise resolving to the updated post
   */
  async updatePost(
    postId: string,
    {
      title, 
      content, 
      imageUrl, 
      youtubeUrl, 
      thumbnailUrl, 
      status, 
    }:{
      title: string;
      content: string;
      imageUrl?: string | null;
      youtubeUrl?: string | null;
      thumbnailUrl?: string | null;
      status: "Active" | "Inactive";
    }): Promise<Models.Document> {
    try {
      return await this.database.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        postId,
        { title,
          content,
          imageUrl,
          youtubeUrl,
          thumbnailUrl,
          status,
         }
      );
    } catch (error) {
      console.error("Error updating post status:", error);
      throw error;
    }
  }

  /**
   * Deletes a post.
   * @param postId - ID of the post to delete
   * @returns Promise resolving when the post is deleted
   */
  async deletePost(postId: string): Promise<void> {
    try {
      await this.database.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId, 
        postId
      );
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  }

  async getPost(slug: string): Promise<Models.Document | null> {
    try {
        return await this.database.getDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            slug
        );
    } catch (error) {
        console.error("Appwrite service :: getPost :: error", error);
        return null;
    }
  }

}

export default new PostService();
