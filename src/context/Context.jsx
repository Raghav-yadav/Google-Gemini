import React, { createContext, useState } from "react";
import runChat from "../config/Gemini";

export const ChatContext = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData("");
        setRecentPrompt("");
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

        try {
            const response = await runChat(prompt);
            setRecentPrompt(prompt);
            setPrevPrompts((prev) => [...prev, prompt]); // Save prompt in history
            
            let formattedResponse = response.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\*/g, "<br>");
            let responseWords = formattedResponse.split(" ");

            responseWords.forEach((word, index) => delayPara(index, word + " "));
        } catch (error) {
            console.error("Error in onSent:", error);
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
    };

    return (
        <ChatContext.Provider value={contextValue}>
            {props.children}
        </ChatContext.Provider>
    );
};

export default ContextProvider;
