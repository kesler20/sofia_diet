import axios from "axios";

/**
 * DatabaseInterface class
 * @class
 * @classdesc DatabaseInterface class is a class that is used to interact with the database.
 * @param { string } URL - The URL of the database.
 * @returns { void }
 * @example
 * const db = new DatabaseInterface("http://localhost:3000");
 * const response = db.CREATE("users",{ name: "John Doe" });
 * console.log(response);
 * @example
 * const db = new DatabaseInterface("http://localhost:3000");
 * const response = db.READ("users","John Doe");
 * console.log(response);
 * @example
 * const db = new DatabaseInterface("http://localhost:3000");
 * const response = db.UPDATE("users",{ name: "John Doe" });
 * console.log(response);
 * @example
 *
 * const db = new DatabaseInterface("http://localhost:3000");
 * const response = db.DELETE("users","John Doe");
 * console.log(response);
 **/
export default class DatabaseInterface {
  url: string | undefined;

  constructor(URL?: string | undefined) {
    this.url = URL || "http://localhost:3000";
  }

  /**
   * Creates a new resource in the database
   * @param {T} resource - The resource to be created
   * @param {string} resourceEndpoint - The endpoint of the resource
   * @returns {Promise<TResponse | undefined>} The created resource
   * @example
   * const db = new DatabaseInterface("http://localhost:3000");
   * const response = db.CREATE("users", { name: "John Doe" });
   * console.log(response); // { name: "John Doe" }
   */
  CREATE = async <TRequest, TResponse>(
    resourceEndpoint: string,
    resource: TRequest
  ): Promise<TResponse | undefined> => {
    try {
      const response = await axios.post<TRequest, TResponse>(
        `${this.url}/${resourceEndpoint}`,
        resource
      );
      return response;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  };

  /**
   * @example
   * const db = new DatabaseInterface("http://localhost:3000");
   * const response = await db.READ<User>("users/userID");
   * console.log(response); // { name: "John Doe" }
   */
  READ = async <TResponse>(
    resourceEndpoint: string
  ): Promise<TResponse | undefined> => {
    try {
      const response = await axios.get<TResponse>(`${this.url}/${resourceEndpoint}`);
      return response.data;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  };

  /**
   * @example
   * const db = new DatabaseInterface("http://localhost:3000");
   * const response = await db.UPDATE<User, Message>("users/userID", { name: "John Don" });
   * console.log(response); // { message: "Updated John Doe to John Don" }
   */
  UPDATE = async <TRequest, TResponse>(
    resourceEndpoint: string,
    resource: TRequest
  ): Promise<TResponse | undefined> => {
    try {
      const response = await axios.put<TRequest, TResponse>(
        `${this.url}/${resourceEndpoint}`,
        resource
      );
      return response;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  };

  /**
   * @example
   * const db = new DatabaseInterface("http://localhost:3000");
   * const response = await db.DELETE<Message>("users/userID");
   * console.log(response); // { message: "Deleted John Doe" }
   */
  DELETE = async <TResponse>(
    resourceEndpoint: string
  ): Promise<TResponse | undefined> => {
    try {
      const response = await axios.delete<TResponse>(
        `${this.url}/${resourceEndpoint}`
      );
      return response.data;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  };
}
