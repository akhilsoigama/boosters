import useSWR, { mutate } from "swr";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_CHATBOT_LINK,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log(process.env.NEXT_CHATBOT_LINK)
const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export const useChatbotData = (endpoint) => {
  const { data, error, isLoading } = useSWR(endpoint, fetcher);
  return { data, error, isLoading };
};

export const sendMessage = async (message) => {
  try {
    const { data } = await axiosInstance.post("/chat", { message });
    mutate("/chat"); 
    return data.response;
  } catch (error) {
    console.error("Error sending message:", error);
    return "Sorry, I'm having trouble connecting to the server.";
  }
};

export const fetchRandomQuestion = async () => {
  try {
    const { data } = await axiosInstance.get("/random-kids-question");
    return data;
  } catch (error) {
    console.error("Error fetching question:", error);
    return { question: "Failed to load a question. Please try again." };
  }
};

export const checkAnswer = async (question, answer) => {
  try {
    const { data } = await axiosInstance.post("/check-answer", {
      question,
      answer,
    });
    return data;
  } catch (error) {
    console.error("Error checking answer:", error);
    return { correct: false, correct_answer: "Unknown" };
  }
};
