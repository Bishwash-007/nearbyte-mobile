import * as SecureStore from 'expo-secure-store';

/**
 * Saves a value to the secure store with the given key.
 * @param key - The key under which the value will be stored.
 * @param value - The value to be stored.
 *
 * Note: This function does not return a value, but it will log an error if the saving process fails.
 */

export async function saveToSecureStore(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error('Error saving to secure store:', error);
  }
}

/**
 *  Retrieves a value from the secure store for the given key.
 * @param key - The key for which to retrieve the value.
 * @returns The value associated with the key, or null if not found.
 *
 * Note: This function returns a Promise that resolves to the retrieved value or null if an error occurs.
 */
export async function getFromSecureStore(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error('Error retrieving from secure store:', error);
    return null;
  }
}

/**
 * Deletes a value from the secure store for the given key.
 * @param key - The key for which to delete the value.
 *
 * Note: This function does not return a value, but it will log an error if the deletion fails.
 */
export async function deleteFromSecureStore(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error('Error deleting from secure store:', error);
  }
}
