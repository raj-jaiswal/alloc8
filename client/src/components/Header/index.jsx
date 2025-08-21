import { getName } from "@/lib/auth_utility";
import { User } from "lucide-react";
import { useMsal, AuthenticatedTemplate } from "@azure/msal-react";
import { useState, useEffect } from "react";
import { BrowserAuthError, InteractionRequiredAuthError } from "@azure/msal-browser";

function Header({ name }) {
  return (
      <div className="w-screen h-[60px] leading-[60px] py-2 px-5 bg-slate-100 relative">
        <img src="/logo.png" className="h-[30px] my-[5px]" alt="Alloc8" />
        <div className="flexbox absolute right-5 top-0 h-[60px] w-auto capitalize">
          <AuthenticatedTemplate>
            <div>{name}</div>
          </AuthenticatedTemplate>
          <div className="avatar">
            <User></User>
          </div>
        </div>
      </div>
  );
}
export default Header;
/* vi: set et sw=2: */
