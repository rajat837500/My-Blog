import conf from "../../conf/conf";
import { Client, Account, ID, Avatars, Models } from "appwrite";

/**
 * AuthService class to handle user authentication with Appwrite.
 * Provides methods for user signup, login, logout, and fetching the current user.
 */
class AuthService {
  private client: Client;
  private account: Account;
  private avatars: Avatars;

  constructor() {
    // Initialize the Appwrite client
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl) // Set Appwrite backend URL
      .setProject(conf.appwriteProjectId); // Set Appwrite Project ID

    // Initialize the Account module for authentication
    this.account = new Account(this.client);

    // Initialize Avatars service
    this.avatars = new Avatars(this.client);
  }

  /**
   * Creates a new user account with email, password, and name.
   * If successful, automatically logs in the user.
   * @param email - User email
   * @param password - User password
   * @param name - User name
   * @returns A Promise that resolves to session details or throws an error
   */
  async createAccount({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }): Promise<Models.Session | Models.User<Models.Preferences>> {
    try {
      const userAccount = await this.account.create(ID.unique(), email, password, name);
      console.log("User Account Created:", userAccount);

      // If account creation is successful, log in the user automatically
      return userAccount ? this.login({ email, password }) : userAccount;
    } catch (error) {
      console.error("Error in createAccount:", error);
      throw error;
    }
  }

  /**
   * Logs in an existing user with email and password.
   * @param email - User email
   * @param password - User password
   * @returns A Promise that resolves to session details or throws an error
   */
  async login({ email, password }: { email: string; password: string }): Promise<Models.Session> {
    try {
      const userLogin = await this.account.createEmailPasswordSession(email, password);
      console.log("User Login Details:", userLogin);
      return userLogin;
    } catch (error: any) {
      console.error("Error in login:", error);
      throw {error: error || "Login Failed"}
    }
  }

  /**
   * Retrieves the currently logged-in user's details.
   * @returns A Promise that resolves to user details or null if not logged in
   */
  async getCurrentUser(): Promise<(Models.User<Models.Preferences> & { avatarUrl: string }) | null> {
    try {
      const user = await this.account.get();
      const avatarUrl = user.name ? this.avatars.getInitials(user.name).toString() : "";
      console.log("Current User:", user.name, "Avatar URL:", avatarUrl);
      return { ...user, avatarUrl };
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      return null;
    }
  }

  /**
   * Logs out the currently logged-in user by deleting all active sessions.
   * @returns A Promise that resolves when the logout is complete
   */
  async logout(): Promise<void> {
    try {
      await this.account.deleteSessions();
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error in logout:", error);
    }
  }
}

// Export a singleton instance of AuthService to be used throughout the app
export default new AuthService();
