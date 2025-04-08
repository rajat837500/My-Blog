import conf from "../../conf/conf";
import { Client, Storage, ID } from "appwrite";

/**
 * StorageService class to handle file uploads, deletions, and retrievals using Appwrite Storage.
 */
class StorageService {
  private client: Client;
  private storage: Storage;

  constructor() {
    // Initialize Appwrite Client & Storage
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl) // Appwrite Backend URL
      .setProject(conf.appwriteProjectId); // Appwrite Project ID

    this.storage = new Storage(this.client);
  }

  /**
   * Uploads an image file to Appwrite Storage.
   * @param file - The image file to upload.
   * @returns The uploaded file details including file ID & URL.
   */
  async uploadImage(file: File): Promise<{ fileId: string; fileUrl: string }> {
    try {
      // Upload the file to Appwrite storage
      const uploadedFile = await this.storage.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );

      // Get the file URL
      const fileUrl = this.getFilePreview(uploadedFile.$id);

      return { fileId: uploadedFile.$id, fileUrl };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  /**
   * Retrieves a preview URL for an uploaded file.
   * @param fileId - The ID of the file.
   * @returns The file preview URL.
   */
  getFilePreview(fileId: string){
    return this.storage.getFileView(
      conf.appwriteBucketId, 
      fileId).toString();
      
  }

  /**
   * Deletes an image from Appwrite Storage.
   * @param fileId - The ID of the file to delete.
   * @returns A Promise that resolves when the file is deleted.
   */
  async deleteImage(fileId: string): Promise<void> {
    try {
      await this.storage.deleteFile(
        conf.appwriteBucketId, 
        fileId);
      console.log(`Image ${fileId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }
}

// Export a singleton instance of StorageService to be used throughout the app
export default new StorageService();
