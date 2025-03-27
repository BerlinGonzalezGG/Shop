"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getCsrfToken } from "next-auth/react";

const addUser = async (user) => {
  const res = await fetch("/api/bot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": await getCsrfToken(),
    },
    body: JSON.stringify({
      username: user,
    }),
  });
  const data = await res.json();
  return data;
};

const BotForm = () => {
  const { toast } = useToast();
  const [user, setuser] = useState("");
  const [loading, setloading] = useState(false);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (user.trim() === "") {
      return toast({
        title: `Error`,
        description: "Fill the input",
      });
    }
    setloading(true);
    addUser(user)
      .then((data) => {
        setloading(false);
        if (!data) {
          return toast({
            title: `Sorry, ${user}`,
            description: "There's an error on server",
          });
        }
        if (data.length > 0) {
          setuser("");
          toast({
            title: `Thanks!, ${user}`,
            description: "You were added by our bots",
          });
        } else if (data.length === 0) {
          setuser("");
          toast({
            title: `We can't add you ${user}`,
            description: "You have already been added by our bots",
          });
        }
      })
      .catch((error) => {
        setloading(false);
        toast({
          title: `Sorry, ${user}`,
          description: "There's an error on server",
        });
        console.error("Error:", error);
      });
  };
  return (
    <form onSubmit={handleAddUser} className="flex mt-2 sm:flex-row flex-col">
      <Input
        value={user}
        onChange={(e) => setuser(e.target.value)}
        disabled={loading}
        className="sm:w-8/12"
        placeholder="Fortnite account name"
      />
      <Button
        type="submit"
        variant="secondary"
        className="sm:flex-1 mt-2 sm:mt-0 sm:ml-2"
        disabled={loading}
      >
        {loading ? (
          <svg
            className={`animate-spin mr-1 h-5 w-5 text-white`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          "Add"
        )}
      </Button>
    </form>
  );
};

export default BotForm;
