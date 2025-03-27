"use client";
import { useEffect } from "react";

const WppWidget = () => {
  useEffect(() => {
    const url = "https://app.wasapi.io/cdn/scripts/wasapiWidgetChat.js";
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = url;

    const options = {
      active: 1,
      sentPhone: "16124053916",
      userMessage: "Hello Berlin! I would like some information",
      customer: "6e8963c1-6411-420a-b977-270b8adf144a",
      mainButton: {
        position: "left",
        marginBottom: 10,
        borderRadius: 25,
        text: "Chat",
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: "#4DC247",
      },
      chatCard: {
        show: 1,
        backgroundColor: "#4dc247",
        borderRadius: 10,
        avatarUrl: "",
        title: "Welcome to BerlinGonzalez Shop",
        subtitle: "Please write your message",
        messageTitle: "Hello welcome to BerlinGonzalez Shop",
        messageContent: "",
        sendButtonText: "",
      },
    };

    script.addEventListener("load", () => {
      if (typeof wasapiWidgetInit === "function") {
        wasapiWidgetInit(options);
      } else {
        console.error("wasapiWidgetInit is not defined");
      }
    });

    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script if component is unmounted
      document.body.removeChild(script);
    };
  }, []);

  return null; // No visible output needed for the widget
};

export default WppWidget;
