import axios from "axios";

export async function sendAdvertisement(chatId: number): Promise<void> {
  try {
    await axios.get(
      process.env.ADMANAGER_URL + "?botId=slowreverber&userId=" + chatId
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
