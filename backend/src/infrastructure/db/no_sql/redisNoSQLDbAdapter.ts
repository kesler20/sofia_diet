import { createClient, RedisClientType } from "redis";
import { NoSQLDbInterface } from "./noSQLDBInterface";
import redisCredentials from "../../credentials/redisCredentials";

/**
 * A class to interact with Redis database.
 * This class is used to perform CRUD operations on the resources in the database.
 * The resources are stored as key-value pairs in Redis.
 * The primary key is the topic and the secondary key is the resourceId.
 * @example
 * ```typescript
 *
 * const main = async () => {
 * const redisAdapter = new RedisDBAdapter();
 *
 * const topic = "production";
 * const resourceId = "resource123";
 * const data = { key1: "value1", key2: "value2" };
 *
 * // Put resource
 * await redisAdapter.putResource(topic, resourceId, data);
 *
 * // Get resource
 * const resource = await redisAdapter.getResource(topic, resourceId);
 * console.log("Resource:", resource);
 *
 * // Get all resources under the topic
 * const resources = await redisAdapter.getResources(topic);
 * console.log("All Resources:", resources);
 *
 * // Delete resource
 * await redisAdapter.deleteResource(topic, resourceId);
 * console.log("Deleted resource:", resourceId);
 *
 * // Get all resources under the topic
 * const resourcesAfterDeletion = await redisAdapter.getResources(topic);
 * console.log("All Resources:", resourcesAfterDeletion);
 * };
 * main();
 * ```
 */
export default class RedisDBAdapter implements NoSQLDbInterface {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      password: redisCredentials.password,
      socket: {
        host: redisCredentials.socket.host,
        port: redisCredentials.socket.port,
      },
    });
    this.client.connect().catch(console.error);
  }

  /**
   * Put a resource into Redis using topic as the primary key and resourceId as the secondary key.
   * The content is stored as a hash.
   *
   * @param topic - The primary key, e.g. "production"
   * @param resourceId - The secondary key, e.g. "resourceId"
   * @param content - The content to store as a key-value pair
   * @returns {Promise<boolean>} - Returns true if successfully stored
   */
  async putResource(
    topic: string,
    resourceId: string,
    content: { [key: string]: any }
  ): Promise<boolean> {
    const key = `${topic}:${resourceId}`;
    const flattenedContent = Object.entries(content).flatMap(([k, v]) => [
      k,
      JSON.stringify(v),
    ]);

    try {
      await this.client.hSet(key, flattenedContent);
      return true;
    } catch (error) {
      console.error("Error in putResource:", error);
      return false;
    }
  }

  /**
   * Get a resource from Redis using topic and resourceId as the composite key.
   *
   * @param topic - The primary key, e.g. "production"
   * @param resourceId - The secondary key, e.g. "resourceId"
   * @returns {Promise<any>} - The resource if found, otherwise null
   */
  async getResource(topic: string, resourceId: string): Promise<any> {
    const key = `${topic}:${resourceId}`;

    try {
      const data = await this.client.hGetAll(key);
      if (Object.keys(data).length === 0) return null;

      return Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, JSON.parse(v)])
      );
    } catch (error) {
      console.error("Error in getResource:", error);
      return null;
    }
  }

  /**
   * Get all resources for a specific topic.
   * In Redis, this can be done by scanning for all keys with the prefix "topic:".
   *
   * @param topic - The primary key, e.g. "production"
   * @returns {Promise<any[]>} - The list of resources under the topic
   */
  async getResources(topic: string): Promise<any[]> {
    const pattern = `${topic}:*`;

    try {
      const keys = await this.client.keys(pattern);
      const resources = await Promise.all(
        keys.map(async (key) => {
          const data = await this.client.hGetAll(key);
          return Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, JSON.parse(v)])
          );
        })
      );
      return resources;
    } catch (error) {
      console.error("Error in getResources:", error);
      return [];
    }
  }

  /**
   * Delete a specific resource using topic and resourceId.
   *
   * @param topic - The primary key, e.g. "production"
   * @param resourceId - The secondary key, e.g. "resourceId"
   * @returns {Promise<boolean>} - Returns true if successfully deleted
   */
  async deleteResource(topic: string, resourceId: string): Promise<boolean> {
    const key = `${topic}:${resourceId}`;

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error("Error in deleteResource:", error);
      return false;
    }
  }

  /**
   * Close the connection to the Redis database.
   */
  close(): void {
    this.client.disconnect().catch(console.error);
  }
}
