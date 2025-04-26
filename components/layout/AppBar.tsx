"use client";
import { Menubar, MenubarMenu, MenubarTrigger } from "@radix-ui/react-menubar";
import MediumButton from "../ui/mediumbutton";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js"; 
import { useState, useEffect } from "react";

export default function AppBar() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  // Function to fetch the authenticated user
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (data.user) {
      setUser(data.user); // Store the authenticated user
    } else if (error) {
      console.error("Error fetching user:", error);
      setUser(null); 
    }
  };

  useEffect(() => {
    fetchUser(); // Fetch the user on component mount
  }, []);

  // Logout function
  const logOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      setUser(null); 
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-10 p-2 border-b" 
    style={{ backgroundColor: "green" }} // Custom Brown Color
    >
      <Menubar className="rounded-none border-none px-2 lg:px-4 flex justify-between items-center">
        <MenubarMenu>
        <a href="/protected">
          <MenubarTrigger>
            <p className="text-white text-xl font-bold">Health Information System</p>
          </MenubarTrigger>
        </a>
        </MenubarMenu>
        <div>
          {user ? (
            <div className="flex gap-5 -ml-20">
              <a href="/profile">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.user_metadata?.picture || ""} />
                  <AvatarFallback>
                    {user.user_metadata?.full_name?.slice(0, 1) || "U"}
                  </AvatarFallback>
                </Avatar>
              </a>
              <MediumButton onClick={logOutUser}>Log out</MediumButton>
            </div>
          ) : (
            <a href="/sign-up">
              <MediumButton>Sign Up</MediumButton>
            </a>
          )}
        </div>
      </Menubar>
    </div>
  );
}
